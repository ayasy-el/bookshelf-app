let bookdata = [];

function formhandle(event) {
  event.preventDefault();
  const title = document.querySelector("#inputBookTitle"),
    author = document.querySelector("#inputBookAuthor"),
    year = document.querySelector("#inputBookYear"),
    complete = document.querySelector("#inputBookIsComplete"),
    newBook = {
      id: +new Date(),
      title: title.value,
      author: author.value,
      year: year.value,
      isComplete: complete.checked,
    };
  console.log(newBook),
    bookdata.push(newBook),
    document.dispatchEvent(new Event("bookChanged"));
}

function searchHandler(event) {
  event.preventDefault();
  const n = document.querySelector("#searchBookTitle");
  (query = n.value),
    query
      ? updateView(
        bookdata.filter(function (e) {
          return e.title.toLowerCase().includes(query.toLowerCase());
        })
      )
      : updateView(bookdata);
}
function o(t) {
  const n = Number(t.target.id),
    o = bookdata.findIndex(function (e) {
      return e.id === n;
    });
  -1 !== o &&
    ((bookdata[o] = {
      ...bookdata[o],
      isComplete: !0,
    }),
      document.dispatchEvent(new Event("bookChanged")));
}

function d(t) {
  const n = Number(t.target.id),
    o = bookdata.findIndex(function (e) {
      return e.id === n;
    });
  -1 !== o &&
    ((bookdata[o] = {
      ...bookdata[o],
      isComplete: !1,
    }),
      document.dispatchEvent(new Event("bookChanged")));
}
function hapusbuku(t) {
  const id = Number(t.target.id),
    o = bookdata.findIndex(function (e) {
      return e.id === id;
    });
  -1 !== o &&
    (bookdata.splice(o, 1), document.dispatchEvent(new Event("bookChanged")));
}

function updateView(bookdata) {
  const incompleteShelf = document.querySelector("#incompleteBookshelfList");
  const completeShelf = document.querySelector("#completeBookshelfList");

  (incompleteShelf.innerHTML = ""), (completeShelf.innerHTML = "");
  for (const c of bookdata) {
    const article = document.createElement("article");
    article.classList.add("book_item");
    const h2 = document.createElement("h2");
    h2.innerText = c.title;
    const paragraph = document.createElement("p");
    paragraph.innerText = "Penulis: " + c.author;
    const r = document.createElement("p");
    if (
      ((r.innerText = "Tahun: " + c.year),
        article.appendChild(h2),
        article.appendChild(paragraph),
        article.appendChild(r),
        c.isComplete)
    ) {
      const t = document.createElement("div");
      t.classList.add("action");
      const o = document.createElement("button");
      (o.id = c.id),
        (o.innerText = "Belum Selesai dibaca"),
        o.classList.add("green"),
        o.addEventListener("click", d);
      const a = document.createElement("button");
      (a.id = c.id),
        (a.innerText = "Hapus buku"),
        a.classList.add("red"),
        a.addEventListener("click", hapusbuku),
        t.appendChild(o),
        t.appendChild(a),
        article.appendChild(t),
        completeShelf.appendChild(article);
    } else {
      const n = document.createElement("div");
      n.classList.add("action");
      const d = document.createElement("button");
      (d.id = c.id),
        (d.innerText = "Selesai dibaca"),
        d.classList.add("green"),
        d.addEventListener("click", o);
      const a = document.createElement("button");
      (a.id = c.id),
        (a.innerText = "Hapus buku"),
        a.classList.add("red"),
        a.addEventListener("click", hapusbuku),
        n.appendChild(d),
        n.appendChild(a),
        article.appendChild(n),
        incompleteShelf.appendChild(article);
    }
  }
}

function bookChangedHandler() {
  localStorage.setItem("books", JSON.stringify(bookdata));
  updateView(bookdata);
}

// window.addEventListener("load", function () {
//   (bookdata = JSON.parse(localStorage.getItem("books")) || []),
//     changeView(bookdata);
//   const inputbook_el = document.querySelector("#inputBook");
//   const searchbook_el = document.querySelector("#searchBook");
//   inputbook_el.addEventListener("submit", formhandle),
//     searchbook_el.addEventListener("submit", n),
//     document.addEventListener("bookChanged", bookChangedHandle);
// });

window.addEventListener("load", function () {
  const bookdata = JSON.parse(localStorage.getItem("books")) || [];
  updateView(bookdata);

  const inputbook_el = document.querySelector("#inputBook");
  const searchbook_el = document.querySelector("#searchBook");

  inputbook_el.addEventListener("submit", formhandle);
  searchbook_el.addEventListener("submit", searchHandler);
  document.addEventListener("bookChanged", bookChangedHandler);
});
