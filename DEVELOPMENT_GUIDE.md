# 4Ticket Development Guide
## Entwicklungsanleitung für das Ticketsystem

### 🚀 **Quick Start**

#### **1. Repository klonen**
```bash
git clone https://github.com/Trend4Media/ticketsystem.git
cd ticketsystem
```

#### **2. Dependencies installieren**
```bash
npm install
```

#### **3. Entwicklungsserver starten**
```bash
# Frontend (Live Server)
npx live-server

# Backend (falls benötigt)
cd server
npm start
```

#### **4. Öffnen im Browser**
- Landing Page: `http://localhost:8080/index.html`
- Customer Portal: `http://localhost:8080/customer/index.html`
- Admin Portal: `http://localhost:8080/admin/index.html`

### 🏗️ **Projektstruktur im Detail**

```
4ticket/
├── 📄 index.html                    # Landing Page (Haupteinstieg)
├── 📄 app.html                      # Login/Auth Seite
├── 📄 script.js                     # Landing Page JavaScript
├── 📄 style.css                     # Legacy CSS (deprecated)
│
├── 📁 admin/                        # Admin-Bereich
│   ├── 📄 index.html               # Admin Dashboard
│   ├── 📄 ticket-management.html   # Ticket-Verwaltung
│   ├── 📁 css/
│   │   └── 📄 admin.css            # Admin Styles
│   └── 📁 js/
│       └── 📄 admin.js             # Admin Funktionalität
│
├── 📁 customer/                     # Kunden-Bereich
│   ├── 📄 index.html               # Kunden Dashboard
│   ├── 📄 ticket-detail.html       # Ticket Details
│   ├── 📁 css/
│   │   └── 📄 customer.css         # Kunden Styles
│   └── 📁 js/
│       └── 📄 customer.js          # Kunden Funktionalität
│
├── 📁 shared/                       # Gemeinsame Ressourcen
│   ├── 📁 css/
│   │   └── 📄 common.css           # Design System (WICHTIG!)
│   └── 📁 js/
│       └── 📄 common.js            # Gemeinsame Funktionen
│
├── 📁 server/                       # Backend (Node.js)
│   ├── 📄 app.js                   # Express Server
│   ├── 📄 package.json             # Backend Dependencies
│   ├── 📁 config/                  # Konfiguration
│   ├── 📁 models/                  # Datenmodelle
│   ├── 📁 routes/                  # API Routen
│   └── 📁 middleware/              # Express Middleware
│
└── 📁 docs/                        # Dokumentation
    ├── 📄 DATABASE_SCHEMA.md       # DB Schema
    ├── 📄 INSTALLATION.md          # Installation
    ├── 📄 PROJECT_OVERVIEW.md      # Projektüberblick
    └── 📄 CHATGPT_CONTEXT.md       # ChatGPT Kontext
```

### 🎨 **Design System Verwendung**

#### **CSS-Variablen (shared/css/common.css)**
```css
:root {
    /* Hauptfarben */
    --primary: #EC0B7A;              /* Pink - Hauptfarbe */
    --primary-dark: #C70960;         /* Dunkleres Pink */
    --primary-light: #FFE6F2;        /* Helles Pink */
    
    /* Sekundärfarben */
    --secondary: #6C5CE7;            /* Lila */
    --accent: #00D9FF;               /* Cyan */
    
    /* Status-Farben */
    --success: #00D4AA;              /* Grün */
    --warning: #FDCB6E;              /* Gelb */
    --danger: #E84393;               /* Rot */
    
    /* Gradienten */
    --gradient-primary: linear-gradient(135deg, #EC0B7A 0%, #FF1B8A 100%);
    --gradient-hero: linear-gradient(135deg, #EC0B7A 0%, #6C5CE7 50%, #00D9FF 100%);
    --gradient-card: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);
    
    /* Schatten */
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
    --shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.16);
}
```

#### **Standard-Komponenten**

##### **Moderne Card**
```css
.modern-card {
    background: var(--gradient-card);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    border: 2px solid var(--border-light);
    padding: 32px;
    box-shadow: var(--shadow-md);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary);
}
```

##### **Primary Button**
```css
.btn-primary {
    background: var(--gradient-primary);
    color: white;
    border: 2px solid transparent;
    border-radius: 16px;
    padding: 14px 28px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-md);
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
    filter: brightness(1.05);
}
```

### 📱 **Responsive Design**

#### **Breakpoints**
```css
/* Mobile First */
/* Base Styles: 320px+ */

/* Small Tablets */
@media (min-width: 480px) {
    /* Tablet Styles */
}

/* Tablets */
@media (min-width: 768px) {
    /* Desktop Styles */
}

/* Desktop */
@media (min-width: 1024px) {
    /* Large Desktop Styles */
}

/* Large Desktop */
@media (min-width: 1400px) {
    /* XL Desktop Styles */
}
```

#### **Mobile-First Approach**
```css
/* ✅ RICHTIG: Mobile First */
.component {
    width: 100%;           /* Mobile */
}

@media (min-width: 768px) {
    .component {
        width: 50%;        /* Desktop */
    }
}

/* ❌ FALSCH: Desktop First */
.component {
    width: 50%;            /* Desktop */
}

@media (max-width: 767px) {
    .component {
        width: 100%;       /* Mobile */
    }
}
```

### 🛠️ **Entwicklungsworkflow**

