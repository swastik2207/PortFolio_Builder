// src/lib/cloudinary.ts

/**
 * Uploads an image file to Cloudinary and returns the secure URL.
 * @param file The image file to upload
 * @param folder The Cloudinary folder to upload to (optional)
 * @returns The secure URL of the uploaded image
 * @throws Error if upload fails
 */
export async function uploadImageToCloudinary(file: File, folder?: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary environment variables are not set')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
  if (folder) {
    formData.append('folder', folder)
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Cloudinary upload failed')
  }

  const data = await response.json()
  return data.secure_url as string
}
