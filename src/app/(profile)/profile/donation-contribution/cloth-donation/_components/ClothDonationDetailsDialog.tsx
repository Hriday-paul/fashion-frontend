"use client";

import React, { useState } from "react";
import {
  IClothDonation,
  TClothDonationStatus,
  TWashedType,
} from "@/redux/api/donation.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Droplets,
  Eye,
  Layers,
  Package,
  Shirt,
  Sparkles,
  Tag,
  Truck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { defaultImg } from "@/utils/defaultImg";
import { cn } from "@/lib/utils";
import ClothDonationShipmentActions from "./ClothDonationShipmentActions";

export function formatClothStatus(status: TClothDonationStatus) {
  switch (status) {
    case "PENDING":
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "ACCEPTED":
      return {
        label: "Accepted",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        className: "bg-green-50 text-green-700 border-green-200",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        className: "bg-red-50 text-red-700 border-red-200",
      };
    default:
      return {
        label: status,
        className: "bg-zinc-100 text-zinc-700 border-zinc-200",
      };
  }
}

export function formatWashedType(washedType: TWashedType) {
  switch (washedType) {
    case "RECENT_WASHED":
      return "Recently Washed";
    case "WASHED":
      return "Washed";
    case "UNWASHED":
      return "Unwashed";
    default:
      return washedType;
  }
}

interface ClothDonationDetailsDialogProps {
  donation: IClothDonation;
}

function ClothDonationDetailsDialog({
  donation,
}: ClothDonationDetailsDialogProps) {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  const photos = donation?.photos || [];
  const activePhotoUrl =
    photos[selectedPhotoIdx]?.url || photos[0]?.url || defaultImg?.product;
  const statusInfo = formatClothStatus(donation.status);
  const charity = donation?.charity;
  const charityName =
    `${charity?.fname || ""} ${charity?.lname || ""}`.trim() ||
    charity?.userName ||
    "Charity";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border border-primary-black rounded-none shadow-none cursor-pointer gap-1.5 text-xs font-medium"
        >
          <Eye className="size-3.5" />
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-none">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Cloth Donation Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs font-medium bg-zinc-50 border-gray-200 rounded-none"
              >
                {donation.donationType === "SINGLE"
                  ? "Single Item"
                  : "Multiple Items (Bag)"}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-semibold rounded-none",
                  statusInfo.className
                )}
              >
                {statusInfo.label}
              </Badge>
            </div>
          </div>
          {donation?.createdAt && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
              <Calendar className="size-3.5" />
              Submitted on {moment(donation.createdAt).format(
                "MMM DD, YYYY"
              )}{" "}
              ({moment(donation.createdAt).fromNow()})
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Photos Gallery */}
          {photos.length > 0 && (
            <div className="space-y-2.5">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden border border-gray-200 bg-zinc-100">
                <Image
                  src={activePhotoUrl}
                  alt="Donation photo"
                  fill
                  className="object-contain"
                />
              </div>

              {photos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {photos.map((photo, idx) => (
                    <button
                      key={photo.id || idx}
                      type="button"
                      onClick={() => setSelectedPhotoIdx(idx)}
                      className={cn(
                        "relative size-16 overflow-hidden border-2 shrink-0 cursor-pointer transition-all",
                        selectedPhotoIdx === idx
                          ? "border-black ring-1 ring-black"
                          : "border-gray-200 opacity-70 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={photo.url}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Charity Organization */}
          {charity && (
            <div className="border border-gray-200 bg-zinc-50/70 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="size-11 border border-gray-200 shrink-0">
                  <AvatarImage
                    src={
                      charity?.picture?.url ||
                      charity?.charityThumbnail?.url ||
                      defaultImg?.empty_user
                    }
                    alt={charityName}
                    className="object-cover"
                  />
                  <AvatarFallback className="uppercase font-semibold">
                    {charityName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Donated To Charity
                  </p>
                  <Link
                    href={`/member/${charity.userName}`}
                    className="text-sm sm:text-base font-semibold text-gray-900 hover:underline truncate block"
                  >
                    @{charity.userName}
                  </Link>
                  {charity.email && (
                    <p className="text-xs text-muted-foreground truncate">
                      {charity.email}
                    </p>
                  )}
                </div>
              </div>

              <Link href={`/member/${charity.userName}`} className="shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs border border-primary-black rounded-none shadow-none cursor-pointer"
                >
                  View Charity
                </Button>
              </Link>
            </div>
          )}

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="border border-gray-200 p-3.5 space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Package className="size-3.5" />
                Items Count
              </span>
              <p className="text-sm font-semibold text-gray-900">
                {donation.itemsCount
                  ? `${donation.itemsCount} ${
                      donation.donationType === "SINGLE" ? "Item" : "Items"
                    }`
                  : donation.donationType === "SINGLE"
                  ? "1 Item"
                  : "Multiple Items"}
              </p>
            </div>

            <div className="border border-gray-200 p-3.5 space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                {donation.donationType === "MULTIPLE"
                  ? "Overall Condition"
                  : "Condition"}
              </span>
              <p className="text-sm font-semibold text-gray-900">
                {donation.condition || "N/A"}
              </p>
            </div>

            <div className="border border-gray-200 p-3.5 space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Droplets className="size-3.5" />
                Wash Status
              </span>
              <p className="text-sm font-semibold text-gray-900">
                {formatWashedType(donation.washedType)}
              </p>
            </div>
          </div>

          {/* Categories, Person Types, Brands */}
          <div className="space-y-4">
            {donation.itemTypes?.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Shirt className="size-3.5" />
                  Item Categories
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {donation.itemTypes.map((type, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs font-medium px-2.5 py-0.5 rounded-none"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {donation.personTypes?.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  Target Audience / Person Type
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {donation.personTypes.map((person, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-xs font-medium px-2.5 py-0.5 border-gray-300 rounded-none"
                    >
                      {person}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {donation.brands?.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Tag className="size-3.5" />
                  Brands
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {donation.brands.map((brand, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-xs font-medium px-2.5 py-0.5 bg-zinc-50 border-gray-200 rounded-none"
                    >
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {donation.description && (
            <div className="space-y-1.5 border-t border-gray-200 pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5" />
                Description / Notes
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-zinc-50 p-3.5 border border-gray-200">
                {donation.description}
              </p>
            </div>
          )}

          {/* Shipment Info / Actions */}
          {(donation.shipment || donation.status === "ACCEPTED") && (
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Truck className="size-3.5" />
                Shipment Information
              </p>
              <div className="border border-gray-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="space-y-0.5">
                  <p className="font-medium text-gray-900">
                    {donation.shipment
                      ? `Status: ${donation.shipment.status}`
                      : "Approved — Ready for shipping"}
                  </p>
                  {donation.shipment?.trackingNumber && (
                    <p className="text-xs text-muted-foreground">
                      Tracking #: {donation.shipment.trackingNumber}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {donation.shipment?.trackingUrl && (
                    <Link
                      href={donation.shipment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold underline text-primary"
                    >
                      Track Shipment
                    </Link>
                  )}
                  <ClothDonationShipmentActions donation={donation} />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ClothDonationDetailsDialog;
