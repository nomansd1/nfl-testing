"use client"

import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";

export default function SeasoningProductsCarousel(props: any) {
  
    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        pauseOnHover: false,
        fade: true,
    }
  
    return (
    <div className="bg-[#65416b] px-4 lg:px-6 flex flex-col">
        <Slider {...settings}>
            {props.seasoningProducts?.map((item: any) => (
                <div key={item.id}>
                    <div className="container py-7 flex flex-col lg:flex-row flex-1 items-center gap-y-10 lg:gap-x-10 justify-center">
                    <div className="w-full lg:w-[50%] h-full flex flex-col items-center p-2 md:p-7">
                        <h1 className="text-3xl  md:text-5xl font-bold font-nfl text-[#bca351] capitalize">seasoning products</h1>
                        <p className="text-xl md:text-3xl font-cart text-[#bca351] capitalize mt-4">add magic to your meals</p>
                        <Image className="my-7 md:w-[250px] md:h-[250px]" src="/assets/seasonproduct1.png" width={170} height={170} alt="" />
                        <Link href={''} className="px-7 py-2 bg-[#bca351] hover:bg-[#A99248] text-white rounded-md capitalize text-sm">view more product</Link>
                    </div>
                    <div className="w-full lg:w-[45%] h-[80%] bg-white rounded-2xl flex items-center justify-center">
                        <Image className="md:w-[350px] md:h-[200]" src="/assets/seasonproduct.png" width={200} height={120} alt="" />
                    </div>
                </div>
                </div>
            ))}
        </Slider>
    </div>
  )
}
