export const Templates = {
    dashboard: (state) => {
            const parseDate = (d) => {
                if (!d) return new Date(8640000000000000);
                const parts = d.split('/');
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]);
                const year = parts[2] ? parseInt(parts[2]) : new Date().getFullYear();
                return new Date(year, month - 1, day);
            };

            const allPendingTasks = state.kanban
                .filter(c => c.id !== 'done')
                .flatMap(c => c.tasks || [])
                .sort((a, b) => parseDate(a.prazo) - parseDate(b.prazo));

            const topTasks = allPendingTasks.slice(0, 5);

            return `
            
            <div class="kpi-grid" style="grid-template-columns: repeat(3, 1fr);">
                <div class="kpi-card" onclick="navigate('leads')" style="cursor: pointer;">
                    <div class="kpi-icon" style="background: rgba(255, 152, 0, 0.1); color: #FF9800;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Leads</span>
                        <span class="kpi-value">${state.leads.length}</span>
                    </div>
                </div>
                <div class="kpi-card" onclick="navigate('clientes')" style="cursor: pointer;">
                    <div class="kpi-icon" style="background: rgba(0, 150, 136, 0.1); color: #009688;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Autorizações de Imagem</span>
                        <span class="kpi-value">${state.clients.filter(c => c.authImagem).length}</span>
                    </div>
                </div>
                <div class="kpi-card" onclick="navigate('kanban')" style="cursor: pointer;">
                    <div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Tarefas em Fluxo</span>
                        <span class="kpi-value">${state.kanban.reduce((acc, col) => acc + (col.tasks ? col.tasks.length : 0), 0)}</span>
                    </div>
                </div>
                
                <div class="kpi-card" onclick="navigate('seo')" style="cursor: pointer;">
                    <div class="kpi-icon" style="background: rgba(76, 175, 80, 0.1); color: #4CAF50;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 3v4M11 15v4M3 11h4M15 11h4"/><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Relatórios SEO</span>
                        <span class="kpi-value">${state.seo.reduce((acc, month) => acc + Object.values(month.reports || {}).filter(r => r !== null).length, 0)}</span>
                    </div>
                </div>
                <div class="kpi-card" onclick="navigate('ads')" style="cursor: pointer;">
                    <div class="kpi-icon" style="background: rgba(33, 150, 243, 0.1); color: #2196F3;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Relatórios ADS</span>
                        <span class="kpi-value">${state.ads.filter(m => m.report !== null).length}</span>
                    </div>
                </div>
                <div class="kpi-card" onclick="navigate('senhas')" style="cursor: pointer;">
                    <div class="kpi-icon" style="background: rgba(156, 39, 176, 0.1); color: #9C27B0;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Senhas</span>
                        <span class="kpi-value">${state.passwords.length}</span>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid" style="grid-template-columns: 1fr;">
                <div class="card">
                    <h3 class="card-title">Prioridades Máximas</h3>
                    <p class="card-sub">Tarefas mais próximas do vencimento</p>
                    <div class="urgent-list">
                        ${topTasks.length === 0 ? '<p class="empty-state">Nenhuma tarefa pendente no momento. Bom trabalho!</p>' : 
                          topTasks.map(t => `
                            <div class="urgent-item" onclick="navigate('kanban')" style="cursor: pointer;">
                                <div class="urgent-dot" style="background: ${t.priority === 'alta' ? 'var(--brand-primary)' : '#ccc'}"></div>
                                <div class="urgent-info">
                                    <strong>${t.title}</strong>
                                    <p>Vencimento: ${t.prazo || 'Sem data'}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- SEÇÃO DO GRÁFICO (Movida para o final) -->
                <div class="card full-width-card">
                    <h3 class="card-title">Crescimento de Leads</h3>
                    <p class="card-sub">Evolução acumulada na janela de tempo</p>
                    <div class="chart-container" style="position: relative; height:300px; width:100%; margin-top: 20px;">
                        <canvas id="leadsGrowthChart"></canvas>
                    </div>
                </div>
            </div>
        `;
    },
    brand: (state) => `
        <div class="sec-header">
            <div class="header-actions">
                <button class="btn btn-primary" onclick="saveStrategicInfo('brand')">Salvar Todas as Alterações</button>
            </div>
        </div>

        <div class="brand-long-page">
            <!-- SECTION 1: CULTURA -->
            <div class="brand-section-wrapper">
                <div class="section-nav-anchor">
                    <span class="step-num">01</span>
                    <h3 class="section-title-premium">Essência & Cultura</h3>
                </div>
                
                <div class="brand-grid-expanded">
                    <div class="brand-card-hero">
                        <label class="brand-label-premium">Nossa História e Trajetória</label>
                        <textarea id="brand-historia" class="brand-textarea-rich" placeholder="A história que nos trouxe até aqui...">${state.brand.historia}</textarea>
                    </div>

                    <div class="brand-trio-grid">
                        <div class="brand-card-pillar">
                            <label class="brand-label-premium">Missão</label>
                            <p class="pillar-hint">Por que existimos?</p>
                            <textarea id="brand-missao" class="brand-textarea-pillar">${state.brand.missao}</textarea>
                        </div>
                        <div class="brand-card-pillar">
                            <label class="brand-label-premium">Visão</label>
                            <p class="pillar-hint">Onde queremos chegar?</p>
                            <textarea id="brand-visao" class="brand-textarea-pillar">${state.brand.visao}</textarea>
                        </div>
                        <div class="brand-card-pillar">
                            <label class="brand-label-premium">Valores</label>
                            <p class="pillar-hint">No que acreditamos?</p>
                            <textarea id="brand-valores" class="brand-textarea-pillar">${state.brand.valores}</textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECTION 2: IDENTIDADE -->
            <div class="brand-section-wrapper mt-12">
                <div class="section-nav-anchor">
                    <span class="step-num">02</span>
                    <h3 class="section-title-premium">Identidade Visual</h3>
                </div>

                <div class="brand-grid-expanded">
                    <div class="brand-card-hero">
                        <div class="flex-between">
                            <label class="brand-label-premium">Paleta de Cores Oficial</label>
                            <button class="btn-text-only" onclick="State.brand.cores.push({name: 'Nova Cor', hex: '#000000'}); State.save(); renderPage('brand');">+ Adicionar Cor</button>
                        </div>
                        <div class="premium-color-grid-modern">
                            ${state.brand.cores.map((c, i) => `
                                <div class="modern-color-card">
                                    <div class="color-preview-circle" style="background: ${c.hex}">
                                        <input type="color" value="${c.hex}" onchange="State.brand.cores[${i}].hex = this.value; State.save(); renderPage('brand');" class="color-abs-input">
                                    </div>
                                    <div class="color-info-stack">
                                        <input type="text" value="${c.name}" onchange="State.brand.cores[${i}].name = this.value; State.save();" class="color-name-input-clean">
                                        <span class="color-hex-tag">${c.hex}</span>
                                    </div>
                                    <button class="btn-delete-mini" onclick="State.brand.cores.splice(${i}, 1); State.save(); renderPage('brand');">×</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="brand-dual-grid">
                        <div class="brand-card-hero">
                            <label class="brand-label-premium">Tipografia</label>
                            <p class="pillar-hint">Fontes oficiais para comunicação</p>
                            <input type="text" id="brand-fontes" value="${state.brand.fontes}" class="brand-input-clean" placeholder="Ex: Outfit, Inter, Roboto">
                        </div>
                        <div class="brand-card-hero">
                            <div class="flex-between">
                                <label class="brand-label-premium">Ativos de Marca (Logos)</label>
                                <label class="btn-text-only">
                                    <input type="file" id="asset-upload" hidden accept="image/*">
                                    + Upload
                                </label>
                            </div>
                            <div class="brand-assets-flex">
                                ${state.brand.ativos.length === 0 ? `
                                    <div class="empty-state-mini">Nenhum logo enviado</div>
                                ` : state.brand.ativos.map((a, idx) => `
                                    <div class="asset-bubble">
                                        <img src="${a.data}" title="${a.name}">
                                        <button class="asset-remove-circle" onclick="deleteBrandAsset(${idx})">×</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    ads: (state) => `
        <div class="sec-header">
            <div class="header-info">
                <p class="section-subtitle">Gestão de relatórios mensais de tráfego pago</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="window.addAdsMonth()">+ Novo Mês de ADS</button>
            </div>
        </div>

        <div class="seo-months-container">
            ${state.ads.length === 0 ? `
                <div class="empty-state-premium">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    </div>
                    <h4>Nenhum relatório de Tráfego Pago</h4>
                    <p>Adicione o primeiro mês para começar a organizar seus relatórios de anúncios.</p>
                </div>
            ` : state.ads.sort((a, b) => {
                const monthsMap = {
                    'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, 'Abril': 3, 'Maio': 4, 'Junho': 5,
                    'Julho': 6, 'Agosto': 7, 'Setembro': 8, 'Outubro': 9, 'Novembro': 10, 'Dezembro': 11
                };
                const yearA = parseInt(a.year);
                const yearB = parseInt(b.year);
                if (yearB !== yearA) return yearB - yearA;
                return monthsMap[b.month] - monthsMap[a.month];
            }).map((m, idx) => `
                <div class="seo-month-card card mb-6 ${state.expandedAdsMonthId === m.id ? 'expanded' : ''}" id="ads-month-${m.id}">
                    <div class="seo-month-header" onclick="window.toggleAdsMonth('${m.id}')">
                        <div class="month-info">
                            <svg class="month-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            <span class="month-name">${m.month} ${m.year}</span>
                        </div>
                        <div class="month-actions">
                            <svg class="dropdown-chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                            <button class="btn-delete-item" onclick="event.stopPropagation(); window.deleteAdsMonth('${m.id}')">×</button>
                        </div>
                    </div>
                    
                    <div class="seo-reports-wrapper">
                        <div class="seo-reports-grid" style="grid-template-columns: 1fr;">
                            <div class="seo-report-slot">
                                <div class="slot-header">
                                    <span class="city-tag" style="background: var(--brand-primary-soft); color: var(--brand-primary);">Relatório de Tráfego Pago</span>
                                </div>
                                ${m.report ? `
                                    <div class="report-active" onclick="window.viewAdsReport('${m.id}')">
                                        <div class="report-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <div class="report-details">
                                            <span class="report-title">${m.report.file ? m.report.file.name : 'Relatório'}</span>
                                            <span class="report-meta">Ver detalhes</span>
                                        </div>
                                    </div>
                                ` : `
                                    <div class="report-empty" onclick="window.uploadAdsReport('${m.id}')">
                                        <div class="add-icon">+</div>
                                        <span>Adicionar Relatório</span>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `,

    analises: (state) => {
        if (!state.activeSwotId) {
            return `
                <div class="sec-header">
                    <button class="btn btn-primary" id="btn-create-swot">+ Nova Matriz</button>
                </div>
                <div class="kpi-grid">
                    ${state.swots.length === 0 ? '<div class="card full-width empty-state">Nenhuma matriz SWOT criada ainda.</div>' : 
                      state.swots.map(s => `
                        <div class="card swot-thumb" onclick="State.activeSwotId='${s.id}'; navigate('analises');">
                            <div class="swot-mini-grid">
                                <div class="mini-s"></div><div class="mini-w"></div>
                                <div class="mini-o"></div><div class="mini-t"></div>
                            </div>
                            <h4 class="card-title">${s.name}</h4>
                            <p class="card-sub">${s.s.length + s.w.length + s.o.length + s.t.length} pontos identificados</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const swot = state.swots.find(s => s.id === state.activeSwotId);
        return `
            <div class="sec-header" style="margin-top: -12px; margin-bottom: 24px;">
                <div style="display:flex; align-items:center; gap:16px;">
                    <button class="btn-icon" onclick="State.activeSwotId=null; navigate('analises');" title="Voltar para Matrizes">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                </div>
                <button class="btn btn-secondary" onclick="if(confirm('Excluir esta matriz?')) { State.swots = State.swots.filter(s=>s.id!==State.activeSwotId); State.activeSwotId=null; State.save(); navigate('analises'); }">Excluir Matriz</button>
            </div>
            <div class="swot-grid">
                <div class="card swot-item s">
                    <h3 class="card-title">Forças (Strengths)</h3>
                    <ul class="swot-list">
                        ${swot.s.map((i, idx) => `<li>• ${i} <button class="btn-delete-item" onclick="State.swots.find(s=>s.id===State.activeSwotId).s.splice(${idx},1); State.save(); renderPage('analises');">×</button></li>`).join('')}
                    </ul>
                    <button class="btn-add-swot" data-type="s">+ Adicionar Ponto</button>
                </div>
                <div class="card swot-item w">
                    <h3 class="card-title">Fraquezas (Weaknesses)</h3>
                    <ul class="swot-list">
                        ${swot.w.map((i, idx) => `<li>• ${i} <button class="btn-delete-item" onclick="State.swots.find(s=>s.id===State.activeSwotId).w.splice(${idx},1); State.save(); renderPage('analises');">×</button></li>`).join('')}
                    </ul>
                    <button class="btn-add-swot" data-type="w">+ Adicionar Ponto</button>
                </div>
                <div class="card swot-item o">
                    <h3 class="card-title">Oportunidades (Opportunities)</h3>
                    <ul class="swot-list">
                        ${swot.o.map((i, idx) => `<li>• ${i} <button class="btn-delete-item" onclick="State.swots.find(s=>s.id===State.activeSwotId).o.splice(${idx},1); State.save(); renderPage('analises');">×</button></li>`).join('')}
                    </ul>
                    <button class="btn-add-swot" data-type="o">+ Adicionar Ponto</button>
                </div>
                <div class="card swot-item t">
                    <h3 class="card-title">Ameaças (Threats)</h3>
                    <ul class="swot-list">
                        ${swot.t.map((i, idx) => `<li>• ${i} <button class="btn-delete-item" onclick="State.swots.find(s=>s.id===State.activeSwotId).t.splice(${idx},1); State.save(); renderPage('analises');">×</button></li>`).join('')}
                    </ul>
                    <button class="btn-add-swot" data-type="t">+ Adicionar Ponto</button>
                </div>
            </div>
        `;
    },

    personas: (state) => `
        <div class="sec-header">
            <button class="btn btn-primary" id="btn-add-persona">+ Criar Perfil Completo</button>
        </div>
        <div class="kpi-grid">
            ${state.personas.length === 0 ? '<div class="card full-width empty-state">Nenhuma persona cadastrada. Defina seu público para guiar a comunicação.</div>' : 
              state.personas.map((p, idx) => `
                <div class="card persona-card">
                    <div class="persona-header">
                        <div class="persona-avatar">
                            ${p.foto ? `<img src="${p.foto}" alt="${p.nome}">` : (p.nome || "??").substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h4 class="card-title">${p.nome || "Sem Nome"}</h4>
                            <p class="card-sub">${p.sub || "Sem Título"} • ${p.idade || "Idade N/A"}</p>
                        </div>
                        <button class="btn-delete-item" style="margin-left:auto" onclick="if(confirm('Excluir esta persona?')){ State.personas.splice(${idx},1); State.save(); renderPage('personas'); }">×</button>
                    </div>
                    <div class="persona-body">
                        <div class="persona-meta-grid">
                            <div class="meta-item">
                                <span class="stat-label">Objetivos</span>
                                <p>${p.objetivos || "Não definido"}</p>
                            </div>
                            <div class="meta-item">
                                <span class="stat-label">Dores / Medos</span>
                                <p>${p.desc || "Não definido"}</p>
                            </div>
                            <div class="meta-item">
                                <span class="stat-label">Hábitos & Estilo</span>
                                <p>${p.habitos || "Não definido"}</p>
                            </div>
                            <div class="meta-item">
                                <span class="stat-label">Por que a LifeStars?</span>
                                <p>${p.por_que || "Não definido"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `,

    clientes: (state) => `
        <div class="sec-header">
            <button class="btn btn-primary" onclick="addClient()">+ Adicionar Cliente</button>
        </div>

        <div class="leads-controls-bar mb-6">
            <div class="search-wrapper">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" id="client-search-input" placeholder="Pesquisar por nome do cliente ou responsável..." oninput="window.filterClients()">
            </div>
        </div>

        <div class="clients-directory">
            ${state.clients.length === 0 ? `
                <div class="card full-width empty-state">
                    <p>Nenhum cliente cadastrado. Adicione os primeiros clientes para gerenciar suas autorizações.</p>
                </div>
            ` : `
                <div class="clients-grid" id="clients-grid-container">
                    ${state.clients.map(c => `
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
                    `).join('')}
                </div>
            `}
        </div>
    `,

    kanban: (state) => `
        <div class="sec-header">
            <div class="btn-group">
                <button class="btn btn-secondary" onclick="addKanbanColumn()">+ Adicionar Etapa</button>
                <button class="btn btn-primary" id="btn-add-kanban-task">+ Nova Tarefa</button>
            </div>
        </div>
        <div class="kanban-board">
            ${state.kanban.map((col, cIdx) => `
                <div class="kanban-column" data-col-id="${col.id}">
                    <div class="kanban-column-header">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span class="column-title" onclick="editKanbanColumn(${col.id})" title="Clique para renomear">${col.title}</span>
                            <span class="column-count">${col.tasks.length}</span>
                            <button class="btn-add-to-col" onclick="openTaskModal(null, { colIndex: ${cIdx} })" title="Adicionar nesta coluna">+</button>
                        </div>
                        <button class="btn-icon btn-sm" onclick="deleteKanbanColumn(${col.id})" title="Remover etapa">×</button>
                    </div>
                    <div class="kanban-tasks" id="col-${col.id}" ondragover="event.preventDefault(); this.classList.add('dragover')" ondragleave="this.classList.remove('dragover')" ondrop="onDropTask(event, ${col.id})">
                        ${col.tasks.map(task => `
                            <div class="kanban-card" draggable="true" ondragstart="onDragStartTask(event, ${task.id}, ${col.id})" onclick="editKanbanTask(${task.id})">
                                <div class="task-tags">
                                    ${(task.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                                <h4 class="task-title">${task.title}</h4>
                                <div class="task-priority-label ${task.priority || 'baixa'}">
                                    ${task.priority === 'alta' ? 'Alta' : task.priority === 'media' ? 'Média' : 'Baixa'}
                                </div>
                                <div class="task-meta">
                                    <div class="task-info">
                                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        ${task.responsavel || 'Sem resp.'}
                                    </div>
                                    <div class="task-info">
                                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                        ${task.prazo ? new Date(task.prazo).toLocaleDateString('pt-BR', {day:'2-digit', month:'short'}) : 'Sem prazo'}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `,

    conteudo: (state) => {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        let viewDate = state.calendarViewDate;
        if (!viewDate || !(viewDate instanceof Date)) {
            viewDate = new Date();
        }
        const currentMonthIdx = viewDate.getMonth();
        const currentYear = viewDate.getFullYear();
        const currentMonthName = months[currentMonthIdx];
        
        const now = new Date();
        const isCurrentMonth = now.getMonth() === currentMonthIdx && now.getFullYear() === currentYear;
        const currentDay = isCurrentMonth ? now.getDate() : -1;

        // Calculate first day of month and total days
        const firstDayOfMonth = new Date(currentYear, currentMonthIdx, 1).getDay(); // 0 (Sun) to 6 (Sat)
        const daysInMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate();

        let gridHtml = '';
        
        // Add empty cells for leading days
        for (let i = 0; i < firstDayOfMonth; i++) {
            gridHtml += '<div class="cal-day-modern empty"></div>';
        }

        // Get all tasks from all kanban columns
        const allKanbanTasks = (state.kanban || []).reduce((acc, col) => acc.concat(col.tasks || []), []);

        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(currentYear, currentMonthIdx, day);
            const dayOfWeek = dateObj.getDay();
            const isToday = day === currentDay;

            // Tasks from the manual calendar
            const manual = (state.calendarTasks || []).filter(t => {
                if (!t.date) return parseInt(t.day) === day && !isCurrentMonth ? false : parseInt(t.day) === day; // Legacy check
                const [y, m, d] = t.date.split('-').map(Number);
                return y === currentYear && m === (currentMonthIdx + 1) && d === day;
            });
            
            const kanbanFiltered = allKanbanTasks.filter(t => {
                if (!t.prazo) return false;
                try {
                    const [y, m, d] = t.prazo.split('-').map(Number);
                    return y === currentYear && m === (currentMonthIdx + 1) && d === day;
                } catch(e) { return false; }
            });

            const recurring = (state.calendarRules || []).map((r, idx) => ({ ...r, ruleIdx: idx })).filter(r => (r.days || []).includes(dayOfWeek));
            const dateStr = `${currentYear}-${currentMonthIdx + 1}-${day}`;
            
            const allEvents = [
                ...(recurring || []).map(r => {
                    const isCompleted = (r?.completedDates || []).includes(dateStr);
                    return { ...r, source: 'recurring', isCompleted };
                }),
                ...(manual || []).map(m => ({ ...m, source: 'manual', isCompleted: !!m?.completed })),
                ...(kanbanFiltered || []).map(k => {
                    const isCompleted = state.kanban?.[3]?.tasks?.some(t => String(t?.id) === String(k?.id)) || false;
                    return { title: k?.title || 'Sem título', type: k?.type || 'post', source: 'kanban', id: k?.id, isCompleted };
                })
            ];

            gridHtml += `
                <div class="cal-day-modern ${allEvents.length ? 'has-events' : ''} ${isToday ? 'today' : ''}" onclick="addCalendarTask(${day})">
                    <span class="day-number-label">${day}</span>
                    <div class="day-events-container">
                        ${allEvents.map(e => `
                            <div class="event-pill ${e.type || 'post'} ${e.source} ${e.isCompleted ? 'completed' : ''}" 
                                 onclick="event.stopPropagation(); ${e.source === 'recurring' ? `window.openRecurringModal(${e.ruleIdx}, '${dateStr}')` : `openTaskModal('${e.id}')`}">
                                <span class="event-dot"></span>
                                <span class="event-text">${e.title}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn-add-day-event">+</button>
                </div>
            `;
        }

        return `
        <div class="calendar-modern-container">
            <div class="calendar-main-card card">
                <div class="calendar-header-premium">
                    <div class="calendar-nav-info">
                        <h2 class="calendar-month-title">${currentMonthName} ${currentYear}</h2>
                        <p class="calendar-sub-info">Gestão de cronograma e fluxo de postagens</p>
                    </div>
                    <div class="calendar-nav-controls">
                        <button class="btn-calendar-nav" onclick="window.changeMonth(-1)"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
                        <button class="btn-calendar-nav" onclick="window.changeMonth(1)"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
                    </div>
                </div>

                <div class="calendar-grid-modern">
                    <div class="cal-weekday">Dom</div>
                    <div class="cal-weekday">Seg</div>
                    <div class="cal-weekday">Ter</div>
                    <div class="cal-weekday">Qua</div>
                    <div class="cal-weekday">Qui</div>
                    <div class="cal-weekday">Sex</div>
                    <div class="cal-weekday">Sáb</div>
                    ${gridHtml}
                </div>
            </div>

            <div class="calendar-footer-configs">
                <div class="card config-card">
                    <div class="config-header">
                        <div class="config-icon-box">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <div>
                            <h4 class="config-title">Regras de Recorrência</h4>
                            <p class="config-sub">Automações de tarefas fixas</p>
                        </div>
                        <button class="btn btn-primary btn-sm ml-auto" id="btn-add-cal-rule">+ Nova Regra</button>
                    </div>
                    <div class="rules-flex-list">
                        ${state.calendarRules.length === 0 ? '<p class="empty-rules">Nenhuma regra ativa no momento.</p>' : 
                          state.calendarRules.map((r, idx) => `
                            <div class="rule-chip">
                                <span>${r.title}</span>
                                <button class="rule-remove" onclick="event.stopPropagation(); State.calendarRules.splice(${idx},1); State.save(); renderPage('conteudo');">×</button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                </div>
            </div>
        </div>
        `;
    },

    relatorios: (state) => `
        <div class="page-header-premium">
            <div class="header-main-info">
                <h1 class="page-title">Centro de Inteligência</h1>
                <p class="page-subtitle">Transforme dados operacionais em relatórios estratégicos de marketing</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="window.addReport()">+ Novo Relatório Customizado</button>
            </div>
        </div>

        <div class="section-title-premium">
            <h3>Relatórios Recentes</h3>
        </div>

        <div class="reports-list-grid">
            ${state.reports.length === 0 ? `
                <div class="card empty-state-premium">
                    <div class="empty-illustration">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--border-hover)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </div>
                    <h4>Nenhum relatório encontrado</h4>
                    <p>Suas análises estratégicas aparecerão aqui após serem processadas.</p>
                </div>
            ` : state.reports.map((r, idx) => `
                <div class="card report-modern-card" onclick="window.viewReport('${r.id}', ${idx})">
                    <div class="report-preview-thumb">
                        ${r.image ? `<img src="${r.image}" alt="Preview">` : `
                            <div class="placeholder-report-icon">
                                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            </div>
                        `}
                    </div>
                    <div class="report-modern-info">
                        <span class="report-tag">${r.type || 'Análise'}</span>
                        <h4 class="report-modern-title">${r.title}</h4>
                        <p class="report-modern-meta">Gerado em ${new Date(r.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <button class="report-delete-btn" onclick="event.stopPropagation(); window.deleteReport('${r.id}', ${idx})">×</button>
                </div>
            `).join('')}
        </div>
    `,

    leads: (state) => `
        <div class="sec-header">
            <button class="btn btn-primary" onclick="window.openLeadModal()">+ Registrar Lead Manual</button>
        </div>

        <div class="leads-controls-bar mb-6">
            <div class="search-wrapper">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" id="lead-search-input" placeholder="Pesquisar leads por nome, telefone ou origem..." oninput="window.filterLeads()">
            </div>
        </div>

        <div class="card leads-container">
            <div class="table-responsive">
                <table class="leads-table">
                    <thead>
                        <tr>
                            <th>Lead / Contato</th>
                            <th>Origem</th>
                            <th>Telefone</th>
                            <th>Data</th>
                            <th>Captura (Print)</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="leads-tbody">
                        ${state.leads.length === 0 ? `
                            <tr><td colspan="7" class="empty-leads">Nenhum lead manual registrado ainda.</td></tr>
                        ` : state.leads.map((l, idx) => `
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
                                        <button class="btn-icon-clean" onclick="window.openLeadModal(${idx})">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        </button>
                                        <button class="btn-icon-clean" onclick="deleteLead(${idx})">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `,

    equipe: (state) => `
        <div class="card full-width mb-6">
            <div class="card-header">
                <h3 class="card-title">Perfil do Usuário</h3>
                <p class="card-sub">Como você aparece no sistema</p>
            </div>
            <div class="card-body">
                <div class="settings-row" style="padding: 20px 0; border-bottom: 1px solid var(--border-color); display: flex; gap: 20px;">
                    <div style="flex: 1;">
                        <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 700; font-size: 13px;">Nome Completo</label>
                        <input type="text" id="profile-name" class="form-control" value="${state.userProfile?.name || ''}" placeholder="Seu nome" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                    </div>
                    <div style="flex: 1;">
                        <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 700; font-size: 13px;">Cargo / Função</label>
                        <input type="text" id="profile-role" class="form-control" value="${state.userProfile?.role || ''}" placeholder="Ex: Diretor de Marketing" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                    </div>
                </div>
                <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
                    <button class="btn btn-primary" onclick="window.saveUserProfile()">Salvar Perfil</button>
                </div>
            </div>
        </div>

        <div class="card full-width mb-6">
            <div class="card-header">
                <h3 class="card-title">Integração Google Cloud</h3>
                <p class="card-sub">Conecte sua conta Google para armazenamento ilimitado e sincronização em tempo real</p>
            </div>
            <div class="card-body">
                <div class="settings-row" style="padding: 20px 0; border-bottom: 1px solid var(--border-color);">
                    <div class="settings-info">
                        <span class="settings-label" style="font-size: 16px;">Google Drive Storage</span>
                        <span class="settings-desc">Sincroniza automaticamente Kanban, Clientes, SWOT e Ativos</span>
                    </div>
                    <div>
                        ${window.accessToken ? `
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span class="badge badge-success">Conectado</span>
                                <button class="btn btn-secondary" style="padding: 8px 16px;" onclick="window.connectDrive()">Trocar Conta</button>
                            </div>
                        ` : `
                            <button class="btn btn-primary" onclick="window.connectDrive()">Conectar Google Drive</button>
                        `}
                    </div>
                </div>
                <div class="settings-row" style="padding: 20px 0; border-bottom: 1px solid var(--border-color);">
                    <div class="settings-info">
                        <span class="settings-label">Sincronização Forçada</span>
                        <span class="settings-desc">Enviar dados locais para o Drive manualmente (útil para migrar do localhost)</span>
                    </div>
                    <button class="btn btn-secondary" onclick="window.forceSync()">Sincronizar Agora</button>
                </div>
                <div class="settings-row" style="padding: 20px 0;">
                    <div class="settings-info">
                        <span class="settings-label">Sincronização Ativa</span>
                        <span class="settings-desc">Salvar alterações automaticamente na nuvem</span>
                    </div>
                    <input type="checkbox" checked disabled>
                </div>
            </div>
        </div>
    `,

    senhas: (state) => `
        <div class="sec-header">
            <h2 class="sec-title">Central de Segurança</h2>
            <button class="btn btn-primary" onclick="window.openAddPasswordModal()">+ Nova Ferramenta</button>
        </div>
        
        <div class="card p-0 overflow-hidden" style="margin-top: 20px;">
            <table class="senhas-table">
                <thead>
                    <tr>
                        <th>Ferramenta</th>
                        <th>Usuário / E-mail</th>
                        <th>Senha</th>
                        <th style="text-align: right;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.passwords.length === 0 ? `
                        <tr>
                            <td colspan="4" class="empty-table-state">
                                <div class="empty-illustration">🔑</div>
                                <p>Nenhuma senha salva ainda.</p>
                                <span style="font-size: 12px; opacity: 0.6;">Organize seus acessos de marketing em um só lugar.</span>
                            </td>
                        </tr>
                    ` : state.passwords.map((p, idx) => `
                        <tr>
                            <td>
                                <div class="tool-info">
                                    <span class="tool-name">${p.ferramenta}</span>
                                    ${p.link ? `<a href="${p.link}" target="_blank" class="tool-link">${p.link.replace('https://', '').replace('http://', '')}</a>` : ''}
                                </div>
                            </td>
                            <td>
                                <div class="user-info-cell">
                                    <span class="user-val">${p.usuario}</span>
                                    <span class="email-val">${p.email}</span>
                                </div>
                            </td>
                            <td>
                                <div class="password-cell">
                                    <input type="password" value="${p.senha}" readonly class="pass-mask" id="pass-field-${idx}">
                                    <button class="btn-toggle-pass" onclick="window.togglePassVisibility(${idx})" title="Mostrar/Ocultar">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    </button>
                                </div>
                            </td>
                            <td style="text-align: right;">
                                <div class="table-actions">
                                    <button class="btn-table-action" onclick="window.editPassword(${idx})">Editar</button>
                                    <button class="btn-table-action delete" onclick="window.deletePassword(${idx})">Excluir</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `,

    seo: (state) => `
        <div class="page-header-premium">
            <div class="header-main-info">
                <h1 class="page-title">Inteligência de SEO</h1>
                <p class="page-subtitle">Acompanhamento mensal de posicionamento e busca orgânica por unidade</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="window.addSeoMonth()">+ Adicionar Mês de Relatórios</button>
            </div>
        </div>

        <div class="seo-months-container">
            ${state.seo.length === 0 ? `
                <div class="card empty-state-premium">
                    <div class="empty-illustration">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--border-hover)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 3v4M11 15v4M3 11h4M15 11h4"/></svg>
                    </div>
                    <h4>Nenhum relatório de SEO</h4>
                    <p>Adicione o primeiro mês para começar a organizar seus relatórios de Campinas, São Paulo e ABC.</p>
                </div>
            ` : state.seo.sort((a, b) => {
                const monthsMap = {
                    'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, 'Abril': 3, 'Maio': 4, 'Junho': 5,
                    'Julho': 6, 'Agosto': 7, 'Setembro': 8, 'Outubro': 9, 'Novembro': 10, 'Dezembro': 11
                };
                const yearA = parseInt(a.year);
                const yearB = parseInt(b.year);
                if (yearB !== yearA) return yearB - yearA;
                return monthsMap[b.month] - monthsMap[a.month];
            }).map((m, idx) => `
                <div class="seo-month-card card mb-6 ${state.expandedSeoMonthId === m.id ? 'expanded' : ''}" id="seo-month-${m.id}">
                    <div class="seo-month-header" onclick="window.toggleSeoMonth('${m.id}')">
                        <div class="month-info">
                            <h3 class="month-name">${m.month}</h3>
                            <span class="month-year">${m.year || ''}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:16px;">
                            <svg class="dropdown-chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                            <button class="btn-delete-item" onclick="event.stopPropagation(); window.deleteSeoMonth('${m.id}')">×</button>
                        </div>
                    </div>
                    
                    <div class="seo-reports-wrapper">
                        <div class="seo-reports-grid">
                            <div class="seo-report-slot">
                                <div class="slot-header">
                                    <span class="city-tag">Campinas</span>
                                </div>
                                ${m.reports.campinas ? `
                                    <div class="report-active" onclick="window.viewSeoReport('${m.id}', 'campinas')">
                                        <div class="report-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <div class="report-details">
                                            <span class="report-title">${m.reports.campinas.file ? m.reports.campinas.file.name : 'Relatório'}</span>
                                            <span class="report-meta">Ver detalhes</span>
                                        </div>
                                    </div>
                                ` : `
                                    <div class="report-empty" onclick="window.uploadSeoReport('${m.id}', 'campinas')">
                                        <div class="add-icon">+</div>
                                        <span>Adicionar Relatório</span>
                                    </div>
                                `}
                            </div>

                            <div class="seo-report-slot">
                                <div class="slot-header">
                                    <span class="city-tag">São Paulo</span>
                                </div>
                                ${m.reports.sp ? `
                                    <div class="report-active" onclick="window.viewSeoReport('${m.id}', 'sp')">
                                        <div class="report-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <div class="report-details">
                                            <span class="report-title">${m.reports.sp.file ? m.reports.sp.file.name : 'Relatório'}</span>
                                            <span class="report-meta">Ver detalhes</span>
                                        </div>
                                    </div>
                                ` : `
                                    <div class="report-empty" onclick="window.uploadSeoReport('${m.id}', 'sp')">
                                        <div class="add-icon">+</div>
                                        <span>Adicionar Relatório</span>
                                    </div>
                                `}
                            </div>

                            <div class="seo-report-slot">
                                <div class="slot-header">
                                    <span class="city-tag">ABC</span>
                                </div>
                                ${m.reports.abc ? `
                                    <div class="report-active" onclick="window.viewSeoReport('${m.id}', 'abc')">
                                        <div class="report-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <div class="report-details">
                                            <span class="report-title">${m.reports.abc.file ? m.reports.abc.file.name : 'Relatório'}</span>
                                            <span class="report-meta">Ver detalhes</span>
                                        </div>
                                    </div>
                                ` : `
                                    <div class="report-empty" onclick="window.uploadSeoReport('${m.id}', 'abc')">
                                        <div class="add-icon">+</div>
                                        <span>Adicionar Relatório</span>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `
};

// Add styles for templates
const style = document.createElement('style');
style.textContent = `
    .sec-header { margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; }
    .sec-title { font-size: 24px; font-weight: 700; color: var(--brand-primary); letter-spacing: -0.02em; }
    .sec-sub { font-size: 14px; color: var(--text-light); margin-top: 2px; }
    
    .brand-text p { margin-bottom: 12px; font-size: 14px; line-height: 1.6; color: var(--text-muted); }
    .brand-stat { margin-bottom: 16px; padding: 12px; background: var(--bg-main); border-radius: var(--radius-sm); border-left: 3px solid var(--brand-primary); }
    .stat-label { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--brand-primary); margin-bottom: 4px; display: block; }
    
    .data-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    .data-table th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-light); border-bottom: 1px solid var(--border-color); }
    .data-table td { padding: 14px 16px; border-bottom: 1px solid var(--border-color); font-size: 13px; color: var(--text-main); }
    .empty-state { text-align: center; padding: 48px !important; color: var(--text-light); font-style: italic; }
    
    .placeholder-container { text-align: center; padding: 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-light); font-size: 14px; }
    
    .project-card { position: relative; padding-top: 40px; }
    .project-tag { position: absolute; top: 16px; left: 16px; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: var(--brand-primary-soft); color: var(--brand-primary); text-transform: uppercase; }
    .project-tag.secondary { background: var(--bg-main); color: var(--text-light); }
    
    .chart-container { display: flex; align-items: flex-end; gap: 8px; height: 160px; padding: 16px 0; margin-top: 16px; }
    .chart-bar { flex: 1; background: var(--brand-primary-soft); border-radius: 4px 4px 0 0; transition: all 0.3s ease; }
    .chart-bar.active { background: var(--brand-primary); }
    .chart-bar:hover { filter: brightness(0.9); }
    
    .settings-row input[type="checkbox"]:checked::after { transform: translateX(16px); }

    /* SENHAS TABLE STYLES */
    .senhas-table { width: 100%; border-collapse: collapse; }
    .senhas-table th { text-align: left; padding: 16px 24px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-light); border-bottom: 1px solid var(--border-color); background: var(--bg-main); }
    .senhas-table td { padding: 16px 24px; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
    .tool-info { display: flex; flex-direction: column; gap: 4px; }
    .tool-name { font-weight: 700; color: var(--text-main); font-size: 14px; }
    .tool-link { font-size: 11px; color: var(--brand-primary); text-decoration: none; opacity: 0.8; }
    .user-info-cell { display: flex; flex-direction: column; gap: 2px; }
    .user-val { font-size: 13px; font-weight: 600; color: var(--text-main); }
    .email-val { font-size: 11px; color: var(--text-light); }
    .password-cell { display: flex; align-items: center; gap: 10px; background: var(--bg-main); padding: 4px 10px; border-radius: 8px; width: fit-content; border: 1px solid var(--border-color); }
    .pass-mask { border: none; background: transparent; font-family: monospace; font-size: 14px; width: 100px; color: var(--text-main); }
    .pass-mask:focus { outline: none; }
    .btn-toggle-pass { border: none; background: none; color: var(--text-light); cursor: pointer; display: flex; align-items: center; transition: 0.2s; }
    .btn-toggle-pass:hover { color: var(--brand-primary); }
    .table-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .btn-table-action { border: none; background: none; font-size: 12px; font-weight: 700; color: var(--brand-primary); cursor: pointer; padding: 4px 8px; border-radius: 4px; }
    .btn-table-action:hover { background: var(--brand-primary-soft); }
    .btn-table-action.delete { color: var(--error); }
    .btn-table-action.delete:hover { background: #fee2e2; }
    .empty-table-state { text-align: center; padding: 80px !important; color: var(--text-light); }
    .empty-illustration { font-size: 40px; margin-bottom: 16px; }

    /* SWOT & Personas Extra Styles */
    .color-palette { display: flex; gap: 16px; margin-top: 16px; }
    .color-item { flex: 1; text-align: center; }
    .color-swatch { height: 60px; border-radius: var(--radius-sm); margin-bottom: 8px; border: 1px solid var(--border-color); }
    .color-code { font-size: 11px; font-weight: 700; display: block; color: var(--text-main); }
    .color-name { font-size: 10px; color: var(--text-light); text-transform: uppercase; }

    .persona-card { padding: 0; overflow: hidden; }
    .persona-header { padding: 20px; background: var(--bg-main); display: flex; align-items: center; gap: 16px; border-bottom: 1px solid var(--border-color); }
    .persona-avatar { width: 48px; height: 48px; background: var(--brand-primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; }
    .persona-body { padding: 20px; }
    .persona-tags { display: flex; gap: 8px; margin-top: 16px; }
    .persona-tags span { font-size: 10px; font-weight: 700; background: var(--brand-primary-soft); color: var(--brand-primary); padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }

    /* BRAND INTELLIGENCE SINGLE PAGE DESIGN */
    .brand-long-page { display: flex; flex-direction: column; gap: 48px; max-width: 1200px; padding-bottom: 80px; }
    .brand-section-wrapper { animation: fadeIn 0.6s ease-out; }
    .section-nav-anchor { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; border-bottom: 2px solid var(--bg-main); padding-bottom: 12px; }
    .step-num { background: var(--brand-primary); color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; }
    .section-title-premium { font-size: 20px; font-weight: 800; color: var(--text-main); letter-spacing: -0.02em; }

    .brand-grid-expanded { display: flex; flex-direction: column; gap: 24px; }
    .brand-card-hero { background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 32px; box-shadow: var(--shadow-sm); }
    .brand-label-premium { font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--brand-primary); letter-spacing: 0.1em; margin-bottom: 16px; display: block; }
    .brand-textarea-rich { width: 100%; border: none; background: #fafafa; border-radius: var(--radius-md); padding: 24px; font-size: 16px; color: var(--text-main); line-height: 1.7; min-height: 250px; resize: none; outline: none; transition: 0.3s; border: 1px solid transparent; }
    .brand-textarea-rich:focus { background: #fff; border-color: var(--brand-primary-soft); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }

    .brand-trio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .brand-card-pillar { background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 24px; box-shadow: var(--shadow-sm); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden; }
    .brand-card-pillar:hover { transform: translateY(-8px); border-color: var(--brand-primary); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
    .brand-card-pillar::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--brand-primary); opacity: 0; transition: 0.3s; }
    .brand-card-pillar:hover::before { opacity: 1; }
    .pillar-hint { font-size: 11px; color: var(--text-light); margin-top: -12px; margin-bottom: 16px; font-weight: 500; }
    .brand-textarea-pillar { width: 100%; border: none; background: #fafafa; border-radius: var(--radius-sm); padding: 16px; font-size: 14px; color: var(--text-main); line-height: 1.6; min-height: 140px; resize: none; outline: none; }

    /* SWOT & PERSONAS */
    .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .swot-item { border-top: 4px solid var(--border-color); }
    .swot-item.s { border-top-color: var(--success); }
    .swot-item.w { border-top-color: var(--error); }
    .swot-item.o { border-top-color: var(--info); }
    .swot-item.t { border-top-color: var(--warning); }
    .swot-list { list-style: none; margin-top: 12px; padding: 0; }
    .swot-list li { font-size: 13px; color: var(--text-muted); padding: 8px 0; border-bottom: 1px solid #f5f5f5; display: flex; justify-content: space-between; align-items: center; }
    .swot-thumb { cursor: pointer; transition: 0.3s; padding: 16px; }
    .swot-thumb:hover { transform: translateY(-5px); border-color: var(--brand-primary); box-shadow: var(--shadow-md); }
    .swot-mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; width: 40px; height: 40px; margin-bottom: 12px; }
    .swot-mini-grid div { border-radius: 2px; opacity: 0.4; }
    .mini-s { background: var(--success); }
    .mini-w { background: var(--error); }
    .mini-o { background: var(--info); }
    .mini-t { background: var(--warning); }
    .btn-delete-item { background: none; border: none; color: var(--text-light); cursor: pointer; font-size: 16px; padding: 0 4px; }
    .btn-delete-item:hover { color: var(--error); }
    .btn-add-swot { width: 100%; margin-top: 16px; padding: 10px; border: 1px dashed var(--border-color); background: transparent; color: var(--text-light); font-weight: 700; cursor: pointer; border-radius: var(--radius-sm); transition: 0.2s; }
    .btn-add-swot:hover { border-color: var(--brand-primary); color: var(--brand-primary); background: var(--bg-main); }

    .premium-color-grid-modern { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 16px; }
    .modern-color-card { background: #fafafa; border-radius: var(--radius-md); padding: 12px; display: flex; align-items: center; gap: 16px; position: relative; border: 1px solid transparent; transition: 0.2s; }
    .modern-color-card:hover { background: #fff; border-color: var(--border-color); box-shadow: var(--shadow-sm); }
    .color-preview-circle { width: 48px; height: 48px; border-radius: 12px; position: relative; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); }
    .color-abs-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .color-info-stack { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .color-name-input-clean { border: none; background: transparent; font-weight: 700; font-size: 13px; color: var(--text-main); outline: none; }
    .color-hex-tag { font-family: monospace; font-size: 10px; color: var(--text-light); text-transform: uppercase; }
    .btn-delete-mini { position: absolute; top: 4px; right: 4px; border: none; background: transparent; color: var(--text-light); opacity: 0; cursor: pointer; font-size: 16px; }
    .modern-color-card:hover .btn-delete-mini { opacity: 1; }

    .brand-dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .brand-input-clean { width: 100%; border: none; background: #fafafa; padding: 18px; border-radius: var(--radius-md); font-weight: 700; color: var(--text-main); font-size: 16px; outline: none; border: 1px solid transparent; }
    .brand-input-clean:focus { background: #fff; border-color: var(--brand-primary-soft); }

    .brand-assets-flex { display: flex; flex-wrap: wrap; gap: 12px; }
    .asset-bubble { position: relative; width: 64px; height: 64px; background: #fff; border: 1px solid var(--border-color); border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .asset-bubble img { max-width: 70%; max-height: 70%; object-fit: contain; }
    .asset-remove-circle { position: absolute; top: -2px; right: -2px; background: var(--error); color: #fff; border: none; width: 16px; height: 16px; border-radius: 50%; font-size: 10px; cursor: pointer; opacity: 0; }
    .asset-bubble:hover .asset-remove-circle { opacity: 1; }
    
    .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
    .mt-12 { margin-top: 48px; }

    /* KANBAN STYLES IMPROVED */
    .kanban-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; align-items: flex-start; padding-bottom: 40px; }
    .kanban-column { background: #F1F2F4; border-radius: var(--radius-md); padding: 16px; min-height: 70vh; display: flex; flex-direction: column; border: 1px solid var(--border-color); }
    .kanban-column-header { display: flex; align-items: center; justify-content: space-between; padding: 0 4px 16px; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 16px; }
    .column-title { font-size: 13px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.03em; }
    .column-count { font-size: 11px; background: rgba(0,0,0,0.1); padding: 2px 8px; border-radius: 12px; color: var(--text-muted); font-weight: 700; }
    
    .kanban-tasks { display: flex; flex-direction: column; gap: 12px; min-height: 200px; transition: 0.2s; border-radius: var(--radius-sm); }
    .kanban-tasks.dragover { background: rgba(212, 104, 90, 0.1); outline: 2px dashed var(--brand-primary); }
    
    .kanban-card { background: #fff; border-radius: var(--radius-md); padding: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.04); cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid transparent; }
    .kanban-card:active { cursor: grabbing; transform: scale(0.96); opacity: 0.8; }
    .kanban-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); border-color: var(--brand-primary-soft); }
    
    .task-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
    .tag { font-size: 9px; font-weight: 800; background: var(--bg-main); color: var(--text-light); padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
    
    .task-title { font-size: 14px; font-weight: 700; color: var(--text-main); margin: 4px 0 12px; line-height: 1.4; }
    
    .task-priority-label { font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; width: fit-content; margin-bottom: 12px; }
    .task-priority-label.alta { background: #FFE5E5; color: #D32F2F; }
    .task-priority-label.media { background: #FFF4E5; color: #F57C00; }
    .task-priority-label.baixa { background: #E8F5E9; color: #388E3C; }
    
    .task-meta { display: flex; flex-direction: column; gap: 6px; padding-top: 12px; border-top: 1px solid #F1F2F4; }
    .task-info { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--text-light); font-weight: 500; }
    .task-info svg { opacity: 0.6; }

    /* Task Detail Modal Extensions */
    .task-modal-section { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-color); }
    .section-title { font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 12px; }
    
    .comments-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
    .comment-item { background: var(--bg-main); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); }
    .comment-header { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; }
    .comment-header strong { color: var(--brand-primary); }
    .comment-header span { color: var(--text-light); }
    .comment-item p { font-size: 13px; color: var(--text-muted); line-height: 1.4; }
    
    .add-comment { display: flex; gap: 8px; }
    .btn-sm { padding: 6px 12px; font-size: 11px; }
    
    .files-list { display: flex; flex-direction: column; gap: 8px; }
    .file-attachment { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-sm); }
    .file-info { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--text-main); font-weight: 600; }
    .file-actions { display: flex; gap: 4px; }

    /* REPORTS STYLES */
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .report-card { padding: 16px; position: relative; cursor: pointer; transition: 0.3s; }
    .report-card:hover { transform: translateY(-4px); border-color: var(--brand-primary); }
    .report-type-tag { position: absolute; top: 12px; left: 12px; font-size: 9px; font-weight: 800; background: var(--brand-primary-soft); color: var(--brand-primary); padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
    .report-file-icon { height: 120px; background: var(--bg-main); border-radius: var(--radius-sm); margin-bottom: 16px; display: flex; align-items: center; justify-content: center; color: var(--text-light); overflow: hidden; }
    .report-preview-img { width: 100%; height: 100%; object-fit: cover; }
    .report-title { font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
    .report-date { font-size: 12px; color: var(--text-light); }
    .report-actions { position: absolute; top: 8px; right: 8px; opacity: 0; transition: 0.2s; }
    .report-card:hover .report-actions { opacity: 1; }

    /* REPORT PRESENTATION VIEW */
    .report-presentation { padding: 40px; background: #fff; }
    .report-pres-header { text-align: center; margin-bottom: 40px; padding-bottom: 40px; border-bottom: 2px solid var(--bg-main); }
    .report-pres-header .badge { display: inline-block; background: var(--brand-primary); color: #fff; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px; }
    .pres-title { font-size: 32px; font-weight: 800; color: var(--text-main); letter-spacing: -0.03em; }
    .pres-date { color: var(--text-light); font-size: 16px; margin-top: 8px; }
    
    .pres-section { margin-bottom: 40px; }
    .pres-section h4 { font-size: 13px; font-weight: 800; text-transform: uppercase; color: var(--brand-primary); letter-spacing: 0.05em; margin-bottom: 16px; }
    .pres-text { font-size: 16px; line-height: 1.6; color: var(--text-muted); white-space: pre-wrap; }
    
    .pres-image-container { border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color); box-shadow: var(--shadow-md); }
    .pres-image-container img { width: 100%; display: block; }
    
    .pres-file-box { padding: 40px; background: var(--bg-main); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
    .pres-file-box span { font-weight: 700; color: var(--text-main); }
    
    .report-pres-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 60px; padding-top: 24px; border-top: 1px solid var(--border-color); }
    .logo-mini { font-weight: 800; font-size: 18px; color: var(--brand-primary); }
    .logo-mini span { color: var(--text-light); font-weight: 400; font-size: 14px; }
    
    .modal-content.wide { max-width: 1200px !important; width: 95% !important; }
    .modal-body { padding: 32px !important; }

    @media print {
        .modal-header, .modal-footer, .btn-secondary { display: none !important; }
        .modal-content { box-shadow: none !important; border: none !important; }
        .report-presentation { padding: 0; }
    }

    /* MODERN CALENDAR REDESIGN */
    .calendar-modern-container { display: flex; flex-direction: column; gap: 24px; max-width: 1400px; margin: 0 auto; padding-bottom: 40px; }
    .calendar-main-card { padding: 0; overflow: hidden; border: 1px solid var(--border-color); background: #fff; }
    
    .calendar-header-premium { display: flex; justify-content: space-between; align-items: center; padding: 32px 40px; background: #fff; border-bottom: 1px solid var(--border-color); }
    .calendar-month-title { font-size: 28px; font-weight: 800; color: var(--text-main); letter-spacing: -0.03em; }
    .calendar-sub-info { font-size: 14px; color: var(--text-light); margin-top: 4px; }
    
    .calendar-nav-controls { display: flex; gap: 12px; }
    .btn-calendar-nav { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border-color); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; color: var(--text-muted); }
    .btn-calendar-nav:hover { background: var(--bg-main); color: var(--brand-primary); border-color: var(--brand-primary); }

    .calendar-grid-modern { display: grid; grid-template-columns: repeat(7, 1fr); background: var(--border-color); gap: 1px; border-bottom: 1px solid var(--border-color); }
    .cal-weekday { background: #F8F9FA; padding: 16px; text-align: center; font-size: 11px; font-weight: 800; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.1em; }
    
    .cal-day-modern { background: #fff; min-height: 140px; padding: 12px; position: relative; cursor: pointer; transition: background 0.2s; display: flex; flex-direction: column; gap: 8px; }
    .cal-day-modern:hover { background: #FAFAFA; }
    .cal-day-modern:hover .btn-add-day-event { opacity: 1; }
    .cal-day-modern.empty { background: #fdfdfd; cursor: default; }
    .cal-day-modern.empty:hover { background: #fdfdfd; }
    
    .cal-day-modern.today { background: var(--brand-primary-soft); border: 1px solid var(--brand-primary); }
    .cal-day-modern.today .day-number-label { color: var(--brand-primary); font-size: 16px; }
    
    .day-number-label { font-size: 14px; font-weight: 700; color: var(--text-light); }
    .has-events .day-number-label { color: var(--brand-primary); }
    
    .day-events-container { display: flex; flex-direction: column; gap: 4px; }
    .event-pill { font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 6px; display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid var(--border-color); transition: 0.2s; }
    .event-pill:hover { transform: translateX(2px); border-color: var(--brand-primary-soft); }
    
    .event-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--brand-primary); }
    .event-text { color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    .event-pill.post { border-left: 3px solid var(--brand-primary); }
    .event-pill.blog { border-left: 3px solid var(--info); }
    .event-pill.email { border-left: 3px solid var(--warning); }
    .event-pill.kanban { border-left: 3px solid #805AD5; background: #FAF5FF; }
    .event-pill.kanban .event-dot { background: #805AD5; }
    .event-pill.recurring { background: #F8F9FA; }
    
    .btn-add-day-event { position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border-radius: 50%; border: none; background: var(--brand-primary); color: #fff; font-size: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0; transition: 0.2s; }

    .calendar-footer-configs { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .config-card { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    .config-header { display: flex; align-items: center; gap: 16px; margin-bottom: 4px; }
    .config-icon-box { width: 44px; height: 44px; border-radius: 12px; background: var(--brand-primary-soft); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; }
    .config-icon-box.google { background: #E8F0FE; color: #4285F4; }
    .config-title { font-size: 15px; font-weight: 700; color: var(--text-main); }
    .config-sub { font-size: 12px; color: var(--text-light); }
    
    .rules-flex-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .rule-chip { background: #F3F4F6; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: var(--text-muted); display: flex; align-items: center; gap: 8px; border: 1px solid var(--border-color); }
    .rule-remove { background: none; border: none; font-size: 16px; color: var(--text-light); cursor: pointer; }
    .rule-remove:hover { color: var(--error); }
    
    .google-sync-status { display: flex; align-items: center; gap: 10px; padding: 12px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0; }
    .sync-dot { width: 8px; height: 8px; border-radius: 50%; background: #10B981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); }
    .google-sync-status span { font-size: 12px; font-weight: 600; color: #64748B; }
    
    .ml-auto { margin-left: auto; }
    .empty-rules { font-size: 13px; color: var(--text-light); font-style: italic; }

    /* DASHBOARD EXTRA */
    .urgent-list { display: flex; flex-direction: column; gap: 12px; }
    .urgent-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: #FFF5F5; border-radius: var(--radius-sm); cursor: pointer; border: 1px solid #FED7D7; transition: 0.2s; }
    .urgent-item:hover { transform: translateX(4px); border-color: var(--error); }
    .urgent-dot { width: 8px; height: 8px; background: var(--error); border-radius: 50%; box-shadow: 0 0 0 3px rgba(212, 90, 90, 0.2); }
    .urgent-info strong { font-size: 13px; color: #742A2A; display: block; }
    .urgent-info p { font-size: 11px; color: #9B2C2C; }

    /* CLIENTS STYLES */
    .clients-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; }
    .client-card { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
    .client-header { height: 120px; background: var(--bg-main); position: relative; display: flex; align-items: flex-end; justify-content: center; }
    .client-avatar { width: 90px; height: 90px; border-radius: 50%; background-size: cover; background-position: center; border: 4px solid #fff; box-shadow: var(--shadow-sm); transform: translateY(35px); }
    .client-actions { position: absolute; top: 12px; right: 12px; }
    
    .client-body { padding: 45px 20px 20px; text-align: center; flex: 1; }
    .client-name { font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 4px; }
    .client-resp { font-size: 12px; color: var(--text-light); }
    
    .client-footer { padding: 16px; background: #fafafa; border-top: 1px solid var(--border-color); }
    .auth-status { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .auth-status.active { color: var(--success); }
    .auth-status.pending { color: var(--warning); }
    .auth-link { margin-left: auto; text-decoration: underline; cursor: pointer; color: var(--brand-primary); }
    
    .client-photo-upload { width: 80px; height: 80px; border-radius: 50%; border: 2px dashed var(--border-color); display: flex; align-items: center; justify-content: center; cursor: pointer; background-size: cover; background-position: center; margin: 0 auto; }
    .photo-placeholder { font-size: 24px; color: var(--text-light); }
    .mt-3 { margin-top: 12px; }

    /* LIBRARY STYLES */
    .library-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
    .library-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; }
    .library-item { border-radius: var(--radius-sm); border: 1px solid var(--border-color); overflow: hidden; background: #fff; }
    .library-thumb { height: 100px; background-size: cover; background-position: center; border-bottom: 1px solid var(--border-color); }
    .library-info { padding: 8px; display: flex; flex-direction: column; gap: 4px; }
    .library-name-edit { border: none; font-size: 11px; font-weight: 700; color: var(--text-main); width: 100%; outline: none; padding: 2px; }
    .library-name-edit:focus { background: var(--bg-main); border-radius: 2px; }
    .library-actions { display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid #f5f5f5; pt: 4px; }
    .btn-sm { padding: 4px 8px; font-size: 10px; }
    
    /* PROFILE MODAL STYLES */
    .client-profile-modal { padding: 20px; }
    .profile-header-info { display: flex; align-items: center; gap: 24px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color); }
    .profile-avatar-big { width: 120px; height: 120px; border-radius: 50%; background-size: cover; background-position: center; border: 4px solid var(--bg-main); box-shadow: var(--shadow-md); }
    .profile-name { font-size: 28px; font-weight: 800; color: var(--text-main); letter-spacing: -0.02em; }
    .profile-meta { color: var(--text-light); font-size: 14px; margin-top: 4px; }
    
    .profile-section-box { background: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; }
    .auth-box-profile { display: flex; align-items: center; justify-content: space-between; background: var(--bg-main); padding: 12px 16px; border-radius: var(--radius-sm); }
    .auth-box-profile.pending { background: #FFF9F0; border: 1px dashed #F6AD55; color: #C05621; font-size: 13px; justify-content: center; }
    
    .library-grid-profile { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; }
    .empty-state-mini { text-align: center; padding: 32px; color: var(--text-light); font-size: 13px; font-style: italic; background: var(--bg-main); border-radius: var(--radius-sm); grid-column: 1/-1; }
    .library-creation-add:hover { background: var(--bg-main); border-color: var(--brand-primary); color: var(--brand-primary); }

    /* HORIZONTAL PROFILE LAYOUT */
    .profile-horizontal-layout { display: grid; grid-template-columns: 300px 1fr; gap: 40px; }
    .profile-sidebar { display: flex; flex-direction: column; align-items: center; text-align: center; border-right: 1px solid var(--border-color); padding-right: 40px; }
    .profile-avatar-giant { width: 160px; height: 160px; border-radius: 50%; background-size: cover; background-position: center; margin-bottom: 24px; border: 6px solid var(--bg-main); box-shadow: var(--shadow-lg); }
    .profile-title { font-size: 24px; font-weight: 800; color: var(--text-main); margin-bottom: 8px; }
    .profile-subtitle { font-size: 14px; color: var(--text-light); }
    
    .profile-auth-section { width: 100%; text-align: left; }
    .section-title-clean { font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--brand-primary); letter-spacing: 0.05em; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .auth-card-clean { display: flex; align-items: center; gap: 12px; background: var(--bg-main); padding: 16px; border-radius: var(--radius-md); font-size: 13px; font-weight: 600; }
    .auth-card-clean.empty { color: var(--text-light); font-style: italic; border: 1px dashed var(--border-color); }
    .btn-download-link { margin-left: auto; color: var(--brand-primary); text-decoration: underline; font-size: 11px; }

    .profile-gallery-area { flex: 1; }
    .gallery-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .profile-library-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
    .gallery-item-card { background: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; transition: 0.2s; }
    .gallery-item-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
    .gallery-img-box { height: 120px; background-size: cover; background-position: center; border-bottom: 1px solid var(--border-color); }
    .gallery-details { padding: 12px; }
    .gallery-name-input { border: none; font-size: 12px; font-weight: 700; color: var(--text-main); width: 100%; outline: none; margin-bottom: 8px; }
    .gallery-actions { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--bg-main); padding-top: 8px; }
    .btn-icon-clean { background: none; border: none; cursor: pointer; color: var(--text-light); transition: 0.2s; padding: 0; }
    .btn-icon-clean:hover { color: var(--brand-primary); }
    .empty-gallery { padding: 60px; text-align: center; color: var(--text-light); background: var(--bg-main); border-radius: var(--radius-md); border: 1px dashed var(--border-color); font-size: 14px; grid-column: 1/-1; }
    /* PERFORMANCE HUB & LEADS */
    .performance-tabs { display: flex; gap: 32px; border-bottom: 1px solid var(--border-color); margin-bottom: 32px; }
    .perf-tab { background: none; border: none; padding: 12px 0; font-weight: 700; color: var(--text-light); cursor: pointer; position: relative; transition: 0.3s; font-size: 15px; }
    .perf-tab.active { color: var(--brand-primary); }
    .perf-tab.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--brand-primary); }
    
    .leads-container { padding: 0; overflow: hidden; }
    .leads-table { width: 100%; border-collapse: collapse; }
    .leads-table th { text-align: left; padding: 16px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-light); background: #fafafa; border-bottom: 1px solid var(--border-color); }
    .leads-table td { padding: 16px; border-bottom: 1px solid var(--border-color); font-size: 14px; color: var(--text-main); }
    .lead-name-cell { display: flex; flex-direction: column; gap: 2px; }
    .lead-origin { font-size: 10px; color: var(--text-light); font-weight: 600; }
    
    .lead-print-preview { width: 50px; height: 50px; border-radius: 6px; background: var(--bg-main); overflow: hidden; border: 1px solid var(--border-color); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-light); }
    .lead-print-preview img { width: 100%; height: 100%; object-fit: cover; }
    
    .status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .status-badge.pending { background: #FFF9F0; color: #C05621; }
    .status-badge.sent { background: #E6FFFA; color: #2C7A7B; }
    
    .empty-leads { text-align: center; padding: 60px !important; color: var(--text-light); font-style: italic; }
    /* PREMIUM CLIENT PROFILE */
    .profile-avatar-edit-box { position: relative; width: 160px; height: 160px; margin: 0 auto 24px; }
    .avatar-edit-badge { position: absolute; bottom: 8px; right: 8px; background: var(--brand-primary); color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 3px solid #fff; box-shadow: var(--shadow-sm); transition: 0.2s; }
    .avatar-edit-badge:hover { transform: scale(1.1); background: var(--text-main); }
    
    .form-label-mini { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--text-light); letter-spacing: 0.05em; display: block; margin-bottom: 8px; text-align: left; }
    .form-input-premium { width: 100%; border: 1px solid var(--border-color); background: #fafafa; padding: 12px 16px; border-radius: var(--radius-md); font-weight: 700; font-size: 14px; color: var(--text-main); outline: none; transition: 0.2s; text-align: left; }
    .form-input-premium:focus { border-color: var(--brand-primary); background: #fff; box-shadow: 0 0 0 4px var(--brand-primary-soft); }
    
    .auth-card-premium { padding: 16px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 16px; transition: 0.2s; border: 1px solid var(--border-color); }
    .auth-card-premium.active { background: #E6FFFA; border-color: #B2F5EA; }
    .auth-card-premium.empty { background: #fafafa; border-style: dashed; justify-content: center; color: var(--text-light); font-style: italic; font-size: 13px; }
    .auth-icon-box { width: 40px; height: 40px; background: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--brand-primary); box-shadow: var(--shadow-sm); }
    .auth-details { display: flex; flex-direction: column; gap: 2px; }
    .auth-filename { font-size: 13px; font-weight: 700; color: #234E52; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
    .auth-download-link { font-size: 11px; color: var(--brand-primary); font-weight: 600; text-decoration: underline; }
    
    .gallery-header-premium { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 1px solid var(--border-color); padding-bottom: 24px; }
    .gallery-title-main { font-size: 20px; font-weight: 800; color: var(--text-main); letter-spacing: -0.02em; }
    .gallery-sub { font-size: 13px; color: var(--text-light); }
    
    .empty-gallery-hero { padding: 80px 40px; text-align: center; color: var(--text-light); background: #fafafa; border-radius: var(--radius-lg); border: 2px dashed var(--border-color); grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .empty-gallery-hero p { font-size: 15px; font-style: italic; }
    
    .gallery-img-box { position: relative; height: 140px; background-size: cover; background-position: center; }
    .gallery-overlay { position: absolute; inset: 0; background: rgba(30,30,30,0.6); display: flex; align-items: center; justify-content: center; gap: 12px; opacity: 0; transition: 0.3s; backdrop-filter: blur(2px); }
    .gallery-img-box:hover .gallery-overlay { opacity: 1; }
    .btn-overlay-icon { background: #fff; color: var(--text-main); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: 0.2s; text-decoration: none; }
    .btn-overlay-icon:hover { transform: scale(1.1); background: var(--brand-primary); color: #fff; }
    .gallery-name-input-clean { width: 100%; border: none; background: transparent; font-size: 12px; font-weight: 700; color: var(--text-main); outline: none; text-align: center; }
    
    .btn-text-link { font-size: 11px; font-weight: 800; color: var(--brand-primary); text-transform: uppercase; cursor: pointer; }
    .mb-2 { margin-bottom: 8px; }

    /* PREMIUM CLIENT CARD */
    .clients-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; margin-top: 32px; }
    .premium-card { padding: 0 !important; overflow: hidden; display: flex; flex-direction: column; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid var(--border-color); background: #fff; cursor: pointer; }
    .premium-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--brand-primary); }
    
    .client-card-header { position: relative; padding: 32px 24px 16px; display: flex; flex-direction: column; align-items: center; background: linear-gradient(to bottom, #fafafa, #fff); }
    .client-avatar-wrapper { position: relative; }
    .client-avatar-main { width: 80px; height: 80px; border-radius: 50%; background-size: cover; background-position: center; border: 4px solid #fff; box-shadow: var(--shadow-sm); }
    .client-badge-status { position: absolute; bottom: 2px; right: 2px; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #fff; }
    .client-badge-status.active { background: #10B981; }
    .client-badge-status.pending { background: #F59E0B; }
    
    .btn-delete-client { position: absolute; top: 12px; right: 12px; background: none; border: none; color: var(--text-light); cursor: pointer; padding: 8px; border-radius: 50%; transition: 0.2s; }
    .btn-delete-client:hover { background: #fee2e2; color: #ef4444; }
    
    .client-card-body { padding: 0 24px 24px; text-align: center; }
    .client-card-name { font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 4px; }
    .client-card-resp { font-size: 12px; color: var(--text-light); margin-bottom: 20px; }
    
    .client-card-stats { display: flex; justify-content: center; gap: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0; }
    .stat-item { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.02em; }
    
    .client-card-footer { padding: 16px; background: #fafafa; border-top: 1px solid #f0f0f0; text-align: center; }
    .btn-view-profile { font-size: 11px; font-weight: 800; color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.05em; }

    /* POSTED BADGE */
    .posted-status-badge { position: absolute; top: 8px; left: 8px; background: #10B981; color: #fff; font-size: 9px; font-weight: 800; padding: 4px 8px; border-radius: 4px; cursor: pointer; transition: 0.2s; z-index: 10; border: 1px solid rgba(255,255,255,0.2); }
    .posted-status-badge.active { background: #EF4444; }
    .posted-status-badge:hover { filter: brightness(1.1); transform: scale(1.05); }
    .gallery-item-card.is-posted { border-color: #EF4444; }

    /* WORKSPACE PROFILE REDESIGN */
    .profile-workspace { display: flex; height: 80vh; overflow: hidden; background: #fff; margin: -30px -24px; }
    .workspace-sidebar { width: 340px; border-right: 1px solid var(--border-color); display: flex; flex-direction: column; background: #fcfcfc; flex-shrink: 0; }
    .workspace-section { padding: 32px; }
    .workspace-section.border-top { border-top: 1px solid var(--border-color); }
    .workspace-footer { margin-top: auto; padding: 24px 32px; border-top: 1px solid var(--border-color); }

    .avatar-edit-container { position: relative; width: 120px; margin: 0 auto; }
    .avatar-giant { width: 120px; height: 120px; border-radius: 24px; background-size: cover; background-position: center; box-shadow: var(--shadow-md); border: 4px solid #fff; }
    .avatar-edit-trigger { position: absolute; bottom: -8px; right: -8px; background: var(--brand-primary); color: #fff; width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content:center; cursor: pointer; border: 3px solid #fff; box-shadow: var(--shadow-sm); transition: 0.2s; }
    .avatar-edit-trigger:hover { transform: scale(1.1); }

    .field-group { margin-bottom: 20px; }
    .field-label { display: block; font-size: 11px; font-weight: 800; color: var(--text-light); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em; }
    .field-input { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border-color); background: #fff; font-size: 14px; font-weight: 600; transition: 0.2s; }
    .field-input:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

    .doc-pill { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 16px; background: #fff; border: 1px solid var(--border-color); transition: 0.2s; }
    .doc-pill.active { border-color: #10B981; background: #f0fdf4; }
    .doc-pill.empty { border-style: dashed; background: #f9fafb; color: var(--text-light); font-size: 13px; font-weight: 600; justify-content: center; }
    .doc-icon { width: 40px; height: 40px; border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center; color: #10B981; box-shadow: var(--shadow-sm); }
    .doc-info { display: flex; flex-direction: column; gap: 2px; }
    .doc-name { font-size: 12px; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
    .doc-link { font-size: 11px; font-weight: 700; color: var(--brand-primary); text-decoration: none; }

    .workspace-main { flex: 1; display: flex; flex-direction: column; background: #fff; overflow: hidden; }
    .workspace-header { padding: 32px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); }
    .workspace-main-title { font-size: 20px; font-weight: 800; color: var(--text-main); }
    .workspace-sub-text { font-size: 13px; color: var(--text-light); }

    .assets-grid { flex: 1; overflow-y: auto; padding: 40px; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 24px; align-content: start; }
    .asset-card { border-radius: 20px; overflow: hidden; border: 1px solid var(--border-color); transition: 0.3s; background: #fff; position: relative; }
    .asset-card:hover { border-color: var(--brand-primary); box-shadow: var(--shadow-lg); }
    .asset-preview { position: relative; aspect-ratio: 1; background-size: cover; background-position: center; background-color: #f9fafb; }
    .asset-actions-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; display: flex; align-items: center; justify-content: center; gap: 12px; transition: 0.2s; backdrop-filter: blur(2px); }
    .asset-preview:hover .asset-actions-overlay { opacity: 1; }
    .action-circle { width: 36px; height: 36px; border-radius: 50%; background: #fff; color: var(--text-main); display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; transition: 0.2s; text-decoration: none; }
    .action-circle:hover { transform: scale(1.1); color: var(--brand-primary); }
    .action-circle.delete:hover { color: #ef4444; }

    .status-indicator { position: absolute; top: 12px; left: 12px; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 6px; cursor: pointer; transition: 0.2s; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px); z-index: 10; }
    .status-indicator.pending { background: rgba(245, 158, 11, 0.9); color: #fff; }
    .status-indicator.posted { background: rgba(16, 185, 129, 0.9); color: #fff; }

    .asset-footer { padding: 12px; background: #fff; }
    .asset-name-edit { width: 100%; border: none; font-size: 12px; font-weight: 700; color: var(--text-main); background: transparent; padding: 4px; border-radius: 4px; }
    .asset-name-edit:focus { background: #f3f4f6; outline: none; }

    .assets-empty-state { grid-column: 1 / -1; padding: 80px 0; text-align: center; color: var(--text-light); }
    .empty-icon-box { width: 80px; height: 80px; border-radius: 50%; background: #f9fafb; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: var(--border-color); }
    .btn-danger-outline { padding: 12px; border-radius: 12px; border: 1px solid #fee2e2; background: #fff; color: #ef4444; font-size: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
    .btn-danger-outline:hover { background: #fef2f2; border-color: #fecaca; }
    .btn-text-action { font-size: 11px; font-weight: 800; color: var(--brand-primary); cursor: pointer; }
    .btn-icon-plus { display: flex; align-items: center; gap: 8px; }
    
    .badge { padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge-success { background: #f0fdf4; color: #10B981; border: 1px solid #dcfce7; }
    .badge-warning { background: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }

    .btn-add-to-col { 
        width: 22px; 
        height: 22px; 
        border-radius: 6px; 
        border: 1px solid var(--border-color); 
        background: #fff; 
        color: var(--text-light); 
        font-size: 14px; 
        font-weight: 700; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        cursor: pointer; 
        transition: 0.2s; 
        line-height: 1;
        padding: 0;
    }
    .btn-add-to-col:hover { 
        background: var(--brand-primary); 
        color: #fff; 
        border-color: var(--brand-primary); 
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);
