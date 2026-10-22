# ============================================================
# J&N - Generador de titulares legales (noticias-medios.json)
# Descarga el RSS de Google News (medios peruanos, busqueda
# "Poder Judicial Peru") y guarda los 8 titulares mas recientes
# en noticias-medios.json (mismo formato que consume el sitio).
# Ejecutar 1 vez por dia (ideal: GitHub Actions cron)
#   - name: Renovar titulares legales
#     run: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/generar-noticias-medios.ps1
# Regenera con otra busqueda cambiando la variable $Query.
# ============================================================

$Query    = "Poder+Judicial+Peru"
$FeedUrl  = "https://news.google.com/rss/search?q=$Query&hl=es-419&gl=PE&ceid=PE:es"
$Destino  = Join-Path $PSScriptRoot "..\assets\data\noticias-medios.js"
$Excluir  = @('Facebook','Instagram','YouTube','WhatsApp','X (formerly Twitter)','Twitter','TikTok')
$N        = 8

Write-Host "Descargando RSS: $FeedUrl"
$UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
$resp = Invoke-WebRequest -Uri $FeedUrl -UserAgent $UA -TimeoutSec 30 -UseBasicParsing
$xmlOk = $resp.Content -match '<(rss|feed)'
if (-not $xmlOk) { throw "La respuesta no es XML de RSS (posible bloqueo). Abandonando: regenerar mas tarde om cambia la fuente." }

$feed = [xml]$resp.Content
$items = @()
foreach ($it in ($feed.rss.channel.item)) {
  if ($items.Count -ge $N) { break }
  $srcNode = $it.SelectSingleNode('./source')
  if (-not $srcNode) { continue }
  $src = $srcNode.InnerText.Trim()
  if ($Excluir -contains $src) { continue }
  $t = $it.SelectSingleNode('./title').InnerText.Trim()
  if ($src -and $t.EndsWith(" - $src")) { $t = $t.Substring(0, $t.Length - 3 - $src.Length) }
  $l = $it.SelectSingleNode('./link').InnerText.Trim()
  $d = $it.SelectSingleNode('./pubDate').InnerText.Trim()
  if (-not $t) { continue }
  $items += [ordered]@{ title = $t; link = $l; pubDate = $d; fuente = $src }
}

if ($items.Count -lt 1) { throw "No se obtuvieron titulares validos." }

# Ordenar por fecha: mas reciente primero
$items = @($items) | Sort-Object { [DateTimeOffset]::Parse($_.pubDate, [System.Globalization.CultureInfo]::InvariantCulture).UtcDateTime } -Descending

# Escribir como JavaScript (window.TITULARES_MEDIOS_DATA): carga por <script>,
# funciona incluso abriendo el index.html con doble click (sin CORS)
$json = ConvertTo-Json @($items) -Depth 3
$js = "// Generado automaticamente por scripts/generar-noticias-medios.ps1 - NO editar a mano`r`n" +
      "// Fuente: Google News RSS (`"$Query`")  -  Generado: $(Get-Date -Format 'yyyy-MM-dd HH:mm')`r`n" +
      "window.TITULARES_MEDIOS_DATA = $json;"
# UTF-8 SIN BOM
[System.IO.File]::WriteAllText($Destino, $js, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "OK -> $Destino ( $($items.Count) titulares )"
$items | ForEach-Object { Write-Host " - [$($_.fuente)] $($_.title)" }
