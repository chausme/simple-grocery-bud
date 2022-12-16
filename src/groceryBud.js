class GroceryBud {
    #form = document.querySelector('.grocery-form');

    #submitBtn = this.#form.querySelector('button');

    #clearBtn = document.querySelector('.clear-btn');

    #infoWrap = document.querySelector('.info-wrap');

    #info = this.#infoWrap.querySelector('.info');

    #editId;

    // init

    init = () => {
        // process form submission

        this.#form.addEventListener('submit', e => {
            e.preventDefault();

            this.#submitBtn.setAttribute('disabled', 'disabled');

            const { action } = e.target.dataset;
            const grocery = this.#getGrocery();

            const list = document.querySelector('.grocery-list');

            if (grocery && action === 'add') {
                const element = document.createElement('article');
                // generate id based on timestamp
                const uuid = new Date().getTime().toString();
                const container = document.querySelector('.grocery-container');
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
                const editBtn = element.querySelector('.edit');
                const deleteBtn = element.querySelector('.delete');
                editBtn.addEventListener('click', this.#editItem);
                deleteBtn.addEventListener('click', this.#deleteItem);
                list.appendChild(element);
                container.classList.add('visible');
                this.constructor.#addToLocalStorage(uuid, grocery);
                this.#setDefaultState();
                this.#outputInfo('Succesfully added grocery item', 'success');
            } else if (grocery && action === 'edit') {
                list.querySelector(`.grocery-item[data-id="${this.#editId}"] .title`).textContent =
                    this.#getGrocery();
                // update the item inside local storage
                this.#setDefaultState();
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

    static #addToLocalStorage = (id, name) => {
        console.log(`Grocery item "${name}" with id "${id}" has been added to local storage`);
    };

    // remove from local storage

    static #removeFromLocalStorage = id => {
        console.log(`Grocery item with id "${id}" has been removed from local storage`);
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

        // check for list length and hide the list if there are no items
        this.constructor.#removeFromLocalStorage(itemId);
        this.#outputInfo(`Item ${itemId} has been removed`, 'success');
        this.#setDefaultState();
    };

    // remove items

    #clearItems = () => {
        const container = document.querySelector('.grocery-container');
        const list = document.querySelector('.grocery-list');
        const items = document.querySelectorAll('.grocery-item');
        if (items.length) {
            items.forEach(item => {
                list.removeChild(item);
            });
        }
        container.classList.remove('visible');
        this.#outputInfo('Heads up, your list is empty now', 'error');
        this.#setDefaultState();

        // localStorage.removeItem('list');
    };

    // reset to form defaults

    #setDefaultState = () => {
        console.log('Set back to default');
        this.#form.reset();
        this.#form.dataset.action = 'add';
        this.#submitBtn.textContent = 'Submit';
    };
}

export default GroceryBud;
