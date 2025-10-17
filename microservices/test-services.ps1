# Script de test des microservices
# Usage: .\test-services.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   TEST DES MICROSERVICES" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: API Gateway
Write-Host "1️⃣  Test de l'API Gateway (Port 5000):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 3
    $json = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ Status: $($json.status)" -ForegroundColor Green
    Write-Host "   ✅ Service: $($json.service)" -ForegroundColor Green
    Write-Host "   ✅ Timestamp: $($json.timestamp)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Microservices individuels
Write-Host "2️⃣  Test des Microservices (Ports 5001-5005):" -ForegroundColor Yellow

$services = @(
    @{Port=5001; Name="Departements"; Icon="[DEP]"},
    @{Port=5002; Name="Specialites"; Icon="[SPE]"},
    @{Port=5003; Name="Matieres"; Icon="[MAT]"},
    @{Port=5004; Name="Groupes"; Icon="[GRP]"},
    @{Port=5005; Name="Salles"; Icon="[SAL]"}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)/health" -UseBasicParsing -TimeoutSec 3
        $json = $response.Content | ConvertFrom-Json
        Write-Host "   ✅ $($service.Icon) $($service.Name) (Port $($service.Port)): $($json.status)" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ $($service.Icon) $($service.Name) (Port $($service.Port)): OFFLINE" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: Endpoints API via Gateway
Write-Host "3️⃣  Test des Endpoints API (via Gateway):" -ForegroundColor Yellow

$endpoints = @("departements", "specialites", "matieres", "groupes", "salles")
$icons = @("[DEP]", "[SPE]", "[MAT]", "[GRP]", "[SAL]")

for ($i = 0; $i -lt $endpoints.Length; $i++) {
    $endpoint = $endpoints[$i]
    $icon = $icons[$i]
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/$endpoint" -UseBasicParsing -TimeoutSec 3
        
        if ($response.StatusCode -eq 200) {
            $data = $response.Content | ConvertFrom-Json
            if ($data -is [Array]) {
                $count = $data.Count
            } else {
                $count = 0
            }
            Write-Host "   ✅ $icon GET /api/$endpoint : OK (Status: $($response.StatusCode), Items: $count)" -ForegroundColor Green
        }
    } catch {
        $errorMsg = $_.Exception.Message
        if ($errorMsg -match "503") {
            Write-Host "   ⚠️  $icon GET /api/$endpoint : Service Unavailable (Backend offline)" -ForegroundColor Yellow
        } elseif ($errorMsg -match "ECONNREFUSED") {
            Write-Host "   ❌ $icon GET /api/$endpoint : Connection Refused (Service not started)" -ForegroundColor Red
        } else {
            Write-Host "   ❌ $icon GET /api/$endpoint : FAILED ($errorMsg)" -ForegroundColor Red
        }
    }
}
Write-Host ""

# Test 4: Frontend
Write-Host "4️⃣  Test du Frontend (Port 3000):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend accessible sur http://localhost:3000" -ForegroundColor Green
        Write-Host "   ✅ Application React opérationnelle" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Frontend non accessible - Vérifiez que 'npm run dev' est lancé dans frontend/" -ForegroundColor Red
}
Write-Host ""

# Résumé
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   RESUME DES TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Compter les services actifs
$activeServices = 0
$totalServices = 6  # API Gateway + 5 microservices

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        $activeServices++
    } catch {}
}

# Vérifier l'API Gateway
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    $activeServices++
} catch {}

# Vérifier le Frontend
$frontendActive = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    $frontendActive = $true
} catch {}

Write-Host "Backend Services: $activeServices/$totalServices actifs" -ForegroundColor $(if ($activeServices -eq $totalServices) { "Green" } else { "Yellow" })
Write-Host "Frontend: $(if ($frontendActive) { 'Actif ✅' } else { 'Inactif ❌' })" -ForegroundColor $(if ($frontendActive) { "Green" } else { "Red" })
Write-Host ""

if ($activeServices -eq $totalServices -and $frontendActive) {
    Write-Host "[OK] Tous les services sont operationnels !" -ForegroundColor Green
    Write-Host "[WEB] Application accessible: http://localhost:3000" -ForegroundColor Green
} elseif ($activeServices -eq $totalServices) {
    Write-Host "[WARN] Backend operationnel, mais Frontend a demarrer" -ForegroundColor Yellow
    Write-Host "[INFO] Lancez: cd frontend ; npm run dev" -ForegroundColor Yellow
} else {
    Write-Host "[WARN] Certains services ne sont pas actifs" -ForegroundColor Yellow
    Write-Host "[INFO] Lancez: .\start-microservices.ps1" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================`n" -ForegroundColor Cyan

# URLs utiles
Write-Host "[URLs] URLs Utiles:" -ForegroundColor Cyan
Write-Host "   Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "   API Gateway: http://localhost:5000" -ForegroundColor White
Write-Host "   Health API:  http://localhost:5000/health" -ForegroundColor White
Write-Host ""
Write-Host "[API] Endpoints API:" -ForegroundColor Cyan
Write-Host "   Departements: http://localhost:5000/api/departements" -ForegroundColor White
Write-Host "   Specialites:  http://localhost:5000/api/specialites" -ForegroundColor White
Write-Host "   Matieres:     http://localhost:5000/api/matieres" -ForegroundColor White
Write-Host "   Groupes:      http://localhost:5000/api/groupes" -ForegroundColor White
Write-Host "   Salles:       http://localhost:5000/api/salles" -ForegroundColor White
Write-Host ""
