import useApi from '@/app/queries';
import React, { useEffect, useState } from 'react'
import { FaDownLong, FaUpLong } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';
interface deals {
  id: number;
  customer_id: number;
  user_id: number;
  title: string;
  total_amount: number;
  paid_amount: number;
  typeDeal: string;
}
// interface Customer {
//   id: number;
//   user_id: number;
//   phone: string;
//   name: string;
//   email: string;
//   budjet: boolean;
// }
const CustomDeal:React.FC<{open: boolean, id: number, closed: () => void}> = ({open, id, closed}) => {
  const [deals, setDeals] = useState<deals[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);

  const {dealAll, userAll} = useApi()
  useEffect(() => {
    setDeals(dealAll)
    // setCustomers(customersAll)
    console.log(userAll);    
}, []); // [] 


const [userId, setUserId] = useState<number | null>(null);

useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
        setUserId(Number(storedUserId));
    }
}, []);
console.log(id);
console.log(userId);
  return (
    <div className={`${open ? "block" : "hidden"} left-0 absolute bg-indigo-500 p-4 rounded-2xl text-amber-50 w-full`}>
        <div className="w-full flex justify-between items-center py-2 ">
            <p className='text-2xl'>Haridorning bitimlari: </p>
            <p><MdClose className='text-2xl text-zinc-50' onClick={closed} /></p>
        </div>
        <div className="overflow-x-scroll">
              <table className="customerList w-[600px] sm:w-full border border-gray-300 text-sm">
                <thead>
                  <tr>
                    <th className='px-2 py-2 border text-sm text-left'>T/R</th>
                    <th className='px-2 py-2 border text-sm text-left'>Title</th>
                    <th className='px-2 py-2 border text-sm text-left'>Total Amount</th>
                    <th className='px-2 py-2 border text-sm text-left'>Paid Amount</th>
                    <th className='px-2 py-2 border text-sm text-left'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    deals.map(item=>{
                      return (
                        item.customer_id === id && item.user_id === userId ? (
                            <tr key={item.id} className="row hover:bg-amber-50 w-full">
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.id}
                          </td>
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.title}
                          </td>
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.total_amount}
                          </td>
                          <td className="px-2 py-2 border text-sm text-left">
                            {item.paid_amount}
                          </td>
                          <td className={`${item.paid_amount - item.total_amount >= 0 ? "text-emerald-400" : "text-red-600"} px-2 py-2 border border-black text-4xl text-center`}>
                            {item.paid_amount - item.total_amount > 0 ? <FaUpLong/> : <FaDownLong/>}
                          </td>
                        </tr>
                        ) : null
                      )
                    })
                  }
                </tbody>
              </table>
        </div>
    </div>
  )
}

export default CustomDeal
