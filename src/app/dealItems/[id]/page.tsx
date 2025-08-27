'use client'

import React, { useEffect, useState } from 'react'
import CustomLayout from '../../customLayout'
import SideBar from '@/components/sidebar'
import { useM } from '../../context'
import { FaFilter } from 'react-icons/fa'
import { useParams } from 'next/navigation'
import useApi from '../../queries'
import axios from 'axios'

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

const DealItems: React.FC = () => {
  const { setHeaderTitle } = useM()
  const { customersAll } = useApi()

  const [customerName, setCustomerName] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [dealItems, setDealItems] = useState<DealItem[]>([])
  
  // Form states
  const [prdName, setPrdName] = useState('')
  const [prdSku, setPrdSku] = useState('')
  const [prdPrice, setPrdPrice] = useState<number>(0)
  const [prdUnit, setPrdUnit] = useState('')
  const [prdDesc, setPrdDesc] = useState('')
  const [prdQuantity, setPrdQuantity] = useState<number>(0)
  const [dealtItemPrice, setDealItemPrice] = useState<number>(0)
  
  const params = useParams<{ id: string }>()
  const token = localStorage.getItem("token")
  
  // Header title
  useEffect(() => {
    setHeaderTitle("Bitimlar")
  }, [setHeaderTitle])
  
  // Customer name by id
  useEffect(() => {
    if (customersAll.length > 0 && params?.id) {
      const found = customersAll.find(e => e.id === parseInt(params.id))
      if (found) setCustomerName(found.name)
      }
  }, [customersAll, params?.id])
  
  // DealItem total price
  useEffect(() => {
    if (prdPrice && prdQuantity) {
      setDealItemPrice(prdPrice * prdQuantity)
    } else {
      setDealItemPrice(0)
    }
  }, [prdPrice, prdQuantity])
  
  // Fetch products & deal items
  useEffect(() => {
    async function fetchData() {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        
        const resProducts = await axios.get<Product[]>(
          "https://fast-simple-crm.onrender.com/api/v1/products",
          { headers }
        )
        setProducts(resProducts.data)
        
        const resDealItems = await axios.get<DealItem[]>(
          "https://fast-simple-crm.onrender.com/api/v1/deal-items",
          { headers }
        )
        setDealItems(resDealItems.data)
        // console.log(resDealItems);
        
      } catch (err) {
        console.log("Fetch error:", err)
      }
    }
    fetchData()
  }, [token])
  
  // console.log(products);
  
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

      const resProduct = await axios.post<Product>(
        "https://fast-simple-crm.onrender.com/api/v1/products",
        product,
        { headers }
      )

      const createdProduct = resProduct.data

      
      const di = {
        user_id: 1,
        deal_id: 1,
        product_id: createdProduct.id,
        quantity: prdQuantity,
        price: Number(prdPrice) * Number(prdQuantity),
      }

      const resDealItem = await axios.post<DealItem>(
        "https://fast-simple-crm.onrender.com/api/v1/deal-items",
        di,
        { headers }
      )

      console.log("DealItem yaratildi:", resDealItem.data)
    } catch (err) {
      console.log("Post error:", err)
    }
  }

  // Delete deal item
  async function delItem(id: number, prdId: number) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    // 1. DealItem ni o‘chirish
    await axios.delete(
      `https://fast-simple-crm.onrender.com/api/v1/deal-items/${id}`,
      { headers }
    )

    // 2. Product ni o‘chirish
    await axios.delete(
      `https://fast-simple-crm.onrender.com/api/v1/products/${prdId}`,
      { headers }
    )

    // 3. UI yangilash
    setDealItems(prev => prev.filter(d => d.id !== id))
    setProducts(prev => prev.filter(p => p.id !== prdId))
  } catch (err) {
    console.log("Delete error:", err)
  }
}


  
  



const [editId, setEditId] = useState<number | null>(null)
const [editDealId, setEditDealId] = useState<number | null>(null)

// Edit tugmasi bosilganda inputlarni to‘ldirish
function startEdit(prd: Product, deal?: DealItem) {
  console.log(deal);
  
  setEditId(prd.id)
  setPrdName(prd.name)
  setPrdSku(prd.sku)
  setPrdPrice(prd.price)
  setPrdUnit(prd.unit)
  setPrdDesc(prd.description)
  if (deal) {
    setPrdQuantity(deal.quantity)
    setDealItemPrice(deal.price)
    setEditDealId(deal.id)
  }
}


