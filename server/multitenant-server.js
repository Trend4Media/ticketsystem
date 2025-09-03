// Multi-Tenant Express Server für White-Label Ticketsystem
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const MultiTenantDatabase = require('./multitenant-database');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(helmet());
app.use(compression());

const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true
}));

app.use(express.json({ limit: process.env.JSON_LIMIT || '2mb' }));

const apiLimiter = rateLimit({
    windowMs: Number(process.env.RATE_WINDOW_MS || 15 * 60 * 1000),
    max: Number(process.env.RATE_MAX || 600)
});
app.use('/api', apiLimiter);
app.use(express.static(path.join(__dirname, '../')));

// Uploads Verzeichnis sicher bereitstellen
const UPLOADS_ROOT = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_ROOT)) {
    fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_ROOT));

// Datenbank initialisieren
const db = new MultiTenantDatabase();

// Middleware: Mandant ermitteln
async function getTenant(req, res, next) {
    try {
        const host = req.headers.host;
        const subdomain = host.split('.')[0];
        
        // Für lokale Entwicklung: Standard-Mandant verwenden
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            req.company = await db.getQuery('SELECT * FROM companies WHERE company_key = ?', ['demo-corp']);
        } else {
            req.company = await db.getCompanyByDomain(host);
        }
        
        if (!req.company) {
            return res.status(404).json({ 
                error: 'Unternehmen nicht gefunden',
                message: 'Für diese Domain ist kein Ticketsystem konfiguriert.'
            });
        }
        
        next();
    } catch (error) {
        console.error('❌ Mandanten-Fehler:', error);
        res.status(500).json({ error: 'Server-Fehler beim Ermitteln des Mandanten' });
    }
}

// Middleware: JWT-Token validieren
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Zugriff verweigert - Token fehlt' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Ungültiger Token' });
        }
        req.user = user;
        next();
    });
}

