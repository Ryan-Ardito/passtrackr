# Passtracker

## Running the dev environment
Start the dev database server:
```bash
docker-compose -f ./dev_db/docker-compose.yml up -d
```
Start the app in dev mode:
```bash
yarn taruri dev
```
## Stopping the dev database server
```bash
docker-compose -f ./dev_db/docker-compose.yml down
```