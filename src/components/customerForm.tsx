import { useM } from '@/app/context';
import React, { useState } from 'react';
import { MdCheck, MdCheckCircle, MdClose } from 'react-icons/md';
import customerDb from '@/app/db.json'

const CustomerForm: React.FC<{ open: boolean, closed: ()=> void }> = ({ open, closed }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [about, setAbout] = useState('');
  const [notification, setNotification] = useState(false);
  // console.log(customerDb.customer);
  // const [db, setDb] = useState(customerDb.customer)
  const { addCustomer } = useM();

  const handleCustomerData = async () => {
  try {
    const data = await addCustomer(name, phone, about);
    // console.log("Customer added:", data);
    // closed();
    // alert("Success");
    setNotification(true)
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(err.message);
      console.log(err);
    } else {
      alert(String(err));
      console.log(err);
    }
  }
  // setDb([...db, {
  //   id: 3,
  //   name: name,
  //   phone: phone,
  //   about: about
  // }])
  alert("succes")
};

 
  return (
      <div className={`${
            open ? 'block' : 'hidden'
          } bg-white absolute border px-7 py-6 rounded-2xl left-[100px] top-[100px]  z-40 flex-col items-center gap-5`}>
          <div className={`${notification ? "flex" : "hidden"} w-[250px] bg-white alert px-4 py-2 rounded-2xl `}>
            <p className='flex items-center gap-1.5 w-full text-sm'><MdCheckCircle  className='text-2xl text-emerald-500'/> Mijoz saqlandi!</p>
            <p className=''>
              <MdClose className='text-2xl' onClick={()=>{
                  setNotification(false);
                  closed()
                }
              } />
            </p>
          </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCustomerData();
          }}
          className={`${notification ? "hidden" : "flex"} w-2xs bg-white flex-col items-center gap-5`}
        >

          <h2 className="w-full flex justify-between my-2.5 px-2.5">
            Add Customer New <MdClose onClick={()=>closed()} />
          </h2>

          <label className="w-full flex justify-center gap-2.5 flex-col">
            Name
            <input
              className="w-full py-2 px-3 border border-purple-500 "
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
            />
          </label>

          <label className="w-full flex justify-center gap-2.5 flex-col">
            Phone
            <input
              className="w-full py-2 px-3 border border-purple-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
            />
          </label>

          <label className="w-full flex justify-center gap-2.5 flex-col">
            About
            <input
              className="w-full py-2 px-3 border border-purple-500"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              type="text"
            />
          </label>

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
              Save Customer
            </button>
          </div>
        </form>
      </div>
  );
};

export default CustomerForm;
