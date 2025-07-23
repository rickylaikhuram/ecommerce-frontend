// pages/account/AccountDetails.tsx
import React, { useState, useEffect } from "react";
import type { User } from "../../types/user.types";
import instance from "../../utils/axios";

interface EditingState {
  personalInfo: boolean;
  email: boolean;
  phone: boolean;
}

const AccountDetails: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male" as "male" | "female",
  });
  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male" as "male" | "female",
  });
  const [editing, setEditing] = useState<EditingState>({
    personalInfo: false,
    email: false,
    phone: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<keyof EditingState | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await instance.get("/api/user/profile");
      const userData = response.data.user;
      setUser(userData);
      const formattedData = {
        firstName: userData.name?.split(' ')[0] || "",
        lastName: userData.name?.split(' ')[1] || "",
        email: userData.email || "",
        phone: userData.phone || "",
        gender: userData.gender || "male" as "male" | "female",
      };
      setFormData(formattedData);
      setOriginalData(formattedData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (section: keyof EditingState) => {
    setEditing({
      personalInfo: false,
      email: false,
      phone: false,
      [section]: true,
    });
  };

  const handleCancel = (section: keyof EditingState) => {
    // Reset to original data
    setFormData(originalData);
    setEditing({
      ...editing,
      [section]: false,
    });
  };

  const handleSave = async (section: keyof EditingState) => {
    setSaving(section);
    try {
      let updateData = {};
      
      switch (section) {
        case "personalInfo":
          updateData = {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            gender: formData.gender,
          };
          break;
        case "email":
          updateData = { email: formData.email };
          break;
        case "phone":
          updateData = { phone: formData.phone };
          break;
      }

      const response = await instance.put("/api/user/profile", updateData);
      
      if (response.data) {
        // Update original data with new values
        setOriginalData(formData);
        setUser(response.data.user);
        setEditing({
          ...editing,
          [section]: false,
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-center text-gray-500">Unable to load user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Personal Information Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            {editing.personalInfo ? (
              <button
                onClick={() => handleCancel("personalInfo")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => !editing.personalInfo && handleEdit("personalInfo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ricky"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => !editing.personalInfo && handleEdit("personalInfo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Laikhuram"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-3">Your Gender</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={(e) => {
                      handleChange(e);
                      !editing.personalInfo && handleEdit("personalInfo");
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Male</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={(e) => {
                      handleChange(e);
                      !editing.personalInfo && handleEdit("personalInfo");
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Female</span>
                </label>
              </div>
            </div>

            {editing.personalInfo && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave("personalInfo")}
                  disabled={saving === "personalInfo"}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {saving === "personalInfo" ? "SAVING..." : "SAVE"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Address Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Email Address</h2>
            {!editing.email && (
              <button
                onClick={() => handleEdit("email")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => !editing.email && handleEdit("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="rickylaikhuramofficial@gmail.com"
            />

                        {editing.email && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleCancel("email")}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("email")}
                  disabled={saving === "email"}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {saving === "email" ? "SAVING..." : "SAVE"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Number Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Mobile Number</h2>
            {editing.phone ? (
              <button
                onClick={() => handleCancel("phone")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mobile Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => !editing.phone && handleEdit("phone")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+918033996186"
              />
            </div>

            {editing.phone && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave("phone")}
                  disabled={saving === "phone"}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {saving === "phone" ? "SAVING..." : "SAVE"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Account Info (Read-only) */}
      {user.id && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">User ID</label>
                <input
                  type="text"
                  value={user.id}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Account Created</label>
                <input
                  type="text"
                  value={new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;