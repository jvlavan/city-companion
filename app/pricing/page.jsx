"use client"
import { title } from "@/components/primitives";

import { useEffect,useState } from "react";


export default function PricingPage() {
  const [map, setMap] = useState();
const mapcall=async () => {
  const response = await fetch("https://serpapi.com/search.json?engine=google_maps&q=turf%20chennai&google_domain=google.com&hl=en&type=search&api_key="+process.env.NEXT_PUBLIC_TURF_API)
  const data=await response.json()
  setMap(data);
  console.log(data)
  Console.log(map)
  }
  useEffect(()=>{
    mapcall();
  },[]);
  
  return (
    <div>
      <h1 className={title()}>Pricing</h1>

    </div>
  );

}