/**
 * @type {import('tailwindcss').Config}
 * Configuração do Tailwind CSS para a aplicação Catálogo Maker
 */
module.exports = {
  // Arquivos que devem ser processados pelo Tailwind CSS
  // Inclui componentes do Flowbite React e todos os arquivos da aplicação
  content: [
    "./node_modules/flowbite-react/lib/**/*.js",      // Componentes do Flowbite React
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",          // Páginas da aplicação (se houver)
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",     // Componentes reutilizáveis
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",            // App Router do Next.js
  ],
  // Configurações de tema e extensões
  theme: {
    extend: {
      // Paleta de cores personalizada para a identidade visual da aplicação
      colors: {
        "neonblue": "#5465ff",        // Azul neon - cor primária principal
        "cornflowerblue": "#788bff",  // Azul centáurea - cor de hover/accent
        "jordyblue": "#9bb1ff",       // Azul jordy - cor de foco/rings
        "periwinkle": "#bfd7ff",      // Azul pervinca - cor de fundo principal
        "lightcyan": "#e2fdff",       // Ciano claro - cor de destaque
        "prussianblue": "#062855"     // Azul prussiano - cor de texto principal
      }
    },
  },
  // Plugins adicionais do Tailwind CSS
  plugins: [
    // Plugin para customizar barras de rolagem
    require('tailwind-scrollbar')({ nocompatible: true }),
    // Plugin do Flowbite para componentes UI adicionais
    require("flowbite/plugin")
  ],
};
