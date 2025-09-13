Título: Hardening do backend, configuração de ambiente e Docker pronto para produção

Resumo
- Endurece a imagem Docker e adiciona libs de sistema (Pillow etc.).
- Torna as configurações mais robustas a envs e CSRF do frontend.
- Corrige uso de credenciais/URL da Frenet e mensagens de erro.
- Libera autenticação de webhooks (AllowAny) enquanto não há verificação de assinatura.
- Simplifica o entrypoint removendo recriação de migrações em runtime.
- Adiciona `requirements.prod.txt` com dependências pinadas para produção.
- Expande o README com instruções de execução e variáveis de ambiente.

Por que essas mudanças
- backend/Dockerfile
  - Inclui bibliotecas de build e imagem do Alpine (jpeg, zlib, freetype, tiff, etc.) para que o Pillow e pacotes relacionados compilem/rodem de forma confiável em produção.
  - Passa a usar `requirements.prod.txt` para builds determinísticos (separado de dependências só de desenvolvimento).
  - Remove `collectstatic` do estágio de build para evitar acoplamento com variáveis/armazenamento de runtime; a coleta ocorre na inicialização via entrypoint.

- backend/backend/settings.py
  - Parsing de DEBUG mais seguro: evita o padrão `== True`, que é frágil com strings vindas do ambiente; em caso de valor inválido, assume False (mais seguro em prod).
  - Introduz `FRONTEND_DOMAIN` e adiciona `http://` (além de `https://`) aos `CSRF_TRUSTED_ORIGINS` para facilitar desenvolvimento local.
  - Agrupa/documenta chaves de API; mantém compatibilidade com `FRENET_TOKEN`, priorizando `FRENET_API_KEY`.
  - Adiciona `FRENET_API_URL` para não fixar endpoint no código e permitir configuração por ambiente.

- backend/core/serializers.py
  - Lê credenciais da Frenet de `FRENET_API_KEY` ou `FRENET_TOKEN` e exige `FRENET_API_URL`. Em caso de falta de configuração, retorna erro de validação claro (evita falhas silenciosas).
  - Usa a URL computada (`api_url_frenet`) ao invés de referenciar diretamente `settings`, alinhando a validação e a chamada.

- backend/core/views.py
  - Define `AllowAny` para webhooks do Mercado Pago e da Frenet. Normalmente webhooks não enviam API Key do cliente; o correto é validar a assinatura/HMAC (a ser implementado). A mudança restaura a acessibilidade dos webhooks e sinaliza o próximo passo de segurança.

- backend/scripts/entrypoint.sh
  - Remove a deleção/recriação de migrações na subida do contêiner. Recriar migrações em runtime é arriscado e pode corromper o histórico; as migrações devem ser versionadas e aplicadas de forma determinística. Mantém `migrate` e `collectstatic` na inicialização.

- backend/requirements.prod.txt
  - Adiciona um conjunto pinado de dependências (Django, DRF, Pillow, psycopg2-binary, requests, gunicorn, etc.) para builds reproduzíveis e sem upgrades surpresa.

- README.md
  - Expande instruções com uso de Docker, variáveis de ambiente e notas de arquitetura. Reforça que segredos não devem ir para o bundle do frontend e que webhooks devem validar assinatura, não exigir API Key do cliente.

Notas e próximos passos
- Implementar validação de assinatura/HMAC para MP e Frenet.
- Garantir que `CSRF_TRUSTED_ORIGINS` reflita os domínios em produção (http/https conforme o caso).
- Se usar S3 ou outro backend de estáticos, mover `collectstatic` para a etapa de deploy com credenciais adequadas.
