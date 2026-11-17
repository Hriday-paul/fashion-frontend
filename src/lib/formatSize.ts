import type { SizeFormat } from "@/types";

type SizeLike = Partial<Record<"title" | "UK" | "US" | "EU" | "FR" | "IT", string | null>> | null | undefined;

// The size shown to buyers, in the format the seller chose. LETTER sizes hold the same value in every format.
export function formatSize(size: SizeLike, format?: SizeFormat | null): string {
  if (!size) return "";
  if (!format || format === "LETTER") return size.US || size.title || "";
  const value = size[format];
  return value ? `${format} ${value}` : size.title || "";
}
