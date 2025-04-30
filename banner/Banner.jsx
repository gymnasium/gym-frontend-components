import React from 'react';
import { htmlDecode } from '../helpers';
import dompurify from 'dompurify';
import { useData } from '../livedata/DataContext';

function Banner() {
  const { data, loading, error } = useData();

  // if (loading) {
  //   console.log(`Loading JSON data.`);
  // }

  if (error) {
    console.error(`Error: ${error.message}`);
  }

  // if (!data) {
  //   console.warn(`No data available.`);
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
