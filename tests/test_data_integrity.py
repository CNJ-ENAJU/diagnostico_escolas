# -*- coding: utf-8 -*-
"""
Testes automatizados de integridade da camada de dados públicos do Painel.
Valida:
  - 110 unidades respondentes
  - 92 órgãos
  - 6 ramos analíticos
  - 27 UFs
  - Somas marginais e ausência de campos PII
"""
import unittest
from pathlib import Path
import pandas as pd

PAINEL_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = PAINEL_DIR / "data_public"

class TestDataIntegrity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.df_unidades = pd.read_csv(DATA_DIR / "diagnostico_unidades_publico.csv", encoding="utf-8-sig")
        cls.df_indicadores = pd.read_csv(DATA_DIR / "indicadores_painel_completo.csv", encoding="utf-8-sig")
        cls.df_uf = pd.read_csv(DATA_DIR / "indicadores_por_uf.csv", encoding="utf-8-sig")

    def test_total_unidades(self):
        self.assertEqual(len(self.df_unidades), 110, "A base pública deve conter exatamente 110 unidades.")

    def test_total_orgaos(self):
        self.assertEqual(self.df_unidades.sigla_orgao.nunique(), 92, "Devem estar representados 92 órgãos.")

    def test_ramos_validos(self):
        ramos_esperados = {"Eleitoral", "Estadual", "Trabalho", "Federal", "Militar", "Superior/Conselho"}
        self.assertEqual(set(self.df_unidades.ramo.unique()), ramos_esperados)

    def test_distribuicao_ramos(self):
        contagens = self.df_unidades.groupby("ramo").size().to_dict()
        self.assertEqual(contagens.get("Eleitoral"), 39)
        self.assertEqual(contagens.get("Estadual"), 29)
        self.assertEqual(contagens.get("Trabalho"), 26)
        self.assertEqual(contagens.get("Federal"), 8)
        self.assertEqual(contagens.get("Militar"), 5)
        self.assertEqual(contagens.get("Superior/Conselho"), 3)

    def test_natureza_unidades(self):
        contagens = self.df_unidades.groupby("natureza").size().to_dict()
        self.assertEqual(contagens.get("Escola formalmente instituída"), 86)
        self.assertEqual(contagens.get("Setor de capacitação (gestão de pessoas)"), 17)
        self.assertEqual(contagens.get("Centro/núcleo sem natureza de escola"), 7)

    def test_territorio_27_ufs(self):
        self.assertEqual(self.df_uf.uf.nunique(), 27)
        self.assertEqual(int(self.df_uf.n.sum()), 110)

    def test_ausencia_pii(self):
        termos_proibidos = ["email", "e-mail", "telefone", "cpf", "assinatura", "respondente"]
        for col in self.df_unidades.columns:
            for termo in termos_proibidos:
                self.assertNotIn(termo, col.lower(), f"Coluna '{col}' contém termo proibido '{termo}'")

if __name__ == "__main__":
    unittest.main()
