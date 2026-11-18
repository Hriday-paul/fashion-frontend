"use client";
import { ArrowDown, ArrowUp, Dot } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const keyFeatures = [
  "Material: Made with a high-quality cotton blend, this sweatshirt provides a perfect balance of softness and breathability. It’s durable yet comfortable, ensuring you stay cozy all day.",
  "Unique Design: The ruffled heart detail on the chest gives this sweatshirt a modern and fun twist. It’s perfect for those who want to add a bit of whimsy to their everyday wardrobe without compromising on comfort.",
  "Fit: Designed in a relaxed fit with long sleeves and a crew neckline, it offers a flattering and easy-going silhouette. Whether you're layering it over a tee or wearing it on its own, this sweatshirt gives you room to move while still looking great.",
  "Versatile Style: Available in a dark grey shade, this piece can easily be paired with jeans, leggings, or skirts for a casual, laid-back look. Dress it up with your favorite accessories or keep it casual for a day out with friends.",
];

const careInstructions = [
  "Machine wash cold to maintain fabric quality.",
  "Tumble dry low or hang to dry to preserve the shape and ruffle details.",
  "Do not bleach to maintain the color integrity.",
];

const shippingMethods = [
  "Shipping Cost: 5-7 business days, starting at £15.",
  "Free Shipping: More than one orders over £50 within the US.",
];

const returns = [
  "Contact support@fashi-on.com to initiate the return.",
  "Provide your order number and reason for return.",
  "We will send you a prepaid return shipping label.",
  "Pack your item securely and send it back to us.",
  "Once we receive the item, we’ll process a refund to your original payment method.",
];

const refundsShippingCosts = [
  "Refunds will be issued to the original payment method within 5-7 business days after we receive the returned item.",
  "You are responsible for the cost of return shipping, unless the item is defective or incorrect.",
];

const deliveryPolicies = [
  "Please ensure that your delivery address is correct and complete at the time of checkout. FASHI-ON is not responsible for lost or delayed shipments due to incorrect or incomplete addresses.",
  "If you need to update your address after placing the order, please contact customer support as soon as possible, and we will do our best to accommodate the change before shipping.",
];

const containerVariants = {
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: "0.75rem",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
  hidden: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      when: "afterChildren",
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
};

