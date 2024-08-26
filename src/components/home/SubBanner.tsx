import Image from "next/image";

export default function SubBanner() {
    return (
        <div className="relative">
            <Image className="h-[500px] object-cover mx-auto" src="/assets/subbanner.jpg" width={1920} height={1000} alt="banner image" />
            <Image className="absolute bottom-0 left-36 -mb-24 z-50" src="/assets/subbannerwheel.png" width={200} height={200} alt="banner wheel" />
        </div>
    )
}
