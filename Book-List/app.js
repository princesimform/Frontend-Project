let gobalIndex = 1;
let bookImgObj = {};
// Show Toast
function showToast(data, classes) {
	document.getElementById('toastBody').innerText = data;
	document.getElementById('toastBox').classList.add(classes);
	if (document.getElementById('toastBox').classList.contains('bg-primary') && classes == "bg-danger") {
		document.getElementById('toastBox').classList.remove('bg-primary');
	} else if (document.getElementById('toastBox').classList.contains('bg-danger') && classes == "bg-primary") {
		document.getElementById('toastBox').classList.remove('bg-danger');
	}
	console.log(document.getElementById('toastBox').classList);
	var toastElList = [].slice.call(document.querySelectorAll('.toast-add'))
	var toastList = toastElList.map(function (toastEl) {
		return new bootstrap.Toast(toastEl)
	})
	toastList.forEach(toast => toast.show())
}
//Book Object
function Book(id, title, author, isbn, frontPage) {
	this.id = id
	this.title = title;
	this.author = author;
	this.isbn = isbn;
	this.frontPage = frontPage;
}

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
		const ui = new UI();
		if (sessionStorage.getItem('list') === null || sessionStorage.getItem('list') == "null") {
			console.log("You Are At Null");
			listData = [];
		} else {
			listData = JSON.parse(sessionStorage.getItem('list'));
		}
		// Store Data
		listData.push(reqData);
		try {
			sessionStorage.setItem('list', JSON.stringify(listData));
			sessionStorage.setItem(reqData.id, reqData.frontPage);
			showToast("Data Added Successfully ", "bg-primary");

		} catch (error) {
			showToast('Something Went Wrong', 'bg-danger')
			this.removeItem(reqData.id);
		}
		// Show to UI
		ui.showList();
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
		sessionStorage.removeItem(id);
		ui.showList();
	}

	updateItem(reqData) {
		let listData = JSON.parse(sessionStorage.getItem('list'));
		listData.forEach((item, inx) => {
			if (reqData.id == item.id) {
				listData[inx] = reqData;
			}
		});
		sessionStorage.setItem('list', JSON.stringify(listData));
		sessionStorage.setItem(reqData.id, reqData.frontPage)
		gobalIndex = 1;
		const ui = new UI();
		ui.showList();
	}
	getItem(id) {
		let data = []
		let listData = JSON.parse(sessionStorage.getItem('list'));
		listData.forEach((item, inx) => {
			if (id == item.id) {
				data = listData.splice(inx, 1);
			}
		});
		data[0].frontPage = sessionStorage.getItem(id);
		return data[0];
	}
}

// UI Changes Object
function UI() { }

UI.prototype.addBookToList = function (book) {
	const row = document.createElement('tr');
	row.innerHTML = `
    <td id=${book.id}>${gobalIndex}</td>
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><button type="button" id="visitImg" class="btn btn-secondary" onclick="viewImg(${book.id})"">Visit Image</button></td>
    <td><button type="button"  class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="updateBookList(${book.id})">Edit</button> <button type="button"   class="btn btn-danger delete">Delete</button></td>`;

	gobalIndex++;
	return row;
}
// Trigger Update
function updateBookList(bookID) {
	const sessionList = new SessionList();
	let res = sessionList.getItem(bookID);
	document.getElementById('update-title').value = res.title;
	document.getElementById('update-author').value = res.author;
	document.getElementById('update-isbn').value = res.isbn;
	document.getElementById('update-id').value = res.id;
}
// Show All Data Which are in Storage
UI.prototype.showList = function () {
	gobalIndex = 1;
	const listData = JSON.parse(sessionStorage.getItem('list'));
	const list = document.getElementById('book-list');
	list.innerHTML = '';
	if (listData !== null) {
		listData.forEach((item, inx) => {
			let row = this.addBookToList(item);
			list.appendChild(row)
		});
	}
}
// Clear Form Data
UI.prototype.clearFields = function () {
	document.getElementById('title').value = "";
	document.getElementById('author').value = "";
	document.getElementById('isbn').value = "";
	document.getElementById('bookImg').value = "";
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
		isbn = document.getElementById('isbn').value,
		frontPage = bookImgObj;

	let id = new Date().getUTCMilliseconds();
	const book = new Book(id, title, author, isbn, frontPage);

	// Objects
	const ui = new UI();
	const sessionList = new SessionList();
	const localList = new LocalList();
	// Validate Field 
	if (title == '' || author == '' || isbn == '' || JSON.stringify(frontPage) == "{}") {
		showToast('Please fill in all fields ', 'bg-danger')
	} else {
		sessionList.addItem(book);
		ui.clearFields();
		localList.checkLocal();
	}

	e.preventDefault();
})


