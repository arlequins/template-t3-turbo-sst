// TOD: implement client auth
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = "dummy-token";
  return token && token.length > 0 ? token : null;
}
