import { UnidadePublica, IndicadorCorte, TerritorioUF, GeoUF, Metadata, FiltrosGlobaisState } from "../types";

let cacheUnidades: UnidadePublica[] | null = null;
let cacheIndicadores: IndicadorCorte[] | null = null;
let cacheTerritorio: TerritorioUF[] | null = null;
let cacheGeo: GeoUF[] | null = null;
let cacheMetadata: Metadata | null = null;

// Resolve caminhos relativos para funcionar tanto no GitHub Pages quanto em subdiretórios
const BASE_DATA_PATH = "./data";

export async function carregarUnidades(): Promise<UnidadePublica[]> {
  if (cacheUnidades) return cacheUnidades;
  const res = await fetch(`${BASE_DATA_PATH}/diagnostico_unidades_publico.json`);
  cacheUnidades = await res.json();
  return cacheUnidades!;
}

export async function carregarIndicadores(): Promise<IndicadorCorte[]> {
  if (cacheIndicadores) return cacheIndicadores;
  const res = await fetch(`${BASE_DATA_PATH}/indicadores_painel_completo.json`);
  cacheIndicadores = await res.json();
  return cacheIndicadores!;
}

export async function carregarTerritorio(): Promise<TerritorioUF[]> {
  if (cacheTerritorio) return cacheTerritorio;
  const res = await fetch(`${BASE_DATA_PATH}/territorio.json`);
  cacheTerritorio = await res.json();
  return cacheTerritorio!;
}

export async function carregarGeoBrasil(): Promise<GeoUF[]> {
  if (cacheGeo) return cacheGeo;
  const res = await fetch(`${BASE_DATA_PATH}/geo_brasil.json`);
  cacheGeo = await res.json();
  return cacheGeo!;
}

export async function carregarMetadata(): Promise<Metadata> {
  if (cacheMetadata) return cacheMetadata;
  const res = await fetch(`${BASE_DATA_PATH}/metadata.json`);
  cacheMetadata = await res.json();
  return cacheMetadata!;
}

export function filtrarUnidades(
  unidades: UnidadePublica[],
  filtros: FiltrosGlobaisState
): UnidadePublica[] {
  return unidades.filter((u) => {
    if (filtros.ramo && u.ramo !== filtros.ramo) return false;
    if (filtros.uf && u.uf !== filtros.uf) return false;
    if (filtros.orgao && u.sigla_orgao !== filtros.orgao) return false;
    if (filtros.natureza && u.natureza !== filtros.natureza) return false;
    if (filtros.busca) {
      const q = filtros.busca.toLowerCase();
      const match =
        u.escola_unidade.toLowerCase().includes(q) ||
        u.orgao.toLowerCase().includes(q) ||
        u.sigla_orgao.toLowerCase().includes(q) ||
        u.uf.toLowerCase().includes(q) ||
        u.ramo.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

export function baixarCSV(conteudoCSV: string, nomeArquivo: string) {
  // UTF-8 com BOM para Excel no Windows
  const bom = "\uFEFF";
  const blob = new Blob([bom + conteudoCSV], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", nomeArquivo.endsWith(".csv") ? nomeArquivo : `${nomeArquivo}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function gerarCSVDeObjetos<T extends Record<string, any>>(dados: T[], cabecalhos?: string[]): string {
  if (!dados || dados.length === 0) return "";
  const cols = cabecalhos || Object.keys(dados[0]);
  const linhas: string[] = [cols.join(";")];

  for (const item of dados) {
    const valores = cols.map((c) => {
      let val = item[c];
      if (val === null || val === undefined) return '""';
      if (typeof val === "number") return val.toLocaleString("pt-BR");
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    });
    linhas.push(valores.join(";"));
  }

  return linhas.join("\r\n");
}
