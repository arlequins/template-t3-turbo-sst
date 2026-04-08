// TOD: implement client auth
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return "dummy-token";
}
