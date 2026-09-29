# Guia de Deploy e Portabilidade Institucional

> **Diagnóstico Nacional das Unidades de Formação do Poder Judiciário**  
> **Conselho Nacional de Justiça (CNJ) · Escola Nacional do Judiciário (ENAJU)**

---

## 1. Deploy Automatizado no GitHub Pages

O projeto conta com GitHub Actions configurado em `.github/workflows/deploy.yml`:

```yaml
push na branch 'main'
       ↓
Configura Python e Node.js
       ↓
npm run data (gera data_public/)
       ↓
npm run test (roda testes de dados e privacidade)
       ↓
npm run build (compila Vite em dist/)
       ↓
Deploy automático no GitHub Pages (actions/deploy-pages@v4)
```

**Condição de Falha:** Se qualquer teste de privacidade ou de dados falhar no script `validate_public_data.py`, o deploy é abortado imediatamente.

---

## 2. Portabilidade para o Portal da ENAJU

A aplicação é **100% estática e portável**. Não existe acoplamento de rotas com o domínio do GitHub.

Para incorporá-la ao site institucional da ENAJU:
1. Compile a pasta de distribuição:
   ```bash
   npm run build
   ```
2. Copie o conteúdo integral gerado dentro da pasta `dist/` para o diretório de destino do servidor web (por exemplo, Apache, Nginx ou IIS):
   ```text
   /var/www/enaju/diagnostico/
   ```
3. A aplicação funcionará imediatamente em `https://enaju.jus.br/diagnostico/` (ou em qualquer outro subdomínio/subdiretório), pois utiliza caminhos relativos (`./`) e navegação por `HashRouter` (`/#/governanca`).
