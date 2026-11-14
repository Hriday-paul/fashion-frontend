"use client"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { IBadge, IUser } from '@/types'
import { notFound } from 'next/navigation'
import { Rating } from "@/components/ui/rating";
import moment from 'moment'
import { userRoleMapper } from '@/utils/userRoleMapper'
import ExpandableText from '../ExpandableText';
import Link from 'next/link';
import FolowUnFolow from '@/app/(public)/member/[username]/_components/FolowUnFolow';
import { Button } from '@/components/ui/button';
import FolowerFolowing from '@/app/(public)/member/[username]/_components/FolowerFolowing';
import { BadgeCheck, Check, Heart, Shirt } from 'lucide-react';
import { countries } from '@/utils/constant';
import Flag from '../Flag';
import CountrySellNotAvaialbleAlert from './CountrySellNotAvaialbleAlert';
import fb from "@/assets/icons/facebook.png"
import wb from "@/assets/icons/web-logo.png"
import insta from "@/assets/icons/instagram.png"
import tw from "@/assets/icons/twitter.png"
import Image from 'next/image';
import { useCurrency } from '@/hooks/useCurrency';
import { DonationFromProfile } from '@/app/(public)/member/[username]/_components/DonationFromProfile';
import DonationsRaisedDialog from '../Modal/Donation/DonationsRaisedDialog';
import userBannerPlaceholder from "@/assets/banner/user-placeholder.png";
import ClothesDonationDialog from '../Modal/clothesDonation/ClothesDonationDialog';

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


