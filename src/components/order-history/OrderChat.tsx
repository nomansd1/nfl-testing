'use client'

import { SendHorizontal } from "lucide-react"
import Message from "./Message"
import { useEffect, useState } from "react";
import { GetNotesByOrderId } from "@/app/portal/actions";
import Loading from "@/app/portal/loading";

export default function OrderChat({ orderId, orderNo }: { orderId: number, orderNo: string }) {
    const [notes, setNotes] = useState<any>([]);

    useEffect(() => {
        const loadNotes = async () => {
            let data = await GetNotesByOrderId({ orderId: orderId }); //249000044
            setNotes(data?.data?.rows);
        }

        loadNotes();
    }, []);
    if (notes === null)
        return (<><Loading></Loading></>)

    return (
        <div className="p-4 flex flex-col relative overflow-auto">
            <h1 className='text-lg font-bold'>
                <span className='text-black'>Order No: </span>
                <span className='text-primary'>{orderNo.toString()}</span>
            </h1>
            {/* Message list */}
            <div className="space-y-5 pt-8 pb-32">
                {
                    notes?.map((note: any, index: number) => (<>
                        <Message
                            avatar={note.image}
                            message={note.comment}
                            username={note.username}
                            date={note.timestamp}
                            isUser={note.isthisSameUser}
                        />
                    </>
                    ))
                }
            </div>
            {/* Meesage Input */}
            {/* <div className="z-50 fixed bottom-0 right-0 left-0 px-4 pb-4 w-full flex items-center">
                <input
                    type="text"
                    placeholder="Enter your message"
                    className="flex-1 rounded-md p-2 text-sm focus:ring-2 focus:ring-gray-400 border-input border bg-background focus:outline-none"
                />
                <button className="ml-2 rounded-full h-[38px] w-[38px] flex justify-center items-center bg-primary hover:bg-primary-hover">
                    <SendHorizontal size={16} color="white" />
                </button>
            </div> */}
        </div>
    )
}
