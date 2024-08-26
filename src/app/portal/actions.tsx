'use server'
import { API_BASE, REPORT_URL } from "@/lib/constants/Constants";
import { clearAllCookies, enCookie, setCookieWithDefaults } from "@/lib/utilities/cookies-helper";
import { FormState } from "@/lib/utilities/form-helper";
import { DEFAULT_REVALIDATE_IN_MINUTES, GetContainerInfo, GetHeaderWithToken, GetToken } from "@/lib/utilities/http-client-helper";
export async function UserLogout() {
    clearAllCookies();
}

export async function GetClassifications() {

    let response = await fetch(`${API_BASE}/ProductClassification`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store'
        //next: { revalidate: DEFAULT_REVALIDATE_IN_MINUTES }
    })

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}


export async function GetClassificationProductCount({ variantId }: { variantId: number }) {

    let filter: string = '';
    if (variantId > 0)
        filter = `?variantId=${variantId}`
    //console.log(`${API_BASE}/ProductClassificationCount${filter}`);
    let response = await fetch(`${API_BASE}/ProductClassificationCount${filter}`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store'
        //next: { revalidate: DEFAULT_REVALIDATE_IN_MINUTES }
    })

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function GetBanners({ repeatoneverypage }: { repeatoneverypage: string }) {

    let response = await fetch(`${API_BASE}/Banner?Repeatoneverypage=${repeatoneverypage}`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store'
        //next: { revalidate: DEFAULT_REVALIDATE_IN_MINUTES }
    })

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function GetVariants() {

    let response = await fetch(`${API_BASE}/ProductVariant`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store',
        //next: { revalidate: DEFAULT_REVALIDATE_IN_MINUTES }
    });

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function GetPriceOptions() {

    return [
        {
            "id": "1 - 100",
            "name": "1-100"
        },
        {
            "id": "101 - 500",
            "name": "101-500"
        },
        {
            "id": "501 - 1000",
            "name": "501-1000"
        },
        {
            "id": "1000+",
            "name": "1001"
        }
    ];
}

export async function GetProductsByParams({ pageIndex, orderByColumn, filterBy, filterValue, preFilteredVariantId }: { pageIndex: Number, orderByColumn: string, filterBy?: string, filterValue?: string, preFilteredVariantId: number }) {
    try {


        let whereParams: string = "";
        let containerInfo: any = GetContainerInfo();
        if (filterValue) {
            switch (filterBy) {
                case "category":
                    whereParams = `&categoryId=${filterValue}`;
                    break;
                case "collection":
                    whereParams = `&CollectionId=${filterValue}`;
                    break;
                default:
                    whereParams = `&productName=${filterValue}`;
                    break;
            }
        }
        if (preFilteredVariantId > 0 && filterBy != 'collection') {
            whereParams += `&variantId=${preFilteredVariantId}`;
        }
        console.log(`${API_BASE}/Product?pageIndex=${pageIndex}&pageSize=10&orderByColumn=SORTINGORDER${whereParams}&Containersize=${containerInfo.shortName}`);
        let response = await fetch(`${API_BASE}/Product?pageIndex=${pageIndex}&pageSize=10&orderByColumn=SORTINGORDER${whereParams}&Containersize=${containerInfo.shortName}`, {
            method: "GET",
            headers: GetHeaderWithToken(),
            cache: 'no-store'
        });

        if (response.ok)
            return await response.json() as FormState;
        else
            return {} as FormState;
    } catch (ex:any) {
        console.log(ex);
    }
}

export async function GetCollections() {

    let response = await fetch(`${API_BASE}/collection`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store',
        //next: { revalidate: DEFAULT_REVALIDATE_IN_MINUTES }
    })

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function GetListOfValues(key: string) {

    let response = await fetch(`${API_BASE}/${key}`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store'
        //next: { revalidate: DEFAULT_REVALIDATE_IN_MINUTES }
    });

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function GetContainerInfoByParams(key: string) {
    let token = GetToken();
    let response = await fetch(`${API_BASE}/${key}`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store',
    })

    if (response.ok) {
        let data: FormState = await response.json() as FormState;
        setCookieWithDefaults(enCookie.auth, JSON.stringify({ token: token, container: data.data }));
        return data.data;
    }
    else
        return {};
}

export async function GetMinRequiredDispatchDate() {

    let response = await fetch(`${API_BASE}/dispatchDate`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store'
        //next: { revalidate: DEFAULT_REVALIDATE_IN_MINUTES }
    })

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function UpdateItemCapacityByParams(data: any) {

    let response = await fetch(`${API_BASE}/capacity`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: GetHeaderWithToken()
    });

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function SaveOrder(data: any) {

    let response = await fetch(`${API_BASE}/placeOrder`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: GetHeaderWithToken()
    });
    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}


export async function GetOrderHistory({ pageIndex, orderNo }: { pageIndex: Number, orderNo: string }) {
    let response = await fetch(`${API_BASE}/OrderList?pageIndex=${pageIndex}&pageSize=10&OrderByColumn=ID&OrderByDirection=DESC&Orderno=${orderNo}`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store'
    });


    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}
export async function GetOrderDetailsById({ orderId }: { orderId: Number }) {

    let response = await fetch(`${API_BASE}/OrderListDetail?PageIndex=0&PageSize=10&OrderByColumn=ID&ReferencedocumentId=${orderId}`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store'
        //next: { revalidate: DEFAULT_REVALIDATE_IN_MINUTES }
    });

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function GenerateReport({ orderId }: { orderId: number }) {

    let response = await fetch(`${REPORT_URL}/api/Reports/GetInternationalOrderPrint?internationalOrderId=${orderId}`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store'
    });

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function FetchDataToReOrder({ orderId }: { orderId: number }) {
    //console.log(`${API_BASE}/Reorder?orderId=${orderId}`);
    let response = await fetch(`${API_BASE}/Reorder?orderId=${orderId}`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store'
    });

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function GetCheckoutInfo() {

    let response = await fetch(`${API_BASE}/checkout`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store'
    });

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function UpdateOrderStatus({ orderId, isConfirmed, isCancelled }: { orderId: number, isConfirmed: boolean, isCancelled: boolean }) {

    let response = await fetch(`${API_BASE}/UpdateOrder`, {
        method: "PATCH",
        body: JSON.stringify({ orderId: orderId, isConfirmed: isConfirmed, isCancelled: isCancelled }),
        headers: GetHeaderWithToken()
    });

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function GetProductFilterBy() {

    let response = await fetch(`${API_BASE}/ProductFilterBy`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store'
    })

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}

export async function GetNotesByOrderId({ orderId }: { orderId: Number }) {

    let response = await fetch(`${API_BASE}/Notes?orderId=${orderId}`, {
        method: "GET",
        headers: GetHeaderWithToken(),
        cache: 'no-store'
    })

    if (response.ok)
        return await response.json() as FormState;
    else
        return {} as FormState
}
