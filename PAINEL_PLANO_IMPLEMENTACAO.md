# Plano de Implementação: Painel Público do Diagnóstico Nacional das Unidades de Formação

> **Conselho Nacional de Justiça (CNJ) · Escola Nacional do Judiciário (ENAJU)**  
> **Data:** 29 de setembro de 2026  
> **Status:** Primeira Entrega Homologada (Prosseguimento Automático Autorizado)

---

## 1. Fontes Localizadas e Mapeamento

Em conformidade com a auditoria registrada em `PAINEL_AUDITORIA_FONTES.md`:
* **Base Analítica Tratada:** `04_Relatorio/outputs/intermediarios/base_relatorio.csv` (110 respostas válidas, 92 órgãos, com `id_resposta` anônimo e sem dados pessoais).
* **Camada de Indicadores Homologados:** `04_Relatorio/outputs/intermediarios/cortes.csv` (1.295 linhas estruturadas em `variavel × categoria × segmento`, denominadores e percentuais exatos idênticos ao relatório).
* **Fatos Escalares e Apelidos:** `04_Relatorio/outputs/intermediarios/indicadores.json` (todas as contagens e valores do relatório).
* **Distribuição Territorial:** `04_Relatorio/outputs/intermediarios/territorio.csv` (27 UFs agregadas por ramo com n, N_uf e pct_uf).
* **Base de Múltiplas Escolhas:** `00_Organização Inicial/02_respostas_multiplas.csv` e `04_Relatorio/outputs/intermediarios/multiplas_wide.csv`.
* **Identificação Institucional Pública das Unidades:** extraída de `00_Organização Inicial/C01_apoio/C01_base_recodificada.csv` e `01_base_respostas_organizada.csv` (somente campos institucionais públicos: nome da escola, órgão, site, UF da sede e ano de criação).

---

## 2. Arquitetura de Dados

O fluxo estrito de dados assegura total alinhamento e fidelidade metodológica:

```text
00_Organização Inicial (Base Bruta - Privada)
      ↓ (scripts/preparar_dados_relatorio.py)
04_Relatorio/outputs/intermediarios (Camada Homologada)
      ↓ (06_Painel/scripts/build_public_data.py)
06_Painel/data_public/  e  06_Painel/public/data/ (Camada Pública Sanitizada)
      ↓
Front-End (React + Vite + TypeScript)
```

**Princípio de Isolamento:** O front-end consome exclusivamente arquivos JSON e CSV estáticos presentes em `data_public/` e `public/data/`. A aplicação nunca se comunica com bancos de dados externos nem acessa arquivos com dados pessoais.

---

## 3. Dados Públicos Autorizados

1. **`diagnostico_unidades_publico.csv` / `.json`:** 110 registros de unidades com atributos institucionais (escola, órgão, UF, ramo, natureza, ano de criação, planejamento, dotação, faixas de estrutura e pessoal, AVA, formadores, avaliação, interesse na ENAJU).
2. **`indicadores_nacionais.csv` / `.json`:** Indicadores univariados consolidados em nível Brasil (N=110).
3. **`indicadores_por_ramo.csv` / `.json`:** Indicadores desagregados pelos 6 ramos de justiça (Eleitoral, Estadual, Trabalho, Federal, Militar, Superior/Conselho).
4. **`indicadores_por_uf.csv` / `.json`:** Agregação territorial de sedes institucionais por UF proxy e ramo.
5. **`dicionario_dados_publicos.csv`:** Descrição de cada campo, enunciado da pergunta no questionário, valores possíveis e notas metodológicas.
6. **`metadata.json`:** Metadados estruturados, versão dos dados, data de atualização, contagens oficiais (110 unidades, 92 órgãos) e hashes SHA-256.

---

## 4. Dados Proibidos e Bloqueados

Estão expressamente excluídos da camada pública:
* **Dados Pessoais (LGPD):** nome do respondente, e-mail institucional, telefone, assinatura, cargo pessoal.
* **Anexos Documentais não homologados:** famílias `27A`, `31A`, `35A`, `39`, `D01`, `D02`, `08_inventario_arquivos_drive`, etc.
* **Quantitativos de Execução 2025 não validados:** número total de ações formativas, carga horária nacional, total de participações/matrículas e taxas de conclusão de 2025.
* **Respostas Abertas Qualitativas da Q44:** desafios e necessidades (em processo de validação por segundo codificador).

---

## 5. Indicadores Disponíveis por Dimensão

