// ─── STATE ───────────────────────────────────────────────────────────────
let foodLog = JSON.parse(localStorage.getItem('munchsprouts_log') || '[]');
let babyInfo = JSON.parse(
  localStorage.getItem('munchsprouts_babyInfo') || '[]',
);

// ─── INIT ────────────────────────────────────────────────────────────────
(function init() {
  setTodayDate();
  render();
})();

// ─── HELPERS ─────────────────────────────────────────────────────────────
function setTodayDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('foodDate').value = today;
}

function calcAge() {
  const val = document.getElementById('birthDate').value;
  if (!val) return;
  const weeks = Math.floor(
    (Date.now() - new Date(val)) / (7 * 24 * 60 * 60 * 1000),
  );
  document.getElementById('ageWeeks').value = weeks + ' weeks';
}

function normalize(name) {
  return name.toLowerCase().trim();
}

function groupByFood(log) {
  const groups = {};

  log.forEach((entry) => {
    const key = normalize(entry.name);
    if (!groups[key]) {
      groups[key] = {
        key,
        name: entry.name,
        category: entry.category || 'Other',
        attempts: [],
        reaction: entry.reaction,
      };
    }
    groups[key].attempts.push(entry);
  });
  return groups;
}

function reactionBadge(r) {
  if (!r) return '';
  const map = {
    Good: 'badge-good',
    Neutral: 'badge-neutral',
    Rejected: 'badge-rejected',
    Gagged: 'badge-gagged',
  };
  return `<span class="badge ${map[r] || ''}">${r}</span>`;
}

function likeBar(pct) {
  return `
            <div class="like-bar-wrap flex gap-2.5 items-center">
                <div class="like-bar-bg bg-primary-purple rounded-xl h-2 w-14 overflow-hidden">
                  <div class="like-bar-fill bg-primary-green rounded-xl h-full" style="width: ${pct}%"></div>
                </div>
                <p class="like-pct para">${pct}%</p>
            </div>`;
}

function save() {
  localStorage.setItem('munchsprouts_log', JSON.stringify(foodLog));
}

function saveBaby() {
  localStorage.setItem('munchsprouts_babyInfo', JSON.stringify(babyInfo));
}

