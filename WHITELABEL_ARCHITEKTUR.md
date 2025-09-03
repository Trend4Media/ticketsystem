# 🏢 White-Label Multi-Tenant Ticketsystem

## 🎯 Konzept

Ein **Multi-Tenant SaaS-System**, das beliebig viele Unternehmen bedienen kann, wobei jedes Unternehmen seine eigene **isolierte Instanz** mit individueller Gestaltung erhält.

## 🏗️ Architektur-Übersicht

```
🌐 Domain-Struktur:
├── demo.ticketsystem.com     → Demo Corporation
├── acme.ticketsystem.com     → ACME Corporation  
├── trend4media.ticketsystem.com → Trend4Media
└── custom-domain.com         → Eigene Domain

🗄️ Datenbank-Struktur:
├── companies                 → Mandanten/Unternehmen
├── admin_users              → Support-Mitarbeiter pro Unternehmen
├── customers                → Kunden pro Unternehmen
├── tickets                  → Tickets (mandanten-isoliert)
├── ticket_messages          → Nachrichten/Kommunikation
├── ticket_history           → Änderungsverlauf
└── sessions                 → Benutzer-Sessions
```

## 🔐 Mandanten-Isolation (Tenant Isolation)

### 1. **Domain-basierte Trennung:**
```javascript
Subdomain: demo.ticketsystem.com
↓
Company: Demo Corporation (ID: 1)
↓  
Admin: admin@support.com (Company ID: 1)
Kunde: kunde@demo.com (Company ID: 1)
Tickets: Nur für Company ID: 1
```

### 2. **Datenbank-Isolation:**
- **Jede Abfrage** filtert nach `company_id`
- **Kein Cross-Tenant-Zugriff** möglich
- **Separate Benutzer** pro Mandant
- **Isolierte Tickets** und Nachrichten

### 3. **UI-Anpassung:**
```css
/* Pro Unternehmen individuelle Farben */
:root {
    --primary: {{company.primary_color}};
    --secondary: {{company.secondary_color}};
}

/* Eigenes Logo */
.company-logo {
    background-image: url('{{company.logo_url}}');
}
```

## 📊 Datenbank-Schema

### 🏢 **Companies (Mandanten)**
```sql
companies:
├── id (Primary Key)
├── company_key (Eindeutig, z.B. 'demo-corp')
├── company_name ('Demo Corporation')
├── subdomain ('demo' → demo.ticketsystem.com)
├── custom_domain (optional: eigene Domain)
├── primary_color (#007AFF)
├── secondary_color (#5856D6)
├── logo_url (Logo-URL)
├── custom_css (Eigene CSS-Anpassungen)
├── max_users (Benutzer-Limit)
├── plan_type ('starter', 'pro', 'enterprise')
└── status ('trial', 'active', 'suspended')
```

### 👥 **Admin_Users (Support-Mitarbeiter)**
```sql
admin_users:
├── id (Primary Key)
├── company_id (Foreign Key → companies.id)
├── email (pro Unternehmen eindeutig)
├── password_hash (bcrypt)
├── first_name, last_name
├── role ('super_admin', 'admin', 'agent')
├── permissions (JSON: welche Funktionen erlaubt)
└── status ('active', 'inactive')
```

### 👤 **Customers (Kunden)**
```sql
customers:
├── id (Primary Key)  
├── company_id (Foreign Key → companies.id)
├── email (pro Unternehmen eindeutig)
├── password_hash (bcrypt)
├── first_name, last_name
├── customer_tier ('basic', 'premium', 'enterprise')
└── status ('active', 'inactive')
```

### 🎫 **Tickets**
```sql
tickets:
├── id (Primary Key)
├── company_id (Foreign Key → companies.id)
├── customer_id (Foreign Key → customers.id)
├── assigned_admin_id (Foreign Key → admin_users.id)
├── ticket_number ('TK-2024-000001')
├── subject, description, category
├── priority ('low', 'medium', 'high')
├── status ('open', 'in_progress', 'resolved', 'closed')
└── created_at, updated_at, resolved_at
```

### 💬 **Ticket_Messages (Kommunikation)**
```sql
ticket_messages:
├── id (Primary Key)
├── company_id (Foreign Key → companies.id)
├── ticket_id (Foreign Key → tickets.id)
├── sender_type ('admin' oder 'customer')
├── sender_id (admin_users.id oder customers.id)
├── sender_name ('Max Mustermann')
├── message (Nachrichtentext)
├── is_internal (nur für Admins sichtbar)
└── created_at
```

## 🚀 White-Label Features

### 1. **Individuelles Branding:**
- ✅ Eigene Farben pro Unternehmen
- ✅ Eigenes Logo
- ✅ Custom CSS möglich
- ✅ Eigene Domain (custom_domain)

### 2. **Funktions-Beschränkungen:**
```json
{
  "max_users": 100,
  "max_admin_users": 10,
  "features": {
    "advanced_reporting": true,
    "custom_fields": true,
    "api_access": false,
    "integrations": ["email", "slack"]
  }
}
```

