"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { Control, Controller } from "react-hook-form";
import { ProductFormValues } from "../schema";
import { Checkbox } from "@/components/ui/checkbox";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MaterialOption {
    id: string;
    name: string;
}

interface MaterialSelectorProps {
    /** Materials array from API */
    materials: MaterialOption[];
    /** react-hook-form control */
    control: Control<ProductFormValues>;
    /** If null, field is disabled and shows tooltip */
    selectedCategory: { id: string; name: string } | null;
    placeholder?: string;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MaterialSelector({
    materials,
    control,
    selectedCategory,
    placeholder = "Select materials",
}: MaterialSelectorProps) {
    const isDisabled = !selectedCategory;

    return (
        <Controller
            control={control}
            name={"fabric"}
            render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                    <MaterialSelectorInner
                        materials={materials}
                        value={Array.isArray(field.value) ? field.value : []}
                        onChange={field.onChange}
                        isDisabled={isDisabled}
                        placeholder={placeholder}
                    />
                    {fieldState.error && (
                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                    )}
                </div>
            )}
        />
    );
}

// ─── Inner selector (handles open/close, search, modal) ──────────────────────

interface MaterialSelectorInnerProps {
    materials: MaterialOption[];
    value: string[];
    onChange: (names: string[]) => void;
    isDisabled: boolean;
    placeholder: string;
}

function MaterialSelectorInner({
    materials,
    value,
    onChange,
    isDisabled,
    placeholder,
}: MaterialSelectorInnerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filtered = search.trim()
        ? materials.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
        : materials;

    function openPanel() {
        if (isDisabled) return;
        setSearch("");
        setOpen(true);
    }

    function closePanel() {
        setOpen(false);
        setSearch("");
    }

    function toggleMaterial(material: MaterialOption) {
        const isSelected = value.includes(material.name);
        if (isSelected) {
            onChange(value.filter((item) => item !== material.name));
        } else {
            onChange([...value, material.name]);
        }
    }

    // Focus search on open
    useEffect(() => {
        if (open) setTimeout(() => searchRef.current?.focus(), 80);
    }, [open]);

    // Close desktop dropdown on outside click
    useEffect(() => {
        if (!open) return;
        function handle(e: MouseEvent) {
            if (window.innerWidth < 768) return;
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target as Node) &&
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                closePanel();
            }
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open]);

    // ── Shared list content ──────────────────────────────────────────────────

    const listContent = (
        <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
            {filtered.length === 0 ? (
                <p className="text-base text-muted-foreground text-center py-10">
                    No materials found
                </p>
            ) : (
                filtered.map((material) => {
                    const isSelected = value.includes(material.name);
                    return (
                        <div
                            key={material.id}
                            onClick={() => toggleMaterial(material)}
                            className={`flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-muted/60 transition-colors border-b border-border/40 last:border-0 ${isSelected ? "bg-muted" : ""
                                }`}
                        >
                            <span className="text-base text-foreground">{material.name}</span>
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleMaterial(material)}
                                onClick={(e) => e.stopPropagation()}
                                className="rounded-xs border-gray-500 data-[state=checked]:text-white shrink-0 ml-2"
                            />
                        </div>
                    );
                })
            )}
        </div>
    );

    const searchBar = (
        <div className="px-3 pt-3 pb-2 border-b border-border shrink-0">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-2 py-1.5">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search material..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {search && (
                    <button type="button" onClick={() => setSearch("")}>
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                )}
            </div>
        </div>
    );

    const triggerLabel =
        value.length === 0
            ? placeholder
            : value.join(", ");

    return (
        <div ref={wrapperRef} className="relative w-full">
            {/* Tooltip wrapper */}
            <div
                className="relative"
                onMouseEnter={() => isDisabled && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {/* Trigger button */}
                <button
                    type="button"
                    onClick={() => (open ? closePanel() : openPanel())}
                    disabled={isDisabled}
                    className={`flex items-center justify-between w-full bg-white border border-gray-200 rounded focus-within:border-primary-black px-3 md:py-3 py-2 text-sm text-left focus:outline-none transition-opacity cursor-pointer ${isDisabled ? "opacity-80 bg-zinc-50 cursor-not-allowed" : ""
                        }`}
                >
                    <span className={`truncate pr-2 ${value.length > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                        {triggerLabel}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>

                {/* Tooltip */}
                {isDisabled && showTooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
                        <div className="bg-foreground text-background text-xs rounded-md px-3 py-1.5 whitespace-nowrap shadow-lg">
                            Please select a category first
                        </div>
                        {/* Arrow */}
                        <div className="w-2 h-2 bg-foreground rotate-45 mx-auto -mt-1" />
                    </div>
                )}
            </div>

            {open && (
                <>
                    {/* ── MOBILE: centered modal ── */}
                    <div
                        className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute inset-0 bg-black/50" onClick={closePanel} />
                        <div
                            className="relative w-full max-w-sm bg-background shadow-2xl flex flex-col overflow-hidden"
                            style={{ maxHeight: "80dvh" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                                <div className="w-7" />
                                <span className="font-semibold text-base text-foreground">Materials</span>
                                <button
                                    type="button"
                                    onClick={closePanel}
                                    className="p-1 rounded hover:bg-muted transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>
                            {searchBar}
                            {listContent}
                            <div className="px-4 py-3 border-t border-border shrink-0">
                                <button
                                    type="button"
                                    onClick={closePanel}
                                    className="w-full rounded bg-primary-black text-white text-sm py-2 cursor-pointer"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── DESKTOP: dropdown ── */}
                    <div
                        ref={panelRef}
                        className="hidden md:flex md:flex-col absolute z-50 mt-1 w-full min-w-[200px] bg-background border border-border shadow-lg overflow-hidden"
                    >
                        {searchBar}
                        {listContent}
                    </div>
                </>
            )}
        </div>
    );
}

