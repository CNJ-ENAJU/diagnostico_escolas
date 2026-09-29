# Auditoria de Fontes de Dados do Workspace

> **Diagnóstico Nacional das Unidades de Formação do Poder Judiciário**  
> **Conselho Nacional de Justiça (CNJ) · Escola Nacional do Judiciário (ENAJU)**  
> **Data da Auditoria:** 29 de setembro de 2026  
> **Auditor Responsável:** Agente Antigravity (Advanced Agentic Coding)

---

## 1. Objetivo da Auditoria

Em cumprimento estrito às diretrizes da Missão do Painel Público (Seções 1, 2, 3 e 4):
1. **Regra Fundamental de Consistência:** O painel deve consumir exatamente a mesma camada analítica que sustenta o relatório oficial (`BASE TRATADA` → `INDICADORES HOMOLOGADOS` → `CAMADA PÚBLICA DE DADOS` → `RELATÓRIO + PAINEL`).
2. **Proteção Integral de Dados Pessoais (LGPD):** Nenhum dado pessoal (nome de respondente, e-mail institucional, telefone, assinatura, observações pessoais) pode ser transferido para o front-end ou exposto em arquivos públicos.
3. **Bloqueio de Dados Não Homologados:** Bloquear taxativamente qualquer arquivo derivado das famílias de anexos documentais ainda não homologadas (`27A`, `31A`, `35A`, `39`, `D01`, `D02`, respostas abertas `Q44`, totais de execução de 2025).

---

## 2. Inventário e Classificação de Todas as Fontes Localizadas

| Fonte (Caminho Relativo) | Função | Pode ser pública? | Contém PII? | Uso no Painel |
|---|---|---|---|---|
| `00_Organização Inicial/01_base_respostas_organizada.csv` | Microdados brutos das 110 respostas ao formulário Google Forms (58 colunas). | **NÃO** | **SIM** (nome do respondente, e-mail, telefone, cargo, assinatura) | **Fonte primária de extração controlada**: lida exclusivamente pelo script de build (`build_public_data.py`) com `usecols` explícitas de dados institucionais públicos (natureza, órgão, escola, site, faixas de estrutura/pessoal). O front-end **nunca** acessa este arquivo. |
| `00_Organização Inicial/01_base_respostas_organizada.xlsx` | Planilha com abas derivadas do formulário e dados preliminares de anexos. | **NÃO** | **SIM** | **PROIBIDO**. Vetado pelo manifesto de fontes. |
| `00_Organização Inicial/02_respostas_multiplas.csv` | Base de opções de múltipla escolha em formato longo (`id_resposta`, `campo`, `item`). | **SIM** (sanitizada) | **NÃO** | Insumo para contagens de múltiplas opções pelo script de pipeline. |
| `00_Organização Inicial/03_dicionario_variaveis.csv` | Dicionário descritivo das colunas originais do questionário. | **SIM** (filtrado) | **NÃO** | Insumo para a construção do `dicionario_dados_publicos.csv` (excluindo os campos de contato e pessoais). |
| `00_Organização Inicial/C01_apoio/C01_base_recodificada.csv` | Base de 110 respostas com recodificações estabilizadas na etapa C01. | **SIM** | **NÃO** | Insumo analítico para variáveis recodificadas (natureza, planejamento, dotação, orçamento, AVA, formadores, avaliação). |
| `00_Organização Inicial/C01_apoio/C01_frequencias_nacionais.csv` | Frequências marginais univariadas nacionais de C01. | **SIM** | **NÃO** | Validação automatizada de integridade das opções e frequências. |
| `00_Organização Inicial/C01_apoio/C01_unidades_por_orgao.csv` | Mapeamento de órgãos (N=92) e unidades por órgão (18 órgãos com 2 unidades). | **SIM** | **NÃO** | Estatísticas institucionais da página inicial e filtros de órgãos. |
| `00_Organização Inicial/C01_apoio/C01_matriz_variaveis.csv` | Classificação metodológica de variáveis com status de confiabilidade. | **SIM** | **NÃO** | Metadados e documentação do dicionário público. |
| `00_Organização Inicial/C01_apoio/C01_codebook_desafios.csv` | Codebook da análise qualitativa da Q44 (desafios). | **NÃO** | **NÃO** | **BLOQUEADO**. Aguarda homologação por segundo codificador cego independente. |
| `00_Organização Inicial/C01_apoio/C01_codificacao_desafios.csv` | Frequências temáticas provisórias da Q44. | **NÃO** | **NÃO** | **BLOQUEADO** nesta versão do painel. |
| `00_Organização Inicial/C02_matriz_achados_estabilizada.csv` | Matriz oficial dos 33 achados analíticos estabilizados e homologados em C02. | **SIM** | **NÃO** | Base textual e de evidências para a narrativa dos cards da "Visão Geral". |
| `00_Organização Inicial/C02_sensibilidade_R110.csv` | Teste de sensibilidade estatística da inclusão da resposta R110 (TRE-BA). | **SIM** | **NÃO** | Disponível para consulta na página de Metodologia. |
| `00_Organização Inicial/C02_apoio/C02_indicadores_por_segmento.csv` | Indicadores homologados por segmento em C02 (Estadual N=29 com TJDFT). | **SIM** | **NÃO** | Base de verificação e testes automatizados de consistência. |
| `00_Organização Inicial/C02_apoio/C02_Q44_crosswalk_confidencial.csv` | Chave cruzada de identificação confidencial de respondentes da Q44. | **NÃO** | **SIM** (chave de vinculação) | **PROIBIDO / VETADO**. Acesso estritamente restrito. |
| Famílias `27A`, `31A`, `35A`, `39`, `D01`, `D02` | Planilhas, relatórios e microdados de eventos de capacitação de 2025. | **NÃO** | **Possível** | **BLOQUEADO**. Vetado expressamente pela Regra 4 e Regra 62. Não homologados institucionalmente. |
| `04_Relatorio/outputs/intermediarios/base_relatorio.csv` | Base intermediária analítica (110 linhas × 50 colunas), com códigos anônimos `O01`–`O92`. | **SIM** | **NÃO** | Base fundamental de sustentação dos filtros e recortes no painel. |
| `04_Relatorio/outputs/intermediarios/cortes.csv` | 1.295 linhas de indicadores consolidados (variável × categoria × segmento). | **SIM** | **NÃO** | **Camada analítica homologada**: idêntica à do relatório oficial para geração de todos os gráficos e tabelas. |
| `04_Relatorio/outputs/intermediarios/indicadores.json` | Dicionário com todos os fatos escalares, apelidos e índices do relatório. | **SIM** | **NÃO** | Validação de consistência cruzada entre relatório e painel. |
| `04_Relatorio/outputs/intermediarios/territorio.csv` | Dados agregados de unidades por UF de sede proxy e ramo (27 UFs). | **SIM** | **NÃO** | Alimentação do mapa do Brasil e gráficos de distribuição territorial. |
| `04_Relatorio/outputs/intermediarios/manifest_dados.json` | Manifesto com hashes criptográficos SHA-256 e carimbo de tempo da preparação. | **SIM** | **NÃO** | Rastreabilidade e geração do `metadata.json` do painel. |
| `04_Relatorio/dados/fontes.yml` | Regras de governança de fontes permitidas e proibidas do projeto. | **SIM** | **NÃO** | Documentação técnica da rastreabilidade. |
| `05_Histórico/R01_1_checkpoint.md` | Marco homologado R01.1 com a regra de proteção de pequenos grupos (N ≤ 10). | **SIM** | **NÃO** | Base normativa da política de salvaguarda de grupos pequenos. |
| `05_Histórico/R01_2_*` | Análises exploratórias avançadas de R01.2 (perfis digitais, configurações avaliativas). | **SIM** | **NÃO** | Subsídio para visualizações temáticas opcionais homologadas. |

