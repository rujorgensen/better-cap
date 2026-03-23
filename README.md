## Setup & Run

1. **Install dependencies**
   ```sh
   bun install
   ```

2. **Start local PostgreSQL server**
   ```sh
   bun run docker:bettercap:dev:up
   ```

3. **Add properties to `.env`**
   ```env
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   ```

4. **Set up database and Prisma**
   ```sh
   bun run prisma:deploy
   ```

5. **Run the server**
   ```sh
   nx run bettercap-ui:serve
   ```
   Open [http://localhost:3101](http://localhost:3101) and try to log in.

6. **Build and run Capacitor**
   This builds the app, sync Capacitor and runs:


   ```sh
   nx run bettercap-ui:cap-run
   ```