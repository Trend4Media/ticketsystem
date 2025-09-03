// 4Ticket - Gemeinsame Authentifizierung für Admin- und Kundenbereich

// Demo-Accounts für die Entwicklung
const demoAccounts = {
    'admin@support.com': {
        password: 'admin123',
        name: 'Admin User',
        firstName: 'Admin',
        type: 'admin',
        role: 'Support-Team'
    },
    'kunde@demo.com': {
        password: 'demo123',
        name: 'Demo Kunde',
        firstName: 'Demo',
        type: 'customer',
        role: 'Kunde'
    }
};

// Aktueller Benutzer
let currentUser = null;

// Login-Funktion (global verfügbar machen)
window.login = function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showMessage('❌ Bitte füllen Sie alle Felder aus.', 'error');
        return;
    }
    
    // Demo-Account prüfen
    const account = demoAccounts[email];
    if (!account || account.password !== password) {
        showMessage('❌ Ungültige Anmeldedaten.', 'error');
        return;
    }
    
    // Erfolgreiche Anmeldung
    currentUser = account;
    showMessage('✅ Anmeldung erfolgreich! Weiterleitung...', 'success');
    
    setTimeout(() => {
        // Session-Daten vorbereiten
        const sessionData = {
            firstName: account.firstName,
            lastName: account.lastName,
            name: account.name,
            email: email,
            type: account.type
        };
        
        console.log('💾 Auth.js - Session-Daten speichern:', sessionData);
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
        
        // Weiterleitung basierend auf Account-Typ
        if (account.type === 'admin') {
            console.log('➡️ Auth.js - Weiterleitung zu Admin-Bereich');
            window.location.href = 'admin/index.html';
        } else {
            console.log('➡️ Auth.js - Weiterleitung zu Kunden-Bereich');
            window.location.href = 'customer/index.html';
        }
    }, 1500);
}

// Logout-Funktion (global verfügbar machen)
window.logout = function() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    
    // Bestimme den korrekten Pfad zur Login-Seite
    const currentPath = window.location.pathname;
    if (currentPath.includes('/admin/') || currentPath.includes('/customer/')) {
        window.location.href = '../app.html';
    } else {
        window.location.href = 'app.html';
    }
}

// Benutzer-Session laden
function loadUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        return currentUser;
    }
    return null;
}

// Benutzer-Session speichern
function saveUserSession(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Nachrichten anzeigen
function showMessage(message, type) {
    // Entferne vorhandene Nachrichten
    const existingMessage = document.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Erstelle neue Nachricht
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    // Füge Nachricht zum Login-Formular hinzu
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.insertBefore(messageDiv, loginForm.firstChild);
    }
    
    // Entferne Nachricht nach 5 Sekunden
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Anmeldedaten automatisch ausfüllen (für Demo) - global verfügbar
window.fillCredentials = function(email, password) {
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
}

// Registrierungsinformationen anzeigen - global verfügbar
window.showRegisterInfo = function() {
    alert('📝 Registrierung\n\nIn der Vollversion können sich neue Kunden hier registrieren.\n\nFür die Demo verwenden Sie bitte einen der Test-Accounts:\n\n🛠️ Admin: admin@support.com / admin123\n👤 Kunde: kunde@demo.com / demo123\n\n💡 Das System erkennt automatisch Ihren Account-Typ!');
}

// Authentifizierung prüfen
function requireAuth(requiredType = null) {
    const user = loadUserSession();
    if (!user) {
        window.location.href = '../index.html';
        return false;
    }
    
    if (requiredType && user.type !== requiredType) {
        alert('❌ Zugriff verweigert! Sie haben keine Berechtigung für diesen Bereich.');
        logout();
        return false;
    }
    
    return user;
}

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    // Eingabe-Animation hinzufügen
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
    
    // Tastatur-Shortcuts
    document.addEventListener('keydown', function(e) {
        // Enter-Taste im Login-Formular
        if (e.key === 'Enter' && document.getElementById('email')) {
            e.preventDefault();
            login();
        }
        
        // Escape-Taste zum Ausloggen
        if (e.key === 'Escape' && currentUser) {
            logout();
        }
    });
});