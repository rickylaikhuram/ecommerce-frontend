// components/LandingHeader.tsx
import { useNavigate } from "react-router-dom";
import { MobileMenu } from "../header/MobileMenu";
import { MobileHeader } from "../header/MobileHeader";
import { MobileBottomNav } from "../header/MobileBottomNav";
import { DesktopHeader } from "../header/DesktopHeader";
import { useHeaderState } from "../../hooks/useHeaderState";
import DeliveryCheckModal from "../common/DeliveryCheckModal";
import type { NavItem } from "../header/Navigation";
import type { AutocompleteResult } from "../../types/search.types";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { fetchCategories } from "../../redux/slice/categories";

const LandingHeader = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.categories);
  
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const {
    isMenuOpen,
    isScrolled,
    shouldFixHeader,
    showHeader,
    addressLoading,
    profileHref,
    profileLabel,
    locationInfo,
    isDeliveryModalOpen,
    toggleMenu,
    handleNavClick,
    handleLocationClick,
    handleDeliveryConfirmed,
    setIsDeliveryModalOpen,
  } = useHeaderState();

  // Navigation items configuration
  const navItems: NavItem[] = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    {
      name: "Categories",
      isDropdown: true,
      path: "/categories",
    },
  ];

  // Search handlers
  const handleSearch = (query: string) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleSuggestionClick = (suggestion: AutocompleteResult) => {
    if (suggestion.type === "product") {
      navigate(`/products/${suggestion.id}`);
    } else if (suggestion.type === "category") {
      navigate(`/products?category=${encodeURIComponent(suggestion.name)}`);
    }
  };

  return (
    <>
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        navItems={navItems}
        profileHref={profileHref}
        profileLabel={profileLabel}
      />

      {/* Desktop Header */}
      <DesktopHeader
        shouldFixHeader={shouldFixHeader}
        isScrolled={isScrolled}
        navItems={navItems}
        profileHref={profileHref}
        profileLabel={profileLabel}
        locationInfo={locationInfo}
        addressLoading={addressLoading}
        onNavClick={handleNavClick}
        onSearch={handleSearch}
        onSuggestionClick={handleSuggestionClick}
        onLocationClick={handleLocationClick} // Pass the location click handler
      />

      {/* Mobile Header */}
      <MobileHeader
        isScrolled={isScrolled}
        showHeader={showHeader}
        onMenuToggle={toggleMenu}
        onSearch={handleSearch}
        onSuggestionClick={handleSuggestionClick}
        onNavClick={handleNavClick}
        locationInfo={locationInfo}
        addressLoading={addressLoading}
        onLocationClick={handleLocationClick} // Pass the location click handler
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        showHeader={showHeader}
        isScrolled={isScrolled}
        profileHref={profileHref}
        profileLabel={profileLabel}
        onNavClick={handleNavClick}
      />

      {/* Delivery Check Modal */}
      <DeliveryCheckModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onDeliveryConfirmed={handleDeliveryConfirmed}
      />

    </>
  );
};

export default LandingHeader;