"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import {
  getSupplierById,
  updateSupplier,
  uploadSupplierImage,
} from "@/lib/api/suppliers";
import type { Supplier } from "@/types/supplier";
import {
  Star,
  MapPin,
  Mail,
  Phone,
  Package,
  CalendarDays,
  User,
  Building,
  Edit,
  Save,
  X,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToasts } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface CalendarPickerProps {
  value: string;
  onChange: (date: string) => void;
  onClose: () => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  value,
  onChange,
  onClose,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(value || new Date()));
  const [selectedDate, setSelectedDate] = useState(
    new Date(value || new Date())
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
    const dateString = newDate.toISOString().split("T")[0];
    onChange(dateString);
    onClose();
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const today = new Date();

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        today.getDate() === day &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear();

      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isSelected
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : isToday
              ? "bg-blue-100 text-blue-900 hover:bg-blue-200"
              : "text-gray-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="absolute z-50 bottom-full mb-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-4 min-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 rounded-lg hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-white font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-1 rounded-lg hover:bg-slate-700 text-gray-300 hover:text-white transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div
            key={index}
            className="text-center text-xs text-gray-400 font-medium p-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
    </div>
  );
};

export default function SupplierDetailPage() {
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
  const calendarRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);
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

  const formatCategory = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
            <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-5 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden mr-6">
                    {imagePath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagePath}
                        alt={supplier.name}
                        className="h-full w-full object-cover cursor-pointer"
                        onError={(e) => {
                          console.error("Image failed to load:", imagePath);
                          console.error(
                            "Supplier image_path from DB:",
                            supplier.image_path
                          );
                          if (
                            supplier.image_path &&
                            supplier.image_path !== imagePath
                          ) {
                            const fallbackUrl = getFullImageUrl(
                              supplier.image_path
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
                        {supplier.name.charAt(0)}
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
                          className="w-full p-2 bg-slate-700/50 border border-slate-600/40 text-white rounded cursor-pointer"
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
            <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-blue-400" />
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
              <div className="flex items-start">
                <div className="flex-1 relative" ref={calendarRef}>
                  <p className="text-sm text-gray-400 mb-1">Last Delivery</p>
                  {editSection === "delivery" ? (
                    <div className="max-w-xs">
                      {" "}
                      <button
                        type="button"
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="w-full p-2 bg-slate-700/50 border border-slate-600/40 text-white rounded-lg text-left flex items-center justify-between hover:bg-slate-700 transition-colors"
                      >
                        <span className="truncate">
                          {(formData as DeliveryUpdate).last_delivery
                            ? formatDateDisplay(
                                (formData as DeliveryUpdate).last_delivery!
                              )
                            : "Select date"}
                        </span>
                        <CalendarDays className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
                      </button>
                      {showCalendar && (
                        <CalendarPicker
                          value={
                            (formData as DeliveryUpdate).last_delivery || ""
                          }
                          onChange={handleDateChange}
                          onClose={() => setShowCalendar(false)}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="max-w-xs">
                      {" "}
                      <p className="text-white truncate">
                        {formatDateDisplay(supplier.last_delivery)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
