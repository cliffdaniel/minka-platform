const select = (id) => document.getElementById(id);
const form = select('event-lab');
const modalities = select('event-modalities');
const add = select('add-event-modality');
const template = select('modality-template');
const result = select('event-result');
const eventError = select('event-error');

const coursePattern = /^https:\/\/connect\.garmin\.com\/(?:modern\/|app\/)?course\/\d+\/?(?:[?#][^\s]*)?$/i;
const localTime = new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Lima',
});
const named = (scope, key) => scope.querySelector(`[name="${key}"]`);
const read = (scope, key) => named(scope, key).value.trim();

function setValues(scope, values) {
    for (const [key, value] of Object.entries(values)) {
        const field = named(scope, key);
        field.value = value;
        if (field instanceof HTMLSelectElement) field.dispatchEvent(new Event('change'));
    }
}

function refreshModalityLabels() {
    Array.from(modalities.children).forEach((entry, index) => {
        entry.querySelector('legend').textContent = `Modalidad ${index + 1}`;
        entry
            .querySelector('[data-remove-modality]')
            .setAttribute('aria-label', `Quitar modalidad ${index + 1}`);
    });
    add.disabled = modalities.children.length >= 20;
}

function appendModality(values = {}, focus = true) {
    if (modalities.children.length >= 20) return;
    const entry = template.content.firstElementChild.cloneNode(true);
    setValues(entry, values);
    entry.querySelector('[data-remove-modality]').addEventListener('click', () => {
        entry.remove();
        refreshModalityLabels();
        add.focus();
    });
    modalities.append(entry);
    refreshModalityLabels();
    if (focus) named(entry, 'name').focus();
}

function readSchedule(scope) {
    const date = (phase) => {
        const day = read(scope, `${phase}Day`);
        const hour = read(scope, `${phase}Time`);
        if (!day && !hour) return undefined;
        if (!day || !hour) return NaN;
        return Date.parse(`${day}T${hour}:00-05:00`);
    };
    return {
        start: date('start'),
        end: date('end'),
        location: read(scope, 'location'),
        finish: read(scope, 'finish'),
    };
}

function showError(message) {
    eventError.textContent = message;
    eventError.hidden = false;
    eventError.focus();
}

function makeText(tag, text) {
    const node = document.createElement(tag);
    node.textContent = text;
    return node;
}

function scheduleNodes(values) {
    const start = ['Inicio', localTime.format(values.start), values.location].filter(Boolean).join(' · ');
    const nodes = [makeText('p', start)];
    if (values.end || values.finish) {
        const end = ['Fin', values.end ? localTime.format(values.end) : '', values.finish]
            .filter(Boolean)
            .join(' · ');
        nodes.push(makeText('p', end));
    }
    return nodes;
}

function showEvent(event, variants) {
    const rows = variants.map((variant) => {
        const row = document.createElement('details');
        row.append(makeText('summary', variant.title), ...scheduleNodes(variant));
        if (variant.categories) row.append(makeText('p', `Categorías · ${variant.categories}`));
        if (variant.url) {
            const route = makeText('a', 'Ver ruta en Garmin Connect');
            route.href = variant.url;
            route.target = '_blank';
            route.rel = 'noopener noreferrer';
            row.append(route);
        }
        return row;
    });
    result.replaceChildren(
        makeText('strong', event.title),
        makeText('p', `${event.sport} · ${event.city}`),
        ...scheduleNodes(event),
        ...rows,
    );
    select('event-result-heading').focus();
}

add.addEventListener('click', () => appendModality());
select('event-example').addEventListener('click', () => {
    const startDay = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
    const endDay = new Date(Date.now() + 8 * 86_400_000).toISOString().slice(0, 10);
    setValues(form, {
        title: 'Backyard del Misti',
        sport: 'Running',
        city: 'Arequipa',
        location: 'Parque de partida',
        finish: 'Estadio de llegada',
        startDay,
        startTime: '07:00',
        endDay,
        endTime: '17:00',
    });
    modalities.replaceChildren();
    appendModality({ name: 'Backyard', categories: 'General, Máster', endDay, endTime: '16:00' }, false);
    appendModality(
        {
            name: '10K',
            categories: 'General',
            startDay: endDay,
            startTime: '09:00',
            endDay,
            endTime: '11:00',
            location: 'Plaza de Armas',
        },
        false,
    );
    eventError.hidden = true;
});

form.addEventListener('submit', (submission) => {
    submission.preventDefault();
    eventError.hidden = true;
    const event = {
        ...readSchedule(form),
        title: read(form, 'title'),
        city: read(form, 'city'),
        sport: read(form, 'sport'),
    };
    if (
        !event.title ||
        !event.city ||
        !event.location ||
        !event.start ||
        Number.isNaN(event.end) ||
        (event.end !== undefined && event.end <= event.start)
    ) {
        showError(
            'Completa los datos y revisa que la fecha y hora de fin sean posteriores a las de inicio.',
        );
        return;
    }

    const variants = [];
    for (const [index, entry] of Array.from(modalities.children).entries()) {
        const schedule = readSchedule(entry);
        const variant = {
            ...schedule,
            title: read(entry, 'name'),
            categories: read(entry, 'categories'),
            url: read(entry, 'garminUrl'),
            start: schedule.start ?? event.start,
            location: schedule.location || event.location,
            finish: schedule.finish || event.finish,
        };
        const endOfEvent = event.end ?? Infinity;
        if (
            !variant.title ||
            Number.isNaN(variant.start) ||
            Number.isNaN(variant.end) ||
            variant.start < event.start ||
            variant.start >= endOfEvent ||
            (variant.end !== undefined && (variant.end <= variant.start || variant.end > endOfEvent)) ||
            (variant.url && !coursePattern.test(variant.url))
        ) {
            showError(`Revisa las fechas, el nombre y el enlace Garmin de la modalidad ${index + 1}.`);
            return;
        }
        variants.push(variant);
    }

    showEvent(event, variants);
});

const profile = select('profile-lab');
const file = select('profile-photo');
const photo = select('profile-photo-preview');
const fallback = select('profile-logo-fallback');
const remove = select('profile-remove');
const message = select('profile-feedback');
let previewUrl;

function notifyProfile(text, kind) {
    message.hidden = false;
    message.className = `example-notice ${kind}`;
    message.textContent = text;
}

function previewLogo(url) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = url;
    if (url) photo.src = url;
    else photo.removeAttribute('src');
    photo.hidden = !url;
    fallback.hidden = Boolean(url);
    remove.hidden = !url;
}

file.addEventListener('change', () => {
    const image = file.files[0];
    if (!image) return;
    if (!['image/png', 'image/jpeg'].includes(image.type) || image.size > 512 * 1024) {
        file.value = '';
        notifyProfile('Elige un PNG o JPG de hasta 512 KB.', 'error');
        return;
    }
    message.hidden = true;
    previewLogo(URL.createObjectURL(image));
});

remove.addEventListener('click', () => {
    file.value = '';
    previewLogo(undefined);
    file.focus();
});

profile.addEventListener('submit', (submission) => {
    submission.preventDefault();
    const name = read(profile, 'name');
    if (!name) {
        notifyProfile('Ingresa el nombre público.', 'error');
        return;
    }
    notifyProfile(`Perfil de ejemplo guardado · ${name}`, 'success');
});
