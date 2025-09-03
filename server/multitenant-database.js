// Multi-Tenant Datenbank für White-Label Ticketsystem
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

class MultiTenantDatabase {
    constructor(dbPath = './database-multitenant.sqlite') {
        this.dbPath = dbPath;
        this.db = null;
    }

    async initialize() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('❌ Datenbankfehler:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Multi-Tenant Datenbank verbunden:', this.dbPath);
                    this.createTables().then(resolve).catch(reject);
                }
            });
        });
    }

    async createTables() {
        const tables = [
            // 1. Unternehmen/Mandanten
            `CREATE TABLE IF NOT EXISTS companies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_key VARCHAR(50) UNIQUE NOT NULL,
                company_name VARCHAR(255) NOT NULL,
                subdomain VARCHAR(50) UNIQUE,
                custom_domain VARCHAR(255),
                
                primary_color VARCHAR(7) DEFAULT '#007AFF',
                secondary_color VARCHAR(7) DEFAULT '#5856D6',
                logo_url VARCHAR(500),
                company_logo TEXT,
                custom_css TEXT,
                
                max_users INTEGER DEFAULT 100,
                max_admin_users INTEGER DEFAULT 10,
                features TEXT DEFAULT '{}',
                
                status VARCHAR(20) DEFAULT 'trial',
                plan_type VARCHAR(20) DEFAULT 'starter',
                billing_email VARCHAR(255),
                
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                trial_ends_at DATETIME,
                
                contact_name VARCHAR(255),
                contact_email VARCHAR(255),
                contact_phone VARCHAR(50)
            )`,

            // 2. Admin-Benutzer (Support-Mitarbeiter)
            `CREATE TABLE IF NOT EXISTS admin_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER NOT NULL,
                
                email VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                display_name VARCHAR(255),
                avatar_url VARCHAR(500),
                
                role VARCHAR(20) DEFAULT 'agent',
                permissions TEXT DEFAULT '{}',
                
                status VARCHAR(20) DEFAULT 'active',
                last_login_at DATETIME,
                email_verified_at DATETIME,
                
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
                UNIQUE (company_id, email)
            )`,

            // 3. Kunden
            `CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER NOT NULL,
                
                email VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                display_name VARCHAR(255),
                phone VARCHAR(50),
                avatar_url VARCHAR(500),
                
                customer_id VARCHAR(50),
                customer_tier VARCHAR(20) DEFAULT 'basic',
                
                status VARCHAR(20) DEFAULT 'active',
                last_login_at DATETIME,
                email_verified_at DATETIME,
                
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
                UNIQUE (company_id, email)
            )`,

            // 4. Tickets
            `CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER NOT NULL,
                ticket_number VARCHAR(50) NOT NULL,
                
                customer_id INTEGER NOT NULL,
                assigned_admin_id INTEGER,
                
                subject VARCHAR(500) NOT NULL,
                description TEXT NOT NULL,
                category VARCHAR(50) NOT NULL,
                priority VARCHAR(20) DEFAULT 'medium',
                
                status VARCHAR(50) DEFAULT 'open',
                resolution TEXT,
                
                tags TEXT DEFAULT '[]',
                custom_fields TEXT DEFAULT '{}',
                
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                first_response_at DATETIME,
                resolved_at DATETIME,
                closed_at DATETIME,
                
                due_date DATETIME,
                sla_breached BOOLEAN DEFAULT FALSE,
                
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
                FOREIGN KEY (assigned_admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
                UNIQUE (company_id, ticket_number)
            )`,

            // 5. Ticket-Nachrichten
            `CREATE TABLE IF NOT EXISTS ticket_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER NOT NULL,
                ticket_id INTEGER NOT NULL,
                
                sender_type VARCHAR(20) NOT NULL,
                sender_id INTEGER NOT NULL,
                sender_name VARCHAR(255) NOT NULL,
                
                message TEXT NOT NULL,
                message_type VARCHAR(50) DEFAULT 'message',
                
                attachments TEXT DEFAULT '[]',
                
                is_internal BOOLEAN DEFAULT FALSE,
                is_edited BOOLEAN DEFAULT FALSE,
                edited_at DATETIME,
                
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
                FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
            )`,

            // 6. Sessions
            `CREATE TABLE IF NOT EXISTS sessions (
                id VARCHAR(255) PRIMARY KEY,
                company_id INTEGER NOT NULL,
                user_type VARCHAR(20) NOT NULL,
                user_id INTEGER NOT NULL,
                
                data TEXT DEFAULT '{}',
                expires_at DATETIME NOT NULL,
                
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
            )`
        ];

        // Erstelle alle Tabellen
        for (const tableSQL of tables) {
            await this.runQuery(tableSQL);
        }

        // Erstelle Indizes
        await this.createIndexes();
        
        // Füge Demo-Daten hinzu
        await this.insertDemoData();

        console.log('✅ Multi-Tenant Datenbank initialisiert');
    }

    async createIndexes() {
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_companies_key ON companies(company_key)',
            'CREATE INDEX IF NOT EXISTS idx_companies_subdomain ON companies(subdomain)',
            'CREATE INDEX IF NOT EXISTS idx_admin_company_email ON admin_users(company_id, email)',
            'CREATE INDEX IF NOT EXISTS idx_customers_company_email ON customers(company_id, email)',
            'CREATE INDEX IF NOT EXISTS idx_tickets_company_status ON tickets(company_id, status)',
            'CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets(customer_id)',
            'CREATE INDEX IF NOT EXISTS idx_messages_ticket ON ticket_messages(ticket_id)'
        ];

        for (const indexSQL of indexes) {
            await this.runQuery(indexSQL);
        }
    }

    async insertDemoData() {
        // Prüfe ob bereits Daten vorhanden
        const existingCompany = await this.getQuery('SELECT id FROM companies LIMIT 1');
        if (existingCompany) {
            console.log('ℹ️ Demo-Daten bereits vorhanden');
            return;
        }

        // Demo-Unternehmen erstellen
        const companies = [
            {
                company_key: 'demo-corp',
                company_name: 'Demo Corporation',
                subdomain: 'demo',
                primary_color: '#007AFF',
                secondary_color: '#5856D6',
                contact_email: 'admin@demo-corp.com'
            },
            {
                company_key: 'trend4media',
                company_name: 'Trend4Media',
                subdomain: 'trend4media',
                primary_color: '#FF6B35',
                secondary_color: '#F7931E',
                contact_email: 'support@trend4media.com'
            }
        ];

        for (const company of companies) {
            await this.runQuery(`
                INSERT INTO companies 
                (company_key, company_name, subdomain, primary_color, secondary_color, contact_email)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [company.company_key, company.company_name, company.subdomain, 
                company.primary_color, company.secondary_color, company.contact_email]);
        }

        // Demo-Admin-Benutzer erstellen
        const adminPassword = await bcrypt.hash('admin123', 10);
        const customerPassword = await bcrypt.hash('demo123', 10);

        await this.runQuery(`
            INSERT INTO admin_users 
            (company_id, email, password_hash, first_name, last_name, role)
            VALUES 
            (1, 'admin@support.com', ?, 'Admin', 'User', 'super_admin'),
            (2, 'support@trend4media.com', ?, 'Trend4Media', 'Support', 'admin')
        `, [adminPassword, adminPassword]);

        // Demo-Kunden erstellen
        await this.runQuery(`
            INSERT INTO customers 
            (company_id, email, password_hash, first_name, last_name, customer_tier)
            VALUES 
            (1, 'kunde@demo.com', ?, 'Demo', 'Kunde', 'basic'),
            (1, 'max@demo.com', ?, 'Max', 'Mustermann', 'premium'),
            (2, 'kunde@trend4media.com', ?, 'Trend4Media', 'Kunde', 'basic')
        `, [customerPassword, customerPassword, customerPassword]);

        console.log('✅ Demo-Daten erstellt');
    }

    async runQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    console.error('❌ SQL Fehler:', err.message);
                    console.error('🔍 Query:', sql);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    async getQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.error('❌ SQL Fehler:', err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async getAllQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('❌ SQL Fehler:', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Mandant anhand Subdomain/Domain finden
    async getCompanyByDomain(domain) {
        const subdomain = domain.split('.')[0];
        
        return await this.getQuery(`
            SELECT * FROM companies 
            WHERE subdomain = ? OR custom_domain = ?
        `, [subdomain, domain]);
    }

    // Benutzer-Authentifizierung
    async authenticateUser(companyId, email, password, userType) {
        const table = userType === 'admin' ? 'admin_users' : 'customers';
        const user = await this.getQuery(`
            SELECT * FROM ${table} 
            WHERE company_id = ? AND email = ? AND status = 'active'
        `, [companyId, email]);

        if (!user) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return null;
        }

        // Login-Zeit aktualisieren
        await this.runQuery(`
            UPDATE ${table} 
            SET last_login_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `, [user.id]);

        // Passwort aus Rückgabe entfernen
        delete user.password_hash;
        return { ...user, type: userType };
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = MultiTenantDatabase;