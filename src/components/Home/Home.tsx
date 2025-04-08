import { useEffect, useState } from "react"

import { TestService } from "../API/test-service";


export default function Home() {
  const [userData, setUserData] = useState(null); // Store the fetched data

  const handleButtonClick = async () => {
    try {
      const user = {"username": "test", "name": "Xavier", "email": "test@gmail.com", "password": "testPassword"};
      const data = await TestService.createUser(user); // Call the API
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
      <button onClick={handleButtonClick}>POST</button>
      {userData && <p>{JSON.stringify(userData)}</p>}

      <button onClick={TestService.testApiCall("test")}>GET</button>
    </>
  )
}
