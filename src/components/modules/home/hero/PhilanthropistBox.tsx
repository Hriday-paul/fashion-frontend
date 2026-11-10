"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextAnimation } from "@/animations/TextAnimation";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PhilanthropistBox({
  className,
  btnClassName,
}: {
  className?: string;
  btnClassName?: string;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-gradient-warm shadow-strong  mx-auto py-0 bg-black/30 border-none  space-y-0 rounded-sm md:min-h-36 text-white",
        className
      )}
    >
      <div>
        {/* Image Section */}
        {/* <div className="relative xl:h-44 h-48 overflow-hidden ">
          <Image
            src={fashionImage}
            alt="Fashion closet with colorful clothes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div> */}

        {/* Content Section */}
        <div className="px-4 pb-2 mt-2 flex flex-col md:block   items-center">
          {/* Heading */}
          {/* <h2 className=" lg:text-2xl  font-medium  text-white line-clamp-1">
            Become a fashion philanthropist!
          </h2> */}

          <TextAnimation
            text="Join the Fashion Philanthropist Community!"
            className=" lg:text-2xl md:text-xl text-lg  font-medium "
            initialDelay={0.5}
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{
              opacity: 1,
              transition: { duration: 0.5, delay: 2 },
            }}
            className="  leading-relaxed md:text-sm"
          >
            Earn more and help make a change with us
          </motion.p>

          {/* Call to Action Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{
              opacity: 1,
              transition: { duration: 0.5, delay: 2.5 },
            }}
            className="pt-2 flex justify-end"
          >
            <Link href="/sell" prefetch={false}>
              <Button
                variant={"outline"}
                size="sm"
                className={cn(
                  "bg-transparent border-white text-base  cursor-pointer",
                  btnClassName
                )}
              >
                Start selling
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </Card>
  );
}
