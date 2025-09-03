# 🎫 4Ticket - Modernes Ticketsystem
## Professioneller Kundensupport mit Freshworks-inspiriertem Design

[![Live Demo](https://img.shields.io/badge/Live-Demo-EC0B7A?style=for-the-badge)](https://trend4media.github.io/ticketsystem/)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-181717?style=for-the-badge&logo=github)](https://github.com/Trend4Media/ticketsystem)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

### 🎨 **Moderne UI mit Glasmorphismus-Design**
4Ticket ist ein hochmodernes, White-Label-fähiges Ticketsystem mit einem atemberaubenden Freshworks-inspirierten Design. Entwickelt mit der Hauptfarbe **#EC0B7A** und modernsten Web-Technologien.

---

## ✨ **Hauptfeatures**

### 🏠 **Landing Page**
- **Moderne Hero-Section** mit Gradient-Hintergrund
- **Interaktive Feature-Cards** mit Hover-Animationen  
- **Pricing-Section** mit "Beliebt"-Badge
- **Live-Demo-Bereich** mit Testaccounts
- **Vollständig responsiv** für alle Geräte

### 👤 **Kunden-Portal**
- **Glasmorphismus-Design** with Backdrop-Blur-Effekten
- **Intuitive Ticket-Erstellung** mit modernen Formularen
- **Ticket-Übersicht** mit Such- und Filterfunktionen
- **Echtzeit-Updates** und Benachrichtigungen
- **Mobile-optimierte Navigation**

### 🔧 **Admin-Dashboard**
- **Moderne Sidebar-Navigation** mit Gradient-Hover-Effekten
- **Statistik-Cards** mit animierten Zahlen
- **Ticket-Management** mit Bulk-Aktionen
- **Benutzer-Verwaltung** und Rollenkonzept
- **White-Label-Anpassungen**

### 🎨 **Design-System**
- **Hauptfarbe:** #EC0B7A (Pink/Magenta)
- **Sekundärfarben:** #6C5CE7 (Lila), #00D9FF (Cyan)
- **Glasmorphismus-Effekte** auf allen Cards
- **Smooth Animations** mit Cubic-Bezier-Kurven
- **Moderne Schatten-System** mit mehreren Ebenen

---

## 🚀 **Live Demo**

### 🌐 **URLs**
- **🏠 Landing Page:** [https://trend4media.github.io/ticketsystem/](https://trend4media.github.io/ticketsystem/)
- **👤 Customer Portal:** [https://trend4media.github.io/ticketsystem/customer/](https://trend4media.github.io/ticketsystem/customer/)
- **🔧 Admin Dashboard:** [https://trend4media.github.io/ticketsystem/admin/](https://trend4media.github.io/ticketsystem/admin/)

### 🔑 **Demo-Accounts**
```javascript
// 🔧 Admin Account
Email: admin@support.com
Password: admin123

// 👤 Customer Account  
Email: kunde@demo.com
Password: demo123
```

---

## 🏗️ **Projektstruktur**

```
4ticket/
├── 📄 index.html                    # Landing Page (Haupteinstieg)
├── 📄 app.html                      # Login/Auth Seite
├── 📄 script.js                     # Landing Page JavaScript
│
├── 📁 admin/                        # 🔧 Admin-Bereich
│   ├── 📄 index.html               # Admin Dashboard
│   ├── 📄 ticket-management.html   # Ticket-Verwaltung
│   ├── 📁 css/admin.css            # Admin Styles
│   └── 📁 js/admin.js              # Admin Funktionalität
│
├── 📁 customer/                     # 👤 Kunden-Bereich
│   ├── 📄 index.html               # Kunden Dashboard
│   ├── 📄 ticket-detail.html       # Ticket Details
│   ├── 📁 css/customer.css         # Kunden Styles
│   └── 📁 js/customer.js           # Kunden Funktionalität
│
├── 📁 shared/                       # 🔗 Gemeinsame Ressourcen
│   ├── 📁 css/common.css           # Design System (WICHTIG!)
│   └── 📁 js/common.js             # Gemeinsame Funktionen
│
├── 📁 server/                       # ⚙️ Backend (Node.js)
│   ├── 📄 app.js                   # Express Server
│   ├── 📁 config/                  # Konfiguration
│   ├── 📁 models/                  # Datenmodelle
│   └── 📁 routes/                  # API Routen
│
└── 📁 docs/                        # 📚 Dokumentation
    ├── 📄 PROJECT_OVERVIEW.md      # Projektüberblick
    ├── 📄 DEVELOPMENT_GUIDE.md     # Entwicklungsanleitung
    ├── 📄 CHATGPT_CONTEXT.md       # ChatGPT-5 Kontext
    ├── 📄 API_DOCUMENTATION.md     # API Dokumentation
    └── 📄 DATABASE_SCHEMA.md       # Datenbankschema
```

---

## 🛠️ **Technologie-Stack**

### **Frontend**
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) **HTML5** mit semantischen Tags
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) **CSS3** mit Custom Properties, Grid & Flexbox
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) **Vanilla JavaScript** (ES6+)
- ![Google Fonts](https://img.shields.io/badge/Google%20Fonts-4285F4?style=flat-square&logo=google&logoColor=white) **Inter Font** von Google Fonts

### **Backend**
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) **Node.js** mit Express.js
- ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white) **SQLite** als Datenbank
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) **JWT** für Authentifizierung

