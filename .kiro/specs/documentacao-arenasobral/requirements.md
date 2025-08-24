# Documentação do Sistema ArenaSobral

## Introdução

O ArenaSobral é uma aplicação web desenvolvida em React que funciona como uma plataforma completa para gerenciamento do futebol amador na cidade de Sobral, Ceará. O sistema conecta jogadores, donos de times e proprietários de areninhas, facilitando a organização de jogos, contratações, reservas de campos e torneios.

A aplicação oferece diferentes painéis de controle baseados no tipo de usuário (jogador, dono de time ou dono de areninha), permitindo funcionalidades específicas para cada perfil.

## Requisitos Funcionais

### Requisito 1 - Sistema de Autenticação e Perfis de Usuário

**User Story:** Como usuário do sistema, eu quero fazer login escolhendo meu tipo de perfil (jogador, dono de time ou dono de areninha), para que eu possa acessar as funcionalidades específicas do meu papel.

#### Critérios de Aceitação

1. QUANDO o usuário acessa a tela de login ENTÃO o sistema DEVE apresentar campos para email, senha e seleção de tipo de conta
2. QUANDO o usuário seleciona "Jogador" ENTÃO o sistema DEVE redirecionar para o painel do jogador após login
3. QUANDO o usuário seleciona "Dono de Time" ENTÃO o sistema DEVE redirecionar para o painel do dono de time após login
4. QUANDO o usuário seleciona "Dono de Areninha" ENTÃO o sistema DEVE redirecionar para o painel do proprietário de campo após login
5. QUANDO o usuário não possui conta ENTÃO o sistema DEVE permitir criação de nova conta com dados pessoais e WhatsApp

### Requisito 2 - Busca e Gerenciamento de Jogadores

**User Story:** Como dono de time, eu quero buscar e contratar jogadores disponíveis, para que eu possa formar minha equipe.

#### Critérios de Aceitação

1. QUANDO o usuário acessa a busca de jogadores ENTÃO o sistema DEVE exibir lista com foto, nome, idade, posição, localização e disponibilidade
2. QUANDO o dono de time clica em "Contratar" ENTÃO o sistema DEVE enviar proposta de contrato para o jogador
3. QUANDO o jogador recebe proposta ENTÃO o sistema DEVE permitir aceitar ou rejeitar a oferta
4. QUANDO o jogador aceita proposta ENTÃO o sistema DEVE adicionar o jogador ao time
5. QUANDO o jogador está sem time ENTÃO o sistema DEVE exibir status "Sem time" na listagem

### Requisito 3 - Busca e Solicitação de Entrada em Times

**User Story:** Como jogador, eu quero buscar times disponíveis e solicitar entrada, para que eu possa participar de jogos organizados.

#### Critérios de Aceitação

1. QUANDO o jogador acessa busca de times ENTÃO o sistema DEVE exibir lista com nome, localização, número de jogadores, capitão e categoria
2. QUANDO o jogador clica em "Solicitar Entrada" ENTÃO o sistema DEVE enviar solicitação para o time
3. QUANDO o time recebe solicitação ENTÃO o sistema DEVE permitir ao dono aceitar ou rejeitar
4. QUANDO o time aceita solicitação ENTÃO o sistema DEVE adicionar o jogador ao time
5. QUANDO o time rejeita solicitação ENTÃO o sistema DEVE notificar o jogador

### Requisito 4 - Agendamento de Jogos Amistosos

**User Story:** Como dono de time, eu quero marcar jogos amistosos com outros times ou times aleatórios, para que minha equipe possa praticar e competir.

#### Critérios de Aceitação

1. QUANDO o dono de time acessa agendamento ENTÃO o sistema DEVE permitir escolher adversário específico ou time aleatório
2. QUANDO seleciona adversário específico ENTÃO o sistema DEVE enviar convite para o time escolhido
3. QUANDO seleciona "time aleatório" ENTÃO o sistema DEVE criar jogo aberto para outros times se interessarem
4. QUANDO o adversário aceita convite ENTÃO o sistema DEVE confirmar o jogo na agenda
5. QUANDO o jogo é confirmado ENTÃO o sistema DEVE exibir na agenda de ambos os times

### Requisito 5 - Gerenciamento de Horários de Campo

**User Story:** Como dono de areninha, eu quero gerenciar os horários disponíveis da minha quadra, para que eu possa controlar reservas e preços.

