
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords = "digital wallpaper, retro wallpaper, 4K background, phone wallpaper, laptop wallpaper, minimalist, art",
  image, 
  url,
  type = 'website'
}) => {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Helper to set meta tags
    const setMeta = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        // Fix: Remove unused variable 'attr' by skipping the first destructured element
        const [, value] = selector.split(/[=\]]/).filter(Boolean)[0].split('[');
        const attributeValue = selector.split('=')[1].replace(/['"\]]/g, '');
        
        element.setAttribute(value, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    setMeta('meta[name="description"]', description);
    setMeta('meta[name="keywords"]', keywords);

    // Open Graph
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:type"]', type);
    if (image) setMeta('meta[property="og:image"]', image);
    if (url) setMeta('meta[property="og:url"]', url || window.location.href);

    // Twitter
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    if (image) setMeta('meta[name="twitter:image"]', image);

    // Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', url || window.location.href);

  }, [title, description, keywords, image, url, type]);

  return null;
};
