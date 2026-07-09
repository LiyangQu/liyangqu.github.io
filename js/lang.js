document.addEventListener("DOMContentLoaded", () => {
  const switcher = document.querySelector(".lang-switcher");
  if (!switcher) return;

  /* =========================
     1. 页面加载时：读取记忆
  ========================= */
  const savedLang = localStorage.getItem("lang") || "en";
  applyLang(savedLang);

  /* =========================
     2. 点击切换语言
  ========================= */
  switcher.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-lang");
    const next = current === "en" ? "zh" : "en";
    applyLang(next);
  });

  /* =========================
     3. 应用语言（核心函数）
  ========================= */
  function applyLang(lang) {
    // 设置 HTML 属性（驱动 CSS）
    document.documentElement.setAttribute("data-lang", lang);

    // 记住用户选择
    localStorage.setItem("lang", lang);

    // 同步横栏语言高亮
    document.querySelectorAll(".lang").forEach(el => {
      el.classList.toggle("active", el.classList.contains(lang));
    });
  }
});