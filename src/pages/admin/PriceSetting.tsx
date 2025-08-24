import React, { useState, useEffect } from "react";
import {
  Save,
  Plus,
  X,
  Settings,
  Truck,
  DollarSign,
  MapPin,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import instance from "../../utils/axios"; // Adjust the import path as needed

interface PriceSettings {
  id: string;
  takeDeliveryFee: boolean;
  checkThreshold: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  allowedZipCodes: string[];
}

interface Message {
  type: "success" | "error" | "";
  text: string;
}

interface ApiResponse {
  message?: string;
}
interface ApiGetResponse {
  success: boolean;
  message: string;
  priceSetting: PriceSettings;
}

const PriceSetting: React.FC = () => {
  const [settings, setSettings] = useState<PriceSettings>({
    id: "",
    takeDeliveryFee: true,
    checkThreshold: true,
    deliveryFee: 0,
    freeDeliveryThreshold: 0,
    allowedZipCodes: [],
  });

  const [newZipCode, setNewZipCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  const fetchSettings = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await instance.get<ApiGetResponse>(
        "/api/admin/pricesetting"
      );
      if (response.data.success && response.data.priceSetting) {
        // Convert string values to numbers for deliveryFee and freeDeliveryThreshold
        const settingsData = {
          ...response.data.priceSetting,
          deliveryFee:
            parseFloat(response.data.priceSetting.deliveryFee.toString()) || 0,
          freeDeliveryThreshold:
            parseFloat(
              response.data.priceSetting.freeDeliveryThreshold.toString()
            ) || 0,
        };
        setSettings(settingsData);
      } else {
        // Set default values when no settings exist
        setSettings({
          id: "",
          takeDeliveryFee: true,
          checkThreshold: true,
          deliveryFee: 0,
          freeDeliveryThreshold: 0,
          allowedZipCodes: [],
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch settings" });
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (): Promise<void> => {
    setSaving(true);
    try {
      const response = await instance.put<ApiResponse>(
        "/api/admin/pricesetting",
        settings
      );
      setMessage({
        type: "success",
        text: response.data.message || "Settings saved successfully!",
      });

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings" });
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const addZipCode = (): void => {
    if (
      newZipCode.trim() &&
      !settings.allowedZipCodes.includes(newZipCode.trim())
    ) {
      setSettings((prev: PriceSettings) => ({
        ...prev,
        allowedZipCodes: [...prev.allowedZipCodes, newZipCode.trim()],
      }));
      setNewZipCode("");
    }
  };

  const removeZipCode = (zipCode: string): void => {
    setSettings((prev: PriceSettings) => ({
      ...prev,
      allowedZipCodes: prev.allowedZipCodes.filter(
        (zip: string) => zip !== zipCode
      ),
    }));
  };

  const handleInputChange = (
    field: keyof PriceSettings,
    value: boolean | number | string
  ): void => {
    setSettings((prev: PriceSettings) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Price Settings
              </h1>
            </div>
            <p className="mt-2 text-gray-600">
              Configure delivery fees, thresholds, and service areas
            </p>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Master Switch */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Delivery System
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="text-base font-medium text-gray-900">
                    Enable Delivery Fees
                  </label>
                  <p className="text-sm text-gray-600">
                    Master switch for the entire delivery fee system
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleInputChange(
                      "takeDeliveryFee",
                      !settings.takeDeliveryFee
                    )
                  }
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    settings.takeDeliveryFee ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.takeDeliveryFee
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Status Message */}
              <div
                className={`p-4 rounded-lg border ${
                  settings.takeDeliveryFee
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {settings.takeDeliveryFee ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      settings.takeDeliveryFee
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {settings.takeDeliveryFee
                      ? "Delivery system is active. All delivery settings below will be applied to orders."
                      : "Delivery system is disabled. All delivery-related features are inactive until you enable this setting."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Configuration */}
          <div
            className={`bg-white rounded-lg shadow-sm border transition-opacity duration-200 ${
              settings.takeDeliveryFee
                ? "border-gray-200"
                : "border-gray-200 opacity-50"
            }`}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Fee Configuration
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Threshold Check Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-base font-medium text-gray-900">
                    Enable Threshold Check
                  </label>
                  <p className="text-sm text-gray-600">
                    Apply free delivery when order meets minimum amount
                  </p>
                </div>
                <button
                  disabled={!settings.takeDeliveryFee}
                  onClick={() =>
                    handleInputChange(
                      "checkThreshold",
                      !settings.checkThreshold
                    )
                  }
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    settings.checkThreshold && settings.takeDeliveryFee
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  } ${!settings.takeDeliveryFee ? "cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.checkThreshold && settings.takeDeliveryFee
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Fee Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Fee ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={!settings.takeDeliveryFee}
                    value={settings.deliveryFee}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        "deliveryFee",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Standard delivery charge per order
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Delivery Threshold ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={
                      !settings.takeDeliveryFee || !settings.checkThreshold
                    }
                    value={settings.freeDeliveryThreshold}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        "freeDeliveryThreshold",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum order amount for free delivery
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Zip Codes */}
          <div
            className={`bg-white rounded-lg shadow-sm border transition-opacity duration-200 ${
              settings.takeDeliveryFee
                ? "border-gray-200"
                : "border-gray-200 opacity-50"
            }`}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Service Areas
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Zip Code
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    disabled={!settings.takeDeliveryFee}
                    value={newZipCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewZipCode(e.target.value)
                    }
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      e.key === "Enter" && addZipCode()
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter zip code (e.g., 10001)"
                  />
                  <button
                    disabled={!settings.takeDeliveryFee}
                    onClick={addZipCode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Zip Code List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Allowed Zip Codes ({settings.allowedZipCodes.length})
                </label>
                {settings.allowedZipCodes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {settings.allowedZipCodes.map(
                      (zipCode: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                        >
                          <span className="text-sm font-medium text-blue-900">
                            {zipCode}
                          </span>
                          <button
                            disabled={!settings.takeDeliveryFee}
                            onClick={() => removeZipCode(zipCode)}
                            className="text-blue-600 hover:text-red-600 disabled:text-gray-400"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">No zip codes added yet</p>
                    <p className="text-xs mt-1">
                      Add zip codes to define your delivery areas
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Save Changes
                </h3>
                <p className="text-sm text-gray-600">
                  Update your delivery settings
                </p>
              </div>
              <button
                onClick={saveSettings}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSetting;
