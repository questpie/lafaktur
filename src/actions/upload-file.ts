"use server";

import { type Readable } from "stream";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { assetsTable, type Asset } from "~/server/db/schema";
import { S3BucketNames, s3Client } from "~/server/s3/s3-client";

export enum FileUploadErrors {
  UNAUTHORIZED = "Unauthorized",
  INTERNAL_ERROR = "Internal error",
}

// upload file from formData, puts it to s3, creates asset in db, returns asset id
export async function uploadFile(formData: FormData): Promise<Asset> {
  const session = await getServerAuthSession();

  if (!session?.user) {
    // TODO: better error handling
    throw new Error(FileUploadErrors.UNAUTHORIZED);
  }

  const file = formData.get("file") as File;
  const size = file.size;
  const mime = file.type;
  const name = file.name;

  // TODO: allow only image for now, use sharp to convert to webp

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
      throw new Error(FileUploadErrors.INTERNAL_ERROR);
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
      throw new Error(FileUploadErrors.INTERNAL_ERROR);
    }
  });
}
