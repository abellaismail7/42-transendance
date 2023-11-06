import { api } from "../api";

export interface Config {
  width: number;
  height: number;
  fov: number;
  near: number;
  cameraPosition: [number, number, number];
  aspect: number;
  worldHeight: number;
  worldWidth: number;
  paddleSizeX: number;
  paddleSizeY: number;
  ballSize: number;
}

export async function configGet() {
  return await api.get("game/config").then<Config>((res) => res.data);
}
