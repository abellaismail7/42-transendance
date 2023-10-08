import { useEffect, useRef } from "react";
import { Button, Header, RootLayout } from "ui";
import * as wasm from "wasm-pingpong";

export default function LandingPage() {
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    try {
      wasm.run_bevy();
    } catch (error) {
      if (!error.message.startsWith("Using exceptions for control flow,"))
        throw error;
    }
    //wasm.run_bevy();
    ref.current = true;
  }, []);
  return (
    <RootLayout>
      <div className="bg-black text-white">test Tailwind</div>
      <canvas id="canvas" />
      <Header text="Web" />
      <Button />
    </RootLayout>
  );
}
