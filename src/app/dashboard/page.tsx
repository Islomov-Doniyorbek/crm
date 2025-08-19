import Header from '@/components/header'
import Main from '@/components/main'
import React from 'react'
import MProvider from '../context'

const Dashboard:React.FC = () => {

  return (
    <MProvider>
      <div className="containerA min-h-screen w-full">
        <Header  />
        <Main/> 
      </div>
    </MProvider>
  )
}

export default Dashboard
