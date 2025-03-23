
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Ara...", 
  className 
}) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  // .NET MVC için örnek Razor kodu:
  /*
  <form method="get" action="@Url.Action("Search", "Candidate")" class="search-bar @ViewBag.SearchBarClass">
    <i class="search-icon"></i>
    <input 
      type="text" 
      name="query" 
      value="@ViewBag.SearchQuery" 
      placeholder="@ViewBag.SearchPlaceholder" 
      class="search-input" />
    @if (!string.IsNullOrEmpty(ViewBag.SearchQuery)) {
      <button type="button" class="clear-button" onclick="this.form.query.value=''; this.form.submit();">
        <i class="clear-icon"></i>
      </button>
    }
  </form>
  */

  return (
    <div className={`search-bar ${className}`}>
      <Search className="w-5 h-5 text-gray-400 search-icon" />
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none px-3 py-1 focus:ring-0 search-input"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="text-gray-400 hover:text-gray-600 transition-colors clear-button"
        >
          <X className="w-4 h-4 clear-icon" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
