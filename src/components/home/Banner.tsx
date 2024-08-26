import { GetBanners } from "@/app/portal/actions";
import BannerCarousel from "./BannerCarousel";
import { Fragment } from "react";

export default async function Banner() {
    const listOfBanners = await GetBanners({ repeatoneverypage: "N" });

    if (listOfBanners?.data?.rows?.length)
        return (
            <BannerCarousel bannerId={listOfBanners.data.rows[0].id} images={listOfBanners.data.rows[0].attachments} />
        )
    else
        return (<></>)
}