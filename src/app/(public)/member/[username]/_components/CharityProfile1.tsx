"use client"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { IBadge, IUser } from '@/types'
import { notFound } from 'next/navigation'
import { Rating } from "@/components/ui/rating";
import moment from 'moment'
import { userRoleMapper } from '@/utils/userRoleMapper'
import Link from 'next/link';
import FolowUnFolow from '@/app/(public)/member/[username]/_components/FolowUnFolow';
import { Button } from '@/components/ui/button';
import FolowerFolowing from '@/app/(public)/member/[username]/_components/FolowerFolowing';
import { BadgeCheck, Check, FileText, Heart, ImagePlus, Link as LLink } from 'lucide-react';
import { countries } from '@/utils/constant';
import fb from "@/assets/icons/facebook.png"
import wb from "@/assets/icons/web-logo.png"
import insta from "@/assets/icons/instagram.png"
import tw from "@/assets/icons/twitter.png"
import Image from 'next/image';
import { useCurrency } from '@/hooks/useCurrency';
import Flag from '@/components/shared/Flag';
import { CharityDonationFormDialog } from '@/components/shared/Modal/Charity/CharityDonationFormDialog';
import { defaultImg } from '@/utils/defaultImg';
import { DonationFromProfile } from './DonationFromProfile';

type User = {
    data:
    {
        user: IUser,
        review: { _avg: { rating: number }, _count: { id: number } },
        isfolowing: boolean,
        totalDonation: number,
        isCurrentUser: boolean,
        totalSells: number,
        totalRaisedDonation: number,
        badges: {
            id: string,
            badge: IBadge,
        }[],
        countryAvaialblity: { name: string, code: string } | null
    }
}

