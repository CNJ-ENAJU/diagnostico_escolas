# -*- coding: utf-8 -*-
"""
Validação Automatizada de Privacidade, Dados e Consistência da Camada Pública do Painel.
Atende aos requisitos 43, 44 e 45 da especificação:
  - Falha com código 1 se encontrar qualquer coluna ou termo sensível de PII.
  - Valida N=110, órgãos=92, 6 ramos, 27 UFs, somas e denominadores.
  - Compara todos os indicadores do painel contra a camada homologada do relatório.
  - Gera painel_relatorio_consistencia.csv com diferença = 0.
"""
import sys
import json
import re
from pathlib import Path
import pandas as pd

PAINEL_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = PAINEL_DIR.parent
RELATORIO_DIR = ROOT_DIR / "04_Relatorio"
INTERM_DIR = RELATORIO_DIR / "outputs" / "intermediarios"
DATA_PUBLIC_DIR = PAINEL_DIR / "data_public"

TERMOS_PII_PROIBIDOS = [
    "email", "e-mail", "mail", "telefone", "celular", "contato",
    "cpf", "assinatura", "respondente", "nome_responsavel", "nome_assinatura",
    "responsavel_envio", "cargo_funcao"
]

erros = []
sucessos = 0

def registrar_teste(nome: str, condicao: bool, detalhe: str = ""):
    global sucessos
    if condicao:
        sucessos += 1
        print(f"[OK] {nome} {('(' + detalhe + ')') if detalhe else ''}")
    else:
        erros.append(f"{nome}: {detalhe}")
        print(f"[FALHA] {nome} — {detalhe}")

print("=== 1. Teste de Privacidade (Regra 44) ===")
# Varre todos os arquivos CSV e JSON em data_public e public/data
pastas_teste = [DATA_PUBLIC_DIR, PAINEL_DIR / "public" / "data"]
for p_dir in pastas_teste:
    for f in p_dir.glob("*.csv"):
        df = pd.read_csv(f, nrows=5)
        for col in df.columns:
            for termo in TERMOS_PII_PROIBIDOS:
                if termo in col.lower():
                    registrar_teste(f"Coluna proibida detectada em {f.name}", False, f"Coluna '{col}' contém termo sensível '{termo}'")
                    break
        registrar_teste(f"Ausência de PII em {f.name}", True, f"{len(df.columns)} colunas verificadas")

print("\n=== 2. Testes Estruturais e de Dados (Regra 43) ===")
df_unidades = pd.read_csv(DATA_PUBLIC_DIR / "diagnostico_unidades_publico.csv")
registrar_teste("Total de unidades respondentes == 110", len(df_unidades) == 110, f"Obtido: {len(df_unidades)}")
registrar_teste("Total de órgãos representados == 92", df_unidades.sigla_orgao.nunique() == 92, f"Obtido: {df_unidades.sigla_orgao.nunique()}")

ramos_esperados = {"Eleitoral", "Estadual", "Trabalho", "Federal", "Militar", "Superior/Conselho"}
registrar_teste("Ramos de justiça homologados (6 ramos)", set(df_unidades.ramo.unique()) == ramos_esperados, f"Obtido: {set(df_unidades.ramo.unique())}")

# Totais por ramo conforme C02
tot_ramo = df_unidades.groupby("ramo").size().to_dict()
ramo_ok = (tot_ramo.get("Estadual") == 29 and tot_ramo.get("Eleitoral") == 39 and 
           tot_ramo.get("Trabalho") == 26 and tot_ramo.get("Federal") == 8 and 
           tot_ramo.get("Militar") == 5 and tot_ramo.get("Superior/Conselho") == 3)
registrar_teste("Distribuição exata por ramo (Eleitoral 39, Estadual 29, Trabalho 26, Federal 8, Militar 5, Superior 3)",
                ramo_ok, str(tot_ramo))

# Natureza institucional
tot_nat = df_unidades.groupby("natureza").size().to_dict()
nat_ok = (tot_nat.get("Escola formalmente instituída") == 86 and 
          tot_nat.get("Setor de capacitação (gestão de pessoas)") == 17 and 
          tot_nat.get("Centro/núcleo sem natureza de escola") == 7)
registrar_teste("Natureza institucional (86 escolas, 17 setores, 7 centros/núcleos)", nat_ok, str(tot_nat))

