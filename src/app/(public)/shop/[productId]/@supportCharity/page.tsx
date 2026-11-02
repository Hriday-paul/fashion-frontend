import { ChevronRight, HeartHandshake } from "lucide-react";
import { GetProductCharitySupport } from "@/lib/services/Products";
import { IUser } from "@/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FormatCurrency from "@/components/shared/FormatCurrency";
import { ProductDonationAbout } from "@/components/shared/DonationAbout";
import Image from "next/image";
import { defaultImg } from "@/utils/defaultImg";

async function CharityImpact({ params }: { params: Promise<{ productId: string }> }) {

    const { productId } = await params;

    const res = await GetProductCharitySupport({ productId }) as {
        data: {
            charities: { charity: IUser }[],
            donation_percent: number,
            donation_amount: number,
        }
    }

    const donation = res?.data?.donation_amount || 0;

    const GLOBAL_DONATION_PERCENT = res?.data?.donation_percent || 0;

    const splitPercent = GLOBAL_DONATION_PERCENT / res?.data?.charities?.length || 0;

    return (
        res?.data?.charities.length > 0 && <section className="mt-10">
            <div className="flex flex-wrap items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-green-500/10 text-primary">
                    <HeartHandshake className="size-5" aria-hidden />
                </span>
                <div>
                    <h2 id="charity-heading" className="text-lg lg:text-xl font-semibold tracking-tight text-foreground flex flex-row gap-x-1 items-center">
                        Where your purchase gives back
                        <ProductDonationAbout percentage={GLOBAL_DONATION_PERCENT} />
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        The seller donates{" "}
                        <strong className="font-semibold text-foreground">
                            {GLOBAL_DONATION_PERCENT.toFixed(2)}% of every sale
                        </strong>{" "}
                        of this item — about <FormatCurrency amount={donation} /> from this order.
                    </p>
                </div>
            </div>

            <ul className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {res?.data?.charities?.map((c) => (
                    <li
                        key={c?.charity.fname + c?.charity.lname}
                        className="flex items-start gap-3 rounded-md border border-border bg-card/80 p-3 backdrop-blur"
                    >
                        <Link href={`/member/${c?.charity.userName}`}>
                            <Image
                                src={c?.charity.charityThumbnail?.url || defaultImg?.product}
                                alt="Charity thumbnail"
                                className="object-cover w-28 h-16 rounded-md"
                                width={800}
                                height={600}
                                placeholder="blur"
                                blurDataURL={defaultImg?.placeholderImg}
                            />
                        </Link>
                        <div>
                            <Link href={`/member/${c?.charity.userName}`}>
                                <div className="min-w-0">
                                    <p className="truncate text-base font-semibold">{c?.charity.fname} {c?.charity?.lname}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {splitPercent.toFixed(2)}% of the donation · <FormatCurrency amount={(donation / (res?.data?.charities?.length || 0)).toFixed(2)} />
                                    </p>
                                </div>
                            </Link>
                            <Link
                                href={`/member/${c?.charity?.userName}`}
                                // onClick={() => onOpenChange(false)}
                                className="inline-flex items-center underline text-sm text-green-700"
                            >
                                View Charity
                                <ChevronRight className="size-4" />
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default CharityImpact;