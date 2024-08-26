import { CheckoutForm, CheckoutProductWrapper } from "@/components/checkout";
import Loader from "@/components/ui/loader";
import { Suspense } from "react";
import { GetListOfValues, GetMinRequiredDispatchDate } from "../actions";
import { CheckoutKeys } from "@/lib/constants/Constants";
const page = async () => {
  const listOfDestinations = GetListOfValues(CheckoutKeys.DESTINATION_PORT);

  const [Destinations] = await Promise.all([listOfDestinations]); 

  return (
    <Suspense fallback={<Loader />}>
      <CheckoutForm Destinations={Destinations?.data} />
      <CheckoutProductWrapper />
    </Suspense>
  )
}

export default page;
