// 4Ticket - Admin-Bereich JavaScript

// Initialisierung des Admin-Bereichs
document.addEventListener('DOMContentLoaded', function() {
    // Neue Auth: JWT-basierte Prüfung
    try {
        const auth = JSON.parse(localStorage.getItem('auth') || 'null');
        if (!auth || !auth.token || !auth.user || auth.user.type !== 'admin') {
            window.location.replace('../app.html');
            return;
        }
        // Fetch automatisch mit Authorization-Header versehen
        const originalFetch = window.fetch.bind(window);
        window.fetch = (input, init = {}) => {
            init.headers = Object.assign({ 'Authorization': `Bearer ${auth.token}` }, init.headers || {});
            return originalFetch(input, init);
        };
    } catch (_) {
        window.location.replace('../app.html');
        return;
    }
    // Session-Daten prüfen
    const user = (function(){ try { const a = JSON.parse(localStorage.getItem('auth')||'null'); return (a && a.user) ? a.user : null; } catch(_) { return null; } })();
    if (!user) { window.location.replace('../app.html'); return; }
    console.log('✅ Admin authentifiziert:', user.firstName, user.lastName);
    
    // Benutzerinformationen anzeigen
    document.getElementById('admin-name').textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    document.getElementById('admin-avatar').textContent = (user.firstName || 'A').charAt(0);
    
    // Standard-View anzeigen
    showOverview();
});

// Navigation zwischen verschiedenen Views - global verfügbar
window.showView = function(viewId) {
    // Alle Views ausblenden
    const allViews = document.querySelectorAll('.content-view');
    allViews.forEach(view => view.classList.remove('active'));
    
    // Alle Sidebar-Links deaktivieren
    const allLinks = document.querySelectorAll('.sidebar-link');
    allLinks.forEach(link => link.classList.remove('active'));
    
    // Gewählte View anzeigen
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
    }
}

// Übersicht anzeigen - global verfügbar
window.showOverview = function() {
    showView('overview-content');
    setActiveLink('🏠 Übersicht');
}

// Alle Tickets anzeigen - global verfügbar
window.showAllTickets = function() {
    showView('tickets-content');
    setActiveLink('📋 Alle Tickets');
    loadTicketsTable();
}

// Offene Tickets anzeigen - global verfügbar
window.showOpenTickets = function() {
    showView('tickets-content');
    setActiveLink('🔓 Offene Tickets');
    loadTicketsTable('open');
}

// Geschlossene Tickets anzeigen - global verfügbar
window.showClosedTickets = function() {
    showView('tickets-content');
    setActiveLink('✅ Geschlossene Tickets');
    loadTicketsTable('closed');
}

// Statistiken anzeigen - global verfügbar
window.showStatistics = function() {
    showView('statistics-content');
    setActiveLink('📈 Statistiken');
    loadStatistics();
}

// Benutzer anzeigen - global verfügbar
window.showUsers = function() {
    showView('users-content');
    setActiveLink('👤 Benutzer');
    loadUsersTable();
}

// Einstellungen anzeigen - global verfügbar
window.showSettings = function() {
    showView('settings-content');
    setActiveLink('⚙️ Einstellungen');
}

// Ticket-Verwaltung öffnen - global verfügbar
window.openTicketManagement = function() {
    window.location.href = 'ticket-management.html';
}

