
import { CheckoutKeys } from '@/lib/constants/Constants';
import { HeaderClient } from './header-client'
import { GetClassifications, GetListOfValues } from '@/app/portal/actions';

async function Header() {
  const listOfclassification = GetClassifications();
  const listOfDestinations = GetListOfValues(CheckoutKeys.DESTINATION_PORT);

  const [Classifications, Destinations] = await Promise.all([listOfclassification, listOfDestinations]); 


  return (
    <HeaderClient classifications={Classifications.data} Destinations={Destinations?.data} />
  )

}

export default Header