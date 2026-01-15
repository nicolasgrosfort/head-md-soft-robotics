---
tags:
  - serial
  - web
  - arduino
  - websocket
date: 2026-01-12
description: Etablir une communication bi-directionnelle entre mon arduino et un serveur web socket, de sorte à pouvoir connaitre son état depuis partout dans le monde, et pouvoir agir dessus.
---
## Recherche

![[2026-01-13-topen-close-water-prototype.gif]]

![[2026-01-14-llm-open-ai-api-demo-1.gif]]
![[2026-01-13-try-to-make-robot-breath.jpeg]]
![[2026-01-13-try-to-make-robot-breath.heic]]

![[2026-01-13-plant-robot-under-drip.jpeg]]
## Lancer le projet

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
