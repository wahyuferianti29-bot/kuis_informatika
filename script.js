// ===============================
// PENGATURAN
// ===============================

const scriptURL =
  "https://script.google.com/macros/s/AKfycbxOK80-h8wWgeUF15hFO_H6rMgHltyYuQENFydWp5bNbr1TToMnTmhEvkwNWTugxzQqrQ/exec";

const pageSize = 10;
const totalPages = 3;
const pageSeconds = 300; // 5 menit per halaman


// ===============================
// DATA SOAL
// ===============================

const questions = [
  {
    question: "Stack menggunakan prinsip LIFO (Last In, First Out).",
    answer: true
  },
  {
    question: "Queue menggunakan prinsip LIFO.",
    answer: false
  },
  {
    question: "Pada Stack, elemen yang terakhir masuk akan menjadi elemen pertama yang keluar.",
    answer: true
  },
  {
    question: "Pada Queue, elemen yang pertama masuk akan menjadi elemen pertama yang keluar.",
    answer: true
  },
  {
    question: "Operasi untuk menambahkan data ke Stack disebut push.",
    answer: true
  },
  {
    question: "Operasi untuk menghapus data dari Stack disebut enqueue.",
    answer: false
  },
  {
    question: "Operasi enqueue digunakan untuk menambahkan data ke Queue.",
    answer: true
  },
  {
    question: "Operasi dequeue digunakan untuk menghapus data dari Queue.",
    answer: true
  },
  {
    question: "Sorting adalah proses mengurutkan data berdasarkan aturan tertentu.",
    answer: true
  },
  {
    question: "Bubble Sort merupakan salah satu algoritma sorting.",
    answer: true
  },

  {
    question: "Stack dan Queue memiliki prinsip kerja yang sama.",
    answer: false
  },
  {
    question: "Dalam Queue, data baru biasanya ditambahkan dari bagian belakang.",
    answer: true
  },
  {
    question: "Dalam Queue, data biasanya diambil dari bagian depan.",
    answer: true
  },
  {
    question: "Push digunakan untuk mengambil data dari Stack.",
    answer: false
  },
  {
    question: "Pop digunakan untuk mengambil atau menghapus elemen teratas pada Stack.",
    answer: true
  },
  {
    question: "Queue dapat dianalogikan seperti antrean orang.",
    answer: true
  },
  {
    question: "Sorting hanya dapat dilakukan pada data berupa angka.",
    answer: false
  },
  {
    question: "Data dapat diurutkan dari nilai terkecil ke terbesar.",
    answer: true
  },
  {
    question: "Data dapat diurutkan dari nilai terbesar ke terkecil.",
    answer: true
  },
  {
    question: "Selection Sort termasuk algoritma sorting.",
    answer: true
  },

  {
    question: "Insertion Sort merupakan salah satu metode sorting.",
    answer: true
  },
  {
    question: "Sorting dapat membantu membuat data lebih mudah dicari dan dianalisis.",
    answer: true
  },
  {
    question: "Stack hanya dapat menyimpan satu data.",
    answer: false
  },
  {
    question: "Queue tidak dapat memiliki lebih dari satu elemen.",
    answer: false
  },
  {
    question: "Jika sebuah data dimasukkan terakhir ke Stack, data tersebut akan berada di bagian atas.",
    answer: true
  },
  {
    question: "Jika data A masuk Queue sebelum data B, maka A akan dilayani lebih dahulu.",
    answer: true
  },
  {
    question: "Bubble Sort bekerja dengan membandingkan elemen-elemen yang berdekatan.",
    answer: true
  },
  {
    question: "Sorting tidak memiliki manfaat dalam pengolahan data.",
    answer: false
  },
  {
    question: "Algoritma sorting dapat digunakan untuk mengurutkan nama berdasarkan abjad.",
    answer: true
  },
  {
    question: "Stack, Queue, dan Sorting merupakan konsep yang dapat digunakan dalam pemrograman.",
    answer: true
  }
];


// ===============================
// VARIABEL
// ===============================

let studentName = "";
let studentClass = "";

let currentPage = 0;
let answers = new Array(questions.length).fill(null);

let timerInterval = null;
let remainingSeconds = pageSeconds;

let quizFinished = false;


// ===============================
// FUNGSI TAMPILAN
// ===============================

