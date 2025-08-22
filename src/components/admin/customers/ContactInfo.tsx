// components/ContactInfo.tsx
import React from "react";
import { Mail, Phone } from "lucide-react";

interface ContactInfoProps {
  email: string;
  phone?: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ email, phone }) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-center text-sm text-gray-900">
      <Mail className="h-4 w-4 mr-2 text-gray-400" />
      {email}
    </div>
    <div className="flex items-center text-sm text-gray-500">
      <Phone className="h-4 w-4 mr-2 text-gray-400" />
      {phone || "N/A"}
    </div>
  </div>
);
