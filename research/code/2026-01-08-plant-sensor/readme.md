## Plant Sensor

Mesurer le niveau d'humidité de la terre et faire bouger un servo moteur aléatoirement si le niveau d'humidité est en dessous de 100/500.

## Ressources

- [Muscle Sensor](https://learn.sparkfun.com/tutorials/myoware-muscle-sensor-kit/all) - electrode ECG prévu pour les muscles humains

## Capteur d'humidité des sol "DIY"

La plante est reliée au 5V et au GND.
Renvoie une valeur entre 0 (sec) et 500 (eau).

```mermaid
flowchart LR
    V5["5V"] --> Plant["🌱 Plante"]
    Plant --> Node["Nœud"]

    Node --> A0["A0<br/>(0–500)"]
    Node --> R["Résistance<br/>1 MΩ"]
    R --> GND["GND"]

    GND --> Plant
```

## Résultat

![Plant Sensor](./docs/2026-01-08-experimentation-sensor-plant-4.jpeg)
![Plant Sensor](./docs/2026-01-08-experimentation-sensor-plant-1.jpeg)
![Plant Sensor](./docs/2026-01-08-experimentation-sensor-plant-3.gif)
![Plant Sensor](./docs/2026-01-08-experimentation-sensor-plant-2.gif)
