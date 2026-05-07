import { Templates } from './templates.js';

// ── GOOGLE DRIVE CONFIG ────────────────────
const GOOGLE_CLIENT_ID = '665517010127-irkemcj6r0kaup032p2ilts2pmf03c8p.apps.googleusercontent.com';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DB_FILENAME = 'lifestars_marketing_os_v1.json';

let tokenClient;
window.accessToken = localStorage.getItem('ls_drive_token') || null;
let syncTimeout;

const DriveManager = {
    async init() {
        const check = () => {
            if (window.gapi && window.google) {
                gapi.load('client', async () => {
                    try {
                        await gapi.client.init({ discoveryDocs: [DISCOVERY_DOC] });
                        tokenClient = google.accounts.oauth2.initTokenClient({
                            client_id: GOOGLE_CLIENT_ID,
                            scope: SCOPES,
                            callback: async (resp) => {
                                if (resp.error) return;
                                window.accessToken = resp.access_token;
                                localStorage.setItem('ls_drive_token', window.accessToken);
                                localStorage.setItem('ls_drive_connected', 'true');
                                await this.syncWithCloud();
                                renderPage(State.activePage || 'dashboard');
                            },
                        });
                        
                        // Auto-connect if previously connected
                        if (localStorage.getItem('ls_drive_connected') === 'true' && !window.accessToken) {
                            tokenClient.requestAccessToken({ prompt: '' });
                        } else if (window.accessToken) {
                            await this.syncWithCloud();
                        }
                    } catch (e) {
                        console.error("Erro ao inicializar Google Drive:", e);
                    }
                });
            }
        };
        check();
    },

    async syncWithCloud() {
        if (!window.accessToken) return;
        const overlay = document.getElementById('sync-overlay');
        if (overlay) overlay.style.display = 'flex';

        try {
            console.log("Iniciando sincronização com Google Drive...");
            const rootId = await this.getOrCreateFolder('LifeStars_MarketingOS');
            console.log("Pasta raiz encontrada/criada:", rootId);

            const query = `name = '${DB_FILENAME}' and '${rootId}' in parents and trashed = false`;
            const listUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id, name)`;
            
            const response = await fetch(listUrl, {
                headers: { 'Authorization': 'Bearer ' + window.accessToken }
            });
            const listData = await response.json();
            console.log("Busca de arquivo de estado:", listData);

            if (listData.files && listData.files.length > 0) {
                const fileId = listData.files[0].id;
                console.log("Arquivo de estado encontrado! Baixando dados...");
                const fileResp = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                    headers: { 'Authorization': 'Bearer ' + window.accessToken }
                });
                const cloudData = await fileResp.json();
                
                // Mapear dados da nuvem para o estado local
                Object.keys(cloudData).forEach(key => {
                    if (typeof cloudData[key] !== 'function') {
                        State[key] = cloudData[key];
                    }
                });
                console.log("Sincronização concluída: Dados da nuvem carregados.");
                renderPage(State.activePage || 'dashboard');
            } else {
                console.log("Arquivo de estado não encontrado no Drive.");
                // Só salva se o estado local não estiver vazio (para não apagar dados por engano)
                if (State.leads.length > 0 || State.clients.length > 0) {
                    console.log("Estado local possui dados. Fazendo upload inicial...");
                    await this.saveStateToCloud();
                } else {
                    console.log("Estado local vazio. Aguardando entrada de dados.");
                }
            }
        } catch (err) {
            console.error("Erro crítico na sincronização:", err);
        } finally {
            if (overlay) overlay.style.display = 'none';
        }
    },
    async saveStateToCloud() {
        if (!window.accessToken) return;
        try {
            const rootId = await this.getOrCreateFolder('LifeStars_MarketingOS');
            
            // 1. Save Master JSON (Primary Source)
            await this.saveFile(DB_FILENAME, JSON.stringify(State), rootId);

            // 2. Save Module-Specific JSONs (For User Visibility)
            const modules = [
                { name: 'Kanban', folder: 'Fluxo_Kanban', data: State.kanban },
                { name: 'Calendario', folder: 'Calendario_Editorial', data: { rules: State.calendarRules, tasks: State.calendarTasks } },
                { name: 'Brand', folder: 'Identidade_Marca', data: State.brand },
                { name: 'SWOT', folder: 'Analises_SWOT', data: State.swots },
                { name: 'Personas', folder: 'Personas', data: State.personas },
                { name: 'Performance', folder: 'Performance_Leads', data: { leads: State.leads, reports: State.reports } },
                { name: 'Clientes', folder: 'Diretorio_Clientes', data: State.clients.map(c => ({ id: c.id, name: c.name, responsible: c.responsible })) },
                { name: 'Senhas', folder: 'Seguranca_Senhas', data: State.passwords }
            ];

            for (const mod of modules) {
                const modFolderId = await this.getOrCreateFolder(mod.folder, rootId);
                await this.saveFile(`${mod.name.toLowerCase()}_data.json`, JSON.stringify(mod.data, null, 2), modFolderId);
            }

            console.log("State and Modules synced to Drive");
        } catch (err) {
            console.error("Erro ao salvar no Drive:", err);
        }
    },

    async saveFile(name, content, parentId) {
        const query = `name = '${name}' and '${parentId}' in parents and trashed = false`;
        const listUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)`;
        const listResp = await fetch(listUrl, { headers: { 'Authorization': 'Bearer ' + window.accessToken } });
        const listData = await listResp.json();

        let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media';
        let method = 'POST';

        if (listData.files && listData.files.length > 0) {
            url = `https://www.googleapis.com/upload/drive/v3/files/${listData.files[0].id}?uploadType=media`;
            method = 'PATCH';
        } else {
            // Need to create with metadata first for POST
            const metadata = { name, parents: [parentId] };
            const metaResp = await fetch('https://www.googleapis.com/drive/v3/files', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + window.accessToken, 'Content-Type': 'application/json' },
                body: JSON.stringify(metadata)
            });
            const metaData = await metaResp.json();
            url = `https://www.googleapis.com/upload/drive/v3/files/${metaData.id}?uploadType=media`;
            method = 'PATCH';
        }

        await fetch(url, {
            method: method,
            headers: { 'Authorization': 'Bearer ' + window.accessToken, 'Content-Type': 'application/json' },
            body: content
        });
    },

    async getOrCreateFolder(name, parentId = null) {
        const escapedName = name.replace(/'/g, "\\'");
        let query = `name = '${escapedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
        if (parentId) query += ` and '${parentId}' in parents`;
        
        const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)`;
        const resp = await fetch(url, {
            headers: { 'Authorization': 'Bearer ' + window.accessToken }
        });
        const data = await resp.json();
        
        if (data.files && data.files.length > 0) return data.files[0].id;
        
        const metadata = { name, mimeType: 'application/vnd.google-apps.folder', parents: parentId ? [parentId] : [] };
        const createResp = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: { 
                'Authorization': 'Bearer ' + window.accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(metadata)
        });
        const folder = await createResp.json();
        return folder.id;
    },

    async uploadFile(file, folderId) {
        if (!window.accessToken) throw new Error("Google Drive não conectado.");
        
        const metadata = { name: file.name, parents: [folderId] };
        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        formData.append('file', file);
        
        const resp = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webContentLink,webViewLink', {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + window.accessToken }),
            body: formData
        });

        if (resp.status === 401) {
            localStorage.removeItem('ls_drive_token');
            window.accessToken = null;
            // Try to auto-refresh once if it was connected
            if (localStorage.getItem('ls_drive_connected') === 'true') {
                tokenClient.requestAccessToken({ prompt: '' });
                throw new Error("Sessão expirada. Tentando reconectar...");
            }
            throw new Error("Sessão do Google expirada. Por favor, reconecte em Configurações.");
        }

        if (!resp.ok) {
            const errorData = await resp.json();
            throw new Error(errorData.error?.message || "Falha no upload para o Drive.");
        }

        return await resp.json();
    },

    async trashFile(fileId) {
        if (!window.accessToken) return;
        await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'PATCH',
            headers: { 
                'Authorization': 'Bearer ' + window.accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trashed: true })
        });
    },

    async trashFolderByName(name, parentId) {
        if (!window.accessToken) return;
        const escapedName = name.replace(/'/g, "\\'");
        const query = `name = '${escapedName}' and mimeType = 'application/vnd.google-apps.folder' and '${parentId}' in parents and trashed = false`;
        const listUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)`;
        const listResp = await fetch(listUrl, { headers: { 'Authorization': 'Bearer ' + window.accessToken } });
        const listData = await listResp.json();

        if (listData.files && listData.files.length > 0) {
            for (const f of listData.files) {
                await this.trashFile(f.id);
            }
        }
    }
};

window.connectDrive = () => {
    localStorage.setItem('ls_drive_connected', 'true');
    tokenClient.requestAccessToken({ prompt: 'select_account' });
};

// ── STATE ──────────────────────────────────
const State = {
    activePage: 'dashboard',
    calendarViewDate: new Date(),
    brand: JSON.parse(localStorage.getItem('ls_brand')) || {
        historia: "",
        missao: "",
        visao: "",
        valores: "",
        cores: [
            { name: "Coral Primário", hex: "#D4685A" },
            { name: "Areia Soft", hex: "#F7F3F0" },
            { name: "Cinza Tipográfico", hex: "#1E1E1E" }
        ],
        nome: "LifeStars Cuidadores",
        posicionamento: "",
        tom: "",
        assets: [],
        primary: "#D4685A",
        secondary: "#F7F3F0",
        fontMain: "Inter",
        fontSecondary: "Inter"
    },
    swots: JSON.parse(localStorage.getItem('ls_swots')) || JSON.parse(localStorage.getItem('ls_swot')) || [
        { id: 1, name: "Matriz Geral 2024", s: [], w: [], o: [], t: [] }
    ],
    personas: JSON.parse(localStorage.getItem('ls_personas')) || [],
    kanban: JSON.parse(localStorage.getItem('ls_kanban')) || [
        { id: 1, title: "Backlog Estratégia", tasks: [] },
        { id: 2, title: "A Fazer", tasks: [] },
        { id: 3, title: "Em Produção", tasks: [] },
        { id: 4, title: "Concluído", tasks: [] }
    ],
    calendarRules: JSON.parse(localStorage.getItem('ls_cal_rules')) || [],
    calendarTasks: JSON.parse(localStorage.getItem('ls_cal_tasks')) || [],
    clients: JSON.parse(localStorage.getItem('ls_clients')) || [],
    reports: JSON.parse(localStorage.getItem('ls_reports')) || [],
    leads: JSON.parse(localStorage.getItem('ls_leads')) || [],
    passwords: JSON.parse(localStorage.getItem('ls_passwords')) || [],
    seo: JSON.parse(localStorage.getItem('ls_seo')) || [],
    ads: JSON.parse(localStorage.getItem('ls_ads')) || [],
    userProfile: JSON.parse(localStorage.getItem('ls_user_profile')) || {
        name: 'Equipe Marketing',
        role: 'LifeStars Admin'
    },
    expandedSeoMonthId: null,
    expandedAdsMonthId: null,
    
    save() {
        try {
            localStorage.setItem('ls_brand', JSON.stringify(this.brand));
            localStorage.setItem('ls_swots', JSON.stringify(this.swots));
            localStorage.setItem('ls_personas', JSON.stringify(this.personas));
            localStorage.setItem('ls_kanban', JSON.stringify(this.kanban));
            localStorage.setItem('ls_cal_rules', JSON.stringify(this.calendarRules));
            localStorage.setItem('ls_cal_tasks', JSON.stringify(this.calendarTasks));
            localStorage.setItem('ls_clients', JSON.stringify(this.clients));
            localStorage.setItem('ls_reports', JSON.stringify(this.reports));
            localStorage.setItem('ls_leads', JSON.stringify(this.leads));
            localStorage.setItem('ls_passwords', JSON.stringify(this.passwords));
            localStorage.setItem('ls_seo', JSON.stringify(this.seo));
            localStorage.setItem('ls_ads', JSON.stringify(this.ads));
            localStorage.setItem('ls_user_profile', JSON.stringify(this.userProfile));

            if (window.accessToken) {
                clearTimeout(syncTimeout);
                syncTimeout = setTimeout(() => DriveManager.saveStateToCloud(), 2000);
            }
        } catch (e) {
            console.error("Erro ao salvar no LocalStorage:", e);
            if (e.name === 'QuotaExceededError' && !window.accessToken) {
                alert("Atenção: O armazenamento do seu navegador está cheio. Conecte o Google Drive em 'Configurações' para continuar salvando seus arquivos com segurança.");
            }
        }
    }
};

function updateSidebarProfile() {
    const elName = document.querySelector('.user-name');
    const elRole = document.querySelector('.user-role');
    const elAvatar = document.querySelector('.user-avatar');

    if (elName) elName.textContent = State.userProfile.name;
    if (elRole) elRole.textContent = State.userProfile.role;
    if (elAvatar) {
        const initials = State.userProfile.name
            .split(' ')
            .filter(n => n.length > 0)
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
        elAvatar.textContent = initials || '??';
    }
}

window.saveUserProfile = () => {
    const name = document.getElementById('profile-name')?.value;
    const role = document.getElementById('profile-role')?.value;

    if (!name || !role) {
        alert("Preencha todos os campos do perfil.");
        return;
    }

    State.userProfile = { name, role };
    State.save();
    updateSidebarProfile();
    alert("Perfil atualizado com sucesso!");
};

window.forceSync = async () => {
    if (!window.accessToken) {
        alert("Por favor, conecte o Google Drive primeiro.");
        return;
    }

    const btn = document.querySelector('button[onclick="window.forceSync()"]');
    const originalText = btn.textContent;
    btn.textContent = "Sincronizando...";
    btn.disabled = true;

    try {
        await DriveManager.saveStateToCloud();
        alert("Dados sincronizados com sucesso no Google Drive!");
    } catch (e) {
        console.error(e);
        alert("Erro ao sincronizar. Verifique o console.");
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
};

function showConfirm(title, message, onConfirm) {
    const content = `
        <div style="text-align: center; padding: 10px 0;">
            <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">${message}</p>
        </div>
    `;
    openModal(title, content, () => {
        onConfirm();
        return true;
    });
}

// ── NAVIGATION ─────────────────────────────
const PageInfo = {
    dashboard: ['Dashboard', 'Monitoramento estratégico e operacional'],
    brand: ['Marca', 'Cultura, identidade e diretrizes'],
    personas: ['Público', 'Mapa de empatia e perfis de público'],
    analises: ['SWOT', 'Matrizes de planejamento estratégico'],
    conteudo: ['Calendário', 'Fluxo de produção de conteúdo'],
    kanban: ['Projetos', 'Gestão de tarefas e produtividade'],
    relatorios: ['Relatórios', 'Análise de performance e KPIs'],
    leads: ['Leads', 'Gestão de conversões sociais'],
    ads: ['Tráfego Pago (ADS)', 'Gestão de relatórios de anúncios'],
    clientes: ['Autorizações de Imagem', 'Gestão de ativos e conformidade'],
    senhas: ['Central de Senhas', 'Gestão segura de acessos e ferramentas'],
    seo: ['Inteligência de SEO', 'Relatórios de posicionamento e busca orgânica'],
    ads: ['Tráfego Pago', 'Relatórios de performance de anúncios'],
    equipe: ['Configurações', 'Acessos e preferências do sistema']
};

function navigate(pageId) {
    if (!PageInfo[pageId]) {
        console.warn(`Page ${pageId} not found in PageInfo`);
        return;
    }

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) targetPage.classList.add('active');
    
    const targetNav = document.querySelector(`[data-page="${pageId}"]`);
    if (targetNav) {
        targetNav.classList.add('active');
        // Auto-expand parent group if sub-item
        if (targetNav.classList.contains('sub-item')) {
            const group = targetNav.closest('.nav-group');
            if (group) group.classList.add('expanded');
        }
    }

    const titleEl = document.getElementById('topbar-title');
    if (titleEl) {
        titleEl.textContent = PageInfo[pageId][0];
    }

    State.activePage = pageId;
    renderPage(pageId);
}

window.changeMonth = (offset) => {
    const current = State.calendarViewDate;
    State.calendarViewDate = new Date(current.getFullYear(), current.getMonth() + offset, 1);
    renderPage('conteudo');
};

window.toggleTaskCompletion = (taskId) => {
    const idStr = String(taskId);
    let found = false;

    // 1. Kanban
    State.kanban.forEach((col, cIdx) => {
        const tIdx = (col.tasks || []).findIndex(t => String(t.id) === idStr);
        if (tIdx !== -1) {
            const task = col.tasks.splice(tIdx, 1)[0];
            if (cIdx === 3) {
                // Move back to "Em Produção" (index 2)
                State.kanban[2].tasks.push(task);
                task.status = 'producao';
            } else {
                // Move to "Concluído" (index 3)
                State.kanban[3].tasks.push(task);
                task.status = 'concluido';
            }
            found = true;
        }
    });

    // 2. Manual Calendar
    if (!found) {
        const mIdx = State.calendarTasks.findIndex(t => String(t.id) === idStr);
        if (mIdx !== -1) {
            State.calendarTasks[mIdx].completed = !State.calendarTasks[mIdx].completed;
        }
    }

    State.save();
    closeModal();
    renderPage(State.activePage);
};

window.toggleRecurringCompletion = (ruleIdx, dateStr) => {
    const rule = State.calendarRules[ruleIdx];
    if (!rule.completedDates) rule.completedDates = [];
    
    if (rule.completedDates.includes(dateStr)) {
        rule.completedDates = rule.completedDates.filter(d => d !== dateStr);
    } else {
        rule.completedDates.push(dateStr);
    }
    
    State.save();
    closeModal();
    renderPage('conteudo');
};

// ── RENDERERS ──────────────────────────────
function renderPage(pageId) {
    const viewport = document.getElementById(`page-${pageId}`);
    if (!viewport) return;

    if (Templates[pageId]) {
        if (pageId === 'analises' && State.activeSwotId) {
            const swot = State.swots.find(s => s.id === State.activeSwotId);
            if (swot) document.getElementById('topbar-title').textContent = swot.name;
        }
        
        viewport.innerHTML = typeof Templates[pageId] === 'function' 
            ? Templates[pageId](State) 
            : Templates[pageId];
        
        attachEventListeners(pageId);

        // Specific initialization for complex pages
        if (pageId === 'dashboard') {
            renderDashboardLogic();
        }
    }
}

function renderDashboardLogic() {
    const leads = State.leads || [];
    const calendarTasks = State.calendarTasks || [];
    
    // 1. Cronograma de Conteúdo
    const list = document.getElementById('upcoming-list');
    if (list) {
        const today = new Date();
        const futureTasks = calendarTasks
            .map(t => ({ ...t, dueDate: new Date(t.date || t.prazo) }))
            .filter(t => t.dueDate >= today)
            .sort((a, b) => a.dueDate - b.dueDate);

        if (futureTasks.length === 0) {
            list.innerHTML = '<div class="empty-state">Nenhum post agendado para os próximos dias.</div>';
        } else {
            const monthsShort = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            list.innerHTML = futureTasks.slice(0, 4).map(task => `
                <div class="upcoming-item">
                    <div class="date-box">
                        <span class="day">${task.dueDate.getDate()}</span>
                        <span class="month">${monthsShort[task.dueDate.getMonth()]}</span>
                    </div>
                    <div class="upcoming-details">
                        <span class="upcoming-title">${task.title}</span>
                        <span class="upcoming-tag">${task.type || 'Geral'}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    renderLeadsChart();
}

