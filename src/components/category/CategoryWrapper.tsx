"use client"

import Image from "next/image"
import { ProductsGrid } from "@/components/shared";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function CategoryWrapper({ classifications, classifyProducts, PriceOptions, variants, params }: any) {

    const router = useRouter();

    const handleCategoryClick = (categoryValue: any) => {
        router.push(`/portal/category/${categoryValue.id}`)
    };

    return (
        <div className="container">         
            <ProductsGrid InitialProducts={[]} Categories={[]} Variants={[]} PriceOptions={[]} FilterBy="category" FilterValue={params?.slug?.[0] ?? ''} />
        </div>
    )
}
