import React, { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import type { Address } from "../../types/user.types";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

interface AddressFormData {
  fullName: string;
  phone: string;
  alternatePhone?: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  label?: string;
  isDefault: boolean;
}

interface AddressFormProps {
  initialData?: Address | null;
  onSubmit: (
    data: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
  showTitle?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  showTitle = true,
  submitButtonText = "SAVE AND DELIVER HERE",
  cancelButtonText = "CANCEL",
}) => {
  const [isValidatingPincode, setIsValidatingPincode] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
  } = useForm<AddressFormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      alternatePhone: "",
      line1: "",
      line2: "",
      landmark: "",
      city: "",
      state: "Manipur",
      country: "India",
      zipCode: "",
      label: "Home",
      isDefault: false,
    },
  });

  const watchZipCode = watch("zipCode");

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName,
        phone: initialData.phone,
        alternatePhone: initialData.alternatePhone || "",
        line1: initialData.line1,
        line2: initialData.line2 || "",
        landmark: initialData.landmark || "",
        city: initialData.city,
        state: initialData.state,
        country: initialData.country,
        zipCode: initialData.zipCode,
        label: initialData.label || "Home",
        isDefault: initialData.isDefault,
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    const fetchLocationFromPincode = async () => {
      if (watchZipCode?.length === 6) {
        setIsValidatingPincode(true);
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${watchZipCode}`
          );
          const data = await response.json();
          if (data[0]?.Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            setValue("city", postOffice.District);
            setValue("state", postOffice.State);
          }
        } catch (error) {
          console.error("Error fetching location from pincode:", error);
        } finally {
          setIsValidatingPincode(false);
        }
      }
    };

    const timer = setTimeout(() => {
      if (watchZipCode?.length === 6) {
        fetchLocationFromPincode();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [watchZipCode, setValue]);

  const handleFormSubmit = async (data: AddressFormData) => {
    try {
      setApiError(null);
      await onSubmit(data);
      reset();
    } catch (error: any) {
      console.error("Error saving address:", error);
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach((field) => {
          setError(field as keyof AddressFormData, {
            type: "server",
            message: backendErrors[field],
          });
        });
      } else {
        setApiError(
          error.response?.data?.message ||
            "Failed to save address. Please try again."
        );
      }
    }
  };

  // Handler for numeric input validation
  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter"];

    // Allow: home, end, left, right, down, up
    const navigationKeys = [
      "Home",
      "End",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];

    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    const isClipboardShortcut =
      (e.ctrlKey || e.metaKey) &&
      ["a", "c", "v", "x"].includes(e.key.toLowerCase());

    // Check if it's a number
    const isNumber = /^[0-9]$/.test(e.key);

    if (
      !isNumber &&
      !allowedKeys.includes(e.key) &&
      !navigationKeys.includes(e.key) &&
      !isClipboardShortcut
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full">
      {showTitle && (
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          {initialData ? "EDIT ADDRESS" : "ADD A NEW ADDRESS"}
        </h3>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {apiError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              {...register("fullName", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter a valid 10-digit mobile number",
                },
              })}
              maxLength={10}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="10-digit mobile number"
              onKeyDown={handleNumericKeyDown}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              {...register("zipCode", {
                required: "Pincode is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Enter a valid 6-digit pincode",
                },
              })}
              maxLength={6}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.zipCode ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Pincode"
              onKeyDown={handleNumericKeyDown}
            />
            {isValidatingPincode && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
            {errors.zipCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.zipCode.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              {...register("line2")}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Locality"
            />
          </div>
        </div>

        <div>
          <textarea
            {...register("line1", {
              required: "Address is required",
              minLength: { value: 10, message: "Please provide more details" },
            })}
            rows={3}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.line1 ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Address (Area and Street)"
          />
          {errors.line1 && (
            <p className="mt-1 text-sm text-red-600">{errors.line1.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              {...register("city", { required: "City is required" })}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="City/District/Town"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="state"
              control={control}
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">--Select State--</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">
                {errors.state.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              {...register("landmark")}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Landmark (Optional)"
            />
          </div>

          <div>
            <input
              type="tel"
              {...register("alternatePhone", {
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter a valid 10-digit mobile number",
                },
              })}
              maxLength={10}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.alternatePhone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Alternate Phone (Optional)"
              onKeyDown={handleNumericKeyDown}
            />
            {errors.alternatePhone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.alternatePhone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-700 mb-3">Address Type</p>
          <Controller
            name="label"
            control={control}
            render={({ field }) => (
              <div className="flex space-x-4">
                {["Home", "Work"].map((label) => (
                  <label
                    key={label}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      {...field}
                      value={label}
                      checked={field.value === label}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      {label} (
                      {label === "Home"
                        ? "All day delivery"
                        : "Delivery between 10 AM - 5 PM"}
                      )
                    </span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            {...register("isDefault")}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
            Make this my default address
          </label>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {isSubmitting ? "SAVING..." : submitButtonText}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 text-blue-600 hover:text-blue-700 font-medium"
          >
            {cancelButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
