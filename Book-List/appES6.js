function Book(id, title, author, isbn) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}


//Local Storage Class
class LocalList {
    checkLocal() {
        console.log(JSON.stringify(sessionStorage.getItem('list')) === JSON.stringify(localStorage.getItem('list')));
        if (JSON.stringify(sessionStorage.getItem('list')) === JSON.stringify(localStorage.getItem('list'))) {
            document.getElementById('storeLocal').style.display = 'none';
            return true;
        } else {
            document.getElementById('storeLocal').style.display = 'block';
            return false;
        }
    }
    addItem() {
        localStorage.setItem('list', sessionStorage.getItem('list'));
        document.getElementById('storeLocal').style.display = 'none';
    }
}

// Session Storage Class
class SessionList {
    addItem(book) {
        console.log("We are in Session storage");
        let list = [];
        if (sessionStorage.getItem('list') === null) {
            list = [];
        } else {
            list = JSON.parse(sessionStorage.getItem('list'));
        }
        list.push(book);
        console.log(list);
        sessionStorage.setItem('list', JSON.stringify(list))
    }

    removeItem(id) {
        console.log('remove from session', id);
        let listData = [];
        let ui = new UI();

        if (sessionStorage.getItem('list') === null) {
            listData = []
        } else {
            listData = JSON.parse(sessionStorage.getItem('list'));
        }
        listData.forEach((item, inx) => {
            console.log(id);
            console.log(item.id);
            if (id  == item.id) {
                console.log("it's removed");
                listData.splice(inx, 1);
            }else {
                listData[inx].id = inx ;
            }
        });

        sessionStorage.setItem('list', JSON.stringify(listData));

    }
}

// Add Item To Local Storage
function UI() {

}

UI.prototype.addBookToList = function (book) {
    const list = document.getElementById('book-list');

    const row = document.createElement('tr');

    console.log(row);

    row.innerHTML = `
    <td>${book.id + 1}</td>
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>`;

    console.log(row);

    list.appendChild(row)
}

UI.prototype.showList = function () {
    const listData = JSON.parse(sessionStorage.getItem('list'));
    const list = document.getElementById('book-list');
    if (listData !== null) {
        console.log(listData);

        listData.forEach((item, inx) => {
            let row = document.createElement('tr');
            row.innerHTML = `
                            <td>${inx + 1}</td>
                            <td>${item.title}</td>
                            <td>${item.author}</td>
                            <td>${item.isbn}</td>
                            <td><a href="#" class="delete">X</a></td>`;

            list.appendChild(row)
        });
    }


}

UI.prototype.removeBookToList = function (book) {
    book.remove();
}

UI.prototype.clearFields = function () {
    document.getElementById('title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('isbn').value = "";
}

UI.prototype.showAlert = function (msg, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`

    div.appendChild(document.createTextNode(msg));
    // Get Parent

    const container = document.querySelector('.book-list-container');
    const form = document.querySelector('#book-form')
    container.insertBefore(div, form);

    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}
//Event Listenrs
let Booklist = JSON.parse(sessionStorage.getItem('list')); 
let count = Booklist == null ? 0 : Booklist[JSON.parse(sessionStorage.getItem  ('list')).length - 1].id;
console.log(count);
//Add Item

document.getElementById('book-form').addEventListener('submit', function (e) {

    //Get Form Value
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value


    const book = new Book(count, title, author, isbn);
    count++;

    // Instantiate UI
    const ui = new UI();
    const sessionList = new SessionList();
    const localList = new LocalList();

    //Validate 
    if (title == '' || author == '' || isbn == '') {
        ui.showAlert('Please fill in all fields ', 'alert alert-danger');
    } else {
        ui.addBookToList(book);
        sessionList.addItem(book);
        localList.checkLocal();

        ui.showAlert('Book Added SuccessFully ', 'alert alert-success');
        //Clear Fields
        ui.clearFields();
    }

    e.preventDefault();
});


//Delete Item
document.getElementById('book-list').addEventListener('click', function (e) {
    if (e.target.classList.contains('delete')) {
        let ui = new UI();
        let sessionList = new SessionList();
        let localList = new LocalList();
        let id = e.target.parentElement.parentElement.children[0].textContent;
        sessionList.removeItem(id - 1)
        ui.removeBookToList(e.target.parentElement.parentElement)
        console.log("check for remove local");
        localList.checkLocal();
    }
})

document.getElementById('storeLocal').addEventListener('click', function (e) {
    let localList = new LocalList();
    localList.addItem();
})

loadEventListeners();
function loadEventListeners() {
    let ui = new UI();
    let localList = new LocalList()
    ui.showList();
    if (!localList.checkLocal()) {
        sessionStorage.setItem('list', localStorage.getItem('list'));
    }
    
} 