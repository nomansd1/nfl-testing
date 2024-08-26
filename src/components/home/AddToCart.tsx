'use client'
import { LocalStorageClient, LocalStorageKey } from "@/lib/db/local-storage";
import { updateCartState } from "@/store/cart-reducer";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "../ui/use-toast";

export default function AddToCart({ ProductInfo, DialogClose }: any) {
    const { toast } = useToast();

    const [product, setProduct] = useState(ProductInfo);
    const [proposedQty, setProposedQty] = useState(product.proposedQty);
    const [tolerance, setTolerance] = useState({ min: product.tolerenceMin, max: product.tolerenceMax })
    const [disabledCart, setDisableCart] = useState(false);


    const dispatch = useDispatch();

    const addItemTOCart = () => {
        const updateCart = async () => {
            await LocalStorageClient.mergeCart(LocalStorageKey.cart, product);
            const cartSummary: any = await LocalStorageClient.getItemSummary(LocalStorageKey.cart);
            dispatch(updateCartState(cartSummary));

            let userLoggedInSettings = await LocalStorageClient.getItem(LocalStorageKey.user);
            if (userLoggedInSettings) {
                let settings: any = (JSON.parse(userLoggedInSettings)).settings;
                toast({
                    title: "Added to Cart",
                    description: `${settings.containerInfo.containerSizename} Filled Container Volume: ${Number(cartSummary.filledVolume).toFixed(2)}%, Weight: ${((Number(cartSummary.filledWeigth) / Number(settings.containerInfo.weightLimitinKgs)) * 100).toFixed(2)}%`,
                    variant: 'success'
                });
            }
        }
        updateCart();
    }

    const updateQty = (value: number) => {
        if(value.toString().includes('.')){
            setProposedQty(proposedQty);
            return;
        }
        if (value < tolerance.min || value > tolerance.max) {
            setDisableCart(true);
        } else {
            setDisableCart(false);
        }
        setProposedQty(value);
        setProduct({ ...product, proposedQty: value })
    }

    const increaseQty = () => {
        const incrementedQty = Number(proposedQty) + 1;
        validateQty(incrementedQty);
    }

    const decreaseQty = () => {
        const decrementedQty = Number(proposedQty) - 1;
        validateQty(decrementedQty);
    }

    const validateQty = (qty: number) => {
        if (qty < product.tolerenceMin || qty > product.tolerenceMax) {
            setDisableCart(true);
        } else {
            setDisableCart(false);
        }
        setProposedQty(qty);
        setProduct({ ...product, proposedQty: qty });
    }
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-lg font-semibold mt-5">{product.productName}</h1>
            <Image src={product.image} className="mx-auto my-5" width={160} height={150} alt={product.productName} />
            <div className="flex justify-between items-center w-full mb-3">
                <p className="text-gray-500 text-[10px]">{product.pcsInCarton} piece in a carton</p>
                <div className="flex flex-col items-end">
                    <p className="text-base font-extrabold text-primary font-nfl leading-tight"> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.salePrice)}</p>
                    <p className="text-[10px] capitalize text-gray-600 leading-tight">{product.displayproductgrammage}gm</p>
                </div>
            </div>
            <div className="border-2 border-primary rounded-full flex items-center">
                <button className="px-5 h-full rounded-l-full group text-primary focus:outline-none hover:bg-primary disabled:cursor-not-allowed inline-flex items-center" disabled={Number(product.proposedQty) <= 1} onClick={decreaseQty}>
                    <MinusIcon className="group-[:hover]:text-white" />
                    <span className="text-[11px] group-[:hover]:text-white ml-0.5">({product.tolerenceMin})</span>
                </button>
                <input type="number" className="focus:outline-none border-x-2 border-primary px-2 py-1 text-center text-primary text-sm font-medium" value={proposedQty} onChange={(event: any) => updateQty(event.target.value)} />
                <button className="px-5 h-full rounded-r-full group text-primary focus:outline-none hover:bg-primary disabled:cursor-not-allowed inline-flex items-center" onClick={increaseQty}>
                    <span className="text-[11px] group-[:hover]:text-white mr-0.5">({product.tolerenceMax})</span>
                    <PlusIcon className="group-[:hover]:text-white" />
                </button>
            </div>
            <DialogClose asChild className="w-full">
                <button disabled={disabledCart} className="w-full text-white bg-primary p-2.5 hover:bg-primary-hover uppercase mt-5 rounded-md text-sm disabled:cursor-not-allowed disabled:opacity-20" onClick={addItemTOCart}>Add to Cart</button>
            </DialogClose>
        </div >
    )
}