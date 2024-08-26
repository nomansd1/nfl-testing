"use client"

import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import Image from "next/image";

export default function BannerCarousel(props: any) {

    const settings = {
        dots: true,
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
        <div className="banner__slider">
            <Slider key={props.bannerId} {...settings}>
                {props.images?.map((image: any, index: any) => (
                    <div key={index} className="flex relative">                         
                        <Image key={index} className="h-[400px] object-cover mx-auto" src={image} width={1920} height={1000} alt="banner image" />
                    </div>
                ))}
            </Slider>
        </div>
    )
}
