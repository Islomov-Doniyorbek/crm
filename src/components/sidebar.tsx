'use client'

import { useM } from '@/app/context';
import Link from 'next/link';
import React from 'react'
import { FaShippingFast, FaUser } from 'react-icons/fa';
import { FaBoxArchive} from 'react-icons/fa6';
import { GiBuyCard } from 'react-icons/gi';
import { MdDashboard, MdPointOfSale } from 'react-icons/md';

interface sidebarProps {
    id: number;
    ico: React.ReactNode;
    title: string;
    path: string;
}
const SideBar = () => {
    const sideIcons:sidebarProps[] = [
        {
            id:0,
            ico: <MdDashboard/>,
            title: "Dashboard",
            path: "/dashboard"
        },
        {
            id:1,
            ico: <FaUser/>,
            title: "Mijoz",
            path: "/customer"
        },
        {
            id:2,
            ico: <FaShippingFast/>,
            title: "Yetkazib beruvchi",
            path: "/suplier"
        },
        {
            id:4,
            ico: <MdPointOfSale/>,
            title: "Sotuvlar",
            path: "/sales"
        },
        {
            id:5,
            ico: <GiBuyCard/>,
            title: "Xaridlar",
            path: "/purchases"
        },
        {
            id:3,
            ico: <FaBoxArchive/>,
            title: "Ombor",
            path: "/stock"
        },
    ]

    const {toggleMenu, isOpen, bg2, txt} = useM()
// bg-[#013d8c]
  return (
    <div className={`z-40 absolute ${isOpen ? "left-0" : "-left-40"} -left-40 lg:relative lg:left-0 flex flex-col  items-center w-28 h-full py-3.5 ${bg2}`}>
        {
            sideIcons.map(item=>{
                return (
                    <Link onClick={()=>toggleMenu()} 
                    className={`${bg2} py-4 w-full 
                      flex ${txt}
                     flex-col gap-1.5 rounded-l-4xl
                     items-center hover:bg-white transition duration-700 hover:text-[#0053d9] hover:rounded-l-full`} key={item.id} href={item.path}>
                            <span className='text-2xl'>{item.ico}</span>
                            <span className='text-lg text-center'>{item.title}</span>
                    </Link>
                )
            })
        }
    </div>
  )
}

export default SideBar
