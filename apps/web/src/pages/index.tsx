import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { RootLayout } from "ui";
import { Box } from "~/components/box";
import { Paddle } from "~/components/paddle";
import { KeyRecorder } from "~/components/recorder";
import { config } from "~/game/config";

export default function LandingPage() {
  const ref = useRef(false);
  const [down, setDown] = useState(0);

  //const [up, setUp] = useRef(false);
  useEffect(() => {
    ref.current = true;
  }, []);
  return (
    <RootLayout>
      <KeyRecorder
        handleKeyUp={(code) => {
          if (code == "ArrowDown" || code == "ArrowUp") {
            setDown(0);
          }
        }}
        handleKeyDown={(code) => {
          if (code == "ArrowDown") {
            setDown(2);
          }
          if (code == "ArrowUp") {
            setDown(1);
          }
        }}
        className="h-screen w-screen"
      >
        <Canvas
          camera={{
            fov: config.fov,
            near: 0.1,
            position: [0, 0, 20],
          }}
        >
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {/* PADDLES */}
          <Paddle down={down} />
          {/* END PADDLES */}

          <Box
            mmaterial={{
              color: "purple",
            }}
            position={[15, -4, 0]}
            scale={[1, config.bitch.x, 1]}
          />
          <Box
            mmaterial={{
              color: "purple",
            }}
            position={[-15, -4, 0]}
            scale={[1, config.bitch.x, 1]}
          />
          <Box
            mmaterial={{
              color: "purple",
            }}
            position={[0, 5.5, 0]}
            scale={[30, 1, 1]}
          />
          <Box
            mmaterial={{
              color: "purple",
            }}
            position={[0, -13.5, 0]}
            scale={[30, 1, 1]}
          />
        </Canvas>
      </KeyRecorder>
    </RootLayout>
  );
}