function showView(viewId) {
  document.querySelectorAll(".view").forEach(view => {
    view.classList.remove("active");
  });

  document.getElementById(viewId).classList.add("active");
}


// ===============================
// MULAI KUIS
// ===============================

function startQuiz() {
  studentName = document.getElementById("studentName").value.trim();
  studentClass = document.getElementById("studentClass").value.trim();

  if (!studentName) {
    alert("Silakan masukkan nama siswa.");
    return;
  }

  if (!studentClass) {
    alert("Silakan masukkan kelas.");
    return;
  }

  currentPage = 0;
  answers = new Array(questions.length).fill(null);
  quizFinished = false;

  showView("quizView");

  renderPage();
  startTimer();
}


// ===============================
// TAMPILKAN SOAL
// ===============================

function renderPage() {
  const container = document.getElementById("questionsContainer");

  container.innerHTML = "";

  const startIndex = currentPage * pageSize;
  const endIndex = Math.min(
    startIndex + pageSize,
    questions.length
  );

  document.getElementById("pageNumber").textContent =
    `Halaman ${currentPage + 1} dari ${totalPages}`;

  for (let i = startIndex; i < endIndex; i++) {
    const q = questions[i];

    const questionCard = document.createElement("div");
    questionCard.className = "question-card";

    questionCard.innerHTML = `
      <div class="question-number">
        Soal ${i + 1}
      </div>

      <div class="question-text">
        ${q.question}
      </div>

      <div class="answer-options">
        <button
          type="button"
          class="answer-option ${answers[i] === true ? "selected" : ""}"
          onclick="selectAnswer(${i}, true)"
        >
          Benar
        </button>

        <button
          type="button"
          class="answer-option ${answers[i] === false ? "selected" : ""}"
          onclick="selectAnswer(${i}, false)"
        >
          Salah
        </button>
      </div>
    `;

    container.appendChild(questionCard);
  }

  updateProgress();

  const previousButton =
    document.getElementById("previousPageBtn");

  const nextButton =
    document.getElementById("nextPageBtn");

  previousButton.style.display =
    currentPage === 0 ? "none" : "inline-block";

  if (currentPage === totalPages - 1) {
    nextButton.textContent = "Selesai & Lihat Nilai";
  } else {
    nextButton.textContent = "Berikutnya →";
  }
}


// ===============================
// PILIH JAWABAN
// ===============================

function selectAnswer(index, value) {
  answers[index] = value;

  renderPage();
}


// ===============================
// PROGRESS
// ===============================

function updateProgress() {
  const answered = answers.filter(
    answer => answer !== null
  ).length;

  document.getElementById("progressText").textContent =
    `${answered} / ${questions.length} soal dijawab`;
}


// ===============================
// TIMER
// ===============================

function startTimer() {
  clearInterval(timerInterval);

  remainingSeconds = pageSeconds;

  updateTimerDisplay();

  timerInterval = setInterval(() => {
    remainingSeconds--;

    updateTimerDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);

      alert(
        `Waktu halaman ${currentPage + 1} telah habis.`
      );

      goNextPage();
    }
  }, 1000);
}


function updateTimerDisplay() {
  const minutes =
    Math.floor(remainingSeconds / 60);

  const seconds =
    remainingSeconds % 60;

  document.getElementById("timer").textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


// ===============================
// HALAMAN SEBELUMNYA
// ===============================

function goPreviousPage() {
  if (currentPage > 0) {
    currentPage--;

    renderPage();
    startTimer();
  }
}


// ===============================
// HALAMAN BERIKUTNYA
// ===============================

function goNextPage() {
  const startIndex = currentPage * pageSize;
  const endIndex = Math.min(
    startIndex + pageSize,
    questions.length
  );

  const unanswered = [];

  for (let i = startIndex; i < endIndex; i++) {
    if (answers[i] === null) {
      unanswered.push(i + 1);
    }
  }

  if (unanswered.length > 0) {
    const lanjut = confirm(
      `Soal nomor ${unanswered.join(", ")} belum dijawab.\n\nTetap lanjut?`
    );

    if (!lanjut) {
      return;
    }
  }

  if (currentPage < totalPages - 1) {
    currentPage++;

    renderPage();
    startTimer();
  } else {
    finishQuiz();
  }
}


// ===============================
// SELESAI KUIS
// ===============================

function finishQuiz() {
  if (quizFinished) return;

  quizFinished = true;

  clearInterval(timerInterval);

  let correctCount = 0;

  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].answer) {
      correctCount++;
    }
  }

  const score = Math.round(
    (correctCount / questions.length) * 100
  );

  document.getElementById("resultName").textContent =
    studentName;

  document.getElementById("resultScore").textContent =
    score;

  document.getElementById("resultCorrect").textContent =
    correctCount;

  document.getElementById("resultTotal").textContent =
    questions.length;

  showView("resultView");

  saveResult(
    score,
    correctCount
  );
}


