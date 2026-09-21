(function () {
  "use strict";

  var STORAGE_KEY = "tasreh:last-permit";
  var NAME_PATTERN = /^([^[]+)\[\d+\]\[([^\]]+)\]$/;

  function setupWizard() {
    var steps = Array.prototype.slice.call(document.querySelectorAll("[data-step]"));
    if (steps.length < 2) return;

    var stepButtons = Array.prototype.slice.call(
      document.querySelectorAll("[data-step-target]")
    );
    var counter = document.querySelector("[data-current-step]");
    var progress = document.querySelector("[data-step-progress]");
    var lastStep = steps.length;

    function showStep(stepNumber) {
      steps.forEach(function (step) {
        step.hidden = Number(step.getAttribute("data-step")) !== stepNumber;
      });

      stepButtons.forEach(function (button) {
        var isActive = Number(button.getAttribute("data-step-target")) === stepNumber;
        button.classList.toggle("rubble-stepper-active", isActive);
        if (isActive) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });

      if (counter) counter.textContent = String(stepNumber).padStart(2, "0");
      if (progress && lastStep > 1) {
        progress.style.width = ((stepNumber - 1) / (lastStep - 1)) * 100 + "%";
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    document.querySelectorAll("[data-goto-step]").forEach(function (button) {
      button.addEventListener("click", function () {
        showStep(Number(button.getAttribute("data-goto-step")));
      });
    });

    stepButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        showStep(Number(button.getAttribute("data-step-target")));
      });
    });

    showStep(1);
  }

  function setupRepeater(root, onChange) {
    var prefix = root.getAttribute("data-repeater");
    var max = Number(root.getAttribute("data-repeater-max")) || 20;
    var body = root.querySelector("[data-repeater-rows]");
    var template = root.querySelector("[data-repeater-template]");
    var addButton = root.querySelector("[data-repeater-add]");
    var empty = root.querySelector("[data-repeater-empty]");

    if (!body || !template || !addButton) return;

    function rows() {
      return body.querySelectorAll("[data-repeater-row]");
    }

    function refresh() {
      var current = rows();

      current.forEach(function (row, index) {
        row.querySelectorAll("[name]").forEach(function (field) {
          var parts = NAME_PATTERN.exec(field.name);
          if (parts) field.name = prefix + "[" + index + "][" + parts[2] + "]";
        });
      });

      addButton.disabled = current.length >= max;
      if (empty) empty.hidden = current.length > 0;
      onChange();
    }

    addButton.addEventListener("click", function () {
      if (rows().length >= max) return;
      body.appendChild(template.content.cloneNode(true));
      refresh();
    });

    body.addEventListener("click", function (event) {
      var remove = event.target.closest("[data-repeater-remove]");
      if (!remove) return;
      var row = remove.closest("[data-repeater-row]");
      if (row) row.remove();
      refresh();
    });

    refresh();
  }

  function setupCost() {
    var root = document.querySelector("[data-rubble-price]");
    if (!root) return function () {};

    var pricePerKg = Number(root.getAttribute("data-rubble-price")) || 0;
    var total = document.querySelector("[data-rubble-total]");

    function formatCurrency(value) {
      return Number(value).toLocaleString("ar-SY") + " ل.س";
    }

    function recalculate() {
      var sum = 0;

      root.querySelectorAll("[data-repeater-row]").forEach(function (row) {
        var quantityField = row.querySelector("[data-rubble-quantity]");
        var costDisplay = row.querySelector("[data-rubble-cost]");
        var costValue = row.querySelector("[data-rubble-cost-value]");

        var quantity = parseFloat(quantityField && quantityField.value) || 0;
        var cost = quantity * pricePerKg;
        sum += cost;

        if (costDisplay) costDisplay.value = formatCurrency(cost);
        if (costValue) costValue.value = cost;
      });

      if (total) total.textContent = formatCurrency(sum);
    }

    root.addEventListener("input", function (event) {
      if (event.target.matches("[data-rubble-quantity]")) recalculate();
    });

    return recalculate;
  }

  function setupFileNames() {
    document.querySelectorAll("[data-file-input]").forEach(function (input) {
      var caption = document.getElementById(input.getAttribute("aria-describedby"));
      if (!caption) return;

      var placeholder = caption.textContent;

      input.addEventListener("change", function () {
        var files = Array.prototype.slice.call(input.files || []);
        caption.textContent = files.length
          ? files
              .map(function (file) {
                return file.name;
              })
              .join("، ")
          : placeholder;
      });
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

  var recalculate = setupCost();

  setupWizard();
  document.querySelectorAll("[data-repeater]").forEach(function (root) {
    setupRepeater(root, recalculate);
  });
  setupFileNames();
  setupSubmit();
})();
