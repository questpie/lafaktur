import * as Minio from "minio";
import { env } from "~/env.mjs";

const s3Client = new Minio.Client({
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY,
  endPoint: env.S3_ENDPOINT_HOST,
  port: env.S3_ENDPOINT_PORT,
  pathStyle: env.S3_USE_PATH_STYLE,
  region: env.S3_REGION,
  /** Force SSL on production, maybe parametrize in future */
  useSSL: env.S3_USE_SSL,
});

export enum S3BucketNames {
  ASSETS = "assets",
}

export { s3Client };
