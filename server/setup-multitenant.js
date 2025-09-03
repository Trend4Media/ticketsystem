#!/usr/bin/env node

// Setup-Script für Multi-Tenant Datenbank
const MultiTenantDatabase = require('./multitenant-database');

async function setupDatabase() {
    console.log('🚀 Initialisiere Multi-Tenant Datenbank...');
    
    const db = new MultiTenantDatabase('./database-multitenant.sqlite');
    
    try {
        await db.initialize();
        console.log('✅ Datenbank erfolgreich initialisiert!');
        console.log('');
        console.log('📊 Demo-Unternehmen erstellt:');
        console.log('   1. Demo Corporation (subdomain: demo)');
        console.log('   2. Trend4Media (subdomain: trend4media)');
        console.log('');
        console.log('👥 Demo-Accounts:');
        console.log('   🛠️  Admin: admin@support.com / admin123');
        console.log('   👤 Kunde: kunde@demo.com / demo123');
        console.log('');
        console.log('🚀 Starte Server mit: npm run multitenant');
        
    } catch (error) {
        console.error('❌ Fehler bei der Datenbank-Initialisierung:', error);
    } finally {
        db.close();
    }
}

setupDatabase();