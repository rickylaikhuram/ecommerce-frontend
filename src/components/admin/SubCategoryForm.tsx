import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { 
  Loader2, 
  Check, 
  FolderOpen, 
  X, 
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  XCircle 
} from "lucide-react";
import instance from "../../utils/axios";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

interface Category {
  id: string;
  name: string;
}

interface SubCategoryFormData {
  name: string;
  parentId: string;
  imageFile?: FileList;
}

interface SubCategoryImage {
  id: string;
  imageUrl: string;
  altText?: string;
}

interface ImageData {
  id: string;
  file?: File;
  previewUrl: string;
  imageUrl?: string; // S3 key for existing images
  altText: string;
  isExisting: boolean;
  isDeleted?: boolean;
}

interface UploadStatus {
  fileName: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

interface SubCategoryFormProps {
  mode: "add" | "edit";
  initialData?: {
    id?: string;
    name?: string;
    parentId?: string | null;
    imageUrl?: string;
    images?: SubCategoryImage[]; // Support for multiple images if needed
  } | null;
  parentCategory?: Category | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
  mode,
  initialData,
  parentCategory,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  // Simplified image state management
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [deleteImage, setDeleteImage] = useState(false); // Boolean flag for deletion
  
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "uploading" | "saving" | "success" | "error"
  >("idle");
  
  const uploadRequestRef = useRef<XMLHttpRequest | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SubCategoryFormData>({
    defaultValues: {
      name: initialData?.name || "",
      parentId: parentCategory?.id || initialData?.parentId || "",
    },
  });

  // Helper function to construct complete image URL
  const constructImageUrl = (imageUrl: string): string => {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    if (!S3_BASE_URL) {
      console.error('S3_BASE_URL is not defined in environment variables');
      return imageUrl;
    }
    
    const baseUrl = S3_BASE_URL.endsWith('/') ? S3_BASE_URL : `${S3_BASE_URL}/`;
    const imagePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    
    return `${baseUrl}${imagePath}`;
  };

  // Convert existing image to ImageData format
  const convertExistingImage = (imageUrl: string): ImageData => {
    const fullImageUrl = constructImageUrl(imageUrl);
    
    return {
      id: initialData?.id ? `existing-${initialData.id}` : 'existing-1',
      previewUrl: fullImageUrl,
      imageUrl: imageUrl, // Keep original for backend operations
      altText: initialData?.name || 'Subcategory image',
      isExisting: true,
    };
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (parentCategory) {
      setValue("parentId", parentCategory.id);
    }
  }, [parentCategory, setValue]);

