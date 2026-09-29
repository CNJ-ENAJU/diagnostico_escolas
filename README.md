# Painel do Diagnóstico Nacional das Unidades de Formação do Poder Judiciário

> **Conselho Nacional de Justiça (CNJ) · Escola Nacional do Judiciário (ENAJU)**  
> Resolução CNJ nº 643/2025 · Ciclo 2025/2026

Este painel interativo reflete com exatidão as análises, indicadores e dados apresentados no **Relatório Oficial** (`Diagnóstico das Escolas\04_Relatorio\_saida\relatorio.pdf`), consolidando os resultados das **110 unidades de formação** respondentes em **92 órgãos do Poder Judiciário**.

---

## 🚀 Como Acessar o Painel

O painel foi disponibilizado em duas modalidades complementares para máxima flexibilidade:

### Modalidade 1: Painel Web Interativo Autocontido (`index.html`) — *Recomendado*
* **Acesso imediato com 1 clique:** basta dar um duplo clique no arquivo [`abrir_painel.bat`](abrir_painel.bat) ou abrir diretamente o [`index.html`](index.html) em qualquer navegador web (Google Chrome, Microsoft Edge, Mozilla Firefox).
* **100% Offline e Seguro:** Não requer instalação de Python, servidor web ou conexão com a internet. Toda a biblioteca gráfica (`Chart.js`) e a base de dados (`dados/dados_painel.js`) estão embutidas localmente.
* **Downloads CSV Nativos:** Permite baixar qualquer visualização ou tabela exibida em tela em formato CSV (`UTF-8 com BOM`), pronto para abrir perfeitamente no Microsoft Excel sem desconfigurar acentuação.

### Modalidade 2: Aplicação Python Streamlit (`app.py`)
* Para executar via terminal ou ambiente de desenvolvimento:
  ```powershell
  cd "G:\Meu Drive\ENAJU\Diagnóstico das Escolas\06_Painel"
  python -m streamlit run app.py
  ```
  Ou simplesmente execute o atalho [`iniciar_streamlit.bat`](iniciar_streamlit.bat).

---

## 📊 Estrutura e Dimensões do Painel

O painel é estruturado em **10 abas temáticas**, refletindo a organização capitular do relatório:

1. **Visão Geral & Síntese:** Cartões com os principais números consolidados (N=110, 92 órgãos, 90 tribunais representados = 98,9%), os 6 Achados Centrais e o gráfico dos 12 Indicadores Estratégicos Nacionais.
2. **Rede & Governança (Caps. 4 e 5):** Natureza institucional (escolas formadoras vs setores de RH), Planejamento Estratégico (Indicador A de 47,3% vs Indicador B de 68,2%), instrumentos normativos (PAC, Regimento, PPI, Colegiado) e arranjo orçamentário.
3. **Capacidades Instaladas (Cap. 6):** Estrutura física disponível (salas, sede exclusiva, auditórios, estúdios EaD), quadro de pessoal por faixas (efetivos, comissionados, magistrados) e orçamento executado em 2025.
4. **Ecossistema Digital (Cap. 7):** Plataformas AVA (95,5% de presença; 90% Moodle), capacidade de produção de EaD (equipes multidisciplinares vs produção parcial) e recursos educacionais digitais.
5. **Corpo Docente & Formadores (Cap. 8):** Composição docente (magistrados, servidores, docentes externos), instrumentos formais de gestão docente (retribuição GECC, banco de talentos, avaliação) e programas de formação de formadores.
6. **Avaliação da Formação (Cap. 9):** A Escada de Kirkpatrick (N1 Reação 97,3% → N2 Aprendizagem 72,7% → N3 Transferência 40,9% → N4 Impacto 34,5%), pesquisa com egressos e coerência avaliativa.
7. **Agenda Formativa (Cap. 10):** Públicos-alvo atendidos em 2025, 17 áreas temáticas desenvolvidas e eixos prioritários para 2026 (destaque para Inteligência Artificial com 83,6%).
8. **Cooperação & ENAJU (Cap. 11):** Parcerias formais vigentes, modalidades de cooperação e o amplo interesse das unidades na articulação em rede nacional coordenada pela ENAJU (99,1% de abertura positiva).
9. **Comparador entre Ramos:** Seletor dinâmico para comparar lado a lado o comportamento de qualquer uma das 46 variáveis entre os 6 ramos de justiça.
10. **Central de Downloads de Dados (CSV):** Repositório com 11 conjuntos de dados oficiais prontos para download com um clique.

