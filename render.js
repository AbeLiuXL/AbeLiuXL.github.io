/**
 * render.js — Shared data loader & renderer
 * Both index.html and index_cn.html include this script.
 * Call initPage('en') or initPage('zh') after DOM is ready.
 */

function loadData() {
    return window.SITE_DATA;
}

/* ---------- helper: get localized text ---------- */
function t(obj, lang) {
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['en'] || '';
}

/* ---------- helper: color class map (Tailwind CDN needs full class names) ---------- */
const COLOR_MAP = {
    academic: { border: 'border-academic-500', bg50: 'bg-academic-50', text700: 'text-academic-700', border100: 'border-academic-100', textIcon: 'text-academic-500', bg100: 'bg-academic-100', text600: 'text-academic-600' },
    purple:   { border: 'border-purple-500', bg50: 'bg-purple-50', text700: 'text-purple-700', border100: 'border-purple-100', textIcon: 'text-purple-500', bg100: 'bg-purple-100', text600: 'text-purple-600' },
    amber:    { border: 'border-amber-500', bg50: 'bg-amber-50', text700: 'text-amber-700', border100: 'border-amber-100', textIcon: 'text-amber-500', bg100: 'bg-amber-100', text600: 'text-amber-600' },
    blue:     { border: 'border-blue-500', bg50: 'bg-blue-50', text700: 'text-blue-700', border100: 'border-blue-100', textIcon: 'text-blue-500', bg100: 'bg-blue-100', text600: 'text-blue-600' },
    emerald:  { border: 'border-emerald-500', bg50: 'bg-emerald-50', text700: 'text-emerald-700', border100: 'border-emerald-100', textIcon: 'text-emerald-500', bg100: 'bg-emerald-100', text600: 'text-emerald-600' },
    yellow:   { border: 'border-yellow-500', bg50: 'bg-yellow-50', text700: 'text-yellow-700', border100: 'border-yellow-100', textIcon: 'text-yellow-500', bg100: 'bg-yellow-100', text600: 'text-yellow-600' },
    orange:   { border: 'border-orange-500', bg50: 'bg-orange-50', text700: 'text-orange-700', border100: 'border-orange-100', textIcon: 'text-orange-500', bg100: 'bg-orange-100', text600: 'text-orange-600' },
};
const MEMBERSHIP_COLOR = {
    blue: { hover: 'hover:border-blue-300', dot: 'text-blue-600' },
    emerald: { hover: 'hover:border-emerald-300', dot: 'text-emerald-600' },
    purple: { hover: 'hover:border-purple-300', dot: 'text-purple-600' },
};

const AWARD_COLOR = {
    yellow: {
        bg: COLOR_MAP.yellow.bg100,
        text: COLOR_MAP.yellow.text600
    },
    orange: {
        bg: COLOR_MAP.orange.bg100,
        text: COLOR_MAP.orange.text600
    },
    blue: {
        bg: COLOR_MAP.blue.bg100,
        text: COLOR_MAP.blue.text600
    },
    emerald: {
        bg: COLOR_MAP.emerald.bg100,
        text: COLOR_MAP.emerald.text600
    },
    purple: {
        bg: COLOR_MAP.purple.bg100,
        text: COLOR_MAP.purple.text600
    },
    amber: {
        bg: COLOR_MAP.amber.bg100,
        text: COLOR_MAP.amber.text600
    },
    academic: {
        bg: COLOR_MAP.academic.bg100,
        text: COLOR_MAP.academic.text600
    },
};



/* ---------- Profile Card ---------- */
function renderProfile(d, lang) {
    const p = d.profile;

    // Photo
    const photoEl = document.getElementById('profile-photo');
    if (photoEl) photoEl.src = p.photo;

    // Social links (dynamic - not SEO critical)
    const socialContainer = document.getElementById('profile-socials');
    if (socialContainer) {
        socialContainer.innerHTML = '';
        p.socials.forEach(s => {
            const fw = s.full_width ? 'col-span-2 flex items-center justify-center gap-2' : 'flex flex-col items-center justify-center';
            const iconSize = s.full_width ? 'text-xl' : 'text-xl mb-1';
            const labelSize = s.full_width ? 'text-xs' : 'text-[10px]';
            const labelExtra = s.full_width ? '' : 'mt-1';
            socialContainer.innerHTML += `
                <a href="${s.url}" target="_blank" class="${fw} p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors border border-slate-100 group/btn">
                    <i class="ph-fill ph-${s.icon} ${iconSize} text-slate-600 group-hover/btn:text-blue-600"></i>
                    <span class="${labelSize} font-bold uppercase ${labelExtra}">${t(s.label, lang)}</span>
                </a>`;
        });
    }
}

