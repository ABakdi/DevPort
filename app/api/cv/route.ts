import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { CV } from '@/models/cv'

export async function GET() {
  try {
    await connectToDatabase()
    
    let cv = await CV.findOne().lean()
    console.log('CV API - Fetched CV:', JSON.stringify(cv, null, 2))
    
    if (!cv) {
      cv = {
        _id: '',
        displayName: '',
        summary: '',
        phone: '',
        address: '',
        linkedin: '',
        whatsapp: '',
        website: '',
        workExperience: [],
        projects: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        customSections: [],
        updatedAt: new Date()
      }
    }
    
    return NextResponse.json(JSON.parse(JSON.stringify(cv)))
  } catch (error) {
    console.error('Error fetching CV:', error)
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 })
  }
}

function sanitizeCVBody(body: any) {
  const sanitized = { ...body }
  
  const embeddedArrays = ['workExperience', 'projects', 'education', 'skills', 'languages', 'certifications', 'customSections']
  
  for (const arr of embeddedArrays) {
    if (sanitized[arr] && Array.isArray(sanitized[arr])) {
      sanitized[arr] = sanitized[arr].map((item: any) => {
        const { _id, ...rest } = item
        return rest
      })
    }
  }
  
  return sanitized
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const body = await request.json()
    console.log('CV API - Received body:', JSON.stringify(body, null, 2))
    const sanitizedBody = sanitizeCVBody(body)
    console.log('CV API - Sanitized body:', JSON.stringify(sanitizedBody, null, 2))
    
    let cv = await CV.findOne()
    
    if (cv) {
      Object.assign(cv, sanitizedBody)
      cv = await cv.save()
      console.log('CV API - Saved CV:', JSON.stringify(cv, null, 2))
    } else {
      cv = await CV.create(sanitizedBody)
    }
    
    return NextResponse.json(JSON.parse(JSON.stringify(cv)))
  } catch (error) {
    console.error('Error saving CV:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to save CV', details: errorMessage }, { status: 500 })
  }
}
