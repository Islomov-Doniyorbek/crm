import React from 'react'
import { FaUser } from 'react-icons/fa6';
import { MdNotes, MdProductionQuantityLimits } from 'react-icons/md';

interface card {
  id: number;
  val: number;
  ico: React.ReactNode;
  titleCard: string;
  clr: string;
}


const LeftCol3 = () => {


  const cards:card[] = [
    {
      id: 0,
      val: 79,
      ico: <FaUser/>,
      titleCard: "Customers",
      clr: "green"
    },
    {
      id: 1,
      val: 124,
      ico: <MdNotes/>,
      titleCard: "Recents",
      clr: "crimson"
    },
    {
      id: 2,
      val: 2394,
      ico: <MdProductionQuantityLimits/>,
      titleCard: "Products",
      clr: "blue"
    },
  ]


  return (
    <div className=' row-span-4 md:col-span-5 rounded-2xl h-72'>
      {
        cards.map(item=>{
          return (
            <div key={item.id} className="card h-40 my-2.5 bg-zinc-200  rounded-2xl py-4 px-6 flex justify-between">
              <div className="data flex flex-col justify-around">
                <h3 className='text-xl'>{item.titleCard}</h3>
                <strong className='text-2xl'>{item.val}</strong>
              </div>
              <div className="ico flex items-center">
                <div className={`bx flex items-center justify-center text-2xl w-20 h-20 rounded-[50%]`} style={
                  {
                    boxShadow: `inset 0 5px 6px 0.4px ${item.clr}`,
                    color: item.clr
                  }
                }>
                  {item.ico}
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default LeftCol3
