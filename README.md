# ITFE

## Résumer 

Partage de fichier volumineux

## Services

| Nom     | Objectif              | Technologie                 | Acces externe | Point d'entrée     | Lien |
|--       |---                    |---                          |---            |---                 |--- |
| proxy   | Reverse proxy         | NGINX                       | Oui           | localhost          | [Fichier de config](/conf) |
| frontend| Frontend              | Vite + React ...            | Non           | localhost/         | [Frontend](/Frontend) |
| backend | API                   | Node + TypeScript + Express | Non           | localhost/api      | [Backend](/backend) |
| mariadb | Base de données       | MariaDB                     | Non           | Via PMA ou backend | |
| pma     | Admin base de données | phpMyAdmin                  | Non           | localhost/admin-db | |

## Instalation

Configurer les variables d'environnments

#### Makefile 

[Makefile](/Makefile)

| Commande       | Explication                                           |
|---             |---                                                    |
| `make start`   | Démarre le projet                                     |
| `make startall`| Build et démarre le projet                            |
| `make stop`    | Stoppe le projet                                      |
| `make restart` | Redémarre le projet                                   |
| `make reload`  | Recrée les services modifiés ou ajoutés               |
| `make clean`   | Supprime les conteneurs et volumes                    |
| `make cleanAll`| Supprime les conteneurs, volumes, et images           |
| `make logs`    | Affiche les logs de tous les conteneurs en temps réel |

### Avec Docker

**A partir de rien**

```shell
make startall
```
Attendre entre 3 et 57 minutes,...

<img src="https://media1.tenor.com/m/zs-6k2lFHGsAAAAd/steve-carrell-magic.gif" alt="et ... voilà!" width="300" />

**Voir les logs**

```shell
make logs
```

Pour plus de comandes: [Makefile](#makefile)


### A la mano sur l'ordi

#### Backend

[package.json](/backend/package.json)

#### Frontend

[package.json](/frontend/package.json)


