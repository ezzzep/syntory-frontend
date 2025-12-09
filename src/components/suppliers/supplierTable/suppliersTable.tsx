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
  const [activeTab, setActiveTab] = useState<SupplierCategory | "all">("all");
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

  // Store individual ratings for each supplier
  const [supplierIndividualRatings, setSupplierIndividualRatings] = useState<
    Record<
      number,
      {
        overall: number;
        quality: number;
        delivery: number;
        communication: number;
      }
    >
  >({});

  // Track processed suppliers to prevent duplicates
  const processedSuppliers = useRef<Set<number>>(new Set());

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
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
  }, [suppliers, activeTab, searchTerm]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedSuppliers(filteredSuppliers.map((supplier) => supplier.id));
      } else {
        setSelectedSuppliers([]);
      }
    },
    [filteredSuppliers]
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
    const selectedSuppliersData = suppliers.filter((supplier) =>
      selectedSuppliers.includes(supplier.id)
    );
    setSuppliersToDelete(selectedSuppliersData);
    setIsDeleteModalOpen(true);
  }, [suppliers, selectedSuppliers]);

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

      // Get the individual ratings for this supplier, or use the overall rating as fallback
      const individualRatings = supplierIndividualRatings[supplier.id];

      if (individualRatings) {
        setRating(individualRatings);
      } else {
        // If no individual ratings stored, use the overall rating for all categories
        // Convert rating to number in case it's a string
        const ratingValue = parseFloat(String(supplier.rating)) || 0;
        setRating({
          overall: ratingValue,
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
    (category: keyof typeof rating, value: number) => {
      setRating((prev) => ({ ...prev, [category]: value }));
    },
    []
  );

  const submitRating = useCallback(
    (updatedSupplier: Supplier) => {
      // Store the individual ratings for this supplier
      setSupplierIndividualRatings((prev) => ({
        ...prev,
        [updatedSupplier.id]: rating,
      }));

      // Update the supplier with the new rating
      onUpdate(updatedSupplier);
      closeRatingModal();
    },
    [rating, onUpdate, closeRatingModal]
  );

  // Prevent duplicate suppliers from being added
  const handleAddSupplier = useCallback(
    (supplier: Supplier) => {
      console.log("handleAddSupplier called with:", supplier);

      // Check if we've already processed this supplier
      if (processedSuppliers.current.has(supplier.id)) {
        console.warn("Supplier already processed:", supplier.id);
        return;
      }

      // Mark as processed
      processedSuppliers.current.add(supplier.id);

      console.log("Adding supplier to list:", supplier);

      // Call the original onAdd function
      onAdd(supplier);
    },
    [onAdd]
  );

  // Clean up processed suppliers when suppliers list changes
  useMemo(() => {
    const currentSupplierIds = new Set(suppliers.map((s) => s.id));
    // Remove any processed suppliers that are no longer in the list
    processedSuppliers.current = new Set(
      Array.from(processedSuppliers.current).filter((id) =>
        currentSupplierIds.has(id)
      )
    );
  }, [suppliers]);

  const isAllSelected =
    filteredSuppliers.length > 0 &&
    selectedSuppliers.length === filteredSuppliers.length;
  const isIndeterminate =
    selectedSuppliers.length > 0 &&
    selectedSuppliers.length < filteredSuppliers.length;

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
          suppliers={suppliers}
        />

        <div className={suppliersTableStyles.desktopWrapper}>
          <SupplierTable
            suppliers={filteredSuppliers}
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
          {filteredSuppliers.length === 0 ? (
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
              {filteredSuppliers.map((supplier) => (
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