function renderLeadsChart() {
    const canvas = document.getElementById('leadsGrowthChart');
    if (!canvas) return;

    const leads = State.leads || [];
    if (leads.length === 0) return;

    // Process leads into cumulative growth data
    const countsByDate = {};
    leads.forEach(l => {
        const d = new Date(l.date).toISOString().split('T')[0];
        countsByDate[d] = (countsByDate[d] || 0) + 1;
    });

    const sortedDates = Object.keys(countsByDate).sort();
    let cumulative = 0;
    const labels = [];
    const dataPoints = [];

    sortedDates.forEach(d => {
        cumulative += countsByDate[d];
        labels.push(new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
        dataPoints.push(cumulative);
    });

    if (window.leadsChartInstance) window.leadsChartInstance.destroy();

    window.leadsChartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Crescimento de Leads',
                data: dataPoints,
                borderColor: '#FF5722',
                backgroundColor: 'rgba(255, 87, 34, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#FF5722'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { precision: 0 }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}


// Global helper for the checklist
window.completeTaskFromDash = function(taskId) {
    const taskIdx = State.kanban.findIndex(t => String(t.id) === String(taskId));
    if (taskIdx > -1) {
        State.kanban[taskIdx].status = 'done';
        State.save();
        renderDashboard();
    }
};

// ── ACTIONS & EVENTS ───────────────────────
// ── MODAL SYSTEM ───────────────────────────
function openModal(title, content, onSave, sizeOrWide = false) {
    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal-container');
    
    if (!overlay || !container) return;

    let sizeClass = '';
    if (sizeOrWide === true) sizeClass = 'wide';
    else if (typeof sizeOrWide === 'string') sizeClass = sizeOrWide;

    container.innerHTML = `
        <div class="modal-content ${sizeClass}">
            <div class="modal-header">
                <h3 class="card-title">${title}</h3>
                <button class="btn-icon" onclick="closeModal()">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div id="modal-body" class="modal-body">${content}</div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                <button class="btn btn-primary" id="modal-save-btn">OK</button>
            </div>
        </div>
    `;

    overlay.classList.add('active');
    
    const saveBtn = document.getElementById('modal-save-btn');
    if (saveBtn) {
        saveBtn.onclick = () => {
            const result = onSave();
            if (result !== false) closeModal();
        };
    }
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('active');
}

// ── STRATEGIC ACTIONS ──────────────────────
function createSwot() {
    const content = `
        <div class="form-group">
            <label class="form-label">Nome da Matriz</label>
            <input type="text" id="new-swot-name" class="form-input" placeholder="Ex: Lançamento Campinas 2026">
            <p class="form-hint">Dê um nome claro para identificar o contexto desta análise depois.</p>
        </div>
    `;
    
    openModal('Nova Matriz SWOT', content, () => {
        const name = document.getElementById('new-swot-name').value;
        if (!name) return false;
        
        const id = 'swot_' + Date.now();
        State.swots.push({ id, name, s: [], w: [], o: [], t: [] });
        State.activeSwotId = id;
        State.save();
        renderPage('analises');
        return true;
    });
}

function addSwotItem(type) {
    const guides = {
        s: "Foque em diferenciais internos: O que a LifeStars faz melhor? Quais recursos exclusivos temos?",
        w: "Seja honesto sobre pontos de melhoria: Onde perdemos vendas? O que é ineficiente hoje?",
        o: "Olhe para o mercado: Há novas tecnologias? Mudanças no comportamento dos idosos/famílias?",
        t: "Fatores externos de risco: Novos concorrentes? Mudanças na economia ou leis?"
    };

    const content = `
        <div class="guide-box"><p>${guides[type]}</p></div>
        <div class="form-group">
            <label class="form-label">Ponto Identificado</label>
            <textarea id="new-swot-item" class="form-textarea" placeholder="Descreva o ponto de forma clara e objetiva..."></textarea>
        </div>
    `;

    openModal('Adicionar Ponto SWOT', content, () => {
        const item = document.getElementById('new-swot-item').value;
        if (!item) return false;

        const swot = State.swots.find(s => s.id === State.activeSwotId);
        if (swot) {
            swot[type].push(item);
            State.save();
            renderPage('analises');
            return true;
        }
        return false;
    });
}

function addPersona() {
    let currentPhoto = "";
    const content = `
        <div style="display: grid; grid-template-columns: 180px 1fr; gap: 32px;">
            <div class="persona-sidebar">
                <label class="form-label">Representação Visual</label>
                <label class="persona-photo-upload" id="photo-preview-container">
                    <input type="file" id="p-photo-input" hidden accept="image/*">
                    <div id="photo-placeholder" style="text-align:center">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        <span>Adicionar Foto</span>
                    </div>
                </label>
                <p class="form-hint">Escolha uma foto que represente o estilo de vida da persona.</p>
            </div>
            
            <div class="persona-form-main">
                <div class="dashboard-grid" style="grid-template-columns: 2fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Nome Completo (ou apelido)</label>
                        <input type="text" id="p-nome" class="form-input" placeholder="Ex: Dona Helena">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Idade / Geração</label>
                        <input type="text" id="p-idade" class="form-input" placeholder="Ex: 75 anos (Boomer)">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Papel na Decisão</label>
                    <input type="text" id="p-sub" class="form-input" placeholder="Ex: O Idoso Ativo (Usuário do serviço)">
                </div>

                <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Dores e Desafios</label>
                        <textarea id="p-desc" class="form-textarea" placeholder="O que a preocupa no dia a dia?"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Objetivos e Sonhos</label>
                        <textarea id="p-objetivos" class="form-textarea" placeholder="O que ela quer conquistar?"></textarea>
                    </div>
                </div>

                <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Habilidades & Hábitos</label>
                        <textarea id="p-habitos" class="form-textarea" placeholder="O que ela faz? Como se informa?"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Por que a LifeStars?</label>
                        <textarea id="p-porque" class="form-textarea" placeholder="Qual o nosso valor único para ela?"></textarea>
                    </div>
                </div>
            </div>
        </div>
    `;

    openModal('Criação de Persona Estratégica', content, () => {
        const nome = document.getElementById('p-nome').value;
        const idade = document.getElementById('p-idade').value;
        const sub = document.getElementById('p-sub').value;
        const desc = document.getElementById('p-desc').value;
        const objetivos = document.getElementById('p-objetivos').value;
        const habitos = document.getElementById('p-habitos').value;
        const por_que = document.getElementById('p-porque').value;
        
        if (!nome || !sub) {
            alert("Nome e Papel são obrigatórios!");
            return false;
        }

        State.personas.push({ 
            id: Date.now(),
            nome, idade, sub, desc, objetivos, habitos, por_que, 
            foto: currentPhoto 
        });
        State.save();
        renderPage('personas');
        return true;
    }, true);

    // Setup Photo Preview inside modal after it's rendered
    const photoInput = document.getElementById('p-photo-input');
    if (photoInput) {
        photoInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentPhoto = event.target.result;
                    const container = document.getElementById('photo-preview-container');
                    container.innerHTML = `<img src="${currentPhoto}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        };
    }
}

function addClient() {
    let clientPhoto = null;
    let authFile = null;
    let temporaryLibrary = [];
    
    const renderModalContent = () => `
        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Foto do Paciente</label>
                <label class="client-photo-upload" id="photo-preview" style="${clientPhoto ? `background-image:url(${clientPhoto}); border:none; border-radius: 50%;` : 'border-radius: 50%;'}">
                    <input type="file" id="client-photo-input" hidden accept="image/*">
                    ${clientPhoto ? '' : '<div class="photo-placeholder">+</div>'}
                </label>
            </div>
            <div class="form-group">
                <label class="form-label">Nome do Paciente</label>
                <input type="text" id="c-name" class="form-input" placeholder="Ex: Maria Oliveira">
                
                <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px;">
                    <div>
                        <label class="form-label">Telefone Paciente</label>
                        <input type="text" id="c-phone" class="form-input" placeholder="(00) 00000-0000">
                    </div>
                    <div>
                        <label class="form-label">E-mail Paciente</label>
                        <input type="email" id="c-email" class="form-input" placeholder="paciente@email.com">
                    </div>
                </div>
            </div>
        </div>

        <div class="card mt-4" style="background: var(--bg-main); padding: 16px;">
            <h4 class="form-label" style="margin-bottom: 12px; color: var(--brand-primary);">Dados do Responsável (Cliente)</h4>
            <div class="form-group">
                <label class="form-label">Nome do Responsável</label>
                <input type="text" id="c-resp" class="form-input" placeholder="Ex: João Silva">
            </div>
            <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-group">
                    <label class="form-label">Cargo do Responsável</label>
                    <input type="text" id="c-resp-role" class="form-input" placeholder="Ex: Filho / Tutor / Curador">
                </div>
                <div class="form-group">
                    <label class="form-label">Telefone Responsável</label>
                    <input type="text" id="c-resp-phone" class="form-input" placeholder="(00) 00000-0000">
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">E-mail Responsável</label>
                    <input type="email" id="c-resp-email" class="form-input" placeholder="resp@email.com">
                </div>
            </div>
        </div>

        <div class="card mt-4" style="padding: 16px; border: 1px dashed var(--border-color);">
            <h4 class="form-label" style="margin-bottom: 12px; color: var(--brand-primary);">Autorizações</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <label class="check-item">
                    <input type="checkbox" id="c-auth-img" checked>
                    <span>Autorização de Uso de Imagem</span>
                </label>
                <label class="check-item">
                    <input type="checkbox" id="c-auth-name" checked>
                    <span>Autorização de Uso de Nome</span>
                </label>
                <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                    <label class="check-item" style="margin-bottom: 0;">
                        <input type="checkbox" id="c-auth-tag" checked onchange="window._toggleHandleField(this)">
                        <span>Autorização para Marcar nas Redes</span>
                    </label>
                    <input type="text" id="c-instagram" class="form-input" style="width: 180px; height: 32px; font-size: 13px;" placeholder="@usuario">
                </div>
            </div>
        </div>

        <div class="form-group mt-4">
            <label class="form-label">Arquivo de Autorização (Documento Assinado)</label>
            <label class="asset-upload-card" id="auth-preview">
                <input type="file" id="auth-file-input" hidden accept="image/*,.pdf">
                ${authFile ? `<span style="color:var(--success)">OK: ${authFile.name}</span>` : `
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>Upload do Documento</span>
                `}
            </label>
        </div>

        <div class="form-group mt-6">
            <label class="form-label">Biblioteca de Fotos Inicial</label>
            <div class="library-creation-grid" id="lib-creation-grid">
                ${temporaryLibrary.map((pic, idx) => `
                    <div class="lib-creation-item">
                        <img src="${pic.data}">
                        <button onclick="window._removeTempLib(${idx})">×</button>
                    </div>
                `).join('')}
                <label class="lib-creation-add">
                    <input type="file" id="lib-file-input" hidden accept="image/*" multiple>
                    <span>+ Foto</span>
                </label>
            </div>
        </div>
    `;

    window._tempLib = temporaryLibrary;
    window._removeTempLib = (idx) => {
        temporaryLibrary.splice(idx, 1);
        refreshModal();
    };

    window._toggleHandleField = (checkbox) => {
        const field = document.getElementById('c-instagram');
        if (field) field.style.display = checkbox.checked ? 'block' : 'none';
    };

    const refreshModal = () => {
        const modalBody = document.getElementById('modal-body');
        if (modalBody) {
            const vals = {
                name: document.getElementById('c-name')?.value,
                phone: document.getElementById('c-phone')?.value,
                email: document.getElementById('c-email')?.value,
                resp: document.getElementById('c-resp')?.value,
                respRole: document.getElementById('c-resp-role')?.value,
                respPhone: document.getElementById('c-resp-phone')?.value,
                respEmail: document.getElementById('c-resp-email')?.value,
                authImagem: document.getElementById('c-auth-img')?.checked,
                authNome: document.getElementById('c-auth-name')?.checked,
                authMarcar: document.getElementById('c-auth-tag')?.checked,
                instagram: document.getElementById('c-instagram')?.value
            };
            
            modalBody.innerHTML = renderModalContent();
            
            if (vals.name) document.getElementById('c-name').value = vals.name;
            if (vals.phone) document.getElementById('c-phone').value = vals.phone;
            if (vals.email) document.getElementById('c-email').value = vals.email;
            if (vals.resp) document.getElementById('c-resp').value = vals.resp;
            if (vals.respRole) document.getElementById('c-resp-role').value = vals.respRole;
            if (vals.respPhone) document.getElementById('c-resp-phone').value = vals.respPhone;
            if (vals.respEmail) document.getElementById('c-resp-email').value = vals.respEmail;
            if (vals.instagram) document.getElementById('c-instagram').value = vals.instagram;
            
            if (vals.authImagem !== undefined) document.getElementById('c-auth-img').checked = vals.authImagem;
            if (vals.authNome !== undefined) document.getElementById('c-auth-name').checked = vals.authNome;
            if (vals.authMarcar !== undefined) {
                const cb = document.getElementById('c-auth-tag');
                cb.checked = vals.authMarcar;
                window._toggleHandleField(cb);
            }
            
            setupListeners();
        }
    };

    const setupListeners = () => {
        const photoInput = document.getElementById('client-photo-input');
        const authInput = document.getElementById('auth-file-input');
        const libInput = document.getElementById('lib-file-input');
        
        if (photoInput) {
            photoInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { clientPhoto = ev.target.result; refreshModal(); };
                    reader.readAsDataURL(file);
                }
            };
        }
        if (authInput) {
            authInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { authFile = { name: file.name, data: ev.target.result }; refreshModal(); };
                    reader.readAsDataURL(file);
                }
            };
        }
        if (libInput) {
            libInput.onchange = (e) => {
                const files = Array.from(e.target.files);
                let loaded = 0;
                files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        temporaryLibrary.push({ name: file.name.split('.')[0], data: ev.target.result, posted: false });
                        loaded++;
                        if (loaded === files.length) refreshModal();
                    };
                    reader.readAsDataURL(file);
                });
            };
        }
    };

    openModal('Novo Cliente no Diretório', renderModalContent(), () => {
        const name = document.getElementById('c-name').value;
        const phone = document.getElementById('c-phone').value;
        const email = document.getElementById('c-email').value;
        const responsible = document.getElementById('c-resp').value;
        const respRole = document.getElementById('c-resp-role').value;
        const respPhone = document.getElementById('c-resp-phone').value;
        const respEmail = document.getElementById('c-resp-email').value;
        const authImagem = document.getElementById('c-auth-img').checked;
        const authNome = document.getElementById('c-auth-name').checked;
        const authMarcar = document.getElementById('c-auth-tag').checked;
        const instagram = document.getElementById('c-instagram').value;

        if (!name) return alert("O nome do paciente é obrigatório!");

        State.clients.unshift({
            id: String(Date.now()),
            name, phone, email,
            responsible, respRole, respPhone, respEmail,
            authImagem, authNome, authMarcar, instagram,
            photo: clientPhoto,
            auth: authFile,
            library: []
        });
        State.save();
        renderPage('clientes');
        return true;
    }, true);

    setTimeout(setupListeners, 100);
}

function deleteClient(id) {
    const client = State.clients.find(c => String(c.id) === String(id));
    if (!client) return;

    showConfirm("Excluir Conta", `Tem certeza que deseja remover permanentemente o cliente "${client.name}" e todos os seus arquivos do sistema e do Google Drive?`, async () => {
        // 1. Sync Delete with Cloud
        if (window.accessToken) {
            try {
                const rootId = await DriveManager.getOrCreateFolder('LifeStars_MarketingOS');
                const clientsId = await DriveManager.getOrCreateFolder('Clientes', rootId);
                await DriveManager.trashFolderByName(client.name, clientsId);
            } catch (err) {
                console.warn("Erro ao deletar pasta no Drive:", err);
            }
        }

        // 2. Local Delete
        State.clients = State.clients.filter(c => String(c.id) !== String(id));
        State.save();
        renderPage('clientes');
    });
}

function handleAssetUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            State.brand.ativos.push({ name: file.name, data: event.target.result });
            State.save();
            renderPage('brand');
        };
        reader.readAsDataURL(file);
    }
}

function saveStrategicInfo(section) {
    if (section === 'brand') {
        const historia = document.getElementById('brand-historia');
        const missao = document.getElementById('brand-missao');
        const visao = document.getElementById('brand-visao');
        const valores = document.getElementById('brand-valores');
        const fontes = document.getElementById('brand-fontes');
        
        if (historia) State.brand.historia = historia.value;
        if (missao) State.brand.missao = missao.value;
        if (visao) State.brand.visao = visao.value;
        if (valores) State.brand.valores = valores.value;
        if (fontes) State.brand.fontes = fontes.value;
    }
    State.save();
    alert('Informações de marca atualizadas com sucesso!');
    renderPage(State.activePage);
}

function attachEventListeners(pageId) {
    // Strategic Edits
    document.querySelectorAll('[data-save]').forEach(btn => {
        btn.onclick = () => saveStrategicInfo(btn.dataset.save);
    });

    // SWOT Management
    const btnCreateSwot = document.getElementById('btn-create-swot');
    if (btnCreateSwot) btnCreateSwot.onclick = createSwot;

    document.querySelectorAll('.btn-add-swot').forEach(btn => {
        btn.onclick = () => addSwotItem(btn.dataset.type);
    });

    // Persona Management
    const btnAddPersona = document.getElementById('btn-add-persona');
    if (btnAddPersona) btnAddPersona.onclick = addPersona;

    // Client Management
    const btnAddClient = document.getElementById('btn-add-client');
    if (btnAddClient) btnAddClient.onclick = addClient;

    // Asset Upload
    const assetUpload = document.getElementById('asset-upload');
    if (assetUpload) assetUpload.onchange = (e) => handleAssetUpload(e);

    // Task Management
    const btnAddKanban = document.getElementById('btn-add-kanban-task');
    if (btnAddKanban) btnAddKanban.onclick = addKanbanTask;

    const btnAddCal = document.getElementById('btn-add-cal-rule');
    if (btnAddCal) btnAddCal.onclick = addCalendarRule;

    // Card delegation for Clients
    if (pageId === 'clientes') {
        const viewport = document.getElementById(`page-${pageId}`);
        if (viewport) {
            viewport.querySelectorAll('.client-card').forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.getAttribute('data-client-id');
                    if (id) viewClientProfile(id);
                });
            });
        }
    }
}

function addKanbanTask() {
    const content = `
        <div class="form-group">
            <label class="form-label">Título da Tarefa</label>
            <input type="text" id="k-title" class="form-input" placeholder="Ex: Produção de Reels Semanal">
        </div>
        
        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Responsável Principal</label>
                <select id="k-resp" class="form-select">
                    <option value="Equipe Marketing">Equipe Marketing</option>
                    <option value="Design & Arte">Design & Arte</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Copywriting">Copywriting</option>
                    <option value="Tráfego Pago">Tráfego Pago</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Prioridade</label>
                <select id="k-prio" class="form-select">
                    <option value="baixa">Baixa (Rotina)</option>
                    <option value="media">Média (Prazos normais)</option>
                    <option value="alta">Alta (Urgente)</option>
                </select>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Prazo de Entrega</label>
                <input type="date" id="k-prazo" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Etapa do Fluxo</label>
                <select id="k-col" class="form-select">
                    <option value="1">Backlog Strategia</option>
                    <option value="2">A Fazer</option>
                    <option value="3">Em Produção</option>
                    <option value="4">Concluído</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Descrição & Briefing</label>
            <textarea id="k-obs" class="form-textarea" style="min-height: 120px;" placeholder="Detalhe os requisitos, links de referência e objetivos desta tarefa..."></textarea>
        </div>

        <div class="form-group">
            <label class="form-label">Tags / Categorias</label>
            <input type="text" id="k-tags" class="form-input" placeholder="Ex: Instagram, Ads, Institucional (separadas por vírgula)">
        </div>
    `;

    openModal('Novo Item Operacional', content, () => {
        const title = document.getElementById('k-title').value;
        const responsavel = document.getElementById('k-resp').value;
        const priority = document.getElementById('k-prio').value;
        const prazo = document.getElementById('k-prazo').value;
        const obs = document.getElementById('k-obs').value;
        const colId = parseInt(document.getElementById('k-col').value);
        const tags = document.getElementById('k-tags').value.split(',').map(t => t.trim()).filter(t => t);

        if (!title) return false;

        const targetCol = State.kanban.find(c => c.id === colId) || State.kanban[0];
        targetCol.tasks.push({ 
            id: Date.now(), 
            title, responsavel, priority, prazo, obs, tags,
            comments: [], files: []
        });
        State.save();
        renderPage('kanban');
        return true;
    }, true);
}


// Unification handled by openTaskModal

function addTaskComment(taskId) {
    const input = document.getElementById('new-comment');
    if (!input || !input.value.trim()) return;

    let task = null;
    State.kanban.forEach(col => {
        const t = col.tasks.find(t => t.id === taskId);
        if (t) task = t;
    });

    if (task) {
        if (!task.comments) task.comments = [];
        task.comments.push({
            author: "Usuário",
            date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
            text: input.value
        });
        State.save();
        editKanbanTask(taskId); // Re-render modal
    }
}

function handleTaskFileUpload(e, taskId) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        let task = null;
        State.kanban.forEach(col => {
            const t = col.tasks.find(t => t.id === taskId);
            if (t) task = t;
        });

        if (task) {
            if (!task.files) task.files = [];
            task.files.push({
                name: file.name,
                data: event.target.result
            });
            State.save();
            editKanbanTask(taskId); // Re-render modal
        }
    };
    reader.readAsDataURL(file);
}

function deleteTaskFile(taskId, fileIndex) {
    let task = null;
    State.kanban.forEach(col => {
        const t = col.tasks.find(t => t.id === taskId);
        if (t) task = t;
    });

    if (task && task.files) {
        task.files.splice(fileIndex, 1);
        State.save();
        editKanbanTask(taskId); // Re-render modal
    }
}

// Column Management
function addKanbanColumn() {
    const title = prompt("Nome da nova etapa do fluxo:");
    if (!title) return;

    State.kanban.push({
        id: Date.now(),
        title: title,
        tasks: []
    });
    State.save();
    renderPage('kanban');
}

function editKanbanColumn(colId) {
    const col = State.kanban.find(c => c.id === colId);
    if (!col) return;

    const newTitle = prompt("Novo nome para esta etapa:", col.title);
    if (newTitle) {
        col.title = newTitle;
        State.save();
        renderPage('kanban');
    }
}

function deleteKanbanColumn(colId) {
    const col = State.kanban.find(c => c.id === colId);
    if (!col) return;

    if (col.tasks.length > 0) {
        alert("Não é possível excluir uma coluna que contém tarefas. Mova as tarefas primeiro.");
        return;
    }

    if (confirm(`Excluir a etapa "${col.title}"?`)) {
        State.kanban = State.kanban.filter(c => c.id !== colId);
        State.save();
        renderPage('kanban');
    }
}



function deleteKanbanTask(taskId) {
    if (!confirm('Deseja realmente excluir esta tarefa?')) return;
    
    State.kanban.forEach(col => {
        col.tasks = col.tasks.filter(t => t.id !== taskId);
    });
    
    State.save();
    closeModal();
    renderPage('kanban');
}

// Drag & Drop Handlers
function onDragStartTask(e, taskId, colId) {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('fromColId', colId);
    e.target.classList.add('dragging');
}

function onDropTask(e, toColId) {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const fromColId = parseInt(e.dataTransfer.getData('fromColId'));
    
    document.querySelectorAll('.kanban-tasks').forEach(el => el.classList.remove('dragover'));

    if (fromColId === toColId) return;

    const fromCol = State.kanban.find(c => c.id === fromColId);
    const toCol = State.kanban.find(c => c.id === toColId);
    
    if (!fromCol || !toCol) return;

    const taskIndex = fromCol.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const [task] = fromCol.tasks.splice(taskIndex, 1);
    toCol.tasks.push(task);

    State.save();
    renderPage('kanban');
}


function addCalendarRule() {
    const content = `
        <div class="form-group">
            <label class="form-label">Tipo de Conteúdo</label>
            <input type="text" id="r-title" class="form-input" placeholder="Ex: Post Instagram">
        </div>
        <div class="form-group">
            <label class="form-label">Formato</label>
            <select id="r-type" class="form-select">
                <option value="post">Redes Sociais (Post)</option>
                <option value="blog">Blog / Artigo</option>
                <option value="email">E-mail Marketing</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Dias da Semana</label>
            <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:8px;">
                <label><input type="checkbox" name="r-days" value="1"> Seg</label>
                <label><input type="checkbox" name="r-days" value="2"> Ter</label>
                <label><input type="checkbox" name="r-days" value="3"> Qua</label>
                <label><input type="checkbox" name="r-days" value="4"> Qui</label>
                <label><input type="checkbox" name="r-days" value="5"> Sex</label>
                <label><input type="checkbox" name="r-days" value="6"> Sáb</label>
                <label><input type="checkbox" name="r-days" value="0"> Dom</label>
            </div>
        </div>
    `;

    openModal('Configurar Automação Editorial', content, () => {
        const title = document.getElementById('r-title').value;
        const type = document.getElementById('r-type').value;
        const checked = Array.from(document.querySelectorAll('input[name="r-days"]:checked')).map(el => parseInt(el.value));

        if (!title || checked.length === 0) return false;

        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const desc = `Toda ${checked.map(d => dayNames[d]).join(', ')}`;

        State.calendarRules.push({ title, type, days: checked, desc });
        State.save();
        renderPage('conteudo');
        return true;
    });
}

// ── CENTRALIZED TASK MANAGEMENT ──────────────────────────

// ── CENTRALIZED TASK MANAGEMENT ──────────────────────────

function openTaskModal(taskId = null, initialData = {}) {
    let task = null;
    let colIndex = -1;
    let isNew = taskId === null;

    if (!isNew) {
        const idStr = String(taskId);
        // Find existing task in Kanban
        State.kanban.forEach((col, cIdx) => {
            const tIdx = (col.tasks || []).findIndex(t => String(t.id) === idStr);
            if (tIdx !== -1) {
                task = col.tasks[tIdx];
                colIndex = cIdx;
            }
        });

        // If not found in Kanban, check manual calendarTasks
        if (!task) {
            const tIdx = State.calendarTasks.findIndex(t => String(t.id) === idStr);
            if (tIdx !== -1) task = State.calendarTasks[tIdx];
        }
    }

    // Default values for new task
    if (!task) {
        task = {
            id: Date.now(),
            title: initialData.title || "",
            responsavel: initialData.responsavel || "Equipe Marketing",
            priority: initialData.priority || "media",
            prazo: initialData.prazo || "",
            obs: initialData.obs || "",
            tags: initialData.tags || [],
            comments: [],
            files: [],
            status: initialData.status || "planejado",
            type: initialData.type || "post"
        };
    }

    const content = `
        <div class="form-group">
            <label class="form-label">Título do Projeto / Campanha</label>
            <input type="text" id="task-title" class="form-input" value="${task.title}" placeholder="Ex: Campanha de Inverno">
        </div>
        
        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Responsável Principal</label>
                <select id="task-resp" class="form-select">
                    <option value="Equipe Marketing" ${task.responsavel === 'Equipe Marketing' ? 'selected' : ''}>Equipe Marketing</option>
                    <option value="Design & Arte" ${task.responsavel === 'Design & Arte' ? 'selected' : ''}>Design & Arte</option>
                    <option value="Social Media" ${task.responsavel === 'Social Media' ? 'selected' : ''}>Social Media</option>
                    <option value="Copywriting" ${task.responsavel === 'Copywriting' ? 'selected' : ''}>Copywriting</option>
                    <option value="Tráfego Pago" ${task.responsavel === 'Tráfego Pago' ? 'selected' : ''}>Tráfego Pago</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Prioridade</label>
                <select id="task-prio" class="form-select">
                    <option value="baixa" ${task.priority === 'baixa' ? 'selected' : ''}>Baixa (Rotina)</option>
                    <option value="media" ${task.priority === 'media' ? 'selected' : ''}>Média (Prazos normais)</option>
                    <option value="alta" ${task.priority === 'alta' ? 'selected' : ''}>Alta (Urgente)</option>
                </select>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Prazo de Entrega</label>
                <input type="date" id="task-prazo" class="form-input" value="${task.prazo || ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Categoria / Tipo</label>
                <select id="task-type" class="form-select">
                    <option value="post" ${task.type === 'post' ? 'selected' : ''}>Post Redes Sociais</option>
                    <option value="blog" ${task.type === 'blog' ? 'selected' : ''}>Blog / Artigo</option>
                    <option value="email" ${task.type === 'email' ? 'selected' : ''}>E-mail Marketing</option>
                    <option value="ads" ${task.type === 'ads' ? 'selected' : ''}>Anúncio (Ads)</option>
                    <option value="outro" ${task.type === 'outro' ? 'selected' : ''}>Outro</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Descrição & Briefing Estratégico</label>
            <textarea id="task-obs" class="form-textarea" style="min-height: 120px;" placeholder="Detalhes, links, referências...">${task.obs || ''}</textarea>
        </div>

        <div class="form-group">
            <label class="form-label">Tags (separadas por vírgula)</label>
            <input type="text" id="task-tags" class="form-input" value="${(task.tags || []).join(', ')}">
        </div>

        <!-- Comments & Files only for existing tasks or advanced new tasks -->
        <div class="task-modal-section">
            <h4 class="section-title">Comentários e Histórico</h4>
            <div class="comments-list">
                ${(task.comments || []).map(c => `
                    <div class="comment-item">
                        <div class="comment-header"><strong>${c.author}</strong> <span>${c.date}</span></div>
                        <p>${c.text}</p>
                    </div>
                `).join('')}
            </div>
            <div class="add-comment">
                <input type="text" id="new-task-comment" class="form-input" placeholder="Adicionar observação...">
                <button class="btn btn-primary btn-sm" onclick="addTaskCommentGeneric('${task.id}')">Postar</button>
            </div>
        </div>

        <div class="task-modal-section mt-4">
            <h4 class="section-title">Arquivos e Anexos</h4>
            <div class="files-list">
                ${(task.files || []).map((f, i) => `
                    <div class="file-attachment">
                        <div class="file-info">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                            <span>${f.name}</span>
                        </div>
                        <div class="file-actions">
                            <a href="${f.data}" download="${f.name}" class="btn-icon">Download</a>
                            <button onclick="deleteTaskFileGeneric('${task.id}', ${i})" class="btn-icon">×</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <label class="btn btn-secondary btn-block mt-2">
                <input type="file" hidden onchange="handleTaskFileUploadGeneric(event, '${task.id}')">
                Anexar Documento
            </label>
        </div>
        
        ${!isNew ? `
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <button class="btn" style="color: var(--error); border-color: var(--error); padding: 8px 16px;" onclick="deleteTaskGeneric('${task.id}')">Excluir Permanente</button>
            <button class="btn btn-primary" style="background: #4CAF82; border-color: #4CAF82;" onclick="window.toggleTaskCompletion('${task.id}')">
                ${colIndex === 3 || task.completed ? '✓ Reabrir Tarefa' : '✓ Concluir Projeto / Postagem'}
            </button>
        </div>
        ` : ''}
    `;

    openModal(isNew ? 'Novo Projeto / Tarefa' : 'Detalhes do Projeto', content, () => {
        task.title = document.getElementById('task-title').value;
        task.responsavel = document.getElementById('task-resp').value;
        task.priority = document.getElementById('task-prio').value;
        task.prazo = document.getElementById('task-prazo').value;
        task.obs = document.getElementById('task-obs').value;
        task.type = document.getElementById('task-type').value;
        task.tags = document.getElementById('task-tags').value.split(',').map(t => t.trim()).filter(t => t);

        if (!task.title) return false;

        if (isNew) {
            let targetCol = initialData.colIndex !== undefined ? initialData.colIndex : 0;
            // Ensure column exists
            if (State.kanban[targetCol]) {
                State.kanban[targetCol].tasks.push(task);
            } else {
                State.kanban[0].tasks.push(task);
            }
        }

        State.save();
        renderPage(State.activePage);
        return true;
    }, true);
}

window.openRecurringModal = (ruleIdx, dateStr) => {
    const rule = State.calendarRules[ruleIdx];
    const isCompleted = (rule.completedDates || []).includes(dateStr);
    const [y, m, d] = dateStr.split('-');
    const formattedDate = `${d}/${m}/${y}`;

    const content = `
        <div class="guide-box">
            <h4 class="card-title" style="color: var(--brand-primary); margin-bottom: 8px;">Regra Recorrente</h4>
            <p style="font-size: 14px; color: var(--text-muted);">${rule.desc || 'Tarefa programada automaticamente.'}</p>
        </div>
        <div class="card mb-4" style="background: var(--bg-main);">
            <p><strong>Evento:</strong> ${rule.title}</p>
            <p><strong>Data:</strong> ${formattedDate}</p>
            <p><strong>Status:</strong> ${isCompleted ? '<span style="color: var(--success)">Concluído</span>' : '<span style="color: var(--warning)">Pendente</span>'}</p>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
            <button class="btn btn-primary" style="background: ${isCompleted ? 'var(--text-light)' : '#4CAF82'}; border-color: ${isCompleted ? 'var(--text-light)' : '#4CAF82'};" 
                    onclick="window.toggleRecurringCompletion(${ruleIdx}, '${dateStr}')">
                ${isCompleted ? 'Marcar como Pendente' : '✓ Marcar como Concluído'}
            </button>
        </div>
    `;

    openModal('Detalhes da Recorrência', content, () => true);
};

// Expose to window for inline onclick access
window.openTaskModal = openTaskModal;

function addCalendarTask(day) {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const deadline = `${now.getFullYear()}-${month}-${dayStr}`;
    
    openTaskModal(null, { prazo: deadline });
}
window.addCalendarTask = addCalendarTask;

function editKanbanTask(taskId) {
    openTaskModal(taskId);
}
window.editKanbanTask = editKanbanTask;

// Generic handlers for comments/files in unified modal
function addTaskCommentGeneric(taskId) {
    const idStr = String(taskId);
    const input = document.getElementById('new-task-comment');
    if (!input || !input.value.trim()) return;

    let task = null;
    State.kanban.forEach(col => {
        const t = (col.tasks || []).find(t => String(t.id) === idStr);
        if (t) task = t;
    });
    if (!task) task = State.calendarTasks.find(t => String(t.id) === idStr);

    if (task) {
        if (!task.comments) task.comments = [];
        task.comments.push({
            author: "Você",
            date: new Date().toLocaleString('pt-BR'),
            text: input.value.trim()
        });
        State.save();
        openTaskModal(idStr); // Re-open to refresh view
    }
}
window.addTaskCommentGeneric = addTaskCommentGeneric;

function deleteTaskGeneric(taskId) {
    const idStr = String(taskId);
    if (!confirm('Deseja excluir este projeto permanentemente?')) return;
    
    State.kanban.forEach(col => {
        col.tasks = (col.tasks || []).filter(t => String(t.id) !== idStr);
    });
    State.calendarTasks = State.calendarTasks.filter(t => String(t.id) !== idStr);
    
    State.save();
    closeModal();
    renderPage(State.activePage);
}
window.deleteTaskGeneric = deleteTaskGeneric;

function handleTaskFileUploadGeneric(event, taskId) {
    const idStr = String(taskId);
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        let task = null;
        State.kanban.forEach(col => {
            const t = (col.tasks || []).find(t => String(t.id) === idStr);
            if (t) task = t;
        });
        if (!task) task = State.calendarTasks.find(t => String(t.id) === idStr);

        if (task) {
            if (!task.files) task.files = [];
            task.files.push({
                name: file.name,
                data: e.target.result,
                date: new Date().toLocaleString('pt-BR')
            });
            State.save();
            openTaskModal(idStr);
        }
    };
    reader.readAsDataURL(file);
}
window.handleTaskFileUploadGeneric = handleTaskFileUploadGeneric;

function deleteTaskFileGeneric(taskId, fileIndex) {
    const idStr = String(taskId);
    let task = null;
    State.kanban.forEach(col => {
        const t = (col.tasks || []).find(t => String(t.id) === idStr);
        if (t) task = t;
    });
    if (!task) task = State.calendarTasks.find(t => String(t.id) === idStr);

    if (task && task.files) {
        task.files.splice(fileIndex, 1);
        State.save();
        openTaskModal(idStr);
    }
}
window.deleteTaskFileGeneric = deleteTaskFileGeneric;

function syncGoogleCalendar() {
    openModal('Integração Google Calendar', `
        <div style="text-align:center; padding: 20px;">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" style="color: #4285F4; margin-bottom: 16px;"><path d="M12.48 10.92v3.28h4.74c-.2 1.06-.9 1.95-2.02 2.71l2.72 2.11c1.6-1.48 2.53-3.66 2.53-6.24 0-.54-.05-1.07-.14-1.58h-7.83z"/><path d="M12.48 24c3.24 0 5.95-1.08 7.93-2.92l-2.72-2.11c-1.1.74-2.5 1.18-5.21 1.18-3.99 0-7.35-2.69-8.56-6.33L1.13 16.2c2.03 4.19 6.38 7.8 11.35 7.8z"/><path d="M3.92 13.82c-.31-.92-.48-1.9-.48-2.92s.17-2 .48-2.92l-2.79-2.16C.41 7.42 0 9.17 0 10.9s.41 3.48 1.13 5.08l2.79-2.16z"/><path d="M12.48 4.75c1.76 0 3.35.61 4.6 1.8l3.42-3.42C18.43 1.11 15.72 0 12.48 0 7.51 0 3.16 3.61 1.13 7.8l2.79 2.16c1.21-3.64 4.57-6.33 8.56-6.33z"/></svg>
            <h3 style="font-weight: 700;">Conectar LifeStars Agenda</h3>
            <p style="color: var(--text-light); font-size: 14px; margin-top: 8px;">Deseja autorizar o Marketing OS a sincronizar o calendário editorial com sua conta Google?</p>
        </div>
    `, () => {
        alert("Simulação de Integração: O sistema redirecionaria para o Google OAuth.");
        return true;
    });
}

// ── INITIALIZATION ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    DriveManager.init(); // Start in background, don't block UI
    const now = new Date();
    const dateEl = document.getElementById('topbar-date');
    if (dateEl) dateEl.textContent = now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.getAttribute('data-page');
            if (pageId === 'analises') State.activeSwotId = null;
            navigate(pageId);
        });
    });




    updateSidebarProfile();
    navigate('dashboard');
    renderPage('dashboard');
});

