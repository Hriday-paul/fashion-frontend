"use client";

import React, { useState } from "react";
import {
  IClothDonation,
  useUpdateClothDonationStatusMutation,
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
  Check,
  Droplets,
  Eye,
  Layers,
  Loader2,
  Package,
  Shirt,
  Sparkles,
  Tag,
  Truck,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { toast } from "sonner";
import { defaultImg } from "@/utils/defaultImg";
import { cn } from "@/lib/utils";
import {
  formatClothStatus,
  formatWashedType,
} from "../../../donation-contribution/cloth-donation/_components/ClothDonationDetailsDialog";
import ThanksMessageDialog from "../../_components/ThanksMessageDialog";

interface CharityClothDonationDetailsDialogProps {
  donation: IClothDonation;
}

function CharityClothDonationDetailsDialog({
  donation,
}: CharityClothDonationDetailsDialogProps) {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [actionStatus, setActionStatus] = useState<
    "ACCEPTED" | "REJECTED" | null
  >(null);

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateClothDonationStatusMutation();

  const photos = donation?.photos || [];
  const activePhotoUrl =
    photos[selectedPhotoIdx]?.url || photos[0]?.url || defaultImg?.product;
  const statusInfo = formatClothStatus(donation.status);
  const donor = donation?.donor;
  const donorName =
    `${donor?.fname || ""} ${donor?.lname || ""}`.trim() ||
    donor?.userName ||
    "Donor";

  const handleStatusUpdate = async (status: "ACCEPTED" | "REJECTED") => {
    setActionStatus(status);
    try {
      const res = await updateStatus({ id: donation.id, status }).unwrap();
      toast.success(
        res?.message ||
          `Donation ${status === "ACCEPTED" ? "approved" : "declined"} successfully`
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update donation status");
    } finally {
      setActionStatus(null);
    }
  };

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

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded">
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
              Received on {moment(donation.createdAt).format(
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

          {/* Donor Information */}
          {donor && (
            <div className="border border-gray-200 bg-zinc-50/70 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="size-11 border border-gray-200 shrink-0">
                  <AvatarImage
                    src={donor?.picture?.url}
                    alt={donorName}
                    className="object-cover"
                  />
                  <AvatarFallback className="uppercase font-semibold">
                    {donorName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Donated By
                  </p>
                  <Link
                    href={`/member/${donor.userName}`}
                    className="text-sm sm:text-base font-semibold text-gray-900 hover:underline truncate block"
                  >
                    @{donor.userName}
                  </Link>
                  
                </div>
              </div>

              <Link href={`/member/${donor.userName}`} className="shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs border border-primary-black rounded-none shadow-none cursor-pointer"
                >
                  View Donor
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

          {/* Shipment Info (if available) */}
          {donation.shipment && (
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Truck className="size-3.5" />
                Shipment Information
              </p>
              <div className="border border-gray-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="space-y-0.5">
                  <p className="font-medium text-gray-900">
                    Status: {donation.shipment.status}
                  </p>
                  {donation.shipment.trackingNumber && (
                    <p className="text-xs text-muted-foreground">
                      Tracking #: {donation.shipment.trackingNumber}
                    </p>
                  )}
                </div>
                {donation.shipment.trackingUrl && (
                  <Link
                    href={donation.shipment.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold underline text-primary"
                  >
                    Track Shipment
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Approved Thank You Action */}
          {(donation.status === "ACCEPTED" ||
            donation.status === "COMPLETED") && (
            <div className="flex items-center justify-end border-t border-gray-200 pt-4">
              <ThanksMessageDialog
                referenceId={donation.id}
                msgType="CLOTH"
                existingMsg={donation.thanksMsg || donation.thanksMessage}
              />
            </div>
          )}

          {/* Pending Actions */}
          {donation.status === "PENDING" && (
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isUpdating}
                onClick={() => handleStatusUpdate("REJECTED")}
                className="border border-destructive text-destructive hover:text-destructive rounded-none shadow-none cursor-pointer gap-1.5"
              >
                {isUpdating && actionStatus === "REJECTED" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <X className="size-4" />
                )}
                Decline Donation
              </Button>
              <Button
                type="button"
                variant="default"
                disabled={isUpdating}
                onClick={() => handleStatusUpdate("ACCEPTED")}
                className="border border-primary-black rounded-none shadow-none cursor-pointer gap-1.5"
              >
                {isUpdating && actionStatus === "ACCEPTED" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                Approve Donation
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CharityClothDonationDetailsDialog;
