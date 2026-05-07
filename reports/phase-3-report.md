# Relatório Fase 3 — Deezer Explorer

## Resumo da implementação
- A Fase 3 foi implementada no fluxo após a seleção de artista.
- Cada item de artista agora carrega `artistId` e `artistName` para uso no carregamento de álbuns.
- Foi adicionada a função `loadAlbumsByArtistId(artistId)` para buscar álbuns da Deezer API.
- A lista de resultados passa a renderizar cards de álbum (capa + título) após a seleção do artista.
- A seleção de álbum foi adicionada para armazenar `albumId` e preparar a Fase 4.

## Arquivos modificados
- `main.js`
- `PRD_PHASE_3.md`

## Decisões técnicas
- Implementação mantida em frontend puro, sem backend.
- Requisições feitas com `fetch`, usando o mesmo padrão de proxy já existente no projeto.
- Estrutura de UI preservada (sem mudanças em HTML/CSS).
- Seleção acessível por mouse e teclado (Enter) em artistas e álbuns.
- Fallback de imagem implementado para capas quebradas (`cover` -> placeholder).
- Comportamento de fallback para artistas mantido no fluxo de erro da busca de artistas.

## Validação realizada
- Validação local informada como concluída com servidor Python.
- Fluxo validado: busca de artista -> seleção de artista -> carregamento de álbuns -> seleção de álbum.
- Estados verificados: loading, empty e error no carregamento de álbuns.
- Tratamento de fallback de imagem validado no fluxo de renderização de cards.

## Critérios do PRD concluídos
- Uso de `GET /artist/{id}/albums` após seleção de artista.
- Renderização de cards de álbum com capa e título.
- Comportamento de seleção de álbum implementado.
- Estados de loading, empty e error implementados para álbuns.
- Fallback de imagem implementado para falha de capa.
- UI mantida simples, responsiva e sem redesign.
- Sem introdução de backend.

## Problemas encontrados
- Persistem riscos de instabilidade por dependência de proxy público/CORS para acesso à API.
- Falhas de capa em algumas respostas de álbum exigiram fallback de imagem para manter a interface estável.

## Limitações para a próxima fase
- Detalhes de álbum (tracklist, release date e tela dedicada) ainda não implementados (escopo da Fase 4).
- Fluxo ainda depende de proxy público para chamadas da Deezer API.
- Sem paginação e sem cache (limites atuais do v1).
