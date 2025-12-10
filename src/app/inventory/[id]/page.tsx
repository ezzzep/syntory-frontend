"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import {
  getItemById,
  updateInventoryItem,
  uploadItemImage,
} from "@/lib/api/inventory";
import { getSuppliers } from "@/lib/api/suppliers";
import type { InventoryItem, UpdateInventoryDto } from "@/types/inventory";
import type { Supplier } from "@/types/supplier";
import { Edit, Save, X, Camera, Tag, Package, Building } from "lucide-react";
import { useToasts } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NameUpdate = {
  name?: string;
  image_path?: string;
};

type StockUpdate = {
  quantity?: number;
};

type DetailsUpdate = {
  category?: string;
  description?: string;
};

type UpdateData = NameUpdate | StockUpdate | DetailsUpdate;

export default function InventoryItemDetails() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePath, setImagePath] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toasts = useToasts();

  const categories = [
    "Appliances",
    "Home & Living",
    "Gadgets",
    "Home Cleaning",
  ];

  const getFullImageUrl = (path: string | null | undefined) => {
    if (!path) return "";

    if (path.startsWith("http")) {
      return path;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");
    const cleanPath = path.replace(/^\//, "");

    return `${cleanBaseUrl}/storage/${cleanPath}`;
  };

  // Function to determine stock status based on quantity
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { status: "Out of Stock", color: "text-red-500" };
    } else if (quantity < 10) {
      return { status: "Very Low Stock", color: "text-red-400" };
    } else if (quantity <= 20) {
      return { status: "Low Stock", color: "text-yellow-400" };
    } else {
      return { status: "High Stock", color: "text-green-400" };
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (params.id) {
          const id = Number(params.id);
          const data = await getItemById(id);
          console.log("Fetched item data:", data); // Debug log to check if supplier_id is included
          setItem(data);

          const fullImageUrl = getFullImageUrl(data.image_path);
          setImagePath(fullImageUrl);
        }
      } catch (err) {
        console.warn("Failed to fetch inventory item:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const suppliersData = await getSuppliers();
        setSuppliers(suppliersData);
      } catch (err) {
        console.warn("Failed to fetch suppliers:", err);
      }
    };

    fetchItem();
    fetchSuppliers();
  }, [params.id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeNav", "inventory");
    }
  }, [pathname]);

  const formatCategory = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const saveImagePathToDatabase = async (url: string) => {
    if (!item) return;

    try {
      const updatePayload = {
        image_path: url,
      } as unknown as UpdateInventoryDto;
      const updatedItem = await updateInventoryItem(item.id, updatePayload);
      // Preserve supplier information when updating
      setItem({
        ...updatedItem,
        supplier_name: item.supplier_name,
      });
      return updatedItem;
    } catch (error) {
      console.error("Failed to save image path:", error);
      throw error;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !item) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadItemImage(item.id, formData);

      if (result && result.image_url) {
        const pathOnly = result.image_url.replace(/.*\/storage\//, "");
        const fullImageUrl = getFullImageUrl(pathOnly);
        setImagePath(fullImageUrl);
        await saveImagePathToDatabase(pathOnly);

        toasts.success("Image uploaded and saved successfully");
      } else {
        console.error("Invalid response from server:", result);
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toasts.error(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const startEditing = (section: string) => {
    if (!item) return;

    if (section === "name") {
      setFormData({
        name: item.name,
        image_path: imagePath || item.image_path || "",
      } as NameUpdate);
    } else if (section === "stock") {
      setFormData({
        quantity: item.quantity,
      } as StockUpdate);
    } else if (section === "details") {
      setFormData({
        category: item.category || "",
        description: item.description || "",
      } as DetailsUpdate);
    } else if (section === "description") {
      setFormData({
        description: item.description || "",
      } as DetailsUpdate);
    }

    setEditSection(section);
  };

  const cancelEditing = () => {
    setEditSection(null);
    setFormData({});
    if (item) {
      const dbImagePath = getFullImageUrl(item.image_path);
      setImagePath(dbImagePath);
    }
  };

  const saveChanges = async () => {
    if (!item) return;

    setIsSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatePayload: any = {};

      Object.assign(updatePayload, formData);
      const updatedItem = await updateInventoryItem(item.id, updatePayload);

      // Preserve supplier information when updating
      setItem({
        ...updatedItem,
        supplier_name: item.supplier_name,
      });

      setEditSection(null);
      setFormData({});
      toasts.success("Item information updated successfully");
    } catch (err) {
      console.error("Failed to update item:", err);
      toasts.error("Failed to update item information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const navigateToInventory = () => {
    router.push("/inventory");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-white text-xl">Loading item details...</p>
            </div>
          </div>
        ) : item ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-5 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden mr-6">
                    {imagePath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagePath}
                        alt={item.name}
                        className="h-full w-full object-cover cursor-pointer"
                        onError={(e) => {
                          console.error("Image failed to load:", imagePath);
                          console.error(
                            "Item image_path from DB:",
                            item.image_path
                          );
                          if (
                            item.image_path &&
                            item.image_path !== imagePath
                          ) {
                            const fallbackUrl = getFullImageUrl(
                              item.image_path
                            );
                            console.log("Trying fallback URL:", fallbackUrl);
                            setImagePath(fallbackUrl);
                          }
                        }}
                        onLoad={() => {
                          console.log("Image loaded successfully:", imagePath);
                        }}
                      />
                    ) : null}
                    {!imagePath && (
                      <div className="h-full w-full bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-2xl cursor-pointer">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    {editSection === "name" && (
                      <button
                        onClick={triggerFileInput}
                        disabled={isUploading}
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isUploading ? (
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          <Camera className="h-6 w-6 text-white" />
                        )}
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
                        {item.name}
                      </h1>
                    )}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-400 mr-2">ID:</span>
                      <span className="text-sm text-gray-300">{item.id}</span>
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
                      disabled={isSaving || isUploading}
                      className="text-green-400 hover:text-green-300 hover:bg-slate-700/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-blue-400" />
                    Item Details
                  </h2>
                  {editSection !== "details" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing("details")}
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
                    <Tag className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Category</p>
                      {editSection === "details" ? (
                        <select
                          value={(formData as DetailsUpdate).category || ""}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value)
                          }
                          className="w-full p-2 bg-slate-700/50 border border-slate-600/40 text-white rounded cursor-pointer"
                        >
                          <option value="" disabled className="bg-slate-800">
                            Select Category
                          </option>
                          {categories.map((cat) => (
                            <option
                              key={cat}
                              value={cat}
                              className="bg-slate-800"
                            >
                              {cat}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-white">
                          {item.category
                            ? formatCategory(item.category)
                            : "No category"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Supplier Name</p>
                      <p className="text-white">
                        {item.supplier_name ? item.supplier_name : "No supplier"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Package className="mr-2 h-5 w-5 text-blue-400" />
                    Stock Information
                  </h2>
                  {editSection !== "stock" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing("stock")}
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
                    <Package className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Quantity</p>
                      {editSection === "stock" ? (
                        <Input
                          type="number"
                          value={(formData as StockUpdate).quantity || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "quantity",
                              parseInt(e.target.value)
                            )
                          }
                          className="bg-slate-700/50 border border-slate-600/40 text-white"
                        />
                      ) : (
                        <p className="text-white">{item.quantity}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-5 w-5 mr-3 mt-0.5"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Status</p>
                      <p className={getStockStatus(item.quantity).color}>
                        {getStockStatus(item.quantity).status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description section - now in its own full-width container */}
            <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Package className="mr-2 h-5 w-5 text-blue-400" />
                  Description
                </h2>
                {editSection !== "description" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing("description")}
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
              <div className="flex items-start">
                <Package className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-2">Description</p>
                  {editSection === "description" ? (
                    <textarea
                      value={(formData as DetailsUpdate).description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="w-full p-3 bg-slate-700/50 border border-slate-600/40 text-white rounded-lg min-h-[120px] text-base"
                      placeholder="Enter item description..."
                    />
                  ) : (
                    <p className="text-white text-base whitespace-pre-wrap">
                      {item.description || "No description available"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={navigateToInventory}
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
                Item Not Found
              </h1>
              <Button
                onClick={navigateToInventory}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Back to Inventory
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
