import { EnvConfig } from "@/config";

export const GetRates = async () => {
    try {
        const res = await fetch(`${EnvConfig.ratesApiBaseUrl}/rates?base=GBP&quotes=EUR,USD,GBP`, {
            next: { revalidate: 3600 * 12 }, // Revalidate every 12 hours
        });

        if (!res.ok) {
            throw new Error("Failed to fetch rates");
        }

        const data = await res.json();

        return data;
        
    } catch (err) {
        throw err;
    }
};