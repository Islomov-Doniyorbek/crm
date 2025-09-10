'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '../../public/logo.jpg'
import { FaArrowRight, FaNewspaper, FaPlus, FaSearch, FaUserCircle } from 'react-icons/fa'
import { MdClose, MdMenu, MdSettings } from 'react-icons/md'
import { useM } from '@/app/context'

const Header: React.FC = () => {
  const { header } = useM()
  const [isOpenProfile, setIsOpenProfile] = useState(false)
  const [addNewBtn, setAddNewBtn] = useState(false)
  const [addNewCustomer, setAddNewCustomer] = useState(false)
  const [addNewDeal, setAddNewDeal] = useState(false)


  const clrMode = [
    {
      id: 0,
      bg: "bg-[#013d8ce6]",
      bg2: "bg-[#013d8c]",
      txt: "text-blue-100",
      mainBg: "bg-white",
      modeName: "Standart"
    },
    {
      id: 1,
      bg: "bg-indigo-600",
      bg2: "bg-indigo-500",
      txt: "text-rose-100",
      mainBg: "bg-white",
      modeName: "Indigo"
    },
    {
      id: 2,
      bg: "bg-blue-600",
      bg2: "bg-blue-500",
      txt: "text-sky-100",
      mainBg: "bg-white",
      modeName: "Blue"
    },
    {
      id: 3,
      bg: "bg-black",
      bg2: "bg-gray-900",
      txt: "text-rose-700",
      mainBg: "bg-white",
      modeName: "Negative"
    },
    {
      id: 4,
      bg: "bg-green-800",
      bg2: "bg-[#009826]",
      txt: "text-black",
      mainBg: "bg-white",
      modeName: "Excel"
    },
    {
      id: 5,
      bg: "bg-rose-950",
      bg2: "bg-rose-900",
      txt: "text-rose-100",
      mainBg: "bg-white",
      modeName: "Crimson"
    },
    {
      id: 6,
      bg: "bg-blue-950",
      bg2: "bg-[#181818]",
      txt: "text-blue-50",
      mainBg: "bg-[#1f1f1f]",
      modeName: "Dark"
    },
  ]

  const [isOpenClrList, setIsOpenClrList] = useState(false)

  const {toggleMenu, bg, txt, getTheme} = useM()

  return (
    <header className={`w-full ${bg}`}>
      <div className="flex py-3 justify-between">
        <div className="flex items-center gap-4 px-2 w-40 ">
          <MdMenu onClick={()=>toggleMenu()} className={`block lg:hidden text-4xl ${txt}`} />
          <Image src={Logo} alt="logo" width={40} className='rounded-full' />
          <span className={`text-xl font-semibold font-[cursive] ${txt}`}>Life ES</span>
        </div>
        <div className={`flex relative justify-end items-center gap-4 px-2 w-40 ${txt} `}>
          <MdSettings onClick={()=>setIsOpenClrList(prev=>!prev)} className='text-4xl cursor-pointer font-semibold font-[cursive] hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgb(255,255,0)]' />
          <FaUserCircle className='text-4xl cursor-pointer font-semibold font-[cursive] hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgb(255,255,0)]' />
          <ul className={`${isOpenClrList ? "block" : "hidden"} top-1 bg-blue-50 text-blue-950 pt-1.5 w-40 absolute`}>
            <li className='flex gap-2.5 items-center py-1.5 px-2' onClick={()=>setIsOpenClrList(prev=>!prev)}>
              <MdClose className='cursor-pointer'/> Tizim mavzusi
            </li>
             {clrMode.map(clr=>{
              return (
                <li onClick={()=>{
                  getTheme(clr.bg, clr.txt, clr.bg2, clr.mainBg);
                  setIsOpenClrList(prev=>!prev)
                }} className={`text-white ${bg} border-b py-1.5 px-2 cursor-pointer flex items-center gap-2.5`} key={clr.id}>
                  <div className={`w-3 h-3 rounded-full ${clr.bg}`}></div>
                  {clr.modeName}</li>
              )
             })} 
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Header
