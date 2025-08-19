import Header from '@/components/header'
import React from 'react'
const CustomLayout:React.FC<{ children: React.ReactNode}> = ({children}) => {
  return (
      <div className="containerA min-h-screen w-full">
        <Header/>
        {children}
      </div>
  )
}

export default CustomLayout
