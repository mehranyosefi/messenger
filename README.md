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