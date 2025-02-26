conectaAuto- Sistema de Gestión de Venta de refacciones automotrices
conectaAuto es una aplicación web que permite gestionar un catálogo de refacciones automotrices para venta, con funcionalidades para agregar, editar, eliminar y buscar refacciones.

## Tecnologías Utilizadas

- **Backend**: FastAPI (Python)
- **Frontend**: HTML, CSS y JavaScript (Vanilla)
- **Iconos**: Font Awesome

## Requisitos Previos

- Python 3.8 o superior
- Navegador web moderno

## Instalación

1. Clona el repositorio:
   
   ```

2. Crea un entorno virtual:
   ```
   python -m venv venv
   ```

3. Activa el entorno virtual:
   - En Windows:
     ```
     venv\Scripts\activate
     ```
   - En macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Instala las dependencias:
   ```
   pip install -r requirements.txt
   ```

## Ejecutar la Aplicación

1. Inicia el servidor:
   ```
   uvicorn main:app --reload
   ```

2. Abre el navegador y visita:
   ```
   http://localhost:8000
   ```

## Características

- **Catálogo de refacciones automotrices**: Visualización de refaccion en formato de tarjetas.
- **Gestión de refacciones automotrices**: Agregar, editar y eliminar refacciones automotrices.
- **Búsqueda Avanzada**: Filtrar refacciones por modelo, año y rango de precios.
- **Interfaz Responsiva**: Diseñada para funcionar en dispositivos móviles y de escritorio.
- **Validación de Datos**: Validación tanto en el cliente como en el servidor.
- **Notificaciones**: Sistema de notificaciones para informar al usuario sobre el resultado de sus acciones.



## API Endpoints

refacciones_automotrices= part


- `GET /api/part`: Obtener todos las refacciones automotrices.
- `GET /api/part/{part_id}`: Obtener refacciones un por ID.
- `GET /api/part/search/`: Buscar refacciones con filtros (modelo, año, precio).
- `POST /api/part`: Crear un nuevo refacciones.
- `PUT /api/part/{part_id}`: Actualizar un refacciones existente.
- `DELETE /api/cars/{car_id}`: Eliminar un refacciones.

## Estructura del Proyecto

- `main.py`: Servidor FastAPI y definición de endpoints.
- `index.html`: Página principal de la aplicación.
- `static/`: Archivos estáticos.
  - `app.js`: Lógica de cliente y comunicación con la API.
  - `styles.css`: Estilos CSS.
- `requirements.txt`: Dependencias del proyecto.

## Próximas Funcionalidades

- Autenticación de usuarios
- Panel de administración
- Imágenes para cada auto
- Estadísticas de ventas
- Integración con sistemas de pago

## Colaboradores

- [Tu Nombre](https://github.com/tu-usuario)

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

conectaAuto/
├── static/
│   ├── app.js
│   └── styles.css
├── index.html
├── main.py
├── requirements.txt
└── README.md