# Passtracker

## Running the dev environment
Clone the repo:
```bash
git clone https://github.com/Ryan-Ardito/passtrackr.git
cd passtrackr
```
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