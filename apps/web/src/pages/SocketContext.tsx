import { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { Socket, io } from "socket.io-client";

const SocketContext = createContext<Socket | undefined>(undefined);

export function useSocket(): Socket {
  const socket = useContext(SocketContext);
  if (socket === undefined) throw new Error("Socket object isn't provided");
  return socket;
}

export function SocketProvider({ children }: PropsWithChildren) {
  const socket = useMemo(
    () => io("http://localhost:4000", { transports: ["websocket"] }),
    []
  );
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
