// components/admin/ProductForm.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Upload,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
} from "lucide-react";
import Button from "../ui/Button";
import type { Product } from "../../types/temp.types";

interface ProductFormData {
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  status: "active" | "inactive";
  description: string;
  fakePrice?: number;
  weight?: number;
}

interface UploadedImage {
  id: string;
  url: string;
  previewUrl: string;
  name: string;
  isExisting?: boolean;
}

interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: Product | null;
  categories: string[];
  onSubmit: (data: ProductFormData & { images: string[] }) => Promise<void>;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialData,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState<
    { id: string; name: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<ProductFormData>({
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || categories[0] || "",
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      sku: initialData?.sku || "",
      status: initialData?.status || "active",
      description: initialData?.description || "",
      fakePrice: initialData?.fakePrice,
    },
  });

  // Load existing images for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData?.image) {
      // For now, using single image. Modify this when you have multiple images
      setUploadedImages([
        {
          id: "existing-1",
          url: initialData.image,
          previewUrl: initialData.image,
          name: "Product Image",
          isExisting: true,
        },
      ]);
    }
  }, [mode, initialData]);

  // Get presigned URL from your backend
  const getPresignedUrl = async (fileName: string, fileType: string) => {
    try {
      const response = await fetch("/api/s3/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, fileType }),
      });

      if (!response.ok) throw new Error("Failed to get presigned URL");

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting presigned URL:", error);
      throw error;
    }
  };

  // Upload image to S3
  const uploadToS3 = async (
    file: File,
    presignedUrl: string,
    publicUrl: string
  ) => {
    try {
      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) throw new Error("Upload failed");

      return publicUrl;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    for (const file of files) {
      const tempId = `${Date.now()}-${Math.random()}`;
      setUploadingImages((prev) => [...prev, { id: tempId, name: file.name }]);

      try {
        // Get presigned URL
        const { presignedUrl, publicUrl } = await getPresignedUrl(
          file.name,
          file.type
        );

        // Upload to S3
        await uploadToS3(file, presignedUrl, publicUrl);

        // Create preview URL for display
        const previewUrl = URL.createObjectURL(file);

        // Add to uploaded images
        setUploadedImages((prev) => [
          ...prev,
          {
            id: tempId,
            url: publicUrl,
            previewUrl,
            name: file.name,
          },
        ]);

        // Remove from uploading state
        setUploadingImages((prev) => prev.filter((img) => img.id !== tempId));
      } catch (error) {
        console.error("Failed to upload image:", error);
        setUploadingImages((prev) => prev.filter((img) => img.id !== tempId));
        alert(`Failed to upload ${file.name}`);
      }
    }
  };

  // Remove uploaded image
  const removeImage = (imageId: string) => {
    const image = uploadedImages.find((img) => img.id === imageId);
    if (image && !image.isExisting) {
      URL.revokeObjectURL(image.previewUrl);
    }
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  // Navigate to next step
  const handleNextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setCurrentStep(2);
    }
  };

  // Handle form submission
  const onFormSubmit = async (data: ProductFormData) => {
    if (uploadedImages.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        images: uploadedImages.map((img) => img.url),
      });

      // Clean up blob URLs
      uploadedImages.forEach((img) => {
        if (!img.isExisting) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Failed to submit product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <span className="ml-2 text-sm font-medium">Product Details</span>
          </div>
          <div className="flex-1 mx-4">
            <div className="h-1 bg-gray-200 rounded">
              <div
                className={`h-1 rounded transition-all duration-300 ${
                  currentStep > 1 ? "bg-blue-600 w-full" : "bg-gray-200 w-0"
                }`}
              ></div>
            </div>
          </div>
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
            <span className="ml-2 text-sm font-medium">Upload Images</span>
          </div>
        </div>
      </div>

      {/* Step 1: Product Details */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                {...register("name", {
                  required: "Product name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0.01, message: "Price must be greater than 0" },
                  valueAsNumber: true,
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                {...register("stock", {
                  required: "Stock is required",
                  min: { value: 0, message: "Stock cannot be negative" },
                  valueAsNumber: true,
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.stock ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.stock.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                {...register("sku", { required: "SKU is required" })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.sku ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.sku.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price (for discount)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("fakePrice", { valueAsNumber: true })}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("weight", { valueAsNumber: true })}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="border-t pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Upload Images */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                Click to upload images
              </span>
              <span className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB
              </span>
            </label>
          </div>

          {uploadedImages.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                Uploaded Images ({uploadedImages.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((img, index) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.previewUrl}
                      alt={img.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                        Primary
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                * First image will be used as the primary product image
              </p>
            </div>
          )}

          {uploadedImages.length === 0 && uploadingImages.length === 0 && (
            <p className="text-sm text-red-600 text-center">
              Please upload at least one product image
            </p>
          )}

          <div className="border-t pt-4 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={uploadedImages.length === 0 || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>{mode === "add" ? "Add Product" : "Save Changes"}</>
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProductForm;