/* ---------- Bio ---------- */
function renderBio(d, lang) {
    // Bio and research tags are now static in HTML for SEO
    // This function is kept as a no-op placeholder for compatibility
}

/* ---------- Memberships ---------- */
function renderMemberships(d, lang) {
    const container = document.getElementById('memberships-list');
    if (!container) return;
    container.innerHTML = '';
    const items = lang === 'zh' ? d.memberships.zh : d.memberships.en;
    items.forEach(m => {
        const mc = MEMBERSHIP_COLOR[m.color] || MEMBERSHIP_COLOR.blue;
        container.innerHTML += `
            <span class="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-full shadow-sm ${mc.hover} transition-colors">
                <span class="${mc.dot}">●</span> ${m.text}
            </span>`;
    });
}

/* ---------- Contact ---------- */
function renderContact(d, lang) {
    // Email and address are now static in HTML for SEO
    // This function is kept as a no-op placeholder for compatibility
}

/* ---------- Citation Stats ---------- */
function renderCitation(d) {
    const c = d.citation;
    const el = (id) => document.getElementById(id);
    if (el('cite-total')) el('cite-total').textContent = c.total;
    if (el('cite-h')) el('cite-h').textContent = c.h_index;
    if (el('cite-i10')) el('cite-i10').textContent = c.i10_index;
}

function renderCitationChart(d) {
    const canvas = document.getElementById('citationChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: d.citation.yearly.labels,
            datasets: [{ label: 'Citations', data: d.citation.yearly.data, backgroundColor: '#0284c7', borderRadius: 2, barThickness: 10 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } },
            layout: { padding: 0 }
        }
    });
}

/* ---------- News ---------- */
function renderNews(d, lang) {
    const container = document.getElementById('news-container');
    if (!container) return;
    container.innerHTML = '';
    d.news.forEach(item => {
        const text = t(item.text, lang);
        container.innerHTML += `
            <div class="flex gap-3 text-sm pb-2 border-b border-slate-50 last:border-0">
                <span class="font-mono text-xs text-slate-400 pt-0.5 whitespace-nowrap">${item.date}</span>
                <span class="text-slate-600 leading-snug">${text}</span>
            </div>`;
    });
}

/* ---------- Papers ---------- */
let _papersCache = null;
function renderPapers(filter) {
    if (!_papersCache) return;
    const list = document.getElementById('papers-list');
    list.innerHTML = '';
    const filtered = filter === 'all' ? _papersCache : _papersCache.filter(p => p.type === filter);

    document.querySelectorAll('.filter-btn').forEach(b => {
        if (b.id === `btn-${filter}`) {
            b.classList.add('bg-white', 'shadow-sm', 'text-slate-900');
            b.classList.remove('text-slate-600');
        } else {
            b.classList.remove('bg-white', 'shadow-sm', 'text-slate-900');
            b.classList.add('text-slate-600');
        }
    });

    filtered.forEach(p => {
        const tags = p._tags.map(t => `<span class="tag-badge ${t.c}">${t.t}</span>`).join('');
        let links = '';
        if (p.links.paper) links += `<a href="${p.links.paper}" target="_blank" class="text-xs font-bold text-academic-700 hover:underline ">PDF</a>`;
        if (p.links.arxiv) links += `<a href="${p.links.arxiv}" target="_blank" class="text-xs font-bold text-red-700 hover:underline ml-3">ArXiv</a>`;
        if (p.links.code) links += `<a href="${p.links.code}" target="_blank" class="text-xs font-bold text-slate-700 hover:underline ml-3">Code</a>`;

        const card = document.createElement('div');
        card.className = "glass-card p-5 rounded-lg flex flex-col sm:flex-row gap-4 items-start hover:border-academic-200 transition-all";
        card.innerHTML = `
            <div class="flex-1">
                <h3 class="text-base font-bold text-slate-800 mb-1">${p.title}</h3>
                <p class="text-sm text-slate-500 mb-2">${p._authorsHtml}</p>
                <div class="flex flex-wrap items-center gap-2 mb-2"><span class="font-serif italic text-slate-700 font-medium">${p.venue}, ${p.year}</span>${tags}, [${links}]</div>
            </div>`;
        list.appendChild(card);
    });
}

