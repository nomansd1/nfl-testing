'use client'
import OrderDetail from "@/components/order-history/OrderDetail";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2Icon, ExternalLink, Link, MessageSquare, RefreshCw, SearchIcon, XCircleIcon } from "lucide-react";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { FetchDataToReOrder, GenerateReport, GetOrderDetailsById, GetOrderHistory, UpdateOrderStatus } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";
import Loader from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";
import { LocalStorageClient, LocalStorageKey } from "@/lib/db/local-storage";
import { useDispatch } from "react-redux";
import { updateCartState } from "@/store/cart-reducer";
import { useRouter } from "next/navigation";
import OrderChat from "@/components/order-history/OrderChat";


export default function page() {


  const [orders, setOrders] = useState<any>([]);

  const [pageIndex, setPageIndex] = useState(0);
  const [orderNo, setOrderNo] = useState('');
  const [morePrdLoader, setMorePrdLoader] = useState(false);
  const [printLoader, setPrintLoader] = useState(false);

  const [actionMessage, setActionMessage] = useState('');
  const { toast } = useToast();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      setMorePrdLoader(true);
      let data = await GetOrderHistory({ pageIndex: pageIndex, orderNo: orderNo });
      setMorePrdLoader(false);

      if (pageIndex > 0)
        setOrders([...orders, ...data?.data?.rows]);
      else
        setOrders(data?.data?.rows);
    }

    if (pageIndex >= 0)
      loadProducts();
    else {
      toast({
        title: actionMessage,
        variant: 'success'
      });
      setPageIndex(0);
    }
  }, [pageIndex, orderNo]);

  const loadMoreOrders = () => {
    setPageIndex(pageIndex + 1);
  }

  const search = (event: ChangeEvent<HTMLInputElement>) => {
    setOrderNo(event.target.value);
    setPageIndex(0);
  }

  const print = (orderId: number) => {
    const printReport = async () => {
      setPrintLoader(true);
      const response = await GenerateReport({ orderId });
      setPrintLoader(false);
      if (response?.statusCode === 0 || response?.statusCode === 200) {
        window.open(response?.data);
      }

    }
    printReport();
  }

  const UpdateStatus = (orderId: number, orderNo: string, isConfirmed: boolean, isCancelled: boolean) => {
    const TriggerUpdateStatus = async () => {
      setPrintLoader(true);
      const response = await UpdateOrderStatus({ orderId, isConfirmed, isCancelled });
      setPrintLoader(false);
      setActionMessage(`Your Order#${orderNo} has been ${isConfirmed ? "Confirmed" : "Cancelled"}`);
      setPageIndex(-1);
    }
    TriggerUpdateStatus();

  }

  const ReOrder = (orderId: number) => {
    const TriggerUpdateStatus = async () => {
      setPrintLoader(true);
      const response = await FetchDataToReOrder({ orderId });
      await LocalStorageClient.removeItem(LocalStorageKey.cart);
      await LocalStorageClient.updateCartInBulk(LocalStorageKey.cart, response?.data?.row.products);
      await LocalStorageClient.addItem(LocalStorageKey.orderId, JSON.stringify({ id: orderId }));
      setPrintLoader(false);

      // Recalculate the volumn & others necessary values against updated capacity
      const cartSummary: any = await LocalStorageClient.getItemSummary(LocalStorageKey.cart);
      dispatch(updateCartState(cartSummary));
      router.push('/portal/checkout');

    }

    TriggerUpdateStatus();
  }

  return (
    <>
      {
        printLoader ? (
          <Loader />
        ) : null
      }
      <div className="p-4">
        <div className="container">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="capitalize text-xl font-bold text-primary">order history</h1>
            </div>
            <div className="flex items-center rounded bg-[#F5F5F5] px-2">
              <input type="text" onChange={search} className="px-2 py-1.5 text-sm bg-transparent placeholder:text-gray-800" placeholder="Search" />
              <SearchIcon size={14} className="mr-2 text-gray-800" />
            </div>
          </div>
          <div className="order__history mt-5">
            <table className="w-full">
              <thead className="capitalize text-sm text-black">
                <tr>
                  <th></th>
                  <th>order no</th>
                  <th>order date</th>
                  <th>require dispatch date</th>
                  <th>order value</th>
                  <th>special instruction</th>
                  <th>order status</th>
                  <th>Chat</th>
                </tr>
              </thead>
              <tbody>
                {
                  orders?.map((item: any) => (
                    <tr key={item.id}>
                      <td>
                        <span className="flex items-center justify-center">
                          <Dialog>
                            <DialogTrigger className="text-primary hover:text-primary-hover">
                              <ExternalLink size={16} />
                            </DialogTrigger>
                            <DialogContent className="max-w-full md:max-w-[50%] h-[557px] flex flex-col overflow-hidden z-[300]">
                              <OrderDetail key={item.id} orderId={item.id} orderNo={item.orderNo} totalItems={item.numberofItems} orderValue={item.orderValue} />
                            </DialogContent>
                          </Dialog>
                        </span>
                      </td>
                      <td>
                        <button type="button" className="cursor-pointer px-2 py-0.5 text-sm text-primary font-medium hover:text-primary-hover hover:border-primary-hover" onClick={() => print(item.id)}>{item.orderNo}</button>
                      </td>
                      <td>
                        <span>
                          {item.orderDate}
                        </span>
                      </td>
                      <td>
                        <span>
                          {item.requireDispatchDate}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.orderValue)}
                        </span>
                      </td>
                      <td>
                        <span className="text-[11px]">
                          {item.specialInstruction ?? ""}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-between items-center">
                          <span className="!text-[11px] bg-[#d4d4f9] px-5 py-1 rounded">
                            {item.orderStatus}
                          </span>
                          {item.orderStatus === "Confirmation Required From Customer" ? (<span>
                            <button type="button" onClick={() => UpdateStatus(item.id, item.orderNo, false, true)} className="py-1 rounded text-gray-600 hover:text-primary-hover">
                              <XCircleIcon size={20} />
                            </button>
                            <button type="button" onClick={() => UpdateStatus(item.id, item.orderNo, true, false)} className="py-1 rounded text-gray-600 hover:text-primary-hover ml-1.5">
                              <CheckCircle2Icon size={20} />
                            </button>
                          </span>) : (<></>)}

                          {item.orderStatus == "Fwd. To Customer" ?
                            (<button type="button" onClick={() => ReOrder(item.id)} className="py-1 rounded text-gray-600 hover:text-primary-hover ml-1.5">
                              <RefreshCw size={20} />
                            </button>) :
                            (<></>)}


                        </div>
                      </td>
                      <td>
                        <span className="flex items-center justify-center">
                          <Dialog>
                            <DialogTrigger className="text-primary hover:text-primary-hover">
                              <MessageSquare size={16} />
                            </DialogTrigger>
                            <DialogContent className="max-w-full md:max-w-[50%] h-[557px] flex flex-col overflow-hidden z-[300]">
                              <OrderChat orderId={item.id} orderNo={item.orderNo} />
                            </DialogContent>
                          </Dialog>
                        </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          <div className="w-full">
            {
              morePrdLoader ? Array.from({ length: 10 }).map((_: any, index: any) => (
                <Skeleton key={index} className="w-full h-[40px] animate-pulse bg-gray-300 mb-2" />
              )) : null
            }
          </div>
          <div className="w-full flex justify-center items-center my-2">
            <button type="button" onClick={loadMoreOrders} className="inline-flex items-center bg-primary text-white hover:bg-primary-hover px-5 py-2 font-medium text-sm capitalize rounded-md">
              <span className="mr-2">view more</span>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
