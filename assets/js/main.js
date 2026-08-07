/* ============================================================
   小姚 · 接入本地 macOS — interaction layer
   boot · kinetic type · cursor · magnetic · horizontal scroll
   ============================================================ */
(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Lucide icons ---------- */
  function paintIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", paintIcons);
  } else {
    paintIcons();
  }
  window.addEventListener("load", paintIcons);

  /* ---------- Boot / access sequence ---------- */
  (function boot() {
    const el = $("#boot");
    if (!el) return;
    const lines = $$(".boot__line", el);
    if (reduced) {
      el.classList.add("is-done");
      return;
    }
    lines.forEach((l, i) => {
      setTimeout(() => l.classList.add("show"), 300 + i * 420);
    });
    setTimeout(
      () => el.classList.add("is-done"),
      300 + lines.length * 420 + 550
    );
  })();

  /* ---------- Custom cursor ---------- */
  (function cursor() {
    if (reduced) return;
    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    if (!dot || !ring) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    const hot = "a, button, [data-magnetic], .project-card, .bento__card";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hot)) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hot)) ring.classList.remove("is-hover");
    });
  })();

  /* ---------- Magnetic ---------- */
  (function magnetic() {
    if (reduced) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.16;
        const y = (e.clientY - r.top - r.height / 2) * 0.24;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  })();

  /* ---------- Kinetic split + reveal ---------- */
  function splitKinetic(el) {
    // keep <br>, wrap each character of text nodes
    const walk = (node) => {
      const kids = Array.from(node.childNodes);
      kids.forEach((child) => {
        if (child.nodeType === 3) {
          const text = child.textContent;
          const frag = document.createDocumentFragment();
          for (const ch of text) {
            if (ch === " ") {
              frag.appendChild(document.createTextNode(" "));
              continue;
            }
            const s = document.createElement("span");
            s.className = "kinetic-char";
            s.textContent = ch;
            frag.appendChild(s);
          }
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          walk(child);
        }
      });
    };
    walk(el);
  }

  (function kinetic() {
    const targets = $$("[data-kinetic]");
    targets.forEach((el) => {
      el.removeAttribute("data-reveal"); // avoid double-hide
      if (!reduced) splitKinetic(el);
    });

    if (reduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const chars = $$(".kinetic-char", el);
          chars.forEach((c, i) => {
            c.style.transitionDelay = (i * 18) + "ms";
            c.classList.add("in");
          });
          io.unobserve(el);
        });
      },
      { threshold: 0.25 }
    );
    targets.forEach((t) => io.observe(t));
  })();

  (function reveal() {
    const items = $$("[data-reveal]");
    if (reduced) {
      items.forEach((i) => i.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((i) => io.observe(i));
  })();

  /* ---------- Scroll progress + nav state ---------- */
  (function scrollUI() {
    const bar = $("#progressBar");
    const nav = $("#nav");
    const links = $$(".nav__links a");
    const sections = links
      .map((a) => $(a.getAttribute("href")))
      .filter(Boolean);

    let ticking = false;
    function update() {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      if (nav) nav.classList.toggle("scrolled", y > 40);

      let current = "";
      sections.forEach((sec) => {
        if (sec.offsetTop - 120 <= y) current = sec.id;
      });
      links.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + current);
      });
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  })();

  /* ---------- Projects horizontal scroll ---------- */
  (function horizontal() {
    const projects = $("#projects");
    const sticky = $(".projects__sticky");
    const track = $("#track");
    if (!projects || !sticky || !track || reduced) return;

    let distance = 0;

    function measure() {
      const vw = innerWidth;
      const trackW = track.scrollWidth;
      distance = Math.max(0, trackW - vw);
      if (distance <= 0) {
        projects.style.height = "";
        track.style.transform = "";
        return;
      }
      const stickyTop = sticky.offsetTop;
      projects.style.height = stickyTop + innerHeight + distance + "px";
    }

    function onScroll() {
      if (distance <= 0) return;
      const start = projects.offsetTop + sticky.offsetTop;
      const p = clamp((window.scrollY - start) / distance, 0, 1);
      track.style.transform = `translate3d(${-p * distance}px, 0, 0)`;
    }

    let raf = false;
    window.addEventListener(
      "scroll",
      () => {
        if (raf) return;
        raf = true;
        requestAnimationFrame(() => {
          onScroll();
          raf = false;
        });
      },
      { passive: true }
    );

    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        measure();
        onScroll();
      }, 200);
    });

    // measure after fonts + icons settle
    measure();
    onScroll();
    window.addEventListener("load", () => {
      measure();
      onScroll();
    });
    setTimeout(() => {
      measure();
      onScroll();
    }, 800);
  })();

  /* ---------- Copy email ---------- */
  (function copyEmail() {
    const btn = $("#copyEmail");
    if (!btn) return;
    const tip = $("#copiedTip");
    btn.addEventListener("click", () => {
      const email = btn.getAttribute("data-email");
      const done = () => {
        if (tip) {
          tip.classList.add("show");
          setTimeout(() => tip.classList.remove("show"), 1600);
        }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(() => fallback());
      } else {
        fallback();
      }
      function fallback() {
        const ta = document.createElement("textarea");
        ta.value = email;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  })();

  /* ---------- Uptime ticker (decorative) ---------- */
  (function uptime() {
    const el = $("#uptime");
    if (!el) return;
    let secs = 142 * 86400 + 7 * 3600 + 23 * 60; // arbitrary base
    function fmt() {
      const d = Math.floor(secs / 86400);
      const h = Math.floor((secs % 86400) / 3600);
      const m = Math.floor((secs % 3600) / 60);
      return `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
    }
    el.textContent = fmt();
    if (!reduced) setInterval(() => { secs += 1; el.textContent = fmt(); }, 60000);
  })();
})();
