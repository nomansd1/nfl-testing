'use client'
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import Image from "next/image";
import { AddToCart } from "../home";
import { useEffect, useState } from "react";
import { LocalStorageClient, LocalStorageKey } from "@/lib/db/local-storage";


export default function Product({ Product }: { Product: any }) {
    Product.proposedQty = Product.proposedQty ?? 20;

    const [productReady, setProductReady] = useState(false);
    useEffect(() => {
        const displayQty = async () => {
            let cartItem: any = await LocalStorageClient.getItemById(LocalStorageKey.cart, Product.id);

            if (cartItem) {
                Product.proposedQty = cartItem.proposedQty;
            }
            setProductReady(true);
        }

        displayQty();
    }, []);

    if (productReady === false)
        return (<></>)

    return (
        <div className="w-[230px] h-[300px]">
            <div className="w-full p-5 border-2 border-gray-400 rounded-lg h-[204px]">
                <Image src={Product.image} className="mx-auto" width={160} height={150} alt={Product.productName} />
            </div>
            <div className="flex justify-between mt-4">
                <div>
                    <div className="flex items-start w-full h-[32px] ">
                        <h1 className="text-sm font-nflhv capitalize text-primary leading-4 max-w-[130px]">{Product.productName}</h1>
                    </div>
                    <p className="text-gray-500 text-[10px] mt-3">{Product.pcsInCarton} piece in a carton</p>
                </div>
                <div className="flex flex-col items-end w-[100px]">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-[10px] capitalize text-gray-600 leading-tight">{Product.displayproductgrammage}gm</p>
                        <p className="text-base font-extrabold text-primary font-nfl leading-tight"> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Product.salePrice)}</p>
                    </div>
                    <p className="text-[10px] capitalize text-gray-500">Carton Price</p>
                    <Dialog>                  
                        <DialogTrigger>
                            <span className="border-2 border-primary uppercase rounded-full pt-0.5 px-4 text-gray-600 font-semibold hover:bg-primary hover:text-white text-[8px] whitespace-nowrap inline-flex items-center mt-2" >Add to Cart</span>
                        </DialogTrigger>
                        <DialogContent className="w-fit z-[300]">
                            <AddToCart key={Product.id} ProductInfo={Product} DialogClose={DialogClose} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>

    )
}