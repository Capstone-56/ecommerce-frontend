import { useEffect, useState } from "react"
import { testCreateUser } from "../API/testAPI";


export default function Home() {
  const [userData, setUserData] = useState(null); // Store the fetched data

  const handleButtonClick = async () => {
    try {
      const user = {"id": "1", "name": "Xavier"};
      const data = await testCreateUser(user); // Call the API
      setUserData(data); // Set the response data in state
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = "eCommerce | Home"
  }, []);
  
  return (
    <>
      <div>Home</div>
      <button onClick={handleButtonClick}></button>
      {userData && <p>{JSON.stringify(userData)}</p>}
    </>
  )
}
