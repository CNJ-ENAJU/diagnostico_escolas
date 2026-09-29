# -*- coding: utf-8 -*-
"""
Script de construção da Camada Pública de Dados do Diagnóstico Nacional das Escolas Judiciais.
Consome os intermediários homologados de 04_Relatorio e gera a camada estática pública sanitizada:
  - 06_Painel/data_public/
  - 06_Painel/public/data/

Regras rígidas:
  1. Nenhuma coluna de PII (nome, email, telefone, cargo, assinatura).
  2. Nenhuma coluna de anexos não homologados (27A, 31A, 35A, 39, D01, D02).
  3. Nenhum quantitativo de execução física 2025 não validado.
  4. Indicadores idênticos aos do relatório oficial (cortes.csv e indicadores.json).
"""
import json
import hashlib
import re
import shutil
from datetime import datetime
from pathlib import Path
import pandas as pd

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
RELATORIO_DIR = ROOT_DIR / "04_Relatorio"
INTERM_DIR = RELATORIO_DIR / "outputs" / "intermediarios"
ORGANIZACAO_DIR = ROOT_DIR / "00_Organização Inicial"
PAINEL_DIR = ROOT_DIR / "06_Painel"
DATA_PUBLIC_DIR = PAINEL_DIR / "data_public"
PUBLIC_DATA_DIR = PAINEL_DIR / "public" / "data"

DATA_PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)

print("Iniciando build da camada pública de dados...")

# 1. Carregar bases intermediárias homologadas
base_rel = pd.read_csv(INTERM_DIR / "base_relatorio.csv", encoding="utf-8-sig")
cortes = pd.read_csv(INTERM_DIR / "cortes.csv", encoding="utf-8-sig")
territorio = pd.read_csv(INTERM_DIR / "territorio.csv", encoding="utf-8-sig")
multiplas = pd.read_csv(INTERM_DIR / "multiplas_wide.csv", encoding="utf-8-sig")

with open(INTERM_DIR / "indicadores.json", "r", encoding="utf-8") as f:
    indicadores_json = json.load(f)

# 2. Carregar identificação institucional pública estritamente controlada
# Lemos apenas as 4 colunas institucionais públicas do questionário bruto
raw_inst = pd.read_csv(
    ORGANIZACAO_DIR / "01_base_respostas_organizada.csv",
    usecols=["id_resposta", "escola_unidade", "orgao_vinculado", "site_escola"],
    encoding="utf-8"
)
rec_inst = pd.read_csv(
    ORGANIZACAO_DIR / "C01_apoio" / "C01_base_recodificada.csv",
    usecols=["id_resposta", "orgao_sigla", "ano_criacao_num"],
    encoding="utf-8"
)

# Unificar dados da unidade
u = base_rel.merge(raw_inst, on="id_resposta").merge(rec_inst, on="id_resposta")

# Mapear listas de opções das múltiplas escolhas para cada unidade
campos_mult = [
    ("instrumentos_governanca", "instrumentos_governanca"),
    ("fontes_financiamento", "fontes_financiamento"),
    ("estrutura_fisica", "estrutura_fisica"),
    ("publicos_2025", "publicos_2025"),
    ("tematicas_2025", "tematicas_2025"),
    ("recursos_tecnologias", "recursos_tecnologias"),
    ("eixos_prioritarios_2026", "eixos_prioritarios_2026"),
    ("composicao_docente_2025", "composicao_docente"),
    ("instrumentos_gestao_docente", "instrumentos_gestao_docente"),
    ("instituicoes_cooperacao", "instituicoes_cooperacao"),
    ("modalidades_cooperacao", "modalidades_cooperacao"),
]

mult_dict = {c[1]: [] for c in campos_mult}
for idx, row in u.iterrows():
    id_resp = row["id_resposta"]
    sub_m = multiplas[multiplas.id_resposta == id_resp]
    for campo_orig, campo_dest in campos_mult:
        cols = [c for c in sub_m.columns if c.startswith(f"{campo_orig}::")]
        itens = [c.split("::", 1)[1] for c in cols if sub_m[c].values[0] == 1]
        mult_dict[campo_dest].append("; ".join(itens))

