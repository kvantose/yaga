Мой телеграм https://t.me/Y_Kotelnukoff

docker build --platform linux/amd64,linux/arm64 -t yaga-frontend ./forntend
docker save yaga-frontend | gzip > yaga-frontend.tar.gz

на сервере
docker load < tmp/yaga-frontend.tar.gz