function preparePapers(d, lang) {
    _papersCache = d.papers.map(p => {
        const tags = lang === 'zh' ? p.tags.zh : p.tags.en;
        const highlightName = lang === 'zh' ? '刘小亮' : 'Xiaoliang Liu';
        const regex = new RegExp(highlightName, 'g');
        return {
            ...p,
            _tags: tags,
            _authorsHtml: p.authors.replace(regex, `<span class="font-semibold text-slate-900">${highlightName}</span>`)
        };
    });
}

/* ---------- Projects ---------- */
function renderProjects(d, lang) {
    const container = document.getElementById('projects-list');
    if (!container) return;
    container.innerHTML = '';
    d.projects.forEach(proj => {
        const c = COLOR_MAP[proj.color] || COLOR_MAP.academic;
        container.innerHTML += `
            <div class="glass-card p-6 rounded-xl border-l-4 ${c.border} hover:shadow-lg transition-all hover:-translate-y-1">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                    <h4 class="text-lg font-bold text-slate-800 leading-snug flex items-center gap-2">
                        ${t(proj.title, lang)}
                        <span class="hidden md:inline-block px-2 py-0.5 text-[10px] border border-slate-200 rounded text-slate-400 font-normal uppercase">${proj.id}</span>
                    </h4>
                    <span class="text-xs ${c.bg50} ${c.text700} px-3 py-1 rounded-full font-bold border ${c.border100} shadow-sm whitespace-nowrap flex items-center gap-1"><i class="ph-fill ph-users"></i> ${t(proj.role, lang)}</span>
                </div>
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 mb-3">
                    <span class="flex items-center gap-1.5 font-medium"><i class="ph-bold ph-buildings ${c.textIcon}"></i> ${t(proj.funder, lang)}</span>
                    <span class="flex items-center gap-1.5"><i class="ph-bold ph-tag text-slate-400"></i> ${t(proj.type, lang)}</span>
                </div>
                <p class="text-sm text-slate-500 leading-relaxed">${t(proj.desc, lang)}</p>
            </div>`;
    });
}

/* ---------- Academic Services ---------- */
function renderServices(d, lang) {
    const journalList = document.getElementById('reviewer-journals');
    if (journalList) {
        journalList.innerHTML = '';
        const journals = lang === 'zh' ? d.services.reviewer_journals.zh : d.services.reviewer_journals.en;
        journals.forEach(j => {
            journalList.innerHTML += `<li class="text-sm text-slate-600">${j}</li>`;
        });
    }
    const pcList = document.getElementById('pc-memberships');
    if (pcList) {
        pcList.innerHTML = '';
        const pcs = lang === 'zh' ? d.services.pc_memberships.zh : d.services.pc_memberships.en;
        pcs.forEach((pc, i) => {
            pcList.innerHTML += `<p class="text-sm text-slate-600">[${i + 1}] ${pc}</p>`;
        });
    }
}

/* ---------- Awards ---------- */
function renderAwards(d, lang) {
    const container = document.getElementById('awards-list');
    if (!container) return;
    container.innerHTML = '';
    d.awards.forEach(a => {
        const ac = AWARD_COLOR[a.color] || AWARD_COLOR.yellow;
        container.innerHTML += `
            <div class="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                <div class="${ac.bg} ${ac.text} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform"><i class="ph-fill ph-${a.icon} text-2xl"></i></div>
                <div>
                    <h4 class="text-base font-bold text-slate-800">${t(a.title, lang)}</h4>
                    <p class="text-sm font-medium text-academic-600">${t(a.event, lang)}</p>
                    <p class="text-xs text-slate-500 mt-1">${t(a.detail, lang)}</p>
                </div>
            </div>`;
    });
}

/* ---------- Master Init ---------- */
function initPage(lang) {
    const d = loadData();

    renderProfile(d, lang);
    renderBio(d, lang);
    renderMemberships(d, lang);
    renderContact(d, lang);
    renderCitation(d);
    renderCitationChart(d);
    renderNews(d, lang);
    preparePapers(d, lang);
    renderPapers('all');
    renderProjects(d, lang);
    renderServices(d, lang);
    renderAwards(d, lang);
}

