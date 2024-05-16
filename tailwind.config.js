/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite-react/lib/**/*.js",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neonblue": "#5465ff",
        "cornflowerblue": "#788bff",
        "jordyblue": "#9bb1ff",
        "periwinkle": "#bfd7ff",
        "lightcyan": "#e2fdff",
        "prussianblue": "#062855"
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require("flowbite/plugin")
  ],
};
