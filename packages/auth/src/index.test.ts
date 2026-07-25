import { generateKeyPair, SignJWT } from "jose";
import { describe, expect, it, vi } from "vitest";
import {
  AppRole,
  hasPermission,
  Permission,
  provisionSessionUser,
} from "./authorization";
import type { OidcConfig, UserAdministrationPort } from "./index";
import {
  createJwtAccessTokenVerifier,
  createOidcAuth,
  createUserAdministration,
  parseBearerToken,
} from "./index";

const config: OidcConfig = {
  id: "primary",
  issuer: "https://idp.example.com",
  audience: ["example-api"],
  algorithms: ["RS256"],
};
const expectedAudience = "example-api";

async function signedAccessToken(
  overrides: {
    issuer?: string;
    audience?: string;
    subject?: string;
    expiration?: string | number;
  } = {},
) {
  const { privateKey, publicKey } = await generateKeyPair("RS256");
  const token = await new SignJWT({
    name: "Example User",
    email: "user@example.com",
  })
    .setProtectedHeader({ alg: "RS256", kid: "test-key" })
    .setIssuer(overrides.issuer ?? config.issuer)
    .setAudience(overrides.audience ?? expectedAudience)
    .setSubject(overrides.subject ?? "user-123")
    .setIssuedAt()
    .setExpirationTime(overrides.expiration ?? "5m")
    .sign(privateKey);

  return { token, publicKey };
}

describe("parseBearerToken", () => {
  it("parses a case-insensitive Bearer scheme", () => {
    expect(
      parseBearerToken(new Headers({ Authorization: "bearer access-token" })),
    ).toBe("access-token");
  });

  it("rejects missing and malformed authorization headers", () => {
    expect(parseBearerToken(new Headers())).toBeNull();
    expect(
      parseBearerToken(new Headers({ Authorization: "Basic credentials" })),
    ).toBeNull();
    expect(
      parseBearerToken(new Headers({ Authorization: "Bearer one two" })),
    ).toBeNull();
  });
});

describe("OIDC access token verification", () => {
  it("validates signature, issuer, audience, expiry, and subject", async () => {
    const { token, publicKey } = await signedAccessToken();
    const verifier = createJwtAccessTokenVerifier(
      config,
      async () => publicKey,
    );

    await expect(verifier(token)).resolves.toMatchObject({
      sub: "user-123",
      iss: config.issuer,
      aud: expectedAudience,
    });
  });

  it("rejects a token for another audience", async () => {
    const { token, publicKey } = await signedAccessToken({
      audience: "another-api",
    });
    const verifier = createJwtAccessTokenVerifier(
      config,
      async () => publicKey,
    );
    const auth = createOidcAuth(verifier);

    await expect(
      auth.getSession({
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      }),
    ).resolves.toBeNull();
  });

  it("rejects an expired token", async () => {
    const { token, publicKey } = await signedAccessToken({
      expiration: Math.floor(Date.now() / 1000) - 60,
    });
    const auth = createOidcAuth(
      createJwtAccessTokenVerifier(config, async () => publicKey),
    );
    await expect(
      auth.getSession({
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      }),
    ).resolves.toBeNull();
  });

  it("maps validated OIDC claims to the application session", async () => {
    const { token, publicKey } = await signedAccessToken();
    const auth = createOidcAuth(
      createJwtAccessTokenVerifier(config, async () => publicKey),
    );

    await expect(
      auth.getSession({
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      }),
    ).resolves.toMatchObject({
      user: {
        id: "user-123",
        name: "Example User",
        email: "user@example.com",
      },
    });
  });

  it("propagates provider availability failures", async () => {
    const auth = createOidcAuth(async () => {
      throw new Error("discovery unavailable");
    });

    await expect(
      auth.getSession({
        headers: new Headers({ Authorization: "Bearer token" }),
      }),
    ).rejects.toThrow("discovery unavailable");
  });
});

describe("application authorization", () => {
  it("provisions an internal user and evaluates role permissions", async () => {
    const session = await provisionSessionUser(
      {
        provision: async (input) => ({
          ...input,
          id: "internal-user-id",
          roles: [AppRole.VIEWER],
        }),
      },
      {
        user: {
          id: "subject-1",
          issuer: config.issuer,
          subject: "subject-1",
          name: "Example User",
          email: "user@example.com",
          roles: [],
        },
        claims: { sub: "subject-1", iss: config.issuer },
      },
    );

    expect(session.user.id).toBe("internal-user-id");
    expect(hasPermission(session.user.roles, Permission.POST_READ)).toBe(true);
    expect(hasPermission(session.user.roles, Permission.POST_WRITE)).toBe(
      false,
    );
  });

  it("updates user roles through the administration port", async () => {
    const setRoles = vi.fn(async (userId: string, roles: AppRole[]) => ({
      createdAt: new Date(),
      email: "member@example.com",
      id: userId,
      lastLoginAt: new Date(),
      name: "Member",
      roles,
    }));
    const port: UserAdministrationPort = {
      list: async () => [],
      setRoles,
    };
    const administration = createUserAdministration(port, {
      actorUserId: "admin-id",
    });

    await expect(
      administration.updateRoles("member-id", [AppRole.MEMBER, AppRole.MEMBER]),
    ).resolves.toMatchObject({ roles: [AppRole.MEMBER] });
    expect(setRoles).toHaveBeenCalledWith("member-id", [AppRole.MEMBER]);
  });

  it("prevents empty roles and administrator self-demotion", async () => {
    const port: UserAdministrationPort = {
      list: async () => [],
      setRoles: async () => undefined,
    };
    const administration = createUserAdministration(port, {
      actorUserId: "admin-id",
    });

    await expect(administration.updateRoles("member-id", [])).rejects.toThrow(
      "At least one role is required",
    );
    await expect(
      administration.updateRoles("admin-id", [AppRole.MEMBER]),
    ).rejects.toThrow("cannot remove their own admin role");
  });
});