for _, campo_dest in campos_mult:
    u[campo_dest] = mult_dict[campo_dest]

# Montar base de unidades públicas limpa
unidades_publico = pd.DataFrame({
    "id_unidade": u["id_resposta"],
    "escola_unidade": u["escola_unidade"].fillna("Unidade de Formação"),
    "orgao": u["orgao_vinculado"].fillna(u["orgao_sigla"]),
    "sigla_orgao": u["orgao_sigla"],
    "uf": u["uf_sede_proxy"],
    "ramo": u["segmento"],
    "natureza": u["natureza"],
    "ano_criacao": u["ano_criacao_num"].apply(lambda v: int(v) if pd.notna(v) and v > 1900 else None),
    "site_escola": u["site_escola"].fillna(""),
    # Governança
    "planejamento": u["planejamento"],
    "plan_A": u["plan_A"],
    "plan_B": u["plan_B"],
    "dotacao": u["dotacao"],
    "orcamento_faixa": u["orcamento"],
    "instrumentos_governanca": u["instrumentos_governanca"],
    "fontes_financiamento": u["fontes_financiamento"],
    # Estrutura e Pessoal
    "estrutura_fisica": u["estrutura_fisica"],
    "efetivos_faixa": u["efetivos"],
    "comissionados_faixa": u["comissionados"],
    "magistrados_gestao_faixa": u["magistrados_gestao"],
    # Educação Digital
    "ava": u["ava"],
    "moodle": u["moodle"],
    "capacidade_ead": u["capacidade_ead"],
    "recursos_tecnologias": u["recursos_tecnologias"],
    # Formadores
    "cadastro_formadores": u["cadastro_formadores"],
    "formacao_formadores": u["formacao_formadores"],
    "composicao_docente": u["composicao_docente"],
    "instrumentos_gestao_docente": u["instrumentos_gestao_docente"],
    # Avaliação
    "n1_reacao": u["n1"],
    "n2_aprendizagem": u["n2"],
    "n3_transferencia": u["n3"],
    "n4_impacto": u["n4"],
    "egressos": u["egressos"],
    "relacao_cursos": u["relacao_cursos"],
    # Agenda
    "publicos_2025": u["publicos_2025"],
    "tematicas_2025": u["tematicas_2025"],
    "eixos_prioritarios_2026": u["eixos_prioritarios_2026"],
    "plano_2026": u["plano_2026"],
    # Cooperação
    "parcerias": u["parcerias"],
    "interesse_enaju": u["interesse"],
    "instituicoes_cooperacao": u["instituicoes_cooperacao"],
    "modalidades_cooperacao": u["modalidades_cooperacao"],
})

# Ordenar por Órgão e Unidade
unidades_publico = unidades_publico.sort_values(["ramo", "uf", "sigla_orgao"]).reset_index(drop=True)

# 3. Indicadores Nacionais e por Ramo
ind_nacionais = cortes[cortes.segmento == "Nacional"].copy().reset_index(drop=True)
ind_por_ramo = cortes[cortes.segmento != "Nacional"].copy().reset_index(drop=True)

# 4. Indicadores por UF
ind_uf = territorio.copy().reset_index(drop=True)

