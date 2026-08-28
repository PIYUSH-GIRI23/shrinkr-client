## Folder Structure : 

<pre>
📁 client/
├── 📂 public/                            # Static assets (favicons, etc.)
│
├── 📂 src/
│   ├── 🎨 assets/                        # Images, SVGs, icons
│   │
│   ├── 🧩 components/
│   │   ├── 🪄 CreateLinkModal.jsx        → Modal to create new shortened URLs
│   │   ├── 📊 Dashboard.jsx              → Main dashboard showing user's links
│   │   ├── 🗑️ DeleteAccountModal.jsx     → Confirm account deletion
│   │   ├── 🔍 GetLinkInfoModal.jsx       → Fetch & display link info
│   │   ├── 🏠 Homepage.jsx               → Landing page with intro & CTA
│   │   ├── 📈 LinkDetailsModal.jsx       → Shows analytics for each short link
│   │   └── 🔗 Redirect.jsx               → Handles short URL redirection
│   │
│   ├── ⚙️ controller/
│   │   ├── 🔐 authController.js          → User auth (login, signup, logout)
│   │   └── 🧭 linkController.js          → Link CRUD logic
│   │
│   ├── 🧠 utils/
│   │   └── 🧾 utils.js                   → Helper & API utility functions
│   │
│   ├── 🧩 App.jsx                        → Root component (routes & layout)
│   ├── 🎨 App.css                        → Global styles (Tailwind integration)
│   ├── 🎨 index.css                      → Base CSS
│   └── 🚀 main.jsx                       → Entry point — renders <App />
│
├── ⚙️ .env                               # Environment variables
├── ⚙️ .env.config                        # Demo file for setting up environment variables
├── 🧱 index.html                         # Base HTML (Vite entry)
├── 📦 package.json                       # Project dependencies & scripts
├── ⚙️ postcss.config.cjs                 # Tailwind/PostCSS config
├── 🎨 tailwind.config.js                 # Tailwind settings
├── ⚡ vite.config.js                      # Vite build config
└── 📘 README.md                          # Project documentation
</pre>

---

🧠 Tech Stack :

| Layer              | Technology                                     |
| ------------------ | ---------------------------------------------- |
| Frontend Framework | ⚛️ React (with Vite)                           |
| Styling            | 🎨 Tailwind CSS                                |
| State Management   | ⚡ React Hooks                                  |
| Routing            | 🧭 React Router                                |
| Build Tool         | ⚙️ Vite                                        |
| API                | 🌍 Shrinkr Backend (Express + MongoDB + Redis) |

---

⚙️ Prerequisites

Make sure you have the following installed:

🟢 Node.js ≥ 18.x

📦 npm or pnpm

🐙 Git


🧰 Setup Instructions :

 Clone teh frontend and copy the environment variables

<pre>
git clone https://github.com/PIYUSH-GIRI23/shrinkr-client.git
cd shrinkr-client
npm install
cp .env.config .env
</pre>

3️⃣ Run the Development Server

<pre>
npm run dev
</pre>

Now open your browser and visit:
👉 http://localhost:5173


