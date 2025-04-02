import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    document.title = "eCommerce | Home"
  }, []);
  
  return (
    <>
      <div>Home</div>
    </>
  )
}
