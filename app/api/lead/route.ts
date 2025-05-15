import {Lead} from '@/types/Lead';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Simulate processing the file upload
    const fileUrl = body.resume ? `/uploads/resume-${crypto.randomUUID()}.pdf` : '/uploads/placeholder.pdf';

    // Create a new lead with an ID and timestamps
    const newLead: Lead = {
      id: crypto.randomUUID(),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      linkedInProfile: body.linkedIn,
      visasOfInterest: body.visas,
      resumeUrl: fileUrl,
      additionalInfo: body.additionalInfo,
      country: body.country,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a production app, you would save this to a real database
    return NextResponse.json({success: true, data: newLead}, {status: 201});
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({success: false, error: 'Failed to create lead'}, {status: 500});
  }
}
