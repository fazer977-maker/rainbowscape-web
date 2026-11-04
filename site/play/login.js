/* Rainbow Scape web login screen - a port of the Android app's LoginOverlay.
   The game (Java) calls rs.ls(...) every frame with its state; this file decides what to show. */
(function () {
  "use strict";
  var GOLD = "#ffd54a", PARCH = "#cdc6ff";
  var HERB_NAME = ["Guam leaf", "Marrentill", "Tarromin", "Harralander", "Ranarr weed", "Toadflax", "Irit leaf", "Avantoe", "Kwuarm", "Snapdragon", "Cadantine", "Lantadyme", "Dwarf weed", "Torstol"];
  var HERB_LEAF = ["#58aa46", "#468c50", "#3c7846", "#82aa3c", "#3c9646", "#64a05a", "#3c963c", "#6eaa46", "#46729a", "#5aa050", "#3c6e46", "#5a9678", "#326432", "#503c6e"];
  var HERB_FLOWER = [0, 0, 0, 0, "#e65a82", "#f0a040", 0, 0, "#9bd0ff", "#f06aa0", 0, 0, 0, "#b070f0"];
  var HERB_POTION = [[90, 230, 70], [40, 220, 170], [30, 170, 90], [230, 230, 40], [40, 210, 230], [240, 150, 40], [255, 220, 50], [255, 110, 30], [50, 120, 255], [255, 70, 160], [30, 200, 120], [90, 200, 255], [230, 60, 50], [160, 60, 255]];

  var css = document.createElement("style");
  css.textContent = [
    "@font-face{font-family:Silk;src:url(silkscreen.ttf)}",
    "@property --a{syntax:'<angle>';inherits:false;initial-value:0deg}",
    "#lo{position:fixed;inset:0;z-index:3;display:none;background:#010103;color:" + PARCH + ";font:16px system-ui,sans-serif;overflow-y:auto;overflow-x:hidden;transition:opacity .38s;-webkit-tap-highlight-color:transparent}",
    "#lo canvas#lobg{position:fixed;inset:0;width:100%;height:100%;z-index:0}",
    "#lo .col{position:relative;z-index:1;min-height:100%;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px 16px 12px}",
    "#lo .brand{display:flex;align-items:center;justify-content:center;gap:4px;margin-bottom:12px}",
    "#lo .title{font:30px Silk,monospace;letter-spacing:.04em;background:linear-gradient(90deg,#ff4d4d,#ff9f43,#ffd93d,#6bd968,#4dabf7,#9775fa,#e64980,#ff4d4d);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sh 3s linear infinite;filter:drop-shadow(0 0 7px rgba(255,70,200,.8))}",
    "@keyframes sh{to{background-position:-300% 0}}",
    "#lo .panel{width:min(330px,100%);box-sizing:border-box;padding:12px 14px;background:linear-gradient(#14102a,#14102a) padding-box,conic-gradient(from var(--a),#ff4d4d,#ff9f43,#ffd93d,#6bd968,#4dabf7,#9775fa,#e64980,#ff4d4d) border-box;border:3px solid transparent;border-radius:3px;box-shadow:7px 7px 0 #3a1468;animation:rot 4.2s linear infinite}",
    "@keyframes rot{to{--a:360deg}}",
    "#lo canvas#flask{display:block;width:100%;height:210px}",
    "#lo .status{text-align:center;font-size:13px;padding-top:6px;white-space:pre-line;min-height:18px}",
    "#lo .lbl{font:600 14px Silk,monospace;color:" + GOLD + ";margin:2px 0 4px}",
    "#lo .card{display:flex;align-items:center;height:58px;margin-top:8px;padding:0 6px 0 10px;box-sizing:border-box;background:#2c2058;border-top:2px solid #785ddc;border-bottom:4px solid #100a24;cursor:pointer;transition:transform .08s}",
    "#lo .card:active,#lo .btn:active,#lo .add:active{transform:scale(.97)}",
    "#lo .av{width:38px;height:38px;border-radius:50%;background:linear-gradient(#ffc846,#c87800);border:3px solid #18120b;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font:20px Silk,monospace;color:#321e05}",
    "#lo .nm{flex:1;padding-left:10px;min-width:0}",
    "#lo .nm b{display:block;font:17px Silk,monospace;color:#ffe8a0;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    "#lo .nm i{font-style:normal;font-size:12px;color:#aa9b78}",
    "#lo .x{width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:#b47864;font-size:16px}",
    "#lo .add{margin-top:10px;height:46px;display:flex;align-items:center;justify-content:center;font:14px Silk,monospace;color:#0a2e1a;background:#46eb82;border-top:2px solid #b4ffd2;border-bottom:4px solid #12783e;cursor:pointer}",
    "#lo input[type=text],#lo input[type=password]{width:100%;box-sizing:border-box;height:44px;margin-top:8px;padding:0 10px;font-size:16px;color:#ebe6ff;background:#0c091c;border:2px solid #6450be;border-radius:6px;outline:none}",
    "#lo input:focus{border-color:#ffd54a}",
    "#lo label.rem{display:flex;align-items:center;gap:8px;margin:10px 0 8px;font-size:14px}",
    "#lo label.rem input{accent-color:" + GOLD + ";width:18px;height:18px}",
    "#lo .btn{width:100%;height:46px;font:17px Silk,monospace;color:#22123e;background:#ffe042;border:0;border-top:2px solid #fff6aa;border-bottom:4px solid #a87808;cursor:pointer}",
    "#lo .back{text-align:center;font-size:13px;padding:10px 0 4px;cursor:pointer}",
    "#lo .err{text-align:center;font-size:13px;color:#ff5a46;padding-top:6px;min-height:18px}",
    "#lo .shake{animation:shk .4s}",
    "@keyframes shk{20%{transform:translateX(-9px)}40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}",
    "#lo .tv{position:absolute;inset:0;z-index:5;display:none;background:radial-gradient(circle at 50% 44%,#18142c,#080910 75%)}",
    "#lo .tv canvas{position:absolute;inset:0;width:100%;height:100%}",
    "#lo .pop{animation:pop .3s both}",
    "@keyframes pop{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}"
  ].join("\n");
  document.head.appendChild(css);

  var lo = document.createElement("div"); lo.id = "lo";
  lo.innerHTML =
    '<canvas id="lobg"></canvas><div class="col">' +
    '<div class="brand"><canvas id="crown" width="116" height="104" style="width:58px;height:52px"></canvas><div class="title">RAINBOW SCAPE</div></div>' +
    '<div class="panel" id="lopanel">' +
    '<canvas id="flask" width="660" height="420"></canvas><div class="status" id="lost">Loading...</div>' +
    '<div id="loform" style="display:none"><div id="loacc"></div><div id="loman"><div class="lbl">Login</div>' +
    '<input id="lou" type="text" placeholder="Username" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="next">' +
    '<input id="lop" type="password" placeholder="Password" autocomplete="current-password" enterkeyhint="go">' +
    '<label class="rem"><input id="lorem" type="checkbox" checked> Remember me (up to 3 accounts)</label>' +
    '<button class="btn" id="lobtn">Login</button><div class="back" id="loback">&lt; Back to saved accounts</div></div>' +
    '<div class="err" id="loerr"></div></div></div></div>' +
    '<div class="tv" id="lotv"><canvas id="tvc"></canvas></div>';
  document.body.appendChild(lo);
  function $(id) { return document.getElementById(id); }
  var panel = $("lopanel"), flaskC = $("flask"), statusEl = $("lost"), form = $("loform"), accBox = $("loacc"), manBox = $("loman"),
      uEl = $("lou"), pEl = $("lop"), remEl = $("lorem"), errEl = $("loerr"), backEl = $("loback"), tvEl = $("lotv");

  /* ---------------- saved accounts (this browser only) ---------------- */
  var MAX = 3, KEY = "rs-accounts";
  function loadAcc() { try { var a = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(a) ? a.slice(0, MAX) : []; } catch (e) { return []; } }
  function saveAcc(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function ago(t) {
    if (!t) return "not played yet";
    var m = Math.floor((Date.now() - t) / 60000);
    if (m < 1) return "played just now"; if (m < 60) return "played " + m + " min ago";
    if (m < 1440) return "played " + Math.floor(m / 60) + " h ago"; return "played " + Math.floor(m / 1440) + " d ago";
  }

  /* ---------------- state ---------------- */
  var S = { gs: -1, pct: 0, text: "", ms: 0, step: 0, hop: 0, reply: 0, reconn: false, intLogout: false, frames: 0 };
  var shown = false, fading = false, manual = false, prefilled = false, inWorld = false, attempting = false, sawBusy = false;
  var loggingOut = false, enterWait = false, logoutAt = 0, enterAt = 0, g30At = 0, g30Frames = -1, attemptAt = 0, lastLoadChange = 0, lastLoadKey = "";
  var lastUser = "", lastPass = "", lastRemember = true, mode = "load";
  var pending = "";

  function replyText(r) {
    switch (r) {
      case 3: return "Invalid username or password.";
      case 4: return "Your account has been disabled.";
      case 5: return "Your account is already logged in. Try again in a minute.";
      case 6: case 14: return "The server is being updated. Try again in a minute.";
      case 7: return "This world is full.";
      case 9: case 16: return "Too many login attempts. Wait and try again.";
      case 12: return "This world needs a members account.";
      case 18: return "Your account is locked.";
      case 26: return "Your connection has been blocked.";
      case -4: case 8: case 10: case 11: case 20: case 23: case -5: return "Unable to connect to the server.";
      default: return "Login failed (code " + r + ").";
    }
  }
  function shake() { panel.classList.remove("shake"); void panel.offsetWidth; panel.classList.add("shake"); }

  function submit() {
    if (attempting) return;
    var u = uEl.value.trim(), p = pEl.value;
    if (!u || !p) { errEl.textContent = "Please enter your username and password."; return; }
    try { document.activeElement && document.activeElement.blur(); } catch (e) {}
    errEl.textContent = ""; attempting = true; sawBusy = false; attemptAt = Date.now();
    lastUser = u; lastPass = p; lastRemember = remEl.checked;
    pending = u + "\u0001" + p + "\u0001" + (lastRemember ? "1" : "0");
  }
  $("lobtn").onclick = submit;
  pEl.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } });
  uEl.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); pEl.focus(); } });
  backEl.onclick = function () { manual = false; errEl.textContent = ""; refreshAcc(); animIn(); };

  function refreshAcc() {
    var accs = loadAcc(), showList = accs.length > 0 && !manual;
    accBox.innerHTML = "";
    if (showList) {
      var h = document.createElement("div"); h.className = "lbl"; h.textContent = "Choose an account"; accBox.appendChild(h);
      accs.forEach(function (a, i) {
        var c = document.createElement("div"); c.className = "card pop"; c.style.animationDelay = (90 * i) + "ms";
        c.innerHTML = '<div class="av"></div><div class="nm"><b></b><i></i></div><div class="x">✕</div>';
        c.querySelector(".av").textContent = a.u.charAt(0).toUpperCase();
        c.querySelector("b").textContent = a.u; c.querySelector("i").textContent = "Saved  -  " + ago(a.t);
        c.querySelector(".x").onclick = function (e) {
          e.stopPropagation();
          if (confirm("Forget " + a.u + "?")) { saveAcc(loadAcc().filter(function (z) { return z.u.toLowerCase() !== a.u.toLowerCase(); })); refreshAcc(); }
        };
        c.onclick = function () { uEl.value = a.u; pEl.value = a.p; remEl.checked = true; submit(); };
        accBox.appendChild(c);
      });
      if (accs.length < MAX) {
        var add = document.createElement("div"); add.className = "add pop"; add.style.animationDelay = (90 * accs.length) + "ms"; add.textContent = "+  ADD ACCOUNT";
        add.onclick = function () { manual = true; uEl.value = ""; pEl.value = ""; errEl.textContent = ""; refreshAcc(); animIn(); };
        accBox.appendChild(add);
      }
    }
    accBox.style.display = showList ? "block" : "none";
    manBox.style.display = showList ? "none" : "block";
    backEl.style.display = accs.length ? "block" : "none";
  }
  function animIn() { form.classList.remove("pop"); void form.offsetWidth; form.classList.add("pop"); }

  /* ---------------- show / hide ---------------- */
  var raf = 0;
  function show() {
    if (shown && !fading) return;
    fading = false; lo.style.transition = "none"; lo.style.opacity = "1"; lo.style.display = "block"; shown = true;
    var s = document.getElementById("status"); if (s) s.style.display = "none";
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function hideNow() { lo.style.display = "none"; lo.style.opacity = "1"; shown = false; fading = false; tvEl.style.display = "none"; }
  function fadeOut() {
    if (!shown || fading) return;
    fading = true; lo.style.transition = "opacity .38s"; lo.style.opacity = "0";
    setTimeout(function () { if (fading) { hideNow(); } }, 400);
  }
  function showTv(t) { tvText = t; tvEl.style.display = "block"; }
  function hideTv() { tvEl.style.display = "none"; }
  var tvText = "";
  function setMode(m) {
    mode = m;
    flaskC.style.display = (m === "load" || m === "busy") ? "block" : "none";
    form.style.display = m === "form" ? "block" : "none";
  }

  /* ---------------- the state machine (same flow as the app) ---------------- */
  function update() {
    var gs = S.gs, now = Date.now();
    if (gs === 30 && S.intLogout && !loggingOut) { loggingOut = true; logoutAt = now; enterWait = false; }
    if (loggingOut) {
      if (gs === 30 && now - logoutAt > 6000) { loggingOut = false; }
      else if (gs !== 30 || S.intLogout) {
        inWorld = false;
        if (gs === 10 && now - logoutAt > 1300) { loggingOut = false; hideTv(); }
        else { if (!shown || fading) { show(); lo.style.opacity = "0"; lo.style.transition = "opacity .22s"; requestAnimationFrame(function () { lo.style.opacity = "1"; }); } setMode("none"); showTv("Logging out..."); return; }
      }
    }
    if (gs !== 30) g30Frames = -1;
    if (gs === 30) {
      inWorld = true; attempting = false;
      if (g30Frames < 0) {
        g30Frames = S.frames; g30At = now;
        if (lastUser && lastRemember) {   // the server accepted the login: remember it
          var l = loadAcc().filter(function (z) { return z.u.toLowerCase() !== lastUser.toLowerCase(); });
          l.unshift({ u: lastUser, p: lastPass, t: now }); saveAcc(l.slice(0, MAX));
        }
      }
      if (shown && !fading && (S.frames - g30Frames < 12 || now - g30At < 500)) return;
      if (shown && !fading) { try { document.activeElement && document.activeElement.blur(); } catch (e) {} enterWait = false; fadeOut(); setTimeout(hideTv, 420); }
      return;
    }
    if (gs === 40) { if (shown) hideNow(); return; }
    if (gs > 10 && gs < 30 && inWorld) { if (shown) hideNow(); return; }
    if (gs <= 10) inWorld = false;
    if (!shown || fading) show();
    if (gs < 10 || gs === 1000) {
      hideTv(); setMode("load");
      var t = S.text || "Loading..."; var key = S.pct + "|" + t + "|" + gs + "|" + S.ms;
      if (key !== lastLoadKey) { lastLoadKey = key; lastLoadChange = now; }
      statusEl.textContent = (now - lastLoadChange > 15000) ? t + "\nStill waiting for the server... check your connection." : t;
      flaskPct = S.pct; return;
    }
    if (gs === 10) {
      if (!prefilled) { prefilled = true; manual = false; refreshAcc(); }
      if (S.reconn) { hideTv(); setMode("busy"); flaskPct = -1; statusEl.textContent = "Connection lost. Reconnecting..."; return; }
      if (attempting) {
        if (S.step !== 0 || S.hop !== 0) sawBusy = true;
        if (sawBusy && S.step === 0 && S.hop === 0) {
          attempting = false;
          if (S.reply !== 2) { errEl.textContent = replyText(S.reply); shake(); } else { enterWait = true; enterAt = now; }
        } else if (!sawBusy && now - attemptAt > 6000) { attempting = false; errEl.textContent = "Unable to connect to the server."; shake(); }
      }
      if (enterWait && now - enterAt < 25000) { setMode("none"); showTv("Entering Rainbow Scape..."); return; }
      enterWait = false;
      if (attempting) { hideTv(); setMode("busy"); flaskPct = -1; statusEl.textContent = "Logging in..."; }
      else {
        hideTv();
        if (mode !== "form") { setMode("form"); if (!inWorld) refreshAcc(); animIn(); }
        statusEl.textContent = "Welcome to Rainbow Scape";
      }
      return;
    }
    setMode("none"); showTv("Entering Rainbow Scape...");
  }

  var lastRun = 0;
  window.rs = window.rs || {};
  window.rs.ls = function (gs, pct, text, ms, step, hop, reply, reconn, intLogout, frames) {
    if (/[?&]debug/.test(location.search)) { var tn = Date.now(); if (!window.__f0) { window.__f0 = tn; window.__ff = frames; } else if (tn - window.__f0 >= 3000) { console.log("[rs] game " + Math.round((frames - window.__ff) * 1000 / (tn - window.__f0)) + " fps, canvas " + (document.querySelector("canvas") || {}).width + "x" + (document.querySelector("canvas") || {}).height); window.__f0 = tn; window.__ff = frames; } }
    S.gs = gs; S.pct = pct; S.text = text; S.ms = ms; S.step = step; S.hop = hop; S.reply = reply; S.reconn = !!reconn; S.intLogout = !!intLogout; S.frames = frames;
    var n = Date.now(); if (n - lastRun < 100) return; lastRun = n;
    try { update(); } catch (e) { console.log("login ui: " + e); }
  };
  window.rs.takeLogin = function () { var p = pending; pending = ""; return p; };

  /* ---------------- drawing ---------------- */
  var bg = $("lobg"), bctx = bg.getContext("2d"), cc = $("crown").getContext("2d"), fx = flaskC.getContext("2d"), tvc = $("tvc"), tx = tvc.getContext("2d");
  var flaskPct = 0, shownFill = 0, t0 = Date.now(), lastHerb = -1, dropHerb = -1, dropStart = 0, landed = false, splashAt = 0, nb = 0;
  var col = [110, 120, 130], target = [110, 120, 130];
  var sparks = [[-34, 18, 11, 0], [112, 34, 13, 1.7], [-26, 76, 9, 3.1], [108, 92, 8, 4.4], [20, -2, 7, 2.2], [82, 8, 6, 5.3], [-8, 110, 6, 0.9], [96, 120, 7, 3.8]];
  function rnd(i, a, b) { return Math.abs(Math.sin(i * a) * b) % 1; }

  function drawBg(now) {
    var w = lo.clientWidth, h = lo.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    if (bg.width !== (w * dpr | 0)) { bg.width = w * dpr | 0; bg.height = h * dpr | 0; }
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0); bctx.fillStyle = "#010103"; bctx.fillRect(0, 0, w, h);
    for (var i = 0; i < 36; i++) {
      var tw = 0.5 + 0.5 * Math.sin(now / 900 + i * 2.1);
      bctx.fillStyle = "hsla(" + (i * 37) % 360 + ",60%,70%," + ((40 + 150 * tw) / 255).toFixed(2) + ")";
      bctx.beginPath(); bctx.arc(w * rnd(i, 12.9898, 43758.5453), h * rnd(i, 78.233, 12345.6789), 0.7 + (i % 3) * 0.35, 0, 6.3); bctx.fill();
    }
    for (var k = 0; k < 2; k++) {
      var tt = now + k * 2000, n = Math.floor(tt / 4000), u = (tt % 4000) / 1100; if (u > 1) continue;
      var rx = rnd(n * 91.7 + k * 5, 1, 4375.5), ry = rnd(n * 47.3 + k * 9, 1, 2371.1);
      var x1 = w * (0.05 + 0.6 * rx) + u * w * 0.38, y1 = h * (0.03 + 0.4 * ry) + u * h * 0.30, x0 = x1 - w * 0.13, y0 = y1 - h * 0.10;
      var fade = Math.sin(u * Math.PI), g = bctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, "hsla(" + ((n * 67 + k * 140) % 360 + u * 200) % 360 + ",50%,75%," + fade.toFixed(2) + ")");
      bctx.strokeStyle = g; bctx.lineWidth = 2.2; bctx.lineCap = "round"; bctx.beginPath(); bctx.moveTo(x0, y0); bctx.lineTo(x1, y1); bctx.stroke();
    }
  }

  function drawCrown(now) {
    var c = cc, W = 116, H = 104; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, W, H);
    var w = 58, h = 52, sc = Math.min((w - 10) / 72, (h - 14) / 58), ox = (w - 72 * sc) / 2, oy = (h - 58 * sc) / 2 + 2;
    var pt = [[4, 58], [0, 8], [18, 30], [36, 0], [54, 30], [72, 8], [68, 58]];
    c.beginPath(); pt.forEach(function (p, i) { var x = ox + p[0] * sc, y = oy + p[1] * sc; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath();
    var pulse = 0.55 + 0.45 * Math.sin(now / 420), shift = (now % 2600) / 2600 * 72 * sc;
    var cols = ["#ff3b3b", "#ff8a2b", "#ffd23f", "#3ddc6b", "#2da8ff", "#6b4dff", "#c23bff", "#ff3b3b"];
    var g = c.createLinearGradient(ox - shift, 0, ox - shift + 72 * sc, 0); cols.forEach(function (cl, i) { g.addColorStop(i / 7, cl); });
    c.save(); c.shadowColor = "rgba(255,255,255," + (0.4 + 0.5 * pulse) + ")"; c.shadowBlur = 8; c.fillStyle = g; c.fill(); c.restore();
    c.strokeStyle = "#fff"; c.lineWidth = Math.max(1.5, sc * 2.2); c.lineJoin = "round"; c.stroke();
    for (var i = 0; i < 4; i++) {
      var t = Math.sin(now / 300 + i * 1.9); if (t < 0.2) continue;
      c.fillStyle = "rgba(255,255,255," + t.toFixed(2) + ")"; c.beginPath(); c.arc(ox + (8 + i * 18) * sc, oy + (i % 2 ? 22 : 6) * sc, 1 + t * 1.6, 0, 6.3); c.fill();
    }
  }

  function star(c, cx, cy, r) {
    c.beginPath(); for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4, rr = i % 2 ? r * 0.28 : r; c.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } c.closePath(); c.fill();
  }
  function herb(c, idx, x, y, s, rot, alpha) {
    c.save(); c.translate(x, y); c.rotate(rot * Math.PI / 180); c.globalAlpha = alpha / 255;
    c.fillStyle = HERB_LEAF[idx];
    [[-5, 2, -0.7], [5, 2, 0.7], [0, -3, 0], [-3, 8, -0.3], [3, 8, 0.3]].forEach(function (l) { c.save(); c.translate(l[0] * s, l[1] * s); c.rotate(l[2]); c.beginPath(); c.ellipse(0, 0, 2.2 * s, 5 * s, 0, 0, 6.3); c.fill(); c.restore(); });
    if (HERB_FLOWER[idx]) { c.fillStyle = HERB_FLOWER[idx]; c.beginPath(); c.arc(0, -8 * s, 2.2 * s, 0, 6.3); c.fill(); }
    c.restore();
  }

  function drawFlask(now) {
    if (flaskC.style.display === "none") return;
    var c = fx; c.setTransform(2, 0, 0, 2, 0, 0); var W = 330, H = 210; c.clearRect(0, 0, W, H);
    var t = (now - t0) / 1000, ox = W / 2 - 45, oy = 26, pct = flaskPct, frac, herbNow;
    if (pct >= 0) { shownFill += (Math.min(100, pct) / 100 - shownFill) * 0.12; frac = 0.05 + 0.95 * shownFill; herbNow = Math.min(13, Math.floor(Math.min(100, pct) * 14 / 100)); }
    else { frac = 0.5 + 0.12 * Math.sin(t * 2.2); herbNow = Math.floor(t / 1.6) % 14; }
    if (dropHerb >= 0 && now - dropStart > 700) dropHerb = -1;
    if (dropHerb < 0) {
      if (pct < 0 && herbNow !== lastHerb) { lastHerb = herbNow; dropHerb = herbNow; dropStart = now; landed = false; }
      else if (pct >= 0 && lastHerb < herbNow) { lastHerb++; dropHerb = lastHerb; dropStart = now; landed = false; }
    }
    var prog = dropHerb >= 0 ? (now - dropStart) / 700 : 1;
    if (dropHerb >= 0 && !landed && prog > 0.62) { landed = true; splashAt = now; target = HERB_POTION[dropHerb].slice(); }
    for (var i = 0; i < 3; i++) col[i] += (target[i] - col[i]) * 0.06;
    var splash = Math.max(0, 1 - (now - splashAt) / 900);
    var flask = new Path2D();
    flask.moveTo(ox + 34, oy + 14); flask.lineTo(ox + 56, oy + 14); flask.lineTo(ox + 56, oy + 46); flask.lineTo(ox + 85, oy + 100);
    flask.quadraticCurveTo(ox + 92, oy + 118, ox + 74, oy + 118); flask.lineTo(ox + 16, oy + 118); flask.quadraticCurveTo(ox - 2, oy + 118, ox + 5, oy + 100); flask.lineTo(ox + 34, oy + 46); flask.closePath();
    sparks.forEach(function (k) { var tw = 0.5 + 0.5 * Math.sin(t * 2.6 + k[3]); c.fillStyle = "rgba(170,205,255," + ((60 + 195 * tw) / 255).toFixed(2) + ")"; star(c, ox + k[0], oy + k[1], k[2] * (0.55 + 0.6 * tw)); });
    c.fillStyle = "rgba(200,225,255,.18)"; c.fill(flask);
    var top = 118 - (118 - 48) * Math.min(1, frac);
    c.save(); c.clip(flask);
    var lg = c.createLinearGradient(0, oy + top, 0, oy + 118);
    lg.addColorStop(0, "rgb(" + col.map(Math.round).join(",") + ")"); lg.addColorStop(1, "rgb(" + col.map(function (v) { return Math.round(v * 0.55); }).join(",") + ")");
    c.fillStyle = lg; c.beginPath(); c.moveTo(ox - 5, oy + 124);
    var amp = 1.8 + 4.5 * splash;
    for (var x = -5; x <= 95; x += 4) c.lineTo(ox + x, oy + top + amp * Math.sin(t * (3 + 5 * splash) + x * 0.16));
    c.lineTo(ox + 95, oy + 124); c.closePath(); c.fill();
    c.fillStyle = "rgba(255,255,255,.6)";
    var nBub = 5 + Math.floor(6 * splash);
    for (var b = 0; b < nBub; b++) { var ph = (t * (0.35 + 0.07 * (b % 5)) + b * 0.37) % 1; c.beginPath(); c.arc(ox + 26 + (b % 7) * 6 + 3 * Math.sin(t * 2 + b), oy + 116 - (116 - top) * ph, 1.4 + (b % 3) * 0.7, 0, 6.3); c.fill(); }
    c.fillStyle = "rgba(255,255,255,.43)"; c.fillRect(ox, oy + top - 0.5, 90, 1.7);
    c.restore();
    c.fillStyle = "rgba(255,255,255,.37)"; c.beginPath(); c.moveTo(ox + 30, oy + 62); c.lineTo(ox + 36, oy + 56); c.lineTo(ox + 18, oy + 98); c.lineTo(ox + 13, oy + 98); c.closePath(); c.fill();
    c.lineWidth = 2.2; c.lineJoin = "round"; c.strokeStyle = "rgba(225,238,255,.9)"; c.stroke(flask);
    c.fillStyle = "#e4eeff"; c.fillRect(ox + 28, oy + 11, 34, 9); c.fillStyle = "#96aacd"; c.fillRect(ox + 28, oy + 18, 34, 2);
    c.save(); c.translate(ox + 80, oy + 4); c.rotate(24 * Math.PI / 180); c.fillStyle = "#b0943e"; c.fillRect(-13, -7, 26, 15); c.fillStyle = "#786226"; c.fillRect(-13, 4, 26, 4); c.restore();
    if (dropHerb >= 0) {
      var k = Math.min(1, prog / 0.62), hy = -34 + 58 * k * k, sc = prog > 0.62 ? Math.max(0.2, 1 - (prog - 0.62) / 0.38 * 0.8) : 1, al = prog > 0.62 ? 255 * (1 - (prog - 0.62) / 0.38) : 255;
      herb(c, dropHerb, ox + 45, oy + hy, 3.3 * sc / 3, 18 * Math.sin(prog * 9) + 200 * prog, Math.max(0, al));
    }
    c.textAlign = "center"; c.font = "20px Silk,monospace";
    if (pct >= 0) { c.fillStyle = "#fff"; c.shadowColor = "#000"; c.shadowBlur = 3; c.shadowOffsetX = 1; c.shadowOffsetY = 1; c.fillText(Math.min(100, pct) + "%", W / 2, oy + 148); c.shadowColor = "transparent"; }
    if (lastHerb >= 0 || pct < 0) { c.font = "12px Silk,monospace"; c.fillStyle = "rgba(255,214,130,.86)"; c.fillText("Adding " + HERB_NAME[dropHerb >= 0 ? dropHerb : Math.max(0, lastHerb)], W / 2, oy + 166); }
  }

  function drawTv(now) {
    if (tvEl.style.display === "none") return;
    var w = tvEl.clientWidth, h = tvEl.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    if (tvc.width !== (w * dpr | 0)) { tvc.width = w * dpr | 0; tvc.height = h * dpr | 0; }
    var c = tx; c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
    var cx = w / 2, cy = h * 0.44, r = Math.min(w, h) * 0.13, a0 = (now % 1700) / 1700 * 6.283;
    c.lineWidth = r * 0.30; c.lineCap = "round";
    for (var i = 0; i < 40; i++) { var f = i / 39; c.strokeStyle = "hsla(" + f * 300 + ",75%,60%," + f.toFixed(2) + ")"; c.beginPath(); c.arc(cx, cy, r, a0 + f * 5.2, a0 + (f + 0.03) * 5.2 + 0.02); c.stroke(); }
    for (var k = 0; k < 3; k++) {
      var ang = -(now % 3200) / 3200 * 6.283 + k * 2.094, ox = cx + Math.cos(ang) * r * 1.65, oy = cy + Math.sin(ang) * r * 1.65, hue = (k * 120 + (now % 3600) / 10) % 360;
      c.fillStyle = "hsla(" + hue + ",60%,70%,.27)"; c.beginPath(); c.arc(ox, oy, r * 0.16, 0, 6.3); c.fill(); c.fillStyle = "hsl(" + hue + ",60%,70%)"; c.beginPath(); c.arc(ox, oy, r * 0.07, 0, 6.3); c.fill();
    }
    var pulse = 0.65 + 0.35 * Math.sin(now / 380);
    c.textAlign = "center"; c.font = Math.min(w, h) * 0.055 + "px Silk,monospace"; c.shadowColor = "#000"; c.shadowBlur = 2; c.shadowOffsetX = 1; c.shadowOffsetY = 1;
    c.fillStyle = "rgba(255,214,90," + pulse.toFixed(2) + ")"; c.fillText(tvText, cx, cy + r * 2.55);
    c.shadowColor = "transparent"; c.font = Math.min(w, h) * 0.034 + "px Silk,monospace"; c.fillStyle = "rgba(200,190,230,.75)"; c.fillText("Rainbow Scape", cx, cy + r * 3.5);
  }

  function frame() {
    raf = 0; if (!shown) return;
    var now = Date.now(); drawBg(now); drawCrown(now); drawFlask(now); drawTv(now);
    raf = requestAnimationFrame(frame);
  }
})();
