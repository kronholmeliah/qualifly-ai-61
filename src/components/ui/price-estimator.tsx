import React, { useMemo } from 'react';
import { Calculator, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PriceEstimatorProps {
  services: string[];
  description: string;
  className?: string;
}

const serviceBasePrices: Record<string, number> = {
  'badrum': 150000,
  'kok': 200000,
  'tak-fasad': 100000,
  'fonster-dorrar': 80000,
  'altan-tillbyggnad': 120000,
  'nybyggnation': 500000,
  'ovrigt': 50000
};

const serviceTimeframes: Record<string, string> = {
  'badrum': '2-4 veckor',
  'kok': '3-6 veckor',
  'tak-fasad': '1-3 veckor',
  'fonster-dorrar': '1-2 veckor',
  'altan-tillbyggnad': '4-8 veckor',
  'nybyggnation': '6-12 månader',
  'ovrigt': '1-4 veckor'
};

export const PriceEstimator: React.FC<PriceEstimatorProps> = ({
  services,
  description,
  className
}) => {
  const estimate = useMemo(() => {
    if (services.length === 0) return null;

    // Base calculation from selected services
    let basePrice = services.reduce((total, service) => {
      return total + (serviceBasePrices[service] || 50000);
    }, 0);

    // Apply complexity multiplier based on description length and keywords
    let complexityMultiplier = 1;
    const descriptionLength = description.length;
    const complexKeywords = ['premium', 'exklusiv', 'design', 'arkitekt', 'speciallösning'];
    const hasComplexKeywords = complexKeywords.some(keyword => 
      description.toLowerCase().includes(keyword)
    );

    if (descriptionLength > 200) complexityMultiplier += 0.2;
    if (hasComplexKeywords) complexityMultiplier += 0.3;
    if (services.length > 2) complexityMultiplier += 0.15;

    const estimatedPrice = Math.round(basePrice * complexityMultiplier);
    const minPrice = Math.round(estimatedPrice * 0.8);
    const maxPrice = Math.round(estimatedPrice * 1.3);

    // Estimate timeframe based on primary service
    const primaryService = services[0];
    const baseTimeframe = serviceTimeframes[primaryService] || '2-4 veckor';

    return {
      min: minPrice,
      max: maxPrice,
      estimated: estimatedPrice,
      timeframe: baseTimeframe,
      complexity: complexityMultiplier > 1.3 ? 'hög' : complexityMultiplier > 1.1 ? 'medel' : 'låg'
    };
  }, [services, description]);

  if (!estimate) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className={cn("border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5", className)}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Preliminär prisuppskattning</h3>
        </div>

        <div className="space-y-4">
          {/* Price Range */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">
              {formatPrice(estimate.min)} - {formatPrice(estimate.max)}
            </div>
            <p className="text-sm text-muted-foreground">
              Baserat på dina valda tjänster och beskrivning
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Komplexitet</span>
              </div>
              <Badge variant={estimate.complexity === 'hög' ? 'destructive' : estimate.complexity === 'medel' ? 'secondary' : 'outline'}>
                {estimate.complexity}
              </Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Tidsram</span>
              </div>
              <p className="text-sm text-muted-foreground">{estimate.timeframe}</p>
            </div>

            <div className="text-center">
              <div className="text-sm font-medium text-foreground mb-1">Tjänster</div>
              <p className="text-sm text-muted-foreground">{services.length} valda</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-muted/30 rounded-lg p-3 mt-4">
            <p className="text-xs text-muted-foreground text-center">
              Detta är en preliminär uppskattning. Slutligt pris bestäms efter platsbesök och detaljerad planering.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};