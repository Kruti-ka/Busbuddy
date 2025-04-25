// E:\PERSONAL\KRITIKA\bus buddy ver 1\Busbuddy\lib\cloudinary.ts
export async function uploadImageToCloudinary(file: File): Promise<string> {
  try {
    // Check if we have a valid file
    if (!file || !(file instanceof File)) {
      console.error("Invalid file provided to uploadImageToCloudinary:", file);
      throw new Error("Invalid file provided for upload");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "busbuddy_uploads");
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzwuixwz0";
    formData.append("cloud_name", cloudName);

    // Log the form data values for debugging
    console.log("Uploading to Cloudinary with cloud_name:", cloudName);
    console.log("Using upload_preset:", "busbuddy_uploads");
    console.log("File name:", file.name, "File size:", file.size, "File type:", file.type);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload failed:", response.status, errorText);
      throw new Error(`Failed to upload image: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data || !data.secure_url) {
      console.error("Cloudinary returned unexpected response:", data);
      throw new Error("Invalid response from Cloudinary");
    }
    
    console.log("Upload successful, received URL:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error; // Re-throw to be handled by caller
  }
}