import Image from "next/image"

export default function Services() {

    const services = [
        { id: 1, title: 'usa wide delivery', desc: 'Get doorstep delivery', url: '/assets/serv1.png' },
        { id: 2, title: 'safe payment', desc: 'secure payment methods', url: '/assets/serv2.png' },
        { id: 3, title: 'safe payment', desc: 'secure payment methods', url: '/assets/serv3.png' },
        { id: 4, title: 'safe payment', desc: 'secure payment methods', url: '/assets/serv4.png' },
    ]

    return (
        <div className="bg-[#fafafe] py-16 px-10">
            {/* <div className="flex flex-wrap justify-center gap-5 items-center container py-20">
                {services?.map((item: any) => (
                    <div key={item.id} className="flex justify-center items-center bg-[#ededed] shadow-md shadow-gray-400 px-3 py-5 rounded-lg">
                        <Image src={item.url} width={48} height={48} alt="" />
                        <div className="ml-3">
                            <h1 className="text-base font-semibold uppercase">{ item.title }</h1>
                            <p className="text-xs capitalize">{ item.desc }</p>
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
    )
}