export default function SellerProfile({ user, isCharity, isCharityShop }: { user: User, isCharity: boolean, isCharityShop: boolean }) {

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

  const bannerSrc = (userData?.bannerUrl && userData.bannerUrl.trim()) ? userData.bannerUrl : userBannerPlaceholder;
  const isPlaceholder = bannerSrc === userBannerPlaceholder;

  return (
    <div className='pt-5'>

      {/* Profile Banner */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 lg:h-72 rounded-2xl overflow-hidden bg-muted mb-6">
        <Image
          src={bannerSrc}
          alt={`${userData?.userName || "User"} banner`}
          fill
          priority
          quality={100}
          unoptimized={isPlaceholder}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1400px"
          className="object-cover"
        />
      </div>

      {!isCharity ? <>
        {/* Profile Header Section */}
        <div className='flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-5'>

          <div className='flex flex-col md:flex-row md:items-center gap-y-5 gap-x-0 md:gap-x-6 lg:gap-x-6 xl:gap-x-12'>

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

                <span className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase text-white " style={{ backgroundColor: userRoleMapper(user?.data?.user?.auth?.role)?.color }}>
                  {/* <Sparkles className="h-3 w-3 text-primary" />  */}
                  {userRoleMapper(user?.data?.user?.auth?.role)?.label}
                </span>

                {!isCharityShop ? <h2 className="text-2xl md:text-3xl font-bold text-foreground my-0.5 block">
                  {userData?.userName}
                </h2>
                  :
                  <>
                    <div className='flex flex-row gap-x-1 items-center'>
                      <h2 className="tracking-tight text-2xl md:text-3xl font-semibold">
                        {user?.data?.user?.fname} {user?.data?.user?.lname}
                      </h2>
                      <BadgeCheck fill='green' className='text-white' size={28} />
                    </div>

                    <p className='text-base'>@{userData?.userName}</p>
                  </>}

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

                {/* Rating */}
                {user?.data?.review?._count?.id > 0 ? <div className="flex items-center gap-2 mb-1 whitespace-nowrap">
                  <div className="flex gap-1">
                    <Rating rating={user?.data?.review?._avg?.rating} size={12}></Rating>
                  </div>
                  <span className="text-sm text-gray-600">{user?.data?.review?._count?.id} reviews</span>
                </div> : <p className='mb-1 text-gray-700 text-sm whitespace-nowrap'>No Reviews Yet</p>}

                <p className='text-sm whitespace-nowrap'>Joined {moment(userData?.createdAt).format('MMMM YYYY')}</p>

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

            <div className='flex flex-row flex-wrap items-center gap-4 sm:gap-6 xl:gap-8'>

              <div className=''>
                <FolowerFolowing type='following' folowerCount={userData?._count?.followers || 0} folowingCount={userData?._count?.following || 0} actionBtn={<div className=''>
                  <p className='font-semibold'>{userData?._count?.following || 0}</p>
                  <p className='text-gray-700'>Following</p>
                </div>} userName={userData?.userName} />
              </div>


              <div className='border-x border-gray-200 px-4 sm:px-6 xl:px-8'>
                <FolowerFolowing type='followers' folowerCount={userData?._count?.followers || 0} folowingCount={userData?._count?.following || 0} actionBtn={<div className=''>
                  <p className='font-semibold'>{userData?._count?.followers || 0}</p>
                  <p className='text-gray-700'>Followers</p>
                </div>} userName={userData?.userName} />
              </div>

              {!isCharity && <div className='border-r border-gray-200 pr-4 sm:pr-6 xl:pr-8'>
                <p className='font-semibold'>{user?.data?.totalSells}</p>
                <p className='text-gray-700'>Sales</p>
              </div>}

              {(isCharityShop || isCharity) && (
                <DonationsRaisedDialog
                  userName={userData?.userName}
                  charityName={
                    `${userData?.fname || ""} ${userData?.lname || ""}`.trim() ||
                    userData?.userName
                  }>
                  <button
                    type="button"
                    className="text-left cursor-pointer group transition-opacity hover:opacity-85"
                  >
                    <p className="font-semibold">
                      {format(user?.data?.totalRaisedDonation || 0, { decimals: 1 })}
                    </p>
                    <p className="text-gray-700">
                      Raised
                    </p>
                  </button>
                </DonationsRaisedDialog>
              )}

              {!(isCharityShop || isCharity) && <Link href={`/member/${userData?.userName}/donations`} className=''>
                <p className='font-semibold'>{user?.data?.totalDonation}</p>
                <p className='text-gray-700'>Donated</p>
              </Link>}

            </div>
          </div>

          {!user?.data?.isCurrentUser && (
            isCharityShop ? (
              <div className="w-full sm:w-auto grid grid-cols-1 sm:flex sm:flex-row sm:items-center lg:grid lg:grid-cols-2 lg:w-72 xl:w-80 gap-2 sm:gap-2.5 shrink-0">
                <FolowUnFolow
                  isFolow={user?.data?.isfolowing}
                  memberId={userData?.id}
                  className="w-full sm:w-auto lg:w-full col-span-1 h-9 px-3"
                />

                <DonationFromProfile charity={user?.data?.user} className="w-full sm:w-auto lg:w-full col-span-1">
                  <Button className="text-white font-semibold px-3 cursor-pointer rounded-none w-full sm:w-auto lg:w-full bg-green-800 hover:bg-green-700 duration-200 transition-colors flex flex-row gap-x-1.5 items-center justify-center text-sm h-9">
                    <Heart size={16} />
                    Donate Now
                  </Button>
                </DonationFromProfile>

                <ClothesDonationDialog charityId={userData?.id} className="w-full sm:w-auto lg:w-full col-span-1 sm:col-auto lg:col-span-2">
                  <Button
                    className="font-semibold px-3 cursor-pointer rounded-none w-full sm:w-auto lg:w-full col-span-1 sm:col-auto lg:col-span-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#0f172a] duration-200 transition-colors flex flex-row gap-x-1.5 items-center justify-center text-sm h-9 shadow-xs"
                  >
                    <Shirt size={16} />
                    Donate Clothes
                  </Button>
                </ClothesDonationDialog>
              </div>
            ) : (
              <div className="w-full sm:w-auto shrink-0">
                <FolowUnFolow isFolow={user?.data?.isfolowing} memberId={userData?.id} className="w-full sm:w-auto" />
              </div>
            )
          )}
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
            <ExpandableText
              text={userData?.bio}
              lines={4}
              className="text-foreground leading-relaxed md:text-lg max-w-xl"
            />
          </div>
        }

        {/* //count sell avaialbity alert */}
        {
          user?.data?.isCurrentUser && country && !user?.data?.countryAvaialblity && <div className='mt-4'>
            <CountrySellNotAvaialbleAlert currentCountry={country?.name} />
          </div>
        }


      </> : <div className="">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <div className="relative">
              <Avatar className="h-24 md:h-28 w-24 md:w-28 shadow-sm">
                <AvatarImage src={userData?.picture?.url} className='bg-card object-cover ring-4 ring-card shadow' />
                <AvatarFallback className='text-3xl capitalize font-medium'>{userData?.userName.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
            <h2 className="font-serif text-3xl tracking-tight md:text-4xl lg:text-5xl mt-1 md:mt-2">
              {user?.data?.user?.fname} {user?.data?.user?.lname}
            </h2>
            <div className='flex flex-row items-center gap-3 mt-1 md:mt-2'>
              <p className='text-base'>@{userData?.userName}</p>
              <span className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase text-white" style={{ backgroundColor: userRoleMapper(user?.data?.user?.auth?.role)?.color }}>
                {/* <Sparkles className="h-3 w-3 text-primary" />  */}
                {userRoleMapper(user?.data?.user?.auth?.role)?.label}
              </span>
            </div>
            {user?.data?.user?.bio && (
              <div className="mt-2">
                <ExpandableText
                  text={user?.data?.user?.bio}
                  lines={4}
                  className="text-sm md:text-base text-foreground leading-relaxed"
                />
              </div>
            )}
          </div>

          <div className='md:w-auto w-full'>
            <DonationFromProfile charity={user?.data?.user}>
              <Button className=" text-white font-semibold px-10 lg:px-20 py-5 lg:py-6 cursor-pointer rounded-none w-full lg:w-28 bg-green-800 hover:bg-green-700 duration-200 transition-colors">
                Donate Now
              </Button>
            </DonationFromProfile>
          </div>

        </div>
      </div>}

    </div>
  )
}
