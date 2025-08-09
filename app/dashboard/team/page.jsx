"use client"
import React from 'react';
import { useUser } from '@clerk/nextjs';
import TeamManagement from '../_components/TeamManagement';
import ApiManagement from '../_components/ApiManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Code } from 'lucide-react';

function TeamPage() {
    const { user } = useUser();

    return (
        <div className='p-10 bg-gradient-to-br from-blue-50/50 via-teal-50/50 to-green-50/50 min-h-screen'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent animate-fade-in mb-8'>
                Team & Integrations
            </h1>
            
            <Tabs defaultValue="team" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="team" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Team Management
                    </TabsTrigger>
                    <TabsTrigger value="api" className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        API & Webhooks
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="team">
                    <TeamManagement currentUser={user} />
                </TabsContent>
                
                <TabsContent value="api">
                    <ApiManagement />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default TeamPage;