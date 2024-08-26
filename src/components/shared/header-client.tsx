'use client'
import Image from "next/image"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { loggedInUser, login, logout, updateSettings } from "@/store/session-reducer"
import { useEffect, useState } from "react"
import { GetVariants, UserLogout } from "@/app/portal/actions"
import { useRouter, usePathname } from "next/navigation";
import Loader from "@/components/ui/loader";
import { LocalStorageClient, LocalStorageKey } from "@/lib/db/local-storage";
import { ChevronDownIcon, Container, LogOutIcon } from "lucide-react";
import { totalItems, updateCartState } from "@/store/cart-reducer";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "../ui/dialog";
import { ShippingDetail } from ".";

export const HeaderClient = ({ classifications, Destinations }: { classifications: any, Destinations: any }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector(loggedInUser);
    const cart = useSelector(totalItems);

    const [variants, setVariants] = useState([]);
    const [variantId, setVariantId] = useState('');

    let keyword: string = "";

    useEffect(() => {

        const loginHandler = async () => {

            const data: any = await LocalStorageClient.getItem(LocalStorageKey.user);            
            dispatch(login(JSON.parse(data)));

            const cartSummary: any = await LocalStorageClient.getItemSummary(LocalStorageKey.cart);
            dispatch(updateCartState(cartSummary));

            let defaultFilterCode = (JSON.parse(data))?.defaultFilterCode;
            setVariantId(defaultFilterCode);
            setVariants((await GetVariants())?.data?.rows);

            dispatch(updateSettings({ variantId: defaultFilterCode }));
        };
        loginHandler();

    }, [user.isLoggedIn]);

    const trackKeywork = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit((event.target as HTMLInputElement).value); // Trigger form submission manually
        }
    }

    const handleSubmit = (value: string) => {
        router.push(`/portal/search/product/${value}`);
    };

    const handlerLogout = async () => {
        setLoading(true);

        await UserLogout();
        await LocalStorageClient.removeItem(LocalStorageKey.user);
        await LocalStorageClient.removeItem(LocalStorageKey.checkout);
        await LocalStorageClient.removeItem(LocalStorageKey.cart);
        await LocalStorageClient.removeItem(LocalStorageKey.orderId);

        dispatch(logout(null));
        router.push('/');
    }

    const handleChange = (event: any) => {
        if (window.confirm('Changing your selection will clear your current cart. Are you sure you want to proceed?')) {
            setVariantId(event.target.value);
            const updateUserLoggedInInfo = async (value: string) => {
                let userLoggedInSettings = await LocalStorageClient.getItem(LocalStorageKey.user);
                if (userLoggedInSettings) {
                    let userInfo = (JSON.parse(userLoggedInSettings));
                    userInfo.defaultFilterCode = value;
                    await LocalStorageClient.addOrUpdateItem(LocalStorageKey.user, userInfo);
                    await LocalStorageClient.removeItem(LocalStorageKey.cart);

                    const cartSummary: any = await LocalStorageClient.getItemSummary(LocalStorageKey.cart);
                    dispatch(updateCartState(cartSummary));

                    dispatch(updateSettings({ variantId: value }));
                }
            }
            updateUserLoggedInInfo(event.target.value);
        } else {
            event.target.value = variantId; // Revert selection
        }
    };

    return (
        <>
            {loading ? <Loader /> : null}
            <header className="bg-primary py-1">
                <nav className="px-4 lg:px-6 py-2.5">
                    <div className="flex flex-wrap justify-between items-center mx-auto container">
                        <div className="flex items-center">
                            <Link href="/portal" className="flex items-center">
                                <Image src="/assets/nfllogo.png" width={100} height={50} alt="NFL logo" />
                            </Link>
                            <Dialog>
                                <DialogTrigger className="text-sm text-white font-medium ml-4 flex items-center">
                                    <Container size={24} color="white" />
                                    <span className="ml-2">Container Size</span>
                                </DialogTrigger>
                                <DialogContent className="z-[300] w-[500px]">
                                    <ShippingDetail classifications={classifications} Destinations={Destinations} DialogClose={DialogClose} />
                                </DialogContent>
                            </Dialog>
                            {(<span> | </span>)}
                            <div className="flex flex-wrap justify-between items-center mx-auto ">
                                <select value={variantId} onChange={handleChange} >
                                    {variants?.map((option: any) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="hidden relative lg:flex -my-5  bg-white rounded-md flex-shrink w-[40%]">
                            <div className="flex flex-1 flex-row-reverse justify-center items-center p-1 w-full">
                                <Image src="/assets/search.svg" width={20} height={20} className="mr-3 cursor-pointer" alt="" />
                                <input type="text" placeholder="Search for Products" onKeyDown={trackKeywork}
                                    className="search_bar h-full w-full focus:outline-none py-1 px-2 placeholder:text-[#C1C1C8] placeholder:text-xs text-sm active:outline-none border-none" />
                            </div>
                        </div>
                        <div className="flex flex-row-reverse items-center justify-between w-fit">
                            <Popover>
                                <PopoverTrigger className="flex items-center text-sm rounded-full md:me-0 overflow-hidden">
                                    <Image className="rounded-full" width={24} height={24} src="/assets/user.svg" alt="user avatar" />
                                    <span className="text-white text-left text-xs ml-2 capitalize font-medium hidden md:flex text-ellipsis ">{user.info?.name}</span>
                                    <ChevronDownIcon size={16} className="text-white" />
                                </PopoverTrigger>
                                <PopoverContent className="p-2">
                                    <div className="p-2 hover:bg-gray-100 rounded-md flex items-center">
                                        <Image className="rounded-full filter invert" width={24} height={24} src="/assets/user.svg" alt="user avatar" />
                                        <div className="ml-4">
                                            <span className="block text-sm font-semibold text-gray-900 capitalize">{user.info?.name}</span>
                                            <span className="block text-sm  text-gray-500 truncate">{user.info?.email}</span>
                                        </div>
                                    </div>
                                    <button type="button" className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" onClick={handlerLogout}>
                                        <LogOutIcon size={24} className="mr-4" />
                                        <span>Logout</span>
                                    </button>
                                </PopoverContent>
                            </Popover>
                            <Link href="/portal/checkout"
                                className="flex items-center font-medium rounded-lg text-sm pr-2 lg:pr-5 focus:outline-none text-white">
                                <Image src="/assets/shopping-bag.png" width={24} height={24} className="mr-1" alt="" />
                                <sup className="text-[11px] font-medium text-primary bg-gray-100 rounded-md w-3.5 h-3.5 flex items-center justify-center">{cart.totalItems}</sup>
                            </Link>
                            <Link href="/portal/order-history"
                                className="flex items-center font-medium rounded-lg text-sm pr-2 lg:pr-5 focus:outline-none text-white">
                                <Image src="/assets/order-history.svg" width={17} height={17} className="mr-1 invert" alt="" />
                            </Link>
                        </div>
                    </div>
                </nav>
                <nav className="bg-white py-1.5">
                    <div
                        className="justify-between items-center w-full flex max-w-screen-xl mx-auto overflow-x-scroll no__scroll  px-3 lg:px-0">
                        <ul className="flex font-medium space-x-8 mx-auto w-auto">
                            {classifications?.rows.map((items: any) => (
                                <li key={items.id}>
                                    <Link
                                        href={`/portal/category/${items.id}`}
                                        className={`text-[#524f4f] text-sm capitalize whitespace-nowrap hover:text-primary ${pathname === `/portal/category/${items.id}` ? 'text-primary font-semibold' : ''}`}
                                    >{items.value}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    )

}