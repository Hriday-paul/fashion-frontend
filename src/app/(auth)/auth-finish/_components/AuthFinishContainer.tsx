"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";
import { roleOptions } from "@/data/dummyData.tsx/userRoleData";
import { jwtDecode } from "jwt-decode";
import { AccountStatusModal } from "@/app/(auth)/sign-in/components/AccountStatusModal";
import CharitableOrganizationForm from "./forms/CharitableOrganizationForm";
import CharityShopForm from "./forms/CharityShopForm";
import EcoFriendlyStoreForm from "./forms/EcoFriendlyStoreForm";
import CelebrityForm from "./forms/CelebrityForm";
import AmbassadorForm from "./forms/AmbassadorForm";
import ProfessionalSellerForm from "./forms/ProfessionalSellerForm";

const ROLE_META: Record<
  string,
  { title: string; subtitle: string }
> = {
  [UserRole.CHARITABLE_ORGANIZATION]: {
    title: "Finish Charitable Organization Registration",
    subtitle:
      "Provide your charity's registration and authorized representative details to complete your account setup.",
  },
  [UserRole.CHARITY_SHOP]: {
    title: "Finish Charity Shop Registration",
    subtitle:
      "Provide your charity shop and operator details along with supporting verification documents.",
  },
  [UserRole.ECO_FRIENDLY_STORE]: {
    title: "Finish Eco-Friendly Store Registration",
    subtitle:
      "Tell us about your store's sustainability practices and upload your certification documents.",
  },
  [UserRole.CELEBRITY]: {
    title: "Finish Celebrity Account Registration",
    subtitle:
      "Provide your public profile details and identity verification documents to verify your account.",
  },
  [UserRole.AMBASSADOR]: {
    title: "Become a Fashi-ON Ambassador",
    subtitle:
      "Join our ambassador community and help promote pre-loved fashion.",
  },
  [UserRole.PROFESSIONAL_SELLER]: {
    title: "Finish Professional Seller Registration",
    subtitle:
      "Provide your business registration and tax details to complete your professional seller account.",
  },
};

const resolveRoleValue = (raw?: string | null): UserRole | null => {
  if (!raw) return null;
  if (Object.values(UserRole).includes(raw as UserRole)) {
    return raw as UserRole;
  }
  if (roleOptions[raw]) {
    return roleOptions[raw];
  }
  return null;
};

export default function AuthFinishContainer({ role }: { role: UserRole }) {
  const router = useRouter();

  const [isInitializing, setIsInitializing] = useState(true);
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    message?: string;
  }>({
    open: false,
    message: "",
  });

  useEffect(() => {
    const storedRole = sessionStorage.getItem("signupRole");

    const finalRole = role;

    if (storedRole && role !== storedRole) {
      router.replace("/sign-up");
      return;
    }

    if (finalRole === UserRole.INDIVIDUAL_USER) {
      router.replace("/sign-in");
      return;
    }

    setIsInitializing(false);
  }, [router]);

  const handleSuccess = (message?: string) => {
    sessionStorage.removeItem("signUpToken");
    sessionStorage.removeItem("signupRole");
    setReviewModal({
      open: true,
      message,
    });
  };

  const handleModalOpenChange = (open: boolean) => {
    setReviewModal((prev) => ({ ...prev, open }));
    if (!open) {
      router.replace("/sign-in");
    }
  };

  const renderRoleForm = () => {
    switch (role) {
      case UserRole.CHARITABLE_ORGANIZATION:
        return <CharitableOrganizationForm onSuccess={handleSuccess} />;
      case UserRole.CHARITY_SHOP:
        return <CharityShopForm onSuccess={handleSuccess} />;
      case UserRole.ECO_FRIENDLY_STORE:
        return <EcoFriendlyStoreForm onSuccess={handleSuccess} />;
      case UserRole.CELEBRITY:
        return <CelebrityForm onSuccess={handleSuccess} />;
      case UserRole.AMBASSADOR:
        return <AmbassadorForm onSuccess={handleSuccess} />;
      case UserRole.PROFESSIONAL_SELLER:
        return <ProfessionalSellerForm onSuccess={handleSuccess} />;
      default:
        return null;
    }
  };

  if (isInitializing) {
    return null;
  }

  const meta = (role && ROLE_META[role]) || {
    title: "Complete Your Registration",
    subtitle:
      "Please provide your verification details and supporting documents to finish setting up your account.",
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto shadow-none border-none py-0">
        <CardContent className="space-y-6">
          <div className="my-4 md:my-5 lg:my-6 space-y-2 border-b border-gray-200 pb-4">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
              {meta.title}
            </h3>
            <p className="text-secondary-gray text-sm lg:text-base text-center max-w-xl mx-auto">
              {meta.subtitle}
            </p>
          </div>

          {role ? (
            renderRoleForm()
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-gray-600">
                Verification session not found or expired. Please sign up or verify your account again.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AccountStatusModal
        open={reviewModal.open}
        onOpenChange={handleModalOpenChange}
        status="pending"
        message={reviewModal.message}
      />
    </>
  );
}

