// components/suppliers/addSupplier.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Supplier, type SupplierCategory } from "@/types/supplier";

interface AddSupplierDialogProps {
  onAdd: (supplier: Supplier) => void;
}

export default function AddSupplierDialog({ onAdd }: AddSupplierDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<
    Omit<Supplier, "id" | "totalOrders" | "rating">
  >({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    location: "",
    category: "appliances",
    lastDelivery: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier: Supplier = {
      ...formData,
      id: Date.now(),
      totalOrders: 0,
      rating: 0,
    };
    onAdd(newSupplier);
    setIsOpen(false);
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      location: "",
      category: "appliances",
      lastDelivery: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <>
      <Button
        className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/20 rounded-lg px-4 py-2 text-sm font-medium"
        onClick={() => setIsOpen(true)}
      >
        Add Supplier
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl border border-indigo-900/30 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h1 className="text-xl font-bold text-white mb-4">
                Add New Supplier
              </h1>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPerson: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as SupplierCategory,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="appliances">Appliances</option>
                      <option value="home-living">Home & Living</option>
                      <option value="gadgets">Gadgets</option>
                      <option value="home-cleaning">Home Cleaning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Last Delivery
                    </label>
                    <input
                      type="date"
                      value={formData.lastDelivery}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastDelivery: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 col-span-2">
                  <Button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/20 rounded-lg text-sm font-medium"
                  >
                    Add Supplier
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
