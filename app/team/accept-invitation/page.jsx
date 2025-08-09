'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser, SignIn, useClerk } from '@clerk/nextjs';

export default function AcceptInvitation() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('signin');
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    // Always sign out first to force fresh login
    if (isLoaded && user) {
      signOut();
    }
  }, [isLoaded, user, signOut]);

  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress && status !== 'signin') {
      acceptInvitation();
    }
  }, [user, isLoaded, status]);

  const acceptInvitation = async () => {
    try {
      setStatus('loading');
      const response = await fetch('/api/team/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          userEmail: user.primaryEmailAddress.emailAddress
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setStatus('error');
    }
  };

  // Check if user just signed in and should process invitation
  useEffect(() => {
    const shouldProcess = searchParams.get('process');
    if (shouldProcess && user?.primaryEmailAddress?.emailAddress) {
      acceptInvitation();
    }
  }, [searchParams, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Invitation</h2>
            <p className="text-gray-600">Please wait while we process your invitation...</p>
          </>
        )}
        
        {status === 'signin' && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Invitation</h2>
            <p className="text-gray-600 mb-6">Sign in with your invited email address to join the team.</p>
            <div className="w-full max-w-md">
              <SignIn 
                routing="hash"
                afterSignInUrl={`/team/accept-invitation?token=${token}&process=true`}
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                    card: 'shadow-none border-0'
                  }
                }}
              />
            </div>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Invitation Accepted!</h2>
            <p className="text-gray-600 mb-6">You have successfully joined the team.</p>
            <a 
              href="/dashboard" 
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Go to Dashboard
            </a>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Invalid Invitation</h2>
            <p className="text-gray-600 mb-6">This invitation link is invalid or has expired.</p>
            <a 
              href="/" 
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Go Home
            </a>
          </>
        )}
      </div>
    </div>
  );
}