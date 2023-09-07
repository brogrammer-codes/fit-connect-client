import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", 
  './components/**/*.{js,ts,jsx,tsx,mdx}',],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
