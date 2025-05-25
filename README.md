
# 🏥 BuddyDoctor

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blueviolet)
![Supabase](https://img.shields.io/badge/Supabase-DB-green)
![Vite](https://img.shields.io/badge/Vite-5.0-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
![Tests](https://img.shields.io/badge/Tests-Vitest-brightgreen)

**BuddyDoctor** é uma plataforma completa de gerenciamento de cuidados médicos que permite cuidadores monitorarem e organizarem informações de saúde de seus pacientes de forma simples e eficiente.

## 🛠️ Tecnologias Utilizadas

- **React.js** – Biblioteca principal de UI
- **TypeScript** – Tipagem estática e desenvolvimento mais seguro
- **Vite** – Build tool moderno e rápido
- **Tailwind CSS** – Estilização moderna e responsiva
- **Supabase** – Backend as a Service (autenticação, banco de dados, storage)
- **React Hook Form + Zod** – Validação e controle de formulários
- **Recharts** – Visualização de dados e gráficos
- **Shadcn/ui** – Componentes acessíveis e prontos para produção
- **React Router** – Roteamento client-side
- **Tanstack Query** – Gerenciamento de estado de servidor
- **Lucide React** – Biblioteca de ícones
- **Vitest** – Framework de testes unitários e integração
- **Testing Library** – Utilitários para teste de componentes React

## ⚙️ Instalação e Execução Local

### Pré-requisitos

- Node.js (v18 ou superior)
- npm, yarn ou bun
- Git
- Conta no Supabase (para backend)

### 🔧 Clonando o Repositório

```bash
git clone https://github.com/seu-usuario/buddydoctor.git
cd buddydoctor
```

### 📦 Instalando Dependências

Com npm:
```bash
npm install
```

Com yarn:
```bash
yarn install
```

Com bun:
```bash
bun install
```

### 🗃️ Configuração de Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```ini
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

### ▶️ Executando o Projeto

```bash
npm run dev
# ou
yarn dev
# ou
bun dev
```

O projeto estará disponível em `http://localhost:5173`.

## 📜 Scripts Disponíveis

```bash
# Iniciar projeto em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Verificação de tipos TypeScript
npm run type-check

# Linting do código
npm run lint

# Executar testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## 🧪 Testes

O projeto utiliza **Vitest** e **Testing Library** para garantir a qualidade e confiabilidade do código.

### Executando Testes

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar testes específicos
npm run test -- --run src/components/ui/__tests__/button.test.tsx
```

### Estrutura de Testes

```
src/
├── components/
│   ├── dashboard/
│   │   └── __tests__/          # Testes dos componentes do dashboard
│   │       ├── DashboardStats.test.tsx
│   │       └── WelcomeMessage.test.tsx
│   └── ui/
│       └── __tests__/          # Testes dos componentes de UI
│           └── button.test.tsx
├── pages/
│   └── __tests__/              # Testes das páginas
│       └── Index.test.tsx
├── utils/
│   └── __tests__/              # Testes de utilitários
└── test/
    └── setup.ts                # Configuração global dos testes
```

### Tipos de Testes

#### 🔍 Testes Unitários
- Testam componentes individuais isoladamente
- Verificam propriedades, eventos e renderização
- Localização: `src/components/**/__tests__/`

#### 🌐 Testes de Integração
- Testam a interação entre componentes
- Verificam fluxos completos de usuário
- Localização: `src/pages/**/__tests__/`

#### ⚙️ Testes de Utilitários
- Testam funções auxiliares e hooks
- Verificam lógica de negócio
- Localização: `src/utils/**/__tests__/`

### Configuração de Testes

#### Vitest Config (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

#### Setup Global (`src/test/setup.ts`)
```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mocks globais para Supabase e React Router
// Configurações automáticas para todos os testes
```

### Cobertura de Testes

O projeto mantém cobertura de testes para:
- ✅ Componentes UI principais (Button, Dashboard, etc.)
- ✅ Páginas da aplicação (Index, Auth, etc.)
- ✅ Funções utilitárias
- ✅ Hooks customizados
- ✅ Contextos da aplicação

### Executando Testes no CI/CD

Os testes são executados automaticamente no pipeline de CI/CD:

```yaml
# .github/workflows/ci-cd.yml
- name: 🧪 Executar testes
  run: npm run test

- name: 📊 Gerar relatório de cobertura
  run: npm run test:coverage
```

### Escrevendo Novos Testes

#### Exemplo de Teste de Componente
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByRole('button', { name: 'Clique aqui' })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clique aqui</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

#### Padrões de Teste
- Use `describe()` para agrupar testes relacionados
- Use `it()` ou `test()` para casos de teste individuais
- Use `vi.fn()` para criar mocks de funções
- Use `screen.getByRole()` preferencialmente para consultas
- Use `expect().toBeInTheDocument()` para verificar renderização

## 🚀 CI/CD

O projeto possui pipeline de CI/CD automatizado com **GitHub Actions**.

### Pipeline de Deploy

O pipeline é executado automaticamente a cada push na branch `main` e inclui:

1. **🧪 Testes e Qualidade**
   - Verificação de tipagem TypeScript
   - Linting do código (ESLint)
   - Execução de testes unitários
   - Build do projeto

2. **🚀 Deploy Automático**
   - Deploy para Vercel (produção)
   - Notificações de status

### Configuração do CI/CD

Para configurar o deploy automático:

1. **Conecte seu repositório ao Vercel**
2. **Configure os secrets no GitHub:**
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

3. **O deploy será automático** a cada push na branch main

### Status do Build

[![Deploy Status](https://img.shields.io/github/workflow/status/seu-usuario/buddydoctor/CI/CD%20Pipeline)](https://github.com/seu-usuario/buddydoctor/actions)

## 📁 Estrutura do Projeto

```
buddydoctor/
├── public/                 # Arquivos públicos (favicon, etc.)
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes base (shadcn/ui)
│   │   ├── layout/        # Componentes de layout
│   │   ├── dashboard/     # Componentes específicos do dashboard
│   │   └── __tests__/     # Testes dos componentes
│   ├── pages/             # Páginas da aplicação
│   │   └── __tests__/     # Testes das páginas
│   ├── context/           # Context providers (Auth, Medication, etc.)
│   ├── hooks/             # React custom hooks
│   ├── lib/               # Utilitários e configurações
│   ├── integrations/      # Integrações (Supabase)
│   ├── utils/             # Funções auxiliares
│   └── test/              # Configuração de testes
├── .github/
│   └── workflows/         # GitHub Actions (CI/CD)
├── .env.local.example     # Exemplo de variáveis de ambiente
├── vitest.config.ts       # Configuração do Vitest
├── README.md
└── package.json
```

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Como Começar](#-como-começar)
- [Passo a Passo](#-passo-a-passo)
  - [1. Criando sua Conta](#1-criando-sua-conta)
  - [2. Cadastrando seu Primeiro Paciente](#2-cadastrando-seu-primeiro-paciente)
  - [3. Adicionando Medicamentos](#3-adicionando-medicamentos)
  - [4. Gerenciando Consultas](#4-gerenciando-consultas)
  - [5. Registrando Humor](#5-registrando-humor)
  - [6. Configurando Contatos](#6-configurando-contatos)
- [Funcionalidades Avançadas](#-funcionalidades-avancadas)
- [Dicas de Uso](#-dicas-de-uso)
- [Suporte](#-suporte)

## 🌟 Funcionalidades

### 📊 Dashboard Inteligente
- Visão geral de todos os pacientes cadastrados
- Estatísticas em tempo real (medicamentos, consultas, humor)
- Gráficos de atividades e tendências
- Alertas de medicamentos e consultas

### 👥 Gerenciamento de Pacientes
- Cadastro completo de pacientes
- Perfil médico detalhado com alergias, diagnósticos e doenças crônicas
- Histórico médico organizado
- Seleção fácil entre múltiplos pacientes

### 💊 Controle de Medicamentos
- Cadastro de medicamentos com dosagem e frequência
- Lembretes automáticos de horários
- Controle de estoque e alertas de reposição
- Histórico de medicamentos tomados

### 📅 Agenda Médica
- Agendamento de consultas, exames e eventos
- Lembretes automáticos
- Integração com o perfil do paciente
- Visualização em calendário

### 😊 Monitoramento de Humor
- Registro diário de humor
- Gráficos de tendências emocionais
- Notas personalizadas
- Análise de padrões ao longo do tempo

### 📞 Contatos de Emergência
- Lista de contatos importantes
- Médicos e especialistas
- Familiares e cuidadores
- Acesso rápido em emergências

## 🚀 Como Começar

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com a internet
- Email válido para cadastro

### Acesso à Plataforma
1. Acesse [BuddyDoctor](https://seu-dominio.com)
2. Clique em "Criar Conta" se for seu primeiro acesso
3. Ou "Entrar" se já possui uma conta

## 📝 Passo a Passo

### 1. Criando sua Conta

#### Primeiro Acesso
1. **Acesse a página de login**
   - Clique em "Não tem uma conta? Cadastre-se"

2. **Preencha seus dados**
   - Nome completo
   - Email válido
   - Senha segura (mínimo 6 caracteres)

3. **Confirme seu cadastro**
   - Clique em "Cadastrar"
   - Verifique seu email se solicitado

4. **Faça login**
   - Use seu email e senha para entrar

### 2. Cadastrando seu Primeiro Paciente

#### Quando não há pacientes cadastrados
Ao fazer login pela primeira vez, você verá uma tela de boas-vindas.

1. **Clique em "Adicionar Primeiro Paciente"**

2. **Preencha as informações básicas**
   - Nome completo do paciente
   - Idade
   - Tipo sanguíneo (opcional)

3. **Salve o paciente**
   - Clique em "Adicionar Paciente"

#### Adicionando pacientes adicionais
1. **Navegue para "Pacientes"** no menu lateral
2. **Clique em "Adicionar Paciente"**
3. **Preencha os dados** e salve

#### Selecionando um Paciente
- Na lista de pacientes, clique em "Selecionar paciente"
- O paciente selecionado aparecerá no dashboard principal
- Todas as informações exibidas se referem ao paciente selecionado

### 3. Adicionando Medicamentos

#### Primeiro Medicamento
1. **No dashboard, clique em "Ver Medicamentos"**
   - Ou acesse "Medicamentos" no menu lateral

2. **Clique em "Adicionar Medicamento"**

3. **Preencha as informações do medicamento**
   - **Nome**: Ex: "Paracetamol"
   - **Tipo**: Comprimido, Xarope, Injeção, etc.
   - **Dosagem**: Ex: "500mg"
   - **Frequência**: Ex: "A cada 8 horas"
   - **Quantidade inicial**: Ex: "30 comprimidos"
   - **Unidade**: Comprimidos, ml, gotas, etc.
   - **Horários**: Defina os horários específicos
   - **Data de validade** (opcional)
   - **Observações** (opcional)

4. **Salve o medicamento**

#### Recursos Avançados de Medicamentos
- **Controle de Estoque**: O sistema desconta automaticamente quando você marca como "tomado"
- **Alertas de Estoque Baixo**: Configure quando ser alertado
- **Histórico**: Veja quando cada dose foi tomada
- **Reposição**: Registre quando comprar mais medicamentos

### 4. Gerenciando Consultas

#### Agendando uma Consulta
1. **Acesse "Consultas"** no menu lateral
2. **Clique em "Agendar Consulta"**
3. **Preencha os dados**
   - Título da consulta
   - Médico/Especialista
   - Data e horário
   - Local da consulta
   - Observações

4. **Salve a consulta**

#### Agendando Exames
1. **Acesse "Exames"** no menu lateral
2. **Clique em "Agendar Exame"**
3. **Complete as informações**
   - Tipo de exame
   - Data e horário
   - Local/Laboratório
   - Preparos necessários

#### Criando Eventos
1. **Acesse "Eventos"** no menu lateral
2. **Adicione eventos importantes**
   - Aniversários
   - Datas importantes de tratamento
   - Lembretes pessoais

### 5. Registrando Humor

#### Registro Diário
1. **Acesse "Humor"** no menu lateral
2. **Selecione o humor do dia**
   - Muito Feliz 😄
   - Feliz 😊
   - Neutro 😐
   - Triste 😢
   - Muito Triste 😭

3. **Adicione observações** (opcional)
   - Descreva o que influenciou o humor
   - Eventos importantes do dia

4. **Salve o registro**

#### Visualizando Tendências
- Gráficos mostram a evolução do humor
- Identifique padrões e gatilhos
- Compartilhe com profissionais de saúde

### 6. Configurando Contatos

#### Adicionando Contatos de Emergência
1. **Acesse "Contatos"** no menu lateral
2. **Clique em "Adicionar Contato"**
3. **Preencha as informações**
   - Nome completo
   - Relação (médico, familiar, cuidador)
   - Telefone
   - Email

4. **Salve o contato**

#### Tipos de Contatos Recomendados
- **Médico de família**
- **Especialistas** (cardiologista, neurologista, etc.)
- **Farmácia** de confiança
- **Familiares próximos**
- **Cuidadores** alternativos
- **Serviços de emergência** locais

## 🔧 Funcionalidades Avançadas

### Perfil Médico Completo
1. **Acesse "Perfil"** no menu lateral
2. **Complete as informações médicas**
   - **Alergias**: Medicamentos, alimentos, outros
   - **Diagnósticos**: Condições médicas atuais
   - **Doenças Crônicas**: Diabetes, hipertensão, etc.
   - **Observações**: Informações importantes para emergências

### Dashboard Personalizado
- **Estatísticas Gerais**: Dados de todos os pacientes
- **Informações do Paciente Selecionado**: Dados específicos
- **Gráficos Interativos**: Atividades e tendências
- **Alertas Prioritários**: Medicamentos em atraso, consultas próximas

### Sistema de Alertas
- **Medicamentos**: Horários de doses e estoque baixo
- **Consultas**: Lembretes de agendamentos
- **Exames**: Preparos e datas importantes
- **Emergências**: Acesso rápido a contatos

## 💡 Dicas de Uso

### Para Novos Usuários
1. **Comece devagar**: Cadastre um paciente por vez
2. **Use dados reais**: Informações precisas garantem melhor cuidado
3. **Mantenha atualizado**: Revise informações regularmente
4. **Explore gradualmente**: Conheça uma funcionalidade por vez

### Para Usuários Avançados
1. **Aproveite os gráficos**: Identifique padrões nos dados
2. **Configure alertas**: Personalize notificações importantes
3. **Use observações**: Adicione contexto aos registros
4. **Mantenha backup**: Exporte dados importantes regularmente

### Boas Práticas
- ✅ **Atualize medicamentos** quando houver mudanças
- ✅ **Registre humor diariamente** para melhores insights
- ✅ **Mantenha contatos atualizados** para emergências
- ✅ **Use observações** para contexto adicional
- ✅ **Verifique estoque** de medicamentos regularmente

### Segurança
- 🔒 **Use senhas fortes** para proteger dados médicos
- 🔒 **Não compartilhe login** com pessoas não autorizadas
- 🔒 **Faça logout** em computadores compartilhados
- 🔒 **Mantenha dados atualizados** para emergências

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push para a branch: `git push origin minha-feature`
5. Abra um Pull Request

### Padrões de Desenvolvimento

- Use TypeScript para tipagem
- Siga os padrões do ESLint configurado
- **Escreva testes** para novas funcionalidades
- Mantenha componentes pequenos e focados
- Escreva commits semânticos (feat, fix, docs, etc.)
- **Teste suas mudanças** antes de enviar: `npm run test`
- Verifique a cobertura de testes: `npm run test:coverage`

### Executando Testes Localmente

Antes de enviar um PR, certifique-se de que:

```bash
# Todos os testes passam
npm run test

# Não há erros de lint
npm run lint

# O projeto compila sem erros
npm run build
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ por [Seu Nome]

- 💼 [LinkedIn](https://linkedin.com/in/seu-perfil)
- 🐙 [GitHub](https://github.com/seu-usuario)
- 📧 Email: seu-email@exemplo.com

---

## 🆘 Suporte

### Precisa de Ajuda?
- 📧 **Email**: suporte@buddydoctor.com
- 💬 **Chat**: Disponível no canto inferior direito
- 📚 **Documentação**: [docs.buddydoctor.com]
- 🎥 **Vídeos Tutoriais**: [youtube.com/buddydoctor]

### Horário de Atendimento
- **Segunda a Sexta**: 8h às 18h
- **Sábado**: 9h às 12h
- **Domingo**: Apenas emergências

---

**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2024

---

*BuddyDoctor - Cuidando de quem você ama* ❤️
