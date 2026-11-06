# EcoObra — Frontend Web (PWA)

Camada de interface web progressiva (PWA) desenvolvida para a plataforma **EcoObra**, consumindo a API REST do backend Spring Boot.

---

## 🚀 Como Executar

### Pré-requisitos
- **Node.js** v18+ (testado na v22.20.0)
- **Backend Spring Boot** em execução na porta `8080` (opcional para navegação; os testes de API indicam o status online/offline na barra superior).

### Instalação e Execução
1. Entre na pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências (já instaladas localmente):
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse no navegador:
   ```text
   http://localhost:5173
   ```

---

## 📡 Integração com a API

O frontend comunica-se com a API do backend através do proxy configurado no `vite.config.js` (`/api` -> `http://localhost:8080`).

### Endpoints 100% Integrados:
1. **`POST /api/precificacao/calcular`**
   - **Módulo:** Calculadora e Simulador de Preço (`/calculadora`) e Prévia na Solicitação (`/solicitar`).
   - **Payload:** `{ "quantidadeSacos": number }` (1 a 50).
   - **Resposta:** `{ quantidadeSacos, volumeEstimado, faixaPreco, valorTotal, valorRepasse, taxaEcoObra }`.
2. **`GET /api/locais-descarte`**
   - **Módulo:** Ecopontos e Locais de Descarte Autorizados (`/locais`).
   - **Resposta:** Lista de ecopontos com nome, endereço, bairro, cidade e diretrizes.
3. **`GET /api/locais-descarte/{id}`**
   - **Módulo:** Modal de Detalhes do Local de Descarte (`/locais`).

### Funcionalidades com Sinalização de Status da Arquitetura:
- **`POST /api/pedidos`** (Criação de pedido com fotos e endereço): A interface da Tela 1 valida todos os campos e obtém o orçamento pela API de precificação, mas sinaliza de forma transparente que a gravação do pedido aguarda a conclusão do `PedidoController` no Spring Boot.
- **`GET /api/pedidos/pendentes`** e **`POST /api/pedidos/{id}/aceitar`** (Painel do Freteiro): A interface da Tela 2 foi modelada conforme os wireframes validados na Entrega 3, aguardando a exposição do controller no backend.

---

## 📁 Estrutura de Pastas

```text
frontend/
├── src/
│   ├── assets/               # Imagens e ícones
│   ├── components/           # Componentes reutilizáveis
│   │   ├── AlertMessage.jsx  # Mensagens de alerta (sucesso, erro, info)
│   │   ├── BackendBanner.jsx # Indicador de status do backend em tempo real
│   │   ├── Footer.jsx        # Rodapé institucional
│   │   ├── LoadingSpinner.jsx# Feedback visual de carregamento
│   │   └── Navbar.jsx        # Barra de navegação e menu mobile
│   ├── pages/                # Telas da aplicação
│   │   ├── CalculadoraPreco.jsx  # Integração com /api/precificacao/calcular
│   │   ├── ComprovanteSelo.jsx   # Selo EcoDescarte (Wireframe 3)
│   │   ├── Home.jsx              # Apresentação do EcoObra e faixas de preço
│   │   ├── LocaisDescarte.jsx    # Integração com /api/locais-descarte e /{id}
│   │   ├── PainelFreteiro.jsx    # Visão do transportador (Wireframe 2)
│   │   ├── SolicitacaoColeta.jsx # Formulário do gerador (Wireframe 1)
│   │   └── StatusSistema.jsx     # Painel de diagnóstico e testes da API
│   ├── services/             # Camada de comunicação HTTP
│   │   ├── api.js                # Cliente base fetch com tratamento de erros
│   │   ├── localDescarteService.js# Integração com Locais de Descarte
│   │   └── precificacaoService.js # Integração com Precificação
│   ├── App.jsx               # Roteador SPA baseado em hash e layout raiz
│   ├── index.css             # Design system responsivo
│   └── main.jsx              # Ponto de entrada React
├── index.html
├── package.json
└── vite.config.js            # Configuração do proxy reverso para :8080
```
