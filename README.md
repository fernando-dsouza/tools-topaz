# TOPAZ Tools

Uma suíte de ferramentas desenvolvida com **Next.js** para auxiliar na decodificação e análise de dados técnicos (Logs, Colas de Mensageria e Indicadores).

## 🚀 Tecnologias Utilizadas

* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS
* **Banco de Dados/Backend:** Supabase (utilizado para indexação de logs pesados)
* **Ícones:** Lucide React
* **Componentes UI:** Radix UI / Shadcn UI

---

## 🛠️ Funcionalidades

### 1. Log Decoder
Ferramenta robusta para análise de arquivos de log extensos.
* **Upload de Arquivos:** Suporta arquivos `.log` ou `.txt` de até **1GB**.
* **Processamento via Stream:** O arquivo é lido em pedaços (chunks), permitindo que a interface permaneça responsiva mesmo com arquivos gigantes.
* **Filtros Avançados:** Filtre por **Contexto** ou **Mensagem** para encontrar rapidamente o erro ou evento desejado.
* **Paginação:** Exibição eficiente dos resultados (500 logs por página).
* **Preview:** Visualização instantânea das primeiras linhas do arquivo.

### 2. Cola Decoder
Decodifica strings extraídas do campo "COLA" de sistemas legados ou mensageria.
* **Integração com Clipboard:** Botão "Colar" para facilitar a entrada de dados.
* **Contagem de Caracteres:** Identifica automaticamente a largura da string.
* **Tabela de Dados:** Transforma a string bruta em uma tabela legível baseada nas definições de domínio.

### 3. Indicador Decoder (MOV-INDICATORS)
Módulo especializado para decodificar indicadores de movimento.
* **Configuração de Colunas:** Permite ajustar a quantidade de colunas de indicadores (Padrão: 25).
* **Grid de Visualização:** Exibe os indicadores de forma organizada e tabular.

---

## 🏁 Como Começar

### Pré-requisitos
* Node.js (v18 ou superior)
* Variáveis de ambiente configuradas no `.env.local` (Supabase URL e Key).

### Instalação

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Outros Comandos
* `npm run build`: Compila o projeto para produção.
* `npm run start`: Inicia o servidor em modo produção.
* `npm run lint`: Executa a verificação do ESLint.

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
