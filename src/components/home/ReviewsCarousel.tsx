"use client"

import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import Image from "next/image";

export default function ReviewsCarousel(props: any) {
  
    const thumbnailCarouselSettings = {
        dots: false,
        infinite: true,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 4000,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        pauseOnHover: false,
        centerMode: true,
        swipe: false
    }

    const feedbackCarouselSettings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 4500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        pauseOnHover: false,
        swipe: false,
        fade: true
    }
  
    return (
    <div className="bg-[#ededed] py-16 px-10">
        <div className="container">
            <h1 className="text-center text-5xl font-nfl text-primary font-bold capitalize">customer reviews</h1>
            <p className="text-lg font-medium max-w-3xl mx-auto text-center mt-4 leading-tight">
                We serve a diversified group of customers in North America, carefully listening to them and improving our product offerings based on their feedback.
            </p>
            <div className="flex w-full gap-5">
                <div className="w-[55%] h-[400px] thumbnail__slider">
                    <Slider {...thumbnailCarouselSettings} className="w-full h-full !flex !justify-center !items-center">
                        {props.reviews?.map((item: any) => (
                            <div key={item.id}>
                                <div className="overflow-hidden rounded-full w-[7rem] h-[7rem] item">
                                    <img className="object-cover w-full h-full rounded-full" src={item.thumbnail} alt="" />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
                <div className="w-[45%] p-5 feedback__slider">
                <Slider {...feedbackCarouselSettings} className="w-full h-full !flex flex-row-reverse !justify-center !items-center">
                        {props.reviews?.map((item: any) => (
                            <div key={item.id}>
                                <div className="w-full h-[200px] bg-white px-5 py-8 rounded-3xl feedback__item">
                                    <h1 className="capitalize font-semibold text-lg text-[#525151]">by {item.customerName}</h1>
                                    <h2 className="capitalize font-semibold text-base text-[#525151]">From {item.location}</h2>
                                    <p className="text-sm mt-2 text-[#808080]">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur deleniti beatae fugiat minus doloribus ducimus aspernatur dolor voluptatibus nobis. Repellendus eius delectus quas doloremque nam eos quos nemo rem ut!
                                    </p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    </div>
  )
}
