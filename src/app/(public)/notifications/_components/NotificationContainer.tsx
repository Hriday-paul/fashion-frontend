"use client";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useNotificationsQuery, useReadAllNotificationsMutation } from "@/redux/api/notification.api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { CheckCheck, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Pagination } from "react-pagination-bar";
import { NotificationRender } from "@/components/shared/Navbar/NavIconsWithDropDown/NotificationRender";
import { NotificationType } from "@/types";
import Link from "next/link";

export default function NotificationContainer() {

  const [page, setPage] = useState(1);

  const { data: notifications, isLoading, isSuccess } = useNotificationsQuery({ page: page, limit: 20 });

  const [updateReadAll, { isLoading: isUpdating }] = useReadAllNotificationsMutation();

  const handleMarkAllAsRead = async () => {
    try {
      await updateReadAll().unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Error marking all notifications as read:");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      <div className="flex items-end justify-between gap-3">
        <div>
          {/* <p className="mb-2 text-base font-medium text-primary">Your updates</p> */}
          <h1 className="text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-2xl lg:text-3xl">Notifications</h1>
          <p className="mt-2 max-w-md text-pretty text-sm lg:text-base leading-6 text-gray-600">Stay in the loop with what&apos;s happening around your account.</p>
        </div>


        {isSuccess && <div className="flex flex-row gap-x-3 items-center">
          {notifications?.data?.unReadCount > 0 && <span className="mb-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-gray-700">{notifications?.data?.unReadCount} unread</span>}

          {notifications?.data?.unReadCount > 0 && <Button
            variant={"default"}
            onClick={handleMarkAllAsRead}
            size={"sm"}
            disabled={isUpdating}
            className="cursor-pointer">
            Mark all as read
          </Button>}
        </div>}
      </div>

      {isLoading && (<div className="flex-center h-40 lg:h-60">
        <span className="loaderDark !w-10"> </span>
      </div>)}

      {isSuccess && <div className="space-y-3 py-3">
        {notifications?.data?.data?.map((notification) => {
          const renderNotification = NotificationRender({ notification });
          const isWelcome =
            notification?.type === NotificationType.WELLCOME ||
            (notification?.type as unknown) === "WELLCOME";

          const cardContent = (
            <Card className="p-4 shadow-none rounded w-full">
              <div className="flex items-start gap-3">
                <Avatar className="size-10 bg-gray-900 flex justify-center items-center flex-shrink-0">
                  {renderNotification.avatar}
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="gap-1">
                        <div className="flex flex-row justify-between items-start">
                          <p className="text-base text-gray-700">
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
                          {notification?.isRead && <CheckCheck className="inline-block ml-1 text-cyan-600 size-4" />}
                        </div>

                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {moment(notification?.createdAt).fromNow()}
                        </span>

                        {isWelcome && (
                          <div className="mt-3">
                            <Button
                              asChild
                              size="sm"
                              className="rounded-none text-xs h-8 px-4 font-medium cursor-pointer"
                            >
                              <Link href="/profile/edit">
                                Complete your profile
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>

                      {renderNotification?.postImg}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );

          return (
            <div key={notification?.id}>
              {isWelcome ? (
                <div className="w-full">{cardContent}</div>
              ) : (
                <Link href={renderNotification?.link || "#"} className="w-full">
                  {cardContent}
                </Link>
              )}
            </div>
          );
        })}
      </div>}

      {
        (isSuccess && notifications?.data?.data?.length === 0) && <div className="py-10 lg:py-20 space-y-2">
          <Image src={"/notification.gif"} unoptimized alt="empty-cart" className="h-16 w-auto mx-auto" height={500} width={500} />
          <p className="text-center text-gray-500 text-base">No notifications available</p>
          <center>
          </center>
        </div>
      }

      {isSuccess && <div className="flex flex-row justify-end">
        < Pagination
          currentPage={page}
          itemsPerPage={20}
          onPageChange={(pageNumber) => setPage(pageNumber)}
          totalItems={notifications?.data?.meta?.total}
          pageNeighbours={2}
          startLabel={<ChevronFirst className="size-4" />}
          prevLabel={<ChevronLeft className="size-4" />}
          nextLabel={<ChevronRight className="size-4" />}
          endLabel={<ChevronLast className="size-4" />}
          customClassNames={
            {
              rpbItemClassName: "rounded px-2.5 h-7 cursor-pointer border border-gray-200 ml-1.5 text-sm",
              rpbItemClassNameActive: "border-none bg-primary-black text-white",
            }
          }
        />
      </div>}

    </div>
  );
}
