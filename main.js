let books = [];
let editingBookId = null;

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
    let submit = document.getElementById("bookFormSubmit");

    if (checkbox.checked) {
      submit.innerHTML = "Masukkan Buku ke <span>rak selesai dibaca</span>";
    } else {
      submit.innerHTML = "Masukkan Buku ke <span>rak Belum selesai dibaca</span>";
    }
  }
}

function formBookHandler(event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (editingBookId) {
    // edit book
    const bookIndex = books.findIndex((book) => book.id === editingBookId);
    books[bookIndex] = { id: editingBookId, title, author, year, isComplete };
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

function searchBookHandler(event) {
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
  document.getElementById("cancel-button").style.display = "none";
  document.getElementById("bookForm").reset();
  const formHeader = document.querySelector("#bookFormHeader");
  const submit = document.querySelector("#bookFormSubmit");

  formHeader.textContent = "Tambah Buku Baru";
  submit.innerHTML = "Masukkan Buku ke rak <span>Belum selesai dibaca</span>";
}

function editBook(id) {
  window.scrollTo({ top: 0, behavior: "smooth" });
  editingBookId = id;

  const formHeader = document.querySelector("#bookFormHeader");
  const title = document.querySelector("#bookFormTitle");
  const author = document.querySelector("#bookFormAuthor");
  const year = document.querySelector("#bookFormYear");
  const isComplete = document.querySelector("#bookFormIsComplete");
  const submit = document.querySelector("#bookFormSubmit");
  document.getElementById("cancel-button").style.display = "inline";

  formHeader.textContent = "Edit Buku";
  const index = books.findIndex((book) => book.id === id);
  title.value = books[index].title;
  author.value = books[index].author;
  year.value = books[index].year;
  isComplete.checked = books[index].isComplete;
  submit.textContent = "Edit Buku";
}

function updateView(bookData) {
  const incompleteShelf = document.querySelector("#incompleteBookList");
  const completeShelf = document.querySelector("#completeBookList");

  completeShelf.innerHTML = "";
  incompleteShelf.innerHTML = "";

  for (const book of bookData) {
    let template = `
      <div data-bookid="{{ ID_buku }}" data-testid="bookItem">
        <h3 data-testid="bookItemTitle">{{ judul_buku }}</h3>
        <p data-testid="bookItemAuthor">Penulis: {{ penulis_buku }}</p>
        <p data-testid="bookItemYear">Tahun: {{ tahun_rilis_buku }}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton" onclick="completeToggle(${book.id})">
             ${book.isComplete ? "Belum Selesai Dibaca" : "Selesai Dibaca"}
          </button>
          <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">
            Hapus Buku
          </button>
          <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">
            Edit Buku
          </button>
        </div>
      </div>`;

    const parser = new DOMParser();
    const { body } = parser.parseFromString(template, "text/html");

    const bookId = body.querySelector('[data-testid="bookItem"]');
    bookId.setAttribute("data-bookid", book.id);
    const bookTitle = body.querySelector('[data-testid="bookItemTitle"]');
    bookTitle.textContent = book.title;
    const bookAuthor = body.querySelector('[data-testid="bookItemAuthor"]');
    bookAuthor.textContent = `Penulis: ${book.author}`;
    const bookYear = body.querySelector('[data-testid="bookItemYear"]');
    bookYear.textContent = `Tahun: ${book.year}`;

    if (book.isComplete) completeShelf.appendChild(body.firstChild);
    else incompleteShelf.appendChild(body.firstChild);
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

  const bookForm = document.querySelector("#bookForm");
  const searchForm = document.querySelector("#searchBook");
  bookForm.addEventListener("submit", formBookHandler);
  searchForm.addEventListener("submit", searchBookHandler);
  document.addEventListener("bookChanged", bookChangedHandler);
});
