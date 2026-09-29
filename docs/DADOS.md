# Catálogo e Dicionário da Camada Pública de Dados

> **Diagnóstico Nacional das Unidades de Formação do Poder Judiciário**  
> **Conselho Nacional de Justiça (CNJ) · Escola Nacional do Judiciário (ENAJU)**

---

## 1. Conjuntos de Dados Disponíveis

Todos os dados públicos do projeto estão disponíveis na pasta `data_public/` e são distribuídos em formatos abertos com codificação **UTF-8 com BOM** (compatibilidade direta com Microsoft Excel):

| Arquivo | Registros | Descrição |
|---|---|---|
| `diagnostico_unidades_publico.csv` | 110 | Microdados anonimizados por unidade respondente (identificação pública, governança, pessoal, AVA, formadores, avaliação e cooperação). |
| `indicadores_painel_completo.csv` | 1.295 | Matriz homologada completa de cortes: `variavel × categoria × segmento` com contagens $n$, denominadores $N$ e percentuais. |
| `indicadores_nacionais.csv` | 185 | Recorte consolidado em nível Brasil ($N = 110$). |
| `indicadores_por_ramo.csv` | 1.110 | Recorte por ramo de justiça (Eleitoral, Estadual, Trabalho, Federal, Militar, Superior/Conselho). |
| `indicadores_por_uf.csv` | 87 | Distribuição agregada por Unidade Federativa da sede institucional proxy e ramo. |
| `dicionario_dados_publicos.csv` | 31 | Metadados descritivos com tipo de dado, descrição conceitual, categorias e pergunta de origem no questionário. |
| `metadata.json` | - | Metadados de versão, contagens de validação e assinaturas criptográficas SHA-256. |

---

## 2. Rastreabilidade com o Questionário Oficial

* **Governança:** Q11 (planejamento), Q12 (instrumentos), Q13 (dotação), Q14 (orçamento).
* **Capacidades:** Q15 (estrutura física), Q16 (efetivos), Q17 (comissionados), Q18 (magistrados).
* **Digital:** Q26 (AVA), Q27 (Moodle), Q28 (recursos digitais), Q29 (capacidade EaD).
* **Formadores:** Q32 (docência), Q33 (cadastro), Q34 (gestão docente), Q35 (formação de formadores).
* **Avaliação:** Q37 (níveis 1 a 4 de Kirkpatrick), Q38 (egressos).
* **Agenda:** Q23 (temáticas 2025), Q31 (eixos 2026).
* **Cooperação:** Q40 (parcerias), Q42 (modalidades), Q43 (interesse na ENAJU).
