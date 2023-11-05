import { MeshStandardMaterialProps, ThreeElements } from "@react-three/fiber";
import React, { useEffect } from "react";
import { socket } from "~/pages/chat/globals";
import { Sphere } from "./sphere";
type BallProps = ThreeElements["mesh"] & {
  mmaterial?: MeshStandardMaterialProps;
};

export function Ball({}: BallProps) {
  const [pos, setPos] = React.useState([0, 0, 0] as const);
  useEffect(() => {
    socket.on("moveBall", (data) => {
      setPos(data.pos);
    });
  }, []);

  return <Sphere size={0.5} position={pos} />;
}

Ball.displayName = "Ball";
