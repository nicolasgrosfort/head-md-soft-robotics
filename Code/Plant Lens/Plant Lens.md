---
tags:
  - serial
  - web
  - arduino
  - websocket
date: 2026-01-14
description: Projet final, à documenter. Utilise Ollama, local only
---

## Recherche

![[2026-01-13-topen-close-water-prototype.gif]]

![[2026-01-14-llm-open-ai-api-demo-1.gif]]
![[2026-01-13-try-to-make-robot-breath.jpeg]]
![[2026-01-13-try-to-make-robot-breath.heic]]

![[2026-01-13-plant-robot-under-drip.jpeg]]

## Lancer le projet

### Installer Homebrew

Si Homebrew n'est pas installé, l'installer avec la commande:

```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Installer Ollama

Intaller Ollama et télécharger le modèle gemma3:1b.

```bash
  brew install ollama
  ollama pull gemma3:1b
```

### Installer node.js & yarn

Installer node.js avec Homebrew:

```bash
  brew install node
  brew install yarn
```

### Lancer le serveur et le client

```bash
  cd client/
  yarn install
  yarn dev
```

```bash
  cd server/
  yarn install
  yarn dev
```

### Brancher l'Arduino ou ouvrir Chrome

1. Brancher l'Arduino en USB.
2. Ouvrir Google Chrome.
   1. Un onglet à l'adresse: `localhost:5173` pour connecter l'Arduino.
   2. Un onglet à l'adresse: `localhost:5173/llm` pour le chat.

Il est possible d'envoyer des comandes directement à l'Arduino via l'onglet `localhost:5173/remote`.

## Important

L'API Web Serial ne fonctionne qu'avec Microsoft Edge et Google Chrome (et les navigateurs basés sur Chromium).
