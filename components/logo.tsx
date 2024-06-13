import Image from "next/image"

export const Logo=()=>{
    return(
        <Image
        alt="logo"
        src="/logo.svg"
        height={130}
        width={130}
        />
    )
}