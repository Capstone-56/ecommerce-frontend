import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found"
  }, []);
  
  return (
    <>
      <div>Page Not Found</div>
    </>
  );
};
