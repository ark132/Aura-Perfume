// ---------- Shop details (replace with real ones before the demo) ----------
const store = {
  name: "Aura Perfumes",
  area: "City Chowk",
  address: "Shop no., City Chowk, your city",
  map: "https://maps.google.com/?q=Aura+Perfumes+City+Chowk",
  phone: "919999999999"   // country code + number, no + or spaces
};

// ---------- Fill the "Visit us" section ----------
document.getElementById("store-info").textContent =
  store.name + ", " + store.address;

document.getElementById("directions-btn").href = store.map;

document.getElementById("whatsapp-btn").href =
  "https://wa.me/" + store.phone + "?text=" +
  encodeURIComponent("Hi Aura, I saw your website and want to know more.");

// ---------- Load perfumes.json and show a card for each ----------
const perfumes = 
  [
  {
    "id": 1,
    "name": "Ocean Breeze",
    "brand": "Placeholder Brand",
    "type": "EDT",
    "price": 599,
    "family": "fresh",
    "intensity": "subtle",
    "occasions": ["college", "daily"],
    "notes": ["lemon", "sea salt", "musk"],
    "inStock": true
  },
  {
    "id": 2,
    "name": "Citrus Splash",
    "brand": "Placeholder Brand",
    "type": "EDT",
    "price": 699,
    "family": "fresh",
    "intensity": "moderate",
    "occasions": ["college", "office", "daily"],
    "notes": ["bergamot", "grapefruit", "green tea"],
    "inStock": true
  },
  {
    "id": 3,
    "name": "Vanilla Crush",
    "brand": "Placeholder Brand",
    "type": "EDT",
    "price": 799,
    "family": "sweet",
    "intensity": "moderate",
    "occasions": ["college", "date"],
    "notes": ["vanilla", "caramel", "tonka bean"],
    "inStock": true
  },
  {
    "id": 4,
    "name": "Office Classic",
    "brand": "Placeholder Brand",
    "type": "EDP",
    "price": 1299,
    "family": "woody",
    "intensity": "moderate",
    "occasions": ["office", "daily"],
    "notes": ["cedar", "vetiver", "light musk"],
    "inStock": true
  },
  {
    "id": 5,
    "name": "Spice Route",
    "brand": "Placeholder Brand",
    "type": "EDP",
    "price": 1899,
    "family": "spicy",
    "intensity": "strong",
    "occasions": ["date", "wedding"],
    "notes": ["cardamom", "black pepper", "amber"],
    "inStock": false
  },
  {
    "id": 6,
    "name": "Rose Garden",
    "brand": "Placeholder Brand",
    "type": "EDP",
    "price": 1599,
    "family": "floral",
    "intensity": "moderate",
    "occasions": ["date", "wedding", "office"],
    "notes": ["rose", "peony", "white musk"],
    "inStock": true
  },
  {
    "id": 7,
    "name": "Midnight Oud",
    "brand": "Placeholder Brand",
    "type": "EDP",
    "price": 2999,
    "family": "woody",
    "intensity": "strong",
    "occasions": ["wedding", "date"],
    "notes": ["oud", "amber", "vanilla"],
    "inStock": true
  },
  {
    "id": 8,
    "name": "Musk Rani",
    "brand": "Placeholder Brand",
    "type": "Attar",
    "price": 549,
    "family": "sweet",
    "intensity": "subtle",
    "occasions": ["daily", "college"],
    "notes": ["white musk", "jasmine"],
    "inStock": true
  },
  {
    "id": 9,
    "name": "Chandan Classic",
    "brand": "Placeholder Brand",
    "type": "Attar",
    "price": 999,
    "family": "woody",
    "intensity": "moderate",
    "occasions": ["daily", "office", "wedding"],
    "notes": ["sandalwood", "cedar"],
    "inStock": true
  },
  {
    "id": 10,
    "name": "Royal Oud Attar",
    "brand": "Placeholder Brand",
    "type": "Attar",
    "price": 2500,
    "family": "woody",
    "intensity": "strong",
    "occasions": ["wedding", "date"],
    "notes": ["agarwood", "rose", "amber"],
    "inStock": false
  }
];
perfumes.forEach(function (p) { if (!p.occasions) console.log("Missing occasions:", p.name); });
showPerfumes(perfumes);

