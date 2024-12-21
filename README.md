# Outil simplifié d'analyse des paniers d'achat

## Description du projet

Un outil d'analyse des paniers d'achat permettant de visualiser des statistiques essentielles telles que le montant total des ventes, les produits les plus vendus et la répartition des ventes par catégorie. Le projet est développé en **Vue.js 3** avec **Quasar** pour le frontend et **Express + TypeScript** pour le backend, avec **MongoDB** comme base de données.

---

## Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version recommandée : v16+)
- [npm](https://www.npmjs.com/) (livré avec Node.js)
- [MongoDB](https://www.mongodb.com/) (une instance locale ou distante)

---

## Installation, Configuration et Exécution

### 1. Installation des dépendances

#### Backend

```bash
cd backend
npm install
```

Si vous utilisez une instance distante de mongodb, il faut modifier le fichier .env :

```
DB_URI=mongodb://localhost:27017/shopping_cart
DB_NAME=shopping_cart
```

#### Frontend

```bash
cd frontend
npm install
```

### 2. Configuration des variables d'environnement

Le projet utilise des variables d'environnement pour configurer certains aspects du backend et du frontend. Ces variables doivent être définies dans des fichiers `.env`.

#### Étapes pour configurer les fichiers `.env` :

1. Copiez le fichier d'exemple `.env.example` à la racine de chaque projet (backend et frontend) et renommez-le en `.env` :
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
2. Ouvrez les fichiers .env dans un éditeur de texte.

3. Remplissez les valeurs nécessaires. Voici celles du backend:
   ```bash
   # Configuration de la base de données
   DB_URI=mongodb://localhost:27017/shopping_cart
   
   # utilisé par le script "seed"
   DB_NAME=shopping_cart
   
   # Collections MongoDB
   PRODUCTS_COLLECTION=products
   SALES_COLLECTION=sales
   
   # Fichiers CSV
   PRODUCTS_CSV_FILE=./data/products.csv
   SALES_CSV_FILE=./data/sales.csv
   
   # Port d'écoute du serveur
   PORT=8117
   ```
   Faites de même pour le frontend :
   ```bash
   API_URL=http://localhost:8117/
   ```
4. Sauvegardez les fichiers .env. Vous êtes prêts à exécuter les projets!


### 3. Exécution

#### Backend

Lancez le serveur backend avec la commande suivante :

```bash
npm run dev
```

Pour injecter les données dans la base MongoDB, exécutez le script suivant :

```bash
npm run seed
```

#### Frontend

Lancez le serveur frontend avec **Quasar** :

```bash
quasar dev
```

---

## Structure du projet

### Backend

La structure du projet backend est organisée comme suit :

```
backend/
│
├── dist/               # Code compilé en JavaScript depuis TypeScript
├── node_modules/       # Modules et fichiers de dépendances
├── src/                # Dossier principal des fichiers source
│   ├── controllers/    # Contrôleurs pour les routes de produits et ventes
    ├── data/           # Contient le dataset
│   ├── middleware/     # Middleware pour vérification des tokens
│   ├── models/         # Modèles pour les utilisateurs, produits et ventes
│   ├── routes/         # Routes API
    ├── scripts/        # Contient le fichier seed.js pour injecter le dataset
│   ├── services/       # Services de base de données et logique métier
│   ├── utils/          # Fichiers utilitaires pour la gestion des erreurs
│   ├── app.ts          # Configuration principale de l'application
│   └── server.ts       # Création et démarrage du serveur
│
├── .env.example        # Exemple des Variables d'environnement
├── package.json        # Fichier des dépendances
└── tsconfig.json       # Configuration du compilateur TypeScript
```

Extrait de `src/app.ts` :

```typescript
import express from 'express';
import connectDB from './services/db_service';
import productRoutes from './routes/product_route';
import cors from 'cors';
import userRoutes from "./routes/user_route";
import saleRoutes from "./routes/sale_route";

const app = express();

connectDB().then().catch();

app.use(cors());
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/analytics", saleRoutes);
app.use("/products", productRoutes);
```

### Frontend

La structure du projet frontend est organisée comme suit :

```
frontend/
│
├── node_modules/       # Modules et fichiers de dépendances
├── public/             # Contient les fichiers statiques comme les icônes
├── src/                # Dossier principal des fichiers source
│   ├── boot/           # Middleware d'authentification, Axios et i18n
│   ├── components/     # Composants réutilisables du dashboard
│   ├── css/            # Fichiers CSS et variables SCSS
│   ├── layouts/        # Layouts principaux (Logged, Main)
│   ├── pages/          # Pages principales (Login, Signup, Dashboard)
│   ├── router/         # Définition des routes
│   ├── stores/         # Stores de produits, ventes et utilisateurs
│   ├── use/            # Composables pour les services
│
├── .env                # Variables d'environnement (API_URL)
├── eslint.config.js    # Configuration ESLint
├── package.json        # Fichier des dépendances
├── quasar.config.js    # Configuration de Quasar
```

Exemple d'un store dans `stores/productStore.ts` :

```typescript
import { api } from 'boot/axios.js';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useProductStore = defineStore('productStore', () => {
  const productStore = reactive([]);

  const getProducts = async (data) => {
    const { data: apiProduct } = await api.get('/products/table', { params: data });
    return apiProduct;
  };

  return { productStore, getProducts };
});
```

---

## Documentation API

### 1. Routes d'API

| **Méthode** | **Endpoint**                      | **Description**                                                                |
|-------------|-----------------------------------|--------------------------------------------------------------------------------|
| `GET`       | `/analytics/total_sales`          | Retourne le montant total des ventes pour la période sélectionnée.             |
| `GET`       | `/analytics/trending_products`    | Retourne les 5 produits les plus vendus aves leurs noms, triés par quantité.   |
| `GET`       | `/analytics/category_sales`       | Retourne la répartition des ventes par catégorie, exprimée en pourcentage.     |
| `GET`       | `/products/table`                 | Retourne une liste des produits répertoriés, avec leur nombre total de ventes. |
| `GET`       | `/analytics/total_sales_quantity` | Retourne le nombre total de ventes pour chaque produit.                        |
| `POST`      | `/auth/signup`                    | Permet à un nouvel utilisateur de s'inscrire.                                  |
| `GET`       | `/auth/login`                     | Permet à un utilisateur existant de se connecter.                              |

**NB:** Dans le calcul des statistiques, le champ 'total_sales' de la collection sale fournit initialement dans le dataset n'a pas été pris 
en compte parce que les valeurs ne réflètent pas exactement prix * quantité. Il a été recalculé sans modification du dataset.

---

## Exemple de réponses API

### `GET /analytics/total_sales`

**Exemple de réponse :**

```json
{
  "total_sales": 150000
}
```

### `GET /analytics/trending_products`

**Exemple de réponse :**

```json
[
  {
    "name": "TV",
    "category": "Electronics",
    "totalQuantity": 25000
  },
  {
    "name": "Graphic Novel",
    "category": "books",
    "totalQuantity": 2000
  },
  {
    "name": "Salad Spinner",
    "category": "Kitchen Tools",
    "totalQuantity": 250
  }
]
```

### `GET /analytics/category_sales`

**Exemple de réponse :**

```json
[
  {
    "category": "Electronics",
    "percentage": 45
  },
  {
    "category": "House",
    "percentage": 45
  }
]
```

---

## Démonstration

Le projet est exécuté localement pour l'instant. Une démo est enregistrée sous forme de vidéo pour présenter les fonctionnalités :

[Lien Démo](https://drive.google.com/file/d/1vhCqIipTDByfiFixu1zxsf8dhCGsXDuS/view?usp=sharing)

---

## Auteurs

- **Salim SALEY MIDOU** - Développeur Principal.

---

## Licence

Ce projet est sous licence **MIT**.

