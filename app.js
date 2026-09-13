const form = document.getElementById("applicationForm");
const message = document.getElementById("message");
const result = document.getElementById("result");
const resultText = document.getElementById("resultText");
const scoreboard = document.getElementById("scoreboard");
const board = document.getElementById("board");
const countBadge = document.getElementById("countBadge");
const showBoardBtn = document.getElementById("showBoardBtn");
const dateInput = document.getElementById("date");
const submitBtn = document.getElementById("submitBtn");

const configured = SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("PASTE_YOUR");

function headers() {
  return {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json"
  };
}

function setMessage(text, error=false) {
  message.textContent = text;
  message.style.color = error ? "#c6285b" : "#2d8a5b";
}

function todayISO() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0,10);
}
dateInput.min = todayISO();

function prettyDate(value) {
  return new Date(value + "T12:00:00").toLocaleDateString(undefined, {
    weekday:"long", year:"numeric", month:"long", day:"numeric"
  });
}

async function getApplications() {
  if (!configured) throw new Error("Supabase key is not configured.");
  const url = `${SUPABASE_URL}/rest/v1/applications?select=id,name,height_cm,weight_kg,hobbies,date_day,created_at&order=created_at.asc`;
  const response = await fetch(url, {headers: headers()});
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function submitApplication(data) {
  if (!configured) throw new Error("Add your Supabase anon/publishable key in config.js first.");
  const url = `${SUPABASE_URL}/rest/v1/applications`;
  const response = await fetch(url, {
    method:"POST",
    headers:{...headers(), "Prefer":"return=representation"},
    body:JSON.stringify(data)
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

function renderBoard(items) {
  countBadge.textContent = `${items.length} application${items.length === 1 ? "" : "s"}`;
  if (!items.length) {
    board.innerHTML = `<div class="empty">No applications yet. Be the first 👀</div>`;
    return;
  }
  board.innerHTML = items.map((item,index) => `
    <div class="board-row">
      <div class="rank">${index + 1}</div>
      <div>
        <div class="name">${escapeHtml(item.name)}</div>
        <div class="meta">${escapeHtml(item.hobbies || "No hobbies listed")}</div>
      </div>
      <div class="date-pill">${prettyDate(item.date_day)}</div>
    </div>
  `).join("");
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

async function loadBoard() {
  try {
    const items = await getApplications();
    renderBoard(items);
    scoreboard.classList.remove("hidden");
  } catch (err) {
    board.innerHTML = `<div class="empty">Could not load the scoreboard yet.<br><small>${escapeHtml(err.message)}</small></div>`;
    scoreboard.classList.remove("hidden");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("");
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const data = {
    name: document.getElementById("name").value.trim(),
    height_cm: Number(document.getElementById("height").value),
    weight_kg: Number(document.getElementById("weight").value),
    hobbies: document.getElementById("hobbies").value.trim(),
    date_day: dateInput.value
  };

  try {
    const inserted = await submitApplication(data);
    const applications = await getApplications();
    const position = applications.findIndex(x => x.id === inserted[0].id) + 1;

    resultText.textContent =
      `Welcome, ${data.name}! You chose ${prettyDate(data.date_day)}. ` +
      `You are currently #${position} on the scoreboard. 🏆`;

    result.classList.remove("hidden");
    scoreboard.classList.remove("hidden");
    renderBoard(applications);
    result.scrollIntoView({behavior:"smooth", block:"center"});
    form.reset();
    dateInput.min = todayISO();
  } catch (err) {
    setMessage(err.message || "Something went wrong.", true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Application 💌";
  }
});

showBoardBtn.addEventListener("click", () => {
  loadBoard();
  scoreboard.scrollIntoView({behavior:"smooth"});
});

loadBoard();
