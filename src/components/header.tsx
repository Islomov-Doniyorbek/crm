'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '../../public/logo.jpg'
import { FaArrowRight, FaNewspaper, FaPlus, FaSearch, FaUserCircle } from 'react-icons/fa'
import { MdClose, MdMenu } from 'react-icons/md'
import { useM } from '@/app/context'
import { FaUserGroup } from 'react-icons/fa6'
import CustomerForm from './customerForm'
import DealForm from './dealForm'

const Header: React.FC = () => {
  const { header, toggleMenu } = useM()
  const [isOpenProfile, setIsOpenProfile] = useState(false)
  const [addNewBtn, setAddNewBtn] = useState(false)
  const [addNewCustomer, setAddNewCustomer] = useState(false)
  const [addNewDeal, setAddNewDeal] = useState(false)




  return (
    <header className="w-full border-b">
      <div className="grid grid-cols-12 gap-2.5">
        {/* Logo */}
        <div className="hidden lg:flex items-center justify-center col-span-1 py-3 px-4 border-r">
          <Image width={60} className="rounded-full" src={Logo} alt="Logo" />
        </div>

        {/* Title */}
        <div className="flex items-center col-span-9 lg:col-span-8 py-3 px-4">
          <button onClick={toggleMenu} className="lg:hidden text-2xl">
            <MdMenu />
          </button>
          <h2 className="ml-6 text-2xl font-bold">{header}</h2>
        </div>

        {/* Actions & Profile */}
        <div className="relative col-span-3 flex items-center justify-end bg-[#EEF6FBE5] py-3 px-4">
          <div
            className={`absolute md:relative flex flex-col md:flex-row items-center gap-6 transition-all duration-300 ease-in-out
              ${isOpenProfile
                ? "max-h-96 translate-y-[100px] py-4 px-4 bg-amber-50 z-40"
                : "max-h-0 -translate-y-52"
              }
              md:max-h-none md:translate-y-0 md:py-0 md:px-0 md:bg-transparent
            `}
          >
            {/* Close (mobile only) */}
            <button
              onClick={() => setIsOpenProfile(false)}
              className="md:hidden text-3xl text-[#514ef3]"
            >
              <MdClose />
            </button>

            {/* Add new */}
            <button onClick={() => setAddNewBtn(prev=>!prev)} className="flex items-center justify-center gap-2 rounded-full lg:rounded-3xl bg-[#514ef3] text-white px-2 w-8 h-8 lg:w-auto lg:px-6 lg:py-2">
              <span className="hidden lg:block">Add new</span>
              <FaPlus />
            </button>

            {/* Search */}
            <button className="flex items-center justify-center w-14 h-14 rounded-full bg-white">
              <FaSearch />
            </button>

            {/* Profile */}
            <div className="w-14 h-14 rounded-full overflow-hidden cursor-pointer">
              <Image className="rounded-full" src={Logo} alt="Profile" />
            </div>
          </div>

          {/* Open Profile (mobile only) */}
          <button
            onClick={() => setIsOpenProfile(true)}
            className="md:hidden text-3xl text-[#514ef3]"
          >
            <FaUserCircle />
          </button>
        </div> 

        <div className={`addNewBox ${addNewBtn ? "block" : "hidden"} w-44 absolute top-5 right-5 bg-blue-800 z-40  border border-zinc-900 rounded-2xl`}>
          <div className="addDeals flex justify-between text-amber-50 font-light py-2 items-center gap-2.5 px-4">
            <p className='flex items-center gap-2.5'>Add New</p>
            <MdClose onClick={()=>setAddNewBtn(false)}/>
          </div>
          <div onClick={()=>{
            setAddNewDeal(true);
            setAddNewBtn(false)
          }} className="addDeals flex justify-between cursor-pointer text-amber-50 font-light py-2 items-center gap-2.5 border-t border-b px-4">
            <p className='flex items-center gap-2.5'><FaNewspaper/> Deals</p>
            <FaArrowRight/>
          </div>
          <div onClick={()=>{
            setAddNewCustomer(true);
            setAddNewBtn(false)
          }} className="flex justify-between cursor-pointer text-amber-50 font-light py-2 items-center gap-2.5 px-4">
            <p className='flex items-center gap-2.5'><FaUserGroup/> Customers</p>
            <FaArrowRight/>
          </div>
        </div>
        <CustomerForm open={addNewCustomer} closed={()=>setAddNewCustomer(false)} />
        <DealForm open={addNewDeal} closed={()=>setAddNewDeal(false)} />
      </div>
    </header>
  )
}

export default Header
