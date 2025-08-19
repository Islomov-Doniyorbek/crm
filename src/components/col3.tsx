import React from 'react'

const Col3:React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <div className='col col-span-3'>  
      {children}
    </div>
  )
}

export default Col3
