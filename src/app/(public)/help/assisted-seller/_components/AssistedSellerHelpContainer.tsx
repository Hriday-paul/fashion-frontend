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
    id: "what-is-assisted-seller",
    title: "What is an Assisted Seller?",
  },
  {
    id: "how-it-works",
    title: "How the Procedure Works",
  },
  {
    id: "authenticated-badge",
    title: "Authenticated Badge & Profile Listings",
  },
  {
    id: "fees-and-shipping",
    title: "30% Service Fee & Shipping Label",
  },
  {
    id: "selling-window-and-returns",
    title: "30-Day Selling Target & Item Returns",
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
  },
];

export default function AssistedSellerHelpContainer() {
  return (
    <div className="scroll-smooth">
      {/* ───────────────── Editorial Header ───────────────── */}
      <header className="pb-10 md:pb-14 border-b border-gray-200">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Help Center · Assisted Selling
        </p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              Assisted Seller Guide
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Send your items to the{" "}
              <span className="font-semibold text-gray-900">FASHI-ON</span>{" "}
              team and let us handle the inspection, photography, pricing, and
              listing for you.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/assisted-seller">
              <Button className="rounded-none py-6 px-7 text-base cursor-pointer">
                Start Assisted Selling
                <ArrowUpRight className="size-5 ml-1.5" />
              </Button>
            </Link>
            <Link href="/profile/assisted-sell">
              <Button
                variant="outline"
                className="rounded-none py-6 px-7 text-base border-gray-900 cursor-pointer"
              >
                My Assisted Requests
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ───────────────── Main Two-Column Layout ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-10 md:pt-14 items-start">
        {/* LEFT SIDE: Sticky Anchor Navigation */}
        <aside className="lg:col-span-4 lg:sticky lg:top-44">
          <nav aria-label="Assisted Seller Guide Sections" className="space-y-4">
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
          {/* 1. What is an Assisted Seller? */}
          <section
            id="what-is-assisted-seller"
            className="scroll-mt-52 lg:scroll-mt-44 space-y-5"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              1. What is an Assisted Seller?
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              The <strong>Assisted Seller</strong> service allows you to sell
              your items without spending time taking photos, writing
              descriptions, or managing listing details yourself. Instead, you
              simply send your items directly to the{" "}
              <strong>FASHI-ON team</strong>, and our team lists and manages
              them on your behalf.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              Every item listed through Assisted Selling receives an official{" "}
              <strong>Authenticated</strong> badge, giving buyers confidence in
              the quality and authenticity of your pieces. Once published, all
              items appear directly on your seller profile so you can track
              their progress, sales, and charity donations.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* 2. How the Procedure Works */}
          <section id="how-it-works" className="scroll-mt-52 lg:scroll-mt-44 space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              2. How the Procedure Works
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              Getting your items listed with the FASHI-ON team follows a clear
              step-by-step process from initial request to live listing:
            </p>

            <ol className="space-y-8 pt-2">
              <li className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Step 1 — Submit the Request Form
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Start by filling out the{" "}
                  <Link
                    href="/assisted-seller"
                    className="font-semibold text-gray-900 underline underline-offset-4"
                  >
                    Assisted Seller Request Form
                  </Link>
                  . Provide photos of your items, item quantity, condition,
                  charity donation percentage, return window, and parcel size
                  details.
                </p>
              </li>

              <li className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Step 2 — FASHI-ON Team Review & Approval
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Our team reviews your submission. If any clarification or
                  additional information is required, the FASHI-ON team will
                  communicate with you directly. After reviewing your items
                  against our guidelines, the team will either{" "}
                  <strong>Approve</strong> or <strong>Reject</strong> the
                  request.
                </p>
              </li>

              <li className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Step 3 — Pay Shipping Cost & Get Your Shipping Label
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Once your request is <strong>Approved</strong>, go to your{" "}
                  <Link
                    href="/profile/assisted-sell"
                    className="font-semibold text-gray-900 underline underline-offset-4"
                  >
                    Assisted Selling Requests
                  </Link>{" "}
                  page to pay the shipping cost and generate your shipping
                  label.
                </p>
              </li>

              <li className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Step 4 — Ship Your Items to FASHI-ON
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Package your items securely (you can send a single item or
                  multiple approved items in one parcel), attach the shipping
                  label, and send the parcel to our team.
                </p>
              </li>

              <li className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Step 5 — Status Updated to Received & Items Listed
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  When the FASHI-ON team receives your shipment, we update your
                  request status to <strong>Received</strong>. Our team then
                  inspects, authenticates, photographs, and lists your items.
                  All listed items will automatically appear on your seller
                  profile.
                </p>
              </li>
            </ol>
          </section>

          <hr className="border-gray-200" />

          {/* 3. Authenticated Badge & Profile Listings */}
          <section id="authenticated-badge" className="scroll-mt-52 lg:scroll-mt-44 space-y-5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              3. Authenticated Badge & Profile Listings
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              Because every item sent through Assisted Selling is physically
              received and verified by our team before going live, each listing
              displays an official <strong>Authenticated</strong> badge. This
              reassures buyers that the item has been checked for quality and is
              ready to ship directly from FASHI-ON.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              All items listed by our team are connected to your account and
              shown on your public seller profile. You can monitor your active
              listings, views, and sales anytime, while the FASHI-ON team
              handles the listing management.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* 4. 30% Service Fee & Shipping Label */}
          <section id="fees-and-shipping" className="scroll-mt-52 lg:scroll-mt-44 space-y-5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              4. 30% Service Fee & Shipping Label
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              Each sale made through the Assisted Seller service carries a{" "}
              <strong>30% commission fee</strong> on the sale price, deducted
              before your chosen charity donation percentage. There are no
              upfront listing fees—commission is only charged when an item
              sells.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              When your request is approved, you only pay the outbound shipping
              cost to obtain your shipping label and send your parcel to the
              FASHI-ON team. Once your item sells and is delivered to the buyer,
              your net earnings are credited to your account.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* 5. 30-Day Selling Target & Item Returns */}
          <section
            id="selling-window-and-returns"
            className="scroll-mt-52 lg:scroll-mt-44 space-y-5"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              5. 30-Day Selling Target & Item Returns
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              The FASHI-ON team aims to sell your items within{" "}
              <strong>30 days</strong> of listing. We price and showcase your
              authenticated items to give them the best chance of selling
              within this timeframe.
            </p>
            <p className="text-base sm:text-lg leading-relaxed">
              If you feel that your items are not selling after 30 days—or if
              you need your items back for your own personal reasons—you can
              request the FASHI-ON team to return the items to you (provided
              they have not already been sold). Once requested, our team will
              delist the items and arrange their return shipment to your address
              (return shipping costs may apply).
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* 6. Frequently Asked Questions */}
          <section id="faq" className="scroll-mt-52 lg:scroll-mt-44 space-y-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              6. Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  When do I pay for the shipping label?
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  You only pay for the shipping label after the FASHI-ON team
                  reviews and approves your Assisted Seller request.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  How do I know when the FASHI-ON team receives my parcel?
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Once your shipment arrives at our warehouse, the FASHI-ON team
                  updates your request status to <strong>Received</strong> and
                  begins photographing and listing your items.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Can I request my items back at any time?
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Yes. While our team aims to sell items within 30 days, you can
                  request the FASHI-ON team to return your unsold items if they
                  do not sell or if you want them back for personal use.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Can I still support a charity as an Assisted Seller?
                </h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  Yes. When submitting the Assisted Seller request form, you
                  select your preferred charity and donation percentage just
                  like a standard listing.
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
