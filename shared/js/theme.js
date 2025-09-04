/* Simple global theme manager: toggles between 'light' and 'dark'.
   - Applies `data-theme` attribute on <html>
   - Adds/removes `dark` class on <html> for Tailwind compatibility
   - Persists choice in localStorage under key 'theme'
*/
(function(){
    var STORAGE_KEY = 'theme';

    function getSystemPreference(){
        try {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } catch (_) {
            return 'light';
        }
    }

    function readStoredTheme(){
        try {
            var v = localStorage.getItem(STORAGE_KEY);
            if (v === 'dark' || v === 'light') return v;
        } catch(_) {}
        return null;
    }

    function applyTheme(theme){
        var html = document.documentElement;
        html.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        try { localStorage.setItem(STORAGE_KEY, theme); } catch(_) {}
        var ev;
        try {
            ev = new CustomEvent('themechange', { detail: { theme: theme } });
        } catch(_) {
            ev = document.createEvent('CustomEvent');
            ev.initCustomEvent('themechange', false, false, { theme: theme });
        }
        window.dispatchEvent(ev);
    }

    function getCurrentTheme(){
        var current = document.documentElement.getAttribute('data-theme');
        if (current === 'dark' || current === 'light') return current;
        var stored = readStoredTheme();
        if (stored) return stored;
        return getSystemPreference();
    }

    function toggle(){
        var next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        return next;
    }

    function init(){
        var initial = readStoredTheme() || getSystemPreference();
        applyTheme(initial);
        // Keep in sync with system preference changes
        try {
            if (window.matchMedia) {
                var mq = window.matchMedia('(prefers-color-scheme: dark)');
                // modern spec
                if (typeof mq.addEventListener === 'function') {
                    mq.addEventListener('change', function(){
                        if (!readStoredTheme()) applyTheme(getSystemPreference());
                    });
                } else if (typeof mq.addListener === 'function') {
                    mq.addListener(function(){
                        if (!readStoredTheme()) applyTheme(getSystemPreference());
                    });
                }
            }
        } catch(_) {}
    }

    // Expose API
    window.Theme = {
        apply: applyTheme,
        toggle: toggle,
        get: getCurrentTheme,
        set: applyTheme,
        init: init
    };

    // Initialize asap
    init();
})();

