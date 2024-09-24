const budgetInput = document.querySelector('.input__budget');
const submitButton = document.querySelector('.submit__budget');
const budgetStatusShow = document.querySelector('.budget__state')
const budgetBalance = document.querySelector('.budget__balance')


budgetInput.addEventListener('input', function() {
    const budgetValue = parseFloat(budgetInput.value);
    const inputValue = budgetInput.value.trim();

    // Si el presupuesto es nulo, no es un número, o es menor o igual a cero, deshabilitar el botón
    if (isNaN(budgetValue) || budgetValue <= 0) {
        submitButton.disabled = true;  // Deshabilita el botón
    } else {
        submitButton.disabled = false;  // Habilita el botón si es un valor válido
        submitButton.classList.remove('hide')
    }

    if (inputValue === '' || isNaN(parseFloat(inputValue)) || parseFloat(inputValue) <= 0) {
        submitButton.disabled = true;  // Deshabilita el botón
    } else {
        submitButton.disabled = false;  // Habilita el botón si es un valor válido
    }

});

submitButton.addEventListener('click', function() {
    const budgetValue = parseFloat(budgetInput.value);

    localStorage.setItem('budget', budgetValue)

    const displayBudget = document.querySelector('.display__budget');
    const displayBalance = document.querySelector('.budget__balance')
    
    displayBudget.textContent = `El presupuesto ingresado es de: $ ${budgetValue.toFixed(2)}`;
    displayBalance.textContent = `El presupuesto restante es de: $${budgetBalanceCal().toFixed(2)}`;


    submitButton.classList.add('hide')
    budgetInput.classList.add('hide')
    
    addExpenseIcon.classList.remove('hide')

    window.budgetValue = budgetValue.toFixed(2);
    
});


const addExpenseIcon = document.querySelector('.add__expenseIcon')
const backModalSection = document.querySelector('.div_backModal')
const modalSection = document.querySelector('.modal__section')
const closeModalIcon = document.querySelector('.close__modalIcon')
const submitData = document.querySelector('.submit__data')

addExpenseIcon.addEventListener('click', () => {
    backModalSection.classList.add('showFlex')
    modalSection.classList.add('show')
})

closeModalIcon.addEventListener('click', () => {
    backModalSection.classList.remove('showFlex')
    modalSection.classList.remove('show')
})

submitData.addEventListener('click', () => {
    backModalSection.classList.remove('showFlex')
    modalSection.classList.remove('show')
})


//Clase para crear los gastos
class Expense {
    constructor(id, description, date, category, amount) {
        this.id = id
        this.description = description
        this.date = date
        this.category = category
        this.amount = amount
    }
}

let expendId = 0

const idGenerator = () => {
    return Date.now() + expendId++
}

let expensesArray = []

//Función para dar accion al boton de enviar del modal y renderizar los gastos
document.querySelector('.submit__data').addEventListener('click', () => {
    const date = document.querySelector('.expense__date').value;
    const description = document.querySelector('.expense__description').value
    const category = document.querySelector('.select__activity').value
    const amount = parseFloat(document.querySelector('.expense__value').value);
    const divNewCategory = document.querySelector('.div__newCategory');

    const id = idGenerator()

    budgetStatusShow.classList.remove('hide')

    const newExpense = new Expense(id, description, date, category, amount);
    expensesArray.push(newExpense);

    localStorage.setItem('expenses', JSON.stringify(expensesArray))

    divNewCategory.classList.add('hide')

    renderExpenses()
    updateExpenseProgress();
    renderBudgetBalance();
    clearModalForm();

})

const descriptionInput = document.querySelector('.expense__description');
const categoryInput = document.querySelector('.select__activity');
const amountInput = document.querySelector('.expense__value');
const submitDataButton = document.querySelector('.submit__data');
const dateExpense = document.querySelector('.expense__date')

// Función para habilitar/deshabilitar el botón según la validación
const validateForm = () => {
    const description = descriptionInput.value.trim();
    const category = categoryInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    const date = dateExpense.value.trim();

    // Verificar si los campos están vacíos o si el monto no es válido (NaN o menor o igual a 0)
    if (description === '' || category === '' || isNaN(amount) || amount <= 0 || date === '') {
        submitDataButton.disabled = true; // Deshabilitar el botón si la validación falla
    } else {
        submitDataButton.disabled = false; // Habilitar el botón si todo es válido
        submitDataButton.classList.remove('hide')
    }
};

document.addEventListener('DOMContentLoaded', function() {
    flatpickr("#expense-date", {
        dateFormat: "d-M-Y", // Formato de fecha
        altInput: true,      // Opción para mostrar una fecha amigable (si deseas)
        altFormat: "F j, Y", // Formato amigable que se muestra
        locale: "es"         // Cambia a español (opcional)
    });
});