### 3. **Plan-basierte Limits:**
- **Starter:** 50 Kunden, 2 Admins
- **Pro:** 500 Kunden, 10 Admins, Advanced Features
- **Enterprise:** Unlimited, Custom Features, API

## 🔄 Kommunikations-Flow

### **Ticket erstellen (Kunde):**
```
1. Kunde loggt sich ein → company_id ermittelt
2. Ticket erstellen → tickets (company_id, customer_id)
3. Erste Nachricht → ticket_messages (customer → admin)
4. E-Mail-Benachrichtigung an Admin-Team
```

### **Admin antwortet:**
```
1. Admin sieht Ticket im Dashboard
2. Antwortet → ticket_messages (admin → customer)  
3. E-Mail-Benachrichtigung an Kunden
4. Status-Update möglich
```

### **Kunde antwortet zurück:**
```
1. Kunde sieht neue Admin-Nachricht
2. Kann antworten → ticket_messages (customer → admin)
3. Endlose Kommunikation möglich
```

## 🛠️ Implementierung

### **Server-Setup:**
```bash
cd server
npm install
node multitenant-server.js
```

### **API-Endpunkte:**
```
🔐 Authentifizierung:
POST /api/auth/login

🎫 Tickets:
POST /api/tickets                    # Ticket erstellen (Kunde)
GET  /api/my-tickets                 # Meine Tickets (Kunde)
GET  /api/admin/tickets              # Alle Tickets (Admin)
PUT  /api/tickets/:id/status         # Status ändern (Admin)

💬 Nachrichten:
GET  /api/tickets/:id/messages       # Nachrichten abrufen
POST /api/tickets/:id/messages       # Nachricht hinzufügen

📊 Statistiken:
GET  /api/admin/statistics           # Dashboard-Statistiken (Admin)

🏢 Unternehmen:
GET  /api/company/config             # Branding-Konfiguration
```

### **Frontend-Integration:**
```javascript
// Mandanten-spezifische Konfiguration laden
async function loadCompanyConfig() {
    const response = await fetch('/api/company/config');
    const config = await response.json();
    
    // Farben anwenden
    document.documentElement.style.setProperty('--primary', config.company.primaryColor);
    document.documentElement.style.setProperty('--secondary', config.company.secondaryColor);
    
    // Logo anwenden
    if (config.company.logoUrl) {
        document.querySelector('.company-logo').src = config.company.logoUrl;
    }
}
```

## 💰 Verkaufs-Modell

### **White-Label Pakete:**

1. **Starter (€29/Monat):**
   - 50 Kunden
   - 2 Admin-Benutzer
   - Basis-Features
   - E-Mail-Support

2. **Professional (€99/Monat):**
   - 500 Kunden
   - 10 Admin-Benutzer
   - Erweiterte Features
   - Custom Branding
   - API-Zugang

3. **Enterprise (€299/Monat):**
   - Unlimited Benutzer
   - Custom Features
   - Eigene Domain
   - Priority Support
   - SLA-Garantie

### **Setup pro Kunde:**
```javascript
// Neues Unternehmen anlegen
const company = await db.runQuery(`
    INSERT INTO companies 
    (company_key, company_name, subdomain, primary_color, contact_email, plan_type)
    VALUES (?, ?, ?, ?, ?, ?)
`, ['kunde-xyz', 'Kunde XYZ GmbH', 'kunde-xyz', '#FF6B35', 'admin@kunde-xyz.de', 'pro']);

// Ersten Admin-Benutzer erstellen
const adminPassword = await bcrypt.hash('initial-password', 10);
await db.runQuery(`
    INSERT INTO admin_users 
    (company_id, email, password_hash, first_name, last_name, role)
    VALUES (?, ?, ?, ?, ?, 'super_admin')
`, [company.id, 'admin@kunde-xyz.de', adminPassword, 'Admin', 'User']);
```

## 🔒 Sicherheits-Features

- ✅ **Mandanten-Isolation:** Kein Cross-Tenant-Zugriff
- ✅ **JWT-Authentifizierung:** Sichere Token-basierte Auth
- ✅ **Passwort-Hashing:** bcrypt für alle Passwörter
- ✅ **Rollen-basierte Berechtigungen:** Admin vs. Customer
- ✅ **Session-Management:** Kontrollierte Sitzungen
- ✅ **Input-Validierung:** Alle Eingaben werden validiert

## 📱 Responsive & Modern

- ✅ **Mobile-optimiert** für alle Geräte
- ✅ **Modern UI** mit CSS Grid & Flexbox
- ✅ **Dark/Light Mode** pro Unternehmen konfigurierbar
- ✅ **Echtzeit-Updates** (WebSocket-ready)
- ✅ **PWA-ready** für App-Installation

Diese Architektur ermöglicht es, das System als **White-Label-Lösung** zu verkaufen, wobei jedes Unternehmen seine eigene, vollständig isolierte Instanz erhält.