import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Check } from "lucide-react";
import instance from "../../utils/axios";

interface CategoryFormData {
  name: string;
}

interface CategoryFormProps {
  mode: "add" | "edit";
  initialData?: {
    id?: string;
    name?: string;
  } | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const handleFormSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (mode === "edit" && initialData?.id) {
        // For edit mode - only send the name as per your backend expects
        await instance.put(`/admin/update/category/${initialData.id}`, {
          name: data.name,
        });
      } else {
        // For add mode - send name and parentId as null for top-level category
        await instance.post("/admin/add/category", {
          name: data.name,
          parentId: null,
        });
      }

      // Reset form after successful submission
      reset();
      onSubmit();
    } catch (error: any) {
      console.error("Category form error:", error);
      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          `Failed to ${mode === "edit" ? "update" : "create"} category`
      );
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
            {mode === "add" ? "Add Category" : "Edit Category"}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === "add"
              ? "Create a new top-level category"
              : `Edit category "${initialData?.name}"`}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                {...register("name", {
                  required: "Category name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name must be less than 50 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9\s\-_&]+$/,
                    message:
                      "Category name can only contain letters, numbers, spaces, hyphens, underscores, and ampersands",
                  },
                })}
                placeholder="e.g., Football Jerseys"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

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
                    {mode === "edit" ? "Update Category" : "Create Category"}
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

export default CategoryForm;
