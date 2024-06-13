import { Currency } from "lucide-react"

export const formatPrice=(price:number)=>{
    return new Intl.NumberFormat("en-us",{
        style:"currency",
        currency:"Ksh"
    }).format(price)
}