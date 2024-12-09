import React from 'react';
import PropTypes from 'prop-types';

import { reduxHooks } from 'hooks';

import CourseBanner from '@src/containers/CourseCard/components/CourseCardBanners/CourseBanner';
import CertificateBanner from './CertificateBanner';
import CreditBanner from '@src/containers/CourseCard/components/CourseCardBanners/CreditBanner';
import EntitlementBanner from '@src/containers/CourseCard/components/CourseCardBanners/EntitlementBanner';
import RelatedProgramsBanner from '@src/containers/CourseCard/components/CourseCardBanners/RelatedProgramsBanner';

export const CourseCardBanners = ({ cardId }) => {
  const { isEnrolled } = reduxHooks.useCardEnrollmentData(cardId);
  return (
    <div className="course-card-banners" data-testid="CourseCardBanners">
      <RelatedProgramsBanner cardId={cardId} />
      <CourseBanner cardId={cardId} />
      <EntitlementBanner cardId={cardId} />
      {isEnrolled && <CertificateBanner cardId={cardId} />}
      {isEnrolled && <CreditBanner cardId={cardId} />}
    </div>
  );
};
CourseCardBanners.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCardBanners;