// Multer Konfiguration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const companyKey = (req.company && req.company.company_key) ? req.company.company_key : 'unknown';
            const now = new Date();
            const year = String(now.getFullYear());
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const dir = path.join(UPLOADS_ROOT, companyKey, year, month);
            fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        } catch (err) {
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const safeOriginal = (file.originalname || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${uniqueSuffix}-${safeOriginal}`);
    }
});

const allowedMimes = new Set([
    'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
    'video/mp4', 'video/quicktime', 'video/webm',
    'application/pdf'
]);

function getTypeLimitBytes(mime) {
    if (mime.startsWith('image/')) return 10 * 1024 * 1024; // 10MB
    if (mime.startsWith('video/')) return 100 * 1024 * 1024; // 100MB
    if (mime === 'application/pdf') return 20 * 1024 * 1024; // 20MB
    return 0;
}

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // harte Obergrenze 100MB
    fileFilter: (req, file, cb) => {
        if (!allowedMimes.has(file.mimetype)) {
            return cb(new Error('Ungültiger Dateityp'));
        }
        cb(null, true);
    }
});

// API-Routen

// Brand-Admin Login (nur 4Ticket Mitarbeiter)
app.post('/api/brand/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ error: 'E-Mail und Passwort erforderlich' });
        }
        const admin = await db.getQuery('SELECT * FROM brand_admins WHERE email = ? AND status = "active"', [email]);
        if (!admin) return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
        const ok = await bcrypt.compare(password, admin.password_hash);
        if (!ok) return res.status(401).json({ error: 'Ungültige Anmeldedaten' });

        await db.runQuery('UPDATE brand_admins SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [admin.id]);
        const token = jwt.sign({ brandAdminId: admin.id, scope: 'brand' }, JWT_SECRET, { expiresIn: '12h' });
        res.json({ success: true, token, user: { id: admin.id, email: admin.email, firstName: admin.first_name, lastName: admin.last_name, type: 'brand' } });
    } catch (e) {
        console.error('❌ Brand-Login-Fehler:', e);
        res.status(500).json({ error: 'Server-Fehler' });
    }
});

function requireBrand(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token fehlt' });
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err || payload.scope !== 'brand') return res.status(403).json({ error: 'Verboten' });
        req.brandAdminId = payload.brandAdminId;
        next();
    });
}

// Brand-Admin: Unternehmen auflisten
app.get('/api/brand/companies', requireBrand, async (req, res) => {
    try {
        const companies = await db.getAllQuery('SELECT id, company_key, company_name, subdomain, status, plan_type, created_at FROM companies ORDER BY created_at DESC');
        res.json({ success: true, companies });
    } catch (e) {
        console.error('❌ Brand Companies Fehler:', e);
        res.status(500).json({ error: 'Server-Fehler' });
    }
});

// Brand-Admin: Accounts (Admin/Kunden) eines Unternehmens
app.get('/api/brand/companies/:id/users', requireBrand, async (req, res) => {
    try {
        const companyId = req.params.id;
        const admins = await db.getAllQuery('SELECT id, email, first_name, last_name, role, status, created_at FROM admin_users WHERE company_id = ?', [companyId]);
        const customers = await db.getAllQuery('SELECT id, email, first_name, last_name, status, created_at FROM customers WHERE company_id = ?', [companyId]);
        res.json({ success: true, admins, customers });
    } catch (e) {
        console.error('❌ Brand Users Fehler:', e);
        res.status(500).json({ error: 'Server-Fehler' });
    }
});

// 🔐 Authentifizierung
app.post('/api/auth/login', getTenant, async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        
        if (!email || !password || !userType) {
            return res.status(400).json({ 
                error: 'E-Mail, Passwort und Benutzertyp sind erforderlich' 
            });
        }

        const user = await db.authenticateUser(req.company.id, email, password, userType);
        
        if (!user) {
            return res.status(401).json({ 
                error: 'Ungültige Anmeldedaten',
                message: 'E-Mail oder Passwort ist falsch'
            });
        }

        // JWT-Token erstellen
        const token = jwt.sign({
            userId: user.id,
            companyId: req.company.id,
            userType: userType,
            email: user.email
        }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            success: true,
            token: token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                type: userType,
                company: {
                    id: req.company.id,
                    name: req.company.company_name,
                    primaryColor: req.company.primary_color,
                    secondaryColor: req.company.secondary_color
                }
            }
        });

    } catch (error) {
        console.error('❌ Login-Fehler:', error);
        res.status(500).json({ error: 'Server-Fehler bei der Anmeldung' });
    }
});

// 🎫 Tickets

// Ticket erstellen (Kunden) mit optionalen Anhängen
app.post('/api/tickets', getTenant, authenticateToken, upload.array('files', 10), async (req, res) => {
    try {
        if (req.user.userType !== 'customer') {
            return res.status(403).json({ error: 'Nur Kunden können Tickets erstellen' });
        }

        const { subject, description, category, priority = 'medium' } = req.body;
        
        if (!subject || !description || !category) {
            return res.status(400).json({ 
                error: 'Betreff, Beschreibung und Kategorie sind erforderlich' 
            });
        }

        // Ticket-Nummer generieren
        const year = new Date().getFullYear();
        const count = await db.getQuery(`
            SELECT COUNT(*) as count FROM tickets 
            WHERE company_id = ? AND created_at >= ?
        `, [req.company.id, `${year}-01-01`]);

        const ticketNumber = `TK-${year}-${String(count.count + 1).padStart(6, '0')}`;

        // Ticket erstellen
        const result = await db.runQuery(`
            INSERT INTO tickets 
            (company_id, customer_id, ticket_number, subject, description, category, priority)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [req.company.id, req.user.userId, ticketNumber, subject, description, category, priority]);

        // Erste Nachricht hinzufügen (Ticket-Beschreibung)
        const messageInsert = await db.runQuery(`
            INSERT INTO ticket_messages 
            (company_id, ticket_id, sender_type, sender_id, sender_name, message)
            VALUES (?, ?, 'customer', ?, ?, ?)
        `, [req.company.id, result.id, req.user.userId, 
            `${req.user.firstName || 'Kunde'} ${req.user.lastName || ''}`.trim(), 
            description]);

        // Dateien verarbeiten (optional)
        let attachmentsMeta = [];
        if (Array.isArray(req.files) && req.files.length > 0) {
            for (const file of req.files) {
                const limit = getTypeLimitBytes(file.mimetype);
                if (!allowedMimes.has(file.mimetype) || file.size > limit) {
                    try { fs.unlinkSync(file.path); } catch (e) {}
                    return res.status(413).json({ error: 'Datei zu groß oder ungültiger Typ' });
                }

                const relative = path.relative(UPLOADS_ROOT, file.path).split(path.sep).join('/');
                const publicPath = `/uploads/${relative}`;
                const att = await db.runQuery(`
                    INSERT INTO attachments 
                    (company_id, ticket_id, message_id, uploader_type, uploader_id, storage_path, mime_type, file_size, original_name)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [req.company.id, result.id, messageInsert.id, 'customer', req.user.userId, publicPath, file.mimetype, file.size, file.originalname]);

                attachmentsMeta.push({ id: att.id, mime: file.mimetype, name: file.originalname, size: file.size, url: publicPath });
            }

            // Ticket Message um Metadaten ergänzen
            await db.runQuery(`
                UPDATE ticket_messages SET attachments = ? WHERE id = ? AND company_id = ?
            `, [JSON.stringify(attachmentsMeta), messageInsert.id, req.company.id]);
        }

        res.json({
            success: true,
            ticket: {
                id: result.id,
                ticketNumber: ticketNumber,
                subject: subject,
                status: 'open'
            }
        });

    } catch (error) {
        console.error('❌ Ticket-Erstellungsfehler:', error);
        res.status(500).json({ error: 'Server-Fehler beim Erstellen des Tickets' });
    }
});

// Kunden-Tickets abrufen
app.get('/api/my-tickets', getTenant, authenticateToken, async (req, res) => {
    try {
        if (req.user.userType !== 'customer') {
            return res.status(403).json({ error: 'Nur für Kunden verfügbar' });
        }

        const tickets = await db.getAllQuery(`
            SELECT t.*, 
                   (SELECT COUNT(*) FROM ticket_messages tm 
                    WHERE tm.ticket_id = t.id AND tm.sender_type = 'admin' 
                    AND tm.created_at > COALESCE(t.last_customer_read, '1970-01-01')) as unread_admin_messages
            FROM tickets t
            WHERE t.company_id = ? AND t.customer_id = ?
            ORDER BY t.created_at DESC
        `, [req.company.id, req.user.userId]);

        res.json({ success: true, tickets: tickets });

    } catch (error) {
        console.error('❌ Fehler beim Abrufen der Kunden-Tickets:', error);
        res.status(500).json({ error: 'Server-Fehler beim Abrufen der Tickets' });
    }
});

// Alle Tickets für Admin abrufen
app.get('/api/admin/tickets', getTenant, authenticateToken, async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Nur für Admins verfügbar' });
        }

        const { status, assigned_to } = req.query;
        const filters = {};
        if (status) filters.status = status;
        if (assigned_to) filters.assigned_admin_id = assigned_to;

        const tickets = await db.getAllQuery(`
            SELECT t.*, 
                   c.first_name as customer_first_name,
                   c.last_name as customer_last_name,
                   c.email as customer_email,
                   a.first_name as admin_first_name,
                   a.last_name as admin_last_name
            FROM tickets t
            LEFT JOIN customers c ON t.customer_id = c.id
            LEFT JOIN admin_users a ON t.assigned_admin_id = a.id
            WHERE t.company_id = ?
            ${status ? 'AND t.status = ?' : ''}
            ORDER BY t.created_at DESC
        `, status ? [req.company.id, status] : [req.company.id]);

        res.json({ success: true, tickets: tickets });

    } catch (error) {
        console.error('❌ Fehler beim Abrufen der Admin-Tickets:', error);
        res.status(500).json({ error: 'Server-Fehler beim Abrufen der Tickets' });
    }
});

// Ticket-Nachrichten abrufen inkl. Anhängen
app.get('/api/tickets/:ticketId/messages', getTenant, authenticateToken, async (req, res) => {
    try {
        const { ticketId } = req.params;

        // Prüfe Ticket-Zugehörigkeit
        const ticket = await db.getQuery(`
            SELECT * FROM tickets 
            WHERE id = ? AND company_id = ?
        `, [ticketId, req.company.id]);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket nicht gefunden' });
        }

        // Prüfe Berechtigung
        if (req.user.userType === 'customer' && ticket.customer_id !== req.user.userId) {
            return res.status(403).json({ error: 'Zugriff verweigert' });
        }

        const messages = await db.getAllQuery(`
            SELECT * FROM ticket_messages 
            WHERE company_id = ? AND ticket_id = ?
            ${req.user.userType === 'customer' ? 'AND is_internal = FALSE' : ''}
            ORDER BY created_at ASC
        `, [req.company.id, ticketId]);

        const atts = await db.getAllQuery(`
            SELECT * FROM attachments WHERE company_id = ? AND ticket_id = ? AND message_id IS NOT NULL
            ORDER BY created_at ASC
        `, [req.company.id, ticketId]);
        const byMessage = new Map();
        for (const a of atts) {
            const list = byMessage.get(a.message_id) || [];
            list.push({ id: a.id, mime: a.mime_type, name: a.original_name, size: a.file_size, url: a.storage_path });
            byMessage.set(a.message_id, list);
        }

        const enriched = messages.map(m => {
            let parsed = [];
            try { parsed = m.attachments ? JSON.parse(m.attachments) : []; } catch (_) { parsed = []; }
            const fromTable = byMessage.get(m.id) || [];
            const merged = parsed.length ? parsed : fromTable;
            return { ...m, attachments: merged };
        });

        res.json({ success: true, messages: enriched });

    } catch (error) {
        console.error('❌ Fehler beim Abrufen der Nachrichten:', error);
        res.status(500).json({ error: 'Server-Fehler beim Abrufen der Nachrichten' });
    }
});

// Nachricht zu Ticket hinzufügen (mit optionalen Anhängen)
app.post('/api/tickets/:ticketId/messages', getTenant, authenticateToken, upload.array('files', 10), async (req, res) => {
    try {
        const { ticketId } = req.params;
        let { message, isInternal = false } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Nachricht darf nicht leer sein' });
        }

        // Prüfe Ticket-Zugehörigkeit
        const ticket = await db.getQuery(`
            SELECT * FROM tickets 
            WHERE id = ? AND company_id = ?
        `, [ticketId, req.company.id]);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket nicht gefunden' });
        }

        // Prüfe Berechtigung
        if (req.user.userType === 'customer' && ticket.customer_id !== req.user.userId) {
            return res.status(403).json({ error: 'Zugriff verweigert' });
        }

        // Kunden können keine internen Nachrichten erstellen
        if (req.user.userType === 'customer') {
            isInternal = false;
        } else {
            isInternal = Boolean(isInternal);
        }

        // Sender-Name ermitteln
        const table = req.user.userType === 'admin' ? 'admin_users' : 'customers';
        const sender = await db.getQuery(`
            SELECT first_name, last_name FROM ${table} 
            WHERE id = ? AND company_id = ?
        `, [req.user.userId, req.company.id]);

        const senderName = `${sender.first_name} ${sender.last_name}`;

        // Nachricht hinzufügen
        const result = await db.runQuery(`
            INSERT INTO ticket_messages 
            (company_id, ticket_id, sender_type, sender_id, sender_name, message, is_internal)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [req.company.id, ticketId, req.user.userType, req.user.userId, senderName, message.trim(), isInternal]);

        // Dateien verarbeiten
        let attachmentsMeta = [];
        if (Array.isArray(req.files) && req.files.length > 0) {
            for (const file of req.files) {
                const limit = getTypeLimitBytes(file.mimetype);
                if (!allowedMimes.has(file.mimetype) || file.size > limit) {
                    try { fs.unlinkSync(file.path); } catch (e) {}
                    return res.status(413).json({ error: 'Datei zu groß oder ungültiger Typ' });
                }
                const relative = path.relative(UPLOADS_ROOT, file.path).split(path.sep).join('/');
                const publicPath = `/uploads/${relative}`;
                const att = await db.runQuery(`
                    INSERT INTO attachments 
                    (company_id, ticket_id, message_id, uploader_type, uploader_id, storage_path, mime_type, file_size, original_name)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [req.company.id, ticketId, result.id, req.user.userType, req.user.userId, publicPath, file.mimetype, file.size, file.originalname]);
                attachmentsMeta.push({ id: att.id, mime: file.mimetype, name: file.originalname, size: file.size, url: publicPath });
            }
            await db.runQuery(`
                UPDATE ticket_messages SET attachments = ? WHERE id = ? AND company_id = ?
            `, [JSON.stringify(attachmentsMeta), result.id, req.company.id]);
        }

        // Ticket als aktualisiert markieren
        await db.runQuery(`
            UPDATE tickets 
            SET updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND company_id = ?
        `, [ticketId, req.company.id]);

        res.json({
            success: true,
            message: {
                id: result.id,
                senderName: senderName,
                message: message.trim(),
                attachments: attachmentsMeta,
                createdAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Fehler beim Hinzufügen der Nachricht:', error);
        res.status(500).json({ error: 'Server-Fehler beim Hinzufügen der Nachricht' });
    }
});

// Watcher hinzufügen (Admin)
app.post('/api/tickets/:ticketId/watchers', getTenant, authenticateToken, async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Nur Admins können Watcher verwalten' });
        }
        const { ticketId } = req.params;
        const { adminUserId } = req.body;
        if (!adminUserId) {
            return res.status(400).json({ error: 'adminUserId ist erforderlich' });
        }
        // Prüfen Ticket
        const ticket = await db.getQuery(`SELECT id FROM tickets WHERE id = ? AND company_id = ?`, [ticketId, req.company.id]);
        if (!ticket) return res.status(404).json({ error: 'Ticket nicht gefunden' });

        await db.runQuery(`
            INSERT OR IGNORE INTO ticket_watchers (company_id, ticket_id, admin_user_id)
            VALUES (?, ?, ?)
        `, [req.company.id, ticketId, adminUserId]);

        res.json({ success: true, message: 'Watcher hinzugefügt' });
    } catch (error) {
        console.error('❌ Fehler beim Hinzufügen des Watchers:', error);
        res.status(500).json({ error: 'Server-Fehler beim Hinzufügen des Watchers' });
    }
});

// Watcher entfernen (Admin)
app.delete('/api/tickets/:ticketId/watchers/:adminUserId', getTenant, authenticateToken, async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Nur Admins können Watcher verwalten' });
        }
        const { ticketId, adminUserId } = req.params;
        await db.runQuery(`
            DELETE FROM ticket_watchers WHERE company_id = ? AND ticket_id = ? AND admin_user_id = ?
        `, [req.company.id, ticketId, adminUserId]);
        res.json({ success: true, message: 'Watcher entfernt' });
    } catch (error) {
        console.error('❌ Fehler beim Entfernen des Watchers:', error);
        res.status(500).json({ error: 'Server-Fehler beim Entfernen des Watchers' });
    }
});

// Subscription anzeigen (Admin)
app.get('/api/admin/subscription', getTenant, authenticateToken, async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Nur für Admins verfügbar' });
        }
        const sub = await db.getQuery(`SELECT * FROM subscriptions WHERE company_id = ?`, [req.company.id]);
        res.json({ success: true, subscription: sub || null });
    } catch (error) {
        console.error('❌ Fehler beim Abrufen des Abos:', error);
        res.status(500).json({ error: 'Server-Fehler beim Abrufen des Abos' });
    }
});

// Rechnungen auflisten (Admin)
app.get('/api/admin/invoices', getTenant, authenticateToken, async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Nur für Admins verfügbar' });
        }
        const invoices = await db.getAllQuery(`SELECT * FROM invoices WHERE company_id = ? ORDER BY issued_at DESC`, [req.company.id]);
        res.json({ success: true, invoices });
    } catch (error) {
        console.error('❌ Fehler beim Abrufen der Rechnungen:', error);
        res.status(500).json({ error: 'Server-Fehler beim Abrufen der Rechnungen' });
    }
});

// Rechnung erstellen (Admin)
app.post('/api/admin/invoices', getTenant, authenticateToken, async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Nur für Admins verfügbar' });
        }
        const { amountCents, currency = 'EUR', pdfUrl = null } = req.body;
        if (!amountCents || amountCents <= 0) return res.status(400).json({ error: 'amountCents erforderlich' });

        const year = String(new Date().getFullYear());
        const countRow = await db.getQuery(`
            SELECT COUNT(*) as count FROM invoices WHERE company_id = ? AND strftime('%Y', issued_at) = ?
        `, [req.company.id, year]);
        const number = String((countRow?.count || 0) + 1).padStart(6, '0');
        const invoiceNumber = `INV-${year}-${number}`;

        const inv = await db.runQuery(`
            INSERT INTO invoices (company_id, invoice_number, amount_cents, currency, status, pdf_url)
            VALUES (?, ?, ?, ?, 'open', ?)
        `, [req.company.id, invoiceNumber, amountCents, currency, pdfUrl]);

        res.status(201).json({ success: true, invoice: { id: inv.id, invoice_number: invoiceNumber } });
    } catch (error) {
        console.error('❌ Fehler beim Erstellen der Rechnung:', error);
        res.status(500).json({ error: 'Server-Fehler beim Erstellen der Rechnung' });
    }
});

// Zahlung verbuchen und Rechnung als bezahlt markieren (Admin)
app.post('/api/admin/invoices/:id/payments', getTenant, authenticateToken, async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Nur für Admins verfügbar' });
        }
        const { id } = req.params;
        const { amountCents, currency = 'EUR', provider = 'manual', providerId = null } = req.body;
        if (!amountCents || amountCents <= 0) return res.status(400).json({ error: 'amountCents erforderlich' });

        const invoice = await db.getQuery(`SELECT * FROM invoices WHERE id = ? AND company_id = ?`, [id, req.company.id]);
        if (!invoice) return res.status(404).json({ error: 'Rechnung nicht gefunden' });

        const pay = await db.runQuery(`
            INSERT INTO payments (company_id, invoice_id, provider, provider_id, amount_cents, currency, status)
            VALUES (?, ?, ?, ?, ?, ?, 'succeeded')
        `, [req.company.id, id, provider, providerId, amountCents, currency]);

        await db.runQuery(`
            UPDATE invoices SET status = 'paid', paid_at = CURRENT_TIMESTAMP WHERE id = ? AND company_id = ?
        `, [id, req.company.id]);

        res.json({ success: true, payment: { id: pay.id } });
    } catch (error) {
        console.error('❌ Fehler beim Verbuchen der Zahlung:', error);
        res.status(500).json({ error: 'Server-Fehler beim Verbuchen der Zahlung' });
    }
});

// Ticket-Status ändern (nur Admin)
app.put('/api/tickets/:ticketId/status', getTenant, authenticateToken, async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Nur Admins können Ticket-Status ändern' });
        }

        const { ticketId } = req.params;
        const { status, resolution } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status ist erforderlich' });
        }

        const validStatuses = ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Ungültiger Status' });
        }

        // Ticket prüfen
        const ticket = await db.getQuery(`
            SELECT * FROM tickets 
            WHERE id = ? AND company_id = ?
        `, [ticketId, req.company.id]);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket nicht gefunden' });
        }

        // Status aktualisieren
        await db.runQuery(`
            UPDATE tickets 
            SET status = ?, resolution = ?, updated_at = CURRENT_TIMESTAMP
            ${status === 'resolved' ? ', resolved_at = CURRENT_TIMESTAMP' : ''}
            ${status === 'closed' ? ', closed_at = CURRENT_TIMESTAMP' : ''}
            WHERE id = ? AND company_id = ?
        `, [status, resolution || null, ticketId, req.company.id]);

        // Admin-Name ermitteln
        const admin = await db.getQuery(`
            SELECT first_name, last_name FROM admin_users 
            WHERE id = ? AND company_id = ?
        `, [req.user.userId, req.company.id]);

        const adminName = `${admin.first_name} ${admin.last_name}`;

        // Historie-Eintrag
        await db.runQuery(`
            INSERT INTO ticket_history 
            (company_id, ticket_id, changed_by_type, changed_by_id, changed_by_name, field_name, old_value, new_value)
            VALUES (?, ?, 'admin', ?, ?, 'status', ?, ?)
        `, [req.company.id, ticketId, req.user.userId, adminName, ticket.status, status]);

        res.json({ 
            success: true, 
            message: 'Ticket-Status erfolgreich aktualisiert',
            newStatus: status
        });

    } catch (error) {
        console.error('❌ Fehler beim Aktualisieren des Ticket-Status:', error);
        res.status(500).json({ error: 'Server-Fehler beim Aktualisieren des Status' });
    }
});

// 📊 Statistiken (nur Admin)
app.get('/api/admin/statistics', getTenant, authenticateToken, async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Nur für Admins verfügbar' });
        }

        const stats = await db.getAllQuery(`
            SELECT 
                COUNT(*) as total_tickets,
                COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tickets,
                COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets,
                COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets,
                AVG(CASE WHEN resolved_at IS NOT NULL 
                    THEN (julianday(resolved_at) - julianday(created_at)) * 24 
                    END) as avg_resolution_hours
            FROM tickets 
            WHERE company_id = ?
        `, [req.company.id]);

        const customerCount = await db.getQuery(`
            SELECT COUNT(*) as count FROM customers 
            WHERE company_id = ? AND status = 'active'
        `, [req.company.id]);

        res.json({
            success: true,
            statistics: {
                ...stats[0],
                active_customers: customerCount.count,
                avg_resolution_hours: Math.round((stats[0].avg_resolution_hours || 0) * 10) / 10
            }
        });

    } catch (error) {
        console.error('❌ Fehler beim Abrufen der Statistiken:', error);
        res.status(500).json({ error: 'Server-Fehler beim Abrufen der Statistiken' });
    }
});

// 🏢 Unternehmens-Konfiguration abrufen
app.get('/api/company/config', getTenant, async (req, res) => {
    try {
        res.json({
            success: true,
            company: {
                name: req.company.company_name,
                primaryColor: req.company.primary_color,
                secondaryColor: req.company.secondary_color,
                logoUrl: req.company.logo_url,
                customCss: req.company.custom_css
            }
        });
    } catch (error) {
        console.error('❌ Fehler beim Abrufen der Unternehmens-Konfiguration:', error);
        res.status(500).json({ error: 'Server-Fehler' });
    }
});

// 👥 Benutzer-Verwaltung (nur Admin)
app.get('/api/admin/users', getTenant, authenticateToken, async (req, res) => {
    try {
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Nur für Admins verfügbar' });
        }

        const customers = await db.getAllQuery(`
            SELECT id, email, first_name, last_name, customer_tier, status, created_at, last_login_at
            FROM customers 
            WHERE company_id = ?
            ORDER BY created_at DESC
        `, [req.company.id]);

        const admins = await db.getAllQuery(`
            SELECT id, email, first_name, last_name, role, status, created_at, last_login_at
            FROM admin_users 
            WHERE company_id = ?
            ORDER BY created_at DESC
        `, [req.company.id]);

        res.json({
            success: true,
            customers: customers,
            admins: admins
        });

    } catch (error) {
        console.error('❌ Fehler beim Abrufen der Benutzer:', error);
        res.status(500).json({ error: 'Server-Fehler beim Abrufen der Benutzer' });
    }
});

// Server starten
async function startServer() {
    try {
        await db.initialize();
        
        app.listen(PORT, () => {
            console.log(`🚀 Multi-Tenant Ticketsystem Server läuft auf Port ${PORT}`);
            console.log(`📊 Admin-Panel: http://localhost:${PORT}/admin/`);
            console.log(`👤 Kunden-Portal: http://localhost:${PORT}/customer/`);
            console.log(`🔗 API-Dokumentation: http://localhost:${PORT}/api/`);
        });
    } catch (error) {
        console.error('❌ Server-Start-Fehler:', error);
        process.exit(1);
    }
}

// Graceful Shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Server wird beendet...');
    db.close();
    process.exit(0);
});

startServer();

module.exports = app;