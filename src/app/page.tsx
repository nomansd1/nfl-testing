'use client'
import { useEffect, useState } from "react";
import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'
import { useFormState } from 'react-dom'
import { loginUser } from '@/app/action'
import { useToast } from "@/components/ui/use-toast";
import { FormState } from "@/lib/utilities/form-helper";
import { useRouter } from "next/navigation";
import Submit from "@/components/ui/submit";
import Loader from "@/components/ui/loader";
import { LocalStorageClient, LocalStorageKey } from "@/lib/db/local-storage";

const initialState: FormState = { message: "" };

export default function Home() {

  const { toast } = useToast();
  const router = useRouter();


  const [state, dispatch] = useFormState(loginUser, initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (state?.statusCode) {
      console.log(state);
      toast({
        title: state?.message,
        description: state?.message,
        variant: state?.statusCode === 0 ? 'success' : 'error'
      });
    }
    if (state?.statusCode === 0) {
      setLoading(true);

      const loginRedirect = async () => {
        await LocalStorageClient.addItem(LocalStorageKey.user, JSON.stringify(state?.data?.loggedInUserInfo));
        router.push('/portal');
      }
      loginRedirect();

    }
  }, [state, toast]);

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="flex justify-center items-center h-screen w-full relative">
        <div className="w-[50%] h-full"></div>
        <div className="w-[50%] h-full bg-primary md:block hidden"></div>
        <div className="absolute top-5 w-full h-fit mx-auto">
          <div className="relative max-w-screen-xl mx-auto px-4">
            <Link href="/">
              <Image src="/assets/nfllogo.png" width={100} height={50} className='md:w-[130px] md:h-[55px] ' alt="" />
            </Link>
          </div>
        </div>
        <div
          className="absolute w-full md:w-[90%] lg:w-[70%] h-[65%] max-h-[530px] flex justify-center items-center max-w-screen-lg">
          <div className="w-[50%] h-full bg-[rgba(0,0,0,.05)] rounded-tl-[3rem] rounded-bl-[3rem] md:block hidden"></div>
          <div className="w-[50%] h-full bg-[rgba(255,255,255,.3)] rounded-br-[3rem] rounded-tr-[3rem] md:block hidden">
          </div>
          <div className="flex justify-center items-center absolute w-[90%] h-[80%] mx-auto">
            <div
              className="w-full md:w-[50%] h-full bg-white rounded-tl-[3rem] rounded-bl-[3rem] p-10 flex flex-col justify-center ">
              <h1 className="text-2xl font-semibold">Login to the Account</h1>
              <p className="mb-7 font-normal">Please enter your credentials</p>

              <form action={dispatch}>
                <div className="flex items-center relative mb-4">
                  <input type="email" id="email" name="username" required
                    className="block px-2.5 pb-2 pt-2 w-full text-base font-medium text-gray-400 bg-transparent rounded-lg border-2 border-gray-400 focus:ring-0 focus:border-primary peer focus:outline-none"
                  />
                  <label htmlFor="email"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email</label>
                </div>
                <div className="flex items-center relative mb-2">
                  <input type="password" id="password" name="password" required
                    className="block px-2.5 pb-2 pt-2 w-full text-base font-medium text-gray-400 bg-transparent rounded-lg border-2 border-gray-400 focus:ring-0 focus:border-primary peer focus:outline-none"
                  />
                  <label htmlFor={"password"}
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Password</label>
                </div>
                <div className="w-full flex justify-end items-center">
                  <a href="/" className="hover:underline text-sm text-blue-600">Forgot Password?</a>
                </div>
                <Submit defaultLabel="Login" processingLabel={'Login'} />
              </form>
            </div>
            <div
              className={`w-[50%] h-full ${styles.login__bgimg} overflow-hidden rounded-tr-[3rem] rounded-br-[3rem] p-10 md:block hidden`}>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}
