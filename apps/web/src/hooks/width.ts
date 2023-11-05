import { useEffect, useState } from "react";

export const useWidth = () => {
  const [width, setWidth] = useState(
    "window" in globalThis ? window.innerWidth : 0,
  );
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return width;
};
