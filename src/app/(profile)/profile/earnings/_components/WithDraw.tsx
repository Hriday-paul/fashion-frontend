import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import GbpInput from '@/components/shared/GbpInput';
import { Button } from '@/components/ui/button';
import { useRequestWithdrawMutation } from '@/redux/api/userApi';
import { toast } from 'sonner';
import { Banknote, CheckCircle2 } from 'lucide-react';
import { SuccessModal } from '@/components/shared/Modal/SuccessModal';

function WithDraw() {

    const [withdrawOpen, setWithdrawOpen] = React.useState(false);
    const [openSuccess, setOpenSuccess] = React.useState(false);

    return (
        <>

            <button
                onClick={() => setWithdrawOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-foreground/90 cursor-pointer">
                <Banknote className="size-4" />
                Withdraw
            </button>

            <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>

                <DialogContent className="p-0 gap-0 rounded-none overflow-y-auto max-h-screen">
                    <DialogHeader className="p-6 pb-4 border-b border-gray-200">
                        <DialogTitle className="text-lg font-semibold text-center">
                            Withdraw Funds
                        </DialogTitle>
                    </DialogHeader>

                    <div className="px-6 space-y-4 py-5">
                        <WithdrawForm setWithdrawOpen={setWithdrawOpen} setOpenSuccess={setOpenSuccess} />
                    </div>
                </DialogContent>
            </Dialog>

            <SuccessModal
                open={openSuccess}
                setOpen={setOpenSuccess}
                content={
                    <div className="p-6 sm:p-8">

                        {/* Icon with soft glow background */}
                        <div className="flex justify-center mb-6">
                            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-green-50">
                                <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-40" />
                                <CheckCircle2
                                    className="w-11 h-11 text-green-500 relative"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>

                        {/* Heading */}
                        <p className="text-center text-2xl font-semibold text-gray-900 leading-snug mb-2">
                            Your withdrawal request has been submitted successfully!
                        </p>

                        {/* Subtext */}
                        <p className="text-center text-sm text-gray-500 leading-relaxed mb-8 max-w-xs mx-auto">
                            It will take some times to process your request. You will receive a notification once the funds have been transferred to your account.
                        </p>

                    </div>
                }
            />

        </>

    )
}

export default WithDraw;

const formSchema = z.object({
    amount: z
        .string()
        .min(1, "Amount is required")
        .refine((val) => !isNaN(Number(val)), {
            message: "Amount must be a valid number",
        })
        .refine((val) => Number(val) > 0, {
            message: "Amount must be greater than 0",
        }),
});

type FormData = z.infer<typeof formSchema>;

const WithdrawForm = ({ setWithdrawOpen, setOpenSuccess }: { setWithdrawOpen: React.Dispatch<React.SetStateAction<boolean>>; setOpenSuccess: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const [reqPayout, { isLoading, error, isError }] = useRequestWithdrawMutation();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await reqPayout(data).unwrap();

            setWithdrawOpen(false);
            setOpenSuccess(true);
            // if (res?.data?.url) {
            //     router.push(res.data.url);
            // }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to request payout");
        }
    }


    return <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* First Name and Last Name */}
            <div>
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount (£ GBP)</FormLabel>
                            <FormControl>
                                <GbpInput
                                    placeholder="Write amount to withdraw in GBP"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {isError && <p className="text-base text-red-500">{(error as any)?.data?.message || "Failed to request payout"}</p>}

            <div className='flex justify-end'>
                <Button size={"lg"} type="submit" disabled={isLoading} className="cursor-pointer rounded-none py-6 text-base font-semibold ">
                    {isLoading ? <span className="loader" /> : "Request Withdraw"}
                    {/* <AnimatedArrow /> */}
                </Button>
            </div>

        </form>



    </Form>
}
