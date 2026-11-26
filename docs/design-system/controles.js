(() => {
    const element = (name, text, attributes = {}) => {
        const node = document.createElement(name);
        node.textContent = text;
        Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
        return node;
    };

    const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let nextControl = 0;

    function enhanceSelect(select) {
        const wrap = element('div', '', { class: 'minka-select' });
        const field = element('div', '', { class: 'minka-select-input' });
        const popup = element('div', '', { class: 'minka-select-popup', hidden: '' });
        const id = select.id || `demo-select-${++nextControl}`;
        const originalLabel = select.labels[0];
        const label = originalLabel
            ? Array.from(originalLabel.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent).join('').trim()
            : 'Elige una opción';
        const search = element('input', '', { type: 'text', role: 'combobox', 'aria-label': label, 'aria-expanded': 'false', 'aria-autocomplete': 'list', autocomplete: 'off', id });
        const toggle = element('button', '', { type: 'button', 'aria-label': 'Mostrar opciones', tabindex: '-1' });
        const list = element('ul', '', { id: `${id}-options`, role: 'listbox', 'aria-label': label });
        let active = -1;

        const sync = () => { search.value = select.selectedOptions[0]?.textContent ?? ''; };
        const close = () => {
            popup.hidden = true;
            search.setAttribute('aria-expanded', 'false');
            search.removeAttribute('aria-controls');
            search.removeAttribute('aria-activedescendant');
            sync();
        };
        const choose = (option) => {
            select.value = option.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            search.focus();
            close();
        };
        const refresh = () => {
            active = -1;
            search.removeAttribute('aria-activedescendant');
            const options = Array.from(select.options).filter((option) => !option.disabled && normalize(option.textContent).includes(normalize(search.value)));
            list.replaceChildren(...options.map((option, index) => {
                const item = element('li', option.textContent, { id: `${id}-option-${index}`, role: 'option', 'aria-selected': String(option.selected) });
                item.addEventListener('mousedown', (event) => event.preventDefault());
                item.addEventListener('click', () => choose(option));
                return item;
            }));
            popup.querySelector('p').hidden = Boolean(options.length);
        };
        const open = () => {
            if (!popup.hidden) return;
            popup.hidden = false;
            search.value = '';
            search.setAttribute('aria-expanded', 'true');
            search.setAttribute('aria-controls', list.id);
            refresh();
        };
        toggle.append(element('span', '', { class: 'minka-chevron', 'aria-hidden': 'true' }));
        toggle.addEventListener('mousedown', (event) => event.preventDefault());
        toggle.addEventListener('click', () => {
            search.focus();
            if (popup.hidden) open();
            else close();
        });
        search.addEventListener('click', open);
        search.addEventListener('input', () => {
            const value = search.value;
            open();
            search.value = value;
            refresh();
        });
        search.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !popup.hidden) {
                event.stopPropagation();
                close();
            }
            if (event.key === 'Enter' && !popup.hidden) {
                event.preventDefault();
                (list.children[active] ?? (list.children.length === 1 ? list.firstElementChild : null))?.click();
            }
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                open();
                const options = list.children;
                if (!options.length) return;
                list.children[active]?.classList.remove('minka-select-active');
                const direction = event.key === 'ArrowDown' ? 1 : -1;
                active = active < 0 ? (direction > 0 ? 0 : options.length - 1) : (active + direction + options.length) % options.length;
                options[active].classList.add('minka-select-active');
                options[active].scrollIntoView({ block: 'nearest' });
                search.setAttribute('aria-activedescendant', options[active].id);
            }
        });
        wrap.addEventListener('focusout', (event) => {
            if (!wrap.contains(event.relatedTarget)) close();
        });
        select.addEventListener('change', sync);
        select.form?.addEventListener('reset', () => requestAnimationFrame(close));
        field.append(search, toggle);
        popup.append(list, element('p', 'Sin resultados.', { role: 'status', hidden: '' }));
        wrap.append(field, popup);
        select.hidden = true;
        select.setAttribute('aria-hidden', 'true');
        if (originalLabel?.contains(select)) {
            originalLabel.before(wrap);
            wrap.prepend(originalLabel);
            originalLabel.htmlFor = id;
        } else {
            select.before(wrap);
        }
        if (select.id) select.id = `${id}-valor`;
        sync();
    }

    const pad = (value) => String(value).padStart(2, '0');
    const local = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' });
    const monthText = new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const dateText = new Intl.DateTimeFormat('es-PE', { dateStyle: 'full', timeZone: 'UTC' });
    const today = () => ['year', 'month', 'day'].map((key) => local.formatToParts(new Date()).find(({ type }) => key === type).value).join('-');
    const button = (text, handler, label = text) => {
        const control = element('button', text, { type: 'button', 'aria-label': label });
        control.addEventListener('click', handler);
        return control;
    };

    function renderCalendar(dialog, value, choose) {
        const day = /^\d{4}-(0[1-9]|1[0-2])-\d{2}$/.test(value) ? value : today();
        const month = new Date(`${day.slice(0, 7)}-01T00:00:00Z`);
        const calendar = element('div', '', { class: 'minka-calendar' });
        const bar = element('div', '', { class: 'minka-calendar-toolbar' });
        const title = element('strong', '', { 'aria-live': 'polite' });
        const grid = element('div', '', { class: 'minka-week' });
        const draw = () => {
            title.textContent = monthText.format(month);
            const start = (month.getUTCDay() + 6) % 7;
            const days = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
            grid.replaceChildren(...['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((dayName) => element('span', dayName, { 'aria-hidden': 'true' })));
            for (let index = 0; index < start; index += 1) grid.append(element('span', '', { 'aria-hidden': 'true' }));
            for (let number = 1; number <= days; number += 1) {
                const date = new Date(month);
                date.setUTCDate(number);
                const iso = date.toISOString().slice(0, 10);
                const entry = button(String(number), () => choose(iso), dateText.format(date));
                entry.setAttribute('aria-pressed', String(iso === value));
                if (iso === today()) entry.setAttribute('aria-current', 'date');
                grid.append(entry);
            }
        };
        const move = (amount) => { month.setUTCMonth(month.getUTCMonth() + amount); draw(); };
        bar.append(button('‹', () => move(-1), 'Mes anterior'), title, button('›', () => move(1), 'Mes siguiente'));
        const shortcut = button('Hoy', () => choose(today()));
        shortcut.className = 'minka-picker-action';
        calendar.append(bar, grid, shortcut);
        dialog.append(calendar);
        draw();
    }

    function renderClock(dialog, value, choose) {
        const initial = /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : '07:00';
        const selected = initial.split(':');
        const clock = element('div', '', { class: 'minka-clock' });
        const output = element('output', initial, { 'aria-live': 'polite' });
        const control = (label, limit, index) => {
            const group = element('div', '', { class: 'minka-time-group', role: 'group', 'aria-label': label });
            const options = element('div', '', { class: 'minka-time-options' });
            for (let number = 0; number < limit; number += 1) {
                const item = pad(number);
                const select = button(item, () => {
                    options.querySelector('[aria-pressed="true"]').setAttribute('aria-pressed', 'false');
                    selected[index] = item;
                    select.setAttribute('aria-pressed', 'true');
                    output.textContent = selected.join(':');
                });
                select.setAttribute('aria-pressed', String(item === selected[index]));
                options.append(select);
            }
            group.append(element('strong', label), options);
            return group;
        };
        const apply = button('Aplicar hora', () => choose(selected.join(':')));
        apply.className = 'minka-picker-action';
        clock.append(output, control('Hora', 24, 0), control('Minutos', 60, 1), apply);
        dialog.append(clock);
    }

    function enhanceSchedule(input) {
        const label = input.closest('label');
        if (!label) return;
        const labelText = label.textContent.trim();
        const date = input.type === 'date';
        input.type = 'text';
        input.maxLength = date ? 10 : 5;
        input.placeholder = date ? 'AAAA-MM-DD' : 'HH:mm';
        input.pattern = date ? '[0-9]{4}-[0-9]{2}-[0-9]{2}' : '[0-9]{2}:[0-9]{2}';
        const wrap = element('div', '', { class: 'minka-schedule-field' });
        const trigger = button('', () => {
            const id = `minka-picker-${++nextControl}`;
            const dialog = element('dialog', '', { class: 'minka-picker-dialog', 'aria-labelledby': id });
            const heading = element('div', '', { class: 'minka-picker-heading' });
            heading.append(element('h3', labelText, { id }), button('×', () => dialog.close(), 'Cerrar selector'));
            dialog.append(heading);
            const choose = (value) => {
                input.value = value;
                input.dispatchEvent(new Event('change', { bubbles: true }));
                dialog.close();
            };
            if (date) renderCalendar(dialog, input.value, choose);
            else renderClock(dialog, input.value, choose);
            if (!input.required && input.value) {
                const clear = button('Limpiar', () => choose(''));
                clear.className = 'minka-picker-clear';
                dialog.append(clear);
            }
            dialog.addEventListener('close', () => dialog.remove(), { once: true });
            document.body.append(dialog);
            dialog.showModal();
        }, `Elegir · ${labelText}`);
        trigger.className = 'minka-picker-trigger';
        trigger.append(element('span', '', { class: date ? 'minka-calendar-icon' : 'minka-clock-icon', 'aria-hidden': 'true' }));
        label.replaceWith(wrap);
        wrap.append(label, trigger);
    }

    document.querySelectorAll('select[data-searchable]').forEach(enhanceSelect);
    const upgradeSchedules = (root) => root.querySelectorAll('input[type="date"], input[type="time"]').forEach(enhanceSchedule);
    upgradeSchedules(document);
    const dynamic = document.querySelector('#event-modalities');
    if (dynamic) {
        new MutationObserver(() => upgradeSchedules(dynamic)).observe(dynamic, { childList: true, subtree: true });
    }
})();
