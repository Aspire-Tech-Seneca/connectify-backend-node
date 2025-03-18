docker stop mongodb_container
docker rm mongodb_container

docker stop chat_network
docker rm chat_network

docker network create chat_network  # Create a network (if not created)

docker run -d --name mongodb_container --network chat_network -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=adminpass mongo

docker run -d --name chat_server --network chat_network -p 3000:3000 \
  -v $(pwd):/app -w /app node sh -c "npm install && npm start"
