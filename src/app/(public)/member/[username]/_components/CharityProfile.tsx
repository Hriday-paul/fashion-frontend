import { CharityDonationFormDialog } from '@/components/shared/Modal/Charity/CharityDonationFormDialog';
import { GetCharityAbout } from '@/lib/services/UserDetails'
import { IUser } from '@/types';
import { defaultImg } from '@/utils/defaultImg';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import CharityGallery from './CharityGallery';
import ExpandableText from '@/components/shared/ExpandableText';

function CharityProfile({ userName }: { userName: string }) {

    const user = GetCharityAbout({ userName: userName });

    return (
        <div className='mt-7 md:mt-8 lg:mt-10'>
            <Suspense fallback={<div className="flex-center h-28 lg:h-40">
                <span className="loaderDark !w-10"> </span>
            </div>}>
                <div className="grid grid-cols-1 gap-8 md:gap-12 lg:gap-16 lg:grid-cols-12">
                    <CharityDetails userPromise={user} />
                </div>
            </Suspense>
        </div>
    )
}

export default CharityProfile;

const CharityDetails = async ({ userPromise }: { userPromise: Promise<{ data: IUser }> }) => {

    const user = await userPromise;

    if (!user?.data) {
        return notFound()
    }

    return (
        <>
            {/* Left: About & Bio */}
            <div className="lg:col-span-7 sapce-y-5 lg:space-y-8">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        About us
                    </h2>
                    <div className="space-y-6 text-base leading-relaxed text-text-main/80">
                        <ExpandableText
                            text={user?.data?.description}
                            lines={4}
                            className="text-foreground leading-relaxed max-w-xl"
                        />
                    </div>
                </section>

                {/* Gallery */}
                {user?.data?.charityGalleries.length > 0 && <section>
                    <h2 className="text-xl font-semibold text-foreground">Gallery</h2>
                    <p className="mt-1 text-sm text-gray-700">
                        Moments from our recent programmes on the ground.
                    </p>
                    <CharityGallery images={user?.data?.charityGalleries} />
                </section>}
            </div>

            {/* Right: Links & Contact */}
            <aside className="lg:col-span-4 lg:col-start-9">
                <div className="space-y-8 md:space-y-10 lg:space-y-12 border-t border-gray-200 pt-5 md:pt-8">

                    <div className="rounded-2xl bg-[#0f172a] text-white p-5">
                        <p className="text-[10px] uppercase tracking-wider text-gray-300 mb-1 font-semibold">Ready to give?</p>
                        <p className="text-lg font-bold mb-1 leading-tight" style={{ textWrap: "pretty" }}>100% goes to this charity</p>
                        <p className="text-[12.5px] text-white mb-4 leading-relaxed">FASHION doesn't take a cut. Donate directly from this page.</p>

                        <CharityDonationFormDialog>
                            <button className="block text-center w-full bg-[#f59e0b] hover:bg-[#d97706] text-[#0f172a] font-bold py-2.5 rounded-xl text-sm cursor-pointer">
                                Make your donation
                            </button>
                        </CharityDonationFormDialog>
                    </div>

                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4">
                            Connect
                        </h2>
                        <ul className="space-y-4">
                            {user?.data?.website && <li>
                                <Link
                                    href={user?.data?.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between text-base font-medium hover:text-brand transition-colors"
                                >
                                    <span>Website</span>
                                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        → {user?.data?.website}
                                    </span>
                                </Link>
                            </li>}
                            {user?.data?.facebook && <li>
                                <Link
                                    href={user?.data?.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between text-base font-medium hover:text-brand transition-colors"
                                >
                                    <span>Facebook</span>
                                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        → {user?.data?.facebook}
                                    </span>
                                </Link>
                            </li>}
                            {user?.data?.instagram && <li>
                                <Link
                                    href={user?.data?.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between text-base font-medium hover:text-brand transition-colors"
                                >
                                    <span>Instagram</span>
                                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        → {user?.data?.instagram}
                                    </span>
                                </Link>
                            </li>}
                            {user?.data?.twitter && <li>
                                <Link
                                    href={user?.data?.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between text-lg font-medium hover:text-brand transition-colors"
                                >
                                    <span>Twitter</span>
                                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        → {user?.data?.twitter}
                                    </span>
                                </Link>
                            </li>}
                        </ul>
                    </div>

                    {user?.data?.support_email && <div>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4">
                            Inquiries
                        </h2>
                        <Link
                            href={`mailto:${user?.data?.support_email}`}
                            className="text-lg font-medium border-b border-black/10 pb-1 hover:border-brand transition-colors"
                        >
                            {user?.data?.support_email}
                        </Link>
                    </div>}

                </div>
            </aside>
        </>
    )

}