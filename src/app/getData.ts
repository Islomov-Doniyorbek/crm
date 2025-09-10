'use client'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const token = localStorage.getItem("token");

async function fetchCustomers() {
  const { data } = await axios.get(
    "https://fast-simple-crm.onrender.com/api/v1/counterparties?type=customer",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(data);
  
  return data;
}

// ✅ Custom hook nomi `use...` bilan boshlanishi kerak
export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });
}