// ===============================
// SIMPAN KE GOOGLE SHEETS
// ===============================

function saveResult(score, correctCount) {
  const data = {
    student_name: studentName,
    student_class: studentClass,
    score: score,
    correct_count: correctCount,
    total_questions: questions.length,
    submitted_at: new Date().toLocaleString("id-ID")
  };

  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(data)
  })
  .then(() => {
    console.log("Data berhasil dikirim.");
  })
  .catch(error => {
    console.error(
      "Gagal mengirim data:",
      error
    );
  });
}


// ===============================
// ULANGI KUIS
// ===============================

function restartQuiz() {
  clearInterval(timerInterval);

  answers = new Array(questions.length).fill(null);
  currentPage = 0;
  quizFinished = false;

  showView("startView");
}


// ===============================
// CETAK / PDF
// ===============================

function printResult() {
  window.print();
}


// ===============================
// REKAP NILAI
// ===============================

async function showRecap() {
  showView("recapView");

  const container =
    document.getElementById("recapContainer");

  container.innerHTML =
    "<p>Memuat data...</p>";

  try {
    const response =
      await fetch(scriptURL);

    const data =
      await response.json();

    if (!data || data.length === 0) {
      container.innerHTML =
        "<p>Belum ada data nilai.</p>";
      return;
    }

    let html = `
      <table class="recap-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Nilai</th>
            <th>Benar</th>
            <th>Total</th>
            <th>Waktu</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach((item, index) => {
      html += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.student_name}</td>
          <td>${item.student_class}</td>
          <td>${item.score}</td>
          <td>${item.correct_count}</td>
          <td>${item.total_questions}</td>
          <td>${item.submitted_at}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    container.innerHTML = html;

  } catch (error) {
    console.error(error);

    container.innerHTML =
      "<p>Rekap belum dapat dimuat.</p>";
  }
}


// ===============================
// DOWNLOAD CSV
// ===============================

async function downloadCSV() {
  try {
    const response =
      await fetch(scriptURL);

    const data =
      await response.json();

    if (!data || data.length === 0) {
      alert("Belum ada data untuk diunduh.");
      return;
    }

    let csv =
      "Nama Siswa,Kelas,Nilai,Jawaban Benar,Total Soal,Waktu Pengumpulan\n";

    data.forEach(item => {
      csv += [
        item.student_name,
        item.student_class,
        item.score,
        item.correct_count,
        item.total_questions,
        item.submitted_at
      ]
      .map(value =>
        `"${String(value).replace(/"/g, '""')}"`
      )
      .join(",");

      csv += "\n";
    });

    const blob =
      new Blob([csv], {
        type: "text/csv;charset=utf-8;"
      });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = "rekap-nilai-kuis.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  } catch (error) {
    console.error(error);

    alert(
      "Rekap belum dapat diunduh."
    );
  }
}


// ===============================
// EVENT LISTENER
// ===============================

document
  .getElementById("startQuizBtn")
  .addEventListener(
    "click",
    startQuiz
  );

document
  .getElementById("previousPageBtn")
  .addEventListener(
    "click",
    goPreviousPage
  );

document
  .getElementById("nextPageBtn")
  .addEventListener(
    "click",
    goNextPage
  );

document
  .getElementById("printBtn")
  .addEventListener(
    "click",
    printResult
  );

document
  .getElementById("restartBtn")
  .addEventListener(
    "click",
    restartQuiz
  );

document
  .getElementById("recapBtn")
  .addEventListener(
    "click",
    showRecap
  );

document
  .getElementById("downloadCsvBtn")
  .addEventListener(
    "click",
    downloadCSV
  );

document
  .getElementById("backToStartBtn")
  .addEventListener(
    "click",
    () => showView("startView")
  );
