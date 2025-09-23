import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";

interface StreetViewStaticProps {
  address: string;
  className?: string;
}

export const StreetViewStatic = ({ address, className = "" }: StreetViewStaticProps) => {
  const apiKey = "AIzaSyA1IILY3T9YwXVkMlshkOMnLxBsCoQDHzo";
  const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x300&location=${encodeURIComponent(
    address
  )}&fov=70&pitch=0&source=outdoor&key=${apiKey}`;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Street View
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={`Street View av ${address}`}
            className="w-full h-[300px] object-cover"
            style={{ display: "block" }}
          />
          <div className="px-6 pb-6 pt-2">
            <p className="text-xs text-muted-foreground">© Google</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};