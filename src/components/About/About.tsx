import { useEffect } from "react";
import Navbar from "../Navigation/Navigation";

export default function About() {
  useEffect(() => {
    document.title = "About Page";
  }, []);

  return (
    <>
      <Navbar />
      <div>About</div>
    </>
  );
}
