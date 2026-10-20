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

/* ---------- Unified publication records ---------- */
let _papersCache = [], _paperLang = 'en';
function esc(s) { return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function citationText(p) {
    const venue = [p.venue, p.volume, p.pages].filter(Boolean).join(', ');
    return `${p.citation_authors}. ${p.title}. ${venue}, ${p.year}.${p.doi ? ' https://doi.org/' + p.doi : ''}`;
}
function bibtex(p) {
    const kind = {journal:'article',conference:'inproceedings',preprint:'misc',book:'misc',patent:'misc'}[p.type];
    const fields = {title:'{' + p.title + '}',author:p.citation_authors.split(', ').join(' and '),year:p.year};
    fields[p.type === 'conference' ? 'booktitle' : p.type === 'journal' ? 'journal' : 'howpublished'] = p.venue;
    if (p.volume) fields.volume = p.volume;
    if (p.pages) fields.pages = p.pages.replace(/–/g,'--');
    if (p.doi) fields.doi = p.doi;
    const url = p.doi ? 'https://doi.org/' + p.doi : Object.values(p.links)[0];
    if (url) fields.url = url;
    return '@' + kind + '{liu' + p.year + '_' + p.id + ',\n' + Object.entries(fields).map(([k,v]) => '  ' + k + ' = {' + v + '}').join(',\n') + '\n}';
}
function downloadBib(ids) {
    const records = SITE_DATA.full_publications.filter(p => ids.includes(p.id));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([records.map(bibtex).join('\n\n')],{type:'application/x-bibtex;charset=utf-8'}));
    a.download = records.length === 1 ? 'liu-' + records[0].id + '.bib' : 'xiaoliang-liu-publications.bib';
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href),1000);
}
async function copyCitation(button, id, format) {
    const p = SITE_DATA.full_publications.find(p => p.id === id);
    const value = format === 'bib' ? bibtex(p) : citationText(p);
    const original = button.textContent;
    try {
        if (!navigator.clipboard) throw Error('Clipboard unavailable');
        await navigator.clipboard.writeText(value);
        button.textContent = _paperLang === 'zh' ? '已复制' : 'Copied';
    } catch (_) {
        const area = button.closest('details').querySelector('textarea');
        area.value = value; area.focus(); area.select();
        button.textContent = _paperLang === 'zh' ? '请按 Ctrl/Cmd+C' : 'Press Ctrl/Cmd+C';
    }
    setTimeout(() => button.textContent = original,2200);
}
function publicationCard(p, lang) {
    const zh = lang === 'zh';
    const article = document.createElement('article');
    article.className = 'publication-entry'; article.id = 'publication-' + p.id;
    const url = p.doi ? 'https://doi.org/' + p.doi : p.links.publisher || p.links.arxiv;
    const authors = esc(p.authors).replace(/Xiaoliang Liu/g,'<strong>Xiaoliang Liu</strong>');
    const meta = [esc(p.venue), p.volume ? '<b>' + esc(p.volume) + '</b>' : '', esc(p.pages), p.year].filter(Boolean).join(', ');
    const links = Object.entries(p.links).map(([k,v]) => `<a href="${esc(v)}" target="_blank" rel="noopener noreferrer">${({publisher:zh?'出版商页面':'Publisher',arxiv:'arXiv',code:zh?'代码':'Code'})[k] || esc(k)}</a>`).join('');
    const scholarly = ['journal','conference','preprint'].includes(p.type);
    article.innerHTML = `<h3>${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(p.title)}</a>` : esc(p.title)}</h3><p class="publication-authors">${authors}</p><p class="publication-venue">${meta}</p>${p.doi ? `<p class="publication-doi">DOI: <a href="https://doi.org/${esc(p.doi)}">${esc(p.doi)}</a></p>` : ''}<div class="publication-links">${links}</div>${scholarly ? `<details class="citation-panel"><summary>${zh?'引用与 BibTeX':'Cite / BibTeX'}</summary><div class="citation-actions"><button onclick="copyCitation(this,${p.id},'text')">${zh?'复制引用':'Copy citation'}</button><button onclick="copyCitation(this,${p.id},'bib')">${zh?'复制 BibTeX':'Copy BibTeX'}</button><button onclick="downloadBib([${p.id}])">${zh?'下载 .bib':'Download .bib'}</button></div><textarea readonly aria-label="Citation text" rows="3">${esc(citationText(p))}</textarea><pre>${esc(bibtex(p))}</pre></details>` : ''}`;
    return article;
}
function preparePapers(d,lang) { _paperLang = lang; _papersCache = d.full_publications.filter(p => p.selected).sort((a,b)=>b.year-a.year); }
function renderPapers(filter) {
    const list = document.getElementById('papers-list'); list.replaceChildren();
    _papersCache.filter(p=>filter==='all'||p.type===filter).forEach(p=>list.append(publicationCard(p,_paperLang)));
    document.querySelectorAll('#publications .filter-btn').forEach(b=>{b.setAttribute('aria-pressed',b.id==='btn-'+filter);b.classList.toggle('bg-white',b.id==='btn-'+filter);});
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

/* ---------- Publications archive ---------- */
function initPublicationsPage() {
    const raw = SITE_DATA.full_publications;
    const counts = {journal:'journal',conf:'conference',patent:'patent',other:'book'};
    Object.entries(counts).forEach(([id,type])=>document.getElementById('count-'+id).textContent=raw.filter(p=>p.type===type).length);
    let filter='all', query='';
    function render() {
        const items=raw.filter(p=>(filter==='all'||p.type===filter)&&[p.title,p.authors,p.venue,p.year,p.doi].join(' ').toLowerCase().includes(query)).sort((a,b)=>b.year-a.year||b.id-a.id);
        const list=document.getElementById('publications-list');list.replaceChildren();
        let year=null;
        items.forEach(p=>{if(year!==p.year){year=p.year;const h=document.createElement('h2');h.className='publication-year';h.textContent=year;list.append(h);}list.append(publicationCard(p,'en'));});
        document.getElementById('empty-state').classList.toggle('hidden',items.length>0);
        document.querySelectorAll('[data-pub-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.pubFilter===filter));
        document.getElementById('result-count').textContent=items.length+' records';
        window.downloadVisibleBib=()=>downloadBib(items.filter(p=>['journal','conference','preprint'].includes(p.type)).map(p=>p.id));
    }
    window.filterList=type=>{filter=type;render();};
    document.getElementById('searchInput').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();render();});
    render();
    if(location.hash) requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
}
