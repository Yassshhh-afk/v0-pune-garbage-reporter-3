import sharp from "sharp"

export async function compressImage(base64String: string, maxWidth = 1200, quality = 80): Promise<string> {
  try {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "")

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64")

    // Compress using sharp
    const compressed = await sharp(buffer)
      .resize(maxWidth, maxWidth, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality })
      .toBuffer()

    // Convert back to base64 with data URL prefix
    return `data:image/jpeg;base64,${compressed.toString("base64")}`
  } catch (error) {
    console.error("[v0] Image compression failed:", error)
    // Return original if compression fails
    return base64String
  }
}
