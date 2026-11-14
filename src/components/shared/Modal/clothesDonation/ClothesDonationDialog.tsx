"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DonationForm } from "./ClothesDonationFrom"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ClothesDonationDialog({ className, children, charityId }: { className?: string; children: React.ReactNode, charityId: string }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const user = useSelector((state: RootState) => state.auth.user);

    const handleOpenChange = (nextOpen: boolean) => {
        // Only guard the "open" action; closing should always work
        if (nextOpen && !user) {

            router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
            return;
        }
        setOpen(nextOpen);
    };

    return (
        <>
            {/* <Button onClick={() => setOpen(true)} className={cn("bg-transparent font-medium hover:bg-gray-100 duration-300  text-green-700 rounded  uppercase md:min-w-40 md:py-5 cursor-pointer group border border-green-700", className)}>
                Donate Clothes <AnimatedArrow />
            </Button> */}
            <Dialog open={open} onOpenChange={handleOpenChange} >
                <DialogTrigger asChild className={className}>
                    {children}
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] sm:max-w-2xl overflow-y-auto scroll-hide rounded">
                    <DialogHeader>
                        <DialogTitle>Donate Clothes</DialogTitle>
                        <DialogDescription>Tell us what you are sending to the charity we accept it.</DialogDescription>
                    </DialogHeader>
                    <DonationForm onSubmit={() => setOpen(false)} charityId={charityId} />
                </DialogContent>
            </Dialog>
        </>
    )
}