window.switchPerformanceTab = (tab) => {
    document.querySelectorAll('.perf-module').forEach(m => m.style.display = 'none');
    document.querySelectorAll('.perf-tab').forEach(t => t.classList.remove('active'));
    
    const content = document.getElementById(`perf-${tab}-content`);
    const btn = document.getElementById(`tab-${tab}-btn`);
    
    if (content) content.style.display = 'block';
    if (btn) btn.classList.add('active');
};

window.openLeadModal = (idx = null) => {
    const isEdit = idx !== null;
    const lead = isEdit ? State.leads[idx] : null;
    
    const content = `
        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Nome do Lead</label>
                <input type="text" id="lead-name" class="form-input" value="${lead ? lead.name : ''}" placeholder="Ex: Maria Oliveira">
            </div>
            <div class="form-group">
                <label class="form-label">Origem do Contato</label>
                <input type="text" id="lead-origin" class="form-input" value="${lead ? (lead.origin || '') : ''}" placeholder="Ex: Instagram Campinas">
            </div>
        </div>
        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Telefone / WhatsApp</label>
                <input type="text" id="lead-phone" class="form-input" value="${lead ? lead.phone : ''}" placeholder="(11) 99999-9999">
            </div>
            <div class="form-group">
                <label class="form-label">Data de Contato</label>
                <input type="date" id="lead-date" class="form-input" value="${lead ? lead.date : new Date().toISOString().split('T')[0]}">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Captura da Conversa (Print)</label>
            <div class="upload-area" onclick="document.getElementById('lead-print-input').click()">
                <input type="file" id="lead-print-input" hidden accept="image/*" onchange="window.handleLeadPrintUpload(this, '${isEdit ? idx : ''}')">
                <div id="lead-print-preview-box" class="placeholder-container">
                    ${(lead && lead.image) ? `<img src="${lead.image}" style="width:100%; height:120px; object-fit:cover; border-radius:8px;">` : `
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <p>Clique para subir ou trocar o print</p>
                    `}
                </div>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Status do Atendimento</label>
            <select id="lead-sent" class="form-select">
                <option value="no" ${lead && !lead.sentDate ? 'selected' : ''}>Ainda não encaminhado</option>
                <option value="yes" ${lead && lead.sentDate ? 'selected' : ''}>Encaminhado para Comercial</option>
            </select>
        </div>
    `;

    openModal(isEdit ? 'Editar Lead' : 'Registrar Novo Lead', content, () => {
        const name = document.getElementById('lead-name').value;
        const origin = document.getElementById('lead-origin').value;
        const phone = document.getElementById('lead-phone').value;
        const date = document.getElementById('lead-date').value;
        const sent = document.getElementById('lead-sent').value;
        const image = window.currentLeadPrint || (lead ? lead.image : null);
        const imageDriveUrl = window.currentLeadDriveUrl || (lead ? lead.imageDriveUrl : null);

        if (!name) return alert('Nome é obrigatório');

        const newLead = {
            name, origin, phone, date, image, imageDriveUrl,
            sentDate: sent === 'yes' ? (lead && lead.sentDate ? lead.sentDate : new Date().toISOString()) : null
        };

        if (isEdit) {
            State.leads[idx] = newLead;
        } else {
            State.leads.unshift(newLead);
        }

        State.save();
        renderPage('metricas');
        window.currentLeadPrint = null;
        window.currentLeadDriveUrl = null;
    });
};

