import { Lead, LeadScoreFactors, SCORE_WEIGHTS, TIMEFRAME_SCORES, COMPLEXITY_SCORES } from "@/types/lead";

export const calculateLeadScore = (lead: Lead): { score: number; factors: LeadScoreFactors } => {
  // Economic Potential (40%) - Based on estimated cost
  const economicPotential = Math.min(100, (lead.estimatedCost / 500000) * 100);
  
  // Complexity & Risk (25%) - Lower complexity = higher score
  const complexity = COMPLEXITY_SCORES[lead.serviceType] || 50;
  
  // Time Criticality (20%) - Sooner = higher score
  const timeframe = TIMEFRAME_SCORES[lead.timeframe] || 50;
  
  // Customer Seriousness (15%) - Based on attachments and detail level
  let seriousness = 20; // Base score
  if (lead.attachments.length > 0) {
    seriousness += 60; // Has attachments
  }
  if (lead.notes.length > 50) {
    seriousness += 20; // Detailed notes
  }
  seriousness = Math.min(100, seriousness);
  
  const factors: LeadScoreFactors = {
    economicPotential,
    complexity,
    timeframe,
    seriousness
  };
  
  // Calculate weighted score
  const score = Math.round(
    economicPotential * SCORE_WEIGHTS.economicPotential +
    complexity * SCORE_WEIGHTS.complexity +
    timeframe * SCORE_WEIGHTS.timeframe +
    seriousness * SCORE_WEIGHTS.seriousness
  );
  
  return { score: Math.min(100, score), factors };
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "destructive";
};

export const getScoreEmoji = (score: number): string => {
  if (score >= 80) return "🟢";
  if (score >= 60) return "🟡";
  return "🔴";
};

export const generateLeadSummary = (lead: Lead): string => {
  const marginPrice = Math.round(lead.estimatedCost * (1 + lead.margin / 100));
  
  return `Kund i ${lead.location} vill ha ${lead.serviceType.toLowerCase()} på ${lead.scope}, önskar start ${lead.timeframe.toLowerCase()}. Grov kostnad ca ${lead.estimatedCost.toLocaleString("sv-SE")} kr (±10%), rekommenderad marginal ${lead.margin}% → faktura ${marginPrice.toLocaleString("sv-SE")} kr.`;
};