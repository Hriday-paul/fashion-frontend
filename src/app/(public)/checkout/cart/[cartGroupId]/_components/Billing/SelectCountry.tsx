"use client";

import React, { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { countries } from "@/utils/constant";
import Flag from "@/components/shared/Flag";

function SelectCountry({ control, setValue, allowedCountries }: any) {
  // Anchor the dropdown to the whole wrapper so it lines up with the input's left edge
  const anchor = useComboboxAnchor();

  const availableCountries = useMemo(
    () =>
      allowedCountries && allowedCountries.length > 0
        ? countries.filter((c) => allowedCountries.includes(c.code))
        : countries,
    [allowedCountries]
  );

  const countryName = useWatch({ control, name: "country" });
  const selectedCountry = useMemo(
    () => availableCountries.find((c) => c.name === countryName),
    [availableCountries, countryName]
  );

  // Keep countryCode in sync (moved out of render)
  useEffect(() => {
    setValue("countryCode", selectedCountry?.code || "");
  }, [selectedCountry, setValue]);

  return (
    <FormField
      control={control}
      name="country"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Country</FormLabel>
          <FormControl>
            <Combobox
              items={availableCountries}
              value={selectedCountry?.name || ""}
              onValueChange={(name) => field.onChange(name || "")}
            >
              <div ref={anchor} className="relative">
                {selectedCountry && (
                  <Flag
                    code={selectedCountry.code}
                    name={selectedCountry.name}
                    className="absolute left-3 top-1/2 z-10 -translate-y-1/2"
                  />
                )}
                <ComboboxInput
                  placeholder="Select a country"
                  className={cn(
                    "bg-white border-[#e1e1e1] rounded shadow-none py-5 text-lg md:text-base",
                    "focus:ring-0 focus:border has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-primary-black",
                    selectedCountry && "pl-8" // room for the flag only when one is selected
                  )}
                  autoComplete="off"
                />
              </div>

              <ComboboxContent anchor={anchor} className="rounded-none">
                <ComboboxEmpty>No countries found.</ComboboxEmpty>
                <ComboboxList>
                  {(country) => (
                    <ComboboxItem
                      key={`${country.code} ${country.name}`}
                      value={country.name}
                      className="cursor-pointer py-2.5 rounded-none hover:bg-zinc-100 border-b border-b-gray-200 flex flex-row gap-x-2 items-center px-3 text-sm md:text-base"
                    >
                      <Flag code={country.code} name={country.name} />
                      {country.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectCountry;
