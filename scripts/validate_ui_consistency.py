#!/usr/bin/env python3
"""Concilia os indicadores do painel e detecta regressões visuais/narrativas.

Não utiliza anexos, contatos de respondentes ou totais de execução de 2025.
Execução: python scripts/validate_ui_consistency.py
"""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UNIDADES = json.loads((ROOT / "data_public/diagnostico_unidades_publico.json").read_text(encoding="utf-8-sig"))
with (ROOT / "data_public/indicadores_nacionais.csv").open(encoding="utf-8-sig", newline="") as fh:
    NACIONAIS = list(csv.DictReader(fh))

assert len(UNIDADES) == 110, f"Esperadas 110 unidades, recebidas {len(UNIDADES)}"

KEY = {"interesse": "interesse_enaju"}
FIELDS = {
    "natureza", "planejamento", "dotacao", "ava", "capacidade_ead",
    "plano_2026", "cadastro_formadores", "formacao_formadores", "parcerias",
    "interesse", "instrumentos_governanca", "estrutura_fisica",
    "tematicas_2025", "recursos_tecnologias", "eixos_prioritarios_2026",
    "instrumentos_gestao_docente", "modalidades_cooperacao", "composicao_docente",
}

def tem_opcao(valor, categoria):
    return categoria in [p.strip() for p in str(valor or "").split(";")]

contagens = {}
for rec in NACIONAIS:
    variable, category = rec["variavel"], rec["categoria"]
    if rec["segmento"] != "Nacional":
        continue
    contagens[(variable, category)] = int(rec["n"])
    if variable not in FIELDS:
        continue
    field = KEY.get(variable, variable)
    observed = sum(tem_opcao(u.get(field), category) for u in UNIDADES)
    assert observed == int(rec["n"]), (variable, category, observed, rec["n"])

expected = [
    ("instrumentos_governanca", "Plano anual de capacitação (PAC) aprovado", 93),
    ("instrumentos_governanca", "Ato normativo / regimento interno próprio", 82),
    ("instrumentos_governanca", "Projeto pedagógico institucional / político-pedagógico", 57),
    ("ava_algum", "Dispõe de algum AVA", 101),
    ("moodle", "Cita o Moodle como plataforma de AVA", 97),
    ("capacidade_ead", "Equipe multidisciplinar dedicada, com designer instrucional, audiovisual e TI", 27),
    ("capacidade_ead", "Produção parcial, com apoio pontual de outras áreas", 49),
    ("estrutura_fisica", "Estúdio de gravação / produção audiovisual (EaD)", 26),
    ("recursos_tecnologias", "Salas virtuais de videoconferência", 91),
    ("formacao_formadores", "Programa permanente com certificação", 18),
    ("formacao_formadores", "Ações pontuais", 35),
    ("parcerias", "Sim, com convênios/acordos vigentes", 94),
    ("interesse_aberto", "Interesse alto ou moderado", 105),
    ("n1_aplica", "Nível 1 (reação) aplicado, em parte ou na maioria das ações", 103),
    ("n3_aplica", "Nível 3 (transferência) aplicado, em parte ou na maioria das ações", 36),
    ("eixos_prioritarios_2026", "Outro (texto livre)", 27),
]
for variable, category, number in expected:
    actual = contagens.get((variable, category))
    assert actual == number, (variable, category, actual, number)

def categories(file, variable):
    source = (ROOT / file).read_text(encoding="utf-8")
    found = re.search(r"const\s+" + re.escape(variable) + r"\s*=\s*\[(.*?)\];", source, re.S)
    assert found, f"Lista ausente: {file}::{variable}"
    return re.findall(r'^\s*"([^"]+)"\s*,?\s*$', found.group(1), re.M)

for file, variable, indicator in [
    ("src/pages/Agenda.tsx", "temas2025", "tematicas_2025"),
    ("src/pages/Agenda.tsx", "eixos2026", "eixos_prioritarios_2026"),
]:
    options = categories(file, variable)
    official = {row["categoria"] for row in NACIONAIS if row["variavel"] == indicator}
    assert len(options) == len(set(options)), f"Categorias duplicadas em {variable}"
    assert set(options) == official, f"Categorias faltantes ou artificiais em {variable}: {set(options) ^ official}"

