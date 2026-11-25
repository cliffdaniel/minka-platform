const select = (id) => document.getElementById(id);
const preview = select('app-preview');
const deviceNote = select('device-note');
const roleSelect = select('role');
const accountMenu = preview.querySelector('.account-menu');
const accountToggle = accountMenu.querySelector('summary');
const accountActions = preview.querySelector('.app-actions');
const destinations = [...preview.querySelectorAll('[data-page]')];
const raceAction = select('new-race');
const raceDialog = select('race-dialog');
const sampleForm = select('sample-form');

const roleDetails = {
    organizer: {
        name: 'Organizador Minka',
        label: 'Organizador',
        initials: 'OM',
        races: 'Mis eventos',
        welcome: 'Consulta tus próximos eventos y organiza lo que viene.',
    },
    runner: {
        name: 'Runner Minka',
        label: 'Runner',
        initials: 'RM',
        races: 'Próximos eventos',
        welcome: 'Encuentra tu próximo evento en la comunidad Minka.',
    },
    super_admin: {
        name: 'Admin Minka',
        label: 'Super administrador',
        initials: 'AM',
        races: 'Todos los eventos',
        welcome: 'Consulta los eventos y las cuentas de Minka.',
    },
};

const deviceNotes = {
    desktop: 'Sidebar lateral de 232 px · barra superior de 64 px',
    tablet: 'Rail lateral de 72 px · barra superior de 64 px',
    mobile: 'Barra superior y tabs de 56 · espacio adicional para las áreas seguras',
};

const screens = {
    home: select('home-view'),
    races: select('races-view'),
    accounts: select('accounts-view'),
    signedOut: select('signed-out-view'),
};

let currentPage = 'home';
const races = [];

function renderRaces() {
    const visibleRaces =
        roleSelect.value === 'organizer' ? races.filter((race) => race.owner === 'organizer') : races;

    select('races-empty').hidden = visibleRaces.length > 0;
    for (const count of preview.querySelectorAll('.race-count')) {
        count.textContent = String(visibleRaces.length);
    }

    const rows = visibleRaces.map(({ name, city, sport, modality }) => {
        const row = document.createElement('li');
        const details = document.createElement('div');
        const title = document.createElement('strong');
        const location = document.createElement('p');
        const status = document.createElement('span');

        title.textContent = name;
        location.textContent = [sport, modality, city].filter(Boolean).join(' · ');
        status.className = 'status success';
        status.textContent = 'Publicado';
        details.append(title, location);
        row.append(details, status);
        return row;
    });

    select('sample-races').replaceChildren(...rows);
}

function showPage(page) {
    currentPage = page;
    const signedOut = page === 'signedOut';
    const role = roleDetails[roleSelect.value];
    const titles = { home: 'Inicio', races: role.races, accounts: 'Usuarios', signedOut: 'Minka' };

    for (const [key, screen] of Object.entries(screens)) {
        screen.hidden = key !== page;
    }
    for (const button of destinations) {
        if (button.dataset.page === page) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
    }
    preview.toggleAttribute('data-signed-out', signedOut);
    accountActions.hidden = signedOut;
    raceAction.hidden = roleSelect.value === 'runner' || page === 'accounts';
    select('screen-title').textContent = titles[page];
}

function renderRole() {
    const role = roleSelect.value;
    const details = roleDetails[role];

    select('greeting').textContent = `Hola, ${details.name}`;
    select('welcome-copy').textContent = details.welcome;
    select('account-name').textContent = details.name;
    select('account-role').textContent = details.label;
    select('initials').textContent = details.initials;
    select('first-metric-label').textContent =
        role === 'runner' ? 'Eventos disponibles' : 'Eventos publicados';
    select('races-empty-hint').hidden = role === 'runner';

    for (const label of preview.querySelectorAll('[data-races-label]')) {
        label.textContent = details.races;
    }
    for (const destination of destinations) {
        if (destination.dataset.page === 'accounts') destination.hidden = role !== 'super_admin';
        if (destination.dataset.page === 'races' && destination.hasAttribute('title'))
            destination.title = details.races;
    }
    accountMenu.open = false;
    renderRaces();
    showPage(currentPage === 'accounts' && role !== 'super_admin' ? 'home' : currentPage);
}

function selectDevice(device) {
    preview.dataset.device = device;
    deviceNote.textContent = deviceNotes[device];
}

const initialDevice = matchMedia('(max-width: 767px)').matches
    ? 'mobile'
    : matchMedia('(max-width: 1023px)').matches
      ? 'tablet'
      : 'desktop';

for (const control of document.querySelectorAll('input[name="device"]')) {
    control.addEventListener('change', () => selectDevice(control.value));
    if (control.value === initialDevice) {
        control.checked = true;
        selectDevice(control.value);
    }
}

for (const destination of destinations) {
    destination.addEventListener('click', () => showPage(destination.dataset.page));
}
roleSelect.addEventListener('change', renderRole);

select('sign-out').addEventListener('click', () => {
    accountMenu.open = false;
    showPage('signedOut');
    select('reset-session').focus();
});
select('reset-session').addEventListener('click', () => {
    showPage('home');
    accountToggle.focus();
});
document.addEventListener('pointerdown', (event) => {
    if (!accountMenu.contains(event.target)) accountMenu.open = false;
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && accountMenu.open) {
        accountMenu.open = false;
        accountToggle.focus();
    }
});

raceAction.addEventListener('click', () => raceDialog.showModal());
select('close-dialog').addEventListener('click', () => raceDialog.close());
sampleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(sampleForm);
    races.push({
        name: String(data.get('name')).trim(),
        city: String(data.get('city')).trim(),
        sport: String(data.get('sport')),
        modality: String(data.get('modality')).trim(),
        owner: roleSelect.value,
    });
    sampleForm.reset();
    renderRaces();
    showPage('races');
    raceDialog.close();
});

const password = select('example-password');
const passwordToggle = select('toggle-password');
passwordToggle.addEventListener('click', () => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    passwordToggle.textContent = visible ? 'Ocultar' : 'Mostrar';
});

const feedback = select('button-feedback');
for (const example of document.querySelectorAll('[data-example]')) {
    example.addEventListener('click', () => {
        feedback.hidden = false;
        feedback.textContent = example.dataset.example;
    });
}

const panelStatus = select('panel-status');
const panelStates = document.querySelectorAll('[data-panel]');

function showPanelState() {
    for (const state of panelStates) {
        state.hidden = state.dataset.panel !== panelStatus.value;
    }
}

panelStatus.addEventListener('change', showPanelState);
select('retry-panel').addEventListener('click', () => {
    panelStatus.value = 'ready';
    showPanelState();
    panelStatus.focus();
});