---

## 3. Deliberação de Segurança e Rastreabilidade

Após varredura completa das 42 tabelas CSV e arquivos de metadados do repositório:
1. **Identificação Clara de PII:** Identificou-se que apenas os arquivos brutos da coleta inicial (`01_base_respostas_organizada.csv` e `CNJ - Diagnóstico Nacional das Escolas Judiciais - Ciclo 2025/2026.csv`) contêm dados pessoais (colunas 4 a 8 e 57).
2. **Camada Pública Segura:** A base analítica `04_Relatorio/outputs/intermediarios/base_relatorio.csv`, os cortes `cortes.csv` e a base `territorio.csv` estão **100% livres de PII**, contêm IDs anônimos (`R01`–`R110` e `O01`–`O92`) e utilizam categorias homologadas.
3. **Consulta de Unidades (Página "Escolas"):** Para atender à Seção 24 sem violar a privacidade, a tabela pública e o Drawer de perfil institucional consumirão apenas:
   - Identificação pública institucional (`orgao_vinculado`, `escola_unidade`, `sigla`, `site_oficial`, `uf_sede_proxy`, `segmento`, `natureza_rec`, `ano_criacao`);
   - Respostas categóricas declaradas pela unidade (Governança, Estrutura, AVA, Formadores, Avaliação, Cooperação);
   - **Excluindo categoricamente:** nome do respondente, e-mail institucional, telefone, cargo pessoal, assinatura e respostas a perguntas qualitativas não homologadas.
4. **Dados Proibidos Isolados:** Nenhum arquivo das famílias `27A`, `31A`, `35A`, `39`, `D01`, `D02` ou quantitativos de execução de 2025 integrará a camada pública `painel/data_public/`.

**Conclusão da Auditoria:** As fontes de dados públicas e privadas estão perfeitamente delimitadas, rastreadas e seguras. É seguro prosseguir para o Plano de Implementação e a construção da aplicação.
