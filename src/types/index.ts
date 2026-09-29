export interface UnidadePublica {
  id_unidade: string;
  escola_unidade: string;
  orgao: string;
  sigla_orgao: string;
  uf: string;
  ramo: string;
  natureza: string;
  ano_criacao: number | null;
  site_escola: string;
  
  // Governança
  planejamento: string;
  plan_A: number;
  plan_B: number;
  dotacao: string;
  orcamento_faixa: string;
  instrumentos_governanca: string;
  fontes_financiamento: string;
  
  // Estrutura e Pessoal
  estrutura_fisica: string;
  efetivos_faixa: string;
  comissionados_faixa: string;
  magistrados_gestao_faixa: string;
  
  // Educação Digital
  ava: string;
  moodle: number;
  capacidade_ead: string;
  recursos_tecnologias: string;
  
  // Formadores
  cadastro_formadores: string;
  formacao_formadores: string;
  composicao_docente: string;
  instrumentos_gestao_docente: string;
  
  // Avaliação
  n1_reacao: string;
  n2_aprendizagem: string;
  n3_transferencia: string;
  n4_impacto: string;
  egressos: string;
  relacao_cursos: string;
  
  // Agenda
  publicos_2025: string;
  tematicas_2025: string;
  eixos_prioritarios_2026: string;
  plano_2026: string;
  
  // Cooperação
  parcerias: string;
  interesse_enaju: string;
  instituicoes_cooperacao: string;
  modalidades_cooperacao: string;
}

export interface IndicadorCorte {
  variavel: string;
  categoria: string;
  segmento: string;
  n: number;
  N: number;
  pct: number;
  tipo: 'unica' | 'multipla' | 'binaria';
}

export interface TerritorioUF {
  uf: string;
  segmento: string;
  n: number;
  N_uf: number;
  pct_uf: number;
}

export interface GeoUF {
  uf: string;
  nome: string;
  lat: number;
  lon: number;
  regiao: string;
  n_unidades: number;
  n_orgaos: number;
  ramos: string[];
  escolas_formais: number;
  setores: number;
  centros: number;
  unidades: Array<{
    id: string;
    escola: string;
    orgao: string;
    sigla: string;
    ramo: string;
    natureza: string;
  }>;
}

export interface FiltrosGlobaisState {
  ramo: string;
  uf: string;
  orgao: string;
  natureza: string;
  busca: string;
}

export interface Metadata {
  titulo: string;
  subtitulo: string;
  instituicao: string;
  versao: string;
  data_atualizacao: string;
  periodo_coleta: string;
  universo: {
    n_unidades: number;
    n_orgaos: number;
    n_tribunais_escopo: number;
    n_tribunais_representados: number;
    n_ufs: number;
    n_indicadores_cortes: number;
  };
  regras_aplicadas: string[];
}
