import Image from "next/image";

export default function Message({ avatar, message, username, date, isUser }: any) {
    return (
        <div className={`flex w-fit ${isUser && 'ml-auto'}`}>
            <div className={`flex-shrink-0 ${isUser && 'order-2'}`}>
                <Image
                    src="/assets/chatuser.jpg"
                    className={`rounded-full ${isUser ? 'ml-2' : 'mr-2'}`}
                    width={50}
                    height={10}
                    alt=""
                />
            </div>
            <div>
                <p className={`text-[0.65rem] px-[2px] pb-[2px] capitalize ${isUser ? 'text-right': 'text-left'}`}>{username}</p>
                <div className="flex items-end">
                    <div className={`px-3 py-2 rounded-lg w-fit text-white text-xs ${isUser ? 'bg-gray-700 ml-auto order-2' : 'bg-primary'}`}>
                        <p>{message}</p>
                    </div>
                    <p className={`text-[0.65rem] italic px-2 text-gray-300 ${isUser && 'text-right'}`}>{date}</p>
                </div>
            </div>
        </div>
    )
}
