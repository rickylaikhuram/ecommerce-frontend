import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Check, FolderOpen } from "lucide-react";
import instance from "../../utils/axios";

interface Category {
  id: string;
  name: string;
}

interface SubCategoryFormData {
  name: string;
  parentId: string;
}

interface SubCategoryFormProps {
  mode: "add" | "edit";
  initialData?: {
    id?: string;
    name?: string;
    parentId?: string;
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

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await instance.get("/api/admin/get/topcategories");
      const data = response.data.categories;

      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setSubmitError("Failed to load categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleFormSubmit = async (data: SubCategoryFormData) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (mode === "edit" && initialData?.id) {
        await instance.put(`/api/admin/update/category/${initialData.id}`, {
          name: data.name,
          parentId: data.parentId,
        });
      } else {
        await instance.post("/api/admin/add/category", {
          name: data.name,
          parentId: data.parentId,
        });
      }

      onSubmit();
    } catch (error: any) {
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
