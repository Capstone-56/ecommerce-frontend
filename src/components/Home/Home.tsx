import { useEffect } from "react"
import Navbar from "../Navigation/Navigation";

export default function Home() {
  useEffect(() => {
    document.title = "eCommerce | Home"
  }, []);
  
  return (
    <>
      <Navbar/>
      <div>Home</div>
      
    </>
  )
}
