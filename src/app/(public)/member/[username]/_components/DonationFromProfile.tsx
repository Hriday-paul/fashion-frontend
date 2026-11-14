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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { DonateDirectMoney } from "@/lib/Actions/Donation.action";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    amount: z.string().min(1, "Please select or enter an amount"),
    isAnonymous: z.boolean({
        required_error: "Please select a privacy option",
    }),
});

type FormData = z.infer<typeof formSchema>;

export function DonationFromProfile({
    children,
    charity,
    className,
}: {
    children?: React.ReactNode;
    charity: IUser;
    className?: string;
}) {

    const [selectedPreset, setSelectedPreset] = useState<string>("");
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const user = useSelector((state: RootState) => state.auth.user);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
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
            const res = await DonateDirectMoney({ payload: { ...data, charityId: charity?.id } });
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
            router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`); // adjust to your actual sign-in route
            return;
        }
        setOpen(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild className={className}>
                {children ? (
                    <div className={cn("w-auto", className)}>{children}</div>
                ) : (
                    <span className="text-green-600 lg:text-base md:text-xs uppercase cursor-pointer">
                        Donate now
                    </span>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-md p-0 gap-0 rounded-none overflow-y-auto max-h-screen">
                <DialogHeader className="p-6 pb-3 border-b border-gray-200">
                    <DialogTitle className="text-lg font-semibold text-foreground text-center">
                        Donate Now
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="px-6 pb-6 space-y-6"
                    >

                        <div>
                            <center className="relative shrink-0 mx-auto mt-3">
                                <Avatar className="h-24 w-24 shadow-sm">
                                    <AvatarImage src={charity?.picture?.url} className='bg-card object-cover ring-4 ring-card shadow' />
                                    <AvatarFallback className='text-3xl capitalize font-medium'>{charity?.userName.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                            </center>

                            <p className=" text-xl tracking-tight font-semibold mt-2 text-center">
                                {charity?.fname} {charity?.lname}
                            </p>

                            <p className="text-sm text-gray-600 mt-1 text-center">Support this charity directly and help make a difference.</p>
                        </div>

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