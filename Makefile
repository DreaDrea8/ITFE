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
	@echo -e "\e[31m    __ \e[35m______\e[34m ____\e[32m ___ \e[0m"
	@echo -e "\e[31m   / /\e[35m/__ __/\e[34m/ __/\e[32m/ _/ \e[0m"
	@echo -e "\e[31m  / /  \e[35m/ /  \e[34m/ _/ \e[32m/ _/  \e[0m"
	@echo -e "\e[31m /_/  \e[35m/_/  \e[34m/_/  \e[32m/___/  \e[0m"
	@echo -e ""
	@echo -e "\e[36m make start      | Demarre le projet                                     | up -d\e[0m"          
	@echo -e "\e[36m make startall   | Build et demarre le projet                            | down & up --build -d\e[0m" 
	@echo -e "\e[36m make startall+d | Build et demarre le projet avec les logs              | up --build\e[0m" 
	@echo -e "\e[36m make stop       | Stop le projet                                        | down\e[0m"             
	@echo -e "\e[36m make restart    | Redemarre le projet                                   | stop & start\e[0m"        
	@echo -e "\e[36m make restart+d  | Redemarre le projet avec les logs                     | down & up\e[0m"
	@echo -e "\e[36m make clean      | Supprime les conteneurs et volumes                    | down -v\e[0m"
	@echo -e "\e[36m make cleanAll   | Supprime conteneurs, volumes, et images               | \e[0m"
	@echo -e "\e[36m make logs       | Affiche les logs de tous les conteneurs en temps reel | logs -f\e[0m"
	@echo -e ""
	@echo -e "-------------------------------------------------------------------------------"
	@echo -e "\e[31m NEXT STEP RUN: make startall+d\e[0m"
	@echo -e ""
	@echo -e "\e[34m Commencer a explorer\e[0m \e[32m https://localhost \e[0m"                           
	@echo -e "\e[34m Information projet\e[0m   \e[32m https://localhost/doc \e[0m"                           
	@echo -e "\e[34m Information API\e[0m      \e[32m https://localhost/doc/api \e[0m"      
	@echo -e "-------------------------------------------------------------------------------"
	@echo -e ""