"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import { Control, Controller } from "react-hook-form";
import { ISizeGroupItem, ISizeItem, SizeFormat } from "@/types";
import { ProductFormValues } from "../schema";

interface SizeSelectorProps {
    /** Size groups from GET /sizes (letter group first) */
    groups: ISizeGroupItem[];
    /** react-hook-form control */
    control: Control<ProductFormValues>;
    /** If null, field is disabled and shows tooltip */
    selectedCategory: { id: string; name: string } | null;
    placeholder?: string;
}

// formats offered for a size group, in the order shown to the seller
const GROUP_FORMATS: SizeFormat[] = ["US", "UK", "EU", "IT", "FR"];

const formatLabel = (format: SizeFormat) => (format === "LETTER" ? "Letter" : format);

// ─── Main component ───────────────────────────────────────────────────────────

export default function SizeSelector({
    groups,
    control,
    selectedCategory,
    placeholder = "Select size",
}: SizeSelectorProps) {
    const isDisabled = !selectedCategory;

    return (
        <Controller
            control={control}
            name={"sizeId"}
            render={({ field, fieldState }) => (
                <Controller
                    control={control}
                    name={"SizeFormat"}
                    render={({ field: formatField, fieldState: formatState }) => {
                        const error = fieldState.error ?? formatState.error;
                        return (
                            <div className="flex flex-col gap-1">
                                <SizeSelectorInner
                                    groups={groups}
                                    sizeId={field.value}
                                    format={formatField.value as SizeFormat | ""}
                                    onChange={(sizeId, format) => {
                                        formatField.onChange(format);
                                        field.onChange(sizeId);
                                    }}
                                    onFormatChange={(format) => {
                                        // a new format invalidates the previously picked size
                                        formatField.onChange(format);
                                        field.onChange("");
                                    }}
                                    isDisabled={isDisabled}
                                    placeholder={placeholder}
                                />
                                {error && <p className="text-sm text-destructive">{error.message}</p>}
                            </div>
                        );
                    }}
                />
            )}
        />
    );
}

// ─── Inner selector (format step, then size step; same layout as the category select) ──

interface SizeSelectorInnerProps {
    groups: ISizeGroupItem[];
    sizeId: string | undefined;
    format: SizeFormat | "";
    onChange: (sizeId: string, format: SizeFormat) => void;
    onFormatChange: (format: SizeFormat) => void;
    isDisabled: boolean;
    placeholder: string;
}

