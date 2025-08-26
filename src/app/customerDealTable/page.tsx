'use client'
import React, { useEffect, useState } from 'react'
import CustomLayout from '../customLayout'
import SideBar from '@/components/sidebar'
import { useM } from '../context'
import { FaFilter } from 'react-icons/fa'
import { FaDownLong, FaUpLong } from 'react-icons/fa6'
import useApi from '../queries'

interface customers {
  id: number;
  user_id: number;
  phone: string;
  name: string;
  about: string;
}
interface deals {
  id: number;
  customer_id: number;
  user_id: number;
  total_amount: number;
}
const Customers:React.FC = () => {

  const {setHeaderTitle} = useM()
  const {customersAll, dealAll} = useApi()


  const [getCustomerDeal, setGetCustomerDeal] = useState<deals[]>([])
  const [customers, setCustomers] = useState<customers[]>([]);
  
  useEffect(() => {
    setHeaderTitle("Customers")
    setCustomers(customersAll)
    setGetCustomerDeal(dealAll)    
}, []); 

  const getDeal = (id: number) => {
      getCustomerDeal.map(item=>{
          if(item.customer_id === id) {
            // console.log(item);
            
          }
      })
  }


  return (
    <CustomLayout>
        <div className='customers relative main grid grid-cols-12 gap-2.5'>
          <SideBar/>
          <div className="sect flex flex-col gap-2.5  w-full col-span-12 lg:col-span-11 px-6 py-6">
              <div className="flex w-full justify-between items-center">
                <strong className="left">
                  Total: {customers.length} customers
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
                    <th className='px-2 py-2 border text-sm text-left'>User ID</th>
                    <th className='px-2 py-2 border text-sm text-left'>F.I.Sh</th>
                    <th className='px-2 py-2 border text-sm text-left'>Telefon</th>
                    <th className='px-2 py-2 border text-sm text-left'>Bio</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    customers.map(item=>{
                      return (
                        <tr onClick={()=>{console.log(item.id);  getDeal(item.id)}} key={item.id} className="row hover:bg-amber-50 w-full">
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.id}
                          </td>
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.user_id}
                          </td>
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.name}
                          </td>
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.phone}
                          </td>
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.about}
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
