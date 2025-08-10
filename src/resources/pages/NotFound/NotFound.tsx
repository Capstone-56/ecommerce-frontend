import { Constants } from "@/domain/constants";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found";
  }, []);

  return (
    <>
      <h1>404</h1>
      <h3>Page Not Found</h3>
      <Link to={Constants.HOME_ROUTE}>
        <button>Go home</button>
      </Link>
    </>
  );
}
