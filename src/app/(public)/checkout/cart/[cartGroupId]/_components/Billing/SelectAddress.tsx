"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

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
} from "@/components/ui/combobox"
import { countries } from "@/utils/constant";

function buildDisplayName(place: google.maps.places.PlaceResult): string {
    const name = place.name || "";
    const components = place.address_components || [];

    const route = components.find(c => c.types.includes("route"))?.long_name;
    const area = components.find(c =>
        c.types.includes("sublocality") || c.types.includes("neighborhood")
    )?.long_name;

    return [name, route]
        .filter(Boolean)
        .filter((val, idx, arr) => arr.indexOf(val) === idx)
        .join(", ");
}

function SelectAddress({

    control,
    setValue,
    allowedCountries
}: any) {
    const [options, setOptions] = useState<{ value: string; label: string; placeId: string }[]>([]);

    // AutocompleteService — for fetching suggestions (text only, no geometry)
    const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);

    // PlacesService — for fetching full place details (geometry, components, etc.)
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

    // We need a dummy DOM node for PlacesService
    const dummyDivRef = useRef<HTMLDivElement | null>(null);

    // Lazily initialize both services
    const getServices = () => {
        if (!autocompleteServiceRef.current) {
            autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        }
        if (!placesServiceRef.current) {
            if (!dummyDivRef.current) {
                dummyDivRef.current = document.createElement("div");
            }
            placesServiceRef.current = new google.maps.places.PlacesService(dummyDivRef.current);
        }
    };

    // Called on every keystroke — fetch autocomplete predictions
    const handleSearch = (value: string) => {
        if (!value || value.length < 2) {
            setOptions([]);
            return;
        }

        getServices();

        autocompleteServiceRef.current!.getPlacePredictions(
            {
                input: value,
                // componentRestrictions: { country: "us" } // Restrict to a specific country if needed
                ...(allowedCountries && allowedCountries.length > 0 ? {
                    componentRestrictions: { country: allowedCountries }
                } : {})
            },
            (predictions, status) => {
                if (
                    status !== google.maps.places.PlacesServiceStatus.OK ||
                    !predictions
                ) {
                    setOptions([]);
                    return;
                }

                setOptions(
                    predictions.map((p) => ({
                        value: p.description,           // shown in input after select
                        label: p.description,           // shown in dropdown
                        placeId: p.place_id,
                    }))
                );
            }
        );
        setValue("streetAddress", value);
    };

    // Called when user clicks a suggestion
    const handleSelect = (placeId: string) => {
        getServices();

        placesServiceRef.current!.getDetails(
            {
                placeId: placeId,
                fields: ["name", "geometry", "address_components", "formatted_address"],
            },
            (place, status) => {
                if (
                    status !== google.maps.places.PlacesServiceStatus.OK ||
                    !place?.geometry?.location
                ) return;

                const getAddressComponent = (components: google.maps.GeocoderAddressComponent[], type: string, allowShortNames = false) => {
                    const comp = components.find(c => c.types.includes(type));
                    return comp ? (allowShortNames ? comp?.short_name : comp?.long_name) : "";
                };

                const city = getAddressComponent(place.address_components || [], "locality") ?? getAddressComponent(place.address_components || [], "administrative_area_level_2");
                const state = getAddressComponent(place.address_components || [], "administrative_area_level_1");
                const zip = getAddressComponent(place.address_components || [], "postal_code");

                const countryCode = getAddressComponent(place.address_components || [], "country", true);

                setValue("streetAddress", buildDisplayName(place));
                setValue("city", city);
                setValue("state", state);
                setValue("zipCode", zip);

                const selectedCountry = countries.find(
                    (country) => country.code === countryCode
                );

                setValue("country", selectedCountry?.name || "");
                setValue("countryCode", selectedCountry?.code || "");
            }
        );
    };

    return (
        <FormField
            control={control}
            name="streetAddress"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                        <Combobox
                            items={options}
                            value={field.value || ""}
                            onValueChange={(placeId) => {
                                handleSelect(placeId);
                            }}
                            onInputValueChange={(searchTerm) => {
                                handleSearch(searchTerm);
                            }}
                        >
                            <ComboboxInput
                                placeholder="Enter your address"
                                className="bg-white border-[#e1e1e1] md:py-5 rounded shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 focus:ring-0 focus:border has-[[data-slot=input-group-control]:focus-visible]:border-primary-black text-lg md:text-base py-5"
                            />
                            <ComboboxContent className="rounded-none p-0">
                                <ComboboxEmpty>No addresses found.</ComboboxEmpty>
                                <ComboboxList className="max-h-[300px] overflow-y-auto">
                                    {(item: { value: string; label: string; placeId: string }) => (
                                        <ComboboxItem
                                            key={item?.placeId}
                                            value={item?.placeId}
                                            className="cursor-pointer py-2.5 rounded-none hover:bg-zinc-100 border-b border-b-gray-200"
                                        >
                                            {item?.label}
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

export default SelectAddress;