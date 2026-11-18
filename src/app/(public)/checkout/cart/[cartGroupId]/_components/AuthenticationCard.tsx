"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"
import { toggleAuthenticationToCart } from "@/redux/features/cart.slice";
import { RootState } from "@/redux/store";
import { ShieldCheck } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function AuthenticationCard({ cartGroupId }: { cartGroupId: string }) {

    const carts = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const selectedcart = carts?.carts?.find((cart) => cart?.cartGroupId === cartGroupId);

    const handleToggle = async (checked: boolean) => {
        dispatch(toggleAuthenticationToCart({ cartGroupId, allowedAuthentication: checked }));
    }

    return (
        <Card className=" hover:border hover:border-primary-color/50 duration-300 text-black h-fit rounded-none gap-3">
            <CardHeader className="mb-0">
                <CardTitle className="font-semibold text-lg flex flex-row items-center gap-2">
                    <ShieldCheck />
                    Authentication & Quality Control
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                    Physical inspection by our experts before delivery.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">

                <div className="flex flex-row justify-between items-center">

                    <p className="font-semibold text-xl">+£15.00</p>

                    <Switch
                        id="authentication"
                        // defaultChecked
                        className="h-6 w-12 [&>span]:h-5 [&>span]:w-5 [&>span]:data-[state=checked]:translate-x-[25px]"
                        defaultChecked={selectedcart?.allowedAuthentication || false}
                        onCheckedChange={handleToggle}
                    />
                </div>

            </CardContent>

        </Card>
    )
}

export default AuthenticationCard