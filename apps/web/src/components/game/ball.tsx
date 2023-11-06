import { MeshStandardMaterialProps, ThreeElements } from "@react-three/fiber";
import React, { useEffect } from "react";
import { socket } from "~/pages/chat/globals";
import { Config } from "~/utils/repo/game";
import { Sphere } from "./sphere";
type BallProps = ThreeElements["mesh"] & {
  mmaterial?: MeshStandardMaterialProps;
  config: Config;
};

export function Ball({ config }: BallProps) {
  const [pos, setPos] = React.useState([0, 0, 0] as const);
  useEffect(() => {
    socket.on("moveBall", (data) => {
      setPos(data.pos);
      if (1.5 - config.worldWidth / 2 < data.pos[0]) {
        //       console.log(data);
      }
    });
  }, []);

  return (
    <>
      <Sphere size={config.ballSize} position={pos} />
    </>
  );
}

Ball.displayName = "Ball";
