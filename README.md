1. Install dependencies:
```
    bun install
```

2. Start local PostgreSQL server
```
    bun run docker:bettercap:dev:up
```

3. Add properties to .env
```
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
```
4. Start SQL server and generate + migrate Prisma schema:
```
    bun run prisma:deploy
```

5. Run server
```
    nx run bettercap-ui:serve
```

    Go to http://localhost:3100 and try to login

6. Run build for, and run, Capacitor
```
    nx run bettercap-ui:build
    nx run bettercap-ui:cap-sync
    nx run bettercap-ui:cap-run
```
