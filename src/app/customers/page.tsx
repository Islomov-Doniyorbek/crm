'use client'
import React, { useEffect } from 'react'
import CustomLayout from '../customLayout'
import SideBar from '@/components/sidebar'
import LeftCol3 from '@/components/leftcol3'
import Col5 from '@/components/col5'
import RightCol3 from '@/components/rightcol3'
import { useM } from '../context'
import { MdArrowUpward, MdFilter } from 'react-icons/md'
import { FaFilter } from 'react-icons/fa'
import { FaDownLong, FaUpDown, FaUpLong } from 'react-icons/fa6'

interface customers {
  id: number;
  phone: string;
  name: string;
  budjet: boolean;
}

const Customers:React.FC = () => {

  const {setHeaderTitle} = useM()

  useEffect(()=>{
    setHeaderTitle("Customers")
  }, [])

  const customers:customers[] = [
    {
      id:0,
      phone: "+998999978474",
      name: "Cengiz",
      budjet: true
    },
    {
      id:1,
      phone: "+998999978474",
      name: "Ali",
      budjet: true
    },
    {
      id:2,
      phone: "+998999978474",
      name: "Vali",
      budjet: false
    },
    {
      id:3,
      phone: "+998999978474",
      name: "Orip",
      budjet: true
    },
    {
      id:4,
      phone: "+998999908474",
      name: "Ilhom",
      budjet: false
    },
    {
      id:5,
      phone: "+998997978474",
      name: "Sharip",
      budjet: false
    },
  ]

  return (
    <CustomLayout>
        <div className='customers relative main grid grid-cols-12 gap-2.5'>
          <SideBar/>
          <div className="sect flex flex-col gap-2.5  w-full col-span-12 lg:col-span-11 px-6 py-6">
              <div className="flex w-full justify-between items-center">
                <strong className="left">
                  Total: 79 customers
                </strong>
                <div className="right flex gap-4 items-center ">
                  <select className='py-3 px-4 rounded-2xl bg-indigo-400' name="" id="sort">
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                  <button className='py-3 px-4 rounded-2xl bg-indigo-400 flex gap-4'>Filter <FaFilter/></button>
                </div>
              </div>
            <div className="overflow-x-scroll">
              <table className="customerList w-[600px] sm:w-full border border-gray-300 text-sm">
                <thead>
                  <tr>
                    <th className='px-2 py-2 border text-sm text-left'>T/R</th>
                    <th className='px-2 py-2 border text-sm text-left'>F.I.Sh</th>
                    <th className='px-2 py-2 border text-sm text-left'>Telefon</th>
                    <th className='px-2 py-2 border text-sm text-left'>Budjet</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    customers.map(item=>{
                      return (
                        <tr key={item.id} className="row hover:bg-amber-50 w-full">
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.id+1}
                          </td>
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.name}
                          </td>
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.phone}
                          </td>
                          <td className={`${item.budjet ? "text-emerald-400" : "text-red-600"} px-2 py-2 border border-black text-4xl text-center`}>
                            {item.budjet ? <FaUpLong/> : <FaDownLong/>}
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </CustomLayout>
  )
}

export default Customers
