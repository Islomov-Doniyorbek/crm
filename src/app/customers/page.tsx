'use client'
import React, { useEffect, useState } from 'react'
import CustomLayout from '../customLayout'
import SideBar from '@/components/sidebar'
import { FaFilter } from 'react-icons/fa6'
import { useM } from '../context'
import CustomDeal from '@/components/customDeal'
import useApi from '../queries'
import db from '@/app/db.json'
import axios from 'axios'
interface Customer {
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
const Customers: React.FC = () => {
  // custom hooks
  const { setHeaderTitle } = useM()
  const {dealAll, customersAll, error} = useApi()
  // states
  const [customers, setCustomers] = useState<Customer[]>([])
  const [deals, setDeals] = useState<deals[]>([])
  const [customDealBox, setCustomDealBox] = useState(false)
  const [customerId, setCustomerId] = useState(0)
  console.log(customersAll);

  useEffect(() => {
  async function fetchData() {
    try {
      // localStorage dan tokenni olamiz
      const token = localStorage.getItem("token");
      // console.log("Token:", token);

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const cust = await axios.get<Customer[]>(
        "https://fast-simple-crm.onrender.com/api/v1/customers",
        { headers }
      )
      setCustomers(cust.data)
      console.log("Customers:", cust.data);
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
        <SideBar />
        <div className="sect flex flex-col gap-2.5 w-full col-span-12 lg:col-span-11 px-6 py-6">
          <div className="flex w-full justify-between items-center">
            <strong className="left">
              Total: {customers.length} customers
            </strong>
            <div className="right flex gap-4 items-center ">
              <select className='py-3 px-4 rounded-2xl bg-indigo-400' id="sort">
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
              <button className='py-3 px-4 rounded-2xl bg-indigo-400 flex gap-4'>
                Filter <FaFilter />
              </button>
            </div>
          </div>

          <div className="overflow-x-scroll">
            <table className="customerList w-[600px] sm:w-full border border-gray-300 text-sm">
              <thead>
                <tr>
                  <th className='px-2 py-2 border text-sm text-left'>T/R</th>
                  {/* <th className='px-2 py-2 border text-sm text-left'>User ID</th> */}
                  <th className='px-2 py-2 border text-sm text-left'>F.I.Sh</th>
                  <th className='px-2 py-2 border text-sm text-left'>Telefon</th>
                  <th className='px-2 py-2 border text-sm text-left'>About</th>
                  <th className='px-2 py-2 border text-sm text-left'>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(item => {
                  return (
                    <tr key={item.id} className="row hover:bg-amber-50 w-full">
                      <td className="px-2 py-2 border text-sm text-left">{item.id}</td>
                      {/* <td className="px-2 py-2 border text-sm text-left">{item.user_id}</td> */}
                      <td className="px-2 py-2 border text-sm text-left">{item.name}</td>
                      <td className="px-2 py-2 border text-sm text-left">{item.phone}</td>
                      <td className="px-2 py-2 border text-sm text-left">{item.about}</td>
                      {/* <td className={`${customerDiff > 0 ? "text-emerald-400" : "text-red-600"} px-2 py-2 border border-black text-center`}>
                        {customerDiff}
                      </td> */}
                      <td>Neytral</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/* <CustomDeal open={customDealBox} id={customerId} closed={()=>setCustomDealBox(false)}/> */}
        </div>
      </div>
    </CustomLayout>
  )
}

export default Customers