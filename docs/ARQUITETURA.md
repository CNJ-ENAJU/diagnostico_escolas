# Arquitetura Técnica do Painel Público

> **Diagnóstico Nacional das Unidades de Formação do Poder Judiciário**  
> **Conselho Nacional de Justiça (CNJ) · Escola Nacional do Judiciário (ENAJU)**

---

## 1. Visão Geral da Arquitetura

O Painel Público foi projetado segundo uma arquitetura estática moderna (**JAMstack**), desacoplada de servidores de aplicação e de bancos de dados dinâmicos. Esta decisão arquitetural assegura:

1. **Segurança Máxima e LGPD:** O front-end consome exclusivamente arquivos JSON e CSV estáticos pré-compilados e auditados. Não há endpoints com acesso à base bruta ou a dados de contato.
2. **Alta Performance:** O bundle da aplicação é inferior a 80 kB (gzipped) e todos os dados públicos essenciais viajam com o build, proporcionando carregamento quase instantâneo mesmo em redes institucionais restritas.
3. **Portabilidade Integral:** A aplicação não possui acoplamento à infraestrutura do GitHub. Com caminhos estritamente relativos (`base: './'`), pode ser servida no GitHub Pages, incorporada em portais institucionais (ex.: `https://enaju.jus.br/diagnostico/`) ou até aberta localmente em rede interna.
4. **Resiliência e Custo Zero:** Sem dependência de APIs ou microsserviços proprietários. As coordenadas e limites territoriais das 27 UFs estão embutidos localmente (`geo_brasil.json`).

---

## 2. Diagrama de Fluxo de Dados

```text
+-------------------------------------------------------------------+
|               BASE BRUTA (00_Organização Inicial)                 |
|   01_base_respostas_organizada.csv (110 respostas × 58 campos)    |
|   (Contém dados pessoais de contato: privada e protegida)         |
+-------------------------------------------------------------------+
                                  │
                                  ▼ (04_Relatorio/scripts/preparar_dados_relatorio.py)
+-------------------------------------------------------------------+
|            CAMADA ANALÍTICA HOMOLOGADA (04_Relatorio)             |
|   - base_relatorio.csv (IDs anônimos R001-R110 e O01-O92)         |
|   - cortes.csv (1.295 linhas: variável × categoria × segmento)    |
|   - territorio.csv (27 UFs agregadas por ramo proxy)              |
|   - indicadores.json (fatos escalares e apelidos)                 |
+-------------------------------------------------------------------+
                                  │
                                  ▼ (06_Painel/scripts/build_public_data.py)
+-------------------------------------------------------------------+
|                 CAMADA PÚBLICA DE DADOS SANITIZADA                |
|   - data_public/diagnostico_unidades_publico.csv / .json          |
|   - data_public/indicadores_nacionais.csv / .json                 |
|   - data_public/indicadores_por_ramo.csv / .json                  |
|   - data_public/indicadores_por_uf.csv / .json                    |
|   - data_public/geo_brasil.json (coordenadas das 27 UFs)          |
|   - data_public/metadata.json (hashes SHA-256 e integridade)      |
+-------------------------------------------------------------------+
                                  │
                                  ▼ (Vite Build)
+-------------------------------------------------------------------+
|                 FRONT-END (React 18 + TypeScript)                 |
|   - HashRouter: Navegação sem erro 404 em recarregamento          |
|   - Filtros Globais Reativos (Ramo, UF, Órgão, Natureza, Busca)   |
|   - Regra R01.1 de Salvaguarda de Pequenos Grupos (N <= 10)       |
|   - Diretório e Drawer de Perfil Institucional Declarado          |
|   - Exportação Auditável em CSV por Gráfico                       |
+-------------------------------------------------------------------+
```

---

## 3. Tecnologias Empregadas

* **Linguagem:** TypeScript 5.7+ (tipagem estrita).
* **Framework:** React 18.3.
* **Build Tool:** Vite 6 (bundling otimizado em Rollup).
* **Roteamento:** HashRouter nativo sincronizado com `window.location.hash`, permitindo URLs compartilháveis (`/#/governanca?ramo=Eleitoral&uf=BA`) sem necessidade de configuração de rotas no servidor HTTP.
* **Ícones:** Lucide React (vetoriais acessíveis).
* **Design System:** CSS escopado com variáveis nativas (`tokens.css`), garantindo contraste WCAG AAA e alinhamento visual à identidade editorial da ENAJU/CNJ.
* **Automação e Testes:** Python 3.12+ para pipelines de extração, sanitização e testes automatizados de consistência analítica (`validate_public_data.py`).
