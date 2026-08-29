param([int]$Port = 5175)
if ($env:PORT) { $Port = [int]$env:PORT }
$root = Split-Path -Parent $PSScriptRoot
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) { $python = Get-Command py -ErrorAction SilentlyContinue }
if ($python) {
  Write-Host "Serving $root at http://127.0.0.1:$Port/"
  & $python.Source -m http.server $Port --bind 127.0.0.1 --directory $root
  exit $LASTEXITCODE
}

try {
  $listener = New-Object System.Net.HttpListener
  $listener.Prefixes.Add("http://localhost:$Port/")
  $listener.Start()
} catch {
  Write-Error "Unable to start a local server. Install Python 3 and run this script again."
  exit 1
}
Write-Host "Serving $root at http://localhost:$Port/"
$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8"; ".js"="text/javascript; charset=utf-8";
  ".json"="application/json"; ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg";
  ".svg"="image/svg+xml"; ".webp"="image/webp"; ".ico"="image/x-icon"; ".woff2"="font/woff2"; ".md"="text/markdown; charset=utf-8"
}
while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $root ($path.TrimStart("/") -replace "/", "\")
    $resolved = if (Test-Path $file -PathType Leaf) { (Resolve-Path -LiteralPath $file).Path } else { $null }
    if ($resolved -and ($resolved -eq $root -or $resolved.StartsWith($root + [IO.Path]::DirectorySeparatorChar))) {
      $bytes = [IO.File]::ReadAllBytes($resolved)
      $ext = [IO.Path]::GetExtension($resolved).ToLower()
      if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] }
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.Close()
  } catch { }
}
