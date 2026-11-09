import json
import threading
from pathlib import Path


def next_id(items, initial=1):
    """Return the next ID even when records are out of order."""
    return max((item["id"] for item in items), default=initial - 1) + 1


class JsonStore:
    def __init__(self, path):
        self.path = Path(path)
        self.lock = threading.Lock()

    def _read(self):
        if not self.path.exists():
            return {"categorias": [], "productos": []}
        return json.loads(self.path.read_text(encoding="utf-8"))

    def _write(self, data):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    def categories(self):
        with self.lock:
            return self._read()["categorias"]

    def products(self):
        with self.lock:
            return self._read()["productos"]

    def create_category(self, name):
        with self.lock:
            data = self._read()
            category = {"id": next_id(data["categorias"]), "nombre": name}
            data["categorias"].append(category)
            self._write(data)
            return category

    def create_product(self, name, category_id):
        with self.lock:
            data = self._read()
            if not any(category["id"] == category_id for category in data["categorias"]):
                raise ValueError("Categoría no encontrada")
            product = {"id": next_id(data["productos"], initial=101),
                       "nombre": name, "categoria_id": category_id}
            data["productos"].append(product)
            self._write(data)
            return product
