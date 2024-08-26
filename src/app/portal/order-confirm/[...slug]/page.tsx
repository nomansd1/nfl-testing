import Image from "next/image";
import Link from "next/link";

export default function page({ params }: { params: { slug: string[] } }) {
    return (
        <section className="flex w-full flex-[1] justify-center items-center">
            <div className="flex justify-center items-center flex-col w-[90%] md:w-[50%]">
                <div className="mx-auto custom__shadow w-full h-auto text-center p-7 bg-white rounded-md">
                    <h1 className="text-lg md:text-2xl font-semibold capitalize">PFI has send to BDM</h1>
                    <Image className="mx-auto my-3 md:w-[150px] md:h-[150px]" src="/assets/orderplacedcart.png" width={110} height={110} alt="" />
                    <p className="text-base md:text-xl font-semibold capitalize mt-1">your PFI number is <span className="text-primary">{params.slug[1]}</span></p>
                </div>
                <Link href="/portal/order-history"
                    className="py-1 px-3 md:py-2 md:px-5 inline-flex items-center border-2 border-primary rounded-full capitalize mt-5 bg-primary hover:bg-primary-hover text-white">
                    <Image width={28} height={28} className="mr-2" src="/assets/expicon.png" alt="" />
                    <span className="text-xs md:text-sm">View your Order list</span>
                </Link>
            </div>
        </section>
    )
}
