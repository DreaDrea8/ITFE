# Makefile
DOCKER_COMPOSE_FILE=docker-compose.yml
SERVICE_NAME=itfe

.PHONY: start stop restart build clean cleanAll help

logs:
	docker compose -f $(DOCKER_COMPOSE_FILE) logs -f

startall: 
	docker compose -f $(DOCKER_COMPOSE_FILE) up --build -d

start:
	docker compose -f $(DOCKER_COMPOSE_FILE) up -d

stop:
	docker compose -f $(DOCKER_COMPOSE_FILE) down

restart: stop start

reload:
	docker compose -f $(DOCKER_COMPOSE_FILE) up -d --build --no-deps

clean:
	docker compose -f $(DOCKER_COMPOSE_FILE) down -v

cleanAll:
	docker compose -f $(DOCKER_COMPOSE_FILE) down -v
	docker images -q $(SERVICE_NAME) | xargs -r docker rmi

help:
	@echo -e ""
	@echo -e "\e[31m~~ ITFE Makefile ~~\e[0m"                           
	@echo -e ""
	@echo -e "\e[31m make start    | Demarre le projet                                     | up -d\e[0m"          
	@echo -e "\e[32m make startall | Build et demarre le projet                            | up --build -d\e[0m" 
	@echo -e "\e[33m make stop     | Stop le projet                                        | down\e[0m"             
	@echo -e "\e[34m make restart  | Redemarre le projet                                   | start + stop\e[0m"        
	@echo -e "\e[35m make reload   | Recree les services modifies ou ajoutes               | up -d --build --no-deps (sert à rien)\e[0m"
	@echo -e "\e[36m make clean    | Supprime les conteneurs et volumes                    | down -v\e[0m"
	@echo -e "\e[31m make cleanAll | Supprime conteneurs, volumes, et images               | \e[0m"
	@echo -e "\e[32m make logs     | Affiche les logs de tous les conteneurs en temps reel | logs -f\e[0m"
	@echo -e ""
