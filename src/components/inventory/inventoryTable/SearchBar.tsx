import { Search } from "lucide-react";
import { inventoryTableStyles } from "@/styles/inventory/inventoryTable";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  return (
    <div className="relative flex-1 w-full sm:max-w-md">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={inventoryTableStyles.searchInput}
      />
    </div>
  );
}
