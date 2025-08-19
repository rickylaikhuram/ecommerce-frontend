import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Check, FolderOpen, X } from "lucide-react";
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

interface SignedUrlResponse {
  index: number;
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

interface SubCategoryFormProps {
  mode: "add" | "edit";
  initialData?: {
    id?: string;
    name?: string;
    parentId?: string | null; // ✅ Fixed: Allow both string and null
    imageUrl?: string;
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imageUrl || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SubCategoryFormData>({
    defaultValues: {
      name: initialData?.name || "",
      parentId: parentCategory?.id || initialData?.parentId || "",
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (parentCategory) {
      setValue("parentId", parentCategory.id);
    }
  }, [parentCategory, setValue]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
    }
  };

  /**
   * Upload file to presigned S3 URL
   */
  const uploadToS3 = async (uploadUrl: string, file: File): Promise<void> => {
    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
  };

  const handleFormSubmit = async (data: SubCategoryFormData) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      let imageUrl: string | null = initialData?.imageUrl || null;

      // Step 1 - If new image selected → Request signed URL & upload
      if (selectedFile) {
        const presignedResponse = await instance.post(
          "/api/admin/add/images/presigned-urls",
          {
            files: [
              {
                fileName: selectedFile.name,
                fileType: selectedFile.type,
              },
            ],
            folderName: "subcategories",
          }
        );

        const signedUrls: SignedUrlResponse[] =
          presignedResponse.data.signedUrls;

        if (!signedUrls || signedUrls.length === 0) {
          throw new Error("Failed to get signed URL for subcategory image");
        }

        const { uploadUrl, publicUrl } = signedUrls[0];

        // Step 2 - upload file to S3
        await uploadToS3(uploadUrl, selectedFile);

        // Step 3 - use returned publicUrl as DB's `imageUrl`
        imageUrl = publicUrl;
      }

      // Step 4 - Send final JSON to backend
      const payload = {
        name: data.name,
        parentId: data.parentId,
        altText: data.name, // use subcategory name as alt text
        imageUrl,
      };

      if (mode === "edit" && initialData?.id) {
        await instance.put(
          `/api/admin/update/category/${initialData.id}`,
          payload
        );
      } else {
        await instance.post("/api/admin/add/category", payload);
      }

      onSubmit();
    } catch (error: any) {
      console.error("Error saving subcategory:", error);
      setSubmitError(
        error.response?.data?.message || "Failed to save subcategory"
      );
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
                    disabled={mode === "edit" || !!parentCategory}
                  >
                    <option value="">Select a parent category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {(mode === "edit" || parentCategory) &&
                    selectedCategoryName && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <FolderOpen className="w-4 h-4" />
                        <span>
                          Parent category:{" "}
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory Image *
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("imageFile", {
                  required: mode === "add" ? "Image is required" : false,
                  onChange: handleImageChange,
                })}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                file:rounded-md file:border-0 file:text-sm 
                file:font-semibold file:bg-blue-50 file:text-blue-700 
                hover:file:bg-blue-100"
              />
              {previewUrl && (
                <div className="mt-3 relative w-32 h-32">
                  <img
                    src={`${S3_BASE_URL}${previewUrl}`}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {errors.imageFile && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.imageFile.message as string}
                </p>
              )}
            </div>

            {/* Errors */}
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