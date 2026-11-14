import { HeartHandshake, Pencil, Shirt, Store } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function CharityOverviewDonationMoney() {
    return (
        <section className="rounded-xl bg-[#0f172a] text-white p-5 shadow-sm">
            <div className="text-[10px] uppercase tracking-wider text-gray-300 mb-1.5 font-semibold">Charity Store</div>
            <div className='flex flex-row gap-x-2 items-start'>

                <div className='bg-zinc-200/10 p-2.5 rounded-md'>
                    <Store size={40} />
                </div>

                <div>
                    <div className="text-lg font-bold mb-0.5 leading-tight" style={{ textWrap: "pretty" }}>Your Store Dashboard</div>
                    <p className="text-[12.5px] text-gray-200 mb-4 leading-relaxed">Manage your profile, store, listings and keep your charity details up to date.</p>
                </div>
            </div>

            <Link href={`/profile/edit`}>
                <button className="text-center w-full bg-[#f59e0b] hover:bg-[#d97706] text-[#0f172a] font-bold py-2.5 rounded-lg text-sm cursor-pointer flex justify-center items-center gap-1.5">
                    <Pencil size={20} />
                    Edit Profile
                </button>
            </Link>
        </section>
    )
}

export default CharityOverviewDonationMoney;


export function CharityOverviewClothDonation() {
    return (
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-bold uppercase tracking-widest text-black">
                Clothing Donations
            </p>

            <div className="mt-2 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-200">
                    <Shirt className="h-7 w-7 text-slate-800" strokeWidth={2} />
                </div>

                <div className="flex-1">
                    <p className="text-sm leading-snug text-indigo-800">
                        You will receive clothing donatins that you need to accept.
                    </p>
                    <Link href={`/profile/donation/cloth`}>
                        <button
                            type="button"
                            className="mt-2 w-full rounded-md border border-black bg-white px-4 py-1.5 text-sm text-black transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 font-semibold cursor-pointer"
                        >
                            Manage Donations
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export function CharityOrgOverviewDonationMoney() {
    return (
        <section className="rounded-xl bg-[#0f172a] text-white p-5 shadow-sm">
            <div className="text-[10px] uppercase tracking-wider text-gray-300 mb-1.5 font-semibold">Charity Store</div>
            <div className='flex flex-row gap-x-2 items-start'>

                <div className='bg-zinc-200/10 p-2.5 rounded-md'>
                    <HeartHandshake size={40} />
                </div>

                <div>
                    <div className="text-lg font-bold mb-0.5 leading-tight" style={{ textWrap: "pretty" }}>Your Charity Dashboard</div>
                    <p className="text-[12.5px] text-gray-200 mb-4 leading-relaxed">Manage your profile, charity details, donation settings and keep your information up to date.</p>
                </div>
            </div>

            <Link href={`/profile/edit`}>
                <button className="text-center w-full bg-[#f59e0b] hover:bg-[#d97706] text-[#0f172a] font-bold py-2.5 rounded-lg text-sm cursor-pointer flex justify-center items-center gap-1.5">
                    <Pencil size={20} />
                    Edit Profile
                </button>
            </Link>
        </section>
    )
}

