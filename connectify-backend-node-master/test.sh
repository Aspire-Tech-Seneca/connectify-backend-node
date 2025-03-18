docker exec -it mongodb_container mongosh -u admin -p adminpass

use chatDB

db.messages.find().pretty()
