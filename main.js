let books = [];
let editingBookId = null;

const bookForm = document.querySelector("#bookForm");
const bookForm_Header = document.querySelector("#bookFormHeader");
const bookForm_Submit = document.querySelector("#bookFormSubmit");
const bookForm_Cancel = document.querySelector("#bookFormCancel");
const searchForm = document.querySelector("#searchBook");
const completeShelf = document.querySelector("#completeBookList");
const incompleteShelf = document.querySelector("#incompleteBookList");

function pushSuccesNotify(msg) {
  new Notify({
    status: "success",
    title: "Success",
    text: msg,
  });
}

function changeSubmitText() {
  if (!editingBookId) {
    let checkbox = document.getElementById("bookFormIsComplete");

    bookForm_Submit.innerHTML = checkbox.checked
      ? "Masukkan Buku ke rak <span>Selesai Dibaca</span>"
      : "Masukkan Buku ke rak <span>Belum Selesai Dibaca</span>";
  }
}

function bookFormHandler(event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (editingBookId) {
    // edit book
    books = books.map((book) =>
      book.id == editingBookId ? { id: editingBookId, title, author, year, isComplete } : book
    );
  } else {
    // new book
    const newBook = {
      id: +new Date(), // setara dengan Number(new Date())
      title,
      author,
      year,
      isComplete,
    };

    books.push(newBook);
  }

  document.dispatchEvent(
    new CustomEvent("bookChanged", {
      detail: editingBookId ? "Buku Berhasil Diedit" : "Buku Berhasil Ditambahkan",
    })
  );
  editingBookId = null;
  formReset();
}

function searchFormHandler(event) {
  event.preventDefault();
  const searchInput = document.querySelector("#searchBookTitle");
  const query = searchInput.value.trim();

  const bookSearch = books.filter((book) => book.title.toLowerCase().includes(query.toLowerCase()));
  updateView(bookSearch);
}

function deleteBook(id) {
  books = books.filter((book) => book.id != id);
  document.dispatchEvent(new CustomEvent("bookChanged", { detail: "Buku Berhasil Dihapus" }));
}

function completeToggle(id) {
  books = books.map((book) => (book.id == id ? { ...book, isComplete: !book.isComplete } : book));
  document.dispatchEvent(new CustomEvent("bookChanged"));
}

function formReset() {
  bookForm_Cancel.style.display = "none";
  bookForm.reset();
  bookForm_Header.textContent = "Tambah Buku Baru";
  bookForm_Submit.innerHTML = "Masukkan Buku ke rak <span>Belum selesai dibaca</span>";
}

function editBook(id) {
  window.scrollTo({ top: 0, behavior: "smooth" });
  editingBookId = id;

  bookForm_Header.textContent = "Edit Buku";
  bookForm_Submit.textContent = "Edit Buku";
  bookForm_Cancel.style.display = "inline";
  const book = books.find((book) => book.id === id);
  document.querySelector("#bookFormTitle").value = book.title;
  document.querySelector("#bookFormAuthor").value = book.author;
  document.querySelector("#bookFormYear").value = book.year;
  document.querySelector("#bookFormIsComplete").checked = book.isComplete;
}

function sanitizeHTML(str) {
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
}

function updateView(bookData) {
  completeShelf.innerHTML = "";
  incompleteShelf.innerHTML = "";

  for (const book of bookData) {
    const id = book.id;
    const title = sanitizeHTML(book.title);
    const author = sanitizeHTML(book.author);
    const year = sanitizeHTML(book.year);

    const template = `
      <div class="book_item" data-bookid="${id}" data-testid="bookItem">
        <h3 data-testid="bookItemTitle">${title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${author}</p>
        <p data-testid="bookItemYear">Tahun: ${year}</p>
        <div>
          <button class="violet" data-testid="bookItemIsCompleteButton" onclick="completeToggle(${
            book.id
          })">
             ${book.isComplete ? "Belum Selesai Dibaca" : "Selesai Dibaca"}
          </button>
          <button class="green" data-testid="bookItemEditButton" onclick="editBook(${book.id})">
            Edit Buku
          </button>
          <button class="red" data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">
            Hapus Buku
          </button>
        </div>
      </div>`;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;

    if (book.isComplete) completeShelf.appendChild(tempDiv.firstElementChild);
    else incompleteShelf.appendChild(tempDiv.firstElementChild);
  }
}

function bookChangedHandler(event) {
  localStorage.setItem("books", JSON.stringify(books));
  updateView(books);
  if (event.detail) pushSuccesNotify(event.detail);
}

window.addEventListener("DOMContentLoaded", function () {
  books = JSON.parse(localStorage.getItem("books")) || [];
  updateView(books);

  bookForm.addEventListener("submit", bookFormHandler);
  searchForm.addEventListener("submit", searchFormHandler);
  document.addEventListener("bookChanged", bookChangedHandler);
});
