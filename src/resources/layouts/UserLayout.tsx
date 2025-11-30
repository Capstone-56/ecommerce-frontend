import { Outlet } from "react-router-dom";

import Navbar from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";
import PreHeader from "../components/PreHeader/PreHeader";
import { useEffect, useRef, useState } from "react";

export default function UserLayout() {
  const headerElemRef = useRef<HTMLDivElement>(null);
  const [layoutMinHeight, setLayoutMinHeight] = useState<number | null>(null);

  useEffect((): void => {
    const headerElem = headerElemRef.current;

    if (!headerElem) {
      return;
    }

    setLayoutMinHeight(window.innerHeight - headerElem.clientHeight);
  }, []);

  return (
    <>
      <div ref={headerElemRef}>
        <PreHeader />
        <Navbar />
      </div>

      {layoutMinHeight && (
        <>
          <div
            className="layout"
            style={{
              minHeight: `${layoutMinHeight}px`
            }}
          >
            <Outlet />
          </div>

          <Footer />
        </>
      )}
    </>
  );
}
