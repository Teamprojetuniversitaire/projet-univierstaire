# Script de démarrage automatique des microservices
# Usage: .\start-microservices.ps1

Write-Host "🚀 Démarrage des microservices..." -ForegroundColor Green
Write-Host ""

# Fonction pour démarrer un service dans un nouveau terminal
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$Path,
        [string]$Port
    )
    
    Write-Host "▶️  Démarrage de $ServiceName (Port $Port)..." -ForegroundColor Cyan
    
    $command = "cd '$Path'; npm start; Read-Host 'Appuyez sur Entrée pour fermer'"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
    
    Start-Sleep -Seconds 2
}

# Récupérer le chemin du dossier microservices
$microservicesPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Vérifier si npm est installé
try {
    npm --version | Out-Null
} catch {
    Write-Host "❌ Erreur: npm n'est pas installé" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Vérification des dépendances..." -ForegroundColor Yellow
Write-Host ""

# Installer les dépendances si nécessaire
$services = @(
    @{Name="API Gateway"; Path="api-gateway"; Port="5000"},
    @{Name="Service Départements"; Path="service-departements"; Port="5001"},
    @{Name="Service Spécialités"; Path="service-specialites"; Port="5002"},
    @{Name="Service Matières"; Path="service-matieres"; Port="5003"},
    @{Name="Service Groupes"; Path="service-groupes"; Port="5004"},
    @{Name="Service Salles"; Path="service-salles"; Port="5005"}
)

foreach ($service in $services) {
    $servicePath = Join-Path $microservicesPath $service.Path
    $nodeModulesPath = Join-Path $servicePath "node_modules"
    
    if (-not (Test-Path $nodeModulesPath)) {
        Write-Host "📥 Installation des dépendances pour $($service.Name)..." -ForegroundColor Yellow
        Push-Location $servicePath
        npm install --silent
        Pop-Location
    }
}

Write-Host ""
Write-Host "✅ Toutes les dépendances sont installées" -ForegroundColor Green
Write-Host ""
Write-Host "🎬 Lancement des services..." -ForegroundColor Green
Write-Host ""

# Démarrer tous les services
foreach ($service in $services) {
    $servicePath = Join-Path $microservicesPath $service.Path
    Start-Service -ServiceName $service.Name -Path $servicePath -Port $service.Port
}

Write-Host ""
Write-Host "✨ Tous les services sont en cours de démarrage !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Services disponibles:" -ForegroundColor Cyan
Write-Host "   • API Gateway:           http://localhost:5000" -ForegroundColor White
Write-Host "   • Service Départements:  http://localhost:5001" -ForegroundColor White
Write-Host "   • Service Spécialités:   http://localhost:5002" -ForegroundColor White
Write-Host "   • Service Matières:      http://localhost:5003" -ForegroundColor White
Write-Host "   • Service Groupes:       http://localhost:5004" -ForegroundColor White
Write-Host "   • Service Salles:        http://localhost:5005" -ForegroundColor White
Write-Host ""
Write-Host "🏥 Health Checks:" -ForegroundColor Cyan
Write-Host "   curl http://localhost:5000/health" -ForegroundColor Gray
Write-Host ""
Write-Host "⏸️  Pour arrêter tous les services, fermez toutes les fenêtres PowerShell" -ForegroundColor Yellow
Write-Host ""

# Attendre quelques secondes puis vérifier les health checks
Start-Sleep -Seconds 10

Write-Host "🔍 Vérification des services..." -ForegroundColor Yellow
Write-Host ""

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)/health" -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($service.Name) is UP" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  $($service.Name) is not responding yet..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Architecture microservices prête !" -ForegroundColor Green
Write-Host ""
