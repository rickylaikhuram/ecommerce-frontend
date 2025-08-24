// hooks/useHeaderState.ts
import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "../redux/hook";
import addressService from "../services/address.services";
import type { Address } from "../types/user.types";

export const useHeaderState = () => {
  const { user, status } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldFixHeader, setShouldFixHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);

  const lastClickRef = useRef({ path: "", timestamp: 0 });

  const isAuthenticated = user !== null && status === "succeeded";
  const isGuest = user?.role === "guest";
  const profileHref = isGuest ? "/signin" : "/account/profile";
  const profileLabel = isGuest ? "Sign in" : "Profile";

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

  // Get location display info
  const getLocationInfo = () => {
    if (isGuest || !isAuthenticated) {
      return { text: "Manipur", isDefault: true };
    }

    if (addressLoading) {
      return { text: "Loading location...", isDefault: true };
    }

    if (userAddresses.length === 0) {
      return { text: "Manipur", isDefault: true };
    }

    const defaultAddress =
      userAddresses.find((addr) => addr.isDefault) || userAddresses[0];
    return {
      text: `${defaultAddress.city}, ${defaultAddress.state}`,
      isDefault: false,
      address: defaultAddress,
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
    toggleMenu,
    handleNavClick,
  };
};
