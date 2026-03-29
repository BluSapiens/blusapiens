import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const MEASUREMENT_ID = "G-LS4SCRXWR0";

const Ga4PageTracker = () => {
  const location = useLocation();
  const hasTrackedInitialLoad = useRef(false);

  useEffect(() => {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (!gtag) return;

    // Initial pageview is already sent by the base tag in index.html.
    if (!hasTrackedInitialLoad.current) {
      hasTrackedInitialLoad.current = true;
      return;
    }

    gtag("config", MEASUREMENT_ID, {
      page_path: `${location.pathname}${location.search}${location.hash}`,
    });
  }, [location]);

  return null;
};

export default Ga4PageTracker;
