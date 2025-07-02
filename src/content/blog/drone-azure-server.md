---
title: '在 Azure 虛擬機器上建立 Drone CI/CD 服務器'
description: '詳細教學如何在 Azure 虛擬機器上安裝 Docker、建立 Drone Server 和 Drone Runner，整合 GitLab 實現自動化 CI/CD 流程'
date: 2024-07-02
tags: ['azure', 'drone', 'cicd', 'docker', 'gitlab', 'devops', 'automation']
author: 'ray'
coverImage: '/images/drone-server.png'
draft: false
---

# 建立 azure 虛擬機器

在 azure 先建立一個資源群組

![azure-group](/images/azure-group.png)

之後再建立一個虛擬機器，選擇 Ubuntu

![azure-ubuntu](/images/azure-ubuntu.png)

這邊我選擇的是 Standard_D2s_v3 ubuntu，網路則選擇 Japan East

建立完成後會下載一個 .pem 檔案，保存到 ~/.ssh
透過指令

```bash
ssh -i ~/.ssh/drone-ubuntu-vm_key.pem azureuser@{{public_id}}`
```

連線到虛擬機器

接著先更新

```bash
sudo apt update && sudo apt upgrade -y
```

## 安裝 docker

透過 apt 安裝 docker，這邊透過[官方文檔](https://docs.docker.com/engine/install/ubuntu/)方式來安裝

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

接著執行

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

# 建立 drone server

為了讓其他人的帳號也能夠使用 Drone，要建立一個 openssl 密鑰，這個密鑰會用來加密 Drone 的 RPC 通訊。可以透過以下指令建立：

```bash
# 填入到env的 DRONE_RPC_SECRET
# 這個密鑰可以隨便生成，建議使用 openssl
openssl rand -hex 16
```

接著我們在我們的 server 上先創建一個.env 檔案，並填入以下內容：

```env
# GitLab OAuth 設定
DRONE_GITLAB_SERVER=https://gitlab.com
DRONE_GITLAB_CLIENT_ID=在 GitLab 上建立的應用程式 ID
DRONE_GITLAB_CLIENT_SECRET=在 GitLab 上建立的應用程式密鑰

# Drone Server 設定
DRONE_RPC_SECRET=my-super-secret-key
DRONE_SERVER_HOST=20.243.0.245:8080
DRONE_SERVER_PROTO=http

# 管理員設定（記得改成你的 GitLab 使用者名稱）
DRONE_USER_CREATE=username:your_gitlab_username,admin:true

# 除錯模式
DRONE_LOGS_TRACE=true
DRONE_LOGS_DEBUG=true
```

接著我們下指令來下載 drone 鏡像

在此之前先把 user 加入 docker 群組，這樣就可以不需要 sudo 來執行 docker 指令

```bash
sudo usermod -aG docker $USER
newgrp docker
```

```bash
# 手動下載映像
docker pull drone/drone:2

# 查看已下載的映像
docker images

# 然後再啟動
docker run \
  --volume=/var/lib/drone:/data \
  --env-file=.env \
  --publish=8080:80 \
  --restart=always \
  --detach=true \
  --name=drone \
  drone/drone:2
```

接著我們用幾個測試來看看能不能正常運作：

```bash
# 查看容器狀態
docker ps
```

```bash
# 內部連線測試
curl http://localhost:8080

#會看到
<a href="/welcome">See Other</a>.
```

外部連線測試：

```bash
curl http://{{public_id}}:8080

#會看到
<a href="/welcome">See Other</a>.
```

不行的話可以檢查一下防火牆設定，確保 8080 端口是開放的。

```bash
sudo ufw status
```

如果是 inactive，表示防火牆沒有啟用，可以透過以下指令來啟用：

```bash
sudo ufw enable
sudo ufw allow 8080
sudo ufw allow ssh
```

然後 Azure 的網路安全組也要開放 8080 端口，這樣才能從外部連線到 Drone Server。
![azure-net-work-config](/images/azure-net-work-config.png)

## 在 gitlab 設定 webhook

到專案底下 Settings -> webhook 填入剛剛用 openssl 生成過的密鑰（DRONE_RPC_SECRET），並且填入 Drone Server 的 URL

![webhook](/images/webhook.png)

接著就可以按下旁邊的測試

![webhook-test](/images/webhook-test.png)

# Drone Runner

這裡我們用 Docker Compose 來部署 Drone Runner，也把剛剛的 Drone Server 設定放進來

建立一個 compose.yml 檔案，內容如下：

```yaml
version: '3.8'

services:
  # Drone Server
  drone-server:
    image: drone/drone:2
    container_name: drone-server
    ports:
      - '8080:80'
    volumes:
      - /var/lib/drone:/data
    env_file:
      - .env
    restart: always
    networks:
      - drone

  # Drone Docker Runner
  drone-runner:
    image: drone/drone-runner-docker:1
    container_name: drone-runner
    depends_on:
      - drone-server
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    env_file:
      - .env
    environment:
      - DRONE_RPC_HOST=drone-server # 覆蓋 .env 中的 localhost
    restart: always
    networks:
      - drone

networks:
  drone:
    driver: bridge

volumes:
  drone-data:
    driver: local
```

接著調整 env 檔案，加入 Drone Runner 的設定：

```env
# GitLab OAuth 設定
DRONE_GITLAB_SERVER=https://gitlab.com
DRONE_GITLAB_CLIENT_ID=在 GitLab 上建立的應用程式 ID
DRONE_GITLAB_CLIENT_SECRET=在 GitLab 上建立的應用程式密鑰

# Drone Server 設定
DRONE_RPC_SECRET=my-super-secret-key
DRONE_SERVER_HOST=20.243.0.245:8080
DRONE_SERVER_PROTO=http

# 管理員設定（記得改成你的 GitLab 使用者名稱）
DRONE_USER_CREATE=username:your_gitlab_username,admin:true

# 除錯模式
DRONE_LOGS_TRACE=true
DRONE_LOGS_DEBUG=true

# ===========================================
# Drone Runner Configuration
# ===========================================

# Runner 連線設定
DRONE_RPC_PROTO=http
DRONE_RPC_HOST=localhost:8080

# Runner 設定
DRONE_RUNNER_CAPACITY=2
DRONE_RUNNER_NAME=main-runner
```

```bash
docker compose up -d
```

# 如何使用

做完以上步驟後，你就可以在 GitLab 上建立一個專案，然後在專案根目錄下建立 `.drone.yml` 檔案，內容如下：

```yaml
kind: pipeline
type: docker
name: default

steps:
  - name: hello
    image: alpine
    commands:
      - echo "hello drone"
```

接著我們到剛剛的 Drone Server 網頁，登入後就可以看到剛剛建立的專案了。

![drone-server](/images/drone-server.png)

可以先按下 Sync 來同步專案，然後就可以看到剛剛建立的 pipeline。

之後若是要讓其他人能使用這個服務，可以在 Drone Server 的管理頁面中，新增使用者並設定權限。
