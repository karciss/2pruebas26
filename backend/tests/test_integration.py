import json

from fastapi.testclient import TestClient

from backend import main
from backend.store import JsonStore


def test_api_persists_category_and_product(tmp_path, monkeypatch):
    db_path = tmp_path / "db.json"
    monkeypatch.setattr(main, "store", JsonStore(db_path))
    client = TestClient(main.app)

    category = client.post("/api/categorias", json={"nombre": "Papelería"})
    assert category.status_code == 201
    product = client.post("/api/productos", json={
        "nombre": "Cuaderno", "categoria_id": category.json()["id"]})
    assert product.status_code == 201

    saved = json.loads(db_path.read_text(encoding="utf-8"))
    assert saved["categorias"] == client.get("/api/categorias").json()
    assert saved["productos"] == client.get("/api/productos").json()
    assert saved["productos"] == [product.json()]
