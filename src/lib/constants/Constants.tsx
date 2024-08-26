export const LOGIN_URL: any = process.env.NEXT_PUBLIC_LOGIN_URL || "http://reporting.cloudtenants.com:8096/api/login";
export const API_BASE: any = process.env.NEXT_PUBLIC_API_BASE || "http://reporting.cloudtenants.com:8097/api";
export const APPLICATION_BASE_URL: any = process.env.NEXT_PUBLIC_APPLICATION_BASE_URL || "http://reporting.cloudtenants.com:8097/api";
export const REPORT_URL: any = process.env.NEXT_PUBLIC_REPORT_URL || "http://reporting.cloudtenants.com:8098";

export const CheckoutKeys = {
    DESTINATION_PORT: "DestinationPort",
    PAYMENT_TERM: "PaymentTerm",
    SHIPMENT_FROM: "ShipmentFrom",
    SHIPMENT_TERM: "ShipmentTerm",
    CONTAINER: "Container",
    CONTAINER_INFO: "ContainerInfo"
}