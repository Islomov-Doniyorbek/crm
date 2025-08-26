import { useM } from '@/app/context';
import useApi from '@/app/queries';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { MdArrowRight, MdClose } from 'react-icons/md';
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
  note: string;
}
interface dealItem {
  id: number;
  deal_id: number;
  product_id: number;
  quantity: number;
  price: number;
}
interface product {
  id: number;
  user_id: number;
  name: string;
  sku: string;
  price: number;

}

const DealItemForm: React.FC<{ open: boolean, closed: ()=> void }> = ({ open, closed }) => {
  const [note, setNote] = useState('');
  const [custId, setCustId] = useState(0);
  const [userrId, setUserrId] = useState(0);
  const [totalAmount, setTotalAmount] = useState('');
  const [dealBox, setDealBox] = useState(false);
  const {customersAll, dealAll} = useApi()

  const addDeal = async() =>{
    const token = localStorage.getItem("token");
      // console.log("Token:", token);

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // oy (0-11 bo‘ladi, shuning uchun +1)
      const day = String(now.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;
      const response = await axios.post("https://fast-simple-crm.onrender.com/api/v1/deals", {
        user_id: userrId,
        customer_id: custId,
        total_amount: 100,
        date: formattedDate,
        note: note
      }, 
    {headers})

    console.log(response.data);
    
    }catch (err: unknown) {
    if (err instanceof Error) {
      alert(err.message);
      console.log(err);
    } else {
      alert(String(err));
      console.log(err);
    }
  }
  }
const dealTitle = "n1";
  return (
    <>
        <form onSubmit={(e) => {
        e.preventDefault();
        addDeal()
        }}
        className={`w-2xs 
          } bg-white ${dealBox ? "flex" : "hidden"} absolute border px-7 py-6 rounded-2xl left-[100px] top-[100px]  z-40 flex-col items-center gap-5`}
        >
      <h2 className="w-full flex justify-between">
       ${dealTitle} uchun bitim ochish <MdClose onClick={()=>setDealBox(false)} />
      </h2>

          <div className="form">
            <label htmlFor="">
              Bitim tavsifi: <br />
              <input type="text"
              value={note}
              onChange={(e)=>setNote(e.target.value)}
              className='w-full py-2 px-3 border border-purple-500 ' />
            </label>
          </div>

      <div className="btns w-full flex justify-between">
        <button
          type="button"
          className="text-md cursor-pointer px-3 py-2 rounded-2xl border"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="text-md cursor-pointer px-3 py-2 rounded-2xl border border-purple-400 bg-purple-500"
        >
          Ochish
        </button>
      </div>
    </form>
    </>
  );
};

export default DealItemForm;
