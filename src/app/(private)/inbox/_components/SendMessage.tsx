"use client"
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useSendNewMsgMutation } from '@/redux/api/message.api'
import { Camera, FileText, LoaderCircle, Send, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'

const MAX_FILES = 5;

function SendMessage({ chatId }: { chatId: string }) {

    const [handleSendMessage, { isLoading }] = useSendNewMsgMutation();
    const [files, setFiles] = React.useState<File[]>([]);
    // const fileInputRef = React.useRef<HTMLInputElement>(null);

    // create/revoke object URLs for previews so we don't leak memory
    const preview = (file: File) => ({
        file,
        url: URL.createObjectURL(file),
        isImage: file.type.startsWith("image/"),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (!selected || selected.length === 0) return;

        setFiles((prev) => {
            const combined = [...prev, ...selected];

            if (combined.length > MAX_FILES) {
                const trimmed = combined?.slice(combined.length - MAX_FILES); // keep last MAX_FILES, drop from beginning
                toast.warning(`Max ${MAX_FILES} files allowed. Oldest file(s) removed.`);
                return trimmed;
            }

            return combined;
        });

        // reset the input value so selecting the same file again still fires onChange
        e.target.value = "";
    };

    const handleRemoveFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {

        try {
            e.preventDefault();
            const form = e.currentTarget;
            const msgInput = form?.message as HTMLFormElement;

            const formData = new FormData();
            formData.append("data", JSON.stringify({ text: msgInput?.value, chatId }));

            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }

            if (msgInput?.value || files.length > 0) {
                await handleSendMessage(formData).unwrap();
                form.reset();
                setFiles([]);
                // if (fileInputRef.current) fileInputRef.current.value = "";
            }
        } catch (error: any) {
            console.log(error)
            toast.error(error?.data?.message || "Message sending failed");
        }
    }


    return (
        <div>

            {/* file previews with delete */}
            <div className="flex flex-wrap gap-2 px-2 pt-2">
                {files.map((file, index) => (
                    <div
                        key={`${file?.name}-${Date.now()}-${index}`}
                        className="relative size-16 rounded-lg overflow-hidden border border-[#e1e1e1] group"
                    >
                        {preview(file).isImage ? (
                            <Image
                                height={64}
                                width={64}
                                src={preview(file).url}
                                alt={preview(file).file.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 gap-0.5 p-1">
                                <FileText className="size-5 text-gray-500 shrink-0" />
                                <span className="text-[9px] text-gray-600 leading-tight text-center line-clamp-2 break-all">
                                    {preview(file).file.name}
                                </span>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 cursor-pointer"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>


            <div className="mt-3 flex w-full items-center pb-2">
                <div className="mx-2">
                    <input
                        // ref={fileInputRef}
                        type="file"
                        id="fileInput"
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                        multiple
                        onChange={handleFileChange}
                    />

                    <label
                        htmlFor="fileInput"
                        className="cursor-pointer flex items-center justify-center
                   text-gray-600 hover:text-gray-800
                   border-none bg-transparent h-10 px-4"
                    >
                        <Camera className="size-6" />
                    </label>
                </div>

                <form
                    onSubmit={handleSubmitForm}
                    className='w-full'>
                    <div className="flex w-full items-stretch gap-x-4 relative">
                        <Input
                            placeholder="Type a message"
                            type="text"
                            name='message'
                            className="w-full bg-white border-[#e1e1e1] shadow-none focus-visible:ring-0 focus:ring-0 focus:border focus-visible:border-primary-black px-4 pr-10 py-5 rounded-3xl"
                        />
                        <button disabled={isLoading} type='submit' className={cn("cursor-pointer absolute right-4 top-3", isLoading && "cursor-not-allowed")}>
                            {!isLoading ? <Send
                                size={20}
                                color="#d55758"
                                className=""
                            /> : <LoaderCircle className='animate-spin' />}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default SendMessage