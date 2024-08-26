'use client'
import { GetClassificationProductCount } from "@/app/portal/actions";
import CategoryCarousel from "./CategoryCarousel";
import { useSelector } from "react-redux";
import { loggedInUser } from "@/store/session-reducer";
import { useEffect, useState } from "react";

export default function ShopByCategory() {

    const user = useSelector(loggedInUser);
    const [categories, setCategories] = useState<any>();
    const [readToRender, setReadyToRender] = useState(false);

    useEffect(() => {
        const loadCategory = async (filterdVariantId: number) => {            
            setCategories(await GetClassificationProductCount({ variantId: filterdVariantId }));
            setReadyToRender(true);
        }
        if (user?.settings?.variantId != undefined)
            loadCategory(user?.settings?.variantId);

    }, [user?.settings?.variantId]);

    if (readToRender == false)
        return (<></>);

    return (
        <div className="py-10 px-10 bg-[#f9f8f6]">
            <div className="container mx-auto">
                <h1 className="text-3xl font-extrabold font-nfl text-primary capitalize">shop by category</h1>
                <div className="my-7">
                    <CategoryCarousel CategoryData={categories?.data} />
                </div>
            </div>
        </div>
    )
}
