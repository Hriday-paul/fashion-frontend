"use client";

import React from "react";
import { IClothDonation } from "@/redux/api/donation.api";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Droplets,
  Image as ImageIcon,
  Package,
  Sparkles,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { defaultImg } from "@/utils/defaultImg";
import { cn } from "@/lib/utils";
import ClothDonationDetailsDialog, {
  formatClothStatus,
  formatWashedType,
} from "./ClothDonationDetailsDialog";
import ClothDonationShipmentActions from "./ClothDonationShipmentActions";

interface ClothDonationCardProps {
  donation: IClothDonation;
}

function ClothDonationCard({ donation }: ClothDonationCardProps) {
  const photos = donation?.photos || [];
  const mainPhoto = photos[0]?.url || defaultImg?.product;
  const statusInfo = formatClothStatus(donation.status);
  const charity = donation?.charity;
  const charityName =
    `${charity?.fname || ""} ${charity?.lname || ""}`.trim() ||
    charity?.userName ||
    "Charity";

  return (
    <div className="border border-gray-200 bg-white p-3.5 sm:p-4 hover:border-gray-300 transition-colors flex flex-col sm:flex-row gap-4 justify-between">
      {/* Left: Photo + Details */}
      <div className="flex flex-col xs:flex-row items-start gap-4 flex-1 min-w-0">
        {/* Thumbnail */}
        <div className="relative h-28 w-full xs:w-28 sm:h-28 sm:w-28 overflow-hidden border border-gray-200 bg-zinc-100 shrink-0">
          <Image
            src={mainPhoto}
            alt="Cloth donation"
            fill
            className="object-cover"
          />
          {photos.length > 1 && (
            <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white">
              <ImageIcon className="size-3" />
              {photos.length}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2 w-full">
          {/* Top Row: Charity & Status */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-muted-foreground">To:</span>
              <Link
                href={charity?.userName ? `/member/${charity.userName}` : "#"}
                className="text-base font-semibold text-gray-900 hover:underline truncate"
              >
                @{charity?.userName || charityName}
              </Link>
            </div>

            <div className="flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="text-[11px] font-medium bg-zinc-50 border-gray-200 rounded-none"
              >
                {donation.donationType === "SINGLE"
                  ? "Single Item"
                  : "Multiple Items"}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-[11px] font-semibold rounded-none",
                  statusInfo.className
                )}
              >
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          {/* Item Categories */}
          {donation.itemTypes?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {donation.itemTypes.slice(0, 4).map((item, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs font-normal px-2 py-0 h-5 rounded-none"
                >
                  {item}
                </Badge>
              ))}
              {donation.itemTypes.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{donation.itemTypes.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Meta Attributes */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600">
            <span className="inline-flex items-center gap-1">
              <Package className="size-3.5 text-muted-foreground" />
              {donation.itemsCount
                ? `${donation.itemsCount} ${
                    donation.donationType === "SINGLE" ? "item" : "items"
                  }`
                : donation.donationType === "SINGLE"
                ? "1 item"
                : "Multiple items"}
            </span>

            <span className="inline-flex items-center gap-1">
              <Sparkles className="size-3.5 text-muted-foreground" />
              {donation.condition}
            </span>

            <span className="inline-flex items-center gap-1">
              <Droplets className="size-3.5 text-muted-foreground" />
              {formatWashedType(donation.washedType)}
            </span>

            {donation.brands?.length > 0 && (
              <span className="inline-flex items-center gap-1 truncate max-w-[180px]">
                <Tag className="size-3.5 text-muted-foreground shrink-0" />
                {donation.brands.join(", ")}
              </span>
            )}
          </div>

          {/* Bottom Row: Date + View Details Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {donation.createdAt ? (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                {moment(donation.createdAt).format("MMM DD, YYYY")} (
                {moment(donation.createdAt).fromNow()})
              </span>
            ) : (
              <span />
            )}

            <div className="flex flex-wrap items-center gap-2">
              <ClothDonationShipmentActions donation={donation} />
              <ClothDonationDetailsDialog donation={donation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClothDonationCard;
