'use client'
import { LocalStorageClient, LocalStorageKey } from "@/lib/db/local-storage";
import { updateCartState } from "@/store/cart-reducer";
import { Check, Edit } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function CheckoutProduct({ product, refreshCart }: { product: any, refreshCart: any }) {
    const dispatch = useDispatch();
    const [price, setPrice] = useState(Number(product.proposedQty) * Number(product.salePrice));
    const [proposedQty, setProposedQty] = useState(product.proposedQty);
    const [tolerance, setTolerance] = useState({ min: product.tolerenceMin, max: product.tolerenceMax });
    const [editMode, setEditMode] = useState(false);
    const [disableCartonSize, setDisableCartonSize] = useState(false);

    const updateQty = (value: number) => {
        if (value.toString().includes('.')) {
            setProposedQty(proposedQty);
            return;
        }
        if (value < tolerance.min || value > tolerance.max) {
            setDisableCartonSize(true);
        } else {
            setDisableCartonSize(false);
        }
        setProposedQty(value);
        setPrice(Number(product.salePrice) * value);
    }

    const updateQtyInCart = () => {
        const updateCart = async () => {
            await LocalStorageClient.addOrUpdateCart(LocalStorageKey.cart, { ...product, proposedQty: String(proposedQty), proposedValue: String(Number(product.salePrice) * proposedQty) });
            const cartSummary: any = await LocalStorageClient.getItemSummary(LocalStorageKey.cart);
            dispatch(updateCartState(cartSummary));

            setEditMode(false);
        }
        updateCart();
    }

    const removeItem = () => {

        const removeFromCart = async () => {
            await LocalStorageClient.removeItemById(LocalStorageKey.cart, product.id);
            const cartSummary: any = await LocalStorageClient.getItemSummary(LocalStorageKey.cart);
            dispatch(updateCartState(cartSummary));
            refreshCart();
        }
        removeFromCart();
    }


    return (
        <div className="grid grid-cols-12 border-2 border-primary p-3 mb-2 rounded-md mt-3 mx-2">
            <div className="col-span-12 md:col-span-1 ">
                <Image src={product.image} className="max-h-[120px] object-contain mx-auto md:mx-0" width={180} height={129} alt="" />
            </div>
            <div className="col-span-12 md:col-span-11 grid grid-cols-12 py-2">
                <div className="col-span-12 text-center md:col-span-5 md:text-left">
                    <div className="flex items-center">
                        <h1 className="text-xl font-nfl font-bold capitalize text-primary">{product.productName}</h1>
                        <p className="px-5 text-sm text-[#969696]">{product.displayproductgrammage}gm</p>
                    </div>
                    <p className="text-sm font-medium text-[#737374]">{product.barcode}</p>
                    <p className="text-sm font-semibold text-[#737374] mt-3">{product.pcsInCarton} Pieces in a carton</p>
                </div>
                <div className="col-span-6 md:col-span-3 flex flex-col justify-center items-center">
                    <div className="flex justify-center items-center">
                        <label htmlFor="" className="block font-medium capitalize text-sm mr-2">Carton</label>
                        {editMode && (
                            <div className="flex items-center">
                                <input type="number" min="1" value={proposedQty} className="w-[60px] px-1.5 rounded-md border border-gray-400 focus:outline-none bg-[#fcfcfc] shadow shadow-gray-400 text-center" onChange={(event: any) => updateQty(event.target.value)} />
                                <button disabled={disableCartonSize} onClick={() => updateQtyInCart()} className="rounded-full p-1 bg-primary flex justify-center items-center ml-2 disabled:cursor-not-allowed disabled:opacity-20">
                                    <Check size={12} color="white" />
                                </button>
                            </div>
                        )}
                        {!editMode && (
                            <div className="flex items-center">
                                <label className="font-semibold">{proposedQty}</label>
                                <button onClick={() => setEditMode(true)} className="rounded-full p-1 bg-primary flex justify-center items-center ml-2">
                                    <Edit size={12} color="white" />
                                </button>
                            </div>
                        )}
                    </div>
                    {editMode && (
                        <div className="mt-2">
                            <p className="text-xs font-medium">Allowed Min: {tolerance.min} & Max: {tolerance.max}</p>
                        </div>
                    )}
                </div>
                <div className="col-span-6 md:col-span-4 flex flex-col items-end">
                    <span className="text-2xl font-nfl font-bold text-primary">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}</span>
                    <span className="text-sm text-[#969696]">Carton price</span>
                    <button type="button" className="font-semibold text-gray-700 hover:text-primary text-sm rounded-md mt-3" onClick={removeItem}>Remove</button>
                </div>
            </div>
        </div>
    )
}
