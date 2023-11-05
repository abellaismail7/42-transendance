import { Box } from "./box";
import { config } from "~/game/config";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { socket } from "~/pages/chat/globals";

type PaddleProps = {
  down?: number;
};

export const Paddle = ({ down }: PaddleProps) => {
  const meshLeft = useRef<THREE.Mesh>(null!);

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
        ref={meshLeft}
        mmaterial={{
          color: "orange",
        }}
        position={[-14, 0, 0]}
        scale={[1, config.bitch.x * config.paddle.height, 1]}
        down={down}
      />
      <Box
        mmaterial={{
          color: "orange",
        }}
        scale={[1, config.bitch.x * config.paddle.height, 1]}
        position={[14, 0, 0]}
      />
    </>
  );
};
