"use server";

import { type Readable } from "stream";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { assetsTable, type Asset } from "~/server/db/schema";
import { S3BucketNames, s3Client } from "~/server/s3/s3-client";
import {
  CreateAssetErrors,
  MAX_ASSET_SIZE,
} from "~/shared/asset/asset-constants";

/**
 * - Takes `file` from `formData` and uploads it to S3.
 * - Creates an `Asset` record in the database.
 * - User needs to be authenticated to perform this action.
 */
export async function createAsset(formData: FormData): Promise<Asset> {
  const session = await getServerAuthSession();

  if (!session?.user) {
    // TODO: better error handling
    throw new Error(CreateAssetErrors.UNAUTHORIZED);
  }

  const file = formData.get("file") as File;
  const size = file.size;
  const mime = file.type;
  const name = file.name;

  // TODO: allow only image for now, use sharp to convert to webp
  const isImage = mime.startsWith("image/");
  if (!isImage) {
    throw new Error(CreateAssetErrors.INVALID_FILE_TYPE);
  }

  if (size > MAX_ASSET_SIZE) {
    throw new Error(CreateAssetErrors.FILE_TOO_LARGE);
  }

  return await db.transaction(async (db) => {
    const [asset] = await db
      .insert(assetsTable)
      .values({
        name,
        userId: session.user.id,
        size,
        mime,
      })
      .returning();

    if (!asset) {
      throw new Error(CreateAssetErrors.INTERNAL_ERROR);
    }

    try {
      await s3Client.putObject(
        S3BucketNames.ASSETS,
        asset.id,
        file.stream() as unknown as Readable,
      );

      return asset;
    } catch (e) {
      console.error(e);
      throw new Error(CreateAssetErrors.INTERNAL_ERROR);
    }
  });
}
