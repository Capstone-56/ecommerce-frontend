import { useEffect } from "react";

import { UserService } from "@/services/user-service";

export default function Home() {
  useEffect(() => {
    document.title = "eCommerce | Home"
  }, []);
  
  return (
    <>
      <div>Home</div>
      <button onClick={UserService.getUser}>GET</button>
    </>
  )
}
