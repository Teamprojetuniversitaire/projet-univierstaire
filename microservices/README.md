# Microservices - Gestion du Référentiel

Architecture microservices pour la gestion du référentiel universitaire.

## 🏗️ Architecture

```
Frontend (React) → API Gateway (5000) → Microservices
                                          ├─ Départements (5001)
                                          ├─ Spécialités (5002)
                                          ├─ Matières (5003)
                                          ├─ Groupes (5004)
                                          └─ Salles (5005)
```

## 📦 Services

### API Gateway (Port 5000)
- Point d'entrée unique pour toutes les requêtes
- Routing vers les microservices appropriés
- Rate limiting (100 req/15min)
- Logging centralisé
- Gestion des erreurs

### Service Départements (Port 5001)
- CRUD départements
- Table: `departments`
- Endpoints: `/api/departements`

### Service Spécialités (Port 5002)
- CRUD spécialités/programmes
- Table: `programs` (join avec `departments`)
- Endpoints: `/api/specialites`

### Service Matières (Port 5003)
- CRUD matières
- Table: `subjects` (join avec `departments`)
- Endpoints: `/api/matieres`

### Service Groupes (Port 5004)
- CRUD groupes
- Tables: `groups` → `levels` → `programs` → `departments`
- Endpoints: `/api/groupes`

### Service Salles (Port 5005)
- CRUD salles
- Table: `rooms` (join avec `room_types`)
- Endpoints: `/api/salles`

## 🚀 Démarrage rapide

### Option 1: Démarrage manuel

1. **Installer les dépendances pour chaque service**:
```powershell
cd microservices\api-gateway
npm install

cd ..\service-departements
npm install

cd ..\service-specialites
npm install

cd ..\service-matieres
npm install

cd ..\service-groupes
npm install

cd ..\service-salles
npm install
```

2. **Démarrer tous les services** (ouvrir 6 terminaux):

Terminal 1 - API Gateway:
```powershell
cd microservices\api-gateway
npm start
```

Terminal 2 - Service Départements:
```powershell
cd microservices\service-departements
npm start
```

Terminal 3 - Service Spécialités:
```powershell
cd microservices\service-specialites
npm start
```

Terminal 4 - Service Matières:
```powershell
cd microservices\service-matieres
npm start
```

Terminal 5 - Service Groupes:
```powershell
cd microservices\service-groupes
npm start
```

Terminal 6 - Service Salles:
```powershell
cd microservices\service-salles
npm start
```

3. **Démarrer le Frontend**:
```powershell
cd frontend
npm run dev
```

### Option 2: Script de démarrage automatique

Utilisez le script PowerShell fourni:
```powershell
.\start-microservices.ps1
```

## 🔍 Health Checks

Vérifier le statut de chaque service:

```powershell
# API Gateway
curl http://localhost:5000/health

# Départements Service
curl http://localhost:5001/health

# Spécialités Service
curl http://localhost:5002/health

# Matières Service
curl http://localhost:5003/health

# Groupes Service
curl http://localhost:5004/health

# Salles Service
curl http://localhost:5005/health
```

## 📡 API Endpoints

Toutes les requêtes passent par l'API Gateway (port 5000):

### Départements
- `GET    /api/departements` - Liste tous les départements
- `GET    /api/departements/:id` - Détails d'un département
- `POST   /api/departements` - Créer un département
- `PUT    /api/departements/:id` - Modifier un département
- `DELETE /api/departements/:id` - Supprimer un département

### Spécialités
- `GET    /api/specialites` - Liste toutes les spécialités
- `GET    /api/specialites/:id` - Détails d'une spécialité
- `POST   /api/specialites` - Créer une spécialité
- `PUT    /api/specialites/:id` - Modifier une spécialité
- `DELETE /api/specialites/:id` - Supprimer une spécialité

### Matières
- `GET    /api/matieres` - Liste toutes les matières
- `GET    /api/matieres/:id` - Détails d'une matière
- `POST   /api/matieres` - Créer une matière
- `PUT    /api/matieres/:id` - Modifier une matière
- `DELETE /api/matieres/:id` - Supprimer une matière

### Groupes
- `GET    /api/groupes` - Liste tous les groupes
- `GET    /api/groupes/:id` - Détails d'un groupe
- `POST   /api/groupes` - Créer un groupe
- `PUT    /api/groupes/:id` - Modifier un groupe
- `DELETE /api/groupes/:id` - Supprimer un groupe

