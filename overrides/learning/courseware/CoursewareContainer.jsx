import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { defaultMemoize as memoize } from 'reselect';

import {
  checkBlockCompletion,
  fetchCourse,
  fetchSequence,
  getResumeBlock,
  getSequenceForUnitDeprecated,
  saveSequencePosition,
} from '@src/courseware/data';
import { TabPage } from '../tab-page';

import Course from './course';
import { handleNextSectionCelebration } from '@src/courseware/course/celebration';
import withParamsAndNavigation from '@src/courseware/utils';

// Look at where this is called in componentDidUpdate for more info about its usage
const checkResumeRedirect = memoize((courseStatus, courseId, sequenceId, firstSequenceId, navigate) => {
  if (courseStatus === 'loaded' && !sequenceId) {
    // Note that getResumeBlock is just an API call, not a redux thunk.
    getResumeBlock(courseId).then((data) => {
      // This is a replace because we don't want this change saved in the browser's history.
      if (data.sectionId && data.unitId) {
        navigate(`/course/${courseId}/${data.sectionId}/${data.unitId}`, { replace: true });
      } else if (firstSequenceId) {
        navigate(`/course/${courseId}/${firstSequenceId}`, { replace: true });
      }
    });
  }
});

// Look at where this is called in componentDidUpdate for more info about its usage
const checkSectionUnitToUnitRedirect = memoize((courseStatus, courseId, sequenceStatus, section, unitId, navigate) => {
  if (courseStatus === 'loaded' && sequenceStatus === 'failed' && section && unitId) {
    navigate(`/course/${courseId}/${unitId}`, { replace: true });
  }
});

// Look at where this is called in componentDidUpdate for more info about its usage
const checkSectionToSequenceRedirect = memoize((courseStatus, courseId, sequenceStatus, section, unitId, navigate) => {
  if (courseStatus === 'loaded' && sequenceStatus === 'failed' && section && !unitId) {
    // If the section is non-empty, redirect to its first sequence.
    if (section.sequenceIds && section.sequenceIds[0]) {
      navigate(`/course/${courseId}/${section.sequenceIds[0]}`, { replace: true });
    // Otherwise, just go to the course root, letting the resume redirect take care of things.
    } else {
      navigate(`/course/${courseId}`, { replace: true });
    }
  }
});

// Look at where this is called in componentDidUpdate for more info about its usage
const checkUnitToSequenceUnitRedirect = memoize(
  (courseStatus, courseId, sequenceStatus, sequenceMightBeUnit, sequenceId, section, routeUnitId, navigate) => {
    if (courseStatus === 'loaded' && sequenceStatus === 'failed' && !section && !routeUnitId) {
      if (sequenceMightBeUnit) {
        // If the sequence failed to load as a sequence, but it is marked as a possible unit, then
        // we need to look up the correct parent sequence for it, and redirect there.
        const unitId = sequenceId; // just for clarity during the rest of this method
        getSequenceForUnitDeprecated(courseId, unitId).then(
          parentId => {
            if (parentId) {
              navigate(`/course/${courseId}/${parentId}/${unitId}`, { replace: true });
            } else {
              navigate(`/course/${courseId}`, { replace: true });
            }
          },
          () => { // error case
            navigate(`/course/${courseId}`, { replace: true });
          },
        );
      } else {
        // Invalid sequence that isn't a unit either. Redirect up to main course.
        navigate(`/course/${courseId}`, { replace: true });
      }
    }
  },
);

// Look at where this is called in componentDidUpdate for more info about its usage
const checkSequenceToSequenceUnitRedirect = memoize((courseId, sequenceStatus, sequence, unitId, navigate) => {
  if (sequenceStatus === 'loaded' && sequence.id && !unitId) {
    if (sequence.unitIds !== undefined && sequence.unitIds.length > 0) {
      const nextUnitId = sequence.unitIds[sequence.activeUnitIndex];
      // This is a replace because we don't want this change saved in the browser's history.
      navigate(`/course/${courseId}/${sequence.id}/${nextUnitId}`, { replace: true });
    }
  }
});

