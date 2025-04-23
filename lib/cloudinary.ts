export async function uploadImageToCloudinary(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "busbuddy_uploads")
    formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzwuixwz0")

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzwuixwz0"}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    )

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error)
    throw new Error("Failed to upload image")
  }
}