# 5. Dicionário de Dados Públicos
dicionario_linhas = [
    {"campo": "id_unidade", "tipo": "Texto", "descricao": "Identificador anônimo único da unidade de formação respondente (R001 a R110).", "valores_possiveis": "R001–R110", "origem": "Sistema"},
    {"campo": "escola_unidade", "tipo": "Texto", "descricao": "Denominação oficial da Escola Judicial ou Unidade de Formação.", "valores_possiveis": "Texto autodeclarado", "origem": "Q1"},
    {"campo": "orgao", "tipo": "Texto", "descricao": "Nome do Tribunal ou Conselho vinculado.", "valores_possiveis": "Texto autodeclarado", "origem": "Q2"},
    {"campo": "sigla_orgao", "tipo": "Texto", "descricao": "Sigla oficial do órgão judicial (ex.: TRT5, TJSP, STJ).", "valores_possiveis": "Siglas do Poder Judiciário", "origem": "C01"},
    {"campo": "uf", "tipo": "Texto", "descricao": "Unidade Federativa da sede institucional inferida da sigla (proxy cartográfico).", "valores_possiveis": "27 UFs brasileiras", "origem": "Proxy cartográfico"},
    {"campo": "ramo", "tipo": "Texto", "descricao": "Ramo do Poder Judiciário (segmento analítico homologado). TJDFT alocado na Justiça Estadual.", "valores_possiveis": "Eleitoral, Estadual, Trabalho, Federal, Militar, Superior/Conselho", "origem": "Q8 / C02"},
    {"campo": "natureza", "tipo": "Texto", "descricao": "Natureza institucional da unidade de formação.", "valores_possiveis": "Escola formalmente instituída; Setor de capacitação (gestão de pessoas); Centro/núcleo sem natureza de escola", "origem": "Q9 / C01"},
    {"campo": "ano_criacao", "tipo": "Numérico", "descricao": "Ano formal de criação ou instalação da unidade.", "valores_possiveis": "1900–2026", "origem": "Q10"},
    {"campo": "site_escola", "tipo": "Texto", "descricao": "Endereço eletrônico (URL) institucional da unidade ou do tribunal.", "valores_possiveis": "URL", "origem": "Q3"},
    {"campo": "planejamento", "tipo": "Texto", "descricao": "Situação do planejamento estratégico formalizado da unidade.", "valores_possiveis": "Plano próprio vigente e formalizado; Plano próprio desatualizado/vencido; Em elaboração; Não possui; Adota o planejamento estratégico do tribunal; Apenas plano anual (PAC/PAT); Afirmativa em texto livre, sem especificação", "origem": "Q11 / C01"},
    {"campo": "plan_A", "tipo": "Binário (0/1)", "descricao": "Indicador A: Unidade possui plano próprio vigente e formalizado.", "valores_possiveis": "0, 1", "origem": "C02"},
    {"campo": "plan_B", "tipo": "Binário (0/1)", "descricao": "Indicador B: Unidade possui qualquer referência estratégica formal (próprio vigente, desatualizado, em elaboração ou do tribunal).", "valores_possiveis": "0, 1", "origem": "C02"},
    {"campo": "dotacao", "tipo": "Texto", "descricao": "Arranjo orçamentário da unidade.", "valores_possiveis": "Rubrica orçamentária própria; Custeada por rubrica geral do tribunal; Rubrica específica de capacitação gerida pelo tribunal", "origem": "Q13 / C01"},
    {"campo": "orcamento_faixa", "tipo": "Texto", "descricao": "Faixa de orçamento executado autodeclarado para o exercício 2025.", "valores_possiveis": "Até R$ 250 mil; R$ 250 mil a R$ 1 mi; R$ 1 mi a R$ 5 mi; Acima de R$ 5 mi; Sem informação consolidada", "origem": "Q14 / C01"},
    {"campo": "instrumentos_governanca", "tipo": "Lista múltipla", "descricao": "Instrumentos normativos e colegiados formais vigentes.", "valores_possiveis": "Plano anual de capacitação (PAC); Ato normativo / Regimento interno; Projeto pedagógico institucional (PPI); Conselho ou colegiado formal", "origem": "Q12"},
    {"campo": "estrutura_fisica", "tipo": "Lista múltipla", "descricao": "Espaços físicos dedicados ou disponíveis para as atividades formativas.", "valores_possiveis": "Sede / espaço próprio; Salas de aula; Auditório; Laboratório; Biblioteca; Estúdio audiovisual/EaD; Não dispõe de espaço dedicado", "origem": "Q15"},
    {"campo": "efetivos_faixa", "tipo": "Texto ordinal", "descricao": "Quadro de servidores efetivos lotados na unidade.", "valores_possiveis": "Nenhum; 1 a 3; 4 a 10; Mais de 10", "origem": "Q16"},
    {"campo": "comissionados_faixa", "tipo": "Texto ordinal", "descricao": "Quadro de ocupantes de cargos em comissão/funções de confiança.", "valores_possiveis": "Nenhum; 1 a 3; 4 a 10; Mais de 10; (sem resposta)", "origem": "Q17"},
    {"campo": "magistrados_gestao_faixa", "tipo": "Texto ordinal", "descricao": "Quadro de magistrados dedicados à gestão educacional.", "valores_possiveis": "Nenhum; 1 a 3; 4 a 10; Mais de 10; (sem resposta)", "origem": "Q18"},
    {"campo": "ava", "tipo": "Texto", "descricao": "Disponibilidade de Ambiente Virtual de Aprendizagem.", "valores_possiveis": "AVA próprio; AVA compartilhado com o tribunal; AVA de outra instituição; Sem AVA", "origem": "Q26 / C01"},
    {"campo": "moodle", "tipo": "Binário (0/1)", "descricao": "Indica menção ao software livre Moodle como plataforma AVA.", "valores_possiveis": "0, 1", "origem": "Q27 / C01"},
    {"campo": "capacidade_ead", "tipo": "Texto", "descricao": "Capacidade institucional para produção e gestão de cursos EaD.", "valores_possiveis": "Equipe multidisciplinar dedicada; Produção parcial com apoio de outras áreas; Não há capacidade própria de produção", "origem": "Q29"},
    {"campo": "cadastro_formadores", "tipo": "Texto", "descricao": "Possui cadastro ou banco de talentos de docentes/formadores atualizado.", "valores_possiveis": "Sim; Não", "origem": "Q33"},
    {"campo": "formacao_formadores", "tipo": "Texto", "descricao": "Iniciativas de formação continuada para docentes e formadores.", "valores_possiveis": "Programa permanente com certificação; Ações pontuais; Não desenvolve; Participação em eventos externos; Não se aplica", "origem": "Q35 / C01"},
    {"campo": "n1_reacao", "tipo": "Texto ordinal", "descricao": "Frequência de aplicação da avaliação de nível 1 (Reação).", "valores_possiveis": "Na maioria das ações; Em parte das ações; Não aplica", "origem": "Q37"},
    {"campo": "n2_aprendizagem", "tipo": "Texto ordinal", "descricao": "Frequência de aplicação da avaliação de nível 2 (Aprendizagem).", "valores_possiveis": "Na maioria das ações; Em parte das ações; Não aplica", "origem": "Q37"},
    {"campo": "n3_transferencia", "tipo": "Texto ordinal", "descricao": "Frequência de aplicação da avaliação de nível 3 (Transferência/Comportamento no trabalho).", "valores_possiveis": "Na maioria das ações; Em parte das ações; Não aplica", "origem": "Q37"},
    {"campo": "n4_impacto", "tipo": "Texto ordinal", "descricao": "Frequência de aplicação da avaliação de nível 4 (Impacto/Resultados organizacionais).", "valores_possiveis": "Na maioria das ações; Em parte das ações; Não aplica", "origem": "Q37"},
    {"campo": "egressos", "tipo": "Texto", "descricao": "Realização de pesquisas de acompanhamento e impacto com egressos.", "valores_possiveis": "Sim, de forma sistemática; Sim, de forma pontual; Não realiza", "origem": "Q38"},
    {"campo": "parcerias", "tipo": "Texto", "descricao": "Manutenção de parcerias institucionais e acordos de cooperação.", "valores_possiveis": "Sim, com convênios/acordos vigentes; Sim, com parcerias informais; Não mantém parcerias", "origem": "Q40"},
    {"campo": "interesse_enaju", "tipo": "Texto", "descricao": "Interesse da unidade em integrar ações formativas em rede com a ENAJU/CNJ.", "valores_possiveis": "Alto; Moderado; Baixo", "origem": "Q43 / C01"}
]
dicionario_df = pd.DataFrame(dicionario_linhas)

