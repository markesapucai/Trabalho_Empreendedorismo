# Entrega 3 – Proposta de Valor, Modelo de Negócio e Definição do MVP

**Disciplina:** Empreendedorismo em Sistemas de Informação (2026/2) · Prof. Johnatan Oliveira

**Proposta de Empreendimento Digital:** EcoObra

**Repositório Oficial no GitHub:** [github.com/markesapucai/Trabalho_Empreendedorismo](https://github.com/markesapucai/Trabalho_Empreendedorismo)

**Integrantes do Grupo:** Gracielle da Mata Ázara, Mark Leite Sá, Matheus Roberto da Cunha, Mateus Mendonça Sandrin e Miguel Arthur de Paula Coelho

## 1. Parte A – Proposta de Valor

**1.1 Segmento prioritário.** Moradores, inquilinos e pequenos comerciantes de Lavras-MG que fazem pequenas reformas residenciais ou comerciais, geram até 1,5 m³ de entulho (cerca de 50 sacos de ráfia) e não têm veículo de carga próprio. Na Entrega 2, esse perfil apareceu principalmente nas classes C e D.

**1.2 Problema prioritário.** Falta um jeito rápido e confiável de contratar a retirada de pequenos volumes de entulho. Hoje o gerador depende de indicação informal (pedreiro, WhatsApp, Facebook), espera de 1 a 9 dias com os sacos na calçada, paga um preço sem padrão (R$ 50 a R$ 180) e não sabe se o descarte foi legal. A caçamba estacionária (R$ 380 a R$ 400, 3 a 5 m³) existe, mas é superdimensionada para esse volume e só é escolhida quando há exigência de comprovante.

**1.3 Necessidade central.** Retirada rápida do entulho, preço previsível e proporcional ao volume, e comprovação de que o resíduo foi levado a um local autorizado.

**1.4 Proposta de valor.** O EcoObra conecta quem faz pequenas reformas a freteiros credenciados de Lavras: o morador informa a quantidade de sacos, vê o preço na hora, a coleta é feita em até 24 horas e ele recebe um comprovante digital de que o entulho foi descartado em local autorizado.

**1.5 Benefício principal.** Calçada ou imóvel liberado rapidamente, sem negociar preço e sem pagar pelo espaço vazio de uma caçamba.

**1.6 Diferenciais.**

- Preço fixo calculado pela quantidade de sacos, exibido antes da contratação, sem negociação informal.
- Comprovante Digital de Destinação (Selo EcoDescarte), com local de descarte, data e transportador.
- Rede de freteiros locais que já descartam em locais autorizados, recebendo pedidos organizados com foto, endereço e volume.

**1.7 Justificativa baseada nas evidências.** Na Entrega 2, os 6 moradores entrevistados geraram menos de 1,5 m³ de entulho. As evidências indicaram que a dor principal não é só o preço: pesaram mais a demora e a falta de disponibilidade do transportador (M1, M4, M5, P2), a incerteza sobre o destino do entulho (4 de 6 moradores) e a necessidade de comprovante para prestar contas (M5, F2). A H2, sobre a caçamba ser cara, foi enfraquecida, por isso o foco da proposta está em rapidez e confiança. A rejeição da comissão por corrida pelos dois freteiros (H7) levou a cobrança para o gerador.

## 2. Parte B – Modelo de Negócio (Business Model Canvas)

| Bloco | Descrição |
| --- | --- |
| 1. Segmentos de clientes | **Geradores (clientes pagadores):** moradores, inquilinos e pequenos comerciantes em reformas de até 1,5 m³ em Lavras. **Freteiros (lado da oferta):** motoristas autônomos de picape, utilitário ou caminhão 3/4 que já levam entulho a local autorizado. **Influenciadores:** pedreiros e mestres de obras autônomos, que indicam o transportador em quase toda obra pequena. |
| 2. Proposta de valor | **Gerador:** coleta em até 24 h, preço fixo pela quantidade de sacos e comprovante de descarte em local autorizado. **Freteiro:** pedidos organizados (foto, endereço, volume), ocupação dos dias ociosos e selo que o diferencia de quem descarta irregularmente. |
| 3. Canais | **Aquisição:** indicação de pedreiros parceiros, material de divulgação em depósitos de material de construção de bairro, grupos comunitários de WhatsApp e Facebook. **Entrega de valor:** PWA acessível pelo navegador do celular, sem instalação. |
| 4. Relacionamento | **Gerador:** autoatendimento no app, atualização de status do pedido e suporte humano por WhatsApp. **Freteiro:** cadastro e credenciamento acompanhados pela equipe, canal de suporte dedicado e regras claras de repasse. |
| 5. Fontes de receita | **Taxa de serviço paga pelo gerador**, embutida no preço fixo da coleta (ver tabela abaixo). **Futuro, a validar:** mensalidade opcional para freteiros (prioridade nos pedidos e selo Freteiro Verde) e comprovante detalhado para comerciantes que prestam contas, como sugerido por M5. |
| 6. Recursos-chave | Plataforma web e regra de cálculo de preço; base de freteiros credenciados; cadastro de locais de descarte autorizados em Lavras; marca EcoObra; infraestrutura em nuvem. |
| 7. Atividades-chave | Desenvolvimento e manutenção do software; credenciamento de freteiros e verificação dos locais de descarte; prospecção de pedreiros e depósitos parceiros; marketing local. |
| 8. Parceiros-chave | Pedreiros e mestres de obras (canal de indicação); depósitos de material de construção (divulgação no ponto de venda); ecopontos e áreas de triagem licenciadas (destino do resíduo); Prefeitura de Lavras (informação sobre locais autorizados). |
| 9. Estrutura de custos | Repasse ao freteiro, que inclui o custo de descarte cobrado por carga no local autorizado; hospedagem e banco de dados; taxas de processamento de pagamento; incentivo a pedreiros parceiros (ex.: bonificação por indicação, a definir); marketing digital regional e material gráfico para depósitos. |

**Precificação preliminar.** A tabela abaixo é uma proposta inicial do grupo, ancorada nos valores pagos pelos entrevistados na Entrega 2 (R$ 50 a R$ 180 por retirada). Os valores e a divisão serão testados na Entrega 4.

| Faixa | Quantidade de sacos | Volume aproximado | Preço ao gerador | Repasse ao freteiro (≈ 80%) | Taxa EcoObra (≈ 20%) |
| --- | --- | --- | --- | --- | --- |
| P | 1 a 10 | até 0,3 m³ | R$ 70 | R$ 56 | R$ 14 |
| M | 11 a 25 | 0,33 a 0,75 m³ | R$ 110 | R$ 88 | R$ 22 |
| G | 26 a 50 | 0,78 a 1,5 m³ | R$ 170 | R$ 136 | R$ 34 |

O repasse ao freteiro cobre o transporte e o custo de descarte no local autorizado. Pedidos acima de 50 sacos ficam fora do escopo e o sistema sugere a contratação de caçamba.

## 3. Parte C – Personal Business Model Canvas da Equipe

| Bloco | Descrição |
| --- | --- |
| Quem somos e o que temos (recursos e conhecimentos) | Cinco estudantes de Sistemas de Informação da UFLA com conhecimento em desenvolvimento web, bancos de dados, metodologias ágeis e pesquisa com usuários. Computadores próprios, internet e ferramentas gratuitas (GitHub, Vercel, Supabase, Figma). |
| Competências | Programação de frontend e backend, modelagem de dados, condução de entrevistas, análise de evidências e escrita de documentação. |
| O que fazemos (atividades) | Modelagem e codificação do PWA, gestão do repositório e das Issues no GitHub, entrevistas e testes de usabilidade, elaboração de relatórios. |
| Rede de contatos | Os 11 participantes da Entrega 2 (moradores, pedreiros e freteiros), depósitos de material de construção onde os profissionais foram abordados, grupos comunitários de Lavras e colegas e professores da UFLA. |
| Quem nos ajuda (apoios) | Professor da disciplina (orientação), participantes das entrevistas e dos testes, freteiros e pedreiros dispostos a experimentar o MVP. |
| Como ajudamos (valor entregue) | Uma solução testada com a comunidade de Lavras para o descarte correto de pequenos volumes de entulho, com potencial de reduzir o descarte em terrenos vagos. |
| Quem ajudamos | Moradores e comerciantes em reforma, freteiros que trabalham de forma regular e a comunidade de Lavras. |
| Como interagimos | Reuniões semanais, divisão de tarefas por Issues no GitHub, commits rastreáveis e comunicação diária no grupo do projeto. |
| O que ganhamos (benefícios esperados) | Aprendizado prático sobre validação de startups e desenvolvimento incremental, um projeto real para o portfólio e a nota da disciplina. |
| O que gastamos (esforços e custos) | Horas de estudo e desenvolvimento, deslocamento para entrevistas e testes presenciais em Lavras, tempo de pesquisa de campo. |
| Limitações | Tempo dividido com outras disciplinas e estágios; nenhum integrante tem veículo de carga ou experiência no setor de resíduos; amostra pequena e concentrada em Lavras; sem orçamento para marketing ou serviços pagos; dependência de freteiros voluntários para testar o lado da oferta. |

## 4. Parte D – Visão do Produto de Software

**Nome provisório:** EcoObra

**Descrição.** O EcoObra é uma aplicação web progressiva (PWA) que conecta moradores com pequenos volumes de entulho a freteiros autônomos credenciados de Lavras. O morador informa a quantidade de sacos e envia uma foto; o sistema calcula o volume aproximado e o preço fixo da coleta. O freteiro vê o pedido com foto, bairro e volume, aceita, faz a coleta e registra o local autorizado onde descartou. Ao final, o morador recebe um comprovante digital de destinação.

**Usuário principal:** morador em reforma que precisa tirar o entulho ensacado da calçada de forma rápida e legal.

**Objetivo principal:** reduzir o tempo de espera do entulho na calçada e tornar o descarte de pequenos volumes acessível e comprovado.

**Principal jornada do usuário:**

1. O morador acessa o EcoObra pelo navegador do celular e faz um login simples.
2. Toca em "Solicitar coleta", informa a quantidade de sacos e envia uma foto da pilha.
3. O sistema calcula o volume aproximado pelo número de sacos (cerca de 0,03 m³ por saco) e exibe o preço fixo da faixa correspondente.
4. O morador confirma o endereço e envia o pedido.
5. Um freteiro credenciado vê o pedido no painel, com a foto, o bairro e o volume, e aceita a corrida.
6. O freteiro faz a coleta, leva o entulho a um local autorizado, seleciona esse local no app e anexa uma foto da descarga.
7. O morador recebe o Comprovante Digital de Destinação, que pode baixar em PDF ou compartilhar.

A foto enviada pelo morador não é usada para calcular o preço. Ela serve para o freteiro conferir o entulho antes de aceitar o pedido.

**Resultado esperado:** coleta realizada em até 24 horas e comprovante digital de descarte em local autorizado.

**Funcionalidades candidatas:** cadastro e login de gerador e freteiro; solicitação com quantidade de sacos, foto e endereço; cálculo automático de volume e preço; painel de pedidos para freteiros; registro do local de descarte com foto; comprovante digital em PDF; notificações por WhatsApp; pagamento online; avaliação mútua; rastreamento em tempo real; assinatura para freteiros; marketplace de doação e venda de sobras.

## 5. Parte E – Priorização de Funcionalidades (MoSCoW)

| Prioridade | Funcionalidade | Por quê |
| --- | --- | --- |
| Must Have | Cadastro e login de gerador e freteiro | Necessário para separar os dois lados do fluxo |
| Must Have | Solicitação de coleta com quantidade de sacos, foto e endereço | Entrada do fluxo principal |
| Must Have | Cálculo automático de volume e preço pela quantidade de sacos | Testa a hipótese de preço fixo e previsível |
| Must Have | Painel de pedidos abertos para o freteiro aceitar | Testa o lado da oferta (pedido organizado) |
| Must Have | Encerramento da coleta com seleção do local de descarte autorizado e foto | Base para o comprovante ter credibilidade |
| Must Have | Comprovante Digital de Destinação (tela e PDF) | Principal diferencial apontado pela validação |
| Should Have | Notificações por WhatsApp quando o freteiro aceita o pedido | Melhora a experiência, mas o status na tela basta para o teste |
| Should Have | Pagamento online integrado | No MVP o pagamento é simulado |
| Should Have | Avaliação mútua entre gerador e freteiro | Ajuda na confiança, mas exige volume de uso |
| Could Have | Rastreamento do freteiro em tempo real no mapa | Custo técnico alto para o ganho no teste |
| Could Have | Assinatura mensal para freteiros com selo Freteiro Verde | Modelo de receita ainda a validar (F2) |
| Could Have | Doação e repasse de sobras de materiais | H5 foi enfraquecida na Entrega 2 |
| Won't Have | Gestão de frotas e telemetria para transportadoras | Fora do segmento (obras acima de 3 m³) |
| Won't Have | Reconhecimento automático do volume por imagem com IA | O volume vem da quantidade de sacos; a foto é só referência |
| Won't Have | Aplicativos nativos nas lojas Google Play e App Store | O PWA atende sem custo de publicação |

## 6. Parte F – Escopo do MVP

**6.1 Hipótese central.** Moradores em reforma conseguem solicitar sozinhos a coleta de pequenos volumes de entulho com preço fixo e veem valor no comprovante de destinação; freteiros conseguem encontrar e aceitar pedidos organizados (foto, bairro, volume, valor) e consideram o valor de repasse aceitável.

**6.2 Fluxo principal de ponta a ponta:** gerador informa sacos, foto e endereço → sistema exibe o preço → gerador confirma o pedido → freteiro aceita no painel → freteiro encerra a coleta informando o local de descarte → gerador recebe o comprovante digital.

**6.3 Funcionalidades implementadas:** interface web adaptada ao celular (PWA), cálculo de volume e preço pela quantidade de sacos, lista de pedidos abertos para freteiros, encerramento com local de descarte e foto, tela e PDF do comprovante, e mensagens de erro para entradas inválidas (quantidade zero ou acima de 50 sacos, endereço vazio, foto ausente).

**6.4 Funcionalidades não implementadas:** pagamento real (o fluxo simula a confirmação), notificações por WhatsApp, avaliações, rastreamento em mapa, marketplace de sobras e aplicativos nativos.

**6.5 Por que o escopo é suficiente.** O MVP responde à menor pergunta sobre o valor do negócio: se a conexão entre quem tem pouco entulho e um freteiro credenciado funciona sem negociação informal e gera um comprovante em que o morador confia.

**6.6 Critérios de sucesso nos testes:**

| Público | Critério | Meta |
| --- | --- | --- |
| Moradores (3) | Concluir a solicitação sem ajuda do mediador | 3 de 3 |
| Moradores (3) | Declarar que o comprovante gera confiança ou seria útil | Pelo menos 2 de 3 |
| Moradores (3) | Considerar o preço exibido aceitável | Pelo menos 2 de 3 |
| Freteiros (2) | Encontrar e aceitar um pedido sem ajuda | 2 de 2 |
| Freteiros (2) | Considerar o valor de repasse aceitável e dizer que usaria o painel | Pelo menos 1 de 2 |

O MVP será considerado validado se pelo menos 4 dos 5 participantes concluírem a tarefa sem ajuda e as metas de percepção de valor forem atingidas.

## 7. Parte G – Planejamento Técnico Mínimo

| Item | Escolha |
| --- | --- |
| Tipo de aplicação | Aplicação web responsiva instalável como PWA |
| Frontend | React.js ou Next.js com Tailwind CSS |
| Backend | Supabase (banco, autenticação e armazenamento) ou Node.js com Express |
| Armazenamento de dados | PostgreSQL (via Supabase): usuários, pedidos, freteiros, locais de descarte e comprovantes |
| Armazenamento de fotos | Supabase Storage, Firebase Storage ou Cloudinary |
| APIs externas | Leaflet com OpenStreetMap para validar o endereço em Lavras (opcional no MVP); biblioteca de geração de PDF no navegador (ex.: jsPDF) |
| Serviços de IA | Nenhum no MVP; o volume é calculado pela quantidade de sacos |
| Hospedagem | Vercel ou Render, no plano gratuito |

**Principais riscos técnicos e mitigações:**

- **Upload lento de fotos em conexão móvel fraca.** Compressão da imagem no próprio celular antes do envio.
- **Quantidade de sacos informada errada.** A interface mostra a imagem de um saco de ráfia padrão (cerca de 0,03 m³) como referência, e o freteiro confere pela foto antes de aceitar.
- **Comprovante sem credibilidade.** O freteiro só encerra a coleta escolhendo um local de uma lista de locais autorizados cadastrados pela equipe e anexando foto da descarga; a data e a hora são registradas automaticamente.
- **Lista de locais autorizados incompleta.** A confirmação dos ecopontos e áreas de triagem licenciadas de Lavras junto à Prefeitura, prevista na Entrega 2, precisa ser concluída antes dos testes.
- **Limites do plano gratuito de hospedagem.** O volume de uso nos testes é pequeno; o grupo monitora o consumo no painel do serviço.

## 8. Wireframes Iniciais do MVP

O MVP tem três telas principais, uma para cada etapa do fluxo: o morador pede a coleta, o freteiro aceita e o morador recebe o comprovante.

![Wireframes iniciais do MVP: solicitação, painel do freteiro e comprovante](wireframes.png)

- **Tela 1 – Solicitação do gerador:** campo para tirar ou enviar a foto da pilha de sacos, seletor da quantidade de sacos, volume aproximado e preço da faixa calculados na hora, endereço e botão para confirmar o pedido.
- **Tela 2 – Painel do freteiro:** lista de pedidos abertos em Lavras, cada um com foto, bairro, quantidade de sacos, volume e valor que o freteiro recebe, com botões de detalhes e aceite; abaixo, as corridas em andamento.
- **Tela 3 – Comprovante Digital de Destinação:** código do pedido, data e hora da coleta, bairro do gerador, volume, dados do freteiro e do veículo, local autorizado de descarte e foto da descarga, status "Concluído e verificado" e opções para baixar em PDF ou compartilhar.

Os valores mostrados nas telas são exemplos e seguem a tabela de precificação preliminar da Parte B.

## 9. Plano de Desenvolvimento e Validação do MVP

O MVP estará publicado até 05/11, deixando de 06/11 a 08/11 para os testes com usuários e 09/11 a 10/11 para ajustes e o relatório da Entrega 4.

**9.1 Plano de desenvolvimento**

| Período | Atividades |
| --- | --- |
| 28/10 a 01/11 | Configuração do repositório e das Issues, criação do banco de dados, cadastro dos locais de descarte autorizados, telas do gerador e do freteiro no frontend |
| 02/11 a 05/11 | Rotas de backend, criação do pedido, cálculo de preço por sacos, painel de pedidos, encerramento com local de descarte, geração do comprovante em PDF, deploy na Vercel |
| 06/11 a 08/11 | Testes de usabilidade com 3 moradores e 2 freteiros em Lavras |
| 09/11 a 10/11 | Correção dos problemas encontrados, análise dos resultados e documentação da Entrega 4 |

**9.2 Plano de validação (Entrega 4)**

- **Público:** 5 participantes de Lavras, sendo 3 moradores que fizeram reforma recente e 2 freteiros. Sempre que possível, convidar participantes da Entrega 2.
- **Método:** teste presencial de usabilidade no celular do participante ou da equipe, seguindo o Anexo C do enunciado. O mediador explica que o objetivo é avaliar o software, entrega a tarefa sem explicar como fazê-la e só intervém se o participante travar.
- **Tarefa para moradores:** "Imagine que você tem 15 sacos de entulho na calçada e precisa agendar a retirada usando este sistema."
- **Tarefa para freteiros:** "Imagine que sua caminhonete está livre hoje e você quer encontrar um frete de entulho perto do seu bairro, fazer a coleta e encerrá-la."
- **Registro de cada teste:** objetivo, tarefa, observação do uso, dificuldades, comentário do participante, percepção de valor, sugestão e decisão do grupo.
- **Perguntas finais:** o que o sistema faz, o que foi fácil e difícil, em que situação usaria, o que faltou, o que removeria, qual foi a parte mais valiosa e se o preço (moradores) ou o repasse (freteiros) é aceitável.
- **Métricas:** taxa de conclusão sem ajuda, tempo para completar o fluxo, número de erros e pedidos de ajuda, percepção de utilidade do comprovante e aceitação do preço, conforme os critérios da seção 6.6.