// Look at where this is called in componentDidUpdate for more info about its usage
const checkSequenceUnitMarkerToSequenceUnitRedirect = memoize(
  (courseId, sequenceStatus, sequence, unitId, navigate) => {
    if (sequenceStatus !== 'loaded' || !sequence.id) {
      return;
    }

    const hasUnits = sequence.unitIds?.length > 0;

    if (unitId === 'first') {
      if (hasUnits) {
        const firstUnitId = sequence.unitIds[0];
        navigate(`/course/${courseId}/${sequence.id}/${firstUnitId}`, { replace: true });
      } else {
      // No units... go to general sequence page
        navigate(`/course/${courseId}/${sequence.id}`, { replace: true });
      }
    } else if (unitId === 'last') {
      if (hasUnits) {
        const lastUnitId = sequence.unitIds[sequence.unitIds.length - 1];
        navigate(`/course/${courseId}/${sequence.id}/${lastUnitId}`, { replace: true });
      } else {
      // No units... go to general sequence page
        navigate(`/course/${courseId}/${sequence.id}`, { replace: true });
      }
    }
  },
);

class CoursewareContainer extends Component {
  checkSaveSequencePosition = memoize((unitId) => {
    const {
      courseId,
      sequenceId,
      sequenceStatus,
      sequence,
    } = this.props;
    if (sequenceStatus === 'loaded' && sequence.saveUnitPosition && unitId) {
      const activeUnitIndex = sequence.unitIds.indexOf(unitId);
      this.props.saveSequencePosition(courseId, sequenceId, activeUnitIndex);
    }
  });

  checkFetchCourse = memoize((courseId) => {
    this.props.fetchCourse(courseId);
  });

  checkFetchSequence = memoize((sequenceId) => {
    if (sequenceId) {
      this.props.fetchSequence(sequenceId);
    }
  });

  componentDidMount() {
    const {
      routeCourseId,
      routeSequenceId,
    } = this.props;
    // Load data whenever the course or sequence ID changes.
    this.checkFetchCourse(routeCourseId);
    this.checkFetchSequence(routeSequenceId);
  }

  componentDidUpdate() {
    const {
      courseId,
      sequenceId,
      courseStatus,
      sequenceStatus,
      sequenceMightBeUnit,
      sequence,
      firstSequenceId,
      sectionViaSequenceId,
      routeCourseId,
      routeSequenceId,
      routeUnitId,
      navigate,
    } = this.props;

    // Load data whenever the course or sequence ID changes.
    this.checkFetchCourse(routeCourseId);
    this.checkFetchSequence(routeSequenceId);

    // Check if we should save our sequence position.  Only do this when the route unit ID changes.
    this.checkSaveSequencePosition(routeUnitId);

    // Coerce the route ids into null here because they can be undefined, but the redux ids would be null instead.
    if (courseId !== (routeCourseId || null) || sequenceId !== (routeSequenceId || null)) {
      // The non-route ids are pulled from redux state - they are changed at the same time as the status variables.
      // But the route ids are pulled directly from the route. So if the route changes, and we start a fetch above,
      // there's a race condition where the route ids are for one course, but the status and the other ids are for a
      // different course. Since all the logic below depends on the status variables and the route unit id, we'll wait
      // until the ids match and thus the redux states got updated. So just bail for now.
      return;
    }

    // All courseware URLs should normalize to the format /course/:courseId/:sequenceId/:unitId
    // via the series of redirection rules below.
    // See docs/decisions/0008-liberal-courseware-path-handling.md for more context.
    // (It would be ideal to move this logic into the thunks layer and perform
    //  all URL-changing checks at once. See TNL-8182.)

    // Check resume redirect:
    //   /course/:courseId -> /course/:courseId/:sequenceId/:unitId
    // based on sequence/unit where user was last active.
    checkResumeRedirect(courseStatus, courseId, sequenceId, firstSequenceId, navigate);

    // Check section-unit to unit redirect:
    //    /course/:courseId/:sectionId/:unitId -> /course/:courseId/:unitId
    // by simply ignoring the :sectionId.
    // (It may be desirable at some point to be smarter here; for example, we could replace
    //  :sectionId with the parent sequence of :unitId and/or check whether the :unitId
    //  is actually within :sectionId. However, the way our Redux store is currently factored,
    //  the unit's metadata is not available to us if the section isn't loadable.)
    // Before performing this redirect, we *do* still check that a section is loadable;
    // otherwise, we could get stuck in a redirect loop, since a sequence that failed to load
    // would endlessly redirect to itself through `checkSectionUnitToUnitRedirect`
    // and `checkUnitToSequenceUnitRedirect`.
    checkSectionUnitToUnitRedirect(courseStatus, courseId, sequenceStatus, sectionViaSequenceId, routeUnitId, navigate);

    // Check section to sequence redirect:
    //    /course/:courseId/:sectionId         -> /course/:courseId/:sequenceId
    // by redirecting to the first sequence within the section.
    checkSectionToSequenceRedirect(courseStatus, courseId, sequenceStatus, sectionViaSequenceId, routeUnitId, navigate);

    // Check unit to sequence-unit redirect:
    //    /course/:courseId/:unitId -> /course/:courseId/:sequenceId/:unitId
    // by filling in the ID of the parent sequence of :unitId.
    checkUnitToSequenceUnitRedirect((
      courseStatus, courseId, sequenceStatus, sequenceMightBeUnit,
      sequenceId, sectionViaSequenceId, routeUnitId, navigate
    ));

    // Check sequence to sequence-unit redirect:
    //    /course/:courseId/:sequenceId -> /course/:courseId/:sequenceId/:unitId
    // by filling in the ID the most-recently-active unit in the sequence, OR
    // the ID of the first unit the sequence if none is active.
    checkSequenceToSequenceUnitRedirect(courseId, sequenceStatus, sequence, routeUnitId, navigate);

    // Check sequence-unit marker to sequence-unit redirect:
    //    /course/:courseId/:sequenceId/first -> /course/:courseId/:sequenceId/:unitId
    //    /course/:courseId/:sequenceId/last -> /course/:courseId/:sequenceId/:unitId
    // by filling in the ID the first or last unit in the sequence.
    // "Sequence unit marker" is an invented term used only in this component.
    checkSequenceUnitMarkerToSequenceUnitRedirect(courseId, sequenceStatus, sequence, routeUnitId, navigate);
  }

