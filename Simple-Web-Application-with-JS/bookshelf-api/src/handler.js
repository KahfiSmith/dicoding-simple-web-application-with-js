const { nanoid } = require("nanoid");
const bookshelf = require("./bookshelf");

// menambahkan buku
const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  bookshelf.push(newBook);

  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

// menampilkan buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = bookshelf;

  if (name) {
    const lowerCaseName = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(lowerCaseName)
    );
  }

  if (reading !== undefined) {
    const isReading = reading === "1";
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = finished === "1";
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished
    );
  }

  const getAllBooks = filteredBooks.map(book => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }));

  const response = h.response({
    status: "success",
    data: {
      books: getAllBooks,
    },
  });
  response.code(200);
  return response;
};

// menampilkan detail buku
const getBooksByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = bookshelf.filter((b) => b.id === bookId)[0];
  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

// edit buku
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

// hapus buku
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = bookshelf.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
