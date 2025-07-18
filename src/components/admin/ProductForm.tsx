import React, { useState, useEffect, useRef } from "react";
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
  IndianRupee,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import instance from "../../utils/axios";
import type {
  FormData,
  UploadStatus,
  Category,
  ProductFormProps,
} from "../../types/products.types";

const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "uploading" | "saving" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState<string>("");
  const uploadRequestsRef = useRef<XMLHttpRequest[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      originalPrice: initialData?.price || 0,
      discountedPrice: initialData?.price || 0,
      category: initialData?.category?.name || "",
      sizes: [{ sizeName: "Small", sizeCode: "S", stock: 1 }],
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  // Fetch categories from backend
  useEffect(() => {
    fetchCategories();
  }, []);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      // Cancel any ongoing uploads
      uploadRequestsRef.current.forEach((xhr) => xhr?.abort());
    };
  }, [imagePreviewUrls]);

  const fetchCategories = async () => {
    try {
      const response = await instance.get("/api/admin/get/categories");
      setCategories(response.data.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: FileText },
    { number: 2, title: "Pricing & Stock", icon: Package },
    { number: 3, title: "Images", icon: ImageIcon },
    { number: 4, title: "Review", icon: Check },
  ];

  // Image validation
  const validateImage = (file: File): { valid: boolean; error?: string } => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",

      // ✅ Video formats
      "video/mp4",
      "video/webm",
      "video/quicktime", // .mov
      "video/x-matroska", // .mkv
      "video/avi",
    ];

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error:
          "Only JPEG, PNG, WebP, and AVIF images and mp4, webm, mov, mkv, avi videos are allowed",
      };
    }

    if (file.size > MAX_SIZE) {
      return { valid: false, error: "Image size must be less than 10MB" };
    }

    return { valid: true };
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImages = watch("images") || [];

    // Validate each file
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const validation = validateImage(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      alert(errors.join("\n"));
    }

    // Limit to 10 images
    if (currentImages.length + validFiles.length > 10) {
      alert("You can upload a maximum of 10 images");
      return;
    }

    setValue("images", [...currentImages, ...validFiles]);

    // Create preview URLs
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const currentImages = watch("images");
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue("images", newImages);

    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    const dragImage = e.currentTarget.querySelector("img");
    if (dragImage) {
      e.dataTransfer.setDragImage(dragImage, 50, 50);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const currentImages = watch("images");
    const newImages = [...currentImages];
    const newPreviewUrls = [...imagePreviewUrls];

    const [draggedImage] = newImages.splice(draggedIndex, 1);
    const [draggedUrl] = newPreviewUrls.splice(draggedIndex, 1);

    newImages.splice(dropIndex, 0, draggedImage);
    newPreviewUrls.splice(dropIndex, 0, draggedUrl);

    setValue("images", newImages);
    setImagePreviewUrls(newPreviewUrls);
    setDraggedIndex(null);
  };

  // Upload to S3 with progress tracking and retry
  const uploadToS3WithProgress = (
    uploadUrl: string,
    file: File,
    onProgress: (progress: number) => void,
    index: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      uploadRequestsRef.current[index] = xhr;

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          console.error("Upload failed:", xhr.responseText);
          reject(
            new Error(
              `Upload failed with status ${xhr.status}: ${xhr.responseText}`
            )
          );
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload cancelled"));
      });

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  };

  const uploadImages = async (images: File[]) => {
    try {
      setSubmitStatus("uploading");

      // Initialize upload statuses
      setUploadStatuses(
        images.map((file) => ({
          fileName: file.name,
          progress: 0,
          status: "uploading" as const,
        }))
      );

      // Step 1: Prepare file data for presigned URL generation
      const filesData = images.map((file) => ({
        fileName: file.name,
        fileType: file.type,
      }));

      // Step 2: Get presigned URLs from backend
      const presignedResponse = await instance.post(
        "/api/admin/add/product/images/presigned-urls",
        {
          files: filesData,
        }
      );

      if (!presignedResponse.data || !presignedResponse.data.signedUrls) {
        throw new Error("Failed to get presigned URLs");
      }

      const { signedUrls } = presignedResponse.data;

      // Step 3: Upload images to S3 using presigned URLs with progress tracking
      const uploadPromises = images.map(async (file, index) => {
        const signedUrlData = signedUrls[index];
        try {
          // Upload to S3 with progress tracking
          await uploadToS3WithProgress(
            signedUrlData.uploadUrl,
            file,
            (progress) => {
              setUploadStatuses((prev) =>
                prev.map((status, idx) =>
                  idx === index ? { ...status, progress } : status
                )
              );
            },
            index
          );

          // Update status to completed
          setUploadStatuses((prev) =>
            prev.map((status, idx) =>
              idx === index
                ? { ...status, progress: 100, status: "completed" as const }
                : status
            )
          );

          // Return the image data in the format expected by backend
          return {
            imageKey: signedUrlData.key,
            altText: file.name,
            position: index,
            isMain: index === 0,
          };
        } catch (error) {
          setUploadStatuses((prev) =>
            prev.map((status, idx) =>
              idx === index ? { ...status, status: "error" as const } : status
            )
          );
          throw error;
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      return uploadedImages;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    console.log("Form submitted!", data);
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitError("");
    setUploadStatuses([]);

    try {
      // Upload images and get image data
      const uploadedImages = await uploadImages(data.images);

      setSubmitStatus("saving");

      // Prepare product data for backend with stock data as requested
      const submitData = {
        category: data.category,
        name: data.name,
        description: data.description,
        price: data.originalPrice,
        fakePrice: data.discountedPrice,
        images: uploadedImages,
        productStocks: data.sizes.map((size) => ({
          stockName: size.sizeCode,
          stock: size.stock,
        })),
      };

      // Submit to backend
      const response = await instance.post(
        "/api/admin/add/product",
        submitData
      );

      console.log("Product created:", response.data);
      setSubmitStatus("success");

      // Call the onSubmit prop if needed
      if (onSubmit) {
        await onSubmit(submitData);
      }

      // Wait a bit to show success status
      setTimeout(() => {
        navigate("/products");
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error submitting form. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to check for duplicate size codes or names
  const validateSizeUniqueness = (sizes: any[]) => {
    const sizeCodes = sizes.map((s) => s.sizeCode.toUpperCase());
    const sizeNames = sizes.map((s) => s.sizeName.toLowerCase());

    const duplicateCodes = sizeCodes.filter(
      (code, index) => sizeCodes.indexOf(code) !== index
    );
    const duplicateNames = sizeNames.filter(
      (name, index) => sizeNames.indexOf(name) !== index
    );

    return {
      hasDuplicateCodes: duplicateCodes.length > 0,
      hasDuplicateNames: duplicateNames.length > 0,
      duplicateCodes,
      duplicateNames,
    };
  };

  const nextStep = async () => {
    console.log("Next step clicked, current step:", currentStep);

    if (currentStep === 1) {
      const fieldsToValidate = ["name", "description", "category"];
      const isValid = await trigger(fieldsToValidate as any);
      if (isValid) {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 2) {
      // Validate prices
      const priceValid = await trigger([
        "originalPrice",
        "discountedPrice",
      ] as any);

      // Check if at least one size is added
      if (!fields.length || fields.length === 0) {
        setError("sizes", {
          type: "manual",
          message: "Please add at least one size with stock information",
        });
        return;
      }

      // Validate all size fields
      const sizesValid = await trigger("sizes" as any);

      if (priceValid && sizesValid) {
        // Additional validation for sizes
        const currentSizes = watch("sizes");
        let hasErrors = false;

        // Check for stock = 0
        currentSizes.forEach((size, index) => {
          if (size.stock === 0 || !size.stock) {
            setError(`sizes.${index}.stock`, {
              type: "manual",
              message: "Stock must be greater than 0",
            });
            hasErrors = true;
          }
        });

        // Check for duplicate size codes and names
        const uniquenessCheck = validateSizeUniqueness(currentSizes);

        if (uniquenessCheck.hasDuplicateCodes) {
          currentSizes.forEach((size, index) => {
            if (
              uniquenessCheck.duplicateCodes.includes(
                size.sizeCode.toUpperCase()
              )
            ) {
              setError(`sizes.${index}.sizeCode`, {
                type: "manual",
                message: "Size code must be unique",
              });
              hasErrors = true;
            }
          });
        }

        if (uniquenessCheck.hasDuplicateNames) {
          currentSizes.forEach((size, index) => {
            if (
              uniquenessCheck.duplicateNames.includes(
                size.sizeName.toLowerCase()
              )
            ) {
              setError(`sizes.${index}.sizeName`, {
                type: "manual",
                message: "Size name must be unique",
              });
              hasErrors = true;
            }
          });
        }

        if (!hasErrors) {
          setCurrentStep(currentStep + 1);
        }
      }
    } else if (currentStep === 3) {
      // Validate images
      const images = watch("images");
      if (!images || images.length === 0) {
        alert("Please upload at least one product image");
        return;
      }
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
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
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
                Original Price (₹) *
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register("originalPrice", {
                    required: "Original Price is required",
                    min: {
                      value: 1,
                      message: "Price must be greater than 0",
                    },
                    valueAsNumber: true,
                  })}
                  type="number"
                  step="1"
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.originalPrice ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.originalPrice && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.originalPrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discounted Price (₹) *
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register("discountedPrice", {
                    required: "Discounted Price is required",
                    min: {
                      value: 1,
                      message: "Price must be greater than 0",
                    },
                    valueAsNumber: true,
                    validate: (value) => {
                      const originalPrice = watch("originalPrice") || 0;
                      if (value > originalPrice) {
                        return "Discounted price cannot be more than original price";
                      }
                      return true;
                    },
                  })}
                  type="number"
                  step="1"
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.discountedPrice
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {errors.discountedPrice && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.discountedPrice.message}
                </p>
              )}
              {watch("originalPrice") &&
                watch("discountedPrice") &&
                watch("discountedPrice") < watch("originalPrice") && (
                  <span className="text-green-600 text-sm ml-2">
                    (
                    {Math.round(
                      ((watch("originalPrice") - watch("discountedPrice")) /
                        watch("originalPrice")) *
                        100
                    )}
                    % off)
                  </span>
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

              {errors.sizes && !fields.length && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.sizes.message}</p>
                </div>
              )}

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        {...register(`sizes.${index}.sizeName` as const, {
                          required: "Size name is required",
                          validate: (value) => {
                            if (!value || value.trim() === "") {
                              return "Size name is required";
                            }
                            return true;
                          },
                        })}
                        placeholder="e.g., Small"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.sizes?.[index]?.sizeName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.sizes?.[index]?.sizeName && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.sizes[index].sizeName.message}
                        </p>
                      )}
                    </div>
                    <div className="w-24">
                      <input
                        {...register(`sizes.${index}.sizeCode` as const, {
                          required: "Code is required",
                          validate: (value) => {
                            if (!value || value.trim() === "") {
                              return "Size code is required";
                            }
                            return true;
                          },
                        })}
                        placeholder="e.g., S"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.sizes?.[index]?.sizeCode
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.sizes?.[index]?.sizeCode && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.sizes[index].sizeCode.message}
                        </p>
                      )}
                    </div>
                    <div className="w-32">
                      <input
                        {...register(`sizes.${index}.stock` as const, {
                          required: "Stock is required",
                          min: {
                            value: 1,
                            message: "Stock must be at least 1",
                          },
                          valueAsNumber: true,
                        })}
                        type="number"
                        placeholder="Stock"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.sizes?.[index]?.stock
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.sizes?.[index]?.stock && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.sizes[index].stock.message}
                        </p>
                      )}
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

              {fields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-2">No sizes added yet</p>
                  <button
                    type="button"
                    onClick={() =>
                      append({ sizeName: "", sizeCode: "", stock: 0 })
                    }
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Click here to add your first size
                  </button>
                </div>
              )}
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
                Upload high-quality images of the jersey from different angles.
                Drag to reorder.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  disabled={imagePreviewUrls.length >= 10}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer flex flex-col items-center ${
                    imagePreviewUrls.length >= 10
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-base text-gray-600">
                    Drag & drop images here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPG, WebP up to 10MB each
                  </p>
                  {imagePreviewUrls.length > 0 && (
                    <p className="text-sm text-blue-600 mt-2">
                      {imagePreviewUrls.length}/10 images selected
                    </p>
                  )}
                </label>
              </div>

              {imagePreviewUrls.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-3">
                    Drag images to reorder. First image will be the main product
                    image.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`relative group cursor-move ${
                          draggedIndex === index ? "opacity-50" : ""
                        }`}
                      >
                        {index === 0 && (
                          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">
                            Main
                          </span>
                        )}
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Original Price:</span>
                  <p className="font-medium text-gray-900">
                    ₹{watch("originalPrice") || 0}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    Discounted Price:
                  </span>
                  <p className="font-medium text-gray-900">
                    ₹{watch("discountedPrice") || 0}
                    {watch("originalPrice") &&
                      watch("discountedPrice") &&
                      watch("discountedPrice") < watch("originalPrice") && (
                        <span className="text-green-600 text-sm ml-2">
                          (
                          {Math.round(
                            ((watch("originalPrice") -
                              watch("discountedPrice")) /
                              watch("originalPrice")) *
                              100
                          )}
                          % off)
                        </span>
                      )}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-500">Description:</span>
                <p className="text-sm text-gray-700 mt-1">
                  {watch("description")}
                </p>
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

                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url} // ← Make sure this is correct
                          alt={`Preview ${index + 1}`}
                          className="w-full h-16 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Improved Upload Progress Display */}
            {isSubmitting && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {submitStatus === "uploading" && "Uploading Images..."}
                    {submitStatus === "saving" && "Saving Product..."}
                    {submitStatus === "success" && "Product Created!"}
                    {submitStatus === "error" && "Upload Failed"}
                  </h4>
                  <div className="flex items-center gap-2">
                    {submitStatus === "uploading" && (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    )}
                    {submitStatus === "saving" && (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    )}
                    {submitStatus === "success" && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                    {submitStatus === "error" && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </div>

                {/* Individual file progress */}
                {uploadStatuses.length > 0 && submitStatus === "uploading" && (
                  <div className="space-y-2">
                    {uploadStatuses.map((status, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 truncate max-w-[200px]">
                            {status.fileName}
                          </span>
                          <span className="text-gray-500">
                            {status.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
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

                {/* Overall progress */}
                {uploadStatuses.length > 0 && submitStatus === "uploading" && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Overall Progress</span>
                      <span>
                        {
                          uploadStatuses.filter((s) => s.status === "completed")
                            .length
                        }{" "}
                        / {uploadStatuses.length} files
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (uploadStatuses.filter(
                              (s) => s.status === "completed"
                            ).length /
                              uploadStatuses.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {submitStatus === "error" && submitError && (
                  <div className="mt-2 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}

                {submitStatus === "success" && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">
                      Product created successfully! Redirecting...
                    </p>
                  </div>
                )}
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
            {mode === "add"
              ? "Create a new product listing"
              : `Edit Product with id ${initialData?.id || ""}`}
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

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
};

export default ProductForm;
