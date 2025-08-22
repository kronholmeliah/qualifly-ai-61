import React from 'react';
import IntakeForm from '@/components/IntakeForm';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const IntakePage = () => {
  const navigate = useNavigate();

  const handleFormSubmit = (formData: any) => {
    // Save to localStorage (same format as existing leads)
    const leadData = {
      id: Date.now().toString(),
      serviceType: formData.category,
      scope: formData.description,
      location: formData.address,
      timeframe: formData.timeline,
      notes: `Beslutsfattare: ${formData.decisionMaker}. Dynamiska fält: ${JSON.stringify(formData.dynamicFields)}`,
      attachments: formData.files,
      estimatedCost: 50000, // Default estimate
      score: 75, // Default score
      margin: 20,
      finalPrice: 60000,
      createdAt: new Date(),
      status: 'new' as const,
      customerName: formData.name,
      customerContact: formData.phone,
      customerAddress: formData.address,
      detailedDescription: formData.description,
      projectType: formData.category,
      planning: {
        desiredStart: formData.timeline
      }
    };

    // Save to localStorage
    const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    const updatedLeads = [leadData, ...existingLeads];
    localStorage.setItem('leads', JSON.stringify(updatedLeads));

    // Also save to detailedLeads for compatibility
    const existingDetailedLeads = JSON.parse(localStorage.getItem('detailedLeads') || '[]');
    const updatedDetailedLeads = [leadData, ...existingDetailedLeads];
    localStorage.setItem('detailedLeads', JSON.stringify(updatedDetailedLeads));

    toast({
      title: "Tack för din förfrågan!",
      description: "Vi återkommer inom kort med en offert.",
    });

    // Redirect to admin dashboard to see the lead
    navigate('/admin');
  };

  return <IntakeForm onSubmit={handleFormSubmit} />;
};

export default IntakePage;