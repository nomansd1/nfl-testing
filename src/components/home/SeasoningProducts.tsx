import SeasoningProductsCarousel from "./SeasoningProductsCarousel";

export default function SeasoningProducts() {

    const products: any = [
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4},
        {id: 5},
    ]

  return <SeasoningProductsCarousel seasoningProducts={products}/>
}
