build:
	mkdir -p ~/data/database/
	mkdir -p ~/data/pgadmin/
	docker-compose -f "docker-compose.yml" up -d --build

down:
	docker-compose down

start:
	docker-compose start

stop:
	docker-compose stop

restart: stop start

clear: down
	docker volume rm $(shell docker volume ls -q)

rebuild: clear build

prune:
	docker system prune -a
	docker volume prune

purge: clear prune
