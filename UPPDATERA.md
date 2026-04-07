# Uppdatera liga.js inför ny omgång

## Lag-ID:n
| Lag | Entry ID |
|-----|----------|
| Hammarby | `42398` |
| Djurgården | `46847` |

## API-anrop

### 1. Kolla senaste GW och totalpoäng
```
GET https://fantasy.allsvenskan.se/api/entry/42398/history/
GET https://fantasy.allsvenskan.se/api/entry/46847/history/
```
Titta på `current[]` — sista objektet är senaste GW.

### 2. Hämta spelarpoäng för en GW
```
GET https://fantasy.allsvenskan.se/api/entry/42398/event/{gw}/picks/
GET https://fantasy.allsvenskan.se/api/entry/46847/event/{gw}/picks/
```
Ersätt `{gw}` med omgångsnumret, t.ex. `2`.

### 3. Spelarnamn (om du behöver matcha ID → namn)
```
GET https://fantasy.allsvenskan.se/api/bootstrap-static/
```
Hitta `web_name` för varje spelare via deras `id`.

## Uppdatera liga.js

Lägg till ett nytt objekt i `omgangar`-arrayen i `src/data/liga.js`:

```js
{
  omgang: 2,
  poang: {
    Oliver: 0, Alle: 0, Josef: 0, Magnus: 0,       // Hammarby
    Erik: 0, Hellman: 0, Manne: 0, Lindmark: 0,    // Djurgården
  },
},
```

## Deploy
```bash
npm run build
```
Dra `dist/`-mappen till [drop.netlify.com](https://drop.netlify.com).
