build:
	docker-compose up --build -d

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
