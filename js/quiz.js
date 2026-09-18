(function () {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const form = document.getElementById('quiz');
  const results = document.getElementById('results');
  let test = null;

  if (!id) {
    document.getElementById('title').textContent = '테스트를 선택하세요';
    location.href = 'index.html';
    return;
  }

  fetch(`data/${id}.json`)
    .then((r) => {
      if (!r.ok) throw new Error('not found');
      return r.json();
    })
    .then((data) => {
      test = data;
      document.title = data.title;
      document.getElementById('title').textContent = data.title;
      document.getElementById('sub').textContent = `${data.questionCount}문항 · 제출 후 채점`;
      renderQuestions(data.questions);
    })
    .catch(() => {
      document.getElementById('title').textContent = '테스트를 찾을 수 없습니다';
    });

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderQuestions(questions) {
    form.innerHTML = '';
    questions.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'q';
      div.dataset.idx = i;
      let body = `<div><span class="q-num">${i + 1}.</span><span class="meta">${esc(q.type)}</span></div>`;
      body += `<div class="q-stem">${esc(q.question)}</div>`;
      if (q.type === 'TMC') {
        body += '<div class="choices">';
        (q.answers || []).forEach((a, j) => {
          const val = String(j + 1);
          body += `<label><input type="radio" name="q${i}" value="${val}" /> ${val}. ${esc(a)}</label>`;
        });
        body += '</div>';
      } else if (q.type === 'TMCMA') {
        body += '<div class="choices"><p class="meta">해당되는 것을 모두 고르세요.</p>';
        (q.answers || []).forEach((a, j) => {
          const val = String(j + 1);
          body += `<label><input type="checkbox" name="q${i}" value="${val}" /> ${val}. ${esc(a)}</label>`;
        });
        body += '</div>';
      } else {
        body += `<input type="text" name="q${i}" autocomplete="off" placeholder="짧은 답만 입력" />`;
      }
      body += `<div class="explain-slot" id="explain-${i}"></div>`;
      div.innerHTML = body;
      form.appendChild(div);
    });
  }

  function readAnswer(i, q) {
    if (q.type === 'TMC') {
      const el = form.querySelector(`input[name="q${i}"]:checked`);
      return el ? el.value : '';
    }
    if (q.type === 'TMCMA') {
      return Array.from(form.querySelectorAll(`input[name="q${i}"]:checked`))
        .map((el) => el.value)
        .join(',');
    }
    const el = form.querySelector(`input[name="q${i}"]`);
    return el ? el.value : '';
  }

  document.getElementById('submit').addEventListener('click', () => {
    if (!test) return;
    let earned = 0;
    let max = 0;
    const rows = [];
    const mistakes = [];
    test.questions.forEach((q, i) => {
      const user = readAnswer(i, q);
      const s = window.X10Scoring.scoreQuestion(q, user);
      earned += s.earned;
      max += s.max;
      rows.push({ i, q, user, s });
      const slot = document.getElementById(`explain-${i}`);
      if (s.ok) {
        slot.innerHTML = `<details class="explain"><summary>해설 보기</summary><p>${esc(q.explainKo)}</p></details>`;
      } else {
        slot.innerHTML = `<div class="mistake"><div class="bad">오답</div><div>내 답: ${esc(s.userText)}</div><div>정답: ${esc(s.correctText)}</div><p class="explain">${esc(q.explainKo)}</p></div>`;
        mistakes.push({ i, q, s });
      }
    });
    const pct = max ? Math.round((earned / max) * 100) : 0;
    results.classList.remove('hidden');
    results.innerHTML = `
      <div class="score-banner">
        <div class="big">${earned} / ${max}</div>
        <div class="sub">${pct}% · ${mistakes.length}문항 오답</div>
      </div>
      <div class="card">
        <h2>문항별 점수</h2>
        <table class="breakdown">
          <thead><tr><th>#</th><th>결과</th><th>배점</th></tr></thead>
          <tbody>
            ${rows
              .map(
                (r) =>
                  `<tr><td>${r.i + 1}</td><td class="${r.s.ok ? 'ok' : 'bad'}">${r.s.ok ? '정답' : '오답'}</td><td>${r.s.earned}/${r.s.max}</td></tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
      <div class="card">
        <h2>오답 노트 (내 답 → 정답 + 해설)</h2>
        ${
          mistakes.length
            ? mistakes
                .map(
                  (m) => `
          <div class="mistake">
            <strong>${m.i + 1}번</strong>
            <div>내 답: ${esc(m.s.userText)}</div>
            <div>정답: ${esc(m.s.correctText)}</div>
            <p class="explain">${esc(m.q.explainKo)}</p>
          </div>`
                )
                .join('')
            : '<p class="ok">오답이 없습니다. 잘했어요!</p>'
        }
      </div>`;
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('reset').addEventListener('click', () => {
    location.reload();
  });
})();
