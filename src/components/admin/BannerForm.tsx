import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Loader2,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import instance from "../../utils/axios";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

interface BannerFormData {
  redirectUrl: string;
}

interface ImageData {
  id: string;
  file?: File;
  previewUrl: string;
  imageUrl?: string; // S3 key for existing images
  isExisting: boolean;
}

interface UploadStatus {
  fileName: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

interface BannerFormProps {
  mode: "add" | "edit";
  initialData?: {
    id?: string;
    imageUrl?: string;
    altText?: string;
    redirectUrl?: string;
  } | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const BannerForm: React.FC<BannerFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [imageError, setImageError] = useState(""); // Add state for image validation errors

  // Image state management
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [deleteImage, setDeleteImage] = useState(false);

  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "uploading" | "saving" | "success" | "error"
  >("idle");

  const uploadRequestRef = useRef<XMLHttpRequest | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BannerFormData>({
    defaultValues: {
      redirectUrl: initialData?.redirectUrl || "",
    },
  });

  // Helper function to construct complete image URL
  const constructImageUrl = (imageUrl: string): string => {
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    if (!S3_BASE_URL) {
      console.error("S3_BASE_URL is not defined in environment variables");
      return imageUrl;
    }

    const baseUrl = S3_BASE_URL.endsWith("/") ? S3_BASE_URL : `${S3_BASE_URL}/`;
    const imagePath = imageUrl.startsWith("/")
      ? imageUrl.substring(1)
      : imageUrl;

    return `${baseUrl}${imagePath}`;
  };

  // Convert existing image to ImageData format
  const convertExistingImage = (imageUrl: string): ImageData => {
    const fullImageUrl = constructImageUrl(imageUrl);

    return {
      id: initialData?.id ? `existing-${initialData.id}` : "existing-1",
      previewUrl: fullImageUrl,
      imageUrl: imageUrl, // Keep original for backend operations
      isExisting: true,
    };
  };