const ProductDescription = () => {
  const [showDescription, setShowDescription] = useState(true);
  const [showShipping, setShowShipping] = useState(true);
  const [showDeliveryPolicy, setShowDeliveryPolicy] = useState(true);

  return (
    <div className="lg:space-y-8 space-y-5">
      {/* =================== description ================================== */}
      <div>
        <div className="flex-between border-b lg:mb-6 mb-4">
          <h4 className="lg:text-2xl text-lg font-medium">Description</h4>
          <button
            onClick={() => {
              setShowDescription(!showDescription);
            }}
            className=" hover:text-primary-blue transition-all duration-300 cursor-pointer  w-8 h-fit flex justify-center items-center "
          >
            {showDescription ? <ArrowUp /> : <ArrowDown />}
          </button>
        </div>
        {/* description */}
        <motion.div
          initial={showDescription ? "visible" : "hidden"}
          animate={showDescription ? "visible" : "hidden"}
          exit="hidden"
          variants={containerVariants as any}
          className={cn(
            "text-primary-gray overflow-hidden"
            // showDescription ? "h-max" : "h-0"
          )}
        >
          <p>
            The Heart Ruffled Sweatshirt is a perfect blend of comfort, style,
            and personality. Crafted from a soft cotton blend, this cozy
            sweatshirt is designed to keep you feeling warm and stylish, whether
            you're lounging at home or out and about. The standout feature of
            this sweatshirt is the playful ruffled heart design on the front,
            which adds a charming and feminine touch to an otherwise classic
            wardrobe staple.
          </p>
          <h5>Key Features:</h5>
          <div>
            {keyFeatures.map((feature, index) => (
              <p key={index} className="flex gap-x-1">
                <Dot></Dot> <span> {feature}</span>
              </p>
            ))}
          </div>
          <h4>Care Instructions:</h4>
          <div>
            {careInstructions.map((instruction, index) => (
              <p key={index} className="flex gap-x-1">
                <Dot></Dot> <span> {instruction}</span>
              </p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* =================== Shipping and Returns ================================== */}
      <div>
        <div className="flex-between border-b lg:mb-6 mb-4 ">
          <h4 className="lg:text-2xl text-lg font-medium">
            Shipping and Returns
          </h4>
          <button
            onClick={() => {
              setShowShipping(!showShipping);
            }}
            className="hover:text-primary-blue transition-all duration-300 cursor-pointer  w-8 h-fit flex justify-center items-center"
          >
            {showShipping ? <ArrowUp /> : <ArrowDown />}
          </button>
        </div>
        {/* description */}
        <motion.div
          initial={showShipping ? "visible" : "hidden"}
          animate={showShipping ? "visible" : "hidden"}
          exit="hidden"
          variants={containerVariants as any}
          className="text-primary-gray overflow-hidden"
        >
          <p>
            All orders are processed within 5 - 7 business days. We partner with
            trusted carriers including USPS, FedEx, and UPS to ensure your order
            is handled with care and delivered on time..
          </p>
          <h5>Shipping Methods & Costs:</h5>
          <div>
            {shippingMethods.map((method, index) => (
              <p key={index} className="flex gap-x-1">
                <Dot></Dot> <span> {method}</span>
              </p>
            ))}
          </div>
          <p className="mb-2">
            International Shipping: We currently ship to Canada, UK, and select
            European countries. Shipping fees will be calculated at checkout.
            Track Your Order: Once shipped, a tracking number will be emailed to
            you for tracking your order.
          </p>
          <hr />

          {/* ================================ return =============================== */}
          <div className="md:mt-4 mt-3">
            <h5 className="text-primary-light-blue">Returns:</h5>
            <p>
              We accept returns within 30 days of purchase. To return an item:
            </p>
            <div className="mb-2">
              {returns.map((returnItem, index) => (
                <p key={index}>
                  {index + 1}. <span className="ml-1"> {returnItem}</span>
                </p>
              ))}
            </div>
            <hr />
          </div>

          {/* ================================ return =============================== */}
          <div className="md:mt-4 mt-3">
            <h5 className="text-primary-light-blue">
              Refunds & Shipping Costs:
            </h5>

            <div>
              {refundsShippingCosts.map((refundsShippingCost, index) => (
                <p key={index}>
                  {index + 1}.{" "}
                  <span className="ml-1">{refundsShippingCost}</span>
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* =================== Delivery Policy ================================== */}
      <div>
        <div className="flex-between border-b lg:mb-6 mb-4 ">
          <h4 className="lg:text-2xl text-lg font-medium">Delivery Policy</h4>
          <button
            onClick={() => {
              setShowDeliveryPolicy(!showDeliveryPolicy);
            }}
            className="hover:text-primary-blue transition-all duration-300 cursor-pointer  w-8 h-fit flex justify-center items-center"
          >
            {showDeliveryPolicy ? <ArrowUp /> : <ArrowDown />}
          </button>
        </div>
        {/* description */}
        <motion.div
          initial={showDeliveryPolicy ? "visible" : "hidden"}
          animate={showDeliveryPolicy ? "visible" : "hidden"}
          exit="hidden"
          variants={containerVariants as any}
          className="text-primary-gray overflow-hidden"
        >
          <p>
            Orders are processed within 1-2 business days and delivered within
            5-7 business days via shipping.
          </p>
          <h5> Delivery Address:</h5>
          <div>
            {deliveryPolicies.map((deliveryPolicy, index) => (
              <p key={index} className="flex gap-x-1">
                <Dot></Dot> <span> {deliveryPolicy}</span>
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDescription;
