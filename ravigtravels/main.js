/* main.js — Ravi G Travels
   Handles:
   - Booking form submission (WhatsApp)
   - 12-hour time formatting
   - Duration calculation
   - Quick WA button linking
   - Accommodation label toggle
   - Scroll to booking
*/

// Scroll to booking
function scrollToBooking() {
  const el = document.getElementById('booking');
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Convert 24h HH:MM to 12-hour format with AM/PM
function formatTo12(time24) {
  if (!time24) return '';
  const [hStr, m] = time24.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

// Update Duration (pickupDate to dropDate inclusive)
function updateDuration() {
  const p = document.getElementById('pickupDate').value;
  const d = document.getElementById('dropDate').value;
  const disp = document.getElementById('durationDisplay');
  if (!p || !d) { if (disp) disp.style.display = 'none'; return; }
  const pd = new Date(p);
  const dd = new Date(d);
  const diffMs = dd.getTime() - pd.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
  if (days > 0) {
    disp.style.display = 'block';
    disp.textContent = `Duration: ${days} day${days>1?'s':''}`;
  } else { disp.style.display = 'none'; }
}

// Accommodation label update
const accomInput = document.getElementById('accom');
const accomLabel = document.getElementById('accomLabel');
if (accomInput && accomLabel) {
  // set initial
  accomLabel.textContent = accomInput.checked ? 'Yes' : 'No';
  accomInput.addEventListener('change', () => {
    accomLabel.textContent = accomInput.checked ? 'Yes' : 'No';
  });
}

// Quick WA bottom button
const quickWA = document.getElementById('quickWA');
if (quickWA) {
  quickWA.addEventListener('click', function(e){
    e.preventDefault();
    window.open('https://wa.me/919944165207', '_blank');
  });
}

// Booking form submission
document.addEventListener('DOMContentLoaded', function(){
  // set min dates to today
  const today = new Date().toISOString().split('T')[0];
  const pDate = document.getElementById('pickupDate');
  const dDate = document.getElementById('dropDate');
  if (pDate) pDate.min = today;
  if (dDate) dDate.min = today;

  if (pDate) pDate.addEventListener('change', updateDuration);
  if (dDate) dDate.addEventListener('change', updateDuration);

  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', function(evt){
    evt.preventDefault();

    const data = {
      name: (document.getElementById('name')||{}).value || '',
      phone: (document.getElementById('phone')||{}).value || '',
      pickup: (document.getElementById('pickup')||{}).value || '',
      drop: (document.getElementById('drop')||{}).value || '',
      intermediate: (document.getElementById('intermediate')||{}).value || '',
      pickupDate: (document.getElementById('pickupDate')||{}).value || '',
      pickupTime: (document.getElementById('pickupTime')||{}).value || '',
      dropDate: (document.getElementById('dropDate')||{}).value || '',
      dropTime: (document.getElementById('dropTime')||{}).value || '',
      vehicle: (document.getElementById('vehicle')||{}).value || '',
      passengers: (document.getElementById('passengers')||{}).value || '',
      additional: (document.getElementById('additional')||{}).value || '',
      accommodation: (document.getElementById('accom')||{}).checked ? 'Yes' : 'No'
    };

    // basic validation
    if (!data.name || !data.phone || !data.pickup || !data.drop || !data.pickupDate || !data.pickupTime || !data.vehicle) {
      alert('Please fill required fields: Name, Phone, Pickup, Drop, Pickup Date, Pickup Time and Vehicle.');
      return false;
    }

    // prepare message (intermediate included)
    const pickupTime12 = formatTo12(data.pickupTime);
    const dropTime12 = data.dropTime ? formatTo12(data.dropTime) : '';
    const dropLine = data.dropDate ? `\nDrop Date: ${data.dropDate}${data.dropTime ? ' ' + dropTime12 : ''}` : '';
    const intermediateLine = data.intermediate ? `\nIntermediate: ${data.intermediate}` : '';
    const msg =
`Hi Ravi G Travels 👋
*New Booking Request*

Name: ${data.name}
Phone: ${data.phone}
Pickup: ${data.pickup}
Drop: ${data.drop}${intermediateLine}
Pickup Date: ${data.pickupDate}
Pickup Time: ${pickupTime12}${dropLine}

Passengers: ${data.passengers}
Accommodation: ${data.accommodation}
Vehicle: ${data.vehicle}
Notes: ${data.additional}

(Sent from Website)`;

    // open WhatsApp
    const waNumber = '919944165207';
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    return false;
  });
});