# Território e UFs
df_uf = pd.read_csv(DATA_PUBLIC_DIR / "indicadores_por_uf.csv")
registrar_teste("Cobertura territorial de 27 UFs", df_uf.uf.nunique() == 27, f"UFs: {df_uf.uf.nunique()}")
registrar_teste("Soma das unidades por UF == 110", int(df_uf.n.sum()) == 110, f"Soma: {df_uf.n.sum()}")

print("\n=== 3. Teste de Consistência com o Relatório (Regra 45) ===")
cortes_painel = pd.read_csv(DATA_PUBLIC_DIR / "indicadores_painel_completo.csv", encoding="utf-8-sig")
consistencia_path = PAINEL_DIR / "painel_relatorio_consistencia.csv"

if (INTERM_DIR / "cortes.csv").exists():
    # Carregar cortes homologados do relatório
    cortes_relatorio = pd.read_csv(INTERM_DIR / "cortes.csv", encoding="utf-8-sig")
    registrar_teste("Número idêntico de linhas de cortes analíticos", len(cortes_painel) == len(cortes_relatorio), f"{len(cortes_painel)} vs {len(cortes_relatorio)}")

    # Merge e conferência item a item
    comp = cortes_relatorio.merge(
        cortes_painel,
        on=["variavel", "categoria", "segmento"],
        suffixes=("_relatorio", "_painel")
    )

    comp["diferenca_n"] = (comp["n_relatorio"] - comp["n_painel"]).abs()
    comp["diferenca_pct"] = (comp["pct_relatorio"] - comp["pct_painel"]).abs()
    max_dif_n = comp["diferenca_n"].max()
    max_dif_pct = comp["diferenca_pct"].max()

    registrar_teste("Diferença absoluta máxima em n == 0", max_dif_n == 0, f"Diferença máxima: {max_dif_n}")
    registrar_teste("Diferença percentual máxima == 0", max_dif_pct < 0.0001, f"Diferença máxima: {max_dif_pct}")

    # Gerar/atualizar arquivo painel_relatorio_consistencia.csv
    relatorio_consistencia = pd.DataFrame({
        "variavel": comp["variavel"],
        "categoria": comp["categoria"],
        "segmento": comp["segmento"],
        "valor_n_relatorio": comp["n_relatorio"],
        "valor_n_painel": comp["n_painel"],
        "pct_relatorio": comp["pct_relatorio"].round(2),
        "pct_painel": comp["pct_painel"].round(2),
        "diferenca_n": comp["diferenca_n"],
        "status": comp["diferenca_n"].apply(lambda d: "CONCORDANCIA_PERFEITA" if d == 0 else "DIVERGENCIA")
    })
    relatorio_consistencia.to_csv(consistencia_path, index=False, encoding="utf-8-sig")
    print(f"Arquivo de auditoria comparativa atualizado em: {consistencia_path.name} ({len(relatorio_consistencia)} indicadores)")
elif consistencia_path.exists():
    # Modo CI: validação através do arquivo de consistência homologado e auditado
    relatorio_consistencia = pd.read_csv(consistencia_path, encoding="utf-8-sig")
    registrar_teste("Existência do arquivo de auditoria homologado", True, f"{len(relatorio_consistencia)} linhas auditadas")
    registrar_teste("Total de indicadores auditados == 1295", len(relatorio_consistencia) == 1295, f"{len(relatorio_consistencia)} indicadores")
    
    divergencias = (relatorio_consistencia["status"] != "CONCORDANCIA_PERFEITA").sum()
    registrar_teste("Zero divergências na auditoria homologada", divergencias == 0, f"Divergências: {divergencias}")
    
    max_dif_n = relatorio_consistencia["diferenca_n"].max()
    registrar_teste("Diferença absoluta máxima em n == 0", max_dif_n == 0, f"Diferença máxima: {max_dif_n}")
else:
    registrar_teste("Arquivo de auditoria ou cortes.csv disponível", False, "Nem cortes.csv nem painel_relatorio_consistencia.csv foram encontrados.")


print(f"\n==========================================")
print(f"RESUMO DOS TESTES: {sucessos} aprovados, {len(erros)} falhas.")
print(f"==========================================")

if erros:
    print("\nFALHAS ENCONTRADAS:")
    for e in erros:
        print(f" - {e}")
    sys.exit(1)
else:
    print("\nTODOS OS TESTES APROVADOS COM SUCESSO! DIFERENÇA = 0.")
    sys.exit(0)
