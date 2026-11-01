import { IMessage, IMeta, IProduct, IUser } from "@/types";
import { baseApi } from "./baseApi";

const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getChatDetails: builder.query<{
            data: {
                id: string,
                user: IUser,
                items: {
                    id: string,
                    product: IProduct
                }[],
                itemsPrice: number,
                isUnavailable: boolean,
                isImSeller: boolean,
            },
        }, { chatId: string }>({
            query: ({chatId }) => ({
                url: `/chats/${chatId}`,
                method: "GET"
            }),
        }),

        totalUnreadMsgCount: builder.query<{
            data: number
        }, void>({
            query: () => ({
                url: `/messages/unread-count`,
                method: "GET",
            }),
        }),

        getMyMessages: builder.query<{
            data: {
                data: IMessage[],
                meta: IMeta
            }
        }, { chatId: string, params: {} }>({
            query: ({ params, chatId }) => ({
                url: `/messages/pre-messages/${chatId}`,
                method: "GET",
                params,
            }),
        }),

        sendNewMsg: builder.mutation<{
            data: {}
        }, FormData>({
            query: (body) => ({
                url: `/messages/send`,
                method: "POST",
                body: body
            }),
        }),

    }),
});

export const { useGetChatDetailsQuery, useLazyGetMyMessagesQuery, useSendNewMsgMutation, useTotalUnreadMsgCountQuery } = messageApi;
