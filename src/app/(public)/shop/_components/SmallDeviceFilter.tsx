"use client"
import { ChevronRight, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SmCategoryFilter from "./SmFilter/SmCategoryFilter";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import SmBrandFilter from "./SmFilter/SmBrandFilter";
import SmPriceFilter from "./SmFilter/SmPriceFilter";
import SmColorFilter from "./SmFilter/SmColorFilter";
import SmMaterialFilter from "./SmFilter/SmMaterialFilter";
import SmSizeFilter from "./SmFilter/SmSizeFilter";
import SmConditionFilter from "./SmFilter/SmConditionFilter";
import SelectedAttributes from "./SelectedAttributes";
import SmPopup from "./SmFilter/SmPopup";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

export function SmallDeviceFilter({ categoryId, sspResult }: { categoryId?: string, sspResult: { [key: string]: string | undefined } }) {
  const [open, setOpen] = useState(false);
  const [activeOption, setActiveOption] = useState<typeof options[number] | null>(null);

  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const brands = searchParams.get("brand")?.split(",") || [];
  const maxPrice = searchParams.get("priceMax");
  const minPrice = searchParams.get("priceMin");
  const sizes = searchParams.get("size")?.split(",") || [];
  const colors = searchParams.get("color")?.split(",") || [];
  const materials = searchParams.get("material")?.split(",").filter(Boolean) || [];
  const conditions = searchParams.get("condition")?.split(",") || [];

  const updateParams = useUpdateSearchParams();
  const hasFilters = Boolean(category) || brands.length > 0 || sizes.length > 0 || colors.length > 0 || materials.length > 0 || conditions.length > 0 || Boolean(minPrice) || Boolean(maxPrice);

  const handleClear = () => {
    updateParams({ category: null, brand: null, priceMin: null, priceMax: null, size: null, color: null, material: null, condition: null });
  };

  const options = [
    { id: 1, label: <span className={cn(category && "font-semibold")}>Category</span>, render: () => <SmCategoryFilter /> },
    { id: 2, label: <span className={cn(brands.length > 0 && "font-semibold")}>Brand</span>, render: () => <SmBrandFilter categoryId={categoryId} /> },
    { id: 3, label: <span className={cn((minPrice || maxPrice) && "font-semibold")}>Price</span>, render: () => <SmPriceFilter /> },
    { id: 4, label: <span className={cn(colors.length > 0 && "font-semibold")}>Color</span>, render: () => <SmColorFilter /> },
    { id: 5, label: <span className={cn(sizes.length > 0 && "font-semibold")}>Size</span>, render: () => <SmSizeFilter categoryId={categoryId} /> },
    { id: 6, label: <span className={cn(materials.length > 0 && "font-semibold")}>Material</span>, render: () => <SmMaterialFilter categoryId={categoryId} /> },
    { id: 7, label: <span className={cn(conditions.length > 0 && "font-semibold")}>Condition</span>, render: () => <SmConditionFilter /> },
  ];

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
          setActiveOption(null);
        }}
        variant={"outline"}
        className="rounded-full shadow-none border-primary-black hover:bg-primary-black hover:text-white duration-150 lg:hidden flex items-center gap-2 px-3 h-8 cursor-pointer"
      >
        <ListFilter />
        Filter
      </Button>

      <SmPopup
        open={open}
        title={activeOption ? activeOption.label : "Filter"}
        onClose={() => setOpen(false)}
        onClear={hasFilters ? handleClear : undefined}
        onBack={activeOption ? () => setActiveOption(null) : undefined}
      >
        {activeOption ? (
          activeOption.render()
        ) : (
          <div>
            <div className="flex flex-col">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveOption(option)}
                  className="cursor-pointer py-4 px-3 hover:bg-gray-100 flex justify-between items-center border-b border-gray-200 last:border-b-0"
                >
                  <p className="text-base">{option.label}</p>
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </button>
              ))}
            </div>

            <div className="mt-5">
              <SelectedAttributes ssp={sspResult} />
            </div>
          </div>
        )}
      </SmPopup>
    </>
  );
}