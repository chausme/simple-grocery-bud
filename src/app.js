const form = document.querySelector('.grocery-form');

// const list = document.querySelector('.grocery-list');
// const clearBtn = document.querySelector('.clear-btn');

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

form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button');
    const formData = new FormData(e.target);
    const grocery = formData.get('grocery');

    submitBtn.setAttribute('disabled', 'disabled');

    const { action } = e.target.dataset;

    // generate id based on timestamp
    const id = new Date().getTime().toString();

    if (grocery && action === 'add') {
        outputInfo('Succesfully added grocery item', 'success');
        console.log('add item');
    } else if (grocery && action === 'edit') {
        outputInfo('Succesfully updated grocery item', 'success');
        console.log('edit item');
    } else {
        outputInfo('Oops, the grocery value is empty', 'error');
    }
});
