# Makefile
DOCKER_COMPOSE_FILE=docker-compose.yml
SERVICE_NAME=itfe

.PHONY: start stop restart build clean cleanAll help

logs:
	docker compose -f $(DOCKER_COMPOSE_FILE) logs -f

startall: 
	docker compose -f $(DOCKER_COMPOSE_FILE) down
	docker compose -f $(DOCKER_COMPOSE_FILE) up --build -d

startall+d: 
	docker compose -f $(DOCKER_COMPOSE_FILE) up --build

start:
	docker compose -f $(DOCKER_COMPOSE_FILE) up -d

stop:
	docker compose -f $(DOCKER_COMPOSE_FILE) down

restart: stop start

restart+d:
	docker compose -f $(DOCKER_COMPOSE_FILE) down
	docker compose -f $(DOCKER_COMPOSE_FILE) up

clean:
	docker compose -f $(DOCKER_COMPOSE_FILE) down -v

cleanAll:
	docker compose -f $(DOCKER_COMPOSE_FILE) down -v
	docker images -q $(SERVICE_NAME) | xargs -r docker rmi

help:
	@echo -e ""
	@echo -e "\e[31m~~ ITFE Makefile ~~\e[0m"                           
	@echo -e ""
	@echo -e "\e[31m make start      | Demarre le projet                                     | up -d\e[0m"          
	@echo -e "\e[32m make startall   | Build et demarre le projet                            | down & up --build -d\e[0m" 
	@echo -e "\e[33m make startall+d | Build et demarre le projet avec les logs              | up --build\e[0m" 
	@echo -e "\e[34m make stop       | Stop le projet                                        | down\e[0m"             
	@echo -e "\e[35m make restart    | Redemarre le projet                                   | stop & start\e[0m"        
	@echo -e "\e[36m make restart+d  | Redemarre le projet avec les logs                     | down & up\e[0m"
	@echo -e "\e[31m make clean      | Supprime les conteneurs et volumes                    | down -v\e[0m"
	@echo -e "\e[32m make cleanAll   | Supprime conteneurs, volumes, et images               | \e[0m"
	@echo -e "\e[33m make logs       | Affiche les logs de tous les conteneurs en temps reel | logs -f\e[0m"
	@echo -e ""
