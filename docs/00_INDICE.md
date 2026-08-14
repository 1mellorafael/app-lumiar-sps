# 📖 ÍNDICE — DOCUMENTAÇÃO APP DE LUMIAR (reorganizada em 14/08/2026)

## Por que reorganizei

O projeto passou por vários pivots reais (o modelo Prestador vs Negócio mudou
umas 4 vezes, avaliações mudaram de obrigatórias → só rating → com comentário
opcional → pergunta reaberta, CNPJ virou obrigatório e depois saiu do MVP
inteiro). Isso é normal em fase de planejamento, mas deixou 19 documentos
onde vários se contradizem — quem ler do zero não sabe qual decisão vale.

Consolidei tudo em **8 documentos**, cada um representando o **estado atual**
das decisões. Nenhuma ideia foi perdida — o que ficou obsoleto está listado
abaixo, com o motivo, caso você precise resgatar algo.

## Novo conjunto de documentos

| Arquivo | Conteúdo |
|---|---|
| `01_VISAO_GERAL.md` | Missão, visão, usuários, problema que resolve |
| `02_ESCOPO_MVP_ATUAL.md` | **O documento mais importante** — escopo atual (V0), cadastro, verificação, busca, moderação |
| `03_ARQUITETURA_TECNICA.md` | Stack, database, API, segurança, performance, custo |
| `04_GITHUB_PRATICAS.md` | Workflow de branches/commits (sem mudanças, ainda válido) |
| `05_IDEIAS_E_DECISOES_UX.md` | Brainstorm de ideias + decisões de UX já fechadas |
| `06_VISAO_LONGO_PRAZO.md` | Fases futuras (negócio, marketplace, turismo, app nativo) |
| `07_STATUS_ATUAL.md` | O que está decidido, o que está pendente, próximos passos |
| `08_PENDENCIAS_ABERTAS.md` | Lista curta de tudo que ainda precisa de decisão sua |

## Documentos arquivados (obsoletos — não use mais)

| Arquivo antigo | Por que ficou obsoleto |
|---|---|
| `NEGOCIO_PRESTADOR_FINAL.md` | Modelo de Negócio revisado várias vezes depois; Negócio saiu do MVP (V0) |
| `PRESTADOR_VS_NEGOCIO.md` | Eram perguntas em aberto, todas já respondidas em docs posteriores |
| `DECISOES_FINAIS_MVP.md` | Escopo com Negócio+CNPJ obrigatório — substituído pelo V0 simplificado |
| `VERIFICACAO_SOLUCOES.md` | Fluxo de verificação de Negócio — não se aplica mais (Negócio fora do MVP) |
| `DECISOES_FINAIS_REFINADAS.md` | CNPJ, badges e busca — versões posteriores mudaram essas regras |
| `VERIFICACAO_REFINADA_FINAL.md` | CNPJ obrigatório, 4 tipos de badge, comentário obrigatório — tudo revertido depois |
| `CLARIFICACOES_FINAIS.md` | Regras de idade/termos/fotos — versão final está no AJUSTES_FINAIS_V2 e no V0 |
| `AJUSTES_FINAIS_V2.md` | Geo-restrição e CNPJ automático de Negócio — não se aplica (Negócio fora do MVP) |
| `AJUSTES_V4.md` | Decisão de login único já esta em `02_ESCOPO_MVP_ATUAL.md`; resto revisto no PIVOT |
| `PIVOT_APP_ABERTO_V3.md` | A ideia central (app aberto, lazy signup) **sobreviveu** e está no `02`; os detalhes de Negócio/CNPJ/badge foram removidos no V0 |
| `ANALISE_PERGUNTAS_BRAINSTORM.md` | Era uma análise de opções; as decisões finais já estão em `05_IDEIAS_E_DECISOES_UX.md` |
| `V0_ESCOPO_SIMPLIFICADO.md` | Conteúdo incorporado no `02_ESCOPO_MVP_ATUAL.md` (era o pivot mais recente) |
| `1_VISAO_ESCOPO.md` | Incorporado (trimado) no `01_VISAO_GERAL.md` |
| `MINHAS_RECOMENDACOES_FINAL.md` | Incorporado no `03_ARQUITETURA_TECNICA.md` |
| `DECISOES_FALTANTES.md` | Incorporado no `03_ARQUITETURA_TECNICA.md` |
| `CURRENT_STATUS.md` | Substituído pelo `07_STATUS_ATUAL.md` (atualizado) |

**Recomendação:** pode apagar os 16 arquivos antigos do seu repositório/pasta
de planejamento assim que confirmar que os novos 8 cobrem tudo que importa.
Se quiser, eu mantenho os antigos guardados só como histórico numa pasta
`/arquivo-historico`.
