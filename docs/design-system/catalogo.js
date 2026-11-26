const byId = (id) => document.getElementById(id);
const search = byId('catalog-search');
const groups = [...document.querySelectorAll('[data-collection]')];
const hint = byId('catalog-count');
const feedback = byId('catalog-feedback');

const normalize = (value) =>
    value
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();

function filterCatalogue() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    for (const group of groups) {
        let visible = 0;
        for (const card of group.querySelectorAll('[data-component]')) {
            const tags = normalize(card.querySelector('h3').textContent + ' ' + card.dataset.component);
            card.hidden = !terms.every((term) => tags.includes(term));
            if (!card.hidden) visible += 1;
        }
        group.hidden = visible === 0;
        count += visible;
    }
    hint.textContent =
        count === 0
            ? 'Ningún componente coincide.'
            : `${count} ${count === 1 ? 'componente' : 'componentes'}`;
}

function announce(message) {
    feedback.hidden = false;
    feedback.textContent = message;
}

search.addEventListener('input', filterCatalogue);
filterCatalogue();
for (const button of document.querySelectorAll('[data-feedback]')) {
    button.addEventListener('click', () => announce(button.dataset.feedback));
}

const password = byId('catalog-password');
const toggle = byId('catalog-password-toggle');
toggle.addEventListener('click', () => {
    const reveal = password.type === 'password';
    password.type = reveal ? 'text' : 'password';
    toggle.textContent = reveal ? 'Ocultar' : 'Mostrar';
});

const dialog = byId('catalog-dialog');
byId('catalog-open-dialog').addEventListener('click', () => {
    dialog.returnValue = 'cancel';
    dialog.showModal();
});
dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'remove') announce('Logo de ejemplo quitado.');
});

const file = byId('catalog-file');
const fileNotice = byId('catalog-file-status');
file.addEventListener('change', () => {
    const selected = file.files[0];
    if (!selected) return;
    fileNotice.hidden = false;
    const valid = ['image/png', 'image/jpeg'].includes(selected.type) && selected.size <= 512 * 1024;
    fileNotice.textContent = valid
        ? 'Logo de ejemplo seleccionado.'
        : 'Elige un PNG o JPG de hasta 512 KB.';
    if (!valid) file.value = '';
});
