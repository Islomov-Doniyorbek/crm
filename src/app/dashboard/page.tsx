'use client'
import React, { useEffect } from 'react'
import CustomLayout from '../customLayout'
import SideBar from '@/components/sidebar'
import LeftCol3 from '@/components/leftcol3'
import Col5 from '@/components/col5'
import RightCol3 from '@/components/rightcol3'
import { useM } from '../context'

const Dashboard:React.FC = () => {
  const { setHeaderTitle } = useM();

  useEffect(() => {
    setHeaderTitle('Dashboard');
  }, []);
  return (
    <CustomLayout>
        <div className='dashboard relative main grid grid-cols-12 gap-2.5'>
          <SideBar/>
          <div className="sect grid gap-2.5 grid-rows-7 lg:grid-cols-8 col-span-12 md:col-span-9 lg:col-span-8 px-6 py-6">
            <LeftCol3/>
            <Col5/>
          </div>
          <RightCol3/>
        </div>
    </CustomLayout>
  )
}

export default Dashboard
