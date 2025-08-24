@echo off
echo 🚀 Iniciando processo de deploy do ArenaSobral...

REM Verificar se o git está inicializado
if not exist ".git" (
    echo 📁 Inicializando repositório Git...
    git init
    git branch -M main
)

REM Adicionar todos os arquivos
echo 📝 Adicionando arquivos ao Git...
git add .

REM Fazer commit
echo 💾 Fazendo commit...
git commit -m "feat: Implementa ArenaSobral moderno com Next.js 14

- ✅ Configuração completa Next.js 14 + TypeScript
- ✅ Sistema de navegação funcional
- ✅ Tela de login com seleção de tipo de usuário
- ✅ Dashboard do Jogador com abas interativas
- ✅ Dashboard do Dono de Time com gerenciamento
- ✅ Dashboard da Areninha com estatísticas
- ✅ Sistema de busca de jogadores com filtros
- ✅ Sistema de busca de times com categorias
- ✅ Design mobile-first responsivo
- ✅ Componentes UI modernos (Shadcn/ui)
- ✅ Sistema de notificações (toast)
- ✅ Integração WhatsApp
- ✅ Dados mock realistas
- ✅ Configuração otimizada para Vercel

Stack: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui, Lucide React"

echo ✅ Commit realizado com sucesso!

REM Verificar se o Vercel CLI está instalado
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Instalando Vercel CLI...
    npm install -g vercel
)

REM Fazer deploy
echo 🚀 Fazendo deploy no Vercel...
vercel --prod

echo 🎉 Deploy concluído! Sua aplicação está online!
echo 📱 Acesse sua aplicação no link fornecido pelo Vercel
pause