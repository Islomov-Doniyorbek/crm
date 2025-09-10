'use client'
import React, { useEffect, useState } from 'react'
import CustomLayout from '../customLayout'
import SideBar from '@/components/sidebar'
import { FaCheckCircle, FaClosedCaptioning, FaEdit, FaPlusCircle } from 'react-icons/fa';
import { MdAddToQueue, MdClose, MdCloseFullscreen, MdRemoveCircle } from 'react-icons/md';
import { FaCircle, FaCirclePlus } from 'react-icons/fa6';
import axios from 'axios';
import { useM } from '../context';
import api from '../api';

interface Contract {
  id: number;
  korxona: string;
  stir: string;
  shartnoma: string;
  sana: string;
  raqam: string;
  type: "PURCHASE" | "SALES";
  agent_id: number;
}

interface ContractProduct {
  id: number;
  date: string;
  movement_type: "in" | "out";
  quantity: number;
  amount: string;
  price: number;
  comment: string;
  product_id?: number | null;
  product_name?: string;
}

interface Counterparty {
  id: number;
  user_id: number;
  agent_type: string;
  name: string;
  tin: string;
  phone: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  price: string;
  description: string;
}

interface ContractWithStatus {
  id: number;
  contract_report: {
    total: number;
  };
}

const Import = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [selectedContract, setSelectedContract] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedCounterparty, setSelectedCounterparty] = useState<number | null>(null);
  const [rows, setRows] = useState<Contract[]>([]);
  const [rowsWithStatus, setRowsWithStatus] = useState<ContractWithStatus[]>([]);
  const [sales, setSales] = useState<ContractProduct[]>([]);

  // Forms
  const [form, setForm] = useState<Omit<Contract, "id">>({
    korxona: "",
    stir: "",
    shartnoma: "",
    sana: "",
    raqam: "",
    type: "SALES",
    agent_id: 0,
  });

  const [inForm, setInForm] = useState<Omit<ContractProduct, "id">>({
    date: "",
    movement_type: "out",
    quantity: 0,
    price: 0,
    comment: "",
    amount: "0"
  });

  // Handlers
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "agent_id") {
      const selectedId = Number(value);
      const selectedCp = counterparties.find(cp => cp.id === selectedId);
      
      if (selectedCp) {
        setForm(prev => ({ 
          ...prev, 
          agent_id: selectedId,
          korxona: selectedCp.name,
          stir: selectedCp.tin
        }));
        setSelectedCounterparty(selectedId);
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInForm(prev => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value
    }));
  };

  const [contractId, setContractId] = useState(0);

  const addRow = async () => {
    if (!form.agent_id || !form.sana || !form.raqam) return alert("Korxona, sana va raqam majburiy!");
    
    try {
      const token = localStorage.getItem("token");

      const contract = {
        agent_id: form.agent_id,
        contract_type: form.type.toLowerCase(),
        compiled_at: form.sana,
        doc_num: form.raqam,
        comment: form.shartnoma
      };
      console.log(contract);
      

      const resContract = await axios.post("https://fast-simple-crm.onrender.com/api/v1/contracts",
        contract,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Contract qo'shildi:", resContract.data);
      
      // Yangi qatorni qo'shish
      const newRow = {
        id: resContract.data.id,
        korxona: form.korxona,
        stir: form.stir,
        shartnoma: form.shartnoma,
        sana: form.sana,
        raqam: form.raqam,
        type: form.type,
        agent_id: form.agent_id
      };
      
      setRows(prev => [...prev, newRow]);
      


      // #9012fe



      // Status ma'lumotlarini yangilash
      await getStatusContract();
      
      setForm({ 
        korxona: "", 
        stir: "", 
        shartnoma: "", 
        sana: "", 
        raqam: "", 
        type: "SALES",
        agent_id: 0 
      });
      setSelectedCounterparty(null);
      setIsOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Xato:", error.response?.data);
        console.error("❌ Xato:", error);
        alert("Xatolik yuz berdi: " + (error.response?.data?.message || "Noma'lum xato"));
      } else {
        console.error("❌ Noma'lum xato:", error);
      }
    }
  };

  const addInRow = async () => {
    if (!selectedContract) return alert("Avval bitim tanlang!");
    
    try {
      const token = localStorage.getItem("token");

      if (inForm.movement_type === "in") {
        const payment = {
          contract_id: selectedContract,
          compiled_at: inForm.date,
          movement_type: "in",
          amount: inForm.price.toString(),
          comment: inForm.comment
        };

        const resContractPay = await axios.post("https://fast-simple-crm.onrender.com/api/v1/contract-payments",
          payment,
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );

        console.log("To'lov qo'shildi:", resContractPay.data);
        
        // Yangi to'lovni sales ro'yxatiga qo'shish
        const newPayment = {
          id: resContractPay.data.id,
          date: inForm.date,
          movement_type: "in" as const,
          quantity: 0,
          price: inForm.price,
          comment: inForm.comment,
          amount: inForm.price.toString()
        };
        
        setSales(prev => [...prev, newPayment]);
        
      } else if (inForm.movement_type === "out") {
        if (!selectedProduct) return alert("Mahsulot tanlang!");

        const product = {
          contract_id: selectedContract,
          product_id: selectedProduct,
          compiled_at: inForm.date,
          movement_type: "out",
          quantity: inForm.quantity,
          price: inForm.price,
          comment: inForm.comment
        };

        const resContractPrd = await axios.post(
          "https://fast-simple-crm.onrender.com/api/v1/contract-products",
          product,
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );

        console.log("Mahsulot qo'shildi:", resContractPrd.data);
        
        // Yangi mahsulotni sales ro'yxatiga qo'shish
        const selectedProd = products.find(p => p.id === selectedProduct);
        const newProduct = {
          id: resContractPrd.data.id,
          date: inForm.date,
          movement_type: "out" as const,
          quantity: inForm.quantity,
          price: inForm.price,
          comment: inForm.comment,
          product_id: selectedProduct,
          product_name: selectedProd?.name || "Noma'lum mahsulot",
          amount: "0"
        };
        
        setSales(prev => [...prev, newProduct]);
      }
      
      // Status ma'lumotlarini yangilash
      await getStatusContract();
      
      // Formani tozalash
      setInForm({ 
        date: "", 
        movement_type: "out", 
        quantity: 0, 
        price: 0, 
        comment: "",
        amount: "0"
      });
      setSelectedProduct(null);
      
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi: " + (error as any).message);
    }
  };

  const [openRow, setOpenRow] = useState<number | null>(null);
  const [getType, setGetType] = useState<"PURCHASE" | "SALES" | "">("");

  const toggleRow = async (rowId: number, type: "PURCHASE" | "SALES") => {
    // Agar bir xil qatorni yana bosa, yopish
    if (openRow === rowId) {
      setOpenRow(null);
      setSales([]);
      return;
    }
    
    setOpenRow(rowId);
    setGetType(type);
    setSelectedContract(rowId);

    try {
      const token = localStorage.getItem("token");
      
      const [paymentsRes, productsRes] = await Promise.all([
        axios.get(`https://fast-simple-crm.onrender.com/api/v1/contract-payments?contract_id=${rowId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`https://fast-simple-crm.onrender.com/api/v1/contract-products?contract_id=${rowId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ], 
    );

      console.log("Payments API response:", paymentsRes.data)
      console.log("Products API response:", productsRes.data)

      // To'lovlarni (IN) qayta ishlash
      const payments = paymentsRes.data.map((p: any) => ({
        id: p.id,
        date: p.compiled_at,
        movement_type: "in" as const,
        quantity: 0,
        price: Number(p.amount),
        comment: p.comment || "",
        amount: p.amount
      }));

      // Mahsulotlarni (OUT) qayta ishlash
      const productsData = productsRes.data
        .filter((p: any) => p.contract_id === rowId)
        .map((p: any) => {
          const product = products.find(prod => prod.id === p.product_id);
          return {
            id: p.id,
            date: p.compiled_at,
            movement_type: "out" as const,
            quantity: p.quantity,
            price: p.price,
            comment: p.comment || "",
            product_id: p.product_id,
            product_name: product?.name || "Noma'lum mahsulot",
            amount: "0"
          };
        });

      // To'lovlar va mahsulotlarni birlashtirish
      const combinedData = [...payments, ...productsData];
      combinedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setSales(combinedData);
    } catch (error) {
      console.error("Ma'lumotlarni olishda xato:", error);
      alert("Ma'lumotlarni yuklashda xatolik yuz berdi");
    }
  };

  const removeRow = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://fast-simple-crm.onrender.com/api/v1/contracts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      
      setRows(prev => prev.filter(row => row.id !== id));
      // Status ma'lumotlarini yangilash
      await getStatusContract();
    } catch (error) {
      console.error("O'chirishda xato:", error);
      alert("O'chirishda xatolik yuz berdi");
    }
  };

  const [editId, setEditId] = useState<number | null>(null);

  const startEditRow = (id: number, type: "MAIN" | "IN" | "OUT") => {
    if (type === "MAIN") {
      const rowToEdit = rows.find(r => r.id === id);
      if (!rowToEdit) return;
      setForm({ ...rowToEdit });
      setEditId(id);
      setSelectedCounterparty(rowToEdit.agent_id);
    }
  };

  const saveEditRow = async () => {
    if (editId) {
      try {
        const token = localStorage.getItem("token");
        const contract = {
          agent_id: form.agent_id,
          contract_type: form.type.toLowerCase(),
          compiled_at: form.sana,
          doc_num: form.raqam,
          comment: form.shartnoma
        };

        await axios.put(
          `https://fast-simple-crm.onrender.com/api/v1/contracts/${editId}`,
          contract, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );

        setRows(prev => prev.map(row => (row.id === editId ? { ...row, ...form } : row)));
        // Status ma'lumotlarini yangilash
        await getStatusContract();
        
        setEditId(null);
        setForm({ 
          korxona: "", 
          stir: "", 
          shartnoma: "", 
          sana: "", 
          raqam: "", 
          type: "SALES",
          agent_id: 0 
        });
        setSelectedCounterparty(null);
        setIsOpen(false);
      } catch (error) {
        console.error("Tahrirlashda xato:", error);
      }
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const getData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [resCounterparties, resContracts] = await Promise.all([
        axios.get("https://fast-simple-crm.onrender.com/api/v1/counterparties?type=customer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get("https://fast-simple-crm.onrender.com/api/v1/contracts?type=sales", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setCounterparties(resCounterparties.data);

      const contracts = resContracts.data.map((contract: any) => {
        const cp = resCounterparties.data.find((c: any) => c.id === contract.agent_id);

        return {
          id: contract.id,
          korxona: cp?.name || "Noma'lum",
          stir: cp?.tin || "-",
          shartnoma: contract.comment || "-",
          sana: contract.compiled_at || "-",
          raqam: contract.doc_num,
          type: contract.contract_type.toUpperCase() === "PURCHASE" ? "PURCHASE" : "SALES",
          agent_id: contract.agent_id
        };
      });

      setRows(contracts);
      
    } catch (error) {
      console.error("Ma'lumot olishda xato:", error);
    }
  };

  const getStatusContract = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`https://fast-simple-crm.onrender.com/api/v1/contracts/with-total`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      console.log(res);
      setRowsWithStatus(res.data);
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
    getStatusContract();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://fast-simple-crm.onrender.com/api/v1/products/with-quantity", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Mahsulotlarni olishda xato:", err);
      }
    };

    fetchProducts();
  }, []);

  const [diff, setDiff] = useState(0);
  
  useEffect(() => {
    let calc = 0;
    
    sales.forEach((item) => {
      if (item.movement_type === "out") {
        // Mahsulot chiqimi - summani qo'shamiz
        calc += item.price * item.quantity;
      } else if (item.movement_type === "in") {
        // To'lov kirimi - summani ayiramiz
        calc -= item.price;
      }
    });
    
    setDiff(calc);
  }, [sales]);

  const [debitTotal, setDebitTotal] = useState<number>(0)
  const [kreditTotal, setKreditTotal] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
     
  const getCalc = async (id:number) => {
    console.log(id);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`https://fast-simple-crm.onrender.com/api/v1/contracts/${id}/with-total`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      console.log(res);
      // console.log(res.data.debit);
      // console.log(res.data.credit);
      setDebitTotal(res.data.total_debit)
      setKreditTotal(res.data.total_credit)
      setTotal(res.data.total)
      
    } catch(error) {
      console.log(error);
    }
  }

  async function deleteItem(id:number, type: "in" | "out") {
    try {
      const token = localStorage.getItem("token");

      if(type === "in") {
        await axios.delete(`https://fast-simple-crm.onrender.com/api/v1/contract-payments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if(type === "out") {
        await axios.delete(`https://fast-simple-crm.onrender.com/api/v1/contract-products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      
      // Ichki jadvaldagi elementni darhol o'chirish
      setSales(prev => prev.filter(item => item.id !== id));
      
      // Status ma'lumotlarini yangilash
      await getStatusContract();
      
    } catch(error) {
      console.log("O'chirishda xato:", error);
      alert("O'chirishda xatolik yuz berdi");
    }
  }





  const [validationQuantity, setValidationQuantity] = useState(false)
  const [valPrd, setValPrd] = useState()

  const getPrdQuantity = (q:number) => {
    const prd = products.find(p=>p.id === q)
    console.log(q);
    console.log(prd);
    console.log(products);
    setValPrd(prd?.quantity)
  }

  useEffect(()=>{
    if(valPrd < inForm.quantity) {
      console.log("yetmaydi");
      setValidationQuantity(true)
      
    }else{
      console.log("yetadi");      
      setValidationQuantity(false)
    }
  }, [inForm.quantity, valPrd])









  const [isInOpen, setIsInOpen] = useState(false)
  const {bg, bg2, txt, mainBg} = useM()
  return (
    <CustomLayout>
        <div className={`${mainBg} w-full px-6 py-6`}>
          <h1 className={`text-xl font-bold mb-4`}>Korxonalar bilan bitimlar</h1>
          <div className="overflow-x-auto">
            <table className="border-collapse border border-gray-200 w-full text-sm shadow-md rounded-xl overflow-hidden">
              <thead className={`${bg2}  uppercase tracking-wide`}>
                <tr>
                  <th className="px-3 py-3 text-left">Tr</th>
                  <th className="px-3 py-3 text-left">Korxona</th>
                  <th className="px-3 py-3 text-left">Sana</th>
                  <th className="px-3 py-3 text-left">Raqam</th>
                  <th className="px-3 py-3 text-left">Shartnoma mazmuni</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-center flex items-center justify-center gap-2">
                    Instr
                    <button
                      className="p-2 bg-emerald-500 hover:bg-emerald-600 transition text-white rounded-full shadow"
                      onClick={() => setIsOpen((prev) => !prev)}
                    >
                      <FaCirclePlus />
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody className={`divide-y divide-gray-200 ${mainBg==="bg-[#1f1f1f]" ? "text-white" : "text-black"} `}>
                {/* Add Row Form */}
                <tr className={`${isOpen ? "table-row" : "hidden"} bg-emerald-50`}>
                  <td className="px-3 py-2 text-gray-500">#</td>
                  <td>
                    <select
                      className="w-11/12 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
                      name="agent_id"
                      value={selectedCounterparty || ""}
                      onChange={handleChange}
                    >
                      <option value="">Korxona tanlang</option>
                      {counterparties.map((cp) => (
                        <option key={cp.id} value={cp.id}>
                          {cp.name} (STIR: {cp.tin})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="date"
                      className="w-11/12 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
                      name="sana"
                      value={form.sana}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="w-11/12 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
                      name="raqam"
                      value={form.raqam}
                      onChange={handleChange}
                      placeholder="Raqam"
                    />
                  </td>
                  <td>
                    <input
                      className="w-11/12 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
                      name="shartnoma"
                      value={form.shartnoma}
                      onChange={handleChange}
                      placeholder="Shartnoma mazmuni"
                    />
                  </td>
                  <td>Status</td>
                  <td className="flex items-center justify-center gap-2">
                    {editId ? (
                      <button
                        onClick={saveEditRow}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 transition text-white rounded shadow"
                      >
                        Saqlash
                      </button>
                    ) : (
                      <button
                        onClick={addRow}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 transition text-white rounded shadow"
                      >
                        +
                      </button>
                    )}
                    <button
                      className="p-2 bg-red-200 hover:bg-red-400 transition rounded-full text-gray-700"
                      onClick={() => setIsOpen((prev) => !prev)}
                    >
                      <MdClose />
                    </button>
                  </td>
                </tr>

                {rows.length > 0 ? (
                  rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr className="hover:bg-emerald-50 transition">
                        <td className="px-3 py-2 font-medium text-gray-600">{row.id}</td>
                        <td className="px-3 py-2 flex items-center gap-2">
                          <div className={`
                            ${rowsWithStatus.find((x) => x.id === row.id)?.total > 0 ? "bg-green-700 drop-shadow-[0_0_6px_rgba(0,255,0,0.8)]" : (
                              rowsWithStatus.find((x) => x.id === row.id)?.total < 0 ? "bg-red-700 drop-shadow-[0_0_6px_rgba(255,0,0,0.8)]" : "bg-stone-700 drop-shadow-[0_0_6px_rgba(72,72,72,0.8)]"
                            )} w-[10px] h-[10px] rounded-[50%] 
                            `}>
                          </div>
                          <p>
                            <span>{row.korxona}</span> <br />
                            <small>{row.stir}</small>
                          </p>
                        </td>
                        <td className="px-3 py-2">{row.sana}</td>
                        <td className="px-3 py-2">{row.raqam}</td>
                        <td className="px-3 py-2">{row.shartnoma}</td>
                        <td className="px-3 py-2">
                          <div className="st inline-block mx-2">
                            <b>Debitor</b> <br />
                            <strong className='text-green-600'>{rowsWithStatus.find((x) => x.id === row.id)?.total > 0 ? rowsWithStatus.find((x) => x.id === row.id)?.total : 0}</strong>
                          </div>
                          <div className="st inline-block mx-2">
                            <b>Kreditor</b> <br />
                            <strong className='text-red-600'>{rowsWithStatus.find((x) => x.id === row.id)?.total < 0 ? (Math.abs(rowsWithStatus.find((x) => x.id === row.id)?.total)) : 0}</strong>
                          </div>
                        </td>
                        <td className="flex py-2 justify-center gap-2 items-center">
                          <button
                            onClick={() => {
                              toggleRow(row.id, row.type);
                              getCalc(row.id);
                              setSelectedContract(row.id);
                            }}
                            className="p-2 bg-emerald-200 hover:bg-emerald-400 transition rounded-full"
                          >
                            <MdAddToQueue />
                          </button>
                          <button
                            onClick={() => {
                              startEditRow(row.id, "MAIN");
                              setIsOpen(true);
                            }}
                            className="p-2 bg-yellow-200 hover:bg-yellow-400 transition rounded-full"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => removeRow(row.id)}
                            className="p-2 bg-red-200 hover:bg-red-400 transition rounded-full"
                          >
                            <MdClose />
                          </button>
                        </td>
                      </tr>

                      {/* Ichki jadval */}
                      {openRow === row.id && (
                        <tr>
                          <td colSpan={7}>
                            <table className="w-full border mt-2 rounded-lg overflow-hidden">
                              <caption className={`${bg2} ${txt} py-3 uppercase tracking-wide`}>Korxona bilan tuzilgan bitim bo`yicha aylanmalar</caption>
                              <thead className={`${bg2} ${txt} uppercase tracking-wide`}>
                                <tr>
                                  <th className="px-3 py-2 text-left">Tr</th>
                                  <th className="px-3 py-2 text-left">Sana</th>
                                  <th className="px-3 py-2 text-left">Turi</th>
                                  <th className="px-3 py-2 text-left">Izoh</th>
                                  <th className="px-3 py-2 text-left">Mahsulot</th>
                                  <th className="px-3 py-2 text-left">Miqdor</th>
                                  <th className="px-3 py-2 text-left">Narx</th>
                                  <th className="px-3 py-2 text-left">Debit</th>
                                  <th className="px-3 py-2 text-left">Kredit</th>
                                  <th className="px-3 py-2 flex gap-3 items-center">
                                    <button onClick={()=>setIsInOpen(prev=>!prev)} className="p-2 bg-emerald-500 hover:bg-emerald-600 transition text-white rounded-full shadow">
                                      <FaPlusCircle />
                                    </button>
                                  </th>
                                </tr>
                              </thead>

                              <tbody className={`divide-y divide-gray-200 ${mainBg==="bg-[#1f1f1f]" ? "text-white" : "text-black"} `}>
                                {/* Form Row ichki jadvalda */}
                                <tr className={`${isInOpen ? "table-row" : "hidden"} py-`}>
                                  <td className="px-3 py-5 text-gray-500">#</td>
                                  <td>
                                    <input
                                      className="w-11/12 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
                                      type="date"
                                      name="date"
                                      value={inForm.date}
                                      onChange={handleInChange}
                                    />
                                  </td>
                                  <td>
                                    <select
                                      name="movement_type"
                                      value={inForm.movement_type}
                                      onChange={handleInChange}
                                      className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
                                    >
                                      <option value="in">To`lov</option>
                                      <option value="out">Mahsulot</option>
                                    </select>
                                  </td>
                                  <td>
                                    <input
                                      className="w-full border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
                                      name="comment"
                                      value={inForm.comment}
                                      onChange={handleInChange}
                                      placeholder="Izoh"
                                    />
                                  </td>
                                  <td>
                                    {inForm.movement_type === "out" ? (
                                      <select
                                        className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none w-11/12"
                                        value={selectedProduct || ""}
                                        onChange={(e) => {
                                          setSelectedProduct(Number(e.target.value));
                                          getPrdQuantity(Number(e.target.value))
                                        }}
                                      >
                                        <option value="">Mahsulot tanlang</option>
                                        {products.map((p) => (
                                          <option key={p.id} value={p.id}>
                                            {p.name} <br /> (SKU: {p.sku}) <br />
                                            Narxi: {p.price} <br />
                                            Soni: {p.quantity}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <span className="text-gray-400 italic">
                                        To`lovda mahsulot tanlanmaydi
                                      </span>
                                    )}
                                  </td>
                                  <td className='relative'>
                                    <span className={`${validationQuantity ? "inline-block absolute top-0 left-1.5  text-red-500 font-semibold text-[9px] lg:text-[10px]" : "hidden"}`}>Mahsulot soni kam</span>
                                    <input
                                      type="number"
                                      min={0}
                                      name="quantity"
                                      value={inForm.quantity}
                                      onChange={handleInChange}
                                      disabled={inForm.movement_type !== "out"}
                                      className={`w-11/12 border rounded-lg px-2 py-1 ${
                                        inForm.movement_type !== "out"
                                          ? "bg-gray-100 text-gray-400"
                                          : "focus:ring-emerald-400"
                                      }
                                      ${validationQuantity ? "border-red-600 text-red-600 font-semibold bg-red-300" : "border bg-none "}
                                      `}
                                      placeholder={
                                        inForm.movement_type === "out"
                                          ? "Mahsulot soni"
                                          : "To'lovda son kiritilmaydi"
                                      }
                                    />
                                    
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      min={0}
                                      className="w-11/12 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-400 outline-none"
                                      name="price"
                                      value={inForm.price}
                                      onChange={handleInChange}
                                      placeholder="Narx"
                                    />
                                  </td>
                                  <td>-</td>
                                  <td></td>
                                  <td className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={addInRow}
                                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 transition text-white rounded shadow"
                                    >
                                      +
                                    </button>
                                    <button
                                      onClick={() => {
                                        setIsInOpen(prev=>!prev)
                                        setInForm({
                                          date: "",
                                          movement_type: "out",
                                          quantity: 0,
                                          price: 0,
                                          comment: "",
                                          amount: "0",
                                        });
                                        setSelectedProduct(null);
                                      }}
                                      className="p-2 bg-red-200 hover:bg-red-400 transition rounded-full text-gray-700"
                                    >
                                      <MdClose />
                                    </button>
                                  </td>
                                </tr>

                                {/* Sales rows */}
                                {sales.length > 0 ? (
                                  sales.map((item, index) => (
                                  <tr
                                    key={`${item.id}-${index}`}
                                    className="hover:bg-red-50 transition"
                                  >
                                    <td className="px-3 py-2">{index + 1}</td>
                                    <td className="px-3 py-2">{item.date}</td>
                                    <td className="px-3 py-2 font-semibold">
                                      {item.movement_type === "out"
                                        ? "Mahsulot"
                                        : "To'lov"}
                                    </td>
                                    <td className="px-3 py-2">{item.comment}</td>
                                    <td className="px-3 py-2 font-semibold">
                                      {item.movement_type === "out"
                                        ? (item as any).product_name || "Noma'lum mahsulot"
                                        : "-"}
                                    </td>
                                    <td
                                      className={`px-3 py-2 ${
                                        !item.quantity ? "bg-gray-200 text-gray-400 italic" : ""
                                      }`}
                                    >
                                      {item.quantity || "-"}
                                    </td>
                                    <td className="px-3 py-2 font-medium">{item.price}</td>
                                    <td  className="px-3 py-2 font-medium">
                                      {item.movement_type === "out" && item.quantity
                                        ? `${(
                                            Number(item.price) * Number(item.quantity)
                                          )
                                            .toLocaleString("uz-UZ")
                                            .replace(/,/g, " ")}`
                                        : ""}
                                    </td>
                                    
                                    <td className="px-3 py-2 font-medium">
                                      {item.movement_type === "in"
                                        ? `${Number(item.price)
                                            .toLocaleString("uz-UZ")
                                            .replace(/,/g, " ")}`
                                        : ""}
                                    </td>
                                    
                                    <td className="px-3 py-2 flex gap-3 items-center">
                                      <button className="p-1 bg-yellow-200 hover:bg-yellow-400 rounded">
                                        ✏️
                                      </button>
                                      <button
                                        onClick={() =>
                                          deleteItem(item.id, item.movement_type)
                                        }
                                        className="p-1 bg-red-200 hover:bg-red-400 rounded"
                                      >
                                        🗑️
                                      </button>
                                    </td>
                                  </tr>
                                ))
                                ) : (
                                  <tr>
                                    <td colSpan={12} className='text-center'>Ushbu bitim bilan aylanmalar mavjud emas!</td>
                                  </tr>
                                )}

                                {/* Totals */}
                                {
                                  sales.length > 0 ? (
                                    <tr className="font-semibold">
                                  <td colSpan={7} className="text-right"></td>
                                  <td colSpan={2} className="px-3 py-2 text-center text-[12px]">
                                    <b>Jami debit</b> <br />
                                    <strong>
                                      {rowsWithStatus.find((x) => x.id === row.id)?.total_debit
                                        .toLocaleString("uz-UZ")
                                        .replace(/,/g, " ")}{" "}
                                      so`m
                                    </strong>
                                  </td>
                                  <td colSpan={2} className="px-3 py-2 text-center text-[12px]">
                                    <b>Jami kredit</b>
                                    <br />
                                    <strong>
                                      {rowsWithStatus.find((x) => x.id === row.id)?.total_credit
                                        .toLocaleString("uz-UZ")
                                        .replace(/,/g, " ")}{" "}
                                      so`m
                                    </strong>
                                  </td>
                                  <td colSpan={1}></td>
                                </tr>
                                  ) : null
                                }
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="bg-stone-200 text-center py-4">
                      Bitimlar mavjud emas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </CustomLayout>
  )
}

export default Import