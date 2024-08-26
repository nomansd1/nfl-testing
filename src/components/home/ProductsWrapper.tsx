import { ProductsGrid } from "../shared/index";
import { GetClassificationProductCount, GetPriceOptions, GetVariants } from "@/app/portal/actions";

export default async function ProductsWrapper() {
  let listOfClassifications = GetClassificationProductCount({ variantId: 0 });
  let listOfPriceOptions = GetPriceOptions();
  let listOfVariants = GetVariants();

  let [classifications, priceOptions, variants] = await Promise.all([listOfClassifications, listOfPriceOptions, listOfVariants]);
  return <ProductsGrid InitialProducts={[]} Categories={classifications?.data?.rows} Variants={variants?.data?.rows} PriceOptions={priceOptions} FilterBy="category" FilterValue="" />
}
