const budgetInput = document.querySelector('.input__budget');
const submitButton = document.querySelector('.submit__budget');
const budgetStatusShow = document.querySelector('.budget__state')
const budgetBalance = document.querySelector('.budget__balance')


budgetInput.addEventListener('input', function () {
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

submitButton.addEventListener('click', function () {
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

    location.reload(); //Se recarga la pagina

});

const editBudgeButton = document.querySelector('.edit__budgetButton')

editBudgeButton.addEventListener('click', () => {
    budgetInput.classList.remove('hide')
})


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
let currentEditId = null; // Declarar la variable al inicio del archivo

//Función para dar accion al boton de enviar del modal y renderizar los gastos y tambien los gastos editados
document.querySelector('.submit__data').addEventListener('click', () => {
    const date = document.querySelector('.expense__date').value;
    const description = document.querySelector('.expense__description').value;
    const category = document.querySelector('.select__activity').value;
    const amount = parseFloat(document.querySelector('.expense__value').value);
    const divNewCategory = document.querySelector('.div__newCategory');

    if (currentEditId) {
        const index = expensesArray.findIndex((expense) => expense.id === currentEditId);
        if (index !== -1) {
            expensesArray[index] = new Expense(currentEditId, description, date, category, amount);

            localStorage.setItem('expenses', JSON.stringify(expensesArray));
            renderExpenses();
            updateExpenseProgress();
            renderBudgetBalance();
            clearModalForm();
            currentEditId = null
        }
    } else {
        const id = idGenerator();

        budgetStatusShow.classList.remove('hide');

        const newExpense = new Expense(id, description, date, category, amount);
        expensesArray.push(newExpense);

        localStorage.setItem('expenses', JSON.stringify(expensesArray));

        divNewCategory.classList.add('hide');

        renderExpenses();
        updateExpenseProgress();
        renderBudgetBalance();
        clearModalForm();
        currentEditId = null
    }
    location.reload(); //Se recarga la pagina
});


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

document.addEventListener('DOMContentLoaded', function () {
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

    //Aqui se actuiliza el expensesArray
    selectAction()


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
                <p class="item__edit" data-id="${expense.id}">Editar</p>
            </div>
        </div>    `

        expensesList.appendChild(expenseItem);
    })


    const totalExpensed = document.querySelector('.total__expenses')
    totalExpensed.textContent = `Total de gastos: $${totalAmount.toFixed(2)}`;

    assignDeleteEvent();
    assignEditEvent();
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
            location.reload()
        });
    });
};

const assignEditEvent = () => {
    const editButtons = document.querySelectorAll('.item__edit')

    editButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const id = Number(e.target.getAttribute('data-id'));
            editExpense(id)
        })
    })
}

const editExpense = (id) => {
    const expenseToEdit = expensesArray.find(expense => expense.id === id)

    if (expenseToEdit) {
        document.querySelector('.expense__description').value = expenseToEdit.description;
        document.querySelector('.select__activity').value = expenseToEdit.category;
        document.querySelector('.expense__value').value = expenseToEdit.amount;
        document.querySelector('.expense__date').value = expenseToEdit.date;

        backModalSection.classList.add('showFlex');
        modalSection.classList.add('show');

        currentEditId = id;
    }
}
//Función que filtra el array de gastos y solo deja los gastos que no fueron seleccionados para eliminar
const deleteExpense = (id) => {
    expensesArray = expensesArray.filter((expense) => expense.id !== id); // Filtrar por ID
    localStorage.setItem('expenses', JSON.stringify(expensesArray)); // Actualizar localStorage
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
    } else if (percent => 99) {
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
    const divResetAppQuestion = document.querySelector('.div__resetAppQuestion')
    const divTitleAndButtonResetApp = document.querySelector('.div__titleAndButtonResetApp')

    divResetAppQuestion.classList.add('showQuestion')
    divTitleAndButtonResetApp.classList.add('showQuestion')

    document.querySelector('.reset__buttonYes').addEventListener('click', () => {
        resetApp()
    })

    document.querySelector('.reset__buttonNo').addEventListener('click', () => {
        divResetAppQuestion.classList.remove('showQuestion')
        divTitleAndButtonResetApp.classList.remove('showQuestion')
    })


    
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
        renderExpensesChart();
    }
});


//Función donde se asigna el evento click a selector de categoria de gasto y se pregunta si se dió click en crear categoria
document.addEventListener('DOMContentLoaded', () => {
    const selectActivity = document.querySelector('.select__activity');
    const divNewCategory = document.querySelector('.div__newCategory');
    const newCategoryButton = document.querySelector('.new__categoryButton')

    // Cargar categorías desde localStorage al cargar la página
    loadCategories();

    selectActivity.addEventListener('change', (event) => {
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

//Función que valida si la categoria a crear existe y si no, crea la nueva categoría y se añade al DOM con el nombre de categoria personalizado
const addCategory = () => {
    const newCategoryText = document.querySelector('.new__categoryText');
    const selectActivity = document.querySelector('.select__activity');
    const newCategoryValue = newCategoryText.value.trim(); // Elimina espacios en blanco

    // Verificar si la categoría ya existe
    let categoryExists = false;
    const options = selectActivity.querySelectorAll('option');
    options.forEach(option => {
        if (option.value.toLowerCase() === newCategoryValue.toLowerCase()) {
            categoryExists = true;
        }
    });

    if (categoryExists) {
        alert('Esta categoría ya existe');
    } else {
        // Crear la nueva categoría si no existe
        const newCategory = document.createElement('option');
        newCategory.classList.add('new__category');
        newCategory.id = "optionId";
        newCategory.setAttribute('value', newCategoryValue);
        newCategory.textContent = newCategoryValue;

        selectActivity.appendChild(newCategory);

        // Guardar la nueva categoría en localStorage
        saveCategory(newCategoryValue);

        copyingCategories();
    }
};

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
    const selectCategory = document.querySelector('.select__category')

    categories.forEach(category => {
        const newCategory = document.createElement('option');
        newCategory.classList.add('new__category')
        newCategory.setAttribute('value', category); // Establece el valor de la opción
        newCategory.id = "optionId"
        newCategory.textContent = category; // Establece el texto de la opción
        const newCategoryClone = newCategory.cloneNode(true);
        selectActivity.appendChild(newCategory);
        selectCategory.appendChild(newCategoryClone)
    });
};

//Función que ordenas los gastos por fecha en orden cronológico
const orderExpensesDate = () => {
    expensesArray.sort((a, b) => new Date(a.date) - new Date(b.date));
}

//Función que ordenas los gastos por fecha en orden cronológico inverso
const orderExpensesDateInverse = () => {
    expensesArray.sort((a, b) => new Date(b.date) - new Date(a.date));
}

//Función que ordenas los gastos por fecha en orden cronológico inverso
const orderExpensesAmountDescendent = () => {
    expensesArray.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
}

//Función que ordenas los gastos por fecha en orden cronológico inverso
const orderExpensesAmountAscendent = () => {
    expensesArray.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
}

//Función que hace la logica para ordenar los gastos de acuerdo a la seleccion que se haga
const selectAction = () => {
    const orderSelector = document.querySelector('.select__order')

    orderSelector.addEventListener('change', (event) => {
        if (event.target.value === 'chronologicTime') {
            orderExpensesDate()
        } else if (event.target.value === 'inverseChronologic') {
            orderExpensesDateInverse()
        } else if (event.target.value === 'descendentAmount') {
            orderExpensesAmountDescendent()
        } else if (event.target.value === 'ascendentAmount') {
            orderExpensesAmountAscendent()
        }
        renderExpenses()
    });
}

const getExpensesByCategory = () => {
    const categories = {};
    expensesArray.forEach((expense) => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += parseFloat(expense.amount);
    });
    return categories;
};

const renderExpensesChart = () => {
    const ctx = document.getElementById('expensesChart').getContext('2d');
    const expensesByCategory = getExpensesByCategory();
    const labels = Object.keys(expensesByCategory);
    const data = Object.values(expensesByCategory);

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Gastos por categoría',
                data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 10,
            }],
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 10,
                        }
                    },
                    title: {
                        display: true,
                        text: 'Categorías',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Monto en $ pesos',
                    font: {
                        size: 12
                        }   
                    }
                },
            },
        },
    });
};

const divChart = document.querySelector('.div__chart')
const chartSection = document.querySelector('.chart__section')
const closeChartIcon = document.querySelector('.close__chartIcon')
const chartIcon = document.querySelector('.chart__icon')

chartIcon.addEventListener('click', () => {
    chartSection.classList.add('showBackChart')
    divChart.classList.add('showChart')
})

closeChartIcon.addEventListener('click', () => {
    chartSection.classList.remove('showBackChart')
    divChart.classList.remove('showChart')
})

const copyingCategories = () => {
    //Copiando los options del select del modal de categorias
    const newSelect = document.querySelector('.select__category')
    const categoryOptions = document.querySelectorAll('.new__category')

    categoryOptions.forEach((option) => {
        const newOption = option.cloneNode(true)
        newSelect.appendChild(newOption)
    })
}

const copyingdefaultCategories = () => {
    const newSelect = document.querySelector('.select__category')
    const defaultCaterories = document.querySelectorAll('.categoryDefault')
    defaultCaterories.forEach((option) => {
        const categoriesInNewSelect = option.cloneNode(true)
        newSelect.appendChild(categoriesInNewSelect)
    })
}

copyingdefaultCategories()

let filteredData = []

//Funcion que filtra los gastos por categoria creando un nuevo arreglo
const filterByCategory = () => {
    const categorySelection = document.querySelector('.select__category')
    const modalExpensesFilteredByCategory = document.querySelector('.modal__expensesFilteredByCategory')
    const divBackFilteredExpenses = document.querySelector('.div__backFilteredExpenses')
    categorySelection.addEventListener('change', function () {
        const selectedCategory = this.value
        console.log(expensesArray)
        console.log(selectedCategory)
        const filteredData = expensesArray.filter(item => {
            console.log(item.category);
            return item.category === selectedCategory;
        });

        modalExpensesFilteredByCategory.classList.add('showFilteredModal')
        divBackFilteredExpenses.classList.add('showBackFilteredModal')
        document.body.classList.add('modal-open'); //Desactiva el scroll detras del modal

        console.log(filteredData)
        renderFilteredExpenses(filteredData)
    })
}

const closeModalFilteredExpensesIcon = document.querySelector('.close__modalFilteredExpensesIcon')
closeModalFilteredExpensesIcon.addEventListener('click', () => {
    const modalExpensesFilteredByCategory = document.querySelector('.modal__expensesFilteredByCategory');
    const divBackFilteredExpenses = document.querySelector('.div__backFilteredExpenses');
    const categorySelection = document.querySelector('.select__category');

    // Cierra el modal
    modalExpensesFilteredByCategory.classList.remove('showFilteredModal');
    divBackFilteredExpenses.classList.remove('showBackFilteredModal');
    document.body.classList.remove('modal-open');  // Reactiva el scroll detrás del modal

    // Limpia el campo de categoría
    categorySelection.value = '';

    // Limpia los campos de fecha con flatpickr
    if (dateInitPicker) dateInitPicker.clear();
    if (dateEndPicker) dateEndPicker.clear();
});

filterByCategory()

const renderFilteredExpenses = (array) => {
    const modalExpensesFilteredByCategory = document.querySelector('.div__FilteredExpenses')

    let totalPerCategory = array.reduce((total, expense) => {
        return total + parseFloat(expense.amount);
    }, 0); // El valor inicial del acumulador es 0

    modalExpensesFilteredByCategory.innerHTML = ''

    if (array.length === 0) {
        const expenseItemFiltered = document.createElement('div')
        expenseItemFiltered.classList.add('expense_filtered')
        expenseItemFiltered.innerHTML = `
            <div class="div__FilteredItem">
                <p class="item__description">No hay gastos para filtrar</p>
            </div>    `

        modalExpensesFilteredByCategory.appendChild(expenseItemFiltered);
    } else {
        array.forEach((expense) => {
            const expenseItemFiltered = document.createElement('div')
            expenseItemFiltered.classList.add('expense_filtered')
            expenseItemFiltered.innerHTML = `
            <div class="div__FilteredItem">
                <p class="item__id">ID: ${expense.id}</p>
                <p class="item__description">Descripción: ${expense.description}</p>
                <p class="item__date">Fecha: ${expense.date}</p>
                <p class="item__category">Categoría: ${expense.category}</p>
                <p class="item__amount">Monto: $${parseFloat(expense.amount).toFixed(2)}</p>
            </div>    `

            modalExpensesFilteredByCategory.appendChild(expenseItemFiltered);
        })

        const totalExpensePerCategory = document.querySelector('.total__expensePerCategory')
        totalExpensePerCategory.textContent = `Total de gastos: $${totalPerCategory.toFixed(2)}`;
    }
}

let arrayFilteredDate = []

const filterByDate = (array) => {
    const dateInit = document.querySelector('.date__init');
    const dateEnd = document.querySelector('.date__end');
    const modalExpensesFilteredByCategory = document.querySelector('.modal__expensesFilteredByCategory')
    const divBackFilteredExpenses = document.querySelector('.div__backFilteredExpenses')

    if (dateInit && dateEnd) { // Verificamos que los elementos existan
        const dateInitValue = dateInit.value;
        const dateEndValue = dateEnd.value;

        if (dateInitValue && dateEndValue) { // Verificamos que ambas fechas tengan valor
            const start = new Date(dateInitValue);
            const end = new Date(dateEndValue);

            const arrayFilteredDate = array.filter(item => {
                const date = new Date(item.date);
                return date >= start && date <= end;
            });

            modalExpensesFilteredByCategory.classList.add('showFilteredModal')
            divBackFilteredExpenses.classList.add('showBackFilteredModal')
            document.body.classList.add('modal-open'); //Desactiva el scroll detras del modal

            console.log(arrayFilteredDate);
            renderFilteredExpenses(arrayFilteredDate);
            
        } else {
            console.log("Por favor, introduce ambas fechas.");
        }
    } else {
        console.error("No se encontraron los elementos de fecha en el DOM.");
    }

    
};

let dateInitPicker, dateEndPicker;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa flatpickr en los campos de fecha
    dateInitPicker = flatpickr(".date__init", {
        dateFormat: "d-M-Y",
        altInput: true,
        altFormat: "F j, Y",
        locale: "es"
    });

    dateEndPicker = flatpickr(".date__end", {
        dateFormat: "d-M-Y",
        altInput: true,
        altFormat: "F j, Y",
        locale: "es"
    });

    const dateInit = document.querySelector('.date__init');
    const dateEnd = document.querySelector('.date__end');

    if (dateInit && dateEnd) {
        dateInit.addEventListener('change', () => filterByDate(expensesArray));
        dateEnd.addEventListener('change', () => filterByDate(expensesArray));
    } else {
        console.error("No se encontraron los elementos de fecha en el DOM.");
    }
});
