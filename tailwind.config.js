import { colors, heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(button|code|dropdown|input|kbd|link|navbar|snippet|toggle|popover|ripple|spinner|menu|divider|form|modal).js",

  ],
  darkMode: "class",
  plugins: [heroui({
    themes: {
      dark: {
        colors: {
          sidebar: {
            DEFAULT: 'hsl(0 0% 98%)',
            foreground: 'hsl(240 5.3% 26.1%)',
          },
          primary: {
            DEFAULT: "#961FFE",
            50: '#961FFE0D', // 5% opacity
            100: '#961FFE1A', // 10% opacity
            200: '#961FFE33', // 20% opacity
            300: '#961FFE4D', // 30% opacity
            400: '#961FFE66', // 40% opacity
            500: '#961FFE80', // 50% opacity
            600: '#961FFE99', // 60% opacity
            700: '#961FFEB3', // 70% opacity
            800: '#961FFFCC', // 80% opacity
            900: '#961FFEE6', // 90% opacity
          },
        },
      },
      light: {
        colors: {
          sidebar: {
            DEFAULT: 'hsl(0 0% 98%)',
            foreground: 'hsl(240 5.3% 26.1%)',
          },

          default: {
            DEFAULT: 'hsl(210 40% 96.1%)',
            foreground: 'hsl(222.2 47.4% 11.2%)'
          },

          icon : {
            DEFAULT : "hsl(215.4 16.3% 46.9%)"
          } , 

          primary: {
            DEFAULT: "#961FFE",
            50: '#961FFE0D', // 5% opacity
            100: '#961FFE1A', // 10% opacity
            200: '#961FFE33', // 20% opacity
            300: '#961FFE4D', // 30% opacity
            400: '#961FFE66', // 40% opacity
            500: '#961FFE80', // 50% opacity
            600: '#961FFE99', // 60% opacity
            700: '#961FFEB3', // 70% opacity
            800: '#961FFFCC', // 80% opacity
            900: '#961FFEE6', // 90% opacity
          },
        },
      },
    },
  }),],
};
