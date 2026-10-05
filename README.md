# messenger

IP address mongodb atlass = 104.167.26.18


Long-term model
users
│
├── contacts
│     ├── owner
│     ├── contact
│     ├── name
│     ├── favorite
│     ├── blocked
│     └── timestamps
│
├── conversations
│     ├── participants
│     ├── lastMessage
│     └── timestamps
│
├── messages
│     ├── conversation
│     ├── sender
│     ├── content
│     ├── attachments
│     ├── status
│     └── timestamps
│
└── sessions
      ├── user
      ├── device
      ├── refreshToken
      └── expiresAt











## The architecture

                         ┌──────────────┐
                         │    Client    │
                         └──────┬───────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                  HTTP                  WebSocket
                    │                       │
                    ▼                       ▼
             Express Router          WS Gateway
                    │                       │
                    ▼                       ▼
               Controllers             WS Events
                    │                       │
                    └──────────┬────────────┘
                               ▼
                         Service Layer
                               │
                 ┌─────────────┼─────────────┐
                 ▼             ▼             ▼
             Contacts    Conversations    Messages
                               │             │
                               └──────┬──────┘
                                      ▼
                                   MongoDB
                                     
                         Redis ◄──── WebSocket
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          Presence       Pub/Sub      Typing




                    HTTP Server
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
          Express               Socket.IO
             │                     │
             ▼                     ▼
        REST Modules         WS Handlers
             │                     │
             └──────────┬──────────┘
                        ▼
                    Services
                        │
                        ▼
                     MongoDB