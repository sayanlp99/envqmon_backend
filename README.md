
# EnvQMon Backend Microservices

This repository contains a microservice-based backend architecture for the EnvQMon system. It includes the following services:

- `api_gateway`
- `authentication_service`
- `user_service`
- `device_service`
- `device_data_service`
- `home_service`

## 🖥️ Prerequisites

- OS: **Linux** (Ubuntu or any Debian-based distro recommended)
- Node.js (Install via `nvm`)

---

## ⚙️ Setup Instructions

### 1. Install Node.js using NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
```

### 2. Clone the Repository

```bash
git clone https://github.com/sayanlp99/envqmon_backend.git
cd envqmon_backend
```

### 3. Create `.env` files

For each service, add a `.env` file under its folder as required.

Example:

```bash
touch api_gateway/.env
touch authentication_service/.env
# Repeat for other services
```

> Make sure to configure DB credentials, JWT secrets, ports, etc. in each `.env`.

---

## 🛠️ Build Each Service

Run `npm install` and `npm run build` inside **each** service directory:

```bash
cd api_gateway
npm install
npm run build

cd ../authentication_service
npm install
npm run build

cd ../user_service
npm install
npm run build

cd ../device_service
npm install
npm run build

cd ../device_data_service
npm install
npm run build

cd ../home_service
npm install
npm run build
```

---

## 🚀 Run Services with PM2

### 1. Install PM2 & Toolchain Globally

```bash
npm install -g pm2 ts-node typescript
```

### 2. Start All Services

From the project root:

```bash
pm2 start pm2.config.js
```

### 3. View Running Services

```bash
pm2 ls
```

### 4. Persist PM2 on Restart

```bash
pm2 save
pm2 startup
```

---

## 📂 Project Structure

```text
envqmon_backend/
├── api_gateway/
├── authentication_service/
├── user_service/
├── device_service/
├── device_data_service/
├── home_service/
└── pm2.config.js
```

---

## ✅ Tips

* Check logs with `pm2 logs <service-name>`
* Restart a single service: `pm2 restart <service-name>`
* Stop all: `pm2 stop all`

---

