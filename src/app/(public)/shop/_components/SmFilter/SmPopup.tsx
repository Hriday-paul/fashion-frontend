"use client"
import { ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

/**
 * Full-screen popup used by the small-device filter and category pickers.
 * Sticky header (optional back arrow, title, close) and a sticky bottom
 * "Show results" button that closes the popup.
 */
export default function SmPopup({
  open,
  title,
  onClose,
  onBack,
  onShowResults,
  onClear,
  hideShowResults = false,
  children,
}: {
  open: boolean;
  title: React.ReactNode;
  onClose: () => void;
  onBack?: () => void;
  /** Called by "Show results" (defaults to onClose) */
  onShowResults?: () => void;
  /** When set, a "Clear" button is shown beside "Show results" */
  onClear?: () => void;
  hideShowResults?: boolean;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="bg-white fixed inset-0 z-50 w-full h-full border-t border-gray-200 lg:hidden flex flex-col">
      {/* =====header======== */}
      <div className="flex flex-row justify-between items-center p-2.5 border-b border-gray-200 bg-white shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded flex justify-center items-center"
          >
            <ArrowDown className="rotate-90 h-6 w-6" />
          </button>
        )}

        <p className="font-semibold text-xl">{title}</p>

        <button
          onClick={onClose}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded flex justify-center items-center"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* ==========body========= */}
      <div className="flex-1 overflow-auto px-3 pb-4">{children}</div>

      {/* ==========show results========= */}
      {!hideShowResults && <div className="shrink-0 flex flex-row gap-2 border-t border-gray-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {onClear && (
          <Button
            variant="outline"
            onClick={onClear}
            className="flex-1 rounded-none h-11 cursor-pointer font-semibold border-primary-black"
          >
            Clear all
          </Button>
        )}
        <Button
          onClick={onShowResults ?? onClose}
          className="flex-1 rounded-none h-11 cursor-pointer font-semibold"
        >
          Show results
        </Button>
      </div>}
    </div>
  );
}
