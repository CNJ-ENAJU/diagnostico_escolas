# Guia de Manutenção e Atualização de Dados

> **Diagnóstico Nacional das Unidades de Formação do Poder Judiciário**  
> **Conselho Nacional de Justiça (CNJ) · Escola Nacional do Judiciário (ENAJU)**

---

## 1. Como Atualizar os Dados do Painel

Se a base intermediária for reprocessada pelo pipeline do relatório oficial (`04_Relatorio/scripts/preparar_dados_relatorio.py`), a atualização do painel é executada em três passos rápidos:

```bash
# 1. Regenerar a camada pública sanitizada (CSV e JSON)
npm run data

# 2. Executar a suíte de testes de integridade e privacidade
npm run test

# 3. Compilar a nova versão estática do front-end
npm run build
```

---

## 2. Comandos Disponíveis no `package.json`

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento local do Vite com recarregamento em tempo real (HMR). |
| `npm run build` | Compila os arquivos estáticos otimizados para produção dentro da pasta `dist/`. |
| `npm run preview` | Executa um servidor local para inspecionar os arquivos da pasta `dist/`. |
| `npm run data` | Executa o script Python `scripts/build_public_data.py`. |
| `npm run test` | Executa a validação automatizada `scripts/validate_public_data.py`. |
