import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Image,
  AlertCircle,
  Check,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import Button from "../../components/ui/Button";
import BannerForm from "../../components/admin/BannerForm";
import WarningModal from "../../components/common/WarningModal";
import instance from "../../utils/axios";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

interface Banner {
  id: string;
  imageUrl: string;
  altText?: string;
  redirectUrl: string;
}

const Banners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentView, setCurrentView] = useState<"list" | "add" | "edit">(
    "list"
  );
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    banner: Banner | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    banner: null,
    isDeleting: false
  });

  // Fetch banners on mount and when returning to list view
  useEffect(() => {
    if (currentView === "list") {
      fetchBanners();
    }
  }, [currentView]);

  const fetchBanners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get("/api/admin/banner");
      const data = response.data.banner || [];
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError("Failed to fetch banners");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBanner = () => {
    setSelectedBanner(null);
    setCurrentView("add");
  };

  const handleEditBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    setCurrentView("edit");
  };

  // Open delete modal
  const handleDeleteBanner = (banner: Banner) => {
    setDeleteModal({
      isOpen: true,
      banner: banner,
      isDeleting: false
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({
        isOpen: false,
        banner: null,
        isDeleting: false
      });
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteModal.banner) return;

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      await instance.delete(`/api/admin/banner/${deleteModal.banner.id}`);
      showNotification("success", "Banner deleted successfully");
      fetchBanners();
      closeDeleteModal();
    } catch (error: any) {
      showNotification(
        "error",
        error.response?.data?.message || "Failed to delete banner"
      );
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setSubmitStatus({ type, message });
    setTimeout(() => {
      setSubmitStatus({ type: null, message: "" });
    }, 3000);
  };

  const handleFormCancel = () => {
    setCurrentView("list");
    setSelectedBanner(null);
  };

  // Calculate stats
  const totalBanners = banners.length;

  const handleFormSubmitSuccess = () => {
    showNotification(
      "success",
      currentView.includes("add")
        ? "Created successfully"
        : "Updated successfully"
    );
    setCurrentView("list");
    setSelectedBanner(null);
  };

  // Render Banner Form
  if (currentView === "add" || currentView === "edit") {
    return (
      <BannerForm
        mode={currentView.includes("add") ? "add" : "edit"}
        initialData={selectedBanner}
        onSubmit={handleFormSubmitSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  // Loading state
  if (isLoading && currentView === "list") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && currentView === "list") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Error loading banners</p>
          <p className="text-slate-600 mt-2">{error}</p>
          <Button
            onClick={fetchBanners}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {submitStatus.type && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 transform transition-all duration-300 ${
            submitStatus.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {submitStatus.type === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p className="text-sm font-medium">{submitStatus.message}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <WarningModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        title="Delete Banner"
        size="md"
      >
        <div className="space-y-4">
          {/* Warning Icon and Message */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Are you sure you want to delete this banner?
              </h4>
              <p className="text-gray-600 mb-4">
                This action cannot be undone. The banner will be permanently removed from your website and all associated data will be lost.
              </p>
            </div>
          </div>

          {/* Banner Preview */}
          {deleteModal.banner && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={`${S3_BASE_URL}${deleteModal.banner.imageUrl}`}
                    alt={deleteModal.banner.altText || "Banner"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='48' viewBox='0 0 80 48'%3E%3Crect width='80' height='48' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='Arial, sans-serif' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {deleteModal.banner.altText || "Untitled Banner"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {deleteModal.banner.redirectUrl}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={closeDeleteModal}
              disabled={deleteModal.isDeleting}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteModal.isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
            >
              {deleteModal.isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </WarningModal>

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Banners</h1>
            <p className="text-slate-600 mt-1">
              Manage your promotional banners
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchBanners}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700"></div>
              ) : (
                "Refresh"
              )}
            </Button>
            <Button
              onClick={handleAddBanner}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-5"
            >
              <Plus className="w-4 h-4" />
              Add Banner
            </Button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="mt-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-w-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Banners</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {totalBanners}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Image className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {banners.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No banners found</p>
            {banners.length === 0 && (
              <button
                onClick={handleAddBanner}
                className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Create your first banner
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="p-6 hover:bg-slate-50 transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Banner Image - Main Focus */}
                  <div className="w-full lg:w-96 flex-shrink-0">
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                      <div className="aspect-[16/9] relative">
                        <img
                          src={`${S3_BASE_URL}${banner.imageUrl}` || ""}
                          alt={banner.altText || "Banner"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='Arial, sans-serif' font-size='14'%3EImage not found%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        
                        {/* Overlay with quick actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-xl">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditBanner(banner)}
                              className="bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner)}
                              className="bg-red-500/90 backdrop-blur-sm text-white hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 min-w-0 space-y-6">
                    {/* Redirect URL - Primary Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                          Redirect URL
                        </span>
                      </div>
                      <p className="text-slate-800 font-semibold text-2xl leading-tight break-all hover:text-blue-600 transition-colors cursor-pointer">
                        {banner.redirectUrl}
                      </p>
                    </div>

                    {/* Additional Info - Secondary */}
                    <div className="space-y-3 pt-4 border-t border-slate-200">
                      {banner.altText && (
                        <div className="flex items-start gap-3">
                          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider min-w-0 flex-shrink-0">
                            Alt Text:
                          </span>
                          <span className="text-sm text-slate-600">{banner.altText}</span>
                        </div>
                      )}
                      
                      {/* Banner ID for reference */}
                      <div className="flex items-start gap-3">
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider min-w-0 flex-shrink-0">
                          Banner ID:
                        </span>
                        <span className="text-sm text-slate-500 font-mono">#{banner.id.slice(-8)}</span>
                      </div>
                    </div>

                    {/* Action Buttons - Always visible on mobile */}
                    <div className="flex items-center gap-3 pt-2 lg:hidden">
                      <button
                        onClick={() => handleEditBanner(banner)}
                        className="px-6 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(banner)}
                        className="px-6 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banners;