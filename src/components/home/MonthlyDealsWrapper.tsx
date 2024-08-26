import { ArrowRightIcon } from "lucide-react";
import MonthlyDealsCarousel from "./MonthlyDealsCarousel";
import { GetCollections } from "@/app/portal/actions";

export default async function MonthlyDealsWrapper() {

    const listOfCollections: any = await GetCollections();

    if (listOfCollections.data?.rows?.length === 0)
        return (<></>)

    return (
        <>
            {
                listOfCollections.data?.rows.map((item: any) => (
                    <div key={item.id} className="bg-[#ededed] py-10 px-4">
                        <div className="container">
                            <div className="flex items-center">
                                <h1 className="text-3xl font-nfl text-primary font-bold capitalize">{item.name}</h1>
                                {/* <button className="flex items-center ml-5 text-primary">
                                    <Link href={`/portal/search/collection/${item.id}`}><span className="mr-2 text-lg font-semibold">see all</span></Link>
                                    <ArrowRightIcon className="text-sm font-medium" />
                                </button> */}
                            </div>
                            <MonthlyDealsCarousel key={item.id} CollectionId={item.id} Deals={item.collection02DetailsList} />
                        </div>
                    </div>

                ))

            }
        </>
    )
}
