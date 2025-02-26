document.addEventListener('DOMContentLoaded', () => {
    // Cache de elementos DOM
    const partGrid = document.getElementById('parts');
    const addPartForm = document.getElementById('addPartForm');
    const editPartForm = document.getElementById('editPartForm');
    const searchPartForm = document.getElementById('searchPartForm');
    const clearSearchBtn = document.getElementById('clearSearch');
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeModalBtn = document.querySelector('.close');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    
    // Variable para almacenar el ID de la refacción a eliminar
    let partToDeleteId = null;

    // API URL base
    const API_URL = 'http://localhost:8000/api';

    // Funciones para interactuar con la API
    async function fetchParts(searchParams = '') {
        try {
            const response = await fetch(`${API_URL}/parts${searchParams}`);
            if (!response.ok) {
                throw new Error('Error al cargar las refacciones');
            }
            const parts = await response.json();
            renderParts(parts);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    async function fetchPartById(id) {
        try {
            const response = await fetch(`${API_URL}/parts/${id}`);
            if (!response.ok) {
                throw new Error('Refacción no encontrada');
            }
            return await response.json();
        } catch (error) {
            showNotification(error.message, 'error');
            return null;
        }
    }

    async function createPart(partData) {
        try {
            const response = await fetch(`${API_URL}/parts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(partData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al crear la refacción');
            }
            
            const newPart = await response.json();
            showNotification('Refacción agregada con éxito', 'success');
            return newPart;
        } catch (error) {
            showNotification(error.message, 'error');
            return null;
        }
    }

    async function updatePart(id, partData) {
        try {
            const response = await fetch(`${API_URL}/parts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(partData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al actualizar la refacción');
            }
            
            const updatedPart = await response.json();
            showNotification('Refacción actualizada con éxito', 'success');
            return updatedPart;
        } catch (error) {
            showNotification(error.message, 'error');
            return null;
        }
    }

    async function deletePart(id) {
        try {
            const response = await fetch(`${API_URL}/parts/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al eliminar la refacción');
            }
            
            showNotification('Refacción eliminada con éxito', 'success');
            return true;
        } catch (error) {
            showNotification(error.message, 'error');
            return false;
        }
    }

    // Función para renderizar las refacciones
    function renderParts(parts) {
        partGrid.innerHTML = '';
        
        if (parts.length === 0) {
            partGrid.innerHTML = '<div class="no-results">No se encontraron refacciones</div>';
            return;
        }
        
        parts.forEach(part => {
            const partCard = document.createElement('div');
            partCard.className = 'part-card';
            
            // Definir un icono según la categoría
            let categoryIcon = 'fa-cogs';
            if (part.category.toLowerCase().includes('filtro')) {
                categoryIcon = 'fa-filter';
            } else if (part.category.toLowerCase().includes('freno')) {
                categoryIcon = 'fa-brake-warning';
            } else if (part.category.toLowerCase().includes('suspensión')) {
                categoryIcon = 'fa-car-side';
            } else if (part.category.toLowerCase().includes('motor')) {
                categoryIcon = 'fa-engine';
            } else if (part.category.toLowerCase().includes('transmisión')) {
                categoryIcon = 'fa-gear';
            }
            
            partCard.innerHTML = `
                <div class="part-image">
                    <i class="fas ${categoryIcon}"></i>
                </div>
                <div class="part-details">
                    <h3 class="part-title">${part.name}</h3>
                    <div class="part-info">
                        <p><i class="fas fa-tag"></i> Categoría: ${part.category}</p>
                        <p><i class="fas fa-car"></i> Compatible: ${part.model_compatibility}</p>
                        <p><i class="fas fa-calendar"></i> Años: ${part.year_range}</p>
                        <p><i class="fas fa-boxes"></i> Stock: ${part.stock} unidades</p>
                    </div>
                    <div class="part-price">$${part.price.toLocaleString()}</div>
                    <div class="part-actions">
                        <button class="btn btn-warning edit-part" data-id="${part.id}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger delete-part" data-id="${part.id}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
            partGrid.appendChild(partCard);
        });
        
        // Agregar event listeners a los botones de editar y eliminar
        document.querySelectorAll('.edit-part').forEach(button => {
            button.addEventListener('click', () => openEditModal(button.dataset.id));
        });
        
        document.querySelectorAll('.delete-part').forEach(button => {
            button.addEventListener('click', () => openDeleteModal(button.dataset.id));
        });
    }

    // Funciones para manejar modales
    async function openEditModal(id) {
        const part = await fetchPartById(id);
        if (part) {
            document.getElementById('editId').value = part.id;
            document.getElementById('editName').value = part.name;
            document.getElementById('editCategory').value = part.category;
            document.getElementById('editModelCompatibility').value = part.model_compatibility;
            document.getElementById('editYearRange').value = part.year_range;
            document.getElementById('editPrice').value = part.price;
            document.getElementById('editStock').value = part.stock;
            
            editModal.style.display = 'flex';
        }
    }

    function closeEditModal() {
        editModal.style.display = 'none';
        editPartForm.reset();
    }

    function openDeleteModal(id) {
        partToDeleteId = id;
        deleteModal.style.display = 'flex';
    }

    function closeDeleteModal() {
        deleteModal.style.display = 'none';
        partToDeleteId = null;
    }

    // Función para mostrar notificaciones
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar notificación con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Ocultar y eliminar notificación después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Event Listeners
    // Formulario para agregar una refacción
    addPartForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const partData = {
            id: parseInt(document.getElementById('id').value),
            name: document.getElementById('name').value,
            category: document.getElementById('category').value,
            model_compatibility: document.getElementById('modelCompatibility').value,
            year_range: document.getElementById('yearRange').value,
            price: parseInt(document.getElementById('price').value),
            stock: parseInt(document.getElementById('stock').value)
        };
        
        const newPart = await createPart(partData);
        if (newPart) {
            addPartForm.reset();
            fetchParts();
        }
    });

    // Formulario para editar una refacción
    editPartForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('editId').value);
        const partData = {
            name: document.getElementById('editName').value,
            category: document.getElementById('editCategory').value,
            model_compatibility: document.getElementById('editModelCompatibility').value,
            year_range: document.getElementById('editYearRange').value,
            price: parseInt(document.getElementById('editPrice').value),
            stock: parseInt(document.getElementById('editStock').value)
        };
        
        const updatedPart = await updatePart(id, partData);
        if (updatedPart) {
            closeEditModal();
            fetchParts();
        }
    });

    // Formulario para buscar refacciones
    searchPartForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const model = document.getElementById('searchModel').value;
        const category = document.getElementById('searchCategory').value;
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        
        let searchParams = '/search/?';
        if (model) searchParams += `model=${model}&`;
        if (category) searchParams += `category=${category}&`;
        if (minPrice) searchParams += `min_price=${minPrice}&`;
        if (maxPrice) searchParams += `max_price=${maxPrice}&`;
        
        // Eliminar el último caracter si es un &
        if (searchParams.endsWith('&')) {
            searchParams = searchParams.slice(0, -1);
        }
        
        // Si solo tenemos /search/?, entonces no hay parámetros
        if (searchParams === '/search/?') {
            searchParams = '';
        }
        
        fetchParts(searchParams);
    });

    // Botón para limpiar búsqueda
    clearSearchBtn.addEventListener('click', () => {
        document.getElementById('searchModel').value = '';
        document.getElementById('searchCategory').value = '';
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        fetchParts();
    });

    // Manejo de modales
    closeModalBtn.addEventListener('click', closeEditModal);
    confirmDeleteBtn.addEventListener('click', async () => {
        if (partToDeleteId) {
            const success = await deletePart(partToDeleteId);
            if (success) {
                closeDeleteModal();
                fetchParts();
            }
        }
    });
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    // Cerrar modales si se hace clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    // Agregar estilos para notificaciones
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification.success {
            border-left: 4px solid #28a745;
        }
        .notification.error {
            border-left: 4px solid #dc3545;
        }
        .notification.info {
            border-left: 4px solid #007bff;
        }
        .notification i {
            font-size: 1.2rem;
        }
        .notification.success i {
            color: #28a745;
        }
        .notification.error i {
            color: #dc3545;
        }
        .notification.info i {
            color: #007bff;
        }
        .no-results {
            text-align: center;
            padding: 2rem;
            font-size: 1.2rem;
            color: #6c757d;
            grid-column: 1 / -1;
        }
    `;
    document.head.appendChild(style);

    // Cargar las refacciones al iniciar la página
    fetchParts();
});