# 6. Gravar CSVs em data_public e public/data
unidades_publico.to_csv(DATA_PUBLIC_DIR / "diagnostico_unidades_publico.csv", index=False, encoding="utf-8-sig")
unidades_publico.to_csv(PUBLIC_DATA_DIR / "diagnostico_unidades_publico.csv", index=False, encoding="utf-8-sig")

ind_nacionais.to_csv(DATA_PUBLIC_DIR / "indicadores_nacionais.csv", index=False, encoding="utf-8-sig")
ind_nacionais.to_csv(PUBLIC_DATA_DIR / "indicadores_nacionais.csv", index=False, encoding="utf-8-sig")

ind_por_ramo.to_csv(DATA_PUBLIC_DIR / "indicadores_por_ramo.csv", index=False, encoding="utf-8-sig")
ind_por_ramo.to_csv(PUBLIC_DATA_DIR / "indicadores_por_ramo.csv", index=False, encoding="utf-8-sig")

ind_uf.to_csv(DATA_PUBLIC_DIR / "indicadores_por_uf.csv", index=False, encoding="utf-8-sig")
ind_uf.to_csv(PUBLIC_DATA_DIR / "indicadores_por_uf.csv", index=False, encoding="utf-8-sig")

cortes.to_csv(DATA_PUBLIC_DIR / "indicadores_painel_completo.csv", index=False, encoding="utf-8-sig")
cortes.to_csv(PUBLIC_DATA_DIR / "indicadores_painel_completo.csv", index=False, encoding="utf-8-sig")

