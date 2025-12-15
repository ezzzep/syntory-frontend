import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getItemById } from "@/lib/api/inventory";
import { getSuppliers } from "@/lib/api/suppliers";
import type { InventoryItem, Supplier } from "@/types/inventory";
import { getFullImageUrl, formatPrice } from "@/utils/inventoryUtils";

export const useInventoryItem = () => {
  const params = useParams();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagePath, setImagePath] = useState<string>("");
  const [priceInput, setPriceInput] = useState("");

  const fetchItem = async () => {
    try {
      if (params.id) {
        const id = Number(params.id);
        const data = await getItemById(id);
        console.log("Fetched item data:", data);
        setItem(data);

        const fullImageUrl = getFullImageUrl(data.image_path);
        setImagePath(fullImageUrl);

        if (data.price !== undefined) {
          const formattedPrice = formatPrice(data.price);
          console.log("Setting formatted price:", formattedPrice);
          setPriceInput(formattedPrice);
        }
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

  useEffect(() => {
    fetchItem();
    fetchSuppliers();
  }, [params.id]);

  return {
    item,
    suppliers,
    loading,
    imagePath,
    setImagePath,
    priceInput,
    setPriceInput,
    fetchItem,
    setItem,
  };
};