window.handleLeadPrintUpload = async (input) => {
    const file = input.files[0];
    if (!file) return;

    try {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const thumb = await compressImage(e.target.result, 400, 400);
            window.currentLeadPrint = thumb;
            const box = document.getElementById('lead-print-preview-box');
            if (box) box.innerHTML = `<img src="${thumb}" style="width:100%; height:120px; object-fit:cover; border-radius:8px;">`;

            if (window.accessToken) {
                const rootId = await DriveManager.getOrCreateFolder('LifeStars_MarketingOS');
                const perfId = await DriveManager.getOrCreateFolder('Performance_Leads', rootId);
                const capsId = await DriveManager.getOrCreateFolder('Capturas', perfId);
                const leadName = document.getElementById('lead-name')?.value || 'Lead_Sem_Nome';
                const leadFolderId = await DriveManager.getOrCreateFolder(leadName, capsId);
                
                const driveFile = await DriveManager.uploadFile(file, leadFolderId);
                window.currentLeadDriveUrl = driveFile.webViewLink;
            }
        };
        reader.readAsDataURL(file);
    } catch (err) {
        console.error("Erro no upload do print:", err);
        alert("Falha ao salvar captura no Drive.");
    }
};

window.deleteLead = (idx) => {
    showConfirm("Excluir Lead", "Deseja remover permanentemente este lead do registro?", () => {
        State.leads.splice(idx, 1);
        State.save();
        renderPage('metricas');
    });
};

