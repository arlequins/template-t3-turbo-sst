import { serverEnv } from "@acme/env/server-env";
import type { JWTPayload, JWTVerifyGetKey } from "jose";
import { createRemoteJWKSet, errors, jwtVerify } from "jose";
import { z } from "zod/v4";

const supportedAlgorithms = [
  "RS256",
  "RS384",
  "RS512",
  "PS256",
  "PS384",
  "PS512",
  "ES256",
  "ES384",
  "ES512",
  "EdDSA",
] as const;

const oidcConfigSchema = z.object({
  issuer: z.url(),
  audience: z.array(z.string().min(1)).min(1),
  jwksUri: z.url().optional(),
  algorithms: z.array(z.enum(supportedAlgorithms)).min(1),
});

const discoveryDocumentSchema = z.object({
  issuer: z.url(),
  jwks_uri: z.url(),
});

export type OidcConfig = z.infer<typeof oidcConfigSchema>;

export type OidcClaims = JWTPayload & {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
};

export type AuthSession = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  claims: OidcClaims;
};

export type AccessTokenVerifier = (token: string) => Promise<OidcClaims>;

export type TRPCAuth = {
  getSession: (opts: { headers: Headers }) => Promise<AuthSession | null>;
};

function commaSeparatedValues(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function loadOidcConfig(): OidcConfig {
  return oidcConfigSchema.parse({
    issuer: serverEnv.OIDC_ISSUER_URL,
    audience: commaSeparatedValues(serverEnv.OIDC_AUDIENCE ?? ""),
    jwksUri: serverEnv.OIDC_JWKS_URI,
    algorithms: commaSeparatedValues(
      serverEnv.OIDC_ALLOWED_ALGORITHMS ?? "RS256",
    ),
  });
}

function discoveryUrl(issuer: string): URL {
  const url = new URL(issuer);
  url.pathname = `${url.pathname.replace(/\/$/, "")}/.well-known/openid-configuration`;
  url.search = "";
  url.hash = "";
  return url;
}

async function discoverJwksUri(config: OidcConfig): Promise<string> {
  if (config.jwksUri) return config.jwksUri;

  const response = await fetch(discoveryUrl(config.issuer), {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) {
    throw new Error(`OIDC discovery failed with HTTP ${response.status}`);
  }

  const metadata = discoveryDocumentSchema.parse(await response.json());
  if (metadata.issuer !== config.issuer) {
    throw new Error("OIDC discovery issuer does not match OIDC_ISSUER_URL");
  }
  return metadata.jwks_uri;
}

export function createJwtAccessTokenVerifier(
  config: OidcConfig,
  key: JWTVerifyGetKey,
): AccessTokenVerifier {
  const parsedConfig = oidcConfigSchema.parse(config);

  return async (token) => {
    const { payload } = await jwtVerify(token, key, {
      issuer: parsedConfig.issuer,
      audience: parsedConfig.audience,
      algorithms: parsedConfig.algorithms,
      clockTolerance: 5,
    });
    if (typeof payload.sub !== "string" || payload.sub.length === 0) {
      throw new errors.JWTClaimValidationFailed(
        'required "sub" claim is missing',
        payload,
        "sub",
        "missing",
      );
    }
    return payload as OidcClaims;
  };
}

async function createConfiguredVerifier(): Promise<AccessTokenVerifier> {
  const config = loadOidcConfig();
  const jwksUri = await discoverJwksUri(config);
  const remoteJwks = createRemoteJWKSet(new URL(jwksUri), {
    cooldownDuration: 30_000,
    timeoutDuration: 5_000,
  });
  return createJwtAccessTokenVerifier(config, remoteJwks);
}

let configuredVerifier: Promise<AccessTokenVerifier> | undefined;

async function verifyConfiguredAccessToken(token: string): Promise<OidcClaims> {
  configuredVerifier ??= createConfiguredVerifier().catch((error: unknown) => {
    configuredVerifier = undefined;
    throw error;
  });
  const verifier = await configuredVerifier;
  return verifier(token);
}

export function parseBearerToken(headers: Headers): string | null {
  const authorization = headers.get("authorization");
  if (!authorization) return null;
  const match = /^Bearer\s+(\S+)$/i.exec(authorization.trim());
  return match?.[1] ?? null;
}

function isRejectedToken(error: unknown): boolean {
  if (!(error instanceof errors.JOSEError)) return false;
  return new Set([
    "ERR_JWT_EXPIRED",
    "ERR_JWT_CLAIM_VALIDATION_FAILED",
    "ERR_JWT_INVALID",
    "ERR_JWS_INVALID",
    "ERR_JWS_SIGNATURE_VERIFICATION_FAILED",
    "ERR_JWKS_NO_MATCHING_KEY",
    "ERR_JOSE_ALG_NOT_ALLOWED",
  ]).has(error.code);
}

function stringClaim(claims: OidcClaims, name: string): string | null {
  const value = claims[name];
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function createOidcAuth(
  verifyAccessToken: AccessTokenVerifier = verifyConfiguredAccessToken,
): TRPCAuth {
  return {
    async getSession({ headers }) {
      const token = parseBearerToken(headers);
      if (!token) return null;

      let claims: OidcClaims;
      try {
        claims = await verifyAccessToken(token);
      } catch (error: unknown) {
        if (isRejectedToken(error)) return null;
        throw error;
      }

      if (typeof claims.sub !== "string" || claims.sub.length === 0) {
        return null;
      }

      return {
        user: {
          id: claims.sub,
          name:
            stringClaim(claims, "name") ??
            stringClaim(claims, "preferred_username"),
          email: stringClaim(claims, "email"),
        },
        claims,
      };
    },
  };
}

export const authApi = createOidcAuth();
