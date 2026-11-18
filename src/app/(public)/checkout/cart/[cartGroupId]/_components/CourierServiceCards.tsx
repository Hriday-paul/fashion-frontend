"use client"
import FormatCurrency from "@/components/shared/FormatCurrency";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { addShipmentToCart } from "@/redux/features/cart.slice";
import { RootState } from "@/redux/store";
import { ICourierServiceRates } from "@/types";
import { Truck } from "lucide-react";
import Image from 'next/image';
import React from 'react'
import { useDispatch, useSelector } from "react-redux";

function CourierServiceCards({ rates, cartGroupId }: { rates: ICourierServiceRates[]; cartGroupId: string }) {

  const carts = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const selectedcartShipment = carts?.carts?.find((cart) => cart?.cartGroupId === cartGroupId)?.shipment;

  // handle empty state
  if (!rates || rates.length === 0) {
    return <EmptyCourierServices />
  }

  return (
    <RadioGroup defaultValue={selectedcartShipment?.serviceId || ""} className="grid grid-cols-2 gap-3">
      {rates?.map((rate) => (
        <Label key={rate?.courier_service?.id} onClick={() => {
          dispatch(addShipmentToCart({
            cartGroupId, shipment: {
              serviceId: rate?.courier_service?.id,
              shipment_charge_total: rate?.total_charge,
            }
          }))
        }} htmlFor={rate?.courier_service?.id} className="border border-gray-300 rounded p-5 flex flex-col items-start cursor-pointer hover:bg-zinc-50 has-[[data-state=checked]]:border-primary">
          <div className="flex justify-between items-center gap-3 w-full">
            <Image src={rate?.courier_service?.logo} alt={rate?.courier_service?.name} width={100} height={100} className='h-8 w-auto object-cover' />
            <RadioGroupItem value={rate?.courier_service?.id} id={rate?.courier_service?.id} />
          </div>
          <p className="text-lg font-bold text-primary-black"><FormatCurrency fixed estimate amount={rate?.total_charge} decimals={2} /></p>
          <p className="text-primary-black">{rate?.courier_service?.name}</p>
          <p className="text-sm text-gray-600">
            Delivery within {rate?.min_delivery_time} - {rate?.max_delivery_time} days
          </p>
        </Label>
      ))}
    </RadioGroup>
  )
}

export default CourierServiceCards;

export const EmptyCourierServices = () => {
  return <div
    className={`flex flex-col items-center px-5 py-8 text-center`}
  >
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
      <Truck className="text-slate-800" size={28} strokeWidth={2} />
    </div>

    <p className="mt-4 text-lg font-semibold text-black">No courier services available</p>
    <p className="mt-1 max-w-sm text-sm leading-snug text-gray-600">
      We couldn’t find a courier that delivers to this address. Try a different address or check back later.
    </p>
  </div>
}