#!/bin/zsh
cd "${0:A:h}"
if curl -fsS http://localhost:4177/api/network >/dev/null 2>&1; then
  open http://localhost:4177
  print 'Teklif zaten açık. Telefon bağlantısını oyundaki Oda aç ekranında bulabilirsin.'
  exit 0
fi
if command -v node >/dev/null 2>&1; then
  teklif_node="$(command -v node)"
else
  teklif_node="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [[ ! -x "$teklif_node" ]]; then
  print 'Node.js bulunamadı. nodejs.org adresinden Node.js 22 veya üzerini kurup yeniden dene.'
  read -k 1
  exit 1
fi
(sleep 1; open http://localhost:4177) &
print 'Bu pencere oyun boyunca açık kalsın. Bitirmek için Ctrl+C kullanabilirsin.'
exec /usr/bin/caffeinate -i "$teklif_node" server.mjs
