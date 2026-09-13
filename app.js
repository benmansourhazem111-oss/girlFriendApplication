const form = document.getElementById("applicationForm");
const message = document.getElementById("message");

const result = document.getElementById("result");
const resultText = document.getElementById("resultText");

const scoreboard = document.getElementById("scoreboard");
const board = document.getElementById("board");
const countBadge = document.getElementById("countBadge");

const showBoardBtn = document.getElementById("showBoardBtn");
const showPaymentBtn = document.getElementById("showPaymentBtn");

const dateInput = document.getElementById("date");
const submitBtn = document.getElementById("submitBtn");

const payment = document.getElementById("payment");
const payBtn = document.getElementById("payBtn");
const paymentMessage = document.getElementById("paymentMessage");

/* =========================================
SUPABASE
========================================= */

const configured =
typeof SUPABASE_URL !== "undefined" &&
typeof SUPABASE_ANON_KEY !== "undefined" &&
SUPABASE_URL &&
SUPABASE_ANON_KEY &&
!SUPABASE_ANON_KEY.includes("PASTE_YOUR");

function headers() {
return {
"apikey": SUPABASE_ANON_KEY,
"Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
"Content-Type": "application/json"
};
}

/* =========================================
GENERAL HELPERS
========================================= */

function setMessage(text, error = false) {
message.textContent = text;
message.style.color = error ? "#c6285b" : "#2d8a5b";
}

function todayISO() {
const d = new Date();

const local = new Date(
d.getTime() - d.getTimezoneOffset() * 60000
);

return local.toISOString().slice(0, 10);
}

dateInput.min = todayISO();

function prettyDate(value) {
return new Date(value + "T12:00:00").toLocaleDateString(
undefined,
{
weekday: "long",
year: "numeric",
month: "long",
day: "numeric"
}
);
}

function escapeHtml(text) {
return String(text).replace(/[&<>"']/g, function (c) {

```
return {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
}[c];
```

});
}

/* =========================================
SUPABASE GET APPLICATIONS
========================================= */

async function getApplications() {

if (!configured) {
throw new Error(
"Supabase is not configured correctly."
);
}

const url =
`${SUPABASE_URL}/rest/v1/applications` +
`?select=id,name,height_cm,weight_kg,hobbies,date_day,created_at` +
`&order=created_at.asc`;

const response = await fetch(
url,
{
headers: headers()
}
);

if (!response.ok) {
throw new Error(await response.text());
}

return response.json();
}

/* =========================================
SUPABASE SUBMIT
========================================= */

async function submitApplication(data) {

if (!configured) {
throw new Error(
"Supabase is not configured correctly."
);
}

const response = await fetch(
`${SUPABASE_URL}/rest/v1/applications`,
{
method: "POST",

```
  headers: {
    ...headers(),
    "Prefer": "return=representation"
  },

  body: JSON.stringify(data)
}
```

);

if (!response.ok) {
throw new Error(await response.text());
}

return response.json();
}

/* =========================================
SCOREBOARD
========================================= */

function renderBoard(items) {

countBadge.textContent =
`${items.length} application${items.length === 1 ? "" : "s"}`;

if (!items.length) {

```
board.innerHTML =
  `<div class="empty">
    No applications yet. Be the first 👀
  </div>`;

return;
```

}

board.innerHTML = items.map(function (item, index) {

```
return `
  <div class="board-row">

    <div class="rank">
      ${index + 1}
    </div>

    <div>

      <div class="name">
        ${escapeHtml(item.name)}
      </div>

      <div class="meta">
        ${escapeHtml(
          item.hobbies || "No hobbies listed"
        )}
      </div>

    </div>

    <div class="date-pill">
      ${prettyDate(item.date_day)}
    </div>

  </div>
`;
```

}).join("");
}

async function loadBoard() {

if (!configured) {

```
board.innerHTML =
  `<div class="empty">
    Scoreboard is waiting for Supabase configuration 👀
  </div>`;

scoreboard.classList.remove("hidden");

return;
```

}

try {

```
const items = await getApplications();

renderBoard(items);

scoreboard.classList.remove("hidden");
```

}

catch (err) {

```
board.innerHTML =
  `<div class="empty">
    Could not load the scoreboard yet.
    <br>
    <small>
      ${escapeHtml(err.message)}
    </small>
  </div>`;

scoreboard.classList.remove("hidden");
```

}
}

/* =========================================
APPLICATION FORM
========================================= */

form.addEventListener("submit", async function (event) {

event.preventDefault();

setMessage("");

submitBtn.disabled = true;

submitBtn.textContent = "Submitting...";

const data = {

```
name:
  document.getElementById("name")
    .value
    .trim(),

height_cm:
  Number(
    document.getElementById("height").value
  ),

weight_kg:
  Number(
    document.getElementById("weight").value
  ),

hobbies:
  document.getElementById("hobbies")
    .value
    .trim(),

date_day:
  dateInput.value
```

};

try {

```
const inserted =
  await submitApplication(data);

const applications =
  await getApplications();


const position =
  applications.findIndex(
    function (x) {
      return x.id === inserted[0].id;
    }
  ) + 1;


resultText.textContent =
  `Welcome, ${data.name}! ` +
  `You chose ${prettyDate(data.date_day)}. ` +
  `You are currently #${position} ` +
  `on the scoreboard. 🏆`;


result.classList.remove("hidden");


scoreboard.classList.remove("hidden");

renderBoard(applications);


result.scrollIntoView({
  behavior: "smooth",
  block: "center"
});


form.reset();

dateInput.min = todayISO();
```

}

catch (err) {

```
setMessage(
  err.message ||
  "Something went wrong.",
  true
);
```

}

finally {

```
submitBtn.disabled = false;

submitBtn.textContent =
  "Submit Application 💌";
```

}

});

/* =========================================
SHOW SCOREBOARD
========================================= */

showBoardBtn.addEventListener(
"click",
async function () {

```
await loadBoard();

scoreboard.scrollIntoView({
  behavior: "smooth",
  block: "center"
});
```

}
);

/* =========================================
SHOW PAYMENT
========================================= */

showPaymentBtn.addEventListener(
"click",
function () {

```
payment.classList.remove("hidden");

paymentMessage.textContent =
  "🤨 Ahhh, so we're trying to buy our way to the top now?";


setTimeout(function () {

  payment.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

}, 100);
```

}
);

/* =========================================
FAKE PAYMENT
========================================= */

payBtn.addEventListener(
"click",
function () {

```
const jokes = [

  "😭 PAYMENT FAILED: You really thought I'd let you buy your way into first place?",

  "💀 PAYMENT DECLINED: Love cannot be purchased... apparently.",

  "🚨 BANK ERROR: Suspicious levels of desperation detected.",

  "😂 TRANSACTION FAILED: Nice try. The scoreboard remains undefeated.",

  "💔 PAYMENT REJECTED: Money can't buy love... apparently.",

  "🤨 PAYMENT FAILED: The CEO of Girlfriend Applications has personally rejected this transaction."

];


const randomMessage =
  jokes[
    Math.floor(
      Math.random() * jokes.length
    )
  ];


paymentMessage.textContent =
  randomMessage;


payBtn.textContent =
  "😭 Payment Failed";


payBtn.disabled = true;


setTimeout(function () {

  payBtn.textContent =
    "💳 Pay & Buy My Position";

  payBtn.disabled = false;

}, 2200);
```

}
);

/* =========================================
START
========================================= */

loadBoard();
