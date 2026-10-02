import { IndicadorCorte, UnidadePublica } from "../types";
import { ItemGrafico } from "../components/ChartCard";

/** Categorias homologadas de múltipla escolha são separadas por ponto e vírgula. */
export function temOpcao(valor: string | undefined | null, categoria: string): boolean {
  return typeof valor === "string" && valor.split(";").some(opcao => opcao.trim() === categoria);
}

/** Uma opção do questionário corresponde a uma categoria, sem busca textual aproximada. */
export function itemCategoria(
  unidades: UnidadePublica[],
  variavel: keyof UnidadePublica,
  categoria: string,
  rotulo = categoria,
  cor = "#0163AC"
): ItemGrafico {
  const n = unidades.filter(u => temOpcao(String(u[variavel] ?? ""), categoria)).length;
  const N = unidades.length;
  return { rotulo, n, N, pct: N ? (100 * n) / N : 0, cor };
}

export function indicadorNacional(
  indicadores: IndicadorCorte[], variavel: string, categoria: string
): IndicadorCorte {
  const encontrado = indicadores.find(i =>
    i.segmento === "Nacional" && i.variavel === variavel && i.categoria === categoria
  );
  if (!encontrado) throw new Error(`Indicador nacional ausente: ${variavel} / ${categoria}`);
  return encontrado;
}

export function percentualNacional(
  indicadores: IndicadorCorte[], variavel: string, categoria: string
): string {
  return indicadorNacional(indicadores, variavel, categoria).pct.toFixed(1).replace(".", ",") + "%";
}

export function percentual(n: number, N: number): string {
  return (N > 0 ? (n * 100) / N : 0).toFixed(1).replace(".", ",") + "%";
}

export function aplicaAvaliacao(valor: string): boolean {
  return valor === "Na maioria das ações" || valor === "Em parte das ações";
}
