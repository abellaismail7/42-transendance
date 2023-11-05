import { Box } from "./box";
import { config } from "~/game/config";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { add_in } from "~/utils/math";

type PaddleProps = {
  down?: number;
};

export const Paddle = ({ down }: PaddleProps) => {
  const meshLeft = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (meshLeft.current && down) {
      if (down === 1)
        meshLeft.current.position.y = add_in(
          meshLeft.current.position.y,
          0.4,
          -11,
          3,
        );
      if (down === 2)
        meshLeft.current.position.y = add_in(
          meshLeft.current.position.y,
          -0.4,
          -11,
          3,
        );
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