// Update Form
document.getElementById('update-form').addEventListener('submit', function (e) {
	const title = document.getElementById('update-title').value,
		author = document.getElementById('update-author').value,
		isbn = document.getElementById('update-isbn').value,
		id = document.getElementById('update-id').value;
	let frontPage = {};

	let sessionList = new SessionList();
	let localList = new LocalList();
	if (JSON.stringify(bookImgObj) == "{}") {
		frontPage = sessionStorage.getItem(id)
	} else {
		frontPage = bookImgObj;
	}
	let oldData = sessionList.getItem(id);
	if (oldData.author == author && oldData.isbn == isbn && oldData.title == title) {
		showToast('Please Update Data', 'bg-danger');
	} else {
		let reqData = { id: parseInt(id), title: title, author: author, isbn: isbn, frontPage: frontPage }
		try {
			sessionList.updateItem(reqData);
			showToast('Data Updated', 'bg-primary')
			localList.checkLocal();
			$('#exampleModal').modal('toggle');

		} catch (error) {
			showToast('Something Went Wrong', 'bg-danger')
		}
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
		showToast('Data Remove', 'bg-danger')
	}
})

//Handling Local Storage
document.getElementById('storeLocal').addEventListener('click', function () {
	let localList = new LocalList();
	localList.addItem();
	showToast('Data Stored Successfully', 'bg-primary')
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

// Img Handling
let imgInput = document.getElementById('bookImg');
let imgUpdate = document.getElementById('updateBookImg');
var imgModal = document.getElementById('imgModal');
var visitImg = document.getElementById('visitImg');
var imgContainer = document.getElementById('imgContainer');
var caption = document.getElementById('caption');
var span = document.getElementsByClassName('close-img')[0];

imgUpdate.addEventListener('change', function (e) {
	let imgFile = e.target.files[0];

	if (imgFile.type == 'image/png' || imgFile.type == 'image/jpeg' || imgFile.type == 'image/jpg' || imgFile.type == 'image/gif') {
		const reader = new FileReader();
		reader.addEventListener("load", function (e) {
			bookImgObj = reader.result;
		})
		reader.readAsDataURL(imgFile)
	} else {
		showToast('Please Add Valid Image', 'bg-danger');
		imgInput.value = "";
	}
})
imgInput.addEventListener('change', function (e) {
	let imgFile = e.target.files[0];

	if (imgFile.type == 'image/png' || imgFile.type == 'image/jpeg' || imgFile.type == 'image/jpg' || imgFile.type == 'image/gif') {
		const reader = new FileReader();
		reader.addEventListener("load", function (e) {
			bookImgObj = reader.result;
		})
		reader.readAsDataURL(imgFile)
	} else {
		showToast('Please Add Valid Image', 'bg-danger');
		imgInput.value = "";
	}
})

span.onclick = function () {
	imgModal.style.display = "none"
}

function viewImg(imgid) {
	console.log(title);
	let imgData = sessionStorage.getItem(imgid);
	imgModal.style.display = "block";
	imgContainer.src = imgData
}