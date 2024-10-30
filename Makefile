# Makefile
DOCKER_COMPOSE_FILE=docker-compose.yml
SERVICE_NAME=my_service_name 

.PHONY: start stop restart build

# Commande pour démarrer les conteneurs
start:
    docker compose -f $(DOCKER_COMPOSE_FILE) up -d

# Commande pour arrêter les conteneurs
stop:
    docker compose -f $(DOCKER_COMPOSE_FILE) down

# Commande pour redémarrer les conteneurs
restart: stop start

# Commande pour reconstruire les conteneurs
build:
    docker compose -f $(DOCKER_COMPOSE_FILE) up -d --build