"use client";
import { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useGetCharitiesQuery } from "@/redux/api/userApi";
import { DonateDirectMoney } from "@/lib/Actions/Donation.action";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { defaultImg } from "@/utils/defaultImg";
import { userRoleMapper } from "@/utils/userRoleMapper";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const formSchema = z.object({
  charityId: z.string().min(1, "Please select a charity"),
  amount: z.string().min(1, "Please select or enter an amount"),
  isAnonymous: z.boolean({
    required_error: "Please select a privacy option",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function CharityDonationFormDialog({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { data: charitiesData, isLoading: charitiesLoading } = useGetCharitiesQuery();

  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [charityOpen, setCharityOpen] = useState(false);
  const router = useRouter();

  const pathname = usePathname();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      charityId: "",
      amount: "",
      isAnonymous: true,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const presetAmounts = ["50", "100", "200"];

  const handlePresetSelect = (amount: string) => {
    setSelectedPreset(amount);
    form.setValue("amount", amount, { shouldValidate: true });
  };

  const handleCustomAmountChange = (value: string) => {
    setSelectedPreset("");
    form.setValue("amount", value, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    try {
      const res = await DonateDirectMoney({ payload: data });
      if (!res.success) {
        throw new Error(res.message);
      }
      router.replace(res?.data);
      form.reset();
    } catch (error: any) {
      if (isRedirectError(error)) {
        setOpen(false);
        throw error;
      }
      toast.error(
        error?.message ?? "Something went wrong. Please try again."
      );
    }
  };

  const currentAmount = form.watch("amount");
  const customInputValue = selectedPreset ? "" : currentAmount;

  const handleOpenChange = (nextOpen: boolean) => {
    // Only guard the "open" action; closing should always work
    if (nextOpen && !user) {
      const callbackUrl = pathname.startsWith("/sign-in") ? "/" : pathname;
      router.push(`/sign-in?callbackUrl=${callbackUrl}`);
      return;
    }
    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className="w-auto">
        {children ? (
          <div>{children}</div>
        ) : (
          <span className="text-green-600 lg:text-base md:text-xs uppercase cursor-pointer">
            Donate now
          </span>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md p-0 gap-0 rounded-none overflow-y-auto max-h-screen">
        <DialogHeader className="p-6 pb-4">
          <div className="space-y-1">
            <DialogTitle className="text-base font-medium text-foreground">
              Would you like to donate to charity?
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Choose a charity and donate any amount for your support
            </p>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-6 pb-6 space-y-6"
          >
            {/* Charity Selection */}
            <FormField
              control={form.control}
              name="charityId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover open={charityOpen} onOpenChange={setCharityOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={charityOpen}
                          disabled={charitiesLoading}
                          className="justify-between bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black text-sm !py-5 px-3 w-full cursor-pointer"
                        >
                          {charitiesLoading ? (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading charities…
                            </span>
                          ) : field.value ? (
                            (() => {
                              const match = charitiesData?.data?.find(
                                (c) => c.id === field.value
                              );
                              // FIX: use userName consistently as the display name
                              return match
                                ? match.fname + " " + (match?.lname ?? "")
                                : "Select type of charity";
                            })()
                          ) : (
                            <span className="text-muted-foreground">
                              Select type of charity
                            </span>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0 w-(--radix-popover-trigger-width)" align="start">
                        <Command>
                          <CommandInput placeholder="Search charities..." />
                          <CommandList>
                            <CommandEmpty>No charity found.</CommandEmpty>
                            <CommandGroup>
                              {charitiesData?.data?.map((charity) => (
                                <CommandItem
                                  key={charity.id}
                                  // FIX: use the display name as value so Command
                                  // search filters against human-readable text,
                                  // not a UUID.
                                  value={charity.userName}
                                  // FIX: onSelect is restored — this was the
                                  // core bug causing selections to do nothing.
                                  onSelect={() => {
                                    field.onChange(
                                      charity.id === field.value
                                        ? ""
                                        : charity.id
                                    );
                                    setCharityOpen(false);
                                  }}
                                  className="cursor-pointer w-full flex flex-row gap-x-3 items-center justify-between"
                                >

                                  <div className="flex flex-row gap-x-3 items-center">
                                    {field.value && <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === charity.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />}

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
                                  </div>

                                  <Link
                                    onClick={(e) => {
                                      e.stopPropagation();      // don't trigger the item's onSelect
                                      setCharityOpen(false);    // close the charity popover
                                      setOpen(false);           // close the dialog
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    href={`/member/${charity?.userName}`} className="text-sm text-green-600 underline">
                                    View Charity
                                  </Link>

                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preset Amount Buttons */}
            <FormField
              control={form.control}
              name="amount"
              render={() => (
                <FormItem>
                  <div className="flex gap-3">
                    {presetAmounts.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={
                          selectedPreset === amount ? "default" : "outline"
                        }
                        className="flex-1 cursor-pointer shadow-none"
                        onClick={() => handlePresetSelect(amount)}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2 pt-1">
                    <Label
                      htmlFor="customAmount"
                      className="text-sm font-medium"
                    >
                      Custom Amount
                    </Label>
                    <Input
                      id="customAmount"
                      type="number"
                      step="any"
                      min="1"
                      placeholder="Enter your amount"
                      className="bg-white border-[#e1e1e1] rounded shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black text-base !py-5 px-3.5"
                      value={customInputValue}
                      onChange={(e) =>
                        handleCustomAmountChange(e.target.value)
                      }
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Privacy Options */}
            <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium">
                    Donation Privacy: Would you like to remain anonymous?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={String(field.value)}
                      onValueChange={(val) => field.onChange(val === "true")}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="anonymous" />
                        <Label
                          htmlFor="anonymous"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Yes, keep my donation anonymous
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="public" />
                        <Label
                          htmlFor="public"
                          className="text-sm font-normal cursor-pointer"
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

            <Button disabled={isSubmitting} type="submit" variant={"default"} className="flex-1 group cursor-pointer rounded-none py-6 w-full">
              {isSubmitting ? <span className="loader" /> : "Donate Now"}
            </Button>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}