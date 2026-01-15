# Web Serial + WebSocket avec Arduino

Etablir une communication bi-directionnelle entre mon arduino et un serveur web socket, de sorte à pouvoir connaitre son état depuis partout dans le monde, et pouvoir agir dessus.

## Lancer le projet

Ouvrir deux terminaux, avec l'arduino connecté en USB.

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

## Important

L'API Web Serial ne fonctionne qu'avec Microsoft Edge et Google Chrome (et les navigateurs basés sur Chromium).

## Résultats

![Open Close Water](./docs/2026-01-13-open-close-water-prototype.gif)
![Plant Robot Under Drip](./docs/2026-01-13-plant-robot-under-drip.jpeg)
![LLM Open AI API Demo](./docs/2026-01-14-llm-open-ai-api-demo-1.gif)
