import React from 'react';
import TraditionalIntakeForm from '@/components/TraditionalIntakeForm';

const TraditionalFormPage: React.FC = () => {
  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Handle form submission - already handled in component
  };

  return <TraditionalIntakeForm onSubmit={handleFormSubmit} />;
};

export default TraditionalFormPage;