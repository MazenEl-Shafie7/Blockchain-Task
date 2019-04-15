# Blockchain-Task
#To start the network :
	./byfn.sh generate
	./byfn.sh up -s couchdb
#To stop the network:
	./byfn.sh down
	docker rm -f $(docker ps -aq)
	docker volume rm $(docker volume ls -q)
	docker system prune -f
