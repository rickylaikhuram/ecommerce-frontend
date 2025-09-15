import React from "react";
import { X } from "lucide-react";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  images?: Array<{
    imageUrl: string;
    altText?: string;
    position: number;
  }>;
  productName?: string;
}

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  images,
  productName,
}) => {
  if (!isOpen) return null;

  // Find the image with the highest position (last image)
  const sizeGuideImage = images?.reduce((prev, current) => 
    (prev.position > current.position) ? prev : current
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
            Size Guide
            {productName && (
              <span className="text-sm font-normal text-gray-600 block lg:inline lg:ml-2">
                for {productName}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Image content */}
        <div className="p-4">
          {sizeGuideImage ? (
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <div className="aspect-square w-full">
                <img
                  src={`${S3_BASE_URL}${sizeGuideImage.imageUrl}`}
                  alt={sizeGuideImage.altText || "Size Guide"}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.png";
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="aspect-square w-full bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">📏</span>
                </div>
                <p className="text-gray-600 font-medium">Size guide not available</p>
                <p className="text-sm text-gray-500 mt-1">
                  Please contact customer support for sizing information
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with helpful text */}
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 text-center">
            Click outside or press the X to close
          </p>
        </div>
      </div>

      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};

export default SizeGuideModal;