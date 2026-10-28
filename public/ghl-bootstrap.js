/* Runs synchronously before Meta/GA: strips ?alcid and, on live public pages only, stores the shared
   GHL attribution cookie (analytics attribution only, never auth). Must stay a tiny classic script. */
(function (window, document, history) {
  try {
    var url = new URL(window.location.href);
    if (!url.searchParams.has("alcid")) return;
    var id = url.searchParams.get("alcid") || "";
    var host = url.hostname.toLowerCase();
    var live = host === "altowhisky.com" || host === "www.altowhisky.com";
    if (!live) return;
    var path = url.pathname;
    var blocked = ["/portal", "/admin", "/invoice", "/auth", "/checkout", "/login", "/signup"].some(function (p) {
      return path === p || path.indexOf(p + "/") === 0;
    });
    url.searchParams.delete("alcid");
    try { history.replaceState(history.state, "", url.pathname + url.search + url.hash); } catch (e) {}
    if (blocked || !/^[A-Za-z0-9]{20}$/.test(id)) return;
    var expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    document.cookie = "alto_ghl_contact_v1=" + encodeURIComponent(JSON.stringify({ contactId: id, expiresAt: expiresAt })) +
      "; Expires=" + new Date(expiresAt).toUTCString() + "; Domain=altowhisky.com; Path=/; Secure; SameSite=Lax";
  } catch (e) { /* Attribution must never block the page. */ }
})(window, document, window.history);
