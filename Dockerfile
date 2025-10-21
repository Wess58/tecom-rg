# Copy the files from the dist to the container
FROM nginx:stable
COPY dist/browser /usr/share/nginx/html

# Copy the config
COPY nginx.conf /etc/nginx/nginx.conf

## Build
# ng build && sudo docker build -t kitunda/tecom-rg:1.0.0 . && sudo docker push kitunda/tecom-rg:1.0.0
## Run alias to login 
## cd into server an run compose
# cd apps/tecom && docker compose pull && docker compose down tecom-admin && docker compose up -d tecom-admin