window.viewLeadPrint = (img) => {
    if (!img || img === 'null') return;
    const content = `<div style="text-align:center;"><img src="${img}" style="width:100%; border-radius:12px; box-shadow: var(--shadow-md); display: block;"></div>`;
    openModal('Captura do Lead', content, null, 'xl');
};

window.filterClients = () => {
    const term = document.getElementById('client-search-input')?.value.toLowerCase() || '';
    const grid = document.getElementById('clients-grid-container');
    if (!grid) return;

    const filtered = State.clients.filter(c => {
        return c.name.toLowerCase().includes(term) || 
               (c.responsible && c.responsible.toLowerCase().includes(term));
    });

    grid.innerHTML = filtered.length === 0 ? 
        `<div class="card full-width empty-state"><p>Nenhum cliente corresponde à pesquisa.</p></div>` : 
        filtered.map(c => `
            <div class="card client-card premium-card" data-client-id="${c.id}">
                <div class="client-card-header">
                    <div class="client-avatar-wrapper">
                        <div class="client-avatar-main" style="${c.photo ? `background-image: url(${c.photo})` : 'background: var(--brand-primary); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:20px;'}">
                            ${c.photo ? '' : (c.name || '??').substring(0,2).toUpperCase()}
                        </div>
                        <div class="client-badge-status ${c.auth ? 'active' : 'pending'}"></div>
                    </div>
                    <button class="btn-delete-client" onclick="event.stopPropagation(); window.deleteClient('${c.id}')">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
                
                <div class="client-card-body">
                    <h4 class="client-card-name">${c.name}</h4>
                    <p class="client-card-resp">${c.responsible || 'Sem responsável'}</p>
                    
                    <div class="client-card-stats">
                        <div class="stat-item">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <span>${(c.library || []).length} ativos</span>
                        </div>
                        <div class="stat-item">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            <span>${c.auth ? 'Autorizado' : 'Pendente'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    
    setupListeners(); // Re-attach click listeners for client cards
};

window.filterLeads = () => {
    const term = document.getElementById('lead-search-input')?.value.toLowerCase() || '';
    const tbody = document.getElementById('leads-tbody');
    if (!tbody) return;
    
    const filtered = State.leads.filter(l => {
        return l.name.toLowerCase().includes(term) || 
               l.phone.toLowerCase().includes(term) || 
               (l.origin && l.origin.toLowerCase().includes(term));
    });

    tbody.innerHTML = filtered.length === 0 ? 
        `<tr><td colspan="7" class="empty-leads">Nenhum lead corresponde à pesquisa.</td></tr>` : 
        filtered.map((l) => {
            const realIdx = State.leads.indexOf(l);
            return `
                <tr>
                    <td><strong>${l.name}</strong></td>
                    <td><span class="lead-origin-tag">${l.origin || 'Não definida'}</span></td>
                    <td>${l.phone}</td>
                    <td>${new Date(l.date).toLocaleDateString('pt-BR')}</td>
                    <td>
                        <div class="lead-print-preview" onclick="viewLeadPrint('${l.imageDriveUrl || l.image}')">
                            ${l.image ? `<img src="${l.image}">` : 'Sem print'}
                        </div>
                    </td>
                    <td>
                        <div class="status-badge ${l.sentDate ? 'sent' : 'pending'}">
                            ${l.sentDate ? 'Enviado' : 'Pendente'}
                        </div>
                    </td>
                    <td>
                        <div style="display:flex; gap:8px;">
                            <button class="btn-icon-clean" onclick="window.openLeadModal(${realIdx})">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button class="btn-icon-clean" onclick="deleteLead(${realIdx})">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
};

window.State = State;
    window.navigate = navigate;
    window.renderPage = renderPage;
    window.closeModal = closeModal;
    window.addCalendarTask = addCalendarTask;
    window.syncGoogleCalendar = syncGoogleCalendar;
    window.onDragStartTask = onDragStartTask;
    window.onDropTask = onDropTask;
    window.editKanbanTask = editKanbanTask;
    window.deleteKanbanTask = deleteKanbanTask;
    window.addTaskComment = addTaskComment;
    window.handleTaskFileUpload = handleTaskFileUpload;
    window.deleteTaskFile = deleteTaskFile;
    window.addKanbanColumn = addKanbanColumn;
    window.editKanbanColumn = editKanbanColumn;
// Reports Management
function addReport() {
    let reportFile = null;
    let parsedData = null;

    const content = `
        <div class="form-group">
            <label class="form-label">Título do Relatório</label>
            <input type="text" id="rep-title" class="form-input" placeholder="Ex: Relatório Mensal - Maio 2024">
        </div>
        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Tipo de Relatório</label>
                <select id="rep-type" class="form-select">
                    <option value="Midia Social">Mídia Social</option>
                    <option value="SEO">SEO / Google Search</option>
                    <option value="Trafego Pago">Tráfego Pago (Ads)</option>
                    <option value="Geral">Métricas Gerais</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Data de Referência</label>
                <input type="month" id="rep-date" class="form-input">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Principais Insights / Resumo</label>
            <textarea id="rep-insights" class="form-textarea" style="height: 120px;" placeholder="Destaque os números principais ou conclusões..."></textarea>
        </div>
        <div class="form-group">
            <label class="form-label">Arquivo / Relatório (Imagem, PDF ou CSV)</label>
            <label class="asset-upload-card" id="rep-file-preview" style="cursor: pointer; border: 2px dashed var(--border-color); padding: 32px; border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; gap: 12px; transition: 0.2s;">
                <input type="file" id="rep-file-input" hidden accept="image/*,.pdf,.csv">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--text-light)" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span style="color: var(--text-muted); font-weight: 600;">Upload do Documento</span>
                <p style="font-size: 11px; color: var(--text-light); text-align: center;">CSV suportado: Google Ads, Meta Ads e Search Console</p>
            </label>
        </div>
    `;

    openModal('Novo Relatório Inteligente', content, () => {
        const title = document.getElementById('rep-title').value;
        const type = document.getElementById('rep-type').value;
        const date = document.getElementById('rep-date').value;
        const insights = document.getElementById('rep-insights').value;

        if (!title || (!reportFile && !parsedData)) {
            alert("Título e Arquivo são obrigatórios!");
            return false;
        }

        const newReport = {
            id: 'rep_' + Date.now(),
            title, type, date, insights,
            file: reportFile,
            parsedData,
            image: reportFile && reportFile.type && reportFile.type.startsWith('image/') ? reportFile.data : null
        };
        
        State.reports.push(newReport);
        State.save();
        renderPage('relatorios');
        return true;
    }, true);

    // File handling inside modal
    setTimeout(() => {
        const fileInput = document.getElementById('rep-file-input');
        if (fileInput) {
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const content = event.target.result;
                        
                        if (file.name.endsWith('.csv')) {
                            parsedData = parseCSVReport(content);
                            const preview = document.getElementById('rep-file-preview');
                            preview.style.borderColor = "var(--info)";
                            preview.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--info)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            <span style="color:var(--info); font-weight: 700;">CSV PARSADO: ${file.name}</span>
                            <p style="font-size: 11px;">Identificamos ${parsedData.campaigns.length} campanhas/linhas.</p>`;
                        } else {
                            reportFile = { name: file.name, data: content, type: file.type };
                            const preview = document.getElementById('rep-file-preview');
                            preview.style.borderColor = "var(--success)";
                            preview.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style="color:var(--success); font-weight: 700;">${file.name} carregado</span>`;
                        }
                    };
                    if (file.name.endsWith('.csv')) reader.readAsText(file);
                    else reader.readAsDataURL(file);
                }
            };
        }
    }, 100);
}

