# PRD — Deezer Explorer (Fase 5)

## Goal

Finalizar a baseline de qualidade do v1 e preparar o deploy no GitHub Pages usando a estrutura atual do projeto (HTML, CSS e JavaScript puros), sem build tools e sem alterações estruturais.

## Scope

- Executar revisão final de acessibilidade no fluxo principal:
  - busca de artista;
  - seleção de artista;
  - lista de álbuns;
  - detalhe de álbum;
  - navegação de volta.
- Executar revisão de resiliência para estados críticos:
  - loading;
  - empty;
  - error;
  - fallbacks de imagem e dados ausentes.
- Validar responsividade em viewport mobile e desktop sem redesign.
- Definir e documentar estratégia de deploy estático para GitHub Pages com arquivos atuais (`index.html`, `styles.css`, `main.js`).
- Atualizar `README.md` com instruções reais de execução local e publicação no Pages para este projeto sem build.

## Out of scope

- Introdução de Vite, bundlers ou qualquer build tool.
- Backend, banco de dados, autenticação ou proxy próprio.
- Redesign de UI, refatoração ampla de arquitetura, ou troca de stack.
- Roteamento avançado, PWA, cache avançado, paginação ou novos recursos de produto.
- Automação E2E completa nesta fase.

## User flow

1. Usuário abre a aplicação estática.
2. Usuário busca um artista.
3. Usuário seleciona um artista e visualiza álbuns.
4. Usuário seleciona um álbum e visualiza detalhes (capa, release date, tracklist).
5. Usuário retorna para a lista de álbuns.
6. Fluxo permanece funcional em teclado e em diferentes tamanhos de tela.

## Accessibility checks

- Verificar foco visível em todos os controles interativos principais.
- Verificar navegação por teclado (Tab/Enter) em busca, seleção de artista, seleção de álbum e botão de voltar.
- Confirmar semântica mínima já existente (labels, status, aria-live, roles) sem alterar estrutura global.
- Validar ordem de navegação lógica no fluxo principal.
- Confirmar que mensagens de estado são perceptíveis e objetivas.

## Resilience checks

- Validar loading, empty e error para:
  - busca de artistas;
  - carregamento de álbuns;
  - carregamento de detalhe de álbum.
- Validar fallback de capa quando imagem falhar.
- Validar fallback de campos ausentes (ex.: release date e tracklist vazia).
- Validar comportamento com instabilidade de rede/proxy sem quebrar a interface.

## GitHub Pages deployment approach

- Manter deploy estático direto dos arquivos atuais da raiz do projeto.
- Publicar `index.html`, `styles.css` e `main.js` no GitHub Pages sem etapa de build.
- Usar branch de publicação definida no repositório (ex.: `main`/`master` root ou `gh-pages`), documentada no `README.md`.
- Validar aplicação na URL pública do Pages para checar comportamento real de rede/CORS/proxy.

## README update requirements

- Atualizar status do projeto para refletir conclusão até Fase 5.
- Documentar execução local real (servidor estático simples, sem `npm run build`).
- Documentar passos reais de deploy no GitHub Pages para estrutura estática.
- Documentar limitações conhecidas de CORS/proxy e estratégia de fallback atual.
- Manter README consistente com `PLAN.md` adaptado ao estado real do projeto.

## Acceptance criteria

1. Fluxo principal completo funciona via teclado e mouse, sem regressões funcionais.
2. Estados loading/empty/error aparecem corretamente em todos os pontos críticos.
3. Fallbacks de imagem e dados ausentes mantêm a UI estável.
4. Layout permanece utilizável em mobile e desktop sem overflow horizontal relevante.
5. Deploy no GitHub Pages funciona com a estrutura estática atual, sem build tools.
6. `README.md` descreve com precisão setup local, deploy e limitações reais do projeto.
7. Nenhum backend, framework, redesign ou roteamento avançado é introduzido.

## Manual validation

- Executar fluxo completo: busca -> artista -> álbuns -> detalhe -> voltar.
- Executar fluxo apenas com teclado (Tab/Enter) e verificar foco visível.
- Testar termo válido, termo sem resultado e input vazio.
- Simular falha de rede/proxy e validar estados de erro.
- Forçar falha de imagem e validar fallback visual.
- Testar em viewport mobile (~320px) e desktop.
- Publicar no GitHub Pages e repetir validação essencial na URL de produção.

## Risks

- Dependência de proxy/CORS pode gerar instabilidade intermitente em produção.
- Diferenças entre ambiente local e GitHub Pages podem impactar comportamento de rede.
- Falhas de dados externos (campos ausentes) podem afetar percepção de qualidade se mensagens não forem claras.

## Open decisions

- Definir branch/fonte final de publicação no GitHub Pages para este repositório estático.
- Definir política mínima de monitoramento de falhas de proxy/CORS pós-deploy.
- Avaliar se `PLAN.md` será atualizado formalmente para refletir abordagem sem Vite/build tools.