legacy = {
    "src/pages/Overview.tsx": ["99,1%", "97,3%", "95,5%", "70,9%", "30,9%"],
    "src/pages/Digital.tsx": ["95,5%", "56,4%", "90,0%"],
    "src/pages/Faculty.tsx": ["70,9%", "30,9%", "46,4%"],
    "src/pages/Cooperation.tsx": ["99,1%", "64,5%", "88,2%"],
    "src/pages/Home.tsx": ["99,1%", "95,5%", "90,0%", "97,3%"],
}
for file, invalid in legacy.items():
    source = (ROOT / file).read_text(encoding="utf-8")
    for old in invalid:
        assert old not in source, f"Percentual legado fixo em {file}: {old}"

chart = (ROOT / "src/components/ChartCard.tsx").read_text(encoding="utf-8")
assert "itens.some(item => item.N < 10)" in chart, "Proteção de recortes pequenos não aplicada ao gráfico"

print(f"OK: {len(UNIDADES)} unidades; {len(FIELDS)} campos mapeados; "
      f"{sum(r['variavel'] in FIELDS and r['segmento'] == 'Nacional' for r in NACIONAIS)} "
      "categorias nacionais reconciliadas; Agenda/Q23/Q31 exatas; sem percentuais legados nos componentes testados.")

# Regressão cartográfica da segunda tela: 27 geometrias e reconciliação por UF.
from collections import Counter
UF_COUNTS = Counter(u["uf"] for u in UNIDADES)
GEOMETRIES = (ROOT / "src/data/brazilUfPaths.ts").read_text(encoding="utf-8")
GEOMETRY_UFS = re.findall(r'"uf":"([A-Z]{2})","path":"M', GEOMETRIES)
assert len(GEOMETRY_UFS) == 27, f"Esperadas 27 geometrias, obtidas {len(GEOMETRY_UFS)}"
assert set(GEOMETRY_UFS) == set(UF_COUNTS), "UF ausente ou excedente na cartografia"
assert sum(UF_COUNTS.values()) == 110, "Total territorial distinto de 110"
with (ROOT / "data_public/indicadores_por_uf.csv").open(encoding="utf-8-sig", newline="") as fh:
    UF_INDICATORS = list(csv.DictReader(fh))
for uf, total in UF_COUNTS.items():
    reg = [r for r in UF_INDICATORS if r["uf"] == uf]
    assert sum(int(r["n"]) for r in reg) == total, (uf, "soma dos ramos", total)
    assert all(int(r["N_uf"]) == total for r in reg), (uf, "denominador territorial")
map_source = (ROOT / "src/components/BrazilMap.tsx").read_text(encoding="utf-8")
network_source = (ROOT / "src/pages/NationalNetwork.tsx").read_text(encoding="utf-8")
assert "UF_PATHS.map(" in map_source and "projectBrazil" in map_source
assert "return { anchor, x, y, r" in map_source, "Linhas-guia sem âncora geográfica"
assert "RAMO_CURTO[ramo]" in map_source, "Legenda dos ramos não explícita"
assert "const maxUf" in map_source, "Escala das barras não acompanha o recorte"
assert "recorteIntegral" in network_source and "nOrgaos" in network_source
assert "Capítulo 3, seção 3.1" in network_source, "Referência territorial defasada"
print("OK: 27 UFs reais, 110 unidades, distribuição territorial por ramo e cartografia compatíveis.")


# Regressão de interação da Rede Nacional: mapa prioritário e popup detalhado.
MAP_UI = (ROOT / "src/components/BrazilMap.tsx").read_text(encoding="utf-8")
MAIN_CSS = (ROOT / "src/styles/main.css").read_text(encoding="utf-8")
for required in [
    'className="network-explorer"',
    'className="network-map-card"',
    'className="network-modal"',
    'Filtrar painel por',
    'Composição por ramo',
    'Unidades respondentes',
]:
    assert required in MAP_UI, f"Interação territorial ausente: {required}"
assert "grid-template-columns: minmax(0, 2.15fr)" in MAIN_CSS, "Mapa deixou de ocupar a maior área da tela"
assert ".network-modal-backdrop" in MAIN_CSS and "@media (max-width: 760px)" in MAIN_CSS
print("OK: layout 70/30 e popup detalhado da Rede Nacional presentes e responsivos.")