function SizeSelectorInner({
    groups,
    sizeId,
    format,
    onChange,
    onFormatChange,
    isDisabled,
    placeholder,
}: SizeSelectorInnerProps) {
    const [open, setOpen] = useState(false);
    // "format" lists LETTER / US / UK ..., "size" lists the values of the chosen format
    const [step, setStep] = useState<"format" | "size">("format");
    const [search, setSearch] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const letterGroup = groups.find((group) => group.isLetter);
    const sizeGroups = groups.filter((group) => !group.isLetter);

    const availableFormats: SizeFormat[] = [
        ...(letterGroup ? (["LETTER"] as SizeFormat[]) : []),
        ...(sizeGroups.length ? GROUP_FORMATS : []),
    ];

    // sizes for the chosen format, with the value shown for that format
    const sizesForFormat: { size: ISizeItem; label: string }[] = !format
        ? []
        : format === "LETTER"
            ? (letterGroup?.sizes ?? []).map((size) => ({ size, label: size.US }))
            : sizeGroups.flatMap((group) => group.sizes).map((size) => ({ size, label: size[format] }));

    const filtered = search.trim()
        ? sizesForFormat.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
        : sizesForFormat;

    const selected = sizesForFormat.find((item) => item.size.id === sizeId);

    function openPanel() {
        if (isDisabled) return;
        setSearch("");
        // reopen on the values step when a format is already chosen
        setStep(format ? "size" : "format");
        setOpen(true);
    }

    function closePanel() {
        setOpen(false);
        setSearch("");
    }

    function goBack() {
        setSearch("");
        setStep("format");
    }

    function handleFormatSelect(next: SizeFormat) {
        if (next !== format) onFormatChange(next);
        setSearch("");
        setStep("size");
    }

    function handleSizeSelect(size: ISizeItem) {
        onChange(size.id, format as SizeFormat);
        closePanel();
    }

    // Focus search when the values step opens
    useEffect(() => {
        if (open && step === "size") setTimeout(() => searchRef.current?.focus(), 80);
    }, [open, step]);

    // Close desktop dropdown on outside click
    useEffect(() => {
        if (!open) return;
        function handle(e: MouseEvent) {
            if (window.innerWidth < 768) return;
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                closePanel();
            }
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [open]);

    const title = step === "format" || !format ? "Size format" : formatLabel(format);

    // ── Shared inner content ─────────────────────────────────────────────────

    const innerContent = (isMobile: boolean) => (
        <div className="flex flex-col h-full">

            {/* Mobile header */}
            {isMobile && (
                <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                    {step === "size" ? (
                        <button type="button" onClick={goBack} className="p-1 rounded hover:bg-muted transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="w-7" />
                    )}
                    <span className="font-semibold text-base text-foreground">{title}</span>
                    <button type="button" onClick={closePanel} className="p-1 rounded hover:bg-muted transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>
            )}

            {/* Search bar (values step only) */}
            {step === "size" && (
                <div className="px-3 pt-3 pb-2 border-b border-border shrink-0">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 focus-within:border-primary-black rounded px-2 py-2">
                        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                        <input
                            ref={isMobile ? undefined : searchRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search size..."
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                        {search && (
                            <button type="button" onClick={() => setSearch("")}>
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Desktop back/title */}
            {!isMobile && (
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border shrink-0">
                    {step === "size" && (
                        <button type="button" onClick={goBack} className="p-1 rounded hover:bg-muted transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    )}
                    <span className="font-semibold text-base text-foreground">{title}</span>
                </div>
            )}

            {/* List */}
            <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
                {step === "format" ? (
                    availableFormats.length === 0 ? (
                        <p className="text-base text-muted-foreground text-center py-10">
                            No sizes available for this category
                        </p>
                    ) : (
                        availableFormats.map((item) => (
                            <div
                                key={item}
                                onClick={() => handleFormatSelect(item)}
                                className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/60 transition-colors border-b border-border/40 last:border-0 ${item === format ? "bg-muted" : ""}`}
                            >
                                <span className="flex-1 text-foreground">{formatLabel(item)}</span>
                                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                            </div>
                        ))
                    )
                ) : filtered.length === 0 ? (
                    <p className="text-base text-muted-foreground text-center py-10">
                        No sizes found
                    </p>
                ) : (
                    filtered.map(({ size, label }) => (
                        <div
                            key={size.id}
                            onClick={() => handleSizeSelect(size)}
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/60 transition-colors border-b border-border/40 last:border-0 ${sizeId === size.id ? "bg-muted" : ""}`}
                        >
                            <span className="flex-1 text-foreground">{label}</span>
                            <div className="shrink-0 ml-2">
                                <RadioCircle selected={sizeId === size.id} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const triggerText = selected ? `${format === "LETTER" ? "" : `${format} `}${selected.label}` : placeholder;

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
                    onClick={openPanel}
                    disabled={isDisabled}
                    className={`flex items-center justify-between w-full bg-white rounded border border-gray-200 focus:border-primary-black px-3 md:py-3 py-2 text-sm text-left focus:outline-none transition-opacity cursor-pointer ${isDisabled ? "opacity-80 bg-zinc-50 cursor-not-allowed" : ""}`}
                >
                    <span className={selected ? "text-foreground" : "text-muted-foreground"}>
                        {triggerText}
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
                    {/* ── MOBILE: centered dialog ── */}
                    <div
                        className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute inset-0 bg-black/50" />
                        <div
                            className="relative w-full max-w-sm bg-background shadow-2xl flex flex-col overflow-hidden"
                            style={{ maxHeight: "80dvh" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {innerContent(true)}
                        </div>
                    </div>

                    {/* ── DESKTOP: dropdown ── */}
                    <div
                        ref={panelRef}
                        className="hidden md:flex md:flex-col absolute z-50 mt-1 w-full min-w-[300px] bg-background border border-border shadow-lg overflow-hidden"
                        style={{ maxHeight: 440 }}
                    >
                        {innerContent(false)}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Radio circle ─────────────────────────────────────────────────────────────

function RadioCircle({ selected }: { selected: boolean }) {
    return (
        <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? "border-primary" : "border-muted-foreground/40"}`}
        >
            {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
        </div>
    );
}
