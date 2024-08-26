"use client"

import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCarousel({ CategoryData }: { CategoryData: any }) {

    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: CategoryData?.rows.length > 4 ? 5 : CategoryData?.rows.length,
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
        <Slider className="category__carousel" {...settings}>
            {CategoryData?.rows?.map((item: any) => (
                <div key={item.id}>
                    <Link href={`/portal/category/${item.id}`}
                        className="flex flex-col mx-auto bg-white justify-center items-center w-[200px] rounded-tr-3xl rounded-tl-3xl rounded-bl-lg rounded-br-lg shadow-sm shadow-gray-400">
                        <div className="bg-white rounded-tr-3xl rounded-tl-3xl w-full px-8 py-5">
                            <Image className="max-h-[110px] mx-auto" src={item.image} width={200} height={110} alt={item.name} />
                        </div>
                        <div
                            className="text-center w-full text-white bg-primary rounded-tr-[2rem] rounded-tl-[2rem] rounded-bl-lg rounded-br-lg px-2 py-3">
                            <h1 className="text-base font-semibold capitalize">{item.name}</h1>
                            <p className="capitalize text-sm text-gray-100 font-medium mt-1">
                                <span className="mr-1">{item.countofProduct}</span>
                                products</p>
                        </div>
                    </Link>
                </div>
            ))}
        </Slider>
    )
}
