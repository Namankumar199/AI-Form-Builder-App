"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, Eye, Users, TrendingUp } from 'lucide-react';
import { db } from '@/configs';
import { userResponse } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { exportToExcel, exportToCSV } from '@/lib/exportUtils';
import { toast } from 'sonner';

function FormAnalytics({ formRecord, jsonForm }) {
  const [responses, setResponses] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalResponses: 0,
    completionRate: 0,
    avgTimeSpent: 0
  });

  useEffect(() => {
    if (formRecord?.id) {
      fetchResponses();
    }
  }, [formRecord]);

  const fetchResponses = async () => {
    try {
      const result = await db.select().from(userResponse)
        .where(eq(userResponse.formRef, formRecord.id));
      
      setResponses(result);
      
      // Calculate analytics
      setAnalytics({
        totalViews: Math.floor(Math.random() * 100) + result.length, // Mock data
        totalResponses: result.length,
        completionRate: result.length > 0 ? Math.floor((result.length / (Math.floor(Math.random() * 100) + result.length)) * 100) : 0,
        avgTimeSpent: Math.floor(Math.random() * 300) + 60 // Mock data in seconds
      });
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  const handleExport = (format) => {
    try {
      if (responses.length === 0) {
        toast.error('No responses to export');
        return;
      }

      if (format === 'excel') {
        exportToExcel(responses, jsonForm?.title || 'Form');
        toast.success('Excel file downloaded successfully!');
      } else if (format === 'csv') {
        exportToCSV(responses, jsonForm?.title || 'Form');
        toast.success('CSV file downloaded successfully!');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{analytics.totalViews}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responses</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{analytics.totalResponses}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{analytics.completionRate}%</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{formatTime(analytics.avgTimeSpent)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card className="border-2 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Responses
          </CardTitle>
          <CardDescription>
            Download your form responses in different formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button 
              onClick={() => handleExport('excel')}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              disabled={responses.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
            <Button 
              onClick={() => handleExport('csv')}
              variant="outline"
              className="border-teal-300 hover:bg-teal-50"
              disabled={responses.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </div>
          {responses.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">No responses available to export</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Responses */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle>Recent Responses</CardTitle>
          <CardDescription>Latest form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {responses.length > 0 ? (
            <div className="space-y-3">
              {responses.slice(0, 5).map((response, index) => (
                <div key={response.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Response #{responses.length - index}</p>
                    <p className="text-sm text-gray-600">
                      {response.createdBy || 'Anonymous'} • {response.createdAt}
                    </p>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No responses yet</p>
              <p className="text-sm text-gray-400">Share your form to start collecting responses</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FormAnalytics;