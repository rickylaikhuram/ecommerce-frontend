import { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  IndianRupee,
  ShoppingCart,
  Calendar,
  Clock,
  Users,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Activity,
} from "lucide-react";
import instance from "../../utils/axios";

interface DashboardData {
  orders: {
    today: number;
    week: number;
    month: number;
    year: number;
    allTime: number;
  };
  productQuantity: {
    today: number;
    week: number;
    month: number;
    year: number;
    allTime: number;
  };
  revenue: {
    today: number;
    week: number;
    month: number;
    year: number;
    allTime: number;
  };
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "week" | "month" | "year" | "allTime"
  >("today");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await instance.get("/api/admin/dashboard");

        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(
          err.response?.data?.message ||
            "Something went wrong while fetching data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 100000) {
      return (num / 100000).toFixed(1) + "L";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return new Intl.NumberFormat("en-US").format(num);
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const periods = [
    { key: "today", label: "Today", icon: Clock },
    { key: "week", label: "This Week", icon: Calendar },
    { key: "month", label: "This Month", icon: BarChart3 },
    { key: "year", label: "This Year", icon: TrendingUp },
    { key: "allTime", label: "All Time", icon: Users },
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-emerald-100 rounded-xl w-1/3 mx-auto"></div>
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-emerald-100 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-emerald-100 rounded-2xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 bg-emerald-100 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="bg-red-100 backdrop-blur-lg rounded-2xl p-8 border border-red-300 max-w-md mx-auto">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Error Loading Dashboard
              </h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const orderGrowth = calculateGrowth(
    data.orders[selectedPeriod],
    data.orders.week
  );
  const revenueGrowth = calculateGrowth(
    data.revenue[selectedPeriod],
    data.revenue.week
  );
  const quantityGrowth = calculateGrowth(
    data.productQuantity[selectedPeriod],
    data.productQuantity.week
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-tight">
            Business Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Real-time analytics and performance insights
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center">
          <div className="bg-emerald-50 rounded-2xl p-2 border border-emerald-200">
            <div className="flex gap-2">
              {periods.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedPeriod(key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedPeriod === key
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
                      : "text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          {/* Total Orders Quick Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 hover:scale-105 transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-emerald-700 text-sm font-medium">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {formatNumber(data.orders[selectedPeriod])}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <ShoppingCart className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center">
              {orderGrowth >= 0 ? (
                <ArrowUp className="w-4 h-4 text-emerald-600 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  orderGrowth >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {Math.abs(orderGrowth).toFixed(1)}% vs last week
              </span>
            </div>
          </div>

          {/* Products Sold Quick Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 hover:scale-105 transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-emerald-700 text-sm font-medium">
                  Products Sold
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {formatNumber(data.productQuantity[selectedPeriod])}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Package className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center">
              {quantityGrowth >= 0 ? (
                <ArrowUp className="w-4 h-4 text-emerald-600 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  quantityGrowth >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {Math.abs(quantityGrowth).toFixed(1)}% vs last week
              </span>
            </div>
          </div>

          {/* Revenue Quick Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 hover:scale-105 transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-emerald-700 text-sm font-medium">Revenue</p>
                <p className="text-3xl font-bold text-gray-800">
                  {formatCurrency(data.revenue[selectedPeriod])}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <IndianRupee className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center">
              {revenueGrowth >= 0 ? (
                <ArrowUp className="w-4 h-4 text-emerald-600 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  revenueGrowth >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {Math.abs(revenueGrowth).toFixed(1)}% vs last week
              </span>
            </div>
          </div>

          {/* Average Order Value Quick Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 hover:scale-105 transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-emerald-700 text-sm font-medium">
                  Avg Order Value
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {formatCurrency(
                    data.revenue[selectedPeriod] /
                      data.orders[selectedPeriod] || 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Activity className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center">
              <ArrowUp className="w-4 h-4 text-emerald-600 mr-1" />
              <span className="text-sm font-medium text-emerald-600">
                {Math.round(
                  data.productQuantity[selectedPeriod] /
                    data.orders[selectedPeriod] || 0
                )}{" "}
                items/order
              </span>
            </div>
          </div>
        </div>

        {/* Main Analytics Cards */}
        <div className="grid grid-cols-3 gap-8">
          {/* Orders Detail Card */}
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 hover:border-emerald-300 transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
                Orders Overview
              </h2>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="space-y-6">
              {periods.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <span
                    className={`font-medium ${
                      key === selectedPeriod
                        ? "text-emerald-700"
                        : "text-gray-700"
                    }`}
                  >
                    {label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-bold ${
                        key === selectedPeriod ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {formatNumber(data.orders[key])}
                    </span>
                    <div
                      className={`w-2 h-8 rounded-full ${
                        key === selectedPeriod
                          ? "bg-emerald-500"
                          : "bg-emerald-200"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Quantity Detail Card */}
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 hover:border-emerald-300 transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Package className="w-6 h-6 text-emerald-600" />
                Products Sold
              </h2>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="space-y-6">
              {periods.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <span
                    className={`font-medium ${
                      key === selectedPeriod ? "text-emerald-700" : "text-gray-700"
                    }`}
                  >
                    {label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-bold ${
                        key === selectedPeriod ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {formatNumber(data.productQuantity[key])}
                    </span>
                    <div
                      className={`w-2 h-8 rounded-full ${
                        key === selectedPeriod ? "bg-emerald-500" : "bg-emerald-200"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Detail Card */}
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 hover:border-emerald-300 transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <IndianRupee className="w-6 h-6 text-emerald-600" />
                Revenue Analysis
              </h2>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="space-y-6">
              {periods.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <span
                    className={`font-medium ${
                      key === selectedPeriod
                        ? "text-emerald-700"
                        : "text-gray-700"
                    }`}
                  >
                    {label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-bold ${
                        key === selectedPeriod ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {formatCurrency(data.revenue[key])}
                    </span>
                    <div
                      className={`w-2 h-8 rounded-full ${
                        key === selectedPeriod ? "bg-emerald-500" : "bg-emerald-200"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                {formatCurrency(
                  data.revenue[selectedPeriod] / data.orders[selectedPeriod] ||
                    0
                )}
              </div>
              <div className="text-emerald-700 font-medium text-lg">
                Average Order Value
              </div>
              <div className="text-sm text-emerald-600 mt-2">
                Revenue per order for{" "}
                {periods
                  .find((p) => p.key === selectedPeriod)
                  ?.label.toLowerCase()}
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                {Math.round(
                  data.productQuantity[selectedPeriod] /
                    data.orders[selectedPeriod] || 0
                )}
              </div>
              <div className="text-emerald-700 font-medium text-lg">
                Items per Order
              </div>
              <div className="text-sm text-emerald-600 mt-2">
                Average products sold per order
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
              <div className="text-4xl font-bold text-emerald-700 mb-2">
                {formatCurrency(
                  data.revenue[selectedPeriod] /
                    data.productQuantity[selectedPeriod] || 0
                )}
              </div>
              <div className="text-emerald-700 font-medium text-lg">
                Revenue per Item
              </div>
              <div className="text-sm text-emerald-600 mt-2">
                Average revenue generated per product
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;