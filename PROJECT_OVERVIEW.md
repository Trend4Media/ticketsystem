# 4Ticket - Professionelles Ticketsystem
## Projektüberblick für ChatGPT-5

### 🎯 **Projektbeschreibung**
4Ticket ist ein modernes, White-Label-fähiges Ticketsystem für professionellen Kundensupport. Das System bietet sowohl Admin- als auch Kundenbereiche mit einer modernen, Freshworks-inspirierten Benutzeroberfläche.

### 🎨 **Design-System**
**Hauptfarbe:** #EC0B7A (Pink/Magenta)
**Design-Stil:** Freshworks-inspiriert mit Glasmorphismus-Effekten
**Sekundärfarben:** 
- #6C5CE7 (Lila)
- #00D9FF (Cyan)
- #00D4AA (Grün für Success)
- #FDCB6E (Gelb für Warnings)

### 🏗️ **Projektstruktur**

```
/
├── index.html                 # Landing Page (Hauptseite)
├── app.html                   # Login/App Entry Point
├── style.css                  # Legacy CSS (wird nicht mehr verwendet)
├── script.js                  # Hauptskript für Landing Page
│
├── admin/                     # Admin-Bereich
│   ├── index.html            # Admin Dashboard
│   ├── ticket-management.html # Ticket-Verwaltung
│   ├── css/
│   │   └── admin.css         # Admin-spezifische Styles
│   └── js/
│       └── admin.js          # Admin-Funktionalität
│
├── customer/                  # Kunden-Bereich
│   ├── index.html            # Kunden Dashboard
│   ├── ticket-detail.html    # Ticket-Details
│   ├── css/
│   │   └── customer.css      # Kunden-spezifische Styles
│   └── js/
│       └── customer.js       # Kunden-Funktionalität
│
├── shared/                    # Gemeinsame Ressourcen
│   ├── css/
│   │   └── common.css        # Gemeinsame Styles (Design System)
│   └── js/
│       └── common.js         # Gemeinsame JavaScript-Funktionen
│
├── server/                    # Backend (Node.js)
│   ├── app.js               # Haupt-Server
│   ├── config/              # Konfigurationsdateien
│   ├── models/              # Datenmodelle
│   ├── routes/              # API-Routen
│   └── middleware/          # Express Middleware
│
└── docs/                     # Dokumentation
    ├── DATABASE_SCHEMA.md    # Datenbankschema
    ├── INSTALLATION.md       # Installationsanleitung
    ├── LINK_VALIDATION.md    # Link-Validierung
    ├── STRUKTUR.md          # Strukturdokumentation
    └── WHITELABEL_ARCHITEKTUR.md # White-Label Architektur
```

### 🌐 **Live-URLs**
- **Landing Page:** https://trend4media.github.io/ticketsystem/index.html
- **Customer Portal:** https://trend4media.github.io/ticketsystem/customer/index.html  
- **Admin Portal:** https://trend4media.github.io/ticketsystem/admin/index.html

### 🎨 **Design-System Details**

#### **CSS-Variablen (in shared/css/common.css)**
```css
:root {
    /* Primary Colors */
    --primary: #EC0B7A;
    --primary-dark: #C70960;
    --primary-light: #FFE6F2;
    
    /* Secondary Colors */
    --secondary: #6C5CE7;
    --accent: #00D9FF;
    
    /* Status Colors */
    --success: #00D4AA;
    --warning: #FDCB6E;
    --danger: #E84393;
    
    /* Gradients */
    --gradient-primary: linear-gradient(135deg, #EC0B7A 0%, #FF1B8A 100%);
    --gradient-hero: linear-gradient(135deg, #EC0B7A 0%, #6C5CE7 50%, #00D9FF 100%);
    --gradient-card: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);
}
```

#### **Design-Prinzipien**
1. **Glasmorphismus:** Backdrop-blur Effekte auf Cards und Modals
2. **Moderne Schatten:** Mehrschichtige Schatten-System
3. **Smooth Animations:** Cubic-bezier Transitions
4. **Responsive Design:** Mobile-first Approach
5. **Accessibility:** WCAG 2.1 AA konform

### 🔧 **Technologie-Stack**

