import { ProductsGrid } from "@/components/shared";

export default async function page({ params }: { params: { slug: string[] } }) {
  return (
    <ProductsGrid InitialProducts={[]} Categories={[]} Variants={[]} PriceOptions={[]} FilterBy={params.slug[0]} FilterValue={params.slug[1]} />
  )
}