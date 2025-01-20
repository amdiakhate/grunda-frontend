# Patens - Projet d'Analyse d'Impact Environnemental

## Vue d'ensemble
Patens est une application SaaS permettant aux entreprises d'analyser l'impact environnemental de leurs produits en utilisant la base de données Ecoinvent.

## Architecture Technique

### Frontend
- Framework: React avec Vite
- Routing: TanStack Router
- State Management: Zustand
- UI Components: ShadCN
- Styling: Tailwind CSS
- Animations: CSS personnalisées

### Structure des Données

#### Product
- Informations de base (id, nom, catégorie)
- Liste de matériaux
- Résultats d'impact
- Statut de calcul
- Source d'import

#### Material
- Informations de base (id, nom, description)
- Lien avec activité Ecoinvent (activityUuid)
- Quantités et unités
- Origines (matériau et production)
- Résultats d'impact
- Statut de complétion

#### Impact Results
- Méthode de calcul
- Valeur et unité
- Version
- Part dans l'impact total

### Fonctionnalités Principales

1. Gestion des Produits
   - Import via CSV
   - Visualisation détaillée
   - Calcul d'impact asynchrone
   - Historique des modifications

2. Recherche d'Activités Ecoinvent
   - Modal de recherche avec pagination
   - Filtrage et tri
   - Sélection d'activités pour les matériaux

3. Visualisation des Impacts
   - Treemap des matériaux
   - Graphiques de répartition
   - Comparaison avec moyennes

4. Calcul d'Impact
   - Processus asynchrone
   - Statut persistant
   - Notifications de progression

### Composants Clés

1. MaterialsTreemap
   - Visualisation proportionnelle des impacts
   - Groupement des petites valeurs
   - Animations et tooltips

2. ActivitySearchModal
   - Recherche paginée
   - Tri multi-colonnes
   - Sélection d'activités

3. ProductActions
   - Actions principales (duplicate, history, delete)
   - Calcul d'impact
   - Export et partage

### État Global (Zustand)
- Gestion des impacts affichés
- État des calculs en cours
- Préférences utilisateur

### Environnements
- PPD: frontend-ppd.grunda.io
- PRD: frontend.grunda.io
- API: backend-[env].grunda.io

### Palette de Couleurs
- Vert foncé: #123016
- Marine: #1E3F72
- Marron: #633310
- Gris (Others): #666666

### Typographie
- Police principale: SF Pro Display

### Points d'Attention
1. Calculs d'impact asynchrones pouvant prendre plusieurs minutes
2. Gestion des petites valeurs dans les visualisations
3. Persistance des états de calcul
4. Responsive design
5. Gestion des erreurs et feedback utilisateur

### Dépendances Principales
- @tanstack/router
- zustand
- shadcn/ui
- recharts
- lucide-react 