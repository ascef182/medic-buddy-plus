# 🏥 BuddyDoctor

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blueviolet)
![Supabase](https://img.shields.io/badge/Supabase-DB-green)
![Vitest](https://img.shields.io/badge/Tests-Vitest-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

**BuddyDoctor** é uma plataforma de gerenciamento de cuidados médicos projetada para facilitar o trabalho de cuidadores, oferecendo recursos como cadastro de pacientes, controle de medicamentos, agendamento de consultas, registro de humor e notificações.

## ✨ Funcionalidades

- 📊 Dashboard inteligente com estatísticas
- 👤 Cadastro completo de pacientes e cuidadores
- 💊 Controle de medicamentos com datas e horários
- 📅 Agendamento de consultas, exames e eventos
- 📂 Histórico médico e dados de saúde centralizados
- 😊 Registro diário de humor e sintomas
- 🔔 Notificações e lembretes
- 🔐 Autenticação via Supabase
- ⚙️ CI/CD com GitHub Actions
- ✅ Testes com Vitest

## 🧪 Tecnologias

- **Frontend:** React, TypeScript, TailwindCSS, ShadCN UI, Lucide
- **Backend:** Supabase (Auth, Database, Storage)
- **Testes:** Vitest, Testing Library
- **CI/CD:** GitHub Actions
- **Outros:** React Hook Form, Zod, React Query, Radix UI

- 
## 🚀 CI/CD O projeto utiliza GitHub Actions para:

Rodar testes automatizados

Validar PRs com lint, testes e build

Garantir qualidade contínua do código

## 🧠 Design & UX
A interface segue boas práticas de UI/UX:

Navegação intuitiva e responsiva

Cores suaves e tipografia acessível

Formulários otimizados com validação via Zod + React Hook Form

Experiência leve e moderna com Tailwind e Framer Motion

## 🛡️ Segurança
Autenticação segura via Supabase

Validação rigorosa de dados (Zod)

Proteção de rotas e permissões básicas de acesso

## 📌 Roadmap
 MVP funcional com autenticação e CRUDs

 Integração com Supabase (auth, DB, storage)

 Dashboard com cards estatísticos

 Testes automatizados com cobertura

 Implementar notificações push

 Modo cuidador/paciente com permissões distintas

 PWA para uso offline

 Internacionalização (i18n)

## 🤝 Contribuindo
Contribuições são bem-vindas! Siga os passos:

Fork o projeto

Crie uma branch: git checkout -b feature/sua-feature

Commit suas alterações: git commit -m 'feat: nova feature'

Push na branch: git push origin feature/sua-feature

Abra um Pull Request


##Feito com 💙 por **Pam Ascef Cazarini**

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/ascef182/medic-buddy-plus.git
cd medic-buddy-plus

# Instale as dependências
npm install

# Configure o ambiente (ver .env.example)
cp .env.example .env

# Inicie o servidor
npm run dev

🧪 Rodando os testes
npm run test

## 📁 Estrutura de Pastas

src/
├── components/       # Componentes reutilizáveis
├── pages/            # Páginas da aplicação
├── features/         # Funcionalidades agrupadas (medicamentos, agenda, etc.)
├── lib/              # Utils e configurações globais
├── hooks/            # React hooks customizados
├── services/         # Integrações externas (ex: Supabase)
├── tests/            # Testes unitários e de integração
└── types/            # Tipagens globais e Zod schemas
