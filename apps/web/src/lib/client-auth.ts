// TODO: implement client auth (e.g. session cookie or bearer from storage)
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return "dummy-token";
}
