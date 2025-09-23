import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoogleMapsEmbedProps {
  address: string;
  className?: string;
}

export const GoogleMapsEmbed = ({ address, className = "" }: GoogleMapsEmbedProps) => {
  // URL-encode the address for Google Maps
  const encodedAddress = encodeURIComponent(address);
  
  // Google Maps Embed API URL
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAsd3NwcysdtNfgvS-SX2gEIhPKJ5bxlRM&q=${encodedAddress}`;
  
  // Google Maps link for opening in new tab/app
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Karta
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8"
          >
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Öppna i Maps
            </a>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={embedUrl}
            title={`Karta för ${address}`}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};