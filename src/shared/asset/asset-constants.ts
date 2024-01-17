export enum CreateAssetErrors {
  UNAUTHORIZED = "Unauthorized",
  INTERNAL_ERROR = "Internal error",
  FILE_TOO_LARGE = "File too large",
  INVALID_FILE_TYPE = "Invalid file type",
}

export const MAX_ASSET_SIZE = 1024 * 1024 * 10; // 10MB
