import React, { useState } from "react";
import { Download, Info, X } from "lucide-react";
import { FONTE_OFICIAL } from "../config";
import { baixarCSV, gerarCSVDeObjetos } from "../services/dataService";

export interface ItemGrafico {
  rotulo: string;
  n: number;
  N: number;
  pct: number;
  cor?: string;
  destaque?: boolean;
}

export interface MetadadoIndicador {
  definicao: string;
  perguntaOrigem: string;
  denominador: string;
  regraCalculo: string;
  limitacao?: string;
}

interface ChartCardProps {
  titulo: string;
  subtitulo?: string;
  itens: ItemGrafico[];
  metadados?: MetadadoIndicador;
  modoAbsoluto?: boolean; // Para ramos N <= 10 (Regra R01.1)
  nota?: string;
  linkRelatorio?: { capitulo: string; texto: string };
}

export const ChartCard: React.FC<ChartCardProps> = ({
  titulo,
  subtitulo,
  itens,
  metadados,
  modoAbsoluto = false,
  nota,
  linkRelatorio,
}) => {
  const [modalAberto, setModalAberto] = useState(false);

  const handleBaixarDados = () => {
    const dadosTabela = itens.map((item) => ({
      categoria: item.rotulo,
      unidades_n: item.n,
      denominador_N: item.N,
      percentual: Number(item.pct.toFixed(1)),
    }));
    const nomeSeguro = titulo.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 30);
    const csv = gerarCSVDeObjetos(dadosTabela);
    baixarCSV(csv, `grafico_${nomeSeguro}.csv`);
  };

  const maxVal = Math.max(...itens.map((i) => (modoAbsoluto ? i.n : i.pct)), 1);

  // O alerta isolado não protege a confidencialidade: impedir também o gráfico
  // e o botão de exportação em filtros combinados com menos de 10 unidades.
  if (itens.some(item => item.N < 10)) {
    return (
      <div className="chart-card" role="status">
        <h3 className="chart-title">{titulo}</h3>
        <p>Dados não exibidos para recortes com menos de 10 unidades. Amplie os filtros para consultar o indicador.</p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title-area">
          <h3 className="chart-title">{titulo}</h3>
          {subtitulo && <p className="chart-subtitle">{subtitulo}</p>}
        </div>

        <div className="chart-actions">
          {metadados && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setModalAberto(true)}
              title="Informações Metodológicas"
              aria-label="Metadados do indicador"
            >
              <Info size={14} />
              <span>Metodologia</span>
            </button>
          )}

          <button
            className="btn btn-outline btn-sm"
            onClick={handleBaixarDados}
            title="Baixar tabela de dados deste gráfico em CSV"
            aria-label="Baixar dados do gráfico"
          >
            <Download size={14} />
            <span>Baixar dados (CSV)</span>
          </button>
        </div>
      </div>

      {/* Renderização de Barras Horizontais Sóbrias */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "1rem" }}>
        {itens.map((item, idx) => {
          const larguraPct = ( (modoAbsoluto ? item.n : item.pct) / maxVal ) * 100;
          const corBarra = item.cor || "#0163AC";

          return (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ fontWeight: item.destaque ? 700 : 500, color: "#1E293B" }}>
                  {item.rotulo}
                </span>
                <span style={{ fontWeight: 600, color: "#00367C" }}>
                  {modoAbsoluto ? (
                    `${item.n} de ${item.N}`
                  ) : (
                    `${item.pct.toFixed(1)}% (${item.n} de ${item.N})`
                  )}
                </span>
              </div>

              {/* Barra de progresso */}
              <div
                style={{
                  width: "100%",
                  height: "12px",
                  backgroundColor: "#E2E8F0",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(larguraPct, 100)}%`,
                    height: "100%",
                    backgroundColor: corBarra,
                    borderRadius: "4px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé com link para capítulo do relatório e fonte oficial */}
      <div className="chart-footer">
        {nota && <div style={{ marginBottom: "0.3rem" }}><strong>Nota:</strong> {nota}</div>}
        {linkRelatorio && (
          <div style={{ marginBottom: "0.3rem", color: "#0163AC" }}>
            <strong>📖 Conexão com o Relatório:</strong> {linkRelatorio.texto} ({linkRelatorio.capitulo})
          </div>
        )}
        <div>{FONTE_OFICIAL}</div>
      </div>

      {/* Modal Metodológico */}
      {modalAberto && metadados && (
        <div className="drawer-backdrop" onClick={() => setModalAberto(false)}>
          <div 
            style={{
              background: "#fff",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
              margin: "auto",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h4 style={{ color: "#00367C", fontSize: "1.1rem" }}>Ficha Metodológica do Indicador</h4>
              <button onClick={() => setModalAberto(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", lineHeight: 1.5 }}>
              <div>
                <strong>Indicador:</strong> {titulo}
              </div>
              <div>
                <strong>Definição:</strong> {metadados.definicao}
              </div>
              <div>
                <strong>Pergunta de Origem no Questionário:</strong> {metadados.perguntaOrigem}
              </div>
              <div>
                <strong>Denominador:</strong> {metadados.denominador}
              </div>
              <div>
                <strong>Regra de Cálculo:</strong> {metadados.regraCalculo}
              </div>
              {metadados.limitacao && (
                <div style={{ background: "#FEF3C7", padding: "0.5rem", borderRadius: "4px", color: "#92400E" }}>
                  <strong>Limitação Metodológica:</strong> {metadados.limitacao}
                </div>
              )}
            </div>

            <div style={{ marginTop: "1.25rem", textAlign: "right" }}>
              <button className="btn btn-primary btn-sm" onClick={() => setModalAberto(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
