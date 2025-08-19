'use client'
import { createContext, useContext, useState } from "react";

type context = {
    isOpen: boolean;
    toggleMenu: () =>void;
}



export const Mcontext = createContext<context | undefined>(undefined)

const MProvider:React.FC<{ children: React.ReactNode}> = ({children}) =>{
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () =>{
        setIsOpen((prev)=>!prev)
    }

    return (
        <Mcontext.Provider value={{isOpen, toggleMenu}}>
            {children}
        </Mcontext.Provider>
    )
    
}
export const useMenu = () => {
  const ctx = useContext(Mcontext);
  if (!ctx) {
    throw new Error("useMenu faqat MenuProvider ichida ishlatiladi");
  }
  return ctx;
};
export default MProvider