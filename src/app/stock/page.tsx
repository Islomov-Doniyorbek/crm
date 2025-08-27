'use client'

import React, { useEffect, useState } from 'react'
import CustomLayout from '../customLayout'
import SideBar from '@/components/sidebar'
import { useM } from '../context'
import { FaFilter } from 'react-icons/fa'
import { useParams } from 'next/navigation'
import useApi from '../queries'
import axios, { AxiosError } from 'axios'

// Interfaces
interface Customers {
  id: number
  user_id: number
  phone: string
  name: string
  about: string
}
interface Product {
  id: number
  name: string
  sku: string
  price: number
  unit: string
  description: string
}
interface DealItem {
  id: number
  product_id: number
  quantity: number
  price: number
}
interface Stock {
  id: number
  product_id: number
  quantity: number
}

const Stock: React.FC = () => {
  const { setHeaderTitle } = useM()
  const { customersAll } = useApi()

  const [customerName, setCustomerName] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [stocks, setStocks] = useState<Stock[]>([])
  
  // Form states
  const [prdName, setPrdName] = useState('')
  const [prdSku, setPrdSku] = useState('')
  const [prdPrice, setPrdPrice] = useState<number>(0)
  const [prdUnit, setPrdUnit] = useState('')
  const [prdDesc, setPrdDesc] = useState('')
  const [stockQuantity, setStockQuantity] = useState<number>(0)

  const params = useParams<{ id: string }>()
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  
  // Header title
  useEffect(() => {
    setHeaderTitle("Ombor")
  }, [setHeaderTitle])
  
  // Customer name by id
  useEffect(() => {
    if (customersAll.length > 0 && params?.id) {
      const found = customersAll.find(e => e.id === parseInt(params.id))
      if (found) setCustomerName(found.name)
    }
  }, [customersAll, params?.id])
  
  // Fetch products & stocks
  useEffect(() => {
    async function fetchData() {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        
        const resProducts = await axios.get<Product[]>(
          "https://fast-simple-crm.onrender.com/api/v1/products",
          { headers }
        )
        setProducts(resProducts.data)
        
        const resStock = await axios.get<Stock[]>(
          "https://fast-simple-crm.onrender.com/api/v1/stocks",
          { headers }
        )
        setStocks(resStock.data)
        
      } catch (err) {
        console.log("Fetch error:", err)
      }
    }
    fetchData()
  }, [token])

  // Create product + stock (product_id bilan stock post qilish)
  async function postProduct() {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const product = {
        user_id: 1,
        name: prdName,
        sku: prdSku,
        price: Number(prdPrice),
        unit: prdUnit,
        description: prdDesc,
      }

      // 1) Product yaratish
      const resProduct = await axios.post<Product>(
        "https://fast-simple-crm.onrender.com/api/v1/products",
        product,
        { headers }
      )

      const createdProduct = resProduct.data

      // 2) Stock yaratish product_id bilan
      const stockPayload = {
        product_id: createdProduct.id,
        quantity: Number(stockQuantity)
      }

      const resStock = await axios.post<Stock>(
        "https://fast-simple-crm.onrender.com/api/v1/stocks",
        stockPayload,
        { headers }
      )

      // 3) Lokal state yangilash
      setProducts(prev => [...prev, createdProduct])
      setStocks(prev => [...prev, resStock.data])

      // Formni tozalash
      setPrdName('')
      setPrdSku('')
      setPrdPrice(0)
      setPrdUnit('')
      setPrdDesc('')
      setStockQuantity(0)

      console.log("Created:", createdProduct, resStock.data)
    } catch (err) {
      console.log("Post error:", err)
    }
  }

  // Delete stock (va xohlasangiz product) — endpoint kichik harflar bilan 'stocks'
  async function delItem(stockId: number, prdId: number) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    if (!confirm("O'chirasizmi?")) return

    // 1) Stockni o'chirish
    await axios.delete(
      `https://fast-simple-crm.onrender.com/api/v1/stocks/${stockId}`,
      { headers }
    )

    // 2) Productni ham o'chirish (agar kerak bo'lsa)
    await axios.delete(
      `https://fast-simple-crm.onrender.com/api/v1/products/${prdId}`,
      { headers }
    )

    // 3) UI yangilash
    setStocks(prev => prev.filter(s => s.id !== stockId))
    setProducts(prev => prev.filter(p => p.id !== prdId))
  } catch (err) {
    const error = err as AxiosError

    console.log("Delete error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })
  }
}

  // Edit / update product (faqat misol uchun)
  const [editId, setEditId] = useState<number | null>(null)
  const [editStockId, setEditStockId] = useState<number | null>(null)

