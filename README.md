# 💎 Topaz Tools - Topaz Core Banking

> Uma suíte de ferramentas de alta performance desenvolvida com **Next.js** para decodificação e análise de dados técnicos (Logs, Colas de Mensageria e Indicadores).

## 📋 Sobre o Projeto

O **Topaz Tools** foi criado para resolver a necessidade de analisar grandes volumes de dados de log e decodificar strings complexas de sistemas legados de forma rápida e eficiente, rodando inteiramente no navegador para garantir privacidade e velocidade.

O projeto segue rigorosamente princípios de **Clean Code** e **Domain-Driven Design (DDD)**, garantindo uma base de código manutenível, escalável e testável.

---

## 🚀 Tecnologias e Arquitetura

O projeto utiliza uma stack moderna focada em performance e experiência do usuário:

*   **Core:** [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
*   **Linguagem:** TypeScript (Tipagem estrita)
*   **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
*   **Armazenamento Local:** [Dexie.js](https://dexie.org/) (IndexedDB Wrapper) para processamento de gigabytes de dados no client-side.
*   **Ícones:** [Lucide React](https://lucide.dev/)
*   **Arquitetura:** Clean Architecture / DDD (Separação clara entre Domínio, Aplicação e Infraestrutura).

---

## 🛠️ Funcionalidades

### 1. 📜 Log Decoder
Uma ferramenta poderosa para análise de arquivos de log massivos sem travar o navegador.

*   **Processamento de Arquivos Gigantes:** Suporta arquivos de até **1GB+** utilizando *streams* e *chunks*.
*   **Indexação Local:** Utiliza IndexedDB para indexar e buscar logs instantaneamente.
*   **Filtros Contextuais:** Permite filtrar por `Contexto`, `Nível` (Info, Erro, Debug) e `Mensagem`.
*   **Paginação Virtualizada:** Renderização eficiente de milhares de linhas.
*   **Preview Instantâneo:** Visualização imediata do conteúdo.

![Screenshot Log Decoder](https://placehold.co/600x400?text=Screenshot+Log+Decoder)

### 2. 🧩 Cola Decoder
Decodificador para strings de mensageria de sistemas legados (campo "COLA").

*   **Integração com Clipboard:** Botão "Colar" inteligente.
*   **Mapa de Campos:** Visualização tabular com `Tipo`, `Campo`, `Tamanho`, `Valor Atual` e `Valor Anterior`.
*   **Dicas Visuais:** Tooltips explicativos sobre o significado de cada campo (MVTOS, Livre, etc.).
*   **Contagem Automática:** Validação de tamanho da string.

![Screenshot Cola Decoder](https://placehold.co/600x400?text=Screenshot+Cola+Decoder)

### 3. 📊 Indicador Decoder (MOV-INDICATORS)
Módulo especializado para visualização de indicadores de movimento.

*   **Grid Configurável:** Ajuste dinâmico de colunas (Padrão: 25).
*   **Visualização Clara:** Bits e flags exibidos de forma organizada.

![Screenshot Indicador Decoder](https://placehold.co/600x400?text=Screenshot+Indicador+Decoder)

---

## 📂 Estrutura do Projeto

A estrutura de pastas reflete a arquitetura DDD adotada:

```
tools-topaz/
├── app/                  # Camada de Aplicação (Next.js App Router)
│   ├── log-decoder/      # Funcionalidade de Log
│   ├── cola-decoder/     # Funcionalidade de Cola
│   └── ...
├── components/           # Componentes UI Reutilizáveis (Shadcn/Radix)
├── domain/               # Camada de Domínio (Regras de Negócio, Entidades, Interfaces)
│   ├── log/              # Regras de Domínio de Log
│   └── cola/             # Regras de Domínio de Cola
├── hooks/                # Hooks Customizados (React)
├── lib/                  # Utilitários Gerais
└── public/               # Assets Estáticos
```

---

## 🏁 Instalação e Uso

### Pré-requisitos
*   **Node.js**: Versão 18 ou superior.
*   **Gerenciador de Pacotes**: npm, pnpm ou yarn.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/tools-topaz.git
    cd tools-topaz
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    pnpm install
    # ou
    yarn install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    pnpm dev
    ```

4.  **Acesse a aplicação:**
    Abra seu navegador em [http://localhost:3000](http://localhost:3000).

### Comandos Úteis

*   `npm run build`: Cria a versão de produção otimizada.
*   `npm run start`: Inicia o servidor de produção.
*   `npm run lint`: Executa a verificação de código (ESLint).

---

## 🤝 Contribuição

Contribuições são bem-vindas! Se você deseja melhorar este projeto:

1.  Faça um **Fork** do projeto.
2.  Crie uma nova *Branch* (`git checkout -b feature/minha-feature`).
3.  Faça o **Commit** das suas alterações (`git commit -m 'Adiciona nova feature'`).
4.  Faça o **Push** para a Branch (`git push origin feature/minha-feature`).
5.  Abra um **Pull Request**.

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT** - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Copyright © 2026 **Fernando Duarte**.
