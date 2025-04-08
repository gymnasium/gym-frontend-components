import React, { useState, useEffect } from 'react';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { htmlDecode } from '../helpers';
import dompurify from 'dompurify';

ensureConfig(['STATIC_ASSETS_URL'], 'Banner');

const STATIC_ASSETS_URL = () => getConfig().STATIC_ASSETS_URL;
const API_ENDPOINT = () => `${STATIC_ASSETS_URL()}/api/config.json`;

function Banner() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(API_ENDPOINT());
        if (!response.ok) {
          setError(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading data…</p>;
  }

  if (error) {
    console.error(`Error: ${error.message}`);
  }
  
  const showBanner = data && data?.msg?.banner?.active && data?.msg?.banner?.content;
  const banner = data?.msg?.banner?.content && htmlDecode(data?.msg?.banner?.content);
  const bannerClasses = data?.msg?.banner?.class ? ' ' + data?.msg?.banner?.class : '';
  const sanitizedBanner = data?.msg?.banner?.content && { __html: dompurify.sanitize(banner) };

  return (
    showBanner &&
    <aside id="site-status" className={`site-status` + bannerClasses}>
      <div className="container" dangerouslySetInnerHTML={ sanitizedBanner } />
    </aside>
  );
}

export default Banner;