function alert_(msg, type = 'success') {
  const box = document.getElementById('alertBox');
  const el = document.createElement('div');
  el.className = `alert alert-${type}`;
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

function addChild() {
  const childName = document.getElementById('babyName').value.trim();
  const childDob = document.getElementById('birthDate').value;
  const startDate = document.getElementById('weaningStart').value;

  const entry = {
    id: Date.now(),
    name: childName,
    DOB: childDob,
    startDate: startDate,
  };

  babyInfo.push(entry);

  saveBaby();
}

// ─── ADD FOOD ─────────────────────────────────────────────────────────────
function addFood() {
  const date = document.getElementById('foodDate').value;
  const name = document.getElementById('foodName').value.trim();
  const category = document.getElementById('foodCategory').value;
  const form = document.getElementById('foodForm').value;
  const reaction = document.getElementById('foodReaction').value;
  const notes = document.getElementById('foodNotes').value.trim();

  let liked, disliked, allergic, neutral;

  if (reaction === 'Good') {
    liked = true;
  } else if (reaction === 'Rejected') {
    disliked = true;
  } else if (reaction === 'Neutral') {
    neutral = true;
  } else {
    allergic = true;
  }

  if (!date || !name || !form) {
    alert_('Please fill in Date, Food Item, and Food Form.', 'warning');
    return;
  }

  // Count existing attempts for this food
  const existing = foodLog.filter((f) => normalize(f.name) === normalize(name));
  const attemptNum = existing.length + 1;

  const entry = {
    id: Date.now(),
    date,
    name,
    category,
    form,
    reaction,
    liked,
    disliked,
    neutral,
    allergic,
    notes,
    attemptNum,
  };
  foodLog.push(entry);
  save();
  clearForm();
  render();

  const msg =
    attemptNum === 1
      ? `✅ "${name}" added to the log!`
      : `✅ "${name}" logged again — attempt #${attemptNum}!`;
  alert_(msg);
}

function clearForm() {
  ['foodName', 'foodNotes'].forEach(
    (id) => (document.getElementById(id).value = ''),
  );
  ['foodCategory', 'foodForm', 'foodReaction'].forEach(
    (id) => (document.getElementById(id).value = ''),
  );
  setTodayDate();
}

function deleteAttempt(id) {
  if (!confirm('Delete this attempt?')) return;
  foodLog = foodLog.filter((f) => f.id !== id);
  save();
  render();
  alert_('Attempt deleted.');
}

function editAttempt(attemptId) {
  console.log('Edit clicked for ID:', attemptId);
  const attempt = foodLog.find((log) => log.id === attemptId);
  if (!attempt) return alert('Entry not found');

  document.getElementById('foodNameEdit').value = attempt.name;
  document.getElementById('foodCatEdit').value = attempt.category;
  document.getElementById('foodFormEdit').value = attempt.form || '';
  document.getElementById('foodDateEdit').value = attempt.date;
  document.getElementById('foodReactionEdit').value = attempt.reaction;
  document.getElementById('notesEdit').value = attempt.notes || '';
  document.getElementById('editAttemptId').value = attemptId;

  // Modal for editing entry
  document.getElementById('editModal').classList.remove('hidden');
}

function cancelEdit() {
  document.getElementById('editModal').classList.add('hidden');
  // Clear form
  document
    .querySelectorAll(
      '#editModal input:not([type="hidden"]), #editModal textarea',
    )
    .forEach((el) => (el.value = ''));
  document
    .querySelectorAll('#editModal input[type="checkbox"]')
    .forEach((el) => (el.checked = false));
}

function saveEdit() {
  const attemptId = parseInt(document.getElementById('editAttemptId').value);
  const attemptIndex = foodLog.findIndex((log) => log.id === attemptId);
  const reaction = document.getElementById('foodReactionEdit').value;

  let liked, disliked, allergic, neutral;

  // Check reaction - log to console
  console.log(reaction);

  if (reaction === 'Good') {
    liked = true;
  } else if (reaction === 'Rejected') {
    disliked = true;
  } else if (reaction === 'Neutral') {
    neutral = true;
  } else {
    allergic = true;
  }

  // Check status of liked/disliked/allergic
  console.log(liked);
  console.log(disliked);
  console.log(neutral);
  console.log(allergic);

  if (attemptIndex === -1) return alert('Attempt not found');

  // Update attempt data
  foodLog[attemptIndex] = {
    ...foodLog[attemptIndex],
    name: document.getElementById('foodNameEdit').value,
    category: document.getElementById('foodCatEdit').value,
    form: document.getElementById('foodFormEdit').value,
    date: document.getElementById('foodDateEdit').value,
    reaction: document.getElementById('foodReactionEdit').value,
    liked: liked,
    disliked: disliked,
    neutral: neutral,
    allergic: allergic,
    notes: document.getElementById('notesEdit').value,
  };

  save(); // Your existing save function
  render(); // Refresh display
  cancelEdit(); // Close form
}

function clearAll() {
  if (!confirm('⚠️ Clear ALL data? This cannot be undone.')) return;
  foodLog = [];
  save();
  render();
  alert_('All data cleared.');
}

function clearBaby() {
  if (!confirm('⚠️ Clear ALL data? This cannot be undone.')) return;
  babyInfo = [];
  saveBaby();
  render();
  alert_('All data cleared.');
}

// ─── TOGGLE HISTORY ───────────────────────────────────────────────────────
function toggleHistory(key) {
  const row = document.getElementById('hist_' + key);
  const entry = document.getElementById('ent_' + key);
  if (!row) return;
  row.classList.toggle('open');
  row.classList.toggle('hidden');
  entry.classList.toggle('rounded-b-none');
  const btn = document.getElementById('btn_' + key);
  if (btn) btn.textContent = row.classList.contains('open') ? '▲' : '▼';
}

// ─── RENDER ───────────────────────────────────────────────────────────────
function render() {
  renderStats();
  renderTable();
  updateStatsTitle();
}

function renderStats() {
  const groups = groupByFood(foodLog);
  const keys = Object.keys(groups);
  const total = foodLog.length;
  const unique = keys.length;
  const liked = keys.filter((k) =>
    groups[k].attempts.some((a) => a.liked),
  ).length;
  const disliked = keys.filter((k) =>
    groups[k].attempts.some((a) => a.disliked),
  ).length;
  const allergic = foodLog.filter((f) => f.allergic).length;

  document.getElementById('statUnique').textContent = unique;
  document.getElementById('statAttempts').textContent = total;
  document.getElementById('statLiked').textContent = liked;
  document.getElementById('statAllergic').textContent = allergic;
  document.getElementById('statDisliked').textContent = disliked;

  // Category breakdown
  const catDefs = {
    Vegetables: { icon: '🥬' },
    Fruits: { icon: '🍎' },
    Grains: { icon: '🌾' },
    Proteins: { icon: '🍗' },
    Dairy: { icon: '🥛' },
    Legumes: { icon: '🫘' },
    Other: { icon: '🍽️' },
  };

  const catData = {};
  keys.forEach((k) => {
    const g = groups[k];
    const cat = g.category || 'Other';

    if (!catData[cat]) catData[cat] = { foods: 0, attempts: 0 };
    catData[cat].foods++;
    catData[cat].attempts += g.attempts.length;
  });

  let catHTML = Object.keys(catData)
    .map((cat) => {
      const d = catDefs[cat] || { icon: '🍽️' };
      return `
                <div class="cat-card w-full grid grid-cols-4 grid-rows-1 bg-secondary-purple rounded-xl p-2.5 para place-items-center shadow-xl">
                    <div class="cat-icon">${d.icon}</div>
                    <div class="cat-name">${cat}</div>
                    <div class="cat-count font-bold text-primary-green-light">${catData[cat].foods}</div>
                    <div class="cat-stats">${catData[cat].attempts} attempts</div>
                </div>`;
    })
    .join('');

  document.getElementById('catBreakdown').innerHTML =
    catHTML ||
    '<p class="para text-center">Add foods to see category breakdown.</p>';
}

function updateStatsTitle() {
  const firstChild = babyInfo[0];

  if (firstChild) {
    document.getElementById('stats-title').textContent =
      `${firstChild.name}'s Statistics Dashboard`;
  }
}

function renderTable() {
  const container = document.getElementById('logContainer');
  const groups = groupByFood(foodLog);
  const keys = Object.keys(groups);

  if (keys.length === 0) {
    container.innerHTML = `
                <div class="empty-state para w-full text-center">
                    <p>No foods logged yet. Add your first food above!</p>
                </div>`;
    return;
  }

  let html = `
            <table class="log-table w-full text-center table-fixed">
                <thead>
                    <tr class="grid grid-cols-[2fr_1fr_0.5fr_1fr_1fr_1fr_0.5fr_0.5fr]">
                        <th>Food</th>
                        <th>Category</th>
                        <th>Attempts</th>
                        <th>Forms Tried</th>
                        <th>Latest Reaction</th>
                        <th>Liked %</th>
                        <th>⚠️</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody class="">`;

  keys.forEach((key) => {
    const g = groups[key];
    const count = g.attempts.length;
    const badgeCls = count === 1 ? 'one' : 'multi';
    const forms = [
      ...new Set(g.attempts.map((a) => a.form).filter(Boolean)),
    ].join(', ');
    const latest = g.attempts[count - 1];
    const likedCnt = g.attempts.filter((a) => a.liked).length;
    const pct = Math.round((likedCnt / count) * 100);
    const hasAllergy = g.attempts.some((a) => a.allergic);

    html += `
                <tr class="food-row  rounded-xl p-2.5 w-full grid grid-cols-[2fr_2fr_2fr_1fr] grid-rows-1 place-items-center mt-2.5 ${g.reaction === 'Allergic' ? 'bg-red-400 text-white' : 'bg-white'}" id="ent_${key}">
                    <td class="log-name para flex gap-2.5 items-center"><strong>${g.name}</strong><span class="attempt-badge ${badgeCls} py-0.5 px-2.5 bg-primary-purple rounded-full text-sm">${count}x</span></td>
                    <td class="log-cat hidden">${g.category || '—'}</td>
                    <td style="text-align:center;" class="log-count hidden">${count}</td>
                    <td style="font-size:12px;" class="log-date hidden">${forms || '—'}</td>
                    <td class="log-reaction">${reactionBadge(latest.reaction)}</td>
                    <td class="log-like-bar">${likeBar(pct)} </td>
                    <td style="text-align:center;" class="log-allergy hidden">${hasAllergy ? '⚠️' : ''}</td>
                    <td>
                        <button class="btn-secondary btn-sm btn-info" id="btn_${key}" onclick="toggleHistory('${key}')">▼</button>
                    </td>
                </tr>
                <tr class="history-row w-full hidden mb-2.5" id="hist_${key}">
                    <td class="w-full ">
                        <div class="history-inner para flex flex-col">
                            ${g.attempts
                              .map(
                                (a, i) => `
                                <div class="attempt-item rounded-b-xl ${a.reaction === 'Allergic' ? 'bg-red-400 text-white' : 'bg-white'} flex flex-col w-full p-2.5 gap-2.5 items-center">
                                    <div class="flex justify-between px-5 w-full ">
                                      <span class="attempt-num font-bold">Attempt ${i + 1}</span>
                                      <span class="attempt-date">${a.date}</span>
                                    </div>
                                    <div class="flex justify-between px-5 w-full ">
                                      <span>${a.form || '—'}</span>
                                      <span>${a.category || '—'}</span>
                                      <span class="py-1 px-5 rounded-2xl ${a.reaction === 'Good' ? 'bg-bg-green border-primary-green-light border-2 text-primary-green-light' : a.reaction === 'Rejected' || a.reaction === 'Allergic' ? 'border-warning-stroke border-2 bg-bg-warning text-warning-stroke' : 'bg-amber-100 border-2 border-amber-400 text-orange-400'}" id="reaction-box-${a.id}-${a.reaction}">${reactionBadge(a.reaction)}</span>
                                    </div>
                                    ${
                                      a.notes
                                        ? `
                                      <div class="notes-disp flex flex-col  ">
                                        <span class=" font-bold">Notes</span>
                                        <span>${a.notes || ''}</span>
                                      </div>
                                    `
                                        : ''
                                    }
                                    
                                    
                                    <button class="btn-danger btn-sm btn-outline bg-primary-purple w-5/6 cursor-pointer rounded-xl py-1 shadow-md text-primary-pink-dark hover:bg-bg-purple" onclick="editAttempt(${a.id})">Edit Entry</button>

                                    <button class="btn-danger btn-sm btn-outline bg-warning-stroke w-5/6 cursor-pointer rounded-xl py-1 text-white shadow-md hover:bg-red-400" onclick="deleteAttempt(${a.id})">Delete</button>
                                </div>`,
                              )
                              .join('')}
                        </div>
                    </td>
                </tr>`;
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

// ─── EXPORT CSV ──────────────────────────────────────────────────────────
function exportCSV() {
  if (!foodLog.length) {
    alert_('No data to export.', 'warning');
    return;
  }
  let csv =
    'Date,Food,Category,Attempt #,Form,Reaction,Liked,Disliked,Allergic Reaction,Notes\n';
  foodLog.forEach((f) => {
    csv += `"${f.date}","${f.name}","${f.category || ''}","${f.attemptNum || 1}","${f.form}","${f.reaction}","${f.liked ? 'Yes' : 'No'}","${f.disliked ? 'Yes' : 'No'}", "${f.allergic ? 'Yes' : 'No'}","${f.notes}"\n`;
  });
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'MunchSprouts_Weaning_Log.csv';
  a.click();
  alert_('✅ CSV exported!');
}
