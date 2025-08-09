import { NextResponse } from 'next/server';
import { db } from '@/configs';
import { TeamMembers } from '@/configs/schema';

export async function GET() {
  try {
    const members = await db.select().from(TeamMembers);
    
    return NextResponse.json({ 
      success: true, 
      members: members.map(member => ({
        id: member.id,
        userEmail: member.userEmail,
        role: member.role,
        status: member.status,
        joinedAt: member.joinedAt,
        invitedAt: member.invitedAt
      }))
    });

  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}