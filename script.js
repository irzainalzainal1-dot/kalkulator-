(() => {
  const display = document.getElementById("display");
  const history = document.getElementById("history");
  const btnClear = document.getElementById("clear");
  const btnBackspace = document.getElementById("backspace");
  const btnPercent = document.getElementById("percent");
  const btnEquals = document.getElementById("equals");
  const buttons = document.querySelector(".buttons");
  let currentInput = "0"; // angka yang sedang diketik (string)
  let expression = "";    // ekspresi lengkap (string)
  let lastResult = null;  // hasil terakhir (number)
  let justCalculated = false; // flag apakah baru saja tekan '='

  // fungsi untuk kasih titik ribuan
function formatNumber(num) {
  if (num === "" || isNaN(num)) return num;
  return Number(num).toLocaleString("id-ID");
}

  // Update tampilan layar
  function updateDisplay() {
  // tampilkan currentInput dengan titik ribuan
  if (isNaN(currentInput)) {
    display.textContent = currentInput;
  } else {
    display.textContent = formatNumber(currentInput);
  }

  // tampilkan history dengan titik ribuan juga
  let formattedExpr = expression.replace(/\d+(\.\d+)?/g, (match) => {
    return formatNumber(match);
  });
  history.textContent = formattedExpr;
}
 // Reset kalkulator
  function clearAll() {
    currentInput = "0";
    expression = "";
    lastResult = null;
    justCalculated = false;
    updateDisplay();
  }

  // Hapus satu digit
  function backspace() {
    if (justCalculated) {
      clearAll();
      return;
    }
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
      if (currentInput === "-" || currentInput === "" || currentInput === "-0") {
        currentInput = "0";
      }
    } else {
      currentInput = "0";
    }
    updateDisplay();
  }

  // Tambah angka atau titik
  function appendNumber(num) {
    if (justCalculated) {
      currentInput = num === "." ? "0." : num;
      expression = "";
      justCalculated = false;
      updateDisplay();
      return;
    }
    if (num === ".") {
      if (!currentInput.includes(".")) {
        currentInput += ".";
      }
    } else {
      if (currentInput === "0") {
        currentInput = num;
      } else {
        currentInput += num;
      }
    }
    updateDisplay();
  }

  // Tambah operator
  function appendOperator(op) {
    if (justCalculated) {
      expression = String(lastResult);
      justCalculated = false;
    } else {
      if (currentInput !== "") {
        expression += currentInput;
      }
    }
    // Ganti operator terakhir jika sudah operator
    if (/[+\-*/]$/.test(expression)) {
      expression = expression.slice(0, -1) + op;
    } else {
      expression += op;
    }
    currentInput = "";
    updateDisplay();
  }

  // Fungsi utama tombol persen (%)
  function handlePercent() {
    if (currentInput === "" || currentInput === "0") return;

    // tambahkan simbol % ke angka terakhir
    currentInput = currentInput + "%";
    expression += currentInput;

    updateDisplay();
    currentInput = ""; // siap input berikutnya
  }


  // Hitung ekspresi
  function calculate() {
    if (justCalculated) return;

    if (currentInput !== "") {
      expression += currentInput;
    }

    if (expression === "" || /[+\-*/]$/.test(expression)) {
      return;
    }

    try {
      let calcExpr = expression.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

      let result = eval(calcExpr);

      if (result === Infinity || result === -Infinity) {
        throw new Error("Pembagian dengan nol tidak diperbolehkan");
      }
      if (isNaN(result)) {
        throw new Error("Hasil tidak valid");
      }

      if (typeof result === "number") {
        result = +result.toFixed(10);
      }

      currentInput = result.toString();
      history.textContent = expression + " =";
      expression = "";
      lastResult = result;
      justCalculated = true;
      updateDisplay();
    } catch {
      currentInput = "Error";
      expression = "";
      lastResult = null;
      justCalculated = false;
      updateDisplay();
    }
  }

  // Tangani klik tombol
  function onButtonClick(e) {
    const target = e.target;
    if (!target.matches("button")) return;

    if (target.classList.contains("number")) {
      appendNumber(target.dataset.num);
    } else if (target.classList.contains("operator")) {
      if (target.id === "percent") {
        handlePercent();
      } else {
        appendOperator(target.dataset.op);
      }
    } else if (target.id === "clear") {
      clearAll();
    } else if (target.id === "backspace") {
      backspace();
    } else if (target.id === "equals") {
      calculate();
    }
  }

  // Tangani keyboard
  function onKeyDown(e) {
    if (e.repeat) return;

    const key = e.key;

    if (key >= "0" && key <= "9") {
      appendNumber(key);
      e.preventDefault();
    } else if (key === ".") {
      appendNumber(key);
      e.preventDefault();
    } else if (key === "+" || key === "-" || key === "*" || key === "/") {
      appendOperator(key);
      e.preventDefault();
    } else if (key === "%") {
      handlePercent();
      e.preventDefault();
    } else if (key === "Enter" || key === "=") {
      calculate();
      e.preventDefault();
    } else if (key === "Backspace") {
      backspace();
      e.preventDefault();
    } else if (key === "Escape") {
      clearAll();
      e.preventDefault();
    }
  }

  // Inisialisasi
  function init() {
    buttons.addEventListener("click", onButtonClick);
    window.addEventListener("keydown", onKeyDown);
    updateDisplay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
 

})();