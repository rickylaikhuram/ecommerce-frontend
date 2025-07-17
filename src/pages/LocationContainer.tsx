import React, { useEffect, useState } from "react";
import axios from "axios";
import DeliveryLocation from "../components/ui/DeliveryLocation";
import type { DeliveryLocation as LocationType } from "../types/location.types";

const LocationContainer = () => {
  const [location, setLocation] = useState<LocationType | null>(null);

  const fetchLocation = async () => {
    const res = await axios.get<LocationType>("http://localhost:4000/api/location");
    setLocation(res.data);
  };

  const updateLocation = async () => {
    const name = prompt("Enter name:", location?.name || "") || "";
    const pincode = prompt("Enter pincode:", location?.pincode || "") || "";
    const res = await axios.put<LocationType>("http://localhost:4000/api/location", {
      name,
      pincode,
    });
    setLocation(res.data);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  if (!location) return <div>Loading location...</div>;

  return (
    <div className="p-4">
      <DeliveryLocation
        name={location.name}
        pincode={location.pincode}
        onChange={updateLocation}
      />
    </div>
  );
};

export default LocationContainer;
