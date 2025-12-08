"use client";

import { useState, useMemo } from "react";
import { type Supplier, type SupplierCategory } from "@/types/supplier"; // Import both types
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddSupplierDialog from "./addSupplier";
import DeleteSupplierModal from "./deleteSupplierModal";
import RatingModal from "./ratingModal";

import {
  Search,
  Package,
  Phone,
  Mail,
  Calendar,
  Trash2,
  Star,
  Home,
  Cpu,
  Sparkles,
  Grid3X3,
  Zap,
} from "lucide-react";
import { suppliersTableStyles } from "@/styles/supplierStatus/supplierTable";

interface SuppliersTableProps {
  suppliers: Supplier[];
  onDelete: (id: number) => void;
  onUpdate: (updatedSupplier: Supplier) => void;
  onAdd: (supplier: Supplier) => void;
}

export default function SuppliersTable({
  suppliers,
  onDelete,
  onUpdate,
  onAdd,
}: SuppliersTableProps) {
  const categories: {
    name: string;
    value: SupplierCategory | "all";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    color: string;
  }[] = [
    {
      name: "All",
      value: "all",
      icon: Grid3X3,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Appliances",
      value: "appliances",
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Home & Living",
      value: "home-living",
      icon: Home,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Gadgets",
      value: "gadgets",
      icon: Cpu,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Home Cleaning",
      value: "home-cleaning",
      icon: Sparkles,
      color: "from-orange-500 to-red-500",
    },
  ];

  const [activeTab, setActiveTab] = useState<SupplierCategory | "all">(
    categories[0].value
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  );
  const [suppliersToDelete, setSuppliersToDelete] = useState<Supplier[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [rating, setRating] = useState({
    overall: 0,
    quality: 0,
    delivery: 0,
    communication: 0,
  });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesCategory =
        activeTab === "all" || supplier.category === activeTab;
      const matchesSearch =
        searchTerm === "" ||
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [suppliers, activeTab, searchTerm]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSuppliers(filteredSuppliers.map((supplier) => supplier.id));
    } else {
      setSelectedSuppliers([]);
    }
  };

  const handleSelectSupplier = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedSuppliers((prev) => [...prev, id]);
    } else {
      setSelectedSuppliers((prev) =>
        prev.filter((supplier) => supplier !== id)
      );
    }
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleBulkDeleteClick = () => {
    const selectedSuppliersData = suppliers.filter((supplier) =>
      selectedSuppliers.includes(supplier.id)
    );
    setSuppliersToDelete(selectedSuppliersData);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      if (suppliersToDelete.length > 0) {
        await Promise.all(
          suppliersToDelete.map((supplier) => onDelete(supplier.id))
        );
        setSelectedSuppliers([]);
      } else if (supplierToDelete) {
        await onDelete(supplierToDelete.id);
      }
      setIsDeleteModalOpen(false);
      setSupplierToDelete(null);
      setSuppliersToDelete([]);
    } catch (error) {
      console.error("Error deleting supplier(s):", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openRatingModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsRatingModalOpen(true);
    setRating({
      overall: 0,
      quality: 0,
      delivery: 0,
      communication: 0,
    });
  };

  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleRatingChange = (category: keyof typeof rating, value: number) => {
    setRating((prev) => ({ ...prev, [category]: value }));
  };

  const submitRating = () => {
    console.log("Submitting rating for supplier:", selectedSupplier?.id);
    console.log("Rating:", rating);
    closeRatingModal();
  };

  const isAllSelected =
    filteredSuppliers.length > 0 &&
    selectedSuppliers.length === filteredSuppliers.length;
  const isIndeterminate =
    selectedSuppliers.length > 0 &&
    selectedSuppliers.length < filteredSuppliers.length;

  const getCategoryColor = (category: SupplierCategory) => {
    switch (category) {
      case "appliances":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "home-living":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "gadgets":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "home-cleaning":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`${suppliersTableStyles.wrapper} px-2 sm:px-0`}>
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={suppliersTableStyles.searchInput}
                />
              </div>

              {selectedSuppliers.length > 0 && (
                <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
                  <span className={suppliersTableStyles.selectedCount}>
                    {selectedSuppliers.length} supplier
                    {selectedSuppliers.length > 1 ? "s" : ""} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={suppliersTableStyles.trashButton}
                    onClick={handleBulkDeleteClick}
                    disabled={isDeleting}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>


            <AddSupplierDialog onAdd={onAdd} />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3 md:flex-nowrap md:overflow-x-auto md:pb-2 md:scrollbar-hide">
            {categories.map((category) => {
              const isActive = activeTab === category.value;
              const supplierCount =
                category.value === "all"
                  ? suppliers.length
                  : suppliers.filter((s) => s.category === category.value)
                      .length;

              const Icon = category.icon;

              return (
                <button
                  key={category.value}
                  onClick={() => setActiveTab(category.value)}
                  className={`
                    relative flex-shrink-0 px-3 py-2 sm:px-4 rounded-lg transition-all duration-200 overflow-hidden
                    min-w-fit flex items-center gap-1 sm:gap-2
                    ${
                      isActive
                        ? `${suppliersTableStyles.tabActive} shadow-lg`
                        : suppliersTableStyles.tabInactive
                    }
                  `}
                >
                  <div
                    className={`${suppliersTableStyles.tabGradient} ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      background: isActive
                        ? `linear-gradient(to right, ${category.color})`
                        : "none",
                    }}
                  ></div>

                  <div className={suppliersTableStyles.tabContent}>
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">
                        {category.name}
                      </span>
                    </div>
                    <span
                      className={`${suppliersTableStyles.tabBadge} ${
                        isActive
                          ? suppliersTableStyles.tabBadgeActive
                          : suppliersTableStyles.tabBadgeInactive
                      }`}
                    >
                      {supplierCount}
                    </span>
                  </div>

                  {isActive && (
                    <div className={suppliersTableStyles.tabIndicator}></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className={suppliersTableStyles.desktopWrapper}>
          <div className="overflow-x-auto">
            <Table
              className={suppliersTableStyles.table}
              style={{ tableLayout: "fixed", minWidth: "1100px" }}
            >
              <TableHeader className={suppliersTableStyles.tableHeader}>
                <TableRow>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "60px" }}
                  >
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className={`${suppliersTableStyles.checkbox} ${
                        isAllSelected
                          ? suppliersTableStyles.checkboxChecked
                          : ""
                      }`}
                    />
                  </TableHead>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "250px" }}
                  >
                    Supplier
                  </TableHead>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "250px" }}
                  >
                    Contact
                  </TableHead>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "120px" }}
                  >
                    Category
                  </TableHead>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "150px" }}
                  >
                    Last Delivery
                  </TableHead>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "180px" }}
                  >
                    Rating
                  </TableHead>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "180px" }}
                  >
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className={suppliersTableStyles.emptyState}
                    >
                      <Package
                        className={suppliersTableStyles.emptyStateIcon}
                      />
                      <p className="text-lg font-medium mb-2">
                        {searchTerm
                          ? "No suppliers found matching your search."
                          : activeTab === "all"
                          ? "No suppliers found."
                          : `No suppliers found in ${
                              categories.find((c) => c.value === activeTab)
                                ?.name || "this"
                            } category.`}
                      </p>
                      <p className="text-sm">
                        {searchTerm
                          ? "Try adjusting your search terms."
                          : "Suppliers will appear here once added."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow
                      key={supplier.id}
                      className={`${suppliersTableStyles.tableRowHover} ${
                        selectedSuppliers.includes(supplier.id)
                          ? "bg-slate-700/10"
                          : ""
                      }`}
                    >
                      <TableCell className={suppliersTableStyles.tableCell}>
                        <input
                          type="checkbox"
                          checked={selectedSuppliers.includes(supplier.id)}
                          onChange={(e) =>
                            handleSelectSupplier(supplier.id, e.target.checked)
                          }
                          className={`${suppliersTableStyles.checkbox} ${
                            selectedSuppliers.includes(supplier.id)
                              ? suppliersTableStyles.checkboxChecked
                              : ""
                          }`}
                        />
                      </TableCell>
                      <TableCell className={suppliersTableStyles.tableCellName}>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold mr-3">
                            {supplier.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white truncate block">
                              {supplier.name}
                            </div>
                            <div className="text-xs text-gray-400 truncate block">
                              {supplier.contactPerson}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className={suppliersTableStyles.tableCell}>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-300">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="truncate">{supplier.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <Phone className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="truncate">{supplier.phone}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className={suppliersTableStyles.tableCell}>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                            supplier.category
                          )}`}
                        >
                          {supplier.category.charAt(0).toUpperCase() +
                            supplier.category.slice(1)}
                        </span>
                      </TableCell>

                      <TableCell className={suppliersTableStyles.tableCell}>
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {supplier.lastDelivery}
                        </div>
                      </TableCell>

                      <TableCell className={suppliersTableStyles.tableCell}>
                        <div className="flex items-center">
                          {renderStars(supplier.rating)}
                          <span className="ml-2 text-sm text-gray-300">
                            {supplier.rating}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className={suppliersTableStyles.actionCell}>
                        <Button
                          variant="outline"
                          size="sm"
                          className={suppliersTableStyles.starButton}
                          onClick={() => openRatingModal(supplier)}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={suppliersTableStyles.trashButton}
                          onClick={() => handleDeleteClick(supplier)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4 hover:text-red-400 cursor-pointer" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Tablet view */}
        <div className={suppliersTableStyles.tabletWrapper}>
          <div className="overflow-x-auto">
            <Table
              className={suppliersTableStyles.table}
              style={{ tableLayout: "fixed", minWidth: "800px" }}
            >
              <TableHeader className={suppliersTableStyles.tableHeader}>
                <TableRow>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "60px" }}
                  >
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className={`${suppliersTableStyles.checkbox} ${
                        isAllSelected
                          ? suppliersTableStyles.checkboxChecked
                          : ""
                      }`}
                    />
                  </TableHead>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "200px" }}
                  >
                    Supplier
                  </TableHead>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "200px" }}
                  >
                    Contact
                  </TableHead>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "100px" }}
                  >
                    Category
                  </TableHead>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "120px" }}
                  >
                    Rating
                  </TableHead>
                  <TableHead
                    className={suppliersTableStyles.tableHeadCell}
                    style={{ width: "120px" }}
                  >
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className={suppliersTableStyles.emptyState}
                    >
                      <Package
                        className={suppliersTableStyles.emptyStateIcon}
                      />
                      <p className="text-lg font-medium mb-2">
                        {searchTerm
                          ? "No suppliers found matching your search."
                          : activeTab === "all"
                          ? "No suppliers found."
                          : `No suppliers found in ${
                              categories.find((c) => c.value === activeTab)
                                ?.name || "this"
                            } category.`}
                      </p>
                      <p className="text-sm">
                        {searchTerm
                          ? "Try adjusting your search terms."
                          : "Suppliers will appear here once added."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow
                      key={supplier.id}
                      className={`${suppliersTableStyles.tableRowHover} ${
                        selectedSuppliers.includes(supplier.id)
                          ? "bg-slate-700/10"
                          : ""
                      }`}
                    >
                      <TableCell className={suppliersTableStyles.tableCell}>
                        <input
                          type="checkbox"
                          checked={selectedSuppliers.includes(supplier.id)}
                          onChange={(e) =>
                            handleSelectSupplier(supplier.id, e.target.checked)
                          }
                          className={`${suppliersTableStyles.checkbox} ${
                            selectedSuppliers.includes(supplier.id)
                              ? suppliersTableStyles.checkboxChecked
                              : ""
                          }`}
                        />
                      </TableCell>
                      <TableCell className={suppliersTableStyles.tableCellName}>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold mr-2">
                            {supplier.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white truncate block">
                              {supplier.name}
                            </div>
                            <div className="text-xs text-gray-400 truncate block">
                              {supplier.contactPerson}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className={suppliersTableStyles.tableCell}>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-300">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="truncate">{supplier.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <Phone className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="truncate">{supplier.phone}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className={suppliersTableStyles.tableCell}>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                            supplier.category
                          )}`}
                        >
                          {supplier.category.charAt(0).toUpperCase() +
                            supplier.category.slice(1)}
                        </span>
                      </TableCell>

                      <TableCell className={suppliersTableStyles.tableCell}>
                        <div className="flex items-center">
                          {renderStars(supplier.rating)}
                          <span className="ml-2 text-sm text-gray-300">
                            {supplier.rating}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className={suppliersTableStyles.actionCell}>
                        <Button
                          variant="outline"
                          size="sm"
                          className={suppliersTableStyles.starButton}
                          onClick={() => openRatingModal(supplier)}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={suppliersTableStyles.trashButton}
                          onClick={() => handleDeleteClick(supplier)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className={suppliersTableStyles.mobileWrapper}>
          {filteredSuppliers.length === 0 ? (
            <div className={suppliersTableStyles.emptyState}>
              <Package className={suppliersTableStyles.emptyStateIcon} />
              <p className="text-base font-medium mb-2">
                {searchTerm
                  ? "No suppliers found matching your search."
                  : activeTab === "all"
                  ? "No suppliers found."
                  : `No suppliers found in ${
                      categories.find((c) => c.value === activeTab)?.name ||
                      "this"
                    } category.`}
              </p>
              <p className="text-sm">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Suppliers will appear here once added."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className={`${suppliersTableStyles.mobileCard} ${
                    selectedSuppliers.includes(supplier.id)
                      ? "ring-2 ring-blue-500/50"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <input
                      type="checkbox"
                      checked={selectedSuppliers.includes(supplier.id)}
                      onChange={(e) =>
                        handleSelectSupplier(supplier.id, e.target.checked)
                      }
                      className={`${suppliersTableStyles.checkbox} mt-1 ${
                        selectedSuppliers.includes(supplier.id)
                          ? suppliersTableStyles.checkboxChecked
                          : ""
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold mr-3">
                          {supplier.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-white truncate">
                            {supplier.name}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {supplier.contactPerson}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border flex-shrink-0 ${getCategoryColor(
                        supplier.category
                      )}`}
                    >
                      {supplier.category.charAt(0).toUpperCase() +
                        supplier.category.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-300 mb-1">
                        <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{supplier.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{supplier.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span>{supplier.lastDelivery}</span>
                    </div>
                    <div className="flex items-center">
                      {renderStars(supplier.rating)}
                      <span className="ml-2 text-sm text-gray-300">
                        {supplier.rating}
                      </span>
                    </div>
                  </div>

                  <div className={suppliersTableStyles.mobileActions}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={suppliersTableStyles.starButton}
                      onClick={() => openRatingModal(supplier)}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={suppliersTableStyles.trashButton}
                      onClick={() => handleDeleteClick(supplier)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteSupplierModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setSupplierToDelete(null);
            setSuppliersToDelete([]);
          }
        }}
        onConfirm={handleConfirmDelete}
        supplier={supplierToDelete}
        suppliers={suppliersToDelete}
      />

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={closeRatingModal}
        onConfirm={submitRating}
        supplier={selectedSupplier}
        rating={rating}
        onRatingChange={handleRatingChange}
      />
    </div>
  );
}
