import type { AuthSession, TRPCAuth, UserAdministration } from "@acme/auth";
import type { Logger, Telemetry } from "@acme/logger";
import type { ContentService, FileUploadService } from "@acme/service";

export type TRPCServices = {
  content: ContentService;
  fileUpload?: FileUploadService;
  userAdministration?: UserAdministration;
};

export type TRPCContext = {
  authApi: TRPCAuth;
  logger: Logger;
  telemetry: Telemetry;
  session: AuthSession | null;
  services: TRPCServices;
};

export type CreateTRPCContextOptions = {
  headers: Headers;
  logger: Logger;
  telemetry: Telemetry;
};
