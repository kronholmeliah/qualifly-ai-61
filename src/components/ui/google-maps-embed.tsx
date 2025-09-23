import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
interface GoogleMapsEmbedProps {
  address: string;
  className?: string;
}
export const GoogleMapsEmbed: React.FC<GoogleMapsEmbedProps> = ({
  address,
  className = ""
}) => {
  // URL-encode the address for Google Maps
  const encodedAddress = encodeURIComponent(address);

  // Google Maps Embed API URL
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyA1IILY3T9YwXVkMlshkOMnLxBsCoQDHzo&q=${encodedAddress}`;

  // Google Maps link for opening in new tab/app
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Karta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <iframe
            src={embedUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-md"
          />
          <div className="mt-3">
            <Button variant="outline" size="sm" asChild>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Öppna i Google Maps
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};