import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
interface GoogleMapsEmbedProps {
  address: string;
  className?: string;
}
export const GoogleMapsEmbed = ({
  address,
  className = ""
}: GoogleMapsEmbedProps) => {
  // URL-encode the address for Google Maps
  const encodedAddress = encodeURIComponent(address);

  // Google Maps Embed API URL
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyA1IILY3T9YwXVkMlshkOMnLxBsCoQDHzo=${encodedAddress}`;

  // Google Maps link for opening in new tab/app
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  return;
};