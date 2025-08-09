"use client"
import React, { useState } from 'react';
import { FormTemplates } from '@/app/_data/FormTemplates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap } from 'lucide-react';

function TemplateSelector({ onSelectTemplate, onCreateFromScratch }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...new Set(FormTemplates.map(t => t.category))];
  
  const filteredTemplates = selectedCategory === 'All' 
    ? FormTemplates 
    : FormTemplates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
          Choose How to Create Your Form
        </h2>
        <p className="text-gray-600">Start with a template or create from scratch using AI</p>
      </div>

      <div className="flex gap-4 justify-center">
        <Button 
          onClick={onCreateFromScratch}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Create with AI
        </Button>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Or choose from templates:</h3>
        
        {/* Category Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                selectedCategory === category 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map(template => (
            <Card 
              key={template.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-teal-300"
              onClick={() => onSelectTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{template.icon}</span>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{template.category}</Badge>
                  <Button size="sm" variant="ghost">
                    <Zap className="h-4 w-4 mr-1" />
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplateSelector;