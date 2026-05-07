(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=t(o);fetch(o.href,n)}})();const P={dashboard:a=>{const e=o=>{if(!o)return new Date(864e13);const n=o.split("/"),s=parseInt(n[0]),l=parseInt(n[1]),d=n[2]?parseInt(n[2]):new Date().getFullYear();return new Date(d,l-1,s)},i=a.kanban.filter(o=>o.id!=="done").flatMap(o=>o.tasks||[]).sort((o,n)=>e(o.prazo)-e(n.prazo)).slice(0,5);return`
            
            <div class="kpi-grid" style="grid-template-columns: repeat(3, 1fr);">
                <div class="kpi-card" onclick="navigate('leads')" style="cursor: pointer;">
                    <div class="kpi-icon" style="background: rgba(255, 152, 0, 0.1); color: #FF9800;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Leads</span>
                        <span class="kpi-value">${a.leads.length}</span>
                    </div>
                </div>
                <div class="kpi-card" onclick="navigate('clientes')" style="cursor: pointer;">
                    <div class="kpi-icon" style="background: rgba(0, 150, 136, 0.1); color: #009688;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Autorizações de Imagem</span>
                        <span class="kpi-value">${a.clients.filter(o=>o.authImagem).length}</span>
                    </div>
                </div>
                <div class="kpi-card" onclick="navigate('kanban')" style="cursor: pointer;">
                    <div class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Tarefas em Fluxo</span>
                        <span class="kpi-value">${a.kanban.reduce((o,n)=>o+(n.tasks?n.tasks.length:0),0)}</span>
                    </div>
                </div>
                
                <div class="kpi-card" onclick="navigate('seo')" style="cursor: pointer;">
                    <div class="kpi-icon" style="background: rgba(76, 175, 80, 0.1); color: #4CAF50;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 3v4M11 15v4M3 11h4M15 11h4"/><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Relatórios SEO</span>
                        <span class="kpi-value">${a.seo.reduce((o,n)=>o+Object.values(n.reports||{}).filter(s=>s!==null).length,0)}</span>
                    </div>
                </div>
                <div class="kpi-card" onclick="navigate('ads')" style="cursor: pointer;">
                    <div class="kpi-icon" style="background: rgba(33, 150, 243, 0.1); color: #2196F3;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Relatórios ADS</span>
                        <span class="kpi-value">${a.ads.filter(o=>o.report!==null).length}</span>
                    </div>
                </div>
                <div class="kpi-card" onclick="navigate('senhas')" style="cursor: pointer;">
                    <div class="kpi-icon" style="background: rgba(156, 39, 176, 0.1); color: #9C27B0;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Senhas</span>
                        <span class="kpi-value">${a.passwords.length}</span>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid" style="grid-template-columns: 1fr;">
                <div class="card">
                    <h3 class="card-title">Prioridades Máximas</h3>
                    <p class="card-sub">Tarefas mais próximas do vencimento</p>
                    <div class="urgent-list">
                        ${i.length===0?'<p class="empty-state">Nenhuma tarefa pendente no momento. Bom trabalho!</p>':i.map(o=>`
                            <div class="urgent-item" onclick="navigate('kanban')" style="cursor: pointer;">
                                <div class="urgent-dot" style="background: ${o.priority==="alta"?"var(--brand-primary)":"#ccc"}"></div>
                                <div class="urgent-info">
                                    <strong>${o.title}</strong>
                                    <p>Vencimento: ${o.prazo||"Sem data"}</p>
                                </div>
                            </div>
                        `).join("")}
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
        `},brand:a=>`
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
                        <textarea id="brand-historia" class="brand-textarea-rich" placeholder="A história que nos trouxe até aqui...">${a.brand.historia}</textarea>
                    </div>

                    <div class="brand-trio-grid">
                        <div class="brand-card-pillar">
                            <label class="brand-label-premium">Missão</label>
                            <p class="pillar-hint">Por que existimos?</p>
                            <textarea id="brand-missao" class="brand-textarea-pillar">${a.brand.missao}</textarea>
                        </div>
                        <div class="brand-card-pillar">
                            <label class="brand-label-premium">Visão</label>
                            <p class="pillar-hint">Onde queremos chegar?</p>
                            <textarea id="brand-visao" class="brand-textarea-pillar">${a.brand.visao}</textarea>
                        </div>
                        <div class="brand-card-pillar">
                            <label class="brand-label-premium">Valores</label>
                            <p class="pillar-hint">No que acreditamos?</p>
                            <textarea id="brand-valores" class="brand-textarea-pillar">${a.brand.valores}</textarea>
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
                            ${a.brand.cores.map((e,t)=>`
                                <div class="modern-color-card">
                                    <div class="color-preview-circle" style="background: ${e.hex}">
                                        <input type="color" value="${e.hex}" onchange="State.brand.cores[${t}].hex = this.value; State.save(); renderPage('brand');" class="color-abs-input">
                                    </div>
                                    <div class="color-info-stack">
                                        <input type="text" value="${e.name}" onchange="State.brand.cores[${t}].name = this.value; State.save();" class="color-name-input-clean">
                                        <span class="color-hex-tag">${e.hex}</span>
                                    </div>
                                    <button class="btn-delete-mini" onclick="State.brand.cores.splice(${t}, 1); State.save(); renderPage('brand');">×</button>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <div class="brand-dual-grid">
                        <div class="brand-card-hero">
                            <label class="brand-label-premium">Tipografia</label>
                            <p class="pillar-hint">Fontes oficiais para comunicação</p>
                            <input type="text" id="brand-fontes" value="${a.brand.fontes}" class="brand-input-clean" placeholder="Ex: Outfit, Inter, Roboto">
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
                                ${a.brand.ativos.length===0?`
                                    <div class="empty-state-mini">Nenhum logo enviado</div>
                                `:a.brand.ativos.map((e,t)=>`
                                    <div class="asset-bubble">
                                        <img src="${e.data}" title="${e.name}">
                                        <button class="asset-remove-circle" onclick="deleteBrandAsset(${t})">×</button>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,ads:a=>`
        <div class="sec-header">
            <div class="header-info">
                <p class="section-subtitle">Gestão de relatórios mensais de tráfego pago</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="window.addAdsMonth()">+ Novo Mês de ADS</button>
            </div>
        </div>

        <div class="seo-months-container">
            ${a.ads.length===0?`
                <div class="empty-state-premium">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    </div>
                    <h4>Nenhum relatório de Tráfego Pago</h4>
                    <p>Adicione o primeiro mês para começar a organizar seus relatórios de anúncios.</p>
                </div>
            `:a.ads.sort((e,t)=>{const i={Janeiro:0,Fevereiro:1,Março:2,Abril:3,Maio:4,Junho:5,Julho:6,Agosto:7,Setembro:8,Outubro:9,Novembro:10,Dezembro:11},o=parseInt(e.year),n=parseInt(t.year);return n!==o?n-o:i[t.month]-i[e.month]}).map((e,t)=>`
                <div class="seo-month-card card mb-6 ${a.expandedAdsMonthId===e.id?"expanded":""}" id="ads-month-${e.id}">
                    <div class="seo-month-header" onclick="window.toggleAdsMonth('${e.id}')">
                        <div class="month-info">
                            <svg class="month-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            <span class="month-name">${e.month} ${e.year}</span>
                        </div>
                        <div class="month-actions">
                            <svg class="dropdown-chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                            <button class="btn-delete-item" onclick="event.stopPropagation(); window.deleteAdsMonth('${e.id}')">×</button>
                        </div>
                    </div>
                    
                    <div class="seo-reports-wrapper">
                        <div class="seo-reports-grid" style="grid-template-columns: 1fr;">
                            <div class="seo-report-slot">
                                <div class="slot-header">
                                    <span class="city-tag" style="background: var(--brand-primary-soft); color: var(--brand-primary);">Relatório de Tráfego Pago</span>
                                </div>
                                ${e.report?`
                                    <div class="report-active" onclick="window.viewAdsReport('${e.id}')">
                                        <div class="report-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <div class="report-details">
                                            <span class="report-title">${e.report.file?e.report.file.name:"Relatório"}</span>
                                            <span class="report-meta">Ver detalhes</span>
                                        </div>
                                    </div>
                                `:`
                                    <div class="report-empty" onclick="window.uploadAdsReport('${e.id}')">
                                        <div class="add-icon">+</div>
                                        <span>Adicionar Relatório</span>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `,analises:a=>{if(!a.activeSwotId)return`
                <div class="sec-header">
                    <button class="btn btn-primary" id="btn-create-swot">+ Nova Matriz</button>
                </div>
                <div class="kpi-grid">
                    ${a.swots.length===0?'<div class="card full-width empty-state">Nenhuma matriz SWOT criada ainda.</div>':a.swots.map(t=>`
                        <div class="card swot-thumb" onclick="State.activeSwotId='${t.id}'; navigate('analises');">
                            <div class="swot-mini-grid">
                                <div class="mini-s"></div><div class="mini-w"></div>
                                <div class="mini-o"></div><div class="mini-t"></div>
                            </div>
                            <h4 class="card-title">${t.name}</h4>
                            <p class="card-sub">${t.s.length+t.w.length+t.o.length+t.t.length} pontos identificados</p>
                        </div>
                    `).join("")}
                </div>
            `;const e=a.swots.find(t=>t.id===a.activeSwotId);return`
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
                        ${e.s.map((t,i)=>`<li>• ${t} <button class="btn-delete-item" onclick="State.swots.find(s=>s.id===State.activeSwotId).s.splice(${i},1); State.save(); renderPage('analises');">×</button></li>`).join("")}
                    </ul>
                    <button class="btn-add-swot" data-type="s">+ Adicionar Ponto</button>
                </div>
                <div class="card swot-item w">
                    <h3 class="card-title">Fraquezas (Weaknesses)</h3>
                    <ul class="swot-list">
                        ${e.w.map((t,i)=>`<li>• ${t} <button class="btn-delete-item" onclick="State.swots.find(s=>s.id===State.activeSwotId).w.splice(${i},1); State.save(); renderPage('analises');">×</button></li>`).join("")}
                    </ul>
                    <button class="btn-add-swot" data-type="w">+ Adicionar Ponto</button>
                </div>
                <div class="card swot-item o">
                    <h3 class="card-title">Oportunidades (Opportunities)</h3>
                    <ul class="swot-list">
                        ${e.o.map((t,i)=>`<li>• ${t} <button class="btn-delete-item" onclick="State.swots.find(s=>s.id===State.activeSwotId).o.splice(${i},1); State.save(); renderPage('analises');">×</button></li>`).join("")}
                    </ul>
                    <button class="btn-add-swot" data-type="o">+ Adicionar Ponto</button>
                </div>
                <div class="card swot-item t">
                    <h3 class="card-title">Ameaças (Threats)</h3>
                    <ul class="swot-list">
                        ${e.t.map((t,i)=>`<li>• ${t} <button class="btn-delete-item" onclick="State.swots.find(s=>s.id===State.activeSwotId).t.splice(${i},1); State.save(); renderPage('analises');">×</button></li>`).join("")}
                    </ul>
                    <button class="btn-add-swot" data-type="t">+ Adicionar Ponto</button>
                </div>
            </div>
        `},personas:a=>`
        <div class="sec-header">
            <button class="btn btn-primary" id="btn-add-persona">+ Criar Perfil Completo</button>
        </div>
        <div class="kpi-grid">
            ${a.personas.length===0?'<div class="card full-width empty-state">Nenhuma persona cadastrada. Defina seu público para guiar a comunicação.</div>':a.personas.map((e,t)=>`
                <div class="card persona-card">
                    <div class="persona-header">
                        <div class="persona-avatar">
                            ${e.foto?`<img src="${e.foto}" alt="${e.nome}">`:(e.nome||"??").substring(0,2).toUpperCase()}
                        </div>
                        <div>
                            <h4 class="card-title">${e.nome||"Sem Nome"}</h4>
                            <p class="card-sub">${e.sub||"Sem Título"} • ${e.idade||"Idade N/A"}</p>
                        </div>
                        <button class="btn-delete-item" style="margin-left:auto" onclick="if(confirm('Excluir esta persona?')){ State.personas.splice(${t},1); State.save(); renderPage('personas'); }">×</button>
                    </div>
                    <div class="persona-body">
                        <div class="persona-meta-grid">
                            <div class="meta-item">
                                <span class="stat-label">Objetivos</span>
                                <p>${e.objetivos||"Não definido"}</p>
                            </div>
                            <div class="meta-item">
                                <span class="stat-label">Dores / Medos</span>
                                <p>${e.desc||"Não definido"}</p>
                            </div>
                            <div class="meta-item">
                                <span class="stat-label">Hábitos & Estilo</span>
                                <p>${e.habitos||"Não definido"}</p>
                            </div>
                            <div class="meta-item">
                                <span class="stat-label">Por que a LifeStars?</span>
                                <p>${e.por_que||"Não definido"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `,clientes:a=>`
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
            ${a.clients.length===0?`
                <div class="card full-width empty-state">
                    <p>Nenhum cliente cadastrado. Adicione os primeiros clientes para gerenciar suas autorizações.</p>
                </div>
            `:`
                <div class="clients-grid" id="clients-grid-container">
                    ${a.clients.map(e=>`
                        <div class="card client-card premium-card" data-client-id="${e.id}">
                            <div class="client-card-header">
                                <div class="client-avatar-wrapper">
                                    <div class="client-avatar-main" style="${e.photo?`background-image: url(${e.photo})`:"background: var(--brand-primary); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:20px;"}">
                                        ${e.photo?"":(e.name||"??").substring(0,2).toUpperCase()}
                                    </div>
                                    <div class="client-badge-status ${e.auth?"active":"pending"}"></div>
                                </div>
                                <button class="btn-delete-client" onclick="event.stopPropagation(); window.deleteClient('${e.id}')">
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                            </div>
                            
                            <div class="client-card-body">
                                <h4 class="client-card-name">${e.name}</h4>
                                <p class="client-card-resp">${e.responsible||"Sem responsável"}</p>
                                
                                <div class="client-card-stats">
                                    <div class="stat-item">
                                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                        <span>${(e.library||[]).length} ativos</span>
                                    </div>
                                    <div class="stat-item">
                                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                        <span>${e.auth?"Autorizado":"Pendente"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `}
        </div>
    `,kanban:a=>`
        <div class="sec-header">
            <div class="btn-group">
                <button class="btn btn-secondary" onclick="addKanbanColumn()">+ Adicionar Etapa</button>
                <button class="btn btn-primary" id="btn-add-kanban-task">+ Nova Tarefa</button>
            </div>
        </div>
        <div class="kanban-board">
            ${a.kanban.map((e,t)=>`
                <div class="kanban-column" data-col-id="${e.id}">
                    <div class="kanban-column-header">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span class="column-title" onclick="editKanbanColumn(${e.id})" title="Clique para renomear">${e.title}</span>
                            <span class="column-count">${e.tasks.length}</span>
                            <button class="btn-add-to-col" onclick="openTaskModal(null, { colIndex: ${t} })" title="Adicionar nesta coluna">+</button>
                        </div>
                        <button class="btn-icon btn-sm" onclick="deleteKanbanColumn(${e.id})" title="Remover etapa">×</button>
                    </div>
                    <div class="kanban-tasks" id="col-${e.id}" ondragover="event.preventDefault(); this.classList.add('dragover')" ondragleave="this.classList.remove('dragover')" ondrop="onDropTask(event, ${e.id})">
                        ${e.tasks.map(i=>`
                            <div class="kanban-card" draggable="true" ondragstart="onDragStartTask(event, ${i.id}, ${e.id})" onclick="editKanbanTask(${i.id})">
                                <div class="task-tags">
                                    ${(i.tags||[]).map(o=>`<span class="tag">${o}</span>`).join("")}
                                </div>
                                <h4 class="task-title">${i.title}</h4>
                                <div class="task-priority-label ${i.priority||"baixa"}">
                                    ${i.priority==="alta"?"Alta":i.priority==="media"?"Média":"Baixa"}
                                </div>
                                <div class="task-meta">
                                    <div class="task-info">
                                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        ${i.responsavel||"Sem resp."}
                                    </div>
                                    <div class="task-info">
                                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                        ${i.prazo?new Date(i.prazo).toLocaleDateString("pt-BR",{day:"2-digit",month:"short"}):"Sem prazo"}
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `).join("")}
        </div>
    `,conteudo:a=>{const e=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],t=a.calendarViewDate||new Date,i=t.getMonth(),o=t.getFullYear(),n=e[i],s=new Date,l=s.getMonth()===i&&s.getFullYear()===o,d=l?s.getDate():-1,c=new Date(o,i,1).getDay(),v=new Date(o,i+1,0).getDate();let p="";for(let u=0;u<c;u++)p+='<div class="cal-day-modern empty"></div>';const m=(a.kanban||[]).reduce((u,y)=>u.concat(y.tasks||[]),[]);for(let u=1;u<=v;u++){const k=new Date(o,i,u).getDay(),C=u===d,I=(a.calendarTasks||[]).filter(f=>{if(!f.date)return parseInt(f.day)===u&&!l?!1:parseInt(f.day)===u;const[w,D,O]=f.date.split("-").map(Number);return w===o&&D===i+1&&O===u}),b=m.filter(f=>{if(!f.prazo)return!1;try{const[w,D,O]=f.prazo.split("-").map(Number);return w===o&&D===i+1&&O===u}catch{return!1}}),z=(a.calendarRules||[]).map((f,w)=>({...f,ruleIdx:w})).filter(f=>(f.days||[]).includes(k)),T=`${o}-${i+1}-${u}`,M=[...z.map(f=>{const w=(f.completedDates||[]).includes(T);return{...f,source:"recurring",isCompleted:w}}),...I.map(f=>({...f,source:"manual",isCompleted:f.completed})),...b.map(f=>{const w=a.kanban[3].tasks.some(D=>String(D.id)===String(f.id));return{title:f.title,type:f.type||"post",source:"kanban",id:f.id,isCompleted:w}})];p+=`
                <div class="cal-day-modern ${M.length?"has-events":""} ${C?"today":""}" onclick="addCalendarTask(${u})">
                    <span class="day-number-label">${u}</span>
                    <div class="day-events-container">
                        ${M.map(f=>`
                            <div class="event-pill ${f.type||"post"} ${f.source} ${f.isCompleted?"completed":""}" 
                                 onclick="event.stopPropagation(); ${f.source==="recurring"?`window.openRecurringModal(${f.ruleIdx}, '${T}')`:`openTaskModal('${f.id}')`}">
                                <span class="event-dot"></span>
                                <span class="event-text">${f.title}</span>
                            </div>
                        `).join("")}
                    </div>
                    <button class="btn-add-day-event">+</button>
                </div>
            `}return`
        <div class="calendar-modern-container">
            <div class="calendar-main-card card">
                <div class="calendar-header-premium">
                    <div class="calendar-nav-info">
                        <h2 class="calendar-month-title">${n} ${o}</h2>
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
                    ${p}
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
                        ${a.calendarRules.length===0?'<p class="empty-rules">Nenhuma regra ativa no momento.</p>':a.calendarRules.map((u,y)=>`
                            <div class="rule-chip">
                                <span>${u.title}</span>
                                <button class="rule-remove" onclick="event.stopPropagation(); State.calendarRules.splice(${y},1); State.save(); renderPage('conteudo');">×</button>
                            </div>
                        `).join("")}
                    </div>
                </div>

                </div>
            </div>
        </div>
        `},relatorios:a=>`
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
            ${a.reports.length===0?`
                <div class="card empty-state-premium">
                    <div class="empty-illustration">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--border-hover)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </div>
                    <h4>Nenhum relatório encontrado</h4>
                    <p>Suas análises estratégicas aparecerão aqui após serem processadas.</p>
                </div>
            `:a.reports.map((e,t)=>`
                <div class="card report-modern-card" onclick="window.viewReport('${e.id}', ${t})">
                    <div class="report-preview-thumb">
                        ${e.image?`<img src="${e.image}" alt="Preview">`:`
                            <div class="placeholder-report-icon">
                                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            </div>
                        `}
                    </div>
                    <div class="report-modern-info">
                        <span class="report-tag">${e.type||"Análise"}</span>
                        <h4 class="report-modern-title">${e.title}</h4>
                        <p class="report-modern-meta">Gerado em ${new Date(e.date).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <button class="report-delete-btn" onclick="event.stopPropagation(); window.deleteReport('${e.id}', ${t})">×</button>
                </div>
            `).join("")}
        </div>
    `,leads:a=>`
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
                        ${a.leads.length===0?`
                            <tr><td colspan="7" class="empty-leads">Nenhum lead manual registrado ainda.</td></tr>
                        `:a.leads.map((e,t)=>`
                            <tr>
                                <td><strong>${e.name}</strong></td>
                                <td><span class="lead-origin-tag">${e.origin||"Não definida"}</span></td>
                                <td>${e.phone}</td>
                                <td>${new Date(e.date).toLocaleDateString("pt-BR")}</td>
                                <td>
                                    <div class="lead-print-preview" onclick="viewLeadPrint('${e.imageDriveUrl||e.image}')">
                                        ${e.image?`<img src="${e.image}">`:"Sem print"}
                                    </div>
                                </td>
                                <td>
                                    <div class="status-badge ${e.sentDate?"sent":"pending"}">
                                        ${e.sentDate?"Enviado":"Pendente"}
                                    </div>
                                </td>
                                <td>
                                    <div style="display:flex; gap:8px;">
                                        <button class="btn-icon-clean" onclick="window.openLeadModal(${t})">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        </button>
                                        <button class="btn-icon-clean" onclick="deleteLead(${t})">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `,equipe:a=>{var e,t;return`
        <div class="card full-width mb-6">
            <div class="card-header">
                <h3 class="card-title">Perfil do Usuário</h3>
                <p class="card-sub">Como você aparece no sistema</p>
            </div>
            <div class="card-body">
                <div class="settings-row" style="padding: 20px 0; border-bottom: 1px solid var(--border-color); display: flex; gap: 20px;">
                    <div style="flex: 1;">
                        <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 700; font-size: 13px;">Nome Completo</label>
                        <input type="text" id="profile-name" class="form-control" value="${((e=a.userProfile)==null?void 0:e.name)||""}" placeholder="Seu nome" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
                    </div>
                    <div style="flex: 1;">
                        <label class="form-label" style="display: block; margin-bottom: 8px; font-weight: 700; font-size: 13px;">Cargo / Função</label>
                        <input type="text" id="profile-role" class="form-control" value="${((t=a.userProfile)==null?void 0:t.role)||""}" placeholder="Ex: Diretor de Marketing" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
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
                        ${window.accessToken?`
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span class="badge badge-success">Conectado</span>
                                <button class="btn btn-secondary" style="padding: 8px 16px;" onclick="window.connectDrive()">Trocar Conta</button>
                            </div>
                        `:`
                            <button class="btn btn-primary" onclick="window.connectDrive()">Conectar Google Drive</button>
                        `}
                    </div>
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
    `},senhas:a=>`
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
                    ${a.passwords.length===0?`
                        <tr>
                            <td colspan="4" class="empty-table-state">
                                <div class="empty-illustration">🔑</div>
                                <p>Nenhuma senha salva ainda.</p>
                                <span style="font-size: 12px; opacity: 0.6;">Organize seus acessos de marketing em um só lugar.</span>
                            </td>
                        </tr>
                    `:a.passwords.map((e,t)=>`
                        <tr>
                            <td>
                                <div class="tool-info">
                                    <span class="tool-name">${e.ferramenta}</span>
                                    ${e.link?`<a href="${e.link}" target="_blank" class="tool-link">${e.link.replace("https://","").replace("http://","")}</a>`:""}
                                </div>
                            </td>
                            <td>
                                <div class="user-info-cell">
                                    <span class="user-val">${e.usuario}</span>
                                    <span class="email-val">${e.email}</span>
                                </div>
                            </td>
                            <td>
                                <div class="password-cell">
                                    <input type="password" value="${e.senha}" readonly class="pass-mask" id="pass-field-${t}">
                                    <button class="btn-toggle-pass" onclick="window.togglePassVisibility(${t})" title="Mostrar/Ocultar">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    </button>
                                </div>
                            </td>
                            <td style="text-align: right;">
                                <div class="table-actions">
                                    <button class="btn-table-action" onclick="window.editPassword(${t})">Editar</button>
                                    <button class="btn-table-action delete" onclick="window.deletePassword(${t})">Excluir</button>
                                </div>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `,seo:a=>`
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
            ${a.seo.length===0?`
                <div class="card empty-state-premium">
                    <div class="empty-illustration">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--border-hover)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 3v4M11 15v4M3 11h4M15 11h4"/></svg>
                    </div>
                    <h4>Nenhum relatório de SEO</h4>
                    <p>Adicione o primeiro mês para começar a organizar seus relatórios de Campinas, São Paulo e ABC.</p>
                </div>
            `:a.seo.sort((e,t)=>{const i={Janeiro:0,Fevereiro:1,Março:2,Abril:3,Maio:4,Junho:5,Julho:6,Agosto:7,Setembro:8,Outubro:9,Novembro:10,Dezembro:11},o=parseInt(e.year),n=parseInt(t.year);return n!==o?n-o:i[t.month]-i[e.month]}).map((e,t)=>`
                <div class="seo-month-card card mb-6 ${a.expandedSeoMonthId===e.id?"expanded":""}" id="seo-month-${e.id}">
                    <div class="seo-month-header" onclick="window.toggleSeoMonth('${e.id}')">
                        <div class="month-info">
                            <h3 class="month-name">${e.month}</h3>
                            <span class="month-year">${e.year||""}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:16px;">
                            <svg class="dropdown-chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                            <button class="btn-delete-item" onclick="event.stopPropagation(); window.deleteSeoMonth('${e.id}')">×</button>
                        </div>
                    </div>
                    
                    <div class="seo-reports-wrapper">
                        <div class="seo-reports-grid">
                            <div class="seo-report-slot">
                                <div class="slot-header">
                                    <span class="city-tag">Campinas</span>
                                </div>
                                ${e.reports.campinas?`
                                    <div class="report-active" onclick="window.viewSeoReport('${e.id}', 'campinas')">
                                        <div class="report-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <div class="report-details">
                                            <span class="report-title">${e.reports.campinas.file?e.reports.campinas.file.name:"Relatório"}</span>
                                            <span class="report-meta">Ver detalhes</span>
                                        </div>
                                    </div>
                                `:`
                                    <div class="report-empty" onclick="window.uploadSeoReport('${e.id}', 'campinas')">
                                        <div class="add-icon">+</div>
                                        <span>Adicionar Relatório</span>
                                    </div>
                                `}
                            </div>

                            <div class="seo-report-slot">
                                <div class="slot-header">
                                    <span class="city-tag">São Paulo</span>
                                </div>
                                ${e.reports.sp?`
                                    <div class="report-active" onclick="window.viewSeoReport('${e.id}', 'sp')">
                                        <div class="report-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <div class="report-details">
                                            <span class="report-title">${e.reports.sp.file?e.reports.sp.file.name:"Relatório"}</span>
                                            <span class="report-meta">Ver detalhes</span>
                                        </div>
                                    </div>
                                `:`
                                    <div class="report-empty" onclick="window.uploadSeoReport('${e.id}', 'sp')">
                                        <div class="add-icon">+</div>
                                        <span>Adicionar Relatório</span>
                                    </div>
                                `}
                            </div>

                            <div class="seo-report-slot">
                                <div class="slot-header">
                                    <span class="city-tag">ABC</span>
                                </div>
                                ${e.reports.abc?`
                                    <div class="report-active" onclick="window.viewSeoReport('${e.id}', 'abc')">
                                        <div class="report-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <div class="report-details">
                                            <span class="report-title">${e.reports.abc.file?e.reports.abc.file.name:"Relatório"}</span>
                                            <span class="report-meta">Ver detalhes</span>
                                        </div>
                                    </div>
                                `:`
                                    <div class="report-empty" onclick="window.uploadSeoReport('${e.id}', 'abc')">
                                        <div class="add-icon">+</div>
                                        <span>Adicionar Relatório</span>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `},U=document.createElement("style");U.textContent=`
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
`;document.head.appendChild(U);const re="665517010127-irkemcj6r0kaup032p2ilts2pmf03c8p.apps.googleusercontent.com",ne="https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",se="https://www.googleapis.com/auth/drive.file",j="lifestars_marketing_os_v1.json";let F;window.accessToken=localStorage.getItem("ls_drive_token")||null;let q;const h={async init(){const a=()=>{window.gapi&&window.google?gapi.load("client",async()=>{try{await gapi.client.init({discoveryDocs:[ne]}),F=google.accounts.oauth2.initTokenClient({client_id:re,scope:se,callback:async e=>{e.error||(window.accessToken=e.access_token,localStorage.setItem("ls_drive_token",window.accessToken),localStorage.setItem("ls_drive_connected","true"),await this.syncWithCloud(),g(r.activePage||"dashboard"))}}),localStorage.getItem("ls_drive_connected")==="true"&&!window.accessToken?F.requestAccessToken({prompt:""}):window.accessToken&&await this.syncWithCloud()}catch(e){console.error("Erro ao inicializar Google Drive:",e)}}):setTimeout(a,100)};a()},async syncWithCloud(){if(window.accessToken)try{const a=await this.getOrCreateFolder("LifeStars_MarketingOS"),e=`name = '${j}' and '${a}' in parents and trashed = false`,t=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(e)}&fields=files(id)`,i=await fetch(t,{headers:{Authorization:"Bearer "+window.accessToken}}),o=await i.json();if(o.files&&o.files.length>0){const n=i.result.files[0].id,l=await(await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:"Bearer "+window.accessToken}})).json();Object.keys(l).forEach(d=>{d!=="save"&&d!=="activePage"&&(r[d]=l[d])}),console.log("Cloud data synced successfully")}else await this.saveStateToCloud()}catch(a){console.error("Erro na sincronização:",a)}},async saveStateToCloud(){if(window.accessToken)try{const a=await this.getOrCreateFolder("LifeStars_MarketingOS");await this.saveFile(j,JSON.stringify(r),a);const e=[{name:"Kanban",folder:"Fluxo_Kanban",data:r.kanban},{name:"Calendario",folder:"Calendario_Editorial",data:{rules:r.calendarRules,tasks:r.calendarTasks}},{name:"Brand",folder:"Identidade_Marca",data:r.brand},{name:"SWOT",folder:"Analises_SWOT",data:r.swots},{name:"Personas",folder:"Personas",data:r.personas},{name:"Performance",folder:"Performance_Leads",data:{leads:r.leads,reports:r.reports}},{name:"Clientes",folder:"Diretorio_Clientes",data:r.clients.map(t=>({id:t.id,name:t.name,responsible:t.responsible}))},{name:"Senhas",folder:"Seguranca_Senhas",data:r.passwords}];for(const t of e){const i=await this.getOrCreateFolder(t.folder,a);await this.saveFile(`${t.name.toLowerCase()}_data.json`,JSON.stringify(t.data,null,2),i)}console.log("State and Modules synced to Drive")}catch(a){console.error("Erro ao salvar no Drive:",a)}},async saveFile(a,e,t){const i=`name = '${a}' and '${t}' in parents and trashed = false`,o=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(i)}&fields=files(id)`,s=await(await fetch(o,{headers:{Authorization:"Bearer "+window.accessToken}})).json();let l="https://www.googleapis.com/upload/drive/v3/files?uploadType=media",d="POST";if(s.files&&s.files.length>0)l=`https://www.googleapis.com/upload/drive/v3/files/${s.files[0].id}?uploadType=media`,d="PATCH";else{const c={name:a,parents:[t]};l=`https://www.googleapis.com/upload/drive/v3/files/${(await(await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{Authorization:"Bearer "+window.accessToken,"Content-Type":"application/json"},body:JSON.stringify(c)})).json()).id}?uploadType=media`,d="PATCH"}await fetch(l,{method:d,headers:{Authorization:"Bearer "+window.accessToken,"Content-Type":"application/json"},body:e})},async getOrCreateFolder(a,e=null){let i=`name = '${a.replace(/'/g,"\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;e&&(i+=` and '${e}' in parents`);const o=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(i)}&fields=files(id)`,s=await(await fetch(o,{headers:{Authorization:"Bearer "+window.accessToken}})).json();if(s.files&&s.files.length>0)return s.files[0].id;const l={name:a,mimeType:"application/vnd.google-apps.folder",parents:e?[e]:[]};return(await(await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{Authorization:"Bearer "+window.accessToken,"Content-Type":"application/json"},body:JSON.stringify(l)})).json()).id},async uploadFile(a,e){var n;if(!window.accessToken)throw new Error("Google Drive não conectado.");const t={name:a.name,parents:[e]},i=new FormData;i.append("metadata",new Blob([JSON.stringify(t)],{type:"application/json"})),i.append("file",a);const o=await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webContentLink,webViewLink",{method:"POST",headers:new Headers({Authorization:"Bearer "+window.accessToken}),body:i});if(o.status===401)throw localStorage.removeItem("ls_drive_token"),window.accessToken=null,localStorage.getItem("ls_drive_connected")==="true"?(F.requestAccessToken({prompt:""}),new Error("Sessão expirada. Tentando reconectar...")):new Error("Sessão do Google expirada. Por favor, reconecte em Configurações.");if(!o.ok){const s=await o.json();throw new Error(((n=s.error)==null?void 0:n.message)||"Falha no upload para o Drive.")}return await o.json()},async trashFile(a){window.accessToken&&await fetch(`https://www.googleapis.com/drive/v3/files/${a}`,{method:"PATCH",headers:{Authorization:"Bearer "+window.accessToken,"Content-Type":"application/json"},body:JSON.stringify({trashed:!0})})},async trashFolderByName(a,e){if(!window.accessToken)return;const i=`name = '${a.replace(/'/g,"\\'")}' and mimeType = 'application/vnd.google-apps.folder' and '${e}' in parents and trashed = false`,o=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(i)}&fields=files(id)`,s=await(await fetch(o,{headers:{Authorization:"Bearer "+window.accessToken}})).json();if(s.files&&s.files.length>0)for(const l of s.files)await this.trashFile(l.id)}};window.connectDrive=()=>{localStorage.setItem("ls_drive_connected","true"),F.requestAccessToken({prompt:"select_account"})};const r={activePage:"dashboard",calendarViewDate:new Date,brand:JSON.parse(localStorage.getItem("ls_brand"))||{historia:"",missao:"",visao:"",valores:"",cores:[{name:"Coral Primário",hex:"#D4685A"},{name:"Areia Soft",hex:"#F7F3F0"},{name:"Cinza Tipográfico",hex:"#1E1E1E"}],nome:"LifeStars Cuidadores",posicionamento:"",tom:"",assets:[],primary:"#D4685A",secondary:"#F7F3F0",fontMain:"Inter",fontSecondary:"Inter"},swots:JSON.parse(localStorage.getItem("ls_swots"))||JSON.parse(localStorage.getItem("ls_swot"))||[{id:1,name:"Matriz Geral 2024",s:[],w:[],o:[],t:[]}],personas:JSON.parse(localStorage.getItem("ls_personas"))||[],kanban:JSON.parse(localStorage.getItem("ls_kanban"))||[{id:1,title:"Backlog Estratégia",tasks:[{id:101,title:"Curadoria de fotos Campinas (Maio)",responsavel:"Design & Arte",priority:"baixa",prazo:"2024-05-10",tags:["Fotografia","Unidade SP"],comments:[],files:[]},{id:102,title:"Revisão de Bio & Linktree Instagram",responsavel:"Equipe Marketing",priority:"media",prazo:"2024-05-12",tags:["Redes Sociais"],comments:[],files:[]}]},{id:2,title:"A Fazer",tasks:[{id:103,title:"Criação de Artes: Dia das Mães",responsavel:"Social Media",priority:"alta",prazo:"2024-05-08",tags:["Instagram","Campanha"],comments:[],files:[]},{id:105,title:"Copywriting para o Blog (Artigo Junho)",responsavel:"Copywriting",priority:"media",prazo:"2024-05-20",tags:["Blog","SEO"],comments:[],files:[]}]},{id:3,title:"Em Produção",tasks:[{id:104,title:"Webinar: Cuidados Paliativos & Apoio",responsavel:"Equipe Marketing",priority:"alta",prazo:"2024-05-15",tags:["Eventos","Webinar"],comments:[],files:[]}]},{id:4,title:"Concluído",tasks:[{id:106,title:"Relatório de Tráfego: Abril",responsavel:"Tráfego Pago",priority:"media",prazo:"2024-04-30",tags:["Analytics","Ads"],comments:[],files:[]}]}],calendarRules:JSON.parse(localStorage.getItem("ls_cal_rules"))||[],calendarTasks:JSON.parse(localStorage.getItem("ls_cal_tasks"))||[],clients:JSON.parse(localStorage.getItem("ls_clients"))||[],reports:JSON.parse(localStorage.getItem("ls_reports"))||[],leads:JSON.parse(localStorage.getItem("ls_leads"))||[],passwords:JSON.parse(localStorage.getItem("ls_passwords"))||[],seo:JSON.parse(localStorage.getItem("ls_seo"))||[],ads:JSON.parse(localStorage.getItem("ls_ads"))||[],userProfile:JSON.parse(localStorage.getItem("ls_user_profile"))||{name:"Equipe Marketing",role:"LifeStars Admin"},expandedSeoMonthId:null,expandedAdsMonthId:null,save(){try{localStorage.setItem("ls_brand",JSON.stringify(this.brand)),localStorage.setItem("ls_swots",JSON.stringify(this.swots)),localStorage.setItem("ls_personas",JSON.stringify(this.personas)),localStorage.setItem("ls_kanban",JSON.stringify(this.kanban)),localStorage.setItem("ls_cal_rules",JSON.stringify(this.calendarRules)),localStorage.setItem("ls_cal_tasks",JSON.stringify(this.calendarTasks)),localStorage.setItem("ls_clients",JSON.stringify(this.clients)),localStorage.setItem("ls_reports",JSON.stringify(this.reports)),localStorage.setItem("ls_leads",JSON.stringify(this.leads)),localStorage.setItem("ls_passwords",JSON.stringify(this.passwords)),localStorage.setItem("ls_seo",JSON.stringify(this.seo)),localStorage.setItem("ls_ads",JSON.stringify(this.ads)),localStorage.setItem("ls_user_profile",JSON.stringify(this.userProfile)),window.accessToken&&(clearTimeout(q),q=setTimeout(()=>h.saveStateToCloud(),2e3))}catch(a){console.error("Erro ao salvar no LocalStorage:",a),a.name==="QuotaExceededError"&&!window.accessToken&&alert("Atenção: O armazenamento do seu navegador está cheio. Conecte o Google Drive em 'Configurações' para continuar salvando seus arquivos com segurança.")}}};function V(){const a=document.querySelector(".user-name"),e=document.querySelector(".user-role"),t=document.querySelector(".user-avatar");if(a&&(a.textContent=r.userProfile.name),e&&(e.textContent=r.userProfile.role),t){const i=r.userProfile.name.split(" ").filter(o=>o.length>0).map(o=>o[0]).join("").substring(0,2).toUpperCase();t.textContent=i||"??"}}window.saveUserProfile=()=>{var t,i;const a=(t=document.getElementById("profile-name"))==null?void 0:t.value,e=(i=document.getElementById("profile-role"))==null?void 0:i.value;if(!a||!e){alert("Preencha todos os campos do perfil.");return}r.userProfile={name:a,role:e},r.save(),V(),alert("Perfil atualizado com sucesso!")};function $(a,e,t){const i=`
        <div style="text-align: center; padding: 10px 0;">
            <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">${e}</p>
        </div>
    `;x(a,i,()=>(t(),!0))}const _={dashboard:["Dashboard","Monitoramento estratégico e operacional"],brand:["Marca","Cultura, identidade e diretrizes"],personas:["Público","Mapa de empatia e perfis de público"],analises:["SWOT","Matrizes de planejamento estratégico"],conteudo:["Calendário","Fluxo de produção de conteúdo"],kanban:["Projetos","Gestão de tarefas e produtividade"],relatorios:["Relatórios","Análise de performance e KPIs"],leads:["Leads","Gestão de conversões sociais"],ads:["Tráfego Pago (ADS)","Gestão de relatórios de anúncios"],clientes:["Autorizações de Imagem","Gestão de ativos e conformidade"],senhas:["Central de Senhas","Gestão segura de acessos e ferramentas"],seo:["Inteligência de SEO","Relatórios de posicionamento e busca orgânica"],ads:["Tráfego Pago","Relatórios de performance de anúncios"],equipe:["Configurações","Acessos e preferências do sistema"]};function R(a){if(!_[a]){console.warn(`Page ${a} not found in PageInfo`);return}document.querySelectorAll(".page").forEach(o=>o.classList.remove("active")),document.querySelectorAll(".nav-item").forEach(o=>o.classList.remove("active"));const e=document.getElementById(`page-${a}`);e&&e.classList.add("active");const t=document.querySelector(`[data-page="${a}"]`);if(t&&(t.classList.add("active"),t.classList.contains("sub-item"))){const o=t.closest(".nav-group");o&&o.classList.add("expanded")}const i=document.getElementById("topbar-title");i&&(i.textContent=_[a][0]),r.activePage=a,g(a)}window.changeMonth=a=>{const e=r.calendarViewDate;r.calendarViewDate=new Date(e.getFullYear(),e.getMonth()+a,1),g("conteudo")};window.toggleTaskCompletion=a=>{const e=String(a);let t=!1;if(r.kanban.forEach((i,o)=>{const n=(i.tasks||[]).findIndex(s=>String(s.id)===e);if(n!==-1){const s=i.tasks.splice(n,1)[0];o===3?(r.kanban[2].tasks.push(s),s.status="producao"):(r.kanban[3].tasks.push(s),s.status="concluido"),t=!0}}),!t){const i=r.calendarTasks.findIndex(o=>String(o.id)===e);i!==-1&&(r.calendarTasks[i].completed=!r.calendarTasks[i].completed)}r.save(),E(),g(r.activePage)};window.toggleRecurringCompletion=(a,e)=>{const t=r.calendarRules[a];t.completedDates||(t.completedDates=[]),t.completedDates.includes(e)?t.completedDates=t.completedDates.filter(i=>i!==e):t.completedDates.push(e),r.save(),E(),g("conteudo")};function g(a){const e=document.getElementById(`page-${a}`);if(e&&P[a]){if(a==="analises"&&r.activeSwotId){const t=r.swots.find(i=>i.id===r.activeSwotId);t&&(document.getElementById("topbar-title").textContent=t.name)}e.innerHTML=typeof P[a]=="function"?P[a](r):P[a],ge(a),a==="dashboard"&&le()}}function le(){r.leads;const a=r.calendarTasks||[],e=document.getElementById("upcoming-list");if(e){const t=new Date,i=a.map(o=>({...o,dueDate:new Date(o.date||o.prazo)})).filter(o=>o.dueDate>=t).sort((o,n)=>o.dueDate-n.dueDate);if(i.length===0)e.innerHTML='<div class="empty-state">Nenhum post agendado para os próximos dias.</div>';else{const o=["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];e.innerHTML=i.slice(0,4).map(n=>`
                <div class="upcoming-item">
                    <div class="date-box">
                        <span class="day">${n.dueDate.getDate()}</span>
                        <span class="month">${o[n.dueDate.getMonth()]}</span>
                    </div>
                    <div class="upcoming-details">
                        <span class="upcoming-title">${n.title}</span>
                        <span class="upcoming-tag">${n.type||"Geral"}</span>
                    </div>
                </div>
            `).join("")}}de()}function de(){const a=document.getElementById("leadsGrowthChart");if(!a)return;const e=r.leads||[];if(e.length===0)return;const t={};e.forEach(l=>{const d=new Date(l.date).toISOString().split("T")[0];t[d]=(t[d]||0)+1});const i=Object.keys(t).sort();let o=0;const n=[],s=[];i.forEach(l=>{o+=t[l],n.push(new Date(l).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})),s.push(o)}),window.leadsChartInstance&&window.leadsChartInstance.destroy(),window.leadsChartInstance=new Chart(a,{type:"line",data:{labels:n,datasets:[{label:"Crescimento de Leads",data:s,borderColor:"#FF5722",backgroundColor:"rgba(255, 87, 34, 0.1)",borderWidth:3,fill:!0,tension:.4,pointRadius:4,pointBackgroundColor:"#FF5722"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{mode:"index",intersect:!1}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(0,0,0,0.05)"},ticks:{precision:0}},x:{grid:{display:!1}}}}})}window.completeTaskFromDash=function(a){const e=r.kanban.findIndex(t=>String(t.id)===String(a));e>-1&&(r.kanban[e].status="done",r.save(),renderDashboard())};function x(a,e,t,i=!1){const o=document.getElementById("modal-overlay"),n=document.getElementById("modal-container");if(!o||!n)return;let s="";i===!0?s="wide":typeof i=="string"&&(s=i),n.innerHTML=`
        <div class="modal-content ${s}">
            <div class="modal-header">
                <h3 class="card-title">${a}</h3>
                <button class="btn-icon" onclick="closeModal()">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div id="modal-body" class="modal-body">${e}</div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                <button class="btn btn-primary" id="modal-save-btn">OK</button>
            </div>
        </div>
    `,o.classList.add("active");const l=document.getElementById("modal-save-btn");l&&(l.onclick=()=>{t()!==!1&&E()})}function E(){const a=document.getElementById("modal-overlay");a&&a.classList.remove("active")}function H(){x("Nova Matriz SWOT",`
        <div class="form-group">
            <label class="form-label">Nome da Matriz</label>
            <input type="text" id="new-swot-name" class="form-input" placeholder="Ex: Lançamento Campinas 2026">
            <p class="form-hint">Dê um nome claro para identificar o contexto desta análise depois.</p>
        </div>
    `,()=>{const e=document.getElementById("new-swot-name").value;if(!e)return!1;const t="swot_"+Date.now();return r.swots.push({id:t,name:e,s:[],w:[],o:[],t:[]}),r.activeSwotId=t,r.save(),g("analises"),!0})}function G(a){const t=`
        <div class="guide-box"><p>${{s:"Foque em diferenciais internos: O que a LifeStars faz melhor? Quais recursos exclusivos temos?",w:"Seja honesto sobre pontos de melhoria: Onde perdemos vendas? O que é ineficiente hoje?",o:"Olhe para o mercado: Há novas tecnologias? Mudanças no comportamento dos idosos/famílias?",t:"Fatores externos de risco: Novos concorrentes? Mudanças na economia ou leis?"}[a]}</p></div>
        <div class="form-group">
            <label class="form-label">Ponto Identificado</label>
            <textarea id="new-swot-item" class="form-textarea" placeholder="Descreva o ponto de forma clara e objetiva..."></textarea>
        </div>
    `;x("Adicionar Ponto SWOT",t,()=>{const i=document.getElementById("new-swot-item").value;if(!i)return!1;const o=r.swots.find(n=>n.id===r.activeSwotId);return o?(o[a].push(i),r.save(),g("analises"),!0):!1})}function J(){let a="";x("Criação de Persona Estratégica",`
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
    `,()=>{const i=document.getElementById("p-nome").value,o=document.getElementById("p-idade").value,n=document.getElementById("p-sub").value,s=document.getElementById("p-desc").value,l=document.getElementById("p-objetivos").value,d=document.getElementById("p-habitos").value,c=document.getElementById("p-porque").value;return!i||!n?(alert("Nome e Papel são obrigatórios!"),!1):(r.personas.push({id:Date.now(),nome:i,idade:o,sub:n,desc:s,objetivos:l,habitos:d,por_que:c,foto:a}),r.save(),g("personas"),!0)},!0);const t=document.getElementById("p-photo-input");t&&(t.onchange=i=>{const o=i.target.files[0];if(o){const n=new FileReader;n.onload=s=>{a=s.target.result;const l=document.getElementById("photo-preview-container");l.innerHTML=`<img src="${a}" alt="Preview">`},n.readAsDataURL(o)}})}function K(){let a=null,e=null,t=[];const i=()=>`
        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Foto do Paciente</label>
                <label class="client-photo-upload" id="photo-preview" style="${a?`background-image:url(${a}); border:none; border-radius: 50%;`:"border-radius: 50%;"}">
                    <input type="file" id="client-photo-input" hidden accept="image/*">
                    ${a?"":'<div class="photo-placeholder">+</div>'}
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
                ${e?`<span style="color:var(--success)">OK: ${e.name}</span>`:`
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>Upload do Documento</span>
                `}
            </label>
        </div>

        <div class="form-group mt-6">
            <label class="form-label">Biblioteca de Fotos Inicial</label>
            <div class="library-creation-grid" id="lib-creation-grid">
                ${t.map((s,l)=>`
                    <div class="lib-creation-item">
                        <img src="${s.data}">
                        <button onclick="window._removeTempLib(${l})">×</button>
                    </div>
                `).join("")}
                <label class="lib-creation-add">
                    <input type="file" id="lib-file-input" hidden accept="image/*" multiple>
                    <span>+ Foto</span>
                </label>
            </div>
        </div>
    `;window._tempLib=t,window._removeTempLib=s=>{t.splice(s,1),o()},window._toggleHandleField=s=>{const l=document.getElementById("c-instagram");l&&(l.style.display=s.checked?"block":"none")};const o=()=>{var l,d,c,v,p,m,u,y,k,C,I;const s=document.getElementById("modal-body");if(s){const b={name:(l=document.getElementById("c-name"))==null?void 0:l.value,phone:(d=document.getElementById("c-phone"))==null?void 0:d.value,email:(c=document.getElementById("c-email"))==null?void 0:c.value,resp:(v=document.getElementById("c-resp"))==null?void 0:v.value,respRole:(p=document.getElementById("c-resp-role"))==null?void 0:p.value,respPhone:(m=document.getElementById("c-resp-phone"))==null?void 0:m.value,respEmail:(u=document.getElementById("c-resp-email"))==null?void 0:u.value,authImagem:(y=document.getElementById("c-auth-img"))==null?void 0:y.checked,authNome:(k=document.getElementById("c-auth-name"))==null?void 0:k.checked,authMarcar:(C=document.getElementById("c-auth-tag"))==null?void 0:C.checked,instagram:(I=document.getElementById("c-instagram"))==null?void 0:I.value};if(s.innerHTML=i(),b.name&&(document.getElementById("c-name").value=b.name),b.phone&&(document.getElementById("c-phone").value=b.phone),b.email&&(document.getElementById("c-email").value=b.email),b.resp&&(document.getElementById("c-resp").value=b.resp),b.respRole&&(document.getElementById("c-resp-role").value=b.respRole),b.respPhone&&(document.getElementById("c-resp-phone").value=b.respPhone),b.respEmail&&(document.getElementById("c-resp-email").value=b.respEmail),b.instagram&&(document.getElementById("c-instagram").value=b.instagram),b.authImagem!==void 0&&(document.getElementById("c-auth-img").checked=b.authImagem),b.authNome!==void 0&&(document.getElementById("c-auth-name").checked=b.authNome),b.authMarcar!==void 0){const z=document.getElementById("c-auth-tag");z.checked=b.authMarcar,window._toggleHandleField(z)}n()}},n=()=>{const s=document.getElementById("client-photo-input"),l=document.getElementById("auth-file-input"),d=document.getElementById("lib-file-input");s&&(s.onchange=c=>{const v=c.target.files[0];if(v){const p=new FileReader;p.onload=m=>{a=m.target.result,o()},p.readAsDataURL(v)}}),l&&(l.onchange=c=>{const v=c.target.files[0];if(v){const p=new FileReader;p.onload=m=>{e={name:v.name,data:m.target.result},o()},p.readAsDataURL(v)}}),d&&(d.onchange=c=>{const v=Array.from(c.target.files);let p=0;v.forEach(m=>{const u=new FileReader;u.onload=y=>{t.push({name:m.name.split(".")[0],data:y.target.result,posted:!1}),p++,p===v.length&&o()},u.readAsDataURL(m)})})};x("Novo Cliente no Diretório",i(),()=>{const s=document.getElementById("c-name").value,l=document.getElementById("c-phone").value,d=document.getElementById("c-email").value,c=document.getElementById("c-resp").value,v=document.getElementById("c-resp-role").value,p=document.getElementById("c-resp-phone").value,m=document.getElementById("c-resp-email").value,u=document.getElementById("c-auth-img").checked,y=document.getElementById("c-auth-name").checked,k=document.getElementById("c-auth-tag").checked,C=document.getElementById("c-instagram").value;return s?(r.clients.unshift({id:String(Date.now()),name:s,phone:l,email:d,responsible:c,respRole:v,respPhone:p,respEmail:m,authImagem:u,authNome:y,authMarcar:k,instagram:C,photo:a,auth:e,library:[]}),r.save(),g("clientes"),!0):alert("O nome do paciente é obrigatório!")},!0),setTimeout(n,100)}function ce(a){const e=r.clients.find(t=>String(t.id)===String(a));e&&$("Excluir Conta",`Tem certeza que deseja remover permanentemente o cliente "${e.name}" e todos os seus arquivos do sistema e do Google Drive?`,async()=>{if(window.accessToken)try{const t=await h.getOrCreateFolder("LifeStars_MarketingOS"),i=await h.getOrCreateFolder("Clientes",t);await h.trashFolderByName(e.name,i)}catch(t){console.warn("Erro ao deletar pasta no Drive:",t)}r.clients=r.clients.filter(t=>String(t.id)!==String(a)),r.save(),g("clientes")})}function pe(a){const e=a.target.files[0];if(e){const t=new FileReader;t.onload=i=>{r.brand.ativos.push({name:e.name,data:i.target.result}),r.save(),g("brand")},t.readAsDataURL(e)}}function me(a){if(a==="brand"){const e=document.getElementById("brand-historia"),t=document.getElementById("brand-missao"),i=document.getElementById("brand-visao"),o=document.getElementById("brand-valores"),n=document.getElementById("brand-fontes");e&&(r.brand.historia=e.value),t&&(r.brand.missao=t.value),i&&(r.brand.visao=i.value),o&&(r.brand.valores=o.value),n&&(r.brand.fontes=n.value)}r.save(),alert("Informações de marca atualizadas com sucesso!"),g(r.activePage)}function ge(a){document.querySelectorAll("[data-save]").forEach(l=>{l.onclick=()=>me(l.dataset.save)});const e=document.getElementById("btn-create-swot");e&&(e.onclick=H),document.querySelectorAll(".btn-add-swot").forEach(l=>{l.onclick=()=>G(l.dataset.type)});const t=document.getElementById("btn-add-persona");t&&(t.onclick=J);const i=document.getElementById("btn-add-client");i&&(i.onclick=K);const o=document.getElementById("asset-upload");o&&(o.onchange=l=>pe(l));const n=document.getElementById("btn-add-kanban-task");n&&(n.onclick=ue);const s=document.getElementById("btn-add-cal-rule");if(s&&(s.onclick=ve),a==="clientes"){const l=document.getElementById(`page-${a}`);l&&l.querySelectorAll(".client-card").forEach(d=>{d.addEventListener("click",()=>{const c=d.getAttribute("data-client-id");c&&S(c)})})}}function ue(){x("Novo Item Operacional",`
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
    `,()=>{const e=document.getElementById("k-title").value,t=document.getElementById("k-resp").value,i=document.getElementById("k-prio").value,o=document.getElementById("k-prazo").value,n=document.getElementById("k-obs").value,s=parseInt(document.getElementById("k-col").value),l=document.getElementById("k-tags").value.split(",").map(c=>c.trim()).filter(c=>c);return e?((r.kanban.find(c=>c.id===s)||r.kanban[0]).tasks.push({id:Date.now(),title:e,responsavel:t,priority:i,prazo:o,obs:n,tags:l,comments:[],files:[]}),r.save(),g("kanban"),!0):!1},!0)}function Y(a){const e=document.getElementById("new-comment");if(!e||!e.value.trim())return;let t=null;r.kanban.forEach(i=>{const o=i.tasks.find(n=>n.id===a);o&&(t=o)}),t&&(t.comments||(t.comments=[]),t.comments.push({author:"Usuário",date:new Date().toLocaleString("pt-BR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),text:e.value}),r.save(),A(a))}function W(a,e){const t=a.target.files[0];if(!t)return;const i=new FileReader;i.onload=o=>{let n=null;r.kanban.forEach(s=>{const l=s.tasks.find(d=>d.id===e);l&&(n=l)}),n&&(n.files||(n.files=[]),n.files.push({name:t.name,data:o.target.result}),r.save(),A(e))},i.readAsDataURL(t)}function Q(a,e){let t=null;r.kanban.forEach(i=>{const o=i.tasks.find(n=>n.id===a);o&&(t=o)}),t&&t.files&&(t.files.splice(e,1),r.save(),A(a))}function X(){const a=prompt("Nome da nova etapa do fluxo:");a&&(r.kanban.push({id:Date.now(),title:a,tasks:[]}),r.save(),g("kanban"))}function Z(a){const e=r.kanban.find(i=>i.id===a);if(!e)return;const t=prompt("Novo nome para esta etapa:",e.title);t&&(e.title=t,r.save(),g("kanban"))}function ee(a){const e=r.kanban.find(t=>t.id===a);if(e){if(e.tasks.length>0){alert("Não é possível excluir uma coluna que contém tarefas. Mova as tarefas primeiro.");return}confirm(`Excluir a etapa "${e.title}"?`)&&(r.kanban=r.kanban.filter(t=>t.id!==a),r.save(),g("kanban"))}}function te(a){confirm("Deseja realmente excluir esta tarefa?")&&(r.kanban.forEach(e=>{e.tasks=e.tasks.filter(t=>t.id!==a)}),r.save(),E(),g("kanban"))}function ae(a,e,t){a.dataTransfer.setData("taskId",e),a.dataTransfer.setData("fromColId",t),a.target.classList.add("dragging")}function oe(a,e){a.preventDefault();const t=parseInt(a.dataTransfer.getData("taskId")),i=parseInt(a.dataTransfer.getData("fromColId"));if(document.querySelectorAll(".kanban-tasks").forEach(d=>d.classList.remove("dragover")),i===e)return;const o=r.kanban.find(d=>d.id===i),n=r.kanban.find(d=>d.id===e);if(!o||!n)return;const s=o.tasks.findIndex(d=>d.id===t);if(s===-1)return;const[l]=o.tasks.splice(s,1);n.tasks.push(l),r.save(),g("kanban")}function ve(){x("Configurar Automação Editorial",`
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
    `,()=>{const e=document.getElementById("r-title").value,t=document.getElementById("r-type").value,i=Array.from(document.querySelectorAll('input[name="r-days"]:checked')).map(s=>parseInt(s.value));if(!e||i.length===0)return!1;const o=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],n=`Toda ${i.map(s=>o[s]).join(", ")}`;return r.calendarRules.push({title:e,type:t,days:i,desc:n}),r.save(),g("conteudo"),!0})}function B(a=null,e={}){let t=null,i=-1,o=a===null;if(!o){const s=String(a);if(r.kanban.forEach((l,d)=>{const c=(l.tasks||[]).findIndex(v=>String(v.id)===s);c!==-1&&(t=l.tasks[c],i=d)}),!t){const l=r.calendarTasks.findIndex(d=>String(d.id)===s);l!==-1&&(t=r.calendarTasks[l])}}t||(t={id:Date.now(),title:e.title||"",responsavel:e.responsavel||"Equipe Marketing",priority:e.priority||"media",prazo:e.prazo||"",obs:e.obs||"",tags:e.tags||[],comments:[],files:[],status:e.status||"planejado",type:e.type||"post"});const n=`
        <div class="form-group">
            <label class="form-label">Título do Projeto / Campanha</label>
            <input type="text" id="task-title" class="form-input" value="${t.title}" placeholder="Ex: Campanha de Inverno">
        </div>
        
        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Responsável Principal</label>
                <select id="task-resp" class="form-select">
                    <option value="Equipe Marketing" ${t.responsavel==="Equipe Marketing"?"selected":""}>Equipe Marketing</option>
                    <option value="Design & Arte" ${t.responsavel==="Design & Arte"?"selected":""}>Design & Arte</option>
                    <option value="Social Media" ${t.responsavel==="Social Media"?"selected":""}>Social Media</option>
                    <option value="Copywriting" ${t.responsavel==="Copywriting"?"selected":""}>Copywriting</option>
                    <option value="Tráfego Pago" ${t.responsavel==="Tráfego Pago"?"selected":""}>Tráfego Pago</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Prioridade</label>
                <select id="task-prio" class="form-select">
                    <option value="baixa" ${t.priority==="baixa"?"selected":""}>Baixa (Rotina)</option>
                    <option value="media" ${t.priority==="media"?"selected":""}>Média (Prazos normais)</option>
                    <option value="alta" ${t.priority==="alta"?"selected":""}>Alta (Urgente)</option>
                </select>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Prazo de Entrega</label>
                <input type="date" id="task-prazo" class="form-input" value="${t.prazo||""}">
            </div>
            <div class="form-group">
                <label class="form-label">Categoria / Tipo</label>
                <select id="task-type" class="form-select">
                    <option value="post" ${t.type==="post"?"selected":""}>Post Redes Sociais</option>
                    <option value="blog" ${t.type==="blog"?"selected":""}>Blog / Artigo</option>
                    <option value="email" ${t.type==="email"?"selected":""}>E-mail Marketing</option>
                    <option value="ads" ${t.type==="ads"?"selected":""}>Anúncio (Ads)</option>
                    <option value="outro" ${t.type==="outro"?"selected":""}>Outro</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Descrição & Briefing Estratégico</label>
            <textarea id="task-obs" class="form-textarea" style="min-height: 120px;" placeholder="Detalhes, links, referências...">${t.obs||""}</textarea>
        </div>

        <div class="form-group">
            <label class="form-label">Tags (separadas por vírgula)</label>
            <input type="text" id="task-tags" class="form-input" value="${(t.tags||[]).join(", ")}">
        </div>

        <!-- Comments & Files only for existing tasks or advanced new tasks -->
        <div class="task-modal-section">
            <h4 class="section-title">Comentários e Histórico</h4>
            <div class="comments-list">
                ${(t.comments||[]).map(s=>`
                    <div class="comment-item">
                        <div class="comment-header"><strong>${s.author}</strong> <span>${s.date}</span></div>
                        <p>${s.text}</p>
                    </div>
                `).join("")}
            </div>
            <div class="add-comment">
                <input type="text" id="new-task-comment" class="form-input" placeholder="Adicionar observação...">
                <button class="btn btn-primary btn-sm" onclick="addTaskCommentGeneric('${t.id}')">Postar</button>
            </div>
        </div>

        <div class="task-modal-section mt-4">
            <h4 class="section-title">Arquivos e Anexos</h4>
            <div class="files-list">
                ${(t.files||[]).map((s,l)=>`
                    <div class="file-attachment">
                        <div class="file-info">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                            <span>${s.name}</span>
                        </div>
                        <div class="file-actions">
                            <a href="${s.data}" download="${s.name}" class="btn-icon">Download</a>
                            <button onclick="deleteTaskFileGeneric('${t.id}', ${l})" class="btn-icon">×</button>
                        </div>
                    </div>
                `).join("")}
            </div>
            <label class="btn btn-secondary btn-block mt-2">
                <input type="file" hidden onchange="handleTaskFileUploadGeneric(event, '${t.id}')">
                Anexar Documento
            </label>
        </div>
        
        ${o?"":`
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <button class="btn" style="color: var(--error); border-color: var(--error); padding: 8px 16px;" onclick="deleteTaskGeneric('${t.id}')">Excluir Permanente</button>
            <button class="btn btn-primary" style="background: #4CAF82; border-color: #4CAF82;" onclick="window.toggleTaskCompletion('${t.id}')">
                ${i===3||t.completed?"✓ Reabrir Tarefa":"✓ Concluir Projeto / Postagem"}
            </button>
        </div>
        `}
    `;x(o?"Novo Projeto / Tarefa":"Detalhes do Projeto",n,()=>{if(t.title=document.getElementById("task-title").value,t.responsavel=document.getElementById("task-resp").value,t.priority=document.getElementById("task-prio").value,t.prazo=document.getElementById("task-prazo").value,t.obs=document.getElementById("task-obs").value,t.type=document.getElementById("task-type").value,t.tags=document.getElementById("task-tags").value.split(",").map(s=>s.trim()).filter(s=>s),!t.title)return!1;if(o){let s=e.colIndex!==void 0?e.colIndex:0;r.kanban[s]?r.kanban[s].tasks.push(t):r.kanban[0].tasks.push(t)}return r.save(),g(r.activePage),!0},!0)}window.openRecurringModal=(a,e)=>{const t=r.calendarRules[a],i=(t.completedDates||[]).includes(e),[o,n,s]=e.split("-"),l=`${s}/${n}/${o}`,d=`
        <div class="guide-box">
            <h4 class="card-title" style="color: var(--brand-primary); margin-bottom: 8px;">Regra Recorrente</h4>
            <p style="font-size: 14px; color: var(--text-muted);">${t.desc||"Tarefa programada automaticamente."}</p>
        </div>
        <div class="card mb-4" style="background: var(--bg-main);">
            <p><strong>Evento:</strong> ${t.title}</p>
            <p><strong>Data:</strong> ${l}</p>
            <p><strong>Status:</strong> ${i?'<span style="color: var(--success)">Concluído</span>':'<span style="color: var(--warning)">Pendente</span>'}</p>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
            <button class="btn btn-primary" style="background: ${i?"var(--text-light)":"#4CAF82"}; border-color: ${i?"var(--text-light)":"#4CAF82"};" 
                    onclick="window.toggleRecurringCompletion(${a}, '${e}')">
                ${i?"Marcar como Pendente":"✓ Marcar como Concluído"}
            </button>
        </div>
    `;x("Detalhes da Recorrência",d,()=>!0)};window.openTaskModal=B;function N(a){const e=new Date,t=(e.getMonth()+1).toString().padStart(2,"0"),i=a.toString().padStart(2,"0"),o=`${e.getFullYear()}-${t}-${i}`;B(null,{prazo:o})}window.addCalendarTask=N;function A(a){B(a)}window.editKanbanTask=A;function fe(a){const e=String(a),t=document.getElementById("new-task-comment");if(!t||!t.value.trim())return;let i=null;r.kanban.forEach(o=>{const n=(o.tasks||[]).find(s=>String(s.id)===e);n&&(i=n)}),i||(i=r.calendarTasks.find(o=>String(o.id)===e)),i&&(i.comments||(i.comments=[]),i.comments.push({author:"Você",date:new Date().toLocaleString("pt-BR"),text:t.value.trim()}),r.save(),B(e))}window.addTaskCommentGeneric=fe;function be(a){const e=String(a);confirm("Deseja excluir este projeto permanentemente?")&&(r.kanban.forEach(t=>{t.tasks=(t.tasks||[]).filter(i=>String(i.id)!==e)}),r.calendarTasks=r.calendarTasks.filter(t=>String(t.id)!==e),r.save(),E(),g(r.activePage))}window.deleteTaskGeneric=be;function he(a,e){const t=String(e),i=a.target.files[0];if(!i)return;const o=new FileReader;o.onload=function(n){let s=null;r.kanban.forEach(l=>{const d=(l.tasks||[]).find(c=>String(c.id)===t);d&&(s=d)}),s||(s=r.calendarTasks.find(l=>String(l.id)===t)),s&&(s.files||(s.files=[]),s.files.push({name:i.name,data:n.target.result,date:new Date().toLocaleString("pt-BR")}),r.save(),B(t))},o.readAsDataURL(i)}window.handleTaskFileUploadGeneric=he;function xe(a,e){const t=String(a);let i=null;r.kanban.forEach(o=>{const n=(o.tasks||[]).find(s=>String(s.id)===t);n&&(i=n)}),i||(i=r.calendarTasks.find(o=>String(o.id)===t)),i&&i.files&&(i.files.splice(e,1),r.save(),B(t))}window.deleteTaskFileGeneric=xe;function ie(){x("Integração Google Calendar",`
        <div style="text-align:center; padding: 20px;">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" style="color: #4285F4; margin-bottom: 16px;"><path d="M12.48 10.92v3.28h4.74c-.2 1.06-.9 1.95-2.02 2.71l2.72 2.11c1.6-1.48 2.53-3.66 2.53-6.24 0-.54-.05-1.07-.14-1.58h-7.83z"/><path d="M12.48 24c3.24 0 5.95-1.08 7.93-2.92l-2.72-2.11c-1.1.74-2.5 1.18-5.21 1.18-3.99 0-7.35-2.69-8.56-6.33L1.13 16.2c2.03 4.19 6.38 7.8 11.35 7.8z"/><path d="M3.92 13.82c-.31-.92-.48-1.9-.48-2.92s.17-2 .48-2.92l-2.79-2.16C.41 7.42 0 9.17 0 10.9s.41 3.48 1.13 5.08l2.79-2.16z"/><path d="M12.48 4.75c1.76 0 3.35.61 4.6 1.8l3.42-3.42C18.43 1.11 15.72 0 12.48 0 7.51 0 3.16 3.61 1.13 7.8l2.79 2.16c1.21-3.64 4.57-6.33 8.56-6.33z"/></svg>
            <h3 style="font-weight: 700;">Conectar LifeStars Agenda</h3>
            <p style="color: var(--text-light); font-size: 14px; margin-top: 8px;">Deseja autorizar o Marketing OS a sincronizar o calendário editorial com sua conta Google?</p>
        </div>
    `,()=>(alert("Simulação de Integração: O sistema redirecionaria para o Google OAuth."),!0))}document.addEventListener("DOMContentLoaded",()=>{h.init();const a=new Date,e=document.getElementById("topbar-date");e&&(e.textContent=a.toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})),document.querySelectorAll(".nav-item").forEach(t=>{t.addEventListener("click",i=>{i.preventDefault();const o=t.getAttribute("data-page");o==="analises"&&(r.activeSwotId=null),R(o)})}),V(),R("dashboard"),g("dashboard")});window.switchPerformanceTab=a=>{document.querySelectorAll(".perf-module").forEach(i=>i.style.display="none"),document.querySelectorAll(".perf-tab").forEach(i=>i.classList.remove("active"));const e=document.getElementById(`perf-${a}-content`),t=document.getElementById(`tab-${a}-btn`);e&&(e.style.display="block"),t&&t.classList.add("active")};window.openLeadModal=(a=null)=>{const e=a!==null,t=e?r.leads[a]:null,i=`
        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Nome do Lead</label>
                <input type="text" id="lead-name" class="form-input" value="${t?t.name:""}" placeholder="Ex: Maria Oliveira">
            </div>
            <div class="form-group">
                <label class="form-label">Origem do Contato</label>
                <input type="text" id="lead-origin" class="form-input" value="${t&&t.origin||""}" placeholder="Ex: Instagram Campinas">
            </div>
        </div>
        <div class="dashboard-grid">
            <div class="form-group">
                <label class="form-label">Telefone / WhatsApp</label>
                <input type="text" id="lead-phone" class="form-input" value="${t?t.phone:""}" placeholder="(11) 99999-9999">
            </div>
            <div class="form-group">
                <label class="form-label">Data de Contato</label>
                <input type="date" id="lead-date" class="form-input" value="${t?t.date:new Date().toISOString().split("T")[0]}">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Captura da Conversa (Print)</label>
            <div class="upload-area" onclick="document.getElementById('lead-print-input').click()">
                <input type="file" id="lead-print-input" hidden accept="image/*" onchange="window.handleLeadPrintUpload(this, '${e?a:""}')">
                <div id="lead-print-preview-box" class="placeholder-container">
                    ${t&&t.image?`<img src="${t.image}" style="width:100%; height:120px; object-fit:cover; border-radius:8px;">`:`
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <p>Clique para subir ou trocar o print</p>
                    `}
                </div>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Status do Atendimento</label>
            <select id="lead-sent" class="form-select">
                <option value="no" ${t&&!t.sentDate?"selected":""}>Ainda não encaminhado</option>
                <option value="yes" ${t&&t.sentDate?"selected":""}>Encaminhado para Comercial</option>
            </select>
        </div>
    `;x(e?"Editar Lead":"Registrar Novo Lead",i,()=>{const o=document.getElementById("lead-name").value,n=document.getElementById("lead-origin").value,s=document.getElementById("lead-phone").value,l=document.getElementById("lead-date").value,d=document.getElementById("lead-sent").value,c=window.currentLeadPrint||(t?t.image:null),v=window.currentLeadDriveUrl||(t?t.imageDriveUrl:null);if(!o)return alert("Nome é obrigatório");const p={name:o,origin:n,phone:s,date:l,image:c,imageDriveUrl:v,sentDate:d==="yes"?t&&t.sentDate?t.sentDate:new Date().toISOString():null};e?r.leads[a]=p:r.leads.unshift(p),r.save(),g("metricas"),window.currentLeadPrint=null,window.currentLeadDriveUrl=null})};window.handleLeadPrintUpload=async a=>{const e=a.files[0];if(e)try{const t=new FileReader;t.onload=async i=>{var s;const o=await L(i.target.result,400,400);window.currentLeadPrint=o;const n=document.getElementById("lead-print-preview-box");if(n&&(n.innerHTML=`<img src="${o}" style="width:100%; height:120px; object-fit:cover; border-radius:8px;">`),window.accessToken){const l=await h.getOrCreateFolder("LifeStars_MarketingOS"),d=await h.getOrCreateFolder("Performance_Leads",l),c=await h.getOrCreateFolder("Capturas",d),v=((s=document.getElementById("lead-name"))==null?void 0:s.value)||"Lead_Sem_Nome",p=await h.getOrCreateFolder(v,c),m=await h.uploadFile(e,p);window.currentLeadDriveUrl=m.webViewLink}},t.readAsDataURL(e)}catch(t){console.error("Erro no upload do print:",t),alert("Falha ao salvar captura no Drive.")}};window.deleteLead=a=>{$("Excluir Lead","Deseja remover permanentemente este lead do registro?",()=>{r.leads.splice(a,1),r.save(),g("metricas")})};window.viewLeadPrint=a=>{if(!a||a==="null")return;const e=`<div style="text-align:center;"><img src="${a}" style="width:100%; border-radius:12px; box-shadow: var(--shadow-md); display: block;"></div>`;x("Captura do Lead",e,null,"xl")};window.filterClients=()=>{var i;const a=((i=document.getElementById("client-search-input"))==null?void 0:i.value.toLowerCase())||"",e=document.getElementById("clients-grid-container");if(!e)return;const t=r.clients.filter(o=>o.name.toLowerCase().includes(a)||o.responsible&&o.responsible.toLowerCase().includes(a));e.innerHTML=t.length===0?'<div class="card full-width empty-state"><p>Nenhum cliente corresponde à pesquisa.</p></div>':t.map(o=>`
            <div class="card client-card premium-card" data-client-id="${o.id}">
                <div class="client-card-header">
                    <div class="client-avatar-wrapper">
                        <div class="client-avatar-main" style="${o.photo?`background-image: url(${o.photo})`:"background: var(--brand-primary); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:20px;"}">
                            ${o.photo?"":(o.name||"??").substring(0,2).toUpperCase()}
                        </div>
                        <div class="client-badge-status ${o.auth?"active":"pending"}"></div>
                    </div>
                    <button class="btn-delete-client" onclick="event.stopPropagation(); window.deleteClient('${o.id}')">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
                
                <div class="client-card-body">
                    <h4 class="client-card-name">${o.name}</h4>
                    <p class="client-card-resp">${o.responsible||"Sem responsável"}</p>
                    
                    <div class="client-card-stats">
                        <div class="stat-item">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <span>${(o.library||[]).length} ativos</span>
                        </div>
                        <div class="stat-item">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            <span>${o.auth?"Autorizado":"Pendente"}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join(""),setupListeners()};window.filterLeads=()=>{var i;const a=((i=document.getElementById("lead-search-input"))==null?void 0:i.value.toLowerCase())||"",e=document.getElementById("leads-tbody");if(!e)return;const t=r.leads.filter(o=>o.name.toLowerCase().includes(a)||o.phone.toLowerCase().includes(a)||o.origin&&o.origin.toLowerCase().includes(a));e.innerHTML=t.length===0?'<tr><td colspan="7" class="empty-leads">Nenhum lead corresponde à pesquisa.</td></tr>':t.map(o=>{const n=r.leads.indexOf(o);return`
                <tr>
                    <td><strong>${o.name}</strong></td>
                    <td><span class="lead-origin-tag">${o.origin||"Não definida"}</span></td>
                    <td>${o.phone}</td>
                    <td>${new Date(o.date).toLocaleDateString("pt-BR")}</td>
                    <td>
                        <div class="lead-print-preview" onclick="viewLeadPrint('${o.imageDriveUrl||o.image}')">
                            ${o.image?`<img src="${o.image}">`:"Sem print"}
                        </div>
                    </td>
                    <td>
                        <div class="status-badge ${o.sentDate?"sent":"pending"}">
                            ${o.sentDate?"Enviado":"Pendente"}
                        </div>
                    </td>
                    <td>
                        <div style="display:flex; gap:8px;">
                            <button class="btn-icon-clean" onclick="window.openLeadModal(${n})">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button class="btn-icon-clean" onclick="deleteLead(${n})">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `}).join("")};window.State=r;window.navigate=R;window.renderPage=g;window.closeModal=E;window.addCalendarTask=N;window.syncGoogleCalendar=ie;window.onDragStartTask=ae;window.onDropTask=oe;window.editKanbanTask=A;window.deleteKanbanTask=te;window.addTaskComment=Y;window.handleTaskFileUpload=W;window.deleteTaskFile=Q;window.addKanbanColumn=X;window.editKanbanColumn=Z;function ye(){let a=null,e=null;x("Novo Relatório Inteligente",`
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
    `,()=>{const i=document.getElementById("rep-title").value,o=document.getElementById("rep-type").value,n=document.getElementById("rep-date").value,s=document.getElementById("rep-insights").value;if(!i||!a&&!e)return alert("Título e Arquivo são obrigatórios!"),!1;const l={id:"rep_"+Date.now(),title:i,type:o,date:n,insights:s,file:a,parsedData:e,image:a&&a.type&&a.type.startsWith("image/")?a.data:null};return r.reports.push(l),r.save(),g("relatorios"),!0},!0),setTimeout(()=>{const i=document.getElementById("rep-file-input");i&&(i.onchange=o=>{const n=o.target.files[0];if(n){const s=new FileReader;s.onload=l=>{const d=l.target.result;if(n.name.endsWith(".csv")){e=we(d);const c=document.getElementById("rep-file-preview");c.style.borderColor="var(--info)",c.innerHTML=`<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--info)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            <span style="color:var(--info); font-weight: 700;">CSV PARSADO: ${n.name}</span>
                            <p style="font-size: 11px;">Identificamos ${e.campaigns.length} campanhas/linhas.</p>`}else{a={name:n.name,data:d,type:n.type};const c=document.getElementById("rep-file-preview");c.style.borderColor="var(--success)",c.innerHTML=`<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style="color:var(--success); font-weight: 700;">${n.name} carregado</span>`}},n.name.endsWith(".csv")?s.readAsText(n):s.readAsDataURL(n)}})},100)}function we(a){const e=a.split(`
`).map(p=>p.trim()).filter(p=>p);if(e.length<2)return{campaigns:[],summary:{}};const i=e[0].includes(";")?";":",";let o=-1;for(let p=0;p<Math.min(10,e.length);p++){const m=e[p].toLowerCase();if((m.includes("campanha")||m.includes("campaign"))&&(m.includes("clique")||m.includes("click")||m.includes("custo")||m.includes("cost"))){o=p;break}}o===-1&&(o=0);const n=e[o].split(i).map(p=>p.trim().toLowerCase().replace(/"/g,"")),s=p=>n.findIndex(m=>p.some(u=>m.includes(u))),l={campaign:s(["campaign","campanha","nome"]),clicks:s(["click","clique"]),impressions:s(["impres","exibição","exibicao"]),cost:s(["cost","custo","valor","invest"]),conversions:s(["conv","conversão","conversao"]),ctr:s(["ctr","taxa de cliq"])},c=e.slice(o+1).map(p=>{const m=p.split(i).map(w=>w.trim().replace(/"/g,""));if(m.length<n.length*.5)return null;const u=m[l.campaign]||"Campanha";if(u.toLowerCase().includes("total")||u.toLowerCase().includes("resumo"))return null;const y=(m[l.clicks]||"0").replace(/\D/g,""),k=parseInt(y)||0,C=(m[l.impressions]||"0").replace(/\D/g,""),I=parseInt(C)||0,b=m[l.cost]||"0",z=parseFloat(b.replace(/\./g,"").replace(",","."))||parseFloat(b.replace(/[^0-9.]/g,""))||0,T=(m[l.conversions]||"0").replace(/[^0-9.,]/g,"").replace(",","."),M=parseFloat(T)||0,f=m[l.ctr]||(I>0?(k/I*100).toFixed(2)+"%":"0%");return{name:u,clicks:k,impressions:I,cost:z,conversions:M,ctr:f}}).filter(p=>p&&(p.clicks>0||p.cost>0)),v={totalClicks:c.reduce((p,m)=>p+m.clicks,0),totalImpressions:c.reduce((p,m)=>p+m.impressions,0),totalCost:c.reduce((p,m)=>p+m.cost,0),totalConversions:c.reduce((p,m)=>p+m.conversions,0)};return{campaigns:c,summary:v}}function ke(a,e){console.log("Viewing report:",a,e);let t=null;if(a&&a!=="undefined"&&(t=r.reports.find(n=>String(n.id)===String(a))),!t&&e!==void 0&&r.reports[e]&&(t=r.reports[e]),!t){console.error("Report not found:",a,e),alert("Ops! Não conseguimos encontrar este relatório. Tente recarregar a página.");return}let i="";if(t.parsedData){const n=t.parsedData.summary;i=`
            <div class="kpi-grid" style="margin-bottom: 32px;">
                <div class="kpi-card">
                    <span class="kpi-label">Cliques Totais</span>
                    <span class="kpi-value">${(n.totalClicks||0).toLocaleString()}</span>
                </div>
                <div class="kpi-card">
                    <span class="kpi-label">Impressões</span>
                    <span class="kpi-value">${(n.totalImpressions||0).toLocaleString()}</span>
                </div>
                <div class="kpi-card">
                    <span class="kpi-label">Custo Total</span>
                    <span class="kpi-value">R$ ${(n.totalCost||0).toFixed(2)}</span>
                </div>
                <div class="kpi-card">
                    <span class="kpi-label">Conversões</span>
                    <span class="kpi-value">${n.totalConversions||0}</span>
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
                        ${(t.parsedData.campaigns||[]).map(s=>`
                            <tr style="border-top: 1px solid var(--border-color);">
                                <td style="padding: 12px; font-weight: 600;">${s.name}</td>
                                <td style="padding: 12px; text-align: right;">${s.clicks}</td>
                                <td style="padding: 12px; text-align: right;">${s.ctr}</td>
                                <td style="padding: 12px; text-align: right;">R$ ${s.cost.toFixed(2)}</td>
                                <td style="padding: 12px; text-align: right;">${s.conversions}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `}else t.file?i=`
            <div class="pres-section">
                <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-light); margin-bottom: 16px;">Documento do Relatório</h4>
                ${t.file.type&&t.file.type.startsWith("image/")?`
                    <div class="pres-image-container" style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color); box-shadow: var(--shadow-md);">
                        <img src="${t.file.data}" alt="Relatório" style="width: 100%; height: auto; display: block;">
                    </div>
                `:`
                    <div class="pres-file-box" style="padding: 48px; background: var(--bg-main); border-radius: var(--radius-md); text-align: center; border: 1.5px dashed var(--border-color);">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--text-light)" stroke-width="1.5" style="margin-bottom: 16px;"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                        <p style="margin-bottom: 24px; font-weight: 600;">${t.file.name}</p>
                        <a href="${t.file.data}" download="${t.file.name}" class="btn btn-primary">Download do Documento</a>
                    </div>
                `}
            </div>
        `:i='<div class="empty-state">Este relatório não contém dados visualizáveis ou arquivos anexados.</div>';const o=`
        <div class="report-presentation" style="padding: 24px;">
            <div class="report-pres-header" style="margin-bottom: 32px; border-bottom: 1px solid var(--border-color); padding-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <span class="report-tag" style="background: var(--brand-primary-soft); color: var(--brand-primary-dark); padding: 4px 12px; border-radius: 6px; font-weight: 800; text-transform: uppercase; font-size: 11px;">${t.type||"Geral"}</span>
                        <h2 class="pres-title" style="font-size: 32px; font-weight: 800; margin-top: 12px; letter-spacing: -0.02em;">${t.title}</h2>
                        <p class="pres-date" style="color: var(--text-light); margin-top: 4px;">Ref: ${t.date||"N/A"}</p>
                    </div>
                    <div style="text-align: right;">
                        <button class="btn btn-secondary" onclick="window.print()">Exportar PDF</button>
                    </div>
                </div>
            </div>
            
            <div class="report-pres-body">
                <div class="pres-section" style="margin-bottom: 40px;">
                    <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-light); margin-bottom: 16px;">Resumo & Insights</h4>
                    <p class="pres-text" style="line-height: 1.6; color: var(--text-muted); font-size: 16px; background: #fff; padding: 20px; border-radius: var(--radius-md); border-left: 4px solid var(--brand-primary);">${t.insights||"Nenhum insight registrado."}</p>
                </div>
                
                ${i}
            </div>
            
            <div class="report-pres-footer" style="margin-top: 64px; padding-top: 32px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <div class="logo-mini" style="font-weight: 800; font-size: 18px; color: var(--brand-primary);">LifeStars <span style="font-weight: 300; color: var(--text-light);">Marketing OS</span></div>
                <div style="font-size: 12px; color: var(--text-light);">Relatório Gerado Automaticamente pela LifeStars IA</div>
            </div>
        </div>
    `;x("Apresentação Executiva",o,()=>!0,!0)}function Se(a,e){confirm("Deseja excluir este relatório?")&&(a&&a!=="undefined"?r.reports=r.reports.filter(t=>String(t.id)!==String(a)):e!==void 0&&r.reports.splice(e,1),r.save(),g("relatorios"))}window.deleteKanbanColumn=ee;function S(a){const e=r.clients.find(i=>String(i.id)===String(a));if(!e)return;e.library||(e.library=[]);const t=`
        <div class="profile-workspace">
            <aside class="workspace-sidebar">
                <div class="workspace-fields mt-6">
                        <div class="avatar-edit-container">
                        <div id="profile-avatar-preview" class="avatar-giant" style="${e.photo?`background-image: url(${e.photo})`:"background: var(--brand-primary); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:48px;"}">
                            ${e.photo?"":e.name.substring(0,2).toUpperCase()}
                        </div>
                        <label class="avatar-edit-trigger">
                            <input type="file" hidden accept="image/*" onchange="window.handleProfilePhotoChange(event, '${a}')">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        </label>
                    </div>
                    
                    <div class="workspace-fields mt-6">
                        <div class="field-group">
                            <label class="field-label">Nome do Paciente</label>
                            <input type="text" id="edit-client-name" class="field-input" value="${e.name}">
                        </div>
                        <div class="field-group">
                            <label class="field-label">Telefone Paciente</label>
                            <input type="text" id="edit-client-phone" class="field-input" value="${e.phone||""}">
                        </div>
                        <div class="field-group">
                            <label class="field-label">E-mail Paciente</label>
                            <input type="email" id="edit-client-email" class="field-input" value="${e.email||""}">
                        </div>

                        <div class="field-group mt-6" style="border-top: 1px solid var(--border-color); padding-top: 16px;">
                            <label class="field-label" style="color: var(--brand-primary)">Dados do Responsável (Cliente)</label>
                            <input type="text" id="edit-client-resp" class="field-input" placeholder="Nome" value="${e.responsible||""}">
                        </div>
                        <div class="field-group">
                            <label class="field-label">Cargo / Vínculo</label>
                            <input type="text" id="edit-client-resp-role" class="field-input" placeholder="Ex: Filho / Tutor" value="${e.respRole||""}">
                        </div>
                        <div class="field-group">
                            <label class="field-label">Telefone Responsável</label>
                            <input type="text" id="edit-client-resp-phone" class="field-input" value="${e.respPhone||""}">
                        </div>
                        <div class="field-group">
                            <label class="field-label">E-mail Responsável</label>
                            <input type="email" id="edit-client-resp-email" class="field-input" value="${e.respEmail||""}">
                        </div>
                    </div>
                </div>

                <div class="workspace-footer">
                    <button class="btn-danger-outline full-width" onclick="deleteClient('${a}')">Encerrar & Excluir Conta</button>
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
                                <input type="checkbox" id="edit-auth-img" ${e.authImagem?"checked":""}>
                                <span>Autorização de Uso de Imagem</span>
                            </label>
                            <label class="check-item">
                                <input type="checkbox" id="edit-auth-name" ${e.authNome?"checked":""}>
                                <span>Autorização de Uso de Nome</span>
                            </label>
                            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                                <label class="check-item" style="margin-bottom: 0;">
                                    <input type="checkbox" id="edit-auth-tag" ${e.authMarcar?"checked":""} onchange="window._toggleEditHandleField(this)">
                                    <span>Marcar nas Redes</span>
                                </label>
                                <input type="text" id="edit-instagram" class="field-input" style="width: 160px; height: 32px; font-size: 13px; padding: 4px 12px; display: ${e.authMarcar?"block":"none"};" placeholder="@usuario" value="${e.instagram||""}">
                            </div>
                        </div>
                        
                        <div style="border-left: 1px solid var(--border-color); padding-left: 24px;">
                            <div class="flex-between" style="margin-bottom: 12px;">
                                <span style="font-size: 13px; font-weight: 700; color: var(--text-main);">Documento Assinado</span>
                                <label class="btn-text-action" style="cursor: pointer;">
                                    <input type="file" hidden onchange="window.handleProfileAuthChange(event, '${a}')">
                                    ${e.auth?"Substituir":"+ Enviar"}
                                </label>
                            </div>
                            
                            ${e.auth?`
                                <div class="doc-pill active" style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 10px; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                                    <div class="doc-icon" style="color: #10B981; width: 32px; height: 32px;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg></div>
                                    <div style="flex: 1; overflow: hidden;">
                                        <div style="font-weight: 700; color: var(--text-main); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${e.auth.name}</div>
                                        <a href="${e.auth.data}" target="_blank" style="color: var(--brand-primary); font-size: 11px; font-weight: 700; text-decoration: none;">Ver Documento</a>
                                    </div>
                                </div>
                            `:`
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
                        <input type="file" id="multi-asset-input" hidden accept="image/*" onchange="window.addPhotoToLibrary(event, '${a}')" multiple>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Adicionar Ativos
                    </label>
                </div>

                <div class="assets-grid">
                    ${e.library.length===0?`
                        <div class="assets-empty-state">
                            <div class="empty-icon-box">
                                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            </div>
                            <h3>Sua biblioteca está vazia</h3>
                            <p>Comece fazendo o upload de fotos e materiais brutos deste cliente.</p>
                        </div>
                    `:e.library.map((i,o)=>`
                        <div class="asset-card ${i.posted?"is-posted":""}">
                            <div class="asset-preview" style="background-image: url(${i.data})">
                                <div class="status-indicator ${i.posted?"posted":"pending"}" onclick="window.togglePhotoPosted('${a}', ${o})">
                                    ${i.posted?"POSTADO":"PENDENTE"}
                                </div>
                                <div class="asset-actions-overlay">
                                    <a href="${i.isDrive?i.driveUrl:i.data}" target="_blank" class="action-circle">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                                            ${i.isDrive?'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>':'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'}
                                        </svg>
                                    </a>
                                    <button onclick="window.deleteLibraryPhoto('${a}', ${o})" class="action-circle delete"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                                </div>
                            </div>
                            <div class="asset-footer">
                                <input type="text" class="asset-name-edit" value="${i.name}" onchange="window.renameLibraryPhoto('${a}', ${o}, this.value)" placeholder="Nome do arquivo...">
                            </div>
                        </div>
                    `).join("")}
                </div>
            </main>
        </div>
    `;x("Editar Perfil do Cliente",t,()=>(saveProfileChanges(a),g("clientes"),!0),!0)}async function L(a,e=1200,t=1200){return new Promise(i=>{const o=new Image;o.src=a,o.onload=()=>{const n=document.createElement("canvas");let s=o.width,l=o.height;s>l?s>e&&(l*=e/s,s=e):l>t&&(s*=t/l,l=t),n.width=s,n.height=l,n.getContext("2d").drawImage(o,0,0,s,l),i(n.toDataURL("image/jpeg",.8))},o.onerror=()=>i(a)})}async function $e(a,e){window.saveProfileChanges(e);const t=Array.from(a.target.files);if(t.length===0)return;const i=r.clients.find(o=>String(o.id)===String(e));if(i){if(i.library||(i.library=[]),!window.accessToken){if(!confirm("Google Drive não conectado. Deseja salvar localmente? (Espaço limitado)"))return;let o=0;for(const n of t){const s=new FileReader;s.onload=async l=>{let d=l.target.result;n.type.startsWith("image/")&&(d=await L(d)),i.library.push({name:n.name.split(".")[0],data:d,posted:!1}),o++,o===t.length&&(r.save(),S(e))},s.readAsDataURL(n)}return}try{const o=await h.getOrCreateFolder("LifeStars_MarketingOS"),n=await h.getOrCreateFolder("Clientes",o),s=await h.getOrCreateFolder(i.name,n),l=await h.getOrCreateFolder("Ativos",s);for(const d of t){const c=await h.uploadFile(d,l);let v=null;if(d.type.startsWith("image/")){const p=new FileReader;v=await new Promise(m=>{p.onload=async u=>m(await L(u.target.result,200,200)),p.readAsDataURL(d)})}i.library.push({name:d.name.split(".")[0],data:v||c.webViewLink,driveUrl:c.webViewLink,id:c.id,isDrive:!0,posted:!1})}r.save(),S(e)}catch(o){console.error(o),alert(o.message||"Erro ao subir para o Google Drive. Verifique a conexão.")}}}function Ee(a,e){const t=r.clients.find(o=>String(o.id)===String(a));if(!t||!t.library[e])return;const i=t.library[e];$("Excluir Ativo","Deseja remover esta foto permanentemente da biblioteca e do Google Drive?",async()=>{if(window.accessToken&&i.id)try{await h.trashFile(i.id)}catch(o){console.warn("Erro ao deletar arquivo no Drive:",o)}t.library.splice(e,1),r.save(),S(a)})}window.saveProfileChanges=a=>{const e=r.clients.find(u=>String(u.id)===String(a));if(!e)return;const t=document.getElementById("edit-client-name"),i=document.getElementById("edit-client-phone"),o=document.getElementById("edit-client-email"),n=document.getElementById("edit-client-resp"),s=document.getElementById("edit-client-resp-role"),l=document.getElementById("edit-client-resp-phone"),d=document.getElementById("edit-client-resp-email"),c=document.getElementById("edit-auth-img"),v=document.getElementById("edit-auth-name"),p=document.getElementById("edit-auth-tag");t&&(e.name=t.value),i&&(e.phone=i.value),o&&(e.email=o.value),n&&(e.responsible=n.value),s&&(e.respRole=s.value),l&&(e.respPhone=l.value),d&&(e.respEmail=d.value),c&&(e.authImagem=c.checked),v&&(e.authNome=v.checked),p&&(e.authMarcar=p.checked);const m=document.getElementById("edit-instagram");m&&(e.instagram=m.value),r.save()};window._toggleEditHandleField=a=>{const e=document.getElementById("edit-instagram");e&&(e.style.display=a.checked?"block":"none")};window.handleProfilePhotoChange=async(a,e)=>{window.saveProfileChanges(e);const t=a.target.files[0];if(!t)return;const i=r.clients.find(o=>String(o.id)===String(e));if(i)try{const o=await L(URL.createObjectURL(t),400,400);if(i.photo=o,window.accessToken){const n=await h.getOrCreateFolder("LifeStars_MarketingOS"),s=await h.getOrCreateFolder("Clientes",n),l=await h.getOrCreateFolder(i.name,s),d=await h.getOrCreateFolder("Perfil",l),c=await h.uploadFile(t,d);i.photoDriveUrl=c.webViewLink}r.save(),S(e)}catch(o){console.error("Erro no upload da foto de perfil:",o),alert("Erro ao salvar foto de perfil. Usando versão local.")}};window.handleProfileAuthChange=async(a,e)=>{window.saveProfileChanges(e);const t=a.target.files[0];if(!t)return;const i=r.clients.find(o=>String(o.id)===String(e));if(i)if(window.accessToken)try{const o=await h.getOrCreateFolder("LifeStars_MarketingOS"),n=await h.getOrCreateFolder("Clientes",o),s=await h.getOrCreateFolder(i.name,n),l=await h.getOrCreateFolder("Documentos",s),d=await h.uploadFile(t,l);i.auth={name:t.name,data:d.webViewLink,id:d.id,isDrive:!0},r.save(),S(e)}catch(o){console.error(o),alert(o.message||"Erro ao subir documento para o Drive.")}else{const o=new FileReader;o.onload=n=>{i.auth={name:t.name,data:n.target.result},r.save(),S(e)},o.readAsDataURL(t)}};window.renameLibraryPhoto=(a,e,t)=>{const i=r.clients.find(o=>String(o.id)===String(a));i&&i.library[e]&&(i.library[e].name=t,r.save())};window.togglePhotoPosted=(a,e)=>{const t=r.clients.find(i=>String(i.id)===String(a));t&&t.library[e]&&(t.library[e].posted=!t.library[e].posted,r.save(),S(a))};window.switchBrandTab=a=>{document.querySelectorAll(".tab-content").forEach(i=>i.style.display="none"),document.querySelectorAll(".tab-btn").forEach(i=>i.classList.remove("active"));const e=document.getElementById(`tab-${a}`),t=document.querySelector(`[data-tab="${a}"]`);e&&(e.style.display="block"),t&&t.classList.add("active")};window.deleteBrandAsset=a=>{$("Excluir Ativo","Deseja remover este ativo da identidade de marca?",()=>{r.brand.ativos.splice(a,1),r.save(),g("brand")})};window.addReport=ye;window.viewReport=ke;window.deleteReport=Se;window.addClient=K;window.deleteClient=ce;window.viewClientProfile=S;window.addPhotoToLibrary=$e;window.renameLibraryPhoto=renameLibraryPhoto;window.deleteLibraryPhoto=Ee;window.toggleNavGroup=a=>{const e=document.getElementById(`group-${a}`);e&&e.classList.toggle("expanded")};window.toggleSidebar=()=>{document.body.classList.toggle("sidebar-collapsed")};window.navigate=R;window.renderPage=g;window.closeModal=E;window.addCalendarTask=N;window.syncGoogleCalendar=ie;window.onDragStartTask=ae;window.onDropTask=oe;window.editKanbanTask=A;window.deleteKanbanTask=te;window.addTaskComment=Y;window.handleTaskFileUpload=W;window.deleteTaskFile=Q;window.addKanbanColumn=X;window.editKanbanColumn=Z;window.deleteKanbanColumn=ee;window.createSwot=H;window.addSwotItem=G;window.openAddPasswordModal=(a=null)=>{const e=a!==null,t=e?r.passwords[a]:{ferramenta:"",link:"",usuario:"",email:"",senha:""},i=`
        <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Ferramenta / Site</label>
                <input type="text" id="pass-ferramenta" class="form-input" placeholder="Ex: Google Ads, Meta Business..." value="${t.ferramenta}">
            </div>
            <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Link de Acesso</label>
                <input type="url" id="pass-link" class="form-input" placeholder="https://..." value="${t.link}">
            </div>
            <div class="form-group">
                <label class="form-label">Usuário</label>
                <input type="text" id="pass-usuario" class="form-input" value="${t.usuario}">
            </div>
            <div class="form-group">
                <label class="form-label">E-mail de Login</label>
                <input type="email" id="pass-email" class="form-input" value="${t.email}">
            </div>
            <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Senha</label>
                <div class="password-input-wrapper" style="position: relative;">
                    <input type="text" id="pass-senha" class="form-input" value="${t.senha}">
                </div>
            </div>
        </div>
    `;x(e?"Editar Acesso":"Cadastrar Acesso",i,()=>{const o=document.getElementById("pass-ferramenta").value.trim(),n=document.getElementById("pass-link").value.trim(),s=document.getElementById("pass-usuario").value.trim(),l=document.getElementById("pass-email").value.trim(),d=document.getElementById("pass-senha").value.trim();if(!o||!d)return alert("Ferramenta e Senha são campos obrigatórios."),!1;const c={ferramenta:o,link:n,usuario:s,email:l,senha:d};return e?r.passwords[a]=c:r.passwords.push(c),r.save(),g("senhas"),!0})};window.editPassword=a=>window.openAddPasswordModal(a);window.deletePassword=a=>{$("Excluir Acesso","Deseja remover as credenciais desta ferramenta?",()=>{r.passwords.splice(a,1),r.save(),g("senhas")})};window.togglePassVisibility=a=>{const e=document.getElementById(`pass-field-${a}`);e&&(e.type=e.type==="password"?"text":"password")};window.addPersona=J;window.openAddPasswordModal=openAddPasswordModal;window.editPassword=editPassword;window.deletePassword=deletePassword;window.togglePassVisibility=togglePassVisibility;function Ce(){const a=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],e=new Date().getFullYear(),t=`
        <div class="form-group">
            <label class="form-label">Mês de Referência</label>
            <select id="seo-month-select" class="form-input">
                ${a.map(i=>`<option value="${i}">${i}</option>`).join("")}
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Ano</label>
            <input type="number" id="seo-year-input" class="form-input" value="${e}">
        </div>
    `;x("Novo Mês de SEO",t,()=>{const i=document.getElementById("seo-month-select").value,o=document.getElementById("seo-year-input").value,n=Date.now();return r.seo.push({id:n,month:i,year:o,reports:{campinas:null,sp:null,abc:null}}),r.save(),g("seo"),!0})}function Ie(a){$("Excluir Mês","Deseja remover todos os relatórios deste mês?",()=>{r.seo=r.seo.filter(e=>String(e.id)!==String(a)),r.save(),g("seo")})}function ze(a,e){let t=null;x(`Relatório de SEO: ${e}`,`
        <div class="form-group">
            <label class="form-label">Arquivo do Relatório (PDF, Imagem, etc.)</label>
            <div class="asset-upload-card" id="seo-file-preview" style="cursor: pointer; border: 2px dashed var(--border-color); padding: 40px; border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; gap: 12px; transition: 0.2s;" onclick="document.getElementById('seo-file-input').click()">
                <input type="file" id="seo-file-input" hidden accept=".pdf,image/*">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--text-light)" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span id="seo-file-name" style="color: var(--text-muted); font-weight: 600;">Clique para selecionar arquivo</span>
            </div>
        </div>
    `,()=>{if(!t)return alert("Por favor, selecione um arquivo."),!1;const o=r.seo.find(n=>String(n.id)===String(a));return o?(o.reports[e]={file:t,date:new Date().toISOString()},r.save(),g("seo"),!0):!1}),setTimeout(()=>{const o=document.getElementById("seo-file-input");o&&(o.onchange=n=>{const s=n.target.files[0];if(s){const l=new FileReader;l.onload=d=>{t={name:s.name,type:s.type,data:d.target.result};const c=document.getElementById("seo-file-preview"),v=document.getElementById("seo-file-name");c&&v&&(c.style.borderColor="var(--brand-primary)",v.innerText=s.name,v.style.color="var(--brand-primary)")},l.readAsDataURL(s)}})},100)}function Be(a,e){const t=r.seo.find(l=>String(l.id)===String(a));if(!t||!t.reports[e])return;const i=t.reports[e],o=i.file&&i.file.type&&i.file.type.startsWith("image/"),n=i.file&&i.file.type==="application/pdf",s=`
        <div style="display: flex; flex-direction: column; height: 100%; text-align: center;">
            <div class="report-preview-container" style="flex: 1; width: 100%; overflow-y: auto; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--border-color); background: var(--bg-main);">
                ${o?`
                    <img src="${i.file.data}" style="width: 100%; display: block;">
                `:n?`
                    <iframe src="${i.file.data}" style="width: 100%; height: 100%; border: none;"></iframe>
                `:`
                    <div style="padding: 100px;">
                        <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="var(--brand-primary)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <p style="margin-top: 20px; font-weight: 600; color: var(--text-main); font-size: 18px;">${i.file.name}</p>
                        <p style="color: var(--text-light); font-size: 14px;">Este tipo de arquivo não permite pré-visualização direta.</p>
                    </div>
                `}
            </div>
            
            <div style="display: flex; gap: 16px; justify-content: center; padding-bottom: 10px;">
                <button class="btn btn-primary" style="flex: 1; padding: 12px;" onclick="window.downloadSeoFile('${a}', '${e}')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Baixar Arquivo Completo
                </button>
                <button class="btn btn-danger" style="flex: 1; padding: 12px;" onclick="window.deleteSeoReport('${a}', '${e}')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Excluir Relatório
                </button>
            </div>
        </div>
    `;x(`Relatório: ${e.toUpperCase()}`,s,null,"xl")}function Ae(a,e){const i=r.seo.find(o=>String(o.id)===String(a)).reports[e];if(i&&i.file){const o=document.createElement("a");o.href=i.file.data,o.download=i.file.name,o.click()}}function De(a,e){$("Excluir Relatório","Deseja remover este arquivo permanentemente?",()=>{const t=r.seo.find(i=>String(i.id)===String(a));t&&(t.reports[e]=null,r.save(),E(),g("seo"))})}function Te(a){const e=Number(a);r.expandedSeoMonthId===e?r.expandedSeoMonthId=null:r.expandedSeoMonthId=e,g("seo")}function Me(){const a=new Date,e=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],t=`
        <div class="form-group">
            <label class="form-label">Mês de Referência</label>
            <select id="ads-month-select" class="form-select">
                ${e.map(i=>`<option value="${i}" ${i===e[a.getMonth()]?"selected":""}>${i}</option>`).join("")}
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Ano</label>
            <input type="number" id="ads-year-input" class="form-input" value="${a.getFullYear()}">
        </div>
    `;x("Adicionar Mês (ADS)",t,()=>{const i=document.getElementById("ads-month-select").value,o=document.getElementById("ads-year-input").value;if(r.ads.find(s=>s.month===i&&s.year===o))return alert("Este mês já foi adicionado."),!1;const n={id:Date.now(),month:i,year:o,report:null};return r.ads.push(n),r.save(),g("ads"),!0})}function Pe(a){$("Excluir Mês","Deseja remover este mês e seu relatório?",()=>{r.ads=r.ads.filter(e=>String(e.id)!==String(a)),r.save(),g("ads")})}function Fe(a){let e=null;x("Upload Relatório ADS",`
        <div class="form-group">
            <label class="form-label">Arquivo do Relatório de ADS (PDF ou Imagem)</label>
            <div class="asset-upload-card" id="ads-file-preview" style="cursor: pointer; border: 2px dashed var(--border-color); padding: 40px; border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; gap: 12px; transition: 0.2s;" onclick="document.getElementById('ads-file-input').click()">
                <input type="file" id="ads-file-input" hidden accept=".pdf,image/*">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--text-light)" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span id="ads-file-name" style="color: var(--text-muted); font-weight: 600;">Clique para selecionar arquivo</span>
            </div>
        </div>
    `,()=>{if(!e)return alert("Por favor, selecione um arquivo."),!1;const i=r.ads.find(o=>String(o.id)===String(a));return i?(i.report={file:e,date:new Date().toISOString()},r.save(),g("ads"),!0):!1}),setTimeout(()=>{const i=document.getElementById("ads-file-input");i&&(i.onchange=o=>{const n=o.target.files[0];if(n){const s=new FileReader;s.onload=l=>{e={name:n.name,type:n.type,data:l.target.result};const d=document.getElementById("ads-file-preview"),c=document.getElementById("ads-file-name");d&&c&&(d.style.borderColor="var(--brand-primary)",c.innerText=n.name,c.style.color="var(--brand-primary)")},s.readAsDataURL(n)}})},100)}function Re(a){const e=r.ads.find(s=>String(s.id)===String(a));if(!e||!e.report)return;const t=e.report,i=t.file&&t.file.type&&t.file.type.startsWith("image/"),o=t.file&&t.file.type==="application/pdf",n=`
        <div style="display: flex; flex-direction: column; height: 100%; text-align: center;">
            <div class="report-preview-container" style="flex: 1; width: 100%; overflow-y: auto; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--border-color); background: var(--bg-main);">
                ${i?`
                    <img src="${t.file.data}" style="width: 100%; display: block;">
                `:o?`
                    <iframe src="${t.file.data}" style="width: 100%; height: 100%; border:none;"></iframe>
                `:`
                    <div style="padding: 100px;">
                        <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="var(--brand-primary)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <p style="margin-top: 20px; font-weight: 600; color: var(--text-main); font-size: 18px;">${t.file.name}</p>
                        <p style="color: var(--text-light); font-size: 14px;">Este tipo de arquivo não permite pré-visualização direta.</p>
                    </div>
                `}
            </div>
            
            <div style="display: flex; gap: 16px; justify-content: center; padding-bottom: 10px;">
                <button class="btn btn-primary" style="flex: 1; padding: 12px;" onclick="window.downloadAdsFile('${a}')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Baixar Relatório
                </button>
                <button class="btn btn-danger" style="flex: 1; padding: 12px;" onclick="window.deleteAdsReport('${a}')">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Excluir
                </button>
            </div>
        </div>
    `;x(`Relatório de Tráfego Pago: ${e.month}/${e.year}`,n,null,"xl")}function Le(a){const e=r.ads.find(t=>String(t.id)===String(a));if(e&&e.report&&e.report.file){const t=document.createElement("a");t.href=e.report.file.data,t.download=e.report.file.name,t.click()}}function Oe(a){$("Excluir Relatório","Deseja remover este relatório permanentemente?",()=>{const e=r.ads.find(t=>String(t.id)===String(a));e&&(e.report=null,r.save(),E(),g("ads"))})}function Ne(a){const e=Number(a);r.expandedAdsMonthId===e?r.expandedAdsMonthId=null:r.expandedAdsMonthId=e,g("ads")}window.addSeoMonth=Ce;window.deleteSeoMonth=Ie;window.uploadSeoReport=ze;window.viewSeoReport=Be;window.downloadSeoFile=Ae;window.deleteSeoReport=De;window.toggleSeoMonth=Te;window.addAdsMonth=Me;window.deleteAdsMonth=Pe;window.uploadAdsReport=Fe;window.viewAdsReport=Re;window.downloadAdsFile=Le;window.deleteAdsReport=Oe;window.toggleAdsMonth=Ne;
