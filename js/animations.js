/* ==========================================================================
   Sung Lab Website — Animation Engine
   護理創新及專科訓練研究室 (Nursing Innovation & NP Training Lab)
   initReveal(), initCounters()
   ========================================================================== */

/* --------------------------------------------------------------------------
   Shared: prefers-reduced-motion check
   -------------------------------------------------------------------------- */
function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* --------------------------------------------------------------------------
   initReveal — IntersectionObserver adds .in to .reveal elements.
   Elements sharing a data-reveal-group are staggered 0.1s apart via
   transition-delay. Under reduced motion, all .reveal elements are made
   visible immediately with no delay/stagger.
   -------------------------------------------------------------------------- */
function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if (prefersReducedMotion()) {
    elements.forEach((el) => {
      el.classList.add("in");
    });
    return;
  }

  // Assign staggered transition-delay within each data-reveal-group
  const groups = {};
  elements.forEach((el) => {
    const group = el.dataset.revealGroup;
    if (!group) return;
    if (!groups[group]) groups[group] = [];
    groups[group].push(el);
  });

  Object.values(groups).forEach((group) => {
    group.forEach((el, index) => {
      el.style.transitionDelay = `${index * 0.1}s`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   initCounters — [data-count] elements count from 0 to their target value
   once when scrolled into view. Under reduced motion, the final value is
   shown instantly with no animation.
   -------------------------------------------------------------------------- */
function initCounters() {
  const elements = document.querySelectorAll("[data-count]");
  if (!elements.length) return;

  const reduceMotion = prefersReducedMotion();

  elements.forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    if (Number.isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          const duration = 1200;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.round(progress * target);
            el.textContent = String(value);
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = String(target);
            }
          }

          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
  });
}
