Мой телеграм: https://t.me/Y_Kotelnukoff

# Yaga deploy scripts

В проекте используются два скрипта для деплоя:

- `deploy-backend.sh` — деплой backend сервиса через docker-compose
- `deploy-frontend.sh` — сборка frontend образа, загрузка на сервер и перезапуск сервиса

---

## Deploy backend

Скрипт выполняет на сервере:
1. Переход в папку проекта
2. `git pull`
3. Пересборку backend сервиса
4. Перезапуск контейнера

### Использование

```bash
chmod +x deploy-backend.sh
./deploy-backend.sh
```

### Что должно быть на сервере

- Репозиторий уже клонирован
- В папке проекта есть `docker-compose.yml`
- SSH доступ по ключу

---

## Deploy frontend

Скрипт:
1. Собирает образ под linux/amd64
2. Сохраняет его в tar.gz
3. Загружает архив на сервер по SSH
4. Загружает образ в Docker
5. Перезапускает frontend сервис

### Использование

```bash
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

---

## Ручная сборка frontend (если нужно)

```bash
docker build --platform linux/amd64 -t yaga-frontend ./frontend
docker save yaga-frontend | gzip > yaga-frontend.tar.gz
```

На сервере:

```bash
docker load < tmp/yaga-frontend.tar.gz
```

---

## Требования

- Docker + docker compose
- SSH доступ по ключу
- Сервер linux/amd64

---

## Примечание

Frontend и backend деплоятся независимо. Backend тянется из git, frontend — через docker image.