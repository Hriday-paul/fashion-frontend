import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string({ required_error: "Product title required." }).min(1, {
    message: "Product title required.",
  }),
  price: z.string({ required_error: "Price is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid positive number.",
  }),
  discountPct: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0 && num <= 100;
    },
    {
      message: "Discount must be between 0 and 100.",
    },
  ),
  // itemNumber: z.string().min(1, {
  //   message: "Item number is required.",
  // }),
  categoryId: z.string().min(1, {
    message: "Please select a category.",
  }),
  tags: z.array(z.string()).min(1, {
    message: "Please select at least one tag.",
  }),
  condition: z.string().min(1, {
    message: "Please select a condition.",
  }),
  fabric: z.array(z.string()).min(1, {
    message: "Please select at least one material.",
  }),
  brandId: z.string({ required_error: "Please select a brand." }).min(1, {
    message: "Please select a brand.",
  }),
  sizeId: z
    .string({ required_error: "Please specify available sizes." })
    .min(1, {
      message: "Please specify available sizes.",
    }),
  color: z.string().min(1, {
    message: "Please select colors.",
  }),
  // careInstructions: z.array(z.string()).optional(),

  charities: z.array(z.string()).optional(),
  donation_percent: z.string().optional(),

  donationPrivacy: z.boolean().default(false),

  productDescription: z.string().min(1, {
    message: "Product description is required.",
  }),
  // shippingDelivery: z.string({ required_error: "Shipping & returns information is required." }).min(1, {
  //   message: "Shipping & returns information is required.",
  // }),
  returnsPolicy: z.string({ required_error: "Please select a return window." }).min(1, {
    message: "Please select a return window.",
  }),
  allowOffers: z.boolean().default(true),

  weight_kg: z.string({ required_error: "Weight is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Weight must be a valid positive number.",
  }),

  length_cm: z.string({ required_error: "Length is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Length must be a valid positive number.",
  }),

  width_cm: z.string({ required_error: "Width is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Width must be a valid positive number.",
  }),

  hight_cm: z.string({ required_error: "Height is required." }).refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Height must be a valid positive number.",
  }),

});


export const CharityFormSchema = z.object({
  charities: z
    .array(z.string().min(1, "Charity id cannot be empty"))
    .min(1, "Please select at least one charity"),

  donation_percent: z.string({ required_error: "Donation Percent is required." }).min(1, {
    message: "Donation Percent is required.",
  }),
})

export const buildProductSchema = (requiredDonation: boolean) =>
  productFormSchema.superRefine((data, ctx) => {
    const hasCharity = (data.charities?.length ?? 0) > 0;
    const hasPercent = !!data.donation_percent && Number(data.donation_percent) > 0;

    // Required mode: both always needed.
    // Optional mode: each one is needed only if the other is chosen.
    const donationActive = requiredDonation || hasCharity || hasPercent;
    if (!donationActive) return;

    if (!hasPercent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["donation_percent"],
        message: "Donation Percent is required.",
      });
    } else if (requiredDonation && Number(data.donation_percent) < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["donation_percent"],
        message: "Minimum 5% donation is required.",
      });
    }

    if (!hasCharity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["charities"],
        message: "Please select at least one charity.",
      });
    }
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const productFormDefaultValues: ProductFormValues = {
  title: "",
  price: "",
  discountPct: "0",
  // itemNumber: "",
  categoryId: "",
  tags: [],
  condition: "",
  fabric: [],
  brandId: "",
  sizeId: "",
  color: "",
  // careInstructions: [],
  donationPrivacy: true,
  productDescription: "",
  // deliveryPolicy: "",
  // shippingDelivery: "",
  charities: [],
  donation_percent: "",

  hight_cm: "",
  length_cm: "",
  width_cm: "",
  weight_kg: "",

  // durationTime: "",
  returnsPolicy: "7",
  // returnDescription: "",
  allowOffers: true,
};

// color data
export const colors = [
  { name: "Turquoise", hex: "#40E0D0" },
  { name: "Cream", hex: "#FFFDD0" },
  { name: "Apricot", hex: "#FBCEB1" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Rose", hex: "#FFB6C1" },
  { name: "Red", hex: "#FF0000" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Green", hex: "#008000" },
  { name: "Orange", hex: "#FFA500" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Lilac", hex: "#C8A2C8" },
  { name: "Light blue", hex: "#ADD8E6" },
  { name: "Navy", hex: "#000080" },
  { name: "Dark green", hex: "#006400" },
  { name: "Mustard", hex: "#FFDB58" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Multi", hex: "linear-gradient(90deg, #FF0000, #00FF00, #0000FF)" },
  { name: "Khaki", hex: "#C3B091" },
  { name: "Mint", hex: "#98FF98" },
  { name: "Clear", hex: "transparent" },
  { name: "Black", hex: "#000000" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Gray", hex: "#808080" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Purple", hex: "#800080" },
];

export const conditionOptions = [
  { value: "new-with-tags", label: "New with Tags", description: "Original packaging and tags are still attached." },
  { value: "new", label: "New", description: "Brand new, unused, and in perfect condition." },
  { value: "like-new", label: "Like New", description: "Gently used, well-maintained, and in excellent condition." },
  { value: "3-months-used", label: "3 Months Used", description: "Has been used for approximately 3 months." },
  { value: "6-months-used", label: "6 Months Used", description: "Has been used for approximately 6 months." },
  { value: "1-year-used", label: "1 Year Used", description: "Has been used for approximately 1 year." },
  { value: "well-used", label: "Well Used", description: "Has been used extensively but is still in good condition." },
];

export const shippingDelivery = [
  "UK Standard Shipping (3–5 working days)",
  "UK Express Shipping (1–2 working days)",
  "International Shipping (5–10 working days)",
];

export const returnsPolicy = [
  {
    label: "Returns accepted – 3 days",
    value: "3"
  },
  {
    label: "Returns accepted – 7 days",
    value: "7"
  },
  {
    label: "Returns accepted – 14 days",
    value: "14"
  },
];

export const careInstructionsOptions = [
  { id: "machine-wash-cold", label: "Machine wash cold" },
  { id: "hand-wash-only", label: "Hand wash only" },
  { id: "dry-clean-only", label: "Dry clean only" },
  { id: "tumble-dry-low", label: "Tumble dry low" },
  { id: "do-not-tumble-dry", label: "Do not tumble dry" },
  { id: "do-not-bleach", label: "Do not bleach" },
  { id: "iron-low-heat", label: "Iron low heat" },
  { id: "iron-medium-heat", label: "Iron medium heat" },
];
