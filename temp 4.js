let payments = [];

function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  const msg = document.getElementById('loginMsg');

  if (user === "admin" && pass === "admin123") {
    document.getElementById('loginSection').style.display = "none";
    document.getElementById('adminSection').style.display = "block";
  } else if (user === "student" && pass === "student123") {
    document.getElementById('loginSection').style.display = "none";
    document.getElementById('studentSection').style.display = "block";
  } else {
    msg.innerText = "Invalid credentials!";
  }
}

const form = document.getElementById('paymentForm');
const tbody = document.querySelector('#paymentTable tbody');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const id = document.getElementById('studentId').value;
    const month = document.getElementById('month').value;
    const tuition = parseFloat(document.getElementById('tuition').value);
    const lab = parseFloat(document.getElementById('lab').value);
    const exam = parseFloat(document.getElementById('exam').value);
    const workshop = parseFloat(document.getElementById('workshop').value);
    const method = document.getElementById('method').value;
    const total = tuition + lab + exam + workshop;

    const payment = { name, id, month, tuition, lab, exam, workshop, total, method };
    payments.push(payment);
    renderTable();
    form.reset();
  });
}

function renderTable() {
  tbody.innerHTML = "";
  payments.forEach((p, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.id}</td>
      <td>${p.month}</td>
      <td>${p.tuition}</td>
      <td>${p.lab}</td>
      <td>${p.exam}</td>
      <td>${p.workshop}</td>
      <td>${p.total}</td>
      <td>${p.method}</td>
      <td><button onclick="generateReceipt(${index})">Download</button></td>
      <td><button onclick="deletePayment(${index})">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function deletePayment(index) {
  payments.splice(index, 1);
  renderTable();
}

function generateReceipt(index) {
  const p = payments[index];
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Mushfiq's Science Corner", 20, 20);
  doc.setFontSize(12);
  doc.text(`Receipt for: ${p.name} (${p.id})`, 20, 30);
  doc.text(`Month: ${p.month}`, 20, 40);
  doc.text(`Tuition Fee: ${p.tuition} BDT`, 20, 50);
  doc.text(`Lab Fee: ${p.lab} BDT`, 20, 60);
  doc.text(`Exam Fee: ${p.exam} BDT`, 20, 70);
  doc.text(`Workshop Fee: ${p.workshop} BDT`, 20, 80);
  doc.text(`Total Paid: ${p.total} BDT`, 20, 90);
  doc.text(`Payment Method: ${p.method}`, 20, 100);
  doc.save(`${p.name}_Receipt.pdf`);
}

function downloadExcel() {
  const wb = XLSX.utils.json_to_sheet(payments);
  const wbOut = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wbOut, wb, "Payments");
  XLSX.writeFile(wbOut, "Payments_List.xlsx");
}

function filterStudent() {
  const sid = document.getElementById('stuId').value;
  const stbody = document.querySelector('#studentTable tbody');
  stbody.innerHTML = "";
  payments.filter(p => p.id === sid).forEach((p) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.month}</td>
      <td>${p.tuition}</td>
      <td>${p.lab}</td>
      <td>${p.exam}</td>
      <td>${p.workshop}</td>
      <td>${p.total}</td>
      <td>${p.method}</td>
      <td><button onclick="generateReceipt(${payments.indexOf(p)})">Download</button></td>
    `;
    stbody.appendChild(tr);
  });
}
