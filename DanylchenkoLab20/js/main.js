(function () {
  'use strict';

  const meta = document.createElement('meta');
  meta.name    = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0';
  document.head.appendChild(meta);

  let display  = '0';
  let operand1 = null;
  let operator = null;
  let newInput = false;

  const LAYOUT = [
    [
      { t: 'AC',  k: 'ac',  c: 'fn' },
      { t: '+/-', k: 'neg', c: 'fn' },
      { t: '%',   k: 'pct', c: 'fn' },
      { t: '÷',   k: 'div', c: 'op' },
    ],
    [
      { t: '7', k: 'd7', c: 'n' },
      { t: '8', k: 'd8', c: 'n' },
      { t: '9', k: 'd9', c: 'n' },
      { t: '×', k: 'mul', c: 'op' },
    ],
    [
      { t: '4', k: 'd4', c: 'n' },
      { t: '5', k: 'd5', c: 'n' },
      { t: '6', k: 'd6', c: 'n' },
      { t: '−', k: 'sub', c: 'op' },
    ],
    [
      { t: '1', k: 'd1', c: 'n' },
      { t: '2', k: 'd2', c: 'n' },
      { t: '3', k: 'd3', c: 'n' },
      { t: '+', k: 'add', c: 'op' },
    ],
    [
      { t: '0', k: 'd0', c: 'n', w: true },
      { t: '.', k: 'dot', c: 'n' },
      { t: '=', k: 'eq',  c: 'eq' },
    ],
  ];

  const ALL_BTNS = LAYOUT.flat();

  const C = {
    pageBg:  '#111111',
    calcBg:  '#000000',
    dispFg:  '#ffffff',
    fn:      '#a5a5a5',  fnFg: '#000000',
    op:      '#ff9f0a',  opFg: '#ffffff',
    n:       '#333333',  nFg:  '#ffffff',
    eq:      '#ff9f0a',  eqFg: '#ffffff',
    opHlBg:  '#ffffff',  opHlFg: '#ff9f0a',
  };

  function getS() {
    const w = window.innerWidth;
    if (w < 480) return { btn: 68,  gap: 10, pad: 10, dispH: 96,  dispFs: 52, btnFs: 24, br: 16 };
    if (w < 900) return { btn: 88,  gap: 12, pad: 12, dispH: 122, dispFs: 66, btnFs: 30, br: 20 };
    return             { btn: 96,  gap: 14, pad: 14, dispH: 138, dispFs: 74, btnFs: 34, br: 22 };
  }

  function mk(tag)      { return document.createElement(tag); }
  function css(el, obj) { Object.assign(el.style, obj); }

  let calcEl, gridEl, dispEl;
  const btnMap = {};

  function build() {

    css(document.body, {
      margin:          '0',
      padding:         '0',
      minHeight:       '100vh',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      backgroundColor: C.pageBg,
      fontFamily:      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
    });

    calcEl = mk('div');
    css(calcEl, {
      backgroundColor: C.calcBg,
      display:         'flex',
      flexDirection:   'column',
    });
    document.body.appendChild(calcEl);

    dispEl = mk('div');
    css(dispEl, {
      color:          C.dispFg,
      textAlign:      'right',
      fontWeight:     '300',
      letterSpacing:  '-1px',
      lineHeight:     '1',
      overflow:       'hidden',
      display:        'flex',
      alignItems:     'flex-end',
      justifyContent: 'flex-end',
    });
    calcEl.appendChild(dispEl);

    gridEl = mk('div');
    css(gridEl, {
      display:             'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
    });
    calcEl.appendChild(gridEl);

    ALL_BTNS.forEach(b => {
      const btn = mk('button');
      btn.textContent = b.t;

      css(btn, {
        backgroundColor: C[b.c],
        color:           C[b.c + 'Fg'],
        border:          'none',
        cursor:          'pointer',
        outline:         'none',
        WebkitTapHighlightColor: 'transparent',
        fontFamily:      'inherit',
        fontWeight:      '400',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  b.w ? 'flex-start' : 'center',
        transition:      'filter 0.1s',
      });

      if (b.w) btn.style.gridColumn = 'span 2';

      btn.addEventListener('mouseenter',  () => { btn.style.filter = 'brightness(1.3)'; });
      btn.addEventListener('mouseleave',  () => { btn.style.filter = ''; });
      btn.addEventListener('mousedown',   () => { btn.style.filter = 'brightness(0.85)'; });
      btn.addEventListener('mouseup',     () => { btn.style.filter = ''; });
      btn.addEventListener('click',       () => { handle(b.k); });

      gridEl.appendChild(btn);
      btnMap[b.k] = btn;
    });

    document.addEventListener('keydown', onKey);

    applyResponsive();
  }

  function applyResponsive() {
    const s = getS();
    const calcW = s.btn * 4 + s.gap * 3 + s.pad * 2;

    css(calcEl, {
      width:        calcW + 'px',
      borderRadius: s.br + 'px',
      padding:      s.pad + 'px',
      gap:          s.gap + 'px',
    });

    css(dispEl, {
      minHeight: s.dispH + 'px',
      padding:   '6px 4px 10px',
    });

    css(gridEl, { gap: s.gap + 'px' });

    ALL_BTNS.forEach(b => {
      const btn = btnMap[b.k];
      const h   = s.btn;
      const w   = b.w ? s.btn * 2 + s.gap : s.btn;
      css(btn, {
        width:        w + 'px',
        height:       h + 'px',
        borderRadius: (h / 2) + 'px',
        fontSize:     s.btnFs + 'px',
        paddingLeft:  b.w ? Math.round(h * 0.3) + 'px' : '0',
      });
    });

    refreshDisplay();
  }

  const OP_KEY = { div: '/', mul: '*', sub: '-', add: '+' };

  function handle(k) {
    if      (k === 'ac')                            doClear();
    else if (k === 'neg')                           doNegate();
    else if (k === 'pct')                           doPct();
    else if (k === 'eq')                            doEquals();
    else if (Object.keys(OP_KEY).includes(k))       doOp(k);
    else if (k === 'dot')                           doDot();
    else                                            doDigit(btnMap[k].textContent);

    refreshDisplay();
    updateAC();
  }

  function doDigit(d) {
    if (newInput) { display = d;                          newInput = false; }
    else          { display = display === '0' ? d : display + d; }
    if (display.length > 9) display = display.slice(0, 9);
  }

  function doDot() {
    if (newInput)                 { display = '0.'; newInput = false; return; }
    if (!display.includes('.'))     display += '.';
  }

  function doOp(k) {
    if (operator && !newInput) compute();
    operand1 = parseFloat(display);
    operator = OP_KEY[k];
    newInput = true;
    highlightOp(k);
  }

  function doEquals() {
    if (operator === null) return;
    compute();
    operator = null;
    newInput = true;
    clearOpHighlight();
  }

  function compute() {
    const a = operand1;
    const b = parseFloat(display);
    let r;
    switch (operator) {
      case '+': r = a + b; break;
      case '-': r = a - b; break;
      case '*': r = a * b; break;
      case '/': r = b !== 0 ? a / b : NaN; break;
    }
    display = isFinite(r) ? fmt(r) : 'Помилка';
  }

  function doClear() {
    display  = '0';
    operand1 = null;
    operator = null;
    newInput = false;
    clearOpHighlight();
  }

  function doNegate() {
    const v = parseFloat(display);
    if (!isNaN(v)) display = fmt(-v);
  }

  function doPct() {
    const v = parseFloat(display);
    if (!isNaN(v)) display = fmt(v / 100);
  }

  function fmt(n) {
    if (!isFinite(n)) return 'Помилка';
    let s = parseFloat(n.toPrecision(10)).toString();
    if (s.length > 10) s = parseFloat(n.toPrecision(5)).toExponential();
    return s;
  }

  function refreshDisplay() {
    const s   = getS();
    const len = display.length;
    let   fs  = s.dispFs;
    if      (len > 9) fs = Math.round(s.dispFs * 0.52);
    else if (len > 7) fs = Math.round(s.dispFs * 0.64);
    else if (len > 5) fs = Math.round(s.dispFs * 0.80);

    dispEl.style.fontSize = fs + 'px';
    dispEl.textContent    = display;
  }

  function updateAC() {
    btnMap['ac'].textContent =
      (display === '0' && operand1 === null) ? 'AC' : 'C';
  }

  function highlightOp(activeK) {
    clearOpHighlight();
    const btn = btnMap[activeK];
    if (btn) {
      btn.style.backgroundColor = C.opHlBg;
      btn.style.color           = C.opHlFg;
    }
  }

  function clearOpHighlight() {
    Object.keys(OP_KEY).forEach(k => {
      const btn = btnMap[k];
      if (btn) {
        btn.style.backgroundColor = C.op;
        btn.style.color           = C.opFg;
      }
    });
  }

  function onKey(e) {
    const map = {
      '0': 'd0', '1': 'd1', '2': 'd2', '3': 'd3', '4': 'd4',
      '5': 'd5', '6': 'd6', '7': 'd7', '8': 'd8', '9': 'd9',
      '.': 'dot', ',': 'dot',
      '+': 'add', '-': 'sub', '*': 'mul', '/': 'div',
      'Enter': 'eq', '=': 'eq',
      'Backspace': 'ac', 'Escape': 'ac',
      '%': 'pct',
    };
    const k = map[e.key];
    if (k) { e.preventDefault(); handle(k); }
  }

  build();
  window.addEventListener('resize', applyResponsive);

})();
