# 🚀 Installation - Multi-Tenant Ticketsystem

## 📋 Schnellstart

### 1. **Repository klonen:**
```bash
git clone https://github.com/Trend4Media/ticketsystem.git
cd ticketsystem
```

### 2. **Abhängigkeiten installieren:**
```bash
npm run install:all
```

### 3. **Multi-Tenant Datenbank einrichten:**
```bash
cd server
npm run setup
```

### 4. **Multi-Tenant Server starten:**
```bash
npm run multitenant
```

### 5. **Frontend testen:**
```bash
# In einem neuen Terminal
python3 -m http.server 8000
# oder
npx serve .
```

## 🎯 **Sofortiger Test:**

### **URLs öffnen:**
- **Hauptseite:** http://localhost:8000
- **Alte App (repariert):** http://localhost:8000/app.html
- **Admin direkt:** http://localhost:8000/admin/
- **Kunde direkt:** http://localhost:8000/customer/

### **Demo-Accounts:**
```
🛠️ Admin: admin@support.com / admin123
👤 Kunde: kunde@demo.com / demo123
```

## 🏢 **White-Label Kunden-Setup**

### **Neues Unternehmen hinzufügen:**

```sql
-- 1. Unternehmen erstellen
INSERT INTO companies 
(company_key, company_name, subdomain, primary_color, secondary_color, contact_email, plan_type)
VALUES 
('kunde-xyz', 'Kunde XYZ GmbH', 'kunde-xyz', '#FF6B35', '#F7931E', 'admin@kunde-xyz.de', 'pro');

-- 2. Ersten Admin-Benutzer erstellen  
INSERT INTO admin_users 
(company_id, email, password_hash, first_name, last_name, role)
VALUES 
(LAST_INSERT_ROWID(), 'admin@kunde-xyz.de', '$2a$10$...', 'Admin', 'User', 'super_admin');
```

### **Automatisches Setup-Script:**
```javascript
// Neuen Mandanten erstellen
async function createNewTenant(companyData) {
    const db = new MultiTenantDatabase();
    await db.initialize();
    
    // Unternehmen erstellen
    const company = await db.runQuery(`
        INSERT INTO companies 
        (company_key, company_name, subdomain, primary_color, contact_email, plan_type)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [companyData.key, companyData.name, companyData.subdomain, 
        companyData.primaryColor, companyData.contactEmail, companyData.plan]);
    
    // Admin-Benutzer erstellen
    const passwordHash = await bcrypt.hash(companyData.adminPassword, 10);
    await db.runQuery(`
        INSERT INTO admin_users 
        (company_id, email, password_hash, first_name, last_name, role)
        VALUES (?, ?, ?, ?, ?, 'super_admin')
    `, [company.id, companyData.adminEmail, passwordHash, 
        companyData.adminFirstName, companyData.adminLastName]);
        
    return company.id;
}
```

## 🌐 **Domain-Konfiguration**

### **Subdomain-Setup:**
```nginx
# Nginx-Konfiguration für Subdomains
server {
    listen 80;
    server_name *.ticketsystem.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### **Custom Domain:**
```javascript
// Custom Domain für Unternehmen konfigurieren
await db.runQuery(`
    UPDATE companies 
    SET custom_domain = ? 
    WHERE company_key = ?
`, ['support.kunde-xyz.de', 'kunde-xyz']);
```

## 📊 **Verkaufs-Dashboard**

### **SaaS-Metriken:**
- Anzahl aktiver Mandanten
- Tickets pro Mandant
- Umsatz pro Plan
- Churn-Rate
- Feature-Nutzung

### **Automatische Rechnungsstellung:**
```javascript
// Monatliche Abrechnung basierend auf Plan
const billing = {
    'starter': 29,
    'pro': 99, 
    'enterprise': 299
};

// Benutzer-Limits prüfen
async function checkLimits(companyId) {
    const company = await db.getQuery('SELECT * FROM companies WHERE id = ?', [companyId]);
    const userCount = await db.getQuery('SELECT COUNT(*) as count FROM customers WHERE company_id = ?', [companyId]);
    
    if (userCount.count >= company.max_users) {
        throw new Error('Benutzer-Limit erreicht. Upgrade erforderlich.');
    }
}
```

## 🔧 **Entwicklungs-Workflow**

### **Lokale Entwicklung:**
```bash
# Backend (Multi-Tenant)
cd server && npm run multitenant

# Frontend  
python3 -m http.server 8000

# Testen:
# http://localhost:8000 (Login)
# http://localhost:8000/admin/ (Admin-Bereich)
# http://localhost:8000/customer/ (Kunden-Bereich)
```

### **Produktion-Deployment:**
```bash
# 1. Umgebungsvariablen setzen
export JWT_SECRET="your-production-secret"
export PORT=3001

# 2. Datenbank initialisieren
npm run setup

# 3. Server starten
npm run multitenant

# 4. Reverse Proxy (Nginx/Apache) konfigurieren
```

## 🎨 **Branding-Anpassung**

### **Pro Unternehmen:**
```css
/* Automatisch generiert basierend auf Datenbank */
:root {
    --primary: #FF6B35;        /* company.primary_color */
    --secondary: #F7931E;      /* company.secondary_color */
}

.company-logo {
    background-image: url('https://kunde-xyz.de/logo.png');
}

/* Custom CSS pro Unternehmen */
.custom-styling {
    /* company.custom_css wird hier eingefügt */
}
```

### **Logo-Upload:**
```javascript
// Logo-Upload für Unternehmen
async function uploadCompanyLogo(companyId, logoFile) {
    const formData = new FormData();
    formData.append('logo', logoFile);
    
    const response = await fetch(`/api/admin/company/logo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    
    return await response.json();
}
```

## 💰 **Preismodell**

| Feature | Starter (€29) | Pro (€99) | Enterprise (€299) |
|---------|---------------|-----------|-------------------|
| Kunden | 50 | 500 | ∞ |
| Admins | 2 | 10 | ∞ |
| Custom Domain | ❌ | ✅ | ✅ |
| API-Zugang | ❌ | ✅ | ✅ |
| Custom CSS | ❌ | ✅ | ✅ |
| SLA | - | 24h | 4h |
| Support | E-Mail | E-Mail + Chat | Telefon + Priority |

## 🔄 **Migration von Einzelsystem**

Falls bereits ein Single-Tenant-System existiert:

```sql
-- Daten migrieren
INSERT INTO companies (company_key, company_name, subdomain) 
VALUES ('legacy', 'Legacy Company', 'legacy');

-- Benutzer migrieren
INSERT INTO customers (company_id, email, password_hash, first_name, last_name)
SELECT 1, email, password_hash, first_name, last_name 
FROM old_users;

-- Tickets migrieren
INSERT INTO tickets (company_id, customer_id, subject, description, status)
SELECT 1, customer_id, subject, description, status 
FROM old_tickets;
```

Diese Architektur ermöglicht **unbegrenztes Wachstum** und **White-Label-Verkauf** an beliebig viele Unternehmen! 🚀