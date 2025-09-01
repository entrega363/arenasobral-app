# Dockerfile para a aplicação ArenaSobral

# Usar imagem base oficial do Node.js
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar arquivos da aplicação
COPY . .

# Build da aplicação Next.js
RUN npm run build

# Expôr porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]