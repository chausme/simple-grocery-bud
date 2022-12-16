class GroceryBud {
    #form = document.querySelector('.grocery-form');

    #submitBtn = this.#form.querySelector('button');

    #clearBtn = document.querySelector('.clear-btn');

    #infoWrap = document.querySelector('.info-wrap');

    #info = this.#infoWrap.querySelector('.info');

    #grocery = {};

    // init

    init = () => {
        // process form submission

        this.#form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const grocery = formData.get('grocery');

            this.#submitBtn.setAttribute('disabled', 'disabled');

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
                this.#grocery.id = uuid;
                this.#grocery.name = grocery;
                this.#addToLocalStorage();
                this.#setDefaultState();
                this.#outputInfo('Succesfully added grocery item', 'success');
            } else if (grocery && action === 'edit') {
                this.#outputInfo('Succesfully updated grocery item', 'success');
                this.#setDefaultState();
            } else {
                this.#outputInfo('Oops, the grocery value is empty', 'error');
            }
        });

        // clear grocery list

        this.#clearBtn.addEventListener('click', () => {
            const container = document.querySelector('.grocery-container');
            const list = document.querySelector('.grocery-list');
            const items = document.querySelectorAll('.grocery-item');
            if (items.length) {
                items.forEach(item => {
                    list.removeChild(item);
                });
            }
            container.classList.remove('visible');
            this.#setDefaultState();
        });
    };

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

    #addToLocalStorage = () => {
        console.log(
            `Grocery item "${this.#grocery.name}" with id "${
                this.#grocery.id
            }" has been added to local storage`
        );
        // remove grocery data from property
        this.#grocery.id = '';
        this.#grocery.name = '';
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
