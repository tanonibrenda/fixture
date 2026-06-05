document.addEventListener('DOMContentLoaded', () => {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const panelId = trigger.getAttribute('aria-controls');
            const panel = document.getElementById(panelId);
            
            // Toggle de estado
            trigger.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', '');
            }
        });

        // Soporte de teclado (Flechas) para navegabilidad AAA
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
});
document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE ZONA HORARIA ACCESIBLE ---
    const tzSelect = document.getElementById('timezone-select');
    const timeElements = document.querySelectorAll('.match-time');
    const announcer = document.getElementById('tz-announcer');

    function updateTimes(selectedZone) {
        timeElements.forEach(timeEl => {
            // Extraer la fecha y hora original en formato UTC (Universal)
            const utcDateString = timeEl.getAttribute('data-utc');
            if (!utcDateString) return;

            const dateObj = new Date(utcDateString);

            // Formatear la hora según la zona horaria elegida utilizando la API Intl
            const options = { 
                hour: '2-digit', 
                minute: '2-digit', 
                timeZone: selectedZone,
                hour12: false // Formato 24hs por claridad internacional
            };

            try {
                const formattedTime = new Intl.DateTimeFormat('es-AR', options).format(dateObj);
                timeEl.textContent = formattedTime;
                
                // Actualizar atributo datetime de HTML5 para mejor semántica
                timeEl.setAttribute('datetime', dateObj.toISOString());
            } catch (error) {
                console.error("Error al convertir zona horaria:", error);
            }
        });

        // WCAG Criterio 4.1.3 (Status Messages): Avisar al lector de pantalla que hubo un cambio
        const selectedText = tzSelect.options[tzSelect.selectedIndex].text;
        announcer.textContent = `Los horarios de los partidos se han actualizado a la zona horaria de: ${selectedText}.`;
    }

    // Escuchar el evento de cambio en el selector
    tzSelect.addEventListener('change', (e) => {
        updateTimes(e.target.value);
    });

    // Ejecutar una vez al cargar la página para sincronizar con la opción "selected" por defecto
    updateTimes(tzSelect.value);
});