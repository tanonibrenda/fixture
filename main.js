document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================================
       1. ACORDEONES (Fixtures y Grupos) - WCAG 2.1.1
       ===================================================================== */
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const panelId = trigger.getAttribute('aria-controls');
            const panel = document.getElementById(panelId);

            // Evitar errores si el panel no existe en el DOM
            if (panel) {
                trigger.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    panel.removeAttribute('hidden');
                } else {
                    panel.setAttribute('hidden', '');
                }
            }
        });

        // Operabilidad por teclado
        trigger.addEventListener('keydown', (e) => {
            const index = Array.from(accordionTriggers).indexOf(trigger);
            let nextIndex = index;

            if (e.key === 'ArrowDown') {
                nextIndex = (index + 1) % accordionTriggers.length;
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                nextIndex = (index - 1 + accordionTriggers.length) % accordionTriggers.length;
                e.preventDefault();
            } else if (e.key === 'Home') {
                nextIndex = 0;
                e.preventDefault();
            } else if (e.key === 'End') {
                nextIndex = accordionTriggers.length - 1;
                e.preventDefault();
            }

            if (nextIndex !== index) {
                accordionTriggers[nextIndex].focus();
            }
        });
    });

    /* =====================================================================
       2. MENÚ DE NAVEGACIÓN MÓVIL (Menú Desplegable)
       ===================================================================== */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainMenu = document.getElementById('main-menu');

    if (mobileMenuToggle && mainMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mainMenu.classList.toggle('open');
        });
    }

    /* =====================================================================
       3. PANEL DE HERRAMIENTAS DE ACCESIBILIDAD
       ===================================================================== */
    const accMenuToggle = document.getElementById('acc-menu-toggle');
    const accPanel = document.getElementById('acc-panel');
    const accCloseBtn = document.getElementById('accCloseBtn');

    if (accMenuToggle && accPanel) {
        function toggleAccPanel() {
            const isExpanded = accMenuToggle.getAttribute('aria-expanded') === 'true';
            accMenuToggle.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                accPanel.removeAttribute('hidden');
                // Derivar el foco al botón de cerrar para asegurar el flujo del lector
                if(accCloseBtn) accCloseBtn.focus(); 
            } else {
                accPanel.setAttribute('hidden', '');
                // Devolver el foco al disparador principal
                accMenuToggle.focus(); 
            }
        }

        accMenuToggle.addEventListener('click', toggleAccPanel);
        if(accCloseBtn) accCloseBtn.addEventListener('click', toggleAccPanel);
    }

    /* =====================================================================
       4. ZONA HORARIA DINÁMICA (Lista Desplegable) - WCAG 4.1.3
       ===================================================================== */
    const tzSelect = document.getElementById('timezone-select');
    
    // CORRECCIÓN: Se capturan absolutamente todos los tiempos que posean data-utc
    const timeElements = document.querySelectorAll('time[data-utc]');
    const announcer = document.getElementById('tz-announcer');

    if (tzSelect && timeElements.length > 0) {
        function updateTimes(selectedZone, zoneName) {
            timeElements.forEach(timeEl => {
                const utcDateString = timeEl.getAttribute('data-utc');
                if (!utcDateString) return;

                const dateObj = new Date(utcDateString);
                const options = { 
                    timeZone: selectedZone,
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: false 
                };

                try {
                    const formattedTime = new Intl.DateTimeFormat('es-AR', options).format(dateObj);
                    timeEl.textContent = formattedTime;
                    timeEl.setAttribute('datetime', dateObj.toISOString());
                } catch (error) {
                    console.error("Error al convertir la zona horaria:", error);
                }
            });

            // Anuncio para tecnologías de asistencia
            if (announcer && zoneName) {
                announcer.textContent = `Los horarios se han actualizado a la zona horaria de: ${zoneName}.`;
            }
        }

        tzSelect.addEventListener('change', (e) => {
            const selectedZone = e.target.value;
            const zoneName = e.target.options[e.target.selectedIndex].text;
            updateTimes(selectedZone, zoneName);
        });

        // Inicialización silenciosa al renderizar el DOM
        updateTimes(tzSelect.value, null);
    }
});