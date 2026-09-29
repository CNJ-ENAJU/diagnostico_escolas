// Configurações Globais do Painel — ENAJU / CNJ

export const MIN_PUBLIC_GROUP_SIZE = 10;

export const SMALL_GROUP_WARNING = 
  "Dados não exibidos para preservar a confidencialidade do conjunto selecionado. Amplie o filtro para visualizar os resultados.";

export const FONTE_OFICIAL = 
  "Diagnóstico Nacional das Unidades de Formação do Poder Judiciário — ENAJU/CNJ, 2026. Dados autodeclarados pelas unidades respondentes.";

export const CORES = {
  navy: "#00367C",
  azul: "#0163AC",
  ceu: "#009BD4",
  teal: "#3E9F9B",
  ambar: "#D9982B",
  vermelho: "#C62828",
  verde: "#2E7D32",
  cinza_escuro: "#334155",
  cinza_medio: "#64748B",
  cinza_claro: "#E2E8F0",
  cinza_fundo: "#F8FAFC",
  branco: "#FFFFFF",
};

export const SEG_ORDEM = [
  "Eleitoral",
  "Estadual",
  "Trabalho",
  "Federal",
  "Militar",
  "Superior/Conselho"
] as const;

export const CORES_RAMO: Record<string, string> = {
  "Eleitoral": "#00367C",
  "Estadual": "#0163AC",
  "Trabalho": "#009BD4",
  "Federal": "#3E9F9B",
  "Militar": "#D9982B",
  "Superior/Conselho": "#475569",
  "Nacional": "#00367C"
};

export const ROTULOS_RAMO: Record<string, string> = {
  "Eleitoral": "Justiça Eleitoral",
  "Estadual": "Justiça Estadual (com TJDFT)",
  "Trabalho": "Justiça do Trabalho",
  "Federal": "Justiça Federal",
  "Militar": "Justiça Militar",
  "Superior/Conselho": "Tribunais Superiores e Conselhos",
  "Nacional": "Consolidado Nacional"
};
