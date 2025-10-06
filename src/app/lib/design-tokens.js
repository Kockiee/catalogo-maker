/**
 * DESIGN TOKENS - SISTEMA DE DESIGN UNIFICADO
 * 
 * Este arquivo contém os tokens de design que definem a identidade visual
 * da aplicação Catálogo Maker. Os design tokens são valores reutilizáveis
 * que mantêm consistência visual em toda a aplicação.
 * 
 * Funcionalidades:
 * - Define paleta de cores primárias, semânticas e neutras
 * - Estabelece sistema de espaçamento padronizado
 * - Define tipografia com tamanhos e pesos de fonte
 * - Configura bordas, sombras e breakpoints responsivos
 * - Fornece mapeamento para compatibilidade com Tailwind CSS
 */

// Exporta o objeto principal de design tokens
export const designTokens = {
  // Seção de cores do sistema
  colors: {
    // Paleta de cores primárias (azuis)
    primary: {
      50: '#e2fdff',   // Azul muito claro
      100: '#bfd7ff', // Azul claro
      200: '#9bb1ff', // Azul médio claro
      300: '#788bff', // Azul médio
      400: '#5465ff', // Azul principal
      500: '#3d4fd9', // Azul escuro
      600: '#2d3bb3', // Azul mais escuro
      700: '#1f2a8c', // Azul muito escuro
      800: '#062855', // Azul quase preto
      900: '#041a3d'  // Azul preto
    },
    
    // Cores semânticas para feedback visual
    semantic: {
      success: '#10b981', // Verde para sucesso
      warning: '#f59e0b', // Amarelo para avisos
      error: '#ef4444',  // Vermelho para erros
      info: '#3b82f6'   // Azul para informações
    },
    
    // Cores neutras (cinzas)
    neutral: {
      50: '#f9fafb',  // Cinza muito claro
      100: '#f3f4f6', // Cinza claro
      200: '#e5e7eb', // Cinza médio claro
      300: '#d1d5db', // Cinza médio
      400: '#9ca3af', // Cinza médio escuro
      500: '#6b7280', // Cinza escuro
      600: '#4b5563', // Cinza mais escuro
      700: '#374151', // Cinza muito escuro
      800: '#1f2937', // Cinza quase preto
      900: '#111827'  // Cinza preto
    }
  },
  
  // Sistema de espaçamento padronizado
  spacing: {
    xs: '0.25rem',    // 4px - espaçamento extra pequeno
    sm: '0.5rem',     // 8px - espaçamento pequeno
    md: '1rem',       // 16px - espaçamento médio
    lg: '1.5rem',     // 24px - espaçamento grande
    xl: '2rem',       // 32px - espaçamento extra grande
    '2xl': '3rem',    // 48px - espaçamento 2x grande
    '3xl': '4rem',    // 64px - espaçamento 3x grande
    '4xl': '6rem'     // 96px - espaçamento 4x grande
  },
  
  // Sistema tipográfico
  typography: {
    // Tamanhos de fonte padronizados
    fontSizes: {
      xs: '0.75rem',    // 12px - texto muito pequeno
      sm: '0.875rem',   // 14px - texto pequeno
      base: '1rem',     // 16px - texto base
      lg: '1.125rem',   // 18px - texto grande
      xl: '1.25rem',    // 20px - texto extra grande
      '2xl': '1.5rem',  // 24px - texto 2x grande
      '3xl': '1.875rem', // 30px - texto 3x grande
      '4xl': '2.25rem'  // 36px - texto 4x grande
    },
    
    // Pesos de fonte disponíveis
    fontWeights: {
      normal: '400',    // Peso normal
      medium: '500',    // Peso médio
      semibold: '600', // Peso semi-negrito
      bold: '700',     // Peso negrito
      extrabold: '800' // Peso extra-negrito
    },
    
    // Alturas de linha para legibilidade
    lineHeights: {
      tight: '1.25',   // Linha apertada
      normal: '1.5',   // Linha normal
      relaxed: '1.75'  // Linha relaxada
    }
  },
  
  // Sistema de bordas arredondadas
  borderRadius: {
    none: '0',           // Sem borda
    sm: '0.125rem',      // 2px - borda pequena
    md: '0.375rem',      // 6px - borda média
    lg: '0.5rem',        // 8px - borda grande
    xl: '0.75rem',       // 12px - borda extra grande
    '2xl': '1rem',       // 16px - borda 2x grande
    full: '9999px'      // Borda completamente arredondada
  },
  
  // Sistema de sombras para profundidade
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',  // Sombra pequena
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // Sombra média
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // Sombra grande
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' // Sombra extra grande
  },
  
  // Breakpoints para design responsivo
  breakpoints: {
    sm: '640px',   // Dispositivos pequenos (celulares)
    md: '768px',   // Dispositivos médios (tablets)
    lg: '1024px', // Dispositivos grandes (laptops)
    xl: '1280px', // Dispositivos extra grandes (desktops)
    '2xl': '1536px' // Dispositivos 2x grandes (telas grandes)
  },
  
  // Sistema de camadas (z-index) para sobreposição
  zIndex: {
    dropdown: 1000,  // Camada para dropdowns
    sticky: 1020,    // Camada para elementos fixos
    fixed: 1030,     // Camada para elementos fixos
    modal: 1040,     // Camada para modais
    popover: 1050,   // Camada para popovers
    tooltip: 1060    // Camada para tooltips
  }
};

// Mapeamento para compatibilidade com Tailwind CSS
export const tailwindMapping = {
  colors: {
    // Mapeia cores personalizadas para classes do Tailwind
    'neonblue': designTokens.colors.primary[400],      // Azul neon
    'cornflowerblue': designTokens.colors.primary[300], // Azul centáurea
    'jordyblue': designTokens.colors.primary[200],     // Azul jordy
    'periwinkle': designTokens.colors.primary[100],    // Azul pervinca
    'lightcyan': designTokens.colors.primary[50],      // Ciano claro
    'prussianblue': designTokens.colors.primary[800]   // Azul prussiano
  }
};
