/** `Access-Control-Allow-Origin: *` for arbitrary fetch handlers. */
export function corsPreflightHeaders(req: Request): Headers {
  const h = new Headers();
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  h.set(
    "Access-Control-Allow-Headers",
    req.headers.get("Access-Control-Request-Headers") ?? "*",
  );
  h.set("Access-Control-Max-Age", "86400");
  return h;
}

export function corsPreflightResponse(req: Request): Response {
  return new Response(null, {
    status: 204,
    headers: corsPreflightHeaders(req),
  });
}

export function withCors(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}
