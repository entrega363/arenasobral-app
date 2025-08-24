const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Caminho para o app Next.js para carregar next.config.js e arquivos .env
  dir: './',
})

// Configuração personalizada do Jest
const customJestConfig = {
  // Adiciona mais opções de configuração antes de cada teste
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Se estiver usando TypeScript com um baseUrl configurado no tsconfig.json
  // então você precisa configurar moduleNameMapping para que funcione com Jest
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Ambiente de teste
  testEnvironment: 'jest-environment-jsdom',
  
  // Padrões de arquivos de teste
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  
  // Arquivos a serem ignorados
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],
  
  // Transformações
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Extensões de módulo
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
    '!src/pages/api/**',
    '!src/types/**',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  
  // Limite de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Relatórios de cobertura
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Diretório de cobertura
  coverageDirectory: 'coverage',
  
  // Mocks globais
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
}

// createJestConfig é exportado desta forma para garantir que next/jest possa carregar a configuração Next.js que é assíncrona
module.exports = createJestConfig(customJestConfig)