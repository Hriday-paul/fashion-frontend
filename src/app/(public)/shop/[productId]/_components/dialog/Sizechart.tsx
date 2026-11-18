import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ISizeGroupItem } from "@/types";
import React from "react";

const FORMATS = ["US", "UK", "EU", "FR", "IT"] as const;

type Props = {
    // the full size group of the product (size group or letter group)
    group: Pick<ISizeGroupItem, "groupName" | "isLetter" | "sizes"> | null | undefined;
    // the product's own size, highlighted in the table
    selectedSizeId?: string;
};

export default function Sizechart({ group, selectedSizeId }: Props) {

    // letter sizes hold one value in every format, so one column is enough
    const columns = group?.isLetter ? ["Size"] : [...FORMATS];

    return (
        <Dialog>
            <DialogTrigger className="cursor-pointer underline text-primary-light-blue w-auto shrink-0 whitespace-nowrap">
                Size Guide
            </DialogTrigger>
            <DialogContent className="overflow-y-auto scroll-hide rounded-none max-h-screen">
                <DialogHeader className=" border-b border-gray-200 pb-4">
                    <DialogTitle className="text-balance text-center">
                        Size Guide
                    </DialogTitle>
                </DialogHeader>

                <div className="md:px-5 md:pb-8">

                    <div className="w-full bg-white flex justify-center px-4">
                        <div className="w-full max-w-md">
                            {/* Header */}
                            <h1 className="text-center text-xl font-semibold tracking-wide text-neutral-900">
                                {group?.groupName || "Conversion Guide"}
                            </h1>
                            {!group?.isLetter && (
                                <p className="mt-2 mb-6 text-center text-sm text-neutral-500 flex items-center justify-center gap-1">
                                    <span>Conversion between different size systems</span>
                                </p>
                            )}

                            {/* Table */}
                            {group?.sizes?.length ? (
                                <div className="overflow-hidden rounded-sm border border-neutral-200 mt-4">
                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-white">
                                                {columns.map((h) => (
                                                    <th
                                                        key={h}
                                                        className="px-4 py-3 text-left font-semibold text-neutral-900 border-b border-neutral-200"
                                                    >
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.sizes.map((row, i) => {
                                                const isSelected = row.id === selectedSizeId;
                                                return (
                                                    <tr
                                                        key={row.id}
                                                        className={isSelected ? "bg-neutral-200 font-semibold" : i % 2 === 1 ? "bg-neutral-100" : "bg-white"}
                                                    >
                                                        {group.isLetter ? (
                                                            <td className="px-4 py-3 text-neutral-700">{row.US}</td>
                                                        ) : (
                                                            FORMATS.map((format) => (
                                                                <td key={format} className="px-4 py-3 text-neutral-700">{row[format]}</td>
                                                            ))
                                                        )}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="mt-6 text-center text-sm text-neutral-500">No size guide available</p>
                            )}
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
