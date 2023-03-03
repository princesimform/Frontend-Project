//Book Object
function Book(id, title, author, isbn) {
	this.id = id
	this.title = title;
	this.author = author;
	this.isbn = isbn;
}
let gobalIndex = 1 ;
//local Storage Object
class LocalList {
	checkLocal() {
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

//Session Storage Object
class SessionList {
	addItem(reqData) {
		let listData = [];
		let id;
		const ui = new UI();
		if (sessionStorage.getItem('list') === null) {
			listData = [];
			id = 0;
		} else {
			listData = JSON.parse(sessionStorage.getItem('list'));
			id = listData.length;
		}


		// Store Data
		listData.push(reqData);
		sessionStorage.setItem('list', JSON.stringify(listData));

		// Show to UI
		ui.addBookToList(reqData);

	}

	removeItem(id) {
		let listData = [];
		let ui = new UI();

		if (sessionStorage.getItem('list') === null) {
			listData = []
		} else {
			listData = JSON.parse(sessionStorage.getItem('list'));
		}
		listData.forEach((item, inx) => {
			if (id == item.id) {
				listData.splice(inx, 1);
			}
		});

		sessionStorage.setItem('list', JSON.stringify(listData));
	}
}

// UI Changes Object
function UI() { }

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

UI.prototype.addBookToList = function (book) {
	const list = document.getElementById('book-list');

	const row = document.createElement('tr');

	row.innerHTML = `
    <td id=${book.id}>${gobalIndex}</td>
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>`;

	list.appendChild(row)
	gobalIndex++;

}

// Show All Data Which are in Storage
UI.prototype.showList = function () {
	const listData = JSON.parse(sessionStorage.getItem('list'));
	const list = document.getElementById('book-list');
	if (listData !== null) {
		listData.forEach((item, inx) => {
			this.addBookToList(item);
		});
	}
}

// Clear Form Data
UI.prototype.clearFields = function () {
	document.getElementById('title').value = "";
	document.getElementById('author').value = "";
	document.getElementById('isbn').value = "";
}
//Remove From UI 
UI.prototype.removeBookToList = function (book) {
	book.remove();
}

// Form Handling , Add Data
document.getElementById('book-form').addEventListener('submit', function (e) {

	//Get Form Value
	const title = document.getElementById('title').value,
		author = document.getElementById('author').value,
		isbn = document.getElementById('isbn').value

	let id = new Date().getUTCMilliseconds();
	const book = new Book(id, title, author, isbn);

	// Objects
	const ui = new UI();
	const sessionList = new SessionList();
	const localList = new LocalList();

	// Validate Field 
	if (title == '' || author == '' || isbn == '') {
		ui.showAlert('Please fill in all fields ', 'alert alert-danger');
	} else {
		sessionList.addItem(book);
		ui.clearFields();
		localList.checkLocal();
	}

	e.preventDefault();
})

//Handling List of Data (Remove Data)
document.getElementById('book-list').addEventListener('click', function (e) {
	if (e.target.classList.contains('delete')) {
		let ui = new UI();
		let sessionList = new SessionList();
		let localList = new LocalList();
		let id = e.target.parentElement.parentElement.children[0].id;
		sessionList.removeItem(id)
		ui.removeBookToList(e.target.parentElement.parentElement)
		localList.checkLocal();
	}
})

//Handling Local Storage
document.getElementById('storeLocal').addEventListener('click', function () {
	let localList = new LocalList();
	localList.addItem();
})

//Run Onload
loadEventListeners();
function loadEventListeners() {
	const ui = new UI();
	let localList = new LocalList()
	// localStorage.clear();
	// sessionStorage.clear();
	if (!localList.checkLocal()) {
		sessionStorage.setItem('list', localStorage.getItem('list'));
	}
	ui.showList();
}