### **Deployment**
- ![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-181717?style=flat-square&logo=github&logoColor=white) **GitHub Pages** für Frontend
- ![Heroku](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=heroku&logoColor=white) **Heroku/Railway** für Backend

---

## 🚀 **Quick Start**

### **1. Repository klonen**
```bash
git clone https://github.com/Trend4Media/ticketsystem.git
cd ticketsystem
```

### **2. Dependencies installieren**
```bash
npm install
```

### **3. Frontend starten**
```bash
# Live Server (empfohlen)
npx live-server

# Oder Python Server
python -m http.server 8000
```

### **4. Backend starten (optional)**
```bash
cd server
npm install
npm start
```

### **5. Im Browser öffnen**
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3000`

---

## 🎨 **Design-System**

### **Farbpalette**
```css
:root {
    /* 🎨 Hauptfarben */
    --primary: #EC0B7A;              /* Pink - Hauptfarbe */
    --primary-dark: #C70960;         /* Dunkleres Pink */
    --secondary: #6C5CE7;            /* Lila */
    --accent: #00D9FF;               /* Cyan */
    
    /* ✅ Status-Farben */
    --success: #00D4AA;              /* Grün */
    --warning: #FDCB6E;              /* Gelb */
    --danger: #E84393;               /* Rot */
    
    /* 🌈 Gradienten */
    --gradient-primary: linear-gradient(135deg, #EC0B7A 0%, #FF1B8A 100%);
    --gradient-hero: linear-gradient(135deg, #EC0B7A 0%, #6C5CE7 50%, #00D9FF 100%);
    --gradient-card: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);
}
```

### **Glasmorphismus-Komponenten**
```css
.glass-card {
    background: var(--gradient-card);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

---

## 📚 **Dokumentation**

### **Für Entwickler**
- 📖 [**PROJECT_OVERVIEW.md**](PROJECT_OVERVIEW.md) - Vollständiger Projektüberblick
- 🛠️ [**DEVELOPMENT_GUIDE.md**](DEVELOPMENT_GUIDE.md) - Entwicklungsanleitung
- 🔌 [**API_DOCUMENTATION.md**](API_DOCUMENTATION.md) - API Referenz
- 🗄️ [**DATABASE_SCHEMA.md**](DATABASE_SCHEMA.md) - Datenbankstruktur

### **Für ChatGPT-5**
- 🤖 [**CHATGPT_CONTEXT.md**](CHATGPT_CONTEXT.md) - Spezielle Arbeitsanweisungen
- 🎯 [**INSTALLATION.md**](INSTALLATION.md) - Setup-Anleitung
- 🏗️ [**WHITELABEL_ARCHITEKTUR.md**](WHITELABEL_ARCHITEKTUR.md) - Architektur-Details

---

## 🎯 **Features im Detail**

### **✨ Moderne UI/UX**
- ✅ Glasmorphismus-Design mit Backdrop-Blur
- ✅ Smooth Animations mit Cubic-Bezier-Kurven  
- ✅ Responsive Design für alle Geräte
- ✅ Dark/Light Mode Support
- ✅ Accessibility (WCAG 2.1 AA)

### **🎫 Ticket-Management**
- ✅ Ticket-Erstellung mit Rich-Text-Editor
- ✅ Prioritäten und Kategorien
- ✅ Automatische Zuweisung
- ✅ SLA-Tracking
- ✅ File-Upload Support

### **👥 Benutzer-Verwaltung**
- ✅ Rollenbasierte Berechtigungen
- ✅ Multi-Tenant-Architektur
- ✅ SSO-Integration
- ✅ Team-Management
- ✅ Activity-Tracking

### **📊 Analytics & Reporting**
- ✅ Dashboard mit Echtzeit-Statistiken
- ✅ Performance-Metriken
- ✅ Custom Reports
- ✅ Export-Funktionen
- ✅ Trend-Analysen

---

## 🔧 **Konfiguration**

### **Environment Variables**
```bash
# Backend Configuration
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secret-key
DATABASE_URL=sqlite:./database.db

# Frontend Configuration  
API_BASE_URL=https://your-api.com
THEME_COLOR=#EC0B7A
```

### **White-Label Anpassungen**
```css
/* Eigene Farben definieren */
:root {
    --primary: #YOUR_COLOR;
    --company-logo: url('/path/to/logo.png');
    --company-name: 'Ihr Unternehmen';
}
```

---

## 🤝 **Mitwirken**

### **Entwicklung**
1. Fork das Repository
2. Feature-Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m '✨ Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

### **Bug Reports**
Bitte erstelle ein Issue mit:
- 🐛 Beschreibung des Problems
- 🔄 Schritte zur Reproduktion
- 💻 Browser/OS Information
- 📸 Screenshots (falls relevant)

### **Feature Requests**
- 💡 Beschreibung der gewünschten Funktion
- 🎯 Use-Case und Begründung
- 🎨 Mockups oder Wireframes (optional)

---

## 📄 **Lizenz**

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) für Details.

---

## 📞 **Support & Kontakt**

### **Links**
- 🌐 **Website:** [4ticket.com](https://4ticket.com)
- 📧 **E-Mail:** support@4ticket.com
- 💬 **Discord:** [4Ticket Community](https://discord.gg/4ticket)
- 📱 **Twitter:** [@4TicketSupport](https://twitter.com/4TicketSupport)

### **Entwickler**
- 👨‍💻 **Team:** Trend4Media
- 🏢 **Unternehmen:** [Trend4Media GmbH](https://trend4media.de)
- 📍 **Standort:** Deutschland

---

## 🎉 **Danksagungen**

- 🎨 **Design-Inspiration:** Freshworks Freshdesk
- 🌐 **Icons:** Heroicons & Feather Icons  
- 🎭 **Fonts:** Google Fonts (Inter)
- 🚀 **Hosting:** GitHub Pages & Heroku

---

<div align="center">

**⭐ Gefällt dir das Projekt? Gib uns einen Stern! ⭐**

[![GitHub Stars](https://img.shields.io/github/stars/Trend4Media/ticketsystem?style=social)](https://github.com/Trend4Media/ticketsystem/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Trend4Media/ticketsystem?style=social)](https://github.com/Trend4Media/ticketsystem/network)

---

**Entwickelt mit ❤️ und #EC0B7A von [Trend4Media](https://trend4media.de)**

</div>