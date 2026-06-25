import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // If there's a hash (e.g., /about#team), scroll to that element
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        // Small delay to ensure element is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 0);
      }
    } 
    // If navigating to a new page (not just hash change), scroll to top
    else if (prevPathRef.current !== pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    
    prevPathRef.current = pathname;
  }, [pathname, hash]);

  return null;
}