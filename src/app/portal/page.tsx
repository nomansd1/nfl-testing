import { 
  Banner, 
  MonthlyDealsWrapper, 
  ProductsWrapper, 
  Services, 
  ShopByCategory, 
  SubBanner 
} from "@/components/home/index";

export default function page() {
  return (
    <div>
      <Banner />
      <ShopByCategory/>
      <ProductsWrapper/>
      <MonthlyDealsWrapper/>
      <SubBanner/>
      <Services/>
    </div>
  )
}

