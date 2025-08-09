// Conditional logic engine for forms
export const evaluateCondition = (condition, formData) => {
  if (!condition || !condition.field || !condition.operator || condition.value === undefined) {
    return true; // Show field by default if no valid condition
  }

  const fieldValue = formData[condition.field];
  
  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;
    case 'not_equals':
      return fieldValue !== condition.value;
    case 'contains':
      return fieldValue && fieldValue.toString().toLowerCase().includes(condition.value.toLowerCase());
    case 'not_contains':
      return !fieldValue || !fieldValue.toString().toLowerCase().includes(condition.value.toLowerCase());
    case 'greater_than':
      return Number(fieldValue) > Number(condition.value);
    case 'less_than':
      return Number(fieldValue) < Number(condition.value);
    case 'is_empty':
      return !fieldValue || fieldValue === '';
    case 'is_not_empty':
      return fieldValue && fieldValue !== '';
    case 'starts_with':
      return fieldValue && fieldValue.toString().toLowerCase().startsWith(condition.value.toLowerCase());
    case 'ends_with':
      return fieldValue && fieldValue.toString().toLowerCase().endsWith(condition.value.toLowerCase());
    default:
      return true;
  }
};

export const shouldShowField = (field, formData) => {
  if (!field.conditions || field.conditions.length === 0) {
    return true; // Show field if no conditions
  }

  // Support for multiple conditions with AND/OR logic
  const logic = field.conditionLogic || 'AND';
  
  if (logic === 'AND') {
    return field.conditions.every(condition => evaluateCondition(condition, formData));
  } else if (logic === 'OR') {
    return field.conditions.some(condition => evaluateCondition(condition, formData));
  }
  
  return true;
};

export const getVisibleFields = (fields, formData) => {
  return fields.filter(field => shouldShowField(field, formData));
};

// Condition operators for UI
export const CONDITION_OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does Not Contain' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'is_empty', label: 'Is Empty' },
  { value: 'is_not_empty', label: 'Is Not Empty' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' }
];

// Helper to add condition to field
export const addConditionToField = (field, condition) => {
  return {
    ...field,
    conditions: [...(field.conditions || []), condition]
  };
};

// Helper to remove condition from field
export const removeConditionFromField = (field, conditionIndex) => {
  return {
    ...field,
    conditions: field.conditions?.filter((_, index) => index !== conditionIndex) || []
  };
};