  // Reset form with initial data for edit mode
  useEffect(() => {
    if (initialData && mode === "edit") {
      // Set up existing image
      let existingImage = null;

      if (initialData.imageUrl) {
        existingImage = convertExistingImage(initialData.imageUrl);
      }

      const formData = {
        redirectUrl: initialData.redirectUrl || "",
      };

      reset(formData);
      setImageData(existingImage);

      // Reset delete flag
      setDeleteImage(false);
    }
  }, [initialData, mode, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (imageData?.file && imageData.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageData.previewUrl);
      }
      uploadRequestRef.current?.abort();
    };
  }, []);

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

  // Validate image requirements based on mode
  const validateImageRequirement = (): boolean => {
    if (mode === "add") {
      // In add mode, image is always required
      if (!imageData || !imageData.file) {
        setImageError("Image is required for new banner");
        return false;
      }
    } else if (mode === "edit") {
      // In edit mode, validate deletion logic
      if (deleteImage && (!imageData || imageData.isExisting)) {
        setImageError("You must select a replacement image when deleting the current image");
        return false;
      }
    }
    
    setImageError(""); // Clear any existing error
    return true;
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

    // Clear any image validation errors
    setImageError("");

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
      
      // In edit mode, show validation error immediately
      if (mode === "edit") {
        setImageError("You must select a replacement image when deleting the current image");
      }
    }

    // Clean up blob URL if it's a new image
    if (imageData.file && imageData.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageData.previewUrl);
    }

    setImageData(null);

    // In add mode, show error immediately since image is required
    if (mode === "add") {
      setImageError("Image is required for new banner");
    }
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
        "/admin/add/images/presigned-urls",
        {
          files: [
            {
              fileName: file.name,
              fileType: file.type,
            },
          ],
          folderName: "banners",
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
          setUploadStatus((prev) => (prev ? { ...prev, progress } : null));
        }
      );

      // Update status to completed
      setUploadStatus((prev) =>
        prev
          ? {
              ...prev,
              progress: 100,
              status: "completed",
            }
          : null
      );

      return signedUrlData.key;
    } catch (error) {
      setUploadStatus((prev) =>
        prev
          ? {
              ...prev,
              status: "error",
            }
          : null
      );
      throw error;
    }
  };

  const handleFormSubmit = async (data: BannerFormData) => {
    // Validate image requirement before proceeding
    if (!validateImageRequirement()) {
      return; // Stop submission if image validation fails
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitError("");
    setUploadStatus(null);

    try {
      let submitData: any;

      if (mode === "add") {
        // For add mode, image is required and already validated above
        if (!imageData?.file) {
          throw new Error("Image is required for new banner");
        }

        // Upload image
        const uploadedImageKey = await uploadNewImage(imageData.file);

        setSubmitStatus("saving");

        // Always use the original filename for altText in add mode
        const fileName = imageData.file.name;

        submitData = {
          imageUrl: uploadedImageKey,
          altText: fileName, // Send the complete filename as altText
          redirectUrl: data.redirectUrl,
        };

        // Submit to backend
        await instance.post("/admin/banner", submitData);
      } else {
        // For edit mode - must match editbannerSchema
        setSubmitStatus("saving");

        // Prepare updatedImages array
        const updatedImages = [];
        
        // If there's a new image, upload it first and add to updatedImages
        if (imageData && !imageData.isExisting && imageData.file) {
          const uploadedImageKey = await uploadNewImage(imageData.file);
          updatedImages.push({
            imageKey: uploadedImageKey,
            altText: imageData.file.name // Use complete filename
          });
        }

        submitData = {
          altText: initialData?.altText || "Banner Image", // Always provide altText (required by schema)
          deleteImage: deleteImage, // Always provide deleteImage (required by schema)
          updatedImages: updatedImages, // Always provide array (required by schema)
          redirectUrl: data.redirectUrl,
        };

        // Validate the schema's refine condition
        if (submitData.deleteImage && submitData.updatedImages.length === 0) {
          throw new Error("If deleting the current image, you must provide a replacement image");
        }

        // Submit to backend
        await instance.put(`/admin/banner/${initialData?.id}`, submitData);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "add" ? "Add Banner" : "Edit Banner"}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === "add"
              ? "Create a new promotional banner"
              : "Edit banner details"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Banner Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image *
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Upload a high-quality banner image. Recommended size: 1920x600px
                or similar aspect ratio.
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
                      Click to browse or drag & drop banner image here
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
                      alt="Banner preview"
                      className={`w-full max-w-2xl h-48 object-cover rounded-lg border-2 ${
                        imageData.isExisting
                          ? "border-blue-200"
                          : "border-green-200"
                      }`}
                      onError={(e) => {
                        console.error(
                          `Failed to load image: ${imageData.previewUrl}`,
                          e
                        );
                        e.currentTarget.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVIMjI1VjEyNUgxNzVWNzVaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMDAgOTBWMTEwIiBzdHJva2U9IiM2Mzc0OEIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0xOTAgMTAwSDIxMCIgc3Ryb2tlPSIjNjM3NDhCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIi8+Cjwvc3ZnPgo=";
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

              {/* Show image validation errors */}
              {imageError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600">{imageError}</p>
                </div>
              )}
            </div>

            {/* Redirect URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redirect URL *
              </label>
              <div className="relative">
                <input
                  {...register("redirectUrl", {
                    required: "Redirect URL is required",
                  })}
                  placeholder="/products?"
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.redirectUrl ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Where users will be redirected when they click the banner.
              </p>
              {errors.redirectUrl && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.redirectUrl.message}
                </p>
              )}
            </div>

            {/* Upload Progress Display */}
            {isSubmitting && uploadStatus && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {submitStatus === "uploading" && "Uploading Banner..."}
                    {submitStatus === "saving" &&
                      (mode === "add"
                        ? "Creating Banner..."
                        : "Updating Banner...")}
                    {submitStatus === "success" &&
                      (mode === "add" ? "Banner Created!" : "Banner Updated!")}
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
                        ? "Banner created successfully!"
                        : "Banner updated successfully!"}{" "}
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
                disabled={isSubmitting}
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
                    {mode === "edit" ? "Update Banner" : "Create Banner"}
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

export default BannerForm;