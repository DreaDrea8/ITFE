# ITFE

## Résumer 

Partage de fichier volumineux

## Etat

### Echelle

| État                  | Symbole |
|---                    |---      |
| Ça marche pas         | 🪱      |
| Ça marchouille        | 🦎      |
| Ça marche             | 🚶      |
| Ça vole               | 🦄      |
| Ça fait le café       | ☕      |
| C'est une usine à gaz | 🏭      |

### Notre projet 

| Date         | État    | Tag         | Déscription |
|---           |---      | ---         | --- 
| 01/10/2024   | 🪱 + ☕ | 0.0.0       | Il y a des bout de fonctinalitées sur différentes branches, les fonctionalité exigé ne sont pas implementées | 

Afin de répondre à l'exercice, on a continuer à push du code sur github

| Date         | État                                          | Tag   | Déscription                                        |
|---           |---                                            | ---   | ---                                                |
| 06/11/2027   | Théoriquement: 🦄 + ☕ // Réélement: 🦎 + ☕ + 🏭 | 0.1.0 | Les différentes fonctinalitées sont implementées | 
| 16/11/2027   | 🚶 + 🏭                                            | 0.1.0 | Le projet répond au besoin initial avec une interface avancée | 

## Structure

```json
  ├── .vscode/
  │   └── launch.json                     // Configuration pour le debug
  ├── backend/
  │   ├── files/                          // Dossier contenant les fichiers importés 
  │   ├── src/
  │   │   ├── commons/
  │   │   │   └── Error.ts
  │   │   ├── controllers/
  │   │   │   ├── file/
  │   │   │   .
  │   │   ├── entities/
  │   │   │   ├── File.ts
  │   │   │   .
  │   │   ├── repositories/
  │   │   │   ├── Repository.ts           // Point d'entrée pour les repositories
  │   │   │   .
  │   │   ├── routes/
  │   │   │   ├── Routes.ts               // Point d'entrée pour les routes 
  │   │   │   .
  │   │   ├── schema/
  │   │   │   ├── addFileSchema.ts
  │   │   │   └── userSchema.ts
  │   │   └── services/
  │   │       ├── fileSystem/
  │   │       │   ├── dto/
  │   │       │   │   └── FileSystemService.ts
  │   │       │   └── storageService.ts
  │   │       ├── logger/
  │   │       │   └── LoggerService.ts 
  │   │       ├── tools/                  // Fonctions utilitaires
  │   │       ├── types/
  │   │       ├── App.ts                  // Configuration de l'application
  │   │       └── index.ts                // Exécution de l'application
  │   ├── tmp/                            // Dossier temporaire pour le traitement des fichiers
  │   ├── .env                            // Copie du .env à la racine (plus simple à mettre en place)
  │   ├── Dockerfile
  │   ├── package-lock.json
  │   ├── package.json
  │   └── tsconfig.json
  ├── conf/                               // Fichiers de configuration pour Nginx
  ├── frontend/
  │   ├── src/
  │   │   └── routes/
  │   │       ├── App.css
  │   │       .
  │   ├── .env                            // Copie du .env à la racine (plus simple à mettre en place)
  │   ├── Dockerfile
  │   .
  │   
  ├── sql/
  │   └── init.sql                        // Fichier de configuration de la base de données
  ├── .env
  ├── docker-compose.yml
  ├── Makefile
  ├── openapi.yml                         // Documentation OpenAPI
  ├── files/
  │   ├── progit.pdf                      // Juste un fichier pour tester les requêtes
  │   └── progit.txt                      // Juste un fichier pour tester les requêtes
  ├── README.md
  └── test.http                           // Fichier pour tester les requêtes HTTP
```

## Services

| Nom     | Objectif              | Technologie                 | Acces externe | Point d'entrée     | Lien |
|--       |---                    |---                          |---            |---                 |--- |
| proxy   | Reverse proxy         | NGINX                       | Oui           | localhost          | [Fichier de config](/conf) |
| frontend| Frontend              | Vite + React ...            | Non           | localhost/         | [Frontend](/Frontend) |
| backend | API                   | Node + TypeScript + Express | Non           | localhost/api      | [Backend](/backend) |
| mariadb | Base de données       | MariaDB                     | Oui           | localhost:3306     | |
| pma     | Admin base de données | phpMyAdmin                  | Non           | localhost/admin-db | |
|         | Documentation         | NGINX                       | Oui           | localhost/doc (Your lost)     | |
|         | _ Generalite          | Markdown + pandoc = HTML    | Oui           | localhost/doc      | |
|         | __ Doc API            | OpenApi + YAML + Redoc      | Oui           | localhost/doc/api  | |
|         | __ Nouveaute          | Markdown + pandoc = HTML    | Oui           | localhost/doc/new  | |

