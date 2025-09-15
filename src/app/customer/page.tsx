'use client';

import React, { useEffect, useState } from 'react';
import CustomLayout from '../customLayout';
import { FaCheckCircle, FaEdit } from 'react-icons/fa';
import { MdAddToQueue, MdClose } from 'react-icons/md';
import { FaCircle, FaCirclePlus } from 'react-icons/fa6';
import { useM } from '../context';
import api from '../auth';

/** ====== Types ====== */
type AgentType = 'customer' | 'supplier';

interface Counterparty {
  id: number;
  user_id?: number | null;
  agent_type: AgentType;
  name: string;
  tin: string;
  phone: string;
  description: string;
  status?: { status: number };
}

type CounterpartyForm = Omit<Counterparty, 'id' | 'user_id' | 'status'>;

/** ====== Component ====== */
const Page: React.FC = () => {
  const [rows, setRows] = useState<Counterparty[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CounterpartyForm>({
    agent_type: 'customer',
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
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addRow = async () => {
    if (!form.name.trim()) {
      alert("Korxona nomi majburiy!");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post<Counterparty>(
        'https://fast-simple-crm.onrender.com/api/v1/counterparties/',
        form
      );
      setRows(prev => [res.data, ...prev]);
      setForm({ agent_type: 'customer', name: '', tin: '', phone: '', description: '' });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Saqlashda xatolik. Ma'lumotlarni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        "https://fast-simple-crm.onrender.com/api/v1/counterparties/with-status?type=customer"
      );
      setRows(res.data);
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteCounterParty = async (id: number) => {
    try {
      await api.delete(
        `https://fast-simple-crm.onrender.com/api/v1/counterparties/${id}`
      );
      setRows(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const { bg2, txt, mainBg } = useM();

  return (
    <CustomLayout>
      <div className={`transition duration-500 ${mainBg} w-full px-6 py-6`}>
        <h1 className="text-xl font-bold mb-4">Mijozlar</h1>

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
              {isOpen && (
                <tr>
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
                      className="w-11/12 border rounded-lg px-2 py-1"
                      name="tin"
                      value={form.tin}
                      onChange={handleChange}
                      placeholder="STIR"
                    />
                  </td>
                  <td>
                    <input
                      className="w-11/12 border rounded-lg px-2 py-1"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+99890 123-45-67"
                    />
                  </td>
                  <td>
                    <input
                      className="w-11/12 border rounded-lg px-2 py-1"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Qisqacha bio"
                    />
                  </td>
                  <td colSpan={2}></td>
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
              )}
            </thead>

            <tbody className={`divide-y divide-gray-200 ${txt}`}>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-gray-500">
                    Ma’lumotlar yuklanmoqda...
                  </td>
                </tr>
              ) : rows.length > 0 ? (
                rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`${mainBg === "bg-gray-950" ? "text-white" : "text-black"
                      } hover:text-black hover:bg-emerald-50 transition`}
                  >
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2 flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500" />
                      <FaCircle className="text-orange-400" />
                      <span>{row.name}</span>
                    </td>
                    <td className="px-3 py-2 text-center">{row.tin || "-"}</td>
                    <td className="px-3 py-2">{row.phone}</td>
                    <td className="px-3 py-2">{row.description}</td>
                    <td className="px-3 py-2 text-green-600">
                      {row.status?.status && row.status.status > 0
                        ? row.status.status.toLocaleString("uz-UZ").replace(/,/g, " ")
                        : "0"}
                    </td>
                    <td className="px-3 py-2 text-red-600">
                      {row.status?.status && row.status.status < 0
                        ? Math.abs(row.status.status).toLocaleString("uz-UZ").replace(/,/g, " ")
                        : "0"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-center gap-2 items-center">
                        <button className="p-2 bg-stone-200 hover:bg-emerald-400 transition rounded-full" title="Detail">
                          <MdAddToQueue />
                        </button>
                        <button className="p-2 bg-stone-200 hover:bg-yellow-400 transition rounded-full" title="Edit">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteCounterParty(row.id)}
                          className="p-2 bg-red-200 hover:bg-red-400 transition rounded-full"
                          title="Delete"
                        >
                          <MdClose />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-gray-500">
                    Mijozlar mavjud emas
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
