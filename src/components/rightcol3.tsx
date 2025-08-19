import React from 'react'
import Title from './titleComp'
import Logo from "../../public/logo.jpg"
import Image from 'next/image'
import { MdNote } from 'react-icons/md';
import { GiPencil } from 'react-icons/gi';
import { FaEdit } from 'react-icons/fa';
interface itemList {
    id: number;
    email: string;
    name: string
}
const RightCol3 = () => {
    const proList:itemList[] = [
        {
            id: 0,
            email: "asd@example.com",
            name: "Vartolu Sadettin"
        },
        {
            id: 1,
            email: "asd@example.com",
            name: "Vartolu Sadettin"
        },
        {
            id: 2,
            email: "asd@example.com",
            name: "Vartolu Sadettin"
        },
    ]
  return (
    <div className='col hidden md:block md:col-span-3 bg-[#EEF6FBE5] pt-6 px-3 min-h-72'>
      <div className="customers">
        <Title h4="Customers" />
        <div className="list ">
            {
                proList.map(item=>{
                    return (
                        <div key={item.id} className="list flex justify-between px-2 py-4 hover:bg-zinc-300">
                            <div className="left flex gap-2">
                                <div className="imgBox">
                                    <Image width={40} className='rounded-[50%]' src={Logo} alt="" />
                                </div>
                                <div className="title flex flex-col">
                                    <b>{item.name}</b>
                                    <small>{item.email}</small>
                                </div>
                            </div>
                            <div className="right flex justify-end items-center">
                                <FaEdit className='cursor-pointer'/>
                            </div>
                        </div>
                    )
                })
            }
        </div>
      </div>
    </div>
  )
}

export default RightCol3
