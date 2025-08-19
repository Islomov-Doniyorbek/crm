import React from 'react'
import SideBar from './sidebar'
import Col5 from './col5'
import LeftCol3 from './leftcol3'
import RightCol3 from './rightcol3'

const Main:React.FC = () => {
  return (
    <div className=' relative main grid grid-cols-12 gap-2.5'>
      <SideBar/>
      <div className="sect grid gap-2.5 grid-rows-7 lg:grid-cols-8 col-span-12 md:col-span-9 lg:col-span-8 px-6 py-6">
        <LeftCol3/>
        <Col5/>
      </div>
      <RightCol3/>
    </div>
  )
}

export default Main
