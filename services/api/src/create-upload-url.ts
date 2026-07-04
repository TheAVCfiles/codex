import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({});
const MEDIA_BUCKET = process.env.MEDIA_BUCKET!;

export async function createUploadUrl(params: {
  tenantId: string;
  sessionId: string;
  contentType: string;
  fileName: string;
}) {
  const { tenantId, sessionId, contentType, fileName } = params;
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const artifactKey = `tenants/${tenantId}/sessions/${sessionId}/source/${safeName}`;

  const command = new PutObjectCommand({
    Bucket: MEDIA_BUCKET,
    Key: artifactKey,
    ContentType: contentType
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

  return { uploadUrl, artifactKey };
}
