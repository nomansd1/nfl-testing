"use client"

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { GetContainerInfoByParams, GetListOfValues, UpdateItemCapacityByParams } from '@/app/portal/actions';
import { CheckoutKeys } from '@/lib/constants/Constants';
import { LocalStorageClient, LocalStorageKey } from '@/lib/db/local-storage';
import { updateCartState } from '@/store/cart-reducer';
import { useDispatch } from 'react-redux';
import { CpuIcon } from 'lucide-react';

export default function ShippingDetail({ classifications, Destinations, DialogClose }: any) {

    const dispatch = useDispatch();

    const [initialize, setInitialize] = useState(false);
    const [masterInfo, setMasterInfo] = useState<any>();
    const [containers, setContainers] = useState<any>([]);

    const onDestinationChange = (destination: string) => {
        setMasterInfo({ ...masterInfo, destinationCode: destination })
        let loadContainer = async (param: number) => {
            let data = await GetListOfValues(`${CheckoutKeys.CONTAINER}?shippingPort=${param}`);
            setContainers(data?.data?.rows);
        }
        loadContainer(Number(destination));

    }

    const onContainerChange = (container: string) => {
        setMasterInfo({ ...masterInfo, containerSizeCode: container });

        const loadContainerInfo = async (param: string) => {
            console.log(`Contrainer info against ${param}`);
            const selectedContainerInfo: any = await GetContainerInfoByParams(`${CheckoutKeys.CONTAINER_INFO}?containerSize=${param}&Shippingport=${masterInfo.destinationCode}`);
            let userLoggedInSettings = await LocalStorageClient.getItem(LocalStorageKey.user);
            
            if (userLoggedInSettings && userLoggedInSettings != typeof(undefined)) {
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
        }
        loadContainerInfo(container);
    }

    useEffect(() => {

        const loadDefaultSettings = async () => {

            let userLoggedInSettings = await LocalStorageClient.getItem(LocalStorageKey.user);
            if (userLoggedInSettings) {
                let userInfo = (JSON.parse(userLoggedInSettings));

                setMasterInfo({
                    destinationCode: userInfo.settings.destinationPortId,
                    containerSizeCode: userInfo.settings.containerInfo.shortName,
                    containerSizeName: userInfo.settings.containerInfo.containerSize
                });
                onDestinationChange(userInfo.settings.destinationPortId);             
                setInitialize(true);
            }
        }

        loadDefaultSettings();

    }, []);

    if (!initialize)
        return (<></>)

    return (
        <div className="w-full p-5">
            <div className='w-full'>
                <div className="w-full">
                    <div className="w-full mb-3">
                        <label htmlFor="" className='text-sm font-semibold capitalize'>Destination</label>
                        <Select onValueChange={onDestinationChange} value={masterInfo.destinationCode.toString()}>
                            <SelectTrigger className="w-full" >
                                <SelectValue >{masterInfo.destinationCode?.value}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className='z-[301]'>
                                {
                                    Destinations?.rows.map((item: any) => (
                                        <SelectItem key={item.id} value={item.id.toString()}>{item.value}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full">
                        <div className="w-full mb-3">
                            <label htmlFor="" className='text-sm font-semibold capitalize'>Container Size </label>
                            {containers?.length > 0 ? (<Select name="containerSizeCode" onValueChange={onContainerChange} value={masterInfo.containerSizeCode?.toString()}>
                                <SelectTrigger className="w-full">
                                    <SelectValue>{masterInfo.containerSizeCode?.value}</SelectValue>
                                </SelectTrigger>
                                <SelectContent className='z-[301]'>
                                    {
                                        containers.map((item: any) => (
                                            <SelectItem key={item.id} value={item.textId.toString()}>{item.value}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>) : <></>}
                        </div>
                    </div>

                </div>
            </div>
            <DialogClose asChild>
                <button type='submit' className='bg-primary hover:bg-primary-hover px-3 py-2 text-white capitalize text-sm rounded-md w-full'>Close</button>
            </DialogClose>
        </div >
    )
}
