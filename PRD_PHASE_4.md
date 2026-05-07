# PRD — Deezer Explorer (Fase 4)

## Goal

Exibir os detalhes do álbum selecionado usando `GET /album/{id}`, incluindo capa, data de lançamento e tracklist ordenada, com navegação de volta para a lista de álbuns sem perder o contexto do artista selecionado.

## Scope

- Consumir `GET /album/{id}` após a seleção de um álbum.
- Renderizar detalhes do álbum com:
  - capa do álbum;
  - data de lançamento;
  - lista de faixas em ordem.
- Manter contexto do artista selecionado para retorno ao estado anterior.
- Implementar ação de voltar da tela de detalhe para a lista de álbuns.
- Manter interface simples, responsiva e mobile-first.
- Implementação 100% frontend (sem backend), usando APIs nativas do navegador.

## Out of scope

- Backend, banco de dados, autenticação ou qualquer componente server-side.
- Redesign visual, alteração estrutural ampla de layout ou troca de stack.
- Roteamento avançado (history API complexa, rotas aninhadas, etc.).
- Reprodução de áudio, favoritos, compartilhamento, paginação ou cache.
- Otimizações avançadas fora do fluxo principal da Fase 4.

## User flow

1. Usuário pesquisa artista (já implementado).
2. Usuário seleciona artista e visualiza álbuns (já implementado).
3. Usuário seleciona um álbum.
4. Aplicação solicita `GET /album/{id}`.
5. UI mostra estado de carregamento do detalhe.
6. UI exibe detalhes: capa, data de lançamento e tracklist ordenada.
7. Usuário aciona “voltar”.
8. UI retorna para a lista de álbuns do artista previamente selecionado, preservando contexto.

## UI states

- **Loading (detalhe)**
  - Exibido entre a seleção do álbum e a resposta da API.
  - Deve manter feedback claro e não bloquear a navegação principal.

- **Results (detalhe carregado)**
  - Exibe capa, data de lançamento e tracklist na ordem recebida da API.

- **Empty/partial data**
  - Quando campos estiverem ausentes (ex.: release date não informada), exibir fallback textual sem quebrar layout.
  - Se tracklist vier vazia, exibir mensagem explícita.

- **Error**
  - Exibir mensagem clara quando a requisição falhar.
  - Permitir tentativa de retorno à lista de álbuns sem quebrar o fluxo.

- **Back navigation**
  - Ação explícita de voltar para a lista de álbuns do artista atual.
  - Não deve perder o contexto de seleção do artista.

## Technical notes

- Endpoint da fase: `GET https://api.deezer.com/album/{id}` (respeitando a estratégia de acesso já adotada no projeto).
- Usar `fetch` com tratamento simples de erro de rede/resposta inválida.
- Reutilizar estado em memória já existente (`selectedArtistId`, `selectedAlbumId` e contexto de lista de álbuns).
- Não introduzir framework, biblioteca de roteamento ou abstrações complexas.
- Garantir ordem da tracklist conforme retorno da API, sem reordenação manual.
- Manter implementação pequena e focada no fluxo principal.

## Acceptance criteria

1. Selecionar um álbum dispara requisição `GET /album/{id}`.
2. A tela de detalhe exibe capa do álbum.
3. A tela de detalhe exibe data de lançamento (ou fallback claro quando ausente).
4. A tracklist é exibida em ordem, conforme API.
5. Estado de loading aparece durante a requisição.
6. Estado de erro aparece em falha de requisição, sem quebrar a aplicação.
7. Ação de voltar retorna para a lista de álbuns do artista selecionado.
8. Contexto do artista é preservado após voltar.
9. Interface continua responsiva e sem redesign.
10. Não há backend ou roteamento avançado adicionados.

## Manual validation

- Selecionar um álbum com faixas e confirmar:
  - capa renderizada;
  - data de lançamento exibida;
  - tracklist em ordem.
- Validar álbum com dados incompletos (quando possível) para fallback de campos.
- Simular falha de rede/API e confirmar estado de erro.
- Acionar “voltar” no detalhe e confirmar retorno para lista de álbuns do artista atual.
- Repetir fluxo em viewport mobile e desktop para checar legibilidade e navegação.
- Testar navegação por teclado nos controles principais (incluindo voltar).

## Risks

- Instabilidade de CORS/proxy pode afetar carregamento de detalhes do álbum.
- Dados incompletos da API (ex.: campos ausentes) podem exigir fallback consistente.
- Tracklists longas podem impactar usabilidade em telas pequenas se não houver tratamento de scroll adequado.

## Open decisions

- Back navigation será apenas controle explícito em memória ou também refletido em URL/hash simples.
- Estratégia final para lidar com falhas recorrentes de CORS/proxy no ambiente de produção.
- Nível de detalhe a exibir por faixa nesta fase (somente título vs. metadados adicionais simples).
