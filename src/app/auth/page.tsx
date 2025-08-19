'use client'
import React, { useEffect, useState } from 'react'
import {supabase} from '../supabaseClient'
import { useRouter } from 'next/navigation'

type User = {
  id: number;
  login: string;
  password: string;
}

const Auth:React.FC = () => {
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    fetchUsers()
    // changeLogin()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')

    if (error) {
      console.error(error)
    } else {
      setUsers(data || [])
      console.log('Users:', data)
    }
  }
  console.log(users);
  function changeLogin(){
    console.log(login);
    console.log(users[0].login);
    if(login === users[0].login && password === users[0].password){
      console.log("success");
      router.push("/dashboard");
    }else{
      console.log("err");      
    }
  }





  return (
    <div className='w-full min-h-screen'>
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2">
        <div className="col h-screen hidden md:flex justify-center items-center bg-[#514EF3]">
          <h1 className='text-4xl text-zinc-200'>
            Product Management System
          </h1>
        </div>
        <div className="col h-screen flex justify-center items-center">
          <div className="wrapper w-full">
            <form onSubmit={(e)=>{
               e.preventDefault()
              changeLogin()
              }} className='w-full flex flex-col gap-5 items-center'>
              <label htmlFor="login" className='flex gap-2.5 flex-col w-2/5 text-lg'>
                Login 
                <input type="text" placeholder='...' 
                className='border-[1px] border-blue-800 py-2 px-2.5 outline-0 hover:bg-blue-200 cursor-pointer rounded-[4px]'
                value={login}
                onChange={(e)=>setLogin(e.target.value)}
                 />
              </label>
              <label htmlFor="password" className='flex gap-2.5 flex-col w-2/5 text-lg'>
                Password 
                <input type="password" placeholder='...' 
                className='border-[1px] border-blue-800 py-2 px-2.5 outline-0 hover:bg-blue-200 cursor-pointer rounded-[4px]'
                value={password} 
                onChange={(e)=>setPassword(e.target.value)}
                />
              </label>
              <button type='submit' className='bg-[#514EF3] text-zinc-200 w-2/5 py-2 px-2.5 rounded-[4px] cursor-pointer'>
                Kirish
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
