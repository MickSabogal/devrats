<div align="center">
  <img src="public/images/logo_devrats.png" alt="DevRats Logo" width="200"/>
    
  ### *Where Coding Becomes a Habit, Not a Sprint*
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-8.19.2-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.16-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

  <p align="center">
    <a href="#-sobre">Sobre</a> •
    <a href="#-features">Features</a> •
    <a href="#-tecnologias">Tecnologias</a> •
    <a href="#-instalação">Instalação</a> •
    <a href="#-equipe">Equipe</a>
  </p>
</div>

---

## 🎯 Sobre

**DevRats** é uma plataforma social gamificada que transforma o aprendizado de programação em uma experiência colaborativa e motivadora. Criada para desenvolvedores que desejam manter consistência nos estudos através de responsabilidade compartilhada em grupo.

### 💡 Por quê?
- 😰 **65%** dos devs iniciantes desistem nos primeiros 6 meses
- 📉 Falta de **consistência** ao estudar sozinho
- 😔 **Isolamento** durante a jornada de aprendizado

### ✨ Nossa Solução
DevRats gamifica o aprendizado com:
- ✅ Check-ins diários com foto do código
- 🔥 Sistema de streaks para consistência
- 🏆 Rankings competitivos entre grupos
- 💬 Chat integrado para comunidade
- 📊 Calendário visual de progresso

---

## ⚡ Features

| Feature | Descrição |
|---------|-----------|
| 🔐 **Autenticação** | Login com credenciais, GitHub e Google OAuth |
| 👥 **Grupos** | Criação, convites e gestão de grupos temáticos |
| 📸 **Posts** | Upload de fotos do código com métricas de estudo |
| 🔥 **Streaks** | Sistema de dias consecutivos (global + por grupo) |
| 🏆 **Rankings** | Leaderboards dinâmicos com pódio |
| 💬 **Chat** | Mensagens em tempo real entre membros |
| 📅 **Calendário** | Visualização mensal de atividades |
| 👤 **Perfil** | Avatar customizável e estatísticas pessoais |

---

## 🛠 Tecnologias
```javascript
{
  "Frontend": "Next.js 15.5.6 + React 19 + Tailwind CSS 4",
  "Backend": "Next.js API Routes + MongoDB + Mongoose",
  "Auth": "NextAuth.js (Credentials + OAuth)",
  "Storage": "Cloudinary",
  "Deploy": "Vercel + MongoDB Atlas"
}
```

---

## 🚀 Instalação

### 1️⃣ Clone e Instale
```bash
git clone https://github.com/seu-usuario/devrats.git
cd devrats
npm install
```

### 2️⃣ Configure o `.env.local`
```env
# Database
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/devrats

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta

# OAuth (opcional)
GITHUB_ID=seu-github-id
GITHUB_SECRET=seu-github-secret
GOOGLE_CLIENT_ID=seu-google-id
GOOGLE_CLIENT_SECRET=seu-google-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=sua-api-secret
```

### 3️⃣ Execute
```bash
npm run dev
```

Acesse **[http://localhost:3000](http://localhost:3000)** 🎉

---

## 📖 Como Usar

1. **Criar conta** → Email/senha ou GitHub/Google
2. **Criar/Entrar em grupo** → Com código de convite
3. **Postar atividade** → Foto do código + duração
4. **Ver progresso** → Perfil com streak e calendário
5. **Competir** → Rankings com amigos

---

## 🏗 Arquitetura
```
devrats/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login e Registro
│   │   ├── dashboard/           # Páginas protegidas
│   │   │   ├── groups/[id]/     # Dashboard, Chat, Ranking
│   │   │   ├── profile/         # Perfil e Calendário
│   │   │   └── settings/        # Configurações
│   │   └── api/                 # API Routes
│   │
│   ├── components/
│   │   ├── auth/                # LoginForm, RegisterForm
│   │   ├── dashboard/           # Sidebar, EventCard, Chat
│   │   ├── profile/             # ActivityCalendar, Stats
│   │   └── ui/                  # Button, Input, Modals
│   │
│   ├── models/                  # Schemas MongoDB
│   │   ├── User.js              # Usuário + Streaks
│   │   ├── Group.js             # Grupos + Membros
│   │   ├── Post.js              # Posts + Métricas
│   │   └── Message.js           # Chat
│   │
│   └── lib/
│       ├── mongodb.js           # Conexão DB
│       ├── cloudinary.js        # Upload imagens
│       └── streakHelper.js      # Cálculo de streaks
```

---

## 👥 Equipe DevRats

<table>
  <tr>
    <td align="center">
      <b>Guilherme França</b><br />
      <a href="https://github.com/guilhermesfranca">GitHub</a> • <a href="https://linkedin.com/in/guilhermesfranca">LinkedIn</a>
    </td>
    <td align="center">
      <b>Isadora Barradas</b><br />
      <a href="https://github.com/iorsini">GitHub</a> • <a href="https://linkedin.com/in/isadora-barradas">LinkedIn</a>
    </td>
    <td align="center">
      <b>Jhonathan Tinoco</b><br />
      <a href="https://github.com/Jhonathan-Tinoco">GitHub</a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Miguel Sabogal</b><br />
      <a href="https://github.com/MickSabogal">GitHub</a> • <a href="https://linkedin.com/in/miguel-alejandro-sabogal-guzman">LinkedIn</a>
    </td>
    <td align="center">
      <b>Mishal Saheer</b><br />
      <a href="https://github.com/msaheers">GitHub</a> • <a href="https://linkedin.com/in/mishal-saheer-a90146323">LinkedIn</a>
    </td>
    <td></td>
  </tr>
</table>

**Projeto Final do Full Stack Development Bootcamp da Bytes4Future** • 2025

---

## 🗺 Roadmap

### ✅ v1.0 (Atual)
- Autenticação completa
- Sistema de grupos
- Posts com fotos
- Streaks e rankings
- Chat em tempo real

### 🚧 v1.1 (Próximo)
- Notificações push
- Reações em posts (❤️🔥👏)
- Comentários
- Dark mode

### 🔮 v2.0 (Futuro)
- Mobile app
- Challenges semanais
- Badges/conquistas
- Integração GitHub API

---

## 📄 Licença

MIT License © 2025 DevRats Team

---

<div align="center">
  
  ### Feito com muito 🧀 pelo DevRats Team
  
  **"Transforming coders into consistent developers, one streak at a time."** 🐭  
</div>
