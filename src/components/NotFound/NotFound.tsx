import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found"
  }, []);
  
  return (
    <>
      <div>Page Not Found</div>
      <Link to="/"><button>Return Home</button></Link>
    </>
  );
};
