const form = document.querySelector('.grocery-form');

// const info = document.querySelector('.info');
// const list = document.querySelector('.grocery-list');
// const clearBtn = document.querySelector('.clear-btn');

form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const grocery = formData.get('grocery');
    const [action] = e.target.dataset;
    // generate id based on timestamp
    const id = new Date().getTime().toString();
    if (grocery !== '' && action === 'add') {
        console.log('add item');
    } else if (grocery !== '' && action === 'edit') {
        console.log('edit item');
    } else {
        console.log('empty value');
    }
});
