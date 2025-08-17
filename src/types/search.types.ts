// Search Types
export interface AutocompleteResult {
  type: 'product' | 'category';
  id: string;
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
}

export interface SearchResponse {
  message: string;
  query?: string;
  suggestions: AutocompleteResult[];
}