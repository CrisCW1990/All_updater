import _a, { app as We, ipcMain as _e, shell as Cy, BrowserWindow as Ih, dialog as Nh } from "electron";
import ge from "path";
import { fileURLToPath as Dy } from "url";
import { fileURLToPath as Ah } from "node:url";
import { ChildProcess as jh, execFile as ky, spawnSync as My, spawn as Ly } from "node:child_process";
import { StringDecoder as Ch } from "node:string_decoder";
import { debuglog as qy, stripVTControlCharacters as Fy, inspect as Dh, promisify as ye, callbackify as Ht, aborted as Uy, isDeepStrictEqual as $c } from "node:util";
import te, { platform as Vy, hrtime as kh, execPath as zy, execArgv as xy } from "node:process";
import Mh from "node:tty";
import Z from "node:path";
import Lh from "child_process";
import lt from "fs";
import { setTimeout as qh, scheduler as Fh, setImmediate as Gy } from "node:timers/promises";
import ba, { constants as Pt } from "node:os";
import { once as Oe, addAbortListener as Uh, EventEmitter as By, on as Rs, setMaxListeners as Wy } from "node:events";
import { serialize as Ky } from "node:v8";
import ee, { statSync as Hy, readFileSync as ra, appendFileSync as Jy, writeFileSync as Xy, createWriteStream as _c, createReadStream as bc } from "node:fs";
import { Transform as Yy, getDefaultHighWaterMark as hs, Duplex as Sa, Writable as Ea, Readable as Rt, PassThrough as Vh } from "node:stream";
import { Buffer as Ra } from "node:buffer";
import { finished as dt } from "node:stream/promises";
import Qt from "node:crypto";
import Sc from "node:assert";
import Ps from "os";
import Qy from "util";
import zh from "events";
import Zy from "http";
import eg from "https";
function je(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const t = Object.getPrototypeOf(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
const Pa = (e, t) => {
  const r = Gh(tg(e));
  if (typeof r != "string")
    throw new TypeError(`${t} must be a string or a file URL: ${r}.`);
  return r;
}, tg = (e) => xh(e) ? e.toString() : e, xh = (e) => typeof e != "string" && e && Object.getPrototypeOf(e) === String.prototype, Gh = (e) => e instanceof URL ? Ah(e) : e, Bh = (e, t = [], r = {}) => {
  const n = Pa(e, "First argument"), [s, o] = je(t) ? [[], t] : [t, r];
  if (!Array.isArray(s))
    throw new TypeError(`Second argument must be either an array of arguments or an options object: ${s}`);
  if (s.some((c) => typeof c == "object" && c !== null))
    throw new TypeError(`Second argument must be an array of strings: ${s}`);
  const i = s.map(String), a = i.find((c) => c.includes("\0"));
  if (a !== void 0)
    throw new TypeError(`Arguments cannot contain null bytes ("\\0"): ${a}`);
  if (!je(o))
    throw new TypeError(`Last argument must be an options object: ${o}`);
  return [n, i, o];
}, { toString: Wh } = Object.prototype, rg = (e) => Wh.call(e) === "[object ArrayBuffer]", Le = (e) => Wh.call(e) === "[object Uint8Array]", cr = (e) => new Uint8Array(e.buffer, e.byteOffset, e.byteLength), ng = new TextEncoder(), Kh = (e) => ng.encode(e), sg = new TextDecoder(), Hh = (e) => sg.decode(e), og = (e, t) => ig(e, t).join(""), ig = (e, t) => {
  if (t === "utf8" && e.every((o) => typeof o == "string"))
    return e;
  const r = new Ch(t), n = e.map((o) => typeof o == "string" ? Kh(o) : o).map((o) => r.write(o)), s = r.end();
  return s === "" ? n : [...n, s];
}, Oa = (e) => e.length === 1 && Le(e[0]) ? e[0] : Jh(ag(e)), ag = (e) => e.map((t) => typeof t == "string" ? Kh(t) : t), Jh = (e) => {
  const t = new Uint8Array(cg(e));
  let r = 0;
  for (const n of e)
    t.set(n, r), r += n.length;
  return t;
}, cg = (e) => {
  let t = 0;
  for (const r of e)
    t += r.length;
  return t;
}, ug = (e) => Array.isArray(e) && Array.isArray(e.raw), lg = (e, t) => {
  let r = [];
  for (const [o, i] of e.entries())
    r = dg({
      templates: e,
      expressions: t,
      tokens: r,
      index: o,
      template: i
    });
  if (r.length === 0)
    throw new TypeError("Template script must not be empty");
  const [n, ...s] = r;
  return [n, s, {}];
}, dg = ({ templates: e, expressions: t, tokens: r, index: n, template: s }) => {
  if (s === void 0)
    throw new TypeError(`Invalid backslash sequence: ${e.raw[n]}`);
  const { nextTokens: o, leadingWhitespaces: i, trailingWhitespaces: a } = fg(s, e.raw[n]), c = Rc(r, o, i);
  if (n === t.length)
    return c;
  const l = t[n], u = Array.isArray(l) ? l.map((p) => Pc(p)) : [Pc(l)];
  return Rc(c, u, a);
}, fg = (e, t) => {
  if (t.length === 0)
    return { nextTokens: [], leadingWhitespaces: !1, trailingWhitespaces: !1 };
  const r = [];
  let n = 0;
  const s = Ec.has(t[0]);
  for (let i = 0, a = 0; i < e.length; i += 1, a += 1) {
    const c = t[a];
    if (Ec.has(c))
      n !== i && r.push(e.slice(n, i)), n = i + 1;
    else if (c === "\\") {
      const l = t[a + 1];
      l === `
` ? (i -= 1, a += 1) : l === "u" && t[a + 2] === "{" ? a = t.indexOf("}", a + 3) : a += hg[l] ?? 1;
    }
  }
  const o = n === e.length;
  return o || r.push(e.slice(n)), { nextTokens: r, leadingWhitespaces: s, trailingWhitespaces: o };
}, Ec = /* @__PURE__ */ new Set([" ", "	", "\r", `
`]), hg = { x: 3, u: 5 }, Rc = (e, t, r) => r || e.length === 0 || t.length === 0 ? [...e, ...t] : [
  ...e.slice(0, -1),
  `${e.at(-1)}${t[0]}`,
  ...t.slice(1)
], Pc = (e) => {
  const t = typeof e;
  if (t === "string")
    return e;
  if (t === "number")
    return String(e);
  if (je(e) && ("stdout" in e || "isMaxBuffer" in e))
    return pg(e);
  throw e instanceof jh || Object.prototype.toString.call(e) === "[object Promise]" ? new TypeError("Unexpected subprocess in template expression. Please use ${await subprocess} instead of ${subprocess}.") : new TypeError(`Unexpected "${t}" in template expression`);
}, pg = ({ stdout: e }) => {
  if (typeof e == "string")
    return e;
  if (Le(e))
    return Hh(e);
  throw e === void 0 ? new TypeError(`Missing result.stdout in template expression. This is probably due to the previous subprocess' "stdout" option.`) : new TypeError(`Unexpected "${typeof e}" stdout in template expression`);
}, Ot = (e) => Ta.includes(e), Ta = [te.stdin, te.stdout, te.stderr], Ke = ["stdin", "stdout", "stderr"], Xh = (e) => Ke[e] ?? `stdio[${e}]`, mg = (e) => {
  const t = { ...e };
  for (const r of Zh)
    t[r] = Yh(e, r);
  return t;
}, Yh = (e, t) => {
  const r = Array.from({ length: yg(e) + 1 }), n = gg(e[t], r, t);
  return bg(n, t);
}, yg = ({ stdio: e }) => Array.isArray(e) ? Math.max(e.length, Ke.length) : Ke.length, gg = (e, t, r) => je(e) ? vg(e, t, r) : t.fill(e), vg = (e, t, r) => {
  for (const n of Object.keys(e).sort(wg))
    for (const s of $g(n, r, t))
      t[s] = e[n];
  return t;
}, wg = (e, t) => Oc(e) < Oc(t) ? 1 : -1, Oc = (e) => e === "stdout" || e === "stderr" ? 0 : e === "all" ? 2 : 1, $g = (e, t, r) => {
  if (e === "ipc")
    return [r.length - 1];
  const n = Qh(e);
  if (n === void 0 || n === 0)
    throw new TypeError(`"${t}.${e}" is invalid.
It must be "${t}.stdout", "${t}.stderr", "${t}.all", "${t}.ipc", or "${t}.fd3", "${t}.fd4" (and so on).`);
  if (n >= r.length)
    throw new TypeError(`"${t}.${e}" is invalid: that file descriptor does not exist.
Please set the "stdio" option to ensure that file descriptor exists.`);
  return n === "all" ? [1, 2] : [n];
}, Qh = (e) => {
  if (e === "all")
    return e;
  if (Ke.includes(e))
    return Ke.indexOf(e);
  const t = _g.exec(e);
  if (t !== null)
    return Number(t[1]);
}, _g = /^fd(\d+)$/, bg = (e, t) => e.map((r) => r === void 0 ? Eg[t] : r), Sg = qy("execa").enabled ? "full" : "none", Eg = {
  lines: !1,
  buffer: !0,
  maxBuffer: 1e3 * 1e3 * 100,
  verbose: Sg,
  stripFinalNewline: !0
}, Zh = ["lines", "buffer", "maxBuffer", "verbose", "stripFinalNewline"], ur = (e, t) => t === "ipc" ? e.at(-1) : e[t], Ia = ({ verbose: e }, t) => Aa(e, t) !== "none", Na = ({ verbose: e }, t) => !["none", "short"].includes(Aa(e, t)), Rg = ({ verbose: e }, t) => {
  const r = Aa(e, t);
  return ja(r) ? r : void 0;
}, Aa = (e, t) => t === void 0 ? Pg(e) : ur(e, t), Pg = (e) => e.find((t) => ja(t)) ?? na.findLast((t) => e.includes(t)), ja = (e) => typeof e == "function", na = ["none", "short", "full"], Og = (e, t) => {
  const r = [e, ...t], n = r.join(" "), s = r.map((o) => Cg(ep(o))).join(" ");
  return { command: n, escapedCommand: s };
}, Ca = (e) => Fy(e).split(`
`).map((t) => ep(t)).join(`
`), ep = (e) => e.replaceAll(Ng, (t) => Tg(t)), Tg = (e) => {
  const t = Ag[e];
  if (t !== void 0)
    return t;
  const r = e.codePointAt(0), n = r.toString(16);
  return r <= jg ? `\\u${n.padStart(4, "0")}` : `\\U${n}`;
}, Ig = () => {
  try {
    return new RegExp("\\p{Separator}|\\p{Other}", "gu");
  } catch {
    return /[\s\u0000-\u001F\u007F-\u009F\u00AD]/g;
  }
}, Ng = Ig(), Ag = {
  " ": " ",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t"
}, jg = 65535, Cg = (e) => Dg.test(e) ? e : Vy === "win32" ? `"${e.replaceAll('"', '""')}"` : `'${e.replaceAll("'", "'\\''")}'`, Dg = /^[\w./-]+$/;
function kg() {
  const { env: e } = te, { TERM: t, TERM_PROGRAM: r } = e;
  return te.platform !== "win32" ? t !== "linux" : !!e.WT_SESSION || !!e.TERMINUS_SUBLIME || e.ConEmuTask === "{cmd::Cmder}" || r === "Terminus-Sublime" || r === "vscode" || t === "xterm-256color" || t === "alacritty" || t === "rxvt-unicode" || t === "rxvt-unicode-256color" || e.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
const tp = {
  circleQuestionMark: "(?)",
  questionMarkPrefix: "(?)",
  square: "█",
  squareDarkShade: "▓",
  squareMediumShade: "▒",
  squareLightShade: "░",
  squareTop: "▀",
  squareBottom: "▄",
  squareLeft: "▌",
  squareRight: "▐",
  squareCenter: "■",
  bullet: "●",
  dot: "․",
  ellipsis: "…",
  pointerSmall: "›",
  triangleUp: "▲",
  triangleUpSmall: "▴",
  triangleDown: "▼",
  triangleDownSmall: "▾",
  triangleLeftSmall: "◂",
  triangleRightSmall: "▸",
  home: "⌂",
  heart: "♥",
  musicNote: "♪",
  musicNoteBeamed: "♫",
  arrowUp: "↑",
  arrowDown: "↓",
  arrowLeft: "←",
  arrowRight: "→",
  arrowLeftRight: "↔",
  arrowUpDown: "↕",
  almostEqual: "≈",
  notEqual: "≠",
  lessOrEqual: "≤",
  greaterOrEqual: "≥",
  identical: "≡",
  infinity: "∞",
  subscriptZero: "₀",
  subscriptOne: "₁",
  subscriptTwo: "₂",
  subscriptThree: "₃",
  subscriptFour: "₄",
  subscriptFive: "₅",
  subscriptSix: "₆",
  subscriptSeven: "₇",
  subscriptEight: "₈",
  subscriptNine: "₉",
  oneHalf: "½",
  oneThird: "⅓",
  oneQuarter: "¼",
  oneFifth: "⅕",
  oneSixth: "⅙",
  oneEighth: "⅛",
  twoThirds: "⅔",
  twoFifths: "⅖",
  threeQuarters: "¾",
  threeFifths: "⅗",
  threeEighths: "⅜",
  fourFifths: "⅘",
  fiveSixths: "⅚",
  fiveEighths: "⅝",
  sevenEighths: "⅞",
  line: "─",
  lineBold: "━",
  lineDouble: "═",
  lineDashed0: "┄",
  lineDashed1: "┅",
  lineDashed2: "┈",
  lineDashed3: "┉",
  lineDashed4: "╌",
  lineDashed5: "╍",
  lineDashed6: "╴",
  lineDashed7: "╶",
  lineDashed8: "╸",
  lineDashed9: "╺",
  lineDashed10: "╼",
  lineDashed11: "╾",
  lineDashed12: "−",
  lineDashed13: "–",
  lineDashed14: "‐",
  lineDashed15: "⁃",
  lineVertical: "│",
  lineVerticalBold: "┃",
  lineVerticalDouble: "║",
  lineVerticalDashed0: "┆",
  lineVerticalDashed1: "┇",
  lineVerticalDashed2: "┊",
  lineVerticalDashed3: "┋",
  lineVerticalDashed4: "╎",
  lineVerticalDashed5: "╏",
  lineVerticalDashed6: "╵",
  lineVerticalDashed7: "╷",
  lineVerticalDashed8: "╹",
  lineVerticalDashed9: "╻",
  lineVerticalDashed10: "╽",
  lineVerticalDashed11: "╿",
  lineDownLeft: "┐",
  lineDownLeftArc: "╮",
  lineDownBoldLeftBold: "┓",
  lineDownBoldLeft: "┒",
  lineDownLeftBold: "┑",
  lineDownDoubleLeftDouble: "╗",
  lineDownDoubleLeft: "╖",
  lineDownLeftDouble: "╕",
  lineDownRight: "┌",
  lineDownRightArc: "╭",
  lineDownBoldRightBold: "┏",
  lineDownBoldRight: "┎",
  lineDownRightBold: "┍",
  lineDownDoubleRightDouble: "╔",
  lineDownDoubleRight: "╓",
  lineDownRightDouble: "╒",
  lineUpLeft: "┘",
  lineUpLeftArc: "╯",
  lineUpBoldLeftBold: "┛",
  lineUpBoldLeft: "┚",
  lineUpLeftBold: "┙",
  lineUpDoubleLeftDouble: "╝",
  lineUpDoubleLeft: "╜",
  lineUpLeftDouble: "╛",
  lineUpRight: "└",
  lineUpRightArc: "╰",
  lineUpBoldRightBold: "┗",
  lineUpBoldRight: "┖",
  lineUpRightBold: "┕",
  lineUpDoubleRightDouble: "╚",
  lineUpDoubleRight: "╙",
  lineUpRightDouble: "╘",
  lineUpDownLeft: "┤",
  lineUpBoldDownBoldLeftBold: "┫",
  lineUpBoldDownBoldLeft: "┨",
  lineUpDownLeftBold: "┥",
  lineUpBoldDownLeftBold: "┩",
  lineUpDownBoldLeftBold: "┪",
  lineUpDownBoldLeft: "┧",
  lineUpBoldDownLeft: "┦",
  lineUpDoubleDownDoubleLeftDouble: "╣",
  lineUpDoubleDownDoubleLeft: "╢",
  lineUpDownLeftDouble: "╡",
  lineUpDownRight: "├",
  lineUpBoldDownBoldRightBold: "┣",
  lineUpBoldDownBoldRight: "┠",
  lineUpDownRightBold: "┝",
  lineUpBoldDownRightBold: "┡",
  lineUpDownBoldRightBold: "┢",
  lineUpDownBoldRight: "┟",
  lineUpBoldDownRight: "┞",
  lineUpDoubleDownDoubleRightDouble: "╠",
  lineUpDoubleDownDoubleRight: "╟",
  lineUpDownRightDouble: "╞",
  lineDownLeftRight: "┬",
  lineDownBoldLeftBoldRightBold: "┳",
  lineDownLeftBoldRightBold: "┯",
  lineDownBoldLeftRight: "┰",
  lineDownBoldLeftBoldRight: "┱",
  lineDownBoldLeftRightBold: "┲",
  lineDownLeftRightBold: "┮",
  lineDownLeftBoldRight: "┭",
  lineDownDoubleLeftDoubleRightDouble: "╦",
  lineDownDoubleLeftRight: "╥",
  lineDownLeftDoubleRightDouble: "╤",
  lineUpLeftRight: "┴",
  lineUpBoldLeftBoldRightBold: "┻",
  lineUpLeftBoldRightBold: "┷",
  lineUpBoldLeftRight: "┸",
  lineUpBoldLeftBoldRight: "┹",
  lineUpBoldLeftRightBold: "┺",
  lineUpLeftRightBold: "┶",
  lineUpLeftBoldRight: "┵",
  lineUpDoubleLeftDoubleRightDouble: "╩",
  lineUpDoubleLeftRight: "╨",
  lineUpLeftDoubleRightDouble: "╧",
  lineUpDownLeftRight: "┼",
  lineUpBoldDownBoldLeftBoldRightBold: "╋",
  lineUpDownBoldLeftBoldRightBold: "╈",
  lineUpBoldDownLeftBoldRightBold: "╇",
  lineUpBoldDownBoldLeftRightBold: "╊",
  lineUpBoldDownBoldLeftBoldRight: "╉",
  lineUpBoldDownLeftRight: "╀",
  lineUpDownBoldLeftRight: "╁",
  lineUpDownLeftBoldRight: "┽",
  lineUpDownLeftRightBold: "┾",
  lineUpBoldDownBoldLeftRight: "╂",
  lineUpDownLeftBoldRightBold: "┿",
  lineUpBoldDownLeftBoldRight: "╃",
  lineUpBoldDownLeftRightBold: "╄",
  lineUpDownBoldLeftBoldRight: "╅",
  lineUpDownBoldLeftRightBold: "╆",
  lineUpDoubleDownDoubleLeftDoubleRightDouble: "╬",
  lineUpDoubleDownDoubleLeftRight: "╫",
  lineUpDownLeftDoubleRightDouble: "╪",
  lineCross: "╳",
  lineBackslash: "╲",
  lineSlash: "╱"
}, Mg = {
  tick: "✔",
  info: "ℹ",
  warning: "⚠",
  cross: "✘",
  squareSmall: "◻",
  squareSmallFilled: "◼",
  circle: "◯",
  circleFilled: "◉",
  circleDotted: "◌",
  circleDouble: "◎",
  circleCircle: "ⓞ",
  circleCross: "ⓧ",
  circlePipe: "Ⓘ",
  radioOn: "◉",
  radioOff: "◯",
  checkboxOn: "☒",
  checkboxOff: "☐",
  checkboxCircleOn: "ⓧ",
  checkboxCircleOff: "Ⓘ",
  pointer: "❯",
  triangleUpOutline: "△",
  triangleLeft: "◀",
  triangleRight: "▶",
  lozenge: "◆",
  lozengeOutline: "◇",
  hamburger: "☰",
  smiley: "㋡",
  mustache: "෴",
  star: "★",
  play: "▶",
  nodejs: "⬢",
  oneSeventh: "⅐",
  oneNinth: "⅑",
  oneTenth: "⅒"
}, Lg = {
  tick: "√",
  info: "i",
  warning: "‼",
  cross: "×",
  squareSmall: "□",
  squareSmallFilled: "■",
  circle: "( )",
  circleFilled: "(*)",
  circleDotted: "( )",
  circleDouble: "( )",
  circleCircle: "(○)",
  circleCross: "(×)",
  circlePipe: "(│)",
  radioOn: "(*)",
  radioOff: "( )",
  checkboxOn: "[×]",
  checkboxOff: "[ ]",
  checkboxCircleOn: "(×)",
  checkboxCircleOff: "( )",
  pointer: ">",
  triangleUpOutline: "∆",
  triangleLeft: "◄",
  triangleRight: "►",
  lozenge: "♦",
  lozengeOutline: "◊",
  hamburger: "≡",
  smiley: "☺",
  mustache: "┌─┐",
  star: "✶",
  play: "►",
  nodejs: "♦",
  oneSeventh: "1/7",
  oneNinth: "1/9",
  oneTenth: "1/10"
}, qg = { ...tp, ...Mg }, Fg = { ...tp, ...Lg }, Ug = kg(), Zs = Ug ? qg : Fg, Vg = Mh?.WriteStream?.prototype?.hasColors?.() ?? !1, Os = (e, t) => {
  if (!Vg)
    return (s) => s;
  const r = `\x1B[${e}m`, n = `\x1B[${t}m`;
  return (s) => {
    const o = s + "";
    let i = o.indexOf(n);
    if (i === -1)
      return r + o + n;
    let a = r, c = 0;
    const u = (t === 22 ? n : "") + r;
    for (; i !== -1; )
      a += o.slice(c, i) + u, c = i + n.length, i = o.indexOf(n, c);
    return a += o.slice(c) + n, a;
  };
}, zg = Os(1, 22), sa = Os(90, 39), xg = Os(91, 39), Gg = Os(93, 39), Bg = ({
  type: e,
  message: t,
  timestamp: r,
  piped: n,
  commandId: s,
  result: { failed: o = !1 } = {},
  options: { reject: i = !0 }
}) => {
  const a = Wg(r), c = Kg[e]({ failed: o, reject: i, piped: n }), l = Hg[e]({ reject: i });
  return `${sa(`[${a}]`)} ${sa(`[${s}]`)} ${l(c)} ${l(t)}`;
}, Wg = (e) => `${yr(e.getHours(), 2)}:${yr(e.getMinutes(), 2)}:${yr(e.getSeconds(), 2)}.${yr(e.getMilliseconds(), 3)}`, yr = (e, t) => String(e).padStart(t, "0"), Tc = ({ failed: e, reject: t }) => e ? t ? Zs.cross : Zs.warning : Zs.tick, Kg = {
  command: ({ piped: e }) => e ? "|" : "$",
  output: () => " ",
  ipc: () => "*",
  error: Tc,
  duration: Tc
}, Ic = (e) => e, Hg = {
  command: () => zg,
  output: () => Ic,
  ipc: () => Ic,
  error: ({ reject: e }) => e ? xg : Gg,
  duration: () => sa
}, Jg = (e, t, r) => {
  const n = Rg(t, r);
  return e.map(({ verboseLine: s, verboseObject: o }) => Xg(s, o, n)).filter((s) => s !== void 0).map((s) => Yg(s)).join("");
}, Xg = (e, t, r) => {
  if (r === void 0)
    return e;
  const n = r(e, t);
  if (typeof n == "string")
    return n;
}, Yg = (e) => e.endsWith(`
`) ? e : `${e}
`, lr = ({ type: e, verboseMessage: t, fdNumber: r, verboseInfo: n, result: s }) => {
  const o = Qg({ type: e, result: s, verboseInfo: n }), i = Zg(t, o), a = Jg(i, n, r);
  a !== "" && console.warn(a.slice(0, -1));
}, Qg = ({
  type: e,
  result: t,
  verboseInfo: { escapedCommand: r, commandId: n, rawOptions: { piped: s = !1, ...o } }
}) => ({
  type: e,
  escapedCommand: r,
  commandId: `${n}`,
  timestamp: /* @__PURE__ */ new Date(),
  piped: s,
  result: t,
  options: o
}), Zg = (e, t) => e.split(`
`).map((r) => ev({ ...t, message: r })), ev = (e) => ({ verboseLine: Bg(e), verboseObject: e }), rp = (e) => {
  const t = typeof e == "string" ? e : Dh(e);
  return Ca(t).replaceAll("	", " ".repeat(tv));
}, tv = 2, rv = (e, t) => {
  Ia(t) && lr({
    type: "command",
    verboseMessage: e,
    verboseInfo: t
  });
}, nv = (e, t, r) => {
  iv(e);
  const n = sv(e);
  return {
    verbose: e,
    escapedCommand: t,
    commandId: n,
    rawOptions: r
  };
}, sv = (e) => Ia({ verbose: e }) ? ov++ : void 0;
let ov = 0n;
const iv = (e) => {
  for (const t of e) {
    if (t === !1)
      throw new TypeError(`The "verbose: false" option was renamed to "verbose: 'none'".`);
    if (t === !0)
      throw new TypeError(`The "verbose: true" option was renamed to "verbose: 'short'".`);
    if (!na.includes(t) && !ja(t)) {
      const r = na.map((n) => `'${n}'`).join(", ");
      throw new TypeError(`The "verbose" option must not be ${t}. Allowed values are: ${r} or a function.`);
    }
  }
}, np = () => kh.bigint(), sp = (e) => Number(kh.bigint() - e) / 1e6, op = (e, t, r) => {
  const n = np(), { command: s, escapedCommand: o } = Og(e, t), i = Yh(r, "verbose"), a = nv(i, o, { ...r });
  return rv(o, a), {
    command: s,
    escapedCommand: o,
    startTime: n,
    verboseInfo: a
  };
};
var av = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ts(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var gt = { exports: {} }, eo, Nc;
function cv() {
  if (Nc) return eo;
  Nc = 1, eo = n, n.sync = s;
  var e = lt;
  function t(o, i) {
    var a = i.pathExt !== void 0 ? i.pathExt : process.env.PATHEXT;
    if (!a || (a = a.split(";"), a.indexOf("") !== -1))
      return !0;
    for (var c = 0; c < a.length; c++) {
      var l = a[c].toLowerCase();
      if (l && o.substr(-l.length).toLowerCase() === l)
        return !0;
    }
    return !1;
  }
  function r(o, i, a) {
    return !o.isSymbolicLink() && !o.isFile() ? !1 : t(i, a);
  }
  function n(o, i, a) {
    e.stat(o, function(c, l) {
      a(c, c ? !1 : r(l, o, i));
    });
  }
  function s(o, i) {
    return r(e.statSync(o), o, i);
  }
  return eo;
}
var to, Ac;
function uv() {
  if (Ac) return to;
  Ac = 1, to = t, t.sync = r;
  var e = lt;
  function t(o, i, a) {
    e.stat(o, function(c, l) {
      a(c, c ? !1 : n(l, i));
    });
  }
  function r(o, i) {
    return n(e.statSync(o), i);
  }
  function n(o, i) {
    return o.isFile() && s(o, i);
  }
  function s(o, i) {
    var a = o.mode, c = o.uid, l = o.gid, u = i.uid !== void 0 ? i.uid : process.getuid && process.getuid(), p = i.gid !== void 0 ? i.gid : process.getgid && process.getgid(), h = parseInt("100", 8), m = parseInt("010", 8), b = parseInt("001", 8), _ = h | m, f = a & b || a & m && l === p || a & h && c === u || a & _ && u === 0;
    return f;
  }
  return to;
}
var ro, jc;
function lv() {
  if (jc) return ro;
  jc = 1;
  var e;
  process.platform === "win32" || av.TESTING_WINDOWS ? e = cv() : e = uv(), ro = t, t.sync = r;
  function t(n, s, o) {
    if (typeof s == "function" && (o = s, s = {}), !o) {
      if (typeof Promise != "function")
        throw new TypeError("callback not provided");
      return new Promise(function(i, a) {
        t(n, s || {}, function(c, l) {
          c ? a(c) : i(l);
        });
      });
    }
    e(n, s || {}, function(i, a) {
      i && (i.code === "EACCES" || s && s.ignoreErrors) && (i = null, a = !1), o(i, a);
    });
  }
  function r(n, s) {
    try {
      return e.sync(n, s || {});
    } catch (o) {
      if (s && s.ignoreErrors || o.code === "EACCES")
        return !1;
      throw o;
    }
  }
  return ro;
}
var no, Cc;
function dv() {
  if (Cc) return no;
  Cc = 1;
  const e = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys", t = ge, r = e ? ";" : ":", n = lv(), s = (c) => Object.assign(new Error(`not found: ${c}`), { code: "ENOENT" }), o = (c, l) => {
    const u = l.colon || r, p = c.match(/\//) || e && c.match(/\\/) ? [""] : [
      // windows always checks the cwd first
      ...e ? [process.cwd()] : [],
      ...(l.path || process.env.PATH || /* istanbul ignore next: very unusual */
      "").split(u)
    ], h = e ? l.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "", m = e ? h.split(u) : [""];
    return e && c.indexOf(".") !== -1 && m[0] !== "" && m.unshift(""), {
      pathEnv: p,
      pathExt: m,
      pathExtExe: h
    };
  }, i = (c, l, u) => {
    typeof l == "function" && (u = l, l = {}), l || (l = {});
    const { pathEnv: p, pathExt: h, pathExtExe: m } = o(c, l), b = [], _ = (y) => new Promise((d, v) => {
      if (y === p.length)
        return l.all && b.length ? d(b) : v(s(c));
      const S = p[y], g = /^".*"$/.test(S) ? S.slice(1, -1) : S, $ = t.join(g, c), E = !g && /^\.[\\\/]/.test(c) ? c.slice(0, 2) + $ : $;
      d(f(E, y, 0));
    }), f = (y, d, v) => new Promise((S, g) => {
      if (v === h.length)
        return S(_(d + 1));
      const $ = h[v];
      n(y + $, { pathExt: m }, (E, I) => {
        if (!E && I)
          if (l.all)
            b.push(y + $);
          else
            return S(y + $);
        return S(f(y, d, v + 1));
      });
    });
    return u ? _(0).then((y) => u(null, y), u) : _(0);
  }, a = (c, l) => {
    l = l || {};
    const { pathEnv: u, pathExt: p, pathExtExe: h } = o(c, l), m = [];
    for (let b = 0; b < u.length; b++) {
      const _ = u[b], f = /^".*"$/.test(_) ? _.slice(1, -1) : _, y = t.join(f, c), d = !f && /^\.[\\\/]/.test(c) ? c.slice(0, 2) + y : y;
      for (let v = 0; v < p.length; v++) {
        const S = d + p[v];
        try {
          if (n.sync(S, { pathExt: h }))
            if (l.all)
              m.push(S);
            else
              return S;
        } catch {
        }
      }
    }
    if (l.all && m.length)
      return m;
    if (l.nothrow)
      return null;
    throw s(c);
  };
  return no = i, i.sync = a, no;
}
var gr = { exports: {} }, Dc;
function fv() {
  if (Dc) return gr.exports;
  Dc = 1;
  const e = (t = {}) => {
    const r = t.env || process.env;
    return (t.platform || process.platform) !== "win32" ? "PATH" : Object.keys(r).reverse().find((s) => s.toUpperCase() === "PATH") || "Path";
  };
  return gr.exports = e, gr.exports.default = e, gr.exports;
}
var so, kc;
function hv() {
  if (kc) return so;
  kc = 1;
  const e = ge, t = dv(), r = fv();
  function n(o, i) {
    const a = o.options.env || process.env, c = process.cwd(), l = o.options.cwd != null, u = l && process.chdir !== void 0 && !process.chdir.disabled;
    if (u)
      try {
        process.chdir(o.options.cwd);
      } catch {
      }
    let p;
    try {
      p = t.sync(o.command, {
        path: a[r({ env: a })],
        pathExt: i ? e.delimiter : void 0
      });
    } catch {
    } finally {
      u && process.chdir(c);
    }
    return p && (p = e.resolve(l ? o.options.cwd : "", p)), p;
  }
  function s(o) {
    return n(o) || n(o, !0);
  }
  return so = s, so;
}
var vr = {}, Mc;
function pv() {
  if (Mc) return vr;
  Mc = 1;
  const e = /([()\][%!^"`<>&|;, *?])/g;
  function t(n) {
    return n = n.replace(e, "^$1"), n;
  }
  function r(n, s) {
    return n = `${n}`, n = n.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"'), n = n.replace(/(?=(\\+?)?)\1$/, "$1$1"), n = `"${n}"`, n = n.replace(e, "^$1"), s && (n = n.replace(e, "^$1")), n;
  }
  return vr.command = t, vr.argument = r, vr;
}
var oo, Lc;
function mv() {
  return Lc || (Lc = 1, oo = /^#!(.*)/), oo;
}
var io, qc;
function yv() {
  if (qc) return io;
  qc = 1;
  const e = mv();
  return io = (t = "") => {
    const r = t.match(e);
    if (!r)
      return null;
    const [n, s] = r[0].replace(/#! ?/, "").split(" "), o = n.split("/").pop();
    return o === "env" ? s : s ? `${o} ${s}` : o;
  }, io;
}
var ao, Fc;
function gv() {
  if (Fc) return ao;
  Fc = 1;
  const e = lt, t = yv();
  function r(n) {
    const o = Buffer.alloc(150);
    let i;
    try {
      i = e.openSync(n, "r"), e.readSync(i, o, 0, 150, 0), e.closeSync(i);
    } catch {
    }
    return t(o.toString());
  }
  return ao = r, ao;
}
var co, Uc;
function vv() {
  if (Uc) return co;
  Uc = 1;
  const e = ge, t = hv(), r = pv(), n = gv(), s = process.platform === "win32", o = /\.(?:com|exe)$/i, i = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
  function a(u) {
    u.file = t(u);
    const p = u.file && n(u.file);
    return p ? (u.args.unshift(u.file), u.command = p, t(u)) : u.file;
  }
  function c(u) {
    if (!s)
      return u;
    const p = a(u), h = !o.test(p);
    if (u.options.forceShell || h) {
      const m = i.test(p);
      u.command = e.normalize(u.command), u.command = r.command(u.command), u.args = u.args.map((_) => r.argument(_, m));
      const b = [u.command].concat(u.args).join(" ");
      u.args = ["/d", "/s", "/c", `"${b}"`], u.command = process.env.comspec || "cmd.exe", u.options.windowsVerbatimArguments = !0;
    }
    return u;
  }
  function l(u, p, h) {
    p && !Array.isArray(p) && (h = p, p = null), p = p ? p.slice(0) : [], h = Object.assign({}, h);
    const m = {
      command: u,
      args: p,
      options: h,
      file: void 0,
      original: {
        command: u,
        args: p
      }
    };
    return h.shell ? m : c(m);
  }
  return co = l, co;
}
var uo, Vc;
function wv() {
  if (Vc) return uo;
  Vc = 1;
  const e = process.platform === "win32";
  function t(o, i) {
    return Object.assign(new Error(`${i} ${o.command} ENOENT`), {
      code: "ENOENT",
      errno: "ENOENT",
      syscall: `${i} ${o.command}`,
      path: o.command,
      spawnargs: o.args
    });
  }
  function r(o, i) {
    if (!e)
      return;
    const a = o.emit;
    o.emit = function(c, l) {
      if (c === "exit") {
        const u = n(l, i);
        if (u)
          return a.call(o, "error", u);
      }
      return a.apply(o, arguments);
    };
  }
  function n(o, i) {
    return e && o === 1 && !i.file ? t(i.original, "spawn") : null;
  }
  function s(o, i) {
    return e && o === 1 && !i.file ? t(i.original, "spawnSync") : null;
  }
  return uo = {
    hookChildProcess: r,
    verifyENOENT: n,
    verifyENOENTSync: s,
    notFoundError: t
  }, uo;
}
var zc;
function $v() {
  if (zc) return gt.exports;
  zc = 1;
  const e = Lh, t = vv(), r = wv();
  function n(o, i, a) {
    const c = t(o, i, a), l = e.spawn(c.command, c.args, c.options);
    return r.hookChildProcess(l, c), l;
  }
  function s(o, i, a) {
    const c = t(o, i, a), l = e.spawnSync(c.command, c.args, c.options);
    return l.error = l.error || r.verifyENOENTSync(l.status, c), l;
  }
  return gt.exports = n, gt.exports.spawn = n, gt.exports.sync = s, gt.exports._parse = t, gt.exports._enoent = r, gt.exports;
}
var _v = $v();
const bv = /* @__PURE__ */ Ts(_v);
function ip(e = {}) {
  const {
    env: t = process.env,
    platform: r = process.platform
  } = e;
  return r !== "win32" ? "PATH" : Object.keys(t).reverse().find((n) => n.toUpperCase() === "PATH") || "Path";
}
ye(ky);
function Da(e) {
  return e instanceof URL ? Ah(e) : e;
}
function Sv(e) {
  return {
    *[Symbol.iterator]() {
      let t = Z.resolve(Da(e)), r;
      for (; r !== t; )
        yield t, r = t, t = Z.resolve(t, "..");
    }
  };
}
const Ev = ({
  cwd: e = te.cwd(),
  path: t = te.env[ip()],
  preferLocal: r = !0,
  execPath: n = te.execPath,
  addExecPath: s = !0
} = {}) => {
  const o = Z.resolve(Da(e)), i = [], a = t.split(Z.delimiter);
  return r && Rv(i, a, o), s && Pv(i, a, n, o), t === "" || t === Z.delimiter ? `${i.join(Z.delimiter)}${t}` : [...i, t].join(Z.delimiter);
}, Rv = (e, t, r) => {
  for (const n of Sv(r)) {
    const s = Z.join(n, "node_modules/.bin");
    t.includes(s) || e.push(s);
  }
}, Pv = (e, t, r, n) => {
  const s = Z.resolve(n, Da(r), "..");
  t.includes(s) || e.push(s);
}, Ov = ({ env: e = te.env, ...t } = {}) => {
  e = { ...e };
  const r = ip({ env: e });
  return t.path = e[r], e[r] = Ev(t), e;
}, Tv = (e, t, r) => {
  const n = r ? ms : ps, s = e instanceof dr ? {} : { cause: e };
  return new n(t, s);
};
class dr extends Error {
}
const ap = (e, t) => {
  Object.defineProperty(e.prototype, "name", {
    value: t,
    writable: !0,
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, cp, {
    value: !0,
    writable: !1,
    enumerable: !1,
    configurable: !1
  });
}, Iv = (e) => oa(e) && cp in e, cp = /* @__PURE__ */ Symbol("isExecaError"), oa = (e) => Object.prototype.toString.call(e) === "[object Error]";
class ps extends Error {
}
ap(ps, ps.name);
class ms extends Error {
}
ap(ms, ms.name);
const Nv = () => {
  const e = lp - up + 1;
  return Array.from({ length: e }, Av);
}, Av = (e, t) => ({
  name: `SIGRT${t + 1}`,
  number: up + t,
  action: "terminate",
  description: "Application-specific signal (realtime)",
  standard: "posix"
}), up = 34, lp = 64, jv = [
  {
    name: "SIGHUP",
    number: 1,
    action: "terminate",
    description: "Terminal closed",
    standard: "posix"
  },
  {
    name: "SIGINT",
    number: 2,
    action: "terminate",
    description: "User interruption with CTRL-C",
    standard: "ansi"
  },
  {
    name: "SIGQUIT",
    number: 3,
    action: "core",
    description: "User interruption with CTRL-\\",
    standard: "posix"
  },
  {
    name: "SIGILL",
    number: 4,
    action: "core",
    description: "Invalid machine instruction",
    standard: "ansi"
  },
  {
    name: "SIGTRAP",
    number: 5,
    action: "core",
    description: "Debugger breakpoint",
    standard: "posix"
  },
  {
    name: "SIGABRT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "ansi"
  },
  {
    name: "SIGIOT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "bsd"
  },
  {
    name: "SIGBUS",
    number: 7,
    action: "core",
    description: "Bus error due to misaligned, non-existing address or paging error",
    standard: "bsd"
  },
  {
    name: "SIGEMT",
    number: 7,
    action: "terminate",
    description: "Command should be emulated but is not implemented",
    standard: "other"
  },
  {
    name: "SIGFPE",
    number: 8,
    action: "core",
    description: "Floating point arithmetic error",
    standard: "ansi"
  },
  {
    name: "SIGKILL",
    number: 9,
    action: "terminate",
    description: "Forced termination",
    standard: "posix",
    forced: !0
  },
  {
    name: "SIGUSR1",
    number: 10,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGSEGV",
    number: 11,
    action: "core",
    description: "Segmentation fault",
    standard: "ansi"
  },
  {
    name: "SIGUSR2",
    number: 12,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGPIPE",
    number: 13,
    action: "terminate",
    description: "Broken pipe or socket",
    standard: "posix"
  },
  {
    name: "SIGALRM",
    number: 14,
    action: "terminate",
    description: "Timeout or timer",
    standard: "posix"
  },
  {
    name: "SIGTERM",
    number: 15,
    action: "terminate",
    description: "Termination",
    standard: "ansi"
  },
  {
    name: "SIGSTKFLT",
    number: 16,
    action: "terminate",
    description: "Stack is empty or overflowed",
    standard: "other"
  },
  {
    name: "SIGCHLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "posix"
  },
  {
    name: "SIGCLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "other"
  },
  {
    name: "SIGCONT",
    number: 18,
    action: "unpause",
    description: "Unpaused",
    standard: "posix",
    forced: !0
  },
  {
    name: "SIGSTOP",
    number: 19,
    action: "pause",
    description: "Paused",
    standard: "posix",
    forced: !0
  },
  {
    name: "SIGTSTP",
    number: 20,
    action: "pause",
    description: 'Paused using CTRL-Z or "suspend"',
    standard: "posix"
  },
  {
    name: "SIGTTIN",
    number: 21,
    action: "pause",
    description: "Background process cannot read terminal input",
    standard: "posix"
  },
  {
    name: "SIGBREAK",
    number: 21,
    action: "terminate",
    description: "User interruption with CTRL-BREAK",
    standard: "other"
  },
  {
    name: "SIGTTOU",
    number: 22,
    action: "pause",
    description: "Background process cannot write to terminal output",
    standard: "posix"
  },
  {
    name: "SIGURG",
    number: 23,
    action: "ignore",
    description: "Socket received out-of-band data",
    standard: "bsd"
  },
  {
    name: "SIGXCPU",
    number: 24,
    action: "core",
    description: "Process timed out",
    standard: "bsd"
  },
  {
    name: "SIGXFSZ",
    number: 25,
    action: "core",
    description: "File too big",
    standard: "bsd"
  },
  {
    name: "SIGVTALRM",
    number: 26,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGPROF",
    number: 27,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGWINCH",
    number: 28,
    action: "ignore",
    description: "Terminal window size changed",
    standard: "bsd"
  },
  {
    name: "SIGIO",
    number: 29,
    action: "terminate",
    description: "I/O is available",
    standard: "other"
  },
  {
    name: "SIGPOLL",
    number: 29,
    action: "terminate",
    description: "Watched event",
    standard: "other"
  },
  {
    name: "SIGINFO",
    number: 29,
    action: "ignore",
    description: "Request for process information",
    standard: "other"
  },
  {
    name: "SIGPWR",
    number: 30,
    action: "terminate",
    description: "Device running out of power",
    standard: "systemv"
  },
  {
    name: "SIGSYS",
    number: 31,
    action: "core",
    description: "Invalid system call",
    standard: "other"
  },
  {
    name: "SIGUNUSED",
    number: 31,
    action: "terminate",
    description: "Invalid system call",
    standard: "other"
  }
], dp = () => {
  const e = Nv();
  return [...jv, ...e].map(Cv);
}, Cv = ({
  name: e,
  number: t,
  description: r,
  action: n,
  forced: s = !1,
  standard: o
}) => {
  const {
    signals: { [e]: i }
  } = Pt, a = i !== void 0;
  return { name: e, number: a ? i : t, description: r, supported: a, action: n, forced: s, standard: o };
}, Dv = () => {
  const e = dp();
  return Object.fromEntries(e.map(kv));
}, kv = ({
  name: e,
  number: t,
  description: r,
  supported: n,
  action: s,
  forced: o,
  standard: i
}) => [e, { name: e, number: t, description: r, supported: n, action: s, forced: o, standard: i }], Mv = Dv(), Lv = () => {
  const e = dp(), t = lp + 1, r = Array.from(
    { length: t },
    (n, s) => qv(s, e)
  );
  return Object.assign({}, ...r);
}, qv = (e, t) => {
  const r = Fv(e, t);
  if (r === void 0)
    return {};
  const { name: n, description: s, supported: o, action: i, forced: a, standard: c } = r;
  return {
    [e]: {
      name: n,
      number: e,
      description: s,
      supported: o,
      action: i,
      forced: a,
      standard: c
    }
  };
}, Fv = (e, t) => {
  const r = t.find(({ name: n }) => Pt.signals[n] === e);
  return r !== void 0 ? r : t.find((n) => n.number === e);
};
Lv();
const Uv = (e) => {
  const t = "option `killSignal`";
  if (e === 0)
    throw new TypeError(`Invalid ${t}: 0 cannot be used.`);
  return fp(e, t);
}, Vv = (e) => e === 0 ? e : fp(e, "`subprocess.kill()`'s argument"), fp = (e, t) => {
  if (Number.isInteger(e))
    return zv(e, t);
  if (typeof e == "string")
    return Gv(e, t);
  throw new TypeError(`Invalid ${t} ${String(e)}: it must be a string or an integer.
${ka()}`);
}, zv = (e, t) => {
  if (xc.has(e))
    return xc.get(e);
  throw new TypeError(`Invalid ${t} ${e}: this signal integer does not exist.
${ka()}`);
}, xv = () => new Map(Object.entries(Pt.signals).reverse().map(([e, t]) => [t, e])), xc = xv(), Gv = (e, t) => {
  if (e in Pt.signals)
    return e;
  throw e.toUpperCase() in Pt.signals ? new TypeError(`Invalid ${t} '${e}': please rename it to '${e.toUpperCase()}'.`) : new TypeError(`Invalid ${t} '${e}': this signal name does not exist.
${ka()}`);
}, ka = () => `Available signal names: ${Bv()}.
Available signal numbers: ${Wv()}.`, Bv = () => Object.keys(Pt.signals).sort().map((e) => `'${e}'`).join(", "), Wv = () => [...new Set(Object.values(Pt.signals).sort((e, t) => e - t))].join(", "), hp = (e) => Mv[e].description, Kv = (e) => {
  if (e === !1)
    return e;
  if (e === !0)
    return Hv;
  if (!Number.isFinite(e) || e < 0)
    throw new TypeError(`Expected the \`forceKillAfterDelay\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);
  return e;
}, Hv = 1e3 * 5, Jv = ({ kill: e, options: { forceKillAfterDelay: t, killSignal: r }, onInternalError: n, context: s, controller: o }, i, a) => {
  const { signal: c, error: l } = Xv(i, a, r);
  Yv(l, n);
  const u = e(c);
  return Qv({
    kill: e,
    signal: c,
    forceKillAfterDelay: t,
    killSignal: r,
    killResult: u,
    context: s,
    controller: o
  }), u;
}, Xv = (e, t, r) => {
  const [n = r, s] = oa(e) ? [void 0, e] : [e, t];
  if (typeof n != "string" && !Number.isInteger(n))
    throw new TypeError(`The first argument must be an error instance or a signal name string/integer: ${String(n)}`);
  if (s !== void 0 && !oa(s))
    throw new TypeError(`The second argument is optional. If specified, it must be an error instance: ${s}`);
  return { signal: Vv(n), error: s };
}, Yv = (e, t) => {
  e !== void 0 && t.reject(e);
}, Qv = async ({ kill: e, signal: t, forceKillAfterDelay: r, killSignal: n, killResult: s, context: o, controller: i }) => {
  t === n && s && pp({
    kill: e,
    forceKillAfterDelay: r,
    context: o,
    controllerSignal: i.signal
  });
}, pp = async ({ kill: e, forceKillAfterDelay: t, context: r, controllerSignal: n }) => {
  if (t !== !1)
    try {
      await qh(t, void 0, { signal: n }), e("SIGKILL") && (r.isForcefullyTerminated ??= !0);
    } catch {
    }
}, mp = async (e, t) => {
  e.aborted || await Oe(e, "abort", { signal: t });
}, Zv = ({ cancelSignal: e }) => {
  if (e !== void 0 && Object.prototype.toString.call(e) !== "[object AbortSignal]")
    throw new Error(`The \`cancelSignal\` option must be an AbortSignal: ${String(e)}`);
}, e0 = ({ subprocess: e, cancelSignal: t, gracefulCancel: r, context: n, controller: s }) => t === void 0 || r ? [] : [t0(e, t, n, s)], t0 = async (e, t, r, { signal: n }) => {
  throw await mp(t, n), r.terminationReason ??= "cancel", e.kill(), t.reason;
}, Ma = ({ methodName: e, isSubprocess: t, ipc: r, isConnected: n }) => {
  r0(e, t, r), yp(e, t, n);
}, r0 = (e, t, r) => {
  if (!r)
    throw new Error(`${Me(e, t)} can only be used if the \`ipc\` option is \`true\`.`);
}, yp = (e, t, r) => {
  if (!r)
    throw new Error(`${Me(e, t)} cannot be used: the ${ft(t)} has already exited or disconnected.`);
}, n0 = (e) => {
  throw new Error(`${Me("getOneMessage", e)} could not complete: the ${ft(e)} exited or disconnected.`);
}, s0 = (e) => {
  throw new Error(`${Me("sendMessage", e)} failed: the ${ft(e)} is sending a message too, instead of listening to incoming messages.
This can be fixed by both sending a message and listening to incoming messages at the same time:

const [receivedMessage] = await Promise.all([
	${Me("getOneMessage", e)},
	${Me("sendMessage", e, "message, {strict: true}")},
]);`);
}, gp = (e, t) => new Error(`${Me("sendMessage", t)} failed when sending an acknowledgment response to the ${ft(t)}.`, { cause: e }), o0 = (e) => {
  throw new Error(`${Me("sendMessage", e)} failed: the ${ft(e)} is not listening to incoming messages.`);
}, i0 = (e) => {
  throw new Error(`${Me("sendMessage", e)} failed: the ${ft(e)} exited without listening to incoming messages.`);
}, a0 = () => new Error(`\`cancelSignal\` aborted: the ${ft(!0)} disconnected.`), c0 = () => {
  throw new Error("`getCancelSignal()` cannot be used without setting the `cancelSignal` subprocess option.");
}, u0 = ({ error: e, methodName: t, isSubprocess: r }) => {
  if (e.code === "EPIPE")
    throw new Error(`${Me(t, r)} cannot be used: the ${ft(r)} is disconnecting.`, { cause: e });
}, l0 = ({ error: e, methodName: t, isSubprocess: r, message: n }) => {
  if (d0(e))
    throw new Error(`${Me(t, r)}'s argument type is invalid: the message cannot be serialized: ${String(n)}.`, { cause: e });
}, d0 = ({ code: e, message: t }) => f0.has(e) || h0.some((r) => t.includes(r)), f0 = /* @__PURE__ */ new Set([
  // Message is `undefined`
  "ERR_MISSING_ARGS",
  // Message is a function, a bigint, a symbol
  "ERR_INVALID_ARG_TYPE"
]), h0 = [
  // Message is a promise or a proxy, with `serialization: 'advanced'`
  "could not be cloned",
  // Message has cycles, with `serialization: 'json'`
  "circular structure",
  // Message has cycles inside toJSON(), with `serialization: 'json'`
  "call stack size exceeded"
], Me = (e, t, r = "") => e === "cancelSignal" ? "`cancelSignal`'s `controller.abort()`" : `${p0(t)}${e}(${r})`, p0 = (e) => e ? "" : "subprocess.", ft = (e) => e ? "parent process" : "subprocess", La = (e) => {
  e.connected && e.disconnect();
}, fr = () => {
  const e = {}, t = new Promise((r, n) => {
    Object.assign(e, { resolve: r, reject: n });
  });
  return Object.assign(t, e);
}, vp = (e, t = "stdin") => {
  const { options: n, fileDescriptors: s } = Tt.get(e), o = wp(s, t, !0), i = e.stdio[o];
  if (i === null)
    throw new TypeError($p(o, t, n, !0));
  return i;
}, qa = (e, t = "stdout") => {
  const { options: n, fileDescriptors: s } = Tt.get(e), o = wp(s, t, !1), i = o === "all" ? e.all : e.stdio[o];
  if (i == null)
    throw new TypeError($p(o, t, n, !1));
  return i;
}, Tt = /* @__PURE__ */ new WeakMap(), wp = (e, t, r) => {
  const n = m0(t, r);
  return y0(n, t, r, e), n;
}, m0 = (e, t) => {
  const r = Qh(e);
  if (r !== void 0)
    return r;
  const { validOptions: n, defaultValue: s } = t ? { validOptions: '"stdin"', defaultValue: "stdin" } : { validOptions: '"stdout", "stderr", "all"', defaultValue: "stdout" };
  throw new TypeError(`"${ir(t)}" must not be "${e}".
It must be ${n} or "fd3", "fd4" (and so on).
It is optional and defaults to "${s}".`);
}, y0 = (e, t, r, n) => {
  const s = n[_p(e)];
  if (s === void 0)
    throw new TypeError(`"${ir(r)}" must not be ${t}. That file descriptor does not exist.
Please set the "stdio" option to ensure that file descriptor exists.`);
  if (s.direction === "input" && !r)
    throw new TypeError(`"${ir(r)}" must not be ${t}. It must be a readable stream, not writable.`);
  if (s.direction !== "input" && r)
    throw new TypeError(`"${ir(r)}" must not be ${t}. It must be a writable stream, not readable.`);
}, $p = (e, t, r, n) => {
  if (e === "all" && !r.all)
    return `The "all" option must be true to use "from: 'all'".`;
  const { optionName: s, optionValue: o } = g0(e, r);
  return `The "${s}: ${ia(o)}" option is incompatible with using "${ir(n)}: ${ia(t)}".
Please set this option with "pipe" instead.`;
}, g0 = (e, { stdin: t, stdout: r, stderr: n, stdio: s }) => {
  const o = _p(e);
  return o === 0 && t !== void 0 ? { optionName: "stdin", optionValue: t } : o === 1 && r !== void 0 ? { optionName: "stdout", optionValue: r } : o === 2 && n !== void 0 ? { optionName: "stderr", optionValue: n } : { optionName: `stdio[${o}]`, optionValue: s[o] };
}, _p = (e) => e === "all" ? 1 : e, ir = (e) => e ? "to" : "from", ia = (e) => typeof e == "string" ? `'${e}'` : typeof e == "number" ? `${e}` : "Stream", ys = (e, t, r) => {
  const n = e.getMaxListeners();
  n === 0 || n === Number.POSITIVE_INFINITY || (e.setMaxListeners(n + t), Uh(r, () => {
    e.setMaxListeners(e.getMaxListeners() - t);
  }));
}, bp = (e, t) => {
  t && aa(e);
}, aa = (e) => {
  e.refCounted();
}, Sp = (e, t) => {
  t && ca(e);
}, ca = (e) => {
  e.unrefCounted();
}, v0 = (e, t) => {
  t && (ca(e), ca(e));
}, w0 = (e, t) => {
  t && (aa(e), aa(e));
}, $0 = async ({ anyProcess: e, channel: t, isSubprocess: r, ipcEmitter: n }, s) => {
  if (O0(s) || F0(s))
    return;
  cs.has(e) || cs.set(e, []);
  const o = cs.get(e);
  if (o.push(s), !(o.length > 1))
    for (; o.length > 0; ) {
      await j0(e, n, s), await Fh.yield();
      const i = await P0({
        wrappedMessage: o[0],
        anyProcess: e,
        channel: t,
        isSubprocess: r,
        ipcEmitter: n
      });
      o.shift(), n.emit("message", i), n.emit("message:done");
    }
}, _0 = async ({ anyProcess: e, channel: t, isSubprocess: r, ipcEmitter: n, boundOnMessage: s }) => {
  Ip();
  const o = cs.get(e);
  for (; o?.length > 0; )
    await Oe(n, "message:done");
  e.removeListener("message", s), w0(t, r), n.connected = !1, n.emit("disconnect");
}, cs = /* @__PURE__ */ new WeakMap(), Is = (e, t, r) => {
  if (us.has(e))
    return us.get(e);
  const n = new By();
  return n.connected = !0, us.set(e, n), b0({
    ipcEmitter: n,
    anyProcess: e,
    channel: t,
    isSubprocess: r
  }), n;
}, us = /* @__PURE__ */ new WeakMap(), b0 = ({ ipcEmitter: e, anyProcess: t, channel: r, isSubprocess: n }) => {
  const s = $0.bind(void 0, {
    anyProcess: t,
    channel: r,
    isSubprocess: n,
    ipcEmitter: e
  });
  t.on("message", s), t.once("disconnect", _0.bind(void 0, {
    anyProcess: t,
    channel: r,
    isSubprocess: n,
    ipcEmitter: e,
    boundOnMessage: s
  })), v0(r, n);
}, Ep = (e) => {
  const t = us.get(e);
  return t === void 0 ? e.channel !== null : t.connected;
}, S0 = ({ anyProcess: e, channel: t, isSubprocess: r, message: n, strict: s }) => {
  if (!s)
    return n;
  const o = Is(e, t, r), i = Fa(e, o);
  return {
    id: E0++,
    type: Ns,
    message: n,
    hasListeners: i
  };
};
let E0 = 0n;
const R0 = (e, t) => {
  if (!(t?.type !== Ns || t.hasListeners))
    for (const { id: r } of e)
      r !== void 0 && gs[r].resolve({ isDeadlock: !0, hasListeners: !1 });
}, P0 = async ({ wrappedMessage: e, anyProcess: t, channel: r, isSubprocess: n, ipcEmitter: s }) => {
  if (e?.type !== Ns || !t.connected)
    return e;
  const { id: o, message: i } = e, a = { id: o, type: Rp, message: Fa(t, s) };
  try {
    await Pp({
      anyProcess: t,
      channel: r,
      isSubprocess: n,
      ipc: !0
    }, a);
  } catch (c) {
    s.emit("strict:error", c);
  }
  return i;
}, O0 = (e) => {
  if (e?.type !== Rp)
    return !1;
  const { id: t, message: r } = e;
  return gs[t]?.resolve({ isDeadlock: !1, hasListeners: r }), !0;
}, T0 = async (e, t, r) => {
  if (e?.type !== Ns)
    return;
  const n = fr();
  gs[e.id] = n;
  const s = new AbortController();
  try {
    const { isDeadlock: o, hasListeners: i } = await Promise.race([
      n,
      I0(t, r, s)
    ]);
    o && s0(r), i || o0(r);
  } finally {
    s.abort(), delete gs[e.id];
  }
}, gs = {}, I0 = async (e, t, { signal: r }) => {
  ys(e, 1, r), await Oe(e, "disconnect", { signal: r }), i0(t);
}, Ns = "execa:ipc:request", Rp = "execa:ipc:response", N0 = (e, t, r) => {
  ar.has(e) || ar.set(e, /* @__PURE__ */ new Set());
  const n = ar.get(e), s = fr(), o = r ? t.id : void 0, i = { onMessageSent: s, id: o };
  return n.add(i), { outgoingMessages: n, outgoingMessage: i };
}, A0 = ({ outgoingMessages: e, outgoingMessage: t }) => {
  e.delete(t), t.onMessageSent.resolve();
}, j0 = async (e, t, r) => {
  for (; !Fa(e, t) && ar.get(e)?.size > 0; ) {
    const n = [...ar.get(e)];
    R0(n, r), await Promise.all(n.map(({ onMessageSent: s }) => s));
  }
}, ar = /* @__PURE__ */ new WeakMap(), Fa = (e, t) => t.listenerCount("message") > C0(e), C0 = (e) => Tt.has(e) && !ur(Tt.get(e).options.buffer, "ipc") ? 1 : 0, Pp = ({ anyProcess: e, channel: t, isSubprocess: r, ipc: n }, s, { strict: o = !1 } = {}) => {
  const i = "sendMessage";
  return Ma({
    methodName: i,
    isSubprocess: r,
    ipc: n,
    isConnected: e.connected
  }), D0({
    anyProcess: e,
    channel: t,
    methodName: i,
    isSubprocess: r,
    message: s,
    strict: o
  });
}, D0 = async ({ anyProcess: e, channel: t, methodName: r, isSubprocess: n, message: s, strict: o }) => {
  const i = S0({
    anyProcess: e,
    channel: t,
    isSubprocess: n,
    message: s,
    strict: o
  }), a = N0(e, i, o);
  try {
    await Op({
      anyProcess: e,
      methodName: r,
      isSubprocess: n,
      wrappedMessage: i,
      message: s
    });
  } catch (c) {
    throw La(e), c;
  } finally {
    A0(a);
  }
}, Op = async ({ anyProcess: e, methodName: t, isSubprocess: r, wrappedMessage: n, message: s }) => {
  const o = k0(e);
  try {
    await Promise.all([
      T0(n, e, r),
      o(n)
    ]);
  } catch (i) {
    throw u0({ error: i, methodName: t, isSubprocess: r }), l0({
      error: i,
      methodName: t,
      isSubprocess: r,
      message: s
    }), i;
  }
}, k0 = (e) => {
  if (lo.has(e))
    return lo.get(e);
  const t = ye(e.send.bind(e));
  return lo.set(e, t), t;
}, lo = /* @__PURE__ */ new WeakMap(), M0 = (e, t) => {
  const r = "cancelSignal";
  return yp(r, !1, e.connected), Op({
    anyProcess: e,
    methodName: r,
    isSubprocess: !1,
    wrappedMessage: { type: Tp, message: t },
    message: t
  });
}, L0 = async ({ anyProcess: e, channel: t, isSubprocess: r, ipc: n }) => (await q0({
  anyProcess: e,
  channel: t,
  isSubprocess: r,
  ipc: n
}), Ua.signal), q0 = async ({ anyProcess: e, channel: t, isSubprocess: r, ipc: n }) => {
  if (!Gc) {
    if (Gc = !0, !n) {
      c0();
      return;
    }
    if (t === null) {
      Ip();
      return;
    }
    Is(e, t, r), await Fh.yield();
  }
};
let Gc = !1;
const F0 = (e) => e?.type !== Tp ? !1 : (Ua.abort(e.message), !0), Tp = "execa:ipc:cancel", Ip = () => {
  Ua.abort(a0());
}, Ua = new AbortController(), U0 = ({ gracefulCancel: e, cancelSignal: t, ipc: r, serialization: n }) => {
  if (e) {
    if (t === void 0)
      throw new Error("The `cancelSignal` option must be defined when setting the `gracefulCancel` option.");
    if (!r)
      throw new Error("The `ipc` option cannot be false when setting the `gracefulCancel` option.");
    if (n === "json")
      throw new Error("The `serialization` option cannot be 'json' when setting the `gracefulCancel` option.");
  }
}, V0 = ({
  subprocess: e,
  cancelSignal: t,
  gracefulCancel: r,
  forceKillAfterDelay: n,
  context: s,
  controller: o
}) => r ? [z0({
  subprocess: e,
  cancelSignal: t,
  forceKillAfterDelay: n,
  context: s,
  controller: o
})] : [], z0 = async ({ subprocess: e, cancelSignal: t, forceKillAfterDelay: r, context: n, controller: { signal: s } }) => {
  await mp(t, s);
  const o = x0(t);
  throw await M0(e, o), pp({
    kill: e.kill,
    forceKillAfterDelay: r,
    context: n,
    controllerSignal: s
  }), n.terminationReason ??= "gracefulCancel", t.reason;
}, x0 = ({ reason: e }) => {
  if (!(e instanceof DOMException))
    return e;
  const t = new Error(e.message);
  return Object.defineProperty(t, "stack", {
    value: e.stack,
    enumerable: !1,
    configurable: !0,
    writable: !0
  }), t;
}, G0 = ({ timeout: e }) => {
  if (e !== void 0 && (!Number.isFinite(e) || e < 0))
    throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);
}, B0 = (e, t, r, n) => t === 0 || t === void 0 ? [] : [W0(e, t, r, n)], W0 = async (e, t, r, { signal: n }) => {
  throw await qh(t, void 0, { signal: n }), r.terminationReason ??= "timeout", e.kill(), new dr();
}, K0 = ({ options: e }) => {
  if (e.node === !1)
    throw new TypeError('The "node" option cannot be false with `execaNode()`.');
  return { options: { ...e, node: !0 } };
}, H0 = (e, t, {
  node: r = !1,
  nodePath: n = zy,
  nodeOptions: s = xy.filter((c) => !c.startsWith("--inspect")),
  cwd: o,
  execPath: i,
  ...a
}) => {
  if (i !== void 0)
    throw new TypeError('The "execPath" option has been removed. Please use the "nodePath" option instead.');
  const c = Pa(n, 'The "nodePath" option'), l = Z.resolve(o, c), u = {
    ...a,
    nodePath: l,
    node: r,
    cwd: o
  };
  if (!r)
    return [e, t, u];
  if (Z.basename(e, ".exe") === "node")
    throw new TypeError('When the "node" option is true, the first argument does not need to be "node".');
  return [
    l,
    [...s, e, ...t],
    { ipc: !0, ...u, shell: !1 }
  ];
}, J0 = ({ ipcInput: e, ipc: t, serialization: r }) => {
  if (e !== void 0) {
    if (!t)
      throw new Error("The `ipcInput` option cannot be set unless the `ipc` option is `true`.");
    Q0[r](e);
  }
}, X0 = (e) => {
  try {
    Ky(e);
  } catch (t) {
    throw new Error("The `ipcInput` option is not serializable with a structured clone.", { cause: t });
  }
}, Y0 = (e) => {
  try {
    JSON.stringify(e);
  } catch (t) {
    throw new Error("The `ipcInput` option is not serializable with JSON.", { cause: t });
  }
}, Q0 = {
  advanced: X0,
  json: Y0
}, Z0 = async (e, t) => {
  t !== void 0 && await e.sendMessage(t);
}, ew = ({ encoding: e }) => {
  if (ua.has(e))
    return;
  const t = rw(e);
  if (t !== void 0)
    throw new TypeError(`Invalid option \`encoding: ${wr(e)}\`.
Please rename it to ${wr(t)}.`);
  const r = [...ua].map((n) => wr(n)).join(", ");
  throw new TypeError(`Invalid option \`encoding: ${wr(e)}\`.
Please rename it to one of: ${r}.`);
}, tw = /* @__PURE__ */ new Set(["utf8", "utf16le"]), At = /* @__PURE__ */ new Set(["buffer", "hex", "base64", "base64url", "latin1", "ascii"]), ua = /* @__PURE__ */ new Set([...tw, ...At]), rw = (e) => {
  if (e === null)
    return "buffer";
  if (typeof e != "string")
    return;
  const t = e.toLowerCase();
  if (t in Bc)
    return Bc[t];
  if (ua.has(t))
    return t;
}, Bc = {
  // eslint-disable-next-line unicorn/text-encoding-identifier-case
  "utf-8": "utf8",
  "utf-16le": "utf16le",
  "ucs-2": "utf16le",
  ucs2: "utf16le",
  binary: "latin1"
}, wr = (e) => typeof e == "string" ? `"${e}"` : String(e), nw = (e = Np()) => {
  const t = Pa(e, 'The "cwd" option');
  return Z.resolve(t);
}, Np = () => {
  try {
    return te.cwd();
  } catch (e) {
    throw e.message = `The current directory does not exist.
${e.message}`, e;
  }
}, sw = (e, t) => {
  if (t === Np())
    return e;
  let r;
  try {
    r = Hy(t);
  } catch (n) {
    return `The "cwd" option is invalid: ${t}.
${n.message}
${e}`;
  }
  return r.isDirectory() ? e : `The "cwd" option is not a directory: ${t}.
${e}`;
}, Ap = (e, t, r) => {
  r.cwd = nw(r.cwd);
  const [n, s, o] = H0(e, t, r), { command: i, args: a, options: c } = bv._parse(n, s, o), l = mg(c), u = ow(l);
  return G0(u), ew(u), J0(u), Zv(u), U0(u), u.shell = Gh(u.shell), u.env = iw(u), u.killSignal = Uv(u.killSignal), u.forceKillAfterDelay = Kv(u.forceKillAfterDelay), u.lines = u.lines.map((p, h) => p && !At.has(u.encoding) && u.buffer[h]), te.platform === "win32" && Z.basename(i, ".exe") === "cmd" && a.unshift("/q"), { file: i, commandArguments: a, options: u };
}, ow = ({
  extendEnv: e = !0,
  preferLocal: t = !1,
  cwd: r,
  localDir: n = r,
  encoding: s = "utf8",
  reject: o = !0,
  cleanup: i = !0,
  all: a = !1,
  windowsHide: c = !0,
  killSignal: l = "SIGTERM",
  forceKillAfterDelay: u = !0,
  gracefulCancel: p = !1,
  ipcInput: h,
  ipc: m = h !== void 0 || p,
  serialization: b = "advanced",
  ..._
}) => ({
  ..._,
  extendEnv: e,
  preferLocal: t,
  cwd: r,
  localDirectory: n,
  encoding: s,
  reject: o,
  cleanup: i,
  all: a,
  windowsHide: c,
  killSignal: l,
  forceKillAfterDelay: u,
  gracefulCancel: p,
  ipcInput: h,
  ipc: m,
  serialization: b
}), iw = ({ env: e, extendEnv: t, preferLocal: r, node: n, localDirectory: s, nodePath: o }) => {
  const i = t ? { ...te.env, ...e } : e;
  return r || n ? Ov({
    env: i,
    cwd: s,
    execPath: o,
    preferLocal: r,
    addExecPath: n
  }) : i;
}, jp = (e, t, r) => r.shell && t.length > 0 ? [[e, ...t].join(" "), [], r] : [e, t, r];
function Va(e) {
  if (typeof e == "string")
    return aw(e);
  if (!(ArrayBuffer.isView(e) && e.BYTES_PER_ELEMENT === 1))
    throw new Error("Input must be a string or a Uint8Array");
  return cw(e);
}
const aw = (e) => e.at(-1) === Cp ? e.slice(0, e.at(-2) === Dp ? -2 : -1) : e, cw = (e) => e.at(-1) === uw ? e.subarray(0, e.at(-2) === lw ? -2 : -1) : e, Cp = `
`, uw = Cp.codePointAt(0), Dp = "\r", lw = Dp.codePointAt(0);
function jt(e, { checkOpen: t = !0 } = {}) {
  return e !== null && typeof e == "object" && (e.writable || e.readable || !t || e.writable === void 0 && e.readable === void 0) && typeof e.pipe == "function";
}
function kp(e, { checkOpen: t = !0 } = {}) {
  return jt(e, { checkOpen: t }) && (e.writable || !t) && typeof e.write == "function" && typeof e.end == "function" && typeof e.writable == "boolean" && typeof e.writableObjectMode == "boolean" && typeof e.destroy == "function" && typeof e.destroyed == "boolean";
}
function As(e, { checkOpen: t = !0 } = {}) {
  return jt(e, { checkOpen: t }) && (e.readable || !t) && typeof e.read == "function" && typeof e.readable == "boolean" && typeof e.readableObjectMode == "boolean" && typeof e.destroy == "function" && typeof e.destroyed == "boolean";
}
function Mp(e, t) {
  return kp(e, t) && As(e, t);
}
const dw = Object.getPrototypeOf(
  Object.getPrototypeOf(
    /* istanbul ignore next */
    async function* () {
    }
  ).prototype
);
class fw {
  #r;
  #n;
  #e = !1;
  #t = void 0;
  constructor(t, r) {
    this.#r = t, this.#n = r;
  }
  next() {
    const t = () => this.#s();
    return this.#t = this.#t ? this.#t.then(t, t) : t(), this.#t;
  }
  return(t) {
    const r = () => this.#o(t);
    return this.#t ? this.#t.then(r, r) : r();
  }
  async #s() {
    if (this.#e)
      return {
        done: !0,
        value: void 0
      };
    let t;
    try {
      t = await this.#r.read();
    } catch (r) {
      throw this.#t = void 0, this.#e = !0, this.#r.releaseLock(), r;
    }
    return t.done && (this.#t = void 0, this.#e = !0, this.#r.releaseLock()), t;
  }
  async #o(t) {
    if (this.#e)
      return {
        done: !0,
        value: t
      };
    if (this.#e = !0, !this.#n) {
      const r = this.#r.cancel(t);
      return this.#r.releaseLock(), await r, {
        done: !0,
        value: t
      };
    }
    return this.#r.releaseLock(), {
      done: !0,
      value: t
    };
  }
}
const za = /* @__PURE__ */ Symbol();
function Lp() {
  return this[za].next();
}
Object.defineProperty(Lp, "name", { value: "next" });
function qp(e) {
  return this[za].return(e);
}
Object.defineProperty(qp, "name", { value: "return" });
const hw = Object.create(dw, {
  next: {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: Lp
  },
  return: {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: qp
  }
});
function pw({ preventCancel: e = !1 } = {}) {
  const t = this.getReader(), r = new fw(
    t,
    e
  ), n = Object.create(hw);
  return n[za] = r, n;
}
const mw = (e) => {
  if (As(e, { checkOpen: !1 }) && xa.on !== void 0)
    return gw(e);
  if (typeof e?.[Symbol.asyncIterator] == "function")
    return e;
  if (yw.call(e) === "[object ReadableStream]")
    return pw.call(e);
  throw new TypeError("The first argument must be a Readable, a ReadableStream, or an async iterable.");
}, { toString: yw } = Object.prototype, gw = async function* (e) {
  const t = new AbortController(), r = {};
  vw(e, t, r);
  try {
    for await (const [n] of xa.on(e, "data", { signal: t.signal }))
      yield n;
  } catch (n) {
    if (r.error !== void 0)
      throw r.error;
    if (!t.signal.aborted)
      throw n;
  } finally {
    e.destroy();
  }
}, vw = async (e, t, r) => {
  try {
    await xa.finished(e, {
      cleanup: !0,
      readable: !0,
      writable: !1,
      error: !1
    });
  } catch (n) {
    r.error = n;
  } finally {
    t.abort();
  }
}, xa = {}, Ga = async (e, { init: t, convertChunk: r, getSize: n, truncateChunk: s, addChunk: o, getFinalChunk: i, finalize: a }, { maxBuffer: c = Number.POSITIVE_INFINITY } = {}) => {
  const l = mw(e), u = t();
  u.length = 0;
  try {
    for await (const p of l) {
      const h = $w(p), m = r[h](p, u);
      Fp({
        convertedChunk: m,
        state: u,
        getSize: n,
        truncateChunk: s,
        addChunk: o,
        maxBuffer: c
      });
    }
    return ww({
      state: u,
      convertChunk: r,
      getSize: n,
      truncateChunk: s,
      addChunk: o,
      getFinalChunk: i,
      maxBuffer: c
    }), a(u);
  } catch (p) {
    const h = typeof p == "object" && p !== null ? p : new Error(p);
    throw h.bufferedData = a(u), h;
  }
}, ww = ({ state: e, getSize: t, truncateChunk: r, addChunk: n, getFinalChunk: s, maxBuffer: o }) => {
  const i = s(e);
  i !== void 0 && Fp({
    convertedChunk: i,
    state: e,
    getSize: t,
    truncateChunk: r,
    addChunk: n,
    maxBuffer: o
  });
}, Fp = ({ convertedChunk: e, state: t, getSize: r, truncateChunk: n, addChunk: s, maxBuffer: o }) => {
  const i = r(e), a = t.length + i;
  if (a <= o) {
    Wc(e, t, s, a);
    return;
  }
  const c = n(e, o - t.length);
  throw c !== void 0 && Wc(c, t, s, o), new js();
}, Wc = (e, t, r, n) => {
  t.contents = r(e, t, n), t.length = n;
}, $w = (e) => {
  const t = typeof e;
  if (t === "string")
    return "string";
  if (t !== "object" || e === null)
    return "others";
  if (globalThis.Buffer?.isBuffer(e))
    return "buffer";
  const r = Kc.call(e);
  return r === "[object ArrayBuffer]" ? "arrayBuffer" : r === "[object DataView]" ? "dataView" : Number.isInteger(e.byteLength) && Number.isInteger(e.byteOffset) && Kc.call(e.buffer) === "[object ArrayBuffer]" ? "typedArray" : "others";
}, { toString: Kc } = Object.prototype;
class js extends Error {
  name = "MaxBufferError";
  constructor() {
    super("maxBuffer exceeded");
  }
}
const Et = (e) => e, la = () => {
}, Up = ({ contents: e }) => e, Vp = (e) => {
  throw new Error(`Streams in object mode are not supported: ${String(e)}`);
}, zp = (e) => e.length;
async function _w(e, t) {
  return Ga(e, Rw, t);
}
const bw = () => ({ contents: [] }), Sw = () => 1, Ew = (e, { contents: t }) => (t.push(e), t), Rw = {
  init: bw,
  convertChunk: {
    string: Et,
    buffer: Et,
    arrayBuffer: Et,
    dataView: Et,
    typedArray: Et,
    others: Et
  },
  getSize: Sw,
  truncateChunk: la,
  addChunk: Ew,
  getFinalChunk: la,
  finalize: Up
};
async function Pw(e, t) {
  return Ga(e, kw, t);
}
const Ow = () => ({ contents: new ArrayBuffer(0) }), Tw = (e) => Iw.encode(e), Iw = new TextEncoder(), Hc = (e) => new Uint8Array(e), Jc = (e) => new Uint8Array(e.buffer, e.byteOffset, e.byteLength), Nw = (e, t) => e.slice(0, t), Aw = (e, { contents: t, length: r }, n) => {
  const s = Gp() ? Cw(t, n) : jw(t, n);
  return new Uint8Array(s).set(e, r), s;
}, jw = (e, t) => {
  if (t <= e.byteLength)
    return e;
  const r = new ArrayBuffer(xp(t));
  return new Uint8Array(r).set(new Uint8Array(e), 0), r;
}, Cw = (e, t) => {
  if (t <= e.maxByteLength)
    return e.resize(t), e;
  const r = new ArrayBuffer(t, { maxByteLength: xp(t) });
  return new Uint8Array(r).set(new Uint8Array(e), 0), r;
}, xp = (e) => Xc ** Math.ceil(Math.log(e) / Math.log(Xc)), Xc = 2, Dw = ({ contents: e, length: t }) => Gp() ? e : e.slice(0, t), Gp = () => "resize" in ArrayBuffer.prototype, kw = {
  init: Ow,
  convertChunk: {
    string: Tw,
    buffer: Hc,
    arrayBuffer: Hc,
    dataView: Jc,
    typedArray: Jc,
    others: Vp
  },
  getSize: zp,
  truncateChunk: Nw,
  addChunk: Aw,
  getFinalChunk: la,
  finalize: Dw
};
async function Mw(e, t) {
  return Ga(e, Vw, t);
}
const Lw = () => ({ contents: "", textDecoder: new TextDecoder() }), $r = (e, { textDecoder: t }) => t.decode(e, { stream: !0 }), qw = (e, { contents: t }) => t + e, Fw = (e, t) => e.slice(0, t), Uw = ({ textDecoder: e }) => {
  const t = e.decode();
  return t === "" ? void 0 : t;
}, Vw = {
  init: Lw,
  convertChunk: {
    string: Et,
    buffer: $r,
    arrayBuffer: $r,
    dataView: $r,
    typedArray: $r,
    others: Vp
  },
  getSize: zp,
  truncateChunk: Fw,
  addChunk: qw,
  getFinalChunk: Uw,
  finalize: Up
}, zw = ({ error: e, stream: t, readableObjectMode: r, lines: n, encoding: s, fdNumber: o }) => {
  if (!(e instanceof js))
    throw e;
  if (o === "all")
    return e;
  const i = xw(r, n, s);
  throw e.maxBufferInfo = { fdNumber: o, unit: i }, t.destroy(), e;
}, xw = (e, t, r) => e ? "objects" : t ? "lines" : r === "buffer" ? "bytes" : "characters", Gw = (e, t, r) => {
  if (t.length !== r)
    return;
  const n = new js();
  throw n.maxBufferInfo = { fdNumber: "ipc" }, n;
}, Bw = (e, t) => {
  const { streamName: r, threshold: n, unit: s } = Ww(e, t);
  return `Command's ${r} was larger than ${n} ${s}`;
}, Ww = (e, t) => {
  if (e?.maxBufferInfo === void 0)
    return { streamName: "output", threshold: t[1], unit: "bytes" };
  const { maxBufferInfo: { fdNumber: r, unit: n } } = e;
  delete e.maxBufferInfo;
  const s = ur(t, r);
  return r === "ipc" ? { streamName: "IPC output", threshold: s, unit: "messages" } : { streamName: Xh(r), threshold: s, unit: n };
}, Kw = (e, t, r) => e?.code === "ENOBUFS" && t !== null && t.some((n) => n !== null && n.length > Ba(r)), Hw = (e, t, r) => {
  if (!t)
    return e;
  const n = Ba(r);
  return e.length > n ? e.slice(0, n) : e;
}, Ba = ([, e]) => e, Jw = ({
  stdio: e,
  all: t,
  ipcOutput: r,
  originalError: n,
  signal: s,
  signalDescription: o,
  exitCode: i,
  escapedCommand: a,
  timedOut: c,
  isCanceled: l,
  isGracefullyCanceled: u,
  isMaxBuffer: p,
  isForcefullyTerminated: h,
  forceKillAfterDelay: m,
  killSignal: b,
  maxBuffer: _,
  timeout: f,
  cwd: y
}) => {
  const d = n?.code, v = Xw({
    originalError: n,
    timedOut: c,
    timeout: f,
    isMaxBuffer: p,
    maxBuffer: _,
    errorCode: d,
    signal: s,
    signalDescription: o,
    exitCode: i,
    isCanceled: l,
    isGracefullyCanceled: u,
    isForcefullyTerminated: h,
    forceKillAfterDelay: m,
    killSignal: b
  }), S = Qw(n, y), g = S === void 0 ? "" : `
${S}`, $ = `${v}: ${a}${g}`, E = t === void 0 ? [e[2], e[1]] : [t], I = [
    $,
    ...E,
    ...e.slice(3),
    r.map((k) => Zw(k)).join(`
`)
  ].map((k) => Ca(Va(e$(k)))).filter(Boolean).join(`

`);
  return { originalMessage: S, shortMessage: $, message: I };
}, Xw = ({
  originalError: e,
  timedOut: t,
  timeout: r,
  isMaxBuffer: n,
  maxBuffer: s,
  errorCode: o,
  signal: i,
  signalDescription: a,
  exitCode: c,
  isCanceled: l,
  isGracefullyCanceled: u,
  isForcefullyTerminated: p,
  forceKillAfterDelay: h,
  killSignal: m
}) => {
  const b = Yw(p, h);
  return t ? `Command timed out after ${r} milliseconds${b}` : u ? i === void 0 ? `Command was gracefully canceled with exit code ${c}` : p ? `Command was gracefully canceled${b}` : `Command was gracefully canceled with ${i} (${a})` : l ? `Command was canceled${b}` : n ? `${Bw(e, s)}${b}` : o !== void 0 ? `Command failed with ${o}${b}` : p ? `Command was killed with ${m} (${hp(m)})${b}` : i !== void 0 ? `Command was killed with ${i} (${a})` : c !== void 0 ? `Command failed with exit code ${c}` : "Command failed";
}, Yw = (e, t) => e ? ` and was forcefully terminated after ${t} milliseconds` : "", Qw = (e, t) => {
  if (e instanceof dr)
    return;
  const r = Iv(e) ? e.originalMessage : String(e?.message ?? e), n = Ca(sw(r, t));
  return n === "" ? void 0 : n;
}, Zw = (e) => typeof e == "string" ? e : Dh(e), e$ = (e) => Array.isArray(e) ? e.map((t) => Va(Yc(t))).filter(Boolean).join(`
`) : Yc(e), Yc = (e) => typeof e == "string" ? e : Le(e) ? Hh(e) : "", Bp = ({
  command: e,
  escapedCommand: t,
  stdio: r,
  all: n,
  ipcOutput: s,
  options: { cwd: o },
  startTime: i
}) => Wp({
  command: e,
  escapedCommand: t,
  cwd: o,
  durationMs: sp(i),
  failed: !1,
  timedOut: !1,
  isCanceled: !1,
  isGracefullyCanceled: !1,
  isTerminated: !1,
  isMaxBuffer: !1,
  isForcefullyTerminated: !1,
  exitCode: 0,
  stdout: r[1],
  stderr: r[2],
  all: n,
  stdio: r,
  ipcOutput: s,
  pipedFrom: []
}), Wa = ({
  error: e,
  command: t,
  escapedCommand: r,
  fileDescriptors: n,
  options: s,
  startTime: o,
  isSync: i
}) => Ka({
  error: e,
  command: t,
  escapedCommand: r,
  startTime: o,
  timedOut: !1,
  isCanceled: !1,
  isGracefullyCanceled: !1,
  isMaxBuffer: !1,
  isForcefullyTerminated: !1,
  stdio: Array.from({ length: n.length }),
  ipcOutput: [],
  options: s,
  isSync: i
}), Ka = ({
  error: e,
  command: t,
  escapedCommand: r,
  startTime: n,
  timedOut: s,
  isCanceled: o,
  isGracefullyCanceled: i,
  isMaxBuffer: a,
  isForcefullyTerminated: c,
  exitCode: l,
  signal: u,
  stdio: p,
  all: h,
  ipcOutput: m,
  options: {
    timeoutDuration: b,
    timeout: _ = b,
    forceKillAfterDelay: f,
    killSignal: y,
    cwd: d,
    maxBuffer: v
  },
  isSync: S
}) => {
  const { exitCode: g, signal: $, signalDescription: E } = r$(l, u), { originalMessage: I, shortMessage: k, message: F } = Jw({
    stdio: p,
    all: h,
    ipcOutput: m,
    originalError: e,
    signal: $,
    signalDescription: E,
    exitCode: g,
    escapedCommand: r,
    timedOut: s,
    isCanceled: o,
    isGracefullyCanceled: i,
    isMaxBuffer: a,
    isForcefullyTerminated: c,
    forceKillAfterDelay: f,
    killSignal: y,
    maxBuffer: v,
    timeout: _,
    cwd: d
  }), M = Tv(e, F, S);
  return Object.assign(M, t$({
    error: M,
    command: t,
    escapedCommand: r,
    startTime: n,
    timedOut: s,
    isCanceled: o,
    isGracefullyCanceled: i,
    isMaxBuffer: a,
    isForcefullyTerminated: c,
    exitCode: g,
    signal: $,
    signalDescription: E,
    stdio: p,
    all: h,
    ipcOutput: m,
    cwd: d,
    originalMessage: I,
    shortMessage: k
  })), M;
}, t$ = ({
  error: e,
  command: t,
  escapedCommand: r,
  startTime: n,
  timedOut: s,
  isCanceled: o,
  isGracefullyCanceled: i,
  isMaxBuffer: a,
  isForcefullyTerminated: c,
  exitCode: l,
  signal: u,
  signalDescription: p,
  stdio: h,
  all: m,
  ipcOutput: b,
  cwd: _,
  originalMessage: f,
  shortMessage: y
}) => Wp({
  shortMessage: y,
  originalMessage: f,
  command: t,
  escapedCommand: r,
  cwd: _,
  durationMs: sp(n),
  failed: !0,
  timedOut: s,
  isCanceled: o,
  isGracefullyCanceled: i,
  isTerminated: u !== void 0,
  isMaxBuffer: a,
  isForcefullyTerminated: c,
  exitCode: l,
  signal: u,
  signalDescription: p,
  code: e.cause?.code,
  stdout: h[1],
  stderr: h[2],
  all: m,
  stdio: h,
  ipcOutput: b,
  pipedFrom: []
}), Wp = (e) => Object.fromEntries(Object.entries(e).filter(([, t]) => t !== void 0)), r$ = (e, t) => {
  const r = e === null ? void 0 : e, n = t === null ? void 0 : t, s = n === void 0 ? void 0 : hp(t);
  return { exitCode: r, signal: n, signalDescription: s };
}, Qc = (e) => Number.isFinite(e) ? e : 0;
function n$(e) {
  return {
    days: Math.trunc(e / 864e5),
    hours: Math.trunc(e / 36e5 % 24),
    minutes: Math.trunc(e / 6e4 % 60),
    seconds: Math.trunc(e / 1e3 % 60),
    milliseconds: Math.trunc(e % 1e3),
    microseconds: Math.trunc(Qc(e * 1e3) % 1e3),
    nanoseconds: Math.trunc(Qc(e * 1e6) % 1e3)
  };
}
function s$(e) {
  return {
    days: e / 86400000n,
    hours: e / 3600000n % 24n,
    minutes: e / 60000n % 60n,
    seconds: e / 1000n % 60n,
    milliseconds: e % 1000n,
    microseconds: 0n,
    nanoseconds: 0n
  };
}
function o$(e) {
  switch (typeof e) {
    case "number": {
      if (Number.isFinite(e))
        return n$(e);
      break;
    }
    case "bigint":
      return s$(e);
  }
  throw new TypeError("Expected a finite number or bigint");
}
const i$ = (e) => e === 0 || e === 0n, a$ = (e, t) => t === 1 || t === 1n ? e : `${e}s`, c$ = 1e-7, u$ = 24n * 60n * 60n * 1000n;
function l$(e, t) {
  const r = typeof e == "bigint";
  if (!r && !Number.isFinite(e))
    throw new TypeError("Expected a finite number or bigint");
  t = { ...t };
  const n = e < 0 ? "-" : "";
  e = e < 0 ? -e : e, t.colonNotation && (t.compact = !1, t.formatSubMilliseconds = !1, t.separateMilliseconds = !1, t.verbose = !1), t.compact && (t.unitCount = 1, t.secondsDecimalDigits = 0, t.millisecondsDecimalDigits = 0);
  let s = [];
  const o = (u, p) => {
    const h = Math.floor(u * 10 ** p + c$);
    return (Math.round(h) / 10 ** p).toFixed(p);
  }, i = (u, p, h, m) => {
    if (!((s.length === 0 || !t.colonNotation) && i$(u) && !(t.colonNotation && h === "m"))) {
      if (m ??= String(u), t.colonNotation) {
        const b = m.includes(".") ? m.split(".")[0].length : m.length, _ = s.length > 0 ? 2 : 1;
        m = "0".repeat(Math.max(0, _ - b)) + m;
      } else
        m += t.verbose ? " " + a$(p, u) : h;
      s.push(m);
    }
  }, a = o$(e), c = BigInt(a.days);
  if (t.hideYearAndDays ? i(BigInt(c) * 24n + BigInt(a.hours), "hour", "h") : (t.hideYear ? i(c, "day", "d") : (i(c / 365n, "year", "y"), i(c % 365n, "day", "d")), i(Number(a.hours), "hour", "h")), i(Number(a.minutes), "minute", "m"), !t.hideSeconds)
    if (t.separateMilliseconds || t.formatSubMilliseconds || !t.colonNotation && e < 1e3 && !t.subSecondsAsDecimals) {
      const u = Number(a.seconds), p = Number(a.milliseconds), h = Number(a.microseconds), m = Number(a.nanoseconds);
      if (i(u, "second", "s"), t.formatSubMilliseconds)
        i(p, "millisecond", "ms"), i(h, "microsecond", "µs"), i(m, "nanosecond", "ns");
      else {
        const b = p + h / 1e3 + m / 1e6, _ = typeof t.millisecondsDecimalDigits == "number" ? t.millisecondsDecimalDigits : 0, f = b >= 1 ? Math.round(b) : Math.ceil(b), y = _ ? b.toFixed(_) : f;
        i(
          Number.parseFloat(y),
          "millisecond",
          "ms",
          y
        );
      }
    } else {
      const u = (r ? Number(e % u$) : e) / 1e3 % 60, p = typeof t.secondsDecimalDigits == "number" ? t.secondsDecimalDigits : 1, h = o(u, p), m = t.keepDecimalsOnWholeSeconds ? h : h.replace(/\.0+$/, "");
      i(Number.parseFloat(m), "second", "s", m);
    }
  if (s.length === 0)
    return n + "0" + (t.verbose ? " milliseconds" : "ms");
  const l = t.colonNotation ? ":" : " ";
  return typeof t.unitCount == "number" && (s = s.slice(0, Math.max(t.unitCount, 1))), n + s.join(l);
}
const d$ = (e, t) => {
  e.failed && lr({
    type: "error",
    verboseMessage: e.shortMessage,
    verboseInfo: t,
    result: e
  });
}, f$ = (e, t) => {
  Ia(t) && (d$(e, t), h$(e, t));
}, h$ = (e, t) => {
  const r = `(done in ${l$(e.durationMs)})`;
  lr({
    type: "duration",
    verboseMessage: r,
    verboseInfo: t,
    result: e
  });
}, Ha = (e, t, { reject: r }) => {
  if (f$(e, t), e.failed && r)
    throw e;
  return e;
}, p$ = (e, t) => Wt(e) ? "asyncGenerator" : Jp(e) ? "generator" : Ja(e) ? "fileUrl" : $$(e) ? "filePath" : E$(e) ? "webStream" : jt(e, { checkOpen: !1 }) ? "native" : Le(e) ? "uint8Array" : R$(e) ? "asyncIterable" : P$(e) ? "iterable" : Ya(e) ? Kp({}, t) : v$(e) ? m$(e, t) : "native", m$ = (e, t) => Mp(e.transform, { checkOpen: !1 }) ? y$(e, t) : Ya(e.transform) ? Kp(e, t) : g$(e, t), y$ = (e, t) => (Hp(e, t, "Duplex stream"), "duplex"), Kp = (e, t) => (Hp(e, t, "web TransformStream"), "webTransform"), Hp = ({ final: e, binary: t, objectMode: r }, n, s) => {
  Zc(e, `${n}.final`, s), Zc(t, `${n}.binary`, s), da(r, `${n}.objectMode`);
}, Zc = (e, t, r) => {
  if (e !== void 0)
    throw new TypeError(`The \`${t}\` option can only be defined when using a generator, not a ${r}.`);
}, g$ = ({ transform: e, final: t, binary: r, objectMode: n }, s) => {
  if (e !== void 0 && !eu(e))
    throw new TypeError(`The \`${s}.transform\` option must be a generator, a Duplex stream or a web TransformStream.`);
  if (Mp(t, { checkOpen: !1 }))
    throw new TypeError(`The \`${s}.final\` option must not be a Duplex stream.`);
  if (Ya(t))
    throw new TypeError(`The \`${s}.final\` option must not be a web TransformStream.`);
  if (t !== void 0 && !eu(t))
    throw new TypeError(`The \`${s}.final\` option must be a generator.`);
  return da(r, `${s}.binary`), da(n, `${s}.objectMode`), Wt(e) || Wt(t) ? "asyncGenerator" : "generator";
}, da = (e, t) => {
  if (e !== void 0 && typeof e != "boolean")
    throw new TypeError(`The \`${t}\` option must use a boolean.`);
}, eu = (e) => Wt(e) || Jp(e), Wt = (e) => Object.prototype.toString.call(e) === "[object AsyncGeneratorFunction]", Jp = (e) => Object.prototype.toString.call(e) === "[object GeneratorFunction]", v$ = (e) => je(e) && (e.transform !== void 0 || e.final !== void 0), Ja = (e) => Object.prototype.toString.call(e) === "[object URL]", w$ = (e) => Ja(e) && e.protocol !== "file:", $$ = (e) => je(e) && Object.keys(e).length > 0 && Object.keys(e).every((t) => _$.has(t)) && Xp(e.file), _$ = /* @__PURE__ */ new Set(["file", "append"]), Xp = (e) => typeof e == "string", b$ = (e, t) => e === "native" && typeof t == "string" && !S$.has(t), S$ = /* @__PURE__ */ new Set(["ipc", "ignore", "inherit", "overlapped", "pipe"]), Yp = (e) => Object.prototype.toString.call(e) === "[object ReadableStream]", Xa = (e) => Object.prototype.toString.call(e) === "[object WritableStream]", E$ = (e) => Yp(e) || Xa(e), Ya = (e) => Yp(e?.readable) && Xa(e?.writable), R$ = (e) => Qp(e) && typeof e[Symbol.asyncIterator] == "function", P$ = (e) => Qp(e) && typeof e[Symbol.iterator] == "function", Qp = (e) => typeof e == "object" && e !== null, It = /* @__PURE__ */ new Set(["generator", "asyncGenerator", "duplex", "webTransform"]), Zp = /* @__PURE__ */ new Set(["fileUrl", "filePath", "fileNumber"]), em = /* @__PURE__ */ new Set(["fileUrl", "filePath"]), O$ = /* @__PURE__ */ new Set([...em, "webStream", "nodeStream"]), T$ = /* @__PURE__ */ new Set(["webTransform", "duplex"]), Cs = {
  generator: "a generator",
  asyncGenerator: "an async generator",
  fileUrl: "a file URL",
  filePath: "a file path string",
  fileNumber: "a file descriptor number",
  webStream: "a web stream",
  nodeStream: "a Node.js stream",
  webTransform: "a web TransformStream",
  duplex: "a Duplex stream",
  native: "any value",
  iterable: "an iterable",
  asyncIterable: "an async iterable",
  string: "a string",
  uint8Array: "a Uint8Array"
}, tm = (e, t, r, n) => n === "output" ? I$(e, t, r) : N$(e, t, r), I$ = (e, t, r) => {
  const n = t !== 0 && r[t - 1].value.readableObjectMode;
  return { writableObjectMode: n, readableObjectMode: e ?? n };
}, N$ = (e, t, r) => {
  const n = t === 0 ? e === !0 : r[t - 1].value.readableObjectMode, s = t !== r.length - 1 && (e ?? n);
  return { writableObjectMode: n, readableObjectMode: s };
}, A$ = (e, t) => {
  const r = e.findLast(({ type: n }) => It.has(n));
  return r === void 0 ? !1 : t === "input" ? r.value.writableObjectMode : r.value.readableObjectMode;
}, j$ = (e, t, r, n) => [
  ...e.filter(({ type: s }) => !It.has(s)),
  ...C$(e, t, r, n)
], C$ = (e, t, r, { encoding: n }) => {
  const s = e.filter(({ type: i }) => It.has(i)), o = Array.from({ length: s.length });
  for (const [i, a] of Object.entries(s))
    o[i] = D$({
      stdioItem: a,
      index: Number(i),
      newTransforms: o,
      optionName: t,
      direction: r,
      encoding: n
    });
  return q$(o, r);
}, D$ = ({ stdioItem: e, stdioItem: { type: t }, index: r, newTransforms: n, optionName: s, direction: o, encoding: i }) => t === "duplex" ? k$({ stdioItem: e, optionName: s }) : t === "webTransform" ? M$({
  stdioItem: e,
  index: r,
  newTransforms: n,
  direction: o
}) : L$({
  stdioItem: e,
  index: r,
  newTransforms: n,
  direction: o,
  encoding: i
}), k$ = ({
  stdioItem: e,
  stdioItem: {
    value: {
      transform: t,
      transform: { writableObjectMode: r, readableObjectMode: n },
      objectMode: s = n
    }
  },
  optionName: o
}) => {
  if (s && !n)
    throw new TypeError(`The \`${o}.objectMode\` option can only be \`true\` if \`new Duplex({objectMode: true})\` is used.`);
  if (!s && n)
    throw new TypeError(`The \`${o}.objectMode\` option cannot be \`false\` if \`new Duplex({objectMode: true})\` is used.`);
  return {
    ...e,
    value: { transform: t, writableObjectMode: r, readableObjectMode: n }
  };
}, M$ = ({ stdioItem: e, stdioItem: { value: t }, index: r, newTransforms: n, direction: s }) => {
  const { transform: o, objectMode: i } = je(t) ? t : { transform: t }, { writableObjectMode: a, readableObjectMode: c } = tm(i, r, n, s);
  return {
    ...e,
    value: { transform: o, writableObjectMode: a, readableObjectMode: c }
  };
}, L$ = ({ stdioItem: e, stdioItem: { value: t }, index: r, newTransforms: n, direction: s, encoding: o }) => {
  const {
    transform: i,
    final: a,
    binary: c = !1,
    preserveNewlines: l = !1,
    objectMode: u
  } = je(t) ? t : { transform: t }, p = c || At.has(o), { writableObjectMode: h, readableObjectMode: m } = tm(u, r, n, s);
  return {
    ...e,
    value: {
      transform: i,
      final: a,
      binary: p,
      preserveNewlines: l,
      writableObjectMode: h,
      readableObjectMode: m
    }
  };
}, q$ = (e, t) => t === "input" ? e.reverse() : e, F$ = (e, t, r) => {
  const n = e.map((s) => U$(s, t));
  if (n.includes("input") && n.includes("output"))
    throw new TypeError(`The \`${r}\` option must not be an array of both readable and writable values.`);
  return n.find(Boolean) ?? x$;
}, U$ = ({ type: e, value: t }, r) => V$[r] ?? rm[e](t), V$ = ["input", "output", "output"], Dt = () => {
}, fo = () => "input", rm = {
  generator: Dt,
  asyncGenerator: Dt,
  fileUrl: Dt,
  filePath: Dt,
  iterable: fo,
  asyncIterable: fo,
  uint8Array: fo,
  webStream: (e) => Xa(e) ? "output" : "input",
  nodeStream(e) {
    return As(e, { checkOpen: !1 }) ? kp(e, { checkOpen: !1 }) ? void 0 : "input" : "output";
  },
  webTransform: Dt,
  duplex: Dt,
  native(e) {
    const t = z$(e);
    if (t !== void 0)
      return t;
    if (jt(e, { checkOpen: !1 }))
      return rm.nodeStream(e);
  }
}, z$ = (e) => {
  if ([0, te.stdin].includes(e))
    return "input";
  if ([1, 2, te.stdout, te.stderr].includes(e))
    return "output";
}, x$ = "output", G$ = (e, t) => t && !e.includes("ipc") ? [...e, "ipc"] : e, B$ = ({ stdio: e, ipc: t, buffer: r, ...n }, s, o) => {
  const i = W$(e, n).map((a, c) => nm(a, c));
  return o ? H$(i, r, s) : G$(i, t);
}, W$ = (e, t) => {
  if (e === void 0)
    return Ke.map((n) => t[n]);
  if (K$(t))
    throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${Ke.map((n) => `\`${n}\``).join(", ")}`);
  if (typeof e == "string")
    return [e, e, e];
  if (!Array.isArray(e))
    throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof e}\``);
  const r = Math.max(e.length, Ke.length);
  return Array.from({ length: r }, (n, s) => e[s]);
}, K$ = (e) => Ke.some((t) => e[t] !== void 0), nm = (e, t) => Array.isArray(e) ? e.map((r) => nm(r, t)) : e ?? (t >= Ke.length ? "ignore" : "pipe"), H$ = (e, t, r) => e.map((n, s) => !t[s] && s !== 0 && !Na(r, s) && J$(n) ? "ignore" : n), J$ = (e) => e === "pipe" || Array.isArray(e) && e.every((t) => t === "pipe"), X$ = ({ stdioItem: e, stdioItem: { type: t }, isStdioArray: r, fdNumber: n, direction: s, isSync: o }) => !r || t !== "native" ? e : o ? Y$({ stdioItem: e, fdNumber: n, direction: s }) : e_({ stdioItem: e, fdNumber: n }), Y$ = ({ stdioItem: e, stdioItem: { value: t, optionName: r }, fdNumber: n, direction: s }) => {
  const o = Q$({
    value: t,
    optionName: r,
    fdNumber: n,
    direction: s
  });
  if (o !== void 0)
    return o;
  if (jt(t, { checkOpen: !1 }))
    throw new TypeError(`The \`${r}: Stream\` option cannot both be an array and include a stream with synchronous methods.`);
  return e;
}, Q$ = ({ value: e, optionName: t, fdNumber: r, direction: n }) => {
  const s = Z$(e, r);
  if (s !== void 0) {
    if (n === "output")
      return { type: "fileNumber", value: s, optionName: t };
    if (Mh.isatty(s))
      throw new TypeError(`The \`${t}: ${ia(e)}\` option is invalid: it cannot be a TTY with synchronous methods.`);
    return { type: "uint8Array", value: cr(ra(s)), optionName: t };
  }
}, Z$ = (e, t) => {
  if (e === "inherit")
    return t;
  if (typeof e == "number")
    return e;
  const r = Ta.indexOf(e);
  if (r !== -1)
    return r;
}, e_ = ({ stdioItem: e, stdioItem: { value: t, optionName: r }, fdNumber: n }) => t === "inherit" ? { type: "nodeStream", value: tu(n, t, r), optionName: r } : typeof t == "number" ? { type: "nodeStream", value: tu(t, t, r), optionName: r } : jt(t, { checkOpen: !1 }) ? { type: "nodeStream", value: t, optionName: r } : e, tu = (e, t, r) => {
  const n = Ta[e];
  if (n === void 0)
    throw new TypeError(`The \`${r}: ${t}\` option is invalid: no such standard stream.`);
  return n;
}, t_ = ({ input: e, inputFile: t }, r) => r === 0 ? [
  ...r_(e),
  ...s_(t)
] : [], r_ = (e) => e === void 0 ? [] : [{
  type: n_(e),
  value: e,
  optionName: "input"
}], n_ = (e) => {
  if (As(e, { checkOpen: !1 }))
    return "nodeStream";
  if (typeof e == "string")
    return "string";
  if (Le(e))
    return "uint8Array";
  throw new Error("The `input` option must be a string, a Uint8Array or a Node.js Readable stream.");
}, s_ = (e) => e === void 0 ? [] : [{
  ...o_(e),
  optionName: "inputFile"
}], o_ = (e) => {
  if (Ja(e))
    return { type: "fileUrl", value: e };
  if (Xp(e))
    return { type: "filePath", value: { file: e } };
  throw new Error("The `inputFile` option must be a file path string or a file URL.");
}, i_ = (e) => e.filter((t, r) => e.every((n, s) => t.value !== n.value || r >= s || t.type === "generator" || t.type === "asyncGenerator")), a_ = ({ stdioItem: { type: e, value: t, optionName: r }, direction: n, fileDescriptors: s, isSync: o }) => {
  const i = c_(s, e);
  if (i.length !== 0) {
    if (o) {
      u_({
        otherStdioItems: i,
        type: e,
        value: t,
        optionName: r,
        direction: n
      });
      return;
    }
    if (O$.has(e))
      return sm({
        otherStdioItems: i,
        type: e,
        value: t,
        optionName: r,
        direction: n
      });
    T$.has(e) && d_({
      otherStdioItems: i,
      type: e,
      value: t,
      optionName: r
    });
  }
}, c_ = (e, t) => e.flatMap(({ direction: r, stdioItems: n }) => n.filter((s) => s.type === t).map(((s) => ({ ...s, direction: r })))), u_ = ({ otherStdioItems: e, type: t, value: r, optionName: n, direction: s }) => {
  em.has(t) && sm({
    otherStdioItems: e,
    type: t,
    value: r,
    optionName: n,
    direction: s
  });
}, sm = ({ otherStdioItems: e, type: t, value: r, optionName: n, direction: s }) => {
  const o = e.filter((a) => l_(a, r));
  if (o.length === 0)
    return;
  const i = o.find((a) => a.direction !== s);
  return om(i, n, t), s === "output" ? o[0].stream : void 0;
}, l_ = ({ type: e, value: t }, r) => e === "filePath" ? t.file === r.file : e === "fileUrl" ? t.href === r.href : t === r, d_ = ({ otherStdioItems: e, type: t, value: r, optionName: n }) => {
  const s = e.find(({ value: { transform: o } }) => o === r.transform);
  om(s, n, t);
}, om = (e, t, r) => {
  if (e !== void 0)
    throw new TypeError(`The \`${e.optionName}\` and \`${t}\` options must not target ${Cs[r]} that is the same.`);
}, im = (e, t, r, n) => {
  const o = B$(t, r, n).map((a, c) => f_({
    stdioOption: a,
    fdNumber: c,
    options: t,
    isSync: n
  })), i = $_({
    initialFileDescriptors: o,
    addProperties: e,
    options: t,
    isSync: n
  });
  return t.stdio = i.map(({ stdioItems: a }) => S_(a)), i;
}, f_ = ({ stdioOption: e, fdNumber: t, options: r, isSync: n }) => {
  const s = Xh(t), { stdioItems: o, isStdioArray: i } = h_({
    stdioOption: e,
    fdNumber: t,
    options: r,
    optionName: s
  }), a = F$(o, t, s), c = o.map((p) => X$({
    stdioItem: p,
    isStdioArray: i,
    fdNumber: t,
    direction: a,
    isSync: n
  })), l = j$(c, s, a, r), u = A$(l, a);
  return w_(l, u), { direction: a, objectMode: u, stdioItems: l };
}, h_ = ({ stdioOption: e, fdNumber: t, options: r, optionName: n }) => {
  const o = [
    ...(Array.isArray(e) ? e : [e]).map((c) => p_(c, n)),
    ...t_(r, t)
  ], i = i_(o), a = i.length > 1;
  return m_(i, a, n), g_(i), { stdioItems: i, isStdioArray: a };
}, p_ = (e, t) => ({
  type: p$(e, t),
  value: e,
  optionName: t
}), m_ = (e, t, r) => {
  if (e.length === 0)
    throw new TypeError(`The \`${r}\` option must not be an empty array.`);
  if (t) {
    for (const { value: n, optionName: s } of e)
      if (y_.has(n))
        throw new Error(`The \`${s}\` option must not include \`${n}\`.`);
  }
}, y_ = /* @__PURE__ */ new Set(["ignore", "ipc"]), g_ = (e) => {
  for (const t of e)
    v_(t);
}, v_ = ({ type: e, value: t, optionName: r }) => {
  if (w$(t))
    throw new TypeError(`The \`${r}: URL\` option must use the \`file:\` scheme.
For example, you can use the \`pathToFileURL()\` method of the \`url\` core module.`);
  if (b$(e, t))
    throw new TypeError(`The \`${r}: { file: '...' }\` option must be used instead of \`${r}: '...'\`.`);
}, w_ = (e, t) => {
  if (!t)
    return;
  const r = e.find(({ type: n }) => Zp.has(n));
  if (r !== void 0)
    throw new TypeError(`The \`${r.optionName}\` option cannot use both files and transforms in objectMode.`);
}, $_ = ({ initialFileDescriptors: e, addProperties: t, options: r, isSync: n }) => {
  const s = [];
  try {
    for (const o of e)
      s.push(__({
        fileDescriptor: o,
        fileDescriptors: s,
        addProperties: t,
        options: r,
        isSync: n
      }));
    return s;
  } catch (o) {
    throw am(s), o;
  }
}, __ = ({
  fileDescriptor: { direction: e, objectMode: t, stdioItems: r },
  fileDescriptors: n,
  addProperties: s,
  options: o,
  isSync: i
}) => {
  const a = r.map((c) => b_({
    stdioItem: c,
    addProperties: s,
    direction: e,
    options: o,
    fileDescriptors: n,
    isSync: i
  }));
  return { direction: e, objectMode: t, stdioItems: a };
}, b_ = ({ stdioItem: e, addProperties: t, direction: r, options: n, fileDescriptors: s, isSync: o }) => {
  const i = a_({
    stdioItem: e,
    direction: r,
    fileDescriptors: s,
    isSync: o
  });
  return i !== void 0 ? { ...e, stream: i } : {
    ...e,
    ...t[r][e.type](e, n)
  };
}, am = (e) => {
  for (const { stdioItems: t } of e)
    for (const { stream: r } of t)
      r !== void 0 && !Ot(r) && r.destroy();
}, S_ = (e) => {
  if (e.length > 1)
    return e.some(({ value: n }) => n === "overlapped") ? "overlapped" : "pipe";
  const [{ type: t, value: r }] = e;
  return t === "native" ? r : "pipe";
}, E_ = (e, t) => im(P_, e, t, !0), Ge = ({ type: e, optionName: t }) => {
  cm(t, Cs[e]);
}, R_ = ({ optionName: e, value: t }) => ((t === "ipc" || t === "overlapped") && cm(e, `"${t}"`), {}), cm = (e, t) => {
  throw new TypeError(`The \`${e}\` option cannot be ${t} with synchronous methods.`);
}, ru = {
  generator() {
  },
  asyncGenerator: Ge,
  webStream: Ge,
  nodeStream: Ge,
  webTransform: Ge,
  duplex: Ge,
  asyncIterable: Ge,
  native: R_
}, P_ = {
  input: {
    ...ru,
    fileUrl: ({ value: e }) => ({ contents: [cr(ra(e))] }),
    filePath: ({ value: { file: e } }) => ({ contents: [cr(ra(e))] }),
    fileNumber: Ge,
    iterable: ({ value: e }) => ({ contents: [...e] }),
    string: ({ value: e }) => ({ contents: [e] }),
    uint8Array: ({ value: e }) => ({ contents: [e] })
  },
  output: {
    ...ru,
    fileUrl: ({ value: e }) => ({ path: e }),
    filePath: ({ value: { file: e, append: t } }) => ({ path: e, append: t }),
    fileNumber: ({ value: e }) => ({ path: e }),
    iterable: Ge,
    string: Ge,
    uint8Array: Ge
  }
}, Kt = (e, { stripFinalNewline: t }, r) => um(t, r) && e !== void 0 && !Array.isArray(e) ? Va(e) : e, um = (e, t) => t === "all" ? e[1] || e[2] : e[t], lm = (e, t, r, n) => e || r ? void 0 : fm(t, n), dm = (e, t, r) => r ? e.flatMap((n) => nu(n, t)) : nu(e, t), nu = (e, t) => {
  const { transform: r, final: n } = fm(t, {});
  return [...r(e), ...n()];
}, fm = (e, t) => (t.previousChunks = "", {
  transform: O_.bind(void 0, t, e),
  final: I_.bind(void 0, t)
}), O_ = function* (e, t, r) {
  if (typeof r != "string") {
    yield r;
    return;
  }
  let { previousChunks: n } = e, s = -1;
  for (let o = 0; o < r.length; o += 1)
    if (r[o] === `
`) {
      const i = T_(r, o, t, e);
      let a = r.slice(s + 1, o + 1 - i);
      n.length > 0 && (a = fa(n, a), n = ""), yield a, s = o;
    }
  s !== r.length - 1 && (n = fa(n, r.slice(s + 1))), e.previousChunks = n;
}, T_ = (e, t, r, n) => r ? 0 : (n.isWindowsNewline = t !== 0 && e[t - 1] === "\r", n.isWindowsNewline ? 2 : 1), I_ = function* ({ previousChunks: e }) {
  e.length > 0 && (yield e);
}, N_ = ({ binary: e, preserveNewlines: t, readableObjectMode: r, state: n }) => e || t || r ? void 0 : { transform: A_.bind(void 0, n) }, A_ = function* ({ isWindowsNewline: e = !1 }, t) {
  const { unixNewline: r, windowsNewline: n, LF: s, concatBytes: o } = typeof t == "string" ? j_ : D_;
  if (t.at(-1) === s) {
    yield t;
    return;
  }
  yield o(t, e ? n : r);
}, fa = (e, t) => `${e}${t}`, j_ = {
  windowsNewline: `\r
`,
  unixNewline: `
`,
  LF: `
`,
  concatBytes: fa
}, C_ = (e, t) => {
  const r = new Uint8Array(e.length + t.length);
  return r.set(e, 0), r.set(t, e.length), r;
}, D_ = {
  windowsNewline: new Uint8Array([13, 10]),
  unixNewline: new Uint8Array([10]),
  LF: 10,
  concatBytes: C_
}, k_ = (e, t) => e ? void 0 : M_.bind(void 0, t), M_ = function* (e, t) {
  if (typeof t != "string" && !Le(t) && !Ra.isBuffer(t))
    throw new TypeError(`The \`${e}\` option's transform must use "objectMode: true" to receive as input: ${typeof t}.`);
  yield t;
}, L_ = (e, t) => e ? q_.bind(void 0, t) : F_.bind(void 0, t), q_ = function* (e, t) {
  hm(e, t), yield t;
}, F_ = function* (e, t) {
  if (hm(e, t), typeof t != "string" && !Le(t))
    throw new TypeError(`The \`${e}\` option's function must yield a string or an Uint8Array, not ${typeof t}.`);
  yield t;
}, hm = (e, t) => {
  if (t == null)
    throw new TypeError(`The \`${e}\` option's function must not call \`yield ${t}\`.
Instead, \`yield\` should either be called with a value, or not be called at all. For example:
  if (condition) { yield value; }`);
}, pm = (e, t, r) => {
  if (r)
    return;
  if (e)
    return { transform: U_.bind(void 0, new TextEncoder()) };
  const n = new Ch(t);
  return {
    transform: V_.bind(void 0, n),
    final: z_.bind(void 0, n)
  };
}, U_ = function* (e, t) {
  Ra.isBuffer(t) ? yield cr(t) : typeof t == "string" ? yield e.encode(t) : yield t;
}, V_ = function* (e, t) {
  yield Le(t) ? e.write(t) : t;
}, z_ = function* (e) {
  const t = e.end();
  t !== "" && (yield t);
}, su = Ht(async (e, t, r, n) => {
  t.currentIterable = e(...r);
  try {
    for await (const s of t.currentIterable)
      n.push(s);
  } finally {
    delete t.currentIterable;
  }
}), Qa = async function* (e, t, r) {
  if (r === t.length) {
    yield e;
    return;
  }
  const { transform: n = W_ } = t[r];
  for await (const s of n(e))
    yield* Qa(s, t, r + 1);
}, x_ = async function* (e) {
  for (const [t, { final: r }] of Object.entries(e))
    yield* G_(r, Number(t), e);
}, G_ = async function* (e, t, r) {
  if (e !== void 0)
    for await (const n of e())
      yield* Qa(n, r, t + 1);
}, B_ = Ht(async ({ currentIterable: e }, t) => {
  if (e !== void 0) {
    await (t ? e.throw(t) : e.return());
    return;
  }
  if (t)
    throw t;
}), W_ = function* (e) {
  yield e;
}, ou = (e, t, r, n) => {
  try {
    for (const s of e(...t))
      r.push(s);
    n();
  } catch (s) {
    n(s);
  }
}, K_ = (e, t) => [
  ...t.flatMap((r) => [...hr(r, e, 0)]),
  ...Za(e)
], hr = function* (e, t, r) {
  if (r === t.length) {
    yield e;
    return;
  }
  const { transform: n = J_ } = t[r];
  for (const s of n(e))
    yield* hr(s, t, r + 1);
}, Za = function* (e) {
  for (const [t, { final: r }] of Object.entries(e))
    yield* H_(r, Number(t), e);
}, H_ = function* (e, t, r) {
  if (e !== void 0)
    for (const n of e())
      yield* hr(n, r, t + 1);
}, J_ = function* (e) {
  yield e;
}, iu = ({
  value: e,
  value: { transform: t, final: r, writableObjectMode: n, readableObjectMode: s },
  optionName: o
}, { encoding: i }) => {
  const a = {}, c = ym(e, i, o), l = Wt(t), u = Wt(r), p = l ? su.bind(void 0, Qa, a) : ou.bind(void 0, hr), h = l || u ? su.bind(void 0, x_, a) : ou.bind(void 0, Za), m = l || u ? B_.bind(void 0, a) : void 0;
  return { stream: new Yy({
    writableObjectMode: n,
    writableHighWaterMark: hs(n),
    readableObjectMode: s,
    readableHighWaterMark: hs(s),
    transform(_, f, y) {
      p([_, c, 0], this, y);
    },
    flush(_) {
      h([c], this, _);
    },
    destroy: m
  }) };
}, mm = (e, t, r, n) => {
  const s = t.filter(({ type: i }) => i === "generator"), o = n ? s.reverse() : s;
  for (const { value: i, optionName: a } of o) {
    const c = ym(i, r, a);
    e = K_(c, e);
  }
  return e;
}, ym = ({ transform: e, final: t, binary: r, writableObjectMode: n, readableObjectMode: s, preserveNewlines: o }, i, a) => {
  const c = {};
  return [
    { transform: k_(n, a) },
    pm(r, i, n),
    lm(r, o, n, c),
    { transform: e, final: t },
    { transform: L_(s, a) },
    N_({
      binary: r,
      preserveNewlines: o,
      readableObjectMode: s,
      state: c
    })
  ].filter(Boolean);
}, X_ = (e, t) => {
  for (const r of Y_(e))
    Q_(e, r, t);
}, Y_ = (e) => new Set(Object.entries(e).filter(([, { direction: t }]) => t === "input").map(([t]) => Number(t))), Q_ = (e, t, r) => {
  const { stdioItems: n } = e[t], s = n.filter(({ contents: a }) => a !== void 0);
  if (s.length === 0)
    return;
  if (t !== 0) {
    const [{ type: a, optionName: c }] = s;
    throw new TypeError(`Only the \`stdin\` option, not \`${c}\`, can be ${Cs[a]} with synchronous methods.`);
  }
  const i = s.map(({ contents: a }) => a).map((a) => Z_(a, n));
  r.input = Oa(i);
}, Z_ = (e, t) => {
  const r = mm(e, t, "utf8", !0);
  return eb(r), Oa(r);
}, eb = (e) => {
  const t = e.find((r) => typeof r != "string" && !Le(r));
  if (t !== void 0)
    throw new TypeError(`The \`stdin\` option is invalid: when passing objects as input, a transform must be used to serialize them to strings or Uint8Arrays: ${t}.`);
}, gm = ({ stdioItems: e, encoding: t, verboseInfo: r, fdNumber: n }) => n !== "all" && Na(r, n) && !At.has(t) && tb(n) && (e.some(({ type: s, value: o }) => s === "native" && rb.has(o)) || e.every(({ type: s }) => It.has(s))), tb = (e) => e === 1 || e === 2, rb = /* @__PURE__ */ new Set(["pipe", "overlapped"]), nb = async (e, t, r, n) => {
  for await (const s of e)
    ob(t) || vm(s, r, n);
}, sb = (e, t, r) => {
  for (const n of e)
    vm(n, t, r);
}, ob = (e) => e._readableState.pipes.length > 0, vm = (e, t, r) => {
  const n = rp(e);
  lr({
    type: "output",
    verboseMessage: n,
    fdNumber: t,
    verboseInfo: r
  });
}, ib = ({ fileDescriptors: e, syncResult: { output: t }, options: r, isMaxBuffer: n, verboseInfo: s }) => {
  if (t === null)
    return { output: Array.from({ length: 3 }) };
  const o = {}, i = /* @__PURE__ */ new Set([]);
  return { output: t.map((c, l) => ab({
    result: c,
    fileDescriptors: e,
    fdNumber: l,
    state: o,
    outputFiles: i,
    isMaxBuffer: n,
    verboseInfo: s
  }, r)), ...o };
}, ab = ({ result: e, fileDescriptors: t, fdNumber: r, state: n, outputFiles: s, isMaxBuffer: o, verboseInfo: i }, { buffer: a, encoding: c, lines: l, stripFinalNewline: u, maxBuffer: p }) => {
  if (e === null)
    return;
  const h = Hw(e, o, p), m = cr(h), { stdioItems: b, objectMode: _ } = t[r], f = cb([m], b, c, n), { serializedResult: y, finalResult: d = y } = ub({
    chunks: f,
    objectMode: _,
    encoding: c,
    lines: l,
    stripFinalNewline: u,
    fdNumber: r
  });
  lb({
    serializedResult: y,
    fdNumber: r,
    state: n,
    verboseInfo: i,
    encoding: c,
    stdioItems: b,
    objectMode: _
  });
  const v = a[r] ? d : void 0;
  try {
    return n.error === void 0 && db(y, b, s), v;
  } catch (S) {
    return n.error = S, v;
  }
}, cb = (e, t, r, n) => {
  try {
    return mm(e, t, r, !1);
  } catch (s) {
    return n.error = s, e;
  }
}, ub = ({ chunks: e, objectMode: t, encoding: r, lines: n, stripFinalNewline: s, fdNumber: o }) => {
  if (t)
    return { serializedResult: e };
  if (r === "buffer")
    return { serializedResult: Oa(e) };
  const i = og(e, r);
  return n[o] ? { serializedResult: i, finalResult: dm(i, !s[o], t) } : { serializedResult: i };
}, lb = ({ serializedResult: e, fdNumber: t, state: r, verboseInfo: n, encoding: s, stdioItems: o, objectMode: i }) => {
  if (!gm({
    stdioItems: o,
    encoding: s,
    verboseInfo: n,
    fdNumber: t
  }))
    return;
  const a = dm(e, !1, i);
  try {
    sb(a, t, n);
  } catch (c) {
    r.error ??= c;
  }
}, db = (e, t, r) => {
  for (const { path: n, append: s } of t.filter(({ type: o }) => Zp.has(o))) {
    const o = typeof n == "string" ? n : n.toString();
    s || r.has(o) ? Jy(n, e) : (r.add(o), Xy(n, e));
  }
}, fb = ([, e, t], r) => {
  if (r.all)
    return e === void 0 ? t : t === void 0 ? e : Array.isArray(e) ? Array.isArray(t) ? [...e, ...t] : [...e, Kt(t, r, "all")] : Array.isArray(t) ? [Kt(e, r, "all"), ...t] : Le(e) && Le(t) ? Jh([e, t]) : `${e}${t}`;
}, hb = async (e, t) => {
  const [r, n] = await pb(e);
  return t.isForcefullyTerminated ??= !1, [r, n];
}, pb = async (e) => {
  const [t, r] = await Promise.allSettled([
    Oe(e, "spawn"),
    Oe(e, "exit")
  ]);
  return t.status === "rejected" ? [] : r.status === "rejected" ? wm(e) : r.value;
}, wm = async (e) => {
  try {
    return await Oe(e, "exit");
  } catch {
    return wm(e);
  }
}, mb = async (e) => {
  const [t, r] = await e;
  if (!yb(t, r) && $m(t, r))
    throw new dr();
  return [t, r];
}, yb = (e, t) => e === void 0 && t === void 0, $m = (e, t) => e !== 0 || t !== null, gb = ({ error: e, status: t, signal: r, output: n }, { maxBuffer: s }) => {
  const o = vb(e, t, r), i = o?.code === "ETIMEDOUT", a = Kw(o, n, s);
  return {
    resultError: o,
    exitCode: t,
    signal: r,
    timedOut: i,
    isMaxBuffer: a
  };
}, vb = (e, t, r) => e !== void 0 ? e : $m(t, r) ? new dr() : void 0, wb = (e, t, r) => {
  const { file: n, commandArguments: s, command: o, escapedCommand: i, startTime: a, verboseInfo: c, options: l, fileDescriptors: u } = $b(e, t, r), p = Sb({
    file: n,
    commandArguments: s,
    options: l,
    command: o,
    escapedCommand: i,
    verboseInfo: c,
    fileDescriptors: u,
    startTime: a
  });
  return Ha(p, c, l);
}, $b = (e, t, r) => {
  const { command: n, escapedCommand: s, startTime: o, verboseInfo: i } = op(e, t, r), a = _b(r), { file: c, commandArguments: l, options: u } = Ap(e, t, a);
  bb(u);
  const p = E_(u, i);
  return {
    file: c,
    commandArguments: l,
    command: n,
    escapedCommand: s,
    startTime: o,
    verboseInfo: i,
    options: u,
    fileDescriptors: p
  };
}, _b = (e) => e.node && !e.ipc ? { ...e, ipc: !1 } : e, bb = ({ ipc: e, ipcInput: t, detached: r, cancelSignal: n }) => {
  t && _r("ipcInput"), e && _r("ipc: true"), r && _r("detached: true"), n && _r("cancelSignal");
}, _r = (e) => {
  throw new TypeError(`The "${e}" option cannot be used with synchronous methods.`);
}, Sb = ({ file: e, commandArguments: t, options: r, command: n, escapedCommand: s, verboseInfo: o, fileDescriptors: i, startTime: a }) => {
  const c = Eb({
    file: e,
    commandArguments: t,
    options: r,
    command: n,
    escapedCommand: s,
    fileDescriptors: i,
    startTime: a
  });
  if (c.failed)
    return c;
  const { resultError: l, exitCode: u, signal: p, timedOut: h, isMaxBuffer: m } = gb(c, r), { output: b, error: _ = l } = ib({
    fileDescriptors: i,
    syncResult: c,
    options: r,
    isMaxBuffer: m,
    verboseInfo: o
  }), f = b.map((d, v) => Kt(d, r, v)), y = Kt(fb(b, r), r, "all");
  return Pb({
    error: _,
    exitCode: u,
    signal: p,
    timedOut: h,
    isMaxBuffer: m,
    stdio: f,
    all: y,
    options: r,
    command: n,
    escapedCommand: s,
    startTime: a
  });
}, Eb = ({ file: e, commandArguments: t, options: r, command: n, escapedCommand: s, fileDescriptors: o, startTime: i }) => {
  try {
    X_(o, r);
    const a = Rb(r);
    return My(...jp(e, t, a));
  } catch (a) {
    return Wa({
      error: a,
      command: n,
      escapedCommand: s,
      fileDescriptors: o,
      options: r,
      startTime: i,
      isSync: !0
    });
  }
}, Rb = ({ encoding: e, maxBuffer: t, ...r }) => ({ ...r, encoding: "buffer", maxBuffer: Ba(t) }), Pb = ({ error: e, exitCode: t, signal: r, timedOut: n, isMaxBuffer: s, stdio: o, all: i, options: a, command: c, escapedCommand: l, startTime: u }) => e === void 0 ? Bp({
  command: c,
  escapedCommand: l,
  stdio: o,
  all: i,
  ipcOutput: [],
  options: a,
  startTime: u
}) : Ka({
  error: e,
  command: c,
  escapedCommand: l,
  timedOut: n,
  isCanceled: !1,
  isGracefullyCanceled: !1,
  isMaxBuffer: s,
  isForcefullyTerminated: !1,
  exitCode: t,
  signal: r,
  stdio: o,
  all: i,
  ipcOutput: [],
  options: a,
  startTime: u,
  isSync: !0
}), Ob = ({ anyProcess: e, channel: t, isSubprocess: r, ipc: n }, { reference: s = !0, filter: o } = {}) => (Ma({
  methodName: "getOneMessage",
  isSubprocess: r,
  ipc: n,
  isConnected: Ep(e)
}), Tb({
  anyProcess: e,
  channel: t,
  isSubprocess: r,
  filter: o,
  reference: s
})), Tb = async ({ anyProcess: e, channel: t, isSubprocess: r, filter: n, reference: s }) => {
  bp(t, s);
  const o = Is(e, t, r), i = new AbortController();
  try {
    return await Promise.race([
      Ib(o, n, i),
      Nb(o, r, i),
      Ab(o, r, i)
    ]);
  } catch (a) {
    throw La(e), a;
  } finally {
    i.abort(), Sp(t, s);
  }
}, Ib = async (e, t, { signal: r }) => {
  if (t === void 0) {
    const [n] = await Oe(e, "message", { signal: r });
    return n;
  }
  for await (const [n] of Rs(e, "message", { signal: r }))
    if (t(n))
      return n;
}, Nb = async (e, t, { signal: r }) => {
  await Oe(e, "disconnect", { signal: r }), n0(t);
}, Ab = async (e, t, { signal: r }) => {
  const [n] = await Oe(e, "strict:error", { signal: r });
  throw gp(n, t);
}, jb = ({ anyProcess: e, channel: t, isSubprocess: r, ipc: n }, { reference: s = !0 } = {}) => _m({
  anyProcess: e,
  channel: t,
  isSubprocess: r,
  ipc: n,
  shouldAwait: !r,
  reference: s
}), _m = ({ anyProcess: e, channel: t, isSubprocess: r, ipc: n, shouldAwait: s, reference: o }) => {
  Ma({
    methodName: "getEachMessage",
    isSubprocess: r,
    ipc: n,
    isConnected: Ep(e)
  }), bp(t, o);
  const i = Is(e, t, r), a = new AbortController(), c = {};
  return Cb(e, i, a), Db({
    ipcEmitter: i,
    isSubprocess: r,
    controller: a,
    state: c
  }), kb({
    anyProcess: e,
    channel: t,
    ipcEmitter: i,
    isSubprocess: r,
    shouldAwait: s,
    controller: a,
    state: c,
    reference: o
  });
}, Cb = async (e, t, r) => {
  try {
    await Oe(t, "disconnect", { signal: r.signal }), r.abort();
  } catch {
  }
}, Db = async ({ ipcEmitter: e, isSubprocess: t, controller: r, state: n }) => {
  try {
    const [s] = await Oe(e, "strict:error", { signal: r.signal });
    n.error = gp(s, t), r.abort();
  } catch {
  }
}, kb = async function* ({ anyProcess: e, channel: t, ipcEmitter: r, isSubprocess: n, shouldAwait: s, controller: o, state: i, reference: a }) {
  try {
    for await (const [c] of Rs(r, "message", { signal: o.signal }))
      au(i), yield c;
  } catch {
    au(i);
  } finally {
    o.abort(), Sp(t, a), n || La(e), s && await e;
  }
}, au = ({ error: e }) => {
  if (e)
    throw e;
}, Mb = (e, { ipc: t }) => {
  Object.assign(e, bm(e, !1, t));
}, Lb = () => {
  const e = te, t = !0, r = te.channel !== void 0;
  return {
    ...bm(e, t, r),
    getCancelSignal: L0.bind(void 0, {
      anyProcess: e,
      channel: e.channel,
      isSubprocess: t,
      ipc: r
    })
  };
}, bm = (e, t, r) => ({
  sendMessage: Pp.bind(void 0, {
    anyProcess: e,
    channel: e.channel,
    isSubprocess: t,
    ipc: r
  }),
  getOneMessage: Ob.bind(void 0, {
    anyProcess: e,
    channel: e.channel,
    isSubprocess: t,
    ipc: r
  }),
  getEachMessage: jb.bind(void 0, {
    anyProcess: e,
    channel: e.channel,
    isSubprocess: t,
    ipc: r
  })
}), qb = ({ error: e, command: t, escapedCommand: r, fileDescriptors: n, options: s, startTime: o, verboseInfo: i }) => {
  am(n);
  const a = new jh();
  Fb(a, n), Object.assign(a, { readable: Ub, writable: Vb, duplex: zb });
  const c = Wa({
    error: e,
    command: t,
    escapedCommand: r,
    fileDescriptors: n,
    options: s,
    startTime: o,
    isSync: !1
  }), l = xb(c, i, s);
  return { subprocess: a, promise: l };
}, Fb = (e, t) => {
  const r = Zt(), n = Zt(), s = Zt(), o = Array.from({ length: t.length - 3 }, Zt), i = Zt(), a = [r, n, s, ...o];
  Object.assign(e, {
    stdin: r,
    stdout: n,
    stderr: s,
    all: i,
    stdio: a
  });
}, Zt = () => {
  const e = new Vh();
  return e.end(), e;
}, Ub = () => new Rt({ read() {
} }), Vb = () => new Ea({ write() {
} }), zb = () => new Sa({ read() {
}, write() {
} }), xb = async (e, t, r) => Ha(e, t, r), Gb = (e, t) => im(Bb, e, t, !1), or = ({ type: e, optionName: t }) => {
  throw new TypeError(`The \`${t}\` option cannot be ${Cs[e]}.`);
}, cu = {
  fileNumber: or,
  generator: iu,
  asyncGenerator: iu,
  nodeStream: ({ value: e }) => ({ stream: e }),
  webTransform({ value: { transform: e, writableObjectMode: t, readableObjectMode: r } }) {
    const n = t || r;
    return { stream: Sa.fromWeb(e, { objectMode: n }) };
  },
  duplex: ({ value: { transform: e } }) => ({ stream: e }),
  native() {
  }
}, Bb = {
  input: {
    ...cu,
    fileUrl: ({ value: e }) => ({ stream: bc(e) }),
    filePath: ({ value: { file: e } }) => ({ stream: bc(e) }),
    webStream: ({ value: e }) => ({ stream: Rt.fromWeb(e) }),
    iterable: ({ value: e }) => ({ stream: Rt.from(e) }),
    asyncIterable: ({ value: e }) => ({ stream: Rt.from(e) }),
    string: ({ value: e }) => ({ stream: Rt.from(e) }),
    uint8Array: ({ value: e }) => ({ stream: Rt.from(Ra.from(e)) })
  },
  output: {
    ...cu,
    fileUrl: ({ value: e }) => ({ stream: _c(e) }),
    filePath: ({ value: { file: e, append: t } }) => ({ stream: _c(e, t ? { flags: "a" } : {}) }),
    webStream: ({ value: e }) => ({ stream: Ea.fromWeb(e) }),
    iterable: or,
    asyncIterable: or,
    string: or,
    uint8Array: or
  }
};
function ec(e) {
  if (!Array.isArray(e))
    throw new TypeError(`Expected an array, got \`${typeof e}\`.`);
  for (const s of e)
    ha(s);
  const t = e.some(({ readableObjectMode: s }) => s), r = Wb(e, t), n = new Kb({
    objectMode: t,
    writableHighWaterMark: r,
    readableHighWaterMark: r
  });
  for (const s of e)
    n.add(s);
  return n;
}
const Wb = (e, t) => {
  if (e.length === 0)
    return hs(t);
  const r = e.filter(({ readableObjectMode: n }) => n === t).map(({ readableHighWaterMark: n }) => n);
  return Math.max(...r);
};
class Kb extends Vh {
  #r = /* @__PURE__ */ new Set([]);
  #n = /* @__PURE__ */ new Set([]);
  #e = /* @__PURE__ */ new Set([]);
  #t;
  #s = /* @__PURE__ */ Symbol("unpipe");
  #o = /* @__PURE__ */ new WeakMap();
  add(t) {
    if (ha(t), this.#r.has(t))
      return;
    this.#r.add(t), this.#t ??= Hb(this, this.#r, this.#s);
    const r = Yb({
      passThroughStream: this,
      stream: t,
      streams: this.#r,
      ended: this.#n,
      aborted: this.#e,
      onFinished: this.#t,
      unpipeEvent: this.#s
    });
    this.#o.set(t, r), t.pipe(this, { end: !1 });
  }
  async remove(t) {
    if (ha(t), !this.#r.has(t))
      return !1;
    const r = this.#o.get(t);
    return r === void 0 ? !1 : (this.#o.delete(t), t.unpipe(this), await r, !0);
  }
}
const Hb = async (e, t, r) => {
  vs(e, uu);
  const n = new AbortController();
  try {
    await Promise.race([
      Jb(e, n),
      Xb(e, t, r, n)
    ]);
  } finally {
    n.abort(), vs(e, -uu);
  }
}, Jb = async (e, { signal: t }) => {
  try {
    await dt(e, { signal: t, cleanup: !0 });
  } catch (r) {
    throw Sm(e, r), r;
  }
}, Xb = async (e, t, r, { signal: n }) => {
  for await (const [s] of Rs(e, "unpipe", { signal: n }))
    t.has(s) && s.emit(r);
}, ha = (e) => {
  if (typeof e?.pipe != "function")
    throw new TypeError(`Expected a readable stream, got: \`${typeof e}\`.`);
}, Yb = async ({ passThroughStream: e, stream: t, streams: r, ended: n, aborted: s, onFinished: o, unpipeEvent: i }) => {
  vs(e, lu);
  const a = new AbortController();
  try {
    await Promise.race([
      Qb(o, t, a),
      Zb({
        passThroughStream: e,
        stream: t,
        streams: r,
        ended: n,
        aborted: s,
        controller: a
      }),
      eS({
        stream: t,
        streams: r,
        ended: n,
        aborted: s,
        unpipeEvent: i,
        controller: a
      })
    ]);
  } finally {
    a.abort(), vs(e, -lu);
  }
  r.size > 0 && r.size === n.size + s.size && (n.size === 0 && s.size > 0 ? tc(e) : tS(e));
}, Qb = async (e, t, { signal: r }) => {
  try {
    await e, r.aborted || tc(t);
  } catch (n) {
    r.aborted || Sm(t, n);
  }
}, Zb = async ({ passThroughStream: e, stream: t, streams: r, ended: n, aborted: s, controller: { signal: o } }) => {
  try {
    await dt(t, {
      signal: o,
      cleanup: !0,
      readable: !0,
      writable: !1
    }), r.has(t) && n.add(t);
  } catch (i) {
    if (o.aborted || !r.has(t))
      return;
    Em(i) ? s.add(t) : Rm(e, i);
  }
}, eS = async ({ stream: e, streams: t, ended: r, aborted: n, unpipeEvent: s, controller: { signal: o } }) => {
  if (await Oe(e, s, { signal: o }), !e.readable)
    return Oe(o, "abort", { signal: o });
  t.delete(e), r.delete(e), n.delete(e);
}, tS = (e) => {
  e.writable && e.end();
}, Sm = (e, t) => {
  Em(t) ? tc(e) : Rm(e, t);
}, Em = (e) => e?.code === "ERR_STREAM_PREMATURE_CLOSE", tc = (e) => {
  (e.readable || e.writable) && e.destroy();
}, Rm = (e, t) => {
  e.destroyed || (e.once("error", rS), e.destroy(t));
}, rS = () => {
}, vs = (e, t) => {
  const r = e.getMaxListeners();
  r !== 0 && r !== Number.POSITIVE_INFINITY && e.setMaxListeners(r + t);
}, uu = 2, lu = 1, ws = (e, t) => {
  e.pipe(t), nS(e, t), sS(e, t);
}, nS = async (e, t) => {
  if (!(Ot(e) || Ot(t))) {
    try {
      await dt(e, { cleanup: !0, readable: !0, writable: !1 });
    } catch {
    }
    Pm(t);
  }
}, Pm = (e) => {
  e.writable && e.end();
}, sS = async (e, t) => {
  if (!(Ot(e) || Ot(t))) {
    try {
      await dt(t, { cleanup: !0, readable: !1, writable: !0 });
    } catch {
    }
    Om(e);
  }
}, Om = (e) => {
  e.readable && e.destroy();
}, oS = (e, t, r) => {
  const n = /* @__PURE__ */ new Map();
  for (const [s, { stdioItems: o, direction: i }] of Object.entries(t)) {
    for (const { stream: a } of o.filter(({ type: c }) => It.has(c)))
      iS(e, a, i, s);
    for (const { stream: a } of o.filter(({ type: c }) => !It.has(c)))
      cS({
        subprocess: e,
        stream: a,
        direction: i,
        fdNumber: s,
        pipeGroups: n,
        controller: r
      });
  }
  for (const [s, o] of n.entries()) {
    const i = o.length === 1 ? o[0] : ec(o);
    ws(i, s);
  }
}, iS = (e, t, r, n) => {
  r === "output" ? ws(e.stdio[n], t) : ws(t, e.stdio[n]);
  const s = aS[n];
  s !== void 0 && (e[s] = t), e.stdio[n] = t;
}, aS = ["stdin", "stdout", "stderr"], cS = ({ subprocess: e, stream: t, direction: r, fdNumber: n, pipeGroups: s, controller: o }) => {
  if (t === void 0)
    return;
  uS(t, o);
  const [i, a] = r === "output" ? [t, e.stdio[n]] : [e.stdio[n], t], c = s.get(i) ?? [];
  s.set(i, [...c, a]);
}, uS = (e, { signal: t }) => {
  Ot(e) && ys(e, lS, t);
}, lS = 2, Bt = [];
Bt.push("SIGHUP", "SIGINT", "SIGTERM");
process.platform !== "win32" && Bt.push(
  "SIGALRM",
  "SIGABRT",
  "SIGVTALRM",
  "SIGXCPU",
  "SIGXFSZ",
  "SIGUSR2",
  "SIGTRAP",
  "SIGSYS",
  "SIGQUIT",
  "SIGIOT"
  // should detect profiler and enable/disable accordingly.
  // see #21
  // 'SIGPROF'
);
process.platform === "linux" && Bt.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
const ls = (e) => !!e && typeof e == "object" && typeof e.removeListener == "function" && typeof e.emit == "function" && typeof e.reallyExit == "function" && typeof e.listeners == "function" && typeof e.kill == "function" && typeof e.pid == "number" && typeof e.on == "function", ho = /* @__PURE__ */ Symbol.for("signal-exit emitter"), po = globalThis, dS = Object.defineProperty.bind(Object);
class fS {
  emitted = {
    afterExit: !1,
    exit: !1
  };
  listeners = {
    afterExit: [],
    exit: []
  };
  count = 0;
  id = Math.random();
  constructor() {
    if (po[ho])
      return po[ho];
    dS(po, ho, {
      value: this,
      writable: !1,
      enumerable: !1,
      configurable: !1
    });
  }
  on(t, r) {
    this.listeners[t].push(r);
  }
  removeListener(t, r) {
    const n = this.listeners[t], s = n.indexOf(r);
    s !== -1 && (s === 0 && n.length === 1 ? n.length = 0 : n.splice(s, 1));
  }
  emit(t, r, n) {
    if (this.emitted[t])
      return !1;
    this.emitted[t] = !0;
    let s = !1;
    for (const o of this.listeners[t])
      s = o(r, n) === !0 || s;
    return t === "exit" && (s = this.emit("afterExit", r, n) || s), s;
  }
}
class Tm {
}
const hS = (e) => ({
  onExit(t, r) {
    return e.onExit(t, r);
  },
  load() {
    return e.load();
  },
  unload() {
    return e.unload();
  }
});
class pS extends Tm {
  onExit() {
    return () => {
    };
  }
  load() {
  }
  unload() {
  }
}
class mS extends Tm {
  // "SIGHUP" throws an `ENOSYS` error on Windows,
  // so use a supported signal instead
  /* c8 ignore start */
  #r = pa.platform === "win32" ? "SIGINT" : "SIGHUP";
  /* c8 ignore stop */
  #n = new fS();
  #e;
  #t;
  #s;
  #o = {};
  #i = !1;
  constructor(t) {
    super(), this.#e = t, this.#o = {};
    for (const r of Bt)
      this.#o[r] = () => {
        const n = this.#e.listeners(r);
        let { count: s } = this.#n;
        const o = t;
        if (typeof o.__signal_exit_emitter__ == "object" && typeof o.__signal_exit_emitter__.count == "number" && (s += o.__signal_exit_emitter__.count), n.length === s) {
          this.unload();
          const i = this.#n.emit("exit", null, r), a = r === "SIGHUP" ? this.#r : r;
          i || t.kill(t.pid, a);
        }
      };
    this.#s = t.reallyExit, this.#t = t.emit;
  }
  onExit(t, r) {
    if (!ls(this.#e))
      return () => {
      };
    this.#i === !1 && this.load();
    const n = r?.alwaysLast ? "afterExit" : "exit";
    return this.#n.on(n, t), () => {
      this.#n.removeListener(n, t), this.#n.listeners.exit.length === 0 && this.#n.listeners.afterExit.length === 0 && this.unload();
    };
  }
  load() {
    if (!this.#i) {
      this.#i = !0, this.#n.count += 1;
      for (const t of Bt)
        try {
          const r = this.#o[t];
          r && this.#e.on(t, r);
        } catch {
        }
      this.#e.emit = (t, ...r) => this.#a(t, ...r), this.#e.reallyExit = (t) => this.#c(t);
    }
  }
  unload() {
    this.#i && (this.#i = !1, Bt.forEach((t) => {
      const r = this.#o[t];
      if (!r)
        throw new Error("Listener not defined for signal: " + t);
      try {
        this.#e.removeListener(t, r);
      } catch {
      }
    }), this.#e.emit = this.#t, this.#e.reallyExit = this.#s, this.#n.count -= 1);
  }
  #c(t) {
    return ls(this.#e) ? (this.#e.exitCode = t || 0, this.#n.emit("exit", this.#e.exitCode, null), this.#s.call(this.#e, this.#e.exitCode)) : 0;
  }
  #a(t, ...r) {
    const n = this.#t;
    if (t === "exit" && ls(this.#e)) {
      typeof r[0] == "number" && (this.#e.exitCode = r[0]);
      const s = n.call(this.#e, t, ...r);
      return this.#n.emit("exit", this.#e.exitCode, null), s;
    } else
      return n.call(this.#e, t, ...r);
  }
}
const pa = globalThis.process, {
  /**
   * Called when the process is exiting, whether via signal, explicit
   * exit, or running out of stuff to do.
   *
   * If the global process object is not suitable for instrumentation,
   * then this will be a no-op.
   *
   * Returns a function that may be used to unload signal-exit.
   */
  onExit: yS
} = hS(ls(pa) ? new mS(pa) : new pS()), gS = (e, { cleanup: t, detached: r }, { signal: n }) => {
  if (!t || r)
    return;
  const s = yS(() => {
    e.kill();
  });
  Uh(n, () => {
    s();
  });
}, vS = ({ source: e, sourcePromise: t, boundOptions: r, createNested: n }, ...s) => {
  const o = np(), {
    destination: i,
    destinationStream: a,
    destinationError: c,
    from: l,
    unpipeSignal: u
  } = wS(r, n, s), { sourceStream: p, sourceError: h } = _S(e, l), { options: m, fileDescriptors: b } = Tt.get(e);
  return {
    sourcePromise: t,
    sourceStream: p,
    sourceOptions: m,
    sourceError: h,
    destination: i,
    destinationStream: a,
    destinationError: c,
    unpipeSignal: u,
    fileDescriptors: b,
    startTime: o
  };
}, wS = (e, t, r) => {
  try {
    const {
      destination: n,
      pipeOptions: { from: s, to: o, unpipeSignal: i } = {}
    } = $S(e, t, ...r), a = vp(n, o);
    return {
      destination: n,
      destinationStream: a,
      from: s,
      unpipeSignal: i
    };
  } catch (n) {
    return { destinationError: n };
  }
}, $S = (e, t, r, ...n) => {
  if (Array.isArray(r))
    return { destination: t(du, e)(r, ...n), pipeOptions: e };
  if (typeof r == "string" || r instanceof URL || xh(r)) {
    if (Object.keys(e).length > 0)
      throw new TypeError('Please use .pipe("file", ..., options) or .pipe(execa("file", ..., options)) instead of .pipe(options)("file", ...).');
    const [s, o, i] = Bh(r, ...n);
    return { destination: t(du)(s, o, i), pipeOptions: i };
  }
  if (Tt.has(r)) {
    if (Object.keys(e).length > 0)
      throw new TypeError("Please use .pipe(options)`command` or .pipe($(options)`command`) instead of .pipe(options)($`command`).");
    return { destination: r, pipeOptions: n[0] };
  }
  throw new TypeError(`The first argument must be a template string, an options object, or an Execa subprocess: ${r}`);
}, du = ({ options: e }) => ({ options: { ...e, stdin: "pipe", piped: !0 } }), _S = (e, t) => {
  try {
    return { sourceStream: qa(e, t) };
  } catch (r) {
    return { sourceError: r };
  }
}, bS = ({
  sourceStream: e,
  sourceError: t,
  destinationStream: r,
  destinationError: n,
  fileDescriptors: s,
  sourceOptions: o,
  startTime: i
}) => {
  const a = SS({
    sourceStream: e,
    sourceError: t,
    destinationStream: r,
    destinationError: n
  });
  if (a !== void 0)
    throw Im({
      error: a,
      fileDescriptors: s,
      sourceOptions: o,
      startTime: i
    });
}, SS = ({ sourceStream: e, sourceError: t, destinationStream: r, destinationError: n }) => {
  if (t !== void 0 && n !== void 0)
    return n;
  if (n !== void 0)
    return Om(e), n;
  if (t !== void 0)
    return Pm(r), t;
}, Im = ({ error: e, fileDescriptors: t, sourceOptions: r, startTime: n }) => Wa({
  error: e,
  command: fu,
  escapedCommand: fu,
  fileDescriptors: t,
  options: r,
  startTime: n,
  isSync: !1
}), fu = "source.pipe(destination)", ES = async (e) => {
  const [
    { status: t, reason: r, value: n = r },
    { status: s, reason: o, value: i = o }
  ] = await e;
  if (i.pipedFrom.includes(n) || i.pipedFrom.push(n), s === "rejected")
    throw i;
  if (t === "rejected")
    throw n;
  return i;
}, RS = (e, t, r) => {
  const n = Ds.has(t) ? OS(e, t) : PS(e, t);
  return ys(e, IS, r.signal), ys(t, NS, r.signal), TS(t), n;
}, PS = (e, t) => {
  const r = ec([e]);
  return ws(r, t), Ds.set(t, r), r;
}, OS = (e, t) => {
  const r = Ds.get(t);
  return r.add(e), r;
}, TS = async (e) => {
  try {
    await dt(e, { cleanup: !0, readable: !1, writable: !0 });
  } catch {
  }
  Ds.delete(e);
}, Ds = /* @__PURE__ */ new WeakMap(), IS = 2, NS = 1, AS = (e, t) => e === void 0 ? [] : [jS(e, t)], jS = async (e, { sourceStream: t, mergedStream: r, fileDescriptors: n, sourceOptions: s, startTime: o }) => {
  await Uy(e, t), await r.remove(t);
  const i = new Error("Pipe canceled by `unpipeSignal` option.");
  throw Im({
    error: i,
    fileDescriptors: n,
    sourceOptions: s,
    startTime: o
  });
}, ma = (e, ...t) => {
  if (je(t[0]))
    return ma.bind(void 0, {
      ...e,
      boundOptions: { ...e.boundOptions, ...t[0] }
    });
  const { destination: r, ...n } = vS(e, ...t), s = CS({ ...n, destination: r });
  return s.pipe = ma.bind(void 0, {
    ...e,
    source: r,
    sourcePromise: s,
    boundOptions: {}
  }), s;
}, CS = async ({
  sourcePromise: e,
  sourceStream: t,
  sourceOptions: r,
  sourceError: n,
  destination: s,
  destinationStream: o,
  destinationError: i,
  unpipeSignal: a,
  fileDescriptors: c,
  startTime: l
}) => {
  const u = DS(e, s);
  bS({
    sourceStream: t,
    sourceError: n,
    destinationStream: o,
    destinationError: i,
    fileDescriptors: c,
    sourceOptions: r,
    startTime: l
  });
  const p = new AbortController();
  try {
    const h = RS(t, o, p);
    return await Promise.race([
      ES(u),
      ...AS(a, {
        sourceStream: t,
        mergedStream: h,
        sourceOptions: r,
        fileDescriptors: c,
        startTime: l
      })
    ]);
  } finally {
    p.abort();
  }
}, DS = (e, t) => Promise.allSettled([e, t]), Nm = ({ subprocessStdout: e, subprocess: t, binary: r, shouldEncode: n, encoding: s, preserveNewlines: o }) => {
  const i = new AbortController();
  return kS(t, i), jm({
    stream: e,
    controller: i,
    binary: r,
    shouldEncode: !e.readableObjectMode && n,
    encoding: s,
    shouldSplit: !e.readableObjectMode,
    preserveNewlines: o
  });
}, kS = async (e, t) => {
  try {
    await e;
  } catch {
  } finally {
    t.abort();
  }
}, Am = ({ stream: e, onStreamEnd: t, lines: r, encoding: n, stripFinalNewline: s, allMixed: o }) => {
  const i = new AbortController();
  MS(t, i, e);
  const a = e.readableObjectMode && !o;
  return jm({
    stream: e,
    controller: i,
    binary: n === "buffer",
    shouldEncode: !a,
    encoding: n,
    shouldSplit: !a && r,
    preserveNewlines: !s
  });
}, MS = async (e, t, r) => {
  try {
    await e;
  } catch {
    r.destroy();
  } finally {
    t.abort();
  }
}, jm = ({ stream: e, controller: t, binary: r, shouldEncode: n, encoding: s, shouldSplit: o, preserveNewlines: i }) => {
  const a = Rs(e, "data", {
    signal: t.signal,
    highWaterMark: hu,
    // Backward compatibility with older name for this option
    // See https://github.com/nodejs/node/pull/52080#discussion_r1525227861
    // @todo Remove after removing support for Node 21
    highWatermark: hu
  });
  return LS({
    onStdoutChunk: a,
    controller: t,
    binary: r,
    shouldEncode: n,
    encoding: s,
    shouldSplit: o,
    preserveNewlines: i
  });
}, Cm = hs(!0), hu = Cm, LS = async function* ({ onStdoutChunk: e, controller: t, binary: r, shouldEncode: n, encoding: s, shouldSplit: o, preserveNewlines: i }) {
  const a = qS({
    binary: r,
    shouldEncode: n,
    encoding: s,
    shouldSplit: o,
    preserveNewlines: i
  });
  try {
    for await (const [c] of e)
      yield* hr(c, a, 0);
  } catch (c) {
    if (!t.signal.aborted)
      throw c;
  } finally {
    yield* Za(a);
  }
}, qS = ({ binary: e, shouldEncode: t, encoding: r, shouldSplit: n, preserveNewlines: s }) => [
  pm(e, r, !t),
  lm(e, s, !n, {})
].filter(Boolean), FS = async ({ stream: e, onStreamEnd: t, fdNumber: r, encoding: n, buffer: s, maxBuffer: o, lines: i, allMixed: a, stripFinalNewline: c, verboseInfo: l, streamInfo: u }) => {
  const p = US({
    stream: e,
    onStreamEnd: t,
    fdNumber: r,
    encoding: n,
    allMixed: a,
    verboseInfo: l,
    streamInfo: u
  });
  if (!s) {
    await Promise.all([VS(e), p]);
    return;
  }
  const h = um(c, r), m = Am({
    stream: e,
    onStreamEnd: t,
    lines: i,
    encoding: n,
    stripFinalNewline: h,
    allMixed: a
  }), [b] = await Promise.all([
    zS({
      stream: e,
      iterable: m,
      fdNumber: r,
      encoding: n,
      maxBuffer: o,
      lines: i
    }),
    p
  ]);
  return b;
}, US = async ({ stream: e, onStreamEnd: t, fdNumber: r, encoding: n, allMixed: s, verboseInfo: o, streamInfo: { fileDescriptors: i } }) => {
  if (!gm({
    stdioItems: i[r]?.stdioItems,
    encoding: n,
    verboseInfo: o,
    fdNumber: r
  }))
    return;
  const a = Am({
    stream: e,
    onStreamEnd: t,
    lines: !0,
    encoding: n,
    stripFinalNewline: !0,
    allMixed: s
  });
  await nb(a, e, r, o);
}, VS = async (e) => {
  await Gy(), e.readableFlowing === null && e.resume();
}, zS = async ({ stream: e, stream: { readableObjectMode: t }, iterable: r, fdNumber: n, encoding: s, maxBuffer: o, lines: i }) => {
  try {
    return t || i ? await _w(r, { maxBuffer: o }) : s === "buffer" ? new Uint8Array(await Pw(r, { maxBuffer: o })) : await Mw(r, { maxBuffer: o });
  } catch (a) {
    return Dm(zw({
      error: a,
      stream: e,
      readableObjectMode: t,
      lines: i,
      encoding: s,
      fdNumber: n
    }));
  }
}, pu = async (e) => {
  try {
    return await e;
  } catch (t) {
    return Dm(t);
  }
}, Dm = ({ bufferedData: e }) => rg(e) ? new Uint8Array(e) : e, rc = async (e, t, r, { isSameDirection: n, stopOnExit: s = !1 } = {}) => {
  const o = xS(e, r), i = new AbortController();
  try {
    await Promise.race([
      ...s ? [r.exitPromise] : [],
      dt(e, { cleanup: !0, signal: i.signal })
    ]);
  } catch (a) {
    o.stdinCleanedUp || WS(a, t, r, n);
  } finally {
    i.abort();
  }
}, xS = (e, { originalStreams: [t], subprocess: r }) => {
  const n = { stdinCleanedUp: !1 };
  return e === t && GS(e, r, n), n;
}, GS = (e, t, r) => {
  const { _destroy: n } = e;
  e._destroy = (...s) => {
    BS(t, r), n.call(e, ...s);
  };
}, BS = ({ exitCode: e, signalCode: t }, r) => {
  (e !== null || t !== null) && (r.stdinCleanedUp = !0);
}, WS = (e, t, r, n) => {
  if (!KS(e, t, r, n))
    throw e;
}, KS = (e, t, r, n = !0) => r.propagating ? mu(e) || ya(e) : (r.propagating = !0, km(r, t) === n ? mu(e) : ya(e)), km = ({ fileDescriptors: e }, t) => t !== "all" && e[t].direction === "input", ya = (e) => e?.code === "ERR_STREAM_PREMATURE_CLOSE", mu = (e) => e?.code === "EPIPE", HS = ({ subprocess: e, encoding: t, buffer: r, maxBuffer: n, lines: s, stripFinalNewline: o, verboseInfo: i, streamInfo: a }) => e.stdio.map((c, l) => Mm({
  stream: c,
  fdNumber: l,
  encoding: t,
  buffer: r[l],
  maxBuffer: n[l],
  lines: s[l],
  allMixed: !1,
  stripFinalNewline: o,
  verboseInfo: i,
  streamInfo: a
})), Mm = async ({ stream: e, fdNumber: t, encoding: r, buffer: n, maxBuffer: s, lines: o, allMixed: i, stripFinalNewline: a, verboseInfo: c, streamInfo: l }) => {
  if (!e)
    return;
  const u = rc(e, t, l);
  if (km(l, t)) {
    await u;
    return;
  }
  const [p] = await Promise.all([
    FS({
      stream: e,
      onStreamEnd: u,
      fdNumber: t,
      encoding: r,
      buffer: n,
      maxBuffer: s,
      lines: o,
      allMixed: i,
      stripFinalNewline: a,
      verboseInfo: c,
      streamInfo: l
    }),
    u
  ]);
  return p;
}, JS = ({ stdout: e, stderr: t }, { all: r }) => r && (e || t) ? ec([e, t].filter(Boolean)) : void 0, XS = ({ subprocess: e, encoding: t, buffer: r, maxBuffer: n, lines: s, stripFinalNewline: o, verboseInfo: i, streamInfo: a }) => Mm({
  ...YS(e, r),
  fdNumber: "all",
  encoding: t,
  maxBuffer: n[1] + n[2],
  lines: s[1] || s[2],
  allMixed: QS(e),
  stripFinalNewline: o,
  verboseInfo: i,
  streamInfo: a
}), YS = ({ stdout: e, stderr: t, all: r }, [, n, s]) => {
  const o = n || s;
  return o ? n ? s ? { stream: r, buffer: o } : { stream: e, buffer: o } : { stream: t, buffer: o } : { stream: r, buffer: o };
}, QS = ({ all: e, stdout: t, stderr: r }) => e && t && r && t.readableObjectMode !== r.readableObjectMode, ZS = (e) => Na(e, "ipc"), eE = (e, t) => {
  const r = rp(e);
  lr({
    type: "ipc",
    verboseMessage: r,
    fdNumber: "ipc",
    verboseInfo: t
  });
}, tE = async ({
  subprocess: e,
  buffer: t,
  maxBuffer: r,
  ipc: n,
  ipcOutput: s,
  verboseInfo: o
}) => {
  if (!n)
    return s;
  const i = ZS(o), a = ur(t, "ipc"), c = ur(r, "ipc");
  for await (const l of _m({
    anyProcess: e,
    channel: e.channel,
    isSubprocess: !1,
    ipc: n,
    shouldAwait: !1,
    reference: !0
  }))
    a && (Gw(e, s, c), s.push(l)), i && eE(l, o);
  return s;
}, rE = async (e, t) => (await Promise.allSettled([e]), t), nE = async ({
  subprocess: e,
  options: {
    encoding: t,
    buffer: r,
    maxBuffer: n,
    lines: s,
    timeoutDuration: o,
    cancelSignal: i,
    gracefulCancel: a,
    forceKillAfterDelay: c,
    stripFinalNewline: l,
    ipc: u,
    ipcInput: p
  },
  context: h,
  verboseInfo: m,
  fileDescriptors: b,
  originalStreams: _,
  onInternalError: f,
  controller: y
}) => {
  const d = hb(e, h), v = {
    originalStreams: _,
    fileDescriptors: b,
    subprocess: e,
    exitPromise: d,
    propagating: !1
  }, S = HS({
    subprocess: e,
    encoding: t,
    buffer: r,
    maxBuffer: n,
    lines: s,
    stripFinalNewline: l,
    verboseInfo: m,
    streamInfo: v
  }), g = XS({
    subprocess: e,
    encoding: t,
    buffer: r,
    maxBuffer: n,
    lines: s,
    stripFinalNewline: l,
    verboseInfo: m,
    streamInfo: v
  }), $ = [], E = tE({
    subprocess: e,
    buffer: r,
    maxBuffer: n,
    ipc: u,
    ipcOutput: $,
    verboseInfo: m
  }), I = sE(_, e, v), k = oE(b, v);
  try {
    return await Promise.race([
      Promise.all([
        {},
        mb(d),
        Promise.all(S),
        g,
        E,
        Z0(e, p),
        ...I,
        ...k
      ]),
      f,
      iE(e, y),
      ...B0(e, o, h, y),
      ...e0({
        subprocess: e,
        cancelSignal: i,
        gracefulCancel: a,
        context: h,
        controller: y
      }),
      ...V0({
        subprocess: e,
        cancelSignal: i,
        gracefulCancel: a,
        forceKillAfterDelay: c,
        context: h,
        controller: y
      })
    ]);
  } catch (F) {
    return h.terminationReason ??= "other", Promise.all([
      { error: F },
      d,
      Promise.all(S.map((M) => pu(M))),
      pu(g),
      rE(E, $),
      Promise.allSettled(I),
      Promise.allSettled(k)
    ]);
  }
}, sE = (e, t, r) => e.map((n, s) => n === t.stdio[s] ? void 0 : rc(n, s, r)), oE = (e, t) => e.flatMap(({ stdioItems: r }, n) => r.filter(({ value: s, stream: o = s }) => jt(o, { checkOpen: !1 }) && !Ot(o)).map(({ type: s, value: o, stream: i = o }) => rc(i, n, t, {
  isSameDirection: It.has(s),
  stopOnExit: s === "native"
}))), iE = async (e, { signal: t }) => {
  const [r] = await Oe(e, "error", { signal: t });
  throw r;
}, aE = () => ({
  readableDestroy: /* @__PURE__ */ new WeakMap(),
  writableFinal: /* @__PURE__ */ new WeakMap(),
  writableDestroy: /* @__PURE__ */ new WeakMap()
}), ga = (e, t, r) => {
  const n = e[r];
  n.has(t) || n.set(t, []);
  const s = n.get(t), o = fr();
  return s.push(o), { resolve: o.resolve.bind(o), promises: s };
}, $s = async ({ resolve: e, promises: t }, r) => {
  e();
  const [n] = await Promise.race([
    Promise.allSettled([!0, r]),
    Promise.all([!1, ...t])
  ]);
  return !n;
}, yu = async (e) => {
  if (e !== void 0)
    try {
      await Lm(e);
    } catch {
    }
}, cE = async (e) => {
  if (e !== void 0)
    try {
      await qm(e);
    } catch {
    }
}, Lm = async (e) => {
  await dt(e, { cleanup: !0, readable: !1, writable: !0 });
}, qm = async (e) => {
  await dt(e, { cleanup: !0, readable: !0, writable: !1 });
}, Fm = async (e, t) => {
  if (await e, t)
    throw t;
}, Um = (e, t, r) => {
  r && !ya(r) ? e.destroy(r) : t && e.destroy();
}, uE = ({ subprocess: e, concurrentStreams: t, encoding: r }, { from: n, binary: s = !0, preserveNewlines: o = !0 } = {}) => {
  const i = s || At.has(r), { subprocessStdout: a, waitReadableDestroy: c } = Vm(e, n, t), { readableEncoding: l, readableObjectMode: u, readableHighWaterMark: p } = zm(a, i), { read: h, onStdoutDataDone: m } = xm({
    subprocessStdout: a,
    subprocess: e,
    binary: i,
    encoding: r,
    preserveNewlines: o
  }), b = new Rt({
    read: h,
    destroy: Ht(Bm.bind(void 0, { subprocessStdout: a, subprocess: e, waitReadableDestroy: c })),
    highWaterMark: p,
    objectMode: u,
    encoding: l
  });
  return Gm({
    subprocessStdout: a,
    onStdoutDataDone: m,
    readable: b,
    subprocess: e
  }), b;
}, Vm = (e, t, r) => {
  const n = qa(e, t), s = ga(r, n, "readableDestroy");
  return { subprocessStdout: n, waitReadableDestroy: s };
}, zm = ({ readableEncoding: e, readableObjectMode: t, readableHighWaterMark: r }, n) => n ? { readableEncoding: e, readableObjectMode: t, readableHighWaterMark: r } : { readableEncoding: e, readableObjectMode: !0, readableHighWaterMark: Cm }, xm = ({ subprocessStdout: e, subprocess: t, binary: r, encoding: n, preserveNewlines: s }) => {
  const o = fr(), i = Nm({
    subprocessStdout: e,
    subprocess: t,
    binary: r,
    shouldEncode: !r,
    encoding: n,
    preserveNewlines: s
  });
  return {
    read() {
      lE(this, i, o);
    },
    onStdoutDataDone: o
  };
}, lE = async (e, t, r) => {
  try {
    const { value: n, done: s } = await t.next();
    s ? r.resolve() : e.push(n);
  } catch {
  }
}, Gm = async ({ subprocessStdout: e, onStdoutDataDone: t, readable: r, subprocess: n, subprocessStdin: s }) => {
  try {
    await qm(e), await n, await yu(s), await t, r.readable && r.push(null);
  } catch (o) {
    await yu(s), Wm(r, o);
  }
}, Bm = async ({ subprocessStdout: e, subprocess: t, waitReadableDestroy: r }, n) => {
  await $s(r, t) && (Wm(e, n), await Fm(t, n));
}, Wm = (e, t) => {
  Um(e, e.readable, t);
}, dE = ({ subprocess: e, concurrentStreams: t }, { to: r } = {}) => {
  const { subprocessStdin: n, waitWritableFinal: s, waitWritableDestroy: o } = Km(e, r, t), i = new Ea({
    ...Hm(n, e, s),
    destroy: Ht(Xm.bind(void 0, {
      subprocessStdin: n,
      subprocess: e,
      waitWritableFinal: s,
      waitWritableDestroy: o
    })),
    highWaterMark: n.writableHighWaterMark,
    objectMode: n.writableObjectMode
  });
  return Jm(n, i), i;
}, Km = (e, t, r) => {
  const n = vp(e, t), s = ga(r, n, "writableFinal"), o = ga(r, n, "writableDestroy");
  return { subprocessStdin: n, waitWritableFinal: s, waitWritableDestroy: o };
}, Hm = (e, t, r) => ({
  write: fE.bind(void 0, e),
  final: Ht(hE.bind(void 0, e, t, r))
}), fE = (e, t, r, n) => {
  e.write(t, r) ? n() : e.once("drain", n);
}, hE = async (e, t, r) => {
  await $s(r, t) && (e.writable && e.end(), await t);
}, Jm = async (e, t, r) => {
  try {
    await Lm(e), t.writable && t.end();
  } catch (n) {
    await cE(r), Ym(t, n);
  }
}, Xm = async ({ subprocessStdin: e, subprocess: t, waitWritableFinal: r, waitWritableDestroy: n }, s) => {
  await $s(r, t), await $s(n, t) && (Ym(e, s), await Fm(t, s));
}, Ym = (e, t) => {
  Um(e, e.writable, t);
}, pE = ({ subprocess: e, concurrentStreams: t, encoding: r }, { from: n, to: s, binary: o = !0, preserveNewlines: i = !0 } = {}) => {
  const a = o || At.has(r), { subprocessStdout: c, waitReadableDestroy: l } = Vm(e, n, t), { subprocessStdin: u, waitWritableFinal: p, waitWritableDestroy: h } = Km(e, s, t), { readableEncoding: m, readableObjectMode: b, readableHighWaterMark: _ } = zm(c, a), { read: f, onStdoutDataDone: y } = xm({
    subprocessStdout: c,
    subprocess: e,
    binary: a,
    encoding: r,
    preserveNewlines: i
  }), d = new Sa({
    read: f,
    ...Hm(u, e, p),
    destroy: Ht(mE.bind(void 0, {
      subprocessStdout: c,
      subprocessStdin: u,
      subprocess: e,
      waitReadableDestroy: l,
      waitWritableFinal: p,
      waitWritableDestroy: h
    })),
    readableHighWaterMark: _,
    writableHighWaterMark: u.writableHighWaterMark,
    readableObjectMode: b,
    writableObjectMode: u.writableObjectMode,
    encoding: m
  });
  return Gm({
    subprocessStdout: c,
    onStdoutDataDone: y,
    readable: d,
    subprocess: e,
    subprocessStdin: u
  }), Jm(u, d, c), d;
}, mE = async ({ subprocessStdout: e, subprocessStdin: t, subprocess: r, waitReadableDestroy: n, waitWritableFinal: s, waitWritableDestroy: o }, i) => {
  await Promise.all([
    Bm({ subprocessStdout: e, subprocess: r, waitReadableDestroy: n }, i),
    Xm({
      subprocessStdin: t,
      subprocess: r,
      waitWritableFinal: s,
      waitWritableDestroy: o
    }, i)
  ]);
}, gu = (e, t, {
  from: r,
  binary: n = !1,
  preserveNewlines: s = !1
} = {}) => {
  const o = n || At.has(t), i = qa(e, r), a = Nm({
    subprocessStdout: i,
    subprocess: e,
    binary: o,
    shouldEncode: !0,
    encoding: t,
    preserveNewlines: s
  });
  return yE(a, i, e);
}, yE = async function* (e, t, r) {
  try {
    yield* e;
  } finally {
    t.readable && t.destroy(), await r;
  }
}, gE = (e, { encoding: t }) => {
  const r = aE();
  e.readable = uE.bind(void 0, { subprocess: e, concurrentStreams: r, encoding: t }), e.writable = dE.bind(void 0, { subprocess: e, concurrentStreams: r }), e.duplex = pE.bind(void 0, { subprocess: e, concurrentStreams: r, encoding: t }), e.iterable = gu.bind(void 0, e, t), e[Symbol.asyncIterator] = gu.bind(void 0, e, t, {});
}, vE = (e, t) => {
  for (const [r, n] of $E) {
    const s = n.value.bind(t);
    Reflect.defineProperty(e, r, { ...n, value: s });
  }
}, wE = (async () => {
})().constructor.prototype, $E = ["then", "catch", "finally"].map((e) => [
  e,
  Reflect.getOwnPropertyDescriptor(wE, e)
]), _E = (e, t, r, n) => {
  const { file: s, commandArguments: o, command: i, escapedCommand: a, startTime: c, verboseInfo: l, options: u, fileDescriptors: p } = bE(e, t, r), { subprocess: h, promise: m } = EE({
    file: s,
    commandArguments: o,
    options: u,
    startTime: c,
    verboseInfo: l,
    command: i,
    escapedCommand: a,
    fileDescriptors: p
  });
  return h.pipe = ma.bind(void 0, {
    source: h,
    sourcePromise: m,
    boundOptions: {},
    createNested: n
  }), vE(h, m), Tt.set(h, { options: u, fileDescriptors: p }), h;
}, bE = (e, t, r) => {
  const { command: n, escapedCommand: s, startTime: o, verboseInfo: i } = op(e, t, r), { file: a, commandArguments: c, options: l } = Ap(e, t, r), u = SE(l), p = Gb(u, i);
  return {
    file: a,
    commandArguments: c,
    command: n,
    escapedCommand: s,
    startTime: o,
    verboseInfo: i,
    options: u,
    fileDescriptors: p
  };
}, SE = ({ timeout: e, signal: t, ...r }) => {
  if (t !== void 0)
    throw new TypeError('The "signal" option has been renamed to "cancelSignal" instead.');
  return { ...r, timeoutDuration: e };
}, EE = ({ file: e, commandArguments: t, options: r, startTime: n, verboseInfo: s, command: o, escapedCommand: i, fileDescriptors: a }) => {
  let c;
  try {
    c = Ly(...jp(e, t, r));
  } catch (b) {
    return qb({
      error: b,
      command: o,
      escapedCommand: i,
      fileDescriptors: a,
      options: r,
      startTime: n,
      verboseInfo: s
    });
  }
  const l = new AbortController();
  Wy(Number.POSITIVE_INFINITY, l.signal);
  const u = [...c.stdio];
  oS(c, a, l), gS(c, r, l);
  const p = {}, h = fr();
  c.kill = Jv.bind(void 0, {
    kill: c.kill.bind(c),
    options: r,
    onInternalError: h,
    context: p,
    controller: l
  }), c.all = JS(c, r), gE(c, r), Mb(c, r);
  const m = RE({
    subprocess: c,
    options: r,
    startTime: n,
    verboseInfo: s,
    fileDescriptors: a,
    originalStreams: u,
    command: o,
    escapedCommand: i,
    context: p,
    onInternalError: h,
    controller: l
  });
  return { subprocess: c, promise: m };
}, RE = async ({ subprocess: e, options: t, startTime: r, verboseInfo: n, fileDescriptors: s, originalStreams: o, command: i, escapedCommand: a, context: c, onInternalError: l, controller: u }) => {
  const [
    p,
    [h, m],
    b,
    _,
    f
  ] = await nE({
    subprocess: e,
    options: t,
    context: c,
    verboseInfo: n,
    fileDescriptors: s,
    originalStreams: o,
    onInternalError: l,
    controller: u
  });
  u.abort(), l.resolve();
  const y = b.map((S, g) => Kt(S, t, g)), d = Kt(_, t, "all"), v = PE({
    errorInfo: p,
    exitCode: h,
    signal: m,
    stdio: y,
    all: d,
    ipcOutput: f,
    context: c,
    options: t,
    command: i,
    escapedCommand: a,
    startTime: r
  });
  return Ha(v, n, t);
}, PE = ({ errorInfo: e, exitCode: t, signal: r, stdio: n, all: s, ipcOutput: o, context: i, options: a, command: c, escapedCommand: l, startTime: u }) => "error" in e ? Ka({
  error: e.error,
  command: c,
  escapedCommand: l,
  timedOut: i.terminationReason === "timeout",
  isCanceled: i.terminationReason === "cancel" || i.terminationReason === "gracefulCancel",
  isGracefullyCanceled: i.terminationReason === "gracefulCancel",
  isMaxBuffer: e.error instanceof js,
  isForcefullyTerminated: i.isForcefullyTerminated,
  exitCode: t,
  signal: r,
  stdio: n,
  all: s,
  ipcOutput: o,
  options: a,
  startTime: u,
  isSync: !1
}) : Bp({
  command: c,
  escapedCommand: l,
  stdio: n,
  all: s,
  ipcOutput: o,
  options: a,
  startTime: u
}), va = (e, t) => {
  const r = Object.fromEntries(
    Object.entries(t).map(([n, s]) => [
      n,
      OE(n, e[n], s)
    ])
  );
  return { ...e, ...r };
}, OE = (e, t, r) => TE.has(e) && je(t) && je(r) ? { ...t, ...r } : r, TE = /* @__PURE__ */ new Set(["env", ...Zh]), Ct = (e, t, r, n) => {
  const s = (i, a, c) => Ct(i, a, r, c), o = (...i) => IE({
    mapArguments: e,
    deepOptions: r,
    boundOptions: t,
    setBoundExeca: n,
    createNested: s
  }, ...i);
  return n !== void 0 && n(o, s, t), o;
}, IE = ({ mapArguments: e, deepOptions: t = {}, boundOptions: r = {}, setBoundExeca: n, createNested: s }, o, ...i) => {
  if (je(o))
    return s(e, va(r, o), n);
  const { file: a, commandArguments: c, options: l, isSync: u } = NE({
    mapArguments: e,
    firstArgument: o,
    nextArguments: i,
    deepOptions: t,
    boundOptions: r
  });
  return u ? wb(a, c, l) : _E(a, c, l, s);
}, NE = ({ mapArguments: e, firstArgument: t, nextArguments: r, deepOptions: n, boundOptions: s }) => {
  const o = ug(t) ? lg(t, r) : [t, ...r], [i, a, c] = Bh(...o), l = va(va(n, s), c), {
    file: u = i,
    commandArguments: p = a,
    options: h = l,
    isSync: m = !1
  } = e({ file: i, commandArguments: a, options: l });
  return {
    file: u,
    commandArguments: p,
    options: h,
    isSync: m
  };
}, AE = ({ file: e, commandArguments: t }) => Qm(e, t), jE = ({ file: e, commandArguments: t }) => ({ ...Qm(e, t), isSync: !0 }), Qm = (e, t) => {
  if (t.length > 0)
    throw new TypeError(`The command and its arguments must be passed as a single string: ${e} ${t}.`);
  const [r, ...n] = Zm(e);
  return { file: r, commandArguments: n };
}, Zm = (e) => {
  if (typeof e != "string")
    throw new TypeError(`The command must be a string: ${String(e)}.`);
  const t = e.trim();
  if (t === "")
    return [];
  const r = [];
  for (const n of t.split(CE)) {
    const s = r.at(-1);
    s && s.endsWith("\\") ? r[r.length - 1] = `${s.slice(0, -1)} ${n}` : r.push(n);
  }
  return r;
}, CE = / +/g, DE = (e, t, r) => {
  e.sync = t(ME, r), e.s = e.sync;
}, kE = ({ options: e }) => ey(e), ME = ({ options: e }) => ({ ...ey(e), isSync: !0 }), ey = (e) => ({ options: { ...LE(e), ...e } }), LE = ({ input: e, inputFile: t, stdio: r }) => e === void 0 && t === void 0 && r === void 0 ? { stdin: "inherit" } : {}, qE = { preferLocal: !0 }, xe = Ct(() => ({})), FE = Ct(() => ({ isSync: !0 })), UE = Ct(AE), VE = Ct(jE), zE = Ct(K0), xE = Ct(kE, {}, qE, DE), {
  sendMessage: GE,
  getOneMessage: BE,
  getEachMessage: WE,
  getCancelSignal: KE
} = Lb(), HE = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $: xE,
  ExecaError: ps,
  ExecaSyncError: ms,
  execa: xe,
  execaCommand: UE,
  execaCommandSync: VE,
  execaNode: zE,
  execaSync: FE,
  getCancelSignal: KE,
  getEachMessage: WE,
  getOneMessage: BE,
  parseCommandString: Zm,
  sendMessage: GE
}, Symbol.toStringTag, { value: "Module" }));
class nc {
  getSystemInfo() {
    return {
      platform: process.platform,
      arch: process.arch,
      release: ba.release(),
      // Intlhacks for simple locale detection in node
      locale: Intl.DateTimeFormat().resolvedOptions().locale
    };
  }
  getWingetArch() {
    switch (process.arch) {
      case "x64":
        return "x64";
      case "arm64":
        return "arm64";
      case "ia32":
        return "x86";
      default:
        return process.arch;
    }
  }
}
class JE {
  systemService;
  historyService;
  // Using any to avoid circularity issues if needed or specific typing
  constructor(t = new nc(), r) {
    this.systemService = t, this.historyService = r;
  }
  async getAvailableUpdates() {
    try {
      console.log("[WingetService] Starting update check...");
      const t = ["list", "--upgrade-available", "--accept-source-agreements"], { stdout: r } = await xe("winget", t, {
        all: !0,
        reject: !1,
        timeout: 6e4,
        encoding: "utf8"
      });
      console.log("[WingetService] Winget command finished. Parsing output..."), console.log("[WingetService] Raw stdout length:", r.length), console.log("[WingetService] First 500 chars:", r.substring(0, 500));
      let n = this.parseWingetOutput(r);
      console.log("[WingetService] Parsed updates count:", n.length), n.length > 0 && console.log("[WingetService] First update:", JSON.stringify(n[0]));
      const s = r.includes("Se encontraron varios paquetes instalados") || r.includes("coinciden con los criterios de entrada"), o = r.includes("0x8a15005e") || r.includes("0x8a150001");
      if (n.length === 0 && (o || s)) {
        console.warn("[WingetService] Source error or Ambiguous output detected. Retrying with minimal flags..."), o && await this.ensureSourcesHealthy();
        const { stdout: i } = await xe("winget", ["upgrade", "--accept-source-agreements", "--accept-package-agreements"], {
          all: !0,
          reject: !1,
          timeout: 45e3,
          encoding: "utf8"
        });
        n = this.parseWingetOutput(i);
      }
      if (this.historyService) {
        const i = this.historyService.getHistory();
        n = n.map((a) => {
          const c = i.find((l) => l.id === a.id && l.version === a.available);
          return c && (c.status === "inapplicable" || c.status === "skipped") ? { ...a, previousStatus: c.status, previousDetails: c.details } : a;
        });
      }
      return console.log(`[WingetService] Parsed ${n.length} updates after filtering.`), n;
    } catch (t) {
      throw console.error("[WingetService] Failed to check updates:", t), t;
    }
  }
  async ensureSourcesHealthy() {
    try {
      console.log("[WingetService] Resetting winget sources..."), await xe("winget", ["source", "reset", "--force"], { timeout: 3e4 }), await xe("winget", ["source", "update"], { timeout: 6e4 });
    } catch (t) {
      console.error("[WingetService] Failed to heal sources:", t);
    }
  }
  async installUpdate(t, r) {
    console.log(`[WingetService] Installing update: ${t}`);
    const n = this.systemService.getWingetArch(), s = [
      "upgrade",
      "--id",
      t,
      "--silent",
      "--force",
      "--architecture",
      n,
      "--include-unknown",
      "--accept-package-agreements",
      "--accept-source-agreements"
    ], o = async (i) => {
      const a = xe("winget", i);
      r && a.stdout && a.stdout.on("data", (c) => {
        const l = c.toString().trim();
        l && r(l);
      });
      try {
        await a;
      } catch (c) {
        const l = c.exitCode;
        throw l === 3010 || l === -1978335206 ? new Error(`RebootRequired: The update for ${t} was installed but a system restart is required.`) : l === -1978335227 ? new Error(`AppInUse: Could not update ${t} because it is currently running.`) : c;
      }
    };
    try {
      await o(s);
    } catch (i) {
      const a = i.message.includes("Inapplicable") || i.stdout?.includes("No se ha encontrado ninguna actualización aplicable") || i.stdout?.includes("No se encontró ningún paquete") || i.stdout?.includes("No applicable update found") || i.stdout?.includes("No update needed") || i.exitCode === -1978335221, c = i.exitCode === 2316632107 || i.exitCode === -1978335189 || i.stdout?.includes("tecnología de instalación es diferente") || i.stdout?.includes("installation technology is different"), l = i.exitCode === 2316632081 || i.stdout?.includes("Installer hash does not match") || i.stdout?.includes("El hash del instalador no coincide"), u = i.exitCode === 6 || i.stdout?.includes("Files modified by the installer are currently in use") || i.stdout?.includes("Otra aplicación está usando los archivos modificados") || i.stdout?.includes("File in use") || i.stdout?.includes("Archivo en uso");
      if (l)
        throw console.warn(`[WingetService] Hash mismatch for ${t}. Security risk.`), new Error("HashMismatch: Installer security check failed. The vendor may have changed the file.");
      if (u)
        throw console.warn(`[WingetService] File in use for ${t}.`), new Error("AppInUse: The application is currently running. Please close it.");
      if (a || c) {
        if (console.warn(`[WingetService] Update for ${t} is inapplicable/mismatch. Retrying with force for good measure, or failing gracefully.`), c) {
          console.warn(`[WingetService] Tech mismatch for ${t}. Attempting fallback to 'install --force'...`);
          try {
            await xe("winget", [
              "install",
              "--id",
              t,
              "--silent",
              "--force",
              "--architecture",
              n,
              "--accept-package-agreements",
              "--accept-source-agreements"
            ]), console.log(`[WingetService] Force install fallback for ${t} succeeded.`);
            return;
          } catch (p) {
            throw console.error(`[WingetService] Force install fallback for ${t} failed:`, p), new Error("Inapplicable: Manual uninstall required. Different installation technology and force install failed.");
          }
        }
        try {
          await o([...s, "--force"]), console.log(`[WingetService] Force update for ${t} succeeded.`);
          return;
        } catch {
          throw console.error(`[WingetService] Force update for ${t} also failed.`), new Error(`Inapplicable: The installer reports no update is needed for ${t} on this system, or the package ID is temporarily unreachable.`);
        }
      }
      throw i;
    }
  }
  async installAll() {
    console.log("[WingetService] Installing all updates...");
    const t = this.systemService.getWingetArch();
    await xe("winget", [
      "upgrade",
      "--all",
      "--include-unknown",
      "--architecture",
      t,
      "--accept-source-agreements",
      "--accept-package-agreements",
      "--silent"
    ]);
  }
  async isElevated() {
    try {
      return await xe("net", ["session"], { reject: !0 }), !0;
    } catch {
      return !1;
    }
  }
  parseWingetOutput(t) {
    let r = t.replace(/\x1b\[[0-9;]*m/g, "");
    r = r.replace(/\r/g, `
`);
    const n = r.split(`
`), s = [];
    let o = n.findIndex((m) => {
      const b = m.trim();
      return (b.includes("Id") || b.includes("ID")) && (b.includes("Version") || b.includes("Versión") || b.includes("Versin"));
    });
    if (console.log("[WingetService] Header index:", o), o >= 0 && console.log("[WingetService] Header line:", n[o]), o === -1)
      return t.includes("No se han encontrado actualizaciones") || t.includes("No updates found") || t.includes("reajusta tu") || t.includes("up to date") || t.includes("está actualizado") || t.trim() === "" || console.warn("[WingetService] Could not find header in winget output."), [];
    const i = n[o], a = (m) => {
      for (const b of m) {
        const _ = i.indexOf(b);
        if (_ !== -1) return _;
      }
      return -1;
    }, c = a(["Id", "ID"]), l = a(["Versión", "Version", "Versin"]), u = a(["Disponible", "Available", "Disponble"]), p = a(["Origen", "Source"]);
    if (console.log("[WingetService] Column positions - Id:", c, "Version:", l, "Available:", u, "Source:", p), c === -1 || l === -1 || u === -1) {
      const m = n[o + 1] || "", b = Array.from(m.matchAll(/-+/g));
      if (b.length < 4) return [];
      const _ = b.map((y) => ({ start: y.index, end: y.index + y[0].length })), f = n.slice(o + 2);
      for (const y of f)
        !y.trim() || y.includes("actualizaciones disponibles") || s.push({
          name: y.substring(0, _[1].start).trim(),
          id: y.substring(_[1].start, _[1].end).trim(),
          version: y.substring(_[2].start, _[2].end).trim(),
          available: y.substring(_[3].start, _[3].end).trim(),
          source: _[4] ? y.substring(_[4].start).trim() : "winget"
        });
      return s;
    }
    const h = n.slice(o + 2);
    console.log("[WingetService] Processing", h.length, "data lines");
    for (const m of h) {
      if (!m.trim() || m.includes("actualizaciones disponibles") || m.startsWith("No se han") || m.trim().startsWith("-") || // Skip separator lines
      /^\d+\s+paquete/.test(m.trim()) || // Skip footer notes (ES)
      /^\d+\s+package/.test(m.trim())) {
        console.log("[WingetService] Skipping line:", m.substring(0, 50));
        continue;
      }
      const b = m.substring(0, c).trim(), _ = m.substring(c, l).trim(), f = m.substring(l, u).trim(), y = p !== -1 ? m.substring(u, p).trim() : m.substring(u).trim(), d = p !== -1 ? m.substring(p).trim() : "winget";
      console.log("[WingetService] Parsed line - Name:", b, "ID:", _, "Version:", f, "Available:", y), _ && _ !== "-" && _ !== "ID" ? s.push({ name: b, id: _, version: f, available: y, source: d }) : console.log("[WingetService] Rejected - invalid ID");
    }
    return s;
  }
}
class XE {
  async createRestorePoint(t = "All Updater Auto-Restore") {
    try {
      const r = (/* @__PURE__ */ new Date()).toLocaleString(), n = `${t} (${r})`, s = await xe("powershell", [
        "-Command",
        `Checkpoint-Computer -Description "${n}" -RestorePointType "MODIFY_SETTINGS" -ErrorAction Stop`
      ]);
      return s.stdout && console.log("[Restore] stdout:", s.stdout), s.stderr && console.error("[Restore] stderr:", s.stderr), !0;
    } catch (r) {
      return console.error("[Restore] Failed to create restore point:", r), !1;
    }
  }
}
const Nt = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, ty = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), ry = 1e6, YE = (e) => e >= "0" && e <= "9";
function ny(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= ry;
  }
  return !1;
}
function mo(e, t) {
  return ty.has(e) ? !1 : (e && ny(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function QE(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let r = "", n = "start", s = !1, o = 0;
  for (const i of e) {
    if (o++, s) {
      r += i, s = !1;
      continue;
    }
    if (i === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${i}' in an index at position ${o}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${i}' after an index at position ${o}`);
      s = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (i) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${i}' in an index at position ${o}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!mo(r, t))
          return [];
        r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${i}' in an index at position ${o}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((r || n === "property") && !mo(r, t))
            return [];
          r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          if (r === "")
            r = (t.pop() || "") + "[]", n = "property";
          else {
            const a = Number.parseInt(r, 10);
            !Number.isNaN(a) && Number.isFinite(a) && a >= 0 && a <= Number.MAX_SAFE_INTEGER && a <= ry && r === String(a) ? t.push(a) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${i}' after an index at position ${o}`);
        r += i;
        break;
      }
      default: {
        if (n === "index" && !YE(i))
          throw new Error(`Invalid character '${i}' in an index at position ${o}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${i}' after an index at position ${o}`);
        n === "start" && (n = "property"), r += i;
      }
    }
  }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (!mo(r, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function ks(e) {
  if (typeof e == "string")
    return QE(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (ty.has(n))
        return [];
      typeof n == "string" && ny(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function vu(e, t, r) {
  if (!Nt(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = ks(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const o = n[s];
    if (e = e[o], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function br(e, t, r) {
  if (!Nt(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, s = ks(t);
  if (s.length === 0)
    return e;
  for (let o = 0; o < s.length; o++) {
    const i = s[o];
    if (o === s.length - 1)
      e[i] = r;
    else if (!Nt(e[i])) {
      const c = typeof s[o + 1] == "number";
      e[i] = c ? [] : {};
    }
    e = e[i];
  }
  return n;
}
function ZE(e, t) {
  if (!Nt(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ks(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, s) ? (delete e[s], !0) : !1;
    if (e = e[s], !Nt(e))
      return !1;
  }
}
function yo(e, t) {
  if (!Nt(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ks(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!Nt(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const ut = ba.homedir(), sc = ba.tmpdir(), { env: xt } = te, eR = (e) => {
  const t = Z.join(ut, "Library");
  return {
    data: Z.join(t, "Application Support", e),
    config: Z.join(t, "Preferences", e),
    cache: Z.join(t, "Caches", e),
    log: Z.join(t, "Logs", e),
    temp: Z.join(sc, e)
  };
}, tR = (e) => {
  const t = xt.APPDATA || Z.join(ut, "AppData", "Roaming"), r = xt.LOCALAPPDATA || Z.join(ut, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: Z.join(r, e, "Data"),
    config: Z.join(t, e, "Config"),
    cache: Z.join(r, e, "Cache"),
    log: Z.join(r, e, "Log"),
    temp: Z.join(sc, e)
  };
}, rR = (e) => {
  const t = Z.basename(ut);
  return {
    data: Z.join(xt.XDG_DATA_HOME || Z.join(ut, ".local", "share"), e),
    config: Z.join(xt.XDG_CONFIG_HOME || Z.join(ut, ".config"), e),
    cache: Z.join(xt.XDG_CACHE_HOME || Z.join(ut, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: Z.join(xt.XDG_STATE_HOME || Z.join(ut, ".local", "state"), e),
    temp: Z.join(sc, t, e)
  };
};
function nR(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), te.platform === "darwin" ? eR(e) : te.platform === "win32" ? tR(e) : rR(e);
}
const rt = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    return e.apply(void 0, s).catch(r);
  };
}, He = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    try {
      return e.apply(void 0, s);
    } catch (o) {
      return r(o);
    }
  };
}, sR = 250, nt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: o } = s, i = s.interval ?? sR, a = Date.now() + o;
    return function c(...l) {
      return e.apply(void 0, l).catch((u) => {
        if (!r(u) || Date.now() >= a)
          throw u;
        const p = Math.round(i * Math.random());
        return p > 0 ? new Promise((m) => setTimeout(m, p)).then(() => c.apply(void 0, l)) : c.apply(void 0, l);
      });
    };
  };
}, st = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: o } = s, i = Date.now() + o;
    return function(...c) {
      for (; ; )
        try {
          return e.apply(void 0, c);
        } catch (l) {
          if (!r(l) || Date.now() >= i)
            throw l;
          continue;
        }
    };
  };
}, Gt = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!Gt.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !oR && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!Gt.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Gt.isNodeError(e))
      throw e;
    if (!Gt.isChangeErrorOk(e))
      throw e;
  }
}, Sr = {
  onError: Gt.onChangeError
}, Ie = {
  onError: () => {
  }
}, oR = te.getuid ? !te.getuid() : !1, $e = {
  isRetriable: Gt.isRetriableError
}, be = {
  attempt: {
    /* ASYNC */
    chmod: rt(ye(ee.chmod), Sr),
    chown: rt(ye(ee.chown), Sr),
    close: rt(ye(ee.close), Ie),
    fsync: rt(ye(ee.fsync), Ie),
    mkdir: rt(ye(ee.mkdir), Ie),
    realpath: rt(ye(ee.realpath), Ie),
    stat: rt(ye(ee.stat), Ie),
    unlink: rt(ye(ee.unlink), Ie),
    /* SYNC */
    chmodSync: He(ee.chmodSync, Sr),
    chownSync: He(ee.chownSync, Sr),
    closeSync: He(ee.closeSync, Ie),
    existsSync: He(ee.existsSync, Ie),
    fsyncSync: He(ee.fsync, Ie),
    mkdirSync: He(ee.mkdirSync, Ie),
    realpathSync: He(ee.realpathSync, Ie),
    statSync: He(ee.statSync, Ie),
    unlinkSync: He(ee.unlinkSync, Ie)
  },
  retry: {
    /* ASYNC */
    close: nt(ye(ee.close), $e),
    fsync: nt(ye(ee.fsync), $e),
    open: nt(ye(ee.open), $e),
    readFile: nt(ye(ee.readFile), $e),
    rename: nt(ye(ee.rename), $e),
    stat: nt(ye(ee.stat), $e),
    write: nt(ye(ee.write), $e),
    writeFile: nt(ye(ee.writeFile), $e),
    /* SYNC */
    closeSync: st(ee.closeSync, $e),
    fsyncSync: st(ee.fsyncSync, $e),
    openSync: st(ee.openSync, $e),
    readFileSync: st(ee.readFileSync, $e),
    renameSync: st(ee.renameSync, $e),
    statSync: st(ee.statSync, $e),
    writeSync: st(ee.writeSync, $e),
    writeFileSync: st(ee.writeFileSync, $e)
  }
}, iR = "utf8", wu = 438, aR = 511, cR = {}, uR = te.geteuid ? te.geteuid() : -1, lR = te.getegid ? te.getegid() : -1, dR = 1e3, fR = !!te.getuid;
te.getuid && te.getuid();
const $u = 128, hR = (e) => e instanceof Error && "code" in e, _u = (e) => typeof e == "string", go = (e) => e === void 0, pR = te.platform === "linux", sy = te.platform === "win32", oc = ["SIGHUP", "SIGINT", "SIGTERM"];
sy || oc.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
pR && oc.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class mR {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (sy && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? te.kill(te.pid, "SIGTERM") : te.kill(te.pid, t));
      }
    }, this.hook = () => {
      te.once("exit", () => this.exit());
      for (const t of oc)
        try {
          te.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const yR = new mR(), gR = yR.register, Se = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = Se.truncate(t(e));
    return n in Se.store ? Se.get(e, t, r) : (Se.store[n] = r, [n, () => delete Se.store[n]]);
  },
  purge: (e) => {
    Se.store[e] && (delete Se.store[e], be.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Se.store[e] && (delete Se.store[e], be.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Se.store)
      Se.purgeSync(e);
  },
  truncate: (e) => {
    const t = Z.basename(e);
    if (t.length <= $u)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - $u;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
gR(Se.purgeSyncAll);
function oy(e, t, r = cR) {
  if (_u(r))
    return oy(e, t, { encoding: r });
  const s = { timeout: r.timeout ?? dR };
  let o = null, i = null, a = null;
  try {
    const c = be.attempt.realpathSync(e), l = !!c;
    e = c || e, [i, o] = Se.get(e, r.tmpCreate || Se.create, r.tmpPurge !== !1);
    const u = fR && go(r.chown), p = go(r.mode);
    if (l && (u || p)) {
      const h = be.attempt.statSync(e);
      h && (r = { ...r }, u && (r.chown = { uid: h.uid, gid: h.gid }), p && (r.mode = h.mode));
    }
    if (!l) {
      const h = Z.dirname(e);
      be.attempt.mkdirSync(h, {
        mode: aR,
        recursive: !0
      });
    }
    a = be.retry.openSync(s)(i, "w", r.mode || wu), r.tmpCreated && r.tmpCreated(i), _u(t) ? be.retry.writeSync(s)(a, t, 0, r.encoding || iR) : go(t) || be.retry.writeSync(s)(a, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? be.retry.fsyncSync(s)(a) : be.attempt.fsync(a)), be.retry.closeSync(s)(a), a = null, r.chown && (r.chown.uid !== uR || r.chown.gid !== lR) && be.attempt.chownSync(i, r.chown.uid, r.chown.gid), r.mode && r.mode !== wu && be.attempt.chmodSync(i, r.mode);
    try {
      be.retry.renameSync(s)(i, e);
    } catch (h) {
      if (!hR(h) || h.code !== "ENAMETOOLONG")
        throw h;
      be.retry.renameSync(s)(i, Se.truncate(e));
    }
    o(), i = null;
  } finally {
    a && be.attempt.closeSync(a), i && Se.purge(i);
  }
}
var Er = { exports: {} }, vo = {}, Je = {}, vt = {}, wo = {}, $o = {}, _o = {}, bu;
function _s() {
  return bu || (bu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class t {
    }
    e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class r extends t {
      constructor(d) {
        if (super(), !e.IDENTIFIER.test(d))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = d;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = r;
    class n extends t {
      constructor(d) {
        super(), this._items = typeof d == "string" ? [d] : d;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const d = this._items[0];
        return d === "" || d === '""';
      }
      get str() {
        var d;
        return (d = this._str) !== null && d !== void 0 ? d : this._str = this._items.reduce((v, S) => `${v}${S}`, "");
      }
      get names() {
        var d;
        return (d = this._names) !== null && d !== void 0 ? d : this._names = this._items.reduce((v, S) => (S instanceof r && (v[S.str] = (v[S.str] || 0) + 1), v), {});
      }
    }
    e._Code = n, e.nil = new n("");
    function s(y, ...d) {
      const v = [y[0]];
      let S = 0;
      for (; S < d.length; )
        a(v, d[S]), v.push(y[++S]);
      return new n(v);
    }
    e._ = s;
    const o = new n("+");
    function i(y, ...d) {
      const v = [m(y[0])];
      let S = 0;
      for (; S < d.length; )
        v.push(o), a(v, d[S]), v.push(o, m(y[++S]));
      return c(v), new n(v);
    }
    e.str = i;
    function a(y, d) {
      d instanceof n ? y.push(...d._items) : d instanceof r ? y.push(d) : y.push(p(d));
    }
    e.addCodeArg = a;
    function c(y) {
      let d = 1;
      for (; d < y.length - 1; ) {
        if (y[d] === o) {
          const v = l(y[d - 1], y[d + 1]);
          if (v !== void 0) {
            y.splice(d - 1, 3, v);
            continue;
          }
          y[d++] = "+";
        }
        d++;
      }
    }
    function l(y, d) {
      if (d === '""')
        return y;
      if (y === '""')
        return d;
      if (typeof y == "string")
        return d instanceof r || y[y.length - 1] !== '"' ? void 0 : typeof d != "string" ? `${y.slice(0, -1)}${d}"` : d[0] === '"' ? y.slice(0, -1) + d.slice(1) : void 0;
      if (typeof d == "string" && d[0] === '"' && !(y instanceof r))
        return `"${y}${d.slice(1)}`;
    }
    function u(y, d) {
      return d.emptyStr() ? y : y.emptyStr() ? d : i`${y}${d}`;
    }
    e.strConcat = u;
    function p(y) {
      return typeof y == "number" || typeof y == "boolean" || y === null ? y : m(Array.isArray(y) ? y.join(",") : y);
    }
    function h(y) {
      return new n(m(y));
    }
    e.stringify = h;
    function m(y) {
      return JSON.stringify(y).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = m;
    function b(y) {
      return typeof y == "string" && e.IDENTIFIER.test(y) ? new n(`.${y}`) : s`[${y}]`;
    }
    e.getProperty = b;
    function _(y) {
      if (typeof y == "string" && e.IDENTIFIER.test(y))
        return new n(`${y}`);
      throw new Error(`CodeGen: invalid export name: ${y}, use explicit $id name mapping`);
    }
    e.getEsmExportName = _;
    function f(y) {
      return new n(y.toString());
    }
    e.regexpCode = f;
  })(_o)), _o;
}
var bo = {}, Su;
function Eu() {
  return Su || (Su = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const t = _s();
    class r extends Error {
      constructor(l) {
        super(`CodeGen: "code" for ${l} not defined`), this.value = l.value;
      }
    }
    var n;
    (function(c) {
      c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
    })(n || (e.UsedValueState = n = {})), e.varKinds = {
      const: new t.Name("const"),
      let: new t.Name("let"),
      var: new t.Name("var")
    };
    class s {
      constructor({ prefixes: l, parent: u } = {}) {
        this._names = {}, this._prefixes = l, this._parent = u;
      }
      toName(l) {
        return l instanceof t.Name ? l : this.name(l);
      }
      name(l) {
        return new t.Name(this._newName(l));
      }
      _newName(l) {
        const u = this._names[l] || this._nameGroup(l);
        return `${l}${u.index++}`;
      }
      _nameGroup(l) {
        var u, p;
        if (!((p = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || p === void 0) && p.has(l) || this._prefixes && !this._prefixes.has(l))
          throw new Error(`CodeGen: prefix "${l}" is not allowed in this scope`);
        return this._names[l] = { prefix: l, index: 0 };
      }
    }
    e.Scope = s;
    class o extends t.Name {
      constructor(l, u) {
        super(u), this.prefix = l;
      }
      setValue(l, { property: u, itemIndex: p }) {
        this.value = l, this.scopePath = (0, t._)`.${new t.Name(u)}[${p}]`;
      }
    }
    e.ValueScopeName = o;
    const i = (0, t._)`\n`;
    class a extends s {
      constructor(l) {
        super(l), this._values = {}, this._scope = l.scope, this.opts = { ...l, _n: l.lines ? i : t.nil };
      }
      get() {
        return this._scope;
      }
      name(l) {
        return new o(l, this._newName(l));
      }
      value(l, u) {
        var p;
        if (u.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const h = this.toName(l), { prefix: m } = h, b = (p = u.key) !== null && p !== void 0 ? p : u.ref;
        let _ = this._values[m];
        if (_) {
          const d = _.get(b);
          if (d)
            return d;
        } else
          _ = this._values[m] = /* @__PURE__ */ new Map();
        _.set(b, h);
        const f = this._scope[m] || (this._scope[m] = []), y = f.length;
        return f[y] = u.ref, h.setValue(u, { property: m, itemIndex: y }), h;
      }
      getValue(l, u) {
        const p = this._values[l];
        if (p)
          return p.get(u);
      }
      scopeRefs(l, u = this._values) {
        return this._reduceValues(u, (p) => {
          if (p.scopePath === void 0)
            throw new Error(`CodeGen: name "${p}" has no value`);
          return (0, t._)`${l}${p.scopePath}`;
        });
      }
      scopeCode(l = this._values, u, p) {
        return this._reduceValues(l, (h) => {
          if (h.value === void 0)
            throw new Error(`CodeGen: name "${h}" has no value`);
          return h.value.code;
        }, u, p);
      }
      _reduceValues(l, u, p = {}, h) {
        let m = t.nil;
        for (const b in l) {
          const _ = l[b];
          if (!_)
            continue;
          const f = p[b] = p[b] || /* @__PURE__ */ new Map();
          _.forEach((y) => {
            if (f.has(y))
              return;
            f.set(y, n.Started);
            let d = u(y);
            if (d) {
              const v = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              m = (0, t._)`${m}${v} ${y} = ${d};${this.opts._n}`;
            } else if (d = h?.(y))
              m = (0, t._)`${m}${d}${this.opts._n}`;
            else
              throw new r(y);
            f.set(y, n.Completed);
          });
        }
        return m;
      }
    }
    e.ValueScope = a;
  })(bo)), bo;
}
var Ru;
function re() {
  return Ru || (Ru = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const t = _s(), r = Eu();
    var n = _s();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return n._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return n.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return n.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return n.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return n.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return n.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return n.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return n.Name;
    } });
    var s = Eu();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return s.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return s.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return s.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return s.varKinds;
    } }), e.operators = {
      GT: new t._Code(">"),
      GTE: new t._Code(">="),
      LT: new t._Code("<"),
      LTE: new t._Code("<="),
      EQ: new t._Code("==="),
      NEQ: new t._Code("!=="),
      NOT: new t._Code("!"),
      OR: new t._Code("||"),
      AND: new t._Code("&&"),
      ADD: new t._Code("+")
    };
    class o {
      optimizeNodes() {
        return this;
      }
      optimizeNames(w, R) {
        return this;
      }
    }
    class i extends o {
      constructor(w, R, A) {
        super(), this.varKind = w, this.name = R, this.rhs = A;
      }
      render({ es5: w, _n: R }) {
        const A = w ? r.varKinds.var : this.varKind, x = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${A} ${this.name}${x};` + R;
      }
      optimizeNames(w, R) {
        if (w[this.name.str])
          return this.rhs && (this.rhs = L(this.rhs, w, R)), this;
      }
      get names() {
        return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
      }
    }
    class a extends o {
      constructor(w, R, A) {
        super(), this.lhs = w, this.rhs = R, this.sideEffects = A;
      }
      render({ _n: w }) {
        return `${this.lhs} = ${this.rhs};` + w;
      }
      optimizeNames(w, R) {
        if (!(this.lhs instanceof t.Name && !w[this.lhs.str] && !this.sideEffects))
          return this.rhs = L(this.rhs, w, R), this;
      }
      get names() {
        const w = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
        return z(w, this.rhs);
      }
    }
    class c extends a {
      constructor(w, R, A, x) {
        super(w, A, x), this.op = R;
      }
      render({ _n: w }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + w;
      }
    }
    class l extends o {
      constructor(w) {
        super(), this.label = w, this.names = {};
      }
      render({ _n: w }) {
        return `${this.label}:` + w;
      }
    }
    class u extends o {
      constructor(w) {
        super(), this.label = w, this.names = {};
      }
      render({ _n: w }) {
        return `break${this.label ? ` ${this.label}` : ""};` + w;
      }
    }
    class p extends o {
      constructor(w) {
        super(), this.error = w;
      }
      render({ _n: w }) {
        return `throw ${this.error};` + w;
      }
      get names() {
        return this.error.names;
      }
    }
    class h extends o {
      constructor(w) {
        super(), this.code = w;
      }
      render({ _n: w }) {
        return `${this.code};` + w;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(w, R) {
        return this.code = L(this.code, w, R), this;
      }
      get names() {
        return this.code instanceof t._CodeOrName ? this.code.names : {};
      }
    }
    class m extends o {
      constructor(w = []) {
        super(), this.nodes = w;
      }
      render(w) {
        return this.nodes.reduce((R, A) => R + A.render(w), "");
      }
      optimizeNodes() {
        const { nodes: w } = this;
        let R = w.length;
        for (; R--; ) {
          const A = w[R].optimizeNodes();
          Array.isArray(A) ? w.splice(R, 1, ...A) : A ? w[R] = A : w.splice(R, 1);
        }
        return w.length > 0 ? this : void 0;
      }
      optimizeNames(w, R) {
        const { nodes: A } = this;
        let x = A.length;
        for (; x--; ) {
          const B = A[x];
          B.optimizeNames(w, R) || (U(w, B.names), A.splice(x, 1));
        }
        return A.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((w, R) => V(w, R.names), {});
      }
    }
    class b extends m {
      render(w) {
        return "{" + w._n + super.render(w) + "}" + w._n;
      }
    }
    class _ extends m {
    }
    class f extends b {
    }
    f.kind = "else";
    class y extends b {
      constructor(w, R) {
        super(R), this.condition = w;
      }
      render(w) {
        let R = `if(${this.condition})` + super.render(w);
        return this.else && (R += "else " + this.else.render(w)), R;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const w = this.condition;
        if (w === !0)
          return this.nodes;
        let R = this.else;
        if (R) {
          const A = R.optimizeNodes();
          R = this.else = Array.isArray(A) ? new f(A) : A;
        }
        if (R)
          return w === !1 ? R instanceof y ? R : R.nodes : this.nodes.length ? this : new y(H(w), R instanceof y ? [R] : R.nodes);
        if (!(w === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(w, R) {
        var A;
        if (this.else = (A = this.else) === null || A === void 0 ? void 0 : A.optimizeNames(w, R), !!(super.optimizeNames(w, R) || this.else))
          return this.condition = L(this.condition, w, R), this;
      }
      get names() {
        const w = super.names;
        return z(w, this.condition), this.else && V(w, this.else.names), w;
      }
    }
    y.kind = "if";
    class d extends b {
    }
    d.kind = "for";
    class v extends d {
      constructor(w) {
        super(), this.iteration = w;
      }
      render(w) {
        return `for(${this.iteration})` + super.render(w);
      }
      optimizeNames(w, R) {
        if (super.optimizeNames(w, R))
          return this.iteration = L(this.iteration, w, R), this;
      }
      get names() {
        return V(super.names, this.iteration.names);
      }
    }
    class S extends d {
      constructor(w, R, A, x) {
        super(), this.varKind = w, this.name = R, this.from = A, this.to = x;
      }
      render(w) {
        const R = w.es5 ? r.varKinds.var : this.varKind, { name: A, from: x, to: B } = this;
        return `for(${R} ${A}=${x}; ${A}<${B}; ${A}++)` + super.render(w);
      }
      get names() {
        const w = z(super.names, this.from);
        return z(w, this.to);
      }
    }
    class g extends d {
      constructor(w, R, A, x) {
        super(), this.loop = w, this.varKind = R, this.name = A, this.iterable = x;
      }
      render(w) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(w);
      }
      optimizeNames(w, R) {
        if (super.optimizeNames(w, R))
          return this.iterable = L(this.iterable, w, R), this;
      }
      get names() {
        return V(super.names, this.iterable.names);
      }
    }
    class $ extends b {
      constructor(w, R, A) {
        super(), this.name = w, this.args = R, this.async = A;
      }
      render(w) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(w);
      }
    }
    $.kind = "func";
    class E extends m {
      render(w) {
        return "return " + super.render(w);
      }
    }
    E.kind = "return";
    class I extends b {
      render(w) {
        let R = "try" + super.render(w);
        return this.catch && (R += this.catch.render(w)), this.finally && (R += this.finally.render(w)), R;
      }
      optimizeNodes() {
        var w, R;
        return super.optimizeNodes(), (w = this.catch) === null || w === void 0 || w.optimizeNodes(), (R = this.finally) === null || R === void 0 || R.optimizeNodes(), this;
      }
      optimizeNames(w, R) {
        var A, x;
        return super.optimizeNames(w, R), (A = this.catch) === null || A === void 0 || A.optimizeNames(w, R), (x = this.finally) === null || x === void 0 || x.optimizeNames(w, R), this;
      }
      get names() {
        const w = super.names;
        return this.catch && V(w, this.catch.names), this.finally && V(w, this.finally.names), w;
      }
    }
    class k extends b {
      constructor(w) {
        super(), this.error = w;
      }
      render(w) {
        return `catch(${this.error})` + super.render(w);
      }
    }
    k.kind = "catch";
    class F extends b {
      render(w) {
        return "finally" + super.render(w);
      }
    }
    F.kind = "finally";
    class M {
      constructor(w, R = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...R, _n: R.lines ? `
` : "" }, this._extScope = w, this._scope = new r.Scope({ parent: w }), this._nodes = [new _()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(w) {
        return this._scope.name(w);
      }
      // reserves unique name in the external scope
      scopeName(w) {
        return this._extScope.name(w);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(w, R) {
        const A = this._extScope.value(w, R);
        return (this._values[A.prefix] || (this._values[A.prefix] = /* @__PURE__ */ new Set())).add(A), A;
      }
      getScopeValue(w, R) {
        return this._extScope.getValue(w, R);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(w) {
        return this._extScope.scopeRefs(w, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(w, R, A, x) {
        const B = this._scope.toName(R);
        return A !== void 0 && x && (this._constants[B.str] = A), this._leafNode(new i(w, B, A)), B;
      }
      // `const` declaration (`var` in es5 mode)
      const(w, R, A) {
        return this._def(r.varKinds.const, w, R, A);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(w, R, A) {
        return this._def(r.varKinds.let, w, R, A);
      }
      // `var` declaration with optional assignment
      var(w, R, A) {
        return this._def(r.varKinds.var, w, R, A);
      }
      // assignment code
      assign(w, R, A) {
        return this._leafNode(new a(w, R, A));
      }
      // `+=` code
      add(w, R) {
        return this._leafNode(new c(w, e.operators.ADD, R));
      }
      // appends passed SafeExpr to code or executes Block
      code(w) {
        return typeof w == "function" ? w() : w !== t.nil && this._leafNode(new h(w)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...w) {
        const R = ["{"];
        for (const [A, x] of w)
          R.length > 1 && R.push(","), R.push(A), (A !== x || this.opts.es5) && (R.push(":"), (0, t.addCodeArg)(R, x));
        return R.push("}"), new t._Code(R);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(w, R, A) {
        if (this._blockNode(new y(w)), R && A)
          this.code(R).else().code(A).endIf();
        else if (R)
          this.code(R).endIf();
        else if (A)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(w) {
        return this._elseNode(new y(w));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new f());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(y, f);
      }
      _for(w, R) {
        return this._blockNode(w), R && this.code(R).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(w, R) {
        return this._for(new v(w), R);
      }
      // `for` statement for a range of values
      forRange(w, R, A, x, B = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
        const Q = this._scope.toName(w);
        return this._for(new S(B, Q, R, A), () => x(Q));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(w, R, A, x = r.varKinds.const) {
        const B = this._scope.toName(w);
        if (this.opts.es5) {
          const Q = R instanceof t.Name ? R : this.var("_arr", R);
          return this.forRange("_i", 0, (0, t._)`${Q}.length`, (Y) => {
            this.var(B, (0, t._)`${Q}[${Y}]`), A(B);
          });
        }
        return this._for(new g("of", x, B, R), () => A(B));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(w, R, A, x = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(w, (0, t._)`Object.keys(${R})`, A);
        const B = this._scope.toName(w);
        return this._for(new g("in", x, B, R), () => A(B));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(d);
      }
      // `label` statement
      label(w) {
        return this._leafNode(new l(w));
      }
      // `break` statement
      break(w) {
        return this._leafNode(new u(w));
      }
      // `return` statement
      return(w) {
        const R = new E();
        if (this._blockNode(R), this.code(w), R.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(E);
      }
      // `try` statement
      try(w, R, A) {
        if (!R && !A)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const x = new I();
        if (this._blockNode(x), this.code(w), R) {
          const B = this.name("e");
          this._currNode = x.catch = new k(B), R(B);
        }
        return A && (this._currNode = x.finally = new F(), this.code(A)), this._endBlockNode(k, F);
      }
      // `throw` statement
      throw(w) {
        return this._leafNode(new p(w));
      }
      // start self-balancing block
      block(w, R) {
        return this._blockStarts.push(this._nodes.length), w && this.code(w).endBlock(R), this;
      }
      // end the current self-balancing block
      endBlock(w) {
        const R = this._blockStarts.pop();
        if (R === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const A = this._nodes.length - R;
        if (A < 0 || w !== void 0 && A !== w)
          throw new Error(`CodeGen: wrong number of nodes: ${A} vs ${w} expected`);
        return this._nodes.length = R, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(w, R = t.nil, A, x) {
        return this._blockNode(new $(w, R, A)), x && this.code(x).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode($);
      }
      optimize(w = 1) {
        for (; w-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(w) {
        return this._currNode.nodes.push(w), this;
      }
      _blockNode(w) {
        this._currNode.nodes.push(w), this._nodes.push(w);
      }
      _endBlockNode(w, R) {
        const A = this._currNode;
        if (A instanceof w || R && A instanceof R)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${R ? `${w.kind}/${R.kind}` : w.kind}"`);
      }
      _elseNode(w) {
        const R = this._currNode;
        if (!(R instanceof y))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = R.else = w, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const w = this._nodes;
        return w[w.length - 1];
      }
      set _currNode(w) {
        const R = this._nodes;
        R[R.length - 1] = w;
      }
    }
    e.CodeGen = M;
    function V(T, w) {
      for (const R in w)
        T[R] = (T[R] || 0) + (w[R] || 0);
      return T;
    }
    function z(T, w) {
      return w instanceof t._CodeOrName ? V(T, w.names) : T;
    }
    function L(T, w, R) {
      if (T instanceof t.Name)
        return A(T);
      if (!x(T))
        return T;
      return new t._Code(T._items.reduce((B, Q) => (Q instanceof t.Name && (Q = A(Q)), Q instanceof t._Code ? B.push(...Q._items) : B.push(Q), B), []));
      function A(B) {
        const Q = R[B.str];
        return Q === void 0 || w[B.str] !== 1 ? B : (delete w[B.str], Q);
      }
      function x(B) {
        return B instanceof t._Code && B._items.some((Q) => Q instanceof t.Name && w[Q.str] === 1 && R[Q.str] !== void 0);
      }
    }
    function U(T, w) {
      for (const R in w)
        T[R] = (T[R] || 0) - (w[R] || 0);
    }
    function H(T) {
      return typeof T == "boolean" || typeof T == "number" || T === null ? !T : (0, t._)`!${j(T)}`;
    }
    e.not = H;
    const K = O(e.operators.AND);
    function W(...T) {
      return T.reduce(K);
    }
    e.and = W;
    const X = O(e.operators.OR);
    function C(...T) {
      return T.reduce(X);
    }
    e.or = C;
    function O(T) {
      return (w, R) => w === t.nil ? R : R === t.nil ? w : (0, t._)`${j(w)} ${T} ${j(R)}`;
    }
    function j(T) {
      return T instanceof t.Name ? T : (0, t._)`(${T})`;
    }
  })($o)), $o;
}
var ne = {}, Pu;
function ie() {
  if (Pu) return ne;
  Pu = 1, Object.defineProperty(ne, "__esModule", { value: !0 }), ne.checkStrictMode = ne.getErrorPath = ne.Type = ne.useFunc = ne.setEvaluated = ne.evaluatedPropsToName = ne.mergeEvaluated = ne.eachItem = ne.unescapeJsonPointer = ne.escapeJsonPointer = ne.escapeFragment = ne.unescapeFragment = ne.schemaRefOrVal = ne.schemaHasRulesButRef = ne.schemaHasRules = ne.checkUnknownRules = ne.alwaysValidSchema = ne.toHash = void 0;
  const e = re(), t = _s();
  function r(g) {
    const $ = {};
    for (const E of g)
      $[E] = !0;
    return $;
  }
  ne.toHash = r;
  function n(g, $) {
    return typeof $ == "boolean" ? $ : Object.keys($).length === 0 ? !0 : (s(g, $), !o($, g.self.RULES.all));
  }
  ne.alwaysValidSchema = n;
  function s(g, $ = g.schema) {
    const { opts: E, self: I } = g;
    if (!E.strictSchema || typeof $ == "boolean")
      return;
    const k = I.RULES.keywords;
    for (const F in $)
      k[F] || S(g, `unknown keyword: "${F}"`);
  }
  ne.checkUnknownRules = s;
  function o(g, $) {
    if (typeof g == "boolean")
      return !g;
    for (const E in g)
      if ($[E])
        return !0;
    return !1;
  }
  ne.schemaHasRules = o;
  function i(g, $) {
    if (typeof g == "boolean")
      return !g;
    for (const E in g)
      if (E !== "$ref" && $.all[E])
        return !0;
    return !1;
  }
  ne.schemaHasRulesButRef = i;
  function a({ topSchemaRef: g, schemaPath: $ }, E, I, k) {
    if (!k) {
      if (typeof E == "number" || typeof E == "boolean")
        return E;
      if (typeof E == "string")
        return (0, e._)`${E}`;
    }
    return (0, e._)`${g}${$}${(0, e.getProperty)(I)}`;
  }
  ne.schemaRefOrVal = a;
  function c(g) {
    return p(decodeURIComponent(g));
  }
  ne.unescapeFragment = c;
  function l(g) {
    return encodeURIComponent(u(g));
  }
  ne.escapeFragment = l;
  function u(g) {
    return typeof g == "number" ? `${g}` : g.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  ne.escapeJsonPointer = u;
  function p(g) {
    return g.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  ne.unescapeJsonPointer = p;
  function h(g, $) {
    if (Array.isArray(g))
      for (const E of g)
        $(E);
    else
      $(g);
  }
  ne.eachItem = h;
  function m({ mergeNames: g, mergeToName: $, mergeValues: E, resultToName: I }) {
    return (k, F, M, V) => {
      const z = M === void 0 ? F : M instanceof e.Name ? (F instanceof e.Name ? g(k, F, M) : $(k, F, M), M) : F instanceof e.Name ? ($(k, M, F), F) : E(F, M);
      return V === e.Name && !(z instanceof e.Name) ? I(k, z) : z;
    };
  }
  ne.mergeEvaluated = {
    props: m({
      mergeNames: (g, $, E) => g.if((0, e._)`${E} !== true && ${$} !== undefined`, () => {
        g.if((0, e._)`${$} === true`, () => g.assign(E, !0), () => g.assign(E, (0, e._)`${E} || {}`).code((0, e._)`Object.assign(${E}, ${$})`));
      }),
      mergeToName: (g, $, E) => g.if((0, e._)`${E} !== true`, () => {
        $ === !0 ? g.assign(E, !0) : (g.assign(E, (0, e._)`${E} || {}`), _(g, E, $));
      }),
      mergeValues: (g, $) => g === !0 ? !0 : { ...g, ...$ },
      resultToName: b
    }),
    items: m({
      mergeNames: (g, $, E) => g.if((0, e._)`${E} !== true && ${$} !== undefined`, () => g.assign(E, (0, e._)`${$} === true ? true : ${E} > ${$} ? ${E} : ${$}`)),
      mergeToName: (g, $, E) => g.if((0, e._)`${E} !== true`, () => g.assign(E, $ === !0 ? !0 : (0, e._)`${E} > ${$} ? ${E} : ${$}`)),
      mergeValues: (g, $) => g === !0 ? !0 : Math.max(g, $),
      resultToName: (g, $) => g.var("items", $)
    })
  };
  function b(g, $) {
    if ($ === !0)
      return g.var("props", !0);
    const E = g.var("props", (0, e._)`{}`);
    return $ !== void 0 && _(g, E, $), E;
  }
  ne.evaluatedPropsToName = b;
  function _(g, $, E) {
    Object.keys(E).forEach((I) => g.assign((0, e._)`${$}${(0, e.getProperty)(I)}`, !0));
  }
  ne.setEvaluated = _;
  const f = {};
  function y(g, $) {
    return g.scopeValue("func", {
      ref: $,
      code: f[$.code] || (f[$.code] = new t._Code($.code))
    });
  }
  ne.useFunc = y;
  var d;
  (function(g) {
    g[g.Num = 0] = "Num", g[g.Str = 1] = "Str";
  })(d || (ne.Type = d = {}));
  function v(g, $, E) {
    if (g instanceof e.Name) {
      const I = $ === d.Num;
      return E ? I ? (0, e._)`"[" + ${g} + "]"` : (0, e._)`"['" + ${g} + "']"` : I ? (0, e._)`"/" + ${g}` : (0, e._)`"/" + ${g}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return E ? (0, e.getProperty)(g).toString() : "/" + u(g);
  }
  ne.getErrorPath = v;
  function S(g, $, E = g.opts.strictSchema) {
    if (E) {
      if ($ = `strict mode: ${$}`, E === !0)
        throw new Error($);
      g.self.logger.warn($);
    }
  }
  return ne.checkStrictMode = S, ne;
}
var Rr = {}, Ou;
function qe() {
  if (Ou) return Rr;
  Ou = 1, Object.defineProperty(Rr, "__esModule", { value: !0 });
  const e = re(), t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return Rr.default = t, Rr;
}
var Tu;
function Ms() {
  return Tu || (Tu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const t = re(), r = ie(), n = qe();
    e.keywordError = {
      message: ({ keyword: f }) => (0, t.str)`must pass "${f}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: f, schemaType: y }) => y ? (0, t.str)`"${f}" keyword must be ${y} ($data)` : (0, t.str)`"${f}" keyword is invalid ($data)`
    };
    function s(f, y = e.keywordError, d, v) {
      const { it: S } = f, { gen: g, compositeRule: $, allErrors: E } = S, I = p(f, y, d);
      v ?? ($ || E) ? c(g, I) : l(S, (0, t._)`[${I}]`);
    }
    e.reportError = s;
    function o(f, y = e.keywordError, d) {
      const { it: v } = f, { gen: S, compositeRule: g, allErrors: $ } = v, E = p(f, y, d);
      c(S, E), g || $ || l(v, n.default.vErrors);
    }
    e.reportExtraError = o;
    function i(f, y) {
      f.assign(n.default.errors, y), f.if((0, t._)`${n.default.vErrors} !== null`, () => f.if(y, () => f.assign((0, t._)`${n.default.vErrors}.length`, y), () => f.assign(n.default.vErrors, null)));
    }
    e.resetErrorsCount = i;
    function a({ gen: f, keyword: y, schemaValue: d, data: v, errsCount: S, it: g }) {
      if (S === void 0)
        throw new Error("ajv implementation error");
      const $ = f.name("err");
      f.forRange("i", S, n.default.errors, (E) => {
        f.const($, (0, t._)`${n.default.vErrors}[${E}]`), f.if((0, t._)`${$}.instancePath === undefined`, () => f.assign((0, t._)`${$}.instancePath`, (0, t.strConcat)(n.default.instancePath, g.errorPath))), f.assign((0, t._)`${$}.schemaPath`, (0, t.str)`${g.errSchemaPath}/${y}`), g.opts.verbose && (f.assign((0, t._)`${$}.schema`, d), f.assign((0, t._)`${$}.data`, v));
      });
    }
    e.extendErrors = a;
    function c(f, y) {
      const d = f.const("err", y);
      f.if((0, t._)`${n.default.vErrors} === null`, () => f.assign(n.default.vErrors, (0, t._)`[${d}]`), (0, t._)`${n.default.vErrors}.push(${d})`), f.code((0, t._)`${n.default.errors}++`);
    }
    function l(f, y) {
      const { gen: d, validateName: v, schemaEnv: S } = f;
      S.$async ? d.throw((0, t._)`new ${f.ValidationError}(${y})`) : (d.assign((0, t._)`${v}.errors`, y), d.return(!1));
    }
    const u = {
      keyword: new t.Name("keyword"),
      schemaPath: new t.Name("schemaPath"),
      // also used in JTD errors
      params: new t.Name("params"),
      propertyName: new t.Name("propertyName"),
      message: new t.Name("message"),
      schema: new t.Name("schema"),
      parentSchema: new t.Name("parentSchema")
    };
    function p(f, y, d) {
      const { createErrors: v } = f.it;
      return v === !1 ? (0, t._)`{}` : h(f, y, d);
    }
    function h(f, y, d = {}) {
      const { gen: v, it: S } = f, g = [
        m(S, d),
        b(f, d)
      ];
      return _(f, y, g), v.object(...g);
    }
    function m({ errorPath: f }, { instancePath: y }) {
      const d = y ? (0, t.str)`${f}${(0, r.getErrorPath)(y, r.Type.Str)}` : f;
      return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, d)];
    }
    function b({ keyword: f, it: { errSchemaPath: y } }, { schemaPath: d, parentSchema: v }) {
      let S = v ? y : (0, t.str)`${y}/${f}`;
      return d && (S = (0, t.str)`${S}${(0, r.getErrorPath)(d, r.Type.Str)}`), [u.schemaPath, S];
    }
    function _(f, { params: y, message: d }, v) {
      const { keyword: S, data: g, schemaValue: $, it: E } = f, { opts: I, propertyName: k, topSchemaRef: F, schemaPath: M } = E;
      v.push([u.keyword, S], [u.params, typeof y == "function" ? y(f) : y || (0, t._)`{}`]), I.messages && v.push([u.message, typeof d == "function" ? d(f) : d]), I.verbose && v.push([u.schema, $], [u.parentSchema, (0, t._)`${F}${M}`], [n.default.data, g]), k && v.push([u.propertyName, k]);
    }
  })(wo)), wo;
}
var Iu;
function vR() {
  if (Iu) return vt;
  Iu = 1, Object.defineProperty(vt, "__esModule", { value: !0 }), vt.boolOrEmptySchema = vt.topBoolOrEmptySchema = void 0;
  const e = Ms(), t = re(), r = qe(), n = {
    message: "boolean schema is false"
  };
  function s(a) {
    const { gen: c, schema: l, validateName: u } = a;
    l === !1 ? i(a, !1) : typeof l == "object" && l.$async === !0 ? c.return(r.default.data) : (c.assign((0, t._)`${u}.errors`, null), c.return(!0));
  }
  vt.topBoolOrEmptySchema = s;
  function o(a, c) {
    const { gen: l, schema: u } = a;
    u === !1 ? (l.var(c, !1), i(a)) : l.var(c, !0);
  }
  vt.boolOrEmptySchema = o;
  function i(a, c) {
    const { gen: l, data: u } = a, p = {
      gen: l,
      keyword: "false schema",
      data: u,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: a
    };
    (0, e.reportError)(p, n, void 0, c);
  }
  return vt;
}
var ve = {}, wt = {}, Nu;
function iy() {
  if (Nu) return wt;
  Nu = 1, Object.defineProperty(wt, "__esModule", { value: !0 }), wt.getRules = wt.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], t = new Set(e);
  function r(s) {
    return typeof s == "string" && t.has(s);
  }
  wt.isJSONType = r;
  function n() {
    const s = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...s, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, s.number, s.string, s.array, s.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return wt.getRules = n, wt;
}
var Xe = {}, Au;
function ay() {
  if (Au) return Xe;
  Au = 1, Object.defineProperty(Xe, "__esModule", { value: !0 }), Xe.shouldUseRule = Xe.shouldUseGroup = Xe.schemaHasRulesForType = void 0;
  function e({ schema: n, self: s }, o) {
    const i = s.RULES.types[o];
    return i && i !== !0 && t(n, i);
  }
  Xe.schemaHasRulesForType = e;
  function t(n, s) {
    return s.rules.some((o) => r(n, o));
  }
  Xe.shouldUseGroup = t;
  function r(n, s) {
    var o;
    return n[s.keyword] !== void 0 || ((o = s.definition.implements) === null || o === void 0 ? void 0 : o.some((i) => n[i] !== void 0));
  }
  return Xe.shouldUseRule = r, Xe;
}
var ju;
function bs() {
  if (ju) return ve;
  ju = 1, Object.defineProperty(ve, "__esModule", { value: !0 }), ve.reportTypeError = ve.checkDataTypes = ve.checkDataType = ve.coerceAndCheckDataType = ve.getJSONTypes = ve.getSchemaTypes = ve.DataType = void 0;
  const e = iy(), t = ay(), r = Ms(), n = re(), s = ie();
  var o;
  (function(d) {
    d[d.Correct = 0] = "Correct", d[d.Wrong = 1] = "Wrong";
  })(o || (ve.DataType = o = {}));
  function i(d) {
    const v = a(d.type);
    if (v.includes("null")) {
      if (d.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!v.length && d.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      d.nullable === !0 && v.push("null");
    }
    return v;
  }
  ve.getSchemaTypes = i;
  function a(d) {
    const v = Array.isArray(d) ? d : d ? [d] : [];
    if (v.every(e.isJSONType))
      return v;
    throw new Error("type must be JSONType or JSONType[]: " + v.join(","));
  }
  ve.getJSONTypes = a;
  function c(d, v) {
    const { gen: S, data: g, opts: $ } = d, E = u(v, $.coerceTypes), I = v.length > 0 && !(E.length === 0 && v.length === 1 && (0, t.schemaHasRulesForType)(d, v[0]));
    if (I) {
      const k = b(v, g, $.strictNumbers, o.Wrong);
      S.if(k, () => {
        E.length ? p(d, v, E) : f(d);
      });
    }
    return I;
  }
  ve.coerceAndCheckDataType = c;
  const l = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function u(d, v) {
    return v ? d.filter((S) => l.has(S) || v === "array" && S === "array") : [];
  }
  function p(d, v, S) {
    const { gen: g, data: $, opts: E } = d, I = g.let("dataType", (0, n._)`typeof ${$}`), k = g.let("coerced", (0, n._)`undefined`);
    E.coerceTypes === "array" && g.if((0, n._)`${I} == 'object' && Array.isArray(${$}) && ${$}.length == 1`, () => g.assign($, (0, n._)`${$}[0]`).assign(I, (0, n._)`typeof ${$}`).if(b(v, $, E.strictNumbers), () => g.assign(k, $))), g.if((0, n._)`${k} !== undefined`);
    for (const M of S)
      (l.has(M) || M === "array" && E.coerceTypes === "array") && F(M);
    g.else(), f(d), g.endIf(), g.if((0, n._)`${k} !== undefined`, () => {
      g.assign($, k), h(d, k);
    });
    function F(M) {
      switch (M) {
        case "string":
          g.elseIf((0, n._)`${I} == "number" || ${I} == "boolean"`).assign(k, (0, n._)`"" + ${$}`).elseIf((0, n._)`${$} === null`).assign(k, (0, n._)`""`);
          return;
        case "number":
          g.elseIf((0, n._)`${I} == "boolean" || ${$} === null
              || (${I} == "string" && ${$} && ${$} == +${$})`).assign(k, (0, n._)`+${$}`);
          return;
        case "integer":
          g.elseIf((0, n._)`${I} === "boolean" || ${$} === null
              || (${I} === "string" && ${$} && ${$} == +${$} && !(${$} % 1))`).assign(k, (0, n._)`+${$}`);
          return;
        case "boolean":
          g.elseIf((0, n._)`${$} === "false" || ${$} === 0 || ${$} === null`).assign(k, !1).elseIf((0, n._)`${$} === "true" || ${$} === 1`).assign(k, !0);
          return;
        case "null":
          g.elseIf((0, n._)`${$} === "" || ${$} === 0 || ${$} === false`), g.assign(k, null);
          return;
        case "array":
          g.elseIf((0, n._)`${I} === "string" || ${I} === "number"
              || ${I} === "boolean" || ${$} === null`).assign(k, (0, n._)`[${$}]`);
      }
    }
  }
  function h({ gen: d, parentData: v, parentDataProperty: S }, g) {
    d.if((0, n._)`${v} !== undefined`, () => d.assign((0, n._)`${v}[${S}]`, g));
  }
  function m(d, v, S, g = o.Correct) {
    const $ = g === o.Correct ? n.operators.EQ : n.operators.NEQ;
    let E;
    switch (d) {
      case "null":
        return (0, n._)`${v} ${$} null`;
      case "array":
        E = (0, n._)`Array.isArray(${v})`;
        break;
      case "object":
        E = (0, n._)`${v} && typeof ${v} == "object" && !Array.isArray(${v})`;
        break;
      case "integer":
        E = I((0, n._)`!(${v} % 1) && !isNaN(${v})`);
        break;
      case "number":
        E = I();
        break;
      default:
        return (0, n._)`typeof ${v} ${$} ${d}`;
    }
    return g === o.Correct ? E : (0, n.not)(E);
    function I(k = n.nil) {
      return (0, n.and)((0, n._)`typeof ${v} == "number"`, k, S ? (0, n._)`isFinite(${v})` : n.nil);
    }
  }
  ve.checkDataType = m;
  function b(d, v, S, g) {
    if (d.length === 1)
      return m(d[0], v, S, g);
    let $;
    const E = (0, s.toHash)(d);
    if (E.array && E.object) {
      const I = (0, n._)`typeof ${v} != "object"`;
      $ = E.null ? I : (0, n._)`!${v} || ${I}`, delete E.null, delete E.array, delete E.object;
    } else
      $ = n.nil;
    E.number && delete E.integer;
    for (const I in E)
      $ = (0, n.and)($, m(I, v, S, g));
    return $;
  }
  ve.checkDataTypes = b;
  const _ = {
    message: ({ schema: d }) => `must be ${d}`,
    params: ({ schema: d, schemaValue: v }) => typeof d == "string" ? (0, n._)`{type: ${d}}` : (0, n._)`{type: ${v}}`
  };
  function f(d) {
    const v = y(d);
    (0, r.reportError)(v, _);
  }
  ve.reportTypeError = f;
  function y(d) {
    const { gen: v, data: S, schema: g } = d, $ = (0, s.schemaRefOrVal)(d, g, "type");
    return {
      gen: v,
      keyword: "type",
      data: S,
      schema: g.type,
      schemaCode: $,
      schemaValue: $,
      parentSchema: g,
      params: {},
      it: d
    };
  }
  return ve;
}
var er = {}, Cu;
function wR() {
  if (Cu) return er;
  Cu = 1, Object.defineProperty(er, "__esModule", { value: !0 }), er.assignDefaults = void 0;
  const e = re(), t = ie();
  function r(s, o) {
    const { properties: i, items: a } = s.schema;
    if (o === "object" && i)
      for (const c in i)
        n(s, c, i[c].default);
    else o === "array" && Array.isArray(a) && a.forEach((c, l) => n(s, l, c.default));
  }
  er.assignDefaults = r;
  function n(s, o, i) {
    const { gen: a, compositeRule: c, data: l, opts: u } = s;
    if (i === void 0)
      return;
    const p = (0, e._)`${l}${(0, e.getProperty)(o)}`;
    if (c) {
      (0, t.checkStrictMode)(s, `default is ignored for: ${p}`);
      return;
    }
    let h = (0, e._)`${p} === undefined`;
    u.useDefaults === "empty" && (h = (0, e._)`${h} || ${p} === null || ${p} === ""`), a.if(h, (0, e._)`${p} = ${(0, e.stringify)(i)}`);
  }
  return er;
}
var De = {}, fe = {}, Du;
function Fe() {
  if (Du) return fe;
  Du = 1, Object.defineProperty(fe, "__esModule", { value: !0 }), fe.validateUnion = fe.validateArray = fe.usePattern = fe.callValidateCode = fe.schemaProperties = fe.allSchemaProperties = fe.noPropertyInData = fe.propertyInData = fe.isOwnProperty = fe.hasPropFunc = fe.reportMissingProp = fe.checkMissingProp = fe.checkReportMissingProp = void 0;
  const e = re(), t = ie(), r = qe(), n = ie();
  function s(d, v) {
    const { gen: S, data: g, it: $ } = d;
    S.if(u(S, g, v, $.opts.ownProperties), () => {
      d.setParams({ missingProperty: (0, e._)`${v}` }, !0), d.error();
    });
  }
  fe.checkReportMissingProp = s;
  function o({ gen: d, data: v, it: { opts: S } }, g, $) {
    return (0, e.or)(...g.map((E) => (0, e.and)(u(d, v, E, S.ownProperties), (0, e._)`${$} = ${E}`)));
  }
  fe.checkMissingProp = o;
  function i(d, v) {
    d.setParams({ missingProperty: v }, !0), d.error();
  }
  fe.reportMissingProp = i;
  function a(d) {
    return d.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  fe.hasPropFunc = a;
  function c(d, v, S) {
    return (0, e._)`${a(d)}.call(${v}, ${S})`;
  }
  fe.isOwnProperty = c;
  function l(d, v, S, g) {
    const $ = (0, e._)`${v}${(0, e.getProperty)(S)} !== undefined`;
    return g ? (0, e._)`${$} && ${c(d, v, S)}` : $;
  }
  fe.propertyInData = l;
  function u(d, v, S, g) {
    const $ = (0, e._)`${v}${(0, e.getProperty)(S)} === undefined`;
    return g ? (0, e.or)($, (0, e.not)(c(d, v, S))) : $;
  }
  fe.noPropertyInData = u;
  function p(d) {
    return d ? Object.keys(d).filter((v) => v !== "__proto__") : [];
  }
  fe.allSchemaProperties = p;
  function h(d, v) {
    return p(v).filter((S) => !(0, t.alwaysValidSchema)(d, v[S]));
  }
  fe.schemaProperties = h;
  function m({ schemaCode: d, data: v, it: { gen: S, topSchemaRef: g, schemaPath: $, errorPath: E }, it: I }, k, F, M) {
    const V = M ? (0, e._)`${d}, ${v}, ${g}${$}` : v, z = [
      [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, E)],
      [r.default.parentData, I.parentData],
      [r.default.parentDataProperty, I.parentDataProperty],
      [r.default.rootData, r.default.rootData]
    ];
    I.opts.dynamicRef && z.push([r.default.dynamicAnchors, r.default.dynamicAnchors]);
    const L = (0, e._)`${V}, ${S.object(...z)}`;
    return F !== e.nil ? (0, e._)`${k}.call(${F}, ${L})` : (0, e._)`${k}(${L})`;
  }
  fe.callValidateCode = m;
  const b = (0, e._)`new RegExp`;
  function _({ gen: d, it: { opts: v } }, S) {
    const g = v.unicodeRegExp ? "u" : "", { regExp: $ } = v.code, E = $(S, g);
    return d.scopeValue("pattern", {
      key: E.toString(),
      ref: E,
      code: (0, e._)`${$.code === "new RegExp" ? b : (0, n.useFunc)(d, $)}(${S}, ${g})`
    });
  }
  fe.usePattern = _;
  function f(d) {
    const { gen: v, data: S, keyword: g, it: $ } = d, E = v.name("valid");
    if ($.allErrors) {
      const k = v.let("valid", !0);
      return I(() => v.assign(k, !1)), k;
    }
    return v.var(E, !0), I(() => v.break()), E;
    function I(k) {
      const F = v.const("len", (0, e._)`${S}.length`);
      v.forRange("i", 0, F, (M) => {
        d.subschema({
          keyword: g,
          dataProp: M,
          dataPropType: t.Type.Num
        }, E), v.if((0, e.not)(E), k);
      });
    }
  }
  fe.validateArray = f;
  function y(d) {
    const { gen: v, schema: S, keyword: g, it: $ } = d;
    if (!Array.isArray(S))
      throw new Error("ajv implementation error");
    if (S.some((F) => (0, t.alwaysValidSchema)($, F)) && !$.opts.unevaluated)
      return;
    const I = v.let("valid", !1), k = v.name("_valid");
    v.block(() => S.forEach((F, M) => {
      const V = d.subschema({
        keyword: g,
        schemaProp: M,
        compositeRule: !0
      }, k);
      v.assign(I, (0, e._)`${I} || ${k}`), d.mergeValidEvaluated(V, k) || v.if((0, e.not)(I));
    })), d.result(I, () => d.reset(), () => d.error(!0));
  }
  return fe.validateUnion = y, fe;
}
var ku;
function $R() {
  if (ku) return De;
  ku = 1, Object.defineProperty(De, "__esModule", { value: !0 }), De.validateKeywordUsage = De.validSchemaType = De.funcKeywordCode = De.macroKeywordCode = void 0;
  const e = re(), t = qe(), r = Fe(), n = Ms();
  function s(h, m) {
    const { gen: b, keyword: _, schema: f, parentSchema: y, it: d } = h, v = m.macro.call(d.self, f, y, d), S = l(b, _, v);
    d.opts.validateSchema !== !1 && d.self.validateSchema(v, !0);
    const g = b.name("valid");
    h.subschema({
      schema: v,
      schemaPath: e.nil,
      errSchemaPath: `${d.errSchemaPath}/${_}`,
      topSchemaRef: S,
      compositeRule: !0
    }, g), h.pass(g, () => h.error(!0));
  }
  De.macroKeywordCode = s;
  function o(h, m) {
    var b;
    const { gen: _, keyword: f, schema: y, parentSchema: d, $data: v, it: S } = h;
    c(S, m);
    const g = !v && m.compile ? m.compile.call(S.self, y, d, S) : m.validate, $ = l(_, f, g), E = _.let("valid");
    h.block$data(E, I), h.ok((b = m.valid) !== null && b !== void 0 ? b : E);
    function I() {
      if (m.errors === !1)
        M(), m.modifying && i(h), V(() => h.error());
      else {
        const z = m.async ? k() : F();
        m.modifying && i(h), V(() => a(h, z));
      }
    }
    function k() {
      const z = _.let("ruleErrs", null);
      return _.try(() => M((0, e._)`await `), (L) => _.assign(E, !1).if((0, e._)`${L} instanceof ${S.ValidationError}`, () => _.assign(z, (0, e._)`${L}.errors`), () => _.throw(L))), z;
    }
    function F() {
      const z = (0, e._)`${$}.errors`;
      return _.assign(z, null), M(e.nil), z;
    }
    function M(z = m.async ? (0, e._)`await ` : e.nil) {
      const L = S.opts.passContext ? t.default.this : t.default.self, U = !("compile" in m && !v || m.schema === !1);
      _.assign(E, (0, e._)`${z}${(0, r.callValidateCode)(h, $, L, U)}`, m.modifying);
    }
    function V(z) {
      var L;
      _.if((0, e.not)((L = m.valid) !== null && L !== void 0 ? L : E), z);
    }
  }
  De.funcKeywordCode = o;
  function i(h) {
    const { gen: m, data: b, it: _ } = h;
    m.if(_.parentData, () => m.assign(b, (0, e._)`${_.parentData}[${_.parentDataProperty}]`));
  }
  function a(h, m) {
    const { gen: b } = h;
    b.if((0, e._)`Array.isArray(${m})`, () => {
      b.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${m} : ${t.default.vErrors}.concat(${m})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, n.extendErrors)(h);
    }, () => h.error());
  }
  function c({ schemaEnv: h }, m) {
    if (m.async && !h.$async)
      throw new Error("async keyword in sync schema");
  }
  function l(h, m, b) {
    if (b === void 0)
      throw new Error(`keyword "${m}" failed to compile`);
    return h.scopeValue("keyword", typeof b == "function" ? { ref: b } : { ref: b, code: (0, e.stringify)(b) });
  }
  function u(h, m, b = !1) {
    return !m.length || m.some((_) => _ === "array" ? Array.isArray(h) : _ === "object" ? h && typeof h == "object" && !Array.isArray(h) : typeof h == _ || b && typeof h > "u");
  }
  De.validSchemaType = u;
  function p({ schema: h, opts: m, self: b, errSchemaPath: _ }, f, y) {
    if (Array.isArray(f.keyword) ? !f.keyword.includes(y) : f.keyword !== y)
      throw new Error("ajv implementation error");
    const d = f.dependencies;
    if (d?.some((v) => !Object.prototype.hasOwnProperty.call(h, v)))
      throw new Error(`parent schema must have dependencies of ${y}: ${d.join(",")}`);
    if (f.validateSchema && !f.validateSchema(h[y])) {
      const S = `keyword "${y}" value is invalid at path "${_}": ` + b.errorsText(f.validateSchema.errors);
      if (m.validateSchema === "log")
        b.logger.error(S);
      else
        throw new Error(S);
    }
  }
  return De.validateKeywordUsage = p, De;
}
var Ye = {}, Mu;
function _R() {
  if (Mu) return Ye;
  Mu = 1, Object.defineProperty(Ye, "__esModule", { value: !0 }), Ye.extendSubschemaMode = Ye.extendSubschemaData = Ye.getSubschema = void 0;
  const e = re(), t = ie();
  function r(o, { keyword: i, schemaProp: a, schema: c, schemaPath: l, errSchemaPath: u, topSchemaRef: p }) {
    if (i !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (i !== void 0) {
      const h = o.schema[i];
      return a === void 0 ? {
        schema: h,
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(i)}`,
        errSchemaPath: `${o.errSchemaPath}/${i}`
      } : {
        schema: h[a],
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(i)}${(0, e.getProperty)(a)}`,
        errSchemaPath: `${o.errSchemaPath}/${i}/${(0, t.escapeFragment)(a)}`
      };
    }
    if (c !== void 0) {
      if (l === void 0 || u === void 0 || p === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: l,
        topSchemaRef: p,
        errSchemaPath: u
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Ye.getSubschema = r;
  function n(o, i, { dataProp: a, dataPropType: c, data: l, dataTypes: u, propertyName: p }) {
    if (l !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: h } = i;
    if (a !== void 0) {
      const { errorPath: b, dataPathArr: _, opts: f } = i, y = h.let("data", (0, e._)`${i.data}${(0, e.getProperty)(a)}`, !0);
      m(y), o.errorPath = (0, e.str)`${b}${(0, t.getErrorPath)(a, c, f.jsPropertySyntax)}`, o.parentDataProperty = (0, e._)`${a}`, o.dataPathArr = [..._, o.parentDataProperty];
    }
    if (l !== void 0) {
      const b = l instanceof e.Name ? l : h.let("data", l, !0);
      m(b), p !== void 0 && (o.propertyName = p);
    }
    u && (o.dataTypes = u);
    function m(b) {
      o.data = b, o.dataLevel = i.dataLevel + 1, o.dataTypes = [], i.definedProperties = /* @__PURE__ */ new Set(), o.parentData = i.data, o.dataNames = [...i.dataNames, b];
    }
  }
  Ye.extendSubschemaData = n;
  function s(o, { jtdDiscriminator: i, jtdMetadata: a, compositeRule: c, createErrors: l, allErrors: u }) {
    c !== void 0 && (o.compositeRule = c), l !== void 0 && (o.createErrors = l), u !== void 0 && (o.allErrors = u), o.jtdDiscriminator = i, o.jtdMetadata = a;
  }
  return Ye.extendSubschemaMode = s, Ye;
}
var Ee = {}, So, Lu;
function Ls() {
  return Lu || (Lu = 1, So = function e(t, r) {
    if (t === r) return !0;
    if (t && r && typeof t == "object" && typeof r == "object") {
      if (t.constructor !== r.constructor) return !1;
      var n, s, o;
      if (Array.isArray(t)) {
        if (n = t.length, n != r.length) return !1;
        for (s = n; s-- !== 0; )
          if (!e(t[s], r[s])) return !1;
        return !0;
      }
      if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
      if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
      if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
      if (o = Object.keys(t), n = o.length, n !== Object.keys(r).length) return !1;
      for (s = n; s-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(r, o[s])) return !1;
      for (s = n; s-- !== 0; ) {
        var i = o[s];
        if (!e(t[i], r[i])) return !1;
      }
      return !0;
    }
    return t !== t && r !== r;
  }), So;
}
var Eo = { exports: {} }, qu;
function bR() {
  if (qu) return Eo.exports;
  qu = 1;
  var e = Eo.exports = function(n, s, o) {
    typeof s == "function" && (o = s, s = {}), o = s.cb || o;
    var i = typeof o == "function" ? o : o.pre || function() {
    }, a = o.post || function() {
    };
    t(s, i, a, n, "", n);
  };
  e.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, e.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, e.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, e.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function t(n, s, o, i, a, c, l, u, p, h) {
    if (i && typeof i == "object" && !Array.isArray(i)) {
      s(i, a, c, l, u, p, h);
      for (var m in i) {
        var b = i[m];
        if (Array.isArray(b)) {
          if (m in e.arrayKeywords)
            for (var _ = 0; _ < b.length; _++)
              t(n, s, o, b[_], a + "/" + m + "/" + _, c, a, m, i, _);
        } else if (m in e.propsKeywords) {
          if (b && typeof b == "object")
            for (var f in b)
              t(n, s, o, b[f], a + "/" + m + "/" + r(f), c, a, m, i, f);
        } else (m in e.keywords || n.allKeys && !(m in e.skipKeywords)) && t(n, s, o, b, a + "/" + m, c, a, m, i);
      }
      o(i, a, c, l, u, p, h);
    }
  }
  function r(n) {
    return n.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Eo.exports;
}
var Fu;
function qs() {
  if (Fu) return Ee;
  Fu = 1, Object.defineProperty(Ee, "__esModule", { value: !0 }), Ee.getSchemaRefs = Ee.resolveUrl = Ee.normalizeId = Ee._getFullPath = Ee.getFullPath = Ee.inlineRef = void 0;
  const e = ie(), t = Ls(), r = bR(), n = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function s(_, f = !0) {
    return typeof _ == "boolean" ? !0 : f === !0 ? !i(_) : f ? a(_) <= f : !1;
  }
  Ee.inlineRef = s;
  const o = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function i(_) {
    for (const f in _) {
      if (o.has(f))
        return !0;
      const y = _[f];
      if (Array.isArray(y) && y.some(i) || typeof y == "object" && i(y))
        return !0;
    }
    return !1;
  }
  function a(_) {
    let f = 0;
    for (const y in _) {
      if (y === "$ref")
        return 1 / 0;
      if (f++, !n.has(y) && (typeof _[y] == "object" && (0, e.eachItem)(_[y], (d) => f += a(d)), f === 1 / 0))
        return 1 / 0;
    }
    return f;
  }
  function c(_, f = "", y) {
    y !== !1 && (f = p(f));
    const d = _.parse(f);
    return l(_, d);
  }
  Ee.getFullPath = c;
  function l(_, f) {
    return _.serialize(f).split("#")[0] + "#";
  }
  Ee._getFullPath = l;
  const u = /#\/?$/;
  function p(_) {
    return _ ? _.replace(u, "") : "";
  }
  Ee.normalizeId = p;
  function h(_, f, y) {
    return y = p(y), _.resolve(f, y);
  }
  Ee.resolveUrl = h;
  const m = /^[a-z_][-a-z0-9._]*$/i;
  function b(_, f) {
    if (typeof _ == "boolean")
      return {};
    const { schemaId: y, uriResolver: d } = this.opts, v = p(_[y] || f), S = { "": v }, g = c(d, v, !1), $ = {}, E = /* @__PURE__ */ new Set();
    return r(_, { allKeys: !0 }, (F, M, V, z) => {
      if (z === void 0)
        return;
      const L = g + M;
      let U = S[z];
      typeof F[y] == "string" && (U = H.call(this, F[y])), K.call(this, F.$anchor), K.call(this, F.$dynamicAnchor), S[M] = U;
      function H(W) {
        const X = this.opts.uriResolver.resolve;
        if (W = p(U ? X(U, W) : W), E.has(W))
          throw k(W);
        E.add(W);
        let C = this.refs[W];
        return typeof C == "string" && (C = this.refs[C]), typeof C == "object" ? I(F, C.schema, W) : W !== p(L) && (W[0] === "#" ? (I(F, $[W], W), $[W] = F) : this.refs[W] = L), W;
      }
      function K(W) {
        if (typeof W == "string") {
          if (!m.test(W))
            throw new Error(`invalid anchor "${W}"`);
          H.call(this, `#${W}`);
        }
      }
    }), $;
    function I(F, M, V) {
      if (M !== void 0 && !t(F, M))
        throw k(V);
    }
    function k(F) {
      return new Error(`reference "${F}" resolves to more than one schema`);
    }
  }
  return Ee.getSchemaRefs = b, Ee;
}
var Uu;
function Fs() {
  if (Uu) return Je;
  Uu = 1, Object.defineProperty(Je, "__esModule", { value: !0 }), Je.getData = Je.KeywordCxt = Je.validateFunctionCode = void 0;
  const e = vR(), t = bs(), r = ay(), n = bs(), s = wR(), o = $R(), i = _R(), a = re(), c = qe(), l = qs(), u = ie(), p = Ms();
  function h(P) {
    if (g(P) && (E(P), S(P))) {
      f(P);
      return;
    }
    m(P, () => (0, e.topBoolOrEmptySchema)(P));
  }
  Je.validateFunctionCode = h;
  function m({ gen: P, validateName: N, schema: D, schemaEnv: q, opts: G }, J) {
    G.code.es5 ? P.func(N, (0, a._)`${c.default.data}, ${c.default.valCxt}`, q.$async, () => {
      P.code((0, a._)`"use strict"; ${d(D, G)}`), _(P, G), P.code(J);
    }) : P.func(N, (0, a._)`${c.default.data}, ${b(G)}`, q.$async, () => P.code(d(D, G)).code(J));
  }
  function b(P) {
    return (0, a._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${P.dynamicRef ? (0, a._)`, ${c.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function _(P, N) {
    P.if(c.default.valCxt, () => {
      P.var(c.default.instancePath, (0, a._)`${c.default.valCxt}.${c.default.instancePath}`), P.var(c.default.parentData, (0, a._)`${c.default.valCxt}.${c.default.parentData}`), P.var(c.default.parentDataProperty, (0, a._)`${c.default.valCxt}.${c.default.parentDataProperty}`), P.var(c.default.rootData, (0, a._)`${c.default.valCxt}.${c.default.rootData}`), N.dynamicRef && P.var(c.default.dynamicAnchors, (0, a._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      P.var(c.default.instancePath, (0, a._)`""`), P.var(c.default.parentData, (0, a._)`undefined`), P.var(c.default.parentDataProperty, (0, a._)`undefined`), P.var(c.default.rootData, c.default.data), N.dynamicRef && P.var(c.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function f(P) {
    const { schema: N, opts: D, gen: q } = P;
    m(P, () => {
      D.$comment && N.$comment && z(P), F(P), q.let(c.default.vErrors, null), q.let(c.default.errors, 0), D.unevaluated && y(P), I(P), L(P);
    });
  }
  function y(P) {
    const { gen: N, validateName: D } = P;
    P.evaluated = N.const("evaluated", (0, a._)`${D}.evaluated`), N.if((0, a._)`${P.evaluated}.dynamicProps`, () => N.assign((0, a._)`${P.evaluated}.props`, (0, a._)`undefined`)), N.if((0, a._)`${P.evaluated}.dynamicItems`, () => N.assign((0, a._)`${P.evaluated}.items`, (0, a._)`undefined`));
  }
  function d(P, N) {
    const D = typeof P == "object" && P[N.schemaId];
    return D && (N.code.source || N.code.process) ? (0, a._)`/*# sourceURL=${D} */` : a.nil;
  }
  function v(P, N) {
    if (g(P) && (E(P), S(P))) {
      $(P, N);
      return;
    }
    (0, e.boolOrEmptySchema)(P, N);
  }
  function S({ schema: P, self: N }) {
    if (typeof P == "boolean")
      return !P;
    for (const D in P)
      if (N.RULES.all[D])
        return !0;
    return !1;
  }
  function g(P) {
    return typeof P.schema != "boolean";
  }
  function $(P, N) {
    const { schema: D, gen: q, opts: G } = P;
    G.$comment && D.$comment && z(P), M(P), V(P);
    const J = q.const("_errs", c.default.errors);
    I(P, J), q.var(N, (0, a._)`${J} === ${c.default.errors}`);
  }
  function E(P) {
    (0, u.checkUnknownRules)(P), k(P);
  }
  function I(P, N) {
    if (P.opts.jtd)
      return H(P, [], !1, N);
    const D = (0, t.getSchemaTypes)(P.schema), q = (0, t.coerceAndCheckDataType)(P, D);
    H(P, D, !q, N);
  }
  function k(P) {
    const { schema: N, errSchemaPath: D, opts: q, self: G } = P;
    N.$ref && q.ignoreKeywordsWithRef && (0, u.schemaHasRulesButRef)(N, G.RULES) && G.logger.warn(`$ref: keywords ignored in schema at path "${D}"`);
  }
  function F(P) {
    const { schema: N, opts: D } = P;
    N.default !== void 0 && D.useDefaults && D.strictSchema && (0, u.checkStrictMode)(P, "default is ignored in the schema root");
  }
  function M(P) {
    const N = P.schema[P.opts.schemaId];
    N && (P.baseId = (0, l.resolveUrl)(P.opts.uriResolver, P.baseId, N));
  }
  function V(P) {
    if (P.schema.$async && !P.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function z({ gen: P, schemaEnv: N, schema: D, errSchemaPath: q, opts: G }) {
    const J = D.$comment;
    if (G.$comment === !0)
      P.code((0, a._)`${c.default.self}.logger.log(${J})`);
    else if (typeof G.$comment == "function") {
      const ae = (0, a.str)`${q}/$comment`, me = P.scopeValue("root", { ref: N.root });
      P.code((0, a._)`${c.default.self}.opts.$comment(${J}, ${ae}, ${me}.schema)`);
    }
  }
  function L(P) {
    const { gen: N, schemaEnv: D, validateName: q, ValidationError: G, opts: J } = P;
    D.$async ? N.if((0, a._)`${c.default.errors} === 0`, () => N.return(c.default.data), () => N.throw((0, a._)`new ${G}(${c.default.vErrors})`)) : (N.assign((0, a._)`${q}.errors`, c.default.vErrors), J.unevaluated && U(P), N.return((0, a._)`${c.default.errors} === 0`));
  }
  function U({ gen: P, evaluated: N, props: D, items: q }) {
    D instanceof a.Name && P.assign((0, a._)`${N}.props`, D), q instanceof a.Name && P.assign((0, a._)`${N}.items`, q);
  }
  function H(P, N, D, q) {
    const { gen: G, schema: J, data: ae, allErrors: me, opts: le, self: de } = P, { RULES: ce } = de;
    if (J.$ref && (le.ignoreKeywordsWithRef || !(0, u.schemaHasRulesButRef)(J, ce))) {
      G.block(() => x(P, "$ref", ce.all.$ref.definition));
      return;
    }
    le.jtd || W(P, N), G.block(() => {
      for (const pe of ce.rules)
        Te(pe);
      Te(ce.post);
    });
    function Te(pe) {
      (0, r.shouldUseGroup)(J, pe) && (pe.type ? (G.if((0, n.checkDataType)(pe.type, ae, le.strictNumbers)), K(P, pe), N.length === 1 && N[0] === pe.type && D && (G.else(), (0, n.reportTypeError)(P)), G.endIf()) : K(P, pe), me || G.if((0, a._)`${c.default.errors} === ${q || 0}`));
    }
  }
  function K(P, N) {
    const { gen: D, schema: q, opts: { useDefaults: G } } = P;
    G && (0, s.assignDefaults)(P, N.type), D.block(() => {
      for (const J of N.rules)
        (0, r.shouldUseRule)(q, J) && x(P, J.keyword, J.definition, N.type);
    });
  }
  function W(P, N) {
    P.schemaEnv.meta || !P.opts.strictTypes || (X(P, N), P.opts.allowUnionTypes || C(P, N), O(P, P.dataTypes));
  }
  function X(P, N) {
    if (N.length) {
      if (!P.dataTypes.length) {
        P.dataTypes = N;
        return;
      }
      N.forEach((D) => {
        T(P.dataTypes, D) || R(P, `type "${D}" not allowed by context "${P.dataTypes.join(",")}"`);
      }), w(P, N);
    }
  }
  function C(P, N) {
    N.length > 1 && !(N.length === 2 && N.includes("null")) && R(P, "use allowUnionTypes to allow union type keyword");
  }
  function O(P, N) {
    const D = P.self.RULES.all;
    for (const q in D) {
      const G = D[q];
      if (typeof G == "object" && (0, r.shouldUseRule)(P.schema, G)) {
        const { type: J } = G.definition;
        J.length && !J.some((ae) => j(N, ae)) && R(P, `missing type "${J.join(",")}" for keyword "${q}"`);
      }
    }
  }
  function j(P, N) {
    return P.includes(N) || N === "number" && P.includes("integer");
  }
  function T(P, N) {
    return P.includes(N) || N === "integer" && P.includes("number");
  }
  function w(P, N) {
    const D = [];
    for (const q of P.dataTypes)
      T(N, q) ? D.push(q) : N.includes("integer") && q === "number" && D.push("integer");
    P.dataTypes = D;
  }
  function R(P, N) {
    const D = P.schemaEnv.baseId + P.errSchemaPath;
    N += ` at "${D}" (strictTypes)`, (0, u.checkStrictMode)(P, N, P.opts.strictTypes);
  }
  class A {
    constructor(N, D, q) {
      if ((0, o.validateKeywordUsage)(N, D, q), this.gen = N.gen, this.allErrors = N.allErrors, this.keyword = q, this.data = N.data, this.schema = N.schema[q], this.$data = D.$data && N.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, u.schemaRefOrVal)(N, this.schema, q, this.$data), this.schemaType = D.schemaType, this.parentSchema = N.schema, this.params = {}, this.it = N, this.def = D, this.$data)
        this.schemaCode = N.gen.const("vSchema", Y(this.$data, N));
      else if (this.schemaCode = this.schemaValue, !(0, o.validSchemaType)(this.schema, D.schemaType, D.allowUndefined))
        throw new Error(`${q} value must be ${JSON.stringify(D.schemaType)}`);
      ("code" in D ? D.trackErrors : D.errors !== !1) && (this.errsCount = N.gen.const("_errs", c.default.errors));
    }
    result(N, D, q) {
      this.failResult((0, a.not)(N), D, q);
    }
    failResult(N, D, q) {
      this.gen.if(N), q ? q() : this.error(), D ? (this.gen.else(), D(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(N, D) {
      this.failResult((0, a.not)(N), void 0, D);
    }
    fail(N) {
      if (N === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(N), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(N) {
      if (!this.$data)
        return this.fail(N);
      const { schemaCode: D } = this;
      this.fail((0, a._)`${D} !== undefined && (${(0, a.or)(this.invalid$data(), N)})`);
    }
    error(N, D, q) {
      if (D) {
        this.setParams(D), this._error(N, q), this.setParams({});
        return;
      }
      this._error(N, q);
    }
    _error(N, D) {
      (N ? p.reportExtraError : p.reportError)(this, this.def.error, D);
    }
    $dataError() {
      (0, p.reportError)(this, this.def.$dataError || p.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, p.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(N) {
      this.allErrors || this.gen.if(N);
    }
    setParams(N, D) {
      D ? Object.assign(this.params, N) : this.params = N;
    }
    block$data(N, D, q = a.nil) {
      this.gen.block(() => {
        this.check$data(N, q), D();
      });
    }
    check$data(N = a.nil, D = a.nil) {
      if (!this.$data)
        return;
      const { gen: q, schemaCode: G, schemaType: J, def: ae } = this;
      q.if((0, a.or)((0, a._)`${G} === undefined`, D)), N !== a.nil && q.assign(N, !0), (J.length || ae.validateSchema) && (q.elseIf(this.invalid$data()), this.$dataError(), N !== a.nil && q.assign(N, !1)), q.else();
    }
    invalid$data() {
      const { gen: N, schemaCode: D, schemaType: q, def: G, it: J } = this;
      return (0, a.or)(ae(), me());
      function ae() {
        if (q.length) {
          if (!(D instanceof a.Name))
            throw new Error("ajv implementation error");
          const le = Array.isArray(q) ? q : [q];
          return (0, a._)`${(0, n.checkDataTypes)(le, D, J.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function me() {
        if (G.validateSchema) {
          const le = N.scopeValue("validate$data", { ref: G.validateSchema });
          return (0, a._)`!${le}(${D})`;
        }
        return a.nil;
      }
    }
    subschema(N, D) {
      const q = (0, i.getSubschema)(this.it, N);
      (0, i.extendSubschemaData)(q, this.it, N), (0, i.extendSubschemaMode)(q, N);
      const G = { ...this.it, ...q, items: void 0, props: void 0 };
      return v(G, D), G;
    }
    mergeEvaluated(N, D) {
      const { it: q, gen: G } = this;
      q.opts.unevaluated && (q.props !== !0 && N.props !== void 0 && (q.props = u.mergeEvaluated.props(G, N.props, q.props, D)), q.items !== !0 && N.items !== void 0 && (q.items = u.mergeEvaluated.items(G, N.items, q.items, D)));
    }
    mergeValidEvaluated(N, D) {
      const { it: q, gen: G } = this;
      if (q.opts.unevaluated && (q.props !== !0 || q.items !== !0))
        return G.if(D, () => this.mergeEvaluated(N, a.Name)), !0;
    }
  }
  Je.KeywordCxt = A;
  function x(P, N, D, q) {
    const G = new A(P, D, N);
    "code" in D ? D.code(G, q) : G.$data && D.validate ? (0, o.funcKeywordCode)(G, D) : "macro" in D ? (0, o.macroKeywordCode)(G, D) : (D.compile || D.validate) && (0, o.funcKeywordCode)(G, D);
  }
  const B = /^\/(?:[^~]|~0|~1)*$/, Q = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function Y(P, { dataLevel: N, dataNames: D, dataPathArr: q }) {
    let G, J;
    if (P === "")
      return c.default.rootData;
    if (P[0] === "/") {
      if (!B.test(P))
        throw new Error(`Invalid JSON-pointer: ${P}`);
      G = P, J = c.default.rootData;
    } else {
      const de = Q.exec(P);
      if (!de)
        throw new Error(`Invalid JSON-pointer: ${P}`);
      const ce = +de[1];
      if (G = de[2], G === "#") {
        if (ce >= N)
          throw new Error(le("property/index", ce));
        return q[N - ce];
      }
      if (ce > N)
        throw new Error(le("data", ce));
      if (J = D[N - ce], !G)
        return J;
    }
    let ae = J;
    const me = G.split("/");
    for (const de of me)
      de && (J = (0, a._)`${J}${(0, a.getProperty)((0, u.unescapeJsonPointer)(de))}`, ae = (0, a._)`${ae} && ${J}`);
    return ae;
    function le(de, ce) {
      return `Cannot access ${de} ${ce} levels up, current level is ${N}`;
    }
  }
  return Je.getData = Y, Je;
}
var Pr = {}, Vu;
function ic() {
  if (Vu) return Pr;
  Vu = 1, Object.defineProperty(Pr, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return Pr.default = e, Pr;
}
var Or = {}, zu;
function Us() {
  if (zu) return Or;
  zu = 1, Object.defineProperty(Or, "__esModule", { value: !0 });
  const e = qs();
  class t extends Error {
    constructor(n, s, o, i) {
      super(i || `can't resolve reference ${o} from id ${s}`), this.missingRef = (0, e.resolveUrl)(n, s, o), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(n, this.missingRef));
    }
  }
  return Or.default = t, Or;
}
var Ne = {}, xu;
function Vs() {
  if (xu) return Ne;
  xu = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.resolveSchema = Ne.getCompilingSchema = Ne.resolveRef = Ne.compileSchema = Ne.SchemaEnv = void 0;
  const e = re(), t = ic(), r = qe(), n = qs(), s = ie(), o = Fs();
  class i {
    constructor(y) {
      var d;
      this.refs = {}, this.dynamicAnchors = {};
      let v;
      typeof y.schema == "object" && (v = y.schema), this.schema = y.schema, this.schemaId = y.schemaId, this.root = y.root || this, this.baseId = (d = y.baseId) !== null && d !== void 0 ? d : (0, n.normalizeId)(v?.[y.schemaId || "$id"]), this.schemaPath = y.schemaPath, this.localRefs = y.localRefs, this.meta = y.meta, this.$async = v?.$async, this.refs = {};
    }
  }
  Ne.SchemaEnv = i;
  function a(f) {
    const y = u.call(this, f);
    if (y)
      return y;
    const d = (0, n.getFullPath)(this.opts.uriResolver, f.root.baseId), { es5: v, lines: S } = this.opts.code, { ownProperties: g } = this.opts, $ = new e.CodeGen(this.scope, { es5: v, lines: S, ownProperties: g });
    let E;
    f.$async && (E = $.scopeValue("Error", {
      ref: t.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const I = $.scopeName("validate");
    f.validateName = I;
    const k = {
      gen: $,
      allErrors: this.opts.allErrors,
      data: r.default.data,
      parentData: r.default.parentData,
      parentDataProperty: r.default.parentDataProperty,
      dataNames: [r.default.data],
      dataPathArr: [e.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: $.scopeValue("schema", this.opts.code.source === !0 ? { ref: f.schema, code: (0, e.stringify)(f.schema) } : { ref: f.schema }),
      validateName: I,
      ValidationError: E,
      schema: f.schema,
      schemaEnv: f,
      rootId: d,
      baseId: f.baseId || d,
      schemaPath: e.nil,
      errSchemaPath: f.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let F;
    try {
      this._compilations.add(f), (0, o.validateFunctionCode)(k), $.optimize(this.opts.code.optimize);
      const M = $.toString();
      F = `${$.scopeRefs(r.default.scope)}return ${M}`, this.opts.code.process && (F = this.opts.code.process(F, f));
      const z = new Function(`${r.default.self}`, `${r.default.scope}`, F)(this, this.scope.get());
      if (this.scope.value(I, { ref: z }), z.errors = null, z.schema = f.schema, z.schemaEnv = f, f.$async && (z.$async = !0), this.opts.code.source === !0 && (z.source = { validateName: I, validateCode: M, scopeValues: $._values }), this.opts.unevaluated) {
        const { props: L, items: U } = k;
        z.evaluated = {
          props: L instanceof e.Name ? void 0 : L,
          items: U instanceof e.Name ? void 0 : U,
          dynamicProps: L instanceof e.Name,
          dynamicItems: U instanceof e.Name
        }, z.source && (z.source.evaluated = (0, e.stringify)(z.evaluated));
      }
      return f.validate = z, f;
    } catch (M) {
      throw delete f.validate, delete f.validateName, F && this.logger.error("Error compiling schema, function code:", F), M;
    } finally {
      this._compilations.delete(f);
    }
  }
  Ne.compileSchema = a;
  function c(f, y, d) {
    var v;
    d = (0, n.resolveUrl)(this.opts.uriResolver, y, d);
    const S = f.refs[d];
    if (S)
      return S;
    let g = h.call(this, f, d);
    if (g === void 0) {
      const $ = (v = f.localRefs) === null || v === void 0 ? void 0 : v[d], { schemaId: E } = this.opts;
      $ && (g = new i({ schema: $, schemaId: E, root: f, baseId: y }));
    }
    if (g !== void 0)
      return f.refs[d] = l.call(this, g);
  }
  Ne.resolveRef = c;
  function l(f) {
    return (0, n.inlineRef)(f.schema, this.opts.inlineRefs) ? f.schema : f.validate ? f : a.call(this, f);
  }
  function u(f) {
    for (const y of this._compilations)
      if (p(y, f))
        return y;
  }
  Ne.getCompilingSchema = u;
  function p(f, y) {
    return f.schema === y.schema && f.root === y.root && f.baseId === y.baseId;
  }
  function h(f, y) {
    let d;
    for (; typeof (d = this.refs[y]) == "string"; )
      y = d;
    return d || this.schemas[y] || m.call(this, f, y);
  }
  function m(f, y) {
    const d = this.opts.uriResolver.parse(y), v = (0, n._getFullPath)(this.opts.uriResolver, d);
    let S = (0, n.getFullPath)(this.opts.uriResolver, f.baseId, void 0);
    if (Object.keys(f.schema).length > 0 && v === S)
      return _.call(this, d, f);
    const g = (0, n.normalizeId)(v), $ = this.refs[g] || this.schemas[g];
    if (typeof $ == "string") {
      const E = m.call(this, f, $);
      return typeof E?.schema != "object" ? void 0 : _.call(this, d, E);
    }
    if (typeof $?.schema == "object") {
      if ($.validate || a.call(this, $), g === (0, n.normalizeId)(y)) {
        const { schema: E } = $, { schemaId: I } = this.opts, k = E[I];
        return k && (S = (0, n.resolveUrl)(this.opts.uriResolver, S, k)), new i({ schema: E, schemaId: I, root: f, baseId: S });
      }
      return _.call(this, d, $);
    }
  }
  Ne.resolveSchema = m;
  const b = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function _(f, { baseId: y, schema: d, root: v }) {
    var S;
    if (((S = f.fragment) === null || S === void 0 ? void 0 : S[0]) !== "/")
      return;
    for (const E of f.fragment.slice(1).split("/")) {
      if (typeof d == "boolean")
        return;
      const I = d[(0, s.unescapeFragment)(E)];
      if (I === void 0)
        return;
      d = I;
      const k = typeof d == "object" && d[this.opts.schemaId];
      !b.has(E) && k && (y = (0, n.resolveUrl)(this.opts.uriResolver, y, k));
    }
    let g;
    if (typeof d != "boolean" && d.$ref && !(0, s.schemaHasRulesButRef)(d, this.RULES)) {
      const E = (0, n.resolveUrl)(this.opts.uriResolver, y, d.$ref);
      g = m.call(this, v, E);
    }
    const { schemaId: $ } = this.opts;
    if (g = g || new i({ schema: d, schemaId: $, root: v, baseId: y }), g.schema !== g.root.schema)
      return g;
  }
  return Ne;
}
const SR = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", ER = "Meta-schema for $data reference (JSON AnySchema extension proposal)", RR = "object", PR = ["$data"], OR = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, TR = !1, IR = {
  $id: SR,
  description: ER,
  type: RR,
  required: PR,
  properties: OR,
  additionalProperties: TR
};
var Tr = {}, tr = { exports: {} }, Ro, Gu;
function cy() {
  if (Gu) return Ro;
  Gu = 1;
  const e = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), t = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
  function r(h) {
    let m = "", b = 0, _ = 0;
    for (_ = 0; _ < h.length; _++)
      if (b = h[_].charCodeAt(0), b !== 48) {
        if (!(b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102))
          return "";
        m += h[_];
        break;
      }
    for (_ += 1; _ < h.length; _++) {
      if (b = h[_].charCodeAt(0), !(b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102))
        return "";
      m += h[_];
    }
    return m;
  }
  const n = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function s(h) {
    return h.length = 0, !0;
  }
  function o(h, m, b) {
    if (h.length) {
      const _ = r(h);
      if (_ !== "")
        m.push(_);
      else
        return b.error = !0, !1;
      h.length = 0;
    }
    return !0;
  }
  function i(h) {
    let m = 0;
    const b = { error: !1, address: "", zone: "" }, _ = [], f = [];
    let y = !1, d = !1, v = o;
    for (let S = 0; S < h.length; S++) {
      const g = h[S];
      if (!(g === "[" || g === "]"))
        if (g === ":") {
          if (y === !0 && (d = !0), !v(f, _, b))
            break;
          if (++m > 7) {
            b.error = !0;
            break;
          }
          S > 0 && h[S - 1] === ":" && (y = !0), _.push(":");
          continue;
        } else if (g === "%") {
          if (!v(f, _, b))
            break;
          v = s;
        } else {
          f.push(g);
          continue;
        }
    }
    return f.length && (v === s ? b.zone = f.join("") : d ? _.push(f.join("")) : _.push(r(f))), b.address = _.join(""), b;
  }
  function a(h) {
    if (c(h, ":") < 2)
      return { host: h, isIPV6: !1 };
    const m = i(h);
    if (m.error)
      return { host: h, isIPV6: !1 };
    {
      let b = m.address, _ = m.address;
      return m.zone && (b += "%" + m.zone, _ += "%25" + m.zone), { host: b, isIPV6: !0, escapedHost: _ };
    }
  }
  function c(h, m) {
    let b = 0;
    for (let _ = 0; _ < h.length; _++)
      h[_] === m && b++;
    return b;
  }
  function l(h) {
    let m = h;
    const b = [];
    let _ = -1, f = 0;
    for (; f = m.length; ) {
      if (f === 1) {
        if (m === ".")
          break;
        if (m === "/") {
          b.push("/");
          break;
        } else {
          b.push(m);
          break;
        }
      } else if (f === 2) {
        if (m[0] === ".") {
          if (m[1] === ".")
            break;
          if (m[1] === "/") {
            m = m.slice(2);
            continue;
          }
        } else if (m[0] === "/" && (m[1] === "." || m[1] === "/")) {
          b.push("/");
          break;
        }
      } else if (f === 3 && m === "/..") {
        b.length !== 0 && b.pop(), b.push("/");
        break;
      }
      if (m[0] === ".") {
        if (m[1] === ".") {
          if (m[2] === "/") {
            m = m.slice(3);
            continue;
          }
        } else if (m[1] === "/") {
          m = m.slice(2);
          continue;
        }
      } else if (m[0] === "/" && m[1] === ".") {
        if (m[2] === "/") {
          m = m.slice(2);
          continue;
        } else if (m[2] === "." && m[3] === "/") {
          m = m.slice(3), b.length !== 0 && b.pop();
          continue;
        }
      }
      if ((_ = m.indexOf("/", 1)) === -1) {
        b.push(m);
        break;
      } else
        b.push(m.slice(0, _)), m = m.slice(_);
    }
    return b.join("");
  }
  function u(h, m) {
    const b = m !== !0 ? escape : unescape;
    return h.scheme !== void 0 && (h.scheme = b(h.scheme)), h.userinfo !== void 0 && (h.userinfo = b(h.userinfo)), h.host !== void 0 && (h.host = b(h.host)), h.path !== void 0 && (h.path = b(h.path)), h.query !== void 0 && (h.query = b(h.query)), h.fragment !== void 0 && (h.fragment = b(h.fragment)), h;
  }
  function p(h) {
    const m = [];
    if (h.userinfo !== void 0 && (m.push(h.userinfo), m.push("@")), h.host !== void 0) {
      let b = unescape(h.host);
      if (!t(b)) {
        const _ = a(b);
        _.isIPV6 === !0 ? b = `[${_.escapedHost}]` : b = h.host;
      }
      m.push(b);
    }
    return (typeof h.port == "number" || typeof h.port == "string") && (m.push(":"), m.push(String(h.port))), m.length ? m.join("") : void 0;
  }
  return Ro = {
    nonSimpleDomain: n,
    recomposeAuthority: p,
    normalizeComponentEncoding: u,
    removeDotSegments: l,
    isIPv4: t,
    isUUID: e,
    normalizeIPv6: a,
    stringArrayToHexStripped: r
  }, Ro;
}
var Po, Bu;
function NR() {
  if (Bu) return Po;
  Bu = 1;
  const { isUUID: e } = cy(), t = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu, r = (
    /** @type {const} */
    [
      "http",
      "https",
      "ws",
      "wss",
      "urn",
      "urn:uuid"
    ]
  );
  function n(g) {
    return r.indexOf(
      /** @type {*} */
      g
    ) !== -1;
  }
  function s(g) {
    return g.secure === !0 ? !0 : g.secure === !1 ? !1 : g.scheme ? g.scheme.length === 3 && (g.scheme[0] === "w" || g.scheme[0] === "W") && (g.scheme[1] === "s" || g.scheme[1] === "S") && (g.scheme[2] === "s" || g.scheme[2] === "S") : !1;
  }
  function o(g) {
    return g.host || (g.error = g.error || "HTTP URIs must have a host."), g;
  }
  function i(g) {
    const $ = String(g.scheme).toLowerCase() === "https";
    return (g.port === ($ ? 443 : 80) || g.port === "") && (g.port = void 0), g.path || (g.path = "/"), g;
  }
  function a(g) {
    return g.secure = s(g), g.resourceName = (g.path || "/") + (g.query ? "?" + g.query : ""), g.path = void 0, g.query = void 0, g;
  }
  function c(g) {
    if ((g.port === (s(g) ? 443 : 80) || g.port === "") && (g.port = void 0), typeof g.secure == "boolean" && (g.scheme = g.secure ? "wss" : "ws", g.secure = void 0), g.resourceName) {
      const [$, E] = g.resourceName.split("?");
      g.path = $ && $ !== "/" ? $ : void 0, g.query = E, g.resourceName = void 0;
    }
    return g.fragment = void 0, g;
  }
  function l(g, $) {
    if (!g.path)
      return g.error = "URN can not be parsed", g;
    const E = g.path.match(t);
    if (E) {
      const I = $.scheme || g.scheme || "urn";
      g.nid = E[1].toLowerCase(), g.nss = E[2];
      const k = `${I}:${$.nid || g.nid}`, F = S(k);
      g.path = void 0, F && (g = F.parse(g, $));
    } else
      g.error = g.error || "URN can not be parsed.";
    return g;
  }
  function u(g, $) {
    if (g.nid === void 0)
      throw new Error("URN without nid cannot be serialized");
    const E = $.scheme || g.scheme || "urn", I = g.nid.toLowerCase(), k = `${E}:${$.nid || I}`, F = S(k);
    F && (g = F.serialize(g, $));
    const M = g, V = g.nss;
    return M.path = `${I || $.nid}:${V}`, $.skipEscape = !0, M;
  }
  function p(g, $) {
    const E = g;
    return E.uuid = E.nss, E.nss = void 0, !$.tolerant && (!E.uuid || !e(E.uuid)) && (E.error = E.error || "UUID is not valid."), E;
  }
  function h(g) {
    const $ = g;
    return $.nss = (g.uuid || "").toLowerCase(), $;
  }
  const m = (
    /** @type {SchemeHandler} */
    {
      scheme: "http",
      domainHost: !0,
      parse: o,
      serialize: i
    }
  ), b = (
    /** @type {SchemeHandler} */
    {
      scheme: "https",
      domainHost: m.domainHost,
      parse: o,
      serialize: i
    }
  ), _ = (
    /** @type {SchemeHandler} */
    {
      scheme: "ws",
      domainHost: !0,
      parse: a,
      serialize: c
    }
  ), f = (
    /** @type {SchemeHandler} */
    {
      scheme: "wss",
      domainHost: _.domainHost,
      parse: _.parse,
      serialize: _.serialize
    }
  ), v = (
    /** @type {Record<SchemeName, SchemeHandler>} */
    {
      http: m,
      https: b,
      ws: _,
      wss: f,
      urn: (
        /** @type {SchemeHandler} */
        {
          scheme: "urn",
          parse: l,
          serialize: u,
          skipNormalize: !0
        }
      ),
      "urn:uuid": (
        /** @type {SchemeHandler} */
        {
          scheme: "urn:uuid",
          parse: p,
          serialize: h,
          skipNormalize: !0
        }
      )
    }
  );
  Object.setPrototypeOf(v, null);
  function S(g) {
    return g && (v[
      /** @type {SchemeName} */
      g
    ] || v[
      /** @type {SchemeName} */
      g.toLowerCase()
    ]) || void 0;
  }
  return Po = {
    wsIsSecure: s,
    SCHEMES: v,
    isValidSchemeName: n,
    getSchemeHandler: S
  }, Po;
}
var Wu;
function uy() {
  if (Wu) return tr.exports;
  Wu = 1;
  const { normalizeIPv6: e, removeDotSegments: t, recomposeAuthority: r, normalizeComponentEncoding: n, isIPv4: s, nonSimpleDomain: o } = cy(), { SCHEMES: i, getSchemeHandler: a } = NR();
  function c(f, y) {
    return typeof f == "string" ? f = /** @type {T} */
    h(b(f, y), y) : typeof f == "object" && (f = /** @type {T} */
    b(h(f, y), y)), f;
  }
  function l(f, y, d) {
    const v = d ? Object.assign({ scheme: "null" }, d) : { scheme: "null" }, S = u(b(f, v), b(y, v), v, !0);
    return v.skipEscape = !0, h(S, v);
  }
  function u(f, y, d, v) {
    const S = {};
    return v || (f = b(h(f, d), d), y = b(h(y, d), d)), d = d || {}, !d.tolerant && y.scheme ? (S.scheme = y.scheme, S.userinfo = y.userinfo, S.host = y.host, S.port = y.port, S.path = t(y.path || ""), S.query = y.query) : (y.userinfo !== void 0 || y.host !== void 0 || y.port !== void 0 ? (S.userinfo = y.userinfo, S.host = y.host, S.port = y.port, S.path = t(y.path || ""), S.query = y.query) : (y.path ? (y.path[0] === "/" ? S.path = t(y.path) : ((f.userinfo !== void 0 || f.host !== void 0 || f.port !== void 0) && !f.path ? S.path = "/" + y.path : f.path ? S.path = f.path.slice(0, f.path.lastIndexOf("/") + 1) + y.path : S.path = y.path, S.path = t(S.path)), S.query = y.query) : (S.path = f.path, y.query !== void 0 ? S.query = y.query : S.query = f.query), S.userinfo = f.userinfo, S.host = f.host, S.port = f.port), S.scheme = f.scheme), S.fragment = y.fragment, S;
  }
  function p(f, y, d) {
    return typeof f == "string" ? (f = unescape(f), f = h(n(b(f, d), !0), { ...d, skipEscape: !0 })) : typeof f == "object" && (f = h(n(f, !0), { ...d, skipEscape: !0 })), typeof y == "string" ? (y = unescape(y), y = h(n(b(y, d), !0), { ...d, skipEscape: !0 })) : typeof y == "object" && (y = h(n(y, !0), { ...d, skipEscape: !0 })), f.toLowerCase() === y.toLowerCase();
  }
  function h(f, y) {
    const d = {
      host: f.host,
      scheme: f.scheme,
      userinfo: f.userinfo,
      port: f.port,
      path: f.path,
      query: f.query,
      nid: f.nid,
      nss: f.nss,
      uuid: f.uuid,
      fragment: f.fragment,
      reference: f.reference,
      resourceName: f.resourceName,
      secure: f.secure,
      error: ""
    }, v = Object.assign({}, y), S = [], g = a(v.scheme || d.scheme);
    g && g.serialize && g.serialize(d, v), d.path !== void 0 && (v.skipEscape ? d.path = unescape(d.path) : (d.path = escape(d.path), d.scheme !== void 0 && (d.path = d.path.split("%3A").join(":")))), v.reference !== "suffix" && d.scheme && S.push(d.scheme, ":");
    const $ = r(d);
    if ($ !== void 0 && (v.reference !== "suffix" && S.push("//"), S.push($), d.path && d.path[0] !== "/" && S.push("/")), d.path !== void 0) {
      let E = d.path;
      !v.absolutePath && (!g || !g.absolutePath) && (E = t(E)), $ === void 0 && E[0] === "/" && E[1] === "/" && (E = "/%2F" + E.slice(2)), S.push(E);
    }
    return d.query !== void 0 && S.push("?", d.query), d.fragment !== void 0 && S.push("#", d.fragment), S.join("");
  }
  const m = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function b(f, y) {
    const d = Object.assign({}, y), v = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    };
    let S = !1;
    d.reference === "suffix" && (d.scheme ? f = d.scheme + ":" + f : f = "//" + f);
    const g = f.match(m);
    if (g) {
      if (v.scheme = g[1], v.userinfo = g[3], v.host = g[4], v.port = parseInt(g[5], 10), v.path = g[6] || "", v.query = g[7], v.fragment = g[8], isNaN(v.port) && (v.port = g[5]), v.host)
        if (s(v.host) === !1) {
          const I = e(v.host);
          v.host = I.host.toLowerCase(), S = I.isIPV6;
        } else
          S = !0;
      v.scheme === void 0 && v.userinfo === void 0 && v.host === void 0 && v.port === void 0 && v.query === void 0 && !v.path ? v.reference = "same-document" : v.scheme === void 0 ? v.reference = "relative" : v.fragment === void 0 ? v.reference = "absolute" : v.reference = "uri", d.reference && d.reference !== "suffix" && d.reference !== v.reference && (v.error = v.error || "URI is not a " + d.reference + " reference.");
      const $ = a(d.scheme || v.scheme);
      if (!d.unicodeSupport && (!$ || !$.unicodeSupport) && v.host && (d.domainHost || $ && $.domainHost) && S === !1 && o(v.host))
        try {
          v.host = URL.domainToASCII(v.host.toLowerCase());
        } catch (E) {
          v.error = v.error || "Host's domain name can not be converted to ASCII: " + E;
        }
      (!$ || $ && !$.skipNormalize) && (f.indexOf("%") !== -1 && (v.scheme !== void 0 && (v.scheme = unescape(v.scheme)), v.host !== void 0 && (v.host = unescape(v.host))), v.path && (v.path = escape(unescape(v.path))), v.fragment && (v.fragment = encodeURI(decodeURIComponent(v.fragment)))), $ && $.parse && $.parse(v, d);
    } else
      v.error = v.error || "URI can not be parsed.";
    return v;
  }
  const _ = {
    SCHEMES: i,
    normalize: c,
    resolve: l,
    resolveComponent: u,
    equal: p,
    serialize: h,
    parse: b
  };
  return tr.exports = _, tr.exports.default = _, tr.exports.fastUri = _, tr.exports;
}
var Ku;
function AR() {
  if (Ku) return Tr;
  Ku = 1, Object.defineProperty(Tr, "__esModule", { value: !0 });
  const e = uy();
  return e.code = 'require("ajv/dist/runtime/uri").default', Tr.default = e, Tr;
}
var Hu;
function jR() {
  return Hu || (Hu = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var t = Fs();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return t.KeywordCxt;
    } });
    var r = re();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return r._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return r.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return r.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return r.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return r.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return r.CodeGen;
    } });
    const n = ic(), s = Us(), o = iy(), i = Vs(), a = re(), c = qs(), l = bs(), u = ie(), p = IR, h = AR(), m = (C, O) => new RegExp(C, O);
    m.code = "new RegExp";
    const b = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), f = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, y = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, d = 200;
    function v(C) {
      var O, j, T, w, R, A, x, B, Q, Y, P, N, D, q, G, J, ae, me, le, de, ce, Te, pe, pt, mt;
      const Ce = C.strict, yt = (O = C.code) === null || O === void 0 ? void 0 : O.optimize, Xt = yt === !0 || yt === void 0 ? 1 : yt || 0, Yt = (T = (j = C.code) === null || j === void 0 ? void 0 : j.regExp) !== null && T !== void 0 ? T : m, Qs = (w = C.uriResolver) !== null && w !== void 0 ? w : h.default;
      return {
        strictSchema: (A = (R = C.strictSchema) !== null && R !== void 0 ? R : Ce) !== null && A !== void 0 ? A : !0,
        strictNumbers: (B = (x = C.strictNumbers) !== null && x !== void 0 ? x : Ce) !== null && B !== void 0 ? B : !0,
        strictTypes: (Y = (Q = C.strictTypes) !== null && Q !== void 0 ? Q : Ce) !== null && Y !== void 0 ? Y : "log",
        strictTuples: (N = (P = C.strictTuples) !== null && P !== void 0 ? P : Ce) !== null && N !== void 0 ? N : "log",
        strictRequired: (q = (D = C.strictRequired) !== null && D !== void 0 ? D : Ce) !== null && q !== void 0 ? q : !1,
        code: C.code ? { ...C.code, optimize: Xt, regExp: Yt } : { optimize: Xt, regExp: Yt },
        loopRequired: (G = C.loopRequired) !== null && G !== void 0 ? G : d,
        loopEnum: (J = C.loopEnum) !== null && J !== void 0 ? J : d,
        meta: (ae = C.meta) !== null && ae !== void 0 ? ae : !0,
        messages: (me = C.messages) !== null && me !== void 0 ? me : !0,
        inlineRefs: (le = C.inlineRefs) !== null && le !== void 0 ? le : !0,
        schemaId: (de = C.schemaId) !== null && de !== void 0 ? de : "$id",
        addUsedSchema: (ce = C.addUsedSchema) !== null && ce !== void 0 ? ce : !0,
        validateSchema: (Te = C.validateSchema) !== null && Te !== void 0 ? Te : !0,
        validateFormats: (pe = C.validateFormats) !== null && pe !== void 0 ? pe : !0,
        unicodeRegExp: (pt = C.unicodeRegExp) !== null && pt !== void 0 ? pt : !0,
        int32range: (mt = C.int32range) !== null && mt !== void 0 ? mt : !0,
        uriResolver: Qs
      };
    }
    class S {
      constructor(O = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), O = this.opts = { ...O, ...v(O) };
        const { es5: j, lines: T } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: _, es5: j, lines: T }), this.logger = V(O.logger);
        const w = O.validateFormats;
        O.validateFormats = !1, this.RULES = (0, o.getRules)(), g.call(this, f, O, "NOT SUPPORTED"), g.call(this, y, O, "DEPRECATED", "warn"), this._metaOpts = F.call(this), O.formats && I.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), O.keywords && k.call(this, O.keywords), typeof O.meta == "object" && this.addMetaSchema(O.meta), E.call(this), O.validateFormats = w;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: O, meta: j, schemaId: T } = this.opts;
        let w = p;
        T === "id" && (w = { ...p }, w.id = w.$id, delete w.$id), j && O && this.addMetaSchema(w, w[T], !1);
      }
      defaultMeta() {
        const { meta: O, schemaId: j } = this.opts;
        return this.opts.defaultMeta = typeof O == "object" ? O[j] || O : void 0;
      }
      validate(O, j) {
        let T;
        if (typeof O == "string") {
          if (T = this.getSchema(O), !T)
            throw new Error(`no schema with key or ref "${O}"`);
        } else
          T = this.compile(O);
        const w = T(j);
        return "$async" in T || (this.errors = T.errors), w;
      }
      compile(O, j) {
        const T = this._addSchema(O, j);
        return T.validate || this._compileSchemaEnv(T);
      }
      compileAsync(O, j) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: T } = this.opts;
        return w.call(this, O, j);
        async function w(Y, P) {
          await R.call(this, Y.$schema);
          const N = this._addSchema(Y, P);
          return N.validate || A.call(this, N);
        }
        async function R(Y) {
          Y && !this.getSchema(Y) && await w.call(this, { $ref: Y }, !0);
        }
        async function A(Y) {
          try {
            return this._compileSchemaEnv(Y);
          } catch (P) {
            if (!(P instanceof s.default))
              throw P;
            return x.call(this, P), await B.call(this, P.missingSchema), A.call(this, Y);
          }
        }
        function x({ missingSchema: Y, missingRef: P }) {
          if (this.refs[Y])
            throw new Error(`AnySchema ${Y} is loaded but ${P} cannot be resolved`);
        }
        async function B(Y) {
          const P = await Q.call(this, Y);
          this.refs[Y] || await R.call(this, P.$schema), this.refs[Y] || this.addSchema(P, Y, j);
        }
        async function Q(Y) {
          const P = this._loading[Y];
          if (P)
            return P;
          try {
            return await (this._loading[Y] = T(Y));
          } finally {
            delete this._loading[Y];
          }
        }
      }
      // Adds schema to the instance
      addSchema(O, j, T, w = this.opts.validateSchema) {
        if (Array.isArray(O)) {
          for (const A of O)
            this.addSchema(A, void 0, T, w);
          return this;
        }
        let R;
        if (typeof O == "object") {
          const { schemaId: A } = this.opts;
          if (R = O[A], R !== void 0 && typeof R != "string")
            throw new Error(`schema ${A} must be string`);
        }
        return j = (0, c.normalizeId)(j || R), this._checkUnique(j), this.schemas[j] = this._addSchema(O, T, j, w, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(O, j, T = this.opts.validateSchema) {
        return this.addSchema(O, j, !0, T), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(O, j) {
        if (typeof O == "boolean")
          return !0;
        let T;
        if (T = O.$schema, T !== void 0 && typeof T != "string")
          throw new Error("$schema must be a string");
        if (T = T || this.opts.defaultMeta || this.defaultMeta(), !T)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const w = this.validate(T, O);
        if (!w && j) {
          const R = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(R);
          else
            throw new Error(R);
        }
        return w;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(O) {
        let j;
        for (; typeof (j = $.call(this, O)) == "string"; )
          O = j;
        if (j === void 0) {
          const { schemaId: T } = this.opts, w = new i.SchemaEnv({ schema: {}, schemaId: T });
          if (j = i.resolveSchema.call(this, w, O), !j)
            return;
          this.refs[O] = j;
        }
        return j.validate || this._compileSchemaEnv(j);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(O) {
        if (O instanceof RegExp)
          return this._removeAllSchemas(this.schemas, O), this._removeAllSchemas(this.refs, O), this;
        switch (typeof O) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const j = $.call(this, O);
            return typeof j == "object" && this._cache.delete(j.schema), delete this.schemas[O], delete this.refs[O], this;
          }
          case "object": {
            const j = O;
            this._cache.delete(j);
            let T = O[this.opts.schemaId];
            return T && (T = (0, c.normalizeId)(T), delete this.schemas[T], delete this.refs[T]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(O) {
        for (const j of O)
          this.addKeyword(j);
        return this;
      }
      addKeyword(O, j) {
        let T;
        if (typeof O == "string")
          T = O, typeof j == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), j.keyword = T);
        else if (typeof O == "object" && j === void 0) {
          if (j = O, T = j.keyword, Array.isArray(T) && !T.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (L.call(this, T, j), !j)
          return (0, u.eachItem)(T, (R) => U.call(this, R)), this;
        K.call(this, j);
        const w = {
          ...j,
          type: (0, l.getJSONTypes)(j.type),
          schemaType: (0, l.getJSONTypes)(j.schemaType)
        };
        return (0, u.eachItem)(T, w.type.length === 0 ? (R) => U.call(this, R, w) : (R) => w.type.forEach((A) => U.call(this, R, w, A))), this;
      }
      getKeyword(O) {
        const j = this.RULES.all[O];
        return typeof j == "object" ? j.definition : !!j;
      }
      // Remove keyword
      removeKeyword(O) {
        const { RULES: j } = this;
        delete j.keywords[O], delete j.all[O];
        for (const T of j.rules) {
          const w = T.rules.findIndex((R) => R.keyword === O);
          w >= 0 && T.rules.splice(w, 1);
        }
        return this;
      }
      // Add format
      addFormat(O, j) {
        return typeof j == "string" && (j = new RegExp(j)), this.formats[O] = j, this;
      }
      errorsText(O = this.errors, { separator: j = ", ", dataVar: T = "data" } = {}) {
        return !O || O.length === 0 ? "No errors" : O.map((w) => `${T}${w.instancePath} ${w.message}`).reduce((w, R) => w + j + R);
      }
      $dataMetaSchema(O, j) {
        const T = this.RULES.all;
        O = JSON.parse(JSON.stringify(O));
        for (const w of j) {
          const R = w.split("/").slice(1);
          let A = O;
          for (const x of R)
            A = A[x];
          for (const x in T) {
            const B = T[x];
            if (typeof B != "object")
              continue;
            const { $data: Q } = B.definition, Y = A[x];
            Q && Y && (A[x] = X(Y));
          }
        }
        return O;
      }
      _removeAllSchemas(O, j) {
        for (const T in O) {
          const w = O[T];
          (!j || j.test(T)) && (typeof w == "string" ? delete O[T] : w && !w.meta && (this._cache.delete(w.schema), delete O[T]));
        }
      }
      _addSchema(O, j, T, w = this.opts.validateSchema, R = this.opts.addUsedSchema) {
        let A;
        const { schemaId: x } = this.opts;
        if (typeof O == "object")
          A = O[x];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof O != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let B = this._cache.get(O);
        if (B !== void 0)
          return B;
        T = (0, c.normalizeId)(A || T);
        const Q = c.getSchemaRefs.call(this, O, T);
        return B = new i.SchemaEnv({ schema: O, schemaId: x, meta: j, baseId: T, localRefs: Q }), this._cache.set(B.schema, B), R && !T.startsWith("#") && (T && this._checkUnique(T), this.refs[T] = B), w && this.validateSchema(O, !0), B;
      }
      _checkUnique(O) {
        if (this.schemas[O] || this.refs[O])
          throw new Error(`schema with key or id "${O}" already exists`);
      }
      _compileSchemaEnv(O) {
        if (O.meta ? this._compileMetaSchema(O) : i.compileSchema.call(this, O), !O.validate)
          throw new Error("ajv implementation error");
        return O.validate;
      }
      _compileMetaSchema(O) {
        const j = this.opts;
        this.opts = this._metaOpts;
        try {
          i.compileSchema.call(this, O);
        } finally {
          this.opts = j;
        }
      }
    }
    S.ValidationError = n.default, S.MissingRefError = s.default, e.default = S;
    function g(C, O, j, T = "error") {
      for (const w in C) {
        const R = w;
        R in O && this.logger[T](`${j}: option ${w}. ${C[R]}`);
      }
    }
    function $(C) {
      return C = (0, c.normalizeId)(C), this.schemas[C] || this.refs[C];
    }
    function E() {
      const C = this.opts.schemas;
      if (C)
        if (Array.isArray(C))
          this.addSchema(C);
        else
          for (const O in C)
            this.addSchema(C[O], O);
    }
    function I() {
      for (const C in this.opts.formats) {
        const O = this.opts.formats[C];
        O && this.addFormat(C, O);
      }
    }
    function k(C) {
      if (Array.isArray(C)) {
        this.addVocabulary(C);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const O in C) {
        const j = C[O];
        j.keyword || (j.keyword = O), this.addKeyword(j);
      }
    }
    function F() {
      const C = { ...this.opts };
      for (const O of b)
        delete C[O];
      return C;
    }
    const M = { log() {
    }, warn() {
    }, error() {
    } };
    function V(C) {
      if (C === !1)
        return M;
      if (C === void 0)
        return console;
      if (C.log && C.warn && C.error)
        return C;
      throw new Error("logger must implement log, warn and error methods");
    }
    const z = /^[a-z_$][a-z0-9_$:-]*$/i;
    function L(C, O) {
      const { RULES: j } = this;
      if ((0, u.eachItem)(C, (T) => {
        if (j.keywords[T])
          throw new Error(`Keyword ${T} is already defined`);
        if (!z.test(T))
          throw new Error(`Keyword ${T} has invalid name`);
      }), !!O && O.$data && !("code" in O || "validate" in O))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function U(C, O, j) {
      var T;
      const w = O?.post;
      if (j && w)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: R } = this;
      let A = w ? R.post : R.rules.find(({ type: B }) => B === j);
      if (A || (A = { type: j, rules: [] }, R.rules.push(A)), R.keywords[C] = !0, !O)
        return;
      const x = {
        keyword: C,
        definition: {
          ...O,
          type: (0, l.getJSONTypes)(O.type),
          schemaType: (0, l.getJSONTypes)(O.schemaType)
        }
      };
      O.before ? H.call(this, A, x, O.before) : A.rules.push(x), R.all[C] = x, (T = O.implements) === null || T === void 0 || T.forEach((B) => this.addKeyword(B));
    }
    function H(C, O, j) {
      const T = C.rules.findIndex((w) => w.keyword === j);
      T >= 0 ? C.rules.splice(T, 0, O) : (C.rules.push(O), this.logger.warn(`rule ${j} is not defined`));
    }
    function K(C) {
      let { metaSchema: O } = C;
      O !== void 0 && (C.$data && this.opts.$data && (O = X(O)), C.validateSchema = this.compile(O, !0));
    }
    const W = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function X(C) {
      return { anyOf: [C, W] };
    }
  })(vo)), vo;
}
var Ir = {}, Nr = {}, Ar = {}, Ju;
function CR() {
  if (Ju) return Ar;
  Ju = 1, Object.defineProperty(Ar, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Ar.default = e, Ar;
}
var ot = {}, Xu;
function ac() {
  if (Xu) return ot;
  Xu = 1, Object.defineProperty(ot, "__esModule", { value: !0 }), ot.callRef = ot.getValidate = void 0;
  const e = Us(), t = Fe(), r = re(), n = qe(), s = Vs(), o = ie(), i = {
    keyword: "$ref",
    schemaType: "string",
    code(l) {
      const { gen: u, schema: p, it: h } = l, { baseId: m, schemaEnv: b, validateName: _, opts: f, self: y } = h, { root: d } = b;
      if ((p === "#" || p === "#/") && m === d.baseId)
        return S();
      const v = s.resolveRef.call(y, d, m, p);
      if (v === void 0)
        throw new e.default(h.opts.uriResolver, m, p);
      if (v instanceof s.SchemaEnv)
        return g(v);
      return $(v);
      function S() {
        if (b === d)
          return c(l, _, b, b.$async);
        const E = u.scopeValue("root", { ref: d });
        return c(l, (0, r._)`${E}.validate`, d, d.$async);
      }
      function g(E) {
        const I = a(l, E);
        c(l, I, E, E.$async);
      }
      function $(E) {
        const I = u.scopeValue("schema", f.code.source === !0 ? { ref: E, code: (0, r.stringify)(E) } : { ref: E }), k = u.name("valid"), F = l.subschema({
          schema: E,
          dataTypes: [],
          schemaPath: r.nil,
          topSchemaRef: I,
          errSchemaPath: p
        }, k);
        l.mergeEvaluated(F), l.ok(k);
      }
    }
  };
  function a(l, u) {
    const { gen: p } = l;
    return u.validate ? p.scopeValue("validate", { ref: u.validate }) : (0, r._)`${p.scopeValue("wrapper", { ref: u })}.validate`;
  }
  ot.getValidate = a;
  function c(l, u, p, h) {
    const { gen: m, it: b } = l, { allErrors: _, schemaEnv: f, opts: y } = b, d = y.passContext ? n.default.this : r.nil;
    h ? v() : S();
    function v() {
      if (!f.$async)
        throw new Error("async schema referenced by sync schema");
      const E = m.let("valid");
      m.try(() => {
        m.code((0, r._)`await ${(0, t.callValidateCode)(l, u, d)}`), $(u), _ || m.assign(E, !0);
      }, (I) => {
        m.if((0, r._)`!(${I} instanceof ${b.ValidationError})`, () => m.throw(I)), g(I), _ || m.assign(E, !1);
      }), l.ok(E);
    }
    function S() {
      l.result((0, t.callValidateCode)(l, u, d), () => $(u), () => g(u));
    }
    function g(E) {
      const I = (0, r._)`${E}.errors`;
      m.assign(n.default.vErrors, (0, r._)`${n.default.vErrors} === null ? ${I} : ${n.default.vErrors}.concat(${I})`), m.assign(n.default.errors, (0, r._)`${n.default.vErrors}.length`);
    }
    function $(E) {
      var I;
      if (!b.opts.unevaluated)
        return;
      const k = (I = p?.validate) === null || I === void 0 ? void 0 : I.evaluated;
      if (b.props !== !0)
        if (k && !k.dynamicProps)
          k.props !== void 0 && (b.props = o.mergeEvaluated.props(m, k.props, b.props));
        else {
          const F = m.var("props", (0, r._)`${E}.evaluated.props`);
          b.props = o.mergeEvaluated.props(m, F, b.props, r.Name);
        }
      if (b.items !== !0)
        if (k && !k.dynamicItems)
          k.items !== void 0 && (b.items = o.mergeEvaluated.items(m, k.items, b.items));
        else {
          const F = m.var("items", (0, r._)`${E}.evaluated.items`);
          b.items = o.mergeEvaluated.items(m, F, b.items, r.Name);
        }
    }
  }
  return ot.callRef = c, ot.default = i, ot;
}
var Yu;
function DR() {
  if (Yu) return Nr;
  Yu = 1, Object.defineProperty(Nr, "__esModule", { value: !0 });
  const e = CR(), t = ac(), r = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    t.default
  ];
  return Nr.default = r, Nr;
}
var jr = {}, Cr = {}, Qu;
function kR() {
  if (Qu) return Cr;
  Qu = 1, Object.defineProperty(Cr, "__esModule", { value: !0 });
  const e = re(), t = e.operators, r = {
    maximum: { okStr: "<=", ok: t.LTE, fail: t.GT },
    minimum: { okStr: ">=", ok: t.GTE, fail: t.LT },
    exclusiveMaximum: { okStr: "<", ok: t.LT, fail: t.GTE },
    exclusiveMinimum: { okStr: ">", ok: t.GT, fail: t.LTE }
  }, n = {
    message: ({ keyword: o, schemaCode: i }) => (0, e.str)`must be ${r[o].okStr} ${i}`,
    params: ({ keyword: o, schemaCode: i }) => (0, e._)`{comparison: ${r[o].okStr}, limit: ${i}}`
  }, s = {
    keyword: Object.keys(r),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: n,
    code(o) {
      const { keyword: i, data: a, schemaCode: c } = o;
      o.fail$data((0, e._)`${a} ${r[i].fail} ${c} || isNaN(${a})`);
    }
  };
  return Cr.default = s, Cr;
}
var Dr = {}, Zu;
function MR() {
  if (Zu) return Dr;
  Zu = 1, Object.defineProperty(Dr, "__esModule", { value: !0 });
  const e = re(), r = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must be multiple of ${n}`,
      params: ({ schemaCode: n }) => (0, e._)`{multipleOf: ${n}}`
    },
    code(n) {
      const { gen: s, data: o, schemaCode: i, it: a } = n, c = a.opts.multipleOfPrecision, l = s.let("res"), u = c ? (0, e._)`Math.abs(Math.round(${l}) - ${l}) > 1e-${c}` : (0, e._)`${l} !== parseInt(${l})`;
      n.fail$data((0, e._)`(${i} === 0 || (${l} = ${o}/${i}, ${u}))`);
    }
  };
  return Dr.default = r, Dr;
}
var kr = {}, Mr = {}, el;
function LR() {
  if (el) return Mr;
  el = 1, Object.defineProperty(Mr, "__esModule", { value: !0 });
  function e(t) {
    const r = t.length;
    let n = 0, s = 0, o;
    for (; s < r; )
      n++, o = t.charCodeAt(s++), o >= 55296 && o <= 56319 && s < r && (o = t.charCodeAt(s), (o & 64512) === 56320 && s++);
    return n;
  }
  return Mr.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', Mr;
}
var tl;
function qR() {
  if (tl) return kr;
  tl = 1, Object.defineProperty(kr, "__esModule", { value: !0 });
  const e = re(), t = ie(), r = LR(), s = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: o, schemaCode: i }) {
        const a = o === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${a} than ${i} characters`;
      },
      params: ({ schemaCode: o }) => (0, e._)`{limit: ${o}}`
    },
    code(o) {
      const { keyword: i, data: a, schemaCode: c, it: l } = o, u = i === "maxLength" ? e.operators.GT : e.operators.LT, p = l.opts.unicode === !1 ? (0, e._)`${a}.length` : (0, e._)`${(0, t.useFunc)(o.gen, r.default)}(${a})`;
      o.fail$data((0, e._)`${p} ${u} ${c}`);
    }
  };
  return kr.default = s, kr;
}
var Lr = {}, rl;
function FR() {
  if (rl) return Lr;
  rl = 1, Object.defineProperty(Lr, "__esModule", { value: !0 });
  const e = Fe(), t = re(), n = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: s }) => (0, t.str)`must match pattern "${s}"`,
      params: ({ schemaCode: s }) => (0, t._)`{pattern: ${s}}`
    },
    code(s) {
      const { data: o, $data: i, schema: a, schemaCode: c, it: l } = s, u = l.opts.unicodeRegExp ? "u" : "", p = i ? (0, t._)`(new RegExp(${c}, ${u}))` : (0, e.usePattern)(s, a);
      s.fail$data((0, t._)`!${p}.test(${o})`);
    }
  };
  return Lr.default = n, Lr;
}
var qr = {}, nl;
function UR() {
  if (nl) return qr;
  nl = 1, Object.defineProperty(qr, "__esModule", { value: !0 });
  const e = re(), r = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: s }) {
        const o = n === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${o} than ${s} properties`;
      },
      params: ({ schemaCode: n }) => (0, e._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: s, data: o, schemaCode: i } = n, a = s === "maxProperties" ? e.operators.GT : e.operators.LT;
      n.fail$data((0, e._)`Object.keys(${o}).length ${a} ${i}`);
    }
  };
  return qr.default = r, qr;
}
var Fr = {}, sl;
function VR() {
  if (sl) return Fr;
  sl = 1, Object.defineProperty(Fr, "__esModule", { value: !0 });
  const e = Fe(), t = re(), r = ie(), s = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: o } }) => (0, t.str)`must have required property '${o}'`,
      params: ({ params: { missingProperty: o } }) => (0, t._)`{missingProperty: ${o}}`
    },
    code(o) {
      const { gen: i, schema: a, schemaCode: c, data: l, $data: u, it: p } = o, { opts: h } = p;
      if (!u && a.length === 0)
        return;
      const m = a.length >= h.loopRequired;
      if (p.allErrors ? b() : _(), h.strictRequired) {
        const d = o.parentSchema.properties, { definedProperties: v } = o.it;
        for (const S of a)
          if (d?.[S] === void 0 && !v.has(S)) {
            const g = p.schemaEnv.baseId + p.errSchemaPath, $ = `required property "${S}" is not defined at "${g}" (strictRequired)`;
            (0, r.checkStrictMode)(p, $, p.opts.strictRequired);
          }
      }
      function b() {
        if (m || u)
          o.block$data(t.nil, f);
        else
          for (const d of a)
            (0, e.checkReportMissingProp)(o, d);
      }
      function _() {
        const d = i.let("missing");
        if (m || u) {
          const v = i.let("valid", !0);
          o.block$data(v, () => y(d, v)), o.ok(v);
        } else
          i.if((0, e.checkMissingProp)(o, a, d)), (0, e.reportMissingProp)(o, d), i.else();
      }
      function f() {
        i.forOf("prop", c, (d) => {
          o.setParams({ missingProperty: d }), i.if((0, e.noPropertyInData)(i, l, d, h.ownProperties), () => o.error());
        });
      }
      function y(d, v) {
        o.setParams({ missingProperty: d }), i.forOf(d, c, () => {
          i.assign(v, (0, e.propertyInData)(i, l, d, h.ownProperties)), i.if((0, t.not)(v), () => {
            o.error(), i.break();
          });
        }, t.nil);
      }
    }
  };
  return Fr.default = s, Fr;
}
var Ur = {}, ol;
function zR() {
  if (ol) return Ur;
  ol = 1, Object.defineProperty(Ur, "__esModule", { value: !0 });
  const e = re(), r = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: s }) {
        const o = n === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${o} than ${s} items`;
      },
      params: ({ schemaCode: n }) => (0, e._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: s, data: o, schemaCode: i } = n, a = s === "maxItems" ? e.operators.GT : e.operators.LT;
      n.fail$data((0, e._)`${o}.length ${a} ${i}`);
    }
  };
  return Ur.default = r, Ur;
}
var Vr = {}, zr = {}, il;
function cc() {
  if (il) return zr;
  il = 1, Object.defineProperty(zr, "__esModule", { value: !0 });
  const e = Ls();
  return e.code = 'require("ajv/dist/runtime/equal").default', zr.default = e, zr;
}
var al;
function xR() {
  if (al) return Vr;
  al = 1, Object.defineProperty(Vr, "__esModule", { value: !0 });
  const e = bs(), t = re(), r = ie(), n = cc(), o = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i, j: a } }) => (0, t.str)`must NOT have duplicate items (items ## ${a} and ${i} are identical)`,
      params: ({ params: { i, j: a } }) => (0, t._)`{i: ${i}, j: ${a}}`
    },
    code(i) {
      const { gen: a, data: c, $data: l, schema: u, parentSchema: p, schemaCode: h, it: m } = i;
      if (!l && !u)
        return;
      const b = a.let("valid"), _ = p.items ? (0, e.getSchemaTypes)(p.items) : [];
      i.block$data(b, f, (0, t._)`${h} === false`), i.ok(b);
      function f() {
        const S = a.let("i", (0, t._)`${c}.length`), g = a.let("j");
        i.setParams({ i: S, j: g }), a.assign(b, !0), a.if((0, t._)`${S} > 1`, () => (y() ? d : v)(S, g));
      }
      function y() {
        return _.length > 0 && !_.some((S) => S === "object" || S === "array");
      }
      function d(S, g) {
        const $ = a.name("item"), E = (0, e.checkDataTypes)(_, $, m.opts.strictNumbers, e.DataType.Wrong), I = a.const("indices", (0, t._)`{}`);
        a.for((0, t._)`;${S}--;`, () => {
          a.let($, (0, t._)`${c}[${S}]`), a.if(E, (0, t._)`continue`), _.length > 1 && a.if((0, t._)`typeof ${$} == "string"`, (0, t._)`${$} += "_"`), a.if((0, t._)`typeof ${I}[${$}] == "number"`, () => {
            a.assign(g, (0, t._)`${I}[${$}]`), i.error(), a.assign(b, !1).break();
          }).code((0, t._)`${I}[${$}] = ${S}`);
        });
      }
      function v(S, g) {
        const $ = (0, r.useFunc)(a, n.default), E = a.name("outer");
        a.label(E).for((0, t._)`;${S}--;`, () => a.for((0, t._)`${g} = ${S}; ${g}--;`, () => a.if((0, t._)`${$}(${c}[${S}], ${c}[${g}])`, () => {
          i.error(), a.assign(b, !1).break(E);
        })));
      }
    }
  };
  return Vr.default = o, Vr;
}
var xr = {}, cl;
function GR() {
  if (cl) return xr;
  cl = 1, Object.defineProperty(xr, "__esModule", { value: !0 });
  const e = re(), t = ie(), r = cc(), s = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: o }) => (0, e._)`{allowedValue: ${o}}`
    },
    code(o) {
      const { gen: i, data: a, $data: c, schemaCode: l, schema: u } = o;
      c || u && typeof u == "object" ? o.fail$data((0, e._)`!${(0, t.useFunc)(i, r.default)}(${a}, ${l})`) : o.fail((0, e._)`${u} !== ${a}`);
    }
  };
  return xr.default = s, xr;
}
var Gr = {}, ul;
function BR() {
  if (ul) return Gr;
  ul = 1, Object.defineProperty(Gr, "__esModule", { value: !0 });
  const e = re(), t = ie(), r = cc(), s = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: o }) => (0, e._)`{allowedValues: ${o}}`
    },
    code(o) {
      const { gen: i, data: a, $data: c, schema: l, schemaCode: u, it: p } = o;
      if (!c && l.length === 0)
        throw new Error("enum must have non-empty array");
      const h = l.length >= p.opts.loopEnum;
      let m;
      const b = () => m ?? (m = (0, t.useFunc)(i, r.default));
      let _;
      if (h || c)
        _ = i.let("valid"), o.block$data(_, f);
      else {
        if (!Array.isArray(l))
          throw new Error("ajv implementation error");
        const d = i.const("vSchema", u);
        _ = (0, e.or)(...l.map((v, S) => y(d, S)));
      }
      o.pass(_);
      function f() {
        i.assign(_, !1), i.forOf("v", u, (d) => i.if((0, e._)`${b()}(${a}, ${d})`, () => i.assign(_, !0).break()));
      }
      function y(d, v) {
        const S = l[v];
        return typeof S == "object" && S !== null ? (0, e._)`${b()}(${a}, ${d}[${v}])` : (0, e._)`${a} === ${S}`;
      }
    }
  };
  return Gr.default = s, Gr;
}
var ll;
function WR() {
  if (ll) return jr;
  ll = 1, Object.defineProperty(jr, "__esModule", { value: !0 });
  const e = kR(), t = MR(), r = qR(), n = FR(), s = UR(), o = VR(), i = zR(), a = xR(), c = GR(), l = BR(), u = [
    // number
    e.default,
    t.default,
    // string
    r.default,
    n.default,
    // object
    s.default,
    o.default,
    // array
    i.default,
    a.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    c.default,
    l.default
  ];
  return jr.default = u, jr;
}
var Br = {}, kt = {}, dl;
function ly() {
  if (dl) return kt;
  dl = 1, Object.defineProperty(kt, "__esModule", { value: !0 }), kt.validateAdditionalItems = void 0;
  const e = re(), t = ie(), n = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: o } }) => (0, e.str)`must NOT have more than ${o} items`,
      params: ({ params: { len: o } }) => (0, e._)`{limit: ${o}}`
    },
    code(o) {
      const { parentSchema: i, it: a } = o, { items: c } = i;
      if (!Array.isArray(c)) {
        (0, t.checkStrictMode)(a, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      s(o, c);
    }
  };
  function s(o, i) {
    const { gen: a, schema: c, data: l, keyword: u, it: p } = o;
    p.items = !0;
    const h = a.const("len", (0, e._)`${l}.length`);
    if (c === !1)
      o.setParams({ len: i.length }), o.pass((0, e._)`${h} <= ${i.length}`);
    else if (typeof c == "object" && !(0, t.alwaysValidSchema)(p, c)) {
      const b = a.var("valid", (0, e._)`${h} <= ${i.length}`);
      a.if((0, e.not)(b), () => m(b)), o.ok(b);
    }
    function m(b) {
      a.forRange("i", i.length, h, (_) => {
        o.subschema({ keyword: u, dataProp: _, dataPropType: t.Type.Num }, b), p.allErrors || a.if((0, e.not)(b), () => a.break());
      });
    }
  }
  return kt.validateAdditionalItems = s, kt.default = n, kt;
}
var Wr = {}, Mt = {}, fl;
function dy() {
  if (fl) return Mt;
  fl = 1, Object.defineProperty(Mt, "__esModule", { value: !0 }), Mt.validateTuple = void 0;
  const e = re(), t = ie(), r = Fe(), n = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(o) {
      const { schema: i, it: a } = o;
      if (Array.isArray(i))
        return s(o, "additionalItems", i);
      a.items = !0, !(0, t.alwaysValidSchema)(a, i) && o.ok((0, r.validateArray)(o));
    }
  };
  function s(o, i, a = o.schema) {
    const { gen: c, parentSchema: l, data: u, keyword: p, it: h } = o;
    _(l), h.opts.unevaluated && a.length && h.items !== !0 && (h.items = t.mergeEvaluated.items(c, a.length, h.items));
    const m = c.name("valid"), b = c.const("len", (0, e._)`${u}.length`);
    a.forEach((f, y) => {
      (0, t.alwaysValidSchema)(h, f) || (c.if((0, e._)`${b} > ${y}`, () => o.subschema({
        keyword: p,
        schemaProp: y,
        dataProp: y
      }, m)), o.ok(m));
    });
    function _(f) {
      const { opts: y, errSchemaPath: d } = h, v = a.length, S = v === f.minItems && (v === f.maxItems || f[i] === !1);
      if (y.strictTuples && !S) {
        const g = `"${p}" is ${v}-tuple, but minItems or maxItems/${i} are not specified or different at path "${d}"`;
        (0, t.checkStrictMode)(h, g, y.strictTuples);
      }
    }
  }
  return Mt.validateTuple = s, Mt.default = n, Mt;
}
var hl;
function KR() {
  if (hl) return Wr;
  hl = 1, Object.defineProperty(Wr, "__esModule", { value: !0 });
  const e = dy(), t = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (r) => (0, e.validateTuple)(r, "items")
  };
  return Wr.default = t, Wr;
}
var Kr = {}, pl;
function HR() {
  if (pl) return Kr;
  pl = 1, Object.defineProperty(Kr, "__esModule", { value: !0 });
  const e = re(), t = ie(), r = Fe(), n = ly(), o = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, e.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, e._)`{limit: ${i}}`
    },
    code(i) {
      const { schema: a, parentSchema: c, it: l } = i, { prefixItems: u } = c;
      l.items = !0, !(0, t.alwaysValidSchema)(l, a) && (u ? (0, n.validateAdditionalItems)(i, u) : i.ok((0, r.validateArray)(i)));
    }
  };
  return Kr.default = o, Kr;
}
var Hr = {}, ml;
function JR() {
  if (ml) return Hr;
  ml = 1, Object.defineProperty(Hr, "__esModule", { value: !0 });
  const e = re(), t = ie(), n = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: s, max: o } }) => o === void 0 ? (0, e.str)`must contain at least ${s} valid item(s)` : (0, e.str)`must contain at least ${s} and no more than ${o} valid item(s)`,
      params: ({ params: { min: s, max: o } }) => o === void 0 ? (0, e._)`{minContains: ${s}}` : (0, e._)`{minContains: ${s}, maxContains: ${o}}`
    },
    code(s) {
      const { gen: o, schema: i, parentSchema: a, data: c, it: l } = s;
      let u, p;
      const { minContains: h, maxContains: m } = a;
      l.opts.next ? (u = h === void 0 ? 1 : h, p = m) : u = 1;
      const b = o.const("len", (0, e._)`${c}.length`);
      if (s.setParams({ min: u, max: p }), p === void 0 && u === 0) {
        (0, t.checkStrictMode)(l, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (p !== void 0 && u > p) {
        (0, t.checkStrictMode)(l, '"minContains" > "maxContains" is always invalid'), s.fail();
        return;
      }
      if ((0, t.alwaysValidSchema)(l, i)) {
        let v = (0, e._)`${b} >= ${u}`;
        p !== void 0 && (v = (0, e._)`${v} && ${b} <= ${p}`), s.pass(v);
        return;
      }
      l.items = !0;
      const _ = o.name("valid");
      p === void 0 && u === 1 ? y(_, () => o.if(_, () => o.break())) : u === 0 ? (o.let(_, !0), p !== void 0 && o.if((0, e._)`${c}.length > 0`, f)) : (o.let(_, !1), f()), s.result(_, () => s.reset());
      function f() {
        const v = o.name("_valid"), S = o.let("count", 0);
        y(v, () => o.if(v, () => d(S)));
      }
      function y(v, S) {
        o.forRange("i", 0, b, (g) => {
          s.subschema({
            keyword: "contains",
            dataProp: g,
            dataPropType: t.Type.Num,
            compositeRule: !0
          }, v), S();
        });
      }
      function d(v) {
        o.code((0, e._)`${v}++`), p === void 0 ? o.if((0, e._)`${v} >= ${u}`, () => o.assign(_, !0).break()) : (o.if((0, e._)`${v} > ${p}`, () => o.assign(_, !1).break()), u === 1 ? o.assign(_, !0) : o.if((0, e._)`${v} >= ${u}`, () => o.assign(_, !0)));
      }
    }
  };
  return Hr.default = n, Hr;
}
var Oo = {}, yl;
function uc() {
  return yl || (yl = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const t = re(), r = ie(), n = Fe();
    e.error = {
      message: ({ params: { property: c, depsCount: l, deps: u } }) => {
        const p = l === 1 ? "property" : "properties";
        return (0, t.str)`must have ${p} ${u} when property ${c} is present`;
      },
      params: ({ params: { property: c, depsCount: l, deps: u, missingProperty: p } }) => (0, t._)`{property: ${c},
    missingProperty: ${p},
    depsCount: ${l},
    deps: ${u}}`
      // TODO change to reference
    };
    const s = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(c) {
        const [l, u] = o(c);
        i(c, l), a(c, u);
      }
    };
    function o({ schema: c }) {
      const l = {}, u = {};
      for (const p in c) {
        if (p === "__proto__")
          continue;
        const h = Array.isArray(c[p]) ? l : u;
        h[p] = c[p];
      }
      return [l, u];
    }
    function i(c, l = c.schema) {
      const { gen: u, data: p, it: h } = c;
      if (Object.keys(l).length === 0)
        return;
      const m = u.let("missing");
      for (const b in l) {
        const _ = l[b];
        if (_.length === 0)
          continue;
        const f = (0, n.propertyInData)(u, p, b, h.opts.ownProperties);
        c.setParams({
          property: b,
          depsCount: _.length,
          deps: _.join(", ")
        }), h.allErrors ? u.if(f, () => {
          for (const y of _)
            (0, n.checkReportMissingProp)(c, y);
        }) : (u.if((0, t._)`${f} && (${(0, n.checkMissingProp)(c, _, m)})`), (0, n.reportMissingProp)(c, m), u.else());
      }
    }
    e.validatePropertyDeps = i;
    function a(c, l = c.schema) {
      const { gen: u, data: p, keyword: h, it: m } = c, b = u.name("valid");
      for (const _ in l)
        (0, r.alwaysValidSchema)(m, l[_]) || (u.if(
          (0, n.propertyInData)(u, p, _, m.opts.ownProperties),
          () => {
            const f = c.subschema({ keyword: h, schemaProp: _ }, b);
            c.mergeValidEvaluated(f, b);
          },
          () => u.var(b, !0)
          // TODO var
        ), c.ok(b));
    }
    e.validateSchemaDeps = a, e.default = s;
  })(Oo)), Oo;
}
var Jr = {}, gl;
function XR() {
  if (gl) return Jr;
  gl = 1, Object.defineProperty(Jr, "__esModule", { value: !0 });
  const e = re(), t = ie(), n = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: s }) => (0, e._)`{propertyName: ${s.propertyName}}`
    },
    code(s) {
      const { gen: o, schema: i, data: a, it: c } = s;
      if ((0, t.alwaysValidSchema)(c, i))
        return;
      const l = o.name("valid");
      o.forIn("key", a, (u) => {
        s.setParams({ propertyName: u }), s.subschema({
          keyword: "propertyNames",
          data: u,
          dataTypes: ["string"],
          propertyName: u,
          compositeRule: !0
        }, l), o.if((0, e.not)(l), () => {
          s.error(!0), c.allErrors || o.break();
        });
      }), s.ok(l);
    }
  };
  return Jr.default = n, Jr;
}
var Xr = {}, vl;
function fy() {
  if (vl) return Xr;
  vl = 1, Object.defineProperty(Xr, "__esModule", { value: !0 });
  const e = Fe(), t = re(), r = qe(), n = ie(), o = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: i }) => (0, t._)`{additionalProperty: ${i.additionalProperty}}`
    },
    code(i) {
      const { gen: a, schema: c, parentSchema: l, data: u, errsCount: p, it: h } = i;
      if (!p)
        throw new Error("ajv implementation error");
      const { allErrors: m, opts: b } = h;
      if (h.props = !0, b.removeAdditional !== "all" && (0, n.alwaysValidSchema)(h, c))
        return;
      const _ = (0, e.allSchemaProperties)(l.properties), f = (0, e.allSchemaProperties)(l.patternProperties);
      y(), i.ok((0, t._)`${p} === ${r.default.errors}`);
      function y() {
        a.forIn("key", u, ($) => {
          !_.length && !f.length ? S($) : a.if(d($), () => S($));
        });
      }
      function d($) {
        let E;
        if (_.length > 8) {
          const I = (0, n.schemaRefOrVal)(h, l.properties, "properties");
          E = (0, e.isOwnProperty)(a, I, $);
        } else _.length ? E = (0, t.or)(..._.map((I) => (0, t._)`${$} === ${I}`)) : E = t.nil;
        return f.length && (E = (0, t.or)(E, ...f.map((I) => (0, t._)`${(0, e.usePattern)(i, I)}.test(${$})`))), (0, t.not)(E);
      }
      function v($) {
        a.code((0, t._)`delete ${u}[${$}]`);
      }
      function S($) {
        if (b.removeAdditional === "all" || b.removeAdditional && c === !1) {
          v($);
          return;
        }
        if (c === !1) {
          i.setParams({ additionalProperty: $ }), i.error(), m || a.break();
          return;
        }
        if (typeof c == "object" && !(0, n.alwaysValidSchema)(h, c)) {
          const E = a.name("valid");
          b.removeAdditional === "failing" ? (g($, E, !1), a.if((0, t.not)(E), () => {
            i.reset(), v($);
          })) : (g($, E), m || a.if((0, t.not)(E), () => a.break()));
        }
      }
      function g($, E, I) {
        const k = {
          keyword: "additionalProperties",
          dataProp: $,
          dataPropType: n.Type.Str
        };
        I === !1 && Object.assign(k, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), i.subschema(k, E);
      }
    }
  };
  return Xr.default = o, Xr;
}
var Yr = {}, wl;
function YR() {
  if (wl) return Yr;
  wl = 1, Object.defineProperty(Yr, "__esModule", { value: !0 });
  const e = Fs(), t = Fe(), r = ie(), n = fy(), s = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(o) {
      const { gen: i, schema: a, parentSchema: c, data: l, it: u } = o;
      u.opts.removeAdditional === "all" && c.additionalProperties === void 0 && n.default.code(new e.KeywordCxt(u, n.default, "additionalProperties"));
      const p = (0, t.allSchemaProperties)(a);
      for (const f of p)
        u.definedProperties.add(f);
      u.opts.unevaluated && p.length && u.props !== !0 && (u.props = r.mergeEvaluated.props(i, (0, r.toHash)(p), u.props));
      const h = p.filter((f) => !(0, r.alwaysValidSchema)(u, a[f]));
      if (h.length === 0)
        return;
      const m = i.name("valid");
      for (const f of h)
        b(f) ? _(f) : (i.if((0, t.propertyInData)(i, l, f, u.opts.ownProperties)), _(f), u.allErrors || i.else().var(m, !0), i.endIf()), o.it.definedProperties.add(f), o.ok(m);
      function b(f) {
        return u.opts.useDefaults && !u.compositeRule && a[f].default !== void 0;
      }
      function _(f) {
        o.subschema({
          keyword: "properties",
          schemaProp: f,
          dataProp: f
        }, m);
      }
    }
  };
  return Yr.default = s, Yr;
}
var Qr = {}, $l;
function QR() {
  if ($l) return Qr;
  $l = 1, Object.defineProperty(Qr, "__esModule", { value: !0 });
  const e = Fe(), t = re(), r = ie(), n = ie(), s = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(o) {
      const { gen: i, schema: a, data: c, parentSchema: l, it: u } = o, { opts: p } = u, h = (0, e.allSchemaProperties)(a), m = h.filter((S) => (0, r.alwaysValidSchema)(u, a[S]));
      if (h.length === 0 || m.length === h.length && (!u.opts.unevaluated || u.props === !0))
        return;
      const b = p.strictSchema && !p.allowMatchingProperties && l.properties, _ = i.name("valid");
      u.props !== !0 && !(u.props instanceof t.Name) && (u.props = (0, n.evaluatedPropsToName)(i, u.props));
      const { props: f } = u;
      y();
      function y() {
        for (const S of h)
          b && d(S), u.allErrors ? v(S) : (i.var(_, !0), v(S), i.if(_));
      }
      function d(S) {
        for (const g in b)
          new RegExp(S).test(g) && (0, r.checkStrictMode)(u, `property ${g} matches pattern ${S} (use allowMatchingProperties)`);
      }
      function v(S) {
        i.forIn("key", c, (g) => {
          i.if((0, t._)`${(0, e.usePattern)(o, S)}.test(${g})`, () => {
            const $ = m.includes(S);
            $ || o.subschema({
              keyword: "patternProperties",
              schemaProp: S,
              dataProp: g,
              dataPropType: n.Type.Str
            }, _), u.opts.unevaluated && f !== !0 ? i.assign((0, t._)`${f}[${g}]`, !0) : !$ && !u.allErrors && i.if((0, t.not)(_), () => i.break());
          });
        });
      }
    }
  };
  return Qr.default = s, Qr;
}
var Zr = {}, _l;
function ZR() {
  if (_l) return Zr;
  _l = 1, Object.defineProperty(Zr, "__esModule", { value: !0 });
  const e = ie(), t = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(r) {
      const { gen: n, schema: s, it: o } = r;
      if ((0, e.alwaysValidSchema)(o, s)) {
        r.fail();
        return;
      }
      const i = n.name("valid");
      r.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, i), r.failResult(i, () => r.reset(), () => r.error());
    },
    error: { message: "must NOT be valid" }
  };
  return Zr.default = t, Zr;
}
var en = {}, bl;
function eP() {
  if (bl) return en;
  bl = 1, Object.defineProperty(en, "__esModule", { value: !0 });
  const t = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: Fe().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return en.default = t, en;
}
var tn = {}, Sl;
function tP() {
  if (Sl) return tn;
  Sl = 1, Object.defineProperty(tn, "__esModule", { value: !0 });
  const e = re(), t = ie(), n = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: s }) => (0, e._)`{passingSchemas: ${s.passing}}`
    },
    code(s) {
      const { gen: o, schema: i, parentSchema: a, it: c } = s;
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      if (c.opts.discriminator && a.discriminator)
        return;
      const l = i, u = o.let("valid", !1), p = o.let("passing", null), h = o.name("_valid");
      s.setParams({ passing: p }), o.block(m), s.result(u, () => s.reset(), () => s.error(!0));
      function m() {
        l.forEach((b, _) => {
          let f;
          (0, t.alwaysValidSchema)(c, b) ? o.var(h, !0) : f = s.subschema({
            keyword: "oneOf",
            schemaProp: _,
            compositeRule: !0
          }, h), _ > 0 && o.if((0, e._)`${h} && ${u}`).assign(u, !1).assign(p, (0, e._)`[${p}, ${_}]`).else(), o.if(h, () => {
            o.assign(u, !0), o.assign(p, _), f && s.mergeEvaluated(f, e.Name);
          });
        });
      }
    }
  };
  return tn.default = n, tn;
}
var rn = {}, El;
function rP() {
  if (El) return rn;
  El = 1, Object.defineProperty(rn, "__esModule", { value: !0 });
  const e = ie(), t = {
    keyword: "allOf",
    schemaType: "array",
    code(r) {
      const { gen: n, schema: s, it: o } = r;
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const i = n.name("valid");
      s.forEach((a, c) => {
        if ((0, e.alwaysValidSchema)(o, a))
          return;
        const l = r.subschema({ keyword: "allOf", schemaProp: c }, i);
        r.ok(i), r.mergeEvaluated(l);
      });
    }
  };
  return rn.default = t, rn;
}
var nn = {}, Rl;
function nP() {
  if (Rl) return nn;
  Rl = 1, Object.defineProperty(nn, "__esModule", { value: !0 });
  const e = re(), t = ie(), n = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: o }) => (0, e.str)`must match "${o.ifClause}" schema`,
      params: ({ params: o }) => (0, e._)`{failingKeyword: ${o.ifClause}}`
    },
    code(o) {
      const { gen: i, parentSchema: a, it: c } = o;
      a.then === void 0 && a.else === void 0 && (0, t.checkStrictMode)(c, '"if" without "then" and "else" is ignored');
      const l = s(c, "then"), u = s(c, "else");
      if (!l && !u)
        return;
      const p = i.let("valid", !0), h = i.name("_valid");
      if (m(), o.reset(), l && u) {
        const _ = i.let("ifClause");
        o.setParams({ ifClause: _ }), i.if(h, b("then", _), b("else", _));
      } else l ? i.if(h, b("then")) : i.if((0, e.not)(h), b("else"));
      o.pass(p, () => o.error(!0));
      function m() {
        const _ = o.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, h);
        o.mergeEvaluated(_);
      }
      function b(_, f) {
        return () => {
          const y = o.subschema({ keyword: _ }, h);
          i.assign(p, h), o.mergeValidEvaluated(y, p), f ? i.assign(f, (0, e._)`${_}`) : o.setParams({ ifClause: _ });
        };
      }
    }
  };
  function s(o, i) {
    const a = o.schema[i];
    return a !== void 0 && !(0, t.alwaysValidSchema)(o, a);
  }
  return nn.default = n, nn;
}
var sn = {}, Pl;
function sP() {
  if (Pl) return sn;
  Pl = 1, Object.defineProperty(sn, "__esModule", { value: !0 });
  const e = ie(), t = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: r, parentSchema: n, it: s }) {
      n.if === void 0 && (0, e.checkStrictMode)(s, `"${r}" without "if" is ignored`);
    }
  };
  return sn.default = t, sn;
}
var Ol;
function oP() {
  if (Ol) return Br;
  Ol = 1, Object.defineProperty(Br, "__esModule", { value: !0 });
  const e = ly(), t = KR(), r = dy(), n = HR(), s = JR(), o = uc(), i = XR(), a = fy(), c = YR(), l = QR(), u = ZR(), p = eP(), h = tP(), m = rP(), b = nP(), _ = sP();
  function f(y = !1) {
    const d = [
      // any
      u.default,
      p.default,
      h.default,
      m.default,
      b.default,
      _.default,
      // object
      i.default,
      a.default,
      o.default,
      c.default,
      l.default
    ];
    return y ? d.push(t.default, n.default) : d.push(e.default, r.default), d.push(s.default), d;
  }
  return Br.default = f, Br;
}
var on = {}, Lt = {}, Tl;
function hy() {
  if (Tl) return Lt;
  Tl = 1, Object.defineProperty(Lt, "__esModule", { value: !0 }), Lt.dynamicAnchor = void 0;
  const e = re(), t = qe(), r = Vs(), n = ac(), s = {
    keyword: "$dynamicAnchor",
    schemaType: "string",
    code: (a) => o(a, a.schema)
  };
  function o(a, c) {
    const { gen: l, it: u } = a;
    u.schemaEnv.root.dynamicAnchors[c] = !0;
    const p = (0, e._)`${t.default.dynamicAnchors}${(0, e.getProperty)(c)}`, h = u.errSchemaPath === "#" ? u.validateName : i(a);
    l.if((0, e._)`!${p}`, () => l.assign(p, h));
  }
  Lt.dynamicAnchor = o;
  function i(a) {
    const { schemaEnv: c, schema: l, self: u } = a.it, { root: p, baseId: h, localRefs: m, meta: b } = c.root, { schemaId: _ } = u.opts, f = new r.SchemaEnv({ schema: l, schemaId: _, root: p, baseId: h, localRefs: m, meta: b });
    return r.compileSchema.call(u, f), (0, n.getValidate)(a, f);
  }
  return Lt.default = s, Lt;
}
var qt = {}, Il;
function py() {
  if (Il) return qt;
  Il = 1, Object.defineProperty(qt, "__esModule", { value: !0 }), qt.dynamicRef = void 0;
  const e = re(), t = qe(), r = ac(), n = {
    keyword: "$dynamicRef",
    schemaType: "string",
    code: (o) => s(o, o.schema)
  };
  function s(o, i) {
    const { gen: a, keyword: c, it: l } = o;
    if (i[0] !== "#")
      throw new Error(`"${c}" only supports hash fragment reference`);
    const u = i.slice(1);
    if (l.allErrors)
      p();
    else {
      const m = a.let("valid", !1);
      p(m), o.ok(m);
    }
    function p(m) {
      if (l.schemaEnv.root.dynamicAnchors[u]) {
        const b = a.let("_v", (0, e._)`${t.default.dynamicAnchors}${(0, e.getProperty)(u)}`);
        a.if(b, h(b, m), h(l.validateName, m));
      } else
        h(l.validateName, m)();
    }
    function h(m, b) {
      return b ? () => a.block(() => {
        (0, r.callRef)(o, m), a.let(b, !0);
      }) : () => (0, r.callRef)(o, m);
    }
  }
  return qt.dynamicRef = s, qt.default = n, qt;
}
var an = {}, Nl;
function iP() {
  if (Nl) return an;
  Nl = 1, Object.defineProperty(an, "__esModule", { value: !0 });
  const e = hy(), t = ie(), r = {
    keyword: "$recursiveAnchor",
    schemaType: "boolean",
    code(n) {
      n.schema ? (0, e.dynamicAnchor)(n, "") : (0, t.checkStrictMode)(n.it, "$recursiveAnchor: false is ignored");
    }
  };
  return an.default = r, an;
}
var cn = {}, Al;
function aP() {
  if (Al) return cn;
  Al = 1, Object.defineProperty(cn, "__esModule", { value: !0 });
  const e = py(), t = {
    keyword: "$recursiveRef",
    schemaType: "string",
    code: (r) => (0, e.dynamicRef)(r, r.schema)
  };
  return cn.default = t, cn;
}
var jl;
function cP() {
  if (jl) return on;
  jl = 1, Object.defineProperty(on, "__esModule", { value: !0 });
  const e = hy(), t = py(), r = iP(), n = aP(), s = [e.default, t.default, r.default, n.default];
  return on.default = s, on;
}
var un = {}, ln = {}, Cl;
function uP() {
  if (Cl) return ln;
  Cl = 1, Object.defineProperty(ln, "__esModule", { value: !0 });
  const e = uc(), t = {
    keyword: "dependentRequired",
    type: "object",
    schemaType: "object",
    error: e.error,
    code: (r) => (0, e.validatePropertyDeps)(r)
  };
  return ln.default = t, ln;
}
var dn = {}, Dl;
function lP() {
  if (Dl) return dn;
  Dl = 1, Object.defineProperty(dn, "__esModule", { value: !0 });
  const e = uc(), t = {
    keyword: "dependentSchemas",
    type: "object",
    schemaType: "object",
    code: (r) => (0, e.validateSchemaDeps)(r)
  };
  return dn.default = t, dn;
}
var fn = {}, kl;
function dP() {
  if (kl) return fn;
  kl = 1, Object.defineProperty(fn, "__esModule", { value: !0 });
  const e = ie(), t = {
    keyword: ["maxContains", "minContains"],
    type: "array",
    schemaType: "number",
    code({ keyword: r, parentSchema: n, it: s }) {
      n.contains === void 0 && (0, e.checkStrictMode)(s, `"${r}" without "contains" is ignored`);
    }
  };
  return fn.default = t, fn;
}
var Ml;
function fP() {
  if (Ml) return un;
  Ml = 1, Object.defineProperty(un, "__esModule", { value: !0 });
  const e = uP(), t = lP(), r = dP(), n = [e.default, t.default, r.default];
  return un.default = n, un;
}
var hn = {}, pn = {}, Ll;
function hP() {
  if (Ll) return pn;
  Ll = 1, Object.defineProperty(pn, "__esModule", { value: !0 });
  const e = re(), t = ie(), r = qe(), s = {
    keyword: "unevaluatedProperties",
    type: "object",
    schemaType: ["boolean", "object"],
    trackErrors: !0,
    error: {
      message: "must NOT have unevaluated properties",
      params: ({ params: o }) => (0, e._)`{unevaluatedProperty: ${o.unevaluatedProperty}}`
    },
    code(o) {
      const { gen: i, schema: a, data: c, errsCount: l, it: u } = o;
      if (!l)
        throw new Error("ajv implementation error");
      const { allErrors: p, props: h } = u;
      h instanceof e.Name ? i.if((0, e._)`${h} !== true`, () => i.forIn("key", c, (f) => i.if(b(h, f), () => m(f)))) : h !== !0 && i.forIn("key", c, (f) => h === void 0 ? m(f) : i.if(_(h, f), () => m(f))), u.props = !0, o.ok((0, e._)`${l} === ${r.default.errors}`);
      function m(f) {
        if (a === !1) {
          o.setParams({ unevaluatedProperty: f }), o.error(), p || i.break();
          return;
        }
        if (!(0, t.alwaysValidSchema)(u, a)) {
          const y = i.name("valid");
          o.subschema({
            keyword: "unevaluatedProperties",
            dataProp: f,
            dataPropType: t.Type.Str
          }, y), p || i.if((0, e.not)(y), () => i.break());
        }
      }
      function b(f, y) {
        return (0, e._)`!${f} || !${f}[${y}]`;
      }
      function _(f, y) {
        const d = [];
        for (const v in f)
          f[v] === !0 && d.push((0, e._)`${y} !== ${v}`);
        return (0, e.and)(...d);
      }
    }
  };
  return pn.default = s, pn;
}
var mn = {}, ql;
function pP() {
  if (ql) return mn;
  ql = 1, Object.defineProperty(mn, "__esModule", { value: !0 });
  const e = re(), t = ie(), n = {
    keyword: "unevaluatedItems",
    type: "array",
    schemaType: ["boolean", "object"],
    error: {
      message: ({ params: { len: s } }) => (0, e.str)`must NOT have more than ${s} items`,
      params: ({ params: { len: s } }) => (0, e._)`{limit: ${s}}`
    },
    code(s) {
      const { gen: o, schema: i, data: a, it: c } = s, l = c.items || 0;
      if (l === !0)
        return;
      const u = o.const("len", (0, e._)`${a}.length`);
      if (i === !1)
        s.setParams({ len: l }), s.fail((0, e._)`${u} > ${l}`);
      else if (typeof i == "object" && !(0, t.alwaysValidSchema)(c, i)) {
        const h = o.var("valid", (0, e._)`${u} <= ${l}`);
        o.if((0, e.not)(h), () => p(h, l)), s.ok(h);
      }
      c.items = !0;
      function p(h, m) {
        o.forRange("i", m, u, (b) => {
          s.subschema({ keyword: "unevaluatedItems", dataProp: b, dataPropType: t.Type.Num }, h), c.allErrors || o.if((0, e.not)(h), () => o.break());
        });
      }
    }
  };
  return mn.default = n, mn;
}
var Fl;
function mP() {
  if (Fl) return hn;
  Fl = 1, Object.defineProperty(hn, "__esModule", { value: !0 });
  const e = hP(), t = pP(), r = [e.default, t.default];
  return hn.default = r, hn;
}
var yn = {}, gn = {}, Ul;
function yP() {
  if (Ul) return gn;
  Ul = 1, Object.defineProperty(gn, "__esModule", { value: !0 });
  const e = re(), r = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match format "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{format: ${n}}`
    },
    code(n, s) {
      const { gen: o, data: i, $data: a, schema: c, schemaCode: l, it: u } = n, { opts: p, errSchemaPath: h, schemaEnv: m, self: b } = u;
      if (!p.validateFormats)
        return;
      a ? _() : f();
      function _() {
        const y = o.scopeValue("formats", {
          ref: b.formats,
          code: p.code.formats
        }), d = o.const("fDef", (0, e._)`${y}[${l}]`), v = o.let("fType"), S = o.let("format");
        o.if((0, e._)`typeof ${d} == "object" && !(${d} instanceof RegExp)`, () => o.assign(v, (0, e._)`${d}.type || "string"`).assign(S, (0, e._)`${d}.validate`), () => o.assign(v, (0, e._)`"string"`).assign(S, d)), n.fail$data((0, e.or)(g(), $()));
        function g() {
          return p.strictSchema === !1 ? e.nil : (0, e._)`${l} && !${S}`;
        }
        function $() {
          const E = m.$async ? (0, e._)`(${d}.async ? await ${S}(${i}) : ${S}(${i}))` : (0, e._)`${S}(${i})`, I = (0, e._)`(typeof ${S} == "function" ? ${E} : ${S}.test(${i}))`;
          return (0, e._)`${S} && ${S} !== true && ${v} === ${s} && !${I}`;
        }
      }
      function f() {
        const y = b.formats[c];
        if (!y) {
          g();
          return;
        }
        if (y === !0)
          return;
        const [d, v, S] = $(y);
        d === s && n.pass(E());
        function g() {
          if (p.strictSchema === !1) {
            b.logger.warn(I());
            return;
          }
          throw new Error(I());
          function I() {
            return `unknown format "${c}" ignored in schema at path "${h}"`;
          }
        }
        function $(I) {
          const k = I instanceof RegExp ? (0, e.regexpCode)(I) : p.code.formats ? (0, e._)`${p.code.formats}${(0, e.getProperty)(c)}` : void 0, F = o.scopeValue("formats", { key: c, ref: I, code: k });
          return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, e._)`${F}.validate`] : ["string", I, F];
        }
        function E() {
          if (typeof y == "object" && !(y instanceof RegExp) && y.async) {
            if (!m.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${S}(${i})`;
          }
          return typeof v == "function" ? (0, e._)`${S}(${i})` : (0, e._)`${S}.test(${i})`;
        }
      }
    }
  };
  return gn.default = r, gn;
}
var Vl;
function gP() {
  if (Vl) return yn;
  Vl = 1, Object.defineProperty(yn, "__esModule", { value: !0 });
  const t = [yP().default];
  return yn.default = t, yn;
}
var $t = {}, zl;
function vP() {
  return zl || (zl = 1, Object.defineProperty($t, "__esModule", { value: !0 }), $t.contentVocabulary = $t.metadataVocabulary = void 0, $t.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], $t.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), $t;
}
var xl;
function wP() {
  if (xl) return Ir;
  xl = 1, Object.defineProperty(Ir, "__esModule", { value: !0 });
  const e = DR(), t = WR(), r = oP(), n = cP(), s = fP(), o = mP(), i = gP(), a = vP(), c = [
    n.default,
    e.default,
    t.default,
    (0, r.default)(!0),
    i.default,
    a.metadataVocabulary,
    a.contentVocabulary,
    s.default,
    o.default
  ];
  return Ir.default = c, Ir;
}
var vn = {}, rr = {}, Gl;
function $P() {
  if (Gl) return rr;
  Gl = 1, Object.defineProperty(rr, "__esModule", { value: !0 }), rr.DiscrError = void 0;
  var e;
  return (function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  })(e || (rr.DiscrError = e = {})), rr;
}
var Bl;
function _P() {
  if (Bl) return vn;
  Bl = 1, Object.defineProperty(vn, "__esModule", { value: !0 });
  const e = re(), t = $P(), r = Vs(), n = Us(), s = ie(), i = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: c } }) => a === t.DiscrError.Tag ? `tag "${c}" must be string` : `value of tag "${c}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: c, tagName: l } }) => (0, e._)`{error: ${a}, tag: ${l}, tagValue: ${c}}`
    },
    code(a) {
      const { gen: c, data: l, schema: u, parentSchema: p, it: h } = a, { oneOf: m } = p;
      if (!h.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const b = u.propertyName;
      if (typeof b != "string")
        throw new Error("discriminator: requires propertyName");
      if (u.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!m)
        throw new Error("discriminator: requires oneOf keyword");
      const _ = c.let("valid", !1), f = c.const("tag", (0, e._)`${l}${(0, e.getProperty)(b)}`);
      c.if((0, e._)`typeof ${f} == "string"`, () => y(), () => a.error(!1, { discrError: t.DiscrError.Tag, tag: f, tagName: b })), a.ok(_);
      function y() {
        const S = v();
        c.if(!1);
        for (const g in S)
          c.elseIf((0, e._)`${f} === ${g}`), c.assign(_, d(S[g]));
        c.else(), a.error(!1, { discrError: t.DiscrError.Mapping, tag: f, tagName: b }), c.endIf();
      }
      function d(S) {
        const g = c.name("valid"), $ = a.subschema({ keyword: "oneOf", schemaProp: S }, g);
        return a.mergeEvaluated($, e.Name), g;
      }
      function v() {
        var S;
        const g = {}, $ = I(p);
        let E = !0;
        for (let M = 0; M < m.length; M++) {
          let V = m[M];
          if (V?.$ref && !(0, s.schemaHasRulesButRef)(V, h.self.RULES)) {
            const L = V.$ref;
            if (V = r.resolveRef.call(h.self, h.schemaEnv.root, h.baseId, L), V instanceof r.SchemaEnv && (V = V.schema), V === void 0)
              throw new n.default(h.opts.uriResolver, h.baseId, L);
          }
          const z = (S = V?.properties) === null || S === void 0 ? void 0 : S[b];
          if (typeof z != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${b}"`);
          E = E && ($ || I(V)), k(z, M);
        }
        if (!E)
          throw new Error(`discriminator: "${b}" must be required`);
        return g;
        function I({ required: M }) {
          return Array.isArray(M) && M.includes(b);
        }
        function k(M, V) {
          if (M.const)
            F(M.const, V);
          else if (M.enum)
            for (const z of M.enum)
              F(z, V);
          else
            throw new Error(`discriminator: "properties/${b}" must have "const" or "enum"`);
        }
        function F(M, V) {
          if (typeof M != "string" || M in g)
            throw new Error(`discriminator: "${b}" values must be unique strings`);
          g[M] = V;
        }
      }
    }
  };
  return vn.default = i, vn;
}
var wn = {};
const bP = "https://json-schema.org/draft/2020-12/schema", SP = "https://json-schema.org/draft/2020-12/schema", EP = { "https://json-schema.org/draft/2020-12/vocab/core": !0, "https://json-schema.org/draft/2020-12/vocab/applicator": !0, "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0, "https://json-schema.org/draft/2020-12/vocab/validation": !0, "https://json-schema.org/draft/2020-12/vocab/meta-data": !0, "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0, "https://json-schema.org/draft/2020-12/vocab/content": !0 }, RP = "meta", PP = "Core and Validation specifications meta-schema", OP = [{ $ref: "meta/core" }, { $ref: "meta/applicator" }, { $ref: "meta/unevaluated" }, { $ref: "meta/validation" }, { $ref: "meta/meta-data" }, { $ref: "meta/format-annotation" }, { $ref: "meta/content" }], TP = ["object", "boolean"], IP = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", NP = { definitions: { $comment: '"definitions" has been replaced by "$defs".', type: "object", additionalProperties: { $dynamicRef: "#meta" }, deprecated: !0, default: {} }, dependencies: { $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.', type: "object", additionalProperties: { anyOf: [{ $dynamicRef: "#meta" }, { $ref: "meta/validation#/$defs/stringArray" }] }, deprecated: !0, default: {} }, $recursiveAnchor: { $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".', $ref: "meta/core#/$defs/anchorString", deprecated: !0 }, $recursiveRef: { $comment: '"$recursiveRef" has been replaced by "$dynamicRef".', $ref: "meta/core#/$defs/uriReferenceString", deprecated: !0 } }, AP = {
  $schema: bP,
  $id: SP,
  $vocabulary: EP,
  $dynamicAnchor: RP,
  title: PP,
  allOf: OP,
  type: TP,
  $comment: IP,
  properties: NP
}, jP = "https://json-schema.org/draft/2020-12/schema", CP = "https://json-schema.org/draft/2020-12/meta/applicator", DP = { "https://json-schema.org/draft/2020-12/vocab/applicator": !0 }, kP = "meta", MP = "Applicator vocabulary meta-schema", LP = ["object", "boolean"], qP = { prefixItems: { $ref: "#/$defs/schemaArray" }, items: { $dynamicRef: "#meta" }, contains: { $dynamicRef: "#meta" }, additionalProperties: { $dynamicRef: "#meta" }, properties: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, propertyNames: { format: "regex" }, default: {} }, dependentSchemas: { type: "object", additionalProperties: { $dynamicRef: "#meta" }, default: {} }, propertyNames: { $dynamicRef: "#meta" }, if: { $dynamicRef: "#meta" }, then: { $dynamicRef: "#meta" }, else: { $dynamicRef: "#meta" }, allOf: { $ref: "#/$defs/schemaArray" }, anyOf: { $ref: "#/$defs/schemaArray" }, oneOf: { $ref: "#/$defs/schemaArray" }, not: { $dynamicRef: "#meta" } }, FP = { schemaArray: { type: "array", minItems: 1, items: { $dynamicRef: "#meta" } } }, UP = {
  $schema: jP,
  $id: CP,
  $vocabulary: DP,
  $dynamicAnchor: kP,
  title: MP,
  type: LP,
  properties: qP,
  $defs: FP
}, VP = "https://json-schema.org/draft/2020-12/schema", zP = "https://json-schema.org/draft/2020-12/meta/unevaluated", xP = { "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0 }, GP = "meta", BP = "Unevaluated applicator vocabulary meta-schema", WP = ["object", "boolean"], KP = { unevaluatedItems: { $dynamicRef: "#meta" }, unevaluatedProperties: { $dynamicRef: "#meta" } }, HP = {
  $schema: VP,
  $id: zP,
  $vocabulary: xP,
  $dynamicAnchor: GP,
  title: BP,
  type: WP,
  properties: KP
}, JP = "https://json-schema.org/draft/2020-12/schema", XP = "https://json-schema.org/draft/2020-12/meta/content", YP = { "https://json-schema.org/draft/2020-12/vocab/content": !0 }, QP = "meta", ZP = "Content vocabulary meta-schema", e1 = ["object", "boolean"], t1 = { contentEncoding: { type: "string" }, contentMediaType: { type: "string" }, contentSchema: { $dynamicRef: "#meta" } }, r1 = {
  $schema: JP,
  $id: XP,
  $vocabulary: YP,
  $dynamicAnchor: QP,
  title: ZP,
  type: e1,
  properties: t1
}, n1 = "https://json-schema.org/draft/2020-12/schema", s1 = "https://json-schema.org/draft/2020-12/meta/core", o1 = { "https://json-schema.org/draft/2020-12/vocab/core": !0 }, i1 = "meta", a1 = "Core vocabulary meta-schema", c1 = ["object", "boolean"], u1 = { $id: { $ref: "#/$defs/uriReferenceString", $comment: "Non-empty fragments not allowed.", pattern: "^[^#]*#?$" }, $schema: { $ref: "#/$defs/uriString" }, $ref: { $ref: "#/$defs/uriReferenceString" }, $anchor: { $ref: "#/$defs/anchorString" }, $dynamicRef: { $ref: "#/$defs/uriReferenceString" }, $dynamicAnchor: { $ref: "#/$defs/anchorString" }, $vocabulary: { type: "object", propertyNames: { $ref: "#/$defs/uriString" }, additionalProperties: { type: "boolean" } }, $comment: { type: "string" }, $defs: { type: "object", additionalProperties: { $dynamicRef: "#meta" } } }, l1 = { anchorString: { type: "string", pattern: "^[A-Za-z_][-A-Za-z0-9._]*$" }, uriString: { type: "string", format: "uri" }, uriReferenceString: { type: "string", format: "uri-reference" } }, d1 = {
  $schema: n1,
  $id: s1,
  $vocabulary: o1,
  $dynamicAnchor: i1,
  title: a1,
  type: c1,
  properties: u1,
  $defs: l1
}, f1 = "https://json-schema.org/draft/2020-12/schema", h1 = "https://json-schema.org/draft/2020-12/meta/format-annotation", p1 = { "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0 }, m1 = "meta", y1 = "Format vocabulary meta-schema for annotation results", g1 = ["object", "boolean"], v1 = { format: { type: "string" } }, w1 = {
  $schema: f1,
  $id: h1,
  $vocabulary: p1,
  $dynamicAnchor: m1,
  title: y1,
  type: g1,
  properties: v1
}, $1 = "https://json-schema.org/draft/2020-12/schema", _1 = "https://json-schema.org/draft/2020-12/meta/meta-data", b1 = { "https://json-schema.org/draft/2020-12/vocab/meta-data": !0 }, S1 = "meta", E1 = "Meta-data vocabulary meta-schema", R1 = ["object", "boolean"], P1 = { title: { type: "string" }, description: { type: "string" }, default: !0, deprecated: { type: "boolean", default: !1 }, readOnly: { type: "boolean", default: !1 }, writeOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 } }, O1 = {
  $schema: $1,
  $id: _1,
  $vocabulary: b1,
  $dynamicAnchor: S1,
  title: E1,
  type: R1,
  properties: P1
}, T1 = "https://json-schema.org/draft/2020-12/schema", I1 = "https://json-schema.org/draft/2020-12/meta/validation", N1 = { "https://json-schema.org/draft/2020-12/vocab/validation": !0 }, A1 = "meta", j1 = "Validation vocabulary meta-schema", C1 = ["object", "boolean"], D1 = { type: { anyOf: [{ $ref: "#/$defs/simpleTypes" }, { type: "array", items: { $ref: "#/$defs/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, const: !0, enum: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/$defs/nonNegativeInteger" }, minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, maxItems: { $ref: "#/$defs/nonNegativeInteger" }, minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, maxContains: { $ref: "#/$defs/nonNegativeInteger" }, minContains: { $ref: "#/$defs/nonNegativeInteger", default: 1 }, maxProperties: { $ref: "#/$defs/nonNegativeInteger" }, minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" }, required: { $ref: "#/$defs/stringArray" }, dependentRequired: { type: "object", additionalProperties: { $ref: "#/$defs/stringArray" } } }, k1 = { nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { $ref: "#/$defs/nonNegativeInteger", default: 0 }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, M1 = {
  $schema: T1,
  $id: I1,
  $vocabulary: N1,
  $dynamicAnchor: A1,
  title: j1,
  type: C1,
  properties: D1,
  $defs: k1
};
var Wl;
function L1() {
  if (Wl) return wn;
  Wl = 1, Object.defineProperty(wn, "__esModule", { value: !0 });
  const e = AP, t = UP, r = HP, n = r1, s = d1, o = w1, i = O1, a = M1, c = ["/properties"];
  function l(u) {
    return [
      e,
      t,
      r,
      n,
      s,
      p(this, o),
      i,
      p(this, a)
    ].forEach((h) => this.addMetaSchema(h, void 0, !1)), this;
    function p(h, m) {
      return u ? h.$dataMetaSchema(m, c) : m;
    }
  }
  return wn.default = l, wn;
}
var Kl;
function q1() {
  return Kl || (Kl = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
    const r = jR(), n = wP(), s = _P(), o = L1(), i = "https://json-schema.org/draft/2020-12/schema";
    class a extends r.default {
      constructor(m = {}) {
        super({
          ...m,
          dynamicRef: !0,
          next: !0,
          unevaluated: !0
        });
      }
      _addVocabularies() {
        super._addVocabularies(), n.default.forEach((m) => this.addVocabulary(m)), this.opts.discriminator && this.addKeyword(s.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        const { $data: m, meta: b } = this.opts;
        b && (o.default.call(this, m), this.refs["http://json-schema.org/schema"] = i);
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(i) ? i : void 0);
      }
    }
    t.Ajv2020 = a, e.exports = t = a, e.exports.Ajv2020 = a, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = a;
    var c = Fs();
    Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
      return c.KeywordCxt;
    } });
    var l = re();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return l._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return l.str;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return l.stringify;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return l.nil;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return l.Name;
    } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
      return l.CodeGen;
    } });
    var u = ic();
    Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
      return u.default;
    } });
    var p = Us();
    Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
      return p.default;
    } });
  })(Er, Er.exports)), Er.exports;
}
var F1 = q1(), $n = { exports: {} }, To = {}, Hl;
function U1() {
  return Hl || (Hl = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
    function t(M, V) {
      return { validate: M, compare: V };
    }
    e.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: t(o, i),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: t(c(!0), l),
      "date-time": t(h(!0), m),
      "iso-time": t(c(), u),
      "iso-date-time": t(h(), b),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri: y,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex: F,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte: v,
      // signed 32 bit integer
      int32: { type: "number", validate: $ },
      // signed 64 bit integer
      int64: { type: "number", validate: E },
      // C-type float
      float: { type: "number", validate: I },
      // C-type double
      double: { type: "number", validate: I },
      // hint to the UI to hide input strings
      password: !0,
      // unchecked string payload
      binary: !0
    }, e.fastFormats = {
      ...e.fullFormats,
      date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, i),
      time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, l),
      "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, m),
      "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, u),
      "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, b),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    }, e.formatNames = Object.keys(e.fullFormats);
    function r(M) {
      return M % 4 === 0 && (M % 100 !== 0 || M % 400 === 0);
    }
    const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function o(M) {
      const V = n.exec(M);
      if (!V)
        return !1;
      const z = +V[1], L = +V[2], U = +V[3];
      return L >= 1 && L <= 12 && U >= 1 && U <= (L === 2 && r(z) ? 29 : s[L]);
    }
    function i(M, V) {
      if (M && V)
        return M > V ? 1 : M < V ? -1 : 0;
    }
    const a = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function c(M) {
      return function(z) {
        const L = a.exec(z);
        if (!L)
          return !1;
        const U = +L[1], H = +L[2], K = +L[3], W = L[4], X = L[5] === "-" ? -1 : 1, C = +(L[6] || 0), O = +(L[7] || 0);
        if (C > 23 || O > 59 || M && !W)
          return !1;
        if (U <= 23 && H <= 59 && K < 60)
          return !0;
        const j = H - O * X, T = U - C * X - (j < 0 ? 1 : 0);
        return (T === 23 || T === -1) && (j === 59 || j === -1) && K < 61;
      };
    }
    function l(M, V) {
      if (!(M && V))
        return;
      const z = (/* @__PURE__ */ new Date("2020-01-01T" + M)).valueOf(), L = (/* @__PURE__ */ new Date("2020-01-01T" + V)).valueOf();
      if (z && L)
        return z - L;
    }
    function u(M, V) {
      if (!(M && V))
        return;
      const z = a.exec(M), L = a.exec(V);
      if (z && L)
        return M = z[1] + z[2] + z[3], V = L[1] + L[2] + L[3], M > V ? 1 : M < V ? -1 : 0;
    }
    const p = /t|\s/i;
    function h(M) {
      const V = c(M);
      return function(L) {
        const U = L.split(p);
        return U.length === 2 && o(U[0]) && V(U[1]);
      };
    }
    function m(M, V) {
      if (!(M && V))
        return;
      const z = new Date(M).valueOf(), L = new Date(V).valueOf();
      if (z && L)
        return z - L;
    }
    function b(M, V) {
      if (!(M && V))
        return;
      const [z, L] = M.split(p), [U, H] = V.split(p), K = i(z, U);
      if (K !== void 0)
        return K || l(L, H);
    }
    const _ = /\/|:/, f = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function y(M) {
      return _.test(M) && f.test(M);
    }
    const d = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function v(M) {
      return d.lastIndex = 0, d.test(M);
    }
    const S = -2147483648, g = 2 ** 31 - 1;
    function $(M) {
      return Number.isInteger(M) && M <= g && M >= S;
    }
    function E(M) {
      return Number.isInteger(M);
    }
    function I() {
      return !0;
    }
    const k = /[^\\]\\Z/;
    function F(M) {
      if (k.test(M))
        return !1;
      try {
        return new RegExp(M), !0;
      } catch {
        return !1;
      }
    }
  })(To)), To;
}
var Io = {}, _n = { exports: {} }, No = {}, Qe = {}, _t = {}, Ao = {}, jo = {}, Co = {}, Jl;
function Ss() {
  return Jl || (Jl = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class t {
    }
    e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class r extends t {
      constructor(d) {
        if (super(), !e.IDENTIFIER.test(d))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = d;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = r;
    class n extends t {
      constructor(d) {
        super(), this._items = typeof d == "string" ? [d] : d;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const d = this._items[0];
        return d === "" || d === '""';
      }
      get str() {
        var d;
        return (d = this._str) !== null && d !== void 0 ? d : this._str = this._items.reduce((v, S) => `${v}${S}`, "");
      }
      get names() {
        var d;
        return (d = this._names) !== null && d !== void 0 ? d : this._names = this._items.reduce((v, S) => (S instanceof r && (v[S.str] = (v[S.str] || 0) + 1), v), {});
      }
    }
    e._Code = n, e.nil = new n("");
    function s(y, ...d) {
      const v = [y[0]];
      let S = 0;
      for (; S < d.length; )
        a(v, d[S]), v.push(y[++S]);
      return new n(v);
    }
    e._ = s;
    const o = new n("+");
    function i(y, ...d) {
      const v = [m(y[0])];
      let S = 0;
      for (; S < d.length; )
        v.push(o), a(v, d[S]), v.push(o, m(y[++S]));
      return c(v), new n(v);
    }
    e.str = i;
    function a(y, d) {
      d instanceof n ? y.push(...d._items) : d instanceof r ? y.push(d) : y.push(p(d));
    }
    e.addCodeArg = a;
    function c(y) {
      let d = 1;
      for (; d < y.length - 1; ) {
        if (y[d] === o) {
          const v = l(y[d - 1], y[d + 1]);
          if (v !== void 0) {
            y.splice(d - 1, 3, v);
            continue;
          }
          y[d++] = "+";
        }
        d++;
      }
    }
    function l(y, d) {
      if (d === '""')
        return y;
      if (y === '""')
        return d;
      if (typeof y == "string")
        return d instanceof r || y[y.length - 1] !== '"' ? void 0 : typeof d != "string" ? `${y.slice(0, -1)}${d}"` : d[0] === '"' ? y.slice(0, -1) + d.slice(1) : void 0;
      if (typeof d == "string" && d[0] === '"' && !(y instanceof r))
        return `"${y}${d.slice(1)}`;
    }
    function u(y, d) {
      return d.emptyStr() ? y : y.emptyStr() ? d : i`${y}${d}`;
    }
    e.strConcat = u;
    function p(y) {
      return typeof y == "number" || typeof y == "boolean" || y === null ? y : m(Array.isArray(y) ? y.join(",") : y);
    }
    function h(y) {
      return new n(m(y));
    }
    e.stringify = h;
    function m(y) {
      return JSON.stringify(y).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = m;
    function b(y) {
      return typeof y == "string" && e.IDENTIFIER.test(y) ? new n(`.${y}`) : s`[${y}]`;
    }
    e.getProperty = b;
    function _(y) {
      if (typeof y == "string" && e.IDENTIFIER.test(y))
        return new n(`${y}`);
      throw new Error(`CodeGen: invalid export name: ${y}, use explicit $id name mapping`);
    }
    e.getEsmExportName = _;
    function f(y) {
      return new n(y.toString());
    }
    e.regexpCode = f;
  })(Co)), Co;
}
var Do = {}, Xl;
function Yl() {
  return Xl || (Xl = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const t = Ss();
    class r extends Error {
      constructor(l) {
        super(`CodeGen: "code" for ${l} not defined`), this.value = l.value;
      }
    }
    var n;
    (function(c) {
      c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
    })(n || (e.UsedValueState = n = {})), e.varKinds = {
      const: new t.Name("const"),
      let: new t.Name("let"),
      var: new t.Name("var")
    };
    class s {
      constructor({ prefixes: l, parent: u } = {}) {
        this._names = {}, this._prefixes = l, this._parent = u;
      }
      toName(l) {
        return l instanceof t.Name ? l : this.name(l);
      }
      name(l) {
        return new t.Name(this._newName(l));
      }
      _newName(l) {
        const u = this._names[l] || this._nameGroup(l);
        return `${l}${u.index++}`;
      }
      _nameGroup(l) {
        var u, p;
        if (!((p = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || p === void 0) && p.has(l) || this._prefixes && !this._prefixes.has(l))
          throw new Error(`CodeGen: prefix "${l}" is not allowed in this scope`);
        return this._names[l] = { prefix: l, index: 0 };
      }
    }
    e.Scope = s;
    class o extends t.Name {
      constructor(l, u) {
        super(u), this.prefix = l;
      }
      setValue(l, { property: u, itemIndex: p }) {
        this.value = l, this.scopePath = (0, t._)`.${new t.Name(u)}[${p}]`;
      }
    }
    e.ValueScopeName = o;
    const i = (0, t._)`\n`;
    class a extends s {
      constructor(l) {
        super(l), this._values = {}, this._scope = l.scope, this.opts = { ...l, _n: l.lines ? i : t.nil };
      }
      get() {
        return this._scope;
      }
      name(l) {
        return new o(l, this._newName(l));
      }
      value(l, u) {
        var p;
        if (u.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const h = this.toName(l), { prefix: m } = h, b = (p = u.key) !== null && p !== void 0 ? p : u.ref;
        let _ = this._values[m];
        if (_) {
          const d = _.get(b);
          if (d)
            return d;
        } else
          _ = this._values[m] = /* @__PURE__ */ new Map();
        _.set(b, h);
        const f = this._scope[m] || (this._scope[m] = []), y = f.length;
        return f[y] = u.ref, h.setValue(u, { property: m, itemIndex: y }), h;
      }
      getValue(l, u) {
        const p = this._values[l];
        if (p)
          return p.get(u);
      }
      scopeRefs(l, u = this._values) {
        return this._reduceValues(u, (p) => {
          if (p.scopePath === void 0)
            throw new Error(`CodeGen: name "${p}" has no value`);
          return (0, t._)`${l}${p.scopePath}`;
        });
      }
      scopeCode(l = this._values, u, p) {
        return this._reduceValues(l, (h) => {
          if (h.value === void 0)
            throw new Error(`CodeGen: name "${h}" has no value`);
          return h.value.code;
        }, u, p);
      }
      _reduceValues(l, u, p = {}, h) {
        let m = t.nil;
        for (const b in l) {
          const _ = l[b];
          if (!_)
            continue;
          const f = p[b] = p[b] || /* @__PURE__ */ new Map();
          _.forEach((y) => {
            if (f.has(y))
              return;
            f.set(y, n.Started);
            let d = u(y);
            if (d) {
              const v = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              m = (0, t._)`${m}${v} ${y} = ${d};${this.opts._n}`;
            } else if (d = h?.(y))
              m = (0, t._)`${m}${d}${this.opts._n}`;
            else
              throw new r(y);
            f.set(y, n.Completed);
          });
        }
        return m;
      }
    }
    e.ValueScope = a;
  })(Do)), Do;
}
var Ql;
function oe() {
  return Ql || (Ql = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const t = Ss(), r = Yl();
    var n = Ss();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return n._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return n.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return n.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return n.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return n.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return n.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return n.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return n.Name;
    } });
    var s = Yl();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return s.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return s.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return s.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return s.varKinds;
    } }), e.operators = {
      GT: new t._Code(">"),
      GTE: new t._Code(">="),
      LT: new t._Code("<"),
      LTE: new t._Code("<="),
      EQ: new t._Code("==="),
      NEQ: new t._Code("!=="),
      NOT: new t._Code("!"),
      OR: new t._Code("||"),
      AND: new t._Code("&&"),
      ADD: new t._Code("+")
    };
    class o {
      optimizeNodes() {
        return this;
      }
      optimizeNames(w, R) {
        return this;
      }
    }
    class i extends o {
      constructor(w, R, A) {
        super(), this.varKind = w, this.name = R, this.rhs = A;
      }
      render({ es5: w, _n: R }) {
        const A = w ? r.varKinds.var : this.varKind, x = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${A} ${this.name}${x};` + R;
      }
      optimizeNames(w, R) {
        if (w[this.name.str])
          return this.rhs && (this.rhs = L(this.rhs, w, R)), this;
      }
      get names() {
        return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
      }
    }
    class a extends o {
      constructor(w, R, A) {
        super(), this.lhs = w, this.rhs = R, this.sideEffects = A;
      }
      render({ _n: w }) {
        return `${this.lhs} = ${this.rhs};` + w;
      }
      optimizeNames(w, R) {
        if (!(this.lhs instanceof t.Name && !w[this.lhs.str] && !this.sideEffects))
          return this.rhs = L(this.rhs, w, R), this;
      }
      get names() {
        const w = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
        return z(w, this.rhs);
      }
    }
    class c extends a {
      constructor(w, R, A, x) {
        super(w, A, x), this.op = R;
      }
      render({ _n: w }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + w;
      }
    }
    class l extends o {
      constructor(w) {
        super(), this.label = w, this.names = {};
      }
      render({ _n: w }) {
        return `${this.label}:` + w;
      }
    }
    class u extends o {
      constructor(w) {
        super(), this.label = w, this.names = {};
      }
      render({ _n: w }) {
        return `break${this.label ? ` ${this.label}` : ""};` + w;
      }
    }
    class p extends o {
      constructor(w) {
        super(), this.error = w;
      }
      render({ _n: w }) {
        return `throw ${this.error};` + w;
      }
      get names() {
        return this.error.names;
      }
    }
    class h extends o {
      constructor(w) {
        super(), this.code = w;
      }
      render({ _n: w }) {
        return `${this.code};` + w;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(w, R) {
        return this.code = L(this.code, w, R), this;
      }
      get names() {
        return this.code instanceof t._CodeOrName ? this.code.names : {};
      }
    }
    class m extends o {
      constructor(w = []) {
        super(), this.nodes = w;
      }
      render(w) {
        return this.nodes.reduce((R, A) => R + A.render(w), "");
      }
      optimizeNodes() {
        const { nodes: w } = this;
        let R = w.length;
        for (; R--; ) {
          const A = w[R].optimizeNodes();
          Array.isArray(A) ? w.splice(R, 1, ...A) : A ? w[R] = A : w.splice(R, 1);
        }
        return w.length > 0 ? this : void 0;
      }
      optimizeNames(w, R) {
        const { nodes: A } = this;
        let x = A.length;
        for (; x--; ) {
          const B = A[x];
          B.optimizeNames(w, R) || (U(w, B.names), A.splice(x, 1));
        }
        return A.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((w, R) => V(w, R.names), {});
      }
    }
    class b extends m {
      render(w) {
        return "{" + w._n + super.render(w) + "}" + w._n;
      }
    }
    class _ extends m {
    }
    class f extends b {
    }
    f.kind = "else";
    class y extends b {
      constructor(w, R) {
        super(R), this.condition = w;
      }
      render(w) {
        let R = `if(${this.condition})` + super.render(w);
        return this.else && (R += "else " + this.else.render(w)), R;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const w = this.condition;
        if (w === !0)
          return this.nodes;
        let R = this.else;
        if (R) {
          const A = R.optimizeNodes();
          R = this.else = Array.isArray(A) ? new f(A) : A;
        }
        if (R)
          return w === !1 ? R instanceof y ? R : R.nodes : this.nodes.length ? this : new y(H(w), R instanceof y ? [R] : R.nodes);
        if (!(w === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(w, R) {
        var A;
        if (this.else = (A = this.else) === null || A === void 0 ? void 0 : A.optimizeNames(w, R), !!(super.optimizeNames(w, R) || this.else))
          return this.condition = L(this.condition, w, R), this;
      }
      get names() {
        const w = super.names;
        return z(w, this.condition), this.else && V(w, this.else.names), w;
      }
    }
    y.kind = "if";
    class d extends b {
    }
    d.kind = "for";
    class v extends d {
      constructor(w) {
        super(), this.iteration = w;
      }
      render(w) {
        return `for(${this.iteration})` + super.render(w);
      }
      optimizeNames(w, R) {
        if (super.optimizeNames(w, R))
          return this.iteration = L(this.iteration, w, R), this;
      }
      get names() {
        return V(super.names, this.iteration.names);
      }
    }
    class S extends d {
      constructor(w, R, A, x) {
        super(), this.varKind = w, this.name = R, this.from = A, this.to = x;
      }
      render(w) {
        const R = w.es5 ? r.varKinds.var : this.varKind, { name: A, from: x, to: B } = this;
        return `for(${R} ${A}=${x}; ${A}<${B}; ${A}++)` + super.render(w);
      }
      get names() {
        const w = z(super.names, this.from);
        return z(w, this.to);
      }
    }
    class g extends d {
      constructor(w, R, A, x) {
        super(), this.loop = w, this.varKind = R, this.name = A, this.iterable = x;
      }
      render(w) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(w);
      }
      optimizeNames(w, R) {
        if (super.optimizeNames(w, R))
          return this.iterable = L(this.iterable, w, R), this;
      }
      get names() {
        return V(super.names, this.iterable.names);
      }
    }
    class $ extends b {
      constructor(w, R, A) {
        super(), this.name = w, this.args = R, this.async = A;
      }
      render(w) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(w);
      }
    }
    $.kind = "func";
    class E extends m {
      render(w) {
        return "return " + super.render(w);
      }
    }
    E.kind = "return";
    class I extends b {
      render(w) {
        let R = "try" + super.render(w);
        return this.catch && (R += this.catch.render(w)), this.finally && (R += this.finally.render(w)), R;
      }
      optimizeNodes() {
        var w, R;
        return super.optimizeNodes(), (w = this.catch) === null || w === void 0 || w.optimizeNodes(), (R = this.finally) === null || R === void 0 || R.optimizeNodes(), this;
      }
      optimizeNames(w, R) {
        var A, x;
        return super.optimizeNames(w, R), (A = this.catch) === null || A === void 0 || A.optimizeNames(w, R), (x = this.finally) === null || x === void 0 || x.optimizeNames(w, R), this;
      }
      get names() {
        const w = super.names;
        return this.catch && V(w, this.catch.names), this.finally && V(w, this.finally.names), w;
      }
    }
    class k extends b {
      constructor(w) {
        super(), this.error = w;
      }
      render(w) {
        return `catch(${this.error})` + super.render(w);
      }
    }
    k.kind = "catch";
    class F extends b {
      render(w) {
        return "finally" + super.render(w);
      }
    }
    F.kind = "finally";
    class M {
      constructor(w, R = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...R, _n: R.lines ? `
` : "" }, this._extScope = w, this._scope = new r.Scope({ parent: w }), this._nodes = [new _()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(w) {
        return this._scope.name(w);
      }
      // reserves unique name in the external scope
      scopeName(w) {
        return this._extScope.name(w);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(w, R) {
        const A = this._extScope.value(w, R);
        return (this._values[A.prefix] || (this._values[A.prefix] = /* @__PURE__ */ new Set())).add(A), A;
      }
      getScopeValue(w, R) {
        return this._extScope.getValue(w, R);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(w) {
        return this._extScope.scopeRefs(w, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(w, R, A, x) {
        const B = this._scope.toName(R);
        return A !== void 0 && x && (this._constants[B.str] = A), this._leafNode(new i(w, B, A)), B;
      }
      // `const` declaration (`var` in es5 mode)
      const(w, R, A) {
        return this._def(r.varKinds.const, w, R, A);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(w, R, A) {
        return this._def(r.varKinds.let, w, R, A);
      }
      // `var` declaration with optional assignment
      var(w, R, A) {
        return this._def(r.varKinds.var, w, R, A);
      }
      // assignment code
      assign(w, R, A) {
        return this._leafNode(new a(w, R, A));
      }
      // `+=` code
      add(w, R) {
        return this._leafNode(new c(w, e.operators.ADD, R));
      }
      // appends passed SafeExpr to code or executes Block
      code(w) {
        return typeof w == "function" ? w() : w !== t.nil && this._leafNode(new h(w)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...w) {
        const R = ["{"];
        for (const [A, x] of w)
          R.length > 1 && R.push(","), R.push(A), (A !== x || this.opts.es5) && (R.push(":"), (0, t.addCodeArg)(R, x));
        return R.push("}"), new t._Code(R);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(w, R, A) {
        if (this._blockNode(new y(w)), R && A)
          this.code(R).else().code(A).endIf();
        else if (R)
          this.code(R).endIf();
        else if (A)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(w) {
        return this._elseNode(new y(w));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new f());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(y, f);
      }
      _for(w, R) {
        return this._blockNode(w), R && this.code(R).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(w, R) {
        return this._for(new v(w), R);
      }
      // `for` statement for a range of values
      forRange(w, R, A, x, B = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
        const Q = this._scope.toName(w);
        return this._for(new S(B, Q, R, A), () => x(Q));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(w, R, A, x = r.varKinds.const) {
        const B = this._scope.toName(w);
        if (this.opts.es5) {
          const Q = R instanceof t.Name ? R : this.var("_arr", R);
          return this.forRange("_i", 0, (0, t._)`${Q}.length`, (Y) => {
            this.var(B, (0, t._)`${Q}[${Y}]`), A(B);
          });
        }
        return this._for(new g("of", x, B, R), () => A(B));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(w, R, A, x = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(w, (0, t._)`Object.keys(${R})`, A);
        const B = this._scope.toName(w);
        return this._for(new g("in", x, B, R), () => A(B));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(d);
      }
      // `label` statement
      label(w) {
        return this._leafNode(new l(w));
      }
      // `break` statement
      break(w) {
        return this._leafNode(new u(w));
      }
      // `return` statement
      return(w) {
        const R = new E();
        if (this._blockNode(R), this.code(w), R.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(E);
      }
      // `try` statement
      try(w, R, A) {
        if (!R && !A)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const x = new I();
        if (this._blockNode(x), this.code(w), R) {
          const B = this.name("e");
          this._currNode = x.catch = new k(B), R(B);
        }
        return A && (this._currNode = x.finally = new F(), this.code(A)), this._endBlockNode(k, F);
      }
      // `throw` statement
      throw(w) {
        return this._leafNode(new p(w));
      }
      // start self-balancing block
      block(w, R) {
        return this._blockStarts.push(this._nodes.length), w && this.code(w).endBlock(R), this;
      }
      // end the current self-balancing block
      endBlock(w) {
        const R = this._blockStarts.pop();
        if (R === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const A = this._nodes.length - R;
        if (A < 0 || w !== void 0 && A !== w)
          throw new Error(`CodeGen: wrong number of nodes: ${A} vs ${w} expected`);
        return this._nodes.length = R, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(w, R = t.nil, A, x) {
        return this._blockNode(new $(w, R, A)), x && this.code(x).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode($);
      }
      optimize(w = 1) {
        for (; w-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(w) {
        return this._currNode.nodes.push(w), this;
      }
      _blockNode(w) {
        this._currNode.nodes.push(w), this._nodes.push(w);
      }
      _endBlockNode(w, R) {
        const A = this._currNode;
        if (A instanceof w || R && A instanceof R)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${R ? `${w.kind}/${R.kind}` : w.kind}"`);
      }
      _elseNode(w) {
        const R = this._currNode;
        if (!(R instanceof y))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = R.else = w, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const w = this._nodes;
        return w[w.length - 1];
      }
      set _currNode(w) {
        const R = this._nodes;
        R[R.length - 1] = w;
      }
    }
    e.CodeGen = M;
    function V(T, w) {
      for (const R in w)
        T[R] = (T[R] || 0) + (w[R] || 0);
      return T;
    }
    function z(T, w) {
      return w instanceof t._CodeOrName ? V(T, w.names) : T;
    }
    function L(T, w, R) {
      if (T instanceof t.Name)
        return A(T);
      if (!x(T))
        return T;
      return new t._Code(T._items.reduce((B, Q) => (Q instanceof t.Name && (Q = A(Q)), Q instanceof t._Code ? B.push(...Q._items) : B.push(Q), B), []));
      function A(B) {
        const Q = R[B.str];
        return Q === void 0 || w[B.str] !== 1 ? B : (delete w[B.str], Q);
      }
      function x(B) {
        return B instanceof t._Code && B._items.some((Q) => Q instanceof t.Name && w[Q.str] === 1 && R[Q.str] !== void 0);
      }
    }
    function U(T, w) {
      for (const R in w)
        T[R] = (T[R] || 0) - (w[R] || 0);
    }
    function H(T) {
      return typeof T == "boolean" || typeof T == "number" || T === null ? !T : (0, t._)`!${j(T)}`;
    }
    e.not = H;
    const K = O(e.operators.AND);
    function W(...T) {
      return T.reduce(K);
    }
    e.and = W;
    const X = O(e.operators.OR);
    function C(...T) {
      return T.reduce(X);
    }
    e.or = C;
    function O(T) {
      return (w, R) => w === t.nil ? R : R === t.nil ? w : (0, t._)`${j(w)} ${T} ${j(R)}`;
    }
    function j(T) {
      return T instanceof t.Name ? T : (0, t._)`(${T})`;
    }
  })(jo)), jo;
}
var se = {}, Zl;
function ue() {
  if (Zl) return se;
  Zl = 1, Object.defineProperty(se, "__esModule", { value: !0 }), se.checkStrictMode = se.getErrorPath = se.Type = se.useFunc = se.setEvaluated = se.evaluatedPropsToName = se.mergeEvaluated = se.eachItem = se.unescapeJsonPointer = se.escapeJsonPointer = se.escapeFragment = se.unescapeFragment = se.schemaRefOrVal = se.schemaHasRulesButRef = se.schemaHasRules = se.checkUnknownRules = se.alwaysValidSchema = se.toHash = void 0;
  const e = oe(), t = Ss();
  function r(g) {
    const $ = {};
    for (const E of g)
      $[E] = !0;
    return $;
  }
  se.toHash = r;
  function n(g, $) {
    return typeof $ == "boolean" ? $ : Object.keys($).length === 0 ? !0 : (s(g, $), !o($, g.self.RULES.all));
  }
  se.alwaysValidSchema = n;
  function s(g, $ = g.schema) {
    const { opts: E, self: I } = g;
    if (!E.strictSchema || typeof $ == "boolean")
      return;
    const k = I.RULES.keywords;
    for (const F in $)
      k[F] || S(g, `unknown keyword: "${F}"`);
  }
  se.checkUnknownRules = s;
  function o(g, $) {
    if (typeof g == "boolean")
      return !g;
    for (const E in g)
      if ($[E])
        return !0;
    return !1;
  }
  se.schemaHasRules = o;
  function i(g, $) {
    if (typeof g == "boolean")
      return !g;
    for (const E in g)
      if (E !== "$ref" && $.all[E])
        return !0;
    return !1;
  }
  se.schemaHasRulesButRef = i;
  function a({ topSchemaRef: g, schemaPath: $ }, E, I, k) {
    if (!k) {
      if (typeof E == "number" || typeof E == "boolean")
        return E;
      if (typeof E == "string")
        return (0, e._)`${E}`;
    }
    return (0, e._)`${g}${$}${(0, e.getProperty)(I)}`;
  }
  se.schemaRefOrVal = a;
  function c(g) {
    return p(decodeURIComponent(g));
  }
  se.unescapeFragment = c;
  function l(g) {
    return encodeURIComponent(u(g));
  }
  se.escapeFragment = l;
  function u(g) {
    return typeof g == "number" ? `${g}` : g.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  se.escapeJsonPointer = u;
  function p(g) {
    return g.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  se.unescapeJsonPointer = p;
  function h(g, $) {
    if (Array.isArray(g))
      for (const E of g)
        $(E);
    else
      $(g);
  }
  se.eachItem = h;
  function m({ mergeNames: g, mergeToName: $, mergeValues: E, resultToName: I }) {
    return (k, F, M, V) => {
      const z = M === void 0 ? F : M instanceof e.Name ? (F instanceof e.Name ? g(k, F, M) : $(k, F, M), M) : F instanceof e.Name ? ($(k, M, F), F) : E(F, M);
      return V === e.Name && !(z instanceof e.Name) ? I(k, z) : z;
    };
  }
  se.mergeEvaluated = {
    props: m({
      mergeNames: (g, $, E) => g.if((0, e._)`${E} !== true && ${$} !== undefined`, () => {
        g.if((0, e._)`${$} === true`, () => g.assign(E, !0), () => g.assign(E, (0, e._)`${E} || {}`).code((0, e._)`Object.assign(${E}, ${$})`));
      }),
      mergeToName: (g, $, E) => g.if((0, e._)`${E} !== true`, () => {
        $ === !0 ? g.assign(E, !0) : (g.assign(E, (0, e._)`${E} || {}`), _(g, E, $));
      }),
      mergeValues: (g, $) => g === !0 ? !0 : { ...g, ...$ },
      resultToName: b
    }),
    items: m({
      mergeNames: (g, $, E) => g.if((0, e._)`${E} !== true && ${$} !== undefined`, () => g.assign(E, (0, e._)`${$} === true ? true : ${E} > ${$} ? ${E} : ${$}`)),
      mergeToName: (g, $, E) => g.if((0, e._)`${E} !== true`, () => g.assign(E, $ === !0 ? !0 : (0, e._)`${E} > ${$} ? ${E} : ${$}`)),
      mergeValues: (g, $) => g === !0 ? !0 : Math.max(g, $),
      resultToName: (g, $) => g.var("items", $)
    })
  };
  function b(g, $) {
    if ($ === !0)
      return g.var("props", !0);
    const E = g.var("props", (0, e._)`{}`);
    return $ !== void 0 && _(g, E, $), E;
  }
  se.evaluatedPropsToName = b;
  function _(g, $, E) {
    Object.keys(E).forEach((I) => g.assign((0, e._)`${$}${(0, e.getProperty)(I)}`, !0));
  }
  se.setEvaluated = _;
  const f = {};
  function y(g, $) {
    return g.scopeValue("func", {
      ref: $,
      code: f[$.code] || (f[$.code] = new t._Code($.code))
    });
  }
  se.useFunc = y;
  var d;
  (function(g) {
    g[g.Num = 0] = "Num", g[g.Str = 1] = "Str";
  })(d || (se.Type = d = {}));
  function v(g, $, E) {
    if (g instanceof e.Name) {
      const I = $ === d.Num;
      return E ? I ? (0, e._)`"[" + ${g} + "]"` : (0, e._)`"['" + ${g} + "']"` : I ? (0, e._)`"/" + ${g}` : (0, e._)`"/" + ${g}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return E ? (0, e.getProperty)(g).toString() : "/" + u(g);
  }
  se.getErrorPath = v;
  function S(g, $, E = g.opts.strictSchema) {
    if (E) {
      if ($ = `strict mode: ${$}`, E === !0)
        throw new Error($);
      g.self.logger.warn($);
    }
  }
  return se.checkStrictMode = S, se;
}
var bn = {}, ed;
function ht() {
  if (ed) return bn;
  ed = 1, Object.defineProperty(bn, "__esModule", { value: !0 });
  const e = oe(), t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return bn.default = t, bn;
}
var td;
function zs() {
  return td || (td = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const t = oe(), r = ue(), n = ht();
    e.keywordError = {
      message: ({ keyword: f }) => (0, t.str)`must pass "${f}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: f, schemaType: y }) => y ? (0, t.str)`"${f}" keyword must be ${y} ($data)` : (0, t.str)`"${f}" keyword is invalid ($data)`
    };
    function s(f, y = e.keywordError, d, v) {
      const { it: S } = f, { gen: g, compositeRule: $, allErrors: E } = S, I = p(f, y, d);
      v ?? ($ || E) ? c(g, I) : l(S, (0, t._)`[${I}]`);
    }
    e.reportError = s;
    function o(f, y = e.keywordError, d) {
      const { it: v } = f, { gen: S, compositeRule: g, allErrors: $ } = v, E = p(f, y, d);
      c(S, E), g || $ || l(v, n.default.vErrors);
    }
    e.reportExtraError = o;
    function i(f, y) {
      f.assign(n.default.errors, y), f.if((0, t._)`${n.default.vErrors} !== null`, () => f.if(y, () => f.assign((0, t._)`${n.default.vErrors}.length`, y), () => f.assign(n.default.vErrors, null)));
    }
    e.resetErrorsCount = i;
    function a({ gen: f, keyword: y, schemaValue: d, data: v, errsCount: S, it: g }) {
      if (S === void 0)
        throw new Error("ajv implementation error");
      const $ = f.name("err");
      f.forRange("i", S, n.default.errors, (E) => {
        f.const($, (0, t._)`${n.default.vErrors}[${E}]`), f.if((0, t._)`${$}.instancePath === undefined`, () => f.assign((0, t._)`${$}.instancePath`, (0, t.strConcat)(n.default.instancePath, g.errorPath))), f.assign((0, t._)`${$}.schemaPath`, (0, t.str)`${g.errSchemaPath}/${y}`), g.opts.verbose && (f.assign((0, t._)`${$}.schema`, d), f.assign((0, t._)`${$}.data`, v));
      });
    }
    e.extendErrors = a;
    function c(f, y) {
      const d = f.const("err", y);
      f.if((0, t._)`${n.default.vErrors} === null`, () => f.assign(n.default.vErrors, (0, t._)`[${d}]`), (0, t._)`${n.default.vErrors}.push(${d})`), f.code((0, t._)`${n.default.errors}++`);
    }
    function l(f, y) {
      const { gen: d, validateName: v, schemaEnv: S } = f;
      S.$async ? d.throw((0, t._)`new ${f.ValidationError}(${y})`) : (d.assign((0, t._)`${v}.errors`, y), d.return(!1));
    }
    const u = {
      keyword: new t.Name("keyword"),
      schemaPath: new t.Name("schemaPath"),
      // also used in JTD errors
      params: new t.Name("params"),
      propertyName: new t.Name("propertyName"),
      message: new t.Name("message"),
      schema: new t.Name("schema"),
      parentSchema: new t.Name("parentSchema")
    };
    function p(f, y, d) {
      const { createErrors: v } = f.it;
      return v === !1 ? (0, t._)`{}` : h(f, y, d);
    }
    function h(f, y, d = {}) {
      const { gen: v, it: S } = f, g = [
        m(S, d),
        b(f, d)
      ];
      return _(f, y, g), v.object(...g);
    }
    function m({ errorPath: f }, { instancePath: y }) {
      const d = y ? (0, t.str)`${f}${(0, r.getErrorPath)(y, r.Type.Str)}` : f;
      return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, d)];
    }
    function b({ keyword: f, it: { errSchemaPath: y } }, { schemaPath: d, parentSchema: v }) {
      let S = v ? y : (0, t.str)`${y}/${f}`;
      return d && (S = (0, t.str)`${S}${(0, r.getErrorPath)(d, r.Type.Str)}`), [u.schemaPath, S];
    }
    function _(f, { params: y, message: d }, v) {
      const { keyword: S, data: g, schemaValue: $, it: E } = f, { opts: I, propertyName: k, topSchemaRef: F, schemaPath: M } = E;
      v.push([u.keyword, S], [u.params, typeof y == "function" ? y(f) : y || (0, t._)`{}`]), I.messages && v.push([u.message, typeof d == "function" ? d(f) : d]), I.verbose && v.push([u.schema, $], [u.parentSchema, (0, t._)`${F}${M}`], [n.default.data, g]), k && v.push([u.propertyName, k]);
    }
  })(Ao)), Ao;
}
var rd;
function V1() {
  if (rd) return _t;
  rd = 1, Object.defineProperty(_t, "__esModule", { value: !0 }), _t.boolOrEmptySchema = _t.topBoolOrEmptySchema = void 0;
  const e = zs(), t = oe(), r = ht(), n = {
    message: "boolean schema is false"
  };
  function s(a) {
    const { gen: c, schema: l, validateName: u } = a;
    l === !1 ? i(a, !1) : typeof l == "object" && l.$async === !0 ? c.return(r.default.data) : (c.assign((0, t._)`${u}.errors`, null), c.return(!0));
  }
  _t.topBoolOrEmptySchema = s;
  function o(a, c) {
    const { gen: l, schema: u } = a;
    u === !1 ? (l.var(c, !1), i(a)) : l.var(c, !0);
  }
  _t.boolOrEmptySchema = o;
  function i(a, c) {
    const { gen: l, data: u } = a, p = {
      gen: l,
      keyword: "false schema",
      data: u,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: a
    };
    (0, e.reportError)(p, n, void 0, c);
  }
  return _t;
}
var we = {}, bt = {}, nd;
function my() {
  if (nd) return bt;
  nd = 1, Object.defineProperty(bt, "__esModule", { value: !0 }), bt.getRules = bt.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], t = new Set(e);
  function r(s) {
    return typeof s == "string" && t.has(s);
  }
  bt.isJSONType = r;
  function n() {
    const s = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...s, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, s.number, s.string, s.array, s.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return bt.getRules = n, bt;
}
var Ze = {}, sd;
function yy() {
  if (sd) return Ze;
  sd = 1, Object.defineProperty(Ze, "__esModule", { value: !0 }), Ze.shouldUseRule = Ze.shouldUseGroup = Ze.schemaHasRulesForType = void 0;
  function e({ schema: n, self: s }, o) {
    const i = s.RULES.types[o];
    return i && i !== !0 && t(n, i);
  }
  Ze.schemaHasRulesForType = e;
  function t(n, s) {
    return s.rules.some((o) => r(n, o));
  }
  Ze.shouldUseGroup = t;
  function r(n, s) {
    var o;
    return n[s.keyword] !== void 0 || ((o = s.definition.implements) === null || o === void 0 ? void 0 : o.some((i) => n[i] !== void 0));
  }
  return Ze.shouldUseRule = r, Ze;
}
var od;
function Es() {
  if (od) return we;
  od = 1, Object.defineProperty(we, "__esModule", { value: !0 }), we.reportTypeError = we.checkDataTypes = we.checkDataType = we.coerceAndCheckDataType = we.getJSONTypes = we.getSchemaTypes = we.DataType = void 0;
  const e = my(), t = yy(), r = zs(), n = oe(), s = ue();
  var o;
  (function(d) {
    d[d.Correct = 0] = "Correct", d[d.Wrong = 1] = "Wrong";
  })(o || (we.DataType = o = {}));
  function i(d) {
    const v = a(d.type);
    if (v.includes("null")) {
      if (d.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!v.length && d.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      d.nullable === !0 && v.push("null");
    }
    return v;
  }
  we.getSchemaTypes = i;
  function a(d) {
    const v = Array.isArray(d) ? d : d ? [d] : [];
    if (v.every(e.isJSONType))
      return v;
    throw new Error("type must be JSONType or JSONType[]: " + v.join(","));
  }
  we.getJSONTypes = a;
  function c(d, v) {
    const { gen: S, data: g, opts: $ } = d, E = u(v, $.coerceTypes), I = v.length > 0 && !(E.length === 0 && v.length === 1 && (0, t.schemaHasRulesForType)(d, v[0]));
    if (I) {
      const k = b(v, g, $.strictNumbers, o.Wrong);
      S.if(k, () => {
        E.length ? p(d, v, E) : f(d);
      });
    }
    return I;
  }
  we.coerceAndCheckDataType = c;
  const l = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function u(d, v) {
    return v ? d.filter((S) => l.has(S) || v === "array" && S === "array") : [];
  }
  function p(d, v, S) {
    const { gen: g, data: $, opts: E } = d, I = g.let("dataType", (0, n._)`typeof ${$}`), k = g.let("coerced", (0, n._)`undefined`);
    E.coerceTypes === "array" && g.if((0, n._)`${I} == 'object' && Array.isArray(${$}) && ${$}.length == 1`, () => g.assign($, (0, n._)`${$}[0]`).assign(I, (0, n._)`typeof ${$}`).if(b(v, $, E.strictNumbers), () => g.assign(k, $))), g.if((0, n._)`${k} !== undefined`);
    for (const M of S)
      (l.has(M) || M === "array" && E.coerceTypes === "array") && F(M);
    g.else(), f(d), g.endIf(), g.if((0, n._)`${k} !== undefined`, () => {
      g.assign($, k), h(d, k);
    });
    function F(M) {
      switch (M) {
        case "string":
          g.elseIf((0, n._)`${I} == "number" || ${I} == "boolean"`).assign(k, (0, n._)`"" + ${$}`).elseIf((0, n._)`${$} === null`).assign(k, (0, n._)`""`);
          return;
        case "number":
          g.elseIf((0, n._)`${I} == "boolean" || ${$} === null
              || (${I} == "string" && ${$} && ${$} == +${$})`).assign(k, (0, n._)`+${$}`);
          return;
        case "integer":
          g.elseIf((0, n._)`${I} === "boolean" || ${$} === null
              || (${I} === "string" && ${$} && ${$} == +${$} && !(${$} % 1))`).assign(k, (0, n._)`+${$}`);
          return;
        case "boolean":
          g.elseIf((0, n._)`${$} === "false" || ${$} === 0 || ${$} === null`).assign(k, !1).elseIf((0, n._)`${$} === "true" || ${$} === 1`).assign(k, !0);
          return;
        case "null":
          g.elseIf((0, n._)`${$} === "" || ${$} === 0 || ${$} === false`), g.assign(k, null);
          return;
        case "array":
          g.elseIf((0, n._)`${I} === "string" || ${I} === "number"
              || ${I} === "boolean" || ${$} === null`).assign(k, (0, n._)`[${$}]`);
      }
    }
  }
  function h({ gen: d, parentData: v, parentDataProperty: S }, g) {
    d.if((0, n._)`${v} !== undefined`, () => d.assign((0, n._)`${v}[${S}]`, g));
  }
  function m(d, v, S, g = o.Correct) {
    const $ = g === o.Correct ? n.operators.EQ : n.operators.NEQ;
    let E;
    switch (d) {
      case "null":
        return (0, n._)`${v} ${$} null`;
      case "array":
        E = (0, n._)`Array.isArray(${v})`;
        break;
      case "object":
        E = (0, n._)`${v} && typeof ${v} == "object" && !Array.isArray(${v})`;
        break;
      case "integer":
        E = I((0, n._)`!(${v} % 1) && !isNaN(${v})`);
        break;
      case "number":
        E = I();
        break;
      default:
        return (0, n._)`typeof ${v} ${$} ${d}`;
    }
    return g === o.Correct ? E : (0, n.not)(E);
    function I(k = n.nil) {
      return (0, n.and)((0, n._)`typeof ${v} == "number"`, k, S ? (0, n._)`isFinite(${v})` : n.nil);
    }
  }
  we.checkDataType = m;
  function b(d, v, S, g) {
    if (d.length === 1)
      return m(d[0], v, S, g);
    let $;
    const E = (0, s.toHash)(d);
    if (E.array && E.object) {
      const I = (0, n._)`typeof ${v} != "object"`;
      $ = E.null ? I : (0, n._)`!${v} || ${I}`, delete E.null, delete E.array, delete E.object;
    } else
      $ = n.nil;
    E.number && delete E.integer;
    for (const I in E)
      $ = (0, n.and)($, m(I, v, S, g));
    return $;
  }
  we.checkDataTypes = b;
  const _ = {
    message: ({ schema: d }) => `must be ${d}`,
    params: ({ schema: d, schemaValue: v }) => typeof d == "string" ? (0, n._)`{type: ${d}}` : (0, n._)`{type: ${v}}`
  };
  function f(d) {
    const v = y(d);
    (0, r.reportError)(v, _);
  }
  we.reportTypeError = f;
  function y(d) {
    const { gen: v, data: S, schema: g } = d, $ = (0, s.schemaRefOrVal)(d, g, "type");
    return {
      gen: v,
      keyword: "type",
      data: S,
      schema: g.type,
      schemaCode: $,
      schemaValue: $,
      parentSchema: g,
      params: {},
      it: d
    };
  }
  return we;
}
var nr = {}, id;
function z1() {
  if (id) return nr;
  id = 1, Object.defineProperty(nr, "__esModule", { value: !0 }), nr.assignDefaults = void 0;
  const e = oe(), t = ue();
  function r(s, o) {
    const { properties: i, items: a } = s.schema;
    if (o === "object" && i)
      for (const c in i)
        n(s, c, i[c].default);
    else o === "array" && Array.isArray(a) && a.forEach((c, l) => n(s, l, c.default));
  }
  nr.assignDefaults = r;
  function n(s, o, i) {
    const { gen: a, compositeRule: c, data: l, opts: u } = s;
    if (i === void 0)
      return;
    const p = (0, e._)`${l}${(0, e.getProperty)(o)}`;
    if (c) {
      (0, t.checkStrictMode)(s, `default is ignored for: ${p}`);
      return;
    }
    let h = (0, e._)`${p} === undefined`;
    u.useDefaults === "empty" && (h = (0, e._)`${h} || ${p} === null || ${p} === ""`), a.if(h, (0, e._)`${p} = ${(0, e.stringify)(i)}`);
  }
  return nr;
}
var ke = {}, he = {}, ad;
function Ue() {
  if (ad) return he;
  ad = 1, Object.defineProperty(he, "__esModule", { value: !0 }), he.validateUnion = he.validateArray = he.usePattern = he.callValidateCode = he.schemaProperties = he.allSchemaProperties = he.noPropertyInData = he.propertyInData = he.isOwnProperty = he.hasPropFunc = he.reportMissingProp = he.checkMissingProp = he.checkReportMissingProp = void 0;
  const e = oe(), t = ue(), r = ht(), n = ue();
  function s(d, v) {
    const { gen: S, data: g, it: $ } = d;
    S.if(u(S, g, v, $.opts.ownProperties), () => {
      d.setParams({ missingProperty: (0, e._)`${v}` }, !0), d.error();
    });
  }
  he.checkReportMissingProp = s;
  function o({ gen: d, data: v, it: { opts: S } }, g, $) {
    return (0, e.or)(...g.map((E) => (0, e.and)(u(d, v, E, S.ownProperties), (0, e._)`${$} = ${E}`)));
  }
  he.checkMissingProp = o;
  function i(d, v) {
    d.setParams({ missingProperty: v }, !0), d.error();
  }
  he.reportMissingProp = i;
  function a(d) {
    return d.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  he.hasPropFunc = a;
  function c(d, v, S) {
    return (0, e._)`${a(d)}.call(${v}, ${S})`;
  }
  he.isOwnProperty = c;
  function l(d, v, S, g) {
    const $ = (0, e._)`${v}${(0, e.getProperty)(S)} !== undefined`;
    return g ? (0, e._)`${$} && ${c(d, v, S)}` : $;
  }
  he.propertyInData = l;
  function u(d, v, S, g) {
    const $ = (0, e._)`${v}${(0, e.getProperty)(S)} === undefined`;
    return g ? (0, e.or)($, (0, e.not)(c(d, v, S))) : $;
  }
  he.noPropertyInData = u;
  function p(d) {
    return d ? Object.keys(d).filter((v) => v !== "__proto__") : [];
  }
  he.allSchemaProperties = p;
  function h(d, v) {
    return p(v).filter((S) => !(0, t.alwaysValidSchema)(d, v[S]));
  }
  he.schemaProperties = h;
  function m({ schemaCode: d, data: v, it: { gen: S, topSchemaRef: g, schemaPath: $, errorPath: E }, it: I }, k, F, M) {
    const V = M ? (0, e._)`${d}, ${v}, ${g}${$}` : v, z = [
      [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, E)],
      [r.default.parentData, I.parentData],
      [r.default.parentDataProperty, I.parentDataProperty],
      [r.default.rootData, r.default.rootData]
    ];
    I.opts.dynamicRef && z.push([r.default.dynamicAnchors, r.default.dynamicAnchors]);
    const L = (0, e._)`${V}, ${S.object(...z)}`;
    return F !== e.nil ? (0, e._)`${k}.call(${F}, ${L})` : (0, e._)`${k}(${L})`;
  }
  he.callValidateCode = m;
  const b = (0, e._)`new RegExp`;
  function _({ gen: d, it: { opts: v } }, S) {
    const g = v.unicodeRegExp ? "u" : "", { regExp: $ } = v.code, E = $(S, g);
    return d.scopeValue("pattern", {
      key: E.toString(),
      ref: E,
      code: (0, e._)`${$.code === "new RegExp" ? b : (0, n.useFunc)(d, $)}(${S}, ${g})`
    });
  }
  he.usePattern = _;
  function f(d) {
    const { gen: v, data: S, keyword: g, it: $ } = d, E = v.name("valid");
    if ($.allErrors) {
      const k = v.let("valid", !0);
      return I(() => v.assign(k, !1)), k;
    }
    return v.var(E, !0), I(() => v.break()), E;
    function I(k) {
      const F = v.const("len", (0, e._)`${S}.length`);
      v.forRange("i", 0, F, (M) => {
        d.subschema({
          keyword: g,
          dataProp: M,
          dataPropType: t.Type.Num
        }, E), v.if((0, e.not)(E), k);
      });
    }
  }
  he.validateArray = f;
  function y(d) {
    const { gen: v, schema: S, keyword: g, it: $ } = d;
    if (!Array.isArray(S))
      throw new Error("ajv implementation error");
    if (S.some((F) => (0, t.alwaysValidSchema)($, F)) && !$.opts.unevaluated)
      return;
    const I = v.let("valid", !1), k = v.name("_valid");
    v.block(() => S.forEach((F, M) => {
      const V = d.subschema({
        keyword: g,
        schemaProp: M,
        compositeRule: !0
      }, k);
      v.assign(I, (0, e._)`${I} || ${k}`), d.mergeValidEvaluated(V, k) || v.if((0, e.not)(I));
    })), d.result(I, () => d.reset(), () => d.error(!0));
  }
  return he.validateUnion = y, he;
}
var cd;
function x1() {
  if (cd) return ke;
  cd = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.validateKeywordUsage = ke.validSchemaType = ke.funcKeywordCode = ke.macroKeywordCode = void 0;
  const e = oe(), t = ht(), r = Ue(), n = zs();
  function s(h, m) {
    const { gen: b, keyword: _, schema: f, parentSchema: y, it: d } = h, v = m.macro.call(d.self, f, y, d), S = l(b, _, v);
    d.opts.validateSchema !== !1 && d.self.validateSchema(v, !0);
    const g = b.name("valid");
    h.subschema({
      schema: v,
      schemaPath: e.nil,
      errSchemaPath: `${d.errSchemaPath}/${_}`,
      topSchemaRef: S,
      compositeRule: !0
    }, g), h.pass(g, () => h.error(!0));
  }
  ke.macroKeywordCode = s;
  function o(h, m) {
    var b;
    const { gen: _, keyword: f, schema: y, parentSchema: d, $data: v, it: S } = h;
    c(S, m);
    const g = !v && m.compile ? m.compile.call(S.self, y, d, S) : m.validate, $ = l(_, f, g), E = _.let("valid");
    h.block$data(E, I), h.ok((b = m.valid) !== null && b !== void 0 ? b : E);
    function I() {
      if (m.errors === !1)
        M(), m.modifying && i(h), V(() => h.error());
      else {
        const z = m.async ? k() : F();
        m.modifying && i(h), V(() => a(h, z));
      }
    }
    function k() {
      const z = _.let("ruleErrs", null);
      return _.try(() => M((0, e._)`await `), (L) => _.assign(E, !1).if((0, e._)`${L} instanceof ${S.ValidationError}`, () => _.assign(z, (0, e._)`${L}.errors`), () => _.throw(L))), z;
    }
    function F() {
      const z = (0, e._)`${$}.errors`;
      return _.assign(z, null), M(e.nil), z;
    }
    function M(z = m.async ? (0, e._)`await ` : e.nil) {
      const L = S.opts.passContext ? t.default.this : t.default.self, U = !("compile" in m && !v || m.schema === !1);
      _.assign(E, (0, e._)`${z}${(0, r.callValidateCode)(h, $, L, U)}`, m.modifying);
    }
    function V(z) {
      var L;
      _.if((0, e.not)((L = m.valid) !== null && L !== void 0 ? L : E), z);
    }
  }
  ke.funcKeywordCode = o;
  function i(h) {
    const { gen: m, data: b, it: _ } = h;
    m.if(_.parentData, () => m.assign(b, (0, e._)`${_.parentData}[${_.parentDataProperty}]`));
  }
  function a(h, m) {
    const { gen: b } = h;
    b.if((0, e._)`Array.isArray(${m})`, () => {
      b.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${m} : ${t.default.vErrors}.concat(${m})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, n.extendErrors)(h);
    }, () => h.error());
  }
  function c({ schemaEnv: h }, m) {
    if (m.async && !h.$async)
      throw new Error("async keyword in sync schema");
  }
  function l(h, m, b) {
    if (b === void 0)
      throw new Error(`keyword "${m}" failed to compile`);
    return h.scopeValue("keyword", typeof b == "function" ? { ref: b } : { ref: b, code: (0, e.stringify)(b) });
  }
  function u(h, m, b = !1) {
    return !m.length || m.some((_) => _ === "array" ? Array.isArray(h) : _ === "object" ? h && typeof h == "object" && !Array.isArray(h) : typeof h == _ || b && typeof h > "u");
  }
  ke.validSchemaType = u;
  function p({ schema: h, opts: m, self: b, errSchemaPath: _ }, f, y) {
    if (Array.isArray(f.keyword) ? !f.keyword.includes(y) : f.keyword !== y)
      throw new Error("ajv implementation error");
    const d = f.dependencies;
    if (d?.some((v) => !Object.prototype.hasOwnProperty.call(h, v)))
      throw new Error(`parent schema must have dependencies of ${y}: ${d.join(",")}`);
    if (f.validateSchema && !f.validateSchema(h[y])) {
      const S = `keyword "${y}" value is invalid at path "${_}": ` + b.errorsText(f.validateSchema.errors);
      if (m.validateSchema === "log")
        b.logger.error(S);
      else
        throw new Error(S);
    }
  }
  return ke.validateKeywordUsage = p, ke;
}
var et = {}, ud;
function G1() {
  if (ud) return et;
  ud = 1, Object.defineProperty(et, "__esModule", { value: !0 }), et.extendSubschemaMode = et.extendSubschemaData = et.getSubschema = void 0;
  const e = oe(), t = ue();
  function r(o, { keyword: i, schemaProp: a, schema: c, schemaPath: l, errSchemaPath: u, topSchemaRef: p }) {
    if (i !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (i !== void 0) {
      const h = o.schema[i];
      return a === void 0 ? {
        schema: h,
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(i)}`,
        errSchemaPath: `${o.errSchemaPath}/${i}`
      } : {
        schema: h[a],
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(i)}${(0, e.getProperty)(a)}`,
        errSchemaPath: `${o.errSchemaPath}/${i}/${(0, t.escapeFragment)(a)}`
      };
    }
    if (c !== void 0) {
      if (l === void 0 || u === void 0 || p === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: l,
        topSchemaRef: p,
        errSchemaPath: u
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  et.getSubschema = r;
  function n(o, i, { dataProp: a, dataPropType: c, data: l, dataTypes: u, propertyName: p }) {
    if (l !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: h } = i;
    if (a !== void 0) {
      const { errorPath: b, dataPathArr: _, opts: f } = i, y = h.let("data", (0, e._)`${i.data}${(0, e.getProperty)(a)}`, !0);
      m(y), o.errorPath = (0, e.str)`${b}${(0, t.getErrorPath)(a, c, f.jsPropertySyntax)}`, o.parentDataProperty = (0, e._)`${a}`, o.dataPathArr = [..._, o.parentDataProperty];
    }
    if (l !== void 0) {
      const b = l instanceof e.Name ? l : h.let("data", l, !0);
      m(b), p !== void 0 && (o.propertyName = p);
    }
    u && (o.dataTypes = u);
    function m(b) {
      o.data = b, o.dataLevel = i.dataLevel + 1, o.dataTypes = [], i.definedProperties = /* @__PURE__ */ new Set(), o.parentData = i.data, o.dataNames = [...i.dataNames, b];
    }
  }
  et.extendSubschemaData = n;
  function s(o, { jtdDiscriminator: i, jtdMetadata: a, compositeRule: c, createErrors: l, allErrors: u }) {
    c !== void 0 && (o.compositeRule = c), l !== void 0 && (o.createErrors = l), u !== void 0 && (o.allErrors = u), o.jtdDiscriminator = i, o.jtdMetadata = a;
  }
  return et.extendSubschemaMode = s, et;
}
var Re = {}, ko = { exports: {} }, ld;
function B1() {
  if (ld) return ko.exports;
  ld = 1;
  var e = ko.exports = function(n, s, o) {
    typeof s == "function" && (o = s, s = {}), o = s.cb || o;
    var i = typeof o == "function" ? o : o.pre || function() {
    }, a = o.post || function() {
    };
    t(s, i, a, n, "", n);
  };
  e.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, e.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, e.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, e.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function t(n, s, o, i, a, c, l, u, p, h) {
    if (i && typeof i == "object" && !Array.isArray(i)) {
      s(i, a, c, l, u, p, h);
      for (var m in i) {
        var b = i[m];
        if (Array.isArray(b)) {
          if (m in e.arrayKeywords)
            for (var _ = 0; _ < b.length; _++)
              t(n, s, o, b[_], a + "/" + m + "/" + _, c, a, m, i, _);
        } else if (m in e.propsKeywords) {
          if (b && typeof b == "object")
            for (var f in b)
              t(n, s, o, b[f], a + "/" + m + "/" + r(f), c, a, m, i, f);
        } else (m in e.keywords || n.allKeys && !(m in e.skipKeywords)) && t(n, s, o, b, a + "/" + m, c, a, m, i);
      }
      o(i, a, c, l, u, p, h);
    }
  }
  function r(n) {
    return n.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return ko.exports;
}
var dd;
function xs() {
  if (dd) return Re;
  dd = 1, Object.defineProperty(Re, "__esModule", { value: !0 }), Re.getSchemaRefs = Re.resolveUrl = Re.normalizeId = Re._getFullPath = Re.getFullPath = Re.inlineRef = void 0;
  const e = ue(), t = Ls(), r = B1(), n = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function s(_, f = !0) {
    return typeof _ == "boolean" ? !0 : f === !0 ? !i(_) : f ? a(_) <= f : !1;
  }
  Re.inlineRef = s;
  const o = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function i(_) {
    for (const f in _) {
      if (o.has(f))
        return !0;
      const y = _[f];
      if (Array.isArray(y) && y.some(i) || typeof y == "object" && i(y))
        return !0;
    }
    return !1;
  }
  function a(_) {
    let f = 0;
    for (const y in _) {
      if (y === "$ref")
        return 1 / 0;
      if (f++, !n.has(y) && (typeof _[y] == "object" && (0, e.eachItem)(_[y], (d) => f += a(d)), f === 1 / 0))
        return 1 / 0;
    }
    return f;
  }
  function c(_, f = "", y) {
    y !== !1 && (f = p(f));
    const d = _.parse(f);
    return l(_, d);
  }
  Re.getFullPath = c;
  function l(_, f) {
    return _.serialize(f).split("#")[0] + "#";
  }
  Re._getFullPath = l;
  const u = /#\/?$/;
  function p(_) {
    return _ ? _.replace(u, "") : "";
  }
  Re.normalizeId = p;
  function h(_, f, y) {
    return y = p(y), _.resolve(f, y);
  }
  Re.resolveUrl = h;
  const m = /^[a-z_][-a-z0-9._]*$/i;
  function b(_, f) {
    if (typeof _ == "boolean")
      return {};
    const { schemaId: y, uriResolver: d } = this.opts, v = p(_[y] || f), S = { "": v }, g = c(d, v, !1), $ = {}, E = /* @__PURE__ */ new Set();
    return r(_, { allKeys: !0 }, (F, M, V, z) => {
      if (z === void 0)
        return;
      const L = g + M;
      let U = S[z];
      typeof F[y] == "string" && (U = H.call(this, F[y])), K.call(this, F.$anchor), K.call(this, F.$dynamicAnchor), S[M] = U;
      function H(W) {
        const X = this.opts.uriResolver.resolve;
        if (W = p(U ? X(U, W) : W), E.has(W))
          throw k(W);
        E.add(W);
        let C = this.refs[W];
        return typeof C == "string" && (C = this.refs[C]), typeof C == "object" ? I(F, C.schema, W) : W !== p(L) && (W[0] === "#" ? (I(F, $[W], W), $[W] = F) : this.refs[W] = L), W;
      }
      function K(W) {
        if (typeof W == "string") {
          if (!m.test(W))
            throw new Error(`invalid anchor "${W}"`);
          H.call(this, `#${W}`);
        }
      }
    }), $;
    function I(F, M, V) {
      if (M !== void 0 && !t(F, M))
        throw k(V);
    }
    function k(F) {
      return new Error(`reference "${F}" resolves to more than one schema`);
    }
  }
  return Re.getSchemaRefs = b, Re;
}
var fd;
function Gs() {
  if (fd) return Qe;
  fd = 1, Object.defineProperty(Qe, "__esModule", { value: !0 }), Qe.getData = Qe.KeywordCxt = Qe.validateFunctionCode = void 0;
  const e = V1(), t = Es(), r = yy(), n = Es(), s = z1(), o = x1(), i = G1(), a = oe(), c = ht(), l = xs(), u = ue(), p = zs();
  function h(P) {
    if (g(P) && (E(P), S(P))) {
      f(P);
      return;
    }
    m(P, () => (0, e.topBoolOrEmptySchema)(P));
  }
  Qe.validateFunctionCode = h;
  function m({ gen: P, validateName: N, schema: D, schemaEnv: q, opts: G }, J) {
    G.code.es5 ? P.func(N, (0, a._)`${c.default.data}, ${c.default.valCxt}`, q.$async, () => {
      P.code((0, a._)`"use strict"; ${d(D, G)}`), _(P, G), P.code(J);
    }) : P.func(N, (0, a._)`${c.default.data}, ${b(G)}`, q.$async, () => P.code(d(D, G)).code(J));
  }
  function b(P) {
    return (0, a._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${P.dynamicRef ? (0, a._)`, ${c.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function _(P, N) {
    P.if(c.default.valCxt, () => {
      P.var(c.default.instancePath, (0, a._)`${c.default.valCxt}.${c.default.instancePath}`), P.var(c.default.parentData, (0, a._)`${c.default.valCxt}.${c.default.parentData}`), P.var(c.default.parentDataProperty, (0, a._)`${c.default.valCxt}.${c.default.parentDataProperty}`), P.var(c.default.rootData, (0, a._)`${c.default.valCxt}.${c.default.rootData}`), N.dynamicRef && P.var(c.default.dynamicAnchors, (0, a._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      P.var(c.default.instancePath, (0, a._)`""`), P.var(c.default.parentData, (0, a._)`undefined`), P.var(c.default.parentDataProperty, (0, a._)`undefined`), P.var(c.default.rootData, c.default.data), N.dynamicRef && P.var(c.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function f(P) {
    const { schema: N, opts: D, gen: q } = P;
    m(P, () => {
      D.$comment && N.$comment && z(P), F(P), q.let(c.default.vErrors, null), q.let(c.default.errors, 0), D.unevaluated && y(P), I(P), L(P);
    });
  }
  function y(P) {
    const { gen: N, validateName: D } = P;
    P.evaluated = N.const("evaluated", (0, a._)`${D}.evaluated`), N.if((0, a._)`${P.evaluated}.dynamicProps`, () => N.assign((0, a._)`${P.evaluated}.props`, (0, a._)`undefined`)), N.if((0, a._)`${P.evaluated}.dynamicItems`, () => N.assign((0, a._)`${P.evaluated}.items`, (0, a._)`undefined`));
  }
  function d(P, N) {
    const D = typeof P == "object" && P[N.schemaId];
    return D && (N.code.source || N.code.process) ? (0, a._)`/*# sourceURL=${D} */` : a.nil;
  }
  function v(P, N) {
    if (g(P) && (E(P), S(P))) {
      $(P, N);
      return;
    }
    (0, e.boolOrEmptySchema)(P, N);
  }
  function S({ schema: P, self: N }) {
    if (typeof P == "boolean")
      return !P;
    for (const D in P)
      if (N.RULES.all[D])
        return !0;
    return !1;
  }
  function g(P) {
    return typeof P.schema != "boolean";
  }
  function $(P, N) {
    const { schema: D, gen: q, opts: G } = P;
    G.$comment && D.$comment && z(P), M(P), V(P);
    const J = q.const("_errs", c.default.errors);
    I(P, J), q.var(N, (0, a._)`${J} === ${c.default.errors}`);
  }
  function E(P) {
    (0, u.checkUnknownRules)(P), k(P);
  }
  function I(P, N) {
    if (P.opts.jtd)
      return H(P, [], !1, N);
    const D = (0, t.getSchemaTypes)(P.schema), q = (0, t.coerceAndCheckDataType)(P, D);
    H(P, D, !q, N);
  }
  function k(P) {
    const { schema: N, errSchemaPath: D, opts: q, self: G } = P;
    N.$ref && q.ignoreKeywordsWithRef && (0, u.schemaHasRulesButRef)(N, G.RULES) && G.logger.warn(`$ref: keywords ignored in schema at path "${D}"`);
  }
  function F(P) {
    const { schema: N, opts: D } = P;
    N.default !== void 0 && D.useDefaults && D.strictSchema && (0, u.checkStrictMode)(P, "default is ignored in the schema root");
  }
  function M(P) {
    const N = P.schema[P.opts.schemaId];
    N && (P.baseId = (0, l.resolveUrl)(P.opts.uriResolver, P.baseId, N));
  }
  function V(P) {
    if (P.schema.$async && !P.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function z({ gen: P, schemaEnv: N, schema: D, errSchemaPath: q, opts: G }) {
    const J = D.$comment;
    if (G.$comment === !0)
      P.code((0, a._)`${c.default.self}.logger.log(${J})`);
    else if (typeof G.$comment == "function") {
      const ae = (0, a.str)`${q}/$comment`, me = P.scopeValue("root", { ref: N.root });
      P.code((0, a._)`${c.default.self}.opts.$comment(${J}, ${ae}, ${me}.schema)`);
    }
  }
  function L(P) {
    const { gen: N, schemaEnv: D, validateName: q, ValidationError: G, opts: J } = P;
    D.$async ? N.if((0, a._)`${c.default.errors} === 0`, () => N.return(c.default.data), () => N.throw((0, a._)`new ${G}(${c.default.vErrors})`)) : (N.assign((0, a._)`${q}.errors`, c.default.vErrors), J.unevaluated && U(P), N.return((0, a._)`${c.default.errors} === 0`));
  }
  function U({ gen: P, evaluated: N, props: D, items: q }) {
    D instanceof a.Name && P.assign((0, a._)`${N}.props`, D), q instanceof a.Name && P.assign((0, a._)`${N}.items`, q);
  }
  function H(P, N, D, q) {
    const { gen: G, schema: J, data: ae, allErrors: me, opts: le, self: de } = P, { RULES: ce } = de;
    if (J.$ref && (le.ignoreKeywordsWithRef || !(0, u.schemaHasRulesButRef)(J, ce))) {
      G.block(() => x(P, "$ref", ce.all.$ref.definition));
      return;
    }
    le.jtd || W(P, N), G.block(() => {
      for (const pe of ce.rules)
        Te(pe);
      Te(ce.post);
    });
    function Te(pe) {
      (0, r.shouldUseGroup)(J, pe) && (pe.type ? (G.if((0, n.checkDataType)(pe.type, ae, le.strictNumbers)), K(P, pe), N.length === 1 && N[0] === pe.type && D && (G.else(), (0, n.reportTypeError)(P)), G.endIf()) : K(P, pe), me || G.if((0, a._)`${c.default.errors} === ${q || 0}`));
    }
  }
  function K(P, N) {
    const { gen: D, schema: q, opts: { useDefaults: G } } = P;
    G && (0, s.assignDefaults)(P, N.type), D.block(() => {
      for (const J of N.rules)
        (0, r.shouldUseRule)(q, J) && x(P, J.keyword, J.definition, N.type);
    });
  }
  function W(P, N) {
    P.schemaEnv.meta || !P.opts.strictTypes || (X(P, N), P.opts.allowUnionTypes || C(P, N), O(P, P.dataTypes));
  }
  function X(P, N) {
    if (N.length) {
      if (!P.dataTypes.length) {
        P.dataTypes = N;
        return;
      }
      N.forEach((D) => {
        T(P.dataTypes, D) || R(P, `type "${D}" not allowed by context "${P.dataTypes.join(",")}"`);
      }), w(P, N);
    }
  }
  function C(P, N) {
    N.length > 1 && !(N.length === 2 && N.includes("null")) && R(P, "use allowUnionTypes to allow union type keyword");
  }
  function O(P, N) {
    const D = P.self.RULES.all;
    for (const q in D) {
      const G = D[q];
      if (typeof G == "object" && (0, r.shouldUseRule)(P.schema, G)) {
        const { type: J } = G.definition;
        J.length && !J.some((ae) => j(N, ae)) && R(P, `missing type "${J.join(",")}" for keyword "${q}"`);
      }
    }
  }
  function j(P, N) {
    return P.includes(N) || N === "number" && P.includes("integer");
  }
  function T(P, N) {
    return P.includes(N) || N === "integer" && P.includes("number");
  }
  function w(P, N) {
    const D = [];
    for (const q of P.dataTypes)
      T(N, q) ? D.push(q) : N.includes("integer") && q === "number" && D.push("integer");
    P.dataTypes = D;
  }
  function R(P, N) {
    const D = P.schemaEnv.baseId + P.errSchemaPath;
    N += ` at "${D}" (strictTypes)`, (0, u.checkStrictMode)(P, N, P.opts.strictTypes);
  }
  class A {
    constructor(N, D, q) {
      if ((0, o.validateKeywordUsage)(N, D, q), this.gen = N.gen, this.allErrors = N.allErrors, this.keyword = q, this.data = N.data, this.schema = N.schema[q], this.$data = D.$data && N.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, u.schemaRefOrVal)(N, this.schema, q, this.$data), this.schemaType = D.schemaType, this.parentSchema = N.schema, this.params = {}, this.it = N, this.def = D, this.$data)
        this.schemaCode = N.gen.const("vSchema", Y(this.$data, N));
      else if (this.schemaCode = this.schemaValue, !(0, o.validSchemaType)(this.schema, D.schemaType, D.allowUndefined))
        throw new Error(`${q} value must be ${JSON.stringify(D.schemaType)}`);
      ("code" in D ? D.trackErrors : D.errors !== !1) && (this.errsCount = N.gen.const("_errs", c.default.errors));
    }
    result(N, D, q) {
      this.failResult((0, a.not)(N), D, q);
    }
    failResult(N, D, q) {
      this.gen.if(N), q ? q() : this.error(), D ? (this.gen.else(), D(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(N, D) {
      this.failResult((0, a.not)(N), void 0, D);
    }
    fail(N) {
      if (N === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(N), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(N) {
      if (!this.$data)
        return this.fail(N);
      const { schemaCode: D } = this;
      this.fail((0, a._)`${D} !== undefined && (${(0, a.or)(this.invalid$data(), N)})`);
    }
    error(N, D, q) {
      if (D) {
        this.setParams(D), this._error(N, q), this.setParams({});
        return;
      }
      this._error(N, q);
    }
    _error(N, D) {
      (N ? p.reportExtraError : p.reportError)(this, this.def.error, D);
    }
    $dataError() {
      (0, p.reportError)(this, this.def.$dataError || p.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, p.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(N) {
      this.allErrors || this.gen.if(N);
    }
    setParams(N, D) {
      D ? Object.assign(this.params, N) : this.params = N;
    }
    block$data(N, D, q = a.nil) {
      this.gen.block(() => {
        this.check$data(N, q), D();
      });
    }
    check$data(N = a.nil, D = a.nil) {
      if (!this.$data)
        return;
      const { gen: q, schemaCode: G, schemaType: J, def: ae } = this;
      q.if((0, a.or)((0, a._)`${G} === undefined`, D)), N !== a.nil && q.assign(N, !0), (J.length || ae.validateSchema) && (q.elseIf(this.invalid$data()), this.$dataError(), N !== a.nil && q.assign(N, !1)), q.else();
    }
    invalid$data() {
      const { gen: N, schemaCode: D, schemaType: q, def: G, it: J } = this;
      return (0, a.or)(ae(), me());
      function ae() {
        if (q.length) {
          if (!(D instanceof a.Name))
            throw new Error("ajv implementation error");
          const le = Array.isArray(q) ? q : [q];
          return (0, a._)`${(0, n.checkDataTypes)(le, D, J.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function me() {
        if (G.validateSchema) {
          const le = N.scopeValue("validate$data", { ref: G.validateSchema });
          return (0, a._)`!${le}(${D})`;
        }
        return a.nil;
      }
    }
    subschema(N, D) {
      const q = (0, i.getSubschema)(this.it, N);
      (0, i.extendSubschemaData)(q, this.it, N), (0, i.extendSubschemaMode)(q, N);
      const G = { ...this.it, ...q, items: void 0, props: void 0 };
      return v(G, D), G;
    }
    mergeEvaluated(N, D) {
      const { it: q, gen: G } = this;
      q.opts.unevaluated && (q.props !== !0 && N.props !== void 0 && (q.props = u.mergeEvaluated.props(G, N.props, q.props, D)), q.items !== !0 && N.items !== void 0 && (q.items = u.mergeEvaluated.items(G, N.items, q.items, D)));
    }
    mergeValidEvaluated(N, D) {
      const { it: q, gen: G } = this;
      if (q.opts.unevaluated && (q.props !== !0 || q.items !== !0))
        return G.if(D, () => this.mergeEvaluated(N, a.Name)), !0;
    }
  }
  Qe.KeywordCxt = A;
  function x(P, N, D, q) {
    const G = new A(P, D, N);
    "code" in D ? D.code(G, q) : G.$data && D.validate ? (0, o.funcKeywordCode)(G, D) : "macro" in D ? (0, o.macroKeywordCode)(G, D) : (D.compile || D.validate) && (0, o.funcKeywordCode)(G, D);
  }
  const B = /^\/(?:[^~]|~0|~1)*$/, Q = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function Y(P, { dataLevel: N, dataNames: D, dataPathArr: q }) {
    let G, J;
    if (P === "")
      return c.default.rootData;
    if (P[0] === "/") {
      if (!B.test(P))
        throw new Error(`Invalid JSON-pointer: ${P}`);
      G = P, J = c.default.rootData;
    } else {
      const de = Q.exec(P);
      if (!de)
        throw new Error(`Invalid JSON-pointer: ${P}`);
      const ce = +de[1];
      if (G = de[2], G === "#") {
        if (ce >= N)
          throw new Error(le("property/index", ce));
        return q[N - ce];
      }
      if (ce > N)
        throw new Error(le("data", ce));
      if (J = D[N - ce], !G)
        return J;
    }
    let ae = J;
    const me = G.split("/");
    for (const de of me)
      de && (J = (0, a._)`${J}${(0, a.getProperty)((0, u.unescapeJsonPointer)(de))}`, ae = (0, a._)`${ae} && ${J}`);
    return ae;
    function le(de, ce) {
      return `Cannot access ${de} ${ce} levels up, current level is ${N}`;
    }
  }
  return Qe.getData = Y, Qe;
}
var Sn = {}, hd;
function lc() {
  if (hd) return Sn;
  hd = 1, Object.defineProperty(Sn, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return Sn.default = e, Sn;
}
var En = {}, pd;
function Bs() {
  if (pd) return En;
  pd = 1, Object.defineProperty(En, "__esModule", { value: !0 });
  const e = xs();
  class t extends Error {
    constructor(n, s, o, i) {
      super(i || `can't resolve reference ${o} from id ${s}`), this.missingRef = (0, e.resolveUrl)(n, s, o), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(n, this.missingRef));
    }
  }
  return En.default = t, En;
}
var Ae = {}, md;
function dc() {
  if (md) return Ae;
  md = 1, Object.defineProperty(Ae, "__esModule", { value: !0 }), Ae.resolveSchema = Ae.getCompilingSchema = Ae.resolveRef = Ae.compileSchema = Ae.SchemaEnv = void 0;
  const e = oe(), t = lc(), r = ht(), n = xs(), s = ue(), o = Gs();
  class i {
    constructor(y) {
      var d;
      this.refs = {}, this.dynamicAnchors = {};
      let v;
      typeof y.schema == "object" && (v = y.schema), this.schema = y.schema, this.schemaId = y.schemaId, this.root = y.root || this, this.baseId = (d = y.baseId) !== null && d !== void 0 ? d : (0, n.normalizeId)(v?.[y.schemaId || "$id"]), this.schemaPath = y.schemaPath, this.localRefs = y.localRefs, this.meta = y.meta, this.$async = v?.$async, this.refs = {};
    }
  }
  Ae.SchemaEnv = i;
  function a(f) {
    const y = u.call(this, f);
    if (y)
      return y;
    const d = (0, n.getFullPath)(this.opts.uriResolver, f.root.baseId), { es5: v, lines: S } = this.opts.code, { ownProperties: g } = this.opts, $ = new e.CodeGen(this.scope, { es5: v, lines: S, ownProperties: g });
    let E;
    f.$async && (E = $.scopeValue("Error", {
      ref: t.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const I = $.scopeName("validate");
    f.validateName = I;
    const k = {
      gen: $,
      allErrors: this.opts.allErrors,
      data: r.default.data,
      parentData: r.default.parentData,
      parentDataProperty: r.default.parentDataProperty,
      dataNames: [r.default.data],
      dataPathArr: [e.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: $.scopeValue("schema", this.opts.code.source === !0 ? { ref: f.schema, code: (0, e.stringify)(f.schema) } : { ref: f.schema }),
      validateName: I,
      ValidationError: E,
      schema: f.schema,
      schemaEnv: f,
      rootId: d,
      baseId: f.baseId || d,
      schemaPath: e.nil,
      errSchemaPath: f.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let F;
    try {
      this._compilations.add(f), (0, o.validateFunctionCode)(k), $.optimize(this.opts.code.optimize);
      const M = $.toString();
      F = `${$.scopeRefs(r.default.scope)}return ${M}`, this.opts.code.process && (F = this.opts.code.process(F, f));
      const z = new Function(`${r.default.self}`, `${r.default.scope}`, F)(this, this.scope.get());
      if (this.scope.value(I, { ref: z }), z.errors = null, z.schema = f.schema, z.schemaEnv = f, f.$async && (z.$async = !0), this.opts.code.source === !0 && (z.source = { validateName: I, validateCode: M, scopeValues: $._values }), this.opts.unevaluated) {
        const { props: L, items: U } = k;
        z.evaluated = {
          props: L instanceof e.Name ? void 0 : L,
          items: U instanceof e.Name ? void 0 : U,
          dynamicProps: L instanceof e.Name,
          dynamicItems: U instanceof e.Name
        }, z.source && (z.source.evaluated = (0, e.stringify)(z.evaluated));
      }
      return f.validate = z, f;
    } catch (M) {
      throw delete f.validate, delete f.validateName, F && this.logger.error("Error compiling schema, function code:", F), M;
    } finally {
      this._compilations.delete(f);
    }
  }
  Ae.compileSchema = a;
  function c(f, y, d) {
    var v;
    d = (0, n.resolveUrl)(this.opts.uriResolver, y, d);
    const S = f.refs[d];
    if (S)
      return S;
    let g = h.call(this, f, d);
    if (g === void 0) {
      const $ = (v = f.localRefs) === null || v === void 0 ? void 0 : v[d], { schemaId: E } = this.opts;
      $ && (g = new i({ schema: $, schemaId: E, root: f, baseId: y }));
    }
    if (g !== void 0)
      return f.refs[d] = l.call(this, g);
  }
  Ae.resolveRef = c;
  function l(f) {
    return (0, n.inlineRef)(f.schema, this.opts.inlineRefs) ? f.schema : f.validate ? f : a.call(this, f);
  }
  function u(f) {
    for (const y of this._compilations)
      if (p(y, f))
        return y;
  }
  Ae.getCompilingSchema = u;
  function p(f, y) {
    return f.schema === y.schema && f.root === y.root && f.baseId === y.baseId;
  }
  function h(f, y) {
    let d;
    for (; typeof (d = this.refs[y]) == "string"; )
      y = d;
    return d || this.schemas[y] || m.call(this, f, y);
  }
  function m(f, y) {
    const d = this.opts.uriResolver.parse(y), v = (0, n._getFullPath)(this.opts.uriResolver, d);
    let S = (0, n.getFullPath)(this.opts.uriResolver, f.baseId, void 0);
    if (Object.keys(f.schema).length > 0 && v === S)
      return _.call(this, d, f);
    const g = (0, n.normalizeId)(v), $ = this.refs[g] || this.schemas[g];
    if (typeof $ == "string") {
      const E = m.call(this, f, $);
      return typeof E?.schema != "object" ? void 0 : _.call(this, d, E);
    }
    if (typeof $?.schema == "object") {
      if ($.validate || a.call(this, $), g === (0, n.normalizeId)(y)) {
        const { schema: E } = $, { schemaId: I } = this.opts, k = E[I];
        return k && (S = (0, n.resolveUrl)(this.opts.uriResolver, S, k)), new i({ schema: E, schemaId: I, root: f, baseId: S });
      }
      return _.call(this, d, $);
    }
  }
  Ae.resolveSchema = m;
  const b = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function _(f, { baseId: y, schema: d, root: v }) {
    var S;
    if (((S = f.fragment) === null || S === void 0 ? void 0 : S[0]) !== "/")
      return;
    for (const E of f.fragment.slice(1).split("/")) {
      if (typeof d == "boolean")
        return;
      const I = d[(0, s.unescapeFragment)(E)];
      if (I === void 0)
        return;
      d = I;
      const k = typeof d == "object" && d[this.opts.schemaId];
      !b.has(E) && k && (y = (0, n.resolveUrl)(this.opts.uriResolver, y, k));
    }
    let g;
    if (typeof d != "boolean" && d.$ref && !(0, s.schemaHasRulesButRef)(d, this.RULES)) {
      const E = (0, n.resolveUrl)(this.opts.uriResolver, y, d.$ref);
      g = m.call(this, v, E);
    }
    const { schemaId: $ } = this.opts;
    if (g = g || new i({ schema: d, schemaId: $, root: v, baseId: y }), g.schema !== g.root.schema)
      return g;
  }
  return Ae;
}
const W1 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", K1 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", H1 = "object", J1 = ["$data"], X1 = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, Y1 = !1, Q1 = {
  $id: W1,
  description: K1,
  type: H1,
  required: J1,
  properties: X1,
  additionalProperties: Y1
};
var Rn = {}, yd;
function Z1() {
  if (yd) return Rn;
  yd = 1, Object.defineProperty(Rn, "__esModule", { value: !0 });
  const e = uy();
  return e.code = 'require("ajv/dist/runtime/uri").default', Rn.default = e, Rn;
}
var gd;
function eO() {
  return gd || (gd = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var t = Gs();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return t.KeywordCxt;
    } });
    var r = oe();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return r._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return r.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return r.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return r.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return r.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return r.CodeGen;
    } });
    const n = lc(), s = Bs(), o = my(), i = dc(), a = oe(), c = xs(), l = Es(), u = ue(), p = Q1, h = Z1(), m = (C, O) => new RegExp(C, O);
    m.code = "new RegExp";
    const b = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), f = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, y = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, d = 200;
    function v(C) {
      var O, j, T, w, R, A, x, B, Q, Y, P, N, D, q, G, J, ae, me, le, de, ce, Te, pe, pt, mt;
      const Ce = C.strict, yt = (O = C.code) === null || O === void 0 ? void 0 : O.optimize, Xt = yt === !0 || yt === void 0 ? 1 : yt || 0, Yt = (T = (j = C.code) === null || j === void 0 ? void 0 : j.regExp) !== null && T !== void 0 ? T : m, Qs = (w = C.uriResolver) !== null && w !== void 0 ? w : h.default;
      return {
        strictSchema: (A = (R = C.strictSchema) !== null && R !== void 0 ? R : Ce) !== null && A !== void 0 ? A : !0,
        strictNumbers: (B = (x = C.strictNumbers) !== null && x !== void 0 ? x : Ce) !== null && B !== void 0 ? B : !0,
        strictTypes: (Y = (Q = C.strictTypes) !== null && Q !== void 0 ? Q : Ce) !== null && Y !== void 0 ? Y : "log",
        strictTuples: (N = (P = C.strictTuples) !== null && P !== void 0 ? P : Ce) !== null && N !== void 0 ? N : "log",
        strictRequired: (q = (D = C.strictRequired) !== null && D !== void 0 ? D : Ce) !== null && q !== void 0 ? q : !1,
        code: C.code ? { ...C.code, optimize: Xt, regExp: Yt } : { optimize: Xt, regExp: Yt },
        loopRequired: (G = C.loopRequired) !== null && G !== void 0 ? G : d,
        loopEnum: (J = C.loopEnum) !== null && J !== void 0 ? J : d,
        meta: (ae = C.meta) !== null && ae !== void 0 ? ae : !0,
        messages: (me = C.messages) !== null && me !== void 0 ? me : !0,
        inlineRefs: (le = C.inlineRefs) !== null && le !== void 0 ? le : !0,
        schemaId: (de = C.schemaId) !== null && de !== void 0 ? de : "$id",
        addUsedSchema: (ce = C.addUsedSchema) !== null && ce !== void 0 ? ce : !0,
        validateSchema: (Te = C.validateSchema) !== null && Te !== void 0 ? Te : !0,
        validateFormats: (pe = C.validateFormats) !== null && pe !== void 0 ? pe : !0,
        unicodeRegExp: (pt = C.unicodeRegExp) !== null && pt !== void 0 ? pt : !0,
        int32range: (mt = C.int32range) !== null && mt !== void 0 ? mt : !0,
        uriResolver: Qs
      };
    }
    class S {
      constructor(O = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), O = this.opts = { ...O, ...v(O) };
        const { es5: j, lines: T } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: _, es5: j, lines: T }), this.logger = V(O.logger);
        const w = O.validateFormats;
        O.validateFormats = !1, this.RULES = (0, o.getRules)(), g.call(this, f, O, "NOT SUPPORTED"), g.call(this, y, O, "DEPRECATED", "warn"), this._metaOpts = F.call(this), O.formats && I.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), O.keywords && k.call(this, O.keywords), typeof O.meta == "object" && this.addMetaSchema(O.meta), E.call(this), O.validateFormats = w;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: O, meta: j, schemaId: T } = this.opts;
        let w = p;
        T === "id" && (w = { ...p }, w.id = w.$id, delete w.$id), j && O && this.addMetaSchema(w, w[T], !1);
      }
      defaultMeta() {
        const { meta: O, schemaId: j } = this.opts;
        return this.opts.defaultMeta = typeof O == "object" ? O[j] || O : void 0;
      }
      validate(O, j) {
        let T;
        if (typeof O == "string") {
          if (T = this.getSchema(O), !T)
            throw new Error(`no schema with key or ref "${O}"`);
        } else
          T = this.compile(O);
        const w = T(j);
        return "$async" in T || (this.errors = T.errors), w;
      }
      compile(O, j) {
        const T = this._addSchema(O, j);
        return T.validate || this._compileSchemaEnv(T);
      }
      compileAsync(O, j) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: T } = this.opts;
        return w.call(this, O, j);
        async function w(Y, P) {
          await R.call(this, Y.$schema);
          const N = this._addSchema(Y, P);
          return N.validate || A.call(this, N);
        }
        async function R(Y) {
          Y && !this.getSchema(Y) && await w.call(this, { $ref: Y }, !0);
        }
        async function A(Y) {
          try {
            return this._compileSchemaEnv(Y);
          } catch (P) {
            if (!(P instanceof s.default))
              throw P;
            return x.call(this, P), await B.call(this, P.missingSchema), A.call(this, Y);
          }
        }
        function x({ missingSchema: Y, missingRef: P }) {
          if (this.refs[Y])
            throw new Error(`AnySchema ${Y} is loaded but ${P} cannot be resolved`);
        }
        async function B(Y) {
          const P = await Q.call(this, Y);
          this.refs[Y] || await R.call(this, P.$schema), this.refs[Y] || this.addSchema(P, Y, j);
        }
        async function Q(Y) {
          const P = this._loading[Y];
          if (P)
            return P;
          try {
            return await (this._loading[Y] = T(Y));
          } finally {
            delete this._loading[Y];
          }
        }
      }
      // Adds schema to the instance
      addSchema(O, j, T, w = this.opts.validateSchema) {
        if (Array.isArray(O)) {
          for (const A of O)
            this.addSchema(A, void 0, T, w);
          return this;
        }
        let R;
        if (typeof O == "object") {
          const { schemaId: A } = this.opts;
          if (R = O[A], R !== void 0 && typeof R != "string")
            throw new Error(`schema ${A} must be string`);
        }
        return j = (0, c.normalizeId)(j || R), this._checkUnique(j), this.schemas[j] = this._addSchema(O, T, j, w, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(O, j, T = this.opts.validateSchema) {
        return this.addSchema(O, j, !0, T), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(O, j) {
        if (typeof O == "boolean")
          return !0;
        let T;
        if (T = O.$schema, T !== void 0 && typeof T != "string")
          throw new Error("$schema must be a string");
        if (T = T || this.opts.defaultMeta || this.defaultMeta(), !T)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const w = this.validate(T, O);
        if (!w && j) {
          const R = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(R);
          else
            throw new Error(R);
        }
        return w;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(O) {
        let j;
        for (; typeof (j = $.call(this, O)) == "string"; )
          O = j;
        if (j === void 0) {
          const { schemaId: T } = this.opts, w = new i.SchemaEnv({ schema: {}, schemaId: T });
          if (j = i.resolveSchema.call(this, w, O), !j)
            return;
          this.refs[O] = j;
        }
        return j.validate || this._compileSchemaEnv(j);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(O) {
        if (O instanceof RegExp)
          return this._removeAllSchemas(this.schemas, O), this._removeAllSchemas(this.refs, O), this;
        switch (typeof O) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const j = $.call(this, O);
            return typeof j == "object" && this._cache.delete(j.schema), delete this.schemas[O], delete this.refs[O], this;
          }
          case "object": {
            const j = O;
            this._cache.delete(j);
            let T = O[this.opts.schemaId];
            return T && (T = (0, c.normalizeId)(T), delete this.schemas[T], delete this.refs[T]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(O) {
        for (const j of O)
          this.addKeyword(j);
        return this;
      }
      addKeyword(O, j) {
        let T;
        if (typeof O == "string")
          T = O, typeof j == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), j.keyword = T);
        else if (typeof O == "object" && j === void 0) {
          if (j = O, T = j.keyword, Array.isArray(T) && !T.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (L.call(this, T, j), !j)
          return (0, u.eachItem)(T, (R) => U.call(this, R)), this;
        K.call(this, j);
        const w = {
          ...j,
          type: (0, l.getJSONTypes)(j.type),
          schemaType: (0, l.getJSONTypes)(j.schemaType)
        };
        return (0, u.eachItem)(T, w.type.length === 0 ? (R) => U.call(this, R, w) : (R) => w.type.forEach((A) => U.call(this, R, w, A))), this;
      }
      getKeyword(O) {
        const j = this.RULES.all[O];
        return typeof j == "object" ? j.definition : !!j;
      }
      // Remove keyword
      removeKeyword(O) {
        const { RULES: j } = this;
        delete j.keywords[O], delete j.all[O];
        for (const T of j.rules) {
          const w = T.rules.findIndex((R) => R.keyword === O);
          w >= 0 && T.rules.splice(w, 1);
        }
        return this;
      }
      // Add format
      addFormat(O, j) {
        return typeof j == "string" && (j = new RegExp(j)), this.formats[O] = j, this;
      }
      errorsText(O = this.errors, { separator: j = ", ", dataVar: T = "data" } = {}) {
        return !O || O.length === 0 ? "No errors" : O.map((w) => `${T}${w.instancePath} ${w.message}`).reduce((w, R) => w + j + R);
      }
      $dataMetaSchema(O, j) {
        const T = this.RULES.all;
        O = JSON.parse(JSON.stringify(O));
        for (const w of j) {
          const R = w.split("/").slice(1);
          let A = O;
          for (const x of R)
            A = A[x];
          for (const x in T) {
            const B = T[x];
            if (typeof B != "object")
              continue;
            const { $data: Q } = B.definition, Y = A[x];
            Q && Y && (A[x] = X(Y));
          }
        }
        return O;
      }
      _removeAllSchemas(O, j) {
        for (const T in O) {
          const w = O[T];
          (!j || j.test(T)) && (typeof w == "string" ? delete O[T] : w && !w.meta && (this._cache.delete(w.schema), delete O[T]));
        }
      }
      _addSchema(O, j, T, w = this.opts.validateSchema, R = this.opts.addUsedSchema) {
        let A;
        const { schemaId: x } = this.opts;
        if (typeof O == "object")
          A = O[x];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof O != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let B = this._cache.get(O);
        if (B !== void 0)
          return B;
        T = (0, c.normalizeId)(A || T);
        const Q = c.getSchemaRefs.call(this, O, T);
        return B = new i.SchemaEnv({ schema: O, schemaId: x, meta: j, baseId: T, localRefs: Q }), this._cache.set(B.schema, B), R && !T.startsWith("#") && (T && this._checkUnique(T), this.refs[T] = B), w && this.validateSchema(O, !0), B;
      }
      _checkUnique(O) {
        if (this.schemas[O] || this.refs[O])
          throw new Error(`schema with key or id "${O}" already exists`);
      }
      _compileSchemaEnv(O) {
        if (O.meta ? this._compileMetaSchema(O) : i.compileSchema.call(this, O), !O.validate)
          throw new Error("ajv implementation error");
        return O.validate;
      }
      _compileMetaSchema(O) {
        const j = this.opts;
        this.opts = this._metaOpts;
        try {
          i.compileSchema.call(this, O);
        } finally {
          this.opts = j;
        }
      }
    }
    S.ValidationError = n.default, S.MissingRefError = s.default, e.default = S;
    function g(C, O, j, T = "error") {
      for (const w in C) {
        const R = w;
        R in O && this.logger[T](`${j}: option ${w}. ${C[R]}`);
      }
    }
    function $(C) {
      return C = (0, c.normalizeId)(C), this.schemas[C] || this.refs[C];
    }
    function E() {
      const C = this.opts.schemas;
      if (C)
        if (Array.isArray(C))
          this.addSchema(C);
        else
          for (const O in C)
            this.addSchema(C[O], O);
    }
    function I() {
      for (const C in this.opts.formats) {
        const O = this.opts.formats[C];
        O && this.addFormat(C, O);
      }
    }
    function k(C) {
      if (Array.isArray(C)) {
        this.addVocabulary(C);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const O in C) {
        const j = C[O];
        j.keyword || (j.keyword = O), this.addKeyword(j);
      }
    }
    function F() {
      const C = { ...this.opts };
      for (const O of b)
        delete C[O];
      return C;
    }
    const M = { log() {
    }, warn() {
    }, error() {
    } };
    function V(C) {
      if (C === !1)
        return M;
      if (C === void 0)
        return console;
      if (C.log && C.warn && C.error)
        return C;
      throw new Error("logger must implement log, warn and error methods");
    }
    const z = /^[a-z_$][a-z0-9_$:-]*$/i;
    function L(C, O) {
      const { RULES: j } = this;
      if ((0, u.eachItem)(C, (T) => {
        if (j.keywords[T])
          throw new Error(`Keyword ${T} is already defined`);
        if (!z.test(T))
          throw new Error(`Keyword ${T} has invalid name`);
      }), !!O && O.$data && !("code" in O || "validate" in O))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function U(C, O, j) {
      var T;
      const w = O?.post;
      if (j && w)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: R } = this;
      let A = w ? R.post : R.rules.find(({ type: B }) => B === j);
      if (A || (A = { type: j, rules: [] }, R.rules.push(A)), R.keywords[C] = !0, !O)
        return;
      const x = {
        keyword: C,
        definition: {
          ...O,
          type: (0, l.getJSONTypes)(O.type),
          schemaType: (0, l.getJSONTypes)(O.schemaType)
        }
      };
      O.before ? H.call(this, A, x, O.before) : A.rules.push(x), R.all[C] = x, (T = O.implements) === null || T === void 0 || T.forEach((B) => this.addKeyword(B));
    }
    function H(C, O, j) {
      const T = C.rules.findIndex((w) => w.keyword === j);
      T >= 0 ? C.rules.splice(T, 0, O) : (C.rules.push(O), this.logger.warn(`rule ${j} is not defined`));
    }
    function K(C) {
      let { metaSchema: O } = C;
      O !== void 0 && (C.$data && this.opts.$data && (O = X(O)), C.validateSchema = this.compile(O, !0));
    }
    const W = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function X(C) {
      return { anyOf: [C, W] };
    }
  })(No)), No;
}
var Pn = {}, On = {}, Tn = {}, vd;
function tO() {
  if (vd) return Tn;
  vd = 1, Object.defineProperty(Tn, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Tn.default = e, Tn;
}
var it = {}, wd;
function rO() {
  if (wd) return it;
  wd = 1, Object.defineProperty(it, "__esModule", { value: !0 }), it.callRef = it.getValidate = void 0;
  const e = Bs(), t = Ue(), r = oe(), n = ht(), s = dc(), o = ue(), i = {
    keyword: "$ref",
    schemaType: "string",
    code(l) {
      const { gen: u, schema: p, it: h } = l, { baseId: m, schemaEnv: b, validateName: _, opts: f, self: y } = h, { root: d } = b;
      if ((p === "#" || p === "#/") && m === d.baseId)
        return S();
      const v = s.resolveRef.call(y, d, m, p);
      if (v === void 0)
        throw new e.default(h.opts.uriResolver, m, p);
      if (v instanceof s.SchemaEnv)
        return g(v);
      return $(v);
      function S() {
        if (b === d)
          return c(l, _, b, b.$async);
        const E = u.scopeValue("root", { ref: d });
        return c(l, (0, r._)`${E}.validate`, d, d.$async);
      }
      function g(E) {
        const I = a(l, E);
        c(l, I, E, E.$async);
      }
      function $(E) {
        const I = u.scopeValue("schema", f.code.source === !0 ? { ref: E, code: (0, r.stringify)(E) } : { ref: E }), k = u.name("valid"), F = l.subschema({
          schema: E,
          dataTypes: [],
          schemaPath: r.nil,
          topSchemaRef: I,
          errSchemaPath: p
        }, k);
        l.mergeEvaluated(F), l.ok(k);
      }
    }
  };
  function a(l, u) {
    const { gen: p } = l;
    return u.validate ? p.scopeValue("validate", { ref: u.validate }) : (0, r._)`${p.scopeValue("wrapper", { ref: u })}.validate`;
  }
  it.getValidate = a;
  function c(l, u, p, h) {
    const { gen: m, it: b } = l, { allErrors: _, schemaEnv: f, opts: y } = b, d = y.passContext ? n.default.this : r.nil;
    h ? v() : S();
    function v() {
      if (!f.$async)
        throw new Error("async schema referenced by sync schema");
      const E = m.let("valid");
      m.try(() => {
        m.code((0, r._)`await ${(0, t.callValidateCode)(l, u, d)}`), $(u), _ || m.assign(E, !0);
      }, (I) => {
        m.if((0, r._)`!(${I} instanceof ${b.ValidationError})`, () => m.throw(I)), g(I), _ || m.assign(E, !1);
      }), l.ok(E);
    }
    function S() {
      l.result((0, t.callValidateCode)(l, u, d), () => $(u), () => g(u));
    }
    function g(E) {
      const I = (0, r._)`${E}.errors`;
      m.assign(n.default.vErrors, (0, r._)`${n.default.vErrors} === null ? ${I} : ${n.default.vErrors}.concat(${I})`), m.assign(n.default.errors, (0, r._)`${n.default.vErrors}.length`);
    }
    function $(E) {
      var I;
      if (!b.opts.unevaluated)
        return;
      const k = (I = p?.validate) === null || I === void 0 ? void 0 : I.evaluated;
      if (b.props !== !0)
        if (k && !k.dynamicProps)
          k.props !== void 0 && (b.props = o.mergeEvaluated.props(m, k.props, b.props));
        else {
          const F = m.var("props", (0, r._)`${E}.evaluated.props`);
          b.props = o.mergeEvaluated.props(m, F, b.props, r.Name);
        }
      if (b.items !== !0)
        if (k && !k.dynamicItems)
          k.items !== void 0 && (b.items = o.mergeEvaluated.items(m, k.items, b.items));
        else {
          const F = m.var("items", (0, r._)`${E}.evaluated.items`);
          b.items = o.mergeEvaluated.items(m, F, b.items, r.Name);
        }
    }
  }
  return it.callRef = c, it.default = i, it;
}
var $d;
function nO() {
  if ($d) return On;
  $d = 1, Object.defineProperty(On, "__esModule", { value: !0 });
  const e = tO(), t = rO(), r = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    t.default
  ];
  return On.default = r, On;
}
var In = {}, Nn = {}, _d;
function sO() {
  if (_d) return Nn;
  _d = 1, Object.defineProperty(Nn, "__esModule", { value: !0 });
  const e = oe(), t = e.operators, r = {
    maximum: { okStr: "<=", ok: t.LTE, fail: t.GT },
    minimum: { okStr: ">=", ok: t.GTE, fail: t.LT },
    exclusiveMaximum: { okStr: "<", ok: t.LT, fail: t.GTE },
    exclusiveMinimum: { okStr: ">", ok: t.GT, fail: t.LTE }
  }, n = {
    message: ({ keyword: o, schemaCode: i }) => (0, e.str)`must be ${r[o].okStr} ${i}`,
    params: ({ keyword: o, schemaCode: i }) => (0, e._)`{comparison: ${r[o].okStr}, limit: ${i}}`
  }, s = {
    keyword: Object.keys(r),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: n,
    code(o) {
      const { keyword: i, data: a, schemaCode: c } = o;
      o.fail$data((0, e._)`${a} ${r[i].fail} ${c} || isNaN(${a})`);
    }
  };
  return Nn.default = s, Nn;
}
var An = {}, bd;
function oO() {
  if (bd) return An;
  bd = 1, Object.defineProperty(An, "__esModule", { value: !0 });
  const e = oe(), r = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must be multiple of ${n}`,
      params: ({ schemaCode: n }) => (0, e._)`{multipleOf: ${n}}`
    },
    code(n) {
      const { gen: s, data: o, schemaCode: i, it: a } = n, c = a.opts.multipleOfPrecision, l = s.let("res"), u = c ? (0, e._)`Math.abs(Math.round(${l}) - ${l}) > 1e-${c}` : (0, e._)`${l} !== parseInt(${l})`;
      n.fail$data((0, e._)`(${i} === 0 || (${l} = ${o}/${i}, ${u}))`);
    }
  };
  return An.default = r, An;
}
var jn = {}, Cn = {}, Sd;
function iO() {
  if (Sd) return Cn;
  Sd = 1, Object.defineProperty(Cn, "__esModule", { value: !0 });
  function e(t) {
    const r = t.length;
    let n = 0, s = 0, o;
    for (; s < r; )
      n++, o = t.charCodeAt(s++), o >= 55296 && o <= 56319 && s < r && (o = t.charCodeAt(s), (o & 64512) === 56320 && s++);
    return n;
  }
  return Cn.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', Cn;
}
var Ed;
function aO() {
  if (Ed) return jn;
  Ed = 1, Object.defineProperty(jn, "__esModule", { value: !0 });
  const e = oe(), t = ue(), r = iO(), s = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: o, schemaCode: i }) {
        const a = o === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${a} than ${i} characters`;
      },
      params: ({ schemaCode: o }) => (0, e._)`{limit: ${o}}`
    },
    code(o) {
      const { keyword: i, data: a, schemaCode: c, it: l } = o, u = i === "maxLength" ? e.operators.GT : e.operators.LT, p = l.opts.unicode === !1 ? (0, e._)`${a}.length` : (0, e._)`${(0, t.useFunc)(o.gen, r.default)}(${a})`;
      o.fail$data((0, e._)`${p} ${u} ${c}`);
    }
  };
  return jn.default = s, jn;
}
var Dn = {}, Rd;
function cO() {
  if (Rd) return Dn;
  Rd = 1, Object.defineProperty(Dn, "__esModule", { value: !0 });
  const e = Ue(), t = oe(), n = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: s }) => (0, t.str)`must match pattern "${s}"`,
      params: ({ schemaCode: s }) => (0, t._)`{pattern: ${s}}`
    },
    code(s) {
      const { data: o, $data: i, schema: a, schemaCode: c, it: l } = s, u = l.opts.unicodeRegExp ? "u" : "", p = i ? (0, t._)`(new RegExp(${c}, ${u}))` : (0, e.usePattern)(s, a);
      s.fail$data((0, t._)`!${p}.test(${o})`);
    }
  };
  return Dn.default = n, Dn;
}
var kn = {}, Pd;
function uO() {
  if (Pd) return kn;
  Pd = 1, Object.defineProperty(kn, "__esModule", { value: !0 });
  const e = oe(), r = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: s }) {
        const o = n === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${o} than ${s} properties`;
      },
      params: ({ schemaCode: n }) => (0, e._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: s, data: o, schemaCode: i } = n, a = s === "maxProperties" ? e.operators.GT : e.operators.LT;
      n.fail$data((0, e._)`Object.keys(${o}).length ${a} ${i}`);
    }
  };
  return kn.default = r, kn;
}
var Mn = {}, Od;
function lO() {
  if (Od) return Mn;
  Od = 1, Object.defineProperty(Mn, "__esModule", { value: !0 });
  const e = Ue(), t = oe(), r = ue(), s = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: o } }) => (0, t.str)`must have required property '${o}'`,
      params: ({ params: { missingProperty: o } }) => (0, t._)`{missingProperty: ${o}}`
    },
    code(o) {
      const { gen: i, schema: a, schemaCode: c, data: l, $data: u, it: p } = o, { opts: h } = p;
      if (!u && a.length === 0)
        return;
      const m = a.length >= h.loopRequired;
      if (p.allErrors ? b() : _(), h.strictRequired) {
        const d = o.parentSchema.properties, { definedProperties: v } = o.it;
        for (const S of a)
          if (d?.[S] === void 0 && !v.has(S)) {
            const g = p.schemaEnv.baseId + p.errSchemaPath, $ = `required property "${S}" is not defined at "${g}" (strictRequired)`;
            (0, r.checkStrictMode)(p, $, p.opts.strictRequired);
          }
      }
      function b() {
        if (m || u)
          o.block$data(t.nil, f);
        else
          for (const d of a)
            (0, e.checkReportMissingProp)(o, d);
      }
      function _() {
        const d = i.let("missing");
        if (m || u) {
          const v = i.let("valid", !0);
          o.block$data(v, () => y(d, v)), o.ok(v);
        } else
          i.if((0, e.checkMissingProp)(o, a, d)), (0, e.reportMissingProp)(o, d), i.else();
      }
      function f() {
        i.forOf("prop", c, (d) => {
          o.setParams({ missingProperty: d }), i.if((0, e.noPropertyInData)(i, l, d, h.ownProperties), () => o.error());
        });
      }
      function y(d, v) {
        o.setParams({ missingProperty: d }), i.forOf(d, c, () => {
          i.assign(v, (0, e.propertyInData)(i, l, d, h.ownProperties)), i.if((0, t.not)(v), () => {
            o.error(), i.break();
          });
        }, t.nil);
      }
    }
  };
  return Mn.default = s, Mn;
}
var Ln = {}, Td;
function dO() {
  if (Td) return Ln;
  Td = 1, Object.defineProperty(Ln, "__esModule", { value: !0 });
  const e = oe(), r = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: s }) {
        const o = n === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${o} than ${s} items`;
      },
      params: ({ schemaCode: n }) => (0, e._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: s, data: o, schemaCode: i } = n, a = s === "maxItems" ? e.operators.GT : e.operators.LT;
      n.fail$data((0, e._)`${o}.length ${a} ${i}`);
    }
  };
  return Ln.default = r, Ln;
}
var qn = {}, Fn = {}, Id;
function fc() {
  if (Id) return Fn;
  Id = 1, Object.defineProperty(Fn, "__esModule", { value: !0 });
  const e = Ls();
  return e.code = 'require("ajv/dist/runtime/equal").default', Fn.default = e, Fn;
}
var Nd;
function fO() {
  if (Nd) return qn;
  Nd = 1, Object.defineProperty(qn, "__esModule", { value: !0 });
  const e = Es(), t = oe(), r = ue(), n = fc(), o = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i, j: a } }) => (0, t.str)`must NOT have duplicate items (items ## ${a} and ${i} are identical)`,
      params: ({ params: { i, j: a } }) => (0, t._)`{i: ${i}, j: ${a}}`
    },
    code(i) {
      const { gen: a, data: c, $data: l, schema: u, parentSchema: p, schemaCode: h, it: m } = i;
      if (!l && !u)
        return;
      const b = a.let("valid"), _ = p.items ? (0, e.getSchemaTypes)(p.items) : [];
      i.block$data(b, f, (0, t._)`${h} === false`), i.ok(b);
      function f() {
        const S = a.let("i", (0, t._)`${c}.length`), g = a.let("j");
        i.setParams({ i: S, j: g }), a.assign(b, !0), a.if((0, t._)`${S} > 1`, () => (y() ? d : v)(S, g));
      }
      function y() {
        return _.length > 0 && !_.some((S) => S === "object" || S === "array");
      }
      function d(S, g) {
        const $ = a.name("item"), E = (0, e.checkDataTypes)(_, $, m.opts.strictNumbers, e.DataType.Wrong), I = a.const("indices", (0, t._)`{}`);
        a.for((0, t._)`;${S}--;`, () => {
          a.let($, (0, t._)`${c}[${S}]`), a.if(E, (0, t._)`continue`), _.length > 1 && a.if((0, t._)`typeof ${$} == "string"`, (0, t._)`${$} += "_"`), a.if((0, t._)`typeof ${I}[${$}] == "number"`, () => {
            a.assign(g, (0, t._)`${I}[${$}]`), i.error(), a.assign(b, !1).break();
          }).code((0, t._)`${I}[${$}] = ${S}`);
        });
      }
      function v(S, g) {
        const $ = (0, r.useFunc)(a, n.default), E = a.name("outer");
        a.label(E).for((0, t._)`;${S}--;`, () => a.for((0, t._)`${g} = ${S}; ${g}--;`, () => a.if((0, t._)`${$}(${c}[${S}], ${c}[${g}])`, () => {
          i.error(), a.assign(b, !1).break(E);
        })));
      }
    }
  };
  return qn.default = o, qn;
}
var Un = {}, Ad;
function hO() {
  if (Ad) return Un;
  Ad = 1, Object.defineProperty(Un, "__esModule", { value: !0 });
  const e = oe(), t = ue(), r = fc(), s = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: o }) => (0, e._)`{allowedValue: ${o}}`
    },
    code(o) {
      const { gen: i, data: a, $data: c, schemaCode: l, schema: u } = o;
      c || u && typeof u == "object" ? o.fail$data((0, e._)`!${(0, t.useFunc)(i, r.default)}(${a}, ${l})`) : o.fail((0, e._)`${u} !== ${a}`);
    }
  };
  return Un.default = s, Un;
}
var Vn = {}, jd;
function pO() {
  if (jd) return Vn;
  jd = 1, Object.defineProperty(Vn, "__esModule", { value: !0 });
  const e = oe(), t = ue(), r = fc(), s = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: o }) => (0, e._)`{allowedValues: ${o}}`
    },
    code(o) {
      const { gen: i, data: a, $data: c, schema: l, schemaCode: u, it: p } = o;
      if (!c && l.length === 0)
        throw new Error("enum must have non-empty array");
      const h = l.length >= p.opts.loopEnum;
      let m;
      const b = () => m ?? (m = (0, t.useFunc)(i, r.default));
      let _;
      if (h || c)
        _ = i.let("valid"), o.block$data(_, f);
      else {
        if (!Array.isArray(l))
          throw new Error("ajv implementation error");
        const d = i.const("vSchema", u);
        _ = (0, e.or)(...l.map((v, S) => y(d, S)));
      }
      o.pass(_);
      function f() {
        i.assign(_, !1), i.forOf("v", u, (d) => i.if((0, e._)`${b()}(${a}, ${d})`, () => i.assign(_, !0).break()));
      }
      function y(d, v) {
        const S = l[v];
        return typeof S == "object" && S !== null ? (0, e._)`${b()}(${a}, ${d}[${v}])` : (0, e._)`${a} === ${S}`;
      }
    }
  };
  return Vn.default = s, Vn;
}
var Cd;
function mO() {
  if (Cd) return In;
  Cd = 1, Object.defineProperty(In, "__esModule", { value: !0 });
  const e = sO(), t = oO(), r = aO(), n = cO(), s = uO(), o = lO(), i = dO(), a = fO(), c = hO(), l = pO(), u = [
    // number
    e.default,
    t.default,
    // string
    r.default,
    n.default,
    // object
    s.default,
    o.default,
    // array
    i.default,
    a.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    c.default,
    l.default
  ];
  return In.default = u, In;
}
var zn = {}, Ft = {}, Dd;
function gy() {
  if (Dd) return Ft;
  Dd = 1, Object.defineProperty(Ft, "__esModule", { value: !0 }), Ft.validateAdditionalItems = void 0;
  const e = oe(), t = ue(), n = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: o } }) => (0, e.str)`must NOT have more than ${o} items`,
      params: ({ params: { len: o } }) => (0, e._)`{limit: ${o}}`
    },
    code(o) {
      const { parentSchema: i, it: a } = o, { items: c } = i;
      if (!Array.isArray(c)) {
        (0, t.checkStrictMode)(a, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      s(o, c);
    }
  };
  function s(o, i) {
    const { gen: a, schema: c, data: l, keyword: u, it: p } = o;
    p.items = !0;
    const h = a.const("len", (0, e._)`${l}.length`);
    if (c === !1)
      o.setParams({ len: i.length }), o.pass((0, e._)`${h} <= ${i.length}`);
    else if (typeof c == "object" && !(0, t.alwaysValidSchema)(p, c)) {
      const b = a.var("valid", (0, e._)`${h} <= ${i.length}`);
      a.if((0, e.not)(b), () => m(b)), o.ok(b);
    }
    function m(b) {
      a.forRange("i", i.length, h, (_) => {
        o.subschema({ keyword: u, dataProp: _, dataPropType: t.Type.Num }, b), p.allErrors || a.if((0, e.not)(b), () => a.break());
      });
    }
  }
  return Ft.validateAdditionalItems = s, Ft.default = n, Ft;
}
var xn = {}, Ut = {}, kd;
function vy() {
  if (kd) return Ut;
  kd = 1, Object.defineProperty(Ut, "__esModule", { value: !0 }), Ut.validateTuple = void 0;
  const e = oe(), t = ue(), r = Ue(), n = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(o) {
      const { schema: i, it: a } = o;
      if (Array.isArray(i))
        return s(o, "additionalItems", i);
      a.items = !0, !(0, t.alwaysValidSchema)(a, i) && o.ok((0, r.validateArray)(o));
    }
  };
  function s(o, i, a = o.schema) {
    const { gen: c, parentSchema: l, data: u, keyword: p, it: h } = o;
    _(l), h.opts.unevaluated && a.length && h.items !== !0 && (h.items = t.mergeEvaluated.items(c, a.length, h.items));
    const m = c.name("valid"), b = c.const("len", (0, e._)`${u}.length`);
    a.forEach((f, y) => {
      (0, t.alwaysValidSchema)(h, f) || (c.if((0, e._)`${b} > ${y}`, () => o.subschema({
        keyword: p,
        schemaProp: y,
        dataProp: y
      }, m)), o.ok(m));
    });
    function _(f) {
      const { opts: y, errSchemaPath: d } = h, v = a.length, S = v === f.minItems && (v === f.maxItems || f[i] === !1);
      if (y.strictTuples && !S) {
        const g = `"${p}" is ${v}-tuple, but minItems or maxItems/${i} are not specified or different at path "${d}"`;
        (0, t.checkStrictMode)(h, g, y.strictTuples);
      }
    }
  }
  return Ut.validateTuple = s, Ut.default = n, Ut;
}
var Md;
function yO() {
  if (Md) return xn;
  Md = 1, Object.defineProperty(xn, "__esModule", { value: !0 });
  const e = vy(), t = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (r) => (0, e.validateTuple)(r, "items")
  };
  return xn.default = t, xn;
}
var Gn = {}, Ld;
function gO() {
  if (Ld) return Gn;
  Ld = 1, Object.defineProperty(Gn, "__esModule", { value: !0 });
  const e = oe(), t = ue(), r = Ue(), n = gy(), o = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, e.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, e._)`{limit: ${i}}`
    },
    code(i) {
      const { schema: a, parentSchema: c, it: l } = i, { prefixItems: u } = c;
      l.items = !0, !(0, t.alwaysValidSchema)(l, a) && (u ? (0, n.validateAdditionalItems)(i, u) : i.ok((0, r.validateArray)(i)));
    }
  };
  return Gn.default = o, Gn;
}
var Bn = {}, qd;
function vO() {
  if (qd) return Bn;
  qd = 1, Object.defineProperty(Bn, "__esModule", { value: !0 });
  const e = oe(), t = ue(), n = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: s, max: o } }) => o === void 0 ? (0, e.str)`must contain at least ${s} valid item(s)` : (0, e.str)`must contain at least ${s} and no more than ${o} valid item(s)`,
      params: ({ params: { min: s, max: o } }) => o === void 0 ? (0, e._)`{minContains: ${s}}` : (0, e._)`{minContains: ${s}, maxContains: ${o}}`
    },
    code(s) {
      const { gen: o, schema: i, parentSchema: a, data: c, it: l } = s;
      let u, p;
      const { minContains: h, maxContains: m } = a;
      l.opts.next ? (u = h === void 0 ? 1 : h, p = m) : u = 1;
      const b = o.const("len", (0, e._)`${c}.length`);
      if (s.setParams({ min: u, max: p }), p === void 0 && u === 0) {
        (0, t.checkStrictMode)(l, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (p !== void 0 && u > p) {
        (0, t.checkStrictMode)(l, '"minContains" > "maxContains" is always invalid'), s.fail();
        return;
      }
      if ((0, t.alwaysValidSchema)(l, i)) {
        let v = (0, e._)`${b} >= ${u}`;
        p !== void 0 && (v = (0, e._)`${v} && ${b} <= ${p}`), s.pass(v);
        return;
      }
      l.items = !0;
      const _ = o.name("valid");
      p === void 0 && u === 1 ? y(_, () => o.if(_, () => o.break())) : u === 0 ? (o.let(_, !0), p !== void 0 && o.if((0, e._)`${c}.length > 0`, f)) : (o.let(_, !1), f()), s.result(_, () => s.reset());
      function f() {
        const v = o.name("_valid"), S = o.let("count", 0);
        y(v, () => o.if(v, () => d(S)));
      }
      function y(v, S) {
        o.forRange("i", 0, b, (g) => {
          s.subschema({
            keyword: "contains",
            dataProp: g,
            dataPropType: t.Type.Num,
            compositeRule: !0
          }, v), S();
        });
      }
      function d(v) {
        o.code((0, e._)`${v}++`), p === void 0 ? o.if((0, e._)`${v} >= ${u}`, () => o.assign(_, !0).break()) : (o.if((0, e._)`${v} > ${p}`, () => o.assign(_, !1).break()), u === 1 ? o.assign(_, !0) : o.if((0, e._)`${v} >= ${u}`, () => o.assign(_, !0)));
      }
    }
  };
  return Bn.default = n, Bn;
}
var Mo = {}, Fd;
function wO() {
  return Fd || (Fd = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const t = oe(), r = ue(), n = Ue();
    e.error = {
      message: ({ params: { property: c, depsCount: l, deps: u } }) => {
        const p = l === 1 ? "property" : "properties";
        return (0, t.str)`must have ${p} ${u} when property ${c} is present`;
      },
      params: ({ params: { property: c, depsCount: l, deps: u, missingProperty: p } }) => (0, t._)`{property: ${c},
    missingProperty: ${p},
    depsCount: ${l},
    deps: ${u}}`
      // TODO change to reference
    };
    const s = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(c) {
        const [l, u] = o(c);
        i(c, l), a(c, u);
      }
    };
    function o({ schema: c }) {
      const l = {}, u = {};
      for (const p in c) {
        if (p === "__proto__")
          continue;
        const h = Array.isArray(c[p]) ? l : u;
        h[p] = c[p];
      }
      return [l, u];
    }
    function i(c, l = c.schema) {
      const { gen: u, data: p, it: h } = c;
      if (Object.keys(l).length === 0)
        return;
      const m = u.let("missing");
      for (const b in l) {
        const _ = l[b];
        if (_.length === 0)
          continue;
        const f = (0, n.propertyInData)(u, p, b, h.opts.ownProperties);
        c.setParams({
          property: b,
          depsCount: _.length,
          deps: _.join(", ")
        }), h.allErrors ? u.if(f, () => {
          for (const y of _)
            (0, n.checkReportMissingProp)(c, y);
        }) : (u.if((0, t._)`${f} && (${(0, n.checkMissingProp)(c, _, m)})`), (0, n.reportMissingProp)(c, m), u.else());
      }
    }
    e.validatePropertyDeps = i;
    function a(c, l = c.schema) {
      const { gen: u, data: p, keyword: h, it: m } = c, b = u.name("valid");
      for (const _ in l)
        (0, r.alwaysValidSchema)(m, l[_]) || (u.if(
          (0, n.propertyInData)(u, p, _, m.opts.ownProperties),
          () => {
            const f = c.subschema({ keyword: h, schemaProp: _ }, b);
            c.mergeValidEvaluated(f, b);
          },
          () => u.var(b, !0)
          // TODO var
        ), c.ok(b));
    }
    e.validateSchemaDeps = a, e.default = s;
  })(Mo)), Mo;
}
var Wn = {}, Ud;
function $O() {
  if (Ud) return Wn;
  Ud = 1, Object.defineProperty(Wn, "__esModule", { value: !0 });
  const e = oe(), t = ue(), n = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: s }) => (0, e._)`{propertyName: ${s.propertyName}}`
    },
    code(s) {
      const { gen: o, schema: i, data: a, it: c } = s;
      if ((0, t.alwaysValidSchema)(c, i))
        return;
      const l = o.name("valid");
      o.forIn("key", a, (u) => {
        s.setParams({ propertyName: u }), s.subschema({
          keyword: "propertyNames",
          data: u,
          dataTypes: ["string"],
          propertyName: u,
          compositeRule: !0
        }, l), o.if((0, e.not)(l), () => {
          s.error(!0), c.allErrors || o.break();
        });
      }), s.ok(l);
    }
  };
  return Wn.default = n, Wn;
}
var Kn = {}, Vd;
function wy() {
  if (Vd) return Kn;
  Vd = 1, Object.defineProperty(Kn, "__esModule", { value: !0 });
  const e = Ue(), t = oe(), r = ht(), n = ue(), o = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: i }) => (0, t._)`{additionalProperty: ${i.additionalProperty}}`
    },
    code(i) {
      const { gen: a, schema: c, parentSchema: l, data: u, errsCount: p, it: h } = i;
      if (!p)
        throw new Error("ajv implementation error");
      const { allErrors: m, opts: b } = h;
      if (h.props = !0, b.removeAdditional !== "all" && (0, n.alwaysValidSchema)(h, c))
        return;
      const _ = (0, e.allSchemaProperties)(l.properties), f = (0, e.allSchemaProperties)(l.patternProperties);
      y(), i.ok((0, t._)`${p} === ${r.default.errors}`);
      function y() {
        a.forIn("key", u, ($) => {
          !_.length && !f.length ? S($) : a.if(d($), () => S($));
        });
      }
      function d($) {
        let E;
        if (_.length > 8) {
          const I = (0, n.schemaRefOrVal)(h, l.properties, "properties");
          E = (0, e.isOwnProperty)(a, I, $);
        } else _.length ? E = (0, t.or)(..._.map((I) => (0, t._)`${$} === ${I}`)) : E = t.nil;
        return f.length && (E = (0, t.or)(E, ...f.map((I) => (0, t._)`${(0, e.usePattern)(i, I)}.test(${$})`))), (0, t.not)(E);
      }
      function v($) {
        a.code((0, t._)`delete ${u}[${$}]`);
      }
      function S($) {
        if (b.removeAdditional === "all" || b.removeAdditional && c === !1) {
          v($);
          return;
        }
        if (c === !1) {
          i.setParams({ additionalProperty: $ }), i.error(), m || a.break();
          return;
        }
        if (typeof c == "object" && !(0, n.alwaysValidSchema)(h, c)) {
          const E = a.name("valid");
          b.removeAdditional === "failing" ? (g($, E, !1), a.if((0, t.not)(E), () => {
            i.reset(), v($);
          })) : (g($, E), m || a.if((0, t.not)(E), () => a.break()));
        }
      }
      function g($, E, I) {
        const k = {
          keyword: "additionalProperties",
          dataProp: $,
          dataPropType: n.Type.Str
        };
        I === !1 && Object.assign(k, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), i.subschema(k, E);
      }
    }
  };
  return Kn.default = o, Kn;
}
var Hn = {}, zd;
function _O() {
  if (zd) return Hn;
  zd = 1, Object.defineProperty(Hn, "__esModule", { value: !0 });
  const e = Gs(), t = Ue(), r = ue(), n = wy(), s = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(o) {
      const { gen: i, schema: a, parentSchema: c, data: l, it: u } = o;
      u.opts.removeAdditional === "all" && c.additionalProperties === void 0 && n.default.code(new e.KeywordCxt(u, n.default, "additionalProperties"));
      const p = (0, t.allSchemaProperties)(a);
      for (const f of p)
        u.definedProperties.add(f);
      u.opts.unevaluated && p.length && u.props !== !0 && (u.props = r.mergeEvaluated.props(i, (0, r.toHash)(p), u.props));
      const h = p.filter((f) => !(0, r.alwaysValidSchema)(u, a[f]));
      if (h.length === 0)
        return;
      const m = i.name("valid");
      for (const f of h)
        b(f) ? _(f) : (i.if((0, t.propertyInData)(i, l, f, u.opts.ownProperties)), _(f), u.allErrors || i.else().var(m, !0), i.endIf()), o.it.definedProperties.add(f), o.ok(m);
      function b(f) {
        return u.opts.useDefaults && !u.compositeRule && a[f].default !== void 0;
      }
      function _(f) {
        o.subschema({
          keyword: "properties",
          schemaProp: f,
          dataProp: f
        }, m);
      }
    }
  };
  return Hn.default = s, Hn;
}
var Jn = {}, xd;
function bO() {
  if (xd) return Jn;
  xd = 1, Object.defineProperty(Jn, "__esModule", { value: !0 });
  const e = Ue(), t = oe(), r = ue(), n = ue(), s = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(o) {
      const { gen: i, schema: a, data: c, parentSchema: l, it: u } = o, { opts: p } = u, h = (0, e.allSchemaProperties)(a), m = h.filter((S) => (0, r.alwaysValidSchema)(u, a[S]));
      if (h.length === 0 || m.length === h.length && (!u.opts.unevaluated || u.props === !0))
        return;
      const b = p.strictSchema && !p.allowMatchingProperties && l.properties, _ = i.name("valid");
      u.props !== !0 && !(u.props instanceof t.Name) && (u.props = (0, n.evaluatedPropsToName)(i, u.props));
      const { props: f } = u;
      y();
      function y() {
        for (const S of h)
          b && d(S), u.allErrors ? v(S) : (i.var(_, !0), v(S), i.if(_));
      }
      function d(S) {
        for (const g in b)
          new RegExp(S).test(g) && (0, r.checkStrictMode)(u, `property ${g} matches pattern ${S} (use allowMatchingProperties)`);
      }
      function v(S) {
        i.forIn("key", c, (g) => {
          i.if((0, t._)`${(0, e.usePattern)(o, S)}.test(${g})`, () => {
            const $ = m.includes(S);
            $ || o.subschema({
              keyword: "patternProperties",
              schemaProp: S,
              dataProp: g,
              dataPropType: n.Type.Str
            }, _), u.opts.unevaluated && f !== !0 ? i.assign((0, t._)`${f}[${g}]`, !0) : !$ && !u.allErrors && i.if((0, t.not)(_), () => i.break());
          });
        });
      }
    }
  };
  return Jn.default = s, Jn;
}
var Xn = {}, Gd;
function SO() {
  if (Gd) return Xn;
  Gd = 1, Object.defineProperty(Xn, "__esModule", { value: !0 });
  const e = ue(), t = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(r) {
      const { gen: n, schema: s, it: o } = r;
      if ((0, e.alwaysValidSchema)(o, s)) {
        r.fail();
        return;
      }
      const i = n.name("valid");
      r.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, i), r.failResult(i, () => r.reset(), () => r.error());
    },
    error: { message: "must NOT be valid" }
  };
  return Xn.default = t, Xn;
}
var Yn = {}, Bd;
function EO() {
  if (Bd) return Yn;
  Bd = 1, Object.defineProperty(Yn, "__esModule", { value: !0 });
  const t = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: Ue().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return Yn.default = t, Yn;
}
var Qn = {}, Wd;
function RO() {
  if (Wd) return Qn;
  Wd = 1, Object.defineProperty(Qn, "__esModule", { value: !0 });
  const e = oe(), t = ue(), n = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: s }) => (0, e._)`{passingSchemas: ${s.passing}}`
    },
    code(s) {
      const { gen: o, schema: i, parentSchema: a, it: c } = s;
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      if (c.opts.discriminator && a.discriminator)
        return;
      const l = i, u = o.let("valid", !1), p = o.let("passing", null), h = o.name("_valid");
      s.setParams({ passing: p }), o.block(m), s.result(u, () => s.reset(), () => s.error(!0));
      function m() {
        l.forEach((b, _) => {
          let f;
          (0, t.alwaysValidSchema)(c, b) ? o.var(h, !0) : f = s.subschema({
            keyword: "oneOf",
            schemaProp: _,
            compositeRule: !0
          }, h), _ > 0 && o.if((0, e._)`${h} && ${u}`).assign(u, !1).assign(p, (0, e._)`[${p}, ${_}]`).else(), o.if(h, () => {
            o.assign(u, !0), o.assign(p, _), f && s.mergeEvaluated(f, e.Name);
          });
        });
      }
    }
  };
  return Qn.default = n, Qn;
}
var Zn = {}, Kd;
function PO() {
  if (Kd) return Zn;
  Kd = 1, Object.defineProperty(Zn, "__esModule", { value: !0 });
  const e = ue(), t = {
    keyword: "allOf",
    schemaType: "array",
    code(r) {
      const { gen: n, schema: s, it: o } = r;
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const i = n.name("valid");
      s.forEach((a, c) => {
        if ((0, e.alwaysValidSchema)(o, a))
          return;
        const l = r.subschema({ keyword: "allOf", schemaProp: c }, i);
        r.ok(i), r.mergeEvaluated(l);
      });
    }
  };
  return Zn.default = t, Zn;
}
var es = {}, Hd;
function OO() {
  if (Hd) return es;
  Hd = 1, Object.defineProperty(es, "__esModule", { value: !0 });
  const e = oe(), t = ue(), n = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: o }) => (0, e.str)`must match "${o.ifClause}" schema`,
      params: ({ params: o }) => (0, e._)`{failingKeyword: ${o.ifClause}}`
    },
    code(o) {
      const { gen: i, parentSchema: a, it: c } = o;
      a.then === void 0 && a.else === void 0 && (0, t.checkStrictMode)(c, '"if" without "then" and "else" is ignored');
      const l = s(c, "then"), u = s(c, "else");
      if (!l && !u)
        return;
      const p = i.let("valid", !0), h = i.name("_valid");
      if (m(), o.reset(), l && u) {
        const _ = i.let("ifClause");
        o.setParams({ ifClause: _ }), i.if(h, b("then", _), b("else", _));
      } else l ? i.if(h, b("then")) : i.if((0, e.not)(h), b("else"));
      o.pass(p, () => o.error(!0));
      function m() {
        const _ = o.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, h);
        o.mergeEvaluated(_);
      }
      function b(_, f) {
        return () => {
          const y = o.subschema({ keyword: _ }, h);
          i.assign(p, h), o.mergeValidEvaluated(y, p), f ? i.assign(f, (0, e._)`${_}`) : o.setParams({ ifClause: _ });
        };
      }
    }
  };
  function s(o, i) {
    const a = o.schema[i];
    return a !== void 0 && !(0, t.alwaysValidSchema)(o, a);
  }
  return es.default = n, es;
}
var ts = {}, Jd;
function TO() {
  if (Jd) return ts;
  Jd = 1, Object.defineProperty(ts, "__esModule", { value: !0 });
  const e = ue(), t = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: r, parentSchema: n, it: s }) {
      n.if === void 0 && (0, e.checkStrictMode)(s, `"${r}" without "if" is ignored`);
    }
  };
  return ts.default = t, ts;
}
var Xd;
function IO() {
  if (Xd) return zn;
  Xd = 1, Object.defineProperty(zn, "__esModule", { value: !0 });
  const e = gy(), t = yO(), r = vy(), n = gO(), s = vO(), o = wO(), i = $O(), a = wy(), c = _O(), l = bO(), u = SO(), p = EO(), h = RO(), m = PO(), b = OO(), _ = TO();
  function f(y = !1) {
    const d = [
      // any
      u.default,
      p.default,
      h.default,
      m.default,
      b.default,
      _.default,
      // object
      i.default,
      a.default,
      o.default,
      c.default,
      l.default
    ];
    return y ? d.push(t.default, n.default) : d.push(e.default, r.default), d.push(s.default), d;
  }
  return zn.default = f, zn;
}
var rs = {}, ns = {}, Yd;
function NO() {
  if (Yd) return ns;
  Yd = 1, Object.defineProperty(ns, "__esModule", { value: !0 });
  const e = oe(), r = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, e.str)`must match format "${n}"`,
      params: ({ schemaCode: n }) => (0, e._)`{format: ${n}}`
    },
    code(n, s) {
      const { gen: o, data: i, $data: a, schema: c, schemaCode: l, it: u } = n, { opts: p, errSchemaPath: h, schemaEnv: m, self: b } = u;
      if (!p.validateFormats)
        return;
      a ? _() : f();
      function _() {
        const y = o.scopeValue("formats", {
          ref: b.formats,
          code: p.code.formats
        }), d = o.const("fDef", (0, e._)`${y}[${l}]`), v = o.let("fType"), S = o.let("format");
        o.if((0, e._)`typeof ${d} == "object" && !(${d} instanceof RegExp)`, () => o.assign(v, (0, e._)`${d}.type || "string"`).assign(S, (0, e._)`${d}.validate`), () => o.assign(v, (0, e._)`"string"`).assign(S, d)), n.fail$data((0, e.or)(g(), $()));
        function g() {
          return p.strictSchema === !1 ? e.nil : (0, e._)`${l} && !${S}`;
        }
        function $() {
          const E = m.$async ? (0, e._)`(${d}.async ? await ${S}(${i}) : ${S}(${i}))` : (0, e._)`${S}(${i})`, I = (0, e._)`(typeof ${S} == "function" ? ${E} : ${S}.test(${i}))`;
          return (0, e._)`${S} && ${S} !== true && ${v} === ${s} && !${I}`;
        }
      }
      function f() {
        const y = b.formats[c];
        if (!y) {
          g();
          return;
        }
        if (y === !0)
          return;
        const [d, v, S] = $(y);
        d === s && n.pass(E());
        function g() {
          if (p.strictSchema === !1) {
            b.logger.warn(I());
            return;
          }
          throw new Error(I());
          function I() {
            return `unknown format "${c}" ignored in schema at path "${h}"`;
          }
        }
        function $(I) {
          const k = I instanceof RegExp ? (0, e.regexpCode)(I) : p.code.formats ? (0, e._)`${p.code.formats}${(0, e.getProperty)(c)}` : void 0, F = o.scopeValue("formats", { key: c, ref: I, code: k });
          return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, e._)`${F}.validate`] : ["string", I, F];
        }
        function E() {
          if (typeof y == "object" && !(y instanceof RegExp) && y.async) {
            if (!m.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${S}(${i})`;
          }
          return typeof v == "function" ? (0, e._)`${S}(${i})` : (0, e._)`${S}.test(${i})`;
        }
      }
    }
  };
  return ns.default = r, ns;
}
var Qd;
function AO() {
  if (Qd) return rs;
  Qd = 1, Object.defineProperty(rs, "__esModule", { value: !0 });
  const t = [NO().default];
  return rs.default = t, rs;
}
var St = {}, Zd;
function jO() {
  return Zd || (Zd = 1, Object.defineProperty(St, "__esModule", { value: !0 }), St.contentVocabulary = St.metadataVocabulary = void 0, St.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], St.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), St;
}
var ef;
function CO() {
  if (ef) return Pn;
  ef = 1, Object.defineProperty(Pn, "__esModule", { value: !0 });
  const e = nO(), t = mO(), r = IO(), n = AO(), s = jO(), o = [
    e.default,
    t.default,
    (0, r.default)(),
    n.default,
    s.metadataVocabulary,
    s.contentVocabulary
  ];
  return Pn.default = o, Pn;
}
var ss = {}, sr = {}, tf;
function DO() {
  if (tf) return sr;
  tf = 1, Object.defineProperty(sr, "__esModule", { value: !0 }), sr.DiscrError = void 0;
  var e;
  return (function(t) {
    t.Tag = "tag", t.Mapping = "mapping";
  })(e || (sr.DiscrError = e = {})), sr;
}
var rf;
function kO() {
  if (rf) return ss;
  rf = 1, Object.defineProperty(ss, "__esModule", { value: !0 });
  const e = oe(), t = DO(), r = dc(), n = Bs(), s = ue(), i = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: c } }) => a === t.DiscrError.Tag ? `tag "${c}" must be string` : `value of tag "${c}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: c, tagName: l } }) => (0, e._)`{error: ${a}, tag: ${l}, tagValue: ${c}}`
    },
    code(a) {
      const { gen: c, data: l, schema: u, parentSchema: p, it: h } = a, { oneOf: m } = p;
      if (!h.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const b = u.propertyName;
      if (typeof b != "string")
        throw new Error("discriminator: requires propertyName");
      if (u.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!m)
        throw new Error("discriminator: requires oneOf keyword");
      const _ = c.let("valid", !1), f = c.const("tag", (0, e._)`${l}${(0, e.getProperty)(b)}`);
      c.if((0, e._)`typeof ${f} == "string"`, () => y(), () => a.error(!1, { discrError: t.DiscrError.Tag, tag: f, tagName: b })), a.ok(_);
      function y() {
        const S = v();
        c.if(!1);
        for (const g in S)
          c.elseIf((0, e._)`${f} === ${g}`), c.assign(_, d(S[g]));
        c.else(), a.error(!1, { discrError: t.DiscrError.Mapping, tag: f, tagName: b }), c.endIf();
      }
      function d(S) {
        const g = c.name("valid"), $ = a.subschema({ keyword: "oneOf", schemaProp: S }, g);
        return a.mergeEvaluated($, e.Name), g;
      }
      function v() {
        var S;
        const g = {}, $ = I(p);
        let E = !0;
        for (let M = 0; M < m.length; M++) {
          let V = m[M];
          if (V?.$ref && !(0, s.schemaHasRulesButRef)(V, h.self.RULES)) {
            const L = V.$ref;
            if (V = r.resolveRef.call(h.self, h.schemaEnv.root, h.baseId, L), V instanceof r.SchemaEnv && (V = V.schema), V === void 0)
              throw new n.default(h.opts.uriResolver, h.baseId, L);
          }
          const z = (S = V?.properties) === null || S === void 0 ? void 0 : S[b];
          if (typeof z != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${b}"`);
          E = E && ($ || I(V)), k(z, M);
        }
        if (!E)
          throw new Error(`discriminator: "${b}" must be required`);
        return g;
        function I({ required: M }) {
          return Array.isArray(M) && M.includes(b);
        }
        function k(M, V) {
          if (M.const)
            F(M.const, V);
          else if (M.enum)
            for (const z of M.enum)
              F(z, V);
          else
            throw new Error(`discriminator: "properties/${b}" must have "const" or "enum"`);
        }
        function F(M, V) {
          if (typeof M != "string" || M in g)
            throw new Error(`discriminator: "${b}" values must be unique strings`);
          g[M] = V;
        }
      }
    }
  };
  return ss.default = i, ss;
}
const MO = "http://json-schema.org/draft-07/schema#", LO = "http://json-schema.org/draft-07/schema#", qO = "Core schema meta-schema", FO = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, UO = ["object", "boolean"], VO = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, zO = {
  $schema: MO,
  $id: LO,
  title: qO,
  definitions: FO,
  type: UO,
  properties: VO,
  default: !0
};
var nf;
function xO() {
  return nf || (nf = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
    const r = eO(), n = CO(), s = kO(), o = zO, i = ["/properties"], a = "http://json-schema.org/draft-07/schema";
    class c extends r.default {
      _addVocabularies() {
        super._addVocabularies(), n.default.forEach((b) => this.addVocabulary(b)), this.opts.discriminator && this.addKeyword(s.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const b = this.opts.$data ? this.$dataMetaSchema(o, i) : o;
        this.addMetaSchema(b, a, !1), this.refs["http://json-schema.org/schema"] = a;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
      }
    }
    t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
    var l = Gs();
    Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
      return l.KeywordCxt;
    } });
    var u = oe();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return u._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return u.str;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return u.stringify;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return u.nil;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return u.Name;
    } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
      return u.CodeGen;
    } });
    var p = lc();
    Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
      return p.default;
    } });
    var h = Bs();
    Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
      return h.default;
    } });
  })(_n, _n.exports)), _n.exports;
}
var sf;
function GO() {
  return sf || (sf = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
    const t = xO(), r = oe(), n = r.operators, s = {
      formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
      formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
      formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
    }, o = {
      message: ({ keyword: a, schemaCode: c }) => (0, r.str)`should be ${s[a].okStr} ${c}`,
      params: ({ keyword: a, schemaCode: c }) => (0, r._)`{comparison: ${s[a].okStr}, limit: ${c}}`
    };
    e.formatLimitDefinition = {
      keyword: Object.keys(s),
      type: "string",
      schemaType: "string",
      $data: !0,
      error: o,
      code(a) {
        const { gen: c, data: l, schemaCode: u, keyword: p, it: h } = a, { opts: m, self: b } = h;
        if (!m.validateFormats)
          return;
        const _ = new t.KeywordCxt(h, b.RULES.all.format.definition, "format");
        _.$data ? f() : y();
        function f() {
          const v = c.scopeValue("formats", {
            ref: b.formats,
            code: m.code.formats
          }), S = c.const("fmt", (0, r._)`${v}[${_.schemaCode}]`);
          a.fail$data((0, r.or)((0, r._)`typeof ${S} != "object"`, (0, r._)`${S} instanceof RegExp`, (0, r._)`typeof ${S}.compare != "function"`, d(S)));
        }
        function y() {
          const v = _.schema, S = b.formats[v];
          if (!S || S === !0)
            return;
          if (typeof S != "object" || S instanceof RegExp || typeof S.compare != "function")
            throw new Error(`"${p}": format "${v}" does not define "compare" function`);
          const g = c.scopeValue("formats", {
            key: v,
            ref: S,
            code: m.code.formats ? (0, r._)`${m.code.formats}${(0, r.getProperty)(v)}` : void 0
          });
          a.fail$data(d(g));
        }
        function d(v) {
          return (0, r._)`${v}.compare(${l}, ${u}) ${s[p].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    const i = (a) => (a.addKeyword(e.formatLimitDefinition), a);
    e.default = i;
  })(Io)), Io;
}
var of;
function BO() {
  return of || (of = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", { value: !0 });
    const r = U1(), n = GO(), s = oe(), o = new s.Name("fullFormats"), i = new s.Name("fastFormats"), a = (l, u = { keywords: !0 }) => {
      if (Array.isArray(u))
        return c(l, u, r.fullFormats, o), l;
      const [p, h] = u.mode === "fast" ? [r.fastFormats, i] : [r.fullFormats, o], m = u.formats || r.formatNames;
      return c(l, m, p, h), u.keywords && (0, n.default)(l), l;
    };
    a.get = (l, u = "full") => {
      const h = (u === "fast" ? r.fastFormats : r.fullFormats)[l];
      if (!h)
        throw new Error(`Unknown format "${l}"`);
      return h;
    };
    function c(l, u, p, h) {
      var m, b;
      (m = (b = l.opts.code).formats) !== null && m !== void 0 || (b.formats = (0, s._)`require("ajv-formats/dist/formats").${h}`);
      for (const _ of u)
        l.addFormat(_, p[_]);
    }
    e.exports = t = a, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = a;
  })($n, $n.exports)), $n.exports;
}
var WO = BO();
const KO = /* @__PURE__ */ Ts(WO), HO = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), o = Object.getOwnPropertyDescriptor(t, r);
  !JO(s, o) && n || Object.defineProperty(e, r, o);
}, JO = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, XO = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, YO = (e, t) => `/* Wrapped ${e}*/
${t}`, QO = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), ZO = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), eT = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = YO.bind(null, n, t.toString());
  Object.defineProperty(s, "name", ZO);
  const { writable: o, enumerable: i, configurable: a } = QO;
  Object.defineProperty(e, "toString", { value: s, writable: o, enumerable: i, configurable: a });
};
function tT(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    HO(e, t, s, r);
  return XO(e, t), eT(e, t, n), e;
}
const af = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: o = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !o)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let i, a, c;
  const l = function(...u) {
    const p = this, h = () => {
      i = void 0, a && (clearTimeout(a), a = void 0), o && (c = e.apply(p, u));
    }, m = () => {
      a = void 0, i && (clearTimeout(i), i = void 0), o && (c = e.apply(p, u));
    }, b = s && !i;
    return clearTimeout(i), i = setTimeout(h, r), n > 0 && n !== Number.POSITIVE_INFINITY && !a && (a = setTimeout(m, n)), b && (c = e.apply(p, u)), c;
  };
  return tT(l, e), l.cancel = () => {
    i && (clearTimeout(i), i = void 0), a && (clearTimeout(a), a = void 0);
  }, l;
};
var os = { exports: {} }, Lo, cf;
function Ws() {
  if (cf) return Lo;
  cf = 1;
  const e = "2.0.0", t = 256, r = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, n = 16, s = t - 6;
  return Lo = {
    MAX_LENGTH: t,
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: s,
    MAX_SAFE_INTEGER: r,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: e,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, Lo;
}
var qo, uf;
function Ks() {
  return uf || (uf = 1, qo = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...t) => console.error("SEMVER", ...t) : () => {
  }), qo;
}
var lf;
function pr() {
  return lf || (lf = 1, (function(e, t) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: r,
      MAX_SAFE_BUILD_LENGTH: n,
      MAX_LENGTH: s
    } = Ws(), o = Ks();
    t = e.exports = {};
    const i = t.re = [], a = t.safeRe = [], c = t.src = [], l = t.safeSrc = [], u = t.t = {};
    let p = 0;
    const h = "[a-zA-Z0-9-]", m = [
      ["\\s", 1],
      ["\\d", s],
      [h, n]
    ], b = (f) => {
      for (const [y, d] of m)
        f = f.split(`${y}*`).join(`${y}{0,${d}}`).split(`${y}+`).join(`${y}{1,${d}}`);
      return f;
    }, _ = (f, y, d) => {
      const v = b(y), S = p++;
      o(f, S, y), u[f] = S, c[S] = y, l[S] = v, i[S] = new RegExp(y, d ? "g" : void 0), a[S] = new RegExp(v, d ? "g" : void 0);
    };
    _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), _("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${h}+`), _("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), _("FULL", `^${c[u.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), _("LOOSE", `^${c[u.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), _("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), _("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", c[u.COERCE], !0), _("COERCERTLFULL", c[u.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(os, os.exports)), os.exports;
}
var Fo, df;
function hc() {
  if (df) return Fo;
  df = 1;
  const e = Object.freeze({ loose: !0 }), t = Object.freeze({});
  return Fo = (n) => n ? typeof n != "object" ? e : n : t, Fo;
}
var Uo, ff;
function $y() {
  if (ff) return Uo;
  ff = 1;
  const e = /^[0-9]+$/, t = (n, s) => {
    if (typeof n == "number" && typeof s == "number")
      return n === s ? 0 : n < s ? -1 : 1;
    const o = e.test(n), i = e.test(s);
    return o && i && (n = +n, s = +s), n === s ? 0 : o && !i ? -1 : i && !o ? 1 : n < s ? -1 : 1;
  };
  return Uo = {
    compareIdentifiers: t,
    rcompareIdentifiers: (n, s) => t(s, n)
  }, Uo;
}
var Vo, hf;
function Pe() {
  if (hf) return Vo;
  hf = 1;
  const e = Ks(), { MAX_LENGTH: t, MAX_SAFE_INTEGER: r } = Ws(), { safeRe: n, t: s } = pr(), o = hc(), { compareIdentifiers: i } = $y();
  class a {
    constructor(l, u) {
      if (u = o(u), l instanceof a) {
        if (l.loose === !!u.loose && l.includePrerelease === !!u.includePrerelease)
          return l;
        l = l.version;
      } else if (typeof l != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof l}".`);
      if (l.length > t)
        throw new TypeError(
          `version is longer than ${t} characters`
        );
      e("SemVer", l, u), this.options = u, this.loose = !!u.loose, this.includePrerelease = !!u.includePrerelease;
      const p = l.trim().match(u.loose ? n[s.LOOSE] : n[s.FULL]);
      if (!p)
        throw new TypeError(`Invalid Version: ${l}`);
      if (this.raw = l, this.major = +p[1], this.minor = +p[2], this.patch = +p[3], this.major > r || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > r || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > r || this.patch < 0)
        throw new TypeError("Invalid patch version");
      p[4] ? this.prerelease = p[4].split(".").map((h) => {
        if (/^[0-9]+$/.test(h)) {
          const m = +h;
          if (m >= 0 && m < r)
            return m;
        }
        return h;
      }) : this.prerelease = [], this.build = p[5] ? p[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(l) {
      if (e("SemVer.compare", this.version, this.options, l), !(l instanceof a)) {
        if (typeof l == "string" && l === this.version)
          return 0;
        l = new a(l, this.options);
      }
      return l.version === this.version ? 0 : this.compareMain(l) || this.comparePre(l);
    }
    compareMain(l) {
      return l instanceof a || (l = new a(l, this.options)), this.major < l.major ? -1 : this.major > l.major ? 1 : this.minor < l.minor ? -1 : this.minor > l.minor ? 1 : this.patch < l.patch ? -1 : this.patch > l.patch ? 1 : 0;
    }
    comparePre(l) {
      if (l instanceof a || (l = new a(l, this.options)), this.prerelease.length && !l.prerelease.length)
        return -1;
      if (!this.prerelease.length && l.prerelease.length)
        return 1;
      if (!this.prerelease.length && !l.prerelease.length)
        return 0;
      let u = 0;
      do {
        const p = this.prerelease[u], h = l.prerelease[u];
        if (e("prerelease compare", u, p, h), p === void 0 && h === void 0)
          return 0;
        if (h === void 0)
          return 1;
        if (p === void 0)
          return -1;
        if (p === h)
          continue;
        return i(p, h);
      } while (++u);
    }
    compareBuild(l) {
      l instanceof a || (l = new a(l, this.options));
      let u = 0;
      do {
        const p = this.build[u], h = l.build[u];
        if (e("build compare", u, p, h), p === void 0 && h === void 0)
          return 0;
        if (h === void 0)
          return 1;
        if (p === void 0)
          return -1;
        if (p === h)
          continue;
        return i(p, h);
      } while (++u);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(l, u, p) {
      if (l.startsWith("pre")) {
        if (!u && p === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (u) {
          const h = `-${u}`.match(this.options.loose ? n[s.PRERELEASELOOSE] : n[s.PRERELEASE]);
          if (!h || h[1] !== u)
            throw new Error(`invalid identifier: ${u}`);
        }
      }
      switch (l) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", u, p);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", u, p);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", u, p), this.inc("pre", u, p);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", u, p), this.inc("pre", u, p);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const h = Number(p) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [h];
          else {
            let m = this.prerelease.length;
            for (; --m >= 0; )
              typeof this.prerelease[m] == "number" && (this.prerelease[m]++, m = -2);
            if (m === -1) {
              if (u === this.prerelease.join(".") && p === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(h);
            }
          }
          if (u) {
            let m = [u, h];
            p === !1 && (m = [u]), i(this.prerelease[0], u) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = m) : this.prerelease = m;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${l}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return Vo = a, Vo;
}
var zo, pf;
function Jt() {
  if (pf) return zo;
  pf = 1;
  const e = Pe();
  return zo = (r, n, s = !1) => {
    if (r instanceof e)
      return r;
    try {
      return new e(r, n);
    } catch (o) {
      if (!s)
        return null;
      throw o;
    }
  }, zo;
}
var xo, mf;
function rT() {
  if (mf) return xo;
  mf = 1;
  const e = Jt();
  return xo = (r, n) => {
    const s = e(r, n);
    return s ? s.version : null;
  }, xo;
}
var Go, yf;
function nT() {
  if (yf) return Go;
  yf = 1;
  const e = Jt();
  return Go = (r, n) => {
    const s = e(r.trim().replace(/^[=v]+/, ""), n);
    return s ? s.version : null;
  }, Go;
}
var Bo, gf;
function sT() {
  if (gf) return Bo;
  gf = 1;
  const e = Pe();
  return Bo = (r, n, s, o, i) => {
    typeof s == "string" && (i = o, o = s, s = void 0);
    try {
      return new e(
        r instanceof e ? r.version : r,
        s
      ).inc(n, o, i).version;
    } catch {
      return null;
    }
  }, Bo;
}
var Wo, vf;
function oT() {
  if (vf) return Wo;
  vf = 1;
  const e = Jt();
  return Wo = (r, n) => {
    const s = e(r, null, !0), o = e(n, null, !0), i = s.compare(o);
    if (i === 0)
      return null;
    const a = i > 0, c = a ? s : o, l = a ? o : s, u = !!c.prerelease.length;
    if (!!l.prerelease.length && !u) {
      if (!l.patch && !l.minor)
        return "major";
      if (l.compareMain(c) === 0)
        return l.minor && !l.patch ? "minor" : "patch";
    }
    const h = u ? "pre" : "";
    return s.major !== o.major ? h + "major" : s.minor !== o.minor ? h + "minor" : s.patch !== o.patch ? h + "patch" : "prerelease";
  }, Wo;
}
var Ko, wf;
function iT() {
  if (wf) return Ko;
  wf = 1;
  const e = Pe();
  return Ko = (r, n) => new e(r, n).major, Ko;
}
var Ho, $f;
function aT() {
  if ($f) return Ho;
  $f = 1;
  const e = Pe();
  return Ho = (r, n) => new e(r, n).minor, Ho;
}
var Jo, _f;
function cT() {
  if (_f) return Jo;
  _f = 1;
  const e = Pe();
  return Jo = (r, n) => new e(r, n).patch, Jo;
}
var Xo, bf;
function uT() {
  if (bf) return Xo;
  bf = 1;
  const e = Jt();
  return Xo = (r, n) => {
    const s = e(r, n);
    return s && s.prerelease.length ? s.prerelease : null;
  }, Xo;
}
var Yo, Sf;
function Ve() {
  if (Sf) return Yo;
  Sf = 1;
  const e = Pe();
  return Yo = (r, n, s) => new e(r, s).compare(new e(n, s)), Yo;
}
var Qo, Ef;
function lT() {
  if (Ef) return Qo;
  Ef = 1;
  const e = Ve();
  return Qo = (r, n, s) => e(n, r, s), Qo;
}
var Zo, Rf;
function dT() {
  if (Rf) return Zo;
  Rf = 1;
  const e = Ve();
  return Zo = (r, n) => e(r, n, !0), Zo;
}
var ei, Pf;
function pc() {
  if (Pf) return ei;
  Pf = 1;
  const e = Pe();
  return ei = (r, n, s) => {
    const o = new e(r, s), i = new e(n, s);
    return o.compare(i) || o.compareBuild(i);
  }, ei;
}
var ti, Of;
function fT() {
  if (Of) return ti;
  Of = 1;
  const e = pc();
  return ti = (r, n) => r.sort((s, o) => e(s, o, n)), ti;
}
var ri, Tf;
function hT() {
  if (Tf) return ri;
  Tf = 1;
  const e = pc();
  return ri = (r, n) => r.sort((s, o) => e(o, s, n)), ri;
}
var ni, If;
function Hs() {
  if (If) return ni;
  If = 1;
  const e = Ve();
  return ni = (r, n, s) => e(r, n, s) > 0, ni;
}
var si, Nf;
function mc() {
  if (Nf) return si;
  Nf = 1;
  const e = Ve();
  return si = (r, n, s) => e(r, n, s) < 0, si;
}
var oi, Af;
function _y() {
  if (Af) return oi;
  Af = 1;
  const e = Ve();
  return oi = (r, n, s) => e(r, n, s) === 0, oi;
}
var ii, jf;
function by() {
  if (jf) return ii;
  jf = 1;
  const e = Ve();
  return ii = (r, n, s) => e(r, n, s) !== 0, ii;
}
var ai, Cf;
function yc() {
  if (Cf) return ai;
  Cf = 1;
  const e = Ve();
  return ai = (r, n, s) => e(r, n, s) >= 0, ai;
}
var ci, Df;
function gc() {
  if (Df) return ci;
  Df = 1;
  const e = Ve();
  return ci = (r, n, s) => e(r, n, s) <= 0, ci;
}
var ui, kf;
function Sy() {
  if (kf) return ui;
  kf = 1;
  const e = _y(), t = by(), r = Hs(), n = yc(), s = mc(), o = gc();
  return ui = (a, c, l, u) => {
    switch (c) {
      case "===":
        return typeof a == "object" && (a = a.version), typeof l == "object" && (l = l.version), a === l;
      case "!==":
        return typeof a == "object" && (a = a.version), typeof l == "object" && (l = l.version), a !== l;
      case "":
      case "=":
      case "==":
        return e(a, l, u);
      case "!=":
        return t(a, l, u);
      case ">":
        return r(a, l, u);
      case ">=":
        return n(a, l, u);
      case "<":
        return s(a, l, u);
      case "<=":
        return o(a, l, u);
      default:
        throw new TypeError(`Invalid operator: ${c}`);
    }
  }, ui;
}
var li, Mf;
function pT() {
  if (Mf) return li;
  Mf = 1;
  const e = Pe(), t = Jt(), { safeRe: r, t: n } = pr();
  return li = (o, i) => {
    if (o instanceof e)
      return o;
    if (typeof o == "number" && (o = String(o)), typeof o != "string")
      return null;
    i = i || {};
    let a = null;
    if (!i.rtl)
      a = o.match(i.includePrerelease ? r[n.COERCEFULL] : r[n.COERCE]);
    else {
      const m = i.includePrerelease ? r[n.COERCERTLFULL] : r[n.COERCERTL];
      let b;
      for (; (b = m.exec(o)) && (!a || a.index + a[0].length !== o.length); )
        (!a || b.index + b[0].length !== a.index + a[0].length) && (a = b), m.lastIndex = b.index + b[1].length + b[2].length;
      m.lastIndex = -1;
    }
    if (a === null)
      return null;
    const c = a[2], l = a[3] || "0", u = a[4] || "0", p = i.includePrerelease && a[5] ? `-${a[5]}` : "", h = i.includePrerelease && a[6] ? `+${a[6]}` : "";
    return t(`${c}.${l}.${u}${p}${h}`, i);
  }, li;
}
var di, Lf;
function mT() {
  if (Lf) return di;
  Lf = 1;
  class e {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(r) {
      const n = this.map.get(r);
      if (n !== void 0)
        return this.map.delete(r), this.map.set(r, n), n;
    }
    delete(r) {
      return this.map.delete(r);
    }
    set(r, n) {
      if (!this.delete(r) && n !== void 0) {
        if (this.map.size >= this.max) {
          const o = this.map.keys().next().value;
          this.delete(o);
        }
        this.map.set(r, n);
      }
      return this;
    }
  }
  return di = e, di;
}
var fi, qf;
function ze() {
  if (qf) return fi;
  qf = 1;
  const e = /\s+/g;
  class t {
    constructor(U, H) {
      if (H = s(H), U instanceof t)
        return U.loose === !!H.loose && U.includePrerelease === !!H.includePrerelease ? U : new t(U.raw, H);
      if (U instanceof o)
        return this.raw = U.value, this.set = [[U]], this.formatted = void 0, this;
      if (this.options = H, this.loose = !!H.loose, this.includePrerelease = !!H.includePrerelease, this.raw = U.trim().replace(e, " "), this.set = this.raw.split("||").map((K) => this.parseRange(K.trim())).filter((K) => K.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const K = this.set[0];
        if (this.set = this.set.filter((W) => !_(W[0])), this.set.length === 0)
          this.set = [K];
        else if (this.set.length > 1) {
          for (const W of this.set)
            if (W.length === 1 && f(W[0])) {
              this.set = [W];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let U = 0; U < this.set.length; U++) {
          U > 0 && (this.formatted += "||");
          const H = this.set[U];
          for (let K = 0; K < H.length; K++)
            K > 0 && (this.formatted += " "), this.formatted += H[K].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(U) {
      const K = ((this.options.includePrerelease && m) | (this.options.loose && b)) + ":" + U, W = n.get(K);
      if (W)
        return W;
      const X = this.options.loose, C = X ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
      U = U.replace(C, V(this.options.includePrerelease)), i("hyphen replace", U), U = U.replace(c[l.COMPARATORTRIM], u), i("comparator trim", U), U = U.replace(c[l.TILDETRIM], p), i("tilde trim", U), U = U.replace(c[l.CARETTRIM], h), i("caret trim", U);
      let O = U.split(" ").map((R) => d(R, this.options)).join(" ").split(/\s+/).map((R) => M(R, this.options));
      X && (O = O.filter((R) => (i("loose invalid filter", R, this.options), !!R.match(c[l.COMPARATORLOOSE])))), i("range list", O);
      const j = /* @__PURE__ */ new Map(), T = O.map((R) => new o(R, this.options));
      for (const R of T) {
        if (_(R))
          return [R];
        j.set(R.value, R);
      }
      j.size > 1 && j.has("") && j.delete("");
      const w = [...j.values()];
      return n.set(K, w), w;
    }
    intersects(U, H) {
      if (!(U instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((K) => y(K, H) && U.set.some((W) => y(W, H) && K.every((X) => W.every((C) => X.intersects(C, H)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(U) {
      if (!U)
        return !1;
      if (typeof U == "string")
        try {
          U = new a(U, this.options);
        } catch {
          return !1;
        }
      for (let H = 0; H < this.set.length; H++)
        if (z(this.set[H], U, this.options))
          return !0;
      return !1;
    }
  }
  fi = t;
  const r = mT(), n = new r(), s = hc(), o = Js(), i = Ks(), a = Pe(), {
    safeRe: c,
    t: l,
    comparatorTrimReplace: u,
    tildeTrimReplace: p,
    caretTrimReplace: h
  } = pr(), { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: b } = Ws(), _ = (L) => L.value === "<0.0.0-0", f = (L) => L.value === "", y = (L, U) => {
    let H = !0;
    const K = L.slice();
    let W = K.pop();
    for (; H && K.length; )
      H = K.every((X) => W.intersects(X, U)), W = K.pop();
    return H;
  }, d = (L, U) => (L = L.replace(c[l.BUILD], ""), i("comp", L, U), L = $(L, U), i("caret", L), L = S(L, U), i("tildes", L), L = I(L, U), i("xrange", L), L = F(L, U), i("stars", L), L), v = (L) => !L || L.toLowerCase() === "x" || L === "*", S = (L, U) => L.trim().split(/\s+/).map((H) => g(H, U)).join(" "), g = (L, U) => {
    const H = U.loose ? c[l.TILDELOOSE] : c[l.TILDE];
    return L.replace(H, (K, W, X, C, O) => {
      i("tilde", L, K, W, X, C, O);
      let j;
      return v(W) ? j = "" : v(X) ? j = `>=${W}.0.0 <${+W + 1}.0.0-0` : v(C) ? j = `>=${W}.${X}.0 <${W}.${+X + 1}.0-0` : O ? (i("replaceTilde pr", O), j = `>=${W}.${X}.${C}-${O} <${W}.${+X + 1}.0-0`) : j = `>=${W}.${X}.${C} <${W}.${+X + 1}.0-0`, i("tilde return", j), j;
    });
  }, $ = (L, U) => L.trim().split(/\s+/).map((H) => E(H, U)).join(" "), E = (L, U) => {
    i("caret", L, U);
    const H = U.loose ? c[l.CARETLOOSE] : c[l.CARET], K = U.includePrerelease ? "-0" : "";
    return L.replace(H, (W, X, C, O, j) => {
      i("caret", L, W, X, C, O, j);
      let T;
      return v(X) ? T = "" : v(C) ? T = `>=${X}.0.0${K} <${+X + 1}.0.0-0` : v(O) ? X === "0" ? T = `>=${X}.${C}.0${K} <${X}.${+C + 1}.0-0` : T = `>=${X}.${C}.0${K} <${+X + 1}.0.0-0` : j ? (i("replaceCaret pr", j), X === "0" ? C === "0" ? T = `>=${X}.${C}.${O}-${j} <${X}.${C}.${+O + 1}-0` : T = `>=${X}.${C}.${O}-${j} <${X}.${+C + 1}.0-0` : T = `>=${X}.${C}.${O}-${j} <${+X + 1}.0.0-0`) : (i("no pr"), X === "0" ? C === "0" ? T = `>=${X}.${C}.${O}${K} <${X}.${C}.${+O + 1}-0` : T = `>=${X}.${C}.${O}${K} <${X}.${+C + 1}.0-0` : T = `>=${X}.${C}.${O} <${+X + 1}.0.0-0`), i("caret return", T), T;
    });
  }, I = (L, U) => (i("replaceXRanges", L, U), L.split(/\s+/).map((H) => k(H, U)).join(" ")), k = (L, U) => {
    L = L.trim();
    const H = U.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
    return L.replace(H, (K, W, X, C, O, j) => {
      i("xRange", L, K, W, X, C, O, j);
      const T = v(X), w = T || v(C), R = w || v(O), A = R;
      return W === "=" && A && (W = ""), j = U.includePrerelease ? "-0" : "", T ? W === ">" || W === "<" ? K = "<0.0.0-0" : K = "*" : W && A ? (w && (C = 0), O = 0, W === ">" ? (W = ">=", w ? (X = +X + 1, C = 0, O = 0) : (C = +C + 1, O = 0)) : W === "<=" && (W = "<", w ? X = +X + 1 : C = +C + 1), W === "<" && (j = "-0"), K = `${W + X}.${C}.${O}${j}`) : w ? K = `>=${X}.0.0${j} <${+X + 1}.0.0-0` : R && (K = `>=${X}.${C}.0${j} <${X}.${+C + 1}.0-0`), i("xRange return", K), K;
    });
  }, F = (L, U) => (i("replaceStars", L, U), L.trim().replace(c[l.STAR], "")), M = (L, U) => (i("replaceGTE0", L, U), L.trim().replace(c[U.includePrerelease ? l.GTE0PRE : l.GTE0], "")), V = (L) => (U, H, K, W, X, C, O, j, T, w, R, A) => (v(K) ? H = "" : v(W) ? H = `>=${K}.0.0${L ? "-0" : ""}` : v(X) ? H = `>=${K}.${W}.0${L ? "-0" : ""}` : C ? H = `>=${H}` : H = `>=${H}${L ? "-0" : ""}`, v(T) ? j = "" : v(w) ? j = `<${+T + 1}.0.0-0` : v(R) ? j = `<${T}.${+w + 1}.0-0` : A ? j = `<=${T}.${w}.${R}-${A}` : L ? j = `<${T}.${w}.${+R + 1}-0` : j = `<=${j}`, `${H} ${j}`.trim()), z = (L, U, H) => {
    for (let K = 0; K < L.length; K++)
      if (!L[K].test(U))
        return !1;
    if (U.prerelease.length && !H.includePrerelease) {
      for (let K = 0; K < L.length; K++)
        if (i(L[K].semver), L[K].semver !== o.ANY && L[K].semver.prerelease.length > 0) {
          const W = L[K].semver;
          if (W.major === U.major && W.minor === U.minor && W.patch === U.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return fi;
}
var hi, Ff;
function Js() {
  if (Ff) return hi;
  Ff = 1;
  const e = /* @__PURE__ */ Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(u, p) {
      if (p = r(p), u instanceof t) {
        if (u.loose === !!p.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), i("comparator", u, p), this.options = p, this.loose = !!p.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, i("comp", this);
    }
    parse(u) {
      const p = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], h = u.match(p);
      if (!h)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new a(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (i("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new a(u, this.options);
        } catch {
          return !1;
        }
      return o(u, this.operator, this.semver, this.options);
    }
    intersects(u, p) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(u.value, p).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new c(this.value, p).test(u.semver) : (p = r(p), p.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !p.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || o(this.semver, "<", u.semver, p) && this.operator.startsWith(">") && u.operator.startsWith("<") || o(this.semver, ">", u.semver, p) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  hi = t;
  const r = hc(), { safeRe: n, t: s } = pr(), o = Sy(), i = Ks(), a = Pe(), c = ze();
  return hi;
}
var pi, Uf;
function Xs() {
  if (Uf) return pi;
  Uf = 1;
  const e = ze();
  return pi = (r, n, s) => {
    try {
      n = new e(n, s);
    } catch {
      return !1;
    }
    return n.test(r);
  }, pi;
}
var mi, Vf;
function yT() {
  if (Vf) return mi;
  Vf = 1;
  const e = ze();
  return mi = (r, n) => new e(r, n).set.map((s) => s.map((o) => o.value).join(" ").trim().split(" ")), mi;
}
var yi, zf;
function gT() {
  if (zf) return yi;
  zf = 1;
  const e = Pe(), t = ze();
  return yi = (n, s, o) => {
    let i = null, a = null, c = null;
    try {
      c = new t(s, o);
    } catch {
      return null;
    }
    return n.forEach((l) => {
      c.test(l) && (!i || a.compare(l) === -1) && (i = l, a = new e(i, o));
    }), i;
  }, yi;
}
var gi, xf;
function vT() {
  if (xf) return gi;
  xf = 1;
  const e = Pe(), t = ze();
  return gi = (n, s, o) => {
    let i = null, a = null, c = null;
    try {
      c = new t(s, o);
    } catch {
      return null;
    }
    return n.forEach((l) => {
      c.test(l) && (!i || a.compare(l) === 1) && (i = l, a = new e(i, o));
    }), i;
  }, gi;
}
var vi, Gf;
function wT() {
  if (Gf) return vi;
  Gf = 1;
  const e = Pe(), t = ze(), r = Hs();
  return vi = (s, o) => {
    s = new t(s, o);
    let i = new e("0.0.0");
    if (s.test(i) || (i = new e("0.0.0-0"), s.test(i)))
      return i;
    i = null;
    for (let a = 0; a < s.set.length; ++a) {
      const c = s.set[a];
      let l = null;
      c.forEach((u) => {
        const p = new e(u.semver.version);
        switch (u.operator) {
          case ">":
            p.prerelease.length === 0 ? p.patch++ : p.prerelease.push(0), p.raw = p.format();
          /* fallthrough */
          case "":
          case ">=":
            (!l || r(p, l)) && (l = p);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${u.operator}`);
        }
      }), l && (!i || r(i, l)) && (i = l);
    }
    return i && s.test(i) ? i : null;
  }, vi;
}
var wi, Bf;
function $T() {
  if (Bf) return wi;
  Bf = 1;
  const e = ze();
  return wi = (r, n) => {
    try {
      return new e(r, n).range || "*";
    } catch {
      return null;
    }
  }, wi;
}
var $i, Wf;
function vc() {
  if (Wf) return $i;
  Wf = 1;
  const e = Pe(), t = Js(), { ANY: r } = t, n = ze(), s = Xs(), o = Hs(), i = mc(), a = gc(), c = yc();
  return $i = (u, p, h, m) => {
    u = new e(u, m), p = new n(p, m);
    let b, _, f, y, d;
    switch (h) {
      case ">":
        b = o, _ = a, f = i, y = ">", d = ">=";
        break;
      case "<":
        b = i, _ = c, f = o, y = "<", d = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (s(u, p, m))
      return !1;
    for (let v = 0; v < p.set.length; ++v) {
      const S = p.set[v];
      let g = null, $ = null;
      if (S.forEach((E) => {
        E.semver === r && (E = new t(">=0.0.0")), g = g || E, $ = $ || E, b(E.semver, g.semver, m) ? g = E : f(E.semver, $.semver, m) && ($ = E);
      }), g.operator === y || g.operator === d || (!$.operator || $.operator === y) && _(u, $.semver))
        return !1;
      if ($.operator === d && f(u, $.semver))
        return !1;
    }
    return !0;
  }, $i;
}
var _i, Kf;
function _T() {
  if (Kf) return _i;
  Kf = 1;
  const e = vc();
  return _i = (r, n, s) => e(r, n, ">", s), _i;
}
var bi, Hf;
function bT() {
  if (Hf) return bi;
  Hf = 1;
  const e = vc();
  return bi = (r, n, s) => e(r, n, "<", s), bi;
}
var Si, Jf;
function ST() {
  if (Jf) return Si;
  Jf = 1;
  const e = ze();
  return Si = (r, n, s) => (r = new e(r, s), n = new e(n, s), r.intersects(n, s)), Si;
}
var Ei, Xf;
function ET() {
  if (Xf) return Ei;
  Xf = 1;
  const e = Xs(), t = Ve();
  return Ei = (r, n, s) => {
    const o = [];
    let i = null, a = null;
    const c = r.sort((h, m) => t(h, m, s));
    for (const h of c)
      e(h, n, s) ? (a = h, i || (i = h)) : (a && o.push([i, a]), a = null, i = null);
    i && o.push([i, null]);
    const l = [];
    for (const [h, m] of o)
      h === m ? l.push(h) : !m && h === c[0] ? l.push("*") : m ? h === c[0] ? l.push(`<=${m}`) : l.push(`${h} - ${m}`) : l.push(`>=${h}`);
    const u = l.join(" || "), p = typeof n.raw == "string" ? n.raw : String(n);
    return u.length < p.length ? u : n;
  }, Ei;
}
var Ri, Yf;
function RT() {
  if (Yf) return Ri;
  Yf = 1;
  const e = ze(), t = Js(), { ANY: r } = t, n = Xs(), s = Ve(), o = (p, h, m = {}) => {
    if (p === h)
      return !0;
    p = new e(p, m), h = new e(h, m);
    let b = !1;
    e: for (const _ of p.set) {
      for (const f of h.set) {
        const y = c(_, f, m);
        if (b = b || y !== null, y)
          continue e;
      }
      if (b)
        return !1;
    }
    return !0;
  }, i = [new t(">=0.0.0-0")], a = [new t(">=0.0.0")], c = (p, h, m) => {
    if (p === h)
      return !0;
    if (p.length === 1 && p[0].semver === r) {
      if (h.length === 1 && h[0].semver === r)
        return !0;
      m.includePrerelease ? p = i : p = a;
    }
    if (h.length === 1 && h[0].semver === r) {
      if (m.includePrerelease)
        return !0;
      h = a;
    }
    const b = /* @__PURE__ */ new Set();
    let _, f;
    for (const I of p)
      I.operator === ">" || I.operator === ">=" ? _ = l(_, I, m) : I.operator === "<" || I.operator === "<=" ? f = u(f, I, m) : b.add(I.semver);
    if (b.size > 1)
      return null;
    let y;
    if (_ && f) {
      if (y = s(_.semver, f.semver, m), y > 0)
        return null;
      if (y === 0 && (_.operator !== ">=" || f.operator !== "<="))
        return null;
    }
    for (const I of b) {
      if (_ && !n(I, String(_), m) || f && !n(I, String(f), m))
        return null;
      for (const k of h)
        if (!n(I, String(k), m))
          return !1;
      return !0;
    }
    let d, v, S, g, $ = f && !m.includePrerelease && f.semver.prerelease.length ? f.semver : !1, E = _ && !m.includePrerelease && _.semver.prerelease.length ? _.semver : !1;
    $ && $.prerelease.length === 1 && f.operator === "<" && $.prerelease[0] === 0 && ($ = !1);
    for (const I of h) {
      if (g = g || I.operator === ">" || I.operator === ">=", S = S || I.operator === "<" || I.operator === "<=", _) {
        if (E && I.semver.prerelease && I.semver.prerelease.length && I.semver.major === E.major && I.semver.minor === E.minor && I.semver.patch === E.patch && (E = !1), I.operator === ">" || I.operator === ">=") {
          if (d = l(_, I, m), d === I && d !== _)
            return !1;
        } else if (_.operator === ">=" && !n(_.semver, String(I), m))
          return !1;
      }
      if (f) {
        if ($ && I.semver.prerelease && I.semver.prerelease.length && I.semver.major === $.major && I.semver.minor === $.minor && I.semver.patch === $.patch && ($ = !1), I.operator === "<" || I.operator === "<=") {
          if (v = u(f, I, m), v === I && v !== f)
            return !1;
        } else if (f.operator === "<=" && !n(f.semver, String(I), m))
          return !1;
      }
      if (!I.operator && (f || _) && y !== 0)
        return !1;
    }
    return !(_ && S && !f && y !== 0 || f && g && !_ && y !== 0 || E || $);
  }, l = (p, h, m) => {
    if (!p)
      return h;
    const b = s(p.semver, h.semver, m);
    return b > 0 ? p : b < 0 || h.operator === ">" && p.operator === ">=" ? h : p;
  }, u = (p, h, m) => {
    if (!p)
      return h;
    const b = s(p.semver, h.semver, m);
    return b < 0 ? p : b > 0 || h.operator === "<" && p.operator === "<=" ? h : p;
  };
  return Ri = o, Ri;
}
var Pi, Qf;
function PT() {
  if (Qf) return Pi;
  Qf = 1;
  const e = pr(), t = Ws(), r = Pe(), n = $y(), s = Jt(), o = rT(), i = nT(), a = sT(), c = oT(), l = iT(), u = aT(), p = cT(), h = uT(), m = Ve(), b = lT(), _ = dT(), f = pc(), y = fT(), d = hT(), v = Hs(), S = mc(), g = _y(), $ = by(), E = yc(), I = gc(), k = Sy(), F = pT(), M = Js(), V = ze(), z = Xs(), L = yT(), U = gT(), H = vT(), K = wT(), W = $T(), X = vc(), C = _T(), O = bT(), j = ST(), T = ET(), w = RT();
  return Pi = {
    parse: s,
    valid: o,
    clean: i,
    inc: a,
    diff: c,
    major: l,
    minor: u,
    patch: p,
    prerelease: h,
    compare: m,
    rcompare: b,
    compareLoose: _,
    compareBuild: f,
    sort: y,
    rsort: d,
    gt: v,
    lt: S,
    eq: g,
    neq: $,
    gte: E,
    lte: I,
    cmp: k,
    coerce: F,
    Comparator: M,
    Range: V,
    satisfies: z,
    toComparators: L,
    maxSatisfying: U,
    minSatisfying: H,
    minVersion: K,
    validRange: W,
    outside: X,
    gtr: C,
    ltr: O,
    intersects: j,
    simplifyRange: T,
    subset: w,
    SemVer: r,
    re: e.re,
    src: e.src,
    tokens: e.t,
    SEMVER_SPEC_VERSION: t.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: t.RELEASE_TYPES,
    compareIdentifiers: n.compareIdentifiers,
    rcompareIdentifiers: n.rcompareIdentifiers
  }, Pi;
}
var OT = PT();
const Vt = /* @__PURE__ */ Ts(OT), TT = Object.prototype.toString, IT = "[object Uint8Array]", NT = "[object ArrayBuffer]";
function Ey(e, t, r) {
  return e ? e.constructor === t ? !0 : TT.call(e) === r : !1;
}
function Ry(e) {
  return Ey(e, Uint8Array, IT);
}
function AT(e) {
  return Ey(e, ArrayBuffer, NT);
}
function jT(e) {
  return Ry(e) || AT(e);
}
function CT(e) {
  if (!Ry(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function DT(e) {
  if (!jT(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Oi(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ??= e.reduce((s, o) => s + o.length, 0);
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    CT(s), r.set(s, n), n += s.length;
  return r;
}
const Zf = {
  utf8: new globalThis.TextDecoder("utf8")
};
function is(e, t = "utf8") {
  return DT(e), Zf[t] ??= new globalThis.TextDecoder(t), Zf[t].decode(e);
}
function kT(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const MT = new globalThis.TextEncoder();
function Ti(e) {
  return kT(e), MT.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const eh = "aes-256-cbc", Py = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), LT = (e) => typeof e == "string" && Py.has(e), tt = () => /* @__PURE__ */ Object.create(null), th = (e) => e !== void 0, Ii = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, ct = "__internal__", Ni = `${ct}.migrations.version`;
class qT {
  path;
  events;
  #r;
  #n;
  #e;
  #t;
  #s = {};
  #o = !1;
  #i;
  #c;
  #a;
  constructor(t = {}) {
    const r = this.#u(t);
    this.#t = r, this.#l(r), this.#f(r), this.#h(r), this.events = new EventTarget(), this.#n = r.encryptionKey, this.#e = r.encryptionAlgorithm ?? eh, this.path = this.#p(r), this.#m(r), r.watch && this._watch();
  }
  get(t, r) {
    if (this.#t.accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${ct} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (o, i) => {
      if (Ii(o, i), this.#t.accessPropertiesByDotNotation)
        br(n, o, i);
      else {
        if (o === "__proto__" || o === "constructor" || o === "prototype")
          return;
        n[o] = i;
      }
    };
    if (typeof t == "object") {
      const o = t;
      for (const [i, a] of Object.entries(o))
        s(i, a);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return this.#t.accessPropertiesByDotNotation ? yo(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    Ii(t, r);
    const n = this.#t.accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(n))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...n, r]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      th(this.#s[r]) && this.set(r, this.#s[r]);
  }
  delete(t) {
    const { store: r } = this;
    this.#t.accessPropertiesByDotNotation ? ZE(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = tt();
    for (const r of Object.keys(this.#s))
      th(this.#s[r]) && (Ii(r, this.#s[r]), this.#t.accessPropertiesByDotNotation ? br(t, r, this.#s[r]) : t[r] = this.#s[r]);
    this.store = t;
  }
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleValueChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((r) => !this._isReservedKeyPath(r)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    try {
      const t = ee.readFileSync(this.path, this.#n ? null : "utf8"), r = this._decryptData(t);
      return ((s) => {
        const o = this._deserialize(s);
        return this.#o || this._validate(o), Object.assign(tt(), o);
      })(r);
    } catch (t) {
      if (t?.code === "ENOENT")
        return this._ensureDirectory(), tt();
      if (this.#t.clearInvalidConfig) {
        const r = t;
        if (r.name === "SyntaxError" || r.message?.startsWith("Config schema violation:") || r.message === "Failed to decrypt config data.")
          return tt();
      }
      throw t;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !yo(t, ct))
      try {
        const r = ee.readFileSync(this.path, this.#n ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        yo(s, ct) && br(t, ct, vu(s, ct));
      } catch {
      }
    this.#o || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    this.#i && (this.#i.close(), this.#i = void 0), this.#c && (ee.unwatchFile(this.path), this.#c = !1), this.#a = void 0;
  }
  _decryptData(t) {
    const r = this.#n;
    if (!r)
      return typeof t == "string" ? t : is(t);
    const n = this.#e, s = n === "aes-256-gcm" ? 16 : 0, o = ":".codePointAt(0), i = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(o !== void 0 && i === o)) {
      if (n === "aes-256-cbc")
        return typeof t == "string" ? t : is(t);
      throw new Error("Failed to decrypt config data.");
    }
    const c = (m) => {
      if (s === 0)
        return { ciphertext: m };
      const b = m.length - s;
      if (b < 0)
        throw new Error("Invalid authentication tag length.");
      return {
        ciphertext: m.slice(0, b),
        authenticationTag: m.slice(b)
      };
    }, l = t.slice(0, 16), u = t.slice(17), p = typeof u == "string" ? Ti(u) : u, h = (m) => {
      const { ciphertext: b, authenticationTag: _ } = c(p), f = Qt.pbkdf2Sync(r, m, 1e4, 32, "sha512"), y = Qt.createDecipheriv(n, f, l);
      return _ && y.setAuthTag(_), is(Oi([y.update(b), y.final()]));
    };
    try {
      return h(l);
    } catch {
      try {
        return h(l.toString());
      } catch {
      }
    }
    if (n === "aes-256-cbc")
      return typeof t == "string" ? t : is(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const s = r, o = this.store;
      $c(o, s) || (r = o, t.call(this, o, s));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const s = () => {
      const o = n, i = t();
      $c(i, o) || (n = i, r.call(this, i, o));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _deserialize = (t) => JSON.parse(t);
  _serialize = (t) => JSON.stringify(t, void 0, "	");
  _validate(t) {
    if (!this.#r || this.#r(t) || !this.#r.errors)
      return;
    const n = this.#r.errors.map(({ instancePath: s, message: o = "" }) => `\`${s.slice(1)}\` ${o}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    ee.mkdirSync(Z.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    const n = this.#n;
    if (n) {
      const s = Qt.randomBytes(16), o = Qt.pbkdf2Sync(n, s, 1e4, 32, "sha512"), i = Qt.createCipheriv(this.#e, o, s), a = Oi([i.update(Ti(r)), i.final()]), c = [s, Ti(":"), a];
      this.#e === "aes-256-gcm" && c.push(i.getAuthTag()), r = Oi(c);
    }
    if (te.env.SNAP)
      ee.writeFileSync(this.path, r, { mode: this.#t.configFileMode });
    else
      try {
        oy(this.path, r, { mode: this.#t.configFileMode });
      } catch (s) {
        if (s?.code === "EXDEV") {
          ee.writeFileSync(this.path, r, { mode: this.#t.configFileMode });
          return;
        }
        throw s;
      }
  }
  _watch() {
    if (this._ensureDirectory(), ee.existsSync(this.path) || this._write(tt()), te.platform === "win32" || te.platform === "darwin") {
      this.#a ??= af(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 });
      const t = Z.dirname(this.path), r = Z.basename(this.path);
      this.#i = ee.watch(t, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof this.#a == "function" && this.#a();
      });
    } else
      this.#a ??= af(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 }), ee.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof this.#a == "function" && this.#a();
      }), this.#c = !0;
  }
  _migrate(t, r, n) {
    let s = this._get(Ni, "0.0.0");
    const o = Object.keys(t).filter((a) => this._shouldPerformMigration(a, s, r));
    let i = structuredClone(this.store);
    for (const a of o)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: a,
          finalVersion: r,
          versions: o
        });
        const c = t[a];
        c?.(this), this._set(Ni, a), s = a, i = structuredClone(this.store);
      } catch (c) {
        this.store = i;
        const l = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${l}`);
      }
    (this._isVersionInRangeFormat(s) || !Vt.eq(s, r)) && this._set(Ni, r);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [r, n] of Object.entries(t))
      if (this._isReservedKeyPath(r) || this._objectContainsReservedKey(n))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === ct || t.startsWith(`${ct}.`);
  }
  _isVersionInRangeFormat(t) {
    return Vt.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && Vt.satisfies(r, t) ? !1 : Vt.satisfies(n, t) : !(Vt.lte(t, r) || Vt.gt(t, n));
  }
  _get(t, r) {
    return vu(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    br(n, t, r), this.store = n;
  }
  #u(t) {
    const r = {
      configName: "config",
      fileExtension: "json",
      projectSuffix: "nodejs",
      clearInvalidConfig: !1,
      accessPropertiesByDotNotation: !0,
      configFileMode: 438,
      ...t
    };
    if (r.encryptionAlgorithm ??= eh, !LT(r.encryptionAlgorithm))
      throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...Py].join(", ")}`);
    if (!r.cwd) {
      if (!r.projectName)
        throw new Error("Please specify the `projectName` option.");
      r.cwd = nR(r.projectName, { suffix: r.projectSuffix }).config;
    }
    return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
  }
  #l(t) {
    if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
      return;
    if (t.schema && typeof t.schema != "object")
      throw new TypeError("The `schema` option must be an object.");
    const r = KO.default, n = new F1.Ajv2020({
      allErrors: !0,
      useDefaults: !0,
      ...t.ajvOptions
    });
    r(n);
    const s = {
      ...t.rootSchema,
      type: "object",
      properties: t.schema
    };
    this.#r = n.compile(s), this.#d(t.schema);
  }
  #d(t) {
    const r = Object.entries(t ?? {});
    for (const [n, s] of r) {
      if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
        continue;
      const { default: o } = s;
      o !== void 0 && (this.#s[n] = o);
    }
  }
  #f(t) {
    t.defaults && Object.assign(this.#s, t.defaults);
  }
  #h(t) {
    t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
  }
  #p(t) {
    const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
    return Z.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
  }
  #m(t) {
    if (t.migrations) {
      this.#y(t), this._validate(this.store);
      return;
    }
    const r = this.store, n = Object.assign(tt(), t.defaults ?? {}, r);
    this._validate(n);
    try {
      Sc.deepEqual(r, n);
    } catch {
      this.store = n;
    }
  }
  #y(t) {
    const { migrations: r, projectVersion: n } = t;
    if (r) {
      if (!n)
        throw new Error("Please specify the `projectVersion` option.");
      this.#o = !0;
      try {
        const s = this.store, o = Object.assign(tt(), t.defaults ?? {}, s);
        try {
          Sc.deepEqual(s, o);
        } catch {
          this._write(o);
        }
        this._migrate(r, n, t.beforeEachMigration);
      } finally {
        this.#o = !1;
      }
    }
  }
}
const { app: ds, ipcMain: wa, shell: FT } = _a;
let rh = !1;
const nh = () => {
  if (!wa || !ds)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: ds.getPath("userData"),
    appVersion: ds.getVersion()
  };
  return rh || (wa.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), rh = !0), e;
};
class Oy extends qT {
  constructor(t) {
    let r, n;
    if (te.type === "renderer") {
      const s = _a.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else wa && ds && ({ defaultCwd: r, appVersion: n } = nh());
    t = {
      name: "config",
      ...t
    }, t.projectVersion ||= n, t.cwd ? t.cwd = Z.isAbsolute(t.cwd) ? t.cwd : Z.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    nh();
  }
  async openInEditor() {
    const t = await FT.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const UT = {
  theme: {
    type: "string",
    enum: ["dark", "light", "system"],
    default: "system"
  },
  language: {
    type: "string",
    enum: ["en", "es"],
    default: "en"
  },
  dontShowRestoreWarning: {
    type: "boolean",
    default: !1
  },
  fontSize: {
    type: "string",
    enum: ["small", "medium", "large"],
    default: "medium"
  },
  hasSeenOnboarding: {
    type: "boolean",
    default: !1
  }
};
class VT {
  store;
  constructor() {
    this.store = new Oy({ schema: UT }), console.log("Settings file path:", this.store.path);
  }
  get(t) {
    return this.store.get(t);
  }
  set(t, r) {
    this.store.set(t, r);
  }
}
var Ai, sh;
function zT() {
  if (sh) return Ai;
  sh = 1;
  const e = lt, t = ge;
  Ai = {
    findAndReadPackageJson: r,
    tryReadJsonAt: n
  };
  function r() {
    return n(i()) || n(o()) || n(process.resourcesPath, "app.asar") || n(process.resourcesPath, "app") || n(process.cwd()) || { name: void 0, version: void 0 };
  }
  function n(...a) {
    if (a[0])
      try {
        const c = t.join(...a), l = s("package.json", c);
        if (!l)
          return;
        const u = JSON.parse(e.readFileSync(l, "utf8")), p = u?.productName || u?.name;
        return !p || p.toLowerCase() === "electron" ? void 0 : p ? { name: p, version: u?.version } : void 0;
      } catch {
        return;
      }
  }
  function s(a, c) {
    let l = c;
    for (; ; ) {
      const u = t.parse(l), p = u.root, h = u.dir;
      if (e.existsSync(t.join(l, a)))
        return t.resolve(t.join(l, a));
      if (l === p)
        return null;
      l = h;
    }
  }
  function o() {
    const a = process.argv.filter((l) => l.indexOf("--user-data-dir=") === 0);
    return a.length === 0 || typeof a[0] != "string" ? null : a[0].replace("--user-data-dir=", "");
  }
  function i() {
    try {
      return require.main?.filename;
    } catch {
      return;
    }
  }
  return Ai;
}
var ji, oh;
function xT() {
  if (oh) return ji;
  oh = 1;
  const e = Lh, t = Ps, r = ge, n = zT();
  class s {
    appName = void 0;
    appPackageJson = void 0;
    platform = process.platform;
    getAppLogPath(i = this.getAppName()) {
      return this.platform === "darwin" ? r.join(this.getSystemPathHome(), "Library/Logs", i) : r.join(this.getAppUserDataPath(i), "logs");
    }
    getAppName() {
      const i = this.appName || this.getAppPackageJson()?.name;
      if (!i)
        throw new Error(
          "electron-log can't determine the app name. It tried these methods:\n1. Use `electron.app.name`\n2. Use productName or name from the nearest package.json`\nYou can also set it through log.transports.file.setAppName()"
        );
      return i;
    }
    /**
     * @private
     * @returns {undefined}
     */
    getAppPackageJson() {
      return typeof this.appPackageJson != "object" && (this.appPackageJson = n.findAndReadPackageJson()), this.appPackageJson;
    }
    getAppUserDataPath(i = this.getAppName()) {
      return i ? r.join(this.getSystemPathAppData(), i) : void 0;
    }
    getAppVersion() {
      return this.getAppPackageJson()?.version;
    }
    getElectronLogPath() {
      return this.getAppLogPath();
    }
    getMacOsVersion() {
      const i = Number(t.release().split(".")[0]);
      return i <= 19 ? `10.${i - 4}` : i - 9;
    }
    /**
     * @protected
     * @returns {string}
     */
    getOsVersion() {
      let i = t.type().replace("_", " "), a = t.release();
      return i === "Darwin" && (i = "macOS", a = this.getMacOsVersion()), `${i} ${a}`;
    }
    /**
     * @return {PathVariables}
     */
    getPathVariables() {
      const i = this.getAppName(), a = this.getAppVersion(), c = this;
      return {
        appData: this.getSystemPathAppData(),
        appName: i,
        appVersion: a,
        get electronDefaultDir() {
          return c.getElectronLogPath();
        },
        home: this.getSystemPathHome(),
        libraryDefaultDir: this.getAppLogPath(i),
        libraryTemplate: this.getAppLogPath("{appName}"),
        temp: this.getSystemPathTemp(),
        userData: this.getAppUserDataPath(i)
      };
    }
    getSystemPathAppData() {
      const i = this.getSystemPathHome();
      switch (this.platform) {
        case "darwin":
          return r.join(i, "Library/Application Support");
        case "win32":
          return process.env.APPDATA || r.join(i, "AppData/Roaming");
        default:
          return process.env.XDG_CONFIG_HOME || r.join(i, ".config");
      }
    }
    getSystemPathHome() {
      return t.homedir?.() || process.env.HOME;
    }
    getSystemPathTemp() {
      return t.tmpdir();
    }
    getVersions() {
      return {
        app: `${this.getAppName()} ${this.getAppVersion()}`,
        electron: void 0,
        os: this.getOsVersion()
      };
    }
    isDev() {
      return process.env.NODE_ENV === "development" || process.env.ELECTRON_IS_DEV === "1";
    }
    isElectron() {
      return !!process.versions.electron;
    }
    onAppEvent(i, a) {
    }
    onAppReady(i) {
      i();
    }
    onEveryWebContentsEvent(i, a) {
    }
    /**
     * Listen to async messages sent from opposite process
     * @param {string} channel
     * @param {function} listener
     */
    onIpc(i, a) {
    }
    onIpcInvoke(i, a) {
    }
    /**
     * @param {string} url
     * @param {Function} [logFunction]
     */
    openUrl(i, a = console.error) {
      const l = { darwin: "open", win32: "start", linux: "xdg-open" }[process.platform] || "xdg-open";
      e.exec(`${l} ${i}`, {}, (u) => {
        u && a(u);
      });
    }
    setAppName(i) {
      this.appName = i;
    }
    setPlatform(i) {
      this.platform = i;
    }
    setPreloadFileForSessions({
      filePath: i,
      // eslint-disable-line no-unused-vars
      includeFutureSession: a = !0,
      // eslint-disable-line no-unused-vars
      getSessions: c = () => []
      // eslint-disable-line no-unused-vars
    }) {
    }
    /**
     * Sent a message to opposite process
     * @param {string} channel
     * @param {any} message
     */
    sendIpc(i, a) {
    }
    showErrorBox(i, a) {
    }
  }
  return ji = s, ji;
}
var Ci, ih;
function GT() {
  if (ih) return Ci;
  ih = 1;
  const e = ge, t = xT();
  class r extends t {
    /**
     * @type {typeof Electron}
     */
    electron = void 0;
    /**
     * @param {object} options
     * @param {typeof Electron} [options.electron]
     */
    constructor({ electron: s } = {}) {
      super(), this.electron = s;
    }
    getAppName() {
      let s;
      try {
        s = this.appName || this.electron.app?.name || this.electron.app?.getName();
      } catch {
      }
      return s || super.getAppName();
    }
    getAppUserDataPath(s) {
      return this.getPath("userData") || super.getAppUserDataPath(s);
    }
    getAppVersion() {
      let s;
      try {
        s = this.electron.app?.getVersion();
      } catch {
      }
      return s || super.getAppVersion();
    }
    getElectronLogPath() {
      return this.getPath("logs") || super.getElectronLogPath();
    }
    /**
     * @private
     * @param {any} name
     * @returns {string|undefined}
     */
    getPath(s) {
      try {
        return this.electron.app?.getPath(s);
      } catch {
        return;
      }
    }
    getVersions() {
      return {
        app: `${this.getAppName()} ${this.getAppVersion()}`,
        electron: `Electron ${process.versions.electron}`,
        os: this.getOsVersion()
      };
    }
    getSystemPathAppData() {
      return this.getPath("appData") || super.getSystemPathAppData();
    }
    isDev() {
      return this.electron.app?.isPackaged !== void 0 ? !this.electron.app.isPackaged : typeof process.execPath == "string" ? e.basename(process.execPath).toLowerCase().startsWith("electron") : super.isDev();
    }
    onAppEvent(s, o) {
      return this.electron.app?.on(s, o), () => {
        this.electron.app?.off(s, o);
      };
    }
    onAppReady(s) {
      this.electron.app?.isReady() ? s() : this.electron.app?.once ? this.electron.app?.once("ready", s) : s();
    }
    onEveryWebContentsEvent(s, o) {
      return this.electron.webContents?.getAllWebContents()?.forEach((a) => {
        a.on(s, o);
      }), this.electron.app?.on("web-contents-created", i), () => {
        this.electron.webContents?.getAllWebContents().forEach((a) => {
          a.off(s, o);
        }), this.electron.app?.off("web-contents-created", i);
      };
      function i(a, c) {
        c.on(s, o);
      }
    }
    /**
     * Listen to async messages sent from opposite process
     * @param {string} channel
     * @param {function} listener
     */
    onIpc(s, o) {
      this.electron.ipcMain?.on(s, o);
    }
    onIpcInvoke(s, o) {
      this.electron.ipcMain?.handle?.(s, o);
    }
    /**
     * @param {string} url
     * @param {Function} [logFunction]
     */
    openUrl(s, o = console.error) {
      this.electron.shell?.openExternal(s).catch(o);
    }
    setPreloadFileForSessions({
      filePath: s,
      includeFutureSession: o = !0,
      getSessions: i = () => [this.electron.session?.defaultSession]
    }) {
      for (const c of i().filter(Boolean))
        a(c);
      o && this.onAppEvent("session-created", (c) => {
        a(c);
      });
      function a(c) {
        typeof c.registerPreloadScript == "function" ? c.registerPreloadScript({
          filePath: s,
          id: "electron-log-preload",
          type: "frame"
        }) : c.setPreloads([...c.getPreloads(), s]);
      }
    }
    /**
     * Sent a message to opposite process
     * @param {string} channel
     * @param {any} message
     */
    sendIpc(s, o) {
      this.electron.BrowserWindow?.getAllWindows()?.forEach((i) => {
        i.webContents?.isDestroyed() === !1 && i.webContents?.isCrashed() === !1 && i.webContents.send(s, o);
      });
    }
    showErrorBox(s, o) {
      this.electron.dialog?.showErrorBox(s, o);
    }
  }
  return Ci = r, Ci;
}
var Di = { exports: {} }, ah;
function BT() {
  return ah || (ah = 1, (function(e) {
    let t = {};
    try {
      t = require("electron");
    } catch {
    }
    t.ipcRenderer && r(t), e.exports = r;
    function r({ contextBridge: n, ipcRenderer: s }) {
      if (!s)
        return;
      s.on("__ELECTRON_LOG_IPC__", (i, a) => {
        window.postMessage({ cmd: "message", ...a });
      }), s.invoke("__ELECTRON_LOG__", { cmd: "getOptions" }).catch((i) => console.error(new Error(
        `electron-log isn't initialized in the main process. Please call log.initialize() before. ${i.message}`
      )));
      const o = {
        sendToMain(i) {
          try {
            s.send("__ELECTRON_LOG__", i);
          } catch (a) {
            console.error("electronLog.sendToMain ", a, "data:", i), s.send("__ELECTRON_LOG__", {
              cmd: "errorHandler",
              error: { message: a?.message, stack: a?.stack },
              errorName: "sendToMain"
            });
          }
        },
        log(...i) {
          o.sendToMain({ data: i, level: "info" });
        }
      };
      for (const i of ["error", "warn", "info", "verbose", "debug", "silly"])
        o[i] = (...a) => o.sendToMain({
          data: a,
          level: i
        });
      if (n && process.contextIsolated)
        try {
          n.exposeInMainWorld("__electronLog", o);
        } catch {
        }
      typeof window == "object" ? window.__electronLog = o : __electronLog = o;
    }
  })(Di)), Di.exports;
}
var ki, ch;
function WT() {
  if (ch) return ki;
  ch = 1;
  const e = lt, t = Ps, r = ge, n = BT();
  let s = !1, o = !1;
  ki = {
    initialize({
      externalApi: c,
      getSessions: l,
      includeFutureSession: u,
      logger: p,
      preload: h = !0,
      spyRendererConsole: m = !1
    }) {
      c.onAppReady(() => {
        try {
          h && i({
            externalApi: c,
            getSessions: l,
            includeFutureSession: u,
            logger: p,
            preloadOption: h
          }), m && a({ externalApi: c, logger: p });
        } catch (b) {
          p.warn(b);
        }
      });
    }
  };
  function i({
    externalApi: c,
    getSessions: l,
    includeFutureSession: u,
    logger: p,
    preloadOption: h
  }) {
    let m = typeof h == "string" ? h : void 0;
    if (s) {
      p.warn(new Error("log.initialize({ preload }) already called").stack);
      return;
    }
    s = !0;
    try {
      m = r.resolve(
        __dirname,
        "../renderer/electron-log-preload.js"
      );
    } catch {
    }
    if (!m || !e.existsSync(m)) {
      m = r.join(
        c.getAppUserDataPath() || t.tmpdir(),
        "electron-log-preload.js"
      );
      const b = `
      try {
        (${n.toString()})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    `;
      e.writeFileSync(m, b, "utf8");
    }
    c.setPreloadFileForSessions({
      filePath: m,
      includeFutureSession: u,
      getSessions: l
    });
  }
  function a({ externalApi: c, logger: l }) {
    if (o) {
      l.warn(
        new Error("log.initialize({ spyRendererConsole }) already called").stack
      );
      return;
    }
    o = !0;
    const u = ["debug", "info", "warn", "error"];
    c.onEveryWebContentsEvent(
      "console-message",
      (p, h, m) => {
        l.processMessage({
          data: [m],
          level: u[h],
          variables: { processType: "renderer" }
        });
      }
    );
  }
  return ki;
}
var Mi, uh;
function KT() {
  if (uh) return Mi;
  uh = 1, Mi = e;
  function e(t) {
    return Object.defineProperties(r, {
      defaultLabel: { value: "", writable: !0 },
      labelPadding: { value: !0, writable: !0 },
      maxLabelLength: { value: 0, writable: !0 },
      labelLength: {
        get() {
          switch (typeof r.labelPadding) {
            case "boolean":
              return r.labelPadding ? r.maxLabelLength : 0;
            case "number":
              return r.labelPadding;
            default:
              return 0;
          }
        }
      }
    });
    function r(n) {
      r.maxLabelLength = Math.max(r.maxLabelLength, n.length);
      const s = {};
      for (const o of t.levels)
        s[o] = (...i) => t.logData(i, { level: o, scope: n });
      return s.log = s.info, s;
    }
  }
  return Mi;
}
var Li, lh;
function HT() {
  if (lh) return Li;
  lh = 1;
  class e {
    constructor({ processMessage: r }) {
      this.processMessage = r, this.buffer = [], this.enabled = !1, this.begin = this.begin.bind(this), this.commit = this.commit.bind(this), this.reject = this.reject.bind(this);
    }
    addMessage(r) {
      this.buffer.push(r);
    }
    begin() {
      this.enabled = [];
    }
    commit() {
      this.enabled = !1, this.buffer.forEach((r) => this.processMessage(r)), this.buffer = [];
    }
    reject() {
      this.enabled = !1, this.buffer = [];
    }
  }
  return Li = e, Li;
}
var qi, dh;
function JT() {
  if (dh) return qi;
  dh = 1;
  const e = KT(), t = HT();
  class r {
    static instances = {};
    dependencies = {};
    errorHandler = null;
    eventLogger = null;
    functions = {};
    hooks = [];
    isDev = !1;
    levels = null;
    logId = null;
    scope = null;
    transports = {};
    variables = {};
    constructor({
      allowUnknownLevel: s = !1,
      dependencies: o = {},
      errorHandler: i,
      eventLogger: a,
      initializeFn: c,
      isDev: l = !1,
      levels: u = ["error", "warn", "info", "verbose", "debug", "silly"],
      logId: p,
      transportFactories: h = {},
      variables: m
    } = {}) {
      this.addLevel = this.addLevel.bind(this), this.create = this.create.bind(this), this.initialize = this.initialize.bind(this), this.logData = this.logData.bind(this), this.processMessage = this.processMessage.bind(this), this.allowUnknownLevel = s, this.buffering = new t(this), this.dependencies = o, this.initializeFn = c, this.isDev = l, this.levels = u, this.logId = p, this.scope = e(this), this.transportFactories = h, this.variables = m || {};
      for (const b of this.levels)
        this.addLevel(b, !1);
      this.log = this.info, this.functions.log = this.log, this.errorHandler = i, i?.setOptions({ ...o, logFn: this.error }), this.eventLogger = a, a?.setOptions({ ...o, logger: this });
      for (const [b, _] of Object.entries(h))
        this.transports[b] = _(this, o);
      r.instances[p] = this;
    }
    static getInstance({ logId: s }) {
      return this.instances[s] || this.instances.default;
    }
    addLevel(s, o = this.levels.length) {
      o !== !1 && this.levels.splice(o, 0, s), this[s] = (...i) => this.logData(i, { level: s }), this.functions[s] = this[s];
    }
    catchErrors(s) {
      return this.processMessage(
        {
          data: ["log.catchErrors is deprecated. Use log.errorHandler instead"],
          level: "warn"
        },
        { transports: ["console"] }
      ), this.errorHandler.startCatching(s);
    }
    create(s) {
      return typeof s == "string" && (s = { logId: s }), new r({
        dependencies: this.dependencies,
        errorHandler: this.errorHandler,
        initializeFn: this.initializeFn,
        isDev: this.isDev,
        transportFactories: this.transportFactories,
        variables: { ...this.variables },
        ...s
      });
    }
    compareLevels(s, o, i = this.levels) {
      const a = i.indexOf(s), c = i.indexOf(o);
      return c === -1 || a === -1 ? !0 : c <= a;
    }
    initialize(s = {}) {
      this.initializeFn({ logger: this, ...this.dependencies, ...s });
    }
    logData(s, o = {}) {
      this.buffering.enabled ? this.buffering.addMessage({ data: s, date: /* @__PURE__ */ new Date(), ...o }) : this.processMessage({ data: s, ...o });
    }
    processMessage(s, { transports: o = this.transports } = {}) {
      if (s.cmd === "errorHandler") {
        this.errorHandler.handle(s.error, {
          errorName: s.errorName,
          processType: "renderer",
          showDialog: !!s.showDialog
        });
        return;
      }
      let i = s.level;
      this.allowUnknownLevel || (i = this.levels.includes(s.level) ? s.level : "info");
      const a = {
        date: /* @__PURE__ */ new Date(),
        logId: this.logId,
        ...s,
        level: i,
        variables: {
          ...this.variables,
          ...s.variables
        }
      };
      for (const [c, l] of this.transportEntries(o))
        if (!(typeof l != "function" || l.level === !1) && this.compareLevels(l.level, s.level))
          try {
            const u = this.hooks.reduce((p, h) => p && h(p, l, c), a);
            u && l({ ...u, data: [...u.data] });
          } catch (u) {
            this.processInternalErrorFn(u);
          }
    }
    processInternalErrorFn(s) {
    }
    transportEntries(s = this.transports) {
      return (Array.isArray(s) ? s : Object.entries(s)).map((i) => {
        switch (typeof i) {
          case "string":
            return this.transports[i] ? [i, this.transports[i]] : null;
          case "function":
            return [i.name, i];
          default:
            return Array.isArray(i) ? i : null;
        }
      }).filter(Boolean);
    }
  }
  return qi = r, qi;
}
var Fi, fh;
function XT() {
  if (fh) return Fi;
  fh = 1;
  class e {
    externalApi = void 0;
    isActive = !1;
    logFn = void 0;
    onError = void 0;
    showDialog = !0;
    constructor({
      externalApi: n,
      logFn: s = void 0,
      onError: o = void 0,
      showDialog: i = void 0
    } = {}) {
      this.createIssue = this.createIssue.bind(this), this.handleError = this.handleError.bind(this), this.handleRejection = this.handleRejection.bind(this), this.setOptions({ externalApi: n, logFn: s, onError: o, showDialog: i }), this.startCatching = this.startCatching.bind(this), this.stopCatching = this.stopCatching.bind(this);
    }
    handle(n, {
      logFn: s = this.logFn,
      onError: o = this.onError,
      processType: i = "browser",
      showDialog: a = this.showDialog,
      errorName: c = ""
    } = {}) {
      n = t(n);
      try {
        if (typeof o == "function") {
          const l = this.externalApi?.getVersions() || {}, u = this.createIssue;
          if (o({
            createIssue: u,
            error: n,
            errorName: c,
            processType: i,
            versions: l
          }) === !1)
            return;
        }
        c ? s(c, n) : s(n), a && !c.includes("rejection") && this.externalApi && this.externalApi.showErrorBox(
          `A JavaScript error occurred in the ${i} process`,
          n.stack
        );
      } catch {
        console.error(n);
      }
    }
    setOptions({ externalApi: n, logFn: s, onError: o, showDialog: i }) {
      typeof n == "object" && (this.externalApi = n), typeof s == "function" && (this.logFn = s), typeof o == "function" && (this.onError = o), typeof i == "boolean" && (this.showDialog = i);
    }
    startCatching({ onError: n, showDialog: s } = {}) {
      this.isActive || (this.isActive = !0, this.setOptions({ onError: n, showDialog: s }), process.on("uncaughtException", this.handleError), process.on("unhandledRejection", this.handleRejection));
    }
    stopCatching() {
      this.isActive = !1, process.removeListener("uncaughtException", this.handleError), process.removeListener("unhandledRejection", this.handleRejection);
    }
    createIssue(n, s) {
      this.externalApi?.openUrl(
        `${n}?${new URLSearchParams(s).toString()}`
      );
    }
    handleError(n) {
      this.handle(n, { errorName: "Unhandled" });
    }
    handleRejection(n) {
      const s = n instanceof Error ? n : new Error(JSON.stringify(n));
      this.handle(s, { errorName: "Unhandled rejection" });
    }
  }
  function t(r) {
    if (r instanceof Error)
      return r;
    if (r && typeof r == "object") {
      if (r.message)
        return Object.assign(new Error(r.message), r);
      try {
        return new Error(JSON.stringify(r));
      } catch (n) {
        return new Error(`Couldn't normalize error ${String(r)}: ${n}`);
      }
    }
    return new Error(`Can't normalize error ${String(r)}`);
  }
  return Fi = e, Fi;
}
var Ui, hh;
function YT() {
  if (hh) return Ui;
  hh = 1;
  class e {
    disposers = [];
    format = "{eventSource}#{eventName}:";
    formatters = {
      app: {
        "certificate-error": ({ args: r }) => this.arrayToObject(r.slice(1, 4), [
          "url",
          "error",
          "certificate"
        ]),
        "child-process-gone": ({ args: r }) => r.length === 1 ? r[0] : r,
        "render-process-gone": ({ args: [r, n] }) => n && typeof n == "object" ? { ...n, ...this.getWebContentsDetails(r) } : []
      },
      webContents: {
        "console-message": ({ args: [r, n, s, o] }) => {
          if (!(r < 3))
            return { message: n, source: `${o}:${s}` };
        },
        "did-fail-load": ({ args: r }) => this.arrayToObject(r, [
          "errorCode",
          "errorDescription",
          "validatedURL",
          "isMainFrame",
          "frameProcessId",
          "frameRoutingId"
        ]),
        "did-fail-provisional-load": ({ args: r }) => this.arrayToObject(r, [
          "errorCode",
          "errorDescription",
          "validatedURL",
          "isMainFrame",
          "frameProcessId",
          "frameRoutingId"
        ]),
        "plugin-crashed": ({ args: r }) => this.arrayToObject(r, ["name", "version"]),
        "preload-error": ({ args: r }) => this.arrayToObject(r, ["preloadPath", "error"])
      }
    };
    events = {
      app: {
        "certificate-error": !0,
        "child-process-gone": !0,
        "render-process-gone": !0
      },
      webContents: {
        // 'console-message': true,
        "did-fail-load": !0,
        "did-fail-provisional-load": !0,
        "plugin-crashed": !0,
        "preload-error": !0,
        unresponsive: !0
      }
    };
    externalApi = void 0;
    level = "error";
    scope = "";
    constructor(r = {}) {
      this.setOptions(r);
    }
    setOptions({
      events: r,
      externalApi: n,
      level: s,
      logger: o,
      format: i,
      formatters: a,
      scope: c
    }) {
      typeof r == "object" && (this.events = r), typeof n == "object" && (this.externalApi = n), typeof s == "string" && (this.level = s), typeof o == "object" && (this.logger = o), (typeof i == "string" || typeof i == "function") && (this.format = i), typeof a == "object" && (this.formatters = a), typeof c == "string" && (this.scope = c);
    }
    startLogging(r = {}) {
      this.setOptions(r), this.disposeListeners();
      for (const n of this.getEventNames(this.events.app))
        this.disposers.push(
          this.externalApi.onAppEvent(n, (...s) => {
            this.handleEvent({ eventSource: "app", eventName: n, handlerArgs: s });
          })
        );
      for (const n of this.getEventNames(this.events.webContents))
        this.disposers.push(
          this.externalApi.onEveryWebContentsEvent(
            n,
            (...s) => {
              this.handleEvent(
                { eventSource: "webContents", eventName: n, handlerArgs: s }
              );
            }
          )
        );
    }
    stopLogging() {
      this.disposeListeners();
    }
    arrayToObject(r, n) {
      const s = {};
      return n.forEach((o, i) => {
        s[o] = r[i];
      }), r.length > n.length && (s.unknownArgs = r.slice(n.length)), s;
    }
    disposeListeners() {
      this.disposers.forEach((r) => r()), this.disposers = [];
    }
    formatEventLog({ eventName: r, eventSource: n, handlerArgs: s }) {
      const [o, ...i] = s;
      if (typeof this.format == "function")
        return this.format({ args: i, event: o, eventName: r, eventSource: n });
      const a = this.formatters[n]?.[r];
      let c = i;
      if (typeof a == "function" && (c = a({ args: i, event: o, eventName: r, eventSource: n })), !c)
        return;
      const l = {};
      return Array.isArray(c) ? l.args = c : typeof c == "object" && Object.assign(l, c), n === "webContents" && Object.assign(l, this.getWebContentsDetails(o?.sender)), [this.format.replace("{eventSource}", n === "app" ? "App" : "WebContents").replace("{eventName}", r), l];
    }
    getEventNames(r) {
      return !r || typeof r != "object" ? [] : Object.entries(r).filter(([n, s]) => s).map(([n]) => n);
    }
    getWebContentsDetails(r) {
      if (!r?.loadURL)
        return {};
      try {
        return {
          webContents: {
            id: r.id,
            url: r.getURL()
          }
        };
      } catch {
        return {};
      }
    }
    handleEvent({ eventName: r, eventSource: n, handlerArgs: s }) {
      const o = this.formatEventLog({ eventName: r, eventSource: n, handlerArgs: s });
      o && (this.scope ? this.logger.scope(this.scope) : this.logger)?.[this.level]?.(...o);
    }
  }
  return Ui = e, Ui;
}
var Vi, ph;
function mr() {
  if (ph) return Vi;
  ph = 1, Vi = { transform: e };
  function e({
    logger: t,
    message: r,
    transport: n,
    initialData: s = r?.data || [],
    transforms: o = n?.transforms
  }) {
    return o.reduce((i, a) => typeof a == "function" ? a({ data: i, logger: t, message: r, transport: n }) : i, s);
  }
  return Vi;
}
var zi, mh;
function Ty() {
  if (mh) return zi;
  mh = 1;
  const { transform: e } = mr();
  zi = {
    concatFirstStringElements: t,
    formatScope: n,
    formatText: o,
    formatVariables: s,
    timeZoneFromOffset: r,
    format({ message: i, logger: a, transport: c, data: l = i?.data }) {
      switch (typeof c.format) {
        case "string":
          return e({
            message: i,
            logger: a,
            transforms: [s, n, o],
            transport: c,
            initialData: [c.format, ...l]
          });
        case "function":
          return c.format({
            data: l,
            level: i?.level || "info",
            logger: a,
            message: i,
            transport: c
          });
        default:
          return l;
      }
    }
  };
  function t({ data: i }) {
    return typeof i[0] != "string" || typeof i[1] != "string" || i[0].match(/%[1cdfiOos]/) ? i : [`${i[0]} ${i[1]}`, ...i.slice(2)];
  }
  function r(i) {
    const a = Math.abs(i), c = i > 0 ? "-" : "+", l = Math.floor(a / 60).toString().padStart(2, "0"), u = (a % 60).toString().padStart(2, "0");
    return `${c}${l}:${u}`;
  }
  function n({ data: i, logger: a, message: c }) {
    const { defaultLabel: l, labelLength: u } = a?.scope || {}, p = i[0];
    let h = c.scope;
    h || (h = l);
    let m;
    return h === "" ? m = u > 0 ? "".padEnd(u + 3) : "" : typeof h == "string" ? m = ` (${h})`.padEnd(u + 3) : m = "", i[0] = p.replace("{scope}", m), i;
  }
  function s({ data: i, message: a }) {
    let c = i[0];
    if (typeof c != "string")
      return i;
    c = c.replace("{level}]", `${a.level}]`.padEnd(6, " "));
    const l = a.date || /* @__PURE__ */ new Date();
    return i[0] = c.replace(/\{(\w+)}/g, (u, p) => {
      switch (p) {
        case "level":
          return a.level || "info";
        case "logId":
          return a.logId;
        case "y":
          return l.getFullYear().toString(10);
        case "m":
          return (l.getMonth() + 1).toString(10).padStart(2, "0");
        case "d":
          return l.getDate().toString(10).padStart(2, "0");
        case "h":
          return l.getHours().toString(10).padStart(2, "0");
        case "i":
          return l.getMinutes().toString(10).padStart(2, "0");
        case "s":
          return l.getSeconds().toString(10).padStart(2, "0");
        case "ms":
          return l.getMilliseconds().toString(10).padStart(3, "0");
        case "z":
          return r(l.getTimezoneOffset());
        case "iso":
          return l.toISOString();
        default:
          return a.variables?.[p] || u;
      }
    }).trim(), i;
  }
  function o({ data: i }) {
    const a = i[0];
    if (typeof a != "string")
      return i;
    if (a.lastIndexOf("{text}") === a.length - 6)
      return i[0] = a.replace(/\s?{text}/, ""), i[0] === "" && i.shift(), i;
    const l = a.split("{text}");
    let u = [];
    return l[0] !== "" && u.push(l[0]), u = u.concat(i.slice(1)), l[1] !== "" && u.push(l[1]), u;
  }
  return zi;
}
var xi = { exports: {} }, yh;
function Ys() {
  return yh || (yh = 1, (function(e) {
    const t = Qy;
    e.exports = {
      serialize: n,
      maxDepth({ data: s, transport: o, depth: i = o?.depth ?? 6 }) {
        if (!s)
          return s;
        if (i < 1)
          return Array.isArray(s) ? "[array]" : typeof s == "object" && s ? "[object]" : s;
        if (Array.isArray(s))
          return s.map((c) => e.exports.maxDepth({
            data: c,
            depth: i - 1
          }));
        if (typeof s != "object" || s && typeof s.toISOString == "function")
          return s;
        if (s === null)
          return null;
        if (s instanceof Error)
          return s;
        const a = {};
        for (const c in s)
          Object.prototype.hasOwnProperty.call(s, c) && (a[c] = e.exports.maxDepth({
            data: s[c],
            depth: i - 1
          }));
        return a;
      },
      toJSON({ data: s }) {
        return JSON.parse(JSON.stringify(s, r()));
      },
      toString({ data: s, transport: o }) {
        const i = o?.inspectOptions || {}, a = s.map((c) => {
          if (c !== void 0)
            try {
              const l = JSON.stringify(c, r(), "  ");
              return l === void 0 ? void 0 : JSON.parse(l);
            } catch {
              return c;
            }
        });
        return t.formatWithOptions(i, ...a);
      }
    };
    function r(s = {}) {
      const o = /* @__PURE__ */ new WeakSet();
      return function(i, a) {
        if (typeof a == "object" && a !== null) {
          if (o.has(a))
            return;
          o.add(a);
        }
        return n(i, a, s);
      };
    }
    function n(s, o, i = {}) {
      const a = i?.serializeMapAndSet !== !1;
      return o instanceof Error ? o.stack : o && (typeof o == "function" ? `[function] ${o.toString()}` : o instanceof Date ? o.toISOString() : a && o instanceof Map && Object.fromEntries ? Object.fromEntries(o) : a && o instanceof Set && Array.from ? Array.from(o) : o);
    }
  })(xi)), xi.exports;
}
var Gi, gh;
function wc() {
  if (gh) return Gi;
  gh = 1, Gi = {
    transformStyles: n,
    applyAnsiStyles({ data: s }) {
      return n(s, t, r);
    },
    removeStyles({ data: s }) {
      return n(s, () => "");
    }
  };
  const e = {
    unset: "\x1B[0m",
    black: "\x1B[30m",
    red: "\x1B[31m",
    green: "\x1B[32m",
    yellow: "\x1B[33m",
    blue: "\x1B[34m",
    magenta: "\x1B[35m",
    cyan: "\x1B[36m",
    white: "\x1B[37m",
    gray: "\x1B[90m"
  };
  function t(s) {
    const o = s.replace(/color:\s*(\w+).*/, "$1").toLowerCase();
    return e[o] || "";
  }
  function r(s) {
    return s + e.unset;
  }
  function n(s, o, i) {
    const a = {};
    return s.reduce((c, l, u, p) => {
      if (a[u])
        return c;
      if (typeof l == "string") {
        let h = u, m = !1;
        l = l.replace(/%[1cdfiOos]/g, (b) => {
          if (h += 1, b !== "%c")
            return b;
          const _ = p[h];
          return typeof _ == "string" ? (a[h] = !0, m = !0, o(_, l)) : b;
        }), m && i && (l = i(l));
      }
      return c.push(l), c;
    }, []);
  }
  return Gi;
}
var Bi, vh;
function QT() {
  if (vh) return Bi;
  vh = 1;
  const {
    concatFirstStringElements: e,
    format: t
  } = Ty(), { maxDepth: r, toJSON: n } = Ys(), {
    applyAnsiStyles: s,
    removeStyles: o
  } = wc(), { transform: i } = mr(), a = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    verbose: console.info,
    debug: console.debug,
    silly: console.debug,
    log: console.log
  };
  Bi = u;
  const l = `%c{h}:{i}:{s}.{ms}{scope}%c ${process.platform === "win32" ? ">" : "›"} {text}`;
  Object.assign(u, {
    DEFAULT_FORMAT: l
  });
  function u(_) {
    return Object.assign(f, {
      colorMap: {
        error: "red",
        warn: "yellow",
        info: "cyan",
        verbose: "unset",
        debug: "gray",
        silly: "gray",
        default: "unset"
      },
      format: l,
      level: "silly",
      transforms: [
        p,
        t,
        m,
        e,
        r,
        n
      ],
      useStyles: process.env.FORCE_STYLES,
      writeFn({ message: y }) {
        (a[y.level] || a.info)(...y.data);
      }
    });
    function f(y) {
      const d = i({ logger: _, message: y, transport: f });
      f.writeFn({
        message: { ...y, data: d }
      });
    }
  }
  function p({ data: _, message: f, transport: y }) {
    return typeof y.format != "string" || !y.format.includes("%c") ? _ : [
      `color:${b(f.level, y)}`,
      "color:unset",
      ..._
    ];
  }
  function h(_, f) {
    if (typeof _ == "boolean")
      return _;
    const d = f === "error" || f === "warn" ? process.stderr : process.stdout;
    return d && d.isTTY;
  }
  function m(_) {
    const { message: f, transport: y } = _;
    return (h(y.useStyles, f.level) ? s : o)(_);
  }
  function b(_, f) {
    return f.colorMap[_] || f.colorMap.default;
  }
  return Bi;
}
var Wi, wh;
function Iy() {
  if (wh) return Wi;
  wh = 1;
  const e = zh, t = lt, r = Ps;
  class n extends e {
    asyncWriteQueue = [];
    bytesWritten = 0;
    hasActiveAsyncWriting = !1;
    path = null;
    initialSize = void 0;
    writeOptions = null;
    writeAsync = !1;
    constructor({
      path: i,
      writeOptions: a = { encoding: "utf8", flag: "a", mode: 438 },
      writeAsync: c = !1
    }) {
      super(), this.path = i, this.writeOptions = a, this.writeAsync = c;
    }
    get size() {
      return this.getSize();
    }
    clear() {
      try {
        return t.writeFileSync(this.path, "", {
          mode: this.writeOptions.mode,
          flag: "w"
        }), this.reset(), !0;
      } catch (i) {
        return i.code === "ENOENT" ? !0 : (this.emit("error", i, this), !1);
      }
    }
    crop(i) {
      try {
        const a = s(this.path, i || 4096);
        this.clear(), this.writeLine(`[log cropped]${r.EOL}${a}`);
      } catch (a) {
        this.emit(
          "error",
          new Error(`Couldn't crop file ${this.path}. ${a.message}`),
          this
        );
      }
    }
    getSize() {
      if (this.initialSize === void 0)
        try {
          const i = t.statSync(this.path);
          this.initialSize = i.size;
        } catch {
          this.initialSize = 0;
        }
      return this.initialSize + this.bytesWritten;
    }
    increaseBytesWrittenCounter(i) {
      this.bytesWritten += Buffer.byteLength(i, this.writeOptions.encoding);
    }
    isNull() {
      return !1;
    }
    nextAsyncWrite() {
      const i = this;
      if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0)
        return;
      const a = this.asyncWriteQueue.join("");
      this.asyncWriteQueue = [], this.hasActiveAsyncWriting = !0, t.writeFile(this.path, a, this.writeOptions, (c) => {
        i.hasActiveAsyncWriting = !1, c ? i.emit(
          "error",
          new Error(`Couldn't write to ${i.path}. ${c.message}`),
          this
        ) : i.increaseBytesWrittenCounter(a), i.nextAsyncWrite();
      });
    }
    reset() {
      this.initialSize = void 0, this.bytesWritten = 0;
    }
    toString() {
      return this.path;
    }
    writeLine(i) {
      if (i += r.EOL, this.writeAsync) {
        this.asyncWriteQueue.push(i), this.nextAsyncWrite();
        return;
      }
      try {
        t.writeFileSync(this.path, i, this.writeOptions), this.increaseBytesWrittenCounter(i);
      } catch (a) {
        this.emit(
          "error",
          new Error(`Couldn't write to ${this.path}. ${a.message}`),
          this
        );
      }
    }
  }
  Wi = n;
  function s(o, i) {
    const a = Buffer.alloc(i), c = t.statSync(o), l = Math.min(c.size, i), u = Math.max(0, c.size - i), p = t.openSync(o, "r"), h = t.readSync(p, a, 0, l, u);
    return t.closeSync(p), a.toString("utf8", 0, h);
  }
  return Wi;
}
var Ki, $h;
function ZT() {
  if ($h) return Ki;
  $h = 1;
  const e = Iy();
  class t extends e {
    clear() {
    }
    crop() {
    }
    getSize() {
      return 0;
    }
    isNull() {
      return !0;
    }
    writeLine() {
    }
  }
  return Ki = t, Ki;
}
var Hi, _h;
function eI() {
  if (_h) return Hi;
  _h = 1;
  const e = zh, t = lt, r = ge, n = Iy(), s = ZT();
  class o extends e {
    store = {};
    constructor() {
      super(), this.emitError = this.emitError.bind(this);
    }
    /**
     * Provide a File object corresponding to the filePath
     * @param {string} filePath
     * @param {WriteOptions} [writeOptions]
     * @param {boolean} [writeAsync]
     * @return {File}
     */
    provide({ filePath: a, writeOptions: c = {}, writeAsync: l = !1 }) {
      let u;
      try {
        if (a = r.resolve(a), this.store[a])
          return this.store[a];
        u = this.createFile({ filePath: a, writeOptions: c, writeAsync: l });
      } catch (p) {
        u = new s({ path: a }), this.emitError(p, u);
      }
      return u.on("error", this.emitError), this.store[a] = u, u;
    }
    /**
     * @param {string} filePath
     * @param {WriteOptions} writeOptions
     * @param {boolean} async
     * @return {File}
     * @private
     */
    createFile({ filePath: a, writeOptions: c, writeAsync: l }) {
      return this.testFileWriting({ filePath: a, writeOptions: c }), new n({ path: a, writeOptions: c, writeAsync: l });
    }
    /**
     * @param {Error} error
     * @param {File} file
     * @private
     */
    emitError(a, c) {
      this.emit("error", a, c);
    }
    /**
     * @param {string} filePath
     * @param {WriteOptions} writeOptions
     * @private
     */
    testFileWriting({ filePath: a, writeOptions: c }) {
      t.mkdirSync(r.dirname(a), { recursive: !0 }), t.writeFileSync(a, "", { flag: "a", mode: c.mode });
    }
  }
  return Hi = o, Hi;
}
var Ji, bh;
function tI() {
  if (bh) return Ji;
  bh = 1;
  const e = lt, t = Ps, r = ge, n = eI(), { transform: s } = mr(), { removeStyles: o } = wc(), {
    format: i,
    concatFirstStringElements: a
  } = Ty(), { toString: c } = Ys();
  Ji = u;
  const l = new n();
  function u(h, { registry: m = l, externalApi: b } = {}) {
    let _;
    return m.listenerCount("error") < 1 && m.on("error", (g, $) => {
      d(`Can't write to ${$}`, g);
    }), Object.assign(f, {
      fileName: p(h.variables.processType),
      format: "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",
      getFile: v,
      inspectOptions: { depth: 5 },
      level: "silly",
      maxSize: 1024 ** 2,
      readAllLogs: S,
      sync: !0,
      transforms: [o, i, a, c],
      writeOptions: { flag: "a", mode: 438, encoding: "utf8" },
      archiveLogFn(g) {
        const $ = g.toString(), E = r.parse($);
        try {
          e.renameSync($, r.join(E.dir, `${E.name}.old${E.ext}`));
        } catch (I) {
          d("Could not rotate log", I);
          const k = Math.round(f.maxSize / 4);
          g.crop(Math.min(k, 256 * 1024));
        }
      },
      resolvePathFn(g) {
        return r.join(g.libraryDefaultDir, g.fileName);
      },
      setAppName(g) {
        h.dependencies.externalApi.setAppName(g);
      }
    });
    function f(g) {
      const $ = v(g);
      f.maxSize > 0 && $.size > f.maxSize && (f.archiveLogFn($), $.reset());
      const I = s({ logger: h, message: g, transport: f });
      $.writeLine(I);
    }
    function y() {
      _ || (_ = Object.create(
        Object.prototype,
        {
          ...Object.getOwnPropertyDescriptors(
            b.getPathVariables()
          ),
          fileName: {
            get() {
              return f.fileName;
            },
            enumerable: !0
          }
        }
      ), typeof f.archiveLog == "function" && (f.archiveLogFn = f.archiveLog, d("archiveLog is deprecated. Use archiveLogFn instead")), typeof f.resolvePath == "function" && (f.resolvePathFn = f.resolvePath, d("resolvePath is deprecated. Use resolvePathFn instead")));
    }
    function d(g, $ = null, E = "error") {
      const I = [`electron-log.transports.file: ${g}`];
      $ && I.push($), h.transports.console({ data: I, date: /* @__PURE__ */ new Date(), level: E });
    }
    function v(g) {
      y();
      const $ = f.resolvePathFn(_, g);
      return m.provide({
        filePath: $,
        writeAsync: !f.sync,
        writeOptions: f.writeOptions
      });
    }
    function S({ fileFilter: g = ($) => $.endsWith(".log") } = {}) {
      y();
      const $ = r.dirname(f.resolvePathFn(_));
      return e.existsSync($) ? e.readdirSync($).map((E) => r.join($, E)).filter(g).map((E) => {
        try {
          return {
            path: E,
            lines: e.readFileSync(E, "utf8").split(t.EOL)
          };
        } catch {
          return null;
        }
      }).filter(Boolean) : [];
    }
  }
  function p(h = process.type) {
    switch (h) {
      case "renderer":
        return "renderer.log";
      case "worker":
        return "worker.log";
      default:
        return "main.log";
    }
  }
  return Ji;
}
var Xi, Sh;
function rI() {
  if (Sh) return Xi;
  Sh = 1;
  const { maxDepth: e, toJSON: t } = Ys(), { transform: r } = mr();
  Xi = n;
  function n(s, { externalApi: o }) {
    return Object.assign(i, {
      depth: 3,
      eventId: "__ELECTRON_LOG_IPC__",
      level: s.isDev ? "silly" : !1,
      transforms: [t, e]
    }), o?.isElectron() ? i : void 0;
    function i(a) {
      a?.variables?.processType !== "renderer" && o?.sendIpc(i.eventId, {
        ...a,
        data: r({ logger: s, message: a, transport: i })
      });
    }
  }
  return Xi;
}
var Yi, Eh;
function nI() {
  if (Eh) return Yi;
  Eh = 1;
  const e = Zy, t = eg, { transform: r } = mr(), { removeStyles: n } = wc(), { toJSON: s, maxDepth: o } = Ys();
  Yi = i;
  function i(a) {
    return Object.assign(c, {
      client: { name: "electron-application" },
      depth: 6,
      level: !1,
      requestOptions: {},
      transforms: [n, s, o],
      makeBodyFn({ message: l }) {
        return JSON.stringify({
          client: c.client,
          data: l.data,
          date: l.date.getTime(),
          level: l.level,
          scope: l.scope,
          variables: l.variables
        });
      },
      processErrorFn({ error: l }) {
        a.processMessage(
          {
            data: [`electron-log: can't POST ${c.url}`, l],
            level: "warn"
          },
          { transports: ["console", "file"] }
        );
      },
      sendRequestFn({ serverUrl: l, requestOptions: u, body: p }) {
        const m = (l.startsWith("https:") ? t : e).request(l, {
          method: "POST",
          ...u,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": p.length,
            ...u.headers
          }
        });
        return m.write(p), m.end(), m;
      }
    });
    function c(l) {
      if (!c.url)
        return;
      const u = c.makeBodyFn({
        logger: a,
        message: { ...l, data: r({ logger: a, message: l, transport: c }) },
        transport: c
      }), p = c.sendRequestFn({
        serverUrl: c.url,
        requestOptions: c.requestOptions,
        body: Buffer.from(u, "utf8")
      });
      p.on("error", (h) => c.processErrorFn({
        error: h,
        logger: a,
        message: l,
        request: p,
        transport: c
      }));
    }
  }
  return Yi;
}
var Qi, Rh;
function sI() {
  if (Rh) return Qi;
  Rh = 1;
  const e = JT(), t = XT(), r = YT(), n = QT(), s = tI(), o = rI(), i = nI();
  Qi = a;
  function a({ dependencies: c, initializeFn: l }) {
    const u = new e({
      dependencies: c,
      errorHandler: new t(),
      eventLogger: new r(),
      initializeFn: l,
      isDev: c.externalApi?.isDev(),
      logId: "default",
      transportFactories: {
        console: n,
        file: s,
        ipc: o,
        remote: i
      },
      variables: {
        processType: "main"
      }
    });
    return u.default = u, u.Logger = e, u.processInternalErrorFn = (p) => {
      u.transports.console.writeFn({
        message: {
          data: ["Unhandled electron-log error", p],
          level: "error"
        }
      });
    }, u;
  }
  return Qi;
}
var Zi, Ph;
function oI() {
  if (Ph) return Zi;
  Ph = 1;
  const e = _a, t = GT(), { initialize: r } = WT(), n = sI(), s = new t({ electron: e }), o = n({
    dependencies: { externalApi: s },
    initializeFn: r
  });
  Zi = o, s.onIpc("__ELECTRON_LOG__", (a, c) => {
    c.scope && o.Logger.getInstance(c).scope(c.scope);
    const l = new Date(c.date);
    i({
      ...c,
      date: l.getTime() ? l : /* @__PURE__ */ new Date()
    });
  }), s.onIpcInvoke("__ELECTRON_LOG__", (a, { cmd: c = "", logId: l }) => c === "getOptions" ? {
    levels: o.Logger.getInstance({ logId: l }).levels,
    logId: l
  } : (i({ data: [`Unknown cmd '${c}'`], level: "error" }), {}));
  function i(a) {
    o.Logger.getInstance(a)?.processMessage(a);
  }
  return Zi;
}
var ea, Oh;
function iI() {
  return Oh || (Oh = 1, ea = oI()), ea;
}
var aI = iI();
const Be = /* @__PURE__ */ Ts(aI), Ny = ge.join(We.getPath("documents"), "Antigravity_Projects", "All_updater", "app_debug.log");
Be.transports.file.resolvePathFn = () => Ny;
Be.initialize();
class cI {
  constructor() {
    Be.info("LoggerService initialized"), Be.info(`Logs are being written to: ${Ny}`);
  }
  info(t, ...r) {
    Be.info(t, ...r);
  }
  error(t, ...r) {
    Be.error(t, ...r);
  }
  warn(t, ...r) {
    Be.warn(t, ...r);
  }
  getLogPath() {
    return Be.transports.file.getFile().path;
  }
}
const uI = {
  items: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        appName: { type: "string" },
        version: { type: "string" },
        status: { type: "string" },
        date: { type: "string" },
        details: { type: "string" }
      }
    },
    default: []
  }
};
class lI {
  store;
  constructor() {
    this.store = new Oy({
      schema: uI,
      name: "installation-history"
    });
  }
  getHistory() {
    return this.store.get("items");
  }
  addEntry(t) {
    const r = this.getHistory(), n = {
      ...t,
      date: (/* @__PURE__ */ new Date()).toISOString()
    };
    r.unshift(n), this.store.set("items", r.slice(0, 200));
  }
  isVersionSkipped(t, r) {
    return this.getHistory().some(
      (s) => s.id === t && s.version === r && // Only skip if explicitly marked as 'skipped' by user action (future feature)
      // Do NOT skip 'inapplicable' or 'failed' statuses, so user can retry them
      s.status === "skipped"
    );
  }
  clearHistory() {
    this.store.set("items", []);
  }
}
const fs = new lI(), as = new JE(new nc(), fs), dI = new XE(), ta = new VT(), zt = new cI(), fI = new nc();
function hI() {
  console.log("[IPC] Setting up IPC handlers..."), _e.handle("winget:check-updates", async () => (console.log("[IPC] winget:check-updates handler called"), zt.info("Checking for updates..."), await as.getAvailableUpdates())), console.log("[IPC] IPC handlers registered successfully"), _e.handle("winget:install-update", async (e, t) => (zt.info(`Installing update for ${t}`), await as.installUpdate(t, (r) => {
    e.sender.send("winget:log", r);
  }))), _e.handle("winget:install-all", async () => (zt.info("Installing all updates"), await as.installAll())), _e.handle("system:create-restore-point", async (e, t) => (zt.info(`Creating restore point: ${t}`), await dI.createRestorePoint(t))), _e.handle("settings:get", (e, t) => ta.get(t)), _e.handle("settings:set", (e, t, r) => ta.set(t, r)), _e.handle("system:open-logs", async () => {
    try {
      const e = Be.transports.file.getFile();
      Be.transports.console.level = "debug", e ? (console.log("Opening log file at:", e.path), await Cy.showItemInFolder(e.path)) : console.error("Log file object is null");
    } catch (e) {
      console.error(`Failed to open logs: ${e}`);
    }
  }), _e.handle("system:is-elevated", async () => await as.isElevated()), _e.handle("system:get-info", async () => fI.getSystemInfo()), _e.handle("system:get-userdata-path", async () => (await import("electron")).app.getPath("userData")), _e.handle("history:get", async () => fs.getHistory()), _e.handle("history:add", async (e, t) => fs.addEntry(t)), _e.handle("history:clear", async () => {
    fs.clearHistory(), ta.set("hasSeenOnboarding", !1);
  }), _e.on("log:info", (e, t) => zt.info(t)), _e.on("log:error", (e, t) => zt.error(t));
}
const pI = Dy(import.meta.url), Ay = ge.dirname(pI);
process.env.DIST = ge.join(Ay, "../dist");
process.env.VITE_PUBLIC = We.isPackaged ? process.env.DIST : ge.join(process.env.DIST, "../public");
if (We.isPackaged) {
  const e = ge.join(ge.dirname(We.getPath("exe")), "data");
  We.setPath("userData", e);
}
async function mI() {
  try {
    const { execa: e } = await Promise.resolve().then(() => HE);
    return await e("net", ["session"], { reject: !0 }), !0;
  } catch {
    return !1;
  }
}
let at, $a = !1;
const Th = process.env.VITE_DEV_SERVER_URL;
function jy() {
  at = new Ih({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: ge.join(Ay, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    },
    autoHideMenuBar: !0,
    title: "All Updater",
    icon: ge.join(process.env.VITE_PUBLIC, "logo.png")
  }), at.on("close", (e) => {
    $a && (e.preventDefault(), Nh.showMessageBoxSync(at, {
      type: "warning",
      buttons: ["Wait", "Close Anyway (Dangerous)"],
      title: "Operation in Progress",
      message: "An application update or restore point is currently in progress. Closing the app now could leave your system or software in an unstable state.",
      detail: "It is highly recommended to wait until the process finishes.",
      defaultId: 0,
      cancelId: 0
    }) === 1 && ($a = !1, at?.close()));
  }), at.webContents.on("did-finish-load", () => {
    at?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), Th ? at.loadURL(Th) : at.loadFile(ge.join(process.env.DIST || "", "index.html"));
}
_e.handle("system:set-operation-active", (e, t) => {
  $a = t;
});
We.on("window-all-closed", () => {
  process.platform !== "darwin" && We.quit();
});
We.on("activate", () => {
  Ih.getAllWindows().length === 0 && jy();
});
hI();
We.whenReady().then(async () => {
  if (!await mI()) {
    Nh.showErrorBox(
      "Privilegios insuficientes",
      `All Updater requiere permisos de Administrador para gestionar Winget y crear puntos de restauración.

Por favor, ejecuta la aplicación como administrador.`
    ), We.quit();
    return;
  }
  jy();
});