function CharityProfile1({ user }: { user: User }) {

    const { format, symbol } = useCurrency();

    const userData = user?.data?.user;

    if (!userData) {
        return notFound()
    }

    const isEmailVerified = userData?.auth?.isverified;
    const isphoneVerified = userData?.auth?.isPhoneVerified;

    const country = countries.find((country) => country.code === userData?.country);

    const socialLinks = [
        { name: 'Facebook', url: userData?.facebook, icon: fb },
        { name: 'Instagram', url: userData?.instagram, icon: insta },
        { name: 'Twitter', url: userData?.twitter, icon: tw },
        { name: 'Website', url: userData?.website, icon: wb },
    ].filter((link) => link.url);

    const emptySocialLinks = socialLinks.length === 0;

    return (
        <div>
            {/* Profile Header Section */}
            <div className='flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-5 pt-5'>

                <div className='flex flex-col md:flex-row md:items-center gap-y-5 gap-x-0 md:gap-x-16 lg:gap-x-20'>

                    <div className="flex flex-row items-start gap-3 md:gap-5 shrink-0">

                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <Avatar className="h-24 md:h-28 w-24 md:w-28 shadow-sm">
                                <AvatarImage src={userData?.picture?.url} className='bg-card object-cover ring-4 ring-card shadow' />
                                <AvatarFallback className='text-3xl capitalize font-medium'>{userData?.userName.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                        </div>


                        {/* Profile Info */}
                        <div className="text-left w-auto shrink-0">

                            <div className='flex flex-row gap-x-1 items-center'>
                                <h2 className=" text-xl tracking-tight md:text-xl lg:text-2xl font-semibold">
                                    {user?.data?.user?.fname} {user?.data?.user?.lname}
                                </h2>
                                <BadgeCheck fill='green' className='text-white' size={28} />
                            </div>

                            <div className='flex flex-row items-center gap-3 mt-1'>
                                <p className='text-base'>@{userData?.userName}</p>
                                <span className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase text-white" style={{ backgroundColor: userRoleMapper(user?.data?.user?.auth?.role)?.color }}>
                                    {/* <Sparkles className="h-3 w-3 text-primary" />  */}
                                    {userRoleMapper(user?.data?.user?.auth?.role)?.label}
                                </span>
                            </div>

                            {country?.code && <div className='flex items-center gap-2 my-0.5 whitespace-nowrap'>
                                <Flag code={country?.code} name={userData?.country} />
                                <p className='text-sm font-medium'>{country?.name}</p>
                            </div>}

                            <div className='flex flex-row gap-x-3 items-center my-0.5'>
                                {isEmailVerified && (
                                    <span className="inline-flex items-center gap-1 text-sm font-medium ">
                                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-700 text-white">
                                            <Check size={11} strokeWidth={3} />
                                        </span>
                                        Email Verified
                                    </span>
                                )}

                                {isphoneVerified && (
                                    <span className="inline-flex items-center gap-1 text-sm font-medium ">
                                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-700 text-white">
                                            <Check size={11} strokeWidth={3} />
                                        </span>
                                        Phone Verified
                                    </span>
                                )}
                            </div>

                            {/* //social links */}
                            <div className="flex flex-wrap gap-2 mt-1">
                                {socialLinks.map((link) => (
                                    <Link key={link.name} href={link?.url || ""} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
                                        <Image src={link.icon} alt={link.name} className="h-5 w-5" />
                                    </Link>
                                ))}
                            </div>

                        </div>

                    </div>

                    <div className='flex flex-row flex-wrap lg:flex-nowrap items-center gap-8 lg:gap-10'>

                        <div className=''>
                            <FolowerFolowing type='following' folowerCount={userData?._count?.followers || 0} folowingCount={userData?._count?.following || 0} actionBtn={<div className=''>
                                <p className='font-semibold'>{userData?._count?.following || 0}</p>
                                <p className='text-gray-700'>Following</p>
                            </div>} userName={userData?.userName} />
                        </div>


                        <div className='border-x border-gray-200 px-8 lg:px-10'>
                            <FolowerFolowing type='followers' folowerCount={userData?._count?.followers || 0} folowingCount={userData?._count?.following || 0} actionBtn={<div className=''>
                                <p className='font-semibold'>{userData?._count?.followers || 0}</p>
                                <p className='text-gray-700'>Followers</p>
                            </div>} userName={userData?.userName} />
                        </div>

                        <div className=''>
                            <p className='font-semibold'>{format(user?.data?.totalRaisedDonation || 0, { decimals: 1 })}</p>
                            <p className='text-gray-700'>Raised</p>
                        </div>

                    </div>
                </div>

                {!user?.data?.isCurrentUser && <div className="w-full flex flex-col justify-start lg:justify-end items-start lg:items-end gap-y-3">
                    <FolowUnFolow isFolow={user?.data?.isfolowing} memberId={userData?.id} />
                    <div className='lg:w-auto w-full'>
                        <DonationFromProfile charity={user?.data?.user}>
                            <Button className=" text-white font-semibold px-6 cursor-pointer rounded-none w-full md:w-1/2 lg:w-36 bg-green-800 hover:bg-green-700 duration-200 transition-colors flex flex-row gap-x-1.5 items-center justify-center">
                                <Heart size={20} />
                                Donate Now
                            </Button>
                        </DonationFromProfile>
                    </div>
                </div>}
            </div>

            {/* Badges Section */}
            {
                user?.data?.badges?.length > 0 && <div className="mt-4 md:mt-5 lg:mt-6 flex flex-row flex-wrap items-center gap-2">

                    {user?.data?.badges?.map((badgeItem) => (
                        <div key={badgeItem?.id} className="flex flex-row items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100">
                            <div
                                className="h-4.5 w-4.5 bg-green-800"
                                style={{
                                    maskImage: `url(${badgeItem?.badge?.icon})`,
                                    WebkitMaskImage: `url(${badgeItem?.badge?.icon})`,
                                    maskRepeat: "no-repeat",
                                    WebkitMaskRepeat: "no-repeat",
                                    maskPosition: "center",
                                    WebkitMaskPosition: "center",
                                    maskSize: "contain",
                                    WebkitMaskSize: "contain",
                                }}
                            />
                            <span className="text-sm text-green-800">{badgeItem?.badge?.name}</span>
                        </div>
                    ))}

                </div>
            }

            {/* Bio Section */}
            {
                userData?.bio && <div className="mt-5 md:mt-8 lg:mt-10">
                    <pre className="text-foreground leading-relaxed md:text-lg max-w-xl whitespace-pre-wrap break-words font-figtree">
                        {userData?.bio}
                    </pre>
                </div>
            }

            {/* tab */}
            <div className='flex flex-row items-center border-b w-full border-b-gray-200 mt-5 lg:mt-8'>
                <button
                    className={`hover:bg-gray-50 duration-200 rounded-none text-sm lg:text-base px-3 lg:px-3.5 py-3 font-medium cursor-pointer border-b-2 border-black`}>
                    About
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mt-4'>

                <div className=' col-span-1 md:col-span-2 space-y-5 md:space-y-8'>
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                            About us
                        </h2>
                        {!user?.data?.user?.description ? <EmptyAbout /> : <div className="space-y-6 text-base leading-relaxed text-text-main/80">
                            {/* <p>
                                {user?.data?.user?.description}
                            </p> */}
                            <pre className="text-foreground leading-relaxed max-w-xl whitespace-pre-wrap break-words font-figtree">
                                {user?.data?.user?.description}
                            </pre>
                        </div>}

                    </section>

                    <section className='mt-4 border-t border-gray-200 pt-4'>
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                            Links & contact
                        </h2>

                        {/* //social links */}
                        {emptySocialLinks ? <EmptyLink /> : <div className="mt-1 space-y-3">
                            {socialLinks.map((link) => (
                                <Link key={link.name} href={link?.url || ""} target="_blank" rel="noopener noreferrer" className="flex gap-1 text-sm font-medium gap-x-2 items-center text-gray-700 hover:text-gray-900 duration-150">
                                    <Image src={link.icon} alt={link.name} className="h-5 w-5" />
                                    <p>{link.url}</p>
                                </Link>
                            ))}
                        </div>}

                    </section>
                </div>

                <div className='col-span-1'>

                    {!user?.data?.isCurrentUser && <div className="rounded-xl bg-[#0f172a] text-white p-5 shadow-sm">
                        <div className="text-[10px] uppercase tracking-wider text-[#64748b] mb-1 font-semibold">Ready to give?</div>
                        <div className="text-lg font-bold mb-1 leading-tight" style={{ textWrap: "pretty" }}>100% goes to this charity</div>
                        <p className="text-[12.5px] text-white mb-4 leading-relaxed">FASHION doesn't take a cut. Donate directly from this page.</p>

                        <DonationFromProfile charity={user?.data?.user}>
                            <button className="text-center w-full bg-[#f59e0b] hover:bg-[#d97706] text-[#0f172a] font-bold py-2.5 rounded-lg text-sm cursor-pointer flex justify-center items-center gap-1.5">
                                <Heart size={20} />
                                Make your donation
                            </button>
                        </DonationFromProfile>
                    </div>}

                    <div className='mt-3'>
                        {user?.data?.user?.charityGalleries.length > 0 ? <section className='mt-3'>
                            <h2 className="text-lg font-semibold text-foreground">Gallery</h2>
                            <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3">
                                {user?.data?.user?.charityGalleries?.map((image) => (
                                    <Image
                                        src={image.url || defaultImg?.placeholderImg}
                                        key={image?.id}
                                        alt={image?.caption || `Gallery Image`}
                                        placeholder='blur'
                                        blurDataURL={defaultImg?.placeholderImg}
                                        width={1024}
                                        height={768}
                                        className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ))}
                            </div>
                        </section> : <EmptyGallery />}
                    </div>

                </div>

            </div>

        </div>
    )
}

export default CharityProfile1;

const EmptyAbout = () => {
    return <div className='flex flex-row gap-x-2 items-center mt-2'>
        <div className='size-10 rounded-full p-1.5 bg-gray-100 flex-center'>
            <FileText className='text-gray-600' size={20} />
        </div>
        <div>
            <p className='text-sm text-gray-500'>No information added yet</p>
            <p className='text-sm text-gray-500'>Charity information will be displayed here.</p>
        </div>
    </div>
}
const EmptyLink = () => {
    return <div className='flex flex-row gap-x-2 items-center mt-2'>
        <div className='size-10 rounded-full p-1.5 bg-gray-100 flex-center'>
            <LLink className='text-gray-600' size={20} />
        </div>
        <div>
            <p className='text-sm text-gray-500'>No links added yet</p>
            <p className='text-sm text-gray-500'>Charity social media links will be displayed here.</p>
        </div>
    </div>
}

const EmptyGallery = () => {
    return <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className='bg-gray-200 size-28 rounded-md flex-center p-2'>
            <ImagePlus size={30} className='text-gray-600' />
        </div>
        <div className='bg-gray-200 size-28 rounded-md flex-center p-2'>
            <ImagePlus size={30} className='text-gray-600' />
        </div>
        <div className='bg-gray-200 size-28 rounded-md flex-center p-2'>
            <ImagePlus size={30} className='text-gray-600' />
        </div>
    </div>
}
