import React, { useState, useEffect, useMemo } from "react";
import { Navbar, NAV_ITEMS } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { GlobalFilters } from "./components/GlobalFilters";
import { Home } from "./pages/Home";
import { Overview } from "./pages/Overview";
import { NationalNetwork } from "./pages/NationalNetwork";
import { Governance } from "./pages/Governance";
import { Capabilities } from "./pages/Capabilities";
import { Digital } from "./pages/Digital";
import { Faculty } from "./pages/Faculty";
import { Evaluation } from "./pages/Evaluation";
import { Agenda } from "./pages/Agenda";
import { Cooperation } from "./pages/Cooperation";
import { SchoolsDirectory } from "./pages/SchoolsDirectory";
import { Downloads } from "./pages/Downloads";
import { Methodology } from "./pages/Methodology";
import { About } from "./pages/About";
import { UnidadePublica, IndicadorCorte, GeoUF, FiltrosGlobaisState } from "./types";
import { carregarUnidades, carregarIndicadores, carregarGeoBrasil, filtrarUnidades } from "./services/dataService";

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("inicio");
  const [unidades, setUnidades] = useState<UnidadePublica[]>([]);
  const [indicadores, setIndicadores] = useState<IndicadorCorte[]>([]);
  const [geoUfs, setGeoUfs] = useState<GeoUF[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Estado dos Filtros Globais
  const [filtros, setFiltros] = useState<FiltrosGlobaisState>({
    ramo: "",
    uf: "",
    orgao: "",
    natureza: "",
    busca: "",
  });

  // Inicialização e Leitura de URL Hash e Query Params
  useEffect(() => {
    async function inicializar() {
      try {
        const [u, ind, geo] = await Promise.all([
          carregarUnidades(),
          carregarIndicadores(),
          carregarGeoBrasil(),
        ]);
        setUnidades(u);
        setIndicadores(ind);
        setGeoUfs(geo);

        // Parsear hash inicial (ex: #/governanca?ramo=Eleitoral&uf=BA)
        const hashCompleto = window.location.hash || "#inicio";
        const partes = hashCompleto.replace(/^#\/?/, "").split("?");
        const rota = partes[0] || "inicio";
        if (NAV_ITEMS.some((item) => item.id === rota)) {
          setCurrentPage(rota);
        }

        if (partes[1]) {
          const params = new URLSearchParams(partes[1]);
          setFiltros({
            ramo: params.get("ramo") || "",
            uf: params.get("uf") || "",
            orgao: params.get("orgao") || "",
            natureza: params.get("natureza") || "",
            busca: params.get("busca") || "",
          });
        }
      } catch (err) {
        console.error("Erro ao carregar bases de dados:", err);
      } finally {
        setCarregando(false);
      }
    }

    inicializar();

    // Listener para navegação pelo botão voltar do navegador
    const handlePopState = () => {
      const hashCompleto = window.location.hash || "#inicio";
      const rota = hashCompleto.replace(/^#\/?/, "").split("?")[0] || "inicio";
      if (NAV_ITEMS.some((item) => item.id === rota)) {
        setCurrentPage(rota);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handlePageChange = (pagina: string) => {
    setCurrentPage(pagina);
    window.location.hash = pagina;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Unidades filtradas reativamente
  const unidadesFiltradas = useMemo(() => {
    return filtrarUnidades(unidades, filtros);
  }, [unidades, filtros]);

  // Seção de Filtros não é necessária na Home, Metodologia e Sobre
  const mostrarFiltros = !["inicio", "metodologia", "sobre"].includes(currentPage);

  return (
    <div className="app-container">
      <Navbar currentPage={currentPage} onPageChange={handlePageChange} />

      <main className="main-content">
        {carregando ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#00367C" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Carregando dados oficiais do Diagnóstico Nacional...
            </div>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
              Consolidando indicadores analíticos da ENAJU/CNJ
            </p>
          </div>
        ) : (
          <>
            {mostrarFiltros && (
              <GlobalFilters
                filtros={filtros}
                onChange={setFiltros}
                unidadesTotais={unidades}
                unidadesFiltradas={unidadesFiltradas}
              />
            )}

            {currentPage === "inicio" && (
              <Home onNavigate={handlePageChange} unidades={unidades} />
            )}

            {currentPage === "visao-geral" && (
              <Overview
                unidades={unidadesFiltradas}
                indicadores={indicadores}
                ramoSelecionado={filtros.ramo}
              />
            )}

            {currentPage === "rede-nacional" && (
              <NationalNetwork
                geoUfs={geoUfs}
                unidades={unidadesFiltradas}
                ufSelecionada={filtros.uf}
                onSelectUf={(uf) => setFiltros({ ...filtros, uf })}
              />
            )}

            {currentPage === "governanca" && (
              <Governance
                unidades={unidadesFiltradas}
                indicadores={indicadores}
                ramoSelecionado={filtros.ramo}
              />
            )}

            {currentPage === "capacidades" && (
              <Capabilities
                unidades={unidadesFiltradas}
                indicadores={indicadores}
                ramoSelecionado={filtros.ramo}
              />
            )}

            {currentPage === "educacao-digital" && (
              <Digital
                unidades={unidadesFiltradas}
                indicadores={indicadores}
                ramoSelecionado={filtros.ramo}
              />
            )}

            {currentPage === "formadores" && (
              <Faculty
                unidades={unidadesFiltradas}
                indicadores={indicadores}
                ramoSelecionado={filtros.ramo}
              />
            )}

            {currentPage === "avaliacao" && (
              <Evaluation
                unidades={unidadesFiltradas}
                indicadores={indicadores}
                ramoSelecionado={filtros.ramo}
              />
            )}

            {currentPage === "agenda-formativa" && (
              <Agenda
                unidades={unidadesFiltradas}
                indicadores={indicadores}
                ramoSelecionado={filtros.ramo}
              />
            )}

            {currentPage === "cooperacao" && (
              <Cooperation
                unidades={unidadesFiltradas}
                indicadores={indicadores}
                ramoSelecionado={filtros.ramo}
              />
            )}

            {currentPage === "escolas" && (
              <SchoolsDirectory unidades={unidadesFiltradas} />
            )}

            {currentPage === "dados" && (
              <Downloads unidadesFiltradas={unidadesFiltradas} />
            )}

            {currentPage === "metodologia" && <Methodology />}

            {currentPage === "sobre" && <About />}
          </>
        )}
      </main>

      <Footer onNavigate={handlePageChange} />
    </div>
  );
};
