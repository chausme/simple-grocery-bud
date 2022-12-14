const form = document.querySelector('.grocery-form');

// const list = document.querySelector('.grocery-list');
// const clearBtn = document.querySelector('.clear-btn');

const outputInfo = (message, type) => {
    const info = document.querySelector('.info');
    info.textContent = message;
    if (type === 'error') {
        info.classList.add('bg-danger');
        info.classList.remove('bg-success');
    } else if (type === 'success') {
        info.classList.add('bg-success');
        info.classList.remove('bg-danger');
    }
    info.classList.remove('d-none');
};

const hideInfo = () => {
    const info = document.querySelector('.info');
    info.textContent = '';
    info.classList.add('d-none');
};

form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const grocery = formData.get('grocery');

    const { action } = e.target.dataset;

    // generate id based on timestamp
    const id = new Date().getTime().toString();

    if (grocery && action === 'add') {
        outputInfo('Succesfully added item', 'success');
        console.log('add item');
    } else if (grocery && action === 'edit') {
        outputInfo('Succesfully updated item', 'success');
        console.log('edit item');
    } else {
        outputInfo('Oops, the grocery value is empty', 'error');
    }
});
