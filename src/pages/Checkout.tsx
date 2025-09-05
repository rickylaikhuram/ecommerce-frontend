// pages/Checkout.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogIn,
  Truck,
  Package,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { logoutUser } from "../redux/slice/auth";
import {
  fetchCart,
  removeFromCart,
  removeItemOptimistic,
} from "../redux/slice/cart";
import { fetchDeliverySetting } from "../redux/slice/delivery";
import type {
  CartCheckoutResponse,
  CheckoutState,
  ProductResponse,
} from "../types/checkout.types";
import type { ShippingAddress, CreateOrderRequest } from "../types/order.types";
import type { Address } from "../types/user.types";
import addressService from "../services/address.services";
import { cartService } from "../services/cart.services";
import { orderService } from "../services/order.services";

// Import new components
import CheckoutHeader from "../components/checkout/CheckoutHeader";
import ProgressBar from "../components/checkout/ProgressBar";
import ErrorAlert from "../components/checkout/ErrorAlert";
import CartValidationAlert from "../components/checkout/CartValidationAlert";
import PricingSidebar from "../components/checkout/PricingSidebar";
import NavigationButtons from "../components/checkout/NavigationButtons";
import StepRenderer from "../components/checkout/StepRenderer";
import CartValidationModal from "../components/checkout/CartValidationModal";
import { fetchProfile } from "../redux/slice/userProfile";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

const CHECKOUT_STEPS: Step[] = [
  {
    id: 1,
    title: "Sign In",
    description: "Login to your account",
    icon: LogIn,
  },
  { id: 2, title: "Address", description: "Delivery location", icon: Truck },
  { id: 3, title: "Review", description: "Order details", icon: Package },
  { id: 4, title: "Payment", description: "Payment method", icon: CreditCard },
];

