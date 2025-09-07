// hooks/useHeaderState.ts
import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { fetchDeliverySetting } from "../redux/slice/delivery";
import { fetchAddresses, clearAddresses } from "../redux/slice/address";

export const useHeaderState = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);
  const { deliverySetting, status: deliveryStatus } = useAppSelector(
    (state) => state.delivery
  );
  const { addresses: userAddresses, status: addressStatus } = useAppSelector(
    (state) => state.address
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldFixHeader, setShouldFixHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  const lastClickRef = useRef({ path: "", timestamp: 0 });

  const isAuthenticated = user !== null && status === "succeeded";
  const isGuest = user?.role === "guest";
  const profileHref = isGuest ? "/signin" : "/account";
  const profileLabel = isGuest ? "Sign in" : "Profile";

  // Fetch delivery settings once
  useEffect(() => {
    if (deliveryStatus === "idle") {
      dispatch(fetchDeliverySetting());
    }
  }, [deliveryStatus, dispatch]);

  // Fetch addresses when authenticated
  useEffect(() => {
    if (isAuthenticated && !isGuest && addressStatus === "idle") {
      dispatch(fetchAddresses());
    } else if (!isAuthenticated || isGuest) {
      dispatch(clearAddresses());
    }
  }, [isAuthenticated, isGuest, addressStatus, dispatch]);

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

    return userAddresses.filter(
      (address) => address.zipCode && allowedZipCodes.includes(address.zipCode)
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
        showDeliveryCheck: true,
      };
    }

    if (addressStatus === "loading" || deliveryStatus === "loading") {
      return {
        text: "Loading location...",
        isDefault: true,
        showDeliveryCheck: false,
      };
    }

    if (userAddresses.length === 0) {
      return {
        text: "Manipur",
        isDefault: true,
        showDeliveryCheck: true,
      };
    }

    const deliverableAddresses = getDeliverableAddresses();

    if (deliverableAddresses.length === 0) {
      return {
        text: "Manipur",
        isDefault: true,
        showDeliveryCheck: true,
        hasUndeliverableAddresses: true,
      };
    }

    const defaultDeliverableAddress =
      deliverableAddresses.find((addr) => addr.isDefault) ||
      deliverableAddresses[0];

    return {
      text: `${defaultDeliverableAddress.city}, ${defaultDeliverableAddress.state}`,
      isDefault: false,
      address: defaultDeliverableAddress,
      showDeliveryCheck: true,
      deliverableAddressesCount: deliverableAddresses.length,
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
    console.log(`Delivery confirmed for ${pincode} with fee ₹${deliveryFee}`);
  };

  return {
    isMenuOpen,
    isScrolled,
    shouldFixHeader,
    showHeader,
    isAuthenticated,
    isGuest,
    profileHref,
    profileLabel,
    locationInfo: getLocationInfo(),
    isDeliveryModalOpen,
    deliverySetting,
    deliveryStatus,
    addressStatus,
    toggleMenu,
    handleNavClick,
    handleLocationClick,
    handleDeliveryConfirmed,
    setIsDeliveryModalOpen,
    deliverableAddresses: getDeliverableAddresses(),
  };
};
