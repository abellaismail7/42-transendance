import dynamic from "next/dynamic";
import { RootLayout } from "ui";

const Game = dynamic(
  () => import("~/components/game").then((mod) => mod.Game),
  { ssr: false },
);

export default function LandingPage() {
  return (
    <RootLayout>
      <div>
        <Game />
      </div>
    </RootLayout>
  );
}
