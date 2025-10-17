# � Système de Gestion du Référentiel Universitaire
## Architecture 100% Microservices

Application complète de gestion du référentiel académique avec **architecture microservices** moderne et scalable.

---

## 🎯 Fonctionnalités

Gestion CRUD complète pour :
- 🏢 **Départements** - Organisation académique
- 📚 **Spécialités** - Programmes d'études  
- 📖 **Matières** - Disciplines enseignées
- 👥 **Groupes** - Classes d'étudiants
- 🚪 **Salles** - Espaces pédagogiques

---

## 🏗️ Architecture Pure Microservices

```
Frontend (React) → API Gateway (5000) → 5 Microservices Indépendants
                                          ├─ Départements (5001)
                                          ├─ Spécialités (5002)
                                          ├─ Matières (5003)
                                          ├─ Groupes (5004)
                                          └─ Salles (5005)
                                          
Tous les services → Supabase (PostgreSQL)
```

**📖 Documentation complète dans [microservices/README.md](microservices/README.md)**

---

## 🚀 Démarrage Rapide

### Option 1 : Script Automatique ⚡ (Recommandé)

```powershell
# Démarrer tous les microservices (6 services)
cd microservices
.\start-microservices.ps1

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

**URLs :**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:5000 (point d'entrée unique)
- Services: http://localhost:5001-5005 (indépendants)

### Option 2 : Docker Compose 🐳

```powershell
# Tous les services en conteneurs
cd microservices
docker-compose up -d

# Frontend (nouveau terminal)
cd frontend
npm run dev
```

### Option 3 : Manuel (Développement)

Démarrez chaque service individuellement (7 terminaux) :
- API Gateway (5000)
- Service Départements (5001)
- Service Spécialités (5002)
- Service Matières (5003)
- Service Groupes (5004)
- Service Salles (5005)
- Frontend (3000)

Voir [microservices/QUICKSTART.md](microservices/QUICKSTART.md) pour les commandes détaillées

---

## 🛠️ Technologies

### Frontend
- ⚛️ React 18 + Vite 5
- 🎨 TailwindCSS 3
- 🔌 React Router 6
- 📝 React Hook Form 7

### Backend
- 🟢 Node.js 18+
- 🚂 Express 4
- 🗄️ Supabase (PostgreSQL)
- 🐳 Docker

---

## 📁 Structure du Projet

```
Gestion du Référentiel/
│
├── microservices/              # Architecture Backend (100% Microservices)
│   ├── api-gateway/            # Port 5000 - Point d'entrée unique
│   │   ├── server.js           # Routing & Load balancing
│   │   ├── package.json
│   │   └── .env
│   │
│   ├── service-departements/   # Port 5001 - CRUD Départements
│   │   ├── server.js
│   │   ├── controller.js
│   │   ├── db.js
│   │   └── package.json
│   │
│   ├── service-specialites/    # Port 5002 - CRUD Spécialités
│   ├── service-matieres/       # Port 5003 - CRUD Matières
│   ├── service-groupes/        # Port 5004 - CRUD Groupes
│   ├── service-salles/         # Port 5005 - CRUD Salles
│   │
│   ├── docker-compose.yml      # Orchestration Docker
│   ├── start-microservices.ps1 # Script automatique
│   ├── README.md               # Documentation complète
│   ├── QUICKSTART.md           # Guide rapide
│   └── MIGRATION_GUIDE.md      # Architecture détaillée
│
└── frontend/                   # Interface React
    └── src/
        ├── pages/              # 5 pages CRUD
        └── components/         # Composants UI
```

---

## 🎯 Avantages de l'Architecture Microservices

### ✅ Scalabilité
- Chaque service peut être scalé indépendamment selon les besoins
- Load balancing automatique par service
- Optimisation des ressources ciblée

### ✅ Indépendance
- Déploiement indépendant de chaque service
- Versions différentes possibles entre services
- Technologies différentes possibles (polyglotte)

### ✅ Résilience
- Si un service tombe, les autres continuent de fonctionner
- Isolation des pannes
- Haute disponibilité garantie

### ✅ Organisation
- Équipes peuvent travailler sur différents services en parallèle
- Code modulaire et maintenable
- Responsabilités clairement définies

### ✅ Performance
- Cache possible au niveau de chaque service
- Requêtes parallèles entre services
- Latence optimisée

---

## 🔧 Configuration

### 1. Base de données Supabase

Créez un compte sur [supabase.com](https://supabase.com) et notez :
- URL du projet
- Clé anon publique

### 2. Variables d'environnement

**API Gateway** (`microservices/api-gateway/.env`) :
```env
PORT=5000
DEPARTEMENTS_SERVICE_URL=http://localhost:5001
SPECIALITES_SERVICE_URL=http://localhost:5002
MATIERES_SERVICE_URL=http://localhost:5003
GROUPES_SERVICE_URL=http://localhost:5004
SALLES_SERVICE_URL=http://localhost:5005
```

**Chaque microservice** (`microservices/service-*/.env`) :
```env
PORT=500X
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
```

### 3. Créer le schéma de base de données

Créez les tables dans Supabase :
- `departments` (départements)
- `programs` (spécialités)
- `subjects` (matières)
- `levels` (niveaux)
- `groups` (groupes)
- `rooms` (salles)
- `room_types` (types de salles)

---

## 📖 Documentation Complète

- **[microservices/README.md](microservices/README.md)** - Documentation complète des microservices
- **[microservices/QUICKSTART.md](microservices/QUICKSTART.md)** - Guide de démarrage rapide
- **[microservices/MIGRATION_GUIDE.md](microservices/MIGRATION_GUIDE.md)** - Architecture détaillée
- **[microservices/FILES_CREATED.md](microservices/FILES_CREATED.md)** - Inventaire complet des fichiers
- **[CLEANUP_REPORT.md](CLEANUP_REPORT.md)** - Rapport de nettoyage du projet

---

## 🧪 Tests et Health Checks

### Vérifier que tous les services fonctionnent

```powershell
# API Gateway
curl http://localhost:5000/health

