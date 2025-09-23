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
    <div className={className}>
      <div className="rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={`Street View av ${address}`}
          className="w-full h-[300px] object-cover"
          style={{ display: "block" }}
        />
      </div>
      <div className="mt-2">
        <p className="text-xs text-muted-foreground">© Google</p>
      </div>
    </div>
  );
};