---

## 📥 Dados Abertos para Download (CSV)

Todos os arquivos CSV estão salvos na pasta [`dados/`](dados/) com codificação `UTF-8 com BOM` (compatibilidade nativa com Excel):

| Arquivo CSV | Registros | Descrição |
|---|---|---|
| [`indicadores_painel_completo.csv`](dados/indicadores_painel_completo.csv) | 1.296 linhas | Base completa com todas as variáveis, categorias, ramos (n, N e %). |
| [`base_respostas_anonimizada.csv`](dados/base_respostas_anonimizada.csv) | 110 linhas | Microdados anonimizados por unidade respondente (códigos O01-O92). |
| [`08_indicadores_sintese_nacionais.csv`](dados/08_indicadores_sintese_nacionais.csv) | 185 linhas | Recorte consolidado nacional de todos os indicadores (N=110). |
| [`01_rede_e_governanca.csv`](dados/01_rede_e_governanca.csv) | 175 linhas | Dados de governança, planejamento, PAC, regimento e dotação. |
| [`02_capacidades_instaladas.csv`](dados/02_capacidades_instaladas.csv) | 168 linhas | Estrutura física, quadro de pessoal e faixas orçamentárias. |
| [`03_ecossistema_digital.csv`](dados/03_ecossistema_digital.csv) | 210 linhas | Plataformas AVA, tecnologias digitais e capacidade de EaD. |
| [`04_corpo_docente_e_formadores.csv`](dados/04_corpo_docente_e_formadores.csv) | 147 linhas | Perfil dos docentes, gestão de formadores e cadastro. |
| [`05_avaliacao_da_formacao.csv`](dados/05_avaliacao_da_formacao.csv) | 126 linhas | Níveis 1 a 4 de Kirkpatrick e pesquisa de impacto de egressos. |
| [`06_agenda_formativa.csv`](dados/06_agenda_formativa.csv) | 280 linhas | Públicos formados, temáticas 2025 e eixos 2026. |
| [`07_cooperacao_e_articulacao.csv`](dados/07_cooperacao_e_articulacao.csv) | 161 linhas | Acordos, modalidades de cooperação e integração com a ENAJU. |
| [`distribuicao_territorial.csv`](dados/distribuicao_territorial.csv) | 85 linhas | Distribuição das sedes inferidas por UF proxy e ramo. |

---

## 🛡️ Salvaguarda Metodológica de Pequenos Grupos (Regra R01.1)

Conforme as diretrizes metodológicas do relatório oficial:
* Os ramos com **N ≤ 10 unidades** (Justiça Federal com n=8, Justiça Militar com n=5 e Tribunais Superiores/Conselhos com n=3) têm seus resultados exibidos prioritariamente em **números absolutos** (`n de N`).
* O painel exibe um aviso metodológico automático para alertar o usuário de que percentuais calculados sobre amostras pequenas podem induzir a leituras distorcidas e não devem ser interpretados como taxas populacionais generalizáveis.

---

## 🔄 Como Atualizar os Dados do Painel

Se o relatório for reprocessado via `04_Relatorio/scripts/renderizar_tudo.py` ou `preparar_dados_relatorio.py`, basta rodar o script de atualização do painel:

```powershell
cd "G:\Meu Drive\ENAJU\Diagnóstico das Escolas\06_Painel"
python criar_painel_html.py
```
Esse comando atualizará instantaneamente todos os arquivos CSV e a base do painel web.
