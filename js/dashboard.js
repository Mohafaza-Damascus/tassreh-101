(function () {
  "use strict";

  var SESSION_KEY = "tasreh:dashboard-user";
  var LOGIN_PAGE = "login.html";

  function readSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  var user = readSession();
  if (!user) {
    window.location.replace(LOGIN_PAGE);
    return;
  }

  var nameTarget = document.querySelector("[data-auth-username]");
  if (nameTarget && user.name) nameTarget.textContent = user.name;

  document.querySelectorAll("[data-auth-logout]").forEach(function (button) {
    button.addEventListener("click", function () {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch (error) {}
      window.location.replace(LOGIN_PAGE);
    });
  });

  var HOUR = 3600000;
  var DAY = 86400000;
  var now = Date.now();

  function hoursAgo(hours) {
    return new Date(now - hours * HOUR);
  }

  function daysAgo(days) {
    return new Date(now - days * DAY);
  }

  var damascusCenter = [33.5138, 36.2765];

  var locations = {
    bab_touma: { name: "باب توما", lat: 33.513, lng: 36.312 },
    muhajirin: { name: "المهاجرين", lat: 33.523, lng: 36.283 },
    mazzeh: { name: "المزة", lat: 33.505, lng: 36.24 },
    kafarsouseh: { name: "كفرسوسة", lat: 33.5, lng: 36.265 },
    shaalan: { name: "الشعلان", lat: 33.5175, lng: 36.286 },
    qassaa: { name: "القصاع", lat: 33.518, lng: 36.305 },
    malki: { name: "المالكي", lat: 33.521, lng: 36.278 },
    abu_rumaneh: { name: "أبو رمانة", lat: 33.5185, lng: 36.271 },
    midan: { name: "الميدان", lat: 33.496, lng: 36.3 },
    jobar: { name: "جوبر", lat: 33.524, lng: 36.331 },
    barzeh: { name: "برزة", lat: 33.547, lng: 36.308 },
    dummar: { name: "دمّر", lat: 33.531, lng: 36.23 },
    rukn_deen: { name: "ركن الدين", lat: 33.533, lng: 36.292 },
    sarouja: { name: "الصالحية", lat: 33.52, lng: 36.295 },
    hameh: { name: "الهامة", lat: 33.556, lng: 36.213 },
    qudsaya: { name: "قدسيا", lat: 33.548, lng: 36.198 },
    daraya: { name: "داريا", lat: 33.458, lng: 36.235 },
    jaramana: { name: "جرمانا", lat: 33.483, lng: 36.335 }
  };

  var typeLabels = {
    transport: "نقل مواد ومعدات بناء",
    rubble: "نقل أنقاض",
    excavation: "حفر"
  };

  var stageLabels = {
    review: "مراجعة الطلب",
    technical: "فحص فني",
    approval: "بانتظار الموافقة",
    scheduling: "جدولة الموعد",
    field: "معاينة ميدانية"
  };

  var statusLabels = {
    active: "فعّال",
    expired: "منتهي",
    progress: "قيد الإنجاز",
    rejected: "مرفوض"
  };

  var permits = [
    {
      id: 1,
      number: "TSR-20260824-1001",
      type: "transport",
      status: "granted",
      applicant: "أحمد ناصر الدين",
      phone: "0944123456",
      grantedAt: hoursAgo(2),
      expiresAt: hoursAgo(-22),
      origin: "mazzeh",
      destination: "kafarsouseh",
      currentPos: "kafarsouseh",
      driver: "سامر عبد الرحمن",
      vehicleNumber: "دمشق 456321",
      materials: "حديد تسليح – 12 طن",
      licenseType: "رخصة بناء"
    },
    {
      id: 2,
      number: "TSR-20260824-1002",
      type: "rubble",
      status: "granted",
      applicant: "شركة الإعمار الحديثة",
      phone: "0933987654",
      grantedAt: hoursAgo(5),
      expiresAt: hoursAgo(-19),
      origin: "jobar",
      destination: "daraya",
      currentPos: "midan",
      driver: "خالد محمود",
      vehicleNumber: "دمشق 789012",
      estimatedWeight: "8 طن",
      rubbleType: "إسمنت وحجارة"
    },
    {
      id: 3,
      number: "TSR-20260824-1003",
      type: "transport",
      status: "granted",
      applicant: "محمد عيسى البستاني",
      phone: "0955111222",
      grantedAt: hoursAgo(8),
      expiresAt: hoursAgo(-16),
      origin: "dummar",
      destination: "barzeh",
      currentPos: "rukn_deen",
      driver: "فراس الحلبي",
      vehicleNumber: "ريف دمشق 334455",
      materials: "بلوك إسمنتي – 2000 قطعة",
      licenseType: "رخصة ترميم"
    },
    {
      id: 4,
      number: "TSR-20260822-1004",
      type: "transport",
      status: "granted",
      applicant: "علي حسن سلطان",
      phone: "0944556677",
      grantedAt: daysAgo(2),
      expiresAt: daysAgo(1),
      origin: "shaalan",
      destination: "qassaa",
      currentPos: "qassaa",
      driver: "باسم الخطيب",
      vehicleNumber: "دمشق 112233",
      materials: "رمل ناعم – 6 م³",
      licenseType: "رخصة بناء"
    },
    {
      id: 5,
      number: "TSR-20260821-1005",
      type: "rubble",
      status: "granted",
      applicant: "مكتب الهندسة المعمارية",
      phone: "0933445566",
      grantedAt: daysAgo(3),
      expiresAt: daysAgo(2),
      origin: "bab_touma",
      destination: "daraya",
      currentPos: "daraya",
      driver: "نزار الحموي",
      vehicleNumber: "دمشق 667788",
      estimatedWeight: "15 طن",
      rubbleType: "أخشاب وحديد"
    },
    {
      id: 6,
      number: "TSR-20260824-2001",
      type: "transport",
      status: "progress",
      applicant: "كمال الدين الأتاسي",
      phone: "0944332211",
      submittedAt: hoursAgo(3),
      stage: "review",
      origin: "muhajirin",
      destination: "midan",
      materials: "إسمنت بورتلاندي – 20 طن",
      licenseType: "رخصة بناء"
    },
    {
      id: 7,
      number: "TSR-20260824-2002",
      type: "rubble",
      status: "progress",
      applicant: "عمر المختار للمقاولات",
      phone: "0933776655",
      submittedAt: hoursAgo(6),
      stage: "technical",
      origin: "jaramana",
      destination: "daraya",
      estimatedWeight: "22 طن",
      rubbleType: "إسمنت وبلاط"
    },
    {
      id: 8,
      number: "TSR-20260823-2003",
      type: "excavation",
      status: "progress",
      applicant: "شركة المياه",
      phone: "0112345678",
      submittedAt: daysAgo(1),
      stage: "approval",
      origin: "sarouja",
      destination: "sarouja",
      excavationLocation: "الصالحية — شارع الفردوس",
      reason: "تمديد شبكة مياه جديدة",
      dimensions: "الطول: 45م، العرض: 1.5م، العمق: 2م"
    },
    {
      id: 9,
      number: "TSR-20260823-2004",
      type: "excavation",
      status: "progress",
      applicant: "شركة الكهرباء",
      phone: "0118765432",
      submittedAt: daysAgo(1),
      stage: "field",
      origin: "barzeh",
      destination: "barzeh",
      excavationLocation: "برزة — تقاطع الرئيسي",
      reason: "إصلاح كابل كهربائي",
      dimensions: "الطول: 12م، العرض: 1م، العمق: 1.5م"
    },
    {
      id: 10,
      number: "TSR-20260822-2005",
      type: "transport",
      status: "progress",
      applicant: "ياسر عبد القادر",
      phone: "0955667788",
      submittedAt: daysAgo(2),
      stage: "scheduling",
      origin: "qudsaya",
      destination: "dummar",
      materials: "ألواح خشبية – 200 لوح",
      licenseType: "رخصة ترميم"
    },
    {
      id: 11,
      number: "TSR-20260823-3001",
      type: "transport",
      status: "rejected",
      applicant: "فادي الشيخ",
      phone: "0944111222",
      submittedAt: daysAgo(1),
      rejectedAt: hoursAgo(18),
      origin: "hameh",
      destination: "shaalan",
      reason: "الرخصة المرفقة منتهية الصلاحية. يرجى تجديد الرخصة وإعادة تقديم الطلب.",
      materials: "طوب أحمر – 5000 قطعة",
      licenseType: "رخصة بناء"
    },
    {
      id: 12,
      number: "TSR-20260822-3002",
      type: "rubble",
      status: "rejected",
      applicant: "مؤسسة البنيان المتين",
      phone: "0933222333",
      submittedAt: daysAgo(2),
      rejectedAt: daysAgo(1),
      origin: "jobar",
      destination: "daraya",
      reason: "المكب المحدد لا يستقبل هذا النوع من الأنقاض. يرجى اختيار مكب آخر.",
      estimatedWeight: "30 طن",
      rubbleType: "مواد كيميائية وأسبستوس"
    },
    {
      id: 13,
      number: "TSR-20260821-3003",
      type: "excavation",
      status: "rejected",
      applicant: "شركة الهاتف",
      phone: "0112223344",
      submittedAt: daysAgo(3),
      rejectedAt: daysAgo(2),
      origin: "malki",
      destination: "malki",
      reason: "منطقة الحفر المطلوبة تقع ضمن شارع رئيسي ولا يمكن إغلاقه حالياً.",
      excavationLocation: "المالكي — شارع أبو الفداء",
      dimensions: "الطول: 80م، العرض: 2م، العمق: 1.8م"
    },
    {
      id: 14,
      number: "TSR-20260820-3004",
      type: "transport",
      status: "rejected",
      applicant: "رامي سعيد",
      phone: "0955334455",
      submittedAt: daysAgo(4),
      rejectedAt: daysAgo(3),
      origin: "kafarsouseh",
      destination: "bab_touma",
      reason: "بيانات السائق غير مكتملة. يرجى إرفاق صورة الهوية الشخصية.",
      materials: "أنابيب PVC — 500 متر",
      licenseType: "رخصة بناء"
    }
  ];

  permits.forEach(function (permit) {
    if (permit.status !== "granted") return;
    permit.subStatus = permit.expiresAt.getTime() > now ? "active" : "expired";
  });

  function formatDate(value) {
    var date = new Date(value);
    var pad = function (part) {
      return String(part).padStart(2, "0");
    };
    return (
      date.getFullYear() +
      "/" +
      pad(date.getMonth() + 1) +
      "/" +
      pad(date.getDate()) +
      " — " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function statusKey(permit) {
    if (permit.status === "granted") return permit.subStatus;
    return permit.status;
  }

  function statusBadge(permit) {
    var key = statusKey(permit);
    return (
      '<span class="dash-status dash-status-' + key + '">' + statusLabels[key] + "</span>"
    );
  }

  function countBy(predicate) {
    return permits.filter(predicate).length;
  }

  function renderStats() {
    var stats = {
      all: permits.length,
      granted: countBy(function (p) {
        return p.status === "granted";
      }),
      active: countBy(function (p) {
        return p.subStatus === "active";
      }),
      progress: countBy(function (p) {
        return p.status === "progress";
      }),
      rejected: countBy(function (p) {
        return p.status === "rejected";
      })
    };

    Object.keys(stats).forEach(function (key) {
      var element = document.querySelector('[data-stat="' + key + '"]');
      if (element) element.textContent = String(stats[key]);
    });
  }

  var listEl = document.querySelector("[data-permits-list]");
  var emptyEl = document.querySelector("[data-permits-empty]");
  var countEl = document.querySelector("[data-permits-count]");
  var filterStatus = document.querySelector('[data-filter="status"]');
  var filterType = document.querySelector('[data-filter="type"]');
  var filterSearch = document.querySelector('[data-filter="search"]');
  var resetButton = document.querySelector("[data-filters-reset]");

  var activeStatus = "all";

  function matchesStatus(permit) {
    switch (activeStatus) {
      case "all":
        return true;
      case "granted":
        return permit.status === "granted";
      case "active":
      case "expired":
        return permit.subStatus === activeStatus;
      default:
        return permit.status === activeStatus;
    }
  }

  function matchesSearch(permit, term) {
    if (!term) return true;
    var haystack = [
      permit.number,
      permit.applicant,
      permit.driver || "",
      permit.vehicleNumber || ""
    ]
      .join(" ")
      .toLowerCase();
    return haystack.indexOf(term) !== -1;
  }

  function permitCard(permit) {
    return (
      '<article class="dash-permit-card" data-permit-id="' +
      permit.id +
      '">' +
      '<header class="dash-permit-head">' +
      '<span class="dash-permit-number">' +
      escapeHtml(permit.number) +
      "</span>" +
      statusBadge(permit) +
      "</header>" +
      '<div class="dash-permit-body">' +
      '<h3 class="dash-permit-title">' +
      escapeHtml(typeLabels[permit.type]) +
      "</h3>" +
      '<div class="dash-permit-row"><span>مقدم الطلب</span><strong>' +
      escapeHtml(permit.applicant) +
      "</strong></div>" +
      "</div>" +
      '<footer class="dash-permit-footer">' +
      '<button type="button" class="dash-btn">عرض التفاصيل</button>' +
      "</footer>" +
      "</article>"
    );
  }

  function renderPermits(list) {
    if (!listEl) return;

    if (countEl) countEl.textContent = String(list.length);
    if (emptyEl) emptyEl.hidden = list.length > 0;
    listEl.innerHTML = list.map(permitCard).join("");
  }

  function applyFilters() {
    var type = filterType ? filterType.value : "all";
    var term = filterSearch ? filterSearch.value.trim().toLowerCase() : "";

    document.querySelectorAll("[data-target-status]").forEach(function (card) {
      card.classList.toggle(
        "is-selected",
        card.getAttribute("data-target-status") === activeStatus
      );
    });

    if (filterStatus) filterStatus.value = activeStatus;

    renderPermits(
      permits.filter(function (permit) {
        if (!matchesStatus(permit)) return false;
        if (type !== "all" && permit.type !== type) return false;
        return matchesSearch(permit, term);
      })
    );
  }

  function bindFilters() {
    document.querySelectorAll("[data-target-status]").forEach(function (card) {
      function select() {
        activeStatus = card.getAttribute("data-target-status") || "all";
        applyFilters();
      }
      card.addEventListener("click", select);
      card.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        select();
      });
    });

    if (filterStatus) {
      filterStatus.addEventListener("change", function () {
        activeStatus = filterStatus.value;
        applyFilters();
      });
    }

    if (filterType) filterType.addEventListener("change", applyFilters);
    if (filterSearch) filterSearch.addEventListener("input", applyFilters);

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        activeStatus = "all";
        if (filterType) filterType.value = "all";
        if (filterSearch) filterSearch.value = "";
        applyFilters();
      });
    }
  }

  var modal = document.querySelector("[data-permit-modal]");
  var modalTitle = document.querySelector("[data-modal-title]");
  var modalDetails = document.querySelector("[data-modal-details]");
  var mapSection = document.querySelector("[data-map-section]");

  function detailRow(label, value, options) {
    if (!value) return "";
    var settings = options || {};
    return (
      '<div class="dash-detail' +
      (settings.wide ? " is-wide" : "") +
      '"><span class="dash-detail-label">' +
      escapeHtml(label) +
      '</span><span class="dash-detail-value' +
      (settings.mono ? " is-mono" : "") +
      '">' +
      (settings.html ? value : escapeHtml(value)) +
      "</span></div>"
    );
  }

  function commonDetails(permit) {
    return (
      detailRow("رقم التصريح", permit.number, { mono: true }) +
      detailRow("نوع التصريح", typeLabels[permit.type]) +
      detailRow("مقدم الطلب", permit.applicant) +
      detailRow("رقم التواصل", permit.phone, { mono: true }) +
      detailRow("حالة التصريح", statusBadge(permit), { html: true })
    );
  }

  function statusDetails(permit) {
    if (permit.status === "granted") {
      return (
        detailRow("تاريخ المنح", formatDate(permit.grantedAt)) +
        detailRow("تاريخ الانتهاء", formatDate(permit.expiresAt))
      );
    }

    if (permit.status === "progress") {
      return (
        detailRow("المرحلة الحالية", stageLabels[permit.stage] || permit.stage) +
        detailRow("تاريخ التقديم", formatDate(permit.submittedAt))
      );
    }

    return (
      detailRow("تاريخ التقديم", formatDate(permit.submittedAt)) +
      detailRow("تاريخ الرفض", formatDate(permit.rejectedAt)) +
      detailRow("سبب الرفض", permit.reason, { wide: true })
    );
  }

  function typeDetails(permit) {
    var origin = locations[permit.origin];
    var destination = locations[permit.destination];

    if (permit.type === "transport") {
      return (
        detailRow("نوع الرخصة", permit.licenseType) +
        detailRow("السائق", permit.driver) +
        detailRow("رقم المركبة", permit.vehicleNumber, { mono: true }) +
        detailRow("المواد", permit.materials, { wide: true }) +
        detailRow("نقطة الانطلاق", origin && origin.name) +
        detailRow("الوجهة", destination && destination.name)
      );
    }

    if (permit.type === "rubble") {
      return (
        detailRow("السائق", permit.driver) +
        detailRow("رقم المركبة", permit.vehicleNumber, { mono: true }) +
        detailRow("نوع الأنقاض", permit.rubbleType) +
        detailRow("الوزن التقديري", permit.estimatedWeight) +
        detailRow("نقطة الانطلاق", origin && origin.name) +
        detailRow("الوجهة (المكب)", destination && destination.name)
      );
    }

    return (
      detailRow("موقع الحفر", permit.excavationLocation, { wide: true }) +
      (permit.status === "rejected"
        ? ""
        : detailRow("السبب", permit.reason, { wide: true })) +
      detailRow("الأبعاد", permit.dimensions)
    );
  }

  function findPermit(id) {
    return (
      permits.filter(function (permit) {
        return permit.id === id;
      })[0] || null
    );
  }

  function openPermit(id) {
    var permit = findPermit(id);
    if (!permit || !modal) return;

    if (modalTitle) {
      modalTitle.textContent = typeLabels[permit.type] + " — " + permit.number;
    }
    if (modalDetails) {
      modalDetails.innerHTML =
        commonDetails(permit) + statusDetails(permit) + typeDetails(permit);
    }

    modal.hidden = false;
    document.body.classList.add("dash-modal-open");
    renderMap(permit);
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("dash-modal-open");
    destroyMap();
  }

  function bindModal() {
    document.querySelectorAll("[data-modal-close]").forEach(function (button) {
      button.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeModal();
    });

    if (listEl) {
      listEl.addEventListener("click", function (event) {
        var card = event.target.closest("[data-permit-id]");
        if (card) openPermit(Number(card.getAttribute("data-permit-id")));
      });
    }
  }

  var map = null;
  var mapToken = 0;

  function destroyMap() {
    mapToken += 1;
    if (!map) return;
    map.remove();
    map = null;
  }

  function markerIcon(modifier) {
    var size = modifier === "current" ? 18 : 16;
    return L.divIcon({
      className: "",
      html: '<div class="dash-marker dash-marker-' + modifier + '"></div>',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }

  function fetchRoute(origin, destination) {
    var straightLine = [
      [origin.lat, origin.lng],
      [destination.lat, destination.lng]
    ];

    var url =
      "https://router.project-osrm.org/route/v1/driving/" +
      origin.lng +
      "," +
      origin.lat +
      ";" +
      destination.lng +
      "," +
      destination.lat +
      "?overview=full&geometries=geojson";

    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (payload) {
        if (payload.code !== "Ok" || !payload.routes || !payload.routes.length) {
          return { coords: straightLine, info: null };
        }
        return {
          coords: payload.routes[0].geometry.coordinates.map(function (point) {
            return [point[1], point[0]];
          }),
          info: payload.routes[0]
        };
      })
      .catch(function () {
        return { coords: straightLine, info: null };
      });
  }

  function closestIndex(coords, position) {
    var bestIndex = 0;
    var bestDistance = Infinity;

    coords.forEach(function (point, index) {
      var dx = point[0] - position.lat;
      var dy = point[1] - position.lng;
      var distance = dx * dx + dy * dy;
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    return bestIndex;
  }

  function renderMap(permit) {
    destroyMap();

    var origin = locations[permit.origin];
    if (!mapSection || !origin || typeof L === "undefined") {
      if (mapSection) mapSection.hidden = true;
      return;
    }

    mapSection.hidden = false;

    var destination = locations[permit.destination] || origin;
    var current = locations[permit.currentPos] || destination;
    var isTracked = permit.subStatus === "active";
    var token = mapToken;

    window.setTimeout(function () {
      if (token !== mapToken) return;

      map = L.map("permit-map", { scrollWheelZoom: false }).setView(damascusCenter, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap"
      }).addTo(map);

      L.marker([origin.lat, origin.lng], { icon: markerIcon("origin") })
        .addTo(map)
        .bindPopup("<b>نقطة الانطلاق</b><br>" + origin.name);

      if (destination !== origin) {
        L.marker([destination.lat, destination.lng], { icon: markerIcon("dest") })
          .addTo(map)
          .bindPopup("<b>الوجهة</b><br>" + destination.name);
      }

      fetchRoute(origin, destination).then(function (route) {
        if (token !== mapToken || !map) return;

        var line = L.polyline(route.coords, {
          color: "#083c34",
          weight: 4,
          opacity: 0.85,
          lineJoin: "round",
          lineCap: "round"
        }).addTo(map);

        if (isTracked && route.coords.length > 1) {
          var index = closestIndex(route.coords, current);

          if (index > 0) {
            L.polyline(route.coords.slice(0, index + 1), {
              color: "#1a7a5a",
              weight: 5,
              opacity: 0.9,
              lineJoin: "round",
              lineCap: "round"
            }).addTo(map);
          }

          L.marker(route.coords[index], { icon: markerIcon("current") })
            .addTo(map)
            .bindPopup("<b>الموقع الحالي</b><br>" + current.name);
        }

        if (route.info) {
          line.bindPopup(
            "<b>المسار</b><br>" +
              (route.info.distance / 1000).toFixed(1) +
              " كم — " +
              Math.round(route.info.duration / 60) +
              " دقيقة تقريباً"
          );
        }

        var bounds = line.getBounds();
        if (isTracked) bounds.extend([current.lat, current.lng]);
        map.fitBounds(bounds, { padding: [40, 40] });
      });
    }, 0);
  }

  renderStats();
  bindFilters();
  bindModal();
  applyFilters();
})();
