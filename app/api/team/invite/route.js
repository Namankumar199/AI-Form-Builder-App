import { NextResponse } from 'next/server';
import { db } from '@/configs';
import { TeamMembers } from '@/configs/schema';
import moment from 'moment';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request) {
  try {
    const user = await currentUser();
    const { email, role, teamId } = await request.json();

    // Generate invitation token
    const invitationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Create invitation link
    const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL}/team/accept-invitation?token=${invitationToken}`;

    // Email content for team invitation
    const emailContent = {
      to_email: email,
      subject: 'Team Invitation - AI Form Builder',
      html_content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white;">
          <h2 style="text-align: center; margin-bottom: 30px;">You're Invited to Join Our Team!</h2>
          
          <div style="background: white; color: #333; padding: 30px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #10b981; margin-bottom: 20px;">Team Invitation</h3>
            
            <p style="margin-bottom: 20px;">You've been invited to join our team as a <strong style="color: #3b82f6;">${role}</strong>.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${invitationLink}" style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${invitationLink}" style="color: #3b82f6; word-break: break-all;">${invitationLink}</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 14px; opacity: 0.8;">
              This invitation was sent from AI Form Builder
            </p>
          </div>
        </div>
      `
    };

    // Send email using the existing email service
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent)
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send invitation email');
    }

    // Save invitation to database
    const invitation = await db.insert(TeamMembers).values({
      userEmail: email,
      role: role,
      status: 'pending',
      invitedBy: user?.primaryEmailAddress?.emailAddress || 'system',
      invitedAt: moment().format('DD/MM/YYYY')
    }).returning();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Invitation sent successfully',
      invitationToken,
      invitation: invitation[0]
    });

  } catch (error) {
    console.error('Team invitation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}