import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const socialLinkClass = "p-2 border-2 border-retro-black dark:border-white hover:bg-retro-orange hover:text-white hover:border-retro-black dark:hover:border-white transition-all hover:-translate-y-1 hover:shadow-retro-sm text-retro-black dark:text-white";
  const footerLinkClass = "hover:text-retro-orange transition-colors uppercase w-fit";

  return (
    <footer 
      ref={footerRef}
      className={`
        w-full mt-24 border-t-2 border-retro-black dark:border-white bg-retro-bg dark:bg-retro-black text-retro-black dark:text-white
        transition-all duration-1000 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
      `}
    >
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
                 <Link to="/" className="flex items-center gap-2 group w-fit">
                    <div className="w-5 h-5 bg-retro-orange border-2 border-retro-black dark:border-white group-hover:rotate-45 transition-transform"></div>
                    <span className="text-3xl tracking-tighter font-bold">VYRIC</span>
                </Link>
                <p className="text-sm opacity-70 leading-relaxed font-mono">
                    Premium high res digital assets you will find nowhere else.
                    <br/>
                    <span className="opacity-50 mt-2 block">System Status: OPERATIONAL</span>
                </p>
            </div>

            {/* Navigation Column */}
            <div className="col-span-1">
                <h3 className="text-lg font-bold uppercase mb-4 border-b-2 border-retro-black dark:border-white w-fit pr-4">System</h3>
                <nav className="flex flex-col gap-2 text-sm font-mono">
                    <Link to="/" className={footerLinkClass}>[ Home_Base ]</Link>
                    <Link to="/" className={footerLinkClass}>[ Archives ]</Link>
                    <span className={`${footerLinkClass} opacity-50 cursor-not-allowed`}>[ Changelog ]</span>
                    <span className={`${footerLinkClass} opacity-50 cursor-not-allowed`}>[ Roadmap ]</span>
                </nav>
            </div>

            {/* Legal Column */}
            <div className="col-span-1">
                <h3 className="text-lg font-bold uppercase mb-4 border-b-2 border-retro-black dark:border-white w-fit pr-4">Protocols</h3>
                <nav className="flex flex-col gap-2 text-sm font-mono">
                    <span className={`${footerLinkClass} cursor-pointer`}>Terms_of_Use</span>
                    <span className={`${footerLinkClass} cursor-pointer`}>Privacy_Policy</span>
                    <span className={`${footerLinkClass} cursor-pointer`}>Licensing</span>
                </nav>
            </div>

             {/* Socials Column */}
             <div className="col-span-1">
                 <h3 className="text-lg font-bold uppercase mb-4 border-b-2 border-retro-black dark:border-white w-fit pr-4">Network</h3>
                 <div className="flex items-center gap-3">
                    {/* Instagram */}
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={socialLinkClass} aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>

                    {/* TikTok */}
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className={socialLinkClass} aria-label="TikTok">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                        </svg>
                    </a>

                    {/* Reddit */}
                    <a href="https://reddit.com" target="_blank" rel="noopener noreferrer" className={socialLinkClass} aria-label="Reddit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M17 13c0 2-3 3-3 3s-3-1-3-3"></path>
                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        </svg>
                    </a>
                 </div>
             </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full border-t-2 border-retro-black dark:border-white bg-retro-dim dark:bg-black p-4">
             <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono uppercase opacity-60">
                <span>&copy; {new Date().getFullYear()} VYRIC OPERATING SYSTEM</span>
                
                {/* Static Broxgit text */}
                <span className="tracking-wide">Made with ❤️ by Broxgit</span>
             </div>
        </div>
    </footer>
  );
};