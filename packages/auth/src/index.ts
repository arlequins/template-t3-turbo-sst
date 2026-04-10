// TODO: add user authentication logic
export type TRPCAuth = {
  getSession: (opts: { headers: Headers }) => Promise<{
    user: { id: string; name?: string | null };
  } | null>;
};

function parseBearerToken(headers: Headers): string | null {
  const raw = headers.get("authorization") ?? headers.get("Authorization");
  if (!raw) return null;
  const match = /^Bearer\s+(\S+)/i.exec(raw.trim());
  const token = match?.[1];
  return token && token.length > 0 ? token : null;
}

/**
 * Look up the user for this bearer token (e.g. API key / access token row in DB).
 * Replace the body with a real query when the schema exists.
 */
function findUserByBearerToken(
  token: string,
): Promise<{ id: string; name?: string | null } | null> {
  // Example once you have tables:
  // const row = await db.query.apiTokens.findFirst({
  //   where: and(
  //     eq(apiTokens.tokenHash, hashToken(token)),
  //     isNull(apiTokens.revokedAt),
  //   ),
  //   with: { user: true },
  // });
  // if (!row?.user) return null;
  // return { id: row.user.id, name: row.user.name };

  if (token) {
    return Promise.resolve({ id: "1", name: "dummy" });
  }
  return Promise.resolve(null);
}

export const authApi: TRPCAuth = {
  getSession: async ({ headers }: { headers: Headers }) => {
    const token = parseBearerToken(headers);
    if (!token) return null;

    const user = await findUserByBearerToken(token);
    if (!user) return null;

    return { user };
  },
};
