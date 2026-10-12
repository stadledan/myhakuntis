export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Untis-Session, X-Untis-School, X-Untis-Path, X-Untis-Method, X-Untis-Auth",
      "Access-Control-Max-Age": "86400",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET" && !request.headers.get("X-Untis-Path"))
      return new Response("WebUntis-Proxy v4 laeuft.", { headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" } });
    try {
      const school = request.headers.get("X-Untis-School") || "hakwels";
      const session = request.headers.get("X-Untis-Session") || "";
      const auth = request.headers.get("X-Untis-Auth") || "";
      const path = request.headers.get("X-Untis-Path") || ("/WebUntis/jsonrpc.do?school=" + encodeURIComponent(school));
      const method = (request.headers.get("X-Untis-Method") || "POST").toUpperCase();
      const payload = await request.text();
      const target = `https://${school}.webuntis.com${path}`;
      const headers = { "User-Agent": "Stundenplan-App", "Accept": "application/json" };
      if (method !== "GET" && method !== "HEAD") headers["Content-Type"] = "application/json";
      if (session) headers["Cookie"] = `JSESSIONID=${session}; schoolname="${school}"`;
      if (auth) headers["Authorization"] = auth;
      const opts = { method, headers };
      if (method !== "GET" && method !== "HEAD") opts.body = payload;
      const upstream = await fetch(target, opts);
      const text = await upstream.text();
      let newSession = "", cookies = [];
      if (typeof upstream.headers.getSetCookie === "function") cookies = upstream.headers.getSetCookie();
      else { const sc = upstream.headers.get("set-cookie"); if (sc) cookies = [sc]; }
      for (const c of cookies) { const m = c.match(/JSESSIONID=([^;]+)/); if (m) { newSession = m[1]; break; } }
      let parsed; try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
      return new Response(JSON.stringify({ ok: true, data: parsed, session: newSession }),
        { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: String(err) }),
        { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
    }
  },
};