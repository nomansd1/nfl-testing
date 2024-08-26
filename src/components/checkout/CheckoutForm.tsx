'use client'
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Trash2, X } from "lucide-react";
import { useSelector } from "react-redux";
import { totalItems, updateCartState } from "@/store/cart-reducer";
import { ChangeEvent, useEffect, useState } from "react";
import { GetContainerInfoByParams, GetListOfValues, SaveOrder, UpdateItemCapacityByParams } from "@/app/portal/actions";
import { CheckoutKeys } from "@/lib/constants/Constants";
import { useToast } from "../ui/use-toast";
import { LocalStorageClient, LocalStorageKey } from "@/lib/db/local-storage";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Loader from "../ui/loader";
import { GetContainerInfo } from "@/lib/utilities/http-client-helper";


export default function CheckoutForm({ Destinations }: { Destinations: any }) {
    const cart = useSelector(totalItems);
    const { toast } = useToast();
    const router = useRouter();
    const dispatch = useDispatch();

    const [initialize, setInitialize] = useState(false);

    const [loader, setLoader] = useState(false);
    const [containers, setContainers] = useState<any>([]);
    const [containerInfo, setContainerInfo] = useState<any>({ weightlimitinkgs: 0, volumelimitincubicsize: 0, containerSizename: "" });
    const [masterInfo, setMasterInfo] = useState<any>();

    const handleCustomerComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setMasterInfo({ ...masterInfo, customerComments: event.target.value })

    }

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMasterInfo({ ...masterInfo, [event.target.name]: event.target.value });
    }
    const updateValue = (target: string, value: string) => {
        setMasterInfo({ ...masterInfo, [target]: value });
    }

    const onDestinationChange = (destination: string) => {
        let loadContainer = async (param: number) => {
            let data = await GetListOfValues(`${CheckoutKeys.CONTAINER}?shippingPort=${param}`);
            setContainers(data?.data?.rows);
        }
        loadContainer(Number(destination));

    }

    const onContainerChange = (container: string) => {
        setMasterInfo({ ...masterInfo, containerSizeCode: container });

        const loadContainerInfo = async (param: string) => {
            setLoader(true);
            const selectedContainerInfo: any = await GetContainerInfoByParams(`${CheckoutKeys.CONTAINER_INFO}?containerSize=${param}&Shippingport=${masterInfo.destinationCode}`);
            setContainerInfo({
                weightlimitinkgs: selectedContainerInfo.weightLimitinKgs,
                volumelimitincubicsize: selectedContainerInfo.volumeLimitinCubicsize,
                containerSizename: selectedContainerInfo.containerSizename
            });

            let userLoggedInSettings = await LocalStorageClient.getItem(LocalStorageKey.user);
            if (userLoggedInSettings) {
                let userInfo = (JSON.parse(userLoggedInSettings));
                userInfo.settings.containerInfo = selectedContainerInfo;
                userInfo.settings.destinationPortId = masterInfo.destinationCode;
                await LocalStorageClient.addOrUpdateItem(LocalStorageKey.user, userInfo);
            }

            // Fetch items from cart to updated the capacity
            let products: any = await LocalStorageClient.getItem(LocalStorageKey.cart);
            if (products && products != typeof (undefined)) {
                const response = await UpdateItemCapacityByParams({ containerSizeCode: param, destinationCode: masterInfo.destinationCode, products: JSON.parse(products) });

                // Update the cart with new capacity            
                await LocalStorageClient.updateCartInBulk(LocalStorageKey.cart, response.data?.products);

                // Recalculate the volumn & others necessary values against updated capacity
                const cartSummary: any = await LocalStorageClient.getItemSummary(LocalStorageKey.cart);
                dispatch(updateCartState(cartSummary));
            }
            setLoader(false);

        }
        loadContainerInfo(container);
    }


    const processOrder = () => {
        if (Number(cart.filledWeigth) > Number(containerInfo.weightlimitinkgs)) {

            toast({
                title: `Exceeded Maximum Allowed Weight`,
                description: `The current filled weight is ${Number(cart.filledWeigth).toFixed(2)} Kgs, while the maximum allowed weight is ${containerInfo.volumelimitincubicsize} Kgs. Please remove some items ${(masterInfo.containerSizeCode == "40FT" || masterInfo.containerSizeCode == "40FT-Palletized") ? "" : "or choose a larger container to proceed.."} `,
                variant: 'error'
            });
        }
        else if ((cart.isPalletizedContainer && Number(cart.filledVolume) > 100) || (!cart.isPalletizedContainer && Number(cart.filledVolume) > 98)) {
            toast({
                title: `Exceeded Maximum Allowed Volume`,
                description: `The current filled volume is ${Number(cart.filledVolume).toFixed(2)} %, while the maximum allowed volume is ${containerInfo.volumelimitincubicsize} cubic units. Please remove some items ${(masterInfo.containerSizeCode == "40FT" || masterInfo.containerSizeCode == "40FT-Palletized") ? "" : "or choose a larger container to proceed.."} `,
                variant: 'error'
            });
        }
        else {

            const processOrder = async () => {
                if (cart.totalItems === 0) {
                    toast({
                        title: `Cart is Empty!`,
                        description: "Please add some items to your basket before proceeding.",
                        variant: 'error'
                    });
                    return;
                }

                setLoader(true);
                let products: any = await LocalStorageClient.getItem(LocalStorageKey.cart);
                let orderInfo: any = await LocalStorageClient.getItem(LocalStorageKey.orderId);

                let data: any = { ...masterInfo, NoOfPallet: Number(cart.noOfPallet).toFixed(2), TotalContainerGrossWeight: cart.filledWeigth, products: JSON.parse(products) };
                if (orderInfo) {
                    data = { ...data, ...JSON.parse(orderInfo) };
                }

                const response = await SaveOrder(data);
                setLoader(false);

                if (response?.statusCode === 0) {
                    await LocalStorageClient.removeItem(LocalStorageKey.cart);
                    await LocalStorageClient.removeItem(LocalStorageKey.orderId);
                    const cartSummary: any = await LocalStorageClient.getItemSummary(LocalStorageKey.cart);
                    dispatch(updateCartState(cartSummary));

                    router.push(`/portal/order-confirm/${response?.data.id}/${response?.data.documentNo}`);
                }
                else {
                    toast({
                        description: `Order Resubmission failed due to:${response?.message}`,
                        variant: 'error'
                    });
                }

            }
            processOrder();

        }
    }

    useEffect(() => {

        const loadDefaultSettings = async () => {

            let userLoggedInSettings = await LocalStorageClient.getItem(LocalStorageKey.user);
            if (userLoggedInSettings) {
                let settings: any = (JSON.parse(userLoggedInSettings)).settings;
                setMasterInfo({
                    destinationCode: settings.destinationPortId,
                    containerSizeCode: settings.containerInfo.shortName,
                    containerSizeName: settings.containerInfo.containerSize,

                    shipmentTermCode: settings.shipmentTermId,
                    shipmentTermName: settings.shipmentTermIdName,

                    paymentTermCode: settings.paymentId,
                    paymentTermName: settings.paymentIdName,

                    shipmentPortCode: settings.shipmentFromId,
                    shipmentPortName: settings.shipmentFromIdName,

                    requiredDispatchDate: cart.dispatchDate != "" ? cart.dispatchDate : settings.dispatchDate
                });
                onDestinationChange(settings.destinationPortId);
                setContainerInfo({
                    weightlimitinkgs: settings.containerInfo.weightLimitinKgs,
                    volumelimitincubicsize: settings.containerInfo.volumeLimitinCubicsize,
                    containerSizename: settings.containerInfo.containerSizename
                })
                setInitialize(true);
            }
        }

        loadDefaultSettings();

    }, []);

    if (!initialize)
        return (<></>)

    const PlaceOrderValidationPasses = () => {
        if ((containerInfo.containerSizename != '20FT-Palletized' && containerInfo.containerSizename != '40FT-Palletized')
            && Number(cart.filledVolume) < Number(80))
            return true;
        else if ((containerInfo.containerSizename == '20FT-Palletized' || containerInfo.containerSizename == '40FT-Palletized')
            && Number(cart.filledVolume) < Number(90))
            return true;
        else
            return false;
    }

    return (
        <>
            {
                loader ? (
                    <Loader />
                ) : null
            }
            <div className="p-4">
                <div className="container">
                    <div className="pb-3 flex justify-end items-center">
                        <h1 className="capitalize text-xl font-semibold">
                            <span className="text-primary">cart</span>
                            <span className="text-black ml-2">{`(${cart.totalItems} items)`}</span>
                        </h1>
                    </div>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="first col-span-12 order-2 md:order-1 md:col-span-7 border border-gray-400 rounded-md px-5 bg-[#fcfcfc] py-4">

                            <form action="" className="grid grid-cols-12 gap-4 ">
                                <div className="col-span-12 md:col-span-6 ">
                                    <div className="w-full mb-3">
                                        <label htmlFor="" className="text-xs text-gray-900 font-semibold capitalize">Destination</label>
                                        <Select onValueChange={onDestinationChange} value={masterInfo.destinationCode.toString()}>
                                            <SelectTrigger className="w-full" >
                                                <SelectValue >{masterInfo.destinationCode?.value}</SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    Destinations?.rows.map((item: any) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>{item.value}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-full mb-3">
                                        <label htmlFor="" className="text-xs text-gray-900 font-semibold capitalize">Shipment Term</label>
                                        <div className="h-10 flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-text">
                                            <label htmlFor="" className="w-full text-popover-foreground">{masterInfo.shipmentTermName}</label>
                                        </div>
                                    </div>
                                    <div className="w-full mb-3">
                                        <div className="flex items-center">
                                            <label htmlFor="" className="text-xs text-gray-900 font-semibold capitalize">Required Dispatch Date</label>
                                            <span className="text-xs text-gray-900 font-semibold capitalize ml-2">(Subject to Approval)</span>
                                        </div>
                                        <input type="date" min={masterInfo.requiredDispatchDate} value={masterInfo.requiredDispatchDate} name="requiredDispatchDate" className="w-full h-[40px] text-sm px-3 focus:ring-2 focus:ring-gray-400 border-input border bg-background cursor-pointer" onChange={onChange} />
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <div className="w-full mb-3">
                                        <label htmlFor="" className="text-xs text-gray-900 font-semibold capitalize">Container Size</label>
                                        {containers?.length > 0 ? (<Select name="containerSizeCode" onValueChange={onContainerChange} value={masterInfo.containerSizeCode.toString()}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue>{masterInfo.containerSizeCode.value}</SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    containers.map((item: any) => (
                                                        <SelectItem key={item.id} value={item.textId.toString()}>{item.value}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>) : <></>}
                                    </div>
                                    <div className="w-full mb-3">
                                        <label htmlFor="" className="text-xs text-gray-900 font-semibold capitalize">Payment Term</label>
                                        <div className="h-10 flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-text">
                                            <label htmlFor="" className="w-full text-popover-foreground">{masterInfo.paymentTermName}</label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-span-12 order-1 md:order-2 md:col-span-5 border border-gray-400 px-5 py-4 rounded-md">
                            <div className="flex justify-between items-center w-full mb-1 text-xs font-semibold capitalize">
                                <span>order carton</span>
                                <span>{cart.totalCartons}</span>
                            </div>
                            <div className="flex justify-between items-center w-full mb-1 text-xs font-semibold capitalize">
                                <span>order value</span>
                                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cart.totalValue)}</span>
                            </div>
                            {
                                cart.isPalletizedContainer ?
                                    (<div className="flex justify-between items-center w-full mb-1 text-xs font-semibold capitalize">
                                        <span>Number of Pallets</span>
                                        <span>{Number(cart.noOfPallet).toFixed(2)} / {cart.allowedPalletsInContainer}</span>
                                    </div>) : (<></>)
                            }

                            <div className="flex justify-between items-center w-full mb-1 text-xs font-semibold capitalize">
                                <span>required dispatch date</span>
                                <span className="text-primary">{new Date(masterInfo.requiredDispatchDate).toLocaleDateString()}</span>
                            </div>
                            <hr className="h-1 w-[100%] bg-gray-400 mx-auto my-3" />
                            <div className="flex justify-between items-center w-full mb-1 text-xs font-semibold capitalize">
                                <span>container max volume</span>
                                <span className="text-primary">{containerInfo.volumelimitincubicsize} cu ft.</span>
                            </div>
                            <div className="flex justify-between items-center w-full mb-1 text-xs font-semibold capitalize">
                                <span>container volume percentage</span>
                                <span className="text-primary">{Number(cart.filledVolume)} %</span>
                            </div>
                            <hr className="h-1 w-[100%] bg-gray-400 mx-auto my-3" />
                            <div className="flex justify-between items-center w-full mb-1 text-xs font-semibold capitalize">
                                <span>container max weight</span>
                                <span className="text-primary">{containerInfo.weightlimitinkgs} kg</span>
                            </div>
                            <div className="flex justify-between items-center w-full mb-1 text-xs font-semibold capitalize">
                                <span>container weight percentage</span>
                                <span className="text-primary">{((Number(cart.filledWeigth) / Number(containerInfo.weightlimitinkgs)) * 100).toFixed(2)} %</span>
                            </div>
                            <hr className="h-1 w-[100%] bg-gray-400 mx-auto my-3" />
                            <div className="flex justify-between items-center w-full mb-1 text-xs font-semibold capitalize">
                                <span>volume is fine</span>
                                {(cart.isPalletizedContainer && Number(cart.filledVolume) > 100) || (!cart.isPalletizedContainer && Number(cart.filledVolume) > 98) ? <span className="text-primary">No</span> : <span>Yes</span>}
                            </div>
                            <div className="flex justify-between items-center w-full mb-1 text-xs font-semibold capitalize">
                                <span>weight is fine</span>
                                {Number(cart.filledWeigth) < Number(containerInfo.weightlimitinkgs) ? <span>Yes</span> : <span className="text-primary">No</span>}
                            </div>
                            {
                                cart.isPalletizedContainer ?
                                    (<div className="flex justify-between items-center w-full mb-1 text-xs font-semibold capitalize">
                                        <span>Pallet Status</span>
                                        {Number(cart.noOfPallet) <= Number(cart.allowedPalletsInContainer) ? <span>Within Limit</span> : <span className="text-primary">Exceeded</span>}
                                    </div>) : (<></>)
                            }
                            <hr className="h-1 w-[100%] bg-gray-400 mx-auto my-3" />
                            <div className="flex flex-col w-full mb-1">
                                <label htmlFor="" className="text-xs font-semibold capitalize">Comment</label>
                                <textarea onChange={handleCustomerComment} className="border border-gray-400 rounded-md p-2 resize-none text-xs font-medium" placeholder="Write comment" name={masterInfo.customerComments} value={masterInfo.customerComments} />
                            </div>
                            {
                                cart.isPalletizedContainer ?
                                    (<button type="button" onClick={processOrder} disabled={Number(cart.filledVolume) < Number(90)} className="bg-primary text-white border-none text-sm p-2 rounded-md w-full flex justify-center items-center mt-3 font-medium hover:bg-primary-hover disabled:opacity-30 disabled:cursor-not-allowed">Place Order</button>) : (<button type="button" onClick={processOrder} disabled={Number(cart.filledVolume) < Number(80)} className="bg-primary text-white border-none text-sm p-2 rounded-md w-full flex justify-center items-center mt-3 font-medium hover:bg-primary-hover disabled:opacity-30 disabled:cursor-not-allowed">Place Order</button>)
                            }
                            {
                                ((!cart.isPalletizedContainer && Number(cart.filledVolume) < Number(80)) || (cart.isPalletizedContainer && Number(cart.filledVolume) < Number(90))) ? (
                                    <span className="text-red-500">
                                        Add more items to the cart to reach minimum quantity
                                    </span>) : (<></>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
