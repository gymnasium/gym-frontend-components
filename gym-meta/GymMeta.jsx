import React from 'react';
import PropTypes from 'prop-types';
import { ensureConfig, getConfig } from '@edx/frontend-platform';

ensureConfig(['MARKETING_SITE_BASE_URL','SITE_NAME', 'GYM_META'], 'GymMeta');

const getBaseUrl = () => getConfig().MARKETING_SITE_BASE_URL;
const getMeta = () => getConfig().GYM_META;

const GymMeta = ({ 
  description,
  image,
  url
}) => {

  const metaDesc = description ? description : getMeta().description;
  const metaImg = image ? image : getMeta().og_img;
  const metaUrl = url ? url : getBaseUrl();

  return (
    <>
      <meta name="description" content={`${metaDesc}`} />
      <meta name="author" content={`${getMeta().author}`} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={`${getMeta().author}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={`${getMeta().twitter_handle}`} />
      <meta name="twitter:creator" content={`${getMeta().twitter_handle}`} />
      <meta name="twitter:url" property="og:url" content={`${metaUrl}`} />
      <meta name="twitter:title" property="og:title" content={`${getMeta().author}`} />
      <meta name="twitter:description" property="og:description" content={`${metaDesc}`} />
      <meta name="twitter:image" property="og:image" content={`${getBaseUrl()}${metaImg}`} />
      <meta name="twitter:image:alt" property="og:image:alt" content={`${getMeta().author}`} />
    </>
  );
};

GymMeta.propTypes = {
  description: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
};

GymMeta.defaultProps = {
  description: null,
  image: null,
  url: null,
};

export default GymMeta;
