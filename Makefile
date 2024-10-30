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
	@echo -e "\e[31m make start    : Démarre le projet\e[0m"          
	@echo -e "\e[32m make startall : Build et démarre le projet\e[0m" 
	@echo -e "\e[33m make stop     : Stop le projet\e[0m"             
	@echo -e "\e[34m make restart  : Redémarre le projet\e[0m"        
	@echo -e "\e[35m make reload   : Recrée les services modifiés ou ajoutés\e[0m"
	@echo -e "\e[36m make clean    : Supprime les conteneurs et volumes\e[0m"
	@echo -e "\e[31m make cleanAll : Supprime conteneurs, volumes, et images\e[0m"
	@echo -e "\e[32m make logs     : Affiche les logs de tous les conteneurs en temps réel\e[0m"
	@echo -e ""
