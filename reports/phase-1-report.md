# Relatório Fase 1 — Deezer Explorer

## Resumo
- Fase 1 concluída com UI local (sem API), seguindo o PRD.
- Fluxo funcional: digitar artista, submeter busca, ver loading simulado, receber resultado mock ou estado vazio.
- Busca mock validada para nomes comuns e para `Matue`.

## Arquivos modificados
- `index.html`
- `styles.css`
- `main.js`
- `PRD_PHASE_1.md`

## Decisões técnicas
- Implementação com HTML/CSS/JS puro, sem framework e sem backend.
- Estrutura semântica (`header`, `main`, `section`, `form`) e navegação por teclado.
- Estados locais em memória: idle, loading, resultados e vazio.
- Busca mock com normalização de texto (case-insensitive e tolerância a acentos).

## Validação
- Teste local executado com servidor Python.
- Submissão funciona por clique no botão e tecla Enter.
- Indicador de loading e transição de estado sem recarregar a página.
- Layout responsivo verificado em mobile e desktop, sem overflow horizontal.
- Foco visível e controles principais acessíveis via teclado.

## Critérios do PRD atendidos
- Blocos de header, busca e resultados presentes e separados.
- Busca com submit por botão e Enter implementada.
- Transições de estado locais sem reload implementadas.
- Nenhuma chamada de API (comportamento 100% mock/local).
- Acessibilidade básica (teclado + foco visível) implementada.
- Usabilidade em ~320px e desktop atendida.

## Problemas corrigidos
- Ajuste da busca mock para encontrar `Matue` com variações de digitação.
- Padronização de mensagens de estado (idle/loading/empty) para feedback claro.
- Melhoria de foco visível e navegação de teclado nos controles principais.

## Limitações
- Sem integração com API Deezer nesta fase.
- Sem lista de álbuns, detalhe de álbum e trilhas (fases seguintes).
- Sem paginação, cache, roteamento avançado ou persistência de estado.