dicionario_df.to_csv(DATA_PUBLIC_DIR / "dicionario_dados_publicos.csv", index=False, encoding="utf-8-sig")
dicionario_df.to_csv(PUBLIC_DATA_DIR / "dicionario_dados_publicos.csv", index=False, encoding="utf-8-sig")

# 7. Gravar JSONs estruturados
unidades_json = unidades_publico.to_dict(orient="records")
with open(DATA_PUBLIC_DIR / "diagnostico_unidades_publico.json", "w", encoding="utf-8") as f:
    json.dump(unidades_json, f, ensure_ascii=False, indent=2)
with open(PUBLIC_DATA_DIR / "diagnostico_unidades_publico.json", "w", encoding="utf-8") as f:
    json.dump(unidades_json, f, ensure_ascii=False, indent=2)

cortes_json = cortes.to_dict(orient="records")
with open(DATA_PUBLIC_DIR / "indicadores_painel_completo.json", "w", encoding="utf-8") as f:
    json.dump(cortes_json, f, ensure_ascii=False, indent=2)
with open(PUBLIC_DATA_DIR / "indicadores_painel_completo.json", "w", encoding="utf-8") as f:
    json.dump(cortes_json, f, ensure_ascii=False, indent=2)

territorio_json = ind_uf.to_dict(orient="records")
with open(DATA_PUBLIC_DIR / "territorio.json", "w", encoding="utf-8") as f:
    json.dump(territorio_json, f, ensure_ascii=False, indent=2)
with open(PUBLIC_DATA_DIR / "territorio.json", "w", encoding="utf-8") as f:
    json.dump(territorio_json, f, ensure_ascii=False, indent=2)