# Chaque microservice
curl http://localhost:5001/health  # Départements
curl http://localhost:5002/health  # Spécialités
curl http://localhost:5003/health  # Matières
curl http://localhost:5004/health  # Groupes
curl http://localhost:5005/health  # Salles
```

### Tester les endpoints via Gateway

```powershell
# Toutes les requêtes passent par le Gateway (port 5000)
curl http://localhost:5000/api/departements
curl http://localhost:5000/api/specialites
curl http://localhost:5000/api/matieres
curl http://localhost:5000/api/groupes
curl http://localhost:5000/api/salles
```

---

## 📝 API Endpoints

Identiques pour les deux architectures :

```
GET    /api/departements
POST   /api/departements
PUT    /api/departements/:id
DELETE /api/departements/:id

GET    /api/specialites
POST   /api/specialites
PUT    /api/specialites/:id
DELETE /api/specialites/:id

GET    /api/matieres
POST   /api/matieres
PUT    /api/matieres/:id
DELETE /api/matieres/:id

GET    /api/groupes
POST   /api/groupes
PUT    /api/groupes/:id
DELETE /api/groupes/:id

GET    /api/salles
POST   /api/salles
PUT    /api/salles/:id
DELETE /api/salles/:id
```

---

## 🐳 Déploiement Docker

### Développement local

```powershell
cd microservices
docker-compose up -d
```

Tous les 6 services démarrent automatiquement en conteneurs !

### Production

Chaque service peut être déployé indépendamment sur :
- **Kubernetes** pour orchestration avancée
- **Docker Swarm** pour clustering
- **AWS ECS/EKS** pour le cloud Amazon
- **Azure Container Instances** pour Microsoft Azure
- **Google Cloud Run** pour Google Cloud

---

## 🛡️ Sécurité

### Implémenté ✅
- CORS configuré
- Rate limiting (100 req/15min)
- Validation des données
- Gestion centralisée des erreurs

### À ajouter pour la production 🔒
- Authentification JWT
- API Keys par service
- HTTPS obligatoire
- Service mesh (Istio)
- Secrets management (Vault)

---

## 🔍 Monitoring et Logs

Chaque service génère ses propres logs avec timestamps :
```
[2025-01-14T10:30:00.000Z] GET /api/departements
[Service] Departements service processing request
```

L'API Gateway vérifie automatiquement l'état de santé des services et route vers les instances disponibles.

---

## 🐛 Dépannage

### Un service ne démarre pas
1. Vérifiez que le port n'est pas déjà utilisé
2. Vérifiez les variables d'environnement dans `.env`
3. Vérifiez la connexion à Supabase

### Erreur 503 - Service Unavailable
- Le microservice cible n'est pas démarré
- Vérifiez les health checks : `curl http://localhost:500X/health`
- Redémarrez le service concerné

### Erreur 404 - Not Found
- Vérifiez que la route existe dans l'API Gateway
- Vérifiez les URLs de services dans `api-gateway/.env`

---

## 🚀 Prochaines Étapes

### Court terme
- [ ] Implémenter l'authentification JWT
- [ ] Ajouter des tests unitaires et d'intégration
- [ ] Configurer CI/CD (GitHub Actions)

### Moyen terme
- [ ] Service Discovery (Consul/Eureka)
- [ ] Message Queue (RabbitMQ/Kafka)
- [ ] Cache distribué (Redis)
- [ ] Monitoring (Prometheus + Grafana)

### Long terme
- [ ] Déploiement Kubernetes
- [ ] Service mesh (Istio)
- [ ] Auto-scaling
- [ ] Multi-region deployment

---

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus d'informations.

---

## 🎉 Conclusion

Ce projet implémente une **vraie architecture microservices moderne** avec :

✅ **6 services indépendants** (1 API Gateway + 5 services métier)  
✅ **Scaling individuel** possible par service  
✅ **Haute disponibilité** et résilience garanties  
✅ **Déploiement indépendant** de chaque service  
✅ **Docker ready** pour la production  
✅ **Documentation complète** et détaillée  

**Prêt pour la production ! 🚀**

---

**Développé avec ❤️ pour une architecture microservices moderne**

*Pour plus d'informations détaillées, consultez la documentation dans `microservices/`*
2. **Microservices** - Scalable, résilient, prêt pour production

Les deux utilisent :
- ✅ Même base de données Supabase
- ✅ Même logique métier
- ✅ Même API
- ✅ Même frontend

**Le frontend n'a aucun changement à faire entre les deux !**

Choisissez l'architecture qui correspond à vos besoins. 🚀

---

**Développé avec ❤️ pour l'apprentissage et la production**

*Pour plus d'informations, consultez [README_ARCHITECTURES.md](README_ARCHITECTURES.md)*
