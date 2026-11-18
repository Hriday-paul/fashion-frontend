"use client";

import * as React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import ConvertedEstimate from "@/components/shared/ConvertedEstimate";
import { cn } from "@/lib/utils";

type GbpInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  /** Show the "≈ $12.70 USD (estimate)" line under the input (default true) */
  showEstimate?: boolean;
  /** Class for the outer InputGroup */
  groupClassName?: string;
};

/**
 * Money input. Every amount sent to the backend is GBP, so the field shows
 * "£" before and "GBP" after the value, plus an estimate in the user's
 * preferred currency. Works with react-hook-form: `<GbpInput {...field} />`.
 */
const GbpInput = React.forwardRef<HTMLInputElement, GbpInputProps>(
  ({ showEstimate = true, groupClassName, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <InputGroup
          className={cn(
            "bg-white border-[#e1e1e1] rounded shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 focus:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border has-[[data-slot=input-group-control]:focus-visible]:border-primary-black !py-5",
            groupClassName
          )}
        >
          <InputGroupInput
            ref={ref}
            type="number"
            step="any"
            min={0}
            inputMode="decimal"
            className={cn("!text-base", className)}
            {...props}
          />
          <InputGroupAddon align="inline-start" className="text-primary-black text-lg">
            £
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="text-muted-foreground text-sm">
            GBP
          </InputGroupAddon>
        </InputGroup>
        {showEstimate && <ConvertedEstimate amount={props.value as string | number | undefined} />}
      </div>
    );
  }
);
GbpInput.displayName = "GbpInput";

export default GbpInput;
