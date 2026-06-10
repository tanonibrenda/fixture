document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. ACORDEONES ACCESIBLES
       ============================================================ */
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            const panel = document.getElementById(trigger.getAttribute('aria-controls'));

            trigger.setAttribute('aria-expanded', !expanded);
            expanded ? panel.setAttribute('hidden', '') : panel.removeAttribute('hidden');
        });

        trigger.addEventListener('keydown', e => {
            const idx = [...accordionTriggers].indexOf(trigger);
            let next = idx;

            if (e.key === 'ArrowDown') next = (idx + 1) % accordionTriggers.length;
            if (e.key === 'ArrowUp') next = (idx - 1 + accordionTriggers.length) % accordionTriggers.length;
            if (e.key === 'Home') next = 0;
            if (e.key === 'End') next = accordionTriggers.length - 1;

            if (next !== idx) {
                e.preventDefault();
                accordionTriggers[next].focus();
            }
        });
    });

    /* ============================================================
       2. MENÚ MÓVIL
       ============================================================ */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainMenu = document.getElementById('main-menu');

    if (mobileMenuToggle && mainMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const expanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !expanded);
            mainMenu.classList.toggle('open');
        });
    }

    /* ============================================================
       3. PANEL DE ACCESIBILIDAD
       ============================================================ */
    const accMenuToggle = document.getElementById('acc-menu-toggle');
    const accPanel = document.getElementById('acc-panel');
    const accCloseBtn = document.getElementById('accCloseBtn');

    if (accMenuToggle && accPanel) {
        function toggleAccPanel() {
            const expanded = accMenuToggle.getAttribute('aria-expanded') === 'true';
            accMenuToggle.setAttribute('aria-expanded', !expanded);

            if (!expanded) {
                accPanel.removeAttribute('hidden');
                accCloseBtn?.focus();
            } else {
                accPanel.setAttribute('hidden', '');
                accMenuToggle.focus();
            }
        }

        accMenuToggle.addEventListener('click', toggleAccPanel);
        accCloseBtn?.addEventListener('click', toggleAccPanel);
    }

    /* ============================================================
       4. ZONA HORARIA — CORREGIDO
       ============================================================ */

    const tzSelect = document.querySelector('select#timezone-select'); // ahora solo 1
    const announcer = document.getElementById('tz-announcer');

    if (tzSelect) {

        function updateTimes(timeZone, label) {
            const timeElements = document.querySelectorAll('time[data-utc]');

            timeElements.forEach(timeEl => {
                const utc = timeEl.dataset.utc;
                if (!utc) return;

                const date = new Date(utc);

                try {
                    const formatted = new Intl.DateTimeFormat('es-ES', {
                        timeZone,
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }).format(date);

                    timeEl.textContent = formatted;

                } catch (err) {
                    console.error("Error al convertir horario:", err);
                }
            });

            if (announcer) {
                announcer.textContent = `Los horarios se actualizaron a la zona horaria ${label}.`;
            }
        }

        tzSelect.addEventListener('change', e => {
            const option = e.target.options[e.target.selectedIndex];
            updateTimes(e.target.value, option.textContent.trim());
        });

        // Inicialización
        const initialOption = tzSelect.options[tzSelect.selectedIndex];
        updateTimes(tzSelect.value, initialOption.textContent.trim());
    }
});