# 8. Criar base de Geometria e Coordenadas do Brasil para o mapa interativo
# Centróides exatos das 27 UFs homologados em gerar_figuras.py
coords_ufs = {
    "AC": {"nome": "Acre", "lat": -9.0, "lon": -70.5, "regiao": "Norte"},
    "AL": {"nome": "Alagoas", "lat": -9.6, "lon": -36.6, "regiao": "Nordeste"},
    "AP": {"nome": "Amapá", "lat": 1.4, "lon": -51.8, "regiao": "Norte"},
    "AM": {"nome": "Amazonas", "lat": -4.0, "lon": -63.0, "regiao": "Norte"},
    "BA": {"nome": "Bahia", "lat": -12.5, "lon": -41.7, "regiao": "Nordeste"},
    "CE": {"nome": "Ceará", "lat": -5.2, "lon": -39.5, "regiao": "Nordeste"},
    "DF": {"nome": "Distrito Federal", "lat": -15.8, "lon": -47.9, "regiao": "Centro-Oeste"},
    "ES": {"nome": "Espírito Santo", "lat": -19.6, "lon": -40.3, "regiao": "Sudeste"},
    "GO": {"nome": "Goiás", "lat": -16.3, "lon": -49.4, "regiao": "Centro-Oeste"},
    "MA": {"nome": "Maranhão", "lat": -5.0, "lon": -45.0, "regiao": "Nordeste"},
    "MG": {"nome": "Minas Gerais", "lat": -18.5, "lon": -44.5, "regiao": "Sudeste"},
    "MS": {"nome": "Mato Grosso do Sul", "lat": -20.5, "lon": -54.5, "regiao": "Centro-Oeste"},
    "MT": {"nome": "Mato Grosso", "lat": -13.0, "lon": -56.0, "regiao": "Centro-Oeste"},
    "PA": {"nome": "Pará", "lat": -4.0, "lon": -52.0, "regiao": "Norte"},
    "PB": {"nome": "Paraíba", "lat": -7.1, "lon": -36.7, "regiao": "Nordeste"},
    "PE": {"nome": "Pernambuco", "lat": -8.3, "lon": -37.8, "regiao": "Nordeste"},
    "PI": {"nome": "Piauí", "lat": -7.0, "lon": -42.8, "regiao": "Nordeste"},
    "PR": {"nome": "Paraná", "lat": -24.5, "lon": -51.5, "regiao": "Sul"},
    "RJ": {"nome": "Rio de Janeiro", "lat": -22.3, "lon": -43.2, "regiao": "Sudeste"},
    "RN": {"nome": "Rio Grande do Norte", "lat": -5.7, "lon": -36.6, "regiao": "Nordeste"},
    "RO": {"nome": "Rondônia", "lat": -11.0, "lon": -63.0, "regiao": "Norte"},
    "RR": {"nome": "Roraima", "lat": 2.0, "lon": -61.3, "regiao": "Norte"},
    "RS": {"nome": "Rio Grande do Sul", "lat": -30.0, "lon": -51.0, "regiao": "Sul"},
    "SC": {"nome": "Santa Catarina", "lat": -27.2, "lon": -49.5, "regiao": "Sul"},
    "SE": {"nome": "Sergipe", "lat": -10.7, "lon": -37.3, "regiao": "Nordeste"},
    "SP": {"nome": "São Paulo", "lat": -22.4, "lon": -48.5, "regiao": "Sudeste"},
    "TO": {"nome": "Tocantins", "lat": -10.2, "lon": -48.3, "regiao": "Norte"},
}

# Consolidar dados por UF com ramos e unidades
geo_ufs = []
for uf_sigla, info in coords_ufs.items():
    sub_uf = unidades_publico[unidades_publico.uf == uf_sigla]
    n_unid = len(sub_uf)
    n_org = sub_uf.sigla_orgao.nunique()
    ramos = list(sub_uf.ramo.unique())
    escolas_formais = int((sub_uf.natureza == "Escola formalmente instituída").sum())
    setores = int((sub_uf.natureza == "Setor de capacitação (gestão de pessoas)").sum())
    centros = int((sub_uf.natureza == "Centro/núcleo sem natureza de escola").sum())
    unidades_lista = [
        {"id": r["id_unidade"], "escola": r["escola_unidade"], "orgao": r["orgao"], "sigla": r["sigla_orgao"], "ramo": r["ramo"], "natureza": r["natureza"]}
        for _, r in sub_uf.iterrows()
    ]
    geo_ufs.append({
        "uf": uf_sigla,
        "nome": info["nome"],
        "lat": info["lat"],
        "lon": info["lon"],
        "regiao": info["regiao"],
        "n_unidades": n_unid,
        "n_orgaos": n_org,
        "ramos": ramos,
        "escolas_formais": escolas_formais,
        "setores": setores,
        "centros": centros,
        "unidades": unidades_lista
    })

with open(DATA_PUBLIC_DIR / "geo_brasil.json", "w", encoding="utf-8") as f:
    json.dump(geo_ufs, f, ensure_ascii=False, indent=2)