## Instalation

Configurer les variables d'environnments

Il y a un fichier .env à la racine du projet qu'il faut dupliquer dans le dossier backend et frontend


#### Makefile 

[Makefile](/Makefile)

| Commande         | Explication                                           |
|----------------- |-------------------------------------------------------|
| `make start`     | Démarre le projet                                     |
| `make startall`  | Build et démarre le projet                            |
| `make startall+d`| Build et démarre le projet avec les logs              |
| `make stop`      | Stoppe le projet                                      |
| `make restart`   | Redémarre le projet                                   |
| `make restart+d` | Redémarre le projet avec les logs                     |
| `make clean`     | Supprime les conteneurs et volumes                    |
| `make cleanAll`  | Supprime les conteneurs, volumes, et images           |
| `make logs`      | Affiche les logs de tous les conteneurs en temps réel |


### Avec Docker

**A partir de rien**

```bash
  make startall
```
Attendre entre 3 et 57 minutes,...

![](https://media1.tenor.com/m/zs-6k2lFHGsAAAAd/steve-carrell-magic.gif)

⚠️ **Si les images ne sont pas encore télécharger ça peut être très long**

Solutions : 
1. Lancer l'execution -> **aller se faire un café** -> revenir un peu plus tard pour vérifier que l'application c'est bien lancer 
2. Ne pas créer le container de PhPMyAdmin
  - Supprimer le service du docker compose
  - Espérer que personne ne remarque sa disparition 
3. Pas installer l'application

⚠️ **Le backend mais un certain temps pour ce lancer**

A votre première requete API, vous tomber sur : 

![](/error-nginx.png)

Problèmes: Le backend ne s'est pas encore lancé

Solutions : 

1. Ce référer au point 1 du warning précédent

2. Prendre sont mal en patience

Comment je sais que l'app fonction ? 

1. Regarder les logs (point suivant)
  Si vous voyer les lignes : 
  
    ```bash
      backend   | App listening on port: http://localhost:3000 in development mode
      backend   | Press CTRL-C to stop
    ```
    C'est que ça devrais marcher

  Si vous voyer pas les lignes : 
    Elles sont juste plus haut ou plus bas, regarder le détail des log du container backend

  Sinon contacté le support / dévelopeur

2. Tester avec une première api

  ```bash 
    Request:
    curl --location 'https://localhost/api/health'
  ``` 

  ```json 
    Response (théorique): 
    {
      "message": "Infos retrieved successfully",
      "data": "Healthy !!",
      "error": null
    }
  ```

**Voir les logs**

```bash
  make logs
```

Pour plus de comandes: [Makefile](#makefile)

### A la mano sur l'ordi

#### Backend

Voir les commandes dans le projet: [package.json](/backend/package.json)

#### Frontend

Voir les commandes dans le projet: [package.json](/frontend/package.json)

## Acceder à l'application 

Ce rendre sur : [ITFE](https://localhost)

**Probleme de SSL**

Le navigateur ne supporte pas très bien le fait que j'ai signer les certificats ssl

Passer les warning de sécurité du navigateur


## Documentation API

### Comment lire la doc API? 

Tu es bilingue et le YAML et ta langue maternelle [openapi.yml](/openapi.yml)
Mais attend OpenAPI c'est impossible à lire naturelement
- Installer un extension qui permet de décripter le fichier
- Ce rendre sur [Doc API](https://localhost/doc/api) (⚠️ Il faut que l'applcation fonctionne)


## Axe d'amélioration 

1. Moins usine a gaz, plus dans les temps
3. Pas de compressions des données pour optimiser les performances. Ajout de la compresion des fichier à l'entrée 
4. Test limiter au fichier dans le repo (progit et apach), compliquer d'assurer que notre service fonction avec d'autres type de fichiers 
6. Performances bof bof


[def]: ./files/error-nginx.png