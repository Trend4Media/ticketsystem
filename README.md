# Ticketsystem - Kundensupport Web-App

Ein vollständiges Ticketsystem für Kundensupport mit separaten Bereichen für Kunden und Support-Mitarbeiter.

## 🚀 Features

### Für Kunden:
- **Benutzerregistrierung und Anmeldung**
- **Ticket-Erstellung** mit 3 vordefinierte Kategorien:
  - 💡 Ich benötige Hilfe
  - 🔒 Ich wurde gesperrt  
  - 🎉 Ich habe etwas gewonnen
- **Ticket-Übersicht** mit Status-Tracking
- **Responsive Design** für alle Geräte

### Für Support-Mitarbeiter:
- **Support-Dashboard** mit Ticket-Übersicht
- **Ticket-Verwaltung** (Status ändern, zuweisen)
- **Kommentar-System** für Kommunikation
- **Statistiken** und Filter-Funktionen

## 🛠️ Technologie-Stack

### Backend:
- **Node.js** + **Express.js**
- **SQLite** Datenbank
- **JWT** Authentifizierung
- **bcryptjs** Passwort-Hashing

### Frontend:
- **React 18** + **TypeScript**
- **Tailwind CSS** für Styling
- **React Router** für Navigation
- **Axios** für API-Calls
- **Heroicons** für Icons

## 📦 Installation

1. **Abhängigkeiten installieren:**
```bash
npm run install:all
```

2. **Entwicklungsserver starten:**
```bash
npm run dev
```

Dies startet:
- Backend-Server auf http://localhost:3001
- Frontend-Server auf http://localhost:3000

## 🔑 Demo-Zugangsdaten

### Support-Mitarbeiter:
- **E-Mail:** admin@support.com
- **Passwort:** admin123

### Kunden:
Registrieren Sie sich über die Registrierungsseite oder erstellen Sie einen Test-Account.

## 📋 Verwendung

### Als Kunde:
1. Registrieren Sie sich auf der Homepage
2. Melden Sie sich an
3. Erstellen Sie ein neues Ticket mit der gewünschten Kategorie
4. Verfolgen Sie den Status in Ihrem Dashboard

### Als Support-Mitarbeiter:
1. Melden Sie sich mit den Demo-Zugangsdaten an
2. Sehen Sie alle Tickets im Support-Dashboard
3. Wählen Sie ein Ticket aus, um Details zu sehen
4. Ändern Sie den Status und fügen Sie Kommentare hinzu

## 🗂️ Projektstruktur

```
ticketsystem/
├── server/                 # Backend (Node.js/Express)
│   ├── index.js           # Hauptserver-Datei
│   ├── database.js        # Datenbank-Logik
│   ├── package.json       # Backend-Abhängigkeiten
│   └── .env              # Umgebungsvariablen
├── client/                # Frontend (React/TypeScript)
│   ├── src/
│   │   ├── components/    # React-Komponenten
│   │   ├── contexts/      # React-Contexts
│   │   ├── pages/         # Seiten-Komponenten
│   │   └── App.tsx        # Haupt-App-Komponente
│   ├── public/            # Statische Dateien
│   └── package.json       # Frontend-Abhängigkeiten
└── package.json           # Root-Package mit Scripts
```

## 🔧 Entwicklung

### Backend-Entwicklung:
```bash
cd server && npm run dev
```

### Frontend-Entwicklung:
```bash
cd client && npm run dev
```

### Beide zusammen:
```bash
npm run dev
```

## 📊 Datenbank-Schema

### Tabellen:
- **users** - Kundendaten
- **support_staff** - Support-Mitarbeiter
- **tickets** - Support-Tickets
- **ticket_comments** - Kommentare zu Tickets

## 🔐 Sicherheit

- Passwörter werden mit bcrypt gehashed
- JWT-Token für Authentifizierung
- Separate Authentifizierung für Kunden und Support
- Input-Validierung auf Backend und Frontend

## 🚀 Deployment

Für Produktion:
1. Umgebungsvariablen in `.env` anpassen
2. Frontend builden: `npm run build`
3. Server starten: `npm start`

## 📝 API-Endpunkte

### Authentifizierung:
- `POST /api/register` - Kundenregistrierung
- `POST /api/login` - Kundenanmeldung
- `POST /api/support/login` - Support-Anmeldung

### Tickets:
- `POST /api/tickets` - Ticket erstellen
- `GET /api/tickets` - Alle Tickets (Support)
- `GET /api/my-tickets` - Benutzer-Tickets
- `PUT /api/tickets/:id/status` - Status ändern

### Kommentare:
- `POST /api/tickets/:id/comments` - Kommentar hinzufügen
- `GET /api/tickets/:id/comments` - Kommentare abrufen