class GroceryBud {
    #appContainer = document.querySelector('.app-container');

    #container = this.#appContainer.querySelector('.grocery-container');

    #list = this.#appContainer.querySelector('.grocery-list');

    #form = this.#appContainer.querySelector('.grocery-form');

    #submitBtn = this.#form.querySelector('button');

    #clearBtn = this.#appContainer.querySelector('.clear-btn');

    #infoWrap = document.querySelector('.info-wrap');

    #info = this.#infoWrap.querySelector('.info');

    #editId;

    // init

    init = () => {
        // load items

        window.addEventListener('DOMContentLoaded', this.#outputItems);

        // process form submission

        this.#form.addEventListener('submit', e => {
            e.preventDefault();

            this.#appContainer.classList.add('disabled');

            const { action } = e.target.dataset;
            const grocery = this.#getGrocery();

            if (grocery && action === 'add') {
                // generate id based on timestamp
                const uuid = new Date().getTime().toString();

                this.#appendListItem(uuid, grocery);

                this.#addToLocalStorage(uuid, grocery);
                setTimeout(() => {
                    this.#setDefaultState();
                }, 1000);

                this.#outputInfo('Succesfully added grocery item', 'success');
            } else if (grocery && action === 'edit') {
                this.#list.querySelector(
                    `.grocery-item[data-id="${this.#editId}"] .title`
                ).textContent = this.#getGrocery();
                this.#updateInLocalStorage(this.#editId);
                setTimeout(() => {
                    this.#setDefaultState();
                }, 1000);
                this.#outputInfo('Succesfully updated grocery item', 'success');
            } else {
                this.#outputInfo('Oops, the grocery value is empty', 'error');
            }
        });

        // clear grocery list

        this.#clearBtn.addEventListener('click', () => this.#clearItems());
    };

    // get grocery

    #getGrocery = () => new FormData(this.#form).get('grocery');

    // hide info message

    #hideInfo = () => {
        this.#infoWrap.classList.remove('active');

        setTimeout(() => {
            this.#infoWrap.style.visibility = 'hidden';
            this.#info.textContent = '';
            this.#submitBtn.removeAttribute('disabled');
        }, 300);
    };

    // display info message and then hide automatically

    #outputInfo = (message, type) => {
        this.#info.textContent = message;

        if (type === 'error') {
            this.#info.classList.add('bg-danger');
            this.#info.classList.remove('bg-success');
        } else if (type === 'success') {
            this.#info.classList.add('bg-success');
            this.#info.classList.remove('bg-danger');
        }

        this.#infoWrap.style.visibility = 'visible';
        this.#infoWrap.classList.add('active');

        setTimeout(() => {
            this.#hideInfo();
        }, 1000);
    };

    // add to local storage

    #addToLocalStorage = (id, name) => {
        const items = localStorage.getItem('list') ? this.constructor.#getLocalStorage() : [];
        items.push({ id, name });
        localStorage.setItem('list', JSON.stringify(items));
    };

    // remove from local storage

    #removeFromLocalStorage = id => {
        const items = this.constructor.#getLocalStorage();
        localStorage.setItem('list', JSON.stringify(items.filter(item => item.id !== id)));
    };

    // update in local storage

    #updateInLocalStorage = id => {
        const items = this.constructor.#getLocalStorage();
        localStorage.setItem(
            'list',
            JSON.stringify(
                items.map(item =>
                    item.id === id ? { ...item, name: this.#getGrocery() } : { ...item }
                )
            )
        );
    };

    // get local storage

    static #getLocalStorage = () => JSON.parse(localStorage.getItem('list'));

    // create and append a new list item

    #appendListItem = (id, name) => {
        const element = document.createElement('article');
        element.classList.add('grocery-item');
        element.dataset.id = id;
        element.innerHTML = `
            <p class="title">${name}</p>
            <div class="actions">
                <button type="button" class="btn edit p-0">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn delete p-0 ms-3">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        const editBtn = element.querySelector('.edit');
        const deleteBtn = element.querySelector('.delete');
        editBtn.addEventListener('click', this.#editItem);
        deleteBtn.addEventListener('click', this.#deleteItem);
        this.#list.appendChild(element);
        this.#container.classList.add('visible');
    };

    // output items

    #outputItems = () => {
        const items = this.constructor.#getLocalStorage();
        if (!items || !items.length) {
            return;
        }
        items.forEach(item => {
            console.log(item);
            this.#appendListItem(item.id, item.name);
        });
    };

    // edit item

    #editItem = e => {
        const itemEl = e.target.closest('.grocery-item');
        const itemId = itemEl.dataset.id;
        const title = itemEl.querySelector('.title').textContent;

        this.#editId = itemId;

        // update form input and button

        this.#submitBtn.textContent = 'Edit';
        this.#form.querySelector('input').value = title;
        this.#form.dataset.action = 'edit';
    };

    // delete item

    #deleteItem = e => {
        const itemEl = e.target.closest('.grocery-item');
        const itemId = itemEl.dataset.id;
        itemEl.remove();
        this.#removeFromLocalStorage(itemId);

        const items = this.constructor.#getLocalStorage();
        if (!items.length) {
            this.#container.classList.remove('visible');
        }

        this.#appContainer.classList.add('disabled');
        this.#outputInfo(`Item ${itemId} has been removed`, 'success');
        setTimeout(() => {
            this.#setDefaultState();
        }, 1000);
    };

    // remove items

    #clearItems = () => {
        const items = document.querySelectorAll('.grocery-item');
        if (items.length) {
            items.forEach(item => {
                this.#list.removeChild(item);
            });
        }
        this.#container.classList.remove('visible');
        this.#outputInfo('Heads up, your list is empty now', 'error');
        this.#setDefaultState();
        localStorage.removeItem('list');
    };

    // reset to form defaults

    #setDefaultState = () => {
        console.log('Set back to default');
        this.#editId = null;
        this.#form.reset();
        this.#form.dataset.action = 'add';
        this.#submitBtn.textContent = 'Submit';
        this.#appContainer.classList.remove('disabled');
    };
}

export default GroceryBud;