// Agregar eventos para validar en tiempo real mientras el usuario escribe o cambia datos
descriptionInput.addEventListener('input', validateForm);
categoryInput.addEventListener('input', validateForm);
amountInput.addEventListener('input', validateForm);

//Función que renderiza los datos de los gastos
const renderExpenses = () => {
    const expensesList = document.querySelector('.div__expenses')

    let totalAmount = calculateTotalExpenses(); // Calcula el total de los gastos

    expensesList.innerHTML = ''

    expensesArray.forEach((expense) => {
        const expenseItem = document.createElement('div')
        expenseItem.classList.add('expense_item')
        expenseItem.innerHTML = `
        <div class="divItem">
            <p class="item__id">ID: ${expense.id}</p>
            <p class="item__description">Descripción: ${expense.description}</p>
            <p class="item__date">Fecha: ${expense.date}</p>
            <p class="item__category">Categoría: ${expense.category}</p>
            <p class="item__amount">Monto: $${parseFloat(expense.amount).toFixed(2)}</p>
            <div class="divIcons">
                <p class="item__delete" data-id="${expense.id}">Borrar</p>
                <p class="item__edit">Editar</p>
            </div>
        </div>    `

            expensesList.appendChild(expenseItem);
    })

    const totalExpensed = document.querySelector('.total__expenses')
    totalExpensed.textContent = `Total de gastos: $${totalAmount.toFixed(2)}`;

    assignDeleteEvent();
}

//Función que calcula el total de la cantidad de los gastos
const calculateTotalExpenses = () => {
    return expensesArray.reduce((total, expense) => {
        return total + parseFloat(expense.amount);
    }, 0); // El valor inicial del acumulador es 0
};

//Funcion que actualiza el % de uso del presupuesto y actualiza la barra
const updateExpenseProgress = () => {
    let totalAmount = calculateTotalExpenses(); // Total de los gastos
    let budget = window.budgetValue || 1; // Si el presupuesto no está definido, usar 1 para evitar división por 0
    let percentSpent = (totalAmount / budget) * 100;
    updateProgress(percentSpent); // Actualiza la barra de progreso con el porcentaje
};

//Función que calcula el presupuesto que no se ha usado, el balance
const budgetBalanceCal = () => {
    console.log('Budget Value:', window.budgetValue);
    let totalAmount = calculateTotalExpenses();
    let budget2 = parseFloat(window.budgetValue) || 1; // Asegúrate de convertir a número
    
    let budgetBalance = budget2 - totalAmount;
    return budgetBalance;
};

//Función que renderiza el presupuesto restante y tambien la función manda mensaje si ya se pasó el presupuesto
const renderBudgetBalance = () => {
    budgetBalance.textContent = `El presupuesto restante es de: $${budgetBalanceCal().toFixed(2)}`;
    
    if (budgetBalanceCal() < 0) {
        const overBudgetMsg = document.querySelector('.over__budget')
        overBudgetMsg.textContent = `** Presupuesto rebasado por la cantidad de $${budgetBalanceCal().toFixed(2)}  **`
        overBudgetMsg.classList.remove('hide')
        overBudgetMsg.style.fontSize = "2vw"
        overBudgetMsg.style.color = "red"
        budgetBalance.style.color = 'red'
    }
};

//Función para crea el array de todos los botones delete__expense y detecta a que boton se le da click
const assignDeleteEvent = () => {
    const deleteButtons = document.querySelectorAll('.item__delete');

    deleteButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const id = Number(event.target.getAttribute('data-id')); // Asegúrate de que sea un número
            deleteExpense(id);
        });
    });
};

//Función que filtra el array de gastos y solo deja los gastos que no fueron seleccionados para eliminar
const deleteExpense = (id) => {
    expensesArray = expensesArray.filter(expense => expense.id !== id); // Filtrar por ID
    renderExpenses(); // Renderizar de nuevo los gastos actualizados
    updateExpenseProgress(); // Actualizar el progreso de los gastos después de borrar
    renderBudgetBalance();
};

