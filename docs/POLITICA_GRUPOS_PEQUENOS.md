# Política de Salvaguarda de Pequenos Grupos (Regra R01.1)

> **Diagnóstico Nacional das Unidades de Formação do Poder Judiciário**  
> **Conselho Nacional de Justiça (CNJ) · Escola Nacional do Judiciário (ENAJU)**

---

## 1. Fundamentação e Objetivo

Nas pesquisas estatísticas aplicadas a instituições públicas, cruzamentos multidimensionais com amostras reduzidas podem ensejar a reidentificação indireta de unidades respondentes e expor respostas individuais a questões sensíveis (como orçamentos autodeclarados, carências estruturais ou déficits avaliativos).

Para preservar a integridade metodológica e cumprir os princípios da **Lei Geral de Proteção de Dados (LGPD)** e do sigilo estatístico, foi homologada a **Regra R01.1** (registrada no marco `05_Histórico/R01_1_checkpoint.md`).

---

## 2. Parâmetro e Critérios de Aplicação

O sistema opera com o parâmetro oficial:

```typescript
export const MIN_PUBLIC_GROUP_SIZE = 10;
```

### Critério A: Ramos com N ≤ 10 unidades
Os ramos do Poder Judiciário com universo inferior ou igual a 10 unidades:
* **Justiça Federal** ($n = 8$)
* **Justiça Militar** ($n = 5$)
* **Tribunais Superiores e Conselhos** ($n = 3$)

**Regra:** São reportados unicamente em **números absolutos** ($n \text{ de } N$), sendo vedada a exibição de percentuais isolados que sugiram taxas populacionais generalizáveis ou induzam a conclusões distorcidas.

### Critério B: Supressão em Filtros Multidimensionais
Quando a aplicação combinada de filtros (por exemplo, `Ramo = Militar` E `UF = MG`) produzir um subconjunto com $N < \text{MIN\_PUBLIC\_GROUP\_SIZE}$:
1. Os gráficos analíticos suspendem a desagregação das variáveis;
2. É exibido o aviso institucional padronizado:

> *“Dados não exibidos para preservar a confidencialidade do conjunto selecionado. Amplie o filtro para visualizar os resultados.”*

---

## 3. Diretório de Unidades vs. Camada Agregada

No **Diretório de Unidades** (Página "Escolas"), as unidades respondentes são listadas individualmente para permitir a consulta de transparência ativa à rede de capacitação do Judiciário. 

Contudo:
* **Não são expostos dados pessoais:** nomes de servidores, e-mails institucionais, telefones ou contatos.
* **Não são divulgados dados qualitativos não homologados:** respostas abertas sobre desafios (Q44) e documentos anexados.
* **Aviso obrigatório:** Cada perfil exibe a advertência de que as informações são autodeclaradas no questionário e não constituem dados auditados externamente.
