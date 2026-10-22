# Event flow

clinet -> server:
conversation:join
conversation:leave
message:send

server -> client
message:new
error

later:
typing:start
typing:stop

message:delivered
message:read

presence:online
presence:offline
Step 6 → Redis infrastructure
Step 7 → Online presence
Step 8 → Typing indicators
Step 9 → Delivered/read receipts
Step 10 → Redis Socket.IO adapter for multiple servers
