/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Plus,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAddSupplierDialog } from "@/hooks/useAddSupplierDialog";
import { addSupplierDialogStyles } from "@/styles/supplierStatus/addSupplierDialogStyles";

interface AddSupplierDialogProps {
  onAdd: (supplier: any) => void;
}

export default function AddSupplierDialog({ onAdd }: AddSupplierDialogProps) {
  const {
    loading,
    open,
    dateInputRef,
    errors,
    form,
    categories,
    setOpen,
    handleSubmit,
    handleCalendarClick,
    handleDateInputBlur,
    handleDateKeyDown,
    handlePhoneChange,
    handleInputChange,
  } = useAddSupplierDialog(onAdd);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={addSupplierDialogStyles.dialogTrigger}>
          <span className={addSupplierDialogStyles.dialogTriggerSpan}></span>
          <Plus className="w-4 h-4 mr-2 relative z-10" />
          <span className="relative z-10">Add Supplier</span>
        </Button>
      </DialogTrigger>

      <DialogContent className={addSupplierDialogStyles.dialogContent}>
        <div className={addSupplierDialogStyles.dialogHeader}>
          <DialogHeader>
            <DialogTitle className={addSupplierDialogStyles.dialogTitle}>
              Add New Supplier
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className={addSupplierDialogStyles.formContainer}>
          <div className={addSupplierDialogStyles.formField}>
            <label className={addSupplierDialogStyles.label}>
              <Building className="w-4 h-4 mr-2" />
              Company Name
            </label>
            <Input
              placeholder="Enter company name"
              value={form.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={addSupplierDialogStyles.input}
            />
            {errors.name && (
              <p className={addSupplierDialogStyles.error}>{errors.name}</p>
            )}
          </div>

          <div className={addSupplierDialogStyles.formRow}>
            <div className={addSupplierDialogStyles.formField}>
              <label className={addSupplierDialogStyles.label}>
                <User className="w-4 h-4 mr-2" />
                Contact Person
              </label>
              <Input
                placeholder="Contact person name"
                value={form.contact_person}
                onChange={(e) =>
                  handleInputChange("contact_person", e.target.value)
                }
                className={addSupplierDialogStyles.input}
              />
              {errors.contact_person && (
                <p className={addSupplierDialogStyles.error}>
                  {errors.contact_person}
                </p>
              )}
            </div>

            <div className={addSupplierDialogStyles.formField}>
              <label className={addSupplierDialogStyles.label}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </label>
              <Input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={addSupplierDialogStyles.input}
              />
              {errors.email && (
                <p className={addSupplierDialogStyles.error}>{errors.email}</p>
              )}
            </div>
          </div>

          <div className={addSupplierDialogStyles.formRow}>
            <div className={addSupplierDialogStyles.formField}>
              <label className={addSupplierDialogStyles.label}>
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </label>
              <Input
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={handlePhoneChange}
                pattern="[0-9]*"
                inputMode="numeric"
                className={addSupplierDialogStyles.input}
              />
              {errors.phone && (
                <p className={addSupplierDialogStyles.error}>{errors.phone}</p>
              )}
            </div>

            <div className={addSupplierDialogStyles.formField}>
              <label className={addSupplierDialogStyles.label}>
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </label>
              <Input
                placeholder="Company location"
                value={form.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={addSupplierDialogStyles.input}
              />
              {errors.location && (
                <p className={addSupplierDialogStyles.error}>
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          <div className={addSupplierDialogStyles.formRow}>
            <div className={addSupplierDialogStyles.formField}>
              <label className={addSupplierDialogStyles.label}>
                <Package className="w-4 h-4 mr-2" />
                Category
              </label>
              <div className="relative">
                <select
                  className={addSupplierDialogStyles.select}
                  value={form.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value as any)
                  }
                >
                  {categories.map((cat) => (
                    <option
                      key={cat.value}
                      value={cat.value}
                      className={addSupplierDialogStyles.selectOption}
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className={addSupplierDialogStyles.selectIcon}>
                  <Package className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            <div className={addSupplierDialogStyles.formField}>
              <label className={addSupplierDialogStyles.label}>
                <Calendar className="w-4 h-4 mr-2" />
                Last Delivery
              </label>
              <div className="relative">
                <Input
                  ref={dateInputRef}
                  type="text"
                  placeholder="Select a date"
                  value={form.last_delivery}
                  onChange={(e) =>
                    handleInputChange("last_delivery", e.target.value)
                  }
                  onBlur={handleDateInputBlur}
                  onKeyDown={handleDateKeyDown}
                  className={addSupplierDialogStyles.dateInput}
                />
                <button
                  type="button"
                  onClick={handleCalendarClick}
                  className={addSupplierDialogStyles.dateButton}
                >
                  <Calendar className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={addSupplierDialogStyles.footer}>
          <Button
            variant="outline"
            className={addSupplierDialogStyles.cancelButton}
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className={addSupplierDialogStyles.saveButton}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className={addSupplierDialogStyles.loadingSpinner}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Save Supplier
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
