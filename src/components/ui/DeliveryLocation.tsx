import { MapPin, Pencil } from "lucide-react";
// import { DeliveryLocation as LocationType } from "../";

import type { DeliveryLocation as LocationType } from "../../types/location.types";

interface Props extends LocationType {
  onChange?: () => void;
}

const DeliveryLocation: React.FC<Props> = ({ name, pincode, onChange }) => {
  return (
    <div className="flex items-center justify-between bg-[#e6f2f0] px-4 py-2 rounded-md text-sm shadow-sm">
      <div className="flex items-center gap-2 text-gray-800">
        <MapPin size={16} className="text-blue-600" />
        <span>
          Deliver to <strong>{name}</strong> - {pincode}
        </span>
      </div>
      <button onClick={onChange} className="text-gray-500 hover:text-blue-600">
        <Pencil size={16} />
      </button>
    </div>
  );
};

export default DeliveryLocation;
