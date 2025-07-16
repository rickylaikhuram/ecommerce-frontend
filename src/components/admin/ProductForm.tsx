import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Plus,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Image as ImageIcon,
  Package,
  DollarSign,
  FileText,
} from "lucide-react";
import type { Product } from "../../types/temp.types";

interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: Product | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: { sizeName: string; sizeCode: string; stock: number }[];
  images: File[];
}

interface UploadStatus {
  fileName: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      category: initialData?.category || "",
      sizes: [{ sizeName: "Small", sizeCode: "S", stock: 0 }],
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  const watchedImages = watch("images");

  // Fetch categories from backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback categories for demo
      setCategories([
        "Football Jerseys",
        "Training Wear",
        "Fan Merchandise",
        "Retro Collection",
      ]);
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: FileText },
    { number: 2, title: "Pricing & Stock", icon: Package },
    { number: 3, title: "Images", icon: ImageIcon },
    { number: 4, title: "Review", icon: Check },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImages = watch("images") || [];

    // Limit to 10 images
    if (currentImages.length + files.length > 10) {
      alert("You can upload a maximum of 10 images");
      return;
    }

    setValue("images", [...currentImages, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const currentImages = watch("images");
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue("images", newImages);

    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
  };

  const uploadImages = async (images: File[]) => {
    const uploadPromises = images.map(async (file, index) => {
      setUploadStatuses((prev) => [
        ...prev,
        {
          fileName: file.name,
          progress: 0,
          status: "uploading",
        },
      ]);

      try {
        // Simulate getting presigned URL and uploading
        // Replace with your actual S3 upload logic
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setUploadStatuses((prev) =>
            prev.map((status, idx) =>
              idx === index ? { ...status, progress: i } : status
            )
          );
        }

        setUploadStatuses((prev) =>
          prev.map((status, idx) =>
            idx === index ? { ...status, status: "completed" } : status
          )
        );

        return `https://s3-bucket.com/${file.name}`;
      } catch (error) {
        setUploadStatuses((prev) =>
          prev.map((status, idx) =>
            idx === index ? { ...status, status: "error" } : status
          )
        );
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  const handleFormSubmit = async (data: FormData) => {
    console.log("Form submitted!", data);
    setIsSubmitting(true);
    setUploadStatuses([]);

    try {
      // Upload images and get URLs
      const imageUrls = await uploadImages(data.images);

      const submitData = {
        ...data,
        images: imageUrls,
      };

      await onSubmit(submitData);
      navigate("/admin/products");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    console.log("Next step clicked, current step:", currentStep);
    
    const fieldsToValidate =
      currentStep === 1
        ? ["name", "description", "category"]
        : currentStep === 2
        ? ["price", "sizes"]
        : [];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinalSubmit = () => {
    handleSubmit(handleFormSubmit)();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                placeholder="e.g., Manchester United Home Jersey 2024"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 20,
                    message: "Description must be at least 20 characters",
                  },
                })}
                rows={4}
                placeholder="Describe the jersey details, material, features..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register("category", {
                  required: "Please select a category",
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register("price", {
                    required: "Price is required",
                    min: {
                      value: 0.01,
                      message: "Price must be greater than 0",
                    },
                  })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Size & Stock *
                </label>
                <button
                  type="button"
                  onClick={() =>
                    append({ sizeName: "", sizeCode: "", stock: 0 })
                  }
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Size
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        {...register(`sizes.${index}.sizeName` as const, {
                          required: "Size name is required",
                        })}
                        placeholder="e.g., Small"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        {...register(`sizes.${index}.sizeCode` as const, {
                          required: "Code is required",
                        })}
                        placeholder="e.g., S"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        {...register(`sizes.${index}.stock` as const, {
                          required: "Stock is required",
                          min: {
                            value: 0,
                            message: "Stock cannot be negative",
                          },
                        })}
                        type="number"
                        placeholder="Stock"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (Max 10)
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Upload high-quality images of the jersey from different angles
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-base text-gray-600">
                    Drag & drop images here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPG, WebP up to 10MB each
                  </p>
                </label>
              </div>

              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

            case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Review Your Product
            </h3>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <span className="text-sm text-gray-500">Product Name:</span>
                <p className="font-medium text-gray-900">{watch("name")}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Category:</span>
                <p className="font-medium text-gray-900">{watch("category")}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Price:</span>
                <p className="font-medium text-gray-900">${watch("price")}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Description:</span>
                <p className="text-sm text-gray-700 mt-1">{watch("description")}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Sizes & Stock:</span>
                <div className="mt-2 space-y-1">
                  {watch("sizes").map((size, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      {size.sizeName} ({size.sizeCode}): {size.stock} units
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-500">Images:</span>
                <p className="font-medium text-gray-900 mb-3">
                  {imagePreviewUrls.length} images selected
                </p>
                
                {/* Show image previews in review */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Upload Status Display - This only shows during actual submission */}
            {isSubmitting && uploadStatuses.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Upload Progress
                </h4>
                {uploadStatuses.map((status, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                        {status.fileName}
                      </span>
                      {status.status === "uploading" && (
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      )}
                      {status.status === "completed" && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                      {status.status === "error" && (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status.status === "completed"
                            ? "bg-green-500"
                            : status.status === "error"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${status.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "add" ? "Add Product" : "Edit Product"}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === "add" ? "Create a new product listing" : `Edit Product with id ${initialData?.id || ""}`}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive
                          ? "text-blue-600"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-colors ${
                        currentStep > step.number
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Content - NO FORM TAG WRAPPING EVERYTHING */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons - OUTSIDE ANY FORM */}
        <div className="flex justify-between mt-8">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {mode === "add" ? "Create Product" : "Update Product"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Loading overlay when submitting */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {mode === "add" ? "Creating Your Product" : "Updating Your Product"}
                </h3>
                <p className="text-gray-600">
                  Please wait while we upload your images and save the product
                  details...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;