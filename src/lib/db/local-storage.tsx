
enum enLocalStorageKey {
    user = "_u",
    cart = "_c",
    checkout = "_co",
    orderId = "_oti"
};
class LocalStorage {
    constructor() {
        if (typeof window === undefined)
            throw new Error("Application is not supported in this browser!");

    }

    async addItem(key: string, value: string): Promise<void> {
        localStorage.setItem(key, value);
    }
    async addOrUpdateItem(key: string, item: any): Promise<void> {

        let data: any = {};
        let sessionData = localStorage.getItem(key);
        if (sessionData) {
            data = { ...JSON.parse(sessionData), ...item };
        }
        else {
            data = item;
        }
        this.addItem(key, JSON.stringify(data));
    }

    async addOrUpdateCart(key: string, item: any): Promise<void> {

        let data: any = [];
        let cart: any = localStorage.getItem(key);
        if (cart && cart != typeof (undefined)) {
            data = [...JSON.parse(cart).filter(((items: any) => items.id !== item.id)), item];
        }
        else {
            data.push(item);
        }
        this.addItem(key, JSON.stringify(data));
    }
    async mergeCart(key: string, item: any): Promise<void> {

        let data: any = [];
        let cart: any = localStorage.getItem(key);
        if (cart && cart != typeof (undefined)) {
            let existingItem = JSON.parse(cart).filter(((items: any) => items.id === item.id));
            if (existingItem && existingItem.length > 0) {
                item.proposedQty = Number(item.proposedQty) + Number(existingItem[0].proposedQty);
            }

            data = [...JSON.parse(cart).filter(((items: any) => items.id !== item.id)), item];
        }
        else {
            data.push(item);
        }
        this.addItem(key, JSON.stringify(data));
    }

    async updateCartInBulk(key: string, items: any): Promise<void> {
        this.addItem(key, JSON.stringify(items));
    }

    async getItem(key: string): Promise<string | null> {
        return localStorage.getItem(key);
    }
    async getItemById(key: string, id: number): Promise<string | null> {
        let cart: any = localStorage.getItem(key);
        if (cart && cart != typeof (undefined)) {
            let cartItem = JSON.parse(cart).filter((item: any) => item.id === id);
            if (cartItem && cartItem.length > 0)
                return cartItem[0];
            else
                return null;
        }
        else {
            return null;
        }
    }

    async getItemsCount(key: string): Promise<number> {
        let cart: any = localStorage.getItem(key);
        if (cart && cart != typeof (undefined)) {
            return JSON.parse(cart).length;
        }
        else {
            return 0;
        }
    }
    async getItemSummary(key: string): Promise<any> {
        let cart = localStorage.getItem(key);
        if (cart && cart != typeof (undefined)) {
            let totalItems: number = 0;
            let totalCartons: number = 0;
            let totalValue: number = 0;
            let filledWeigth: number = 0;
            let filledVolume: number = 0;
            let dispatchDate: string = "";
            let leadTime: string = "0";
            let noOfPallet: number = 0;
            let isPalletizedContainer: boolean = false;

            let settings: any;

            let userLoggedInSettings:any = await LocalStorageClient.getItem(LocalStorageKey.user);
            if (userLoggedInSettings != typeof(undefined)) {
                settings = (JSON.parse(userLoggedInSettings)).settings;
            }

            for (const item of JSON.parse(cart)) {
                totalItems += 1;
                totalCartons += Number(item.proposedQty ?? 1);
                totalValue += Number(item.proposedQty) * Number(item.salePrice);
                filledWeigth += Number(item.proposedQty) * Number(item.grossweightcarton);
                filledVolume += Number((Number(item.proposedQty) / Number(item.capacity) * 100).toFixed(6));
                if (item.leadTime && item.requiredDispatchDate && Number(leadTime) < Number(item.leadTime)) {
                    leadTime = item.leadTime;
                    dispatchDate = item.requiredDispatchDate;
                }

                if (settings != typeof(undefined)) {
                    console.log('Calculating no of pallets');
                    if (settings.containerInfo.containerSizename == "20FT-Palletized") {
                        isPalletizedContainer = true;
                        noOfPallet += Number((Number(item.proposedQty) / Number(item.skuperpallet20ft)).toFixed(6));
                    }
                    else if (settings.containerInfo.containerSizename == "40FT-Palletized") {
                        isPalletizedContainer = true;
                        noOfPallet += Number((Number(item.proposedQty) / Number(item.skuperpallet40ft)).toFixed(6));
                    }
                    console.log(`Pallet Status:${isPalletizedContainer} | No Of Pallet: ${noOfPallet}`);
                }
            }
            return {
                totalItems: totalItems,
                totalCartons: totalCartons,
                totalValue: totalValue,
                filledWeigth: filledWeigth,
                filledVolume: Number(filledVolume.toFixed(2)),
                dispatchDate: dispatchDate,

                noOfPallet: noOfPallet,
                allowedPalletsInContainer: Number(settings?.containerInfo?.noofpallet),
                isPalletizedContainer: isPalletizedContainer
            };
        }
        else {
            return {
                totalItems: 0,
                totalCartons: 0,
                totalValue: 0,
                filledWeigth: 0,
                filledVolume: 0,
                dispatchDate: "",

                noOfPallet: 0,
                allowedPalletsInContainer: 0,
                isPalletizedContainer: false
            };
        }
    }

    async removeItem(key: string): Promise<void> {
        localStorage.removeItem(key);
    }

    async removeItemById(key: string, id: number): Promise<void> {
        let cart: any = localStorage.getItem(key);
        if (cart && cart != typeof (undefined)) {
            let updatedCart = JSON.parse(cart).filter((item: any) => item.id !== id);
            this.addItem(key, JSON.stringify(updatedCart));
        }
    }
}

export const LocalStorageClient = new LocalStorage();
export const LocalStorageKey = enLocalStorageKey;