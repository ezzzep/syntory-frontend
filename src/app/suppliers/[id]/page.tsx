"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { getSupplierById, updateSupplier } from "@/lib/api/suppliers";
import type { Supplier } from "@/types/supplier";
import {
  Star,
  MapPin,
  Mail,
  Phone,
  Package,
  Calendar,
  User,
  Building,
  Edit,
  Save,
  X,
  ArrowLeft,
  Camera,
} from "lucide-react";
import { useToasts } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the update data types for each section
type NameUpdate = {
  name?: string;
  image_url?: string;
};

type ContactUpdate = {
  contact_person?: string;
  email?: string;
  phone?: string;
};

type BusinessUpdate = {
  location?: string;
  category?: string;
};

type DeliveryUpdate = {
  last_delivery?: string;
};

type UpdateData = NameUpdate | ContactUpdate | BusinessUpdate | DeliveryUpdate;

export default function SupplierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname(); // Add this to get the current path
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toasts = useToasts();

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        if (params.id) {
          const id = Number(params.id);
          const data = await getSupplierById(id);
          setSupplier(data);

          // Check if there's a saved image in localStorage for this supplier
          const savedImage = localStorage.getItem(`supplier_image_${id}`);
          if (savedImage) {
            setImageUrl(savedImage);
          } else {
            setImageUrl(data.image_url || "");
          }
        }
      } catch (err) {
        console.warn("Failed to fetch supplier:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [params.id]);

  // Add this useEffect to set the active navigation item
  useEffect(() => {
    // This will be used by the sidebar component to determine which tab is active
    // The sidebar should check if pathname includes '/suppliers' to highlight the Suppliers tab
    // If your sidebar uses a different method, adjust accordingly
    if (typeof window !== "undefined") {
      // Store the current active section in localStorage or a global state
      localStorage.setItem("activeNav", "suppliers");

      // If your sidebar uses a context or state management, you would update it here
      // For example: setActiveNav('suppliers');
    }
  }, [pathname]);

  // Function to render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-300">({rating}/5)</span>
      </div>
    );
  };

  // Format category for display
  const formatCategory = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a FileReader to convert the image to a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        // This will be a base64 string that can be stored permanently
        const base64String = reader.result as string;
        setImageUrl(base64String);
        setFormData({ ...formData, image_url: base64String });

        // Store the image in localStorage for persistence
        if (params.id) {
          localStorage.setItem(`supplier_image_${params.id}`, base64String);
        }
      };
      reader.readAsDataURL(file);

      // If not already editing the name section, start editing it
      if (editSection !== "name") {
        startEditing("name");
      }
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Start editing a section
  const startEditing = (section: string) => {
    if (!supplier) return;

    // Set form data based on section
    if (section === "name") {
      setFormData({
        name: supplier.name,
        image_url: imageUrl || supplier.image_url || "",
      } as NameUpdate);
    } else if (section === "contact") {
      setFormData({
        contact_person: supplier.contact_person,
        email: supplier.email,
        phone: supplier.phone,
      } as ContactUpdate);
    } else if (section === "business") {
      setFormData({
        location: supplier.location,
        category: supplier.category,
      } as BusinessUpdate);
    } else if (section === "delivery") {
      setFormData({
        last_delivery: supplier.last_delivery,
      } as DeliveryUpdate);
    }

    setEditSection(section);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditSection(null);
    setFormData({});
    // Reset image URL to original value
    if (supplier) {
      const savedImage = localStorage.getItem(`supplier_image_${supplier.id}`);
      setImageUrl(savedImage || supplier.image_url || "");
    }
  };

  // Save changes
  const saveChanges = async () => {
    if (!supplier) return;

    setIsSaving(true);
    try {
      // Create the update payload with only the changed fields
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatePayload: any = {};

      // Add the fields from the current edit section
      Object.assign(updatePayload, formData);

      const updatedSupplier = await updateSupplier(supplier.id, updatePayload);
      setSupplier(updatedSupplier);
      setEditSection(null);
      setFormData({});
      toasts.success("Supplier information updated successfully");
    } catch (err) {
      console.error("Failed to update supplier:", err);
      toasts.error("Failed to update supplier information");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  // Navigate back to suppliers page
  const navigateToSuppliers = () => {
    router.push("/suppliers");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-white text-xl">
                Loading supplier details...
              </p>
            </div>
          </div>
        ) : supplier ? (
          <div className="max-w-4xl mx-auto">
            {/* Header with supplier name and avatar */}
            <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-5 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden mr-6">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={supplier.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-2xl">
                        {supplier.name.charAt(0)}
                      </div>
                    )}
                    {editSection === "name" && (
                      <button
                        onClick={triggerFileInput}
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Camera className="h-6 w-6 text-white" />
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div>
                    {editSection === "name" ? (
                      <Input
                        value={(formData as NameUpdate).name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="text-3xl font-bold text-white bg-slate-700/50 border border-slate-600/40 mb-2"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {supplier.name}
                      </h1>
                    )}
                    <div className="flex items-center">
                      {renderRating(supplier.rating || 0)}
                    </div>
                  </div>
                </div>
                {editSection !== "name" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing("name")}
                    className="text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={saveChanges}
                      disabled={isSaving}
                      className="text-green-400 hover:text-green-300 hover:bg-slate-700/50 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEditing}
                      className="text-red-400 hover:text-red-300 hover:bg-slate-700/50 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Supplier details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Contact Information */}
              <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <User className="mr-2 h-5 w-5 text-blue-400" />
                    Contact Information
                  </h2>
                  {editSection !== "contact" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing("contact")}
                      className="text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={saveChanges}
                        disabled={isSaving}
                        className="text-green-400 hover:text-green-300 hover:bg-slate-700/50 cursor-pointer"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                        className="text-red-400 hover:text-red-300 hover:bg-slate-700/50 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Contact Person</p>
                      {editSection === "contact" ? (
                        <Input
                          value={
                            (formData as ContactUpdate).contact_person || ""
                          }
                          onChange={(e) =>
                            handleInputChange("contact_person", e.target.value)
                          }
                          className="bg-slate-700/50 border border-slate-600/40 text-white"
                        />
                      ) : (
                        <p className="text-white">{supplier.contact_person}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Email</p>
                      {editSection === "contact" ? (
                        <Input
                          type="email"
                          value={(formData as ContactUpdate).email || ""}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="bg-slate-700/50 border border-slate-600/40 text-white"
                        />
                      ) : (
                        <p className="text-white">{supplier.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Phone</p>
                      {editSection === "contact" ? (
                        <Input
                          value={(formData as ContactUpdate).phone || ""}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="bg-slate-700/50 border border-slate-600/40 text-white"
                        />
                      ) : (
                        <p className="text-white">{supplier.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Building className="mr-2 h-5 w-5 text-blue-400" />
                    Business Information
                  </h2>
                  {editSection !== "business" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing("business")}
                      className="text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={saveChanges}
                        disabled={isSaving}
                        className="text-green-400 hover:text-green-300 hover:bg-slate-700/50 cursor-pointer"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                        className="text-red-400 hover:text-red-300 hover:bg-slate-700/50 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Location</p>
                      {editSection === "business" ? (
                        <Input
                          value={(formData as BusinessUpdate).location || ""}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                          className="bg-slate-700/50 border border-slate-600/40 text-white"
                        />
                      ) : (
                        <p className="text-white">{supplier.location}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Package className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Category</p>
                      {editSection === "business" ? (
                        <select
                          value={(formData as BusinessUpdate).category || ""}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value)
                          }
                          className="w-full p-2 bg-slate-700/50 border border-slate-600/40 text-white rounded"
                        >
                          <option value="appliances">Appliances</option>
                          <option value="home-living">Home & Living</option>
                          <option value="gadgets">Gadgets</option>
                          <option value="home-cleaning">Home Cleaning</option>
                        </select>
                      ) : (
                        <p className="text-white">
                          {formatCategory(supplier.category)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Package className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Total Orders</p>
                      <p className="text-white">{supplier.total_orders}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information - Smaller version */}
            <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-blue-400" />
                  Delivery Information
                </h2>
                {editSection !== "delivery" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing("delivery")}
                    className="text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={saveChanges}
                      disabled={isSaving}
                      className="text-green-400 hover:text-green-300 hover:bg-slate-700/50 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEditing}
                      className="text-red-400 hover:text-red-300 hover:bg-slate-700/50 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-3 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Last Delivery</p>
                  {editSection === "delivery" ? (
                    <Input
                      type="date"
                      value={(formData as DeliveryUpdate).last_delivery || ""}
                      onChange={(e) =>
                        handleInputChange("last_delivery", e.target.value)
                      }
                      className="bg-slate-700/50 border border-slate-600/40 text-white"
                    />
                  ) : (
                    <p className="text-white">
                      {new Date(supplier.last_delivery).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-end gap-3">
              <Button
                onClick={navigateToSuppliers}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 text-center max-w-md">
              <h1 className="text-white text-2xl font-bold mb-2">
                Supplier Not Found
              </h1>
              <Button
                onClick={navigateToSuppliers}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Back to Suppliers
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
