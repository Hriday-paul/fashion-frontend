"use client";

import React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetParcelSuggestionQuery } from "@/redux/api/categoryApi";
import { IParcelSuggestion } from "@/types";

interface ParcelSizeSuggestionProps {
  categoryId?: string | null;
  categoryName?: string | null;
  onApply: (suggestion: IParcelSuggestion) => void;
}

export function ParcelSizeSuggestion({
  categoryId,
  categoryName,
  onApply,
}: ParcelSizeSuggestionProps) {
  const { data, isLoading, isError } = useGetParcelSuggestionQuery(
    categoryId as string,
    { skip: !categoryId }
  );

  const suggestion = data?.data;

  if (!categoryId || isLoading || isError || !suggestion) {
    return null;
  }

  const height = suggestion.height_cm ?? (suggestion as any).hight_cm ?? 0;
  const displayName = suggestion.category?.name || categoryName || "Selected category";

  return (
    <div className="bg-blue-50 border border-[#D6E4FF] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-xs">
      <div className="space-y-1">
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          Suggested for
        </p>
        <h4 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          {displayName}
        </h4>
        <div className="flex items-center gap-1.5 text-sm sm:text-base text-gray-700 font-medium pt-0.5">
          <span>
            {suggestion.weight_kg} kg · {suggestion.length_cm} ×{" "}
            {suggestion.width_cm} × {height} cm
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-gray-400 hover:text-gray-600 inline-flex items-center cursor-help">
                <Info className="size-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">
                Standard parcel size and weight suggested for this category
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden sm:block h-12 w-px bg-[#D6E4FF]" />
        <Button
          type="button"
          onClick={() => onApply(suggestion)}
          className="bg-[#1A68FF] hover:bg-[#1557d6] text-white font-medium px-6 py-2.5 rounded-lg shadow-sm text-sm sm:text-base cursor-pointer transition-colors w-full sm:w-auto h-auto"
        >
          Use suggested size
        </Button>
      </div>
    </div>
  );
}

