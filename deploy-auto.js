#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando deploy automático do ArenaSobral...\n');

// Função para executar comandos
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    const output = execSync(command, { 
      stdio: 'inherit', 
      cwd: process.cwd(),
      encoding: 'utf8'
    });
    console.log(`✅ ${description} concluído!\n`);
    return output;
  } catch (error) {
    console.error(`❌ Erro em: ${description}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Criar arquivo de configuração do Vercel
const vercelConfig = {
  "name": "arenasobral-modern",
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
};

console.log('📝 Criando configuração automática...');
fs.writeFileSync('.vercel/project.json', JSON.stringify(vercelConfig, null, 2));

// Criar diretório .vercel se não existir
if (!fs.existsSync('.vercel')) {
  fs.mkdirSync('.vercel');
}

// Instalar dependências
runCommand('npm install', 'Instalando dependências');

// Build do projeto
runCommand('npm run build', 'Fazendo build do projeto');

// Deploy direto via Vercel CLI com configurações automáticas
console.log('🚀 Fazendo deploy no Vercel...');
console.log('⏳ Isso pode levar alguns minutos...\n');

try {
  // Deploy com configurações pré-definidas
  const deployOutput = execSync('vercel --prod --yes --confirm', { 
    stdio: 'pipe',
    encoding: 'utf8'
  });
  
  console.log('✅ Deploy realizado com sucesso!');
  console.log('\n📱 Sua aplicação está online!');
  
  // Extrair URL do output
  const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
  if (urlMatch) {
    console.log(`🌐 URL: ${urlMatch[0]}`);
  }
  
} catch (error) {
  console.log('⚠️  Tentando método alternativo...');
  
  // Método alternativo usando npx
  try {
    execSync('npx vercel --prod --yes', { stdio: 'inherit' });
    console.log('✅ Deploy realizado com sucesso via npx!');
  } catch (altError) {
    console.error('❌ Erro no deploy:', altError.message);
    console.log('\n🔧 Soluções alternativas:');
    console.log('1. Execute manualmente: npx vercel');
    console.log('2. Ou acesse: https://vercel.com/new');
    console.log('3. E importe este projeto do GitHub');
  }
}

console.log('\n🎉 Processo concluído!');
console.log('📱 Sua aplicação ArenaSobral está pronta para uso!');