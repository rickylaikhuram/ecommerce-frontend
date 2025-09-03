// hooks/useHeaderState.ts
import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { fetchDeliverySetting } from "../redux/slice/delivery";
import addressService from "../services/address.services";
import type { Address } from "../types/user.types";

export const useHeaderState = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);
  const { deliverySetting, status: deliveryStatus } = useAppSelector((state) => state.delivery);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldFixHeader, setShouldFixHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  const lastClickRef = useRef({ path: "", timestamp: 0 });

  const isAuthenticated = user !== null && status === "succeeded";
  const isGuest = user?.role === "guest";
  const profileHref = isGuest ? "/signin" : "/account/profile";
  const profileLabel = isGuest ? "Sign in" : "Profile";

  // Fetch delivery settings on component mount
  useEffect(() => {
    if (deliveryStatus === "idle") {
      dispatch(fetchDeliverySetting());
    }
  }, [deliveryStatus, dispatch]);

  // Fetch user addresses when authenticated
  useEffect(() => {
    const fetchAddresses = async () => {
      if (isAuthenticated && user?.role !== "guest") {
        try {
          setAddressLoading(true);
          const addresses = await addressService.getAddresses();
          setUserAddresses(addresses);
        } catch (error) {
          console.error("Failed to fetch addresses:", error);
          setUserAddresses([]);
        } finally {
          setAddressLoading(false);
        }
      } else {
        setUserAddresses([]);
      }
    };

    fetchAddresses();
  }, [isAuthenticated, user?.role]);

  // Filter addresses based on delivery settings
  const getDeliverableAddresses = () => {
    if (!deliverySetting || !userAddresses.length) {
      return [];
    }

    const { allowedZipCodes } = deliverySetting;

    // If allowedZipCodes is empty, all addresses are deliverable
    if (allowedZipCodes.length === 0) {
      return userAddresses;
    }

    // Filter addresses that have zip codes in the allowed list
    return userAddresses.filter(address => 
      address.zipCode && allowedZipCodes.includes(address.zipCode)
    );
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setShouldFixHeader(currentScrollY > 150);
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Get location display info with delivery logic
  const getLocationInfo = () => {
    if (isGuest || !isAuthenticated) {
      return { 
        text: "Manipur", 
        isDefault: true,
        showDeliveryCheck: true 
      };
    }

    if (addressLoading || deliveryStatus === "loading") {
      return { 
        text: "Loading location...", 
        isDefault: true,
        showDeliveryCheck: false 
      };
    }

    if (userAddresses.length === 0) {
      return { 
        text: "Manipur", 
        isDefault: true,
        showDeliveryCheck: true 
      };
    }

    const deliverableAddresses = getDeliverableAddresses();

    // If no deliverable addresses, show default with delivery check option
    if (deliverableAddresses.length === 0) {
      return {
        text: "Manipur",
        isDefault: true,
        showDeliveryCheck: true,
        hasUndeliverableAddresses: true
      };
    }

    // Find the default deliverable address or use the first deliverable one
    const defaultDeliverableAddress = deliverableAddresses.find((addr) => addr.isDefault) || deliverableAddresses[0];
    
    return {
      text: `${defaultDeliverableAddress.city}, ${defaultDeliverableAddress.state}`,
      isDefault: false,
      address: defaultDeliverableAddress,
      showDeliveryCheck: true,
      deliverableAddressesCount: deliverableAddresses.length
    };
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickRef.current.timestamp;

    if (
      lastClickRef.current.path === path &&
      timeDiff < 500 &&
      window.location.pathname === path
    ) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      lastClickRef.current = { path: "", timestamp: 0 };
    } else {
      lastClickRef.current = { path, timestamp: currentTime };
    }

    if (isMenuOpen) {
      toggleMenu();
    }
  };

  const handleLocationClick = () => {
    setIsDeliveryModalOpen(true);
  };

  const handleDeliveryConfirmed = (pincode: string, deliveryFee: number) => {
    // Handle successful delivery confirmation
    // You might want to save this to local storage or Redux
    console.log(`Delivery confirmed for ${pincode} with fee ₹${deliveryFee}`);
    
    // Optionally, you can update the location display or save the selected pincode
    // This would depend on your specific requirements
  };

  return {
    isMenuOpen,
    isScrolled,
    shouldFixHeader,
    showHeader,
    addressLoading,
    isAuthenticated,
    isGuest,
    profileHref,
    profileLabel,
    locationInfo: getLocationInfo(),
    isDeliveryModalOpen,
    deliverySetting,
    deliveryStatus,
    toggleMenu,
    handleNavClick,
    handleLocationClick,
    handleDeliveryConfirmed,
    setIsDeliveryModalOpen,
    deliverableAddresses: getDeliverableAddresses(),
  };
};
