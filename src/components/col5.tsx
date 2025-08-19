import Link from 'next/link'
import React from 'react'
import Logo from "../../public/logo.jpg"
import Image from 'next/image';
import Title from './titleComp';

interface itemList {
    id: number;
    cost: number;
    time: string;
    title: string;
    address: string;
}
const Col5:React.FC = () => {
    const proList:itemList[] = [
        {
            id: 0,
            cost: 4887,
            time: "Aug 11, 09:00 AM",
            title: "BTS",
            address: "Sergeli, 8 kv"
        },
        {
            id: 1,
            cost: 4887,
            time: "Aug 11, 09:00 AM",
            title: "BTS",
            address: "Sergeli, 8 kv"
        },
        {
            id: 2,
            cost: 4887,
            time: "Aug 11, 09:00 AM",
            title: "BTS",
            address: "Sergeli, 8 kv"
        },
        {
            id: 3,
            cost: 4887,
            time: "Aug 11, 09:00 AM",
            title: "BTS",
            address: "Sergeli, 8 kv"
        },
    ]
  return (
    <div className='col row-span-3 md:col-span-3'>
      <div className="recentDeals border-2 border-zinc-300 p-4 rounded-2xl">
        <Title h4={"Recent Deals"} />
        <div className="list ">
            {   proList.length > 0 ? 
                proList.map(item=>{
                    return (
                        <div key={item.id} className="list flex justify-between px-2 py-4 hover:bg-zinc-300">
                            <div className="left flex gap-2">
                                <div className="imgBox">
                                    <Image width={40} className='rounded-[50%]' src={Logo} alt="" />
                                </div>
                                <div className="title flex flex-col">
                                    <b>{item.title}</b>
                                    <small>{item.address}</small>
                                </div>
                            </div>
                            <div className="right flex flex-col items-end">
                                    <b>${item.cost}</b>
                                    <small>{item.time}</small>
                            </div>
                        </div>
                    )
                }) : <p>Not Found Recent</p>
            }
        </div>
      </div>
    </div>
  )
}

export default Col5
