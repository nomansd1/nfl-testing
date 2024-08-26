"use client"

import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MonthlyDealsCarousel(props: any) {

    const router = useRouter();
    const redirectToCollection = () => {
        router.push(`/portal/search/collection/${props.CollectionId}`);
    }
    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        pauseOnHover: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    }

    return (
        <div className="deals__carousel">
            <Slider {...settings}>
                {props?.Deals?.map((item: any) => (
                    <div key={item.id}>
                        <div className="my-5">
                            <div className="p-4 bg-[#dbe3e8] w-fit rounded-xl">
                                <div className="h-[32px] mb-2">
                                    <h1 className="text-primary font-nfl font-bold capitalize leading-tight">{item.productName}</h1>
                                </div>
                                <button className="capitalize text-xs font-semibold underline underline-offset-2 text-gray-800" onClick={redirectToCollection}>shop now</button>
                                <div className="bg-white rounded-xl px-6 py-3 flex items-center gap-x-5 justify-between mt-8">
                                    <div className="flex flex-col items-center">
                                        <span className="text-primary text-base font-agy font-bold uppercase leading-tight">save up to</span>
                                        <div className="text-primary">
                                            <span className="font-agy text-6xl leading-none">{item.discount}</span>
                                            <span className="font-agy text-xl">%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Image src={item.image} width={110} height={80} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}