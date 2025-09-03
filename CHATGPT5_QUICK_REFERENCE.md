# 🤖 ChatGPT-5 Quick Reference
## Sofort-Referenz für 4Ticket Entwicklung

### 🎯 **WICHTIGSTE REGELN**
1. **IMMER** #EC0B7A als Primärfarbe verwenden
2. **IMMER** Glasmorphismus mit `backdrop-filter: blur(20px)`
3. **IMMER** moderne Border-Radius (16px-24px)
4. **IMMER** das Schatten-System verwenden
5. **NIEMALS** inline Styles (außer für dynamische Werte)

---

## 📁 **DATEI-PRIORITÄTEN**

### **🔥 KRITISCHE DATEIEN (ZUERST LESEN)**
1. `shared/css/common.css` - **DESIGN SYSTEM**
2. `PROJECT_OVERVIEW.md` - **PROJEKT KONTEXT**
3. `CHATGPT_CONTEXT.md` - **ARBEITSANWEISUNGEN**

### **📄 HAUPT-DATEIEN**
- `index.html` - Landing Page
- `customer/index.html` - Kunden Portal
- `admin/index.html` - Admin Dashboard

### **🎨 CSS-DATEIEN**
- `shared/css/common.css` - **GLOBALE STYLES**
- `customer/css/customer.css` - Kunden Styles
- `admin/css/admin.css` - Admin Styles

---

## 🎨 **DESIGN-SYSTEM CHEAT SHEET**

### **Farben (AUSWENDIG LERNEN)**
```css
--primary: #EC0B7A;              /* HAUPTFARBE */
--primary-dark: #C70960;         /* Dunkler */
--secondary: #6C5CE7;            /* Lila */
--accent: #00D9FF;               /* Cyan */
--success: #00D4AA;              /* Grün */
--warning: #FDCB6E;              /* Gelb */
--danger: #E84393;               /* Rot */
```

### **Gradienten (COPY-PASTE READY)**
```css
--gradient-primary: linear-gradient(135deg, #EC0B7A 0%, #FF1B8A 100%);
--gradient-hero: linear-gradient(135deg, #EC0B7A 0%, #6C5CE7 50%, #00D9FF 100%);
--gradient-card: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);
```

### **Schatten (COPY-PASTE READY)**
```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.16);
```

---

## 🧩 **STANDARD-KOMPONENTEN (COPY-PASTE)**

### **🔳 Moderne Card**
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

### **🔘 Primary Button**
```css
.btn-primary {
    background: var(--gradient-primary);
    color: white;
    border: 2px solid transparent;
    border-radius: 16px;
    padding: 14px 28px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-md);
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
    filter: brightness(1.05);
}
```

### **📱 Navigation Tab**
```css
.nav-tab {
    background: transparent;
    border: none;
    padding: 12px 24px;
    border-radius: 16px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 15px;
    position: relative;
    overflow: hidden;
}

.nav-tab.active {
    background: var(--gradient-primary);
    color: white;
    box-shadow: var(--shadow-md);
}
```

---

## 📱 **RESPONSIVE BREAKPOINTS**

```css
/* Mobile First - IMMER SO MACHEN */
.component {
    width: 100%;           /* Mobile */
}

@media (min-width: 480px) {
    .component { /* Small Tablet */ }
}

@media (min-width: 768px) {
    .component { /* Tablet */ }
}

@media (min-width: 1024px) {
    .component { /* Desktop */ }
}
```

---

## 🔧 **HÄUFIGE AUFGABEN**

### **✨ Neue Feature hinzufügen**
1. Lies `PROJECT_OVERVIEW.md`
2. Prüfe `shared/css/common.css` für Variablen
3. Verwende bestehende Komponenten-Klassen
4. Teste auf allen Breakpoints
5. Cache-Busting Parameter aktualisieren

