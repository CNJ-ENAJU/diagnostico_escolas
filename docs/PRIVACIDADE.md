# Política de Proteção de Dados e Privacidade (LGPD)

> **Diagnóstico Nacional das Unidades de Formação do Poder Judiciário**  
> **Conselho Nacional de Justiça (CNJ) · Escola Nacional do Judiciário (ENAJU)**

---

## 1. Princípios de Privacidade Aplicados

O Painel Público foi projetado segundo o princípio de **Privacy by Design**, garantindo estrita aderência à Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018):

1. **Anonimização de Contatos:** Todas as informações relativas às pessoas físicas que preencheram o formulário pelo tribunal foram expurgadas da camada pública.
2. **Exclusão de Campos Sensíveis:** É vedada a disponibilização pública de:
   - Nome do respondente;
   - E-mail institucional ou pessoal;
   - Número de telefone / celular;
   - Nome para assinatura;
   - Cargo ou função pessoal individual;
   - Comentários ou observações livres que permitam identificação de pessoas.
3. **Isolamento de Base Bruta:** A aplicação front-end jamais faz requisições ou possui acesso à base primária `01_base_respostas_organizada.csv`. Apenas a camada estática sanitizada `data_public/` é compilada e servida.

---

## 2. Teste Automatizado de Privacidade no Pipeline de CI/CD

O repositório inclui o script automatizado `scripts/validate_public_data.py`, executado a cada build:
* O script inspeciona todas as colunas de todos os arquivos CSV e JSON gerados;
* Caso qualquer coluna contenha termos associados a PII (`email`, `telefone`, `cpf`, `assinatura`, `respondente`, etc.), o script interrompe o pipeline com código de erro 1 e impede o deploy.
