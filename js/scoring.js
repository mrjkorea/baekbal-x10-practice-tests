(function () {
  function norm(s) {
    return String(s || '')
      .trim()
      .toLowerCase()
      .replace(/[.!?,;:]+$/g, '')
      .replace(/\s+/g, ' ')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"');
  }

  function shortPrimary(s) {
    let t = String(s || '').trim();
    if (!t) return '';
    const first = t.split(/(?<=\.)\s+|;\s+/)[0].trim();
    if (first.length <= 80) return first;
    return first.split(/\s+/).slice(0, 12).join(' ');
  }

  function acceptedList(q) {
    const raw = q.answers || [];
    const out = [];
    raw.forEach((a) => {
      if (!a) return;
      const full = String(a).trim();
      const primary = shortPrimary(full);
      [full, primary].forEach((x) => {
        if (x && !out.includes(x)) out.push(x);
      });
    });
    return out;
  }

  function matchText(user, accepted) {
    const n = norm(user);
    if (!n) return false;
    const nNoSpace = n.replace(/\s/g, '');
    return accepted.some((a) => {
      const na = norm(a);
      return na === n || na.replace(/\s/g, '') === nNoSpace;
    });
  }

  function scoreQuestion(q, user) {
    const type = q.type;
    if (type === 'TMC') {
      const ok = String(user || '') === String(q.corAns || '');
      const idx = parseInt(q.corAns, 10) - 1;
      const correctText = (q.answers && q.answers[idx]) || q.corAns;
      return {
        ok,
        earned: ok ? 1 : 0,
        max: 1,
        userText: user ? `${user}. ${(q.answers || [])[parseInt(user, 10) - 1] || ''}`.trim() : '(무응답)',
        correctText: `${q.corAns}. ${correctText}`,
      };
    }
    if (type === 'TMCMA') {
      const want = String(q.corAns || '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
        .sort()
        .join(',');
      const got = String(user || '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
        .sort()
        .join(',');
      const ok = want === got && want.length > 0;
      return {
        ok,
        earned: ok ? 1 : 0,
        max: 1,
        userText: got || '(무응답)',
        correctText: want,
      };
    }
    // TST
    const accepted = acceptedList(q);
    const ok = matchText(user, accepted);
    return {
      ok,
      earned: ok ? 1 : 0,
      max: 1,
      userText: (user && String(user).trim()) || '(무응답)',
      correctText: shortPrimary(accepted[0] || ''),
    };
  }

  window.X10Scoring = { norm, shortPrimary, acceptedList, matchText, scoreQuestion };
})();
