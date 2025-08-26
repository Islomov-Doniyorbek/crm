'use client'
import React, { useEffect, useState } from 'react'
import CustomLayout from '../customLayout'
import SideBar from '@/components/sidebar'
import { useM } from '../context'
import { FaFilter } from 'react-icons/fa'
import { FaDownLong, FaUpDown, FaUpLong } from 'react-icons/fa6'
import useApi from '../queries'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface deals {
  id: number;
  customer_id: number;
  user_id: number;
  total_amount: number;
  note: string;
}
interface Customer {
  id: number;
  user_id: number;
  phone: string;
  name: string;
  about: string;
}
interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
}

const Deals:React.FC = () => {

  const router = useRouter()

  const {setHeaderTitle} = useM()
  const {dealAll, customersAll, userAll} = useApi()

  useEffect(()=>{
    setHeaderTitle("Deals")
  }, [])

  const [deals, setDeals] = useState<deals[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
  async function fetchData() {
    try {
      // localStorage dan tokenni olamiz
      const token = localStorage.getItem("token");
      // console.log("Token:", token);

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const cust = await axios.get<deals[]>(
        "https://fast-simple-crm.onrender.com/api/v1/deals",
        { headers }
      )
      setDeals(cust.data)
      console.log("Deals:", cust.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data?.detail ?? err.message);
      } else if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log("Noma'lum xato");
      }
    }
  }

  fetchData(); // <-- chaqirish kerak
}, []);


  return (
    <CustomLayout>
        <div className='customers relative main grid grid-cols-12 gap-2.5'>
          <SideBar/>
          <div className="sect flex flex-col gap-2.5  w-full col-span-12 lg:col-span-11 px-6 py-6">
              <div className="flex w-full justify-between items-center">
                <strong className="left">
                  Total: {deals.length} deals
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
                    {/* <th className='px-2 py-2 border text-sm text-left'>Title</th> */}
                    <th className='px-2 py-2 border text-sm text-left'>Owner</th>
                    <th className='px-2 py-2 border text-sm text-left'>Total Amount</th>
                    <th className='px-2 py-2 border text-sm text-left'>Tavsif</th>
                    {/* <th className='px-2 py-2 border text-sm text-left'>Paid Amount</th>
                    <th className='px-2 py-2 border text-sm text-left'>Status</th> */}
                  </tr>
                </thead>
                <tbody>
                  {
                    deals.map(item=>{
                      return (
                        <tr onClick={()=>{
                          router.push(`/dealItems/${item.customer_id}`)
                        }} key={item.id} className="row hover:bg-amber-50 w-full">
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.id}
                          </td>
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.id}
                          </td>
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.total_amount}
                          </td>
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.note}
                          </td>
                          {/* <td className="px-2 py-2 border text-sm text-left">
                            {item.paid_amount}
                          </td>
                          <td className={`${item.paid_amount - item.total_amount >= 0 ? "text-emerald-400" : "text-red-600"} px-2 py-2 border border-black text-4xl text-center`}>
                            {item.paid_amount - item.total_amount > 0 ? <FaUpLong/> : <FaDownLong/>}
                          </td> */}
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

export default Deals