//Función que actualiza el estado y el % del presupuesto usado
function updateProgress(percent) {
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    const progressIcon = document.querySelector('.progress-icon');

    // Limitar el porcentaje entre 0 y 100
    percent = Math.max(0, Math.min(100, percent));

    // Actualizar la barra de progreso
    progressFill.style.width = `${percent}%`;

    // Actualizar el texto del porcentaje
    progressPercent.textContent = `${percent.toFixed(2)}%`;

    // Cambiar el icono en función del porcentaje
    if (percent > 0 && percent < 31) {
        progressIcon.textContent = '😁';
        progressFill.style.backgroundColor = 'green'
    } else if (percent > 30 && percent < 66) {
        progressIcon.textContent = '😊'; 
        progressFill.style.backgroundColor = 'green'
    } else if (percent > 65 && percent < 81) {
        progressIcon.textContent = '😕'; 
        progressFill.style.backgroundColor = 'green'
    } else if (percent > 80 && percent < 100) {
        progressIcon.textContent = '😢'; 
        progressFill.style.backgroundColor = 'red'
    } else if (percent =>99) {
        progressIcon.textContent = '😭'; 
        progressFill.style.backgroundColor = 'red'
    }
}

//Función que vacía los campos del modal
const clearModalForm = () => {
    document.querySelector('.expense__description').value = ''
    document.querySelector('.select__activity').value = ''
    document.querySelector('.expense__value').value = ''
    document.querySelector('.submit__data').classList.add('hide')
    document.querySelector('.new__categoryText').value = ''
}

const resetApp = () => {
    // Reiniciar campos del modal
    document.querySelector('.expense__description').value = '';
    document.querySelector('.select__activity').value = '';
    document.querySelector('.expense__value').value = '';
    document.querySelector('.submit__data').classList.add('hide');

    // Reiniciar el presupuesto
    document.querySelector('.display__budget').textContent = '';
    document.querySelector('.budget__balance').textContent = '';
    document.querySelector('.total__expenses').textContent = '';
    submitButton.classList.add('hide');
    
    // Reiniciar la barra de progreso
    updateProgress(0);

    // Vaciar el array de gastos
    expensesArray = [];

    // Recargar la página para volver a su estado inicial
    location.reload();

    // Borrar datos de localStorage
    localStorage.removeItem('budget');
    localStorage.removeItem('expenses');
};

//Aqui se agrega el evento click al icono de resetear la APP
const resetAppButton = document.querySelector('.reset__icon')
resetAppButton.addEventListener('click', () => {
    resetApp()
})

document.addEventListener('DOMContentLoaded', () => {
    // Cargar el presupuesto desde localStorage si existe
    const storedBudget = localStorage.getItem('budget');
    if (storedBudget) {
        window.budgetValue = parseFloat(storedBudget);
        document.querySelector('.display__budget').textContent = `El presupuesto ingresado es de: $ ${storedBudget}`;
        document.querySelector('.budget__balance').textContent = `El presupuesto restante es de: $${budgetBalanceCal().toFixed(2)}`;
        submitButton.classList.add('hide');
        budgetInput.classList.add('hide');
        addExpenseIcon.classList.remove('hide');
    }

    // Cargar los gastos desde localStorage si existen
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expensesArray = JSON.parse(storedExpenses);
        renderExpenses();
        updateExpenseProgress();
        renderBudgetBalance();
    }  
});


//Función donde se asigna el evento click a selector de categoria de gasto y se pregunta si se dió click en crear categoria
document.addEventListener('DOMContentLoaded', () => {
    const selectActivity = document.querySelector('.select__activity');
    const divNewCategory = document.querySelector('.div__newCategory');
    const newCategoryButton = document.querySelector('.new__categoryButton')

    // Cargar categorías desde localStorage al cargar la página
    loadCategories();

    selectActivity.addEventListener('click', (event) => {
        if (event.target.value === 'createCategory') {
            divNewCategory.classList.remove('hide');
        }
    });

    newCategoryButton.addEventListener('click', () => {
        addCategory()
        divNewCategory.classList.add('hide')
        document.querySelector('.select__activity').value = ''
    })
});

const displayGraphButton = document.querySelector('.graph__displayButton')
const closeGraphIcon = document.querySelector('.close__graphIcon')
const divGraph = document.querySelector('.div__chart')

//Función que crea la nueva categoría y se añade al DOM con el nombre de categoria personalizado
const addCategory = () => {
    const newCategory = document.createElement('option')
    const selectActivity = document.querySelector('.select__activity');
    const newCategoryText = document.querySelector('.new__categoryText')

    selectActivity.appendChild(newCategory)
    newCategory.classList.add('new__category')
    newCategory.textContent = newCategoryText.value

    // Guardar la nueva categoría en localStorage
    saveCategory(newCategoryText.value);
}

// Función para guardar una categoría en localStorage
const saveCategory = (category) => {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    categories.push(category);
    localStorage.setItem('categories', JSON.stringify(categories));
};

// Función para cargar categorías desde localStorage
const loadCategories = () => {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    const selectActivity = document.querySelector('.select__activity');

    categories.forEach(category => {
        const newCategory = document.createElement('option');
        newCategory.classList.add('new__category');
        newCategory.textContent = category;
        selectActivity.appendChild(newCategory);
    });
};