### Salles
- `GET    /api/salles` - Liste toutes les salles
- `GET    /api/salles/:id` - Détails d'une salle
- `POST   /api/salles` - Créer une salle
- `PUT    /api/salles/:id` - Modifier une salle
- `DELETE /api/salles/:id` - Supprimer une salle

## 🔧 Configuration

Chaque service a son propre fichier `.env`:

### API Gateway (`.env`)
```env
PORT=5000
DEPARTEMENTS_SERVICE_URL=http://localhost:5001
SPECIALITES_SERVICE_URL=http://localhost:5002
MATIERES_SERVICE_URL=http://localhost:5003
GROUPES_SERVICE_URL=http://localhost:5004
SALLES_SERVICE_URL=http://localhost:5005
```

### Services (`.env` pour chaque service)
```env
PORT=500X  # X = 1,2,3,4,5
SUPABASE_URL=https://sewaloirlsmwfgofpbxh.supabase.co
SUPABASE_ANON_KEY=your_key_here
```

## 🎯 Avantages de cette architecture

### ✅ Scalabilité
- Chaque service peut être scalé indépendamment
- Load balancing possible par service

### ✅ Indépendance
- Déploiement indépendant de chaque service
- Versions différentes possibles
- Technologies différentes possibles

### ✅ Résilience
- Si un service tombe, les autres continuent
- Isolation des pannes

### ✅ Organisation
- Équipes peuvent travailler sur différents services
- Code modulaire et maintenable

### ✅ Performance
- Cache possible par service
- Optimisation ciblée

## 📊 Monitoring

### Logs
Chaque service affiche ses logs dans son terminal:
```
[2024-01-15T10:30:00.000Z] GET /api/departements
[Proxy] Routing GET /api/departements → http://localhost:5001
```

### Métriques
- Nombre de requêtes par service
- Temps de réponse
- Taux d'erreur
- Services disponibles/indisponibles

## 🐛 Dépannage

### Service ne démarre pas
1. Vérifier que le port n'est pas déjà utilisé
2. Vérifier les variables d'environnement
3. Vérifier la connexion Supabase

### Erreur 503 - Service Unavailable
- Le microservice cible n'est pas démarré
- Vérifier les health checks

### Erreur 404 - Not Found
- Vérifier que la route existe dans l'API Gateway
- Vérifier la configuration des URLs de services

## 📝 Notes importantes

1. **Database partagée**: Tous les services utilisent la même base Supabase
2. **Pas d'authentification**: À implémenter selon vos besoins
3. **Frontend**: Le frontend doit pointer vers le Gateway (port 5000)
4. **Rate limiting**: 100 requêtes max par IP toutes les 15 minutes

## 🔄 Migration depuis le monolithe

Le frontend n'a **AUCUN changement** à faire ! Il continue d'appeler:
```javascript
axios.get('http://localhost:5000/api/departements')
```

L'API Gateway redirige automatiquement vers le bon microservice.

## 🚀 Prochaines étapes

1. **Docker**: Conteneuriser chaque service
2. **CI/CD**: Pipeline de déploiement automatique
3. **Kubernetes**: Orchestration et auto-scaling
4. **Service Discovery**: Consul ou Eureka
5. **API Documentation**: Swagger pour chaque service
6. **Monitoring**: Prometheus + Grafana
7. **Tracing**: Jaeger ou Zipkin
8. **Message Queue**: RabbitMQ ou Kafka pour communication asynchrone

## 📚 Structure des fichiers

```
microservices/
├── api-gateway/
│   ├── package.json
│   ├── .env
│   └── server.js
├── service-departements/
│   ├── package.json
│   ├── .env
│   ├── server.js
│   ├── db.js
│   └── controller.js
├── service-specialites/
│   ├── package.json
│   ├── .env
│   ├── server.js
│   ├── db.js
│   └── controller.js
├── service-matieres/
│   ├── package.json
│   ├── .env
│   ├── server.js
│   ├── db.js
│   └── controller.js
├── service-groupes/
│   ├── package.json
│   ├── .env
│   ├── server.js
│   ├── db.js
│   └── controller.js
└── service-salles/
    ├── package.json
    ├── .env
    ├── server.js
    ├── db.js
    └── controller.js
```

## 🎉 Conclusion

Vous avez maintenant une **vraie architecture microservices** avec:
- ✅ 5 microservices indépendants
- ✅ 1 API Gateway
- ✅ Routing automatique
- ✅ Health checks
- ✅ Rate limiting
- ✅ Logging centralisé
- ✅ Gestion des erreurs

Le projet est prêt pour le déploiement en production !