#### Critérios de Aceitação

1. QUANDO o dono acessa gerenciamento ENTÃO o sistema DEVE exibir grade semanal com horários por dia
2. QUANDO o dono edita horário ENTÃO o sistema DEVE permitir alterar preço e disponibilidade
3. QUANDO o dono adiciona novo horário ENTÃO o sistema DEVE incluir na grade com preço padrão
4. QUANDO o dono remove horário ENTÃO o sistema DEVE excluir da grade após confirmação
5. QUANDO horário está ocupado ENTÃO o sistema DEVE exibir status "indisponível"

### Requisito 6 - Painel de Estatísticas do Campo

**User Story:** Como dono de areninha, eu quero visualizar estatísticas da minha quadra, para que eu possa acompanhar o desempenho do negócio.

#### Critérios de Aceitação

1. QUANDO o dono acessa estatísticas ENTÃO o sistema DEVE exibir total de reservas do período
2. QUANDO visualiza receita ENTÃO o sistema DEVE mostrar faturamento semanal
3. QUANDO verifica ocupação ENTÃO o sistema DEVE exibir taxa de ocupação em percentual
4. QUANDO consulta próximas reservas ENTÃO o sistema DEVE mostrar próximo agendamento
5. QUANDO acessa agenda do dia ENTÃO o sistema DEVE listar jogos programados

### Requisito 7 - Gerenciamento de Agenda de Times

**User Story:** Como dono de time, eu quero gerenciar a agenda de jogos da minha equipe, para que eu possa organizar e controlar os compromissos.

#### Critérios de Aceitação

1. QUANDO o dono acessa agenda ENTÃO o sistema DEVE exibir lista de jogos agendados
2. QUANDO clica em "Cancelar" ENTÃO o sistema DEVE cancelar o jogo e notificar o adversário
3. QUANDO clica em "Remarcar" ENTÃO o sistema DEVE permitir alterar data, horário e local
4. QUANDO confirma reagendamento ENTÃO o sistema DEVE enviar nova proposta ao adversário
5. QUANDO o jogo está pendente ENTÃO o sistema DEVE permitir confirmar participação

### Requisito 8 - Sistema de Notificações e Comunicação

**User Story:** Como usuário do sistema, eu quero receber notificações sobre propostas, convites e confirmações, para que eu possa responder adequadamente.

#### Critérios de Aceitação

1. QUANDO recebo proposta de contrato ENTÃO o sistema DEVE exibir notificação com detalhes
2. QUANDO recebo convite para jogo ENTÃO o sistema DEVE permitir aceitar ou rejeitar
3. QUANDO minha solicitação é respondida ENTÃO o sistema DEVE notificar o resultado
4. QUANDO jogo é cancelado ENTÃO o sistema DEVE notificar todos os envolvidos
5. QUANDO há mudança na agenda ENTÃO o sistema DEVE alertar os participantes

### Requisito 9 - Cadastro e Perfil de Jogadores

**User Story:** Como jogador, eu quero manter meu perfil atualizado com foto, posição e disponibilidade, para que os times possam me encontrar facilmente.

#### Critérios de Aceitação

1. QUANDO o jogador acessa perfil ENTÃO o sistema DEVE permitir upload de foto
2. QUANDO atualiza dados ENTÃO o sistema DEVE salvar posição, experiência e disponibilidade
3. QUANDO define horários ENTÃO o sistema DEVE permitir escolher manhã, tarde, noite ou qualquer horário
4. QUANDO está em múltiplos times ENTÃO o sistema DEVE exibir contador de times
5. QUANDO não tem time ENTÃO o sistema DEVE exibir status "Sem time"

### Requisito 10 - Interface Mobile Responsiva

**User Story:** Como usuário mobile, eu quero acessar todas as funcionalidades em dispositivos móveis, para que eu possa usar o sistema em qualquer lugar.

#### Critérios de Aceitação

1. QUANDO acesso pelo mobile ENTÃO o sistema DEVE exibir interface otimizada para tela pequena
2. QUANDO navego entre telas ENTÃO o sistema DEVE manter barra de status mobile
3. QUANDO uso formulários ENTÃO o sistema DEVE adaptar campos para toque
4. QUANDO visualizo listas ENTÃO o sistema DEVE otimizar scroll e navegação
5. QUANDO acesso botões ENTÃO o sistema DEVE garantir área de toque adequada