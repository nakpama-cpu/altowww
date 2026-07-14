import { useEffect, useState } from "react";

const DESKTOP_PAGE_SIZE = 9;
const TABLET_MOBILE_PAGE_SIZE = 8;

export function usePageSize() {
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window === "undefined") return DESKTOP_PAGE_SIZE;
    return window.innerWidth >= 1024 ? DESKTOP_PAGE_SIZE : TABLET_MOBILE_PAGE_SIZE;
  });

  useEffect(() => {
    const update = () => {
      setPageSize(window.innerWidth >= 1024 ? DESKTOP_PAGE_SIZE : TABLET_MOBILE_PAGE_SIZE);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);


  return pageSize;
}
