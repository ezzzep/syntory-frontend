"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { type Supplier, type SupplierCategory } from "@/types/supplier";
import { suppliersTableStyles } from "@/styles/supplierStatus/supplierTable";
import DeleteSupplierModal from "../deleteSupplierModal";
import RatingModal from "../ratingModal";
import CategoryTabs from "./categoryTabs";
import SearchAndActions from "./searchAndActions";
import SupplierTable from "./supplierTable";
import SupplierCard from "./supplierCard";
import { Package } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import SuppliersPagination from "./supplierPagination";

interface SuppliersTableProps {
  suppliers: Supplier[];
  onDelete: (id: number) => void;
  onUpdate: (updatedSupplier: Supplier) => void;
  onAdd: (supplier: Supplier) => void;
}

const ROWS_PER_PAGE = 5;

export default function SuppliersTable({
  suppliers,
  onDelete,
  onUpdate,
  onAdd,
}: SuppliersTableProps) {
  const [activeTab, setActiveTab] = useState<SupplierCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

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
    requirements: 0,
    quality: 0,
    delivery: 0,
    communication: 0,
  });

  const [supplierIndividualRatings, setSupplierIndividualRatings] = useState<
    Record<
      number,
      {
        overall: number;
        requirements: number;
        quality: number;
        delivery: number;
        communication: number;
      }
    >
  >({});

  const processedSuppliers = useRef<Set<number>>(new Set());
  
  const sortedSuppliers = useMemo(() => {
    return [...suppliers].sort((a, b) => b.id - a.id);
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    return sortedSuppliers.filter((supplier) => {
      const matchesCategory =
        activeTab === "all" || supplier.category === activeTab;
      const matchesSearch =
        searchTerm === "" ||
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact_person
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [sortedSuppliers, activeTab, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredSuppliers.length / ROWS_PER_PAGE);
  }, [filteredSuppliers.length]);

  const paginatedSuppliers = useMemo(() => {
    if (showAll) {
      return filteredSuppliers;
    }
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredSuppliers.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredSuppliers, currentPage, showAll]);

  useMemo(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedSuppliers(paginatedSuppliers.map((supplier) => supplier.id));
      } else {
        setSelectedSuppliers([]);
      }
    },
    [paginatedSuppliers]
  );

  const handleSelectSupplier = useCallback((id: number, checked: boolean) => {
    if (checked) {
      setSelectedSuppliers((prev) => [...prev, id]);
    } else {
      setSelectedSuppliers((prev) =>
        prev.filter((supplier) => supplier !== id)
      );
    }
  }, []);

  const handleDeleteClick = useCallback((supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  }, []);

  const handleBulkDeleteClick = useCallback(() => {
    const selectedSuppliersData = sortedSuppliers.filter((supplier) =>
      selectedSuppliers.includes(supplier.id)
    );
    setSuppliersToDelete(selectedSuppliersData);
    setIsDeleteModalOpen(true);
  }, [sortedSuppliers, selectedSuppliers]);

  const handleConfirmDelete = useCallback(async () => {
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
  }, [suppliersToDelete, supplierToDelete, onDelete]);

  const openRatingModal = useCallback(
    (supplier: Supplier) => {
      setSelectedSupplier(supplier);
      setIsRatingModalOpen(true);
      const individualRatings = supplierIndividualRatings[supplier.id];

      if (individualRatings) {
        setRating(individualRatings);
      } else {
        const ratingValue = parseFloat(String(supplier.rating)) || 0;
        setRating({
          overall: ratingValue,
          requirements: ratingValue,
          quality: ratingValue,
          delivery: ratingValue,
          communication: ratingValue,
        });
      }
    },
    [supplierIndividualRatings]
  );

  const closeRatingModal = useCallback(() => {
    setIsRatingModalOpen(false);
    setSelectedSupplier(null);
  }, []);

  const handleRatingChange = useCallback(
    (
      category:
        | "overall"
        | "requirements"
        | "quality"
        | "delivery"
        | "communication",
      value: number
    ) => {
      setRating((prev) => ({ ...prev, [category]: value }));
    },
    []
  );

  const submitRating = useCallback(
    (updatedSupplier: Supplier) => {
      setSupplierIndividualRatings((prev) => ({
        ...prev,
        [updatedSupplier.id]: rating,
      }));
      onUpdate(updatedSupplier);
      closeRatingModal();
    },
    [rating, onUpdate, closeRatingModal]
  );

  const handleAddSupplier = useCallback(
    (supplier: Supplier) => {
      console.log("handleAddSupplier called with:", supplier);

      if (processedSuppliers.current.has(supplier.id)) {
        console.warn("Supplier already processed:", supplier.id);
        return;
      }

      processedSuppliers.current.add(supplier.id);

      console.log("Adding supplier to list:", supplier);

      onAdd(supplier);
    },
    [onAdd]
  );

  useMemo(() => {
    const currentSupplierIds = new Set(sortedSuppliers.map((s) => s.id));
    processedSuppliers.current = new Set(
      Array.from(processedSuppliers.current).filter((id) =>
        currentSupplierIds.has(id)
      )
    );
  }, [sortedSuppliers]);

  const isAllSelected =
    paginatedSuppliers.length > 0 &&
    selectedSuppliers.length === paginatedSuppliers.length;
  const isIndeterminate =
    selectedSuppliers.length > 0 &&
    selectedSuppliers.length < paginatedSuppliers.length;

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedSuppliers([]);
  }, []);

  const handleShowAllChange = useCallback((checked: boolean) => {
    setShowAll(checked);
    if (checked) {
      setCurrentPage(1);
    }
    setSelectedSuppliers([]);
  }, []);

  return (
    <div className={`${suppliersTableStyles.wrapper} px-2 sm:px-0`}>
      <div className="max-w-7xl mx-auto w-full">
        <SearchAndActions
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSuppliers={selectedSuppliers}
          onBulkDelete={handleBulkDeleteClick}
          isDeleting={isDeleting}
          onAdd={handleAddSupplier}
        />

        <CategoryTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          suppliers={sortedSuppliers}
        />

        <div className="flex justify-start mb-4 cursor-pointer">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-all"
              checked={showAll}
              onCheckedChange={handleShowAllChange}
              className=" cursor-pointer"
            />
            <label
              htmlFor="show-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Show All
            </label>
          </div>
        </div>

        <div className={suppliersTableStyles.desktopWrapper}>
          <SupplierTable
            suppliers={paginatedSuppliers}
            selectedSuppliers={selectedSuppliers}
            onSelectAll={handleSelectAll}
            onSelectSupplier={handleSelectSupplier}
            onDeleteClick={handleDeleteClick}
            onOpenRatingModal={openRatingModal}
            isDeleting={isDeleting}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
          />
        </div>

        <div className={suppliersTableStyles.mobileWrapper}>
          {paginatedSuppliers.length === 0 ? (
            <div className={suppliersTableStyles.emptyState}>
              <Package className={suppliersTableStyles.emptyStateIcon} />
              <p className="text-base font-medium mb-2">
                {searchTerm
                  ? "No suppliers found matching your search."
                  : activeTab === "all"
                  ? "No suppliers found."
                  : `No suppliers found in ${activeTab} category.`}
              </p>
              <p className="text-sm">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Suppliers will appear here once added."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedSuppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  isSelected={selectedSuppliers.includes(supplier.id)}
                  onSelect={handleSelectSupplier}
                  onDeleteClick={handleDeleteClick}
                  onOpenRatingModal={openRatingModal}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          )}
        </div>

        {/* Use new pagination component */}
        {!showAll && totalPages > 1 && (
          <SuppliersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
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
