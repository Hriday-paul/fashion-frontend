"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { Checkbox } from "@/components/ui/checkbox";
import { IUser } from "@/types";
import Image from "next/image";
import { defaultImg } from "@/utils/defaultImg";
import { userRoleMapper } from "@/utils/userRoleMapper";
import Link from "next/link";

// ─── Charity Multi Select ──────────────────────────────────────────────────

function CharityMultiSelect({
  charities,
  value,
  onChange,
}: {
  charities: IUser[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedCharities = charities.filter((c) => value.includes(c.id));

  const filtered = search.trim()
    ? charities.filter(
      (c) =>
        c.fname.toLowerCase().includes(search.toLowerCase()) ||
        c.lname?.toLowerCase().includes(search.toLowerCase()) ||
        c.userName.toLowerCase().includes(search.toLowerCase())
    )
    : charities;

  function openPanel() {
    setSearch("");
    setOpen(true);
  }

  function closePanel() {
    setOpen(false);
    setSearch("");
  }

  function toggle(charity: IUser) {
    const isChecked = value.includes(charity.id);
    if (isChecked) {
      onChange(value.filter((id) => id !== charity.id));
    } else {
      onChange([...value, charity.id]);
    }
  }

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 80);
  }, [open]);

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

  // ── Shared search bar ────────────────────────────────────────────────────

  const searchBar = (withRef = false) => (
    <div className="px-3 pt-3 pb-2 border-b border-border shrink-0">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-2 py-2 focus-within:border-primary-black">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          ref={withRef ? searchRef : undefined}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search charities..."
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

  // ── Shared list ──────────────────────────────────────────────────────────

  const listContent = (
    <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
      {filtered.length === 0 ? (
        <p className="text-base text-muted-foreground text-center py-10">
          No charity found
        </p>
      ) : (
        filtered.map((charity) => {
          const isChecked = value.includes(charity.id);
          return (
            <div
              key={charity.id}
              onClick={() => toggle(charity)}
              className={`flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-muted/60 transition-colors border-b border-border/40 last:border-0 ${isChecked ? "bg-muted" : ""
                }`}
            >
              <div className="flex flex-row gap-x-2 items-center">
                <Image
                  src={charity.charityThumbnail?.url || "/not-found.png"}
                  alt="Charity thumbnail"
                  className="object-cover w-16 h-11 rounded"
                  width={800}
                  height={600}
                  placeholder="blur"
                  blurDataURL={defaultImg?.placeholderImg}
                />
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {charity.fname} {charity?.lname ?? ""}
                  </span>
                  <p className="text-xs text-gray-600">
                    {userRoleMapper(charity?.auth?.role)?.label}
                  </p>
                </div>
              </div>
              <Link
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                href={`/member/${charity?.userName}`} className="text-sm underline text-green-700">
                View Charity
              </Link>
              {/* <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggle(charity)}
                onClick={(e) => e.stopPropagation()}
                className="rounded-xs border-gray-500 data-[state=checked]:text-white shrink-0 ml-2"
              /> */}
              <input
                type="checkbox"
                checked={isChecked}
                readOnly
                tabIndex={-1}
                className="w-4 h-4 shrink-0 ml-2 accent-primary-black cursor-pointer pointer-events-none"
              />
            </div>
          );
        })
      )}
    </div>
  );

  const triggerLabel =
    selectedCharities.length === 0
      ? "Select charities"
      : selectedCharities.length === 1
        ? `${selectedCharities[0].fname} ${selectedCharities[0]?.lname || ""}`
        : `${selectedCharities.length} charities selected`;

  return (
    <div className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={openPanel}
        className="flex items-center justify-between w-full rounded px-3 md:py-2.5 py-2 text-sm text-left focus:outline-none border border-gray-200 focus:border-primary-black cursor-pointer"
      >
        <span
          className={
            selectedCharities.length ? "text-foreground" : "text-muted-foreground"
          }
        >
          {triggerLabel}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <>
          {/* ── MOBILE: centered dialog ── */}
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
                <span className="font-semibold text-base text-foreground">
                  Select Charities
                </span>
                <button
                  type="button"
                  onClick={closePanel}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              {searchBar()}
              {listContent}
              <div className="px-4 py-3 border-t border-border shrink-0">
                <button
                  type="button"
                  onClick={closePanel}
                  className="w-full rounded bg-primary-black text-white text-sm py-2"
                >
                  Done
                </button>
              </div>
            </div>
          </div>

          {/* ── DESKTOP: dropdown ── */}
          <div
            ref={panelRef}
            className="hidden md:flex md:flex-col absolute z-50 mt-1 w-full bg-background border border-border shadow-lg overflow-hidden"
          >
            {searchBar(true)}
            {listContent}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function InputCharityDonationInput({
  form,
  name = "charities",
  charities,
}: {
  form: any;
  /** Name of the form field holding the array of selected charity ids */
  name?: string;
  charities: IUser[];
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Charity</FormLabel>
          <FormControl>
            <CharityMultiSelect
              charities={charities}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}