function parseCSVReport(csvText) {
    const allLines = csvText.split('\n').map(l => l.trim()).filter(l => l);
    if (allLines.length < 2) return { campaigns: [], summary: {} };

    // Detect separator
    const firstLine = allLines[0];
    const sep = firstLine.includes(';') ? ';' : ',';

    // Find the header row (sometimes Ads has metadata in the first few lines)
    let headerIdx = -1;
    for (let i = 0; i < Math.min(10, allLines.length); i++) {
        const h = allLines[i].toLowerCase();
        if ((h.includes('campanha') || h.includes('campaign')) && 
            (h.includes('clique') || h.includes('click') || h.includes('custo') || h.includes('cost'))) {
            headerIdx = i;
            break;
        }
    }

    if (headerIdx === -1) headerIdx = 0; // Fallback to first line
    
    const headers = allLines[headerIdx].split(sep).map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const findCol = (keywords) => headers.findIndex(h => keywords.some(k => h.includes(k)));
    
    const idx = {
        campaign: findCol(['campaign', 'campanha', 'nome']),
        clicks: findCol(['click', 'clique']),
        impressions: findCol(['impres', 'exibição', 'exibicao']),
        cost: findCol(['cost', 'custo', 'valor', 'invest']),
        conversions: findCol(['conv', 'conversão', 'conversao']),
        ctr: findCol(['ctr', 'taxa de cliq'])
    };

    const dataLines = allLines.slice(headerIdx + 1);
    const campaigns = dataLines.map(l => {
        const cols = l.split(sep).map(c => c.trim().replace(/"/g, ''));
        if (cols.length < headers.length * 0.5) return null; // Skip malformed lines

        const name = cols[idx.campaign] || 'Campanha';
        if (name.toLowerCase().includes('total') || name.toLowerCase().includes('resumo')) return null;

        const clicksStr = (cols[idx.clicks] || '0').replace(/\D/g, '');
        const clicks = parseInt(clicksStr) || 0;
        
        const impressionsStr = (cols[idx.impressions] || '0').replace(/\D/g, '');
        const impressions = parseInt(impressionsStr) || 0;
        
        const costStr = cols[idx.cost] || '0';
        const cost = parseFloat(costStr.replace(/\./g, '').replace(',', '.')) || parseFloat(costStr.replace(/[^0-9.]/g, '')) || 0;
        
        const convStr = (cols[idx.conversions] || '0').replace(/[^0-9.,]/g, '').replace(',', '.');
        const conversions = parseFloat(convStr) || 0;
        
        const ctr = cols[idx.ctr] || (impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) + '%' : '0%');

        return { name, clicks, impressions, cost, conversions, ctr };
    }).filter(c => c && (c.clicks > 0 || c.cost > 0));

    const summary = {
        totalClicks: campaigns.reduce((acc, c) => acc + c.clicks, 0),
        totalImpressions: campaigns.reduce((acc, c) => acc + c.impressions, 0),
        totalCost: campaigns.reduce((acc, c) => acc + c.cost, 0),
        totalConversions: campaigns.reduce((acc, c) => acc + c.conversions, 0)
    };

    return { campaigns, summary };
}

function viewReport(id, index) {
    console.log("Viewing report:", id, index);
    
    // Defensive finding
    let report = null;
    if (id && id !== 'undefined') {
        report = State.reports.find(r => String(r.id) === String(id));
    }
    
    if (!report && index !== undefined && State.reports[index]) {
        report = State.reports[index];
    }
    
    if (!report) {
        console.error("Report not found:", id, index);
        alert("Ops! Não conseguimos encontrar este relatório. Tente recarregar a página.");
        return;
    }

    let visualContent = '';
    
    if (report.parsedData) {
        const s = report.parsedData.summary;
        visualContent = `
            <div class="kpi-grid" style="margin-bottom: 32px;">
                <div class="kpi-card">
                    <span class="kpi-label">Cliques Totais</span>
                    <span class="kpi-value">${(s.totalClicks || 0).toLocaleString()}</span>
                </div>
                <div class="kpi-card">
                    <span class="kpi-label">Impressões</span>
                    <span class="kpi-value">${(s.totalImpressions || 0).toLocaleString()}</span>
                </div>
                <div class="kpi-card">
                    <span class="kpi-label">Custo Total</span>
                    <span class="kpi-value">R$ ${(s.totalCost || 0).toFixed(2)}</span>
                </div>
                <div class="kpi-card">
                    <span class="kpi-label">Conversões</span>
                    <span class="kpi-value">${s.totalConversions || 0}</span>
                </div>
            </div>
            
            <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--border-color);">
                <table class="leads-table" style="width: 100%; border-collapse: collapse;">
                    <thead style="background: var(--bg-main);">
                        <tr>
                            <th style="padding: 12px; text-align: left; font-size: 12px;">Campanha</th>
                            <th style="padding: 12px; text-align: right; font-size: 12px;">Cliques</th>
                            <th style="padding: 12px; text-align: right; font-size: 12px;">CTR</th>
                            <th style="padding: 12px; text-align: right; font-size: 12px;">Custo</th>
                            <th style="padding: 12px; text-align: right; font-size: 12px;">Conv.</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(report.parsedData.campaigns || []).map(c => `
                            <tr style="border-top: 1px solid var(--border-color);">
                                <td style="padding: 12px; font-weight: 600;">${c.name}</td>
                                <td style="padding: 12px; text-align: right;">${c.clicks}</td>
                                <td style="padding: 12px; text-align: right;">${c.ctr}</td>
                                <td style="padding: 12px; text-align: right;">R$ ${c.cost.toFixed(2)}</td>
                                <td style="padding: 12px; text-align: right;">${c.conversions}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else if (report.file) {
        const isImage = report.file.type && report.file.type.startsWith('image/');
        visualContent = `
            <div class="pres-section">
                <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-light); margin-bottom: 16px;">Documento do Relatório</h4>
                ${isImage ? `
                    <div class="pres-image-container" style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color); box-shadow: var(--shadow-md);">
                        <img src="${report.file.data}" alt="Relatório" style="width: 100%; height: auto; display: block;">
                    </div>
                ` : `
                    <div class="pres-file-box" style="padding: 48px; background: var(--bg-main); border-radius: var(--radius-md); text-align: center; border: 1.5px dashed var(--border-color);">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--text-light)" stroke-width="1.5" style="margin-bottom: 16px;"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                        <p style="margin-bottom: 24px; font-weight: 600;">${report.file.name}</p>
                        <a href="${report.file.data}" download="${report.file.name}" class="btn btn-primary">Download do Documento</a>
                    </div>
                `}
            </div>
        `;
    } else {
        visualContent = `<div class="empty-state">Este relatório não contém dados visualizáveis ou arquivos anexados.</div>`;
    }

    const content = `
        <div class="report-presentation" style="padding: 24px;">
            <div class="report-pres-header" style="margin-bottom: 32px; border-bottom: 1px solid var(--border-color); padding-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <span class="report-tag" style="background: var(--brand-primary-soft); color: var(--brand-primary-dark); padding: 4px 12px; border-radius: 6px; font-weight: 800; text-transform: uppercase; font-size: 11px;">${report.type || 'Geral'}</span>
                        <h2 class="pres-title" style="font-size: 32px; font-weight: 800; margin-top: 12px; letter-spacing: -0.02em;">${report.title}</h2>
                        <p class="pres-date" style="color: var(--text-light); margin-top: 4px;">Ref: ${report.date || 'N/A'}</p>
                    </div>
                    <div style="text-align: right;">
                        <button class="btn btn-secondary" onclick="window.print()">Exportar PDF</button>
                    </div>
                </div>
            </div>
            
            <div class="report-pres-body">
                <div class="pres-section" style="margin-bottom: 40px;">
                    <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-light); margin-bottom: 16px;">Resumo & Insights</h4>
                    <p class="pres-text" style="line-height: 1.6; color: var(--text-muted); font-size: 16px; background: #fff; padding: 20px; border-radius: var(--radius-md); border-left: 4px solid var(--brand-primary);">${report.insights || 'Nenhum insight registrado.'}</p>
                </div>
                
                ${visualContent}
            </div>
            
            <div class="report-pres-footer" style="margin-top: 64px; padding-top: 32px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <div class="logo-mini" style="font-weight: 800; font-size: 18px; color: var(--brand-primary);">LifeStars <span style="font-weight: 300; color: var(--text-light);">Marketing OS</span></div>
                <div style="font-size: 12px; color: var(--text-light);">Relatório Gerado Automaticamente pela LifeStars IA</div>
            </div>
        </div>
    `;

    openModal('Apresentação Executiva', content, () => true, true);
}

function deleteReport(id, index) {
    if (confirm("Deseja excluir este relatório?")) {
        if (id && id !== 'undefined') {
            State.reports = State.reports.filter(r => String(r.id) !== String(id));
        } else if (index !== undefined) {
            State.reports.splice(index, 1);
        }
        State.save();
        renderPage('relatorios');
    }
}


    window.deleteKanbanColumn = deleteKanbanColumn;
// Handled by the modern implementation below