with open(PUBLIC_DATA_DIR / "geo_brasil.json", "w", encoding="utf-8") as f:
    json.dump(geo_ufs, f, ensure_ascii=False, indent=2)

# 9. Calcular Hashes SHA-256 e gerar metadata.json
def calcular_sha256(arquivo: Path) -> str:
    h = hashlib.sha256()
    with open(arquivo, "rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()

metadata = {
    "titulo": "Diagnóstico Nacional das Unidades de Formação do Poder Judiciário — Base de Dados Pública",
    "subtitulo": "Camada pública auditável de dados e indicadores",
    "instituicao": "Conselho Nacional de Justiça (CNJ) · Escola Nacional do Judiciário (ENAJU)",
    "versao": "1.0.0",
    "data_atualizacao": datetime.now().strftime("%d/%m/%Y %H:%M"),
    "periodo_coleta": "2025/2026",
    "universo": {
        "n_unidades": len(unidades_publico),
        "n_orgaos": int(unidades_publico.sigla_orgao.nunique()),
        "n_tribunais_escopo": 91,
        "n_tribunais_representados": 90,
        "n_ufs": len(coords_ufs),
        "n_indicadores_cortes": len(cortes),
    },
    "arquivos_publicos": {
        "diagnostico_unidades_publico.csv": calcular_sha256(DATA_PUBLIC_DIR / "diagnostico_unidades_publico.csv"),
        "indicadores_nacionais.csv": calcular_sha256(DATA_PUBLIC_DIR / "indicadores_nacionais.csv"),
        "indicadores_por_ramo.csv": calcular_sha256(DATA_PUBLIC_DIR / "indicadores_por_ramo.csv"),
        "indicadores_por_uf.csv": calcular_sha256(DATA_PUBLIC_DIR / "indicadores_por_uf.csv"),
        "indicadores_painel_completo.csv": calcular_sha256(DATA_PUBLIC_DIR / "indicadores_painel_completo.csv"),
        "dicionario_dados_publicos.csv": calcular_sha256(DATA_PUBLIC_DIR / "dicionario_dados_publicos.csv"),
    },
    "regras_aplicadas": [
        "R01.1 — Supressão de percentuais em recortes com N <= 10 (apresentação exclusiva em números absolutos n de N)",
        "C02 — TJDFT agregado à Justiça Estadual nos cortes comparativos por ramo",
        "C02 — STJ classificado em Tribunais Superiores e Conselhos",
        "C02 — Indicador A (47,3% plano próprio vigente) e Indicador B (68,2% referência existente) não conflacionados",
        "LGPD — Exclusão total de dados de contato, emails, telefones, assinaturas e nomes de respondentes",
        "Bloqueio — Exclusão de anexos documentais de 2025 e perguntas qualitativas não homologadas (Q44)"
    ],
    "status": "dados homologados prontos para publicação"
}

with open(DATA_PUBLIC_DIR / "metadata.json", "w", encoding="utf-8") as f:
    json.dump(metadata, f, ensure_ascii=False, indent=2)
with open(PUBLIC_DATA_DIR / "metadata.json", "w", encoding="utf-8") as f:
    json.dump(metadata, f, ensure_ascii=False, indent=2)

# Também manter os fatos escalares e apelidos do relatório em public/data/fatos.json para visualizações rápidas
with open(PUBLIC_DATA_DIR / "fatos.json", "w", encoding="utf-8") as f:
    json.dump(indicadores_json, f, ensure_ascii=False, indent=2)

print(f"Sucesso! Gerados:")
print(f" - Unidades públicas: {len(unidades_publico)} registros, {unidades_publico.sigla_orgao.nunique()} órgãos")
print(f" - Indicadores nacionais: {len(ind_nacionais)} linhas")
print(f" - Indicadores por ramo: {len(ind_por_ramo)} linhas")
print(f" - Indicadores por UF: {len(ind_uf)} linhas")
print(f" - Dicionário de dados: {len(dicionario_df)} variáveis")
print(f" - Coordenadas e agregações de 27 UFs em geo_brasil.json")
