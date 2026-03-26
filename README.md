# farmatodo-qa-automatizacion

Prueba tecnica de QA Automation para Farmatodo. Incluye pruebas de integracion contra la PokeAPI y pruebas E2E sobre SauceDemo, ambas con Playwright y TypeScript.

## Prerrequisitos

- Node.js >= 18
- npm

## Instalacion

```bash
npm install
npx playwright install chromium
```

## Ejecucion de pruebas

Todas las pruebas:

```bash
npm test
```

Solo pruebas de API (integracion con PokeAPI):

```bash
npm run test:api
```

Solo pruebas E2E (SauceDemo):

```bash
npm run test:e2e
```

Otros modos utiles:

```bash
npm run test:headed    # con browser visible
npm run test:slow      # E2E con browser visible en camara lenta
npm run test:debug     # modo debug de Playwright
npm run report         # abrir reporte HTML
```

## Estructura del proyecto

```
tests/
  api/
    squirtle-evolution-chain.spec.ts   # cadena de evoluciones de Squirtle
  e2e/
    purchase-fleece-jacket.spec.ts     # flujo de compra completo
    pages/
      login.page.ts
      inventory.page.ts
      cart.page.ts
      checkout.page.ts
playwright.config.ts                   # dos projects: api y e2e
tsconfig.json
```

## Decisiones tecnicas

**Ordenamiento manual:** El test de API ordena los pokemon alfabeticamente usando bubble sort implementado a mano, sin recurrir a `.sort()` ni `.toSorted()`, como lo requiere el enunciado.

**Page Object Model:** El test E2E separa la interaccion con cada pagina (login, inventario, carrito, checkout) en su propia clase. Esto mantiene el test legible y los selectores centralizados.

**Dos projects en Playwright:** La config define un project `api` (sin browser, solo request context) y un project `e2e` (Chromium). Esto permite ejecutarlos de forma independiente o juntos.
