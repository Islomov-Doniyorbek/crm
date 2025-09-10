'use client'
import React, { createContext, useContext, useState } from 'react'
import axiosInstance from './api'  // 🔥 shu joy muhim
import useApi from './queries'

type MenuContextType = {
  isOpen: boolean
  toggleMenu: () => void
  setHeaderTitle: (title: string) => void
  register: (
    email: string,
    password: string,
    fullname: string,
    username: string,
    stir: string,
    phone: string
  ) => Promise<void>
  login: (password: string, username: string) => Promise<void>
  header: string,
  bg: string,
  bg2: string,
  mainBg: string,
  txt: string,
  getTheme: (bg:string, txt:string, bg2:string, mainBg:string) => void
}

export const Mcontext = createContext<MenuContextType | undefined>(undefined)

const MProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  // const [isSideBar, setIsSidebar] = useState(false)
  const [header, setHeader] = useState('')

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const setHeaderTitle = (title: string) => setHeader(title)

  // ✅ register
  async function register(
    email: string,
    password: string,
    name: string,
    username: string,
    stir: string,
    phone: string
  ): Promise<void> {
    try {
      const res = await axiosInstance.post('https://fast-simple-crm.onrender.com/api/v1/auth/register', {
        email, password, name, username, stir, phone
      })
      console.log('✅ Ro‘yxatdan o‘tdi:', res.data)
      return res.data
    } catch (error) {
      console.error('❌ Register xatosi:', error)
      throw error
    }
  }

  // ✅ login
  const login = async (username: string, password: string) => {
    try {
      const res = await axiosInstance.post(
        'https://fast-simple-crm.onrender.com/api/v1/auth/login',
        new URLSearchParams({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      console.log('✅ Login muvaffaqiyatli:', res.data);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("refreshToken", res.data.refresh_token);

      // har safar requestda token yuborilishi uchun
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.access_token}`;

      return res.data;
    } catch (error) {
      console.error('❌ Login xatosi:', error);
      throw error;
    }
  };

  const [bg, setBg] = useState('bg-[#013d8ce6]')
  const [bg2, setBg2] = useState('bg-[#013d8c]')
  const [mainBg, setMainBg] = useState('bg-white')
  const [txt, setTxt] = useState('text-blue-100')

  const getTheme = (bg:string, txt:string, bg2:string, mainBg:string) => {
    setBg(bg)
    setBg2(bg2)
    setMainBg(mainBg)
    setTxt(txt)
  }

  return (
    <Mcontext.Provider
      value={{
        setHeaderTitle,
        toggleMenu,
        isOpen,
        header,
        register,
        login,
        bg,
        bg2,
        txt,
        mainBg,
        getTheme
      }}
    >
      {children}
    </Mcontext.Provider>
  )
}

export const useM = () => {
  const ctx = useContext(Mcontext)
  if (!ctx) throw new Error('useM faqat MProvider ichida ishlatiladi')
  return ctx
}

export default MProvider
