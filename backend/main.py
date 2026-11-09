import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from .store import JsonStore


class CategoryInput(BaseModel):
    nombre: str = Field(min_length=1)


class ProductInput(BaseModel):
    nombre: str = Field(min_length=1)
    categoria_id: int


app = FastAPI(title="Inventario de categorías y productos")
store = JsonStore(os.environ.get("DB_PATH", Path(__file__).with_name("db.json")))


@app.get("/api/categorias")
def list_categories():
    return store.categories()


@app.post("/api/categorias", status_code=201)
def create_category(payload: CategoryInput):
    return store.create_category(payload.nombre)


@app.get("/api/productos")
def list_products():
    return store.products()


@app.post("/api/productos", status_code=201)
def create_product(payload: ProductInput):
    try:
        return store.create_product(payload.nombre, payload.categoria_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
