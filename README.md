# 🎫 4Ticket - Support-Ticketsystem

Ein vollständiges Ticketsystem für Kundensupport mit **getrennten Bereichen** für Kunden und Support-Mitarbeiter.

## 🏗️ Projektstruktur

```
ticketsystem/
├── index.html              # Hauptanmeldeseite
├── admin/                  # 🛠️ Admin-Bereich (Support-Team)
│   ├── index.html         # Admin-Dashboard
│   ├── css/
│   │   └── admin.css      # Admin-spezifische Stile
│   └── js/
│       └── admin.js       # Admin-Funktionen
├── customer/               # 👤 Kundenbereich
│   ├── index.html         # Kunden-Dashboard
│   ├── css/
│   │   └── customer.css   # Kunden-spezifische Stile
│   └── js/
│       └── customer.js    # Kunden-Funktionen
├── shared/                 # 🔗 Gemeinsame Ressourcen
│   ├── css/
│   │   └── common.css     # Gemeinsame Stile
│   └── js/
│       └── auth.js        # Authentifizierung
├── server/                 # 🖥️ Backend (Node.js/Express)
│   ├── index.js           # Hauptserver-Datei
│   ├── database.js        # Datenbank-Logik
│   └── package.json       # Backend-Abhängigkeiten
├── client/                 # ⚛️ React Frontend (Alternative)
│   └── src/               # React-Komponenten
└── package.json           # Root-Package mit Scripts
```

## 🚀 Schnellstart

### 1. Repository klonen
```bash
git clone https://github.com/IhrBenutzername/ticketsystem.git
cd ticketsystem
```

### 2. Abhängigkeiten installieren
```bash
npm run install:all
```

### 3. Entwicklungsserver starten
```bash
npm run dev
```

### 4. Anwendung öffnen
- **🏠 Landingpage:** http://localhost:3000 (Marketing, Features, Preise)
- **🔐 Login:** http://localhost:3000/app.html (Anmeldung für Benutzer)
- **🛠️ Admin-Bereich:** http://localhost:3000/admin (nach Admin-Login)
- **👤 Kundenbereich:** http://localhost:3000/customer (nach Kunden-Login)

## 🔑 Demo-Zugangsdaten

### 🛠️ Support-Team (Admin):
- **E-Mail:** admin@support.com
- **Passwort:** admin123
- **Zugang zu:** Alle Tickets, Statistiken, Benutzerverwaltung

### 👤 Kunde:
- **E-Mail:** kunde@demo.com
- **Passwort:** demo123
- **Zugang zu:** Eigene Tickets, Ticket-Erstellung

## 🎯 Funktionen

### Admin-Bereich (`/admin/`)
- ✅ **Dashboard-Übersicht** mit aktuellen Tickets
- ✅ **Ticket-Verwaltung** (alle, offene, geschlossene)
- ✅ **Support-Statistiken** und Performance-Metriken
- ✅ **Benutzerverwaltung** für Kunden und Support-Team
- ✅ **Systemeinstellungen** und Konfiguration
- ✅ **Responsive Sidebar-Navigation**

### Kundenbereich (`/customer/`)
- ✅ **Persönliches Dashboard** mit Willkommensbereich
- ✅ **Ticket-Erstellung** mit 3 Kategorien:
  - 💡 Ich benötige Hilfe
  - 🔒 Ich wurde gesperrt  
  - 🎉 Ich habe etwas gewonnen
- ✅ **Meine Tickets** - Übersicht aller eigenen Tickets
- ✅ **Status-Verfolgung** in Echtzeit
- ✅ **Mobile-optimierte Benutzeroberfläche**

### Gemeinsame Funktionen (`/shared/`)
- ✅ **Zentrale Anmeldung** mit automatischer Weiterleitung
- ✅ **Session-Management** und Authentifizierung
- ✅ **Responsive Design** für alle Geräte
- ✅ **Moderne UI** mit Inter-Schriftart und Gradient-Design

## 🛠️ Technologie-Stack

### Frontend:
- **HTML5** + **CSS3** mit CSS Custom Properties
- **Vanilla JavaScript** für Interaktivität
- **Google Fonts (Inter)** für moderne Typografie
- **Responsive Design** mit CSS Grid und Flexbox

### Backend (bereits vorhanden):
- **Node.js** + **Express.js**
- **SQLite** Datenbank
- **JWT** Authentifizierung
- **bcryptjs** Passwort-Hashing

### Alternative Frontend (React):
- **React 18** + **TypeScript**
- **Tailwind CSS** für Styling
- **React Router** für Navigation

## 📂 Bereiche im Detail

### 🛠️ Admin-Bereich
**Pfad:** `/admin/index.html`
- Vollständige Ticket-Verwaltung
- Übersichtliche Sidebar-Navigation
- Statistik-Dashboard mit Metriken
- Benutzerverwaltung mit Tabellen-Ansicht
- Responsive Design für Desktop und Mobile

### 👤 Kundenbereich  
**Pfad:** `/customer/index.html`
- Benutzerfreundliches Dashboard
- Einfache Ticket-Erstellung mit Kategorien
- Übersicht aller eigenen Tickets
- Status-Verfolgung und Updates
- Mobile-first Design

### 🔗 Gemeinsame Ressourcen
**Pfad:** `/shared/`
- Einheitliche Stile und Farben
- Zentrale Authentifizierungs-Logik
- Wiederverwendbare Komponenten
- Konsistente Benutzeroberfläche

## 🔒 Sicherheit

- ✅ **Getrennte Authentifizierung** für Admin und Kunden
- ✅ **Session-Management** mit localStorage
- ✅ **Zugriffskontrolle** - Admins können nicht auf Kundenbereich zugreifen und umgekehrt
- ✅ **Automatische Weiterleitung** basierend auf Benutzertyp

## 🚀 Deployment

### GitHub Pages:
Das Projekt ist bereits für GitHub Pages konfiguriert:
```bash
git add .
git commit -m "Neue Projektstruktur mit getrennten Bereichen"
git push origin main
```

### Lokale Entwicklung:
```bash
# Einfacher HTTP-Server für statische Dateien
python -m http.server 8000
# oder
npx serve .
```

## 📱 Responsive Design

- ✅ **Mobile-optimiert** für Smartphones
- ✅ **Tablet-freundlich** für mittlere Bildschirme  
- ✅ **Desktop-optimiert** mit Sidebar-Navigation
- ✅ **Touch-freundliche** Buttons und Interaktionen

## 🎨 Design-System

### Farben:
- **Primary:** #007AFF (iOS-Blau)
- **Secondary:** #5856D6 (Lila)
- **Success:** #28CA42 (Grün)
- **Warning:** #FF9500 (Orange)
- **Danger:** #FF3B30 (Rot)

### Schriftarten:
- **Inter** (Google Fonts) für optimale Lesbarkeit
- **SF Mono** für Code und IDs

## 🔄 Git-Workflow

1. **Änderungen hinzufügen:**
   ```bash
   git add .
   ```

2. **Commit erstellen:**
   ```bash
   git commit -m "Beschreibung der Änderungen"
   ```

3. **Zu GitHub pushen:**
   ```bash
   git push origin main
   ```

## 📞 Support

Bei Fragen zur Implementierung oder Erweiterung des Systems, nutzen Sie die GitHub Issues oder kontaktieren Sie das Entwicklungsteam.

---

**Entwickelt mit ❤️ für optimalen Kundensupport**