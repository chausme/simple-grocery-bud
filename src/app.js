const form = document.querySelector('.grocery-form');
const clearBtn = document.querySelector('.clear-btn');

// hide info message

const hideInfo = () => {
    const infoWrap = document.querySelector('.info-wrap');
    const info = infoWrap.querySelector('.info');
    const submitBtn = form.querySelector('button');

    infoWrap.classList.remove('active');

    setTimeout(() => {
        infoWrap.style.visibility = 'hidden';
        info.textContent = '';
        submitBtn.removeAttribute('disabled');
    }, 300);
};

// display info message and then hide automatically

const outputInfo = (message, type) => {
    const infoWrap = document.querySelector('.info-wrap');
    const info = infoWrap.querySelector('.info');

    info.textContent = message;

    if (type === 'error') {
        info.classList.add('bg-danger');
        info.classList.remove('bg-success');
    } else if (type === 'success') {
        info.classList.add('bg-success');
        info.classList.remove('bg-danger');
    }

    infoWrap.style.visibility = 'visible';
    infoWrap.classList.add('active');

    setTimeout(() => {
        hideInfo();
    }, 3000);
};

// add to local storage

const addToLocalStorage = (id, value) => {
    console.log(`Grocery item "${value}" with id "${id}" has been added to local storage`);
};

// reset to form defaults

const setDefaultState = () => {
    console.log('Set back to default');
    form.reset();
    form.dataset.action = 'add';
    const submitBtn = form.querySelector('button');
    submitBtn.textContent = 'Submit';
};

// process form submission

form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button');
    const formData = new FormData(e.target);
    const grocery = formData.get('grocery');

    submitBtn.setAttribute('disabled', 'disabled');

    const { action } = e.target.dataset;

    // generate id based on timestamp

    if (grocery && action === 'add') {
        const element = document.createElement('article');
        const uuid = new Date().getTime().toString();
        const container = document.querySelector('.grocery-container');
        const list = document.querySelector('.grocery-list');
        element.classList.add('grocery-item');
        element.dataset.id = uuid;
        element.innerHTML = `
            <p class="title">${grocery}</p>
            <div class="actions">
                <button type="button" class="btn edit p-0">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn delete p-0 ms-3">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(element);
        container.classList.add('visible');
        addToLocalStorage(uuid, grocery);
        setDefaultState();
        outputInfo('Succesfully added grocery item', 'success');
    } else if (grocery && action === 'edit') {
        outputInfo('Succesfully updated grocery item', 'success');
        setDefaultState();
    } else {
        outputInfo('Oops, the grocery value is empty', 'error');
    }
});

// clear grocery list

clearBtn.addEventListener('click', e => {
    const container = document.querySelector('.grocery-container');
    const list = document.querySelector('.grocery-list');
    const items = document.querySelectorAll('.grocery-item');
    if (items.length) {
        items.forEach(item => {
            list.removeChild(item);
        });
    }
    container.classList.remove('visible');
    setDefaultState();
});