  // Reset form with initial data for edit mode
  useEffect(() => {
    if (initialData && mode === "edit" && categories.length > 0) {
      const formData = {
        name: initialData.name || "",
        parentId: parentCategory?.id || initialData.parentId || "",
      };

      reset(formData);

      // Set up existing image
      if (initialData.imageUrl) {
        const existingImage = convertExistingImage(initialData.imageUrl);
        setImageData(existingImage);
      } else {
        setImageData(null);
      }
      
      // Reset delete flag
      setDeleteImage(false);
    }
  }, [initialData, mode, reset, categories, parentCategory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (imageData?.file && imageData.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageData.previewUrl);
      }
      uploadRequestRef.current?.abort();
    };
  }, []);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await instance.get("/api/admin/topcategories");
      const data = response.data.categories;
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setSubmitError("Failed to load categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Image validation
  const validateImage = (file: File): { valid: boolean; error?: string } => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png", 
      "image/webp",
      "image/gif",
      "image/avif",
    ];

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: "Only JPEG, PNG, WebP, GIF, and AVIF images are allowed",
      };
    }

    if (file.size > MAX_SIZE) {
      return { valid: false, error: "File size must be less than 10MB" };
    }

    return { valid: true };
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file
    const validation = validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      e.target.value = "";
      return;
    }

    // If there's an existing image, mark it for deletion
    if (imageData?.isExisting) {
      setDeleteImage(true);
    }

    // Clean up previous preview URL
    if (imageData?.file && imageData.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageData.previewUrl);
    }

    // Create new image data
    const newImageData: ImageData = {
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      altText: file.name,
      isExisting: false,
    };

    setImageData(newImageData);
    e.target.value = "";
  };

  const removeImage = () => {
    if (!imageData) return;

    // If it's an existing image, mark for deletion
    if (imageData.isExisting) {
      setDeleteImage(true);
    }

    // Clean up blob URL if it's a new image
    if (imageData.file && imageData.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageData.previewUrl);
    }

    setImageData(null);
  };

  // Upload to S3 with progress tracking
  const uploadToS3WithProgress = (
    uploadUrl: string,
    file: File,
    onProgress: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      uploadRequestRef.current = xhr;

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
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
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

  const uploadNewImage = async (file: File) => {
    try {
      setSubmitStatus("uploading");

      // Initialize upload status
      setUploadStatus({
        fileName: file.name,
        progress: 0,
        status: "uploading",
      });

      // Step 1: Get presigned URL from backend
      const presignedResponse = await instance.post(
        "/api/admin/add/images/presigned-urls",
        {
          files: [{
            fileName: file.name,
            fileType: file.type,
          }],
          folderName: "subcategories",
        }
      );

      if (!presignedResponse.data || !presignedResponse.data.signedUrls) {
        throw new Error("Failed to get presigned URL");
      }

      const { signedUrls } = presignedResponse.data;
      const signedUrlData = signedUrls[0];

      // Step 2: Upload to S3 with progress tracking
      await uploadToS3WithProgress(
        signedUrlData.uploadUrl,
        file,
        (progress) => {
          setUploadStatus(prev => prev ? { ...prev, progress } : null);
        }
      );

      // Update status to completed
      setUploadStatus(prev => prev ? { 
        ...prev, 
        progress: 100, 
        status: "completed" 
      } : null);

      return {
        imageKey: signedUrlData.key,
        altText: file.name,
      };
    } catch (error) {
      setUploadStatus(prev => prev ? { 
        ...prev, 
        status: "error" 
      } : null);
      throw error;
    }
  };

  const handleFormSubmit = async (data: SubCategoryFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitError("");
    setUploadStatus(null);

    try {
      let submitData: any;

      if (mode === "add") {
        // For add mode, upload image if provided
        let imageUrl: string | null = null;
        
        if (imageData?.file) {
          const uploadedImage = await uploadNewImage(imageData.file);
          imageUrl = uploadedImage.imageKey;
        }

        setSubmitStatus("saving");

        submitData = {
          name: data.name,
          parentId: data.parentId,
          altText: data.name,
          imageUrl,
        };

        // Submit to backend
        const response = await instance.post("/api/admin/add/category", submitData);
        console.log("Subcategory created:", response.data);
      } else {
        // For edit mode, prepare data according to new backend format
        let updatedImages: any[] = [];

        // If there's a new image, upload it first
        if (imageData && !imageData.isExisting && imageData.file) {
          const uploadedImage = await uploadNewImage(imageData.file);
          updatedImages = [{
            imageKey: uploadedImage.imageKey,
            altText: uploadedImage.altText || data.name,
          }];
        }

        setSubmitStatus("saving");

        submitData = {
          name: data.name,
          parentId: data.parentId,
          altText: data.name,
          deleteImage: deleteImage, // Boolean flag
          updatedImages: updatedImages, // Array (empty if no new image)
        };

        console.log("Edit mode submit data:", submitData);

        // Submit to backend
        const response = await instance.put(
          `/api/admin/update/subcategory/${initialData?.id}`,
          submitData
        );
        console.log("Subcategory updated:", response.data);
      }

      setSubmitStatus("success");

      // Wait a bit to show success status
      setTimeout(() => {
        onSubmit();
      }, 800);
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

  const selectedCategoryName = categories.find(
    (cat) => cat.id === watch("parentId")
  )?.name;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "add" ? "Add Subcategory" : "Edit Subcategory"}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === "add"
              ? "Create a new subcategory"
              : `Edit subcategory "${initialData?.name}"`}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Parent Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Category *
              </label>
              {isLoadingCategories ? (
                <div className="flex items-center justify-center py-3 border border-gray-300 rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    Loading categories...
                  </span>
                </div>
              ) : (
                <>
                  <select
                    {...register("parentId", {
                      required: "Please select a parent category",
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.parentId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a parent category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {selectedCategoryName && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <FolderOpen className="w-4 h-4" />
                      <span>
                        Selected parent:{" "}
                        <strong>{selectedCategoryName}</strong>
                      </span>
                    </div>
                  )}
                </>
              )}
              {errors.parentId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.parentId.message}
                </p>
              )}
            </div>

            {/* Subcategory Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory Name *
              </label>
              <input
                {...register("name", {
                  required: "Subcategory name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name must be less than 50 characters",
                  },
                })}
                placeholder="e.g., Premier League"
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

            {/* Enhanced Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory Image {mode === "add" ? "*" : "(Optional)"}
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Upload a high-quality image for the subcategory.
                {mode === "edit" && " You can replace the existing image or remove it."}
              </p>

              {!imageData ? (
                // Upload area when no image
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
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
                      Click to browse or drag & drop image here
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      PNG, JPG, WebP up to 10MB
                    </p>
                  </label>
                </div>
              ) : (
                // Preview area when image exists
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={imageData.previewUrl}
                      alt={imageData.altText}
                      className={`w-48 h-48 object-cover rounded-lg border-2 ${
                        imageData.isExisting ? "border-blue-200" : "border-green-200"
                      }`}
                      onError={(e) => {
                        console.error(`Failed to load image: ${imageData.previewUrl}`, e);
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA3NEMxMDMuNTY5IDc0IDExNyA4Ny40MzE1IDExNyAxMDRWMTA5SDgzVjEwNEM4MyA4Ny40MzE1IDk2LjQzMTUgNzQgMTEzIDc0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {mode === "edit" && (
                      <span
                        className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded ${
                          imageData.isExisting ? "bg-blue-500" : "bg-green-500"
                        }`}
                      >
                        {imageData.isExisting ? "Current" : "New"}
                      </span>
                    )}
                  </div>
                  
                  {/* Replace button */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-replace"
                    />
                    <label
                      htmlFor="image-replace"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Replace Image
                    </label>
                  </div>
                </div>
              )}

              {/* Validation error for add mode */}
              {mode === "add" && !imageData && (
                <input
                  type="hidden"
                  {...register("imageFile", {
                    required: "Image is required for new subcategory",
                    validate: () => imageData !== null || "Please select an image",
                  })}
                />
              )}
              {errors.imageFile && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.imageFile.message as string}
                </p>
              )}
            </div>

            {/* Upload Progress Display */}
            {isSubmitting && uploadStatus && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {submitStatus === "uploading" && "Uploading Image..."}
                    {submitStatus === "saving" && (mode === "add" ? "Creating Subcategory..." : "Updating Subcategory...")}
                    {submitStatus === "success" && (mode === "add" ? "Subcategory Created!" : "Subcategory Updated!")}
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

                {/* Image upload progress */}
                {uploadStatus && submitStatus === "uploading" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 truncate max-w-[200px]">
                        {uploadStatus.fileName}
                      </span>
                      <span className="text-gray-500">
                        {uploadStatus.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          uploadStatus.status === "completed"
                            ? "bg-green-500"
                            : uploadStatus.status === "error"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${uploadStatus.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {submitStatus === "success" && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">
                      {mode === "add"
                        ? "Subcategory created successfully!"
                        : "Subcategory updated successfully!"}{" "}
                      Redirecting...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* General Errors */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoadingCategories}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {mode === "edit" ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {mode === "edit"
                      ? "Update Subcategory"
                      : "Create Subcategory"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryForm;