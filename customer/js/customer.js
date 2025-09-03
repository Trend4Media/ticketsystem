// 4Ticket - Kundenbereich JavaScript

// Initialisierung des Kundenbereichs
document.addEventListener('DOMContentLoaded', function() {
    // Authentifizierung prüfen - nur Kunden erlaubt
    const user = requireAuth('customer');
    if (!user) return;
    
    // Benutzerinformationen anzeigen
    document.getElementById('customer-name').textContent = user.name;
    document.getElementById('customer-avatar').textContent = user.firstName.charAt(0);
    
    // Standard-View anzeigen
    showWelcome();
});

// Navigation zwischen verschiedenen Views - global verfügbar
window.showView = function(viewId) {
    // Alle Views ausblenden
    const allViews = document.querySelectorAll('.content-view');
    allViews.forEach(view => view.classList.remove('active'));
    
    // Gewählte View anzeigen
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
    }
}

// Willkommensbereich anzeigen - global verfügbar
window.showWelcome = function() {
    showView('welcome-content');
}

// Ticket-Erstellung anzeigen - global verfügbar
window.showCreateTicket = function() {
    showView('create-ticket-content');
    // Formular zurücksetzen
    const form = document.querySelector('.ticket-form');
    if (form) {
        form.reset();
    }
}

// Meine Tickets anzeigen - global verfügbar
window.showMyTickets = function() {
    showView('my-tickets-content');
    loadMyTickets();
}

// Ticket mit vorgewählter Kategorie erstellen - global verfügbar
window.createTicketWithCategory = function(category) {
    showCreateTicket();
    
    // Kategorie vorauswählen
    setTimeout(() => {
        const categorySelect = document.getElementById('ticket-category');
        if (categorySelect) {
            categorySelect.value = category;
        }
    }, 100);
}

// Ticket-Formular absenden - global verfügbar
window.submitTicket = function(event) {
    event.preventDefault();
    
    const category = document.getElementById('ticket-category').value;
    const subject = document.getElementById('ticket-subject').value;
    const description = document.getElementById('ticket-description').value;
    const priority = document.getElementById('ticket-priority').value;
    
    if (!category || !subject || !description) {
        alert('❌ Bitte füllen Sie alle Pflichtfelder aus.');
        return;
    }
    
    // Simuliere Ticket-Erstellung
    const ticketId = Math.floor(Math.random() * 1000) + 100;
    
    // Erfolgs-Nachricht
    alert(`✅ Ticket erfolgreich erstellt!\n\nTicket-ID: #${ticketId}\nKategorie: ${getCategoryText(category)}\nBetreff: ${subject}\n\nSie erhalten eine E-Mail-Bestätigung und können den Status in "Meine Tickets" verfolgen.`);
    
    // Zurück zur Übersicht
    showWelcome();
    
    // Formular zurücksetzen
    document.querySelector('.ticket-form').reset();
}

// Meine Tickets laden (Demo-Daten)
function loadMyTickets() {
    const currentUser = loadUserSession();
    const demoTickets = [
        {
            id: 42,
            title: '💡 Hilfe bei der Anmeldung',
            category: 'help',
            status: 'progress',
            priority: 'medium',
            created: '15.01.2024 14:30',
            lastUpdate: 'vor 2 Std',
            description: 'Ich kann mich nicht in meinen Account einloggen. Das Passwort scheint nicht zu funktionieren.'
        },
        {
            id: 38,
            title: '🎉 Gewinn aus Aktion einlösen',
            category: 'prize',
            status: 'closed',
            priority: 'low',
            created: '12.01.2024 09:15',
            lastUpdate: 'vor 3 Tagen',
            description: 'Ich habe bei der letzten Aktion gewonnen und möchte meinen Gewinn einlösen.'
        }
    ];
    
    const ticketsContainer = document.getElementById('customer-tickets-list');
    
    if (demoTickets.length === 0) {
        ticketsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-title">Noch keine Tickets</div>
                <div class="empty-state-desc">Sie haben noch keine Support-Tickets erstellt.</div>
                <button class="btn btn-primary" onclick="showCreateTicket()">
                    ➕ Erstes Ticket erstellen
                </button>
            </div>
        `;
    } else {
        ticketsContainer.innerHTML = demoTickets.map(ticket => `
            <div class="customer-ticket-card" onclick="openTicketDetails(${ticket.id})">
                <div class="ticket-card-header">
                    <div>
                        <div class="ticket-card-title">${ticket.title}</div>
                        <div class="ticket-card-id">Ticket #${ticket.id}</div>
                    </div>
                    <div class="ticket-card-status status-${ticket.status}">
                        ${getStatusText(ticket.status)}
                    </div>
                </div>
                
                <div class="ticket-card-content">
                    ${ticket.description.length > 100 ? ticket.description.substring(0, 100) + '...' : ticket.description}
                </div>
                
                <div class="ticket-card-footer">
                    <div class="ticket-card-date">
                        Erstellt: ${ticket.created}<br>
                        Aktualisiert: ${ticket.lastUpdate}
                    </div>
                    <div class="ticket-card-priority priority-${ticket.priority}">
                        ${getPriorityText(ticket.priority)}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Ticket-Details anzeigen - global verfügbar
window.openTicketDetails = function(ticketId) {
    alert(`🎫 Ticket #${ticketId}\n\nHier würden die detaillierten Ticket-Informationen angezeigt:\n\n• Vollständige Beschreibung\n• Kommunikationsverlauf mit Support\n• Status-Updates\n• Anhänge\n• Lösungsvorschläge\n\nIn der Vollversion öffnet sich hier eine detaillierte Ticket-Ansicht.`);
}

// Hilfsfunktionen
function getCategoryText(category) {
    switch(category) {
        case 'help': return '💡 Ich benötige Hilfe';
        case 'blocked': return '🔒 Ich wurde gesperrt';
        case 'prize': return '🎉 Ich habe etwas gewonnen';
        default: return category;
    }
}

function getStatusText(status) {
    switch(status) {
        case 'open': return 'OFFEN';
        case 'progress': return 'IN BEARBEITUNG';
        case 'closed': return 'GESCHLOSSEN';
        case 'waiting': return 'WARTET AUF ANTWORT';
        default: return status.toUpperCase();
    }
}

function getPriorityText(priority) {
    switch(priority) {
        case 'low': return 'NIEDRIG';
        case 'medium': return 'MITTEL';
        case 'high': return 'HOCH';
        default: return priority.toUpperCase();
    }
}

// Demo-Funktionen für Entwicklung
function showCreateTicketDemo() {
    alert('🎫 Ticket erstellen\n\nHier können Sie ein neues Support-Ticket erstellen.\n\nVerfügbare Kategorien:\n💡 Ich benötige Hilfe\n🔒 Ich wurde gesperrt\n🎉 Ich habe etwas gewonnen\n\nIn der Vollversion würde hier ein Formular erscheinen.');
}

function showMyTicketsDemo() {
    alert('📋 Meine Tickets\n\nHier sehen Sie alle Ihre eingereichten Tickets:\n\n• Status-Verfolgung in Echtzeit\n• Kommunikation mit Support-Team\n• Ticket-Historie\n• Anhänge und Dokumente\n\nIn der Vollversion würde hier eine Liste Ihrer Tickets erscheinen.');
}