#### **1. Neue Feature entwickeln**
```bash
# 1. Branch erstellen
git checkout -b feature/neue-funktion

# 2. Entwickeln
# ... Code schreiben ...

# 3. Testen
# Alle Breakpoints testen
# Funktionalität testen

# 4. Commit
git add .
git commit -m "✨ Add neue Funktion mit modernem Design"

# 5. Push
git push origin feature/neue-funktion

# 6. Merge in main
git checkout main
git merge feature/neue-funktion
git push origin main
```

#### **2. CSS-Änderungen**
```bash
# 1. Cache-Busting Parameter aktualisieren
# In HTML-Dateien: ?v=2025-freshworks-ec0b7a

# 2. CSS-Variablen verwenden
# IMMER var(--primary) statt #EC0B7A

# 3. Glasmorphismus einbauen
# backdrop-filter: blur(20px) für Cards

# 4. Testen
# Mobile, Tablet, Desktop testen
```

### 🎯 **Code-Standards**

#### **HTML**
```html
<!-- ✅ RICHTIG: Semantische Tags -->
<main class="app-main">
    <section class="dashboard-section">
        <header class="section-header">
            <h2>Dashboard</h2>
        </header>
        <article class="stat-cards">
            <!-- Content -->
        </article>
    </section>
</main>

<!-- ❌ FALSCH: Nur divs -->
<div class="app-main">
    <div class="dashboard-section">
        <div class="section-header">
            <div>Dashboard</div>
        </div>
    </div>
</div>
```

#### **CSS**
```css
/* ✅ RICHTIG: CSS-Variablen verwenden */
.button {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
}

/* ❌ FALSCH: Hardcoded Werte */
.button {
    background: #EC0B7A;
    color: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

#### **JavaScript**
```javascript
// ✅ RICHTIG: ES6+ Syntax
const fetchTickets = async () => {
    try {
        const response = await fetch('/api/tickets');
        const tickets = await response.json();
        return tickets;
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
};

// ❌ FALSCH: Alte Syntax
function fetchTickets() {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/tickets');
        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.send();
    });
}
```

### 🔧 **Debugging & Tools**

#### **Browser DevTools**
```bash
# Chrome DevTools Shortcuts
F12                 # DevTools öffnen
Ctrl+Shift+M       # Mobile View Toggle
Ctrl+Shift+C       # Element Inspector
Ctrl+Shift+I       # Console
```

#### **CSS-Debugging**
```css
/* Temporärer Debug-Border */
* {
    outline: 1px solid red !important;
}

/* Glasmorphismus-Test */
.test-glassmorphism {
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}
```

#### **JavaScript-Debugging**
```javascript
// Console-Debugging
console.log('Debug:', variable);
console.table(array);
console.group('Function Name');
console.groupEnd();

// Performance-Messung
console.time('function-name');
// ... Code ...
console.timeEnd('function-name');
```

### 📦 **Dependencies**

#### **Frontend**
- **Inter Font** (Google Fonts)
- **Vanilla JavaScript** (ES6+)
- **CSS3** mit Custom Properties

#### **Backend**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0"
  }
}
```

### 🚀 **Deployment**

#### **GitHub Pages (Frontend)**
```bash
# Automatisch bei Push zu main
git push origin main
# → https://trend4media.github.io/ticketsystem/
```

#### **Backend Deployment**
```bash
# Heroku
heroku create 4ticket-backend
git subtree push --prefix server heroku main

# Railway
railway login
railway init
railway up
```

### 🔍 **Testing**

#### **Manual Testing Checklist**
- [ ] Landing Page responsive
- [ ] Customer Portal funktional
- [ ] Admin Portal funktional
- [ ] Mobile Navigation
- [ ] Form Validation
- [ ] Glasmorphismus-Effekte
- [ ] Hover-Animationen
- [ ] Cross-Browser Kompatibilität

#### **Performance Testing**
```bash
# Lighthouse Score
# Target: 90+ Performance, Accessibility, Best Practices, SEO

# PageSpeed Insights
# https://pagespeed.web.dev/

# WebPageTest
# https://webpagetest.org/
```

### 📋 **Troubleshooting**

#### **Häufige Probleme**

##### **CSS lädt nicht**
```bash
# 1. Cache-Busting Parameter prüfen
?v=2025-freshworks-ec0b7a

# 2. Pfad prüfen
../shared/css/common.css ✅
shared/css/common.css ❌

# 3. Browser-Cache leeren
Ctrl+F5 oder Ctrl+Shift+R
```

##### **Glasmorphismus funktioniert nicht**
```css
/* Vollständige Glasmorphismus-Implementierung */
.glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px); /* Safari */
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

##### **Mobile Navigation Problem**
```javascript
// Event-Delegation verwenden
document.addEventListener('click', (e) => {
    if (e.target.matches('.mobile-menu-toggle')) {
        toggleMobileMenu();
    }
});
```

### 📞 **Support & Ressourcen**

#### **Dokumentation**
- `PROJECT_OVERVIEW.md` - Projektüberblick
- `CHATGPT_CONTEXT.md` - ChatGPT Arbeitsanweisungen
- `DATABASE_SCHEMA.md` - Datenbankstruktur

#### **Design-Referenzen**
- **Freshworks Freshdesk** - Design-Inspiration
- **Glassmorphism** - UI-Trend 2024/2025
- **Material Design 3** - Component-Inspiration

#### **Tools & Extensions**
- **VS Code Extensions:**
  - Live Server
  - CSS Peek
  - Auto Rename Tag
  - Prettier
  - GitLens

---

**🎯 Happy Coding!** 
Denke immer daran: #EC0B7A, Glasmorphismus, Mobile-First! 🚀