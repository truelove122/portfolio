(function () {
  "use strict";

  /* ---------- 顶部进度条 ---------- */
  var bar = document.querySelector(".bar i");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    bar.style.width = (p * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 吸顶导航 ---------- */
  var topnav = document.getElementById("topnav");
  var heroEl = document.querySelector(".hero");
  function navState() {
    var y = window.scrollY || document.documentElement.scrollTop;
    topnav.classList.toggle("is-on", y > heroEl.offsetHeight * 0.7);
  }
  window.addEventListener("scroll", navState, { passive: true });
  navState();

  /* ---------- 贴图 / 低模 切换 ---------- */
  document.querySelectorAll(".work").forEach(function (work) {
    var tabs = work.querySelectorAll(".tab");
    var panels = work.querySelectorAll(".panel");
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var grp = tab.getAttribute("data-grp");
        tabs.forEach(function (t) { t.classList.toggle("is-on", t === tab); });
        panels.forEach(function (p) {
          p.classList.toggle("is-on", p.getAttribute("data-panel") === grp);
        });
      });
    });
  });

  /* ---------- 灯箱 ---------- */
  var lb = document.getElementById("lb");
  if (!lb) return;
  var lbImg = lb.querySelector("img");
  var lbCap = lb.querySelector("figcaption");
  var items = [];
  var current = -1;

  function collect() {
    items = Array.prototype.slice.call(document.querySelectorAll("[data-full]"));
  }

  function open(el) {
    collect();
    current = items.indexOf(el);
    show();
    lb.classList.add("is-on");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function show() {
    var el = items[current];
    if (!el) return;
    lbImg.src = el.getAttribute("data-full");
    lbCap.textContent = el.getAttribute("data-cap") || "";
  }

  function close() {
    lb.classList.remove("is-on");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.removeAttribute("src");
  }

  function step(n) {
    if (!items.length) return;
    current = (current + n + items.length) % items.length;
    show();
  }

  collect();
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("[data-full]") : null;
    if (el) { open(el); }
  });
  lb.querySelector(".lb__close").addEventListener("click", close);
  lb.querySelector(".lb__prev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
  lb.querySelector(".lb__next").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });

  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-on")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* 触屏左右滑 */
  var sx = null;
  lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) step(dx > 0 ? -1 : 1);
    sx = null;
  }, { passive: true });

  /* ---------- 进入视口淡入 ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = 1;
          en.target.style.transform = "none";
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    document.querySelectorAll(".shot, .tile, .drill, .work__head, .end h2").forEach(function (el) {
      el.style.opacity = 0;
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity .6s ease, transform .6s ease";
      io.observe(el);
    });
  }
})();