/* ---------- Publications Page ---------- */
function initPublicationsPage() {
    const d = loadData();
    const rawData = d.full_publications;

    // Stats
    const counts = { journal: 0, conference: 0, patent: 0, other: 0 };
    rawData.forEach(item => {
        if (item.type === 'journal') counts.journal++;
        else if (item.type === 'conference') counts.conference++;
        else if (item.type === 'patent') {
            if (item.tags.includes("Patent")) counts.patent++;
            else counts.other++;
        }
    });
    document.getElementById('count-journal').innerText = counts.journal;
    document.getElementById('count-conf').innerText = counts.conference;
    document.getElementById('count-patent').innerText = counts.patent;
    document.getElementById('count-other').innerText = counts.other;

    function renderList(data) {
        const container = document.getElementById('publications-list');
        container.innerHTML = '';
        if (data.length === 0) { document.getElementById('empty-state').classList.remove('hidden'); return; }
        document.getElementById('empty-state').classList.add('hidden');
        data.sort((a, b) => b.year - a.year);
        data.forEach(item => {
            const tagsHtml = item.tags.map(t => {
                let cls = 'bg-slate-100 text-slate-600 border-slate-200';
                if (t.includes('Q1') || t.includes('TOP')) cls = 'tag-q1';
                else if (t.includes('Q2')) cls = 'tag-q2';
                else if (t.includes('CCF-B')) cls = 'tag-ccf-b';
                else if (t.includes('CCF-C')) cls = 'tag-ccf-c';
                return `<span class="tag ${cls}">${t}</span>`;
            }).join('');
            let buttonsHtml = '';
            if (item.links.pdf) buttonsHtml += `<a href="${item.links.pdf}" target="_blank" class="flex items-center gap-1 text-xs font-bold text-academic-600 bg-academic-50 hover:bg-academic-100 px-3 py-1.5 rounded-md transition-colors"><i class="ph-bold ph-file-pdf"></i> PDF</a>`;
            if (item.links.arxiv) buttonsHtml += `<a href="${item.links.arxiv}" target="_blank" class="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"><i class="ph-bold ph-file-text"></i> ArXiv</a>`;
            if (item.links.code) buttonsHtml += `<a href="${item.links.code}" target="_blank" class="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors"><i class="ph-bold ph-code"></i> Code</a>`;
            const authorHtml = item.authors.replace(/Xiaoliang Liu/g, '<b class="text-slate-900 font-semibold">Xiaoliang Liu</b>');
            let icon = 'ph-article';
            if (item.type === 'conference') icon = 'ph-users-three';
            if (item.tags.includes('Patent')) icon = 'ph-certificate';
            if (item.tags.includes('Book')) icon = 'ph-book-open';
            const card = document.createElement('div');
            card.className = 'bg-white p-5 rounded-xl paper-card relative border-l-4 ' + (item.type === 'journal' ? 'border-l-academic-500' : item.type === 'conference' ? 'border-l-indigo-500' : 'border-l-amber-500');
            card.innerHTML = `
                <div class="absolute top-5 right-5 text-slate-200 text-3xl"><i class="ph-duotone ${icon}"></i></div>
                <div class="pr-12">
                    <h3 class="text-lg font-bold text-slate-800 leading-snug mb-2">${item.title}</h3>
                    <p class="text-sm text-slate-500 mb-3">${authorHtml}</p>
                    <div class="flex flex-wrap items-center gap-3 mb-4">
                        <span class="text-sm font-serif italic text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">${item.venue}, ${item.year}</span>
                        ${tagsHtml}
                    </div>
                    <div class="flex gap-3">${buttonsHtml}</div>
                </div>`;
            container.appendChild(card);
        });
    }

    let currentFilter = 'all';
    let searchQuery = '';
    function applyFilters() {
        let filtered = rawData;
        if (currentFilter !== 'all') filtered = filtered.filter(i => i.type === currentFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(i => i.title.toLowerCase().includes(q) || i.venue.toLowerCase().includes(q) || i.year.toString().includes(q));
        }
        renderList(filtered);
    }
    window.filterList = function (type) {
        currentFilter = type;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.className = 'filter-btn px-4 py-1.5 text-xs font-bold rounded-lg bg-white text-slate-600 border border-slate-200 hover:border-academic-300 transition-all shrink-0';
        });
        const map = { all: 0, journal: 1, conference: 2, patent: 3 };
        const btns = document.querySelectorAll('.filter-btn');
        if (btns[map[type]]) btns[map[type]].className = 'filter-btn active px-4 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-white shadow-md transition-all shrink-0';
        applyFilters();
    };
    document.getElementById('searchInput').addEventListener('input', e => { searchQuery = e.target.value; applyFilters(); });
    renderList(rawData);
}