function viewClientProfile(clientId) {
    const client = State.clients.find(c => String(c.id) === String(clientId));
    if (!client) return;

    if (!client.library) client.library = [];

    const content = `
        <div class="profile-workspace">
            <aside class="workspace-sidebar">
                <div class="workspace-fields mt-6">
                        <div class="avatar-edit-container">
                        <div id="profile-avatar-preview" class="avatar-giant" style="${client.photo ? `background-image: url(${client.photo})` : 'background: var(--brand-primary); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:48px;'}">
                            ${client.photo ? '' : client.name.substring(0,2).toUpperCase()}
                        </div>
                        <label class="avatar-edit-trigger">
                            <input type="file" hidden accept="image/*" onchange="window.handleProfilePhotoChange(event, '${clientId}')">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        </label>
                    </div>
                    
                    <div class="workspace-fields mt-6">
                        <div class="field-group">
                            <label class="field-label">Nome do Paciente</label>
                            <input type="text" id="edit-client-name" class="field-input" value="${client.name}">
                        </div>
                        <div class="field-group">
                            <label class="field-label">Telefone Paciente</label>
                            <input type="text" id="edit-client-phone" class="field-input" value="${client.phone || ''}">
                        </div>
                        <div class="field-group">
                            <label class="field-label">E-mail Paciente</label>
                            <input type="email" id="edit-client-email" class="field-input" value="${client.email || ''}">
                        </div>

                        <div class="field-group mt-6" style="border-top: 1px solid var(--border-color); padding-top: 16px;">
                            <label class="field-label" style="color: var(--brand-primary)">Dados do Responsável (Cliente)</label>
                            <input type="text" id="edit-client-resp" class="field-input" placeholder="Nome" value="${client.responsible || ''}">
                        </div>
                        <div class="field-group">
                            <label class="field-label">Cargo / Vínculo</label>
                            <input type="text" id="edit-client-resp-role" class="field-input" placeholder="Ex: Filho / Tutor" value="${client.respRole || ''}">
                        </div>
                        <div class="field-group">
                            <label class="field-label">Telefone Responsável</label>
                            <input type="text" id="edit-client-resp-phone" class="field-input" value="${client.respPhone || ''}">
                        </div>
                        <div class="field-group">
                            <label class="field-label">E-mail Responsável</label>
                            <input type="email" id="edit-client-resp-email" class="field-input" value="${client.respEmail || ''}">
                        </div>
                    </div>
                </div>

                <div class="workspace-footer">
                    <button class="btn-danger-outline full-width" onclick="deleteClient('${clientId}')">Encerrar & Excluir Conta</button>
                </div>
            </aside>

            <main class="workspace-main">
                <!-- Combined Legal & Permissions Section -->
                <div class="card mb-6" style="border-left: 4px solid var(--brand-primary); padding: 24px;">
                    <h4 class="card-title" style="margin-bottom: 20px; color: var(--brand-primary); display: flex; align-items: center; gap: 10px;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Controle de Autorizações & Conformidade
                    </h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <label class="check-item">
                                <input type="checkbox" id="edit-auth-img" ${client.authImagem ? 'checked' : ''}>
                                <span>Autorização de Uso de Imagem</span>
                            </label>
                            <label class="check-item">
                                <input type="checkbox" id="edit-auth-name" ${client.authNome ? 'checked' : ''}>
                                <span>Autorização de Uso de Nome</span>
                            </label>
                            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                                <label class="check-item" style="margin-bottom: 0;">
                                    <input type="checkbox" id="edit-auth-tag" ${client.authMarcar ? 'checked' : ''} onchange="window._toggleEditHandleField(this)">
                                    <span>Marcar nas Redes</span>
                                </label>
                                <input type="text" id="edit-instagram" class="field-input" style="width: 160px; height: 32px; font-size: 13px; padding: 4px 12px; display: ${client.authMarcar ? 'block' : 'none'};" placeholder="@usuario" value="${client.instagram || ''}">
                            </div>
                        </div>
                        
                        <div style="border-left: 1px solid var(--border-color); padding-left: 24px;">
                            <div class="flex-between" style="margin-bottom: 12px;">
                                <span style="font-size: 13px; font-weight: 700; color: var(--text-main);">Documento Assinado</span>
                                <label class="btn-text-action" style="cursor: pointer;">
                                    <input type="file" hidden onchange="window.handleProfileAuthChange(event, '${clientId}')">
                                    ${client.auth ? 'Substituir' : '+ Enviar'}
                                </label>
                            </div>
                            
                            ${client.auth ? `
                                <div class="doc-pill active" style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 10px; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                                    <div class="doc-icon" style="color: #10B981; width: 32px; height: 32px;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg></div>
                                    <div style="flex: 1; overflow: hidden;">
                                        <div style="font-weight: 700; color: var(--text-main); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${client.auth.name}</div>
                                        <a href="${client.auth.data}" target="_blank" style="color: var(--brand-primary); font-size: 11px; font-weight: 700; text-decoration: none;">Ver Documento</a>
                                    </div>
                                </div>
                            ` : `
                                <div style="background: #f9fafb; border: 1px dashed var(--border-color); padding: 12px; border-radius: 8px; text-align: center;">
                                    <span style="font-size: 11px; color: var(--text-light);">Nenhum arquivo anexado</span>
                                </div>
                            `}
                        </div>
                    </div>
                </div>

                <div class="workspace-header">
                    <div>
                        <h2 class="workspace-main-title">Biblioteca de Ativos Digitais</h2>
                        <p class="workspace-sub-text">Gerencie fotos, logos e materiais para redes sociais</p>
                    </div>
                    <label class="btn btn-primary btn-icon-plus">
                        <input type="file" id="multi-asset-input" hidden accept="image/*" onchange="window.addPhotoToLibrary(event, '${clientId}')" multiple>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Adicionar Ativos
                    </label>
                </div>

                <div class="assets-grid">
                    ${client.library.length === 0 ? `
                        <div class="assets-empty-state">
                            <div class="empty-icon-box">
                                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            </div>
                            <h3>Sua biblioteca está vazia</h3>
                            <p>Comece fazendo o upload de fotos e materiais brutos deste cliente.</p>
                        </div>
                    ` : client.library.map((pic, idx) => `
                        <div class="asset-card ${pic.posted ? 'is-posted' : ''}">
                            <div class="asset-preview" style="background-image: url(${pic.data})">
                                <div class="status-indicator ${pic.posted ? 'posted' : 'pending'}" onclick="window.togglePhotoPosted('${clientId}', ${idx})">
                                    ${pic.posted ? 'POSTADO' : 'PENDENTE'}
                                </div>
                                <div class="asset-actions-overlay">
                                    <a href="${pic.isDrive ? pic.driveUrl : pic.data}" target="_blank" class="action-circle">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                                            ${pic.isDrive ? '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>' : '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'}
                                        </svg>
                                    </a>
                                    <button onclick="window.deleteLibraryPhoto('${clientId}', ${idx})" class="action-circle delete"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                                </div>
                            </div>
                            <div class="asset-footer">
                                <input type="text" class="asset-name-edit" value="${pic.name}" onchange="window.renameLibraryPhoto('${clientId}', ${idx}, this.value)" placeholder="Nome do arquivo...">
                            </div>
                        </div>
                    `).join('')}
                </div>
            </main>
        </div>
    `;

    openModal('Editar Perfil do Cliente', content, () => {
        saveProfileChanges(clientId);
        renderPage('clientes');
        return true;
    }, true);
}

async function compressImage(base64Str, maxWidth = 1200, maxHeight = 1200) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = () => resolve(base64Str);
    });
}

async function addPhotoToLibrary(e, clientId) {
    window.saveProfileChanges(clientId);
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const client = State.clients.find(c => String(c.id) === String(clientId));
    if (!client) return;
    if (!client.library) client.library = [];

    if (!window.accessToken) {
        if (!confirm("Google Drive não conectado. Deseja salvar localmente? (Espaço limitado)")) return;
        let loaded = 0;
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                let data = event.target.result;
                if (file.type.startsWith('image/')) data = await compressImage(data);
                client.library.push({ name: file.name.split('.')[0], data, posted: false });
                loaded++;
                if (loaded === files.length) { State.save(); viewClientProfile(clientId); }
            };
            reader.readAsDataURL(file);
        }
        return;
    }

    // Google Drive Upload Flow
    try {
        const rootId = await DriveManager.getOrCreateFolder('LifeStars_MarketingOS');
        const clientsId = await DriveManager.getOrCreateFolder('Clientes', rootId);
        const clientFolderId = await DriveManager.getOrCreateFolder(client.name, clientsId);
        const assetsFolderId = await DriveManager.getOrCreateFolder('Ativos', clientFolderId);

        for (const file of files) {
            const driveFile = await DriveManager.uploadFile(file, assetsFolderId);
            
            // Create a small thumbnail for immediate UI feedback
            let thumbnailData = null;
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                thumbnailData = await new Promise(resolve => {
                    reader.onload = async (ev) => resolve(await compressImage(ev.target.result, 200, 200));
                    reader.readAsDataURL(file);
                });
            }

            client.library.push({
                name: file.name.split('.')[0],
                data: thumbnailData || driveFile.webViewLink,
                driveUrl: driveFile.webViewLink,
                id: driveFile.id,
                isDrive: true,
                posted: false
            });
        }
        State.save();
        viewClientProfile(clientId);
    } catch (err) {
        console.error(err);
        alert(err.message || "Erro ao subir para o Google Drive. Verifique a conexão.");
    }
}

// Update deleteLibraryPhoto to refresh profile
function deleteLibraryPhoto(clientId, picIdx) {
    const client = State.clients.find(c => String(c.id) === String(clientId));
    if (!client || !client.library[picIdx]) return;
    const pic = client.library[picIdx];

    showConfirm("Excluir Ativo", "Deseja remover esta foto permanentemente da biblioteca e do Google Drive?", async () => {
        // 1. Cloud Trash
        if (window.accessToken && pic.id) {
            try {
                await DriveManager.trashFile(pic.id);
            } catch (err) {
                console.warn("Erro ao deletar arquivo no Drive:", err);
            }
        }

        // 2. Local Trash
        client.library.splice(picIdx, 1);
        State.save();
        viewClientProfile(clientId);
    });
}


window.saveProfileChanges = (clientId) => {
    const client = State.clients.find(c => String(c.id) === String(clientId));
    if (!client) return;
    
    const nameInput = document.getElementById('edit-client-name');
    const phoneInput = document.getElementById('edit-client-phone');
    const emailInput = document.getElementById('edit-client-email');
    const respInput = document.getElementById('edit-client-resp');
    const respRoleInput = document.getElementById('edit-client-resp-role');
    const respPhoneInput = document.getElementById('edit-client-resp-phone');
    const respEmailInput = document.getElementById('edit-client-resp-email');
    const authImgInput = document.getElementById('edit-auth-img');
    const authNameInput = document.getElementById('edit-auth-name');
    const authTagInput = document.getElementById('edit-auth-tag');
    
    if (nameInput) client.name = nameInput.value;
    if (phoneInput) client.phone = phoneInput.value;
    if (emailInput) client.email = emailInput.value;
    if (respInput) client.responsible = respInput.value;
    if (respRoleInput) client.respRole = respRoleInput.value;
    if (respPhoneInput) client.respPhone = respPhoneInput.value;
    if (respEmailInput) client.respEmail = respEmailInput.value;
    
    if (authImgInput) client.authImagem = authImgInput.checked;
    if (authNameInput) client.authNome = authNameInput.checked;
    if (authTagInput) client.authMarcar = authTagInput.checked;
    
    const instaInput = document.getElementById('edit-instagram');
    if (instaInput) client.instagram = instaInput.value;
    
    State.save();
};

window._toggleEditHandleField = (checkbox) => {
    const field = document.getElementById('edit-instagram');
    if (field) field.style.display = checkbox.checked ? 'block' : 'none';
};

window.handleProfilePhotoChange = async (e, clientId) => {
    window.saveProfileChanges(clientId);
    const file = e.target.files[0];
    if (!file) return;

    const client = State.clients.find(c => String(c.id) === String(clientId));
    if (!client) return;

    try {
        const thumb = await compressImage(URL.createObjectURL(file), 400, 400);
        client.photo = thumb; // Immediate local update

        if (window.accessToken) {
            const rootId = await DriveManager.getOrCreateFolder('LifeStars_MarketingOS');
            const clientsId = await DriveManager.getOrCreateFolder('Clientes', rootId);
            const clientFolderId = await DriveManager.getOrCreateFolder(client.name, clientsId);
            const profileFolderId = await DriveManager.getOrCreateFolder('Perfil', clientFolderId);
            
            const driveFile = await DriveManager.uploadFile(file, profileFolderId);
            client.photoDriveUrl = driveFile.webViewLink;
        }

        State.save();
        viewClientProfile(clientId);
    } catch (err) {
        console.error("Erro no upload da foto de perfil:", err);
        alert("Erro ao salvar foto de perfil. Usando versão local.");
    }
};

window.handleProfileAuthChange = async (e, clientId) => {
    window.saveProfileChanges(clientId);
    const file = e.target.files[0];
    if (!file) return;

    const client = State.clients.find(c => String(c.id) === String(clientId));
    if (!client) return;

    if (!window.accessToken) {
        const reader = new FileReader();
        reader.onload = (event) => {
            client.auth = { name: file.name, data: event.target.result };
            State.save();
            viewClientProfile(clientId);
        };
        reader.readAsDataURL(file);
    } else {
        try {
            const rootId = await DriveManager.getOrCreateFolder('LifeStars_MarketingOS');
            const clientsId = await DriveManager.getOrCreateFolder('Clientes', rootId);
            const clientFolderId = await DriveManager.getOrCreateFolder(client.name, clientsId);
            const docsFolderId = await DriveManager.getOrCreateFolder('Documentos', clientFolderId);
            
            const driveFile = await DriveManager.uploadFile(file, docsFolderId);
            client.auth = { 
                name: file.name, 
                data: driveFile.webViewLink, 
                id: driveFile.id,
                isDrive: true 
            };
            State.save();
            viewClientProfile(clientId);
        } catch (err) {
            console.error(err);
            alert(err.message || "Erro ao subir documento para o Drive.");
        }
    }
};

window.renameLibraryPhoto = (clientId, idx, newName) => {
    const client = State.clients.find(c => String(c.id) === String(clientId));
    if (client && client.library[idx]) {
        client.library[idx].name = newName;
        State.save();
    }
};

window.togglePhotoPosted = (clientId, idx) => {
    const client = State.clients.find(c => String(c.id) === String(clientId));
    if (client && client.library[idx]) {
        client.library[idx].posted = !client.library[idx].posted;
        State.save();
        viewClientProfile(clientId);
    }
};



    // Brand Intelligence Actions
    window.switchBrandTab = (tabId) => {
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
        const target = document.getElementById(`tab-${tabId}`);
        const btn = document.querySelector(`[data-tab="${tabId}"]`);
        
        if (target) target.style.display = 'block';
        if (btn) btn.classList.add('active');
    };

    window.deleteBrandAsset = (index) => {
        showConfirm("Excluir Ativo", "Deseja remover este ativo da identidade de marca?", () => {
            State.brand.ativos.splice(index, 1);
            State.save();
            renderPage('brand');
        });
    };

