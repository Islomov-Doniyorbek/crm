'use client'

import { useM } from '@/app/context';
import Link from 'next/link';
import React from 'react'
import { BsArrowLeft } from 'react-icons/bs';
import { FaHandshake } from 'react-icons/fa';
import { FaBell, FaBoxArchive, FaCalendar, FaListCheck, FaNewspaper, FaRing, FaSuitcase, FaUserGroup } from 'react-icons/fa6';
import { GiHand } from 'react-icons/gi';
import { HiArchiveBox } from 'react-icons/hi2';
import { MdDashboard, MdSettings } from 'react-icons/md';

interface sidebarProps {
    id: number;
    ico: React.ReactNode;
    path: string;
}
const SideBar = () => {
    const sideIcons:sidebarProps[] = [
        {
            id:0,
            ico: <MdDashboard/>,
            path: "/dashboard"
        },
        {
            id:1,
            ico: <FaUserGroup/>,
            path: "/customers"
        },
        {
            id:2,
            ico: <FaHandshake/>,
            path: "/deals"
        },
        {
            id:3,
            ico: <FaBoxArchive/>,
            path: "/stock"
        },
        {
            id:4,
            ico: <FaCalendar/>,
            path: "/dashboard"
        },
        {
            id:5,
            ico: <FaBell/>,
            path: "/dashboard"
        },
        {
            id:6,
            ico: <MdSettings/>,
            path: "/dashboard"
        },
    ]


    const {isOpen, toggleMenu} = useM()

  return (
    <div className={`aside transition-all duration-100 absolute py-3 px-4 lg:left-0 lg:relative flex col col-span-1 flex-col gap-4 items-center border-r h-[645px]
    ${isOpen ? "left-0 top-0 bg-blue-100 gap-3.5 h-screen" : "left-[-400px]"}`}
    >
        <div onClick={toggleMenu} key={79} className={`ico flex lg:hidden items-center justify-center text-lg w-14 h-14 rounded-[50%] text-[#514EF3] transition-all cursor-pointer border-2 hover:text-white hover:bg-[#514EF3] `}>
            <BsArrowLeft/>
        </div>
      {
        sideIcons.map(item=>{
            return (
                <div onClick={toggleMenu} key={item.id} className="ico flex items-center justify-center text-lg w-14 h-14 rounded-[50%] text-[#514EF3] transition-all cursor-pointer border-2 hover:text-white hover:bg-[#514EF3] ">
                    <Link href={item.path}>{item.ico}</Link>
                </div>
            )
        })
      }
    </div>
  )
}

export default SideBar
