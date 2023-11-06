import { Box } from "./box";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { socket } from "~/pages/chat/globals";
import { Config } from "~/utils/repo/game";

type PaddleProps = {
  down?: number;
  config: Config;
};

export const Paddle = ({ down, config }: PaddleProps) => {
  const meshLeft = useRef<THREE.Mesh>(null!);

  const sizeX = config.worldWidth * config.paddleSizeX;
  const sizeY = config.worldHeight * config.paddleSizeY;
  const w2 = config.worldWidth / 2;
  useEffect(() => {
    socket.emit("startGame");
    socket.on("movePaddle", (data) => {
      meshLeft.current.position.y = data.leftY;
    });
  }, []);

  useFrame(() => {
    if (meshLeft.current && down) {
      socket.emit("movePaddle", {
        dir: down,
      });
    }
  });
  return (
    <>
      <Box
        mmaterial={{
          color: "orange",
        }}
        position={[w2 - 0.25, 0, 0]}
        scale={[sizeX, sizeY, 0.1]}
      />
      <Box
        ref={meshLeft}
        mmaterial={{
          color: "orange",
        }}
        scale={[sizeX, sizeY, 0.1]}
        position={[-w2 + 0.25, 0, 0]}
      />
    </>
  );
};
