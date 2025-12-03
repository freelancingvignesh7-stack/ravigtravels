/* ================================
   TOUR PACKAGES — DYNAMIC LOGIC
================================ */

/* -------------------------------
   ROUTE DATA
-------------------------------- */
const oneDayRoutes = {
  "Coimbatore Local – 100km": {
    limit: "100 Km",
    prices: {
      "Sedan": 2800, "Innova": 3800, "Crysta": 4800,
      "TT 14": 5500, "TT 18": 6500, "Urbania": 9500
    }
  },

  "Coimbatore → Palani – 250km": {
    limit: "250 Km",
    prices: {
      "Sedan": 4500, "Innova": 6000, "Crysta": 7400,
      "TT 14": 8000, "TT 18": 9000, "Urbania": 13000
    }
  },

  "Coimbatore → Guruvayur – 350km": {
    limit: "350 Km",
    prices: {
      "Sedan": 6000, "Innova": 8500, "Crysta": 9500,
      "TT 14": 11500, "TT 18": 12500, "Urbania": 17500
    }
  },

  "Coimbatore → TopSlip – 200km": {
    limit: "200 Km",
    prices: {
      "Sedan": 3700, "Innova": 5400, "Crysta": 6500,
      "TT 14": 7500, "TT 18": 8500, "Urbania": 12000
    }
  },

  "Coimbatore → Ooty – 300km": {
    limit: "300 Km",
    prices: {
      "Sedan": 5500, "Innova": 8000, "Crysta": 9500,
      "TT 14": 11500, "TT 18": 13000, "Urbania": 20000
    }
  }
};

const twoDayRoutes = {
  "Coimbatore → Ooty → Coonoor – 350km": {
    limit: "350 Km",
    prices: {
      "Sedan": 6800, "Innova": 10000, "Crysta": 13000,
      "TT 14": 15000, "TT 18": 17000, "Urbania": 25000
    }
  },

  "Coimbatore → Kodaikanal – 500km": {
    limit: "500 Km",
    prices: {
      "Sedan": 9000, "Innova": 12500, "Crysta": 15000,
      "TT 14": 18000, "TT 18": 20000, "Urbania": 33000
    }
  },

  "Coimbatore → Valparai – 350km": {
    limit: "350 Km",
    prices: {
      "Sedan": 8000, "Innova": 11000, "Crysta": 14000,
      "TT 14": 15000, "TT 18": 18000, "Urbania": 27000
    }
  },

  "Coimbatore → Munnar – 500km": {
    limit: "500 Km",
    prices: {
      "Sedan": 10000, "Innova": 13000, "Crysta": 15000,
      "TT 14": 19000, "TT 18": 21000, "Urbania": 35000
    }
  },

  "Coimbatore → Mysore – 550km": {
    limit: "550 Km",
    prices: {
      "Sedan": 11000, "Innova": 15000, "Crysta": 19000,
      "TT 14": 23000, "TT 18": 27000, "Urbania": 37000
    }
  },

  "Coimbatore → Cochin – 500km": {
    limit: "500 Km",
    prices: {
      "Sedan": 10000, "Innova": 13500, "Crysta": 15000,
      "TT 14": 18000, "TT 18": 22000, "Urbania": 33000
    }
  }
};


/* -------------------------------
   DOM ELEMENTS
-------------------------------- */
const tabOne = document.querySelector("[data-tab='one']");
const tabTwo = document.querySelector("[data-tab='two']");

const routeSelect = document.getElementById("routeSelect");
const vehicleSelect = document.getElementById("vehicleSelect");

const accomBox = document.getElementById("accomBox");
const accomToggle = document.getElementById("accomToggle");
const accomNights = document.getElementById("accomNights");
const accomRooms = document.getElementById("accomRooms");
const accomHotel = document.getElementById("accomHotel");
const accomOccupancy = document.getElementById("accomOccupancy");

const priceTitle = document.getElementById("priceTitle");
const kmLimit = document.getElementById("kmLimit");
const finalPrice = document.getElementById("finalPrice");

const bookNowBtn = document.getElementById("bookNowBtn");

let activeData = oneDayRoutes;


/* -------------------------------
   HOTEL PRICING ENGINE
-------------------------------- */
function getHotelRate() {
  const hotel = accomHotel.value;       // 2star / 3star
  const occ = accomOccupancy.value;     // double / triple

  if (hotel === "2star") {
    if (occ === "double") return 3000;
    if (occ === "triple") return 4000;
  }

  if (hotel === "3star") {
    if (occ === "double") return 4000;
    if (occ === "triple") return 5500;
  }

  return 0;
}


/* -------------------------------
   ROUTE & VEHICLE DROPDOWNS
-------------------------------- */
function loadRoutes() {
  routeSelect.innerHTML = "<option value=''>Select route...</option>";

  Object.keys(activeData).forEach(r => {
    routeSelect.innerHTML += `<option value="${r}">${r}</option>`;
  });

  vehicleSelect.innerHTML = "<option value=''>Choose vehicle...</option>";
  finalPrice.textContent = "₹0";
}

function loadVehicles(route) {
  vehicleSelect.innerHTML = "<option value=''>Choose vehicle...</option>";
  if (!route) return;

  const list = activeData[route].prices;

  Object.keys(list).forEach(v => {
    vehicleSelect.innerHTML += `<option value="${v}">${v}</option>`;
  });
}


/* -------------------------------
   PRICE CALCULATION
-------------------------------- */
function updatePrice() {
  const route = routeSelect.value;
  const vehicle = vehicleSelect.value;

  if (!route || !vehicle) return;

  const base = activeData[route].prices[vehicle];
  let final = base;

  // Accommodation applies only on Tab 2
  if (activeData === twoDayRoutes && accomToggle.checked) {
    let nights = Number(accomNights.value) || 1;
    let rooms = Number(accomRooms.value) || 1;

    const rate = getHotelRate();
    final += rate * rooms * nights;
  }

  priceTitle.textContent = route;
  kmLimit.textContent = "Limit: " + activeData[route].limit;
  finalPrice.textContent = "₹" + final;
}


/* -------------------------------
   WHATSAPP BOOK NOW
-------------------------------- */
bookNowBtn.addEventListener("click", () => {
  if (!routeSelect.value || !vehicleSelect.value) {
    alert("Please select Route & Vehicle first.");
    return;
  }

  let accomMsg = "Accommodation: NO";

  if (activeData === twoDayRoutes && accomToggle.checked) {
    accomMsg = `
Accommodation: YES
Hotel: ${accomHotel.value}
Occupancy: ${accomOccupancy.value}
Rooms: ${accomRooms.value}
Nights: ${accomNights.value}
Breakfast Included`;
  }

  const msg = `
Hi Ravi G Travels,

I am interested in the following tour package:

Route: ${routeSelect.value}
Vehicle: ${vehicleSelect.value}
${accomMsg}

Estimated Price: ${finalPrice.textContent}

Please share more details.
`;

  window.open(
    `https://wa.me/919944165207?text=${encodeURIComponent(msg)}`
  );
});


/* -------------------------------
   TABS
-------------------------------- */
tabOne.addEventListener("click", () => {
  tabOne.classList.add("active");
  tabTwo.classList.remove("active");
  activeData = oneDayRoutes;
  accomBox.style.display = "none";
  loadRoutes();
});

tabTwo.addEventListener("click", () => {
  tabTwo.classList.add("active");
  tabOne.classList.remove("active");
  activeData = twoDayRoutes;
  accomBox.style.display = "block";
  loadRoutes();
});


/* -------------------------------
   CHANGE LISTENERS
-------------------------------- */
routeSelect.addEventListener("change", () => {
  loadVehicles(routeSelect.value);
  updatePrice();
});

vehicleSelect.addEventListener("change", updatePrice);
accomToggle.addEventListener("change", updatePrice);
accomNights.addEventListener("input", updatePrice);
accomRooms.addEventListener("input", updatePrice);
accomHotel.addEventListener("change", updatePrice);
accomOccupancy.addEventListener("change", updatePrice);


/* -------------------------------
   INIT
-------------------------------- */
loadRoutes();
