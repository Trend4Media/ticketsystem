// 4Ticket - Kundenbereich JavaScript

// Initialisierung des Kundenbereichs
document.addEventListener('DOMContentLoaded', function() {
    // Session-Daten prüfen
    const userStr = localStorage.getItem('currentUser');
    console.log('🔍 Gespeicherte Session:', userStr);
    
    if (!userStr) {
        console.log('❌ Keine Session gefunden - Weiterleitung zum Login');
        window.location.href = '../app.html';
        return;
    }
    
    let user;
    try {
        user = JSON.parse(userStr);
        console.log('✅ Session geladen:', user);
    } catch (error) {
        console.error('❌ Fehler beim Parsen der Session:', error);
        localStorage.removeItem('currentUser');
        window.location.href = '../app.html';
        return;
    }
    
    // Prüfe Benutzertyp
    if (user.type !== 'customer') {
        console.log('❌ Falscher Benutzertyp:', user.type, '- Erwartet: customer');
        alert('❌ Zugriff verweigert! Nur Kunden haben Zugang zu diesem Bereich.');
        window.location.href = '../app.html';
        return;
    }
    
    console.log('✅ Kunde authentifiziert:', user.firstName, user.lastName);
    
    // Benutzerinformationen anzeigen
    document.getElementById('customer-name').textContent = `${user.firstName} ${user.lastName}`;
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

// Aktiven Navigation-Tab setzen
function setActiveNavTab(tabId) {
    // Alle Tabs deaktivieren
    const allTabs = document.querySelectorAll('.nav-tab');
    allTabs.forEach(tab => tab.classList.remove('active'));
    
    // Gewählten Tab aktivieren
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// Willkommensbereich anzeigen - global verfügbar
window.showWelcome = function() {
    showView('welcome-content');
    setActiveNavTab('nav-welcome');
}

// Ticket-Erstellung anzeigen - global verfügbar
window.showCreateTicket = function() {
    showView('create-ticket-content');
    setActiveNavTab('nav-create');
    // Formular zurücksetzen
    const form = document.querySelector('.ticket-form');
    if (form) {
        form.reset();
    }
}

// Meine Tickets anzeigen - global verfügbar
window.showMyTickets = function() {
    showView('my-tickets-content');
    setActiveNavTab('nav-tickets');
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
window.submitTicket = async function(event) {
    event.preventDefault();
    
    const category = document.getElementById('ticket-category').value;
    const subject = document.getElementById('ticket-subject').value;
    const description = document.getElementById('ticket-description').value;
    const priority = document.getElementById('ticket-priority').value;
    
    if (!category || !subject || !description) {
        alert('❌ Bitte füllen Sie alle Pflichtfelder aus.');
        return;
    }
    
    try {
        // Ticket über API erstellen
        const response = await window.ticketAPI.createTicket({
            subject,
            description,
            category,
            priority
        });
        
        if (response.success) {
            // Erfolgs-Nachricht
            alert(`✅ Ticket erfolgreich erstellt!\n\nTicket-Nummer: ${response.ticket.ticketNumber}\nKategorie: ${getCategoryText(category)}\nBetreff: ${subject}\n\nSie erhalten eine E-Mail-Bestätigung und können den Status in "Meine Tickets" verfolgen.`);
            
            // Zurück zur Übersicht
            showWelcome();
            
            // Formular zurücksetzen
            document.querySelector('.ticket-form').reset();
        }
    } catch (error) {
        console.error('❌ Ticket-Erstellungsfehler:', error);
        alert(`❌ Fehler beim Erstellen des Tickets: ${error.message}`);
    }
}

// Meine Tickets laden (echte API)
async function loadMyTickets() {
    try {
        const response = await window.ticketAPI.getMyTickets();
        const tickets = response.tickets || [];
        
        const ticketsContainer = document.getElementById('customer-tickets-list');
        
        if (tickets.length === 0) {
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
            ticketsContainer.innerHTML = tickets.map(ticket => `
                <div class="customer-ticket-card" onclick="openTicketDetails(${ticket.id})">
                    <div class="ticket-card-header">
                        <div>
                            <div class="ticket-card-title">${getCategoryIcon(ticket.category)} ${ticket.subject}</div>
                            <div class="ticket-card-id">${ticket.ticket_number}</div>
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
                            Erstellt: ${new Date(ticket.created_at).toLocaleDateString('de-DE')}<br>
                            Aktualisiert: ${new Date(ticket.updated_at).toLocaleDateString('de-DE')}
                        </div>
                        <div class="ticket-card-priority priority-${ticket.priority}">
                            ${getPriorityText(ticket.priority)}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('❌ Fehler beim Laden der Tickets:', error);
        const ticketsContainer = document.getElementById('customer-tickets-list');
        ticketsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <div class="empty-state-title">Fehler beim Laden</div>
                <div class="empty-state-desc">Tickets konnten nicht geladen werden: ${error.message}</div>
                <button class="btn btn-primary" onclick="loadMyTickets()">
                    🔄 Erneut versuchen
                </button>
            </div>
        `;
    }
}

// Ticket-Details anzeigen - global verfügbar
window.openTicketDetails = function(ticketId) {
    // Zur Ticket-Detail-Seite weiterleiten
    window.location.href = `ticket-detail.html?id=${ticketId}`;
}

// Hilfsfunktionen
function getCategoryIcon(category) {
    switch(category) {
        case 'help': return '💡';
        case 'blocked': return '🔒';
        case 'prize': return '🎉';
        default: return '📝';
    }
}

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