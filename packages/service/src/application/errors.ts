export class ApplicationInputError extends Error {
  override readonly name = "ApplicationInputError";
}

export class ResourceNotFoundError extends Error {
  override readonly name = "ResourceNotFoundError";
}
