"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X, ArrowRight } from "lucide-react";
import CommonButton from "@/components/ui/common-button";
import AnimatedArrow from "@/components/animatedArrows/AnimatedArrow";
import { useCurrency } from "@/hooks/useCurrency";

const donationSchema = z.object({
  amount: z.number().min(1, "Amount must be at least $1"),
  customAmount: z.string().optional(),
  isAnonymous: z.enum(["anonymous", "public"]),
});

type DonationFormData = z.infer<typeof donationSchema>;

interface CharityDonationDialogProps {
  showTrigger?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const presetAmounts = [50, 100, 200];

export function IndividualCharityDonationFormDialog({
  showTrigger = true,
  open,
  setOpen,
}: CharityDonationDialogProps) {
  const { format } = useCurrency();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [useCustomAmount, setUseCustomAmount] = useState(false);

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 0,
      customAmount: "",
      isAnonymous: "anonymous",
    },
  });

  const handlePresetAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setUseCustomAmount(false);
    form.setValue("amount", amount);
    form.setValue("customAmount", "");
  };

  const handleCustomAmountChange = (value: string) => {
    setUseCustomAmount(true);
    setSelectedAmount(null);
    const numericValue = Number.parseFloat(value) || 0;
    form.setValue("amount", numericValue);
    form.setValue("customAmount", value);
  };

  const onSubmit = (data: DonationFormData) => {
    console.log("Donation submitted:", data);
    // Handle form submission here
    // Reset form
    form.reset();
    setSelectedAmount(null);
    setUseCustomAmount(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      {showTrigger &&  <Button className=" group bg-green-700 hover:bg-green-800  text-white rounded  uppercase md:min-w-40 md:py-5 cursor-pointer group">
          Donate Now <AnimatedArrow />
        </Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-y-auto max-h-screen">
        <div className="relative p-6">
          <DialogHeader className="space-y-3 pr-8">
            <DialogTitle className="text-xl font-semibold">
              Would you like to donate to charity?
            </DialogTitle>
            <p className="text-muted-foreground">
              Choose a charity and donate any amount for your support
            </p>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-6"
            >
              {/* Preset Amount Buttons */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  {presetAmounts.map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant={
                        selectedAmount === amount ? "default" : "outline"
                      }
                      className="flex-1 h-12"
                      onClick={() => handlePresetAmountClick(amount)}
                    >
                      {format(amount)}
                    </Button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Custom Amount</Label>
                  <FormField
                    control={form.control}
                    name="customAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="number"
                              step="any"
                              placeholder="Enter your amount"
                              className="h-12 pr-10"
                              onChange={(e) => {
                                field.onChange(e);
                                handleCustomAmountChange(e.target.value);
                              }}
                              value={useCustomAmount ? field.value : ""}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Privacy Options */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Donation Privacy: Would you like to remain anonymous?
                </Label>
                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="anonymous" id="anonymous" />
                            <Label
                              htmlFor="anonymous"
                              className="font-normal cursor-pointer"
                            >
                              Yes, keep my donation anonymous
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="public" id="public" />
                            <Label
                              htmlFor="public"
                              className="font-normal cursor-pointer"
                            >
                              No, show my profile
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
                 <CommonButton className="w-full cursor-pointer"  disabled={
                   form.getValues("amount") === 0
                }> SUBMIT </CommonButton> 

              {/* <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-black/90 text-white font-medium"
                disabled={
                  !form.formState.isValid || form.getValues("amount") === 0
                }
              >
                SUBMIT
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button> */}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
