import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [baseConfig],
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
