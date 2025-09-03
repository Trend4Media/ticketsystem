const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());

const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true
}));

app.use(express.json({ limit: process.env.JSON_LIMIT || '1mb' }));

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_MAX || 300)
});
app.use('/api', apiLimiter);

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Support-Middleware
const requireSupport = (req, res, next) => {
  if (req.user.type !== 'support') {
    return res.status(403).json({ error: 'Support access required' });
  }
  next();
};

// Validierung Helper
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// BENUTZER-ROUTEN (Kunden)

// Benutzer-Registrierung
app.post('/api/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim()
], handleValidationErrors, async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Prüfen ob Benutzer bereits existiert
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Benutzer existiert bereits' });
    }

    const user = await db.createUser(email, password, firstName, lastName);
    
    const token = jwt.sign(
      { id: user.id, email: user.email, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Benutzer erfolgreich erstellt',
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Fehler bei der Registrierung' });
  }
});

// Benutzer-Login
app.post('/api/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Ungültige Anmeldedaten' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Ungültige Anmeldedaten' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Erfolgreich angemeldet',
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Fehler bei der Anmeldung' });
  }
});

// SUPPORT-ROUTEN

// Support-Login
app.post('/api/support/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const supportUser = await db.getSupportUserByEmail(email);
    if (!supportUser) {
      return res.status(400).json({ error: 'Ungültige Anmeldedaten' });
    }

    const isValidPassword = await bcrypt.compare(password, supportUser.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Ungültige Anmeldedaten' });
    }

    const token = jwt.sign(
      { id: supportUser.id, email: supportUser.email, type: 'support', role: supportUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Erfolgreich angemeldet',
      token,
      user: { 
        id: supportUser.id, 
        email: supportUser.email, 
        firstName: supportUser.firstName, 
        lastName: supportUser.lastName,
        role: supportUser.role
      }
    });
  } catch (error) {
    console.error('Support login error:', error);
    res.status(500).json({ error: 'Fehler bei der Anmeldung' });
  }
});

// TICKET-ROUTEN

// Ticket erstellen (nur für Kunden)
app.post('/api/tickets', authenticateToken, [
  body('category').isIn(['hilfe', 'gesperrt', 'gewonnen']),
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim()
], handleValidationErrors, async (req, res) => {
  try {
    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'Nur Kunden können Tickets erstellen' });
    }

    const { category, title, description } = req.body;
    const ticket = await db.createTicket(req.user.id, category, title, description);

    res.status(201).json({
      message: 'Ticket erfolgreich erstellt',
      ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Tickets' });
  }
});

// Alle Tickets abrufen (nur für Support)
app.get('/api/tickets', authenticateToken, requireSupport, async (req, res) => {
  try {
    const tickets = await db.getAllTickets();
    res.json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Tickets' });
  }
});

// Benutzer-Tickets abrufen
app.get('/api/my-tickets', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'user') {
      return res.status(403).json({ error: 'Nur Kunden können ihre Tickets abrufen' });
    }

    const tickets = await db.getUserTickets(req.user.id);
    res.json(tickets);
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Tickets' });
  }
});

// Ticket-Status aktualisieren (nur für Support)
app.put('/api/tickets/:id/status', authenticateToken, requireSupport, [
  body('status').isIn(['offen', 'in_bearbeitung', 'geschlossen']),
  body('assignedTo').optional().isInt()
], handleValidationErrors, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const ticketId = req.params.id;

    await db.updateTicketStatus(ticketId, status, assignedTo);

    res.json({ message: 'Ticket-Status erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Ticket-Status' });
  }
});

// Kommentar hinzufügen
app.post('/api/tickets/:id/comments', authenticateToken, [
  body('comment').notEmpty().trim()
], handleValidationErrors, async (req, res) => {
  try {
    const { comment } = req.body;
    const ticketId = req.params.id;
    const authorType = req.user.type === 'support' ? 'support' : 'user';

    await db.addComment(ticketId, req.user.id, authorType, comment);

    res.status(201).json({ message: 'Kommentar erfolgreich hinzugefügt' });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Fehler beim Hinzufügen des Kommentars' });
  }
});

// Ticket-Kommentare abrufen
app.get('/api/tickets/:id/comments', authenticateToken, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const comments = await db.getTicketComments(ticketId);

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Kommentare' });
  }
});

// Support-Mitarbeiter abrufen (nur für Support)
app.get('/api/support/staff', authenticateToken, requireSupport, async (req, res) => {
  try {
    const staff = await db.getAllSupportStaff();
    res.json(staff);
  } catch (error) {
    console.error('Get support staff error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Support-Mitarbeiter' });
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});