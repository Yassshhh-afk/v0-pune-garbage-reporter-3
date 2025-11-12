"use server"

import sharp from "sharp"

export async function compressImageAction(base64String: string, maxWidth = 1200, quality = 80): Promise<string> {
  try {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "")
    const buffer = Buffer.from(base64Data, "base64")

    const compressed = await sharp(buffer)
      .resize(maxWidth, maxWidth, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality })
      .toBuffer()

    return `data:image/jpeg;base64,${compressed.toString("base64")}`
  } catch (error) {
    console.error("[v0] Image compression failed:", error)
    return base64String
  }
}
