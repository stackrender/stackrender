import { colors, heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
   
    
  ],
  darkMode: "class",

  plugins: [heroui({
    layout: {
      disabledOpacity: "0.3", // opacity-[0.3]
      radius: {
        small: "4px", // rounded-small
        medium: "8px", // rounded-medium
        large: "12px", // rounded-large
      },

    },
    themes: {

      dark: {

        colors: {
          background: {
            DEFAULT: "#282d34",
            50: "#20252c",
            100: "#1c2026"
          },

          danger: {
            DEFAULT: "#F92814"
          },
          font: {
            DEFAULT: "#cecfd2"
          },
          content1: {
            DEFAULT: "#1c2026"
          },
 
          default: {
            50: '#f2f3f5',
            100: '#d6d7db',
            200: '#b9bbc1',
            300: '#9d9fa7',
            400: '#80838d',
            500: '#191c21', // base
            600: '#15171b',
            700: '#111316',
            800: '#0d0f11',
            900: '#090b0c',
            DEFAULT: '#191c21',
          },
          primary: {
            DEFAULT: "#835dff",
            50: '#F3F0FF',
            100: '#E3DCFF',
            200: '#C6B8FF',
            300: '#A994FF',
            400: '#8D70FF',
            500: '#835DFF', // Default
            600: '#6C4BD9',
            700: '#563BB3',
            800: '#402C8D',
            900: '#2A1D66'
          },
          divider: {
            DEFAULT: "#272c35"
          },
          icon: {
            DEFAULT: "#4b515a"
          },

          success: {
            DEFAULT: "#26cea4"
          },
          scrollbar: {
            DEFAULT: "#242a31",
            hover: "#2f3740"
          },
        }
      },
      light: {

        colors: {
          danger: {
            DEFAULT: "#F92814"
          },
          font: {
            DEFAULT: "#333639"
          },
          sidebar: {
            DEFAULT: "#F1F3F6"
          },
          divider: {
            DEFAULT: "#f2f4f6"
          },
          success: {
            DEFAULT: "#26cea4"
          },
          scrollbar: {
            DEFAULT: "#eceff2",
            hover: "#dcdfe2"
          },
          default: {
            50: '#f9fafb',
            100: '#f4f6f8',
            200: '#e9edf1',
            300: '#dbe2e8',
            400: '#c6d0da',
            500: '#f2f4f7',
            600: '#a4b2c0',
            700: '#8493a4',
            800: '#69798a',
            900: '#55616f',
            DEFAULT: '#f2f4f7',
          },
          icon: {
            DEFAULT: "#a2a4a8"
          },

          primary: {
            DEFAULT: "#835dff",
            50: '#F3F0FF',
            100: '#E3DCFF',
            200: '#C6B8FF',
            300: '#A994FF',
            400: '#8D70FF',
            500: '#835DFF', // Default
            600: '#6C4BD9',
            700: '#563BB3',
            800: '#402C8D',
            900: '#2A1D66'
          },
        },
      },
    },
  }),],
};