window.addReport = addReport;
window.viewReport = viewReport;
window.deleteReport = deleteReport;
window.addClient = addClient;
window.deleteClient = deleteClient;
window.viewClientProfile = viewClientProfile;
window.addPhotoToLibrary = addPhotoToLibrary;
window.renameLibraryPhoto = renameLibraryPhoto;
window.deleteLibraryPhoto = deleteLibraryPhoto;
window.toggleNavGroup = (groupId) => {
    const group = document.getElementById(`group-${groupId}`);
    if (group) group.classList.toggle('expanded');
};
window.toggleSidebar = () => {
    document.body.classList.toggle('sidebar-collapsed');
};
window.navigate = navigate;
window.renderPage = renderPage;
window.closeModal = closeModal;
window.addCalendarTask = addCalendarTask;
window.syncGoogleCalendar = syncGoogleCalendar;
window.onDragStartTask = onDragStartTask;
window.onDropTask = onDropTask;
window.editKanbanTask = editKanbanTask;
window.deleteKanbanTask = deleteKanbanTask;
window.addTaskComment = addTaskComment;
window.handleTaskFileUpload = handleTaskFileUpload;
window.deleteTaskFile = deleteTaskFile;
window.addKanbanColumn = addKanbanColumn;
window.editKanbanColumn = editKanbanColumn;
window.deleteKanbanColumn = deleteKanbanColumn;
window.createSwot = createSwot;
window.addSwotItem = addSwotItem;
// ── PASSWORD MANAGEMENT ───────────────────
window.openAddPasswordModal = (idx = null) => {
    const isEdit = idx !== null;
    const p = isEdit ? State.passwords[idx] : { ferramenta: '', link: '', usuario: '', email: '', senha: '' };
    
    const content = `
        <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Ferramenta / Site</label>
                <input type="text" id="pass-ferramenta" class="form-input" placeholder="Ex: Google Ads, Meta Business..." value="${p.ferramenta}">
            </div>
            <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Link de Acesso</label>
                <input type="url" id="pass-link" class="form-input" placeholder="https://..." value="${p.link}">
            </div>
            <div class="form-group">
                <label class="form-label">Usuário</label>
                <input type="text" id="pass-usuario" class="form-input" value="${p.usuario}">
            </div>
            <div class="form-group">
                <label class="form-label">E-mail de Login</label>
                <input type="email" id="pass-email" class="form-input" value="${p.email}">
            </div>
            <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Senha</label>
                <div class="password-input-wrapper" style="position: relative;">
                    <input type="text" id="pass-senha" class="form-input" value="${p.senha}">
                </div>
            </div>
        </div>
    `;

    openModal(isEdit ? 'Editar Acesso' : 'Cadastrar Acesso', content, () => {
        const ferramenta = document.getElementById('pass-ferramenta').value.trim();
        const link = document.getElementById('pass-link').value.trim();
        const usuario = document.getElementById('pass-usuario').value.trim();
        const email = document.getElementById('pass-email').value.trim();
        const senha = document.getElementById('pass-senha').value.trim();

        if (!ferramenta || !senha) {
            alert("Ferramenta e Senha são campos obrigatórios.");
            return false;
        }

        const data = { ferramenta, link, usuario, email, senha };

        if (isEdit) {
            State.passwords[idx] = data;
        } else {
            State.passwords.push(data);
        }

        State.save();
        renderPage('senhas');
        return true;
    });
};

window.editPassword = (idx) => window.openAddPasswordModal(idx);

window.deletePassword = (idx) => {
    showConfirm("Excluir Acesso", "Deseja remover as credenciais desta ferramenta?", () => {
        State.passwords.splice(idx, 1);
        State.save();
        renderPage('senhas');
    });
};

window.togglePassVisibility = (idx) => {
    const field = document.getElementById(`pass-field-${idx}`);
    if (field) {
        field.type = field.type === 'password' ? 'text' : 'password';
    }
};

window.addPersona = addPersona;
window.openAddPasswordModal = openAddPasswordModal;
window.editPassword = editPassword;
window.deletePassword = deletePassword;
window.togglePassVisibility = togglePassVisibility;

// ── SEO ACTIONS ───────────────────────────
function addSeoMonth() {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const currentYear = new Date().getFullYear();
    
    const content = `
        <div class="form-group">
            <label class="form-label">Mês de Referência</label>
            <select id="seo-month-select" class="form-input">
                ${months.map(m => `<option value="${m}">${m}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Ano</label>
            <input type="number" id="seo-year-input" class="form-input" value="${currentYear}">
        </div>
    `;

    openModal('Novo Mês de SEO', content, () => {
        const month = document.getElementById('seo-month-select').value;
        const year = document.getElementById('seo-year-input').value;
        
        const id = Date.now();
        State.seo.push({
            id,
            month,
            year,
            reports: {
                campinas: null,
                sp: null,
                abc: null
            }
        });
        
        State.save();
        renderPage('seo');
        return true;
    });
}

function deleteSeoMonth(id) {
    showConfirm("Excluir Mês", "Deseja remover todos os relatórios deste mês?", () => {
        State.seo = State.seo.filter(m => String(m.id) !== String(id));
        State.save();
        renderPage('seo');
    });
}

function uploadSeoReport(monthId, city) {
    let reportFile = null;
    const content = `
        <div class="form-group">
            <label class="form-label">Arquivo do Relatório (PDF, Imagem, etc.)</label>
            <div class="asset-upload-card" id="seo-file-preview" style="cursor: pointer; border: 2px dashed var(--border-color); padding: 40px; border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; gap: 12px; transition: 0.2s;" onclick="document.getElementById('seo-file-input').click()">
                <input type="file" id="seo-file-input" hidden accept=".pdf,image/*">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--text-light)" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span id="seo-file-name" style="color: var(--text-muted); font-weight: 600;">Clique para selecionar arquivo</span>
            </div>
        </div>
    `;

    openModal(`Relatório de SEO: ${city}`, content, () => {
        if (!reportFile) {
            alert("Por favor, selecione um arquivo.");
            return false;
        }

        const month = State.seo.find(m => String(m.id) === String(monthId));
        if (month) {
            month.reports[city] = { 
                file: reportFile, 
                date: new Date().toISOString() 
            };
            State.save();
            renderPage('seo');
            return true;
        }
        return false;
    });

    setTimeout(() => {
        const input = document.getElementById('seo-file-input');
        if (input) {
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        reportFile = {
                            name: file.name,
                            type: file.type,
                            data: event.target.result
                        };
                        const preview = document.getElementById('seo-file-preview');
                        const fileName = document.getElementById('seo-file-name');
                        if (preview && fileName) {
                            preview.style.borderColor = "var(--brand-primary)";
                            fileName.innerText = file.name;
                            fileName.style.color = "var(--brand-primary)";
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
        }
    }, 100);
}

function viewSeoReport(monthId, city) {
    const month = State.seo.find(m => String(m.id) === String(monthId));
    if (!month || !month.reports[city]) return;

    const report = month.reports[city];
    const isImage = report.file && report.file.type && report.file.type.startsWith('image/');
    const isPDF = report.file && report.file.type === 'application/pdf';
    
    const content = `
        <div style="display: flex; flex-direction: column; height: 100%; text-align: center;">
            <div class="report-preview-container" style="flex: 1; width: 100%; overflow-y: auto; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--border-color); background: var(--bg-main);">
                ${isImage ? `
                    <img src="${report.file.data}" style="width: 100%; display: block;">
                ` : isPDF ? `
                    <iframe src="${report.file.data}" style="width: 100%; height: 100%; border: none;"></iframe>
                ` : `
                    <div style="padding: 100px;">
                        <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="var(--brand-primary)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <p style="margin-top: 20px; font-weight: 600; color: var(--text-main); font-size: 18px;">${report.file.name}</p>
                        <p style="color: var(--text-light); font-size: 14px;">Este tipo de arquivo não permite pré-visualização direta.</p>
                    </div>
                `}
            </div>
            
            <div style="display: flex; gap: 16px; justify-content: center; padding-bottom: 10px;">
                <button class="btn btn-primary" style="flex: 1; padding: 12px;" onclick="window.downloadSeoFile('${monthId}', '${city}')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Baixar Arquivo Completo
                </button>
                <button class="btn btn-danger" style="flex: 1; padding: 12px;" onclick="window.deleteSeoReport('${monthId}', '${city}')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Excluir Relatório
                </button>
            </div>
        </div>
    `;

    openModal(`Relatório: ${city.toUpperCase()}`, content, null, 'xl');
}

function downloadSeoFile(monthId, city) {
    const month = State.seo.find(m => String(m.id) === String(monthId));
    const report = month.reports[city];
    if (report && report.file) {
        const link = document.createElement('a');
        link.href = report.file.data;
        link.download = report.file.name;
        link.click();
    }
}

function deleteSeoReport(monthId, city) {
    showConfirm("Excluir Relatório", "Deseja remover este arquivo permanentemente?", () => {
        const month = State.seo.find(m => String(m.id) === String(monthId));
        if (month) {
            month.reports[city] = null;
            State.save();
            closeModal();
            renderPage('seo');
        }
    });
}

function toggleSeoMonth(id) {
    const numId = Number(id);
    if (State.expandedSeoMonthId === numId) {
        State.expandedSeoMonthId = null;
    } else {
        State.expandedSeoMonthId = numId;
    }
    renderPage('seo');
}

// ── ADS MODULE ─────────────────────────────
function addAdsMonth() {
    const now = new Date();
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const content = `
        <div class="form-group">
            <label class="form-label">Mês de Referência</label>
            <select id="ads-month-select" class="form-select">
                ${months.map(m => `<option value="${m}" ${m === months[now.getMonth()] ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Ano</label>
            <input type="number" id="ads-year-input" class="form-input" value="${now.getFullYear()}">
        </div>
    `;

    openModal('Adicionar Mês (ADS)', content, () => {
        const month = document.getElementById('ads-month-select').value;
        const year = document.getElementById('ads-year-input').value;

        if (State.ads.find(m => m.month === month && m.year === year)) {
            alert("Este mês já foi adicionado.");
            return false;
        }

        const newEntry = {
            id: Date.now(),
            month,
            year,
            report: null
        };

        State.ads.push(newEntry);
        State.save();
        renderPage('ads');
        return true;
    });
}

function deleteAdsMonth(id) {
    showConfirm("Excluir Mês", "Deseja remover este mês e seu relatório?", () => {
        State.ads = State.ads.filter(m => String(m.id) !== String(id));
        State.save();
        renderPage('ads');
    });
}

function uploadAdsReport(monthId) {
    let reportFile = null;
    const content = `
        <div class="form-group">
            <label class="form-label">Arquivo do Relatório de ADS (PDF ou Imagem)</label>
            <div class="asset-upload-card" id="ads-file-preview" style="cursor: pointer; border: 2px dashed var(--border-color); padding: 40px; border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; gap: 12px; transition: 0.2s;" onclick="document.getElementById('ads-file-input').click()">
                <input type="file" id="ads-file-input" hidden accept=".pdf,image/*">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--text-light)" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span id="ads-file-name" style="color: var(--text-muted); font-weight: 600;">Clique para selecionar arquivo</span>
            </div>
        </div>
    `;

    openModal(`Upload Relatório ADS`, content, () => {
        if (!reportFile) {
            alert("Por favor, selecione um arquivo.");
            return false;
        }

        const month = State.ads.find(m => String(m.id) === String(monthId));
        if (month) {
            month.report = { 
                file: reportFile, 
                date: new Date().toISOString() 
            };
            State.save();
            renderPage('ads');
            return true;
        }
        return false;
    });

    setTimeout(() => {
        const input = document.getElementById('ads-file-input');
        if (input) {
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        reportFile = {
                            name: file.name,
                            type: file.type,
                            data: event.target.result
                        };
                        const preview = document.getElementById('ads-file-preview');
                        const fileName = document.getElementById('ads-file-name');
                        if (preview && fileName) {
                            preview.style.borderColor = "var(--brand-primary)";
                            fileName.innerText = file.name;
                            fileName.style.color = "var(--brand-primary)";
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
        }
    }, 100);
}

function viewAdsReport(monthId) {
    const month = State.ads.find(m => String(m.id) === String(monthId));
    if (!month || !month.report) return;

    const report = month.report;
    const isImage = report.file && report.file.type && report.file.type.startsWith('image/');
    const isPDF = report.file && report.file.type === 'application/pdf';
    
    const content = `
        <div style="display: flex; flex-direction: column; height: 100%; text-align: center;">
            <div class="report-preview-container" style="flex: 1; width: 100%; overflow-y: auto; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--border-color); background: var(--bg-main);">
                ${isImage ? `
                    <img src="${report.file.data}" style="width: 100%; display: block;">
                ` : isPDF ? `
                    <iframe src="${report.file.data}" style="width: 100%; height: 100%; border:none;"></iframe>
                ` : `
                    <div style="padding: 100px;">
                        <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="var(--brand-primary)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <p style="margin-top: 20px; font-weight: 600; color: var(--text-main); font-size: 18px;">${report.file.name}</p>
                        <p style="color: var(--text-light); font-size: 14px;">Este tipo de arquivo não permite pré-visualização direta.</p>
                    </div>
                `}
            </div>
            
            <div style="display: flex; gap: 16px; justify-content: center; padding-bottom: 10px;">
                <button class="btn btn-primary" style="flex: 1; padding: 12px;" onclick="window.downloadAdsFile('${monthId}')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Baixar Relatório
                </button>
                <button class="btn btn-danger" style="flex: 1; padding: 12px;" onclick="window.deleteAdsReport('${monthId}')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Excluir
                </button>
            </div>
        </div>
    `;

    openModal(`Relatório de Tráfego Pago: ${month.month}/${month.year}`, content, null, 'xl');
}

function downloadAdsFile(monthId) {
    const month = State.ads.find(m => String(m.id) === String(monthId));
    if (month && month.report && month.report.file) {
        const link = document.createElement('a');
        link.href = month.report.file.data;
        link.download = month.report.file.name;
        link.click();
    }
}

function deleteAdsReport(monthId) {
    showConfirm("Excluir Relatório", "Deseja remover este relatório permanentemente?", () => {
        const month = State.ads.find(m => String(m.id) === String(monthId));
        if (month) {
            month.report = null;
            State.save();
            closeModal();
            renderPage('ads');
        }
    });
}

function toggleAdsMonth(id) {
    const numId = Number(id);
    if (State.expandedAdsMonthId === numId) {
        State.expandedAdsMonthId = null;
    } else {
        State.expandedAdsMonthId = numId;
    }
    renderPage('ads');
}

window.addSeoMonth = addSeoMonth;
window.deleteSeoMonth = deleteSeoMonth;
window.uploadSeoReport = uploadSeoReport;
window.viewSeoReport = viewSeoReport;
window.downloadSeoFile = downloadSeoFile;
window.deleteSeoReport = deleteSeoReport;
window.toggleSeoMonth = toggleSeoMonth;

window.addAdsMonth = addAdsMonth;
window.deleteAdsMonth = deleteAdsMonth;
window.uploadAdsReport = uploadAdsReport;
window.viewAdsReport = viewAdsReport;
window.downloadAdsFile = downloadAdsFile;
window.deleteAdsReport = deleteAdsReport;
window.toggleAdsMonth = toggleAdsMonth;

// ── END OF MAIN.JS ─────────────────────────
