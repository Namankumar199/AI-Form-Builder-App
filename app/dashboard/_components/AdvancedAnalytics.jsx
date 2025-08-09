"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Filter
} from 'lucide-react';

function AdvancedAnalytics({ formId, formTitle }) {
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState({
    overview: {
      totalViews: 1247,
      totalResponses: 89,
      conversionRate: 7.1,
      avgCompletionTime: 142,
      bounceRate: 23.5
    },
    traffic: {
      sources: [
        { name: 'Direct', visits: 45, percentage: 35.7 },
        { name: 'Social Media', visits: 32, percentage: 25.4 },
        { name: 'Email', visits: 28, percentage: 22.2 },
        { name: 'Search', visits: 21, percentage: 16.7 }
      ],
      devices: [
        { name: 'Desktop', visits: 67, percentage: 53.2 },
        { name: 'Mobile', visits: 45, percentage: 35.7 },
        { name: 'Tablet', visits: 14, percentage: 11.1 }
      ],
      locations: [
        { country: 'United States', visits: 45, percentage: 35.7 },
        { country: 'United Kingdom', visits: 23, percentage: 18.3 },
        { country: 'Canada', visits: 18, percentage: 14.3 },
        { country: 'Australia', visits: 15, percentage: 11.9 },
        { country: 'Germany', visits: 12, percentage: 9.5 }
      ]
    },
    funnel: [
      { step: 'Form Viewed', count: 1247, percentage: 100 },
      { step: 'Started Filling', count: 456, percentage: 36.6 },
      { step: 'Reached Middle', count: 234, percentage: 18.8 },
      { step: 'Completed', count: 89, percentage: 7.1 }
    ],
    fieldAnalytics: [
      { field: 'Name', completionRate: 95.2, avgTime: 8 },
      { field: 'Email', completionRate: 89.7, avgTime: 12 },
      { field: 'Phone', completionRate: 76.3, avgTime: 15 },
      { field: 'Message', completionRate: 67.8, avgTime: 45 }
    ]
  });

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getDeviceIcon = (device) => {
    switch (device.toLowerCase()) {
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Advanced Analytics
          </h2>
          <p className="text-gray-600">{formTitle}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{analytics.overview.totalViews.toLocaleString()}</div>
            <div className="text-xs text-blue-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% vs last period
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{analytics.overview.totalResponses}</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.3% vs last period
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{analytics.overview.conversionRate}%</div>
            <div className="text-xs text-purple-600">
              Industry avg: 5.2%
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              Avg. Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{formatTime(analytics.overview.avgCompletionTime)}</div>
            <div className="text-xs text-orange-600">
              Completion time
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-600" />
              Bounce Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{analytics.overview.bounceRate}%</div>
            <div className="text-xs text-red-600">
              Left without filling
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="fields">Field Analytics</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        {/* Conversion Funnel */}
        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>
                Track user journey through your form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.funnel.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{step.step}</h4>
                          <p className="text-sm text-gray-600">{step.count.toLocaleString()} users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">{step.percentage}%</div>
                        {index > 0 && (
                          <div className="text-sm text-red-600">
                            -{(analytics.funnel[index-1].percentage - step.percentage).toFixed(1)}% drop
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${step.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Sources */}
        <TabsContent value="traffic">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.traffic.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{source.visits}</div>
                        <div className="text-sm text-gray-600">{source.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.traffic.devices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(device.name)}
                        <span className="font-medium">{device.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{device.visits}</div>
                        <div className="text-sm text-gray-600">{device.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Field Analytics */}
        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <CardTitle>Field Performance</CardTitle>
              <CardDescription>
                Analyze how users interact with each form field
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.fieldAnalytics.map((field, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">{field.field}</h4>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {field.completionRate}% completion
                        </Badge>
                        <Badge variant="outline">
                          {formatTime(field.avgTime)} avg time
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${field.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geography */}
        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>
                Where your form visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.traffic.locations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{location.country}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{location.visits}</div>
                      <div className="text-sm text-gray-600">{location.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdvancedAnalytics;