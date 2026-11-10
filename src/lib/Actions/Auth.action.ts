"use server";
import { EnvConfig } from "@/config";
import { cookies } from "next/headers";

export async function setAuthCookie({ acstoken, reftoken }: { acstoken: string, reftoken: string }) {
    (await cookies()).set("fashion-access-token", acstoken, {
        path: "/",
        httpOnly: false, // keep false if client code needs to read it
        secure: EnvConfig.hasSSL ? true : false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, //7 days
    });

    (await cookies()).set("fashion-refresh-token", reftoken, {
        path: "/",
        httpOnly: false, // keep false if client code needs to read it
        secure: EnvConfig.hasSSL ? true : false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, //30 days
    });

}