function showPerfumes(perfumes) {
  const grid = document.getElementById("perfume-grid");

  perfumes.forEach(function (p) {
    const card = document.createElement("div");
    card.className ="card " + p.family;

    // one small chip per occasion
    const occasionChips = (p.occasions || [])
      .map(function (o) { return '<span class="chip">' + o + "</span>"; })
      .join("");

    const stockText = p.inStock
      ? '<span class="stock in-stock">Available at ' + store.area + "</span>"
      : '<span class="stock ask-store">Ask in store</span>';

    card.innerHTML =
      '<span class="card-type">' + p.type + "</span>" +
      "<h3>" + p.name + "</h3>" +
      '<p class="family">' + p.family + " · " + p.intensity + "</p>" +
      '<p class="notes">' + (p.notes || []).join(", ") + "</p>" +
      '<div class="chips">' + occasionChips + "</div>" +
      '<div class="card-bottom">' +
        '<span class="price">₹' + p.price + "</span>" +
        stockText +
      "</div>";

    grid.appendChild(card);
  });
}
// Takes the visitor's answers and returns perfumes ranked best-first
function findPerfumes(answers) {
  return perfumes
    .filter(function (p) { return p.price <= answers.maxBudget; })   // 1. drop what's too expensive
    .map(function (p) {                                              // 2. give each a score
      let score = 0;
      if (p.occasions.includes(answers.occasion)) score += 3;
      if (p.family === answers.family) score += 3;
      if (p.intensity === answers.intensity) score += 1;
      return { perfume: p, score: score };
    })
    .filter(function (r) { return r.score > 0; })                    // 3. drop non-matches
    .sort(function (a, b) { return b.score - a.score; });            // 4. best score first
}
// ---------- Finder: read the answers, run the scoring, show results ----------
document.getElementById("finder-form").addEventListener("submit", function (e) {
  e.preventDefault();                       // stop the page from reloading

  const form = e.target;
  const answers = {
    occasion: form.occasion.value,
    maxBudget: Number(form.budget.value),
    family: form.family.value,
    intensity: form.intensity.value
  };

  showResults(findPerfumes(answers));
});

function showResults(results) {
  const box = document.getElementById("finder-results");
  box.innerHTML = "";

  if (results.length === 0) {
    box.innerHTML = '<p class="no-match">No close match at this budget. Try a higher budget or a different scent.</p>';
    return;
  }

  results.forEach(function (r) {
    const p = r.perfume;
    const percent = Math.round((r.score / 7) * 100);   // 7 is the best possible score

    const whatsapp = "https://wa.me/" + store.phone + "?text=" +
      encodeURIComponent("Hi Aura, I'm interested in " + p.name + ".");

    const stockLine = p.inStock
      ? "Available at " + store.area + ". Come and smell it."
      : "Ask in store, we can arrange it for you.";

    const card = document.createElement("div");
    card.className = "card " + p.family;
    card.innerHTML =
      '<span class="match">' + percent + "% match</span><br>" +
      '<span class="card-type">' + p.type + "</span>" +
      "<h3>" + p.name + "</h3>" +
      '<p class="family">' + p.family + " · " + p.intensity + "</p>" +
      '<p class="notes">' + p.notes.join(", ") + "</p>" +
      '<div class="card-bottom"><span class="price">₹' + p.price + "</span></div>" +
      '<p class="try-it">' + stockLine +
        ' <a href="' + whatsapp + '" target="_blank">Ask on WhatsApp</a></p>';

    box.appendChild(card);
  });

  box.scrollIntoView({ behavior: "smooth" });
}