// Aktiven Sidebar-Link setzen
function setActiveLink(linkText) {
    const allLinks = document.querySelectorAll('.sidebar-link');
    allLinks.forEach(link => {
        if (link.textContent.includes(linkText)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Abrechnung anzeigen - global verfügbar
window.showBilling = async function() {
    showView('billing-content');
    setActiveLink('💳 Abrechnung');
    await loadSubscription();
    await loadInvoices();
}

async function loadSubscription() {
    const box = document.getElementById('subscription-box');
    box.innerHTML = 'Lade Abonnement...';
    try {
        const data = await window.ticketAPI.getSubscription();
        const sub = data.subscription;
        if (!sub) {
            box.innerHTML = '<div class="setting-card">Kein Abonnement konfiguriert.</div>';
            return;
        }
        box.innerHTML = `
            <div class="setting-card">
                <h3>Aktiver Plan: ${sub.plan_type || 'unbekannt'}</h3>
                <p>Status: ${sub.status}</p>
                <p>Zeitraum: ${sub.current_period_start || '-'} → ${sub.current_period_end || '-'}</p>
                <p>Seats (Admin): ${sub.seats_admin} • Seats (Kunden): ${sub.seats_customers}</p>
            </div>
        `;
    } catch (e) {
        box.innerHTML = `<div class="setting-card">Fehler beim Laden des Abos: ${e.message}</div>`;
    }
}

async function loadInvoices() {
    const box = document.getElementById('invoices-box');
    box.innerHTML = 'Lade Rechnungen...';
    try {
        const data = await window.ticketAPI.getInvoices();
        const invoices = data.invoices || [];
        if (!invoices.length) {
            box.innerHTML = '<div class="setting-card">Keine Rechnungen vorhanden.</div>';
            return;
        }
        box.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Rechnungsnr.</th>
                        <th>Betrag</th>
                        <th>Status</th>
                        <th>Datum</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoices.map(inv => `
                        <tr>
                            <td>${inv.invoice_number}</td>
                            <td>${(inv.amount_cents/100).toFixed(2)} ${inv.currency}</td>
                            <td>${inv.status}</td>
                            <td>${new Date(inv.issued_at).toLocaleDateString('de-DE')}</td>
                            <td>
                                ${inv.status !== 'paid' ? `<button class="btn-small btn-primary" onclick="payInvoice(${inv.id}, ${inv.amount_cents})">Bezahlt markieren</button>` : ''}
                                ${inv.pdf_url ? `<a class="btn-small btn-secondary" href="${inv.pdf_url}" target="_blank">PDF</a>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (e) {
        box.innerHTML = `<div class="setting-card">Fehler beim Laden der Rechnungen: ${e.message}</div>`;
    }
}

window.createInvoicePrompt = async function() {
    const amount = prompt('Betrag in EUR (z.B. 29.00):');
    if (!amount) return;
    const cents = Math.round(parseFloat(amount.replace(',', '.')) * 100);
    if (!cents || cents <= 0) return alert('Ungültiger Betrag');
    try {
        await window.ticketAPI.createInvoice(cents);
        await loadInvoices();
        alert('Rechnung erstellt');
    } catch (e) {
        alert('Fehler: ' + e.message);
    }
}

window.payInvoice = async function(id, amountCents) {
    try {
        await window.ticketAPI.payInvoice(id, amountCents);
        await loadInvoices();
        alert('Zahlung verbucht');
    } catch (e) {
        alert('Fehler: ' + e.message);
    }
}

// Demo-Tickets laden
function loadTicketsTable(filter = 'all') {
    const demoTickets = [
        {
            id: 1,
            title: '💡 Hilfe bei der Anmeldung',
            customer: 'Max Mustermann',
            status: 'open',
            priority: 'medium',
            created: 'vor 2 Min',
            category: 'Hilfe'
        },
        {
            id: 2,
            title: '🔒 Account wurde gesperrt',
            customer: 'Anna Schmidt',
            status: 'progress',
            priority: 'high',
            created: 'vor 15 Min',
            category: 'Sperrung'
        },
        {
            id: 3,
            title: '🎉 Gewinn einlösen',
            customer: 'Tom Weber',
            status: 'closed',
            priority: 'low',
            created: 'vor 1 Std',
            category: 'Gewinn'
        },
        {
            id: 4,
            title: '💡 Passwort zurücksetzen',
            customer: 'Lisa Müller',
            status: 'open',
            priority: 'low',
            created: 'vor 2 Std',
            category: 'Hilfe'
        },
        {
            id: 5,
            title: '🔒 Verdächtiger Login',
            customer: 'Peter Klein',
            status: 'progress',
            priority: 'high',
            created: 'vor 3 Std',
            category: 'Sicherheit'
        }
    ];
    
    // Filter anwenden
    let filteredTickets = demoTickets;
    if (filter === 'open') {
        filteredTickets = demoTickets.filter(ticket => ticket.status === 'open');
    } else if (filter === 'closed') {
        filteredTickets = demoTickets.filter(ticket => ticket.status === 'closed');
    }
    
    // Tabelle erstellen
    const ticketsContent = document.getElementById('tickets-content');
    ticketsContent.innerHTML = `
        <div class="content-header">
            <h2>🎫 Ticket-Verwaltung</h2>
            <div class="content-actions">
                <button class="btn btn-secondary" onclick="showOpenTickets()">🔓 Nur Offene</button>
                <button class="btn btn-secondary" onclick="showClosedTickets()">✅ Nur Geschlossene</button>
                <button class="btn btn-primary" onclick="showAllTickets()">📋 Alle anzeigen</button>
            </div>
        </div>
        
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Titel</th>
                    <th>Kunde</th>
                    <th>Status</th>
                    <th>Priorität</th>
                    <th>Erstellt</th>
                    <th>Aktionen</th>
                </tr>
            </thead>
            <tbody>
                ${filteredTickets.map(ticket => `
                    <tr onclick="openTicketDetails(${ticket.id})">
                        <td>#${ticket.id}</td>
                        <td>${ticket.title}</td>
                        <td>${ticket.customer}</td>
                        <td><span class="ticket-status status-${ticket.status}">${getStatusText(ticket.status)}</span></td>
                        <td><span class="priority priority-${ticket.priority}">${getPriorityText(ticket.priority)}</span></td>
                        <td>${ticket.created}</td>
                        <td>
                            <button class="btn-small btn-primary" onclick="event.stopPropagation(); editTicket(${ticket.id})">✏️</button>
                            <button class="btn-small btn-secondary" onclick="event.stopPropagation(); assignTicket(${ticket.id})">👤</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Statistiken laden
function loadStatistics() {
    const statisticsContent = document.getElementById('statistics-content');
    statisticsContent.innerHTML = `
        <div class="content-header">
            <h2>📊 Support-Statistiken</h2>
            <p>Detaillierte Einblicke in Ihre Support-Performance</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">🎫</div>
                <div class="stat-value">127</div>
                <div class="stat-label">Gesamt Tickets</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🔓</div>
                <div class="stat-value">23</div>
                <div class="stat-label">Offene Tickets</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⏱️</div>
                <div class="stat-value">2.4h</div>
                <div class="stat-label">Ø Bearbeitungszeit</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">😊</div>
                <div class="stat-value">94%</div>
                <div class="stat-label">Kundenzufriedenheit</div>
            </div>
        </div>
        
        <div class="chart-container">
            <h3>📈 Ticket-Verlauf der letzten 7 Tage</h3>
            <p style="color: var(--text-secondary); margin-top: 16px;">
                Hier würde in der Vollversion ein interaktives Diagramm angezeigt werden.
            </p>
        </div>
    `;
}

// Benutzer-Tabelle laden
function loadUsersTable() {
    const usersContent = document.getElementById('users-content');
    usersContent.innerHTML = `
        <div class="content-header">
            <h2>👥 Benutzerverwaltung</h2>
            <button class="btn btn-primary">➕ Neuen Benutzer hinzufügen</button>
        </div>
        
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>E-Mail</th>
                    <th>Typ</th>
                    <th>Status</th>
                    <th>Registriert</th>
                    <th>Aktionen</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Max Mustermann</td>
                    <td>max@demo.com</td>
                    <td>Kunde</td>
                    <td><span class="status-active">Aktiv</span></td>
                    <td>15.01.2024</td>
                    <td>
                        <button class="btn-small btn-secondary">✏️</button>
                        <button class="btn-small btn-danger">🗑️</button>
                    </td>
                </tr>
                <tr>
                    <td>Anna Schmidt</td>
                    <td>anna@demo.com</td>
                    <td>Kunde</td>
                    <td><span class="status-active">Aktiv</span></td>
                    <td>12.01.2024</td>
                    <td>
                        <button class="btn-small btn-secondary">✏️</button>
                        <button class="btn-small btn-danger">🗑️</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

// Hilfsfunktionen
function getStatusText(status) {
    switch(status) {
        case 'open': return 'OFFEN';
        case 'progress': return 'BEARBEITUNG';
        case 'closed': return 'GESCHLOSSEN';
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

// Ticket-Aktionen (Demo-Funktionen) - global verfügbar
window.openTicketDetails = function(ticketId) {
    alert(`🎫 Ticket #${ticketId}\n\nHier würden die detaillierten Ticket-Informationen angezeigt:\n\n• Vollständige Beschreibung\n• Kommunikationsverlauf\n• Anhänge\n• Status-Historie\n• Zuweisungen\n\nIn der Vollversion öffnet sich hier ein detailliertes Ticket-Modal.`);
}

window.editTicket = function(ticketId) {
    alert(`✏️ Ticket #${ticketId} bearbeiten\n\nHier können Sie:\n\n• Status ändern\n• Priorität anpassen\n• Ticket zuweisen\n• Kommentare hinzufügen\n• Kategorien ändern\n\nIn der Vollversion öffnet sich hier ein Bearbeitungsformular.`);
}

window.assignTicket = function(ticketId) {
    alert(`👤 Ticket #${ticketId} zuweisen\n\nWählen Sie einen Support-Mitarbeiter:\n\n• Max Weber (verfügbar)\n• Sarah Klein (beschäftigt)\n• Tom Müller (im Urlaub)\n\nIn der Vollversion würde hier eine Zuweisungs-Auswahl erscheinen.`);
}