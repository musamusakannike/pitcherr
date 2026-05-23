import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "pitcherr-resumes";

const isMock =
  !R2_ACCOUNT_ID ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  R2_ACCOUNT_ID === "mock" ||
  R2_ACCESS_KEY_ID === "mock" ||
  R2_SECRET_ACCESS_KEY === "mock";

// Initialize S3 Client only if not in mock mode
let s3Client: S3Client | null = null;
if (!isMock) {
  s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  });
}

/**
 * Uploads a file buffer to Cloudflare R2, or saves it locally in mock mode.
 * @param buffer The file content as a Buffer.
 * @param filename The desired filename (will be made unique).
 * @param contentType The MIME type of the file.
 * @returns Object containing the public URL and key.
 */
export async function uploadFile(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<{ url: string; key: string }> {
  const uniqueId = Math.random().toString(36).substring(2, 15);
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `resumes/${uniqueId}-${cleanFilename}`;

  if (isMock) {
    console.log(`[R2 MOCK] Simulating file upload for key: ${key}`);
    
    // Save locally to public/uploads directory for local access
    try {
      const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }
      
      const filePath = path.join(publicUploadsDir, `${uniqueId}-${cleanFilename}`);
      fs.writeFileSync(filePath, buffer);
      
      const localUrl = `/uploads/${uniqueId}-${cleanFilename}`;
      console.log(`[R2 MOCK] Successfully saved file locally at: ${filePath}`);
      return {
        url: localUrl,
        key,
      };
    } catch (error) {
      console.error("[R2 MOCK] Error saving local upload:", error);
      // Fallback to dummy data URL or memory representation
      return {
        url: `data:${contentType};base64,${buffer.toString("base64")}`,
        key,
      };
    }
  }

  // Real upload to Cloudflare R2
  if (!s3Client) {
    throw new Error("R2 Client is not initialized.");
  }

  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // R2 public URL format:
    // If you have a custom domain configured: https://your-custom-domain.com/key
    // Otherwise, we construct a fallback URL representation
    const url = `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
    
    console.log(`[R2] Uploaded file to R2 successfully: ${key}`);
    return {
      url,
      key,
    };
  } catch (error: any) {
    console.error("[R2] Error uploading file to R2:", error);
    throw new Error(`Failed to upload file to storage: ${error.message}`);
  }
}
