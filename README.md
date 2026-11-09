# 2pruebas26

Inventario de categorías y productos con **FastAPI** como backend, **React + Vite** como frontend y persistencia local en `backend/db.json`.

## Estructura

- `backend/main.py`: rutas HTTP `/api/categorias` y `/api/productos`.
- `backend/store.py`: lectura y escritura de `db.json`.
- `backend/tests/test_unit.py`: una prueba unitaria del cálculo de IDs.
- `backend/tests/test_integration.py`: una prueba de API y persistencia JSON.
- `frontend/src/`: interfaz React.
- `frontend/e2e/inventory.spec.js`: una prueba E2E con navegador real.
- `.github/workflows/ci.yml`: instalación, compilación y las tres pruebas en GitHub Actions.

## Ejecutar en local

Requiere Python 3.13 y Node.js 22.

```bash
python -m venv .venv
# Activa .venv según tu sistema operativo.
python -m pip install -r requirements.txt
npm ci --prefix frontend
```

En una terminal, desde la raíz del proyecto:

```bash
python -m uvicorn backend.main:app --reload
```

En otra terminal:

```bash
npm run dev --prefix frontend
```

Abre `http://127.0.0.1:5173`. Vite dirige `/api` al backend en el puerto 8000.

## Pruebas

```bash
python -m pytest -q backend/tests
npm run build --prefix frontend
cd frontend
npx playwright install chromium
npm run test:e2e
```

La prueba de integración usa un archivo temporal y la E2E usa `.e2e-db.json`; ninguna modifica el `backend/db.json` versionado. El workflow comprueba esto al final.
