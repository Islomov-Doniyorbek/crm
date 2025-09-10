'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomLayout from '../customLayout';
import SideBar from '@/components/sidebar';
import { FaCheckCircle, FaEdit } from 'react-icons/fa';
import { MdAddToQueue, MdClose } from 'react-icons/md';
import { FaCircle, FaCirclePlus } from 'react-icons/fa6';
import { useM } from '../context';

/** ====== Types ====== */
type AgentType = 'customer' | 'supplier';

interface Counterparty {
  id: number;
  user_id?: number | null;
  agent_type: AgentType;
  name: string;        // korxona nomi
  tin: string;         // STIR
  phone: string;
  description: string; // qisqacha bio
}

type CounterpartyForm = Omit<Counterparty, 'id' | 'user_id'>;

/** ====== Component ====== */
const Page: React.FC = () => {
  /** Table data */
  const [rows, setRows] = useState<Counterparty[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /** Add form */
  const [form, setForm] = useState<CounterpartyForm>({
    agent_type: 'supplier',
    name: '',
    tin: '',
    phone: '',
    description: '',
  });

  /** ---- Handlers ---- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value } as CounterpartyForm));
  };

  const addRow = async () => {
    if (!form.name.trim() || !form.tin.trim()) {
      alert("Korxona nomi va STIR majburiy!");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Token topilmadi. Iltimos, tizimga kiring.");
      return;
    }

    try {
      setLoading(true);
      // Backendga aynan form yuboramiz
      const res = await axios.post<Counterparty>(
        'https://fast-simple-crm.onrender.com/api/v1/counterparties/',
        {
          agent_type: "supplier",
          name: form.name,
          tin: form.tin,
          phone: form.phone,
          description: form.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Serverdan qaytgan real ID bilan ro‘yxatga qo‘shamiz
      setRows(prev => [res.data, ...prev]);
      // Form reset
      setForm({
        agent_type: 'supplier',
        name: '',
        tin: '',
        phone: '',
        description: '',
      });
      setIsOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        alert("Saqlashda xatolik. Ma'lumotlarni tekshiring.");
      } else {
        console.error(error);
        alert("Noma'lum xatolik yuz berdi.");
      }
    } finally {
      setLoading(false);
    }
  };

  // const [status, setStatus] = useState<any[]>([]);




  /** ---- Initial fetch ---- */
useEffect(() => {
  const getData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const resCounterparties = await axios.get(
        "https://fast-simple-crm.onrender.com/api/v1/counterparties?type=supplier",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const rowsWithStatus = await Promise.all(
        resCounterparties.data.map(async (item: any) => {
          try {
            const resStatus = await axios.get(
              `https://fast-simple-crm.onrender.com/api/v1/counterparties/${item.id}/with-status`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            return { ...item, status: resStatus.data };
          } catch (err) {
            console.error("Status olishda xato:", err);
            return { ...item, status: null };
          }
        })
      );

      setRows(rowsWithStatus);
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  getData();
}, []);

useEffect(() => {
  console.log("Yangilangan rows:", rows);
}, [rows]);












  const deleteCounterParty = async (id:number)=>{
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
          `https://fast-simple-crm.onrender.com/api/v1/counterparties/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        console.log(res);
        
    }catch(error){
      console.log(error);
      
    }
  }


  const {bg2, txt, mainBg} = useM()

  return (
    <CustomLayout>
        <div className={`${mainBg} w-full px-6 py-6`}>
          <h1 className="text-xl font-bold mb-4">Yetkazib beruvchilar</h1>

          <div className="overflow-x-auto">
            <table className="border-collapse border border-gray-200 w-full text-sm shadow-md rounded-xl overflow-hidden">
              <thead className={`${bg2} ${txt} uppercase tracking-wide`}>
                <tr>
                  <th className="px-3 py-3 text-left">Tr</th>
                  <th className="px-3 py-3 text-left">Korxona</th>
                  <th className="px-3 py-3 text-left">STIR</th>
                  <th className="px-3 py-3 text-left">Telefon raqami</th>
                  <th className="px-3 py-3 text-left">Qisqacha bio</th>
                  <th className="px-3 py-3 text-left">Debit</th>
                  <th className="px-3 py-3 text-left">Kredit</th>
                  <th className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      Instr
                      <button
                        className="p-2 bg-emerald-500 hover:bg-emerald-600 transition text-white rounded-full shadow"
                        onClick={() => setIsOpen(prev => !prev)}
                        aria-label="Add row"
                      >
                        <FaCirclePlus />
                      </button>
                    </div>
                  </th>
                </tr>

                {/* Add Row Form */}
                <tr className={`${isOpen ? 'table-row' : 'hidden'}`}>
                  <td className="px-3 py-2 text-gray-500">#</td>

                  <td>
                    <input
                      className="w-11/12 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Korxona nomi"
                    />
                  </td>

                  <td>
                    <input
                      className="w-11/12 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
                      name="tin"
                      value={form.tin}
                      onChange={handleChange}
                      placeholder="STIR"
                    />
                  </td>

                  <td>
                    <input
                      className="w-11/12 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+99890 123-45-67"
                    />
                  </td>

                  <td>
                    <input
                      className="w-11/12 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Qisqacha bio"
                    />
                  </td>

                  <td colSpan={2}>
                    - 
                  </td>
                  {/* <td></td> */}

                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={addRow}
                        disabled={loading}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 transition text-white rounded shadow disabled:opacity-60"
                      >
                        {loading ? '...' : '+'}
                      </button>
                      <button
                        className="p-2 bg-red-200 hover:bg-red-400 transition rounded-full text-gray-700"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close add row"
                      >
                        <MdClose />
                      </button>
                    </div>
                  </td>
                </tr>
              </thead>

              <tbody className={`divide-y divide-gray-200 ${mainBg==="bg-gray-950" ? "text-white" : "text-black"} hover:text-black `}>
                {rows.map((row, idx) => (
                  
                  <tr key={row.id} className="hover:bg-emerald-50 transition">
                    <td className="px-3 py-2 font-medium text-gray-600">{idx + 1}</td>
                    <td className="px-3 py-2 flex items-center gap-2">
                      {/* <FaCheckCircle className="text-emerald-500" /> */}
                      <div
                          className={`w-[10px] h-[10px] rounded-full  ${
                            row.status?.status > 0
                              ? "bg-green-600 drop-shadow-[0_0_6px_rgba(0,255,0,0.8)]"      // Yashil
                              : ( row.status?.status < 0 ? "bg-red-600 drop-shadow-[0_0_6px_rgba(255,0,0,0.8)]" : "bg-stone-600 drop-shadow-[0_0_6px_rgba(192,192,192,0.8)]" ) // Kulrang (silver)
                          }`}
                      ></div>

                      {/* <FaCircle className="text-orange-400" /> */}
                      <span>{row.name}</span>
                    </td>
                    <td className="px-3 py-2">{row.tin}</td>
                    <td className="px-3 py-2">{row.phone}</td>
                    <td className="px-3 py-2">{row.description}</td>
                    <td className={`px-3 py-2 ${row.status?.status > 0 ? "text-green-600"  : (row.status?.status > 0 ? "text-green-600" : "text-stone-400")}`}>{row.status?.status > 0 ? row.status?.status : 0}</td>
                    <td className={`px-3 py-2 ${row.status?.status > 0 ? "text-green-600"  : (row.status?.status < 0 ? "text-red-600" : "text-stone-400")}`}>{row.status?.status < 0 ? Math.abs(row.status?.status) : 0}</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-center gap-2 items-center">
                        <button className="p-2 bg-emerald-200 hover:bg-emerald-400 transition rounded-full" title="Detail">
                          <MdAddToQueue />
                        </button>
                        <button className="p-2 bg-yellow-200 hover:bg-yellow-400 transition rounded-full" title="Edit">
                          <FaEdit />
                        </button>
                        <button onClick={()=>deleteCounterParty(row.id)} className="p-2 bg-red-200 hover:bg-red-400 transition rounded-full" title="Close">
                          <MdClose />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                      Ma’lumot topilmadi.
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                      Yuklanmoqda...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </CustomLayout>
  );
};

export default Page;
