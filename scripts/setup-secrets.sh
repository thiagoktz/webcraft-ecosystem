#!/usr/bin/env bash
# Sobe os secrets do .env para um Worker do Cloudflare via wrangler.
#
# Uso:   ./scripts/setup-secrets.sh <worker-name>
# Exemplo: ./scripts/setup-secrets.sh webcraft-cache-proxy
#
# Lê /Volumes/Extreme SSD/Webcraft/.env (fora do repo) e sobe cada secret
# definido no array SECRETS abaixo. Aborta se algum valor estiver vazio.

set -euo pipefail

WORKER_NAME="${1:-}"
if [ -z "$WORKER_NAME" ]; then
  echo "Erro: nome do Worker obrigatório."
  echo "Uso: $0 <worker-name>"
  exit 1
fi

# Tenta achar o .env primeiro no caminho padrão, depois no diretório atual
ENV_FILE=""
for candidate in \
  "/Volumes/Extreme SSD/Webcraft/.env" \
  "../.env" \
  "../../.env" \
  "./.env"; do
  if [ -f "$candidate" ]; then
    ENV_FILE="$candidate"
    break
  fi
done

if [ -z "$ENV_FILE" ]; then
  echo "Erro: .env não encontrado em nenhum local conhecido."
  exit 1
fi

echo "→ Lendo secrets de: $ENV_FILE"
echo "→ Worker alvo:      $WORKER_NAME"
echo ""

SECRETS=(
  "GOOGLE_PLACES_API_KEY"
  "UNSPLASH_ACCESS_KEY"
  "WEBCRAFT_AUTH_TOKEN"
)

# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

for SECRET in "${SECRETS[@]}"; do
  VALUE="${!SECRET:-}"
  if [ -z "$VALUE" ] || [ "$VALUE" = "COLE_AQUI" ]; then
    echo "✘ $SECRET vazio no .env — pulando."
    continue
  fi
  echo "→ Subindo $SECRET..."
  echo -n "$VALUE" | npx -y wrangler secret put "$SECRET" --name "$WORKER_NAME"
  echo ""
done

echo "✓ Concluído."
echo ""
echo "Para verificar:  npx wrangler secret list --name $WORKER_NAME"
