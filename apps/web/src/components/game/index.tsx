import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { useQuery } from "react-query";
import { Ball } from "~/components/game/ball";
import { Paddle } from "~/components/game/paddle";
import { KeyRecorder } from "~/components/game/recorder";
import { useWidth } from "~/hooks/width";
import { socket } from "~/utils/api";
import { configGet } from "~/utils/repo/game";
import { Plane } from "./plane";
export function Game() {
  const [down, setDown] = useState(0);
  const width = useWidth();

  const {
    data: config,
    isLoading,
    error,
  } = useQuery("/game/config", configGet);

  if (isLoading || !config) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  return (
    <KeyRecorder
      style={{
        width: width,
        height: width * config.aspect,
      }}
      className="bg-black"
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
        if (code == "KeyD") {
          socket.emit("debug");
        }
      }}
    >
      <Canvas
        camera={{
          fov: config.fov,
          near: config.near,
          position: config.cameraPosition,
        }}
      >
        <ambientLight />
        <pointLight
          intensity={1}
          color="#fff"
          position={config.cameraPosition}
        />

        <Paddle down={down} config={config} />
        <Ball config={config} />

        <Plane
          mmaterial={{
            color: "green",
          }}
          position={[0, 0, -1]}
          scale={[config.worldWidth, config.worldHeight, 1]}
        />
      </Canvas>
    </KeyRecorder>
  );
}
