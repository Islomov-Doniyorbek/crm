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

const DealForm: React.FC<{ open: boolean, closed: ()=> void }> = ({ open, closed }) => {
  const [note, setNote] = useState('');
  const [custId, setCustId] = useState(0);
  const [userrId, setUserrId] = useState(0);
  const [totalAmount, setTotalAmount] = useState('');
  const [dealBox, setDealBox] = useState(false);
  // const [getCustomers, setGetCustomers] = useState<customers[]>([])
  const {customersAll, dealAll} = useApi()


 
  // useEffect(() => {
  //   // setGetCustomers(customersAll)
  //   console.log(dealAll);
  // }, []); 


  const addDeal = async() =>{
    const token = localStorage.getItem("token");
      // console.log("Token:", token);

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); 
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

  const [step, setStep] = useState(0); // hozirgi qaysi input ko'rinyapti
  const [values, setValues] = useState<string[]>(Array(7).fill("")); // 7 ta input uchun bo'sh massiv

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = [...values];
    newValues[step] = e.target.value; // faqat hozirgi inputni yangilash
    setValues(newValues);
  };

  const handleNext = () => {
    if (step < values.length - 1) {
      setStep(step + 1); // keyingi inputni chiqarish
    }
  };
 
  return (
    <>
        <div className={`customers ${open ? 'block' : 'hidden'} absolute top-14 w-3xs  rounded-2xl bg-amber-500 z-40`}>
            <h2 className="w-full flex justify-between px-4 my-4">
                Select customer <MdClose onClick={()=>closed()} />
            </h2>
            <div className="customers flex flex-col">
                {customersAll.map(item=>{
                    return (
                        <div key={item.id} className="flex justify-between items-center customer px-4 py-2 border-b border-t">
                            <div className="left">
                                <h5 className='text-sm font-semibold'>{item.name}</h5>
                                <small><i>{item.user_id}</i></small>
                            </div>
                            <FaArrowRight onClick={()=>{
                              setDealBox(true);
                              setCustId(item.id);
                              setUserrId(item.user_id)
                              }
                            } />
                        </div>
                    )
                })}
            </div>
        </div>
        <form onSubmit={(e) => {
        e.preventDefault();
        addDeal()
        }}
        className={`w-2xs 
          } bg-white ${dealBox ? "flex" : "hidden"} absolute border px-7 py-6 rounded-2xl left-[100px] top-[100px]  z-40 flex-col items-center gap-5`}
        >
      <h2 className="w-full flex justify-between">
        Add deal <MdClose onClick={()=>setDealBox(false)} />
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

export default DealForm;
