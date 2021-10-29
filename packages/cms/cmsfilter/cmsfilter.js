(() => {
  var de = Object.create;
  var R = Object.defineProperty,
    ye = Object.defineProperties,
    Se = Object.getOwnPropertyDescriptor,
    ge = Object.getOwnPropertyDescriptors,
    be = Object.getOwnPropertyNames,
    Q = Object.getOwnPropertySymbols,
    Ee = Object.getPrototypeOf,
    z = Object.prototype.hasOwnProperty,
    he = Object.prototype.propertyIsEnumerable;
  var G = (e, t, r) => (t in e ? R(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : (e[t] = r)),
    M = (e, t) => {
      for (var r in t || (t = {})) z.call(t, r) && G(e, r, t[r]);
      if (Q) for (var r of Q(t)) he.call(t, r) && G(e, r, t[r]);
      return e;
    },
    D = (e, t) => ye(e, ge(t)),
    xe = (e) => R(e, '__esModule', { value: !0 });
  var Ce = (e, t) => () => t || e((t = { exports: {} }).exports, t), t.exports;
  var Fe = (e, t, r) => {
      if ((t && typeof t == 'object') || typeof t == 'function')
        for (let o of be(t))
          !z.call(e, o) && o !== 'default' && R(e, o, { get: () => t[o], enumerable: !(r = Se(t, o)) || r.enumerable });
      return e;
    },
    Te = (e) =>
      Fe(
        xe(
          R(
            e != null ? de(Ee(e)) : {},
            'default',
            e && e.__esModule && 'default' in e
              ? { get: () => e.default, enumerable: !0 }
              : { value: e, enumerable: !0 }
          )
        ),
        e
      );
  var S = (e, t, r) =>
    new Promise((o, n) => {
      var s = (a) => {
          try {
            l(r.next(a));
          } catch (c) {
            n(c);
          }
        },
        i = (a) => {
          try {
            l(r.throw(a));
          } catch (c) {
            n(c);
          }
        },
        l = (a) => (a.done ? o(a.value) : Promise.resolve(a.value).then(s, i));
      l((r = r.apply(e, t)).next());
    });
  var se = Ce((Jt, ne) => {
    ne.exports = Oe;
    function Oe(e, t, r, o) {
      var n, s, i;
      return function () {
        if (((i = this), (s = Array.prototype.slice.call(arguments)), n && (r || o))) return;
        if (!r) return c(), (n = setTimeout(a, t)), n;
        (n = setTimeout(c, t)), e.apply(i, s);
        function a() {
          c(), e.apply(i, s);
        }
        function c() {
          clearTimeout(n), (n = null);
        }
      };
    }
  });
  var x = class {
    static activateAlerts() {
      this.alertsActivated = !0;
    }
    static alert(t, r) {
      if ((this.alertsActivated && window.alert(t), r === 'error')) throw new Error(t);
    }
  };
  x.alertsActivated = !1;
  var O = {
      wrapper: 'w-dyn-list',
      list: 'w-dyn-items',
      item: 'w-dyn-item',
      paginationNext: 'w-pagination-next',
      paginationPrevious: 'w-pagination-previous',
      emptyState: 'w-dyn-empty',
    },
    v = {
      formBlock: 'w-form',
      checkboxField: 'w-checkbox',
      checkboxInput: 'w-checkbox-input',
      radioField: 'w-radio',
      radioInput: 'w-radio-input',
      checkboxOrRadioLabel: 'w-form-label',
      checkboxOrRadioFocus: 'w--redirected-focus',
      checkboxOrRadioChecked: 'w--redirected-checked',
    };
  var A = (e, t) => (
    Array.isArray(t) || (t = [t]), t.map((o) => e.dispatchEvent(new Event(o, { bubbles: !0 }))).every((o) => o)
  );
  var { radioInput: we, checkboxOrRadioFocus: ve, checkboxOrRadioChecked: Ae } = v,
    $ = (e, t = []) => {
      let { type: r } = e;
      if (e instanceof HTMLInputElement && ['checkbox', 'radio'].includes(r)) {
        if (
          !e.checked ||
          ((e.checked = !1),
          A(
            e,
            ['click', 'input', 'change'].filter((s) => !t.includes(s))
          ),
          r === 'checkbox')
        )
          return;
        let { parentElement: o } = e;
        if (!o) return;
        let n = o.querySelector(`.${we}`);
        if (!n) return;
        n.classList.remove(ve, Ae);
        return;
      }
      (e.value = ''),
        A(
          e,
          ['input', 'change'].filter((o) => !t.includes(o))
        );
    };
  var C = (e, t) => !!e && t.includes(e);
  function I(e, t, r) {
    let o = r ? [r] : [];
    if (!e) return o;
    let n = e.split(',').reduce((s, i) => {
      let l = i.trim();
      return l && s.push(l), s;
    }, []);
    if (t) {
      let s = n.filter((i) => C(i, t));
      return s.length ? s : o;
    }
    return n;
  }
  var _ = (e) => Object.entries(e);
  var F = (e, t) => {
    let { type: r } = e;
    if (typeof t == 'boolean') {
      if (
        !(e instanceof HTMLInputElement) ||
        (r !== 'radio' && r !== 'checkbox') ||
        (r === 'checkbox' && t === !1) ||
        t === e.checked
      )
        return;
      e.checked = t;
    } else {
      if (r === 'radio' || r === 'checkbox' || e.value === t) return;
      e.value = t;
    }
    A(e, ['click', 'input', 'change']);
  };
  var L = (e) => e instanceof HTMLInputElement || e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement;
  var k = (e) => e != null;
  var { wrapper: ke, list: Me, paginationNext: De, paginationPrevious: Ie, emptyState: Le } = O;
  function K(e, t, r = document) {
    let o = typeof e == 'string' ? r.querySelector(e) : e;
    if (!o) return;
    let n = o.closest(`.${ke}`);
    if (!n) return;
    let s = n.querySelector(`.${Me}`);
    return t === 'wrapper'
      ? n
      : t === 'list'
      ? s
      : t === 'items'
      ? [...((s == null ? void 0 : s.children) || [])]
      : t === 'empty'
      ? n.querySelector(`.${Le}`)
      : n.querySelector(`.${t === 'next' ? De : Ie}`);
  }
  var N = (e, t = document) => {
    e = e.filter((s) => s);
    let r = e.join(', ') || `.${O.wrapper}`;
    return [...t.querySelectorAll(r)].reduce((s, i) => {
      if (!i) return s;
      let l = K(i, 'wrapper');
      return !l || s.includes(l) || s.push(l), s;
    }, []);
  };
  var X = 'fs-attributes',
    J = { preventLoad: { key: `${X}-preventload` }, debugMode: { key: `${X}-debug` } };
  var Y = () => {
      window.fsAttributes || (window.fsAttributes = { cms: {} });
    },
    Z = (e) => {
      let { preventLoad: t, debugMode: r } = J,
        o = typeof (e == null ? void 0 : e.getAttribute(t.key)) == 'string';
      return typeof (e == null ? void 0 : e.getAttribute(r.key)) == 'string' && x.activateAlerts(), { preventsLoad: o };
    },
    V = (e) => (t) => `${e}${t ? `-${t}` : ''}`,
    ee = (e) => (r, o, n) => {
      let s = e[r],
        { key: i, values: l } = s,
        a;
      if (!o) return `[${i}]`;
      let c = l == null ? void 0 : l[o];
      if (
        (typeof c == 'string' ? (a = c) : (a = c(n && 'instanceIndex' in n ? n.instanceIndex : void 0)),
        !(n == null ? void 0 : n.operator))
      )
        return `[${i}="${a}"]`;
      switch (n.operator) {
        case 'prefixed':
          return `[${i}^="${a}"]`;
        case 'suffixed':
          return `[${i}$="${a}"]`;
        case 'contains':
          return `[${i}*="${a}"]`;
      }
    };
  var Ve = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-animation@1.0.1/functions.js',
    Re = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmscore@1.0.5/cmscore.js',
    B = () =>
      S(void 0, null, function* () {
        let { fsAttributes: e } = window;
        if (e.animationImport) return e.animationImport;
        try {
          let t = import(Ve);
          return (e.animationImport = t), t;
        } catch (t) {
          x.alert(`${t}`, 'error');
          return;
        }
      }),
    P = () =>
      S(void 0, null, function* () {
        let { fsAttributes: e } = window;
        if ((e.cms || (e.cms = {}), e.cms.coreImport)) return e.cms.coreImport;
        try {
          let t = import(Re);
          return (e.cms.coreImport = t), t;
        } catch (t) {
          x.alert(`${t}`, 'error');
          return;
        }
      });
  var h = 'fs-cmsfilter',
    w = {
      element: {
        key: `${h}-element`,
        values: {
          list: V('list'),
          filters: V('filters'),
          empty: V('empty'),
          results: V('results-count'),
          reset: 'reset',
        },
      },
      field: { key: `${h}-field` },
      reset: { key: `${h}-reset` },
      match: { key: `${h}-match`, values: { any: 'any', all: 'all' } },
      range: { key: `${h}-range`, values: { from: 'from', to: 'to' } },
      type: { key: `${h}-type`, values: { date: 'date' } },
      showQuery: { key: `${h}-showquery`, values: { true: 'true' } },
      easing: { key: `${h}-easing` },
      duration: { key: `${h}-duration` },
      scrollTop: { key: `${h}-scrolltop`, values: { true: 'true' } },
    },
    T = ee(w),
    te = ['any', 'all'],
    re = { range: ['from', 'to'] },
    oe = 0.1;
  var fe = Te(se());
  var Be = Intl.DateTimeFormat(),
    H = (e) => new Date(Be.format(new Date(e)));
  var ie = (e, t) => t.every((r) => Pe(e, r)),
    Pe = (e, { filterKeys: t, values: r, match: o, mode: n }) => {
      let s = [...r].filter(k);
      return s.length
        ? [...t][o === 'all' ? 'every' : 'some']((i) => {
            if (n === 'range') {
              let l = e.props[i];
              if (!l) return !1;
              let { type: a, values: c } = l;
              if (!c.size) return !1;
              let [d] = c,
                [p, m] = s;
              return le(d, p, m, a);
            }
            return s[o === 'all' ? 'every' : 'some']((l) => {
              let a = e.props[i];
              if (!a) return !1;
              let { values: c, type: d, range: p } = a,
                m = [...c];
              if (!m.length) return !1;
              if (p === 'from' || p === 'to') {
                let [u, f] = m;
                return le(l, u, f, d);
              }
              return m.some((u) => {
                if (d === 'date') {
                  let [f, b] = [l, u].map((g) => H(g).getTime());
                  return f === b;
                }
                return m.length === 1 || t.size > 1
                  ? u.toLowerCase().includes(l.toLowerCase())
                  : l.toLowerCase() === u.toLowerCase();
              });
            });
          })
        : !0;
    },
    le = (e, t, r, o) => {
      if (o === 'date') {
        let [l, a, c] = [e, t, r].map(H);
        return t ? (r ? l >= a && l <= c : l >= a) : l <= c;
      }
      let [n, s, i] = [e, t, r].map(parseFloat);
      return t ? (r ? n >= s && n <= i : n >= s) : n <= i;
    },
    q = (e) => {
      for (let { elements: t, values: r } of e) {
        for (let { element: o } of t) $(o, ['input']);
        r.clear();
      }
    };
  var { location: ae, history: $e } = window,
    ce = (e) => {
      let t = !1,
        { filtersData: r } = e,
        o = new URL(ae.href),
        { searchParams: n } = o;
      for (let [s, i] of n) {
        let l = r.find(({ filterKeys: m }) => m.size === 1 && m.has(s));
        if (!l) continue;
        let a = I(i);
        if (!a.length) continue;
        t = !0;
        let { elements: c, mode: d, values: p } = l;
        if (d === 'range') {
          let [m, y] = a,
            u = c.find(({ mode: g, fixedValue: E }) => g === 'from' && (!E || E === m)),
            f = c.find(({ mode: g, fixedValue: E }) => g === 'to' && (!E || E === y)),
            b = [];
          if (m && u) {
            let { element: g, type: E } = u;
            E === 'checkbox' || E === 'radio' ? F(g, !0) : F(g, m), (b[0] = m);
          }
          if (y && f) {
            let { element: g, type: E } = f;
            E === 'checkbox' || E === 'radio' ? F(g, !0) : F(g, m), (b[1] = y);
          }
          b.length && (l.values = new Set(b));
          continue;
        }
        for (let m of a)
          for (let { element: y, fixedValue: u, type: f } of c) {
            if (u === m && (f === 'checkbox' || f === 'radio')) F(y, !0);
            else if (!u && f !== 'checkbox' && f !== 'radio') F(y, m);
            else continue;
            p.add(m);
          }
      }
      return t;
    },
    W = (e) => {
      let t = new URL(ae.href),
        { searchParams: r } = t;
      for (let [o] of r) r.delete(o);
      for (let {
        filterKeys: [o],
        values: n,
      } of e) {
        if (!n.size) continue;
        let s = [...n].join(',');
        t.searchParams.set(o, s);
      }
      $e.replaceState(null, '', t.toString());
    };
  var me = (e, t) => {
    let { value: r } = e,
      o = t.filter(({ elements: n }) => n.some((s) => s.element === e));
    if (!!o.length)
      for (let n of o) {
        let { elements: s, values: i, mode: l } = n,
          a = s.find((m) => m.element === e);
        if (!a) continue;
        let { fixedValue: c, mode: d, type: p } = a;
        switch (p) {
          case 'checkbox': {
            let { checked: m } = e;
            if (!c) break;
            i[m ? 'add' : 'delete'](c);
            break;
          }
          case 'radio': {
            let { checked: m } = e;
            if (!m || !c) break;
            i.clear(), i.add(c);
            break;
          }
          default: {
            if (l === 'range') {
              let m = [...i];
              (m[d === 'from' ? 0 : 1] = r), m.some((y) => !!y) ? (n.values = new Set(m)) : i.clear();
              break;
            } else i.clear(), r && i.add(r);
            break;
          }
        }
      }
  };
  var {
      field: { key: _e },
      reset: { key: Ke },
      range: { key: Ne },
      match: { key: He },
    } = w,
    { checkboxField: qe, radioField: We } = v,
    ue = (e) => {
      let t = e.querySelector('form'),
        r = e.querySelector('input[type="submit"]'),
        o = e.querySelectorAll(T('element', 'reset', { operator: 'prefixed' })),
        n = new Map();
      for (let s of o) {
        let i = s.getAttribute(Ke);
        n.set(s, i);
      }
      return { form: t, submitButton: r, resetButtonsData: n };
    },
    pe = (e) => {
      let t = [],
        r = e.querySelectorAll(T('field'));
      for (let o of r) {
        let n = o.getAttribute(_e);
        if (!n) continue;
        let s = new Set(I(n));
        if (!s.size) continue;
        let i = t.find((u) => {
            let f = [...s],
              b = [...u.filterKeys];
            return f.every((g) => b.includes(g)) && b.every((g) => f.includes(g));
          }),
          l = o.getAttribute(He),
          a = o.getAttribute(Ne),
          c = C(l, te) ? l : void 0,
          d,
          p;
        for (let [u, f] of _(re))
          if (C(a, f)) {
            (d = u), (p = a);
            break;
          }
        let m = { match: c, filterKeys: s, mode: d, values: new Set() },
          y = o.closest(`.${qe}, .${We}`);
        if (y) {
          let u = o instanceof HTMLInputElement,
            f = u ? o : y.querySelector('input'),
            b = { mode: p, element: f, type: f.type, fixedValue: u ? 'true' : o.textContent };
          i ? i.elements.push(b) : t.push(D(M({}, m), { elements: [b] }));
          continue;
        }
        if (L(o) && o.type !== 'submit') {
          let u = { mode: p, element: o, type: o.type };
          i ? i.elements.push(u) : t.push(D(M({}, m), { elements: [u] }));
        }
      }
      return t;
    };
  var {
      field: { key: Ue },
      range: { key: je },
      type: { key: Qe },
    } = w,
    U = class {
      constructor(t, r, o, { emptyElement: n, resultsElement: s, showQueryParams: i, scrollTop: l }) {
        this.formBlock = t;
        this.listInstance = r;
        this.cmsCore = o;
        this.filtersActive = !1;
        this.resultsCount = 0;
        this.emptyState = !1;
        let { form: a, submitButton: c, resetButtonsData: d } = ue(t);
        (this.form = a),
          (this.submitButton = c),
          (this.resetButtonsData = d),
          (this.emptyElement = n),
          (this.resultsElement = s),
          (this.showQueryParams = i),
          (this.scrollTop = l),
          (this.filtersData = pe(a)),
          this.init();
      }
      init() {
        return S(this, null, function* () {
          let {
            cmsCore: { collectItemsProps: t },
            listInstance: { items: r },
          } = this;
          t(r, { fieldKey: Ue, rangeKey: je, typeKey: Qe }),
            (this.resultsCount = r.filter(({ visible: n }) => n).length),
            this.updateResults(),
            ce(this) && this.applyFilters(),
            this.listenEvents();
        });
      }
      listenEvents() {
        return S(this, null, function* () {
          let { form: t, resetButtonsData: r } = this;
          t.addEventListener('submit', (o) => this.handleSubmit(o)),
            t.addEventListener(
              'input',
              (0, fe.default)((o) => this.handleInputEvents(o), 50)
            );
          for (let [o, n] of r) o == null || o.addEventListener('click', () => this.resetFilters(n));
        });
      }
      updateResults() {
        let { resultsElement: t, resultsCount: r } = this;
        t && (t.textContent = `${r}`);
      }
      handleInputEvents(r) {
        return S(this, arguments, function* ({ target: t }) {
          console.log('handling input event');
          let { filtersData: o, submitButton: n, showQueryParams: s } = this;
          !L(t) || (me(t, o), console.log(o), s && W(o), n || (yield this.applyFilters()));
        });
      }
      handleSubmit(t) {
        return S(this, null, function* () {
          console.log('handling submit event'),
            t.preventDefault(),
            t.stopImmediatePropagation(),
            yield this.applyFilters();
        });
      }
      setFiltersActive(t) {
        console.log('setting filters active: ', t), (this.filtersActive = t), (this.listInstance.showNewItems = !t);
      }
      applyFilters(t, r = !0) {
        return S(this, null, function* () {
          let {
              listInstance: o,
              filtersData: n,
              filtersActive: s,
              emptyElement: i,
              emptyState: l,
              scrollTop: a,
            } = this,
            c = n.every(({ values: u }) => !u.size);
          if (c && !s) return;
          this.setFiltersActive(!c);
          let { wrapper: d, list: p } = o;
          a && this.scrollToTop(), r && (yield o.displayList(!1));
          let m = [],
            y = [];
          for (let u of t || o.items) (c || ie(u, n) ? m : y).push(u);
          if ((console.log({ itemsToShow: m, itemsToHide: y }), i)) {
            let { length: u } = m;
            u && l
              ? (i.remove(), d.prepend(p), (this.emptyState = !1))
              : !t && !u && !l && (p.remove(), d.prepend(i), (this.emptyState = !0));
          }
          yield o.renderItems(y, !1, !r),
            yield o.renderItems(m, !0, !r),
            t ? (this.resultsCount += m.length) : (this.resultsCount = m.length),
            this.updateResults(),
            r && (yield o.displayList()),
            a && this.scrollToTop();
        });
      }
      resetFilters(t) {
        return S(this, null, function* () {
          let { filtersData: r, showQueryParams: o } = this;
          if (!t) q(r);
          else {
            let n = r.filter(({ filterKeys: s }) => s.has(t));
            q(n);
          }
          o && W(r), yield this.applyFilters();
        });
      }
      scrollToTop() {
        var t;
        (t = this.listInstance.wrapper.parentElement) == null || t.scrollIntoView({ behavior: 'smooth' });
      }
    };
  var {
      element: { key: ze },
      showQuery: { key: Ge, values: Xe },
      duration: { key: Je },
      easing: { key: Ye },
      scrollTop: { key: Ze, values: et },
      field: { key: tt },
      range: { key: rt },
      type: { key: ot },
    } = w,
    j = () =>
      S(void 0, null, function* () {
        let e = yield P();
        if (!e) return [];
        let r = N([T('element', 'list', { operator: 'prefixed' })])
            .map(e.createCMSListInstance)
            .filter(k),
          o = (yield Promise.all(r.map((n) => nt(n, e)))).filter(k);
        return console.log({ filtersInstances: o }), o;
      }),
    nt = (e, t) =>
      S(void 0, null, function* () {
        let r = e.getInstanceIndex(ze),
          o = document.querySelector(T('element', 'filters', { instanceIndex: r }));
        if (!o) return;
        let n = o.closest(`.${v.formBlock}`);
        if (!n) return;
        let s = document.querySelector(T('element', 'empty', { instanceIndex: r }));
        s == null || s.remove();
        let i = document.querySelector(T('element', 'results', { instanceIndex: r })),
          l = e.getAttribute(Ge) === Xe.true;
        e.listAnimation ||
          B().then((p) => {
            if (!p) return;
            let {
                animations: { fade: m },
                easings: y,
              } = p,
              u = e.getAttribute(Je),
              f = e.getAttribute(Ye);
            e.listAnimation = D(M({}, m), {
              options: { easing: C(f, y) ? f : void 0, duration: u ? parseFloat(u) / 200 : oe },
            });
          });
        let a = e.getAttribute(Ze) === et.true,
          c = new U(n, e, t, { emptyElement: s, resultsElement: i, showQueryParams: l, scrollTop: a }),
          d = (p) =>
            S(void 0, null, function* () {
              console.log('handling items', p),
                t.collectItemsProps(p, { fieldKey: tt, rangeKey: rt, typeKey: ot }),
                yield c.applyFilters(p, !1);
            });
        return (
          e.on('nestinitialitems', (p) =>
            S(void 0, null, function* () {
              console.log('nestinitialitems'), yield d(p);
            })
          ),
          e.on('additems', (p) =>
            S(void 0, null, function* () {
              console.log('additems'), yield d(p), c.filtersActive || ((c.resultsCount += p.length), c.updateResults());
            })
          ),
          c
        );
      });
  Y();
  var { currentScript: st } = document,
    { preventsLoad: it } = Z(st);
  P();
  B();
  it
    ? (window.fsAttributes.cmsfilter = { init: j })
    : (window.Webflow || (window.Webflow = []), window.Webflow.push(j));
})();
