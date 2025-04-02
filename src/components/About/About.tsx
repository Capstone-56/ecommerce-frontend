import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.title = "About Page";
  }, []);

  return (
    <>
      <div>About</div>
    </>
  );
};
