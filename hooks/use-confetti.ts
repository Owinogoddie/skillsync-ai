import {create} from 'zustand'
type Confetti={
    isOpen:boolean
    onOpen:()=>void
    onClose:()=>void
}

export const useconfettiStore=create<Confetti>((set)=>({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false}),
}))