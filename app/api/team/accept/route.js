import { NextResponse } from 'next/server';
import { db } from '@/configs';
import { TeamMembers } from '@/configs/schema';
import { eq, and } from 'drizzle-orm';
import moment from 'moment';

export async function POST(request) {
  try {
    const { token, userEmail } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing user email' },
        { status: 400 }
      );
    }

    // Find and update pending invitation for this user
    const result = await db.update(TeamMembers)
      .set({ 
        status: 'active',
        joinedAt: moment().format('DD/MM/YYYY')
      })
      .where(and(
        eq(TeamMembers.userEmail, userEmail),
        eq(TeamMembers.status, 'pending')
      ))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No pending invitation found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined the team' 
    });

  } catch (error) {
    console.error('Accept invitation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}