
# Gra Pang na Motorola Science Cup 2022

Implementacja gry Pang w TypeScript, stworzona na konkurs [Motorola Science Cup](https://science-cup.pl/) 2022.

Gra wykorzystuje silnik graficzny [PixiJS](https://pixijs.com/).
Interfejs graficzny jest zbudowany przy użyciu biblioteki [React](https://reactjs.org/).

## Uruchamianie

Sklonuj projekt i wejdź do folderu z projektem

```bash
  git clone https://github.com/NikodemMarek/pang-motorola.git
  cd pang-motorola
```

Pobierz zależności

```bash
  npm install
```

Uruchom serwer

```bash
  npm run start
```

lub uruchom aplikację przez [Electron](https://www.electronjs.org/)

```bash
  npm run electron-run
```

Gotowa do uruchomienia gra znajduje się [tutaj](https://github.com/NikodemMarek/pang-motorola/tree/build/build).

## Testy

Testy są uruchamiane automatycznie podczas buildu.  
Dodatkowo mogą zostać uruchomione za pomocą komendy

```bash
  npm run test
```

&nbsp;  
Wykorzystanym frameworkiem testowym jest [Jest](https://jestjs.io/).  
Ponieważ do renderowania gry wykorzystane są zewnętrzne biblioteki, testowana jest tylko fizyka w grze.

## Dokumentacja

Dokumentacja została wykonana przy użyciu generatora dokumentacji [TypeDoc](https://typedoc.org/).

Dokumentacja znajduje się [tutaj](https://nikodemmarek.github.io/pang-motorola/).  
Wykaz zrealizowanych założeń zadania konkursowego, znajduje się [tutaj](https://github.com/NikodemMarek/pang-motorola/wiki/Za%C5%82o%C5%BCenia-konkursowe).
## Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [PixiJS](https://pixijs.com/)
- [React](https://reactjs.org/)
- [Electron](https://www.electronjs.org/)
- [Jest](https://jestjs.io/)
- [TypeDoc](https://typedoc.org/)
- [webpack](https://webpack.js.org/)