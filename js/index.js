(function () {
  "use strict";

  var STORAGE_KEY = "tasreh:last-permit";

  var permit = null;
  try {
    permit = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    permit = null;
  }

  if (!permit || !permit.number) return;

  var modal = document.createElement("div");
  modal.className = "home-success-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "home-success-title");
  modal.innerHTML =
    '<div class="home-success-card">' +
    '<div class="home-success-mark" aria-hidden="true">✓</div>' +
    '<span class="home-success-eyebrow">تم استلام طلبك</span>' +
    '<h2 id="home-success-title">تم إرسال التصريح بنجاح</h2>' +
    "<p>سيتم مراجعة <strong></strong> من الجهة المختصة.</p>" +
    '<div class="home-success-number"><span>رقم التصريح</span><strong></strong></div>' +
    '<button type="button" class="home-success-close">إغلاق</button>' +
    "</div>";

  modal.querySelector("p strong").textContent = permit.type || "التصريح";
  modal.querySelector(".home-success-number strong").textContent = permit.number;

  var closeButton = modal.querySelector(".home-success-close");

  function close() {
    modal.remove();
    document.body.classList.remove("home-modal-open");
    document.removeEventListener("keydown", onKeydown);
  }

  function onKeydown(event) {
    if (event.key === "Escape") close();
  }

  closeButton.addEventListener("click", close);
  document.addEventListener("keydown", onKeydown);

  document.body.appendChild(modal);
  document.body.classList.add("home-modal-open");
  closeButton.focus();
})();
