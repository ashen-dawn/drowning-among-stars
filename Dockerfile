from node:13 as builder
workdir /app
copy . /app
run npm install .
run npm run build

from nginx:latest
copy --from=builder /app/build /usr/share/nginx/html
copy ./nginx.conf /etc/nginx/conf.d/default.conf
expose 80
