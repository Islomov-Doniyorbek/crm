'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios"
import { jwtDecode } from 'jwt-decode';
import useApi from './queries';
type MenuContextType = {
  isOpen: boolean;
  toggleMenu: () => void;
  setHeaderTitle: (title: string) => void;
  login: (username: string, password: string) => void;
  register: (email: string, password: string, fullname: string, username: string) => void;
  addCustomer: (
    name: string,
    phone: string,
    about: string
  ) => void;
  header: string;
  currentUser: string;
  setCurrentUser: React.Dispatch<React.SetStateAction<string>>;
};
interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  // agar boshqa fieldlar bo‘lsa, qo‘shib ketsangiz bo‘ladi
}

type MyToken = {
  userId: string;
  exp: number;   // muddati tugash vaqti (optional)
  iat?: number;  // yaratilgan vaqt (optional)
};

export const Mcontext = createContext<MenuContextType | undefined>(undefined);

const MProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [header, setHeader] = useState('');
  const [currentUser, setCurrentUser] = useState('null');

  const {userAll} = useApi()
  // console.log(userAll);
  
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const setHeaderTitle = (title: string) => setHeader(title);

//   // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// function getUserIdFromToken(token: string): string | null {
//   try {
//     const decoded = jwtDecode<MyToken>(token);
//     return decoded.userId; // backend tokenni qanday chiqarganiga bog‘liq
//   } catch (error) {
//     console.error("Token xato:", error);
//     return null;
//   }
// }

// localStorage.clear()



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

async function login(username: string, password: string) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  try {
    const response = await axios.post(
      "https://fast-simple-crm.onrender.com/api/v1/auth/login",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    // console.log(response);
    // console.log(response.data.access_token);
    const token = response.data.access_token;
    // const decoded = jwtDecode<MyToken>(response.data.access_token);
    // console.log(decoded);    
    
    // // const token = response.data.access_token;
    // console.log(token);
    
    localStorage.setItem("token", token);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Status:", error.response?.status);
      console.error("Detail:", error.response?.data);
      console.log(error);
      
      throw new Error(error.response?.data?.detail ?? "Login failed");
    }
  }
}




  const register = async (email: string, password: string, fullname: string, username: string)=>{
    const user = {
      email: email,
      password: password,
      full_name: fullname,
      username: username
    }

    const response = await axios.post("https://fast-simple-crm.onrender.com/api/v1/auth/register", user);
    // console.log(response.data);

    return response.data
  }
const addCustomer = async (
  name: string,
  phone: string,
  about: string
) => {
  const token = localStorage.getItem("token");
  // const user_id = localStorage.getItem("user_id");

  if (!token) throw new Error("No token found, please login first");
  // if (!user_id) throw new Error("No user id found, please login first");

  const customer = { name, phone, about };

  const response = await axios.post(
    "https://fast-simple-crm.onrender.com/api/v1/customers",
    customer,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  // console.log(response);
  
  return response.data;
};



  // useEffect(() => {
  //   console.log('Header changed:', header);
  // }, [header]);

  return (
    <Mcontext.Provider
      value={{
        isOpen,
        toggleMenu,
        setHeaderTitle,
        header,
        login,
        register,
        addCustomer,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </Mcontext.Provider>
  );
};

export const useM = () => {
  const ctx = useContext(Mcontext);
  if (!ctx) throw new Error('useM faqat MProvider ichida ishlatiladi');
  return ctx;
};

export default MProvider;
