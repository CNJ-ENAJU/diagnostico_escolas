# -*- coding: utf-8 -*-
"""Gera o painel interativo HTML do Diagnóstico Nacional das Escolas Judiciais (ENAJU/CNJ)."""
from pathlib import Path

PAINEL_DIR = Path(r"G:\Meu Drive\ENAJU\Diagnóstico das Escolas\06_Painel")

html = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel do Diagnóstico das Escolas do Poder Judiciário · ENAJU / CNJ</title>
  <!-- Chart.js local com fallback para CDN -->
  <script src="lib/chart.min.js"></script>
  <script>
    if (typeof Chart === 'undefined') {
      document.write('<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"><\\/script>');
    }
  </script>
  <!-- Dados do painel -->
  <script src="dados/dados_painel.js"></script>
  <style>
    :root {
      --navy: #00367C;
      --navy-dark: #00224f;
      --navy-light: #074b9e;
      --azul: #0163AC;
      --ceu: #009BD4;
      --teal: #3E9F9B;
      --ambar: #D9982B;
      --verde: #2E7D32;
      --vermelho: #C62828;
      --cinza-esc: #334155;
      --cinza-med: #64748B;
      --cinza-cl: #E2E8F0;
      --cinza-bg: #F8FAFC;
      --card-bg: #FFFFFF;
      --radius: 12px;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--cinza-bg);
      color: var(--cinza-esc);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    /* Top Header Banner */
    .top-header {
      background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 50%, var(--azul) 100%);
      color: #FFFFFF;
      padding: 1.5rem 2rem;
      border-bottom: 4px solid var(--ceu);
      box-shadow: var(--shadow-lg);
    }
    .header-content {
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
    }
    .header-titles h1 {
      font-size: 1.45rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 0.25rem;
    }
    .header-titles p {
      font-size: 0.92rem;
      opacity: 0.9;
      color: #E0F2FE;
    }
    .header-badges {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.4rem;
      flex-wrap: wrap;
    }
    .badge {
      font-size: 0.75rem;
      padding: 0.2rem 0.65rem;
      border-radius: 9999px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }
    .badge-white { background: rgba(255, 255, 255, 0.2); color: #FFF; }
    .badge-ceu { background: var(--ceu); color: #00224f; }
    .badge-ambar { background: var(--ambar); color: #FFF; }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.55rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: var(--ceu);
      color: var(--navy-dark);
    }
    .btn-primary:hover {
      background: #38bdf8;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.15);
      color: #FFF;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    .btn-outline-navy {
      background: #FFF;
      color: var(--navy);
      border: 1px solid var(--azul);
    }
    .btn-outline-navy:hover {
      background: #F0F7FF;
    }

    /* Sticky Control Toolbar */
    .toolbar-wrapper {
      background: #FFFFFF;
      border-bottom: 1px solid var(--cinza-cl);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    }
    .toolbar-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0.75rem 2rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .filter-label {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--cinza-esc);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .select-input {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      border: 1px solid var(--cinza-cl);
      background: #FFF;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--navy);
      cursor: pointer;
      outline: none;
      transition: border-color 0.2s;
    }
    .select-input:focus {
      border-color: var(--azul);
      box-shadow: 0 0 0 3px rgba(1, 99, 172, 0.15);
    }
    .search-input {
      padding: 0.5rem 0.9rem;
      border-radius: 8px;
      border: 1px solid var(--cinza-cl);
      font-size: 0.85rem;
      width: 240px;
      outline: none;
    }
    .search-input:focus {
      border-color: var(--azul);
      box-shadow: 0 0 0 3px rgba(1, 99, 172, 0.15);
    }

    /* Small Group Protection Alert Banner */
    .small-group-banner {
      display: none;
      background: #FFFBEB;
      border-bottom: 1px solid #FCD34D;
      padding: 0.6rem 2rem;
      font-size: 0.82rem;
      color: #92400E;
    }
    .small-group-banner-inner {
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Tabs Navigation */
    .tabs-nav-wrapper {
      background: #FFFFFF;
      border-bottom: 1px solid var(--cinza-cl);
      overflow-x: auto;
    }
    .tabs-nav {
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      padding: 0 2rem;
      list-style: none;
      gap: 0.25rem;
    }
    .tab-item {
      padding: 0.85rem 1rem;
      font-size: 0.86rem;
      font-weight: 600;
      color: var(--cinza-med);
      cursor: pointer;
      white-space: nowrap;
      border-bottom: 3px solid transparent;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .tab-item:hover {
      color: var(--navy);
      background: #F8FAFC;
    }
    .tab-item.active {
      color: var(--navy);
      border-bottom-color: var(--ceu);
      font-weight: 700;
      background: #F0F7FF;
    }

    /* Main Container */
    .main-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 2rem;
    }

    /* Tab Content Pages */
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
      animation: fadeIn 0.25s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Section Headers */
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 0.35rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .section-subtitle {
      font-size: 0.88rem;
      color: var(--cinza-med);
      margin-bottom: 1.5rem;
    }

    /* KPI Cards Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .kpi-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      padding: 1.25rem;
      box-shadow: var(--shadow);
      border: 1px solid var(--cinza-cl);
      position: relative;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    .kpi-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--navy);
    }
    .kpi-card.accent-ceu::before { background: var(--ceu); }
    .kpi-card.accent-teal::before { background: var(--teal); }
    .kpi-card.accent-ambar::before { background: var(--ambar); }
    .kpi-card.accent-verde::before { background: var(--verde); }

    .kpi-title {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--cinza-med);
      margin-bottom: 0.4rem;
    }
    .kpi-value {
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--navy);
      line-height: 1.1;
      margin-bottom: 0.3rem;
    }
    .kpi-subtext {
      font-size: 0.78rem;
      color: var(--cinza-med);
    }

    /* Visual Grid Layout */
    .grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    @media (max-width: 1024px) {
      .grid-2col { grid-template-columns: 1fr; }
    }

    .card {
      background: var(--card-bg);
      border-radius: var(--radius);
      padding: 1.5rem;
      box-shadow: var(--shadow);
      border: 1px solid var(--cinza-cl);
      margin-bottom: 1.75rem;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--cinza-cl);
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .card-title {
      font-size: 1.02rem;
      font-weight: 700;
      color: var(--navy);
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .card-badge {
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: 6px;
      background: #EFF6FF;
      color: var(--azul);
    }

    /* Analytical Callout Box */
    .callout-box {
      background: #F0F7FF;
      border-left: 4px solid var(--azul);
      border-radius: 0 8px 8px 0;
      padding: 1rem 1.25rem;
      margin: 1.25rem 0;
      font-size: 0.88rem;
      color: #1E3A8A;
    }
    .callout-title {
      font-weight: 700;
      margin-bottom: 0.35rem;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .callout-warning {
      background: #FFFBEB;
      border-left-color: var(--ambar);
      color: #92400E;
    }

    /* Six Findings Grid */
    .findings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .finding-card {
      background: #FFFFFF;
      border: 1px solid var(--cinza-cl);
      border-radius: var(--radius);
      padding: 1.25rem;
      box-shadow: var(--shadow);
      position: relative;
    }
    .finding-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--navy);
      color: #FFF;
      font-size: 0.8rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
    }
    .finding-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 0.5rem;
    }
    .finding-desc {
      font-size: 0.84rem;
      color: var(--cinza-esc);
      line-height: 1.45;
    }

    /* Data Tables */
    .table-container {
      overflow-x: auto;
      margin: 1rem 0;
      border-radius: 8px;
      border: 1px solid var(--cinza-cl);
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.84rem;
    }
    table.data-table th {
      background: #F1F5F9;
      color: var(--navy);
      font-weight: 700;
      padding: 0.65rem 0.9rem;
      border-bottom: 2px solid var(--cinza-cl);
      white-space: nowrap;
    }
    table.data-table td {
      padding: 0.6rem 0.9rem;
      border-bottom: 1px solid var(--cinza-cl);
    }
    table.data-table tr:nth-child(even) {
      background: #F8FAFC;
    }
    table.data-table tr:hover {
      background: #EFF6FF;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .text-bold { font-weight: 700; }
    .progress-bar-cell {
      min-width: 110px;
    }
    .mini-progress {
      background: var(--cinza-cl);
      border-radius: 4px;
      height: 8px;
      overflow: hidden;
      display: flex;
    }
    .mini-progress-fill {
      background: var(--azul);
      height: 100%;
      border-radius: 4px;
    }

    /* Downloads Center */
    .download-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .download-card {
      background: #FFFFFF;
      border: 1px solid var(--cinza-cl);
      border-radius: var(--radius);
      padding: 1.25rem;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s ease;
    }
    .download-card:hover {
      border-color: var(--azul);
      box-shadow: var(--shadow-lg);
    }
    .download-card-header {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .download-icon {
      background: #EFF6FF;
      color: var(--azul);
      padding: 0.6rem;
      border-radius: 8px;
      font-size: 1.25rem;
    }
    .download-card-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 0.2rem;
    }
    .download-card-desc {
      font-size: 0.8rem;
      color: var(--cinza-med);
      line-height: 1.4;
      margin-bottom: 1rem;
    }
    .download-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid var(--cinza-cl);
    }
    .file-meta {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--cinza-med);
    }

    /* Footer */
    .main-footer {
      background: #FFFFFF;
      border-top: 1px solid var(--cinza-cl);
      padding: 2rem;
      margin-top: 3rem;
      color: var(--cinza-med);
      font-size: 0.8rem;
      text-align: center;
    }
    .footer-content {
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }

    /* Print styles */
    @media print {
      .top-header, .toolbar-wrapper, .tabs-nav-wrapper, .header-actions { display: none !important; }
      .tab-content { display: block !important; }
      .card { box-shadow: none; border: 1px solid #ccc; break-inside: avoid; }
    }
  </style>
</head>
<body>

  <!-- Top Header Banner -->
  <header class="top-header">
    <div class="header-content">
      <div class="header-titles">
        <h1>DIAGNÓSTICO NACIONAL DAS UNIDADES DE FORMAÇÃO DO PODER JUDICIÁRIO</h1>
        <p>Painel Analítico de Capacidades Institucionais e Educacionais · Ciclo 2025/2026</p>
        <div class="header-badges">
          <span class="badge badge-white">🏛️ Conselho Nacional de Justiça · ENAJU</span>
          <span class="badge badge-ceu">📊 N = 110 Unidades</span>
          <span class="badge badge-white">⚖️ 90 Tribunais Representados (98,9%)</span>
          <span class="badge badge-white">📅 Relatório Oficial R01.2</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" onclick="abrirAba('downloads')">
          📥 Central de Downloads CSV
        </button>
        <button class="btn btn-secondary" onclick="baixarTodosIndicadoresCSV()">
          💾 Baixar Base Completa (CSV)
        </button>
      </div>
    </div>
  </header>

  <!-- Sticky Control Toolbar -->
  <div class="toolbar-wrapper">
    <div class="toolbar-container">
      <div class="filter-group">
        <span class="filter-label">Recorte por Ramo:</span>
        <select id="segmentoSelect" class="select-input" onchange="alterarSegmento(this.value)">
          <option value="Nacional">🇧🇷 Visão Geral Nacional (N = 110)</option>
          <option value="Eleitoral">🗳️ Justiça Eleitoral (n = 39 | 35,5%)</option>
          <option value="Estadual">⚖️ Justiça Estadual (n = 29 | 26,4%)</option>
          <option value="Trabalho">🔨 Justiça do Trabalho (n = 26 | 23,6%)</option>
          <option value="Federal">🏛️ Justiça Federal (n = 8 | Demais*)</option>
          <option value="Militar">🛡️ Justiça Militar (n = 5 | Demais*)</option>
          <option value="Superior/Conselho">🏢 Tribunais Superiores e Conselhos (n = 3 | Demais*)</option>
        </select>
        <input type="text" id="filtroBusca" class="search-input" placeholder="🔍 Buscar indicador..." oninput="filtrarConteudo(this.value)">
      </div>
      <div class="filter-group">
        <button class="btn btn-outline-navy" onclick="exportarTabelaAtualCSV()">
          📥 Baixar Tabela Atual em CSV
        </button>
      </div>
    </div>
  </div>

  <!-- Small Group Protection Alert Banner (Regra R01.1) -->
  <div id="smallGroupAlert" class="small-group-banner">
    <div class="small-group-banner-inner">
      <span>⚠️</span>
      <span><strong>Nota Metodológica de Proteção de Pequenos Grupos (Regra R01.1):</strong> Este segmento possui N ≤ 10 unidades respondentes. As contagens são exibidas preferencialmente em números absolutos (n de N). Percentuais devem ser interpretados como meramente indicativos para evitar distorções estatísticas.</span>
    </div>
  </div>

  <!-- Tabs Navigation -->
  <div class="tabs-nav-wrapper">
    <ul class="tabs-nav">
      <li class="tab-item active" onclick="abrirAba('sumario')">📊 1. Visão Geral & Síntese</li>
      <li class="tab-item" onclick="abrirAba('governanca')">🏛️ 2. Rede & Governança</li>
      <li class="tab-item" onclick="abrirAba('capacidades')">🏢 3. Capacidades Instaladas</li>
      <li class="tab-item" onclick="abrirAba('digital')">💻 4. Ecossistema Digital</li>
      <li class="tab-item" onclick="abrirAba('docente')">🎓 5. Corpo Docente</li>
      <li class="tab-item" onclick="abrirAba('avaliacao')">📈 6. Avaliação da Formação</li>
      <li class="tab-item" onclick="abrirAba('agenda')">🎯 7. Agenda Formativa</li>
      <li class="tab-item" onclick="abrirAba('cooperacao')">🤝 8. Cooperação & ENAJU</li>
      <li class="tab-item" onclick="abrirAba('comparador')">🔄 9. Comparador entre Ramos</li>
      <li class="tab-item" onclick="abrirAba('downloads')">💾 10. Downloads de Dados (CSV)</li>
    </ul>
  </div>

  <!-- Main Container -->
  <main class="main-container">

    <!-- ========================================== -->
    <!-- TAB 1: VISÃO GERAL & SUMÁRIO EXECUTIVO     -->
    <!-- ========================================== -->
    <div id="tab-sumario" class="tab-content active">
      <div class="section-title">
        <span>Sumário Executivo e Principais Indicadores</span>
        <span class="badge badge-ceu" id="lblSegmentoAtual">Nacional (N=110)</span>
      </div>
      <div class="section-subtitle">
        Visão consolidada das 110 unidades de formação respondentes, cobrindo 92 órgãos do Poder Judiciário.
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-card accent-ceu">
          <div class="kpi-title">Unidades Respondentes</div>
          <div class="kpi-value" id="kpi-n-respostas">110</div>
          <div class="kpi-subtext">92 órgãos · 90 tribunais (98,9%)</div>
        </div>
        <div class="kpi-card accent-teal">
          <div class="kpi-title">Escolas Formais</div>
          <div class="kpi-value" id="kpi-nat-escola">78,2%</div>
          <div class="kpi-subtext">86 unidades formalmente instituídas</div>
        </div>
        <div class="kpi-card accent-ambar">
          <div class="kpi-title">Planejamento Próprio</div>
          <div class="kpi-value" id="kpi-plan-a">47,3%</div>
          <div class="kpi-subtext">Indicador A (68,2% c/ ref. estratégica)</div>
        </div>
        <div class="kpi-card accent-verde">
          <div class="kpi-title">Ambiente Virtual (AVA)</div>
          <div class="kpi-value" id="kpi-ava-algum">95,5%</div>
          <div class="kpi-subtext">105 unidades (90% adotam Moodle)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Equipe EaD Dedicada</div>
          <div class="kpi-value" id="kpi-cap-equipe">18,2%</div>
          <div class="kpi-subtext">Produção especializada internalizada</div>
        </div>
        <div class="kpi-card accent-ceu">
          <div class="kpi-title">Interesse na Rede ENAJU</div>
          <div class="kpi-value" id="kpi-int-aberto">99,1%</div>
          <div class="kpi-subtext">85,5% Alto · 13,6% Moderado</div>
        </div>
      </div>

      <!-- Seis Achados Centrais -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">📌 Os Seis Achados Centrais do Diagnóstico</span>
          <span class="card-badge">Síntese Editorial do Relatório</span>
        </div>
        <div class="findings-grid">
          <div class="finding-card">
            <div class="finding-num">1</div>
            <div class="finding-title">Rede ampla e heterogênea</div>
            <div class="finding-desc">110 unidades de 92 órgãos; 86 escolas formalmente instituídas, 17 setores de capacitação ligados a RH e 7 núcleos. Não há unidade típica; a Justiça Eleitoral concentra 11 dos 17 setores.</div>
          </div>
          <div class="finding-card">
            <div class="finding-num">2</div>
            <div class="finding-title">Instrumentos operacionais superam estratégicos</div>
            <div class="finding-desc">PAC (85,5%) e Regimento (80,9%) superam amplamente o Planejamento Estratégico próprio vigente (47,3%), o Projeto Pedagógico (52,7%) e o Conselho Pedagógico (48,2%).</div>
          </div>
          <div class="finding-card">
            <div class="finding-num">3</div>
            <div class="finding-title">Distribuição digital ampla, produção restrita</div>
            <div class="finding-desc">Presença massiva de AVA (95,5%) e videoconferência (97,3%), contrastando com equipe multidisciplinar de EaD em apenas 18,2% e estúdio de gravação em 25,5%.</div>
          </div>
          <div class="finding-card">
            <div class="finding-num">4</div>
            <div class="finding-title">Formação permanente de formadores incipiente</div>
            <div class="finding-desc">Apenas 18,2% mantêm programa permanente de formação de docentes; 50,9% realizam ações pontuais e 27,3% não desenvolvem nenhuma ação nessa área.</div>
          </div>
          <div class="finding-card">
            <div class="finding-num">5</div>
            <div class="finding-title">Avaliação concentrada em reação e aprendizagem</div>
            <div class="finding-desc">A aplicação da avaliação decresce nos níveis de transferência (40,9%) e impacto (34,5%), frente a 97,3% em reação; 44,5% não pesquisam egressos e 13 unidades mensuram N4 sem N3.</div>
          </div>
          <div class="finding-card">
            <div class="finding-num">6</div>
            <div class="finding-title">Ampla abertura para atuação nacional em rede</div>
            <div class="finding-desc">99,1% manifestam interesse alto ou moderado em iniciativas da ENAJU/CNJ e 84,5% já compartilham vagas. A cooperação atual formal com a ENAJU alcança 18,2%, indicando enorme potencial de expansão.</div>
          </div>
        </div>
      </div>

      <!-- Gráfico Síntese dos 12 Indicadores -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">📊 Síntese dos 12 Indicadores Estratégicos Nacionais</span>
          <button class="btn btn-outline-navy" onclick="baixarCSVDaTabela('tabela-sintese-12', 'indicadores_estrategicos_12.csv')">📥 Baixar Tabela em CSV</button>
        </div>
        <div style="height: 380px; position: relative;">
          <canvas id="chartSintese12"></canvas>
        </div>
        <div class="table-container" style="margin-top: 1.5rem;">
          <table class="data-table" id="tabela-sintese-12">
            <thead>
              <tr>
                <th>Dimensão</th>
                <th>Indicador Estratégico</th>
                <th class="text-right">Unidades (n)</th>
                <th class="text-right">Denominador (N)</th>
                <th class="text-right">Percentual (%)</th>
                <th class="progress-bar-cell">Visualização</th>
              </tr>
            </thead>
            <tbody id="tbody-sintese-12">
              <!-- Preenchido dinamicamente via JS -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 2: REDE & GOVERNANÇA                   -->
    <!-- ========================================== -->
    <div id="tab-governanca" class="tab-content">
      <div class="section-title">
        <span>Rede Nacional e Governança Institucional</span>
        <button class="btn btn-outline-navy" onclick="baixarCSVDaTabela('tabela-governanca', 'rede_e_governanca.csv')">📥 Baixar Dados desta Dimensão (CSV)</button>
      </div>
      <div class="section-subtitle">Capítulos 4 e 5 do Relatório: Natureza institucional, planejamento estratégico, instrumentos normativos e arranjo orçamentário.</div>

      <div class="callout-box">
        <div class="callout-title">💡 Síntese Metodológica de Governança</div>
        <div>Os instrumentos associados à organização operacional (PAC em 85,5% e Regimento em 80,9%) superam amplamente os instrumentos estratégicos e pedagógicos. O planejamento estratégico próprio vigente (Indicador A) está em 47,3%; quando somadas referências estratégicas existentes (Indicador B), atinge 68,2%.</div>
      </div>

      <div class="grid-2col">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Natureza Institucional das Unidades</span>
            <span class="card-badge">Capítulo 4</span>
          </div>
          <div style="height: 260px;"><canvas id="chartNatureza"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Situação do Planejamento Estratégico</span>
            <span class="card-badge">Capítulo 5</span>
          </div>
          <div style="height: 260px;"><canvas id="chartPlanejamento"></canvas></div>
        </div>
      </div>

      <div class="grid-2col">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Instrumentos Formais de Governança</span>
            <span class="card-badge">Múltipla escolha</span>
          </div>
          <div style="height: 260px;"><canvas id="chartInstrumentosGov"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Dotação Orçamentária e Financiamento</span>
            <span class="card-badge">Arranjo institucional</span>
          </div>
          <div style="height: 260px;"><canvas id="chartDotacao"></canvas></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Tabela Detalhada: Indicadores de Rede e Governança</span>
        </div>
        <div class="table-container">
          <table class="data-table" id="tabela-governanca">
            <thead>
              <tr>
                <th>Variável</th>
                <th>Categoria / Item</th>
                <th class="text-right">Unidades (n)</th>
                <th class="text-right">Total (N)</th>
                <th class="text-right">% Calculado</th>
                <th class="progress-bar-cell">Distribuição</th>
              </tr>
            </thead>
            <tbody id="tbody-governanca"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 3: CAPACIDADES INSTALADAS              -->
    <!-- ========================================== -->
    <div id="tab-capacidades" class="tab-content">
      <div class="section-title">
        <span>Capacidades Instaladas: Estrutura Física, Pessoal e Orçamento</span>
        <button class="btn btn-outline-navy" onclick="baixarCSVDaTabela('tabela-capacidades', 'capacidades_instaladas.csv')">📥 Baixar Dados desta Dimensão (CSV)</button>
      </div>
      <div class="section-subtitle">Capítulo 6 do Relatório: Recursos declarados para viabilizar as atividades formativas.</div>

      <div class="grid-2col">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Estrutura Física Disponível</span>
            <span class="card-badge">Múltipla Escolha</span>
          </div>
          <div style="height: 280px;"><canvas id="chartEstrutura"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Orçamento Executado em 2025 (Faixas)</span>
            <span class="card-badge">Faixas declaradas</span>
          </div>
          <div style="height: 280px;"><canvas id="chartOrcamento"></canvas></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Quadro de Pessoal por Faixas (Efetivos, Comissionados e Magistrados)</span>
        </div>
        <div style="height: 280px;"><canvas id="chartPessoal"></canvas></div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Tabela de Estrutura, Pessoal e Orçamento</span>
        </div>
        <div class="table-container">
          <table class="data-table" id="tabela-capacidades">
            <thead>
              <tr>
                <th>Dimensão</th>
                <th>Categoria / Faixa</th>
                <th class="text-right">Unidades (n)</th>
                <th class="text-right">Total (N)</th>
                <th class="text-right">%</th>
                <th class="progress-bar-cell">Visualização</th>
              </tr>
            </thead>
            <tbody id="tbody-capacidades"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 4: ECOSSISTEMA DIGITAL                 -->
    <!-- ========================================== -->
    <div id="tab-digital" class="tab-content">
      <div class="section-title">
        <span>Ecossistema Digital: Distribuição e Produção Educacional</span>
        <button class="btn btn-outline-navy" onclick="baixarCSVDaTabela('tabela-digital', 'ecossistema_digital.csv')">📥 Baixar Dados desta Dimensão (CSV)</button>
      </div>
      <div class="section-subtitle">Capítulo 7 do Relatório: Meios de distribuição digital, plataformas AVA e capacidade própria de produção de EaD.</div>

      <div class="callout-box">
        <div class="callout-title">💻 Contraste entre Distribuição e Produção Especializada</div>
        <div>A infraestrutura de distribuição digital está amplamente disseminada (AVA em 95,5% das unidades, Moodle em 90,0% e videoconferência em 97,3%). Em contraste, a capacidade de produção própria especializada — estúdio de gravação (25,5%) e equipe multidisciplinar dedicada (18,2%) — permanece concentrada em poucas unidades.</div>
      </div>

      <div class="grid-2col">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Ambiente Virtual de Aprendizagem (AVA)</span>
            <span class="card-badge">Arranjo tecnológico</span>
          </div>
          <div style="height: 260px;"><canvas id="chartAva"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Capacidade de Produção EaD</span>
            <span class="card-badge">Equipes especializadas</span>
          </div>
          <div style="height: 260px;"><canvas id="chartCapacidadeEad"></canvas></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Recursos Tecnológicos Utilizados nas Ações Educacionais</span>
          <span class="card-badge">Múltipla escolha</span>
        </div>
        <div style="height: 280px;"><canvas id="chartRecursosTec"></canvas></div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Tabela do Ecossistema Digital</span>
        </div>
        <div class="table-container">
          <table class="data-table" id="tabela-digital">
            <thead>
              <tr>
                <th>Recurso / Variável</th>
                <th>Categoria</th>
                <th class="text-right">Unidades (n)</th>
                <th class="text-right">Total (N)</th>
                <th class="text-right">%</th>
                <th class="progress-bar-cell">Proporção</th>
              </tr>
            </thead>
            <tbody id="tbody-digital"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 5: CORPO DOCENTE                       -->
    <!-- ========================================== -->
    <div id="tab-docente" class="tab-content">
      <div class="section-title">
        <span>Corpo Docente e Gestão de Formadores</span>
        <button class="btn btn-outline-navy" onclick="baixarCSVDaTabela('tabela-docente', 'corpo_docente.csv')">📥 Baixar Dados desta Dimensão (CSV)</button>
      </div>
      <div class="section-subtitle">Capítulo 8 do Relatório: Composição do corpo docente, instrumentos de seleção, política de retribuição e formação continuada.</div>

      <div class="grid-2col">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Composição do Corpo Docente</span>
            <span class="card-badge">Perfil dos formadores</span>
          </div>
          <div style="height: 270px;"><canvas id="chartComposicaoDocente"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Instrumentos de Gestão Docente</span>
            <span class="card-badge">GECC, banco e avaliação</span>
          </div>
          <div style="height: 270px;"><canvas id="chartGestaoDocente"></canvas></div>
        </div>
      </div>

      <div class="grid-2col">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Programas de Formação de Formadores</span>
          </div>
          <div style="height: 240px;"><canvas id="chartFormacaoFormadores"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Cadastro de Formadores Atualizado</span>
          </div>
          <div style="height: 240px;"><canvas id="chartCadastroDocente"></canvas></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Tabela Detalhada: Docência e Formadores</span>
        </div>
        <div class="table-container">
          <table class="data-table" id="tabela-docente">
            <thead>
              <tr>
                <th>Item / Variável</th>
                <th>Categoria</th>
                <th class="text-right">Unidades (n)</th>
                <th class="text-right">Total (N)</th>
                <th class="text-right">%</th>
                <th class="progress-bar-cell">Visualização</th>
              </tr>
            </thead>
            <tbody id="tbody-docente"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 6: AVALIAÇÃO DA FORMAÇÃO               -->
    <!-- ========================================== -->
    <div id="tab-avaliacao" class="tab-content">
      <div class="section-title">
        <span>Avaliação da Formação: Da Reação ao Impacto</span>
        <button class="btn btn-outline-navy" onclick="baixarCSVDaTabela('tabela-avaliacao', 'avaliacao_formacao.csv')">📥 Baixar Dados desta Dimensão (CSV)</button>
      </div>
      <div class="section-subtitle">Capítulo 9 do Relatório: Os 4 níveis do modelo de Kirkpatrick, acompanhamento de egressos e coerência avaliativa.</div>

      <div class="callout-box">
        <div class="callout-title">🪜 A Escada de Kirkpatrick no Poder Judiciário</div>
        <div>A aplicação declarada decresce acentuadamente conforme avança a complexidade avaliativa: Nível 1 (Reação: 97,3%) → Nível 2 (Aprendizagem: 72,7%) → Nível 3 (Transferência: 40,9%) → Nível 4 (Impacto: 34,5%). Além disso, 44,5% declaram não realizar pesquisa com egressos e 13 unidades registram o paradoxo de avaliar impacto (N4) sem avaliar transferência (N3).</div>
      </div>

      <div class="grid-2col">
        <div class="card">
          <div class="card-header">
            <span class="card-title">A Escada Avaliativa (Kirkpatrick N1 a N4)</span>
            <span class="card-badge">Aplica em parte ou maioria</span>
          </div>
          <div style="height: 270px;"><canvas id="chartEscadaAvaliacao"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Pesquisa de Impacto com Egressos</span>
            <span class="card-badge">Acompanhamento longitudinal</span>
          </div>
          <div style="height: 270px;"><canvas id="chartEgressos"></canvas></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Frequência de Aplicação por Nível de Avaliação (100% Empilhado)</span>
        </div>
        <div style="height: 260px;"><canvas id="chartKirkpatrickEmpilhado"></canvas></div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Tabela dos Níveis de Avaliação da Aprendizagem e Impacto</span>
        </div>
        <div class="table-container">
          <table class="data-table" id="tabela-avaliacao">
            <thead>
              <tr>
                <th>Nível / Indicador</th>
                <th>Situação / Resposta</th>
                <th class="text-right">Unidades (n)</th>
                <th class="text-right">Total (N)</th>
                <th class="text-right">%</th>
                <th class="progress-bar-cell">Visualização</th>
              </tr>
            </thead>
            <tbody id="tbody-avaliacao"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 7: AGENDA FORMATIVA                    -->
    <!-- ========================================== -->
    <div id="tab-agenda" class="tab-content">
      <div class="section-title">
        <span>Agenda Formativa: Públicos, Temas e Prioridades 2026</span>
        <button class="btn btn-outline-navy" onclick="baixarCSVDaTabela('tabela-agenda', 'agenda_formativa.csv')">📥 Baixar Dados desta Dimensão (CSV)</button>
      </div>
      <div class="section-subtitle">Capítulo 10 do Relatório: Quem as unidades formam, o que ensinaram em 2025 e o que priorizarão em 2026.</div>

      <div class="grid-2col">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Públicos Atendidos nas Ações (2025)</span>
            <span class="card-badge">Múltipla escolha</span>
          </div>
          <div style="height: 270px;"><canvas id="chartPublicos"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Eixos Prioritários Apontados para 2026</span>
            <span class="card-badge">Foco do próximo ciclo</span>
          </div>
          <div style="height: 270px;"><canvas id="chartEixos2026"></canvas></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Temáticas Trabalhadas no Ciclo 2025 (17 Áreas)</span>
        </div>
        <div style="height: 380px;"><canvas id="chartTematicas2025"></canvas></div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Tabela da Agenda e Eixos Prioritários</span>
        </div>
        <div class="table-container">
          <table class="data-table" id="tabela-agenda">
            <thead>
              <tr>
                <th>Bloco</th>
                <th>Tema / Público / Eixo</th>
                <th class="text-right">Unidades (n)</th>
                <th class="text-right">Total (N)</th>
                <th class="text-right">%</th>
                <th class="progress-bar-cell">Aderência</th>
              </tr>
            </thead>
            <tbody id="tbody-agenda"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 8: COOPERAÇÃO & ENAJU                  -->
    <!-- ========================================== -->
    <div id="tab-cooperacao" class="tab-content">
      <div class="section-title">
        <span>Cooperação Institucional e Atuação em Rede com a ENAJU</span>
        <button class="btn btn-outline-navy" onclick="baixarCSVDaTabela('tabela-cooperacao', 'cooperacao_e_enaju.csv')">📥 Baixar Dados desta Dimensão (CSV)</button>
      </div>
      <div class="section-subtitle">Capítulo 11 do Relatório: Acordos vigentes, parceiros institucionais, modalidades e interesse na articulação em rede nacional.</div>

      <div class="callout-box">
        <div class="callout-title">🤝 Potencial Extraordinário de Integração</div>
        <div>99,1% das unidades expressam interesse positivo em ações integradas com a ENAJU/CNJ (85,5% Alto e 13,6% Moderado). Ao mesmo tempo, a cooperação atual declarada com a ENAJU é de 18,2%, demonstrando um amplo espaço de crescimento para a rede nacional de escolas judiciais.</div>
      </div>

      <div class="grid-2col">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Interesse na Articulação em Rede com ENAJU/CNJ</span>
            <span class="card-badge">Q42</span>
          </div>
          <div style="height: 260px;"><canvas id="chartInteresse"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Parcerias Formais Vigentes</span>
            <span class="card-badge">Q38</span>
          </div>
          <div style="height: 260px;"><canvas id="chartParcerias"></canvas></div>
        </div>
      </div>

      <div class="grid-2col">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Instituições com as quais Coopera</span>
            <span class="card-badge">Múltipla escolha</span>
          </div>
          <div style="height: 280px;"><canvas id="chartInstituicoes"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Modalidades de Cooperação Praticadas</span>
            <span class="card-badge">Múltipla escolha</span>
          </div>
          <div style="height: 280px;"><canvas id="chartModalidades"></canvas></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Tabela de Parcerias e Articulação em Rede</span>
        </div>
        <div class="table-container">
          <table class="data-table" id="tabela-cooperacao">
            <thead>
              <tr>
                <th>Dimensão</th>
                <th>Parceiro / Modalidade / Grau</th>
                <th class="text-right">Unidades (n)</th>
                <th class="text-right">Total (N)</th>
                <th class="text-right">%</th>
                <th class="progress-bar-cell">Visualização</th>
              </tr>
            </thead>
            <tbody id="tbody-cooperacao"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 9: COMPARADOR ENTRE RAMOS              -->
    <!-- ========================================== -->
    <div id="tab-comparador" class="tab-content">
      <div class="section-title">
        <span>Comparador Dinâmico entre Ramos de Justiça</span>
        <button class="btn btn-outline-navy" onclick="baixarCSVDaTabela('tabela-comparativo-ramo', 'comparativo_entre_ramos.csv')">📥 Baixar Tabela Comparativa (CSV)</button>
      </div>
      <div class="section-subtitle">
        Compare o comportamento de qualquer indicador entre os 6 ramos de justiça do Poder Judiciário.
      </div>

      <div class="card">
        <div class="card-header">
          <div class="filter-group">
            <span class="filter-label">Selecione a Variável para Comparar:</span>
            <select id="comparadorVarSelect" class="select-input" onchange="atualizarGraficoComparador(this.value)">
              <!-- Preenchido dinamicamente -->
            </select>
          </div>
          <span class="card-badge">Visualização Multirramo</span>
        </div>
        <div style="height: 360px; position: relative;">
          <canvas id="chartComparador"></canvas>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Matriz Comparativa por Ramo (n e %)</span>
        </div>
        <div class="table-container">
          <table class="data-table" id="tabela-comparativo-ramo">
            <thead>
              <tr>
                <th>Categoria</th>
                <th class="text-right">Nacional (N=110)</th>
                <th class="text-right">Eleitoral (n=39)</th>
                <th class="text-right">Estadual (n=29)</th>
                <th class="text-right">Trabalho (n=26)</th>
                <th class="text-right">Federal (n=8)*</th>
                <th class="text-right">Militar (n=5)*</th>
                <th class="text-right">Superior/Cons. (n=3)*</th>
              </tr>
            </thead>
            <tbody id="tbody-comparativo-ramo"></tbody>
          </table>
        </div>
        <div class="callout-box callout-warning" style="font-size: 0.78rem; margin-top: 1rem;">
          * Nota: Conforme metodologia oficial, os segmentos Federal, Militar e Superior/Conselho possuem N ≤ 10 unidades. Os percentuais são indicativos e não representam taxa populacional generalizável.
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 10: CENTRAL DE DOWNLOADS CSV           -->
    <!-- ========================================== -->
    <div id="tab-downloads" class="tab-content">
      <div class="section-title">
        <span>Central de Downloads de Dados Abertos (CSV)</span>
      </div>
      <div class="section-subtitle">
        Acesse e baixe diretamente os conjuntos de dados do Diagnóstico em formato CSV (UTF-8 com BOM para Excel).
      </div>

      <div class="callout-box">
        <div class="callout-title">📁 Dados Oficiais, Auditados e Homologados</div>
        <div>Todos os dados disponibilizados refletem estritamente as respostas individuais coletadas pelo formulário do Diagnóstico Nacional, reconciliadas em nível de microrresposta e sem nenhum dado pessoal ou sigiloso.</div>
      </div>

      <div class="download-grid">
        
        <!-- Card 1: Base Completa -->
        <div class="download-card">
          <div>
            <div class="download-card-header">
              <div class="download-icon">📊</div>
              <div>
                <div class="download-card-title">Base Completa de Indicadores</div>
                <div class="file-meta">indicadores_painel_completo.csv</div>
              </div>
            </div>
            <div class="download-card-desc">
              Todos os 1.296 recortes analíticos calculados: 46 variáveis × categorias × 7 ramos (Nacional e 6 ramos) com contagem absoluta (n), denominador (N) e proporção (%).
            </div>
          </div>
          <div class="download-card-footer">
            <span class="file-meta">1.296 linhas · 108 KB</span>
            <a href="dados/indicadores_painel_completo.csv" download class="btn btn-primary" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
              📥 Baixar CSV
            </a>
          </div>
        </div>

        <!-- Card 2: Microdados Anonimizados -->
        <div class="download-card">
          <div>
            <div class="download-card-header">
              <div class="download-icon">📑</div>
              <div>
                <div class="download-card-title">Microdados das 110 Respostas</div>
                <div class="file-meta">base_respostas_anonimizada.csv</div>
              </div>
            </div>
            <div class="download-card-desc">
              Base por unidade respondente (110 linhas), sem nomes de órgãos e sem dados pessoais (códigos anônimos O01-O92), com todas as variáveis recodificadas do questionário.
            </div>
          </div>
          <div class="download-card-footer">
            <span class="file-meta">110 linhas · 56 KB</span>
            <a href="dados/base_respostas_anonimizada.csv" download class="btn btn-primary" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
              📥 Baixar CSV
            </a>
          </div>
        </div>

        <!-- Card 3: Síntese Nacional -->
        <div class="download-card">
          <div>
            <div class="download-card-header">
              <div class="download-icon">🇧🇷</div>
              <div>
                <div class="download-card-title">Síntese Nacional Consolidada</div>
                <div class="file-meta">08_indicadores_sintese_nacionais.csv</div>
              </div>
            </div>
            <div class="download-card-desc">
              Recorte nacional agregado de todos os indicadores do questionário (N=110), pronto para geração de relatórios e análises consolidadas.
            </div>
          </div>
          <div class="download-card-footer">
            <span class="file-meta">185 linhas · 16 KB</span>
            <a href="dados/08_indicadores_sintese_nacionais.csv" download class="btn btn-primary" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
              📥 Baixar CSV
            </a>
          </div>
        </div>

        <!-- Card 4: Rede & Governança -->
        <div class="download-card">
          <div>
            <div class="download-card-header">
              <div class="download-icon">🏛️</div>
              <div>
                <div class="download-card-title">Rede e Governança</div>
                <div class="file-meta">01_rede_e_governanca.csv</div>
              </div>
            </div>
            <div class="download-card-desc">
              Dados de natureza da unidade, planejamento estratégico (indicadores A e B), instrumentos formais de governança (PAC, PPI, regimento), dotação e fontes.
            </div>
          </div>
          <div class="download-card-footer">
            <span class="file-meta">175 linhas · 15 KB</span>
            <a href="dados/01_rede_e_governanca.csv" download class="btn btn-primary" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
              📥 Baixar CSV
            </a>
          </div>
        </div>

        <!-- Card 5: Capacidades Instaladas -->
        <div class="download-card">
          <div>
            <div class="download-card-header">
              <div class="download-icon">🏢</div>
              <div>
                <div class="download-card-title">Capacidades Instaladas</div>
                <div class="file-meta">02_capacidades_instaladas.csv</div>
              </div>
            </div>
            <div class="download-card-desc">
              Estrutura física (salas, sede exclusiva, auditório, laboratório, estúdio), faixas de servidores efetivos, comissionados, magistrados na gestão e orçamento 2025.
            </div>
          </div>
          <div class="download-card-footer">
            <span class="file-meta">168 linhas · 14 KB</span>
            <a href="dados/02_capacidades_instaladas.csv" download class="btn btn-primary" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
              📥 Baixar CSV
            </a>
          </div>
        </div>

        <!-- Card 6: Ecossistema Digital -->
        <div class="download-card">
          <div>
            <div class="download-card-header">
              <div class="download-icon">💻</div>
              <div>
                <div class="download-card-title">Ecossistema Digital</div>
                <div class="file-meta">03_ecossistema_digital.csv</div>
              </div>
            </div>
            <div class="download-card-desc">
              Ambiente Virtual de Aprendizagem (AVA), plataforma Moodle, videoconferência, acessibilidade, IA, capacidade de produção EaD e modalidades de formação.
            </div>
          </div>
          <div class="download-card-footer">
            <span class="file-meta">210 linhas · 18 KB</span>
            <a href="dados/03_ecossistema_digital.csv" download class="btn btn-primary" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
              📥 Baixar CSV
            </a>
          </div>
        </div>

        <!-- Card 7: Corpo Docente -->
        <div class="download-card">
          <div>
            <div class="download-card-header">
              <div class="download-icon">🎓</div>
              <div>
                <div class="download-card-title">Corpo Docente e Formadores</div>
                <div class="file-meta">04_corpo_docente_e_formadores.csv</div>
              </div>
            </div>
            <div class="download-card-desc">
              Composição docente, instrumentos de gestão docente (retribuição GECC, banco de formadores, avaliação de desempenho), cadastro e programas de formação.
            </div>
          </div>
          <div class="download-card-footer">
            <span class="file-meta">147 linhas · 13 KB</span>
            <a href="dados/04_corpo_docente_e_formadores.csv" download class="btn btn-primary" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
              📥 Baixar CSV
            </a>
          </div>
        </div>

        <!-- Card 8: Avaliação da Formação -->
        <div class="download-card">
          <div>
            <div class="download-card-header">
              <div class="download-icon">📈</div>
              <div>
                <div class="download-card-title">Avaliação da Formação</div>
                <div class="file-meta">05_avaliacao_da_formacao.csv</div>
              </div>
            </div>
            <div class="download-card-desc">
              Níveis 1 a 4 de Kirkpatrick (reação, aprendizagem, transferência e impacto), pesquisa de impacto em egressos e coerência avaliativa.
            </div>
          </div>
          <div class="download-card-footer">
            <span class="file-meta">126 linhas · 11 KB</span>
            <a href="dados/05_avaliacao_da_formacao.csv" download class="btn btn-primary" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
              📥 Baixar CSV
            </a>
          </div>
        </div>

        <!-- Card 9: Agenda Formativa -->
        <div class="download-card">
          <div>
            <div class="download-card-header">
              <div class="download-icon">🎯</div>
              <div>
                <div class="download-card-title">Agenda e Eixos Prioritários</div>
                <div class="file-meta">06_agenda_formativa.csv</div>
              </div>
            </div>
            <div class="download-card-desc">
              Públicos atendidos em 2025, todas as 17 áreas temáticas trabalhadas e eixos estratégicos indicados para 2026 (Inteligência Artificial, Gestão, etc.).
            </div>
          </div>
          <div class="download-card-footer">
            <span class="file-meta">280 linhas · 24 KB</span>
            <a href="dados/06_agenda_formativa.csv" download class="btn btn-primary" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
              📥 Baixar CSV
            </a>
          </div>
        </div>

        <!-- Card 10: Cooperação e Rede -->
        <div class="download-card">
          <div>
            <div class="download-card-header">
              <div class="download-icon">🤝</div>
              <div>
                <div class="download-card-title">Cooperação e Rede ENAJU</div>
                <div class="file-meta">07_cooperacao_e_articulacao.csv</div>
              </div>
            </div>
            <div class="download-card-desc">
              Parcerias formais vigentes, instituições parceiras, modalidades de compartilhamento de cursos/vagas e interesse na integração em rede coordenada pela ENAJU.
            </div>
          </div>
          <div class="download-card-footer">
            <span class="file-meta">161 linhas · 14 KB</span>
            <a href="dados/07_cooperacao_e_articulacao.csv" download class="btn btn-primary" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
              📥 Baixar CSV
            </a>
          </div>
        </div>

        <!-- Card 11: Distribuição Territorial -->
        <div class="download-card">
          <div>
            <div class="download-card-header">
              <div class="download-icon">🗺️</div>
              <div>
                <div class="download-card-title">Distribuição Territorial (UF Proxy)</div>
                <div class="file-meta">distribuicao_territorial.csv</div>
              </div>
            </div>
            <div class="download-card-desc">
              Localização de sede inferida pela sigla institucional agregada por UF e ramo de justiça, para leitura da cobertura espacial da rede.
            </div>
          </div>
          <div class="download-card-footer">
            <span class="file-meta">85 linhas · 3 KB</span>
            <a href="dados/distribuicao_territorial.csv" download class="btn btn-primary" style="font-size: 0.78rem; padding: 0.4rem 0.8rem;">
              📥 Baixar CSV
            </a>
          </div>
        </div>

      </div>
    </div>

  </main>

  <!-- Footer -->
  <footer class="main-footer">
    <div class="footer-content">
      <div><strong>Escola Nacional do Judiciário (ENAJU) · Conselho Nacional de Justiça (CNJ)</strong></div>
      <div>Diagnóstico Nacional das Unidades de Formação do Poder Judiciário · Resolução CNJ nº 643/2025</div>
      <div>Relatório oficial de referência: <code>relatorio.pdf</code> (Versão R01.2) · Universo: N = 110 unidades respondentes · Elaboração própria</div>
    </div>
  </footer>

  <!-- SCRIPT LOGIC -->
  <script>
    // Paleta de Cores Oficial ENAJU / CNJ
    const CORES = {
      navy: '#00367C',
      azul: '#0163AC',
      ceu: '#009BD4',
      teal: '#3E9F9B',
      ambar: '#D9982B',
      verde: '#2E7D32',
      cinza_esc: '#5C5B60',
      cinza_med: '#9A9CA1',
      cinza_cl: '#D7D9DD',
      cinza_bg: '#F1F3F5',
      palido: '#E8F4FB',
      branco: '#FFFFFF',
      ramo: {
        'Eleitoral': '#D9982B',
        'Estadual': '#0163AC',
        'Trabalho': '#3E9F9B',
        'Federal': '#00367C',
        'Militar': '#5C5B60',
        'Superior/Conselho': '#009BD4',
        'Nacional': '#00367C'
      }
    };

    let segmentoAtual = 'Nacional';
    let chartsInstanciados = {};
    const DADOS = window.DADOS_PAINEL_ENAJU;

    // Inicialização da Página
    document.addEventListener('DOMContentLoaded', () => {
      popularKPIs();
      inicializarTodosGraficos();
      preencherTodasTabelas();
      popularSeletorComparador();
    });

    // Navegação de Abas
    function abrirAba(abaId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));

      const target = document.getElementById('tab-' + abaId);
      if (target) target.classList.add('active');

      const tabs = Array.from(document.querySelectorAll('.tab-item'));
      const activeTab = tabs.find(t => t.getAttribute('onclick').includes(abaId));
      if (activeTab) activeTab.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Alteração do Segmento / Ramo
    function alterarSegmento(seg) {
      segmentoAtual = seg;
      const segInfo = DADOS.segmentos.find(s => s.id === seg);
      
      // Atualizar badge no topo
      document.getElementById('lblSegmentoAtual').innerText = segInfo.nome + ' (n=' + segInfo.N + ')';

      // Alerta de grupos pequenos (Regra R01.1)
      const alertBox = document.getElementById('smallGroupAlert');
      if (segInfo.pequeno) {
        alertBox.style.display = 'block';
      } else {
        alertBox.style.display = 'none';
      }

      // Atualizar dados, gráficos e tabelas
      popularKPIs();
      atualizarTodosGraficos();
      preencherTodasTabelas();
    }

    // Helper: Buscar corte por variável, categoria e segmento
    function obterCorte(variavel, categoria, seg = segmentoAtual) {
      return DADOS.cortes.find(c => c.variavel === variavel && c.categoria === categoria && c.segmento === seg) || { n: 0, N: 1, pct: 0 };
    }

    // Helper: Buscar todos os cortes de uma variável no segmento atual
    function obterCortesVariavel(variavel, seg = segmentoAtual) {
      return DADOS.cortes.filter(c => c.variavel === variavel && c.segmento === seg);
    }

    // Formatação pt-BR
    function fmtPct(val, casas = 1) {
      if (val === undefined || val === null || isNaN(val)) return '—';
      return Number(val).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }) + '%';
    }

    function fmtInt(val) {
      if (val === undefined || val === null || isNaN(val)) return '0';
      return Number(val).toLocaleString('pt-BR');
    }

    // Popular KPIs do topo
    function popularKPIs() {
      const segInfo = DADOS.segmentos.find(s => s.id === segmentoAtual);
      document.getElementById('kpi-n-respostas').innerText = segInfo.N;

      const cEscola = obterCorte('natureza', 'Escola formalmente instituída');
      document.getElementById('kpi-nat-escola').innerText = fmtPct(cEscola.pct);

      const cPlanA = obterCorte('plan_A', 'Indicador A — planejamento próprio vigente e formalizado');
      document.getElementById('kpi-plan-a').innerText = fmtPct(cPlanA.pct);

      const cAva = obterCorte('ava_algum', 'Dispõe de algum AVA');
      document.getElementById('kpi-ava-algum').innerText = fmtPct(cAva.pct);

      const cEad = obterCorte('capacidade_ead', 'Equipe multidisciplinar dedicada, com designer instrucional, audiovisual e TI');
      document.getElementById('kpi-cap-equipe').innerText = fmtPct(cEad.pct);

      const cInt = obterCorte('interesse_aberto', 'Interesse alto ou moderado');
      document.getElementById('kpi-int-aberto').innerText = fmtPct(cInt.pct);
    }

    // Configuração Padrão do Chart.js
    if (typeof Chart !== 'undefined') {
      Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      Chart.defaults.font.size = 11;
      Chart.defaults.color = CORES.cinza_esc;
      Chart.defaults.plugins.legend.labels.usePointStyle = true;
    }

    // Destruir e recriar gráfico
    function criarOuAtualizarChart(idCanvas, config) {
      if (typeof Chart === 'undefined') return;
      if (chartsInstanciados[idCanvas]) {
        chartsInstanciados[idCanvas].destroy();
      }
      const ctx = document.getElementById(idCanvas);
      if (!ctx) return;
      chartsInstanciados[idCanvas] = new Chart(ctx, config);
    }

    // Inicializar todos os gráficos
    function inicializarTodosGraficos() {
      atualizarTodosGraficos();
    }

    function atualizarTodosGraficos() {
      renderizarChartSintese12();
      renderizarChartNatureza();
      renderizarChartPlanejamento();
      renderizarChartInstrumentosGov();
      renderizarChartDotacao();
      renderizarChartEstrutura();
      renderizarChartOrcamento();
      renderizarChartPessoal();
      renderizarChartAva();
      renderizarChartCapacidadeEad();
      renderizarChartRecursosTec();
      renderizarChartComposicaoDocente();
      renderizarChartGestaoDocente();
      renderizarChartFormacaoFormadores();
      renderizarChartCadastroDocente();
      renderizarChartEscadaAvaliacao();
      renderizarChartEgressos();
      renderizarChartKirkpatrickEmpilhado();
      renderizarChartPublicos();
      renderizarChartEixos2026();
      renderizarChartTematicas2025();
      renderizarChartInteresse();
      renderizarChartParcerias();
      renderizarChartInstituicoes();
      renderizarChartModalidades();
      atualizarGraficoComparador();
    }

    // 1. Gráfico Síntese 12 Indicadores
    function renderizarChartSintese12() {
      const lista = [
        { label: 'Videoconferência (distribuição digital)', var: 'recursos_tecnologias', cat: 'Salas virtuais de videoconferência' },
        { label: 'Ambiente Virtual (AVA disponível)', var: 'ava_algum', cat: 'Dispõe de algum AVA' },
        { label: 'Servidores no corpo docente', var: 'composicao_docente_2025', cat: 'Servidores do próprio tribunal' },
        { label: 'Interesse aberto na ENAJU/CNJ', var: 'interesse_aberto', cat: 'Interesse alto ou moderado' },
        { label: 'Plano Anual de Capacitação (PAC)', var: 'instrumentos_governanca', cat: 'Plano anual de capacitação aprovado' },
        { label: 'Compartilhamento de vagas/cursos', var: 'modalidades_cooperacao', cat: 'Compartilhamento de cursos ou vagas' },
        { label: 'Regimento interno ou ato próprio', var: 'instrumentos_governanca', cat: 'Ato normativo ou regimento interno próprio' },
        { label: 'Escola formalmente instituída', var: 'natureza', cat: 'Escola formalmente instituída' },
        { label: 'Rubrica orçamentária própria', var: 'dotacao', cat: 'Rubrica orçamentária própria' },
        { label: 'Planejamento c/ ref. estratégica (B)', var: 'plan_B', cat: 'Indicador B — referência estratégica existente' },
        { label: 'Planejamento próprio vigente (A)', var: 'plan_A', cat: 'Indicador A — planejamento próprio vigente e formalizado' },
        { label: 'Equipe dedicada à produção EaD', var: 'capacidade_ead', cat: 'Equipe multidisciplinar dedicada, com designer instrucional, audiovisual e TI' },
      ];

      const labels = [];
      const dataPct = [];
      const dataN = [];

      lista.forEach(item => {
        const c = obterCorte(item.var, item.cat);
        labels.push(item.label);
        dataPct.push(Number(c.pct.toFixed(1)));
        dataN.push(c.n);
      });

      criarOuAtualizarChart('chartSintese12', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '% no Ramo Selecionado',
            data: dataPct,
            backgroundColor: dataPct.map(v => v >= 70 ? CORES.navy : (v >= 45 ? CORES.azul : CORES.ceu)),
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.raw}% (${dataN[ctx.dataIndex]} de ${DADOS.segmentos.find(s=>s.id===segmentoAtual).N} unidades)`
              }
            }
          },
          scales: {
            x: {
              max: 100,
              ticks: { callback: v => v + '%' },
              grid: { color: CORES.cinza_cl }
            },
            y: { grid: { display: false } }
          }
        }
      });

      // Preencher Tabela Síntese 12
      const tbody = document.getElementById('tbody-sintese-12');
      if (tbody) {
        tbody.innerHTML = '';
        lista.forEach((item, idx) => {
          const c = obterCorte(item.var, item.cat);
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${DADOS.variaveis_info[item.var]?.dimensao || 'Geral'}</td>
            <td class="text-bold">${item.label}</td>
            <td class="text-right">${fmtInt(c.n)}</td>
            <td class="text-right">${fmtInt(c.N)}</td>
            <td class="text-right text-bold">${fmtPct(c.pct)}</td>
            <td class="progress-bar-cell">
              <div class="mini-progress">
                <div class="mini-progress-fill" style="width: ${Math.min(c.pct, 100)}%;"></div>
              </div>
            </td>
          `;
          tbody.appendChild(tr);
        });
      }
    }

    // 2. Gráfico Natureza
    function renderizarChartNatureza() {
      const cortes = obterCortesVariavel('natureza');
      const cats = ['Escola formalmente instituída', 'Setor de capacitação (gestão de pessoas)', 'Centro/núcleo sem natureza de escola'];
      const labels = ['Escola formal', 'Setor de RH', 'Centro/núcleo'];
      const data = cats.map(c => Number((cortes.find(x => x.categoria === c) || { pct: 0 }).pct.toFixed(1)));

      criarOuAtualizarChart('chartNatureza', {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [CORES.navy, CORES.ambar, CORES.teal]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } }
          }
        }
      });
    }

    // 3. Gráfico Planejamento
    function renderizarChartPlanejamento() {
      const cortes = obterCortesVariavel('planejamento');
      const cats = [
        'Plano próprio vigente e formalizado',
        'Não possui',
        'Em elaboração',
        'Plano próprio desatualizado/vencido',
        'Adota o planejamento estratégico do tribunal',
        'Apenas plano anual (PAC/PAT)'
      ];
      const labels = ['Próprio vigente', 'Não possui', 'Em elaboração', 'Desatualizado', 'Adota tribunal', 'Apenas anual'];
      const data = cats.map(c => Number((cortes.find(x => x.categoria === c) || { pct: 0 }).pct.toFixed(1)));

      criarOuAtualizarChart('chartPlanejamento', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: CORES.azul,
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ` ${ctx.raw}%` } }
          },
          scales: {
            x: { max: 100, ticks: { callback: v => v + '%' } },
            y: { grid: { display: false } }
          }
        }
      });
    }

    // 4. Gráfico Instrumentos Governança
    function renderizarChartInstrumentosGov() {
      const itens = [
        { label: 'PAC aprovado', cat: 'Plano anual de capacitação aprovado' },
        { label: 'Regimento / Ato próprio', cat: 'Ato normativo ou regimento interno próprio' },
        { label: 'Projeto Pedagógico (PPI)', cat: 'Projeto pedagógico institucional' },
        { label: 'Conselho Pedagógico', cat: 'Conselho ou colegiado pedagógico' },
      ];
      const labels = itens.map(i => i.label);
      const data = itens.map(i => Number(obterCorte('instrumentos_governanca', i.cat).pct.toFixed(1)));

      criarOuAtualizarChart('chartInstrumentosGov', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [CORES.navy, CORES.azul, CORES.teal, CORES.ambar],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ` ${ctx.raw}%` } }
          },
          scales: {
            y: { max: 100, ticks: { callback: v => v + '%' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 5. Gráfico Dotação
    function renderizarChartDotacao() {
      const cortes = obterCortesVariavel('dotacao');
      const labels = ['Rubrica própria', 'Rubrica geral tribunal', 'Rubrica específica'];
      const cats = [
        'Rubrica orçamentária própria',
        'Custeada por rubrica geral do tribunal',
        'Rubrica específica de capacitação gerida pelo tribunal (texto livre)'
      ];
      const data = cats.map(c => Number((cortes.find(x => x.categoria === c) || { pct: 0 }).pct.toFixed(1)));

      criarOuAtualizarChart('chartDotacao', {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [CORES.navy, CORES.azul, CORES.teal]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } }
          }
        }
      });
    }

    // 6. Gráfico Estrutura Física
    function renderizarChartEstrutura() {
      const itens = [
        'Salas de aula ou treinamento',
        'Sede / espaço físico próprio e exclusivo',
        'Auditório',
        'Laboratório de informática',
        'Biblioteca / centro de memória',
        'Estúdio de gravação (EaD)',
        'Não dispõe de espaço físico dedicado, utiliza estrutura do tribunal'
      ];
      const labels = ['Salas de aula', 'Sede própria', 'Auditório', 'Laboratório info.', 'Biblioteca/Memória', 'Estúdio EaD', 'Sem espaço dedicado'];
      const data = itens.map(c => Number(obterCorte('estrutura_fisica', c).pct.toFixed(1)));

      criarOuAtualizarChart('chartEstrutura', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: data.map((v, i) => i === 6 ? CORES.ambar : CORES.navy),
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ` ${ctx.raw}%` } }
          },
          scales: {
            x: { max: 100, ticks: { callback: v => v + '%' } },
            y: { grid: { display: false } }
          }
        }
      });
    }

    // 7. Gráfico Orçamento Faixas
    function renderizarChartOrcamento() {
      const faixas = ['Até R$ 250 mil', 'R$ 250 mil a R$ 1 mi', 'R$ 1 mi a R$ 5 mi', 'Acima de R$ 5 mi', 'Sem informação consolidada'];
      const data = faixas.map(f => Number(obterCorte('orcamento', f).pct.toFixed(1)));

      criarOuAtualizarChart('chartOrcamento', {
        type: 'bar',
        data: {
          labels: faixas,
          datasets: [{
            data: data,
            backgroundColor: [CORES.teal, CORES.ceu, CORES.azul, CORES.navy, CORES.cinza_med],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ` ${ctx.raw}%` } }
          },
          scales: {
            y: { max: 100, ticks: { callback: v => v + '%' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 8. Gráfico Quadro Pessoal
    function renderizarChartPessoal() {
      const faixas = ['Nenhum', '1 a 3', '4 a 10', 'Mais de 10'];
      const efetivos = faixas.map(f => Number(obterCorte('efetivos', f).pct.toFixed(1)));
      const comiss = faixas.map(f => Number(obterCorte('comissionados', f).pct.toFixed(1)));
      const mag = faixas.map(f => Number(obterCorte('magistrados_gestao', f).pct.toFixed(1)));

      criarOuAtualizarChart('chartPessoal', {
        type: 'bar',
        data: {
          labels: faixas,
          datasets: [
            { label: 'Servidores Efetivos', data: efetivos, backgroundColor: CORES.navy },
            { label: 'Cargos em Comissão / FC', data: comiss, backgroundColor: CORES.ceu },
            { label: 'Magistrados na Gestão', data: mag, backgroundColor: CORES.ambar }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` } }
          },
          scales: {
            y: { max: 100, ticks: { callback: v => v + '%' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 9. Gráfico AVA
    function renderizarChartAva() {
      const cats = ['AVA próprio', 'AVA compartilhado com o tribunal', 'AVA de outra instituição (ENFAM/ENAJU/outra)', 'Sem AVA'];
      const labels = ['AVA próprio', 'Compartilhado tribunal', 'Outra instituição', 'Sem AVA'];
      const data = cats.map(c => Number(obterCorte('ava', c).pct.toFixed(1)));

      criarOuAtualizarChart('chartAva', {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [CORES.navy, CORES.ceu, CORES.teal, CORES.ambar]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 10. Gráfico Capacidade EaD
    function renderizarChartCapacidadeEad() {
      const cats = [
        'Equipe multidisciplinar dedicada, com designer instrucional, audiovisual e TI',
        'Produção parcial, com apoio pontual de outras áreas',
        'Não há capacidade própria de produção'
      ];
      const labels = ['Equipe multidisciplinar', 'Produção parcial', 'Sem capacidade própria'];
      const data = cats.map(c => Number(obterCorte('capacidade_ead', c).pct.toFixed(1)));

      criarOuAtualizarChart('chartCapacidadeEad', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [CORES.verde, CORES.azul, CORES.ambar],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { max: 100, ticks: { callback: v => v + '%' } }, x: { grid: { display: false } } }
        }
      });
    }

    // 11. Gráfico Recursos e Tecnologias
    function renderizarChartRecursosTec() {
      const itens = [
        'Salas virtuais de videoconferência',
        'Webinários e transmissões ao vivo',
        'Recursos de acessibilidade (LIBRAS, audiodescrição, legendagem)',
        'Produção própria de conteúdo audiovisual',
        'Recursos de inteligência artificial aplicados à educação',
        'Gamificação e recursos interativos avançados'
      ];
      const labels = ['Videoconferência', 'Webinários', 'Acessibilidade', 'Produção Audiovisual', 'Inteligência Artificial', 'Gamificação'];
      const data = itens.map(c => Number(obterCorte('recursos_tecnologias', c).pct.toFixed(1)));

      criarOuAtualizarChart('chartRecursosTec', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: CORES.navy,
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { max: 100, ticks: { callback: v => v + '%' } }, y: { grid: { display: false } } }
        }
      });
    }

    // 12. Gráfico Composição Docente
    function renderizarChartComposicaoDocente() {
      const itens = [
        'Servidores do próprio tribunal',
        'Docentes externos contratados',
        'Magistrados do próprio tribunal',
        'Profissionais de outras instituições públicas',
        'Docentes de instituições de ensino superior (IES)'
      ];
      const labels = ['Servidores tribunal', 'Docentes externos', 'Magistrados tribunal', 'Profissionais outros órgãos', 'Docentes de IES'];
      const data = itens.map(c => Number(obterCorte('composicao_docente_2025', c).pct.toFixed(1)));

      criarOuAtualizarChart('chartComposicaoDocente', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: CORES.azul,
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { max: 100, ticks: { callback: v => v + '%' } }, y: { grid: { display: false } } }
        }
      });
    }

    // 13. Gráfico Gestão Docente
    function renderizarChartGestaoDocente() {
      const itens = [
        'Política formal de retribuição por hora-aula (GECC ou equivalente)',
        'Banco formal de formadores/docentes',
        'Avaliação formal de desempenho docente',
        'Critérios formais de credenciamento e seleção de formadores'
      ];
      const labels = ['Retribuição (GECC)', 'Banco de formadores', 'Avaliação docente', 'Critérios credenciamento'];
      const data = itens.map(c => Number(obterCorte('instrumentos_gestao_docente', c).pct.toFixed(1)));

      criarOuAtualizarChart('chartGestaoDocente', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [CORES.navy, CORES.azul, CORES.teal, CORES.ambar],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { max: 100, ticks: { callback: v => v + '%' } }, x: { grid: { display: false } } }
        }
      });
    }

    // 14. Gráfico Formação Formadores
    function renderizarChartFormacaoFormadores() {
      const cats = ['Programa permanente com certificação', 'Ações pontuais', 'Não desenvolve'];
      const labels = ['Programa permanente', 'Ações pontuais', 'Não desenvolve'];
      const data = cats.map(c => Number(obterCorte('formacao_formadores', c).pct.toFixed(1)));

      criarOuAtualizarChart('chartFormacaoFormadores', {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [CORES.verde, CORES.ceu, CORES.ambar]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 15. Gráfico Cadastro Docente
    function renderizarChartCadastroDocente() {
      const sim = Number(obterCorte('cadastro_formadores', 'Sim').pct.toFixed(1));
      const nao = Number(obterCorte('cadastro_formadores', 'Não').pct.toFixed(1));

      criarOuAtualizarChart('chartCadastroDocente', {
        type: 'pie',
        data: {
          labels: ['Sim, atualizado', 'Não'],
          datasets: [{
            data: [sim, nao],
            backgroundColor: [CORES.navy, CORES.cinza_cl]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 16. Gráfico Escada Kirkpatrick
    function renderizarChartEscadaAvaliacao() {
      const itens = [
        { label: 'Nível 1 · Reação', var: 'n1_aplica', cat: 'Nível 1 (reação) aplicado, em parte ou na maioria das ações' },
        { label: 'Nível 2 · Aprendizagem', var: 'n2_aplica', cat: 'Nível 2 (aprendizagem) aplicado, em parte ou na maioria das ações' },
        { label: 'Nível 3 · Transferência', var: 'n3_aplica', cat: 'Nível 3 (transferência) aplicado, em parte ou na maioria das ações' },
        { label: 'Nível 4 · Impacto', var: 'n4_aplica', cat: 'Nível 4 (impacto) aplicado, em parte ou na maioria das ações' }
      ];
      const labels = itens.map(i => i.label);
      const data = itens.map(i => Number(obterCorte(i.var, i.cat).pct.toFixed(1)));

      criarOuAtualizarChart('chartEscadaAvaliacao', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '% Aplicação',
            data: data,
            backgroundColor: [CORES.navy, CORES.azul, CORES.teal, CORES.ambar],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ` ${ctx.raw}% das unidades` } }
          },
          scales: {
            y: { max: 100, ticks: { callback: v => v + '%' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 17. Gráfico Egressos
    function renderizarChartEgressos() {
      const cats = ['Sim, de forma sistemática', 'Sim, de forma pontual', 'Não realiza'];
      const labels = ['Sistemática', 'Pontual', 'Não realiza'];
      const data = cats.map(c => Number(obterCorte('egressos', c).pct.toFixed(1)));

      criarOuAtualizarChart('chartEgressos', {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [CORES.verde, CORES.ceu, CORES.ambar]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 18. Gráfico Kirkpatrick Empilhado
    function renderizarChartKirkpatrickEmpilhado() {
      const niveis = ['n1', 'n2', 'n3', 'n4'];
      const rotulos = ['N1 · Reação', 'N2 · Aprendizagem', 'N3 · Transferência', 'N4 · Impacto'];
      const maioria = niveis.map(v => Number(obterCorte(v, 'Na maioria das ações').pct.toFixed(1)));
      const parte = niveis.map(v => Number(obterCorte(v, 'Em parte das ações').pct.toFixed(1)));
      const nao = niveis.map(v => Number(obterCorte(v, 'Não aplica').pct.toFixed(1)));

      criarOuAtualizarChart('chartKirkpatrickEmpilhado', {
        type: 'bar',
        data: {
          labels: rotulos,
          datasets: [
            { label: 'Na maioria das ações', data: maioria, backgroundColor: CORES.navy },
            { label: 'Em parte das ações', data: parte, backgroundColor: CORES.ceu },
            { label: 'Não aplica', data: nao, backgroundColor: CORES.cinza_cl }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true, max: 100, ticks: { callback: v => v + '%' } },
            y: { stacked: true, grid: { display: false } }
          },
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 19. Gráfico Públicos Atendidos
    function renderizarChartPublicos() {
      const itens = [
        'Servidores',
        'Magistrados',
        'Estagiários',
        'Público externo (cidadãos, estudantes, advogados)',
        'Colaboradores terceirizados',
        'Conciliadores e mediadores'
      ];
      const labels = ['Servidores', 'Magistrados', 'Estagiários', 'Público externo', 'Terceirizados', 'Conciliadores'];
      const data = itens.map(c => Number(obterCorte('publicos_2025', c).pct.toFixed(1)));

      criarOuAtualizarChart('chartPublicos', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: CORES.navy,
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { max: 100, ticks: { callback: v => v + '%' } }, y: { grid: { display: false } } }
        }
      });
    }

    // 20. Gráfico Eixos 2026
    function renderizarChartEixos2026() {
      const cortes = obterCortesVariavel('eixos_prioritarios_2026').sort((a,b) => b.pct - a.pct);
      const labels = cortes.map(c => c.categoria.length > 30 ? c.categoria.substring(0, 30) + '...' : c.categoria);
      const data = cortes.map(c => Number(c.pct.toFixed(1)));

      criarOuAtualizarChart('chartEixos2026', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: data.map((v, i) => i === 0 ? CORES.ambar : CORES.azul),
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { max: 100, ticks: { callback: v => v + '%' } }, y: { grid: { display: false } } }
        }
      });
    }

    // 21. Gráfico Temáticas 2025
    function renderizarChartTematicas2025() {
      const cortes = obterCortesVariavel('tematicas_2025').sort((a,b) => b.pct - a.pct);
      const labels = cortes.map(c => c.categoria);
      const data = cortes.map(c => Number(c.pct.toFixed(1)));

      criarOuAtualizarChart('chartTematicas2025', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: CORES.navy,
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { max: 100, ticks: { callback: v => v + '%' } }, y: { grid: { display: false } } }
        }
      });
    }

    // 22. Gráfico Interesse ENAJU
    function renderizarChartInteresse() {
      const cats = ['Alto', 'Moderado', 'Baixo'];
      const data = cats.map(c => Number(obterCorte('interesse', c).pct.toFixed(1)));

      criarOuAtualizarChart('chartInteresse', {
        type: 'doughnut',
        data: {
          labels: ['Alto (85,5%)', 'Moderado (13,6%)', 'Baixo (0,9%)'],
          datasets: [{
            data: data,
            backgroundColor: [CORES.verde, CORES.ceu, CORES.ambar]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 23. Gráfico Parcerias
    function renderizarChartParcerias() {
      const cats = ['Sim, com convênios/acordos vigentes', 'Sim, com parcerias informais', 'Não mantém parcerias'];
      const labels = ['Convênios vigentes', 'Parcerias informais', 'Não mantém'];
      const data = cats.map(c => Number(obterCorte('parcerias', c).pct.toFixed(1)));

      criarOuAtualizarChart('chartParcerias', {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [CORES.navy, CORES.ceu, CORES.cinza_med]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 24. Gráfico Instituições de Cooperação
    function renderizarChartInstituicoes() {
      const cortes = obterCortesVariavel('instituicoes_cooperacao').sort((a,b) => b.pct - a.pct);
      const labels = cortes.map(c => c.categoria.length > 28 ? c.categoria.substring(0, 28) + '...' : c.categoria);
      const data = cortes.map(c => Number(c.pct.toFixed(1)));

      criarOuAtualizarChart('chartInstituicoes', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: cortes.map(c => c.categoria.includes('ENAJU') ? CORES.ambar : CORES.navy),
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { max: 100, ticks: { callback: v => v + '%' } }, y: { grid: { display: false } } }
        }
      });
    }

    // 25. Gráfico Modalidades de Cooperação
    function renderizarChartModalidades() {
      const cortes = obterCortesVariavel('modalidades_cooperacao').sort((a,b) => b.pct - a.pct);
      const labels = cortes.map(c => c.categoria.length > 32 ? c.categoria.substring(0, 32) + '...' : c.categoria);
      const data = cortes.map(c => Number(c.pct.toFixed(1)));

      criarOuAtualizarChart('chartModalidades', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: CORES.azul,
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { max: 100, ticks: { callback: v => v + '%' } }, y: { grid: { display: false } } }
        }
      });
    }

    // Comparador entre Ramos
    function popularSeletorComparador() {
      const sel = document.getElementById('comparadorVarSelect');
      if (!sel) return;
      sel.innerHTML = '';
      const vars = Object.keys(DADOS.variaveis_info);
      vars.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.innerText = `[${DADOS.variaveis_info[v].dimensao}] ${DADOS.variaveis_info[v].label}`;
        sel.appendChild(opt);
      });
      atualizarGraficoComparador('natureza');
    }

    function atualizarGraficoComparador(varNome = null) {
      const sel = document.getElementById('comparadorVarSelect');
      const v = varNome || (sel ? sel.value : 'natureza');
      if (!v) return;

      const segs = DADOS.segmentos;
      // Obter categorias únicas da variável
      const cortesNac = DADOS.cortes.filter(c => c.variavel === v && c.segmento === 'Nacional');
      const cats = cortesNac.map(c => c.categoria);

      const datasets = segs.map(s => {
        return {
          label: s.nome + (s.pequeno ? '*' : ''),
          data: cats.map(cat => {
            const row = DADOS.cortes.find(c => c.variavel === v && c.categoria === cat && c.segmento === s.id);
            return row ? Number(row.pct.toFixed(1)) : 0;
          }),
          backgroundColor: CORES.ramo[s.id] || CORES.azul
        };
      });

      criarOuAtualizarChart('chartComparador', {
        type: 'bar',
        data: {
          labels: cats.map(c => c.length > 25 ? c.substring(0, 25) + '...' : c),
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` } }
          },
          scales: {
            y: { max: 100, ticks: { callback: val => val + '%' } },
            x: { grid: { display: false } }
          }
        }
      });

      // Preencher matriz comparativa
      const tbody = document.getElementById('tbody-comparativo-ramo');
      if (tbody) {
        tbody.innerHTML = '';
        cats.forEach(cat => {
          const tr = document.createElement('tr');
          let html = `<td class="text-bold">${cat}</td>`;
          segs.forEach(s => {
            const row = DADOS.cortes.find(c => c.variavel === v && c.categoria === cat && c.segmento === s.id);
            const n = row ? row.n : 0;
            const pct = row ? row.pct : 0;
            if (s.pequeno) {
              html += `<td class="text-right">${n} de ${s.N} <span style="color:#666; font-size:0.75rem;">(${pct.toFixed(0)}%)</span></td>`;
            } else {
              html += `<td class="text-right">${n} (${pct.toFixed(1)}%)</td>`;
            }
          });
          tr.innerHTML = html;
          tbody.appendChild(tr);
        });
      }
    }

    // Preencher todas as tabelas de detalhes
    function preencherTodasTabelas() {
      preencherTabelaPorVariaveis('tbody-governanca', ['natureza', 'planejamento', 'plan_A', 'plan_B', 'instrumentos_governanca', 'dotacao', 'fontes_financiamento']);
      preencherTabelaPorVariaveis('tbody-capacidades', ['estrutura_fisica', 'efetivos', 'comissionados', 'magistrados_gestao', 'orcamento']);
      preencherTabelaPorVariaveis('tbody-digital', ['ava', 'moodle', 'recursos_tecnologias', 'capacidade_ead', 'mod_presencial', 'mod_ead_autoinstrucional', 'mod_ead_tutoria', 'mod_hibrida']);
      preencherTabelaPorVariaveis('tbody-docente', ['composicao_docente_2025', 'instrumentos_gestao_docente', 'cadastro_formadores', 'formacao_formadores']);
      preencherTabelaPorVariaveis('tbody-avaliacao', ['n1', 'n2', 'n3', 'n4', 'n1_aplica', 'n2_aplica', 'n3_aplica', 'n4_aplica', 'egressos', 'relacao_cursos']);
      preencherTabelaPorVariaveis('tbody-agenda', ['publicos_2025', 'eixos_prioritarios_2026', 'tematicas_2025']);
      preencherTabelaPorVariaveis('tbody-cooperacao', ['parcerias', 'instituicoes_cooperacao', 'modalidades_cooperacao', 'interesse']);
    }

    function preencherTabelaPorVariaveis(idTbody, listaVars) {
      const tbody = document.getElementById(idTbody);
      if (!tbody) return;
      tbody.innerHTML = '';

      listaVars.forEach(v => {
        const cortes = obterCortesVariavel(v);
        const meta = DADOS.variaveis_info[v] || { label: v };
        cortes.forEach(c => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${meta.label}</td>
            <td class="text-bold">${c.categoria}</td>
            <td class="text-right">${fmtInt(c.n)}</td>
            <td class="text-right">${fmtInt(c.N)}</td>
            <td class="text-right text-bold">${fmtPct(c.pct)}</td>
            <td class="progress-bar-cell">
              <div class="mini-progress">
                <div class="mini-progress-fill" style="width: ${Math.min(c.pct, 100)}%;"></div>
              </div>
            </td>
          `;
          tbody.appendChild(tr);
        });
      });
    }

    // Função Universal de Download CSV com UTF-8 BOM
    function baixarCSV(conteudo, nomeArquivo) {
      const blob = new Blob(['\\uFEFF' + conteudo], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', nomeArquivo);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Exportar Tabela HTML para CSV
    function baixarCSVDaTabela(idTabela, nomeArquivo) {
      const tabela = document.getElementById(idTabela);
      if (!tabela) return;

      const linhas = [];
      const trs = tabela.querySelectorAll('tr');
      trs.forEach(tr => {
        const cols = tr.querySelectorAll('th, td');
        const linhaArr = [];
        cols.forEach((col, idx) => {
          // Ignorar coluna de barra gráfica
          if (col.classList.contains('progress-bar-cell')) return;
          let texto = col.innerText.trim().replace(/"/g, '""');
          linhaArr.push(`"${texto}"`);
        });
        if (linhaArr.length > 0) {
          linhas.push(linhaArr.join(';'));
        }
      });

      baixarCSV(linhas.join('\\r\\n'), nomeArquivo);
    }

    // Exportar tabela que estiver visível na aba atual
    function exportarTabelaAtualCSV() {
      const abaAtiva = document.querySelector('.tab-content.active');
      if (!abaAtiva) return;
      const tabela = abaAtiva.querySelector('table.data-table');
      if (tabela) {
        baixarCSVDaTabela(tabela.id, `dados_${abaAtiva.id.replace('tab-', '')}_${segmentoAtual}.csv`);
      } else {
        baixarTodosIndicadoresCSV();
      }
    }

    // Baixar Todos os Indicadores CSV
    function baixarTodosIndicadoresCSV() {
      const cabecalho = '"variavel";"categoria";"segmento";"n";"N";"pct";"tipo"';
      const linhas = [cabecalho];
      DADOS.cortes.forEach(c => {
        const linha = [
          `"${c.variavel}"`,
          `"${c.categoria.replace(/"/g, '""')}"`,
          `"${c.segmento}"`,
          c.n,
          c.N,
          Number(c.pct.toFixed(2)).toLocaleString('pt-BR'),
          `"${c.tipo}"`
        ];
        linhas.push(linha.join(';'));
      });
      baixarCSV(linhas.join('\\r\\n'), 'indicadores_painel_completo_enaju.csv');
    }

    // Filtro em tempo real
    function filtrarConteudo(termo) {
      const q = termo.trim().toLowerCase();
      document.querySelectorAll('.data-table tbody tr').forEach(tr => {
        const texto = tr.innerText.toLowerCase();
        tr.style.display = texto.includes(q) ? '' : 'none';
      });
    }
  </script>
</body>
</html>
"""

(PAINEL_DIR / "index.html").write_text(html, encoding="utf-8")
print(f"index.html criado com sucesso em: {PAINEL_DIR / 'index.html'}")
