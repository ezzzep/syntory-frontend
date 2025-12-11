import { useState, useRef, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import {
  getSupplierById,
  updateSupplier,
  uploadSupplierImage,
} from "@/lib/api/suppliers";
import type { Supplier } from "@/types/supplier";
import { useToasts } from "@/components/ui/toast";

type NameUpdate = {
  name?: string;
  image_path?: string;
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

export const useSupplierIdLogic = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePath, setImagePath] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toasts = useToasts();

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

  const formatCategory = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        if (params.id) {
          const id = Number(params.id);
          const data = await getSupplierById(id);

          setSupplier(data);

          const fullImageUrl = getFullImageUrl(data.image_path);
          setImagePath(fullImageUrl);
        }
      } catch (err) {
        console.warn("Failed to fetch supplier:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [params.id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeNav", "suppliers");
    }
  }, [pathname]);

  const saveImagePathToDatabase = async (url: string) => {
    if (!supplier) return;

    try {
      const updatePayload = { image_path: url };
      const updatedSupplier = await updateSupplier(supplier.id, updatePayload);
      setSupplier(updatedSupplier);
      return updatedSupplier;
    } catch (error) {
      console.error("Failed to save image path:", error);
      throw error;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supplier) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadSupplierImage(supplier.id, formData);

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

  const startEditing = (section: string) => {
    if (!supplier) return;

    if (section === "name") {
      setFormData({
        name: supplier.name,
        image_path: imagePath || supplier.image_path || "",
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

  const cancelEditing = () => {
    setEditSection(null);
    setFormData({});
    setShowCalendar(false);
    if (supplier) {
      const dbImagePath = getFullImageUrl(supplier.image_path);
      setImagePath(dbImagePath);
    }
  };

  const saveChanges = async () => {
    if (!supplier) return;

    setIsSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatePayload: any = {};

      Object.assign(updatePayload, formData);
      const updatedSupplier = await updateSupplier(supplier.id, updatePayload);
      setSupplier(updatedSupplier);
      setEditSection(null);
      setFormData({});
      setShowCalendar(false);
      toasts.success("Supplier information updated successfully");
    } catch (err) {
      console.error("Failed to update supplier:", err);
      toasts.error("Failed to update supplier information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (date: string) => {
    handleInputChange("last_delivery", date);
  };

  const navigateToSuppliers = () => {
    router.push("/suppliers");
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const closeCalendar = () => {
    setShowCalendar(false);
  };

  return {
    supplier,
    loading,
    editSection,
    formData,
    isSaving,
    isUploading,
    imagePath,
    showCalendar,
    fileInputRef,
    getFullImageUrl,
    formatCategory,
    formatDateDisplay,
    triggerFileInput,
    handleImageUpload,
    startEditing,
    cancelEditing,
    saveChanges,
    handleInputChange,
    handleDateChange,
    navigateToSuppliers,
    toggleCalendar,
    closeCalendar,
  };
};
