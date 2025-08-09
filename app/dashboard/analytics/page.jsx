"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs';
import { JsonForms } from '@/configs/schema';
import { eq, desc } from 'drizzle-orm';
import FormAnalytics from '../_components/FormAnalytics';
import AdvancedAnalytics from '../_components/AdvancedAnalytics';
import { LoadingPage } from '@/components/ui/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp } from 'lucide-react';

function AnalyticsPage() {
    const { user } = useUser();
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchForms();
        }
    }, [user]);

    const fetchForms = async () => {
        try {
            const result = await db.select().from(JsonForms)
                .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(JsonForms.id));
            
            setForms(result);
            if (result.length > 0) {
                setSelectedForm(result[0]);
            }
        } catch (error) {
            console.error('Error fetching forms:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingPage message="Loading analytics..." />;
    }

    if (forms.length === 0) {
        return (
            <div className='p-10 bg-gradient-to-br from-blue-50/50 via-teal-50/50 to-green-50/50 min-h-screen'>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent animate-fade-in mb-8'>
                    Analytics
                </h1>
                <Card className="max-w-md mx-auto">
                    <CardHeader className="text-center">
                        <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <CardTitle>No Forms Yet</CardTitle>
                        <CardDescription>
                            Create your first form to start seeing analytics
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className='p-10 bg-gradient-to-br from-blue-50/50 via-teal-50/50 to-green-50/50 min-h-screen'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent animate-fade-in mb-8'>
                Analytics Dashboard
            </h1>
            
            {/* Form Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Form to Analyze
                </label>
                <select 
                    className="border border-teal-300 rounded-lg px-3 py-2 bg-white min-w-[300px]"
                    value={selectedForm?.id || ''}
                    onChange={(e) => {
                        const form = forms.find(f => f.id === parseInt(e.target.value));
                        setSelectedForm(form);
                    }}
                >
                    {forms.map(form => {
                        const jsonForm = JSON.parse(form.jsonform);
                        return (
                            <option key={form.id} value={form.id}>
                                {jsonForm.title || `Form ${form.id}`}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Analytics Content */}
            {selectedForm && (
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="advanced" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Advanced
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview">
                        <FormAnalytics 
                            formRecord={selectedForm}
                            jsonForm={JSON.parse(selectedForm.jsonform)}
                        />
                    </TabsContent>
                    
                    <TabsContent value="advanced">
                        <AdvancedAnalytics 
                            formId={selectedForm.id}
                            formTitle={JSON.parse(selectedForm.jsonform).title}
                        />
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}

export default AnalyticsPage