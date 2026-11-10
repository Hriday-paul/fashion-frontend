import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HelpSectionItem {
  id: string;
  title: string;
}

const HELP_SECTIONS: HelpSectionItem[] = [
  {
    id: "how-donations-work",
    title: "How Charity Donations Work",
  },
  {
    id: "minimum-and-adjustable-percentage",
    title: "Minimum 5% & Adjustable Percentage",
  },
  {
    id: "selecting-charities",
    title: "Selecting Charities & Equal Splitting",
  },
  {
    id: "when-donations-are-released",
    title: "When Donations Are Released",
  },
  {
    id: "donation-privacy",
    title: "Donation Privacy & Profile Impact",
  },
  {
    id: "buyer-contributions",
    title: "Buyer Impact & Checkout Donations",
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
  },
];

export default function DonationsHelpContainer() {
  return (
    <div className="scroll-smooth">
      {/* ───────────────── Editorial Header ───────────────── */}
      <header className="pb-10 md:pb-14 border-b border-gray-200">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Help Center · Charity Donations
        </p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              How Charity Donations Work
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Every sale on{" "}
              <span className="font-semibold text-gray-900">FASHI-ON</span>{" "}
              supports charitable causes. Learn how seller donation pledges,
              multi-charity splitting, and donation payouts work once an order
              is completed.
            </p>
          </div>

          {/* <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/sell">
              <Button className="rounded-none py-6 px-7 text-base cursor-pointer">
                List an Item
                <ArrowUpRight className="size-5 ml-1.5" />
              </Button>
            </Link>
            <Link href="/charity">
              <Button
                variant="outline"
                className="rounded-none py-6 px-7 text-base border-gray-900 cursor-pointer"
              >
                Explore Charities
              </Button>
            </Link>
          </div> */}
        </div>
      </header>

      {/* ───────────────── Main Two-Column Layout ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-10 md:pt-14 items-start">
        {/* LEFT SIDE: Sticky Anchor Navigation */}
        <aside className="lg:col-span-4 lg:sticky lg:top-44">
          <nav aria-label="Charity Donations Guide Sections" className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              On this page
            </p>
            <ul className="space-y-1 border-l-2 border-gray-200">
              {HELP_SECTIONS.map((section, idx) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="group flex items-baseline gap-3 pl-4 py-2 text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 hover:border-l-2 hover:border-gray-900 -ml-[2px] transition-colors"
                  >
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-900">
                      0{idx + 1}
                    </span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* RIGHT SIDE: All Sections Server-Rendered */}
        <article className="lg:col-span-8 space-y-16 md:space-y-20 text-gray-700">
          {/* 1. How Charity Donations Work */}
          <section
            id="how-donations-work"
            className="scroll-mt-52 lg:scroll-mt-44 space-y-5"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              1. How Charity Donations Work
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              On <strong>FASHI-ON</strong>, giving back is built directly into
              every listing. When you list an item for sale, you pledge a
              percentage of the selling price to one or more charities of your
              choice.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              There are no upfront charges to pledge a donation. Your chosen
              donation percentage is only deducted from your sale proceeds after
              your item sells and the order is completed by the buyer.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* 2. Minimum 5% & Adjustable Percentage */}
          <section
            id="minimum-and-adjustable-percentage"
            className="scroll-mt-52 lg:scroll-mt-44 space-y-5"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              2. Minimum 5% & Adjustable Percentage
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              As a standard seller, a <strong>minimum 5% donation</strong> is
              required on every listing sale. This ensures that every purchase
              on the platform contributes meaningfully to charitable causes.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              You have full flexibility to <strong>adjust the percentage</strong>{" "}
              above the minimum—anywhere from <strong>5% up to 100%</strong> of
              the sale price (in 5% increments)—when creating or editing your
              listing. Verified Eco-Friendly Stores may optionally set a custom
              donation percentage starting from 0%. Whether you want to donate a
              small portion or give 100% of your proceeds to a cause you care
              about, the choice is yours.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* 3. Selecting Charities & Equal Splitting */}
          <section
            id="selecting-charities"
            className="scroll-mt-52 lg:scroll-mt-44 space-y-5"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              3. Selecting Charities & Equal Splitting
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              For each listing, you can select{" "}
              <strong>up to three charities</strong> to support. If you select
              more than one charity, your pledged donation amount is{" "}
              <strong>automatically divided equally</strong> among the selected
              charities.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              <strong>Example:</strong> If you sell an item for £100 and pledge
              a 20% donation (£20 total), and you have selected two charities on
              your listing, each charity will receive £10 once the sale is
              completed.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* 4. When Donations Are Released */}
          <section
            id="when-donations-are-released"
            className="scroll-mt-52 lg:scroll-mt-44 space-y-6"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              4. When Donations Are Released
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              To protect both buyers and sellers, donation funds follow the
              order completion lifecycle:
            </p>

            <ol className="space-y-6 pt-2">
              <li className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Step 1 — Item Is Purchased
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  When a buyer purchases your item, the payment—including the
                  pledged donation portion—is held securely while you ship the
                  order.
                </p>
              </li>

              <li className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Step 2 — Delivery & Buyer Confirmation
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Once the item is delivered and the{" "}
                  <strong>buyer marks the order as completed</strong>, the sale
                  is officially finalized.
                </p>
              </li>

              <li className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Step 3 — Donation Released to Charity
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Immediately upon order completion, the pledged donation amount
                  is <strong>released to your selected charity</strong> (or
                  split equally across your selected charities), and your
                  remaining net earnings are released to your seller balance.
                </p>
              </li>
            </ol>
          </section>

          <hr className="border-gray-200" />

          {/* 5. Donation Privacy & Profile Impact */}
          <section
            id="donation-privacy"
            className="scroll-mt-52 lg:scroll-mt-44 space-y-5"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              5. Donation Privacy & Profile Impact
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              When creating a listing or submitting an{" "}
              <Link
                href="/help/assisted-seller"
                className="font-semibold text-gray-900 underline underline-offset-4"
              >
                Assisted Seller
              </Link>{" "}
              request, you can choose how your name is shared with the charity:
            </p>
            <ul className="space-y-4 pl-5 list-disc text-base sm:text-lg leading-relaxed">
              <li>
                <strong>Yes, keep my donation anonymous:</strong> Your name will
                not appear publicly on the charity&apos;s supporter information.
              </li>
              <li>
                <strong>No, show my name:</strong> Your name may appear publicly
                on the charity&apos;s supporter list in recognition of your
                contribution.
              </li>
            </ul>
            <p className="text-base sm:text-lg leading-relaxed">
              Regardless of your privacy selection, your completed donation
              amount will still count toward the total funds raised badge on
              your seller profile.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* 6. Buyer Impact & Checkout Donations */}
          <section
            id="buyer-contributions"
            className="scroll-mt-52 lg:scroll-mt-44 space-y-5"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              6. Buyer Impact & Checkout Donations
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              Every listing page clearly highlights the seller&apos;s pledged
              donation percentage and the chosen charities so buyers can see the
              positive impact of their purchase before they buy.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              In addition to the seller&apos;s pledge, buyers also have the
              option to add an <strong>optional extra donation</strong> at
              checkout if they wish to contribute even more to the cause.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* 7. Frequently Asked Questions */}
          <section
            id="faq"
            className="scroll-mt-52 lg:scroll-mt-44 space-y-8"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              7. Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Can I change my donation percentage after publishing a
                  listing?
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Yes. You can adjust your donation percentage (between 5% and
                  100%) or update your selected charities at any time before the
                  item is sold by editing your listing.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  What happens if an order is cancelled or returned?
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Because donations are only released after the sale is
                  completed and confirmed by the buyer, no donation is deducted
                  if an order is cancelled or refunded prior to completion.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  How do donations work when using Assisted Selling?
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  When submitting an Assisted Seller request, you choose your
                  donation percentage (minimum 5%) and up to three charities.
                  Once an item sells and the buyer marks the order as completed,
                  the 30% assisted selling fee is deducted first, and your
                  pledged donation percentage is released to charity.
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