#### **Frontend**
- **HTML5** mit semantischen Tags
- **CSS3** mit Custom Properties und Grid/Flexbox
- **Vanilla JavaScript** (ES6+)
- **Inter Font** von Google Fonts

#### **Backend**
- **Node.js** mit Express.js
- **SQLite** als Datenbank
- **JWT** für Authentifizierung
- **Multer** für File-Uploads

#### **Deployment**
- **GitHub Pages** für Frontend
- **Heroku/Railway** für Backend (konfigurierbar)

### 🚀 **Hauptfunktionen**

#### **Landing Page (index.html)**
- Moderne Hero-Section mit Statistiken
- Feature-Übersicht mit animierten Cards
- Pricing-Section mit "Beliebt"-Badge
- Demo-Bereich mit Login-Credentials
- Responsive Navigation mit Mobile-Menu

#### **Customer Portal**
- Ticket-Erstellung mit Rich-Text-Editor
- Ticket-Übersicht mit Filteroptionen
- Ticket-Details mit Kommentar-System
- Profil-Verwaltung
- Responsive Dashboard

#### **Admin Portal**
- Dashboard mit Statistik-Cards
- Ticket-Management mit Bulk-Actions
- Benutzer-Verwaltung
- Einstellungen und Konfiguration
- White-Label Anpassungen

### 🔐 **Authentifizierung**

#### **Demo-Accounts**
```javascript
// Admin Account
Email: admin@support.com
Password: admin123

// Customer Account  
Email: kunde@demo.com
Password: demo123
```

### 📊 **Datenbank-Schema**

#### **Haupttabellen**
- `users` - Benutzer (Admin/Kunden)
- `tickets` - Support-Tickets
- `comments` - Ticket-Kommentare
- `companies` - Unternehmen (Multi-Tenant)
- `settings` - System-Einstellungen

### 🎯 **Entwicklungsziele**

#### **Abgeschlossen ✅**
- Moderne Landing Page mit #EC0B7A Design
- Customer Portal Redesign
- Admin Portal Redesign
- Responsive Design für alle Bereiche
- Glasmorphismus-Effekte implementiert

#### **Geplant 📋**
- Backend API-Integration
- Echtzeit-Notifications
- File-Upload Funktionalität
- Advanced Filtering
- White-Label Customization UI

### 🛠️ **Entwicklungsrichtlinien**

#### **CSS-Standards**
- Verwende CSS Custom Properties für Konsistenz
- Mobile-first responsive Design
- BEM-Methodologie für CSS-Klassen
- Moderne CSS-Features (Grid, Flexbox, backdrop-filter)

#### **JavaScript-Standards**
- ES6+ Syntax verwenden
- Async/Await für asynchrone Operationen
- Modulare Struktur mit separaten Files
- Event-Delegation für bessere Performance

#### **Accessibility**
- Semantische HTML-Tags verwenden
- ARIA-Labels für interaktive Elemente
- Keyboard-Navigation unterstützen
- Farbkontraste WCAG-konform

### 🔄 **Cache-Busting**
Alle CSS-Files verwenden Versionsparameter:
```html
<link rel="stylesheet" href="css/style.css?v=2025-freshworks-ec0b7a">
```

### 📱 **Responsive Breakpoints**
```css
/* Mobile */
@media (max-width: 480px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop */
@media (max-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1400px) { }
```

### 🎨 **Komponenten-Bibliothek**

#### **Buttons**
```css
.btn-primary    /* Hauptbutton mit Gradient */
.btn-secondary  /* Sekundärbutton */
.btn-white      /* Weißer Button für Hero */
.btn-small      /* Kleine Buttons für Actions */
```

#### **Cards**
```css
.feature-card   /* Feature-Karten auf Landing Page */
.pricing-card   /* Preiskarten */
.ticket-card    /* Ticket-Übersichtskarten */
.stat-card      /* Statistik-Karten im Admin */
```

### 🔍 **SEO & Performance**
- Optimierte Meta-Tags
- Preconnect für Google Fonts
- Lazy Loading für Bilder
- Minifizierte CSS/JS in Produktion

---

**Letzte Aktualisierung:** $(date)
**Version:** 2.0 (Freshworks Design)
**Hauptfarbe:** #EC0B7A