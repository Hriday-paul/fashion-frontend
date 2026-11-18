import FormatCurrency from "@/components/shared/FormatCurrency";
import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { DonationSummary } from '../@stats/page';



async function DonationStats({ stats }: { stats: DonationSummary }) {

    const summary = [
        { label: "Item Sales Proceeds", value: <FormatCurrency fixed amount={stats?.totalSellDonationAmount} decimals={1} /> },
        { label: "Purchase Contributions", value: <FormatCurrency fixed amount={stats?.totalPurchaseDonationContribute} decimals={1} /> },
        { label: "Extra Donations", value: <FormatCurrency fixed amount={stats?.totalExtraDonated} decimals={1} /> },
        { label: "Direct Donation", value: <FormatCurrency fixed amount={stats?.directDonation} decimals={1} /> },
        { label: "Total Clothing Donated", value: `${stats?.clothDonation} items` },
        { label: "Total Trees Donated", value: <FormatCurrency fixed amount={stats?.totalTreeDonationAmount} decimals={1} /> }
    ];

    return (
        <div>
            {/* Total Raised hero */}
            <section className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="flex items-baseline justify-between">
                    <span className="text-base font-medium text-gray-800">Donations Made</span>
                    <span className="text-3xl font-semibold tracking-tight"><FormatCurrency fixed amount={stats?.total} decimals={1} /></span>
                </div>
            </section>

            {/* Summary accordion */}
            <Accordion type="single" collapsible className="w-full mb-4">
                <div className="bg-card rounded-2xl border overflow-hidden">
                    <AccordionItem value="summary" className="border-0">
                        <AccordionTrigger className="px-5 py-4 text-sm font-semibold hover:bg-secondary/50 hover:no-underline cursor-pointer">
                            Summary
                        </AccordionTrigger>

                        <AccordionContent>
                            <ul className="divide-y divide-border border-t border-border">
                                {summary.map((s) => (
                                    <li
                                        key={s.label}
                                        className="flex items-center justify-between px-5 py-3"
                                    >
                                        <span className="text-sm text-foreground">{s.label}</span>
                                        <span className="text-sm font-medium text-muted-foreground tabular-nums">
                                            {s.value}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </div>
            </Accordion>
        </div>
    )
}

export default DonationStats;