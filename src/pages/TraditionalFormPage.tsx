import React from 'react';
import ProfessionalIntakeForm from '@/components/ProfessionalIntakeForm';

const TraditionalFormPage: React.FC = () => {
  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Handle form submission - already handled in component
  };

  return <ProfessionalIntakeForm onSubmit={handleFormSubmit} />;
};

export default TraditionalFormPage;