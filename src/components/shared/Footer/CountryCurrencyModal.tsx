"use client";

import React, { useState, useEffect, use } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Globe, ChevronsUpDown, Check } from "lucide-react";
import { countries } from "@/utils/constant";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUserRate } from "@/redux/features/rateSlice";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Flag from "../Flag";

type SupportedCurrency = "USD" | "EUR" | "GBP";

const currencySymbols: Record<SupportedCurrency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function CountryCurrencyModal() {
  const dispatch = useAppDispatch();
  const rateState = useAppSelector((state) => state.rate);

  const userRateState = rateState?.user;

  const isConfigured = rateState?.configured || false;

  const [open, setOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  // Form state
  const currentCountry = userRateState?.country || "United Kingdom";
  const currentRate: SupportedCurrency = (userRateState?.rate as SupportedCurrency) || "GBP";

  const [selectedCountry, setSelectedCountry] = useState<string>(currentCountry);
  const [selectedRate, setSelectedRate] = useState<SupportedCurrency>(currentRate);

  useEffect(() => {
    if (!isConfigured) {
      setOpen(true);
    }
  }, [userRateState]);

  // Sync modal values with Redux store when opened
  useEffect(() => {
    if (open) {
      setSelectedCountry(currentCountry);
      setSelectedRate(currentRate);
    }
  }, [open, currentCountry, currentRate]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!selectedCountry) {
      toast.error("Please select a country");
      return;
    }

    dispatch(
      setUserRate({
        country: selectedCountry,
        rate: selectedRate,
        isDefault: false,
      })
    );
    setOpen(false);
  };

  const displayCountry = currentCountry;
  const displayRate = currentRate;
  const displaySymbol = currencySymbols[displayRate] || "£";

  return (
    <>
      {/* Footer trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm text-gray-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all duration-200 cursor-pointer shadow-xs"
        title="Change Country & Currency"
      >
        <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="font-medium truncate max-w-[140px] sm:max-w-[180px]">
          {displayCountry}
        </span>
        <span className="text-neutral-500">•</span>
        <span className="font-semibold text-white whitespace-nowrap">
          {displayRate} ({displaySymbol})
        </span>
        <ChevronsUpDown className="w-3 h-3 text-gray-400 opacity-60 shrink-0" />
      </button>

      {/* Modal Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-6 bg-white rounded-none">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Confirm preferences
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Choose your preferred currency for estimated prices and donation amounts. All payments, donations and account balances are in GBP. Changing your display currency does not change your account or payment currency.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-5 pt-3">
            {/* Input 1: Country */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800 block">
                Country
              </label>
              <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={countryOpen}
                    className={"bg-white border-[#e1e1e1] md:py-5 rounded shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 focus:ring-0 focus:border has-[[data-slot=input-group-control]:focus-visible]:border-primary-black text-lg md:text-base py-5 w-full justify-between cursor-pointer"}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate text-sm text-gray-900">
                        {selectedCountry || "Select a country..."}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="rounded-none p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search country..."
                      className="h-10"
                    />
                    <CommandList className="max-h-60 overflow-y-auto">
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => (
                          <CommandItem
                            key={country.code}
                            value={country.name}
                            onSelect={() => {
                              setSelectedCountry(country.name);
                              setCountryOpen(false);
                            }}
                            className="cursor-pointer py-2.5 rounded-none hover:bg-zinc-100 border-b border-b-gray-200 flex flex-row gap-x-2 items-center px-3 text-sm md:text-base"
                          >
                            <Flag code={country.code} name={country.name} />
                            <span className="text-sm text-gray-800">
                              {country.name}
                            </span>
                            <Check
                              className={cn(
                                "h-4 w-4 text-black",
                                selectedCountry === country.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Input 2: Currency */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800 block">
                Currency
              </label>
              <Select
                value={selectedRate}
                onValueChange={(val) =>
                  setSelectedRate(val as SupportedCurrency)
                }
              >
                <SelectTrigger className="bg-white border-gray-200 rounded shadow-none focus-visible:ring-0 focus:ring-0 text-base py-5 px-3 w-full cursor-pointer">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="max-h-[400px] !rounded-none !p-0">
                  <SelectItem value="USD" className="rounded-none py-2.5 cursor-pointer">
                    $ USD &middot; US Dollar
                  </SelectItem>
                  <SelectItem value="EUR" className="rounded-none py-2.5 cursor-pointer">
                    € EUR &middot; Euro
                  </SelectItem>
                  <SelectItem value="GBP" className="rounded-none py-2.5 cursor-pointer">
                    £ GBP &middot; British Pound
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              {/* <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-full cursor-pointer h-10 px-5"
              >
                Cancel
              </Button> */}
              <Button
                type="submit"
                className=" w-full rounded-none cursor-pointer bg-primary-black text-white hover:bg-zinc-800 h-10 px-6 text-base"
              >
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

