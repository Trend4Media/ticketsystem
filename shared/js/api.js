// 4Ticket - API-Client für Multi-Tenant Backend

class TicketAPI {
    constructor() {
        this.baseURL = window.location.origin;
        this.token = localStorage.getItem('authToken');
    }

    // API-Request mit Authentifizierung
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/api${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
                ...options.headers
            },
            ...options
        };

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`❌ API-Fehler (${endpoint}):`, error);
            throw error;
        }
    }

    // Authentifizierung
    async login(email, password, userType) {
        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: { email, password, userType }
            });

            if (response.success) {
                this.token = response.token;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('currentUser', JSON.stringify(response.user));
                return response.user;
            }

            throw new Error(response.error || 'Login fehlgeschlagen');
        } catch (error) {
            throw new Error(`Login-Fehler: ${error.message}`);
        }
    }

    // Logout
    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }

    // Unternehmens-Konfiguration laden
    async getCompanyConfig() {
        try {
            return await this.request('/company/config');
        } catch (error) {
            console.error('❌ Fehler beim Laden der Unternehmens-Konfiguration:', error);
            return null;
        }
    }

    // Ticket erstellen (Kunde)
    async createTicket(ticketData) {
        return await this.request('/tickets', {
            method: 'POST',
            body: ticketData
        });
    }

    // Meine Tickets abrufen (Kunde)
    async getMyTickets() {
        return await this.request('/my-tickets');
    }

    // Alle Tickets abrufen (Admin)
    async getAdminTickets(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        const endpoint = `/admin/tickets${params ? '?' + params : ''}`;
        return await this.request(endpoint);
    }

    // Ticket-Nachrichten abrufen
    async getTicketMessages(ticketId) {
        return await this.request(`/tickets/${ticketId}/messages`);
    }

    // Nachricht zu Ticket hinzufügen
    async addTicketMessage(ticketId, message, isInternal = false) {
        return await this.request(`/tickets/${ticketId}/messages`, {
            method: 'POST',
            body: { message, isInternal }
        });
    }

    // Ticket-Status ändern (Admin)
    async updateTicketStatus(ticketId, status, resolution = null) {
        return await this.request(`/tickets/${ticketId}/status`, {
            method: 'PUT',
            body: { status, resolution }
        });
    }

    // Statistiken abrufen (Admin)
    async getStatistics() {
        return await this.request('/admin/statistics');
    }

    // Benutzer abrufen (Admin)
    async getUsers() {
        return await this.request('/admin/users');
    }
}

// Globale API-Instanz
window.ticketAPI = new TicketAPI();

// Unternehmens-Branding anwenden
async function applyCompanyBranding() {
    try {
        const config = await window.ticketAPI.getCompanyConfig();
        
        if (config && config.success) {
            const company = config.company;
            
            // CSS-Variablen setzen
            document.documentElement.style.setProperty('--primary', company.primaryColor);
            document.documentElement.style.setProperty('--secondary', company.secondaryColor);
            
            // Firmenname in Titel setzen
            const titleElements = document.querySelectorAll('.company-name');
            titleElements.forEach(el => {
                el.textContent = company.name;
            });
            
            // Logo anwenden
            if (company.logoUrl) {
                const logoElements = document.querySelectorAll('.company-logo');
                logoElements.forEach(el => {
                    if (el.tagName === 'IMG') {
                        el.src = company.logoUrl;
                    } else {
                        el.style.backgroundImage = `url('${company.logoUrl}')`;
                    }
                });
            }
            
            // Custom CSS anwenden
            if (company.customCss) {
                const styleElement = document.createElement('style');
                styleElement.textContent = company.customCss;
                document.head.appendChild(styleElement);
            }
        }
    } catch (error) {
        console.error('❌ Fehler beim Anwenden des Brandings:', error);
    }
}

// Benutzer-Session prüfen
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Authentifizierung erforderlich
function requireAuthentication(requiredType = null) {
    const user = getCurrentUser();
    const token = localStorage.getItem('authToken');
    
    if (!user || !token) {
        // Zur Anmeldung weiterleiten
        window.location.href = '../index.html';
        return null;
    }
    
    if (requiredType && user.type !== requiredType) {
        alert('❌ Zugriff verweigert! Sie haben keine Berechtigung für diesen Bereich.');
        window.ticketAPI.logout();
        window.location.href = '../index.html';
        return null;
    }
    
    return user;
}

// Initialisierung beim Seitenaufbau
document.addEventListener('DOMContentLoaded', function() {
    // Branding anwenden
    applyCompanyBranding();
    
    // Fade-In-Animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
});