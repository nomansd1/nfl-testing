'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Product, ProductsLoader } from ".";
import { ArrowBigUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { GetProductsByParams, GetProductFilterBy } from "@/app/portal/actions";
import { useSelector } from "react-redux";
import { loggedInUser } from "@/store/session-reducer";

export default function ProductsGrid({ InitialProducts, Categories, Variants, PriceOptions, FilterBy, FilterValue }: { InitialProducts: any, Categories: any, Variants: any, PriceOptions: any, FilterBy: string, FilterValue: string }) {

  const [products, setProducts] = useState(InitialProducts);

  const [pageIndex, setPageIndex] = useState(0);
  const [filterBy, setFilteredBy] = useState(FilterBy);
  const [filterValue, setFilteredValue] = useState(FilterValue);
  const [orderBy, setOrderBy] = useState('Asc');
  const [productFilterBy, setProductFilterBy] = useState([]);

  const [morePrdLoader, setMorePrdLoader] = useState(false);
  const [totalAvailableRecords, setTotalAvailableRecords] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(false);
  const user = useSelector(loggedInUser);

  useEffect(() => {
    const loadProducts = async () => {
      let preFilterVariantId: number = user?.settings?.variantId;

      setMorePrdLoader(true);
      let data = await GetProductsByParams({ pageIndex: pageIndex, orderByColumn: "SORTINGORDER", filterBy: filterBy, filterValue: filterValue, preFilteredVariantId: preFilterVariantId });
      setMorePrdLoader(false);

      if (pageIndex > 0)
        setProducts([...products, ...data?.data?.rows]);
      else
        setProducts(data?.data?.rows);

      setTotalAvailableRecords(data?.data?.totalAvailableRecords);
    }

    loadProducts();
  }, [pageIndex, filterValue, filterBy, forceRefresh]);

  useEffect(() => {
    setPageIndex(0);
    setForceRefresh(!forceRefresh ? true : false);
  }, [user?.settings?.variantId])

  useEffect(() => {
    const loadProductFilterBy = async () => {
      let data = await GetProductFilterBy();
      setProductFilterBy(data?.data?.rows);
    };

    loadProductFilterBy();
  }, []);

  const loadMoreProducts = () => {
    setPageIndex(pageIndex + 1);
  }
  const filteredByOnChange = (value: string) => {
    setFilteredValue("0");
    setFilteredBy(value);
    setProducts([]);
  }
  const onFilterChange = (value: string) => {
    setProducts([]);
    setFilteredValue(value);

    setPageIndex(0);
  }

  const orderByOnChange = () => {
    if (orderBy.toUpperCase() === "ASC") {
      setOrderBy("DESC");
    }
    else {
      setOrderBy("ASC");
    }
  }

  return (
    <div className="py-10 px-4">
      <div className="container">
        {Categories?.length > 0 && (<div className="w-full flex justify-end items-center">
          <Select onValueChange={filteredByOnChange}>
            <SelectTrigger className="w-[130px] mr-2">
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="category" value="category">Category</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterValue} onValueChange={onFilterChange}>
            <SelectTrigger className="w-[180px]">
              {<SelectValue placeholder="All" />}
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={0} value="0">All</SelectItem>
              {filterBy === "category" ?
                Categories?.map((item: any) => (
                  <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                )) : filterBy === "variant" ?
                  Variants.map((item: any) => (
                    <SelectItem key={item.id} value={item.id.toString()}>{item.value}</SelectItem>
                  )) : (<></>)
              }
            </SelectContent>
          </Select>
          <button className="ml-2" onClick={orderByOnChange}>
            <ArrowBigUpIcon className={`${orderBy === 'DESC' ? 'scale-y-[-1]' : ''} text-primary fill-primary text-lg transition-all duration-300 ease-linear`} />
          </button>
        </div>)}
        <div className="flex flex-wrap justify-center items-center sm:grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mx-auto gap-x-5 gap-y-7 my-10">
          {
            products?.map((item: any) => (
              <Product key={item.id} Product={item} />
            ))
          }
          {
            morePrdLoader ? Array.from({ length: 10 }).map((_: any, index: any) => (
              <ProductsLoader key={index} />
            )) : null
          }
        </div>

        <div className={`w-full ${(products?.length >= 10 && products?.length < totalAvailableRecords) ? 'flex' : 'hidden'} justify-center items-center mt-5`}>
          <button onClick={loadMoreProducts} className="px-10 py-2.5 bg-primary hover:bg-primary-hover text-white capitalize text-sm rounded-md font-medium">load more</button>
        </div>
      </div>
    </div>
  )
}
