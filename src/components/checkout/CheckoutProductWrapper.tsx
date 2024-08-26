'use client';
import { useEffect, useState } from "react";
import { LocalStorageClient, LocalStorageKey } from "@/lib/db/local-storage";
import CheckoutProduct from "./CheckoutProduct";
import { useDispatch } from "react-redux";
import { updateCartState } from "@/store/cart-reducer";
import { Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { loggedInUser } from "@/store/session-reducer";


export default function CheckoutProductWrapper() {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [iscartReady, setCartReady] = useState(false);
  const user = useSelector(loggedInUser);

  useEffect(() => {
    const loadCart = async () => {
      let cart: any = await LocalStorageClient.getItem(LocalStorageKey.cart);
      if (cart)
        setProducts(JSON.parse(cart));
      else
        setProducts([]);

      setCartReady(true);
    }
    loadCart();

  }, [iscartReady]);

  const refreshCart = () => {
    setCartReady(false);
  }

  const emptyEntireCart = () => {
    const emptyCart = async () => {
      await LocalStorageClient.removeItem(LocalStorageKey.cart);
      let cartSummary = await LocalStorageClient.getItemSummary(LocalStorageKey.cart);
      dispatch(updateCartState(cartSummary));
      refreshCart();
    }
    emptyCart();
  }

  useEffect(() => {
    refreshCart();
  }, [user?.settings?.variantId])

  if (!iscartReady)
    return (<>Loading...</>)
  return (
    <div className="container pb-3">
      <div className="flex justify-end items-center">
        <button onClick={emptyEntireCart} className={`${products.length > 0 ? 'inline-flex' : 'hidden'} items-center rounded-md bg-primary hover:bg-primary-hover text-white text-xs capitalize font-medium mr-2 px-3 py-1.5`}>
          <Trash2 size={16} />
          <span className="ml-2">empty cart</span>
        </button>
      </div>
      {
        products.map((item: any) => (
          <CheckoutProduct key={item.id} product={item} refreshCart={refreshCart} />
        ))
      }

    </div>
  )
}
