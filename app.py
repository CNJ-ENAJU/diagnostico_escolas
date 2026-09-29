# -*- coding: utf-8 -*-
"""
Painel Interativo do Diagnóstico Nacional das Unidades de Formação do Poder Judiciário.
Desenvolvido para a Escola Nacional do Judiciário (ENAJU) e Conselho Nacional de Justiça (CNJ).
Reflete fidedignamente o relatório oficial relatorio.pdf (R01.2).
"""
from pathlib import Path
import json
import pandas as pd
import streamlit as st

# Diretórios
PAINEL_DIR = Path(__file__).resolve().parent
DADOS_DIR = PAINEL_DIR / "dados"

# Configuração da Página Streamlit
st.set_page_config(
    page_title="Painel Diagnóstico das Escolas · ENAJU / CNJ",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Estilização Editorial ENAJU
st.markdown("""
<style>
    .main { background-color: #F8FAFC; }
    .stApp > header { background-color: transparent; }
    h1, h2, h3 { color: #00367C; font-weight: 700; }
    .kpi-box {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 1.1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        border-left: 4px solid #00367C;
        margin-bottom: 0.75rem;
    }
    .kpi-title { font-size: 0.8rem; font-weight: 700; color: #64748B; text-transform: uppercase; }
    .kpi-value { font-size: 1.8rem; font-weight: 800; color: #00367C; line-height: 1.2; }
    .kpi-sub { font-size: 0.78rem; color: #94A3B8; }
    .callout-box {
        background: #F0F7FF;
        border-left: 4px solid #0163AC;
        padding: 0.9rem 1.1rem;
        border-radius: 0 8px 8px 0;
        color: #1E3A8A;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }
    .callout-warning {
        background: #FFFBEB;
        border-left: 4px solid #D9982B;
        padding: 0.8rem 1rem;
        color: #92400E;
        font-size: 0.82rem;
        border-radius: 0 8px 8px 0;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# Carregamento de dados com cache
@st.cache_data
def carregar_dados():
    with open(DADOS_DIR / "dados_painel.json", encoding="utf-8") as f:
        dados_json = json.load(f)
    df_cortes = pd.read_csv(DADOS_DIR / "indicadores_painel_completo.csv")
    df_base = pd.read_csv(DADOS_DIR / "base_respostas_anonimizada.csv")
    return dados_json, df_cortes, df_base

dados_json, df_cortes, df_base = carregar_dados()

# Sidebar: Controles e Filtros
st.sidebar.image("https://raw.githubusercontent.com/cnj-gov-br/marca/main/cnj.png", width=160) if False else None
st.sidebar.title("ENAJU / CNJ")
st.sidebar.markdown("**Diagnóstico das Unidades de Formação**")
st.sidebar.caption("Ciclo 2025/2026 · Relatório R01.2")

segmentos_nomes = {
    "Nacional": "🇧🇷 Visão Geral Nacional (N=110)",
    "Eleitoral": "🗳️ Justiça Eleitoral (n=39)",
    "Estadual": "⚖️ Justiça Estadual (n=29)",
    "Trabalho": "🔨 Justiça do Trabalho (n=26)",
    "Federal": "🏛️ Justiça Federal (n=8)*",
    "Militar": "🛡️ Justiça Militar (n=5)*",
    "Superior/Conselho": "🏢 Tribunais Superiores e Conselhos (n=3)*",
}

seg_selecionado = st.sidebar.selectbox(
    "Selecione o Ramo de Justiça:",
    options=list(segmentos_nomes.keys()),
    format_func=lambda x: segmentos_nomes[x],
    index=0
)

seg_info = next(s for s in dados_json["segmentos"] if s["id"] == seg_selecionado)
N_seg = seg_info["N"]

if seg_info["pequeno"]:
    st.sidebar.warning(
        "⚠️ **Regra R01.1 (Pequenos Grupos):**\n"
        "Este segmento possui N ≤ 10. Os dados são apresentados preferencialmente em contagens absolutas para evitar distorções."
    )

st.sidebar.markdown("---")
st.sidebar.markdown("### 📥 Downloads Rápidos")
with open(DADOS_DIR / "indicadores_painel_completo.csv", "rb") as f_ind:
    st.sidebar.download_button(
        "💾 Baixar Base Completa (CSV)",
        data=f_ind,
        file_name="indicadores_painel_completo_enaju.csv",
        mime="text/csv",
        use_container_width=True
    )

with open(DADOS_DIR / "base_respostas_anonimizada.csv", "rb") as f_base:
    st.sidebar.download_button(
        "📑 Baixar Microdados (CSV)",
        data=f_base,
        file_name="base_respostas_anonimizada_enaju.csv",
        mime="text/csv",
        use_container_width=True
    )

# Header Principal
st.title("Diagnóstico Nacional das Unidades de Formação do Poder Judiciário")
st.markdown(
    f"**Painel Interativo de Indicadores e Capacidades Institucionais** · "
    f"Recorte em exibição: **{seg_info['nome']} (n={N_seg})**"
)

# Helpers de Busca
def get_corte(var, cat, seg=seg_selecionado):
    sub = df_cortes[(df_cortes["variavel"] == var) & (df_cortes["categoria"] == cat) & (df_cortes["segmento"] == seg)]
    if not sub.empty:
        return sub.iloc[0]
    return pd.Series({"n": 0, "N": N_seg, "pct": 0.0})

def get_cortes_var(var, seg=seg_selecionado):
    return df_cortes[(df_cortes["variavel"] == var) & (df_cortes["segmento"] == seg)].copy()

# Navegação por Abas Principais
abas = st.tabs([
    "📊 1. Visão Geral",
    "🏛️ 2. Rede & Governança",
    "🏢 3. Capacidades",
    "💻 4. Ecossistema Digital",
    "🎓 5. Corpo Docente",
    "📈 6. Avaliação",
    "🎯 7. Agenda Formativa",
    "🤝 8. Cooperação & ENAJU",
    "🔄 9. Comparador de Ramos",
    "💾 10. Downloads CSV"
])

# ==========================================
# ABA 1: VISÃO GERAL
# ==========================================
with abas[0]:
    c1, c2, c3, c4, c5, c6 = st.columns(6)
    with c1:
        st.markdown(f'<div class="kpi-box"><div class="kpi-title">Unidades</div><div class="kpi-value">{N_seg}</div><div class="kpi-sub">Total de respondentes</div></div>', unsafe_allow_html=True)
    with c2:
        c = get_corte("natureza", "Escola formalmente instituída")
        st.markdown(f'<div class="kpi-box"><div class="kpi-title">Escola Formal</div><div class="kpi-value">{c.pct:.1f}%</div><div class="kpi-sub">{c.n} unidades</div></div>', unsafe_allow_html=True)
    with c3:
        c = get_corte("plan_A", "Indicador A — planejamento próprio vigente e formalizado")
        st.markdown(f'<div class="kpi-box"><div class="kpi-title">Plano Próprio</div><div class="kpi-value">{c.pct:.1f}%</div><div class="kpi-sub">Indicador A</div></div>', unsafe_allow_html=True)
    with c4:
        c = get_corte("ava_algum", "Dispõe de algum AVA")
        st.markdown(f'<div class="kpi-box"><div class="kpi-title">Ambiente AVA</div><div class="kpi-value">{c.pct:.1f}%</div><div class="kpi-sub">90% usam Moodle</div></div>', unsafe_allow_html=True)
    with c5:
        c = get_corte("capacidade_ead", "Equipe multidisciplinar dedicada, com designer instrucional, audiovisual e TI")
        st.markdown(f'<div class="kpi-box"><div class="kpi-title">Equipe EaD</div><div class="kpi-value">{c.pct:.1f}%</div><div class="kpi-sub">{c.n} unidades</div></div>', unsafe_allow_html=True)
    with c6:
        c = get_corte("interesse_aberto", "Interesse alto ou moderado")
        st.markdown(f'<div class="kpi-box"><div class="kpi-title">Interesse ENAJU</div><div class="kpi-value">{c.pct:.1f}%</div><div class="kpi-sub">Abertura nacional</div></div>', unsafe_allow_html=True)

    st.markdown("### 📌 Os Seis Achados Centrais do Relatório")
    col_a, col_b = st.columns(2)
    with col_a:
        st.info("**1. Rede ampla e heterogênea:** 110 respostas de 92 órgãos. 86 escolas formalmente instituídas, 17 setores de capacitação vinculados a RH e 7 núcleos. A Justiça Eleitoral concentra 11 dos 17 setores de RH.")
        st.info("**2. Instrumentos operacionais mais disseminados que os estratégicos:** O PAC (85,5%) e o regimento próprio (80,9%) superam o planejamento estratégico formal próprio (47,3%), o PPI (52,7%) e o colegiado (48,2%).")
        st.info("**3. Distribuição digital ampla, produção especializada restrita:** Presença massiva de AVA (95,5%) e videoconferência (97,3%), contra equipe dedicada de EaD em apenas 18,2% e estúdio de gravação em 25,5%.")
    with col_b:
        st.info("**4. Programas permanentes de formação de formadores pouco disseminados:** Apenas 18,2% mantêm programa permanente; 50,9% realizam ações pontuais e 27,3% não desenvolvem formação docente.")
        st.info("**5. Avaliação decresce nos níveis de transferência e impacto:** N1 Reação (97,3%) → N2 Aprendizagem (72,7%) → N3 Transferência (40,9%) → N4 Impacto (34,5%). 44,5% não pesquisam egressos.")
        st.info("**6. Ampla abertura para articulação em rede:** 99,1% declaram interesse alto ou moderado na atuação integrada com ENAJU/CNJ e 84,5% compartilham cursos/vagas; cooperação atual com a ENAJU é de 18,2%.")

    st.markdown("### 📊 Os 12 Indicadores Estratégicos Nacionais")
    itens_12 = [
        {"indicador": "Salas virtuais de videoconferência", "var": "recursos_tecnologias", "cat": "Salas virtuais de videoconferência"},
        {"indicador": "Ambiente Virtual de Aprendizagem (AVA)", "var": "ava_algum", "cat": "Dispõe de algum AVA"},
        {"indicador": "Servidores no corpo docente", "var": "composicao_docente_2025", "cat": "Servidores do próprio tribunal"},
        {"indicador": "Interesse aberto na ENAJU/CNJ", "var": "interesse_aberto", "cat": "Interesse alto ou moderado"},
        {"indicador": "Plano Anual de Capacitação (PAC) aprovado", "var": "instrumentos_governanca", "cat": "Plano anual de capacitação aprovado"},
        {"indicador": "Compartilhamento de cursos ou vagas", "var": "modalidades_cooperacao", "cat": "Compartilhamento de cursos ou vagas"},
        {"indicador": "Regimento interno ou ato normativo próprio", "var": "instrumentos_governanca", "cat": "Ato normativo ou regimento interno próprio"},
        {"indicador": "Escola formalmente instituída", "var": "natureza", "cat": "Escola formalmente instituída"},
        {"indicador": "Rubrica orçamentária própria", "var": "dotacao", "cat": "Rubrica orçamentária própria"},
        {"indicador": "Referência estratégica existente (Indicador B)", "var": "plan_B", "cat": "Indicador B — referência estratégica existente"},
        {"indicador": "Planejamento próprio vigente (Indicador A)", "var": "plan_A", "cat": "Indicador A — planejamento próprio vigente e formalizado"},
        {"indicador": "Equipe multidisciplinar de produção EaD", "var": "capacidade_ead", "cat": "Equipe multidisciplinar dedicada, com designer instrucional, audiovisual e TI"},
    ]
    df_12 = pd.DataFrame([
        {
            "Indicador": item["indicador"],
            "Unidades (n)": int(get_corte(item["var"], item["cat"]).n),
            "Denominador (N)": int(get_corte(item["var"], item["cat"]).N),
            "Percentual (%)": round(float(get_corte(item["var"], item["cat"]).pct), 1),
        }
        for item in itens_12
    ])
    st.bar_chart(df_12.set_index("Indicador")["Percentual (%)"])
    st.dataframe(df_12, use_container_width=True, hide_index=True)

# ==========================================
# ABA 2: REDE & GOVERNANÇA
# ==========================================
with abas[1]:
    st.subheader("Rede e Governança Institucional (Capítulos 4 e 5)")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("**Natureza Institucional**")
        df_nat = get_cortes_var("natureza")[["categoria", "n", "pct"]].rename(columns={"categoria": "Natureza", "n": "Unidades", "pct": "%"})
        st.dataframe(df_nat, hide_index=True, use_container_width=True)
    with col2:
        st.markdown("**Situação do Planejamento Estratégico**")
        df_plan = get_cortes_var("planejamento")[["categoria", "n", "pct"]].rename(columns={"categoria": "Situação", "n": "Unidades", "pct": "%"})
        st.dataframe(df_plan, hide_index=True, use_container_width=True)

    col3, col4 = st.columns(2)
    with col3:
        st.markdown("**Instrumentos Formais de Governança**")
        df_inst = get_cortes_var("instrumentos_governanca")[["categoria", "n", "pct"]].rename(columns={"categoria": "Instrumento", "n": "Unidades", "pct": "%"})
        st.dataframe(df_inst, hide_index=True, use_container_width=True)
    with col4:
        st.markdown("**Dotação Orçamentária**")
        df_dot = get_cortes_var("dotacao")[["categoria", "n", "pct"]].rename(columns={"categoria": "Arranjo", "n": "Unidades", "pct": "%"})
        st.dataframe(df_dot, hide_index=True, use_container_width=True)

# ==========================================
# ABA 3: CAPACIDADES INSTALADAS
# ==========================================
with abas[2]:
    st.subheader("Capacidades Instaladas: Estrutura, Pessoal e Orçamento (Capítulo 6)")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("**Estrutura Física Disponível**")
        df_est = get_cortes_var("estrutura_fisica")[["categoria", "n", "pct"]].sort_values("pct", ascending=False)
        st.dataframe(df_est, hide_index=True, use_container_width=True)
    with col2:
        st.markdown("**Orçamento Executado em 2025 (Faixas)**")
        df_orc = get_cortes_var("orcamento")[["categoria", "n", "pct"]]
        st.dataframe(df_orc, hide_index=True, use_container_width=True)

# ==========================================
# ABA 4: ECOSSISTEMA DIGITAL
# ==========================================
with abas[3]:
    st.subheader("Ecossistema Digital: Plataformas e Produção (Capítulo 7)")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("**Ambiente Virtual de Aprendizagem (AVA)**")
        st.dataframe(get_cortes_var("ava")[["categoria", "n", "pct"]], hide_index=True, use_container_width=True)
    with col2:
        st.markdown("**Capacidade de Produção de EaD**")
        st.dataframe(get_cortes_var("capacidade_ead")[["categoria", "n", "pct"]], hide_index=True, use_container_width=True)

    st.markdown("**Recursos Tecnológicos Utilizados**")
    st.dataframe(get_cortes_var("recursos_tecnologias")[["categoria", "n", "pct"]].sort_values("pct", ascending=False), hide_index=True, use_container_width=True)

# ==========================================
# ABA 5: CORPO DOCENTE
# ==========================================
with abas[4]:
    st.subheader("Corpo Docente e Gestão de Formadores (Capítulo 8)")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("**Composição do Corpo Docente**")
        st.dataframe(get_cortes_var("composicao_docente_2025")[["categoria", "n", "pct"]].sort_values("pct", ascending=False), hide_index=True, use_container_width=True)
    with col2:
        st.markdown("**Instrumentos de Gestão Docente**")
        st.dataframe(get_cortes_var("instrumentos_gestao_docente")[["categoria", "n", "pct"]].sort_values("pct", ascending=False), hide_index=True, use_container_width=True)

# ==========================================
# ABA 6: AVALIAÇÃO DA FORMAÇÃO
# ==========================================
with abas[5]:
    st.subheader("Avaliação da Formação: Modelo Kirkpatrick e Egressos (Capítulo 9)")
    itens_kirk = [
        {"Nível": "Nível 1 · Reação", "var": "n1_aplica", "cat": "Nível 1 (reação) aplicado, em parte ou na maioria das ações"},
        {"Nível": "Nível 2 · Aprendizagem", "var": "n2_aplica", "cat": "Nível 2 (aprendizagem) aplicado, em parte ou na maioria das ações"},
        {"Nível": "Nível 3 · Transferência", "var": "n3_aplica", "cat": "Nível 3 (transferência) aplicado, em parte ou na maioria das ações"},
        {"Nível": "Nível 4 · Impacto", "var": "n4_aplica", "cat": "Nível 4 (impacto) aplicado, em parte ou na maioria das ações"},
    ]
    df_kirk = pd.DataFrame([
        {
            "Nível Avaliativo": i["Nível"],
            "Unidades que Aplicam (n)": int(get_corte(i["var"], i["cat"]).n),
            "% Aplicação": round(float(get_corte(i["var"], i["cat"]).pct), 1),
        }
        for i in itens_kirk
    ])
    st.dataframe(df_kirk, hide_index=True, use_container_width=True)
    st.bar_chart(df_kirk.set_index("Nível Avaliativo")["% Aplicação"])

# ==========================================
# ABA 7: AGENDA FORMATIVA
# ==========================================
with abas[6]:
    st.subheader("Agenda Formativa: Públicos, Temas e Prioridades 2026 (Capítulo 10)")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("**Públicos Atendidos nas Ações (2025)**")
        st.dataframe(get_cortes_var("publicos_2025")[["categoria", "n", "pct"]].sort_values("pct", ascending=False), hide_index=True, use_container_width=True)
    with col2:
        st.markdown("**Eixos Prioritários Apontados para 2026**")
        st.dataframe(get_cortes_var("eixos_prioritarios_2026")[["categoria", "n", "pct"]].sort_values("pct", ascending=False), hide_index=True, use_container_width=True)

# ==========================================
# ABA 8: COOPERAÇÃO & ENAJU
# ==========================================
with abas[7]:
    st.subheader("Cooperação Institucional e Rede ENAJU (Capítulo 11)")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("**Interesse em Iniciativas Integradas ENAJU/CNJ**")
        st.dataframe(get_cortes_var("interesse")[["categoria", "n", "pct"]], hide_index=True, use_container_width=True)
    with col2:
        st.markdown("**Parcerias Formais Vigentes**")
        st.dataframe(get_cortes_var("parcerias")[["categoria", "n", "pct"]], hide_index=True, use_container_width=True)

    col3, col4 = st.columns(2)
    with col3:
        st.markdown("**Instituições de Cooperação**")
        st.dataframe(get_cortes_var("instituicoes_cooperacao")[["categoria", "n", "pct"]].sort_values("pct", ascending=False), hide_index=True, use_container_width=True)
    with col4:
        st.markdown("**Modalidades de Cooperação Praticadas**")
        st.dataframe(get_cortes_var("modalidades_cooperacao")[["categoria", "n", "pct"]].sort_values("pct", ascending=False), hide_index=True, use_container_width=True)

# ==========================================
# ABA 9: COMPARADOR DE RAMOS
# ==========================================
with abas[8]:
    st.subheader("Comparador Dinâmico entre Ramos de Justiça")
    todas_vars = list(dados_json["variaveis_info"].keys())
    var_escolhida = st.selectbox(
        "Selecione a Variável:",
        options=todas_vars,
        format_func=lambda v: f"[{dados_json['variaveis_info'][v]['dimensao']}] {dados_json['variaveis_info'][v]['label']}"
    )

    df_comp = df_cortes[df_cortes["variavel"] == var_escolhida].pivot(index="categoria", columns="segmento", values="pct").round(1)
    st.dataframe(df_comp, use_container_width=True)
    st.bar_chart(df_comp)

# ==========================================
# ABA 10: DOWNLOADS CSV
# ==========================================
with abas[9]:
    st.subheader("Central de Downloads de Dados Abertos (CSV)")
    st.markdown("Baixe diretamente os arquivos CSV auditados do Diagnóstico Nacional:")

    arquivos = [
        ("Base Completa de Indicadores (1.296 linhas)", "indicadores_painel_completo.csv", "Tabela completa com cortes por variável, categoria e ramo."),
        ("Microdados Anonimizados (110 Unidades)", "base_respostas_anonimizada.csv", "Microdados por unidade respondente (códigos anônimos O01-O92)."),
        ("Síntese Nacional (N=110)", "08_indicadores_sintese_nacionais.csv", "Recorte nacional agregado pronto para relatórios."),
        ("Rede e Governança", "01_rede_e_governanca.csv", "Indicadores dos Capítulos 4 e 5."),
        ("Capacidades Instaladas", "02_capacidades_instaladas.csv", "Estrutura física, pessoal e orçamento."),
        ("Ecossistema Digital", "03_ecossistema_digital.csv", "AVA, Moodle, videoconferência e produção EaD."),
        ("Corpo Docente", "04_corpo_docente_e_formadores.csv", "Composição docente e gestão de formadores."),
        ("Avaliação da Formação", "05_avaliacao_da_formacao.csv", "Escada Kirkpatrick e egressos."),
        ("Agenda Formativa", "06_agenda_formativa.csv", "Públicos, temáticas e eixos 2026."),
        ("Cooperação e Rede", "07_cooperacao_e_articulacao.csv", "Parcerias e interesse na ENAJU/CNJ."),
        ("Distribuição Territorial", "distribuicao_territorial.csv", "Distribuição das sedes por UF proxy."),
    ]

    for titulo, arq_nome, desc in arquivos:
        p_arq = DADOS_DIR / arq_nome
        if p_arq.exists():
            col_t, col_b = st.columns([4, 1])
            with col_t:
                st.markdown(f"**{titulo}** (`{arq_nome}`)\n*{desc}*")
            with col_b:
                with open(p_arq, "rb") as f_dl:
                    st.download_button("📥 Baixar CSV", data=f_dl, file_name=arq_nome, mime="text/csv", key=arq_nome)
            st.markdown("---")

st.markdown("""
<div style="text-align: center; color: #94A3B8; font-size: 0.8rem; margin-top: 2rem;">
    Escola Nacional do Judiciário (ENAJU) · Conselho Nacional de Justiça (CNJ)<br>
    Diagnóstico Nacional das Unidades de Formação · Resolução CNJ nº 643/2025
</div>
""", unsafe_allow_html=True)