### **🐛 CSS-Problem lösen**
1. Prüfe CSS-Variablen in `common.css`
2. Verwende Glasmorphismus-Pattern
3. Nutze das Schatten-System
4. Teste Hover-Animationen
5. Validiere Mobile-Ansicht

### **🎨 Design-Problem**
1. **IMMER** #EC0B7A verwenden
2. **IMMER** Glasmorphismus einbauen
3. **IMMER** moderne Border-Radius
4. **IMMER** Smooth Animations

---

## ⚡ **SCHNELLE FIXES**

### **CSS lädt nicht?**
```html
<!-- Cache-Busting Parameter aktualisieren -->
<!-- Hinweis: legacy style.css nicht mehr aktiv genutzt -->
<!-- <link rel="stylesheet" href="css/style.css?v=2025-freshworks-ec0b7a"> -->
```

### **Glasmorphismus funktioniert nicht?**
```css
.glass-element {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px); /* Safari */
}
```

### **Button sieht alt aus?**
```css
.old-button {
    /* ENTFERNEN */
    background: #007AFF;
    border-radius: 8px;
}

.new-button {
    /* VERWENDEN */
    background: var(--gradient-primary);
    border-radius: 16px;
    box-shadow: var(--shadow-md);
}
```

---

## 🎯 **COMMIT-MESSAGE-FORMAT**

```bash
# Gute Commits
git commit -m "✨ Add glassmorphism to ticket cards"
git commit -m "🎨 Update color scheme to #EC0B7A"
git commit -m "📱 Improve mobile navigation"
git commit -m "🐛 Fix hover animation on buttons"

# Schlechte Commits
git commit -m "fix stuff"
git commit -m "update css"
```

---

## 🚨 **NOTFALL-CHECKLIST**

### **Vor jedem Commit:**
- [ ] CSS-Variablen verwendet?
- [ ] #EC0B7A als Primärfarbe?
- [ ] Glasmorphismus-Effekte?
- [ ] Mobile-Responsivität?
- [ ] Cache-Busting aktualisiert?

### **Bei Problemen:**
1. Lese `CHATGPT_CONTEXT.md`
2. Prüfe `shared/css/common.css`
3. Teste auf Mobile
4. Validiere Design-System
5. Frage nach Hilfe

---

## 📞 **WICHTIGE PFADE**

```bash
# CSS (WICHTIG)
shared/css/common.css        # DESIGN SYSTEM
customer/css/customer.css    # Kunden Styles  
admin/css/admin.css         # Admin Styles

# HTML (HAUPTSEITEN)
index.html                  # Landing Page
customer/index.html         # Kunden Dashboard
admin/index.html           # Admin Dashboard

# DOKUMENTATION
PROJECT_OVERVIEW.md         # Projekt Info
CHATGPT_CONTEXT.md         # Arbeitsanweisungen
DEVELOPMENT_GUIDE.md       # Entwicklung
API_DOCUMENTATION.md       # API Referenz
```

---

## 🎨 **FARB-KOMBINATIONEN (GETESTET)**

```css
/* Primary + White (Buttons) */
background: var(--gradient-primary);
color: white;

/* White + Primary (Cards) */
background: white;
border: 2px solid var(--primary);

/* Glassmorphismus (Modern) */
background: var(--gradient-card);
backdrop-filter: blur(20px);
```

---

## ⚡ **1-SEKUNDEN-REFERENZ**

- **Hauptfarbe:** `#EC0B7A`
- **Glassmorphismus:** `backdrop-filter: blur(20px)`
- **Border-Radius:** `16px-24px`
- **Schatten:** `var(--shadow-md)`
- **Animation:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Cache-Busting:** `?v=2025-freshworks-ec0b7a`

---

<div align="center">

**💡 MERKSATZ:**
"Immer #EC0B7A, immer Glasmorphismus, immer Mobile-first!"

**🚀 Bei Unsicherheit:** Lies `CHATGPT_CONTEXT.md`

</div>