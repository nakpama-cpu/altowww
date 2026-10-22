import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { disableTracking, resetPageViewDedupe, trackPageView } from "@/lib/analytics";

/** page_view tracking with no UI. Mounted only inside the public marketing layout. */
const AnalyticsTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => () => {
    disableTracking();
    resetPageViewDedupe();
  }, []);

  useEffect(() => {
    // Wait a tick so the page's <title> is set by Seo.
    const t = window.setTimeout(() => trackPageView(pathname), 50);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
};

export default AnalyticsTracker;
