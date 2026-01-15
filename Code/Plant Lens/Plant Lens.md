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
ollama pull llama2gemma3:1b
```

Ouzvrir deux terminaux, avec l'arduinio connecté en USB.

```bash
  cd client/
  yarn dev
```

```bash
  cd server/
  yarn dev
```

La page index.html est le portail de communication avec l'arduino (Controller).
La page remote.html est la télécomande qui permet de lancer les requetes websocket (Remote).

Le projet est exposé sur [sandbox.tekh.studio](https://sandbox.tekh.studio), et fonctionne de la même manière.

## Important

L'API Web Serial ne fonctionne qu'avec Microsoft Edge et Google Chrome (et les navigateurs basés sur Chromium).
