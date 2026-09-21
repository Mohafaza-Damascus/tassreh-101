(function () {
  "use strict";

  var SESSION_KEY = "tasreh:excavation-user";
  var LOGIN_PAGE = "excavation-login.html";
  var STORAGE_KEY = "tasreh:last-permit";

  function hasSession() {
    try {
      return Boolean(JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"));
    } catch (error) {
      return false;
    }
  }

  if (!hasSession()) {
    window.location.replace(LOGIN_PAGE);
    return;
  }

  function setupGps() {
    var button = document.querySelector("[data-gps-button]");
    var input = document.querySelector("[data-gps-target]");
    var status = document.querySelector("[data-gps-status]");
    if (!button || !input || !status) return;

    function setStatus(message, isError) {
      status.textContent = message;
      status.classList.toggle("is-error", Boolean(isError));
    }

    button.addEventListener("click", function () {
      if (!navigator.geolocation) {
        setStatus("متصفحك لا يدعم خاصية تحديد الموقع (GPS).", true);
        return;
      }

      button.disabled = true;
      setStatus("جاري جلب الإحداثيات...", false);

      navigator.geolocation.getCurrentPosition(
        function (position) {
          button.disabled = false;
          input.value =
            "موقع GPS: " +
            position.coords.latitude.toFixed(6) +
            ", " +
            position.coords.longitude.toFixed(6);
          setStatus("تم تحديد الموقع بنجاح عبر GPS ✓", false);
        },
        function () {
          button.disabled = false;
          setStatus(
            "تعذر الحصول على الموقع، يرجى تفعيل الـ GPS وإعطاء الإذن أو الكتابة يدوياً.",
            true
          );
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  function makePermitNumber() {
    var now = new Date();
    var date =
      String(now.getFullYear()) +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");
    return "TSR-" + date + "-" + Math.floor(1000 + Math.random() * 9000);
  }

  function setupSubmit() {
    var form = document.querySelector("[data-permit-form]");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            type: form.getAttribute("data-permit-form") || "التصريح",
            number: makePermitNumber()
          })
        );
      } catch (storageError) {}

      window.location.assign(form.getAttribute("data-permit-home") || "../index.html");
    });
  }

  setupGps();
  setupSubmit();
})();