  handleUnitNavigationClick = () => {
    const {
      courseId,
      sequenceId,
      routeUnitId,
    } = this.props;

    this.props.checkBlockCompletion(courseId, sequenceId, routeUnitId);
  };

  handleNextSequenceClick = () => {
    const {
      course,
      nextSequence,
      sequence,
      sequenceId,
    } = this.props;

    if (nextSequence !== null) {
      const celebrateFirstSection = course && course.celebrations && course.celebrations.firstSection;
      if (celebrateFirstSection && sequence.sectionId !== nextSequence.sectionId) {
        handleNextSectionCelebration(sequenceId, nextSequence.id);
      }
    }
  };

  handlePreviousSequenceClick = () => {};

  render() {
    const {
      courseStatus,
      courseId,
      sequenceId,
      routeUnitId,
    } = this.props;

    return (
      <TabPage
        activeTabSlug="courseware"
        courseId={courseId}
        unitId={routeUnitId}
        courseStatus={courseStatus}
        metadataModel="coursewareMeta"
      >
        <Course
          courseId={courseId}
          sequenceId={sequenceId}
          unitId={routeUnitId}
          nextSequenceHandler={this.handleNextSequenceClick}
          previousSequenceHandler={this.handlePreviousSequenceClick}
          unitNavigationHandler={this.handleUnitNavigationClick}
        />
      </TabPage>
    );
  }
}

const sequenceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  unitIds: PropTypes.arrayOf(PropTypes.string),
  sectionId: PropTypes.string,
  saveUnitPosition: PropTypes.any, // eslint-disable-line
});

const sectionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  sequenceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
});

const courseShape = PropTypes.shape({
  celebrations: PropTypes.shape({
    firstSection: PropTypes.bool,
  }),
});

CoursewareContainer.propTypes = {
  routeCourseId: PropTypes.string.isRequired,
  routeSequenceId: PropTypes.string,
  routeUnitId: PropTypes.string,
  courseId: PropTypes.string,
  sequenceId: PropTypes.string,
  firstSequenceId: PropTypes.string,
  courseStatus: PropTypes.oneOf(['loaded', 'loading', 'failed', 'denied']).isRequired,
  sequenceStatus: PropTypes.oneOf(['loaded', 'loading', 'failed']).isRequired,
  sequenceMightBeUnit: PropTypes.bool.isRequired,
  nextSequence: sequenceShape,
  previousSequence: sequenceShape,
  sectionViaSequenceId: sectionShape,
  course: courseShape,
  sequence: sequenceShape,
  saveSequencePosition: PropTypes.func.isRequired,
  checkBlockCompletion: PropTypes.func.isRequired,
  fetchCourse: PropTypes.func.isRequired,
  fetchSequence: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

CoursewareContainer.defaultProps = {
  courseId: null,
  sequenceId: null,
  routeSequenceId: null,
  routeUnitId: null,
  firstSequenceId: null,
  nextSequence: null,
  previousSequence: null,
  sectionViaSequenceId: null,
  course: null,
  sequence: null,
};

const currentCourseSelector = createSelector(
  (state) => state.models.coursewareMeta || {},
  (state) => state.courseware.courseId,
  (coursesById, courseId) => (coursesById[courseId] ? coursesById[courseId] : null),
);

const currentSequenceSelector = createSelector(
  (state) => state.models.sequences || {},
  (state) => state.courseware.sequenceId,
  (sequencesById, sequenceId) => (sequencesById[sequenceId] ? sequencesById[sequenceId] : null),
);

const sequenceIdsSelector = createSelector(
  (state) => state.courseware.courseStatus,
  currentCourseSelector,
  (state) => state.models.sections,
  (courseStatus, course, sectionsById) => {
    if (courseStatus !== 'loaded') {
      return [];
    }
    const { sectionIds = [] } = course;
    return sectionIds.flatMap(sectionId => sectionsById[sectionId].sequenceIds);
  },
);

const previousSequenceSelector = createSelector(
  sequenceIdsSelector,
  (state) => state.models.sequences || {},
  (state) => state.courseware.sequenceId,
  (sequenceIds, sequencesById, sequenceId) => {
    if (!sequenceId || sequenceIds.length === 0) {
      return null;
    }
    const sequenceIndex = sequenceIds.indexOf(sequenceId);
    const previousSequenceId = sequenceIndex > 0 ? sequenceIds[sequenceIndex - 1] : null;
    return previousSequenceId !== null ? sequencesById[previousSequenceId] : null;
  },
);

const nextSequenceSelector = createSelector(
  sequenceIdsSelector,
  (state) => state.models.sequences || {},
  (state) => state.courseware.sequenceId,
  (sequenceIds, sequencesById, sequenceId) => {
    if (!sequenceId || sequenceIds.length === 0) {
      return null;
    }
    const sequenceIndex = sequenceIds.indexOf(sequenceId);
    const nextSequenceId = sequenceIndex < sequenceIds.length - 1 ? sequenceIds[sequenceIndex + 1] : null;
    return nextSequenceId !== null ? sequencesById[nextSequenceId] : null;
  },
);

const firstSequenceIdSelector = createSelector(
  (state) => state.courseware.courseStatus,
  currentCourseSelector,
  (state) => state.models.sections || {},
  (courseStatus, course, sectionsById) => {
    if (courseStatus !== 'loaded') {
      return null;
    }
    const { sectionIds = [] } = course;

    if (sectionIds.length === 0) {
      return null;
    }

    return sectionsById[sectionIds[0]].sequenceIds[0];
  },
);

const sectionViaSequenceIdSelector = createSelector(
  (state) => state.models.sections || {},
  (state) => state.courseware.sequenceId,
  (sectionsById, sequenceId) => (sectionsById[sequenceId] ? sectionsById[sequenceId] : null),
);

const mapStateToProps = (state) => {
  const {
    courseId,
    sequenceId,
    courseStatus,
    sequenceStatus,
    sequenceMightBeUnit,
  } = state.courseware;

  return {
    courseId,
    sequenceId,
    courseStatus,
    sequenceStatus,
    sequenceMightBeUnit,
    course: currentCourseSelector(state),
    sequence: currentSequenceSelector(state),
    previousSequence: previousSequenceSelector(state),
    nextSequence: nextSequenceSelector(state),
    firstSequenceId: firstSequenceIdSelector(state),
    sectionViaSequenceId: sectionViaSequenceIdSelector(state),
  };
};

export default connect(mapStateToProps, {
  checkBlockCompletion,
  saveSequencePosition,
  fetchCourse,
  fetchSequence,
})(withParamsAndNavigation(CoursewareContainer));