async function updateItem() {
  // if (!editId || !editDealId) return
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    // 1. Product update
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

    // 2. DealItem update
    const updatedDeal = {
      quantity: prdQuantity,
      price: Number(prdPrice) * Number(prdQuantity),
    }

    console.log(editDealId);
    
    await axios.patch(
      `https://fast-simple-crm.onrender.com/api/v1/deal-items/${editDealId}`,
      updatedDeal,
      { headers }
    )

    // UI yangilash
    setProducts(prev =>
      prev.map(p => (p.id === editId ? { ...p, ...updatedProduct } : p))
    )
    setDealItems((prev: DealItem[]) =>
      prev.map(d => (d.id === editDealId ? { ...d, ...updatedDeal } : d))
    )

    // Form reset
    setEditId(null)
    setEditDealId(null)
    setPrdName('')
    setPrdSku('')
    setPrdPrice(0)
    setPrdUnit('')
    setPrdDesc('')
    setPrdQuantity(0)
    setDealItemPrice(0)
  } catch (err) {
    console.log("Update error:", err)
  }
}

// DealItems komponenti ichida
const mergedDealItems = dealItems.map(di => {
  const product = products.find(p => p.id === di.product_id)

  return {
    ...di,          // dealItem ma’lumotlari (id, quantity, price)
    product,        // shu dealItemga bog‘liq product
  }
})

useEffect(()=>{
  console.log(mergedDealItems);
  console.log(dealItems);
},[mergedDealItems])





  return (
    <CustomLayout>
      <div className='customers relative main grid grid-cols-12 gap-2.5'>
        <SideBar />

        <div className="sect flex flex-col gap-6 w-full col-span-12 lg:col-span-11 px-6 py-6">

          {/* Header */}
          <div className="flex w-full justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {customerName} bilan tuzilgan bitimlar
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
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Quantity</th>
                  <th className="px-3 py-2">Bitim qiymati</th>
                  <th className="px-3 py-2 text-center">Amallar</th>
                </tr>

                {/* Add new row */}
                <tr className="bg-white">
                  <td className="px-3 py-2 text-gray-500">0</td>
                  <td><input value={prdName} onChange={e=>setPrdName(e.target.value)} className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='Mahsulot nomi' /></td>
                  <td><input value={prdSku} onChange={e=>setPrdSku(e.target.value)} className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='SKU' /></td>
                  <td><input value={prdPrice} onChange={e=>setPrdPrice(Number(e.target.value))} type="number" className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='Narxi' /></td>
                  <td><input value={prdUnit} onChange={e=>setPrdUnit(e.target.value)} className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='Birligi' /></td>
                  <td><input value={prdDesc} onChange={e=>setPrdDesc(e.target.value)} className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='Tavsif' /></td>
                  <td><input value={prdQuantity} onChange={e=>setPrdQuantity(Number(e.target.value))} type="number" min={0} className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='Hajmi' /></td>
                  <td><input value={dealtItemPrice ?? ''} readOnly className="w-full px-2 py-1 rounded-md outline-none focus:ring-2 focus:ring-indigo-400" placeholder='Bitim qiymati' /></td>
                  <td className="text-center">
                    <button onClick={postProduct} className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-lg'>+</button>
                  </td>
                </tr>
              </thead>

              <tbody className="bg-white divide-y">
              {mergedDealItems.length > 0 ? (
                mergedDealItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2">{item.product?.name}</td>
                    <td className="px-3 py-2">{item.product?.sku}</td>
                    <td className="px-3 py-2">{item.product?.price}</td>
                    <td className="px-3 py-2">{item.product?.unit}</td>
                    <td className="px-3 py-2">{item.product?.description}</td>
                    <td className="px-3 py-2">{item.quantity}</td>
                    <td className="px-3 py-2">{item.price}</td>
                    <td className="px-3 py-2 flex gap-2">
                      {editId === item.product?.id ? (
                        <button 
                          onClick={updateItem} 
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                        >
                          Save
                        </button>
                      ) : (
                        <button 
                          onClick={() => item.product && startEdit(item.product, item)} 
                          className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md"
                        >
                          Edit
                        </button>
                      )}
                      <button 
                        onClick={() => item.product && delItem(item.id, item.product.id)} 
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className='text-center py-4 text-gray-500'>
                    Mahsulotlar mavjud emas
                  </td>
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

export default DealItems