function startEdit(prd: Product, stock?: Stock) {
  setEditId(prd.id)
  setPrdName(prd.name)
  setPrdSku(prd.sku)
  setPrdPrice(prd.price)
  setPrdUnit(prd.unit)
  setPrdDesc(prd.description)
  
  if (stock) {
    setEditStockId(stock.id)
    setStockQuantity(stock.quantity) 
  }
}


  async function updateItem() {
    if (!editId) return
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const updatedProduct = {
        name: prdName,
        sku: prdSku,
        price: prdPrice,
        unit: prdUnit,
        description: prdDesc,
      }

      await axios.patch(
        `https://fast-simple-crm.onrender.com/api/v1/products/${editId}`,
        updatedProduct,
        { headers }
      )

        const updatedDeal = {
            quantity: stockQuantity,
        }

        console.log(editStockId);
        
        await axios.patch(
        `https://fast-simple-crm.onrender.com/api/v1/stocks/${editStockId}`,
        updatedDeal,
        { headers }
        )

      // Lokal UI yangilash
      setProducts(prev => prev.map(p => p.id === editId ? { ...p, ...updatedProduct } : p))
      setStocks(prev =>
        prev.map(s => s.id === editStockId ? { ...s, quantity: stockQuantity } : s)
      )

      // Reset form
      setEditId(null)
      setEditStockId(null)
      setPrdName('')
      setPrdSku('')
      setPrdPrice(0)
      setPrdUnit('')
      setPrdDesc('')
    } catch (err) {
      console.log("Update error:", err)
    }
  }

  return (
    <CustomLayout>
      <div className='customers relative main grid grid-cols-12 gap-2.5'>
        <SideBar />

        <div className="sect flex flex-col gap-6 w-full col-span-12 lg:col-span-11 px-6 py-6">

          {/* Header */}
          <div className="flex w-full justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Ombordagi mahsulotlar
            </h1>
            <div className="flex gap-3 items-center">
              <select className='py-2 px-3 rounded-xl bg-indigo-500 text-white'>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
              <button className='py-2 px-3 rounded-xl bg-indigo-500 text-white flex gap-2 items-center'>
                Filter <FaFilter />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-[1000px] border border-gray-300 text-sm shadow rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-3 py-2">T/R</th>
                  <th className="px-3 py-2">Mahsulot nomi</th>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Unit</th>
                  <th className="px-3 py-2">Tavsif</th>
                  <th className="px-3 py-2">Stock Quantity</th>
                  <th className="px-3 py-2 text-center">Amallar</th>
                </tr>

                {/* Add new row */}
                <tr className="bg-white">
                  <td className="px-3 py-2 text-gray-500">0</td>
                  <td>
                    <input value={prdName} onChange={e=>setPrdName(e.target.value)} className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='Mahsulot nomi' />
                  </td>
                  <td>
                    <input value={prdSku} onChange={e=>setPrdSku(e.target.value)} className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='SKU' />
                  </td>
                  <td>
                    <input value={prdPrice} onChange={e=>setPrdPrice(Number(e.target.value))} type="number" className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='Narxi' />
                  </td>
                  <td>
                    <input value={prdUnit} onChange={e=>setPrdUnit(e.target.value)} className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='Birligi' />
                  </td>
                  <td>
                    <input value={prdDesc} onChange={e=>setPrdDesc(e.target.value)} className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='Tavsif' />
                  </td>
                  <td>
                    <input value={stockQuantity} onChange={e=>setStockQuantity(Number(e.target.value))} type="number" min={0} className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='Hajmi' />
                  </td>
                  <td className="text-center">
                    <button onClick={postProduct} className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-lg'>+</button>
                  </td>
                </tr>
              </thead>

              <tbody className="bg-white divide-y">
                {products.length > 0 ? (
                  products.map((prd, idx) => {
                    const relatedStock = stocks.find(s => s.product_id === prd.id)

                    return (
                      <tr key={prd.id}>
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2">{prd.name}</td>
                        <td className="px-3 py-2">{prd.sku}</td>
                        <td className="px-3 py-2">{prd.price}</td>
                        <td className="px-3 py-2">{prd.unit}</td>
                        <td className="px-3 py-2">{prd.description}</td>
                        <td className="px-3 py-2">{relatedStock?.quantity ?? 0}</td>
                        <td className="px-3 py-2 flex gap-2">
                          {editId === prd.id ? (
                            <button onClick={updateItem} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md">Save</button>
                          ) : (
                            <button 
                                onClick={() => startEdit(prd, relatedStock)} 
                                className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md"
                                >
                                Edit
                            </button>
                          )}

                          <button
                            onClick={() => relatedStock && delItem(relatedStock.id, prd.id)}
                            disabled={!relatedStock}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-md"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className='text-center py-4 text-gray-500'>Mahsulotlar mavjud emas</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </CustomLayout>
  )
}

export default Stock
