import { INotification, NotificationType } from "@/types";
import Image from "next/image";
import { defaultImg } from "@/utils/defaultImg";

const PostImage = ({ notification }: { notification: INotification }) => {
    const entityImgs = notification?.entityImgs || [];

    if (entityImgs.length === 0) {
        return null;
    }

    return <div className="flex -space-x-2">
        {entityImgs.map((img, idx) => (
            <Image
                key={idx}
                src={img || defaultImg?.product}
                alt="order item image"
                width={1200}
                height={1200}
                placeholder="blur"
                blurDataURL={defaultImg?.placeholderImg}
                className="w-10 h-10 rounded object-cover border border-white"
            />
        ))}
    </div>
}

export const NotificationRender = ({ notification }: { notification: INotification }) => {
    if (
        notification?.type === NotificationType.WELLCOME ||
        (notification?.type as unknown) === "WELLCOME"
    ) {
        return {
            avatar: (
                <Image
                    src={defaultImg?.fashionIcon}
                    alt="welcome icon"
                    width={1200}
                    height={1200}
                    placeholder="blur"
                    blurDataURL={defaultImg?.placeholderImg}
                    className="w-10 h-10 rounded-full object-cover"
                />
            ),
            link: "/profile/edit",
            postImg: null,
        };
    }

    switch (notification?.entityType) {
        case "PRODUCT":
            switch (notification?.type) {
                case "PRODUCT_LIKE":
                    return {
                        avatar: <Image src={notification?.actor?.picture?.url || defaultImg?.empty_user} alt="user image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />,
                        link: `/shop/${notification?.entityId}`,
                        postImg: notification?.entityImgs?.length > 0 && <Image src={notification?.entityImgs?.[0] || defaultImg?.product} alt="product image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded object-cover" />
                    }
                case "PRICE_DROP":
                    return {
                        avatar: notification?.entityImgs?.length > 0 ? <Image src={notification?.entityImgs[0] || defaultImg?.empty_user} alt="product image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" /> : <Image src={defaultImg?.fashionIcon} alt="product image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />,
                        link: `/shop/${notification?.entityId}`,
                        postImg: <PostImage notification={notification} />
                    }
                case "SOLD_OUT":
                    return {
                        avatar: notification?.entityImgs?.length > 0 ? <div className="relative">
                            <Image src={notification?.entityImgs[0] || defaultImg?.empty_user} alt="product image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />
                            <span className="text-xs bg-destructive text-white px-1 py-0.5 absolute top-1 left-0">Sold</span>
                        </div> : <Image src={defaultImg?.fashionIcon} alt="product image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />,
                        link: `/shop/${notification?.entityId}`,
                        postImg: <PostImage notification={notification} />
                    }
                default:
                    return {
                        avatar: <Image src={defaultImg?.fashionIcon} alt="product image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />,
                        link: null,
                        postImg: <PostImage notification={notification} />
                    }
            }

        case "OFFER":
            // OFFER_RECEIVED, OFFER_ACCEPTED, OFFER_REJECTED, OFFER_CANCELED all behave the same
            return {
                avatar: <Image src={notification?.actor?.picture?.url || defaultImg?.empty_user} alt="user image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />,
                link: `/inbox/${notification?.entityId}`,
                postImg: <PostImage notification={notification} />
            }

        case "ORDER":
            // ORDER_PLACED, ORDER_STATUS_CHANGED, ORDER_COMPLETED, ORDER_ITEM_CANCELED all behave the same
            return {
                avatar: <Image src={defaultImg?.fashionIcon} alt="product image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />,
                link: null,
                postImg: notification?.entityImgs?.length > 0 && (
                    <div className="flex -space-x-2">
                        {notification.entityImgs.map((img, idx) => (
                            <Image
                                key={idx}
                                src={img || defaultImg?.product}
                                alt="order item image"
                                width={1200}
                                height={1200}
                                placeholder="blur"
                                blurDataURL={defaultImg?.placeholderImg}
                                className="w-10 h-10 rounded object-cover border border-white"
                            />
                        ))}
                    </div>
                )
            }

        case "USER":
            switch (notification?.type) {
                case "FOLLOWED":
                    return {
                        avatar: <Image src={notification?.actor?.picture?.url || defaultImg?.empty_user} alt="user image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />,
                        link: `/member/${notification?.entityId}`,
                        postImg: <PostImage notification={notification} />
                    }
                default:
                    return {
                        avatar: <Image src={defaultImg?.fashionIcon} alt="product image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />,
                        link: null,
                        postImg: <PostImage notification={notification} />
                    }
            }

        case "DONATION":
            return {
                avatar: <Image src={defaultImg?.fashionIcon} alt="product image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />,
                link: null,
                postImg: <PostImage notification={notification} />
            }

        case "RETURN":
            return {
                avatar: <Image src={defaultImg?.fashionIcon} alt="product image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />,
                link: null,
                postImg: <PostImage notification={notification} />
            }

        case "BADGE":
            // badge earned notification
            return {
                avatar: <Image src={defaultImg?.fashionIcon} alt="product image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />,
                link: `/member/${notification?.entityId}`,
                postImg: <PostImage notification={notification} />
            }

        default:
            return {
                avatar: <Image src={defaultImg?.fashionIcon} alt="product image" width={1200} height={1200} placeholder="blur" blurDataURL={defaultImg?.placeholderImg} className="w-10 h-10 rounded-full object-cover" />,
                link: null,
                postImg: <PostImage notification={notification} />
            }
    }
}