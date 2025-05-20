import React from 'react';
import { htmlDecode } from '../helpers';
import dompurify from 'dompurify';
import { useData } from '../data/DataContext';

function Banner() {
  const { data, loading, error } = useData();

  // if (loading) {
  //   console.log(`loading…`);
  // }

  if (error) {
    console.warn(`Error: ${error.message}`);
  }

  // if (!data) {
  //   console.warn(`no data…`);
  // }

  if (data) {

    const showBanner = data && data?.msg?.banner?.active && data?.msg?.banner?.content;
    const banner = data?.msg?.banner?.content && htmlDecode(data?.msg?.banner?.content);
    const bannerClasses = data?.msg?.banner?.class ? ' ' + data?.msg?.banner?.class : '';
    const sanitizedBanner = data?.msg?.banner?.content && { __html: dompurify.sanitize(banner) };

    return showBanner && (
      <aside id="system-status" className={`system-status` + bannerClasses}>
        <div className="container" dangerouslySetInnerHTML={ sanitizedBanner } />
      </aside>
    );

  } else {
    return null;
  }
}

export default Banner;
