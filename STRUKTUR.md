# 🏗️ Projektstruktur - 4Ticket Ticketsystem

## 📋 Übersicht der neuen Struktur

Das Projekt wurde in **drei Hauptbereiche** aufgeteilt:

### 1. 🏠 Hauptseite (`/index.html`)
- **Zentrale Anmeldung** für alle Benutzer
- **Automatische Weiterleitung** basierend auf Benutzertyp
- **Demo-Accounts** zum Testen
- **Responsive Login-Interface**

### 2. 🛠️ Admin-Bereich (`/admin/`)
```
admin/
├── index.html          # Admin-Dashboard
├── css/
│   └── admin.css      # Admin-spezifische Stile
└── js/
    └── admin.js       # Admin-Funktionalität
```

**Funktionen:**
- Dashboard mit Ticket-Übersicht
- Sidebar-Navigation
- Ticket-Verwaltung (alle, offene, geschlossene)
- Statistiken und Metriken
- Benutzerverwaltung
- Systemeinstellungen

### 3. 👤 Kundenbereich (`/customer/`)
```
customer/
├── index.html          # Kunden-Dashboard  
├── css/
│   └── customer.css   # Kunden-spezifische Stile
└── js/
    └── customer.js    # Kunden-Funktionalität
```

**Funktionen:**
- Persönliches Dashboard
- Ticket-Erstellung mit Kategorien
- Meine Tickets Übersicht
- Status-Verfolgung
- Mobile-optimiert

### 4. 🔗 Gemeinsame Ressourcen (`/shared/`)
```
shared/
├── css/
│   └── common.css     # Gemeinsame Stile
└── js/
    └── auth.js        # Authentifizierung
```

**Funktionen:**
- Einheitliche Stile und Farben
- Zentrale Authentifizierungs-Logik
- Session-Management
- Wiederverwendbare Komponenten

## 🚀 So funktioniert die Navigation:

### Anmeldung:
1. Benutzer öffnet `/index.html`
2. Gibt Anmeldedaten ein
3. System erkennt Benutzertyp automatisch
4. **Admin** → Weiterleitung zu `/admin/index.html`
5. **Kunde** → Weiterleitung zu `/customer/index.html`

### Sicherheit:
- Jeder Bereich prüft beim Laden die Berechtigung
- **Admin-Bereich:** Nur für `type: 'admin'`
- **Kundenbereich:** Nur für `type: 'customer'`
- **Automatischer Logout** bei ungültiger Berechtigung

## 🎯 Demo-Accounts:

### 🛠️ Admin-Account:
```
E-Mail: admin@support.com
Passwort: admin123
Zugang: Admin-Dashboard
```

### 👤 Kunden-Account:
```
E-Mail: kunde@demo.com  
Passwort: demo123
Zugang: Kunden-Dashboard
```

## 🔧 Entwicklung:

### Neue Features hinzufügen:

**Für Admin-Bereich:**
1. HTML in `/admin/index.html` erweitern
2. Stile in `/admin/css/admin.css` hinzufügen
3. Funktionen in `/admin/js/admin.js` implementieren

**Für Kundenbereich:**
1. HTML in `/customer/index.html` erweitern
2. Stile in `/customer/css/customer.css` hinzufügen  
3. Funktionen in `/customer/js/customer.js` implementieren

**Für gemeinsame Features:**
1. Stile in `/shared/css/common.css` hinzufügen
2. Funktionen in `/shared/js/auth.js` erweitern

## 📱 Responsive Breakpoints:

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** > 1024px

## 🎨 CSS-Variablen (Design-System):

```css
:root {
    --primary: #007AFF;
    --secondary: #5856D6;
    --success: #28CA42;
    --warning: #FF9500;
    --danger: #FF3B30;
    --text-primary: #1D1D1F;
    --text-secondary: #86868B;
    --background: #FBFBFD;
    --surface: #FFFFFF;
    --border: rgba(0, 0, 0, 0.1);
    --gradient-primary: linear-gradient(135deg, #007AFF, #5856D6);
}
```

Diese Struktur ermöglicht es, beide Bereiche **unabhängig voneinander** zu entwickeln, während gemeinsame Ressourcen **zentral verwaltet** werden.