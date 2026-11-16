"use client"
import { ArrowDown, ChevronRight, ListFilter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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

  const options = [
    { id: 1, label: <span className={cn(category && "font-semibold")}>Category</span>, render: () => <SmCategoryFilter /> },
    { id: 2, label: <span className={cn(brands.length > 0 && "font-semibold")}>Brand</span>, render: () => <SmBrandFilter categoryId={categoryId} /> },
    { id: 3, label: <span className={cn((minPrice || maxPrice) && "font-semibold")}>Price</span>, render: () => <SmPriceFilter /> },
    { id: 4, label: <span className={cn(colors.length > 0 && "font-semibold")}>Color</span>, render: () => <SmColorFilter /> },
    { id: 5, label: <span className={cn(sizes.length > 0 && "font-semibold")}>Size</span>, render: () => <SmSizeFilter categoryId={categoryId} /> },
    { id: 6, label: <span className={cn(materials.length > 0 && "font-semibold")}>Material</span>, render: () => <SmMaterialFilter categoryId={categoryId} /> },
    { id: 7, label: <span className={cn(conditions.length > 0 && "font-semibold")}>Condition</span>, render: () => <SmConditionFilter /> },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

      {open && (
        <div className="bg-white fixed bottom-0 left-0 right-0 z-50 w-full h-full border-t border-gray-200 lg:hidden overflow-auto">
          {/* =====header======== */}
          <div className="flex flex-row justify-between items-center p-2.5 border-b border-gray-200 sticky top-0 bg-white z-10">
            {activeOption && (
              <button
                onClick={() => setActiveOption(null)}
                className="cursor-pointer p-2 hover:bg-gray-100 rounded flex justify-center items-center"
              >
                <ArrowDown className="rotate-90 h-6 w-6" />
              </button>
            )}

            <p className="font-semibold text-xl">
              {activeOption ? activeOption.label : "Filter"}
            </p>

            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded flex justify-center items-center"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* ==========body========= */}
          <div className="flex flex-col px-3">
            {activeOption ? (
              activeOption.render()
            ) : (
              <div>
                <div className="flex flex-col">
                  {
                    options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setActiveOption(option)}
                        className="cursor-pointer py-4 px-3 hover:bg-gray-100 flex justify-between items-center border-b border-gray-200 last:border-b-0"
                      >
                        <p className="text-base">{option.label}</p>
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      </button>
                    ))
                  }
                </div>

                <div className="mt-5">
                  <SelectedAttributes ssp={sspResult} />
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}