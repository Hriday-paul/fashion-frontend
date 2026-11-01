import { productFormSchema } from "./schema";
import { z } from "zod";

export const formattedData = (data: z.infer<typeof productFormSchema>) => {

  return {
    title: data?.title,
    description: data?.productDescription,
    price: Number(data?.price),
    discountPct: Number(data?.discountPct) || 0,
    currency: "USD",
    brandId: data?.brandId,
    sizeId: data?.sizeId,
    categoryId: data?.categoryId,
    condition: data?.condition,
    color: data?.color,
    tags: data?.tags,
    meterials: Array.isArray(data?.fabric) ? data.fabric : data?.fabric ? [data.fabric] : [],
    // care_instructions: data?.careInstructions,
    allow_offer: Boolean(data?.allowOffers),
    return_window: Number(data?.returnsPolicy),
    charities: data?.charities,
    weight_kg: Number(data?.weight_kg),
    length_cm: Number(data?.length_cm),
    width_cm: Number(data?.width_cm),
    hight_cm: Number(data?.hight_cm),
    donationPrivacy: data?.donationPrivacy,
    donation_percent: Number(data?.donation_percent) || 0,
  };
};
