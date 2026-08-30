import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    if (!cloudName) {
      return NextResponse.json({ error: 'Cloudinary configuration missing' }, { status: 500 })
    }

    // Proxy the form data directly to Cloudinary from the server with 'auto' for image + video support
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', file)
    cloudinaryFormData.append('upload_preset', 'sharers_gym')

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: cloudinaryFormData
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Cloudinary upload failed' }, { status: response.status })
    }

    return NextResponse.json({ secure_url: data.secure_url })
  } catch (error: any) {
    console.error('Server upload error:', error)
    return NextResponse.json({ error: 'Failed to proxy upload to Cloudinary' }, { status: 500 })
  }
}
