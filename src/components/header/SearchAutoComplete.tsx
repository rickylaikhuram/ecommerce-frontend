// components/Header/SearchAutocomplete.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, Package, Tag, TrendingUp } from "lucide-react";
import { searchService } from "../../services/search.services";
import type { AutocompleteResult } from "../../types/search.types";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

interface SearchAutocompleteProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSuggestionClick?: (suggestion: AutocompleteResult) => void;
  className?: string;
  isMobile?: boolean;
}

export const SearchAutoComplete: React.FC<SearchAutocompleteProps> = ({
  placeholder = "Search products...",
  onSearch,
  onSuggestionClick,
  className = "",
  isMobile = false,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [popularSuggestions, setPopularSuggestions] = useState<AutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hasFocus, setHasFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<number | undefined>(undefined);

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsLoading(true);
        try {
          const response = await searchService.getAutocomplete(searchQuery);
          setSuggestions(response.suggestions);
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  // Load popular suggestions on mount
  useEffect(() => {
    const loadPopularSuggestions = async () => {
      try {
        const response = await searchService.getPopularSearches();
        setPopularSuggestions(response.suggestions);
      } catch (error) {
        console.error("Failed to load popular suggestions:", error);
      }
    };

    loadPopularSuggestions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      debouncedSearch(value.trim());
    } else {
      setSuggestions([]);
    }
  };

  const handleInputFocus = () => {
    setHasFocus(true);
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setHasFocus(false);
      setShowDropdown(false);
      setSelectedIndex(-1);
    }, 150);
  };

  const handleSuggestionClick = (suggestion: AutocompleteResult) => {
    setQuery(suggestion.name);
    setShowDropdown(false);
    setSelectedIndex(-1);

    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowDropdown(false);
      if (onSearch) {
        onSearch(query.trim());
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentSuggestions = query.trim() ? suggestions : popularSuggestions;

    if (!showDropdown || currentSuggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < currentSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(currentSuggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const displaySuggestions = query.trim() ? suggestions : popularSuggestions;
  const showNoResults = query.trim() && suggestions.length === 0 && !isLoading;

  const SuggestionItem: React.FC<{
    suggestion: AutocompleteResult;
    isSelected: boolean;
    onClick: () => void;
  }> = ({ suggestion, isSelected, onClick }) => (
    <div
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
        isSelected ? "bg-emerald-50" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        {suggestion.type === "product" ? (
          suggestion.imageUrl ? (
            <img
              src={`${S3_BASE_URL}${suggestion.imageUrl}`}
              alt={suggestion.name}
              className="w-8 h-8 rounded object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <Package size={16} className="text-gray-400" />
            </div>
          )
        ) : (
          <div className="w-8 h-8 bg-emerald-100 rounded flex items-center justify-center">
            <Tag size={16} className="text-emerald-600" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate">
            {suggestion.name}
          </span>
          {suggestion.category && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {suggestion.category}
            </span>
          )}
        </div>
        {suggestion.description && (
          <p className="text-sm text-gray-500 truncate mt-0.5">
            {suggestion.description}
          </p>
        )}
      </div>

      <Search size={14} className="text-gray-400 flex-shrink-0" />
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 
            transition-all ${isMobile ? "text-sm" : ""}`}
        />

        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={isMobile ? 16 : 18}
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 
              rounded-full transition-colors"
          >
            <X size={14} className="text-gray-400" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
            rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto ${
              isMobile ? "max-h-80" : ""
            }`}
        >
          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              <span className="ml-2 text-sm text-gray-600">Searching...</span>
            </div>
          )}

          {showNoResults && (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          )}

          {!query.trim() && popularSuggestions.length > 0 && (
            <div className="flex items-center gap-2 p-3 pb-2 border-b border-gray-100">
              <TrendingUp size={16} className="text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">
                Popular Searches
              </span>
            </div>
          )}

          {displaySuggestions.length > 0 && !isLoading && (
            <div>
              {displaySuggestions.map((suggestion, index) => (
                <SuggestionItem
                  key={`${suggestion.type}-${suggestion.id}`}
                  suggestion={suggestion}
                  isSelected={index === selectedIndex}
                  onClick={() => handleSuggestionClick(suggestion)}
                />
              ))}
            </div>
          )}

          {query.trim() && !isLoading && (
            <div className="border-t border-gray-100">
              <div
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                  selectedIndex === -1 && hasFocus
                    ? "bg-emerald-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={handleSearch}
              >
                <div className="w-8 h-8 bg-emerald-100 rounded flex items-center justify-center flex-shrink-0">
                  <Search size={16} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900">
                    Search for "{query}"
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