* **Síntese Institucional:** Cobertura de tribunais (90 de 91 = 98,9%), unidades respondentes (110), órgãos (92), natureza das unidades (86 escolas, 17 setores, 7 centros/núcleos).
* **Governança:** Indicador A (47,3% planejamento próprio vigente) vs Indicador B (68,2% referência estratégica existente), PAC (74,5%), Ato Normativo/Regimento (63,6%), Colegiado (53,6%), PPI (36,4%), Dotação orçamentária própria (40,0%).
* **Capacidades Instaladas:** Sede exclusiva (39,1%), auditório (63,6%), estúdio EaD (56,4%), faixas de servidores efetivos, comissionados e magistrados gestores, faixas orçamentárias autodeclaradas.
* **Educação Digital:** Disponibilidade de AVA (95,5%), adoção do Moodle (90,0%), equipes multidisciplinares dedicadas (26,4%) vs produção parcial (51,8%).
* **Corpo Docente:** Composição (magistrados, servidores, docentes externos), cadastro atualizado (70,9%), programa permanente de formação de formadores (30,9%) vs ações pontuais (46,4%).
* **Avaliação da Formação:** Nível 1 Reação (97,3%), Nível 2 Aprendizagem (72,7%), Nível 3 Transferência (40,9%), Nível 4 Impacto (34,5%), pesquisa sistemática com egressos (16,4%).
* **Agenda Formativa:** Púbicos-alvo atendidos em 2025, 17 áreas temáticas de 2025 e eixos prioritários de 2026 (Inteligência Artificial 83,6%, Direitos Humanos 69,1%).
* **Cooperação e ENAJU:** Parcerias formais vigentes (64,5%), modalidades de compartilhamento de cursos/vagas e coprodução, interesse em atuar em rede com a ENAJU/CNJ (99,1% positivo: 76,4% alto, 22,7% moderado).

---

## 6. Páginas da Aplicação

1. **Início (Landing Page):** Título oficial, subtítulo, boas-vindas institucionais, cards-resumo, botões de ação ("Conheça o Diagnóstico" com narrativa guiada vs "Explore os Dados" com acesso imediato).
2. **Visão Geral:** Os 6 achados centrais, cartões executivos e gráfico dos 12 Indicadores Estratégicos Nacionais.
3. **Rede Nacional:** Mapa interativo do Brasil com distribuição por UF e ramo, painel de detalhes por estado, e gráfico de barras empilhadas ordenadas por volume.
4. **Governança:** Planejamento estratégico (Indicadores A e B), instrumentos normativos, colegiados e arranjos orçamentários.
5. **Capacidades:** Estrutura física instalada, quadro de pessoal e faixas orçamentárias (sem criação de médias ou totais artificiais).
6. **Educação Digital:** Plataformas AVA, soluções tecnológicas e capacidade institucional de produção EaD.
7. **Formadores:** Perfil docente, cadastros, critérios e iniciativas de formação de formadores.
8. **Avaliação:** A Escada de Kirkpatrick (N1 a N4), pesquisa com egressos e matriz de coerência avaliativa.
9. **Agenda Formativa:** Comparativo descritivo entre temáticas 2025 e eixos 2026 (com aviso explícito de não comparabilidade de séries temporais).
10. **Cooperação:** Convênios vigentes, modalidades de cooperação e articulação com a ENAJU.
11. **Escolas (Diretório):** Tabela pesquisável e paginada de todas as 110 unidades, com filtro rápido e Drawer lateral exibindo o Perfil Institucional Público autodeclarado (sem qualquer dado pessoal).
12. **Dados Abertos:** Central de download dos conjuntos de dados oficiais (CSV, XLSX, JSON), download da visão filtrada atual e download da tabela individual de cada gráfico.
13. **Metodologia:** Explicação das decisões C02, salvaguardas metodológicas, unidades de análise, teste de sensibilidade, link para download do relatório oficial em PDF e citação bibliográfica sugerida.
14. **Sobre:** Finalidade do projeto, atribuições da ENAJU/CNJ, expediente institucional e notas de versão.

---

## 7. Componentes e Sistema de Design

* **Paleta ENAJU/CNJ:**
  - Azul Escuro Principal: `#00367C`
  - Azul Institucional: `#0163AC`
  - Azul Céu (Acento): `#009BD4`
  - Verde-Azulado CNJ: `#3E9F9B`
  - Âmbar/Destaque: `#D9982B`
  - Fundo Neutro: `#F8FAFC`
  - Texto e Contraste: `#334155` e `#1E293B`
* **Barra de Filtros Persistente:** Filtros por Ramo de Justiça, UF, Órgão, Natureza Institucional, com indicador `N = X` em tempo real e botão de "Limpar Filtros".
* **Sincronização de Estado na URL:** Parâmetros de consulta via URL (`?ramo=...&uf=...`) para compartilhamento imediato de visualizações customizadas.
* **Componente de Gráfico Auditável:** Todo gráfico renderiza título, subtítulo, botão de ajuda metodológica `ⓘ`, legenda sóbria, nota de rodapé com fonte oficial e botão **"Baixar Dados do Gráfico (CSV)"**.
* **Proteção contra Rankings:** Nenhuma tabela ou lista apresentará ordenações por nota, score, maturidade ou ranqueamento competitivo de escolas.

---

## 8. Mapa do Brasil

* Implementado com **Leaflet** e geometrias vetoriais das 27 Unidades da Federação armazenadas localmente no projeto (`/data/geo_brasil.json`).
* Representação em bolhas temáticas com tamanho proporcional ao número de unidades na UF e legenda de ramos.
* Interatividade com tooltips informativos (unidades, órgãos, ramos presentes) e filtro cruzado ao clicar na UF.
* Totalmente compatível com modo offline e sem requisições a serviços externos de geocodificação.

---

## 9. Política de Proteção de Pequenos Grupos (R01.1)

* Regra parametrizada: `MIN_PUBLIC_GROUP_SIZE = 10`.
* Conforme o marco oficial R01.1: ramos com N ≤ 10 (Justiça Federal n=8, Justiça Militar n=5, Tribunais Superiores e Conselhos n=3) são reportados unicamente em valores absolutos (`n de N`).
* Quando qualquer filtro customizado gerar um subgrupo com `N < MIN_PUBLIC_GROUP_SIZE`, os gráficos analíticos suprimem a desagregação e apresentam o alerta padrão:
  > *Dados não exibidos para preservar a confidencialidade do conjunto selecionado. Amplie o filtro para visualizar os resultados.*

---

## 10. Stack Tecnológico e Estrutura de Pastas

* **Core:** React 18, TypeScript, Vite.
* **Roteamento:** HashRouter (garante navegação fluida no GitHub Pages sem erros 404 em refresh).
* **Gráficos e Mapas:** Chart.js + Leaflet.
* **Estilização:** CSS moderno escopado e acessível, alinhado à identidade visual da ENAJU.

Estrutura de diretórios em `06_Painel/`:
```text
06_Painel/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── config.ts
│   ├── types/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── GlobalFilters.tsx
│   │   ├── MetricCard.tsx
│   │   ├── ChartCard.tsx
│   │   ├── UnitDrawer.tsx
│   │   └── SmallGroupAlert.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Overview.tsx
│   │   ├── NationalNetwork.tsx
│   │   ├── Governance.tsx
│   │   ├── Capabilities.tsx
│   │   ├── Digital.tsx
│   │   ├── Faculty.tsx
│   │   ├── Evaluation.tsx
│   │   ├── Agenda.tsx
│   │   ├── Cooperation.tsx
│   │   ├── SchoolsDirectory.tsx
│   │   ├── Downloads.tsx
│   │   ├── Methodology.tsx
│   │   └── About.tsx
│   ├── services/
│   │   └── dataService.ts
│   └── styles/
│       ├── tokens.css
│       └── main.css
├── public/
│   └── data/
│       ├── diagnostico_unidades_publico.json
│       ├── indicadores_painel_completo.json
│       ├── territorio.json
│       ├── metadata.json
│       └── geo_brasil.json
├── data_public/
│   ├── diagnostico_unidades_publico.csv
│   ├── indicadores_nacionais.csv
│   ├── indicadores_por_ramo.csv
│   ├── indicadores_por_uf.csv
│   ├── dicionario_dados_publicos.csv
│   └── metadata.json
├── scripts/
│   ├── build_public_data.py
│   ├── validate_public_data.py
│   └── compare_report_consistency.py
├── tests/
│   └── test_data_integrity.py
└── docs/
    ├── ARQUITETURA.md
    ├── DADOS.md
    ├── METODOLOGIA.md
    ├── PRIVACIDADE.md
    ├── POLITICA_GRUPOS_PEQUENOS.md
    ├── DEPLOY.md
    └── MANUTENCAO.md
```

---

## 11. Testes e Validação Automatizada

1. **`test_data_integrity.py`:** Testa N=110, órgãos=92, 6 ramos, 27 UFs, somas por ramo e denominadores.
2. **`validate_public_data.py`:** Varre todas as colunas de dados públicos e falha se encontrar termos sensíveis de PII (`email`, `telefone`, `cpf`, `responsavel`, etc.).
3. **`compare_report_consistency.py`:** Gera `painel_relatorio_consistencia.csv` comparando os indicadores do painel com `04_Relatorio/outputs/intermediarios/indicadores.json`. Diferença esperada = 0.

---

## 12. Deploy, CI/CD e Portabilidade

* **GitHub Pages:** Workflow `.github/workflows/deploy.yml` que instala dependências, valida a camada de dados, roda os testes automatizados, compila a aplicação com `npm run build` e realiza o deploy.
* **Portabilidade:** `base: './'` no Vite e caminhos relativos em todos os serviços. O diretório `dist/` resultante pode ser hospedado em qualquer pasta ou subdomínio do portal da ENAJU (ex.: `https://enaju.jus.br/diagnostico/`) sem nenhuma modificação no código.

---

## 13. Gestão de Riscos e Mitigações

* **Risco 1: Quebra de páginas no GitHub Pages em navegações diretas.**  
  *Mitigação:* Adoção de `HashRouter` (`/#/rede`, `/#/governanca`), eliminando a necessidade de reescrita de rotas no servidor.
* **Risco 2: Identificação indireta de unidades em grupos pequenos.**  
  *Mitigação:* Aplicação estrita do bloqueio `MIN_PUBLIC_GROUP_SIZE = 10` e exibição de números absolutos nos ramos menores.
* **Risco 3: Dependência de conexão externa para mapas.**  
  *Mitigação:* Geometrias vetoriais das UFs embutidas localmente no projeto (`geo_brasil.json`).
