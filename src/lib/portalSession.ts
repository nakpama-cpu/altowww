export const PORTAL_LAST_VISIT_KEY = "alto:lastPortalVisit";
export const PORTAL_REAUTH_WINDOW_MS = 15 * 60 * 1000;

export const markPortalVisit = () => {
  try {
    localStorage.setItem(PORTAL_LAST_VISIT_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
};

export const clearPortalVisit = () => {
  try {
    localStorage.removeItem(PORTAL_LAST_VISIT_KEY);
  } catch {
    /* ignore */
  }
};

export const isPortalSessionFresh = () => {
  try {
    const raw = localStorage.getItem(PORTAL_LAST_VISIT_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    return Number.isFinite(ts) && Date.now() - ts < PORTAL_REAUTH_WINDOW_MS;
  } catch {
    return false;
  }
};