interface PricingDetails {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  savings: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);
  const { user: userProfile, status: userStatus } = useAppSelector(
    (state) => state.user
  );
  const { status: deliveryStatus, deliverySetting } = useAppSelector(
    (state) => state.delivery
  );
  const state = location.state as CheckoutState | null;

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isValidState = state && state.items && state.items.length > 0;
  const [isValidCheckout, setIsValidCheckout] = useState(isValidState);
  const [isValidatingCart, setIsValidatingCart] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // User data state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  // Cart validation state
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [cartItems, setCartItems] = useState<ProductResponse[]>([]);
  const [cartValidation, setCartValidation] =
    useState<CartCheckoutResponse | null>(null);
  const [canProceedToPayment, setCanProceedToPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  const [pricingDetails, setPricingDetails] = useState<PricingDetails>({
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    total: 0,
    savings: 0,
  });

  // Fetch delivery settings on component mount
  useEffect(() => {
    if (deliveryStatus === "idle") {
      dispatch(fetchDeliverySetting());
    }
  }, [deliveryStatus, dispatch]);

  // Check for valid checkout state
  useEffect(() => {
    if (!isValidState) {
      navigate("/cart", { replace: true });
      setIsValidCheckout(false);
    }
  }, [isValidState, navigate]);

  // Calculate shipping cost based on delivery settings (same logic as cart summary)
  const calculateShippingCost = useCallback(
    (subtotal: number) => {
      if (!deliverySetting || !deliverySetting.takeDeliveryFee) {
        return 0;
      }

      if (
        deliverySetting.checkThreshold &&
        deliverySetting.freeDeliveryThreshold
      ) {
        return subtotal >= Number(deliverySetting.freeDeliveryThreshold)
          ? 0
          : Number(deliverySetting.deliveryFee) || 0;
      }

      return Number(deliverySetting.deliveryFee) || 0;
    },
    [deliverySetting]
  );

  // Updated calculatePricing function with correct discount calculation
  const calculatePricing = useCallback(
    (cartData: CartCheckoutResponse): PricingDetails => {
      const validItems =
        cartData?.products?.filter((item) => item?.canProceedToCheckout) || [];

      // Calculate subtotal from cart summary if available, otherwise from items
      const subtotal =
        cartData?.cartSummary?.totalDiscountedPrice ||
        validItems.reduce((sum, item) => {
          const itemTotal = item?.cartDetails?.itemTotal;
          return sum + (itemTotal ? parseFloat(itemTotal.toString()) : 0);
        }, 0);

      // Calculate discount as the difference between original and discounted price
      const originalPrice = cartData?.cartSummary?.totalOriginalPrice || 0;
      const discountedPrice = cartData?.cartSummary?.totalDiscountedPrice || 0;
      const discount = originalPrice - discountedPrice;

      // Calculate delivery fee using the same logic as cart summary
      const deliveryFee = calculateShippingCost(subtotal);

      const total = subtotal + deliveryFee;

      return {
        subtotal,
        discount,
        deliveryFee,
        total,
        savings: discount,
      };
    },
    [calculateShippingCost]
  );

  const loadCheckoutUserData = useCallback(async () => {
    if (!state || !state.items || state.items.length === 0) {
      navigate("/cart", { replace: true });
      return;
    }

    try {
      setError(null);
      setIsValidatingCart(true);

      // Load user addresses
      const userAddresses = await addressService.getAddresses();
      setAddresses(userAddresses || []);

      // Validate cart items
      const cartData: CartCheckoutResponse =
        await cartService.checkProductsInCart(state.items);

      setCartItems(cartData.products || []);
      setCartValidation(cartData);
      setCanProceedToPayment(cartData.canProceedToCheckout);

      // Calculate pricing from valid items using real delivery settings
      const pricing = calculatePricing(cartData);
      setPricingDetails(pricing);

      // Set default address
      if (userAddresses && userAddresses.length > 0) {
        const defaultAddr =
          userAddresses.find((addr) => addr.isDefault) || userAddresses[0];
        setSelectedAddress(defaultAddr);
      }

      // Auto-advance to review step if authenticated and has addresses
      if (user !== null && userAddresses?.length > 0) {
        setCurrentStep(3);
      }

      // Handle userProfile
      if (userProfile) {
        console.log("User profile is available:", userProfile);
      } else if (userStatus === "loading") {
        console.log("User profile is still loading...");
      } else {
        console.log("User profile is not available, fetching...");
        dispatch(fetchProfile());
      }
    } catch (error) {
      console.error("Error loading checkout data:", error);
      setError("Failed to load checkout data. Please try again.");
    } finally {
      setIsValidatingCart(false);
    }
  }, [
    state,
    user,
    userProfile,
    userStatus,
    dispatch,
    navigate,
    calculatePricing,
  ]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // Wait for auth to be resolved
      if (status === "loading" || status === "idle") {
        return;
      }

      if (!isMounted) return;

      setIsInitialLoading(false);

      if (status === "succeeded" && user?.role === "user") {
        setCurrentStep(2);
        setIsAuthenticated(true);
        await loadCheckoutUserData();
      } else if (status === "succeeded" && user?.role === "guest") {
        setIsAuthenticated(false);
        setCurrentStep(1);
      } else if (status === "failed") {
        setIsAuthenticated(false);
        setCurrentStep(1);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [status, user, loadCheckoutUserData]);

  if (!isValidCheckout) {
    return null;
  }

  if (isInitialLoading || deliveryStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-gray-600">Loading checkout...</div>
      </div>
    );
  }

  const handleRefreshCart = async () => {
    try {
      await loadCheckoutUserData();
      dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error("Error refreshing cart:", error);
      setError("Failed to refresh cart. Please try again.");
    }
  };

  const handleRemoveInvalidItem = async (cartItemId: string) => {
    try {
      // instant update in ui
      dispatch(removeItemOptimistic(cartItemId));
      // Make API call in background
      await dispatch(removeFromCart(cartItemId)).unwrap();

      // Refresh checkout data after removal
      await loadCheckoutUserData();
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item. Please try again.");
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    window.location.href = "/";
  };

  const handleAddressUpdated = async (savedAddress?: Address) => {
    await fetchAddresses(savedAddress);
    setCurrentStep(3);
  };

  const fetchAddresses = async (addressToSelect?: Address) => {
    try {
      setIsAddressLoading(true);

      const userAddresses = await addressService.getAddresses();
      setAddresses(userAddresses || []);

      if (addressToSelect) {
        const updatedAddress = userAddresses.find(
          (addr) => addr.id === addressToSelect.id
        );
        if (updatedAddress) {
          setSelectedAddress(updatedAddress);
        } else {
          setSelectedAddress(addressToSelect);
        }
      } else if (
        !selectedAddress ||
        !userAddresses.find((addr) => addr.id === selectedAddress.id)
      ) {
        const defaultAddr =
          userAddresses.find((addr) => addr.isDefault) || userAddresses[0];
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        }
      } else {
        const updatedSelectedAddress = userAddresses.find(
          (addr) => addr.id === selectedAddress.id
        );
        if (updatedSelectedAddress) {
          setSelectedAddress(updatedSelectedAddress);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Failed to load addresses. Please try again.");
    } finally {
      setIsAddressLoading(false);
    }
  };

  // Transform Address to ShippingAddress
  const transformAddressToShipping = (address: Address): ShippingAddress => {
    return {
      fullName: address.fullName,
      phone: address.phone,
      alternatePhone: address?.alternatePhone || undefined,
      line1: address.line1,
      line2: address.line2,
      landmark: address?.landmark || undefined,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country || "India", // Default to India if not provided
    };
  };

  // handle payment
  const handlePayNow = async (method: string) => {
    if (method === "upi-qr") {
      await handleGenerateQR();
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate payment processing for other methods
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to success page
      navigate("/order-success/123", {
        state: {
          paymentMethod: method,
          amount: pricingDetails.total,
          orderId: "ORD" + Date.now(),
        },
      });
    } catch (error) {
      console.error("Payment failed:", error);
      setError("Payment failed. Please try again.");
    } finally {
      dispatch(fetchCart()).unwrap();
      setIsProcessing(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!state || !state.items || state.items.length === 0) {
      setError("Session expired. Redirecting to cart...");
      navigate("/cart", { replace: true });
      return;
    }
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Prepare order data
      const orderData: CreateOrderRequest = {
        productDatas: state.items,
        address: transformAddressToShipping(selectedAddress),
        paymentMethod: "UPI",
      };

      // Create order with validation callback
      const result = await orderService.createUpiQrOrder(
        orderData,
        // Callback for validation failure
        (validationData: CartCheckoutResponse) => {
          setCartValidation(validationData);
          setShowValidationModal(true);
          setCanProceedToPayment(validationData.canProceedToCheckout);
        }
      );
      if (result.success) {
        window.location.replace(result.paymentUrl);
      } else {
        setError("Failed to create order");
      }
    } catch (error: any) {
      console.error("QR generation failed:", error);

      if (error.message === "CART_VALIDATION_FAILED") {
        // Validation modal will be shown via the callback
        return;
      }

      setError(
        error.message || "Failed to generate QR code. Please try again."
      );
    } finally {
      dispatch(fetchCart()).unwrap();
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!state || !state.items || state.items.length === 0) {
      setError("Session expired. Redirecting to cart...");
      navigate("/cart", { replace: true });
      return;
    }
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Prepare order data
      const orderData: CreateOrderRequest = {
        productDatas: state.items,
        address: transformAddressToShipping(selectedAddress),
        paymentMethod: "COD",
      };

      // Create COD order with validation callback
      const result = await orderService.createCodOrder(
        orderData,
        // Callback for validation failure
        (validationData: CartCheckoutResponse) => {
          setCartValidation(validationData);
          setShowValidationModal(true);
          setCanProceedToPayment(validationData.canProceedToCheckout);
        }
      );

      if (result.success) {
        // Navigate to order success page with real order data
        navigate(`/orders-success/${result.orderId}`, {
          state: {
            paymentMethod: "cod",
            amount: result.amount,
            orderId: result.orderId,
          },
        });
      } else {
        setError("Failed to place order");
      }
    } catch (error: any) {
      console.error("COD order placement failed:", error);

      if (error.message === "CART_VALIDATION_FAILED") {
        // Validation modal will be shown via the callback
        return;
      }

      if (error.message === "INSUFFICIENT_STOCK") {
        setError(
          "Some items are out of stock. Please update your cart and try again."
        );
        return;
      }

      setError(error.message || "Failed to place order. Please try again.");
    } finally {
      dispatch(fetchCart()).unwrap();
      setIsProcessing(false);
    }
  };

  // Add the modal handler
  const handleModalGoToCart = () => {
    setShowValidationModal(false);
    dispatch(fetchCart()).unwrap(); // Just refresh the cart
    navigate("/cart");
  };

  const handleNextStep = () => {
    setError(null);

    switch (currentStep) {
      case 1:
        if (isAuthenticated) {
          setCurrentStep(2);
        } else {
          navigate("/signin?redirect=/checkout");
        }
        break;
      case 2:
        if (selectedAddress) {
          setCurrentStep(3);
        } else {
          setError("Please select or add a delivery address");
        }
        break;
      case 3:
        // Check if all items can procee d to checkout
        if (!canProceedToPayment) {
          setError(
            "Fix cart issues before payment — some items are out of stock or have quantity errors."
          );
          return;
        }
        if (
          cartItems.filter((item) => item.canProceedToCheckout).length === 0
        ) {
          setError("No valid items in cart for checkout");
          return;
        }
        setCurrentStep(4);
        break;
      case 4:
        if (selectedPayment) {
          // This case is now handled by individual payment method buttons
          // But we'll keep this as fallback
          handleProceedToPayment();
        } else {
          setError("Please select a payment method");
        }
        break;
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleProceedToPayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/order-success/123");
    }, 2000);
  };

  // Calculate derived state
  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.cartDetails.quantity,
    0
  );
  const validItems = cartItems.filter((item) => item.canProceedToCheckout);
  const invalidItems = cartItems.filter((item) => !item.canProceedToCheckout);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <CheckoutHeader onBackClick={() => navigate("/cart")} />
      {/* Progress Bar */}
      <ProgressBar steps={CHECKOUT_STEPS} currentStep={currentStep} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            {/* Cart validation issues alert */}
            {cartValidation && !cartValidation.canProceedToCheckout && (
              <CartValidationAlert
                cartValidation={cartValidation}
                onGoToCart={() => navigate("/cart")}
                onRefresh={handleRefreshCart}
                isRefreshing={isValidatingCart}
              />
            )}

            {/* Error Alert */}
            {error && (
              <ErrorAlert message={error} onDismiss={() => setError(null)} />
            )}

            {/* Step Content */}
            <StepRenderer
              currentStep={currentStep}
              isAuthenticated={isAuthenticated}
              userProfile={userProfile}
              addresses={addresses}
              selectedAddress={selectedAddress}
              onSelectAddress={setSelectedAddress}
              onAddressUpdated={handleAddressUpdated}
              isAddressLoading={isAddressLoading}
              cartItems={cartItems}
              onViewDetails={() => navigate("/cart")}
              onRemoveInvalidItem={handleRemoveInvalidItem}
              onSelectPayment={setSelectedPayment}
              onPayNow={handlePayNow}
              onGenerateQR={handleGenerateQR}
              onPlaceOrder={handlePlaceOrder}
              isProcessing={isProcessing}
              selectedPayment={selectedPayment}
              onNavigateToSignIn={() => navigate("/signin?redirect=/checkout")}
              onNavigateToSignUp={() => navigate("/signup?redirect=/checkout")}
              onLogout={handleLogout}
              onContinueToAddress={() => setCurrentStep(2)}
            />

            {/* Navigation Buttons */}
            <NavigationButtons
              currentStep={currentStep}
              maxStep={4}
              isAuthenticated={isAuthenticated}
              canProceedToPayment={canProceedToPayment}
              isProcessing={isProcessing}
              onPreviousStep={handlePreviousStep}
              onNextStep={handleNextStep}
              showContinueButton={currentStep < 4}
            />
          </div>

          {/* Sidebar */}
          <PricingSidebar
            pricingDetails={pricingDetails}
            cartValidation={cartValidation}
            validItemsCount={validItems.length}
            invalidItemsCount={invalidItems.length}
            totalItems={totalItems}
            canProceedToPayment={canProceedToPayment}
            isValidatingCart={isValidatingCart}
            deliverySetting={deliverySetting}
          />
        </div>
      </div>

      {/* Cart Validation Modal */}
      <CartValidationModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        onGoToCart={handleModalGoToCart}
        validationMessage={cartValidation?.checkoutMessage || ""}
      />
    </div>
  );
};

export default Checkout;
