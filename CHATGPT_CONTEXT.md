# ChatGPT-5 Kontext & Arbeitsanweisungen
## 4Ticket Ticketsystem

### 🤖 **Für ChatGPT-5: Wichtige Kontextinformationen**

#### **🎯 Projektverständnis**
Du arbeitest mit einem **modernen Ticketsystem namens 4Ticket**, das in einem **Freshworks-inspirierten Design** mit der **Hauptfarbe #EC0B7A** gestaltet ist. Das System ist **vollständig responsiv** und verwendet **Glasmorphismus-Effekte**.

#### **🎨 Design-System Prioritäten**
1. **IMMER** die Farbe #EC0B7A als Primärfarbe verwenden
2. **IMMER** Glasmorphismus-Effekte mit `backdrop-filter: blur(20px)` einsetzen
3. **IMMER** moderne Border-Radius (16px-24px) verwenden
4. **IMMER** das Schatten-System aus `--shadow-sm` bis `--shadow-xl` nutzen
5. **IMMER** Gradient-Hintergründe für wichtige Elemente einsetzen

#### **📁 Dateistruktur-Regeln**
- **shared/css/common.css** = Globale Styles und CSS-Variablen
- **customer/css/customer.css** = Kunden-spezifische Styles
- **admin/css/admin.css** = Admin-spezifische Styles
- **Cache-Busting** mit `?v=2025-freshworks-ec0b7a` verwenden

### 🛠️ **Entwicklungsrichtlinien für ChatGPT-5**

#### **CSS-Regeln (WICHTIG)**
```css
/* IMMER diese Variablen verwenden: */
--primary: #EC0B7A;
--gradient-primary: linear-gradient(135deg, #EC0B7A 0%, #FF1B8A 100%);
--gradient-card: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);

/* IMMER für Cards verwenden: */
.card-class {
    background: var(--gradient-card);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    border: 2px solid var(--border-light);
    box-shadow: var(--shadow-md);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### **JavaScript-Regeln**
- **ES6+ Syntax** verwenden
- **Async/Await** für asynchrone Operationen
- **Event-Delegation** für bessere Performance
- **Modulare Struktur** beibehalten

#### **HTML-Regeln**
- **Semantische Tags** verwenden
- **ARIA-Labels** für Accessibility
- **Mobile-first** responsive Struktur

### 🎯 **Spezifische Arbeitsanweisungen**

#### **Bei CSS-Änderungen:**
1. **IMMER** zuerst `shared/css/common.css` prüfen
2. **NIEMALS** inline Styles verwenden (außer für dynamische Werte)
3. **IMMER** das bestehende Schatten-System verwenden
4. **IMMER** Transitions mit `cubic-bezier(0.4, 0, 0.2, 1)` verwenden

#### **Bei neuen Komponenten:**
1. **IMMER** Glasmorphismus-Effekte einbauen
2. **IMMER** Hover-Animationen hinzufügen
3. **IMMER** Mobile-Responsivität berücksichtigen
4. **IMMER** das #EC0B7A Farbschema einhalten

#### **Bei Bugfixes:**
1. **ERST** die betroffene Datei vollständig lesen
2. **DANN** das Problem im Kontext verstehen
3. **DANACH** die minimale notwendige Änderung machen
4. **IMMER** das Design-System beibehalten

### 📋 **Häufige Aufgaben & Lösungsansätze**

#### **Neue Feature hinzufügen:**
```markdown
1. Prüfe PROJECT_OVERVIEW.md für Kontext
2. Lese relevante CSS-Dateien
3. Verwende bestehende Komponenten-Klassen
4. Teste auf allen Breakpoints
5. Committe mit aussagekräftiger Nachricht
```

#### **Design-Problem lösen:**
```markdown
1. Prüfe shared/css/common.css für Variablen
2. Verwende das Glasmorphismus-Pattern
3. Nutze das Schatten-System
4. Teste Hover-Animationen
5. Validiere Mobile-Ansicht
```

#### **Performance optimieren:**
```markdown
1. CSS-Animationen über Transform/Opacity
2. Event-Delegation verwenden
3. Lazy Loading implementieren
4. Cache-Busting Parameter aktualisieren
```

### 🎨 **Design-Pattern-Bibliothek**

#### **Standard-Card-Pattern:**
```css
.modern-card {
    background: var(--gradient-card);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    border: 2px solid var(--border-light);
    padding: 32px;
    box-shadow: var(--shadow-md);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary);
}
```

#### **Standard-Button-Pattern:**
```css
.modern-btn {
    background: var(--gradient-primary);
    color: white;
    border: 2px solid transparent;
    border-radius: 16px;
    padding: 14px 28px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-md);
}

.modern-btn:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
}
```

### 🔍 **Debugging-Checkliste**

#### **CSS-Probleme:**
- [ ] CSS-Variablen korrekt verwendet?
- [ ] Cache-Busting Parameter aktuell?
- [ ] Responsive Breakpoints getestet?
- [ ] Glasmorphismus-Effekte funktional?

#### **JavaScript-Probleme:**
- [ ] Event-Listener korrekt registriert?
- [ ] Async/Await richtig verwendet?
- [ ] Error-Handling implementiert?
- [ ] Mobile-Touch-Events berücksichtigt?

#### **Design-Probleme:**
- [ ] #EC0B7A Farbschema eingehalten?
- [ ] Schatten-System verwendet?
- [ ] Hover-Animationen funktional?
- [ ] Mobile-Ansicht optimiert?

### 🚀 **Deployment-Checkliste**

#### **Vor dem Commit:**
- [ ] Alle Änderungen getestet
- [ ] Cache-Busting Parameter aktualisiert
- [ ] Mobile-Responsivität geprüft
- [ ] Design-System eingehalten

#### **Commit-Message-Format:**
```
🎨 [BEREICH]: Kurze Beschreibung

- Detaillierte Änderung 1
- Detaillierte Änderung 2
- Detaillierte Änderung 3

Fixes: #issue-nummer (falls relevant)
```

### 📞 **Notfall-Referenzen**

#### **Wichtigste Dateien:**
1. `shared/css/common.css` - Globale Styles
2. `PROJECT_OVERVIEW.md` - Projektkontext
3. `index.html` - Landing Page
4. `customer/index.html` - Kunden-Portal
5. `admin/index.html` - Admin-Portal

#### **Wichtigste CSS-Klassen:**
- `.btn-primary`, `.btn-secondary` - Buttons
- `.feature-card`, `.pricing-card` - Landing Page Cards
- `.ticket-card`, `.stat-card` - Dashboard Cards
- `.nav-tab`, `.sidebar-link` - Navigation

#### **Wichtigste CSS-Variablen:**
- `--primary: #EC0B7A`
- `--gradient-primary`
- `--gradient-card`
- `--shadow-md`, `--shadow-xl`

---

**💡 MERKSATZ für ChatGPT-5:**
"Immer #EC0B7A, immer Glasmorphismus, immer moderne Animationen, immer Mobile-first!"