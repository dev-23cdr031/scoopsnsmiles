$ports = @(3000, 3001, 5000)

foreach ($port in $ports) {
  $listeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if ($listeners) {
    $processIds = $listeners | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($processId in $processIds) {
      try {
        Stop-Process -Id $processId -Force -ErrorAction Stop
        Write-Output "Stopped PID $processId on port $port"
      } catch {
        Write-Output "Unable to stop PID $processId on port $port"
      }
    }
  }
}

$lockPath = "frontend/.next/dev/lock"
if (Test-Path $lockPath) {
  Remove-Item $lockPath -Force -ErrorAction SilentlyContinue
  Write-Output "Removed Next.js lock file"
}

Write-Output "Dev ports cleaned"
