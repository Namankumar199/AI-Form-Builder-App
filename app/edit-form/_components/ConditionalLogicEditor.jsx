"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Zap } from 'lucide-react';
import { CONDITION_OPERATORS } from '@/lib/conditionalLogic';

function ConditionalLogicEditor({ field, allFields, onUpdate }) {
  const [conditions, setConditions] = useState(field.conditions || []);
  const [conditionLogic, setConditionLogic] = useState(field.conditionLogic || 'AND');

  const availableFields = allFields.filter(f => f.name !== field.name);

  const addCondition = () => {
    const newCondition = {
      field: '',
      operator: 'equals',
      value: ''
    };
    const updatedConditions = [...conditions, newCondition];
    setConditions(updatedConditions);
    updateField(updatedConditions, conditionLogic);
  };

  const removeCondition = (index) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
    updateField(updatedConditions, conditionLogic);
  };

  const updateCondition = (index, key, value) => {
    const updatedConditions = conditions.map((condition, i) => 
      i === index ? { ...condition, [key]: value } : condition
    );
    setConditions(updatedConditions);
    updateField(updatedConditions, conditionLogic);
  };

  const updateField = (newConditions, newLogic) => {
    onUpdate({
      ...field,
      conditions: newConditions,
      conditionLogic: newLogic
    });
  };

  const updateLogic = (logic) => {
    setConditionLogic(logic);
    updateField(conditions, logic);
  };

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-purple-600" />
          Conditional Logic
        </CardTitle>
        <CardDescription>
          Show or hide this field based on other field values
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {conditions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Show this field when:</span>
              {conditions.length > 1 && (
                <Select value={conditionLogic} onValueChange={updateLogic}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">ALL</SelectItem>
                    <SelectItem value="OR">ANY</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <span className="text-sm text-gray-600">
                {conditions.length > 1 ? 'of the following conditions are met:' : 'condition is met:'}
              </span>
            </div>

            {conditions.map((condition, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                {/* Field Selection */}
                <Select 
                  value={condition.field} 
                  onValueChange={(value) => updateCondition(index, 'field', value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map(f => (
                      <SelectItem key={f.name} value={f.name}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Operator Selection */}
                <Select 
                  value={condition.operator} 
                  onValueChange={(value) => updateCondition(index, 'operator', value)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_OPERATORS.map(op => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Value Input */}
                {!['is_empty', 'is_not_empty'].includes(condition.operator) && (
                  <Input
                    placeholder="Value"
                    value={condition.value}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                )}

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCondition(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add Condition Button */}
        <Button
          variant="outline"
          onClick={addCondition}
          className="w-full border-dashed border-purple-300 text-purple-600 hover:bg-purple-50"
          disabled={availableFields.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>

        {availableFields.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            No other fields available for conditions
          </p>
        )}

        {/* Preview */}
        {conditions.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Logic Preview:</h4>
            <div className="text-sm text-blue-700">
              This field will be shown when{' '}
              <Badge variant="outline" className="mx-1">
                {conditionLogic === 'AND' ? 'ALL' : 'ANY'}
              </Badge>
              of the above conditions are met.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ConditionalLogicEditor;