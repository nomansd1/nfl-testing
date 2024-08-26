import Image from "next/image"
import Link from "next/link"
import { GetClassifications, 
  GetClassificationProductCount, 
  GetPriceOptions, 
  GetVariants } from '@/app/portal/actions';
import { ProductsGrid } from "@/components/shared";
import CategoryWrapper from "@/components/category/CategoryWrapper";

export default async function page({ params }: { params: { slug?: string[] } }) {
  
  let listOfClassifications = GetClassifications();
  let listOfClassificationsWithProductCount = GetClassificationProductCount({variantId:0});
  let listOfPriceOptions = GetPriceOptions();
  let listOfVariants = GetVariants();

  let [classifications, classifyProducts, priceOptions, variants] = await Promise.all([listOfClassifications, listOfClassificationsWithProductCount, listOfPriceOptions, listOfVariants]);

  return (
    <CategoryWrapper classifications={classifications} classifyProducts={classifyProducts} priceOptions={priceOptions} variants={variants} params={params} />
  )
}
