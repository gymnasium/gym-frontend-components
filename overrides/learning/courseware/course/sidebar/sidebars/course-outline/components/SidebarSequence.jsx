import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import courseOutlineMessages from '@src/course-home/outline-tab/messages';
import { getCourseOutline, getSequenceId } from '@src/courseware/data/selectors';
import CompletionIcon from '@src/courseware/course/sidebar/sidebars/course-outline/components/CompletionIcon';
import SidebarUnit from '@src/courseware/course/sidebar/sidebars/course-outline/components/SidebarUnit';
import { UNIT_ICON_TYPES } from '@src/courseware/course/sidebar/sidebars/course-outline/components/UnitIcon';

const SidebarSequence = ({
  intl,
  courseId,
  sequence,
  activeUnitId,
}) => {
  const {
    id,
    complete,
    title,
    specialExamInfo,
    unitIds,
    type,
    completionStat,
  } = sequence;

  const { units = {} } = useSelector(getCourseOutline);

  const sectionTitle = (
    <>
      <div className="col-auto p-0" style={{ fontSize: '1.1rem' }}>
        <CompletionIcon completionStat={completionStat} />
      </div>
      <div className="col-9 d-flex flex-column flex-grow-1 ml-3 mr-auto p-0 text-left">
        <span className="align-middle text-dark-500">{title}</span>
        {specialExamInfo && <span className="align-middle small text-muted">{specialExamInfo}</span>}
        <span className="sr-only">
          , {intl.formatMessage(complete
          ? courseOutlineMessages.completedAssignment
          : courseOutlineMessages.incompleteAssignment)}
        </span>
      </div>
    </>
  );

  return (
    <>
      {unitIds.map((unitId, index) => (
        <SidebarUnit
          key={unitId}
          id={unitId}
          courseId={courseId}
          sequenceId={id}
          unit={units[unitId]}
          isActive={activeUnitId === unitId}
          activeUnitId={activeUnitId}
          isFirst={index === 0}
          isLocked={type === UNIT_ICON_TYPES.lock}
        />
      ))}
    </>
  );
};

SidebarSequence.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  sequence: PropTypes.shape({
    complete: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    specialExamInfo: PropTypes.string,
    unitIds: PropTypes.arrayOf(PropTypes.string),
    completionStat: PropTypes.shape({
      completed: PropTypes.number,
      total: PropTypes.number,
    }),
  }).isRequired,
  activeUnitId: PropTypes.string.isRequired,
};

export default injectIntl(SidebarSequence);
