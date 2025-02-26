from fastapi import FastAPI, Body, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Modelo Pydantic para validación de datos
class Part(BaseModel):
    id: int
    name: str
    category: str
    model_compatibility: str
    year_range: str
    price: int
    stock: int

class PartUpdate(BaseModel):
    name: str
    category: str
    model_compatibility: str
    year_range: str
    price: int
    stock: int

app = FastAPI(
    title="conectaAuto API",
    description="API para gestión de venta de refacciones automotrices",
    version="1.0.0"
)

# Configurar CORS para permitir peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar orígenes exactos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar la carpeta "static" para servir archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Datos de ejemplo - en una aplicación real usarías una base de datos
parts = [
    {
        "id": 1,
        "name": "Filtro de aceite",
        "category": "Filtros",
        "model_compatibility": "Ford, Toyota, Honda",
        "year_range": "2015-2023",
        "price": 250,
        "stock": 45
    },
    {
        "id": 2,
        "name": "Pastillas de freno delanteras",
        "category": "Frenos",
        "model_compatibility": "Chevrolet, Nissan",
        "year_range": "2018-2023",
        "price": 750,
        "stock": 30
    },
    {
        "id": 3,
        "name": "Amortiguador trasero",
        "category": "Suspensión",
        "model_compatibility": "Volkswagen, Audi",
        "year_range": "2016-2022",
        "price": 1200,
        "stock": 15
    }
]

# Ruta para servir el archivo index.html
@app.get("/", tags=['Home'])
def home():
    return FileResponse('templates/index.html')

# API Endpoints
@app.get("/api/parts", tags=['parts'], response_model=List[Part])
def get_all_parts():
    return parts

@app.get("/api/parts/{part_id}", tags=['parts'], response_model=Part)
def get_part_by_id(part_id: int):
    for part in parts:
        if part["id"] == part_id:
            return part
    raise HTTPException(status_code=404, detail="Refacción no encontrada")

@app.get("/api/parts/search/", tags=['parts'])
def search_parts(model: Optional[str] = None, category: Optional[str] = None, min_price: Optional[int] = None, max_price: Optional[int] = None):
    results = parts.copy()
    
    if model:
        results = [part for part in results if model.lower() in part["model_compatibility"].lower()]
    
    if category:
        results = [part for part in results if category.lower() in part["category"].lower()]
    
    if min_price:
        results = [part for part in results if part["price"] >= min_price]
    
    if max_price:
        results = [part for part in results if part["price"] <= max_price]
    
    return results

@app.post("/api/parts", tags=['parts'], response_model=Part)
def create_part(part: Part):
    # Verificar si el ID ya existe
    if any(p["id"] == part.id for p in parts):
        raise HTTPException(status_code=400, detail="ID de refacción ya existe")
    
    # Agregar la nueva refacción
    new_part = part.dict()
    parts.append(new_part)
    return new_part

@app.put("/api/parts/{part_id}", tags=['parts'], response_model=Part)
def update_part(part_id: int, part_update: PartUpdate):
    for part in parts:
        if part["id"] == part_id:
            part["name"] = part_update.name
            part["category"] = part_update.category
            part["model_compatibility"] = part_update.model_compatibility
            part["year_range"] = part_update.year_range
            part["price"] = part_update.price
            part["stock"] = part_update.stock
            return part
    raise HTTPException(status_code=404, detail="Refacción no encontrada")

@app.delete("/api/parts/{part_id}", tags=['parts'], response_model=Part)
def delete_part(part_id: int):
    for i, part in enumerate(parts):
        if part["id"] == part_id:
            return parts.pop(i)
    raise HTTPException(status_code=404, detail="Refacción no encontrada")