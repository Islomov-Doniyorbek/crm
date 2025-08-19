'use client'
import React, { useContext, useEffect, useState } from 'react'
import Logo from '../../public/logo.jpg'
import Image from 'next/image'
import { FaClosedCaptioning, FaPlus } from 'react-icons/fa6'
import { FaSearch, FaUserCircle } from 'react-icons/fa'
import { MdClose, MdMenu } from 'react-icons/md'
import { useM } from '@/app/context'


const Header:React.FC = () => {

  const {header, toggleMenu} = useM()

  console.log(header);
  
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  return (
    <div className='header border-b w-full'>
      <div className="row grid grid-cols-12 gap-2.5">
        <div className={`col transition-all hidden lg:flex lg:relative items-center justify-center col-span-1 py-3 px-4 border-r`}>
            <div className="logo flex flex-col gap-2.5 items-center">
                <Image width={60} className='rounded-[50%]' src={Logo} alt="Logo" />
            </div>
        </div>
        <div className="col flex items-center col-span-9 lg:col-span-8 py-3 px-4">
          <span onClick={toggleMenu} className='block lg:hidden'>
            <MdMenu/>
          </span>
          <h2 className='text-2xl font-bold ml-6'>{header}</h2>
        </div>
        <div className="col relative col-span-3 bg-[#EEF6FBE5] py-3 px-4 flex items-center justify-end">
             <div
  className={`details transition-all duration-300 ease-in-out overflow-hidden w-full
    ${isOpenProfile
      ? "max-h-96 translate-y-[100px] py-4 px-4 flex flex-col absolute items-center gap-6 bg-amber-50"
      : "max-h-0 translate-y-[-200px]"
    }
    md:flex md:relative md:translate-y-0 md:max-h-none md:py-0 md:px-0 md:bg-transparent md:flex-row md:justify-end md:items-center md:gap-6
  `}
>

                <button onClick={()=>setIsOpenProfile(false)} className='flex text-3xl text-[#514ef3] cursor-pointer md:hidden'>
                  <MdClose/>
                </button>

                <button className="flex items-center justify-center rounded-[50%] lg:rounded-3xl lg:py-6 lg:w-[130px] text-zinc-50 px-1.5 w-8 h-8 bg-[#514ef3]">
                  <span className="hidden lg:block">Add new</span> <span><FaPlus/></span></button>
                <button className=" cursor-pointer w-14 rounded-[50%] bg-white flex items-center justify-center "><span><FaSearch/></span></button>
                <div className="profile flex items-center justify-center cursor-pointer w-14 rounded-[50%] overflow-hidden">
                    <Image className='relative rounded-[50%]' src={Logo} alt="23" />
                </div>
              </div>
                <button onClick={()=>setIsOpenProfile(true)} className='flex text-3xl text-[#514ef3] cursor-pointer md:hidden'>
                  <FaUserCircle/>
                </button>
        </div>
      </div>
    </div>
  )
}

export default Header
