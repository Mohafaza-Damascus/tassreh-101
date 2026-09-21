(function () {
  "use strict";

  var STORAGE_KEY = "tasreh:excavation-user";
  var REDIRECT = "excavation.html";

  var form = document.getElementById("elogin-form");
  var username = document.getElementById("government_username");
  var password = document.getElementById("government_password");
  var error = document.getElementById("elogin-error");
  if (!form || !username || !password) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var hasUsername = username.value.trim();
    var hasPassword = password.value.trim();

    if (!hasUsername || !hasPassword) {
      if (error) error.hidden = false;
      (hasUsername ? password : username).focus();
      return;
    }

    if (error) error.hidden = true;

    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ name: username.value.trim(), time: Date.now() })
      );
    } catch (storageError) {}

    window.location.assign(REDIRECT);
  });
})();
