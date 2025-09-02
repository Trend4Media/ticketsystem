const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

class Database {
  constructor() {
    this.db = new sqlite3.Database('./database.sqlite');
    this.init();
  }

  init() {
    // Benutzer-Tabelle (Kunden)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Support-Mitarbeiter-Tabelle
    this.db.run(`
      CREATE TABLE IF NOT EXISTS support_staff (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        role TEXT DEFAULT 'support',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tickets-Tabelle
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('hilfe', 'gesperrt', 'gewonnen')),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'offen' CHECK (status IN ('offen', 'in_bearbeitung', 'geschlossen')),
        priority TEXT DEFAULT 'normal' CHECK (priority IN ('niedrig', 'normal', 'hoch', 'kritisch')),
        assigned_to INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (assigned_to) REFERENCES support_staff (id)
      )
    `);

    // Ticket-Kommentare-Tabelle
    this.db.run(`
      CREATE TABLE IF NOT EXISTS ticket_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id INTEGER NOT NULL,
        author_id INTEGER NOT NULL,
        author_type TEXT NOT NULL CHECK (author_type IN ('user', 'support')),
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES tickets (id)
      )
    `);

    // Standard Support-Mitarbeiter erstellen
    this.createDefaultSupportUser();
  }

  async createDefaultSupportUser() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    this.db.run(`
      INSERT OR IGNORE INTO support_staff (email, password, firstName, lastName, role)
      VALUES (?, ?, ?, ?, ?)
    `, ['admin@support.com', hashedPassword, 'Admin', 'Support', 'admin']);
  }

  // Benutzer-Methoden
  createUser(email, password, firstName, lastName) {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        this.db.run(
          'INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)',
          [email, hashedPassword, firstName, lastName],
          function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, email, firstName, lastName });
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  // Support-Mitarbeiter-Methoden
  getSupportUserByEmail(email) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM support_staff WHERE email = ?',
        [email],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  // Ticket-Methoden
  createTicket(userId, category, title, description) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO tickets (user_id, category, title, description) VALUES (?, ?, ?, ?)',
        [userId, category, title, description],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, userId, category, title, description, status: 'offen' });
        }
      );
    });
  }

  getAllTickets() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT t.*, u.firstName as userFirstName, u.lastName as userLastName, u.email as userEmail,
               s.firstName as assignedFirstName, s.lastName as assignedLastName
        FROM tickets t
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN support_staff s ON t.assigned_to = s.id
        ORDER BY t.created_at DESC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getUserTickets(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  updateTicketStatus(ticketId, status, assignedTo = null) {
    return new Promise((resolve, reject) => {
      let query = 'UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP';
      let params = [status];
      
      if (assignedTo !== null) {
        query += ', assigned_to = ?';
        params.push(assignedTo);
      }
      
      query += ' WHERE id = ?';
      params.push(ticketId);

      this.db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }

  // Kommentar-Methoden
  addComment(ticketId, authorId, authorType, comment) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO ticket_comments (ticket_id, author_id, author_type, comment) VALUES (?, ?, ?, ?)',
        [ticketId, authorId, authorType, comment],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
  }

  getTicketComments(ticketId) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT tc.*, 
               CASE 
                 WHEN tc.author_type = 'user' THEN u.firstName || ' ' || u.lastName
                 WHEN tc.author_type = 'support' THEN s.firstName || ' ' || s.lastName
               END as authorName
        FROM ticket_comments tc
        LEFT JOIN users u ON tc.author_id = u.id AND tc.author_type = 'user'
        LEFT JOIN support_staff s ON tc.author_id = s.id AND tc.author_type = 'support'
        WHERE tc.ticket_id = ?
        ORDER BY tc.created_at ASC
      `, [ticketId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getAllSupportStaff() {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT id, email, firstName, lastName, role FROM support_staff',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = new Database();