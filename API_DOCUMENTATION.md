# 4Ticket API Documentation
## REST API Dokumentation für das Ticketsystem

### 🌐 **Base URL**
```
Production:  https://4ticket-backend.herokuapp.com/api
Development: http://localhost:3000/api
```

### 🔐 **Authentifizierung**

#### **JWT Token System**
```javascript
// Header für authentifizierte Requests
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

#### **Demo-Accounts**
```javascript
// Admin Account
{
  "email": "admin@support.com",
  "password": "admin123",
  "role": "admin"
}

// Customer Account
{
  "email": "kunde@demo.com", 
  "password": "demo123",
  "role": "customer"
}
```

### 🔑 **Authentication Endpoints**

#### **POST /auth/login**
Benutzer-Anmeldung

**Request:**
```json
{
  "email": "admin@support.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@support.com",
    "name": "Admin User",
    "role": "admin",
    "company_id": 1
  }
}
```

#### **POST /auth/register**
Neue Benutzer-Registrierung

**Request:**
```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "password": "password123",
  "company_name": "Beispiel GmbH"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user_id": 123
}
```

#### **POST /auth/logout**
Benutzer-Abmeldung

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 🎫 **Ticket Endpoints**

#### **GET /tickets**
Alle Tickets abrufen (mit Filterung)

**Query Parameters:**
```javascript
?status=open          // Filter nach Status
?priority=high        // Filter nach Priorität
?assigned_to=123      // Filter nach zugewiesenem User
?customer_id=456      // Filter nach Kunde
?limit=20             // Anzahl Ergebnisse
?offset=0             // Pagination
?search=problem       // Textsuche
```

**Response:**
```json
{
  "success": true,
  "tickets": [
    {
      "id": 1,
      "title": "Login-Problem",
      "description": "Kann mich nicht einloggen...",
      "status": "open",
      "priority": "medium",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T11:45:00Z",
      "customer": {
        "id": 123,
        "name": "Max Mustermann",
        "email": "max@example.com"
      },
      "assigned_to": {
        "id": 456,
        "name": "Support Agent",
        "email": "agent@support.com"
      },
      "comments_count": 3,
      "attachments_count": 1
    }
  ],
  "total": 150,
  "page": 1,
  "per_page": 20
}
```

#### **GET /tickets/:id**
Einzelnes Ticket mit Details

**Response:**
```json
{
  "success": true,
  "ticket": {
    "id": 1,
    "title": "Login-Problem",
    "description": "Detaillierte Beschreibung des Problems...",
    "status": "in_progress",
    "priority": "high",
    "category": "technical",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T14:20:00Z",
    "customer": {
      "id": 123,
      "name": "Max Mustermann",
      "email": "max@example.com",
      "phone": "+49 123 456789"
    },
    "assigned_to": {
      "id": 456,
      "name": "Support Agent",
      "email": "agent@support.com"
    },
    "comments": [
      {
        "id": 1,
        "content": "Vielen Dank für Ihre Anfrage...",
        "author": {
          "id": 456,
          "name": "Support Agent",
          "role": "admin"
        },
        "created_at": "2024-01-15T11:00:00Z",
        "is_internal": false
      }
    ],
    "attachments": [
      {
        "id": 1,
        "filename": "screenshot.png",
        "url": "/uploads/screenshot.png",
        "size": 1024000,
        "mime_type": "image/png"
      }
    ]
  }
}
```

#### **POST /tickets**
Neues Ticket erstellen

**Request:**
```json
{
  "title": "Neues Problem",
  "description": "Detaillierte Problembeschreibung...",
  "priority": "medium",
  "category": "technical",
  "customer_email": "kunde@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "ticket": {
    "id": 789,
    "title": "Neues Problem",
    "status": "open",
    "created_at": "2024-01-15T15:30:00Z"
  }
}
```

#### **PUT /tickets/:id**
Ticket aktualisieren

**Request:**
```json
{
  "status": "resolved",
  "assigned_to": 456,
  "priority": "low",
  "internal_note": "Problem gelöst durch..."
}
```

#### **DELETE /tickets/:id**
Ticket löschen (nur Admin)

**Response:**
```json
{
  "success": true,
  "message": "Ticket deleted successfully"
}
```

### 💬 **Comment Endpoints**

#### **POST /tickets/:id/comments**
Kommentar zu Ticket hinzufügen

**Request:**
```json
{
  "content": "Das Problem wurde behoben...",
  "is_internal": false
}
```

**Response:**
```json
{
  "success": true,
  "comment": {
    "id": 123,
    "content": "Das Problem wurde behoben...",
    "author": {
      "id": 456,
      "name": "Support Agent"
    },
    "created_at": "2024-01-15T16:00:00Z"
  }
}
```

#### **PUT /comments/:id**
Kommentar bearbeiten

#### **DELETE /comments/:id**
Kommentar löschen

### 👥 **User Endpoints**

#### **GET /users**
Alle Benutzer abrufen (nur Admin)

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@support.com",
      "role": "admin",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-15T09:00:00Z"
    }
  ]
}
```

#### **GET /users/profile**
Eigenes Profil abrufen

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 123,
    "name": "Max Mustermann",
    "email": "max@example.com",
    "role": "customer",
    "company": {
      "id": 1,
      "name": "Beispiel GmbH"
    },
    "preferences": {
      "language": "de",
      "notifications": true
    }
  }
}
```

#### **PUT /users/profile**
Profil aktualisieren

**Request:**
```json
{
  "name": "Max Mustermann",
  "phone": "+49 123 456789",
  "preferences": {
    "language": "de",
    "notifications": false
  }
}
```

### 🏢 **Company Endpoints**

#### **GET /companies**
Alle Unternehmen (nur Super-Admin)

#### **GET /companies/:id**
Unternehmen-Details

#### **PUT /companies/:id**
Unternehmen aktualisieren

### 📊 **Statistics Endpoints**

#### **GET /stats/dashboard**
Dashboard-Statistiken

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_tickets": 1250,
    "open_tickets": 45,
    "in_progress_tickets": 23,
    "resolved_tickets": 1182,
    "avg_response_time": "2.5 hours",
    "customer_satisfaction": 4.7,
    "monthly_tickets": [
      {"month": "Jan", "count": 120},
      {"month": "Feb", "count": 98},
      {"month": "Mar", "count": 145}
    ],
    "tickets_by_priority": {
      "low": 850,
      "medium": 300,
      "high": 80,
      "urgent": 20
    },
    "tickets_by_category": {
      "technical": 600,
      "billing": 200,
      "general": 450
    }
  }
}
```

#### **GET /stats/reports**
Detaillierte Berichte

**Query Parameters:**
```javascript
?start_date=2024-01-01    // Startdatum
?end_date=2024-01-31      // Enddatum
?type=monthly             // Report-Typ
?format=json              // json|csv|pdf
```

### 📎 **File Upload Endpoints**

#### **POST /uploads**
Datei hochladen

**Request (multipart/form-data):**
```javascript
FormData {
  file: [File],
  ticket_id: 123,
  description: "Screenshot des Problems"
}
```

**Response:**
```json
{
  "success": true,
  "file": {
    "id": 456,
    "filename": "screenshot.png",
    "url": "/uploads/screenshot.png",
    "size": 1024000,
    "mime_type": "image/png"
  }
}
```

### ⚙️ **Settings Endpoints**

#### **GET /settings**
System-Einstellungen abrufen

**Response:**
```json
{
  "success": true,
  "settings": {
    "company_name": "4Ticket Support",
    "support_email": "support@4ticket.com",
    "business_hours": {
      "monday": "09:00-17:00",
      "tuesday": "09:00-17:00",
      "friday": "09:00-15:00"
    },
    "auto_assign": true,
    "email_notifications": true,
    "theme": {
      "primary_color": "#EC0B7A",
      "logo_url": "/uploads/logo.png"
    }
  }
}
```

#### **PUT /settings**
Einstellungen aktualisieren (nur Admin)

### 🔔 **Notification Endpoints**

#### **GET /notifications**
Benachrichtigungen abrufen

#### **PUT /notifications/:id/read**
Benachrichtigung als gelesen markieren

#### **POST /notifications/subscribe**
Push-Benachrichtigungen abonnieren

### ❌ **Error Responses**

#### **Standard Error Format**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Email is required",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

#### **HTTP Status Codes**
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

#### **Error Codes**
```javascript
VALIDATION_ERROR     // Eingabedaten ungültig
AUTHENTICATION_ERROR // Login fehlgeschlagen
AUTHORIZATION_ERROR  // Keine Berechtigung
NOT_FOUND           // Ressource nicht gefunden
DUPLICATE_ENTRY     // Daten bereits vorhanden
SERVER_ERROR        // Interner Serverfehler
```

### 🔄 **Pagination**

#### **Standard Pagination**
```javascript
// Request
GET /tickets?page=2&per_page=20

// Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 2,
    "per_page": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": true
  }
}
```

### 🔍 **Search & Filtering**

#### **Advanced Search**
```javascript
// Complex Query
GET /tickets?search=login&status=open,in_progress&priority=high&sort=created_at:desc

// Response includes search metadata
{
  "success": true,
  "tickets": [...],
  "search": {
    "query": "login",
    "filters": {
      "status": ["open", "in_progress"],
      "priority": ["high"]
    },
    "sort": "created_at:desc",
    "total_matches": 23
  }
}
```

### 📡 **WebSocket Events**

#### **Real-time Updates**
```javascript
// Connect to WebSocket
const socket = io('ws://localhost:3000');

// Listen for ticket updates
socket.on('ticket:updated', (data) => {
  console.log('Ticket updated:', data);
});

// Listen for new comments
socket.on('comment:added', (data) => {
  console.log('New comment:', data);
});

// Join ticket room for updates
socket.emit('join:ticket', { ticket_id: 123 });
```

### 🧪 **Testing**

#### **API Testing mit cURL**
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@support.com","password":"admin123"}'

# Get Tickets (mit Token)
curl -X GET http://localhost:3000/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create Ticket
curl -X POST http://localhost:3000/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Ticket","description":"Test Description"}'
```

#### **JavaScript Fetch Examples**
```javascript
// Login Function
async function login(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
    return data.user;
  }
  throw new Error(data.error.message);
}

// Authenticated Request
async function fetchTickets() {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/tickets', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  
  return await response.json();
}
```

### 📋 **Rate Limiting**

#### **Limits**
- **Authentication:** 5 requests/minute
- **General API:** 100 requests/minute
- **File Upload:** 10 requests/minute

#### **Headers**
```javascript
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

**🚀 API Version:** 1.0  
**🔄 Last Updated:** 2024-01-15  
**📧 Support:** api-support@4ticket.com