'use client'
import { GetOrderDetailsById } from '@/app/portal/actions';
import Loading from '@/app/portal/loading';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function OrderDetail({ orderId, orderNo, totalItems, orderValue }: { orderId: number, orderNo: string, totalItems: number, orderValue: number }) {
    const [products, setProducts] = useState<any>();

    useEffect(() => {
        const loadProducts = async () => {
            let data = await GetOrderDetailsById({ orderId: orderId });
            setProducts(data?.data?.rows);
        }

        loadProducts();
    }, []);
    if (products === null)
        return (<><Loading></Loading></>)
    return (

        <div className='p-4 flex-1 flex flex-col'>
            <h1 className='text-lg font-bold'>
                <span className='text-black'>Order No: </span>
                <span className='text-primary'>{orderNo}</span>
            </h1>
            <div className='w-full order__detailBx my-2'>
                <table className='order__detail'>
                    <thead>
                        <tr>
                            <th>S#</th>
                            <th>Products</th>
                            <th>Carton</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products?.map((item: any, index: number) => (
                                <tr key={item.id}>
                                    <td>{index+1}</td>
                                    <td>
                                        <div className='flex p-1 pl-0'>
                                            <div className='w-fit h-fit flex justify-start'>
                                                <Image src={item.image} width={60} height={40} alt='' />
                                            </div>
                                            <div>
                                                <h1 className='text-sm font-extrabold font-nfl text-primary'>{item.productName}</h1>
                                                <p className='text-[#737374] text-xs'>{item.description ?? item.shortName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{item.carton}</td>
                                    <td>  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.orderValue)}</td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderDetail