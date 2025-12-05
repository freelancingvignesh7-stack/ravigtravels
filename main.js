/* -------------------------------
   MAIN.JS — FINAL WORKING VERSION
   ------------------------------- */

/* ---------- Smooth Scroll ---------- */
function scrollToBooking() {
  const el = document.getElementById('booking');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- Convert HH:MM → 12 hr ---------- */
function formatTo12(time24) {
  if (!time24) return '';
  const [hStr, m] = time24.split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return time24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/* ---------- Update Duration ---------- */
function updateDuration() {
  const p = document.getElementById('pickupDate').value;
  const d = document.getElementById('dropDate').value;
  const disp = document.getElementById('durationDisplay');

  if (!p || !d) { disp.style.display = 'none'; return; }

  const pd = new Date(p);
  const dd = new Date(d);
  const diff = dd - pd;
  const days = Math.ceil(diff / (1000*60*60*24)) + 1;

  if (days > 0) {
    disp.style.display = 'block';
    disp.textContent = `Duration: ${days} day${days>1?'s':''}`;
  } else {
    disp.style.display = 'none';
  }
}

/* ---------- Trip Type UI (Tabs) ---------- */
function tripTypeUI() {
  const tripType = document.getElementById("tripType").value;

  const intermediate = document.getElementById("intermediate").closest(".col-12");
  const intermediateLabel = document.getElementById("intermediateLabel");

  const dropDate = document.getElementById("dropDate").closest(".col-md-4");
  const dropDateLabel = document.getElementById("dropDateLabel");

  const dropTime = document.getElementById("dropTime").closest(".col-md-4");

  const accom = document.getElementById("accom").closest(".col-12");

  if (tripType === "drop") {
    intermediate.style.display = "none";
    dropDate.style.display = "none";
    dropTime.style.display = "none";
    accom.style.display = "none";

    intermediateLabel.textContent = "Intermediate Locations (optional)";
    dropDateLabel.textContent = "Drop Date (optional)";

  } else {
    intermediate.style.display = "";
    dropDate.style.display = "";
    dropTime.style.display = "";
    accom.style.display = "";

    intermediateLabel.textContent = "Intermediate Locations";
    dropDateLabel.textContent = "Drop Date";
  }
}

/* ---------- DOM Ready ---------- */
document.addEventListener("DOMContentLoaded", () => {

  /* Trip Tabs */
  const tabs = document.querySelectorAll(".pkg-tab[data-trip]");
  const hiddenTrip = document.getElementById("tripType");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      hiddenTrip.value = tab.dataset.trip;
      tripTypeUI();
    });
  });

  tripTypeUI();

  /* Min date setup */
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("pickupDate").min = today;
  document.getElementById("dropDate").min = today;

  document.getElementById("pickupDate").addEventListener("change", updateDuration);
  document.getElementById("dropDate").addEventListener("change", updateDuration);

  /* WhatsApp Quick Button */
  const quickWA = document.getElementById('quickWA');
  if (quickWA) {
    quickWA.addEventListener('click', e => {
      e.preventDefault();
      window.open("https://wa.me/919944165207", "_blank");
    });
  }

  /* Accommodation Toggle */
  const accom = document.getElementById("accom");
  const accomLabel = document.getElementById("accomLabel");

  accom.addEventListener("change", () => {
    accomLabel.textContent = accom.checked ? "Yes" : "No";
  });
  /* -----------------------------
     LIVE INPUT RESTRICTIONS
  ------------------------------ */

  // Allow only letters & spaces
  function lettersOnly(input) {
    input.value = input.value.replace(/[^a-zA-Z\s]/g, "");
  }

  // Allow only numbers
  function numbersOnly(input) {
    input.value = input.value.replace(/[^0-9]/g, "");
  }

  // Restrict passenger count to max 18
  function limitPassengers(input) {
    let v = parseInt(input.value || "1");
    if (v < 1) v = 1;
    if (v > 18) v = 18;
    input.value = v;
  }

  /* Attach live listeners */
  document.addEventListener("DOMContentLoaded", () => {

    // Name → no numbers
    document.getElementById("name").addEventListener("input", () => {
      lettersOnly(document.getElementById("name"));
    });

    // Pickup → no numbers
    document.getElementById("pickup").addEventListener("input", () => {
      lettersOnly(document.getElementById("pickup"));
    });

    // Drop → no numbers
    document.getElementById("drop").addEventListener("input", () => {
      lettersOnly(document.getElementById("drop"));
    });

    // Intermediate → no numbers
    document.getElementById("intermediate").addEventListener("input", () => {
      lettersOnly(document.getElementById("intermediate"));
    });

    // Phone → only digits
    document.getElementById("phone").addEventListener("input", () => {
      numbersOnly(document.getElementById("phone"));
    });

    // Passengers → max 18
    document.getElementById("passengers").addEventListener("input", () => {
      limitPassengers(document.getElementById("passengers"));
    });

  });

  /* Form Submit */
  document.getElementById("bookingForm").addEventListener("submit", e => {
    e.preventDefault();

    const trip = hiddenTrip.value;

    /* Clear hidden fields if DROP trip */
    if (trip === "drop") {
      document.getElementById("intermediate").value = "";
      document.getElementById("dropDate").value = "";
      document.getElementById("dropTime").value = "";
      accom.checked = false;
      accomLabel.textContent = "No";
    }

    const data = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      pickup: document.getElementById("pickup").value,
      drop: document.getElementById("drop").value,
      intermediate: document.getElementById("intermediate").value,
      pickupDate: document.getElementById("pickupDate").value,
      pickupTime: document.getElementById("pickupTime").value,
      dropDate: document.getElementById("dropDate").value,
      dropTime: document.getElementById("dropTime").value,
      passengers: document.getElementById("passengers").value,
      vehicle: document.getElementById("vehicle").value,
      additional: document.getElementById("additional").value,
      accommodation: accom.checked ? "Yes" : "No"
    };

    /* Validation */
    if (!data.name || !data.phone || !data.pickup || !data.drop || !data.pickupDate || !data.pickupTime || !data.vehicle) {
      alert("Please fill all required fields.");
      return;
    }
    // Strong validation
    if (!/^[A-Za-z\s]+$/.test(data.name)) {
      alert("Name must contain only letters.");
      return;
    }

    if (!/^[0-9]+$/.test(data.phone)) {
      alert("Phone must contain only numbers.");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(data.pickup)) {
      alert("Pickup location must contain only letters.");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(data.drop)) {
      alert("Drop location must contain only letters.");
      return;
    }

    if (data.intermediate && !/^[A-Za-z\s]+$/.test(data.intermediate)) {
      alert("Intermediate location must contain only letters.");
      return;
    }

    if (data.passengers > 18) {
      alert("Max 18 passengers allowed.");
      return;
    }

    /* Build WhatsApp Message */
    const msg =
`Hi Ravi G Travels 👋
*New Booking Request*

Trip Type: ${trip === "round" ? "Round Trip" : "Drop Trip"}
Name: ${data.name}
Phone: ${data.phone}
Pickup: ${data.pickup}
Drop: ${data.drop}
${trip === "round" && data.intermediate ? `Intermediate: ${data.intermediate}\n` : ""}

Pickup Date: ${data.pickupDate}
Pickup Time: ${formatTo12(data.pickupTime)}
${trip === "round" && data.dropDate ? `Drop Date: ${data.dropDate} ${formatTo12(data.dropTime)}\n` : ""}

Passengers: ${data.passengers}
Accommodation: ${trip === "round" ? data.accommodation : "No"}
Vehicle: ${data.vehicle}

Notes: ${data.additional}

(Sent from Website)`;

    /* Send to WhatsApp */
    window.open(
      `https://wa.me/919944165207?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  });
});

/* Sticky Header */
let lastScroll = 0;
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  const curr = window.pageYOffset;
  header.style.transform = curr > lastScroll ? "translateY(-120px)" : "translateY(0)";
  lastScroll = curr;
});
