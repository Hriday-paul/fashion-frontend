"use client"
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationBellIcon } from "@/icons";
import { useNotificationsQuery, useReadAllNotificationsMutation } from "@/redux/api/notification.api";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { NotificationRender } from "./NotificationRender";
import { NotificationType } from "@/types";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function NotificationIcon() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const { data: notifications, isLoading, isSuccess } = useNotificationsQuery({});

  const [updateReadAll, { isLoading: isUpdating }] = useReadAllNotificationsMutation();

  const handleMarkAllAsRead = async () => {
    try {
      await updateReadAll().unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Error marking all notifications as read:");
    }
  };

  const unreadCount = notifications?.data?.unReadCount || 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className={cn("cursor-pointer relative focus-within:outline-none focus-within:ring-0 focus-within:ring-primary-black p-1.5", open && "bg-gray-100 rounded-md")}>
        <NotificationBellIcon className="size-5 lg:size-6" />

        {(isSuccess && notifications?.data?.unReadCount > 0) && <span className="absolute top-2 right-2 grid min-h-[20px] min-w-[20px] translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-600 px-0.75 py-0.5 text-[10px] text-white">{unreadCount < 100 ? unreadCount : `100+`}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-none w-[340px]" align="start">

        <div className="overflow-y-auto max-h-[450px]">

          <div className="border-b border-gray-200 flex flex-row justify-between items-center py-2 px-3 sticky top-0 bg-white z-10">
            <p className="text-base font-medium">Notifications</p>

            {(isSuccess && notifications?.data?.unReadCount > 0) && (
              <button className="rounded-none text-sm text-gray-600 cursor-pointer" onClick={handleMarkAllAsRead} disabled={isUpdating}>
                {isUpdating ? "Marking..." : "Mark All Read"}
              </button>
            )}
          </div>

          {
            isLoading ? (<div className="flex-center h-28">
              <span className="loaderDark !w-10"> </span>
            </div>) : isSuccess ? <div className="space-y-1.5">

              {notifications?.data?.data?.map((notification) => {
                const renderNotification = NotificationRender({ notification });
                const isWelcome =
                  notification?.type === NotificationType.WELLCOME ||
                  (notification?.type as unknown) === "WELLCOME";

                const cardContent = (
                  <Card className="p-4 shadow-none rounded">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-8 bg-gray-900 flex justify-center items-center flex-shrink-0">
                        {renderNotification.avatar}
                      </Avatar>

                      <div className="flex flex-row gap-x-1 items-start justify-between flex-1 min-w-0">
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <p className="text-sm text-gray-700">
                            {notification.message.split(/(\*\*.*?\*\*)/g).map((part, index) =>
                              part.startsWith("**") && part.endsWith("**") ? (
                                <strong key={index} className="text-primary-black">
                                  {part.slice(2, -2)}
                                </strong>
                              ) : (
                                <span key={index}>{part}</span>
                              )
                            )}
                          </p>

                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {moment(notification?.createdAt).fromNow()}
                          </span>

                          {isWelcome && (
                            <div className="mt-2.5">
                              <Button
                                asChild
                                size="sm"
                                className="rounded-none text-xs h-7 px-3 font-medium cursor-pointer"
                              >
                                <Link href="/profile/edit" onClick={closeMenu}>
                                  Complete your profile
                                </Link>
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0">
                          {notification?.entityImgs?.length == 1 && renderNotification?.postImg}
                        </div>
                      </div>
                    </div>

                    {notification?.entityImgs?.length > 1 && renderNotification?.postImg}
                  </Card>
                );

                return (
                  <div key={notification?.id}>
                    <DropdownMenuItem className="flex-none focus:bg-transparent p-0">
                      {isWelcome ? (
                        <div className="w-full">{cardContent}</div>
                      ) : (
                        <Link
                          href={renderNotification?.link || "#"}
                          onClick={closeMenu}
                          className="w-full"
                        >
                          {cardContent}
                        </Link>
                      )}
                    </DropdownMenuItem>
                  </div>
                );
              })}

              {notifications?.data?.data?.length <= 0 && <div className="py-10 space-y-2">
                <Image src={"/notification.gif"} unoptimized alt="empty-cart" className="h-12 w-auto mx-auto" height={500} width={500} />
                <p className="text-center text-gray-500 text-sm">No notifications available</p>
                <center>
                </center>
              </div>}

            </div> : <div className="py-10 space-y-2">
              <Image src={"/notification.gif"} unoptimized alt="empty-cart" className="h-12 w-auto mx-auto" height={500} width={500} />
              <p className="text-center text-gray-500 text-sm">No notifications available</p>
              <center>
              </center>
            </div>
          }
        </div>

        {(isSuccess && notifications?.data?.data?.length > 0) && <Link onClick={closeMenu} href={"/notifications"}>
          <Button variant={"default"} className="w-full mt-2 rounded-none py-4 border-2 border-primary-black cursor-pointer font-medium">View All</Button>
        </Link>}


      </DropdownMenuContent>
    </DropdownMenu>
  );
}
