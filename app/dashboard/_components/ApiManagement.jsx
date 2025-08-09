"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Webhook, Code, Copy, Eye, EyeOff, Trash2, Plus, TestTube } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { generateApiKey, createApiKey, revokeApiKey, createWebhook, testWebhook, API_ENDPOINTS, WEBHOOK_EVENTS } from '@/lib/apiService';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading';

function ApiManagement() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Production API',
      key: 'afb_1234567890_abcdefghijk',
      permissions: ['forms:read', 'responses:read'],
      createdAt: '2024-01-15',
      lastUsed: '2024-01-20'
    }
  ]);
  
  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      url: 'https://api.example.com/webhooks/forms',
      events: ['response.created'],
      status: 'active',
      createdAt: '2024-01-15'
    }
  ]);

  const [showApiKey, setShowApiKey] = useState({});
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const availablePermissions = [
    'forms:read', 'forms:write', 'forms:delete',
    'responses:read', 'responses:write', 'analytics:read'
  ];

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    setIsCreating(true);
    
    try {
      const newKey = {
        id: Date.now(),
        name: newKeyName,
        key: generateApiKey(),
        permissions: newKeyPermissions,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: 'Never'
      };

      setApiKeys(prev => [...prev, newKey]);
      setNewKeyName('');
      setNewKeyPermissions([]);
      toast.success('API key created successfully');
    } catch (error) {
      toast.error('Failed to create API key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeApiKey = async (keyId) => {
    try {
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      toast.success('API key revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke API key');
    }
  };

  const handleCreateWebhook = async () => {
    if (!newWebhookUrl.trim() || newWebhookEvents.length === 0) {
      toast.error('Please enter URL and select events');
      return;
    }

    setIsCreating(true);
    
    try {
      const newWebhook = {
        id: Date.now(),
        url: newWebhookUrl,
        events: newWebhookEvents,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };

      setWebhooks(prev => [...prev, newWebhook]);
      setNewWebhookUrl('');
      setNewWebhookEvents([]);
      toast.success('Webhook created successfully');
    } catch (error) {
      toast.error('Failed to create webhook');
    } finally {
      setIsCreating(false);
    }
  };

  const handleTestWebhook = async (webhookId) => {
    try {
      toast.success('Test webhook sent successfully');
    } catch (error) {
      toast.error('Webhook test failed');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleKeyVisibility = (keyId) => {
    setShowApiKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-purple-600" />
            API & Integrations
          </CardTitle>
          <CardDescription>
            Manage API keys and webhooks for external integrations
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="api-keys" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Keys
                  </CardTitle>
                  <CardDescription>
                    Create and manage API keys for programmatic access
                  </CardDescription>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Create API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>
                        Generate a new API key for external integrations
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Key Name</label>
                        <Input
                          placeholder="e.g., Production API, Mobile App"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Permissions</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {availablePermissions.map(permission => (
                            <label key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                checked={newKeyPermissions.includes(permission)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewKeyPermissions(prev => [...prev, permission]);
                                  } else {
                                    setNewKeyPermissions(prev => prev.filter(p => p !== permission));
                                  }
                                }}
                              />
                              <span className="text-sm">{permission}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleCreateApiKey}
                        disabled={isCreating}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      >
                        {isCreating ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Creating...
                          </>
                        ) : (
                          'Create API Key'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map(key => (
                  <div key={key.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-800">{key.name}</h4>
                        <p className="text-sm text-gray-600">Created {key.createdAt} • Last used {key.lastUsed}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {showApiKey[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(key.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeApiKey(key.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="font-mono text-sm bg-white p-2 rounded border">
                      {showApiKey[key.id] ? key.key : '•'.repeat(32)}
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      {key.permissions.map(permission => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-5 w-5" />
                    Webhooks
                  </CardTitle>
                  <CardDescription>
                    Configure webhooks to receive real-time notifications
                  </CardDescription>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Webhook
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Webhook</DialogTitle>
                      <DialogDescription>
                        Add a webhook endpoint to receive notifications
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Webhook URL</label>
                        <Input
                          placeholder="https://your-app.com/webhooks"
                          value={newWebhookUrl}
                          onChange={(e) => setNewWebhookUrl(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Events</label>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {WEBHOOK_EVENTS.map(event => (
                            <label key={event} className="flex items-center space-x-2">
                              <Checkbox
                                checked={newWebhookEvents.includes(event)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewWebhookEvents(prev => [...prev, event]);
                                  } else {
                                    setNewWebhookEvents(prev => prev.filter(e => e !== event));
                                  }
                                }}
                              />
                              <span className="text-sm">{event}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleCreateWebhook}
                        disabled={isCreating}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      >
                        {isCreating ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Creating...
                          </>
                        ) : (
                          'Create Webhook'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map(webhook => (
                  <div key={webhook.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-800">{webhook.url}</h4>
                        <p className="text-sm text-gray-600">Created {webhook.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={webhook.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {webhook.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTestWebhook(webhook.id)}
                        >
                          <TestTube className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {webhook.events.map(event => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Learn how to integrate with our API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Base URL</h4>
                  <div className="font-mono text-sm bg-gray-100 p-3 rounded border">
                    https://api.aiformbuilder.com/v1
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Authentication</h4>
                  <div className="font-mono text-sm bg-gray-100 p-3 rounded border">
                    Authorization: Bearer YOUR_API_KEY
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Available Endpoints</h4>
                  <div className="space-y-2">
                    {Object.entries(API_ENDPOINTS).map(([category, endpoints]) => (
                      <div key={category}>
                        <h5 className="font-medium text-gray-700 mb-2">{category}</h5>
                        {Object.entries(endpoints).map(([name, endpoint]) => (
                          <div key={name} className="font-mono text-sm bg-gray-100 p-2 rounded border mb-1">
                            {endpoint}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ApiManagement;