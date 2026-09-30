# Painel Público do Diagnóstico Nacional das Unidades de Formação

> **Conselho Nacional de Justiça (CNJ) · Escola Nacional do Judiciário (ENAJU)**  
> Resolução CNJ nº 643/2025 · Ciclo 2025/2026

Aplicação estática moderna, auditável e responsiva para exploração pública dos indicadores institucionais, tecnológicos e pedagógicos das **110 unidades de formação** do Poder Judiciário.

## 🔗 Acesse o painel

**[Clique aqui para visualizar o painel público](https://cairesmachado-svg.github.io/diagnostico_escolas/)**

> Se o link ainda não estiver publicado no GitHub Pages, rode localmente com `npm install` e `npm run dev`.

---

## 🚀 Como Executar Localmente

Qualquer desenvolvedor pode executar o projeto do zero sem necessidade de configurações complexas de servidor:

```bash
# 1. Instalar as dependências do front-end
npm install

# 2. Gerar a camada pública sanitizada de dados (CSV e JSON)
npm run data

# 3. Rodar os testes de dados, privacidade e consistência com o relatório
npm run test

# 4. Iniciar o ambiente de desenvolvimento local
npm run dev

# 5. Compilar para produção (gera pasta dist/)
npm run build
```

---

## 🏛️ Dimensões e Páginas do Painel

1. **Início (Landing Page):** Visão institucional, métricas consolidadas e caminhos guiados de navegação.
2. **Visão Geral:** Os 6 achados centrais e os 12 indicadores estratégicos nacionais.
3. **Rede Nacional:** Mapa interativo das 27 UFs com bolhas temáticas e barras empilhadas UF × Ramo.
4. **Governança:** Planejamento estratégico (Indicadores A e B), atos normativos, colegiados e arranjos orçamentários.
5. **Capacidades Instaladas:** Estrutura física, quadro de servidores e faixas orçamentárias autodeclaradas.
6. **Educação Digital:** Disponibilidade de AVA, liderança do Moodle (90,0%) e capacidade de produção EaD.
7. **Formadores:** Cadastro de docentes, critérios de retribuição e formação continuada de formadores.
8. **Avaliação da Formação:** A Escada de Kirkpatrick (N1 a N4), pesquisas com egressos e intensidade avaliativa.
9. **Agenda Formativa:** Comparativo descritivo entre temáticas 2025 e eixos 2026 (não-comparáveis como série temporal).
10. **Cooperação:** Convênios vigentes, modalidades de colaboração e interesse na articulação em rede pela ENAJU (99,1%).
11. **Escolas (Diretório):** Consulta aberta com busca em tempo real e Drawer de perfil público de cada unidade.
12. **Dados Abertos:** Download dos 6 conjuntos de dados em CSV (`UTF-8 com BOM`) e JSON, além de exportação filtrada.
13. **Metodologia:** Decisões C02, salvaguarda de pequenos grupos (R01.1), teste de sensibilidade R110 e citação bibliográfica.
14. **Sobre:** Fundamentos da Resolução CNJ nº 643/2025, atribuições da ENAJU e expediente institucional.

---

## 🛡️ Salvaguardas Metodológicas e Proteção de Dados (LGPD)

* **Regra R01.1:** Ramos com $N \le 10$ unidades (Justiça Federal $n=8$, Justiça Militar $n=5$, Tribunais Superiores $n=3$) têm resultados exibidos exclusivamente em valores absolutos ($n$) e nunca em percentuais.
* **Privacidade Absoluta:** O front-end não tem acesso à base bruta e nenhum dado de contato pessoal (nome de respondente, email, telefone, assinatura) integra os arquivos públicos.
* **Consistência Matemática:** 100% dos indicadores coincidem com o Relatório Oficial com diferença zero ($d = 0$).

---

## 📦 Documentação Técnica Detalhada

* [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md): Visão de engenharia, stack e fluxo estático.
* [`docs/DADOS.md`](docs/DADOS.md): Catálogo de arquivos e dicionário de variáveis públicas.
* [`docs/PRIVACIDADE.md`](docs/PRIVACIDADE.md): Políticas de conformidade com a LGPD e testes de anonimização.
* [`docs/POLITICA_GRUPOS_PEQUENOS.md`](docs/POLITICA_GRUPOS_PEQUENOS.md): Detalhamento da salvaguarda R01.1.
* [`docs/DEPLOY.md`](docs/DEPLOY.md): CI/CD no GitHub Actions e instruções para deploy no portal da ENAJU.
* [`docs/MANUTENCAO.md`](docs/MANUTENCAO.md): Rotinas de manutenção e atualização de dados.
