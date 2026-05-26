const WHATSAPP_NUMBER = "201220597999";
const EMAILJS_SERVICE_ID = "service_h606on5";
const EMAILJS_TEMPLATE_ID = "template_8q3hewi";
const EMAILJS_PUBLIC_KEY = "RF_jwuITFQBc71jg5";

const IMG_BASE = "https://www.modosmartwallets.com/";

const DELIVERY_REGIONS = {
  cairo_giza: { ar: "القاهرة والجيزة", en: "Cairo & Giza", fee: 99 },
  alex: { ar: "الإسكندرية", en: "Alexandria", fee: 120 },
  delta_canal: { ar: "الدلتا والقناة", en: "Delta & Canal", fee: 125 },
  assiut: { ar: "أسيوط", en: "Assiut", fee: 200 },
  northcoast: { ar: "الساحل الشمالي", en: "North Coast", fee: 220 }
};

let currentLang = localStorage.getItem("modoLang") || "ar";
let selectedProductId = "smart";
let selectedDeliveryRegion = "cairo_giza";
let reviewsExpanded = false;
let latestReviewsData = [];

const products = [
  {
    id: "smart",
    oldPrice: 799,
    price: 650,
    image: `${IMG_BASE}smart-wallet.jpg`,
    featured: true,
    ar: {
      name: "Modo Smart Wallet",
      tag: "ضد الضياع",
      desc: "الموديل الأساسي للحماية اليومية: جلد طبيعي 100%، تتبع، تنبيه عند الابتعاد، وصوت إنذار.",
      features: ["جلد طبيعي 100%", "تتبع ضد الفقد", "تنبيه عند الابتعاد", "صوت إنذار للعثور عليها", "بطارية قابلة للتغيير"]
    },
    en: {
      name: "Modo Smart Wallet",
      tag: "Anti-loss",
      desc: "The everyday protection model: 100% natural leather, tracking, out-of-range alert, and alarm sound.",
      features: ["100% natural leather", "Anti-loss tracking", "Out-of-range alert", "Alarm sound finder", "Replaceable battery"]
    }
  },
  {
    id: "classic",
    oldPrice: 499,
    price: 450,
    image: `${IMG_BASE}classic-wallet.jpg`,
    featured: false,
    ar: {
      name: "Modo Classic Wallet",
      tag: "كلاسيك",
      desc: "محفظة جلد طبيعي 100% كلاسيكية لشكل أنيق واستخدام يومي نظيف.",
      features: ["جلد طبيعي 100%", "تصميم كلاسيكي", "خياطة عالية الجودة", "مناسبة للاستخدام اليومي", "شكل احترافي"]
    },
    en: {
      name: "Modo Classic Wallet",
      tag: "Classic",
      desc: "A clean 100% natural leather wallet for an elegant everyday carry.",
      features: ["100% natural leather", "Classic design", "Premium stitching", "Daily use", "Professional look"]
    }
  },
  {
    id: "premium",
    oldPrice: 1999,
    price: 1500,
    image: `${IMG_BASE}premium-wallet.jpg`,
    featured: false,
    ar: {
      name: "Modo Premium Wallet",
      tag: "فاخر",
      desc: "نسخة أفخم بحجم أصغر، إغلاق مغناطيسي، شحن كل 3 شهور تقريبًا، وتوصيل مجاني.",
      features: ["حجم أصغر وأكثر فخامة", "منفذ شحن داخل العلبة", "بطارية حتى 3 شهور تقريبًا", "إغلاق مغناطيسي محكم"],
      moreTitle: "تفاصيل Premium",
      moreText: "يأتي الموديل البريميوم في علبة فاخرة، مع تتبع ضد الفقد وتنبيه عند الابتعاد وتشطيب مناسب كهدية.",
      moreFeatures: ["جلد طبيعي 100%", "تتبع ضد الفقد وتنبيه عند الابتعاد", "تشطيب فاخر", "توصيل مجاني"]
    },
    en: {
      name: "Modo Premium Wallet",
      tag: "Premium",
      desc: "A smaller luxury version with magnetic closure, around 3 months per charge, and free delivery.",
      features: ["Smaller premium size", "Charging port included", "Up to around 3 months per charge", "Secure magnetic closure"],
      moreTitle: "Premium details",
      moreText: "The Premium model comes in a luxury box, with anti-loss tracking, out-of-range alerts, and a refined finish for gifting.",
      moreFeatures: ["100% natural leather", "Anti-loss tracking and alerts", "Luxury finish", "Free delivery"]
    }
  }
];

const translations = {
  ar: {
    topOffer: "عرض إطلاق لأول 25 قطعة فقط — شحن سريع والدفع عند الاستلام داخل مصر",
    brandAntiLoss: "ضد الضياع", brandSafe: "طلب آمن", brandLeather: "جلد طبيعي 100%",
    navProducts: "المنتجات", navAbout: "عن مودو", navStory: "قصتنا", navWhy: "ليه تختار مودو", navHow: "طريقة الاستخدام", navReviews: "التقييمات", navFAQ: "الأسئلة", navCTA: "اطلب الآن",
    heroKicker: "MODO Wallet Egypt", heroTitle: "محفظة ضد الضياع من جلد طبيعي 100%", heroSubtitle: "جلد طبيعي 100%، تتبع ذكي بالموبايل، تنبيه عند الابتعاد، وصوت يساعدك تلاقي محفظتك بسرعة.", heroCTA: "اطلب الآن", heroExplore: "شوف المحافظ",
    signal1Title: "ضد الضياع", signal1Text: "تنبيه عند الابتعاد", signal2Title: "طلب آمن", signal2Text: "الدفع عند الاستلام", signal3Title: "جلد طبيعي 100%", signal3Text: "خامة فاخرة", heroChipSmall: "المحفظة آمنة", heroChipStrong: "متصلة",
    identity1Title: "مصممة ضد الضياع", identity1Text: "المحفظة مش مجرد شكل. الفكرة الأساسية إنك تاخد تنبيه وتقدر تخليها ترن لما تختفي.", identity2Title: "طلب أكثر أمانًا", identity2Text: "الدفع عند الاستلام، تأكيد واتساب، واستبدال 7 أيام في حالة عيب تصنيع.", identity3Title: "جلد طبيعي 100%", identity3Text: "جلد طبيعي 100% وتشطيب هادي يناسب الشغل، الخروج، والهدايا.",
    ugcEyebrow: "تجربة حقيقية", ugcTitle: "شوف الإحساس قبل ما تطلب", ugcText: "فيديو قصير يوضح شكل المحفظة واستخدام فكرة التتبع من غير شرح زيادة.",
    productsEyebrow: "مجموعة MODO", productsTitle: "اختار درجة الحماية والفخامة", productsSubtitle: "كل موديل له نفس روح MODO: شكل نظيف، طلب آمن، وتجربة يومية أهدى.", chooseProduct: "اطلب الآن", readMoreProduct: "اقرأ المزيد", premiumFreeDelivery: "توصيل مجاني",
    reviewsEyebrow: "آراء العملاء", reviewsTitle: "ثقة حقيقية مش كلام كتير", reviewsSubtitle: "أول انطباع مهم: خامة، شكل، وسهولة طلب.", latestReviews: "أحدث التقييمات", viewAllReviews: "عرض كل التقييمات", showLessReviews: "عرض أقل", writeReviewTitle: "اكتب تقييمك",
    reviewNameLabel: "الاسم", reviewCityLabel: "المدينة", reviewRatingLabel: "التقييم", reviewTextLabel: "رأيك في المنتج", submitReview: "نشر التقييم مباشرة", reviewStatusReady: "التقييم سيظهر مباشرة بعد النشر.",
    orderEyebrow: "اطلب بأمان", orderTitle: "بيانات الطلب", orderSubtitle: "هنفتح واتساب فورًا لتأكيد الطلب، والإيميل يتبعت تلقائيًا في الخلفية.", selectedLabel: "الموديل المختار", formProduct: "اختار المنتج", formName: "الاسم", formPhone: "رقم الموبايل", formAddress: "العنوان بالتفصيل", formDeliveryRegion: "منطقة التوصيل", formPayment: "طريقة الدفع", formNotes: "ملاحظات اختيارية", paymentCOD: "الدفع عند الاستلام", submitOrder: "إرسال الطلب", orderSuccess: "تم تأكيد طلبك", formNote: "بياناتك تستخدم لتأكيد الطلب فقط.",
    deliveryCairoGiza: "القاهرة والجيزة — 99 جنيه", deliveryAlex: "الإسكندرية — 120 جنيه", deliveryDeltaCanal: "الدلتا والقناة — 125 جنيه", deliveryAssiut: "أسيوط — 200 جنيه", deliveryNorthCoast: "الساحل الشمالي — 220 جنيه", checkoutTotalLabel: "إجمالي السعر شامل التوصيل", premiumFreeDeliveryCheckout: "توصيل مجاني مع Modo Premium Wallet",
    footerAbout: "محافظ جلد طبيعي 100% ضد الضياع بإحساس آمن وفاخر.", footerContact: "التواصل", footerSocial: "تابعنا", copyright: "© 2026 Modo Smart Wallets. جميع الحقوق محفوظة.", stickyCTA: "اطلب الآن",
    pageTopStrip: "ضد الضياع / طلب آمن / جلد طبيعي 100%",
    storyPageKicker: "قصة MODO", storyPageHeroTitle: "بدأت من مشكلة حقيقية", storyPageHeroText: "محفظة ضاعت، وحاجة واضحة لمنتج شكله فاخر وفي نفس الوقت يحميك من القلق اليومي. من هنا ظهر MODO: جلد طبيعي 100%، حماية ضد الفقد، وطلب آمن داخل مصر.",
    storyCard1Title: "جلد طبيعي 100%", storyCard1Text: "الخامة جزء من الهوية، مش مجرد وصف للمنتج.", storyCard2Title: "حماية ضد الضياع", storyCard2Text: "تتبع، تنبيه عند الابتعاد، وصوت إنذار يساعدك تلاقيها.", storyCard3Title: "شراء مطمئن", storyCard3Text: "الدفع عند الاستلام وتأكيد واتساب قبل الشحن.",
    whyPageKicker: "ليه MODO", whyPageHeroTitle: "شراء آمن وتجربة فاخرة", whyPageHeroText: "الفرق في MODO مش ميزة واحدة. هو خليط واضح: جلد طبيعي 100%، حماية ضد الضياع، ودفع عند الاستلام.",
    whyCard1Title: "الدفع عند الاستلام", whyCard1Text: "ادفع لما تستلم، مع تأكيد الطلب على واتساب قبل الشحن.", whyCard2Title: "تنبيه وصوت إنذار", whyCard2Text: "المحفظة تساعدك تلاحظ الابتعاد وتلاقيها لو اختفت قريب منك.", whyCard3Title: "جلد طبيعي 100%", whyCard3Text: "شكل هادي وخامة مناسبة للاستخدام اليومي والهدايا.",
    howPageKicker: "طريقة الاستخدام", howPageHeroTitle: "تشغيل بسيط، حماية يومية", howPageHeroText: "الفكرة كلها إن المحفظة تبقى مرتبطة بالموبايل، فتعرف تتنبه أو تشغل صوت لما تحتاجها.",
    howCard1Title: "حمّل التطبيق", howCard1Text: "استخدم تطبيق iSearching على iOS أو Android.", howCard2Title: "وصل المحفظة", howCard2Text: "ضغطة مطولة على حرف M، وبعدها اربطها بالتطبيق.", howCard3Title: "استقبل التنبيهات", howCard3Text: "تنبيه عند الابتعاد وصوت إنذار للعثور عليها.",
    faqPageKicker: "الأسئلة", faqPageHeroTitle: "أسئلة قبل الطلب", faqPageHeroText: "إجابات مختصرة على أهم الحاجات اللي تهمك قبل ما تختار MODO.",
    faqCard1Title: "هل الجلد طبيعي؟", faqCard1Text: "نعم، محافظ MODO مصنوعة من جلد طبيعي 100% بتشطيب فاخر.", faqCard2Title: "هل هي بديل AirTag؟", faqCard2Text: "ليست AirTag من Apple، لكنها تقدم تجربة عملية للتتبع والتنبيه عبر الهاتف.", faqCard3Title: "هل يوجد دفع عند الاستلام؟", faqCard3Text: "نعم، الدفع عند الاستلام متاح داخل مصر مع تأكيد واتساب قبل الشحن."
  },
  en: {
    topOffer: "Launch offer for the first 25 pieces only — fast delivery and Cash on Delivery in Egypt",
    brandAntiLoss: "Anti-loss", brandSafe: "Safe order", brandLeather: "100% Leather",
    navProducts: "Products", navAbout: "About Modo", navStory: "Our Story", navWhy: "Why Modo", navHow: "How it works", navReviews: "Reviews", navFAQ: "FAQ", navCTA: "Order now",
    heroKicker: "MODO Wallet Egypt", heroTitle: "Anti-loss wallet made from 100% natural leather", heroSubtitle: "100% natural leather, smart mobile tracking, out-of-range alerts, and an alarm sound to help you find your wallet fast.", heroCTA: "Order now", heroExplore: "View wallets",
    signal1Title: "Anti-loss", signal1Text: "Out-of-range alert", signal2Title: "Safe order", signal2Text: "Cash on Delivery", signal3Title: "100% Leather", signal3Text: "100% natural leather", heroChipSmall: "Wallet secured", heroChipStrong: "Connected",
    identity1Title: "Anti-loss by design", identity1Text: "The wallet is not just about looks. It is made to alert you and ring when it disappears.", identity2Title: "Safer checkout", identity2Text: "Cash on Delivery, WhatsApp confirmation, and 7-day replacement for manufacturing defects.", identity3Title: "100% Natural Leather", identity3Text: "100% natural leather with a quiet finish for work, daily outings, and gifting.",
    ugcEyebrow: "Real demo", ugcTitle: "See the feel before ordering", ugcText: "A short video showing the wallet and the tracking idea without overexplaining it.",
    productsEyebrow: "MODO Collection", productsTitle: "Choose your protection and finish", productsSubtitle: "Every model keeps the MODO spirit: clean look, safe order, calmer daily carry.", chooseProduct: "Order now", readMoreProduct: "Read more", premiumFreeDelivery: "Free delivery",
    reviewsEyebrow: "Customer reviews", reviewsTitle: "Real trust, less noise", reviewsSubtitle: "The first impression matters: material, look, and easy ordering.", latestReviews: "Latest reviews", viewAllReviews: "View all reviews", showLessReviews: "Show less", writeReviewTitle: "Write your review",
    reviewNameLabel: "Name", reviewCityLabel: "City", reviewRatingLabel: "Rating", reviewTextLabel: "Your review", submitReview: "Publish review live", reviewStatusReady: "Your review will appear after publishing.",
    orderEyebrow: "Order safely", orderTitle: "Order details", orderSubtitle: "WhatsApp opens immediately to confirm your order, while the email sends in the background.", selectedLabel: "Selected model", formProduct: "Choose product", formName: "Name", formPhone: "Phone number", formAddress: "Detailed address", formDeliveryRegion: "Delivery area", formPayment: "Payment method", formNotes: "Optional notes", paymentCOD: "Cash on Delivery", submitOrder: "Send order", orderSuccess: "Your order is confirmed", formNote: "Your details are used only to confirm the order.",
    deliveryCairoGiza: "Cairo & Giza — 99 EGP", deliveryAlex: "Alexandria — 120 EGP", deliveryDeltaCanal: "Delta & Canal — 125 EGP", deliveryAssiut: "Assiut — 200 EGP", deliveryNorthCoast: "North Coast — 220 EGP", checkoutTotalLabel: "Total including delivery", premiumFreeDeliveryCheckout: "Free delivery with Modo Premium Wallet",
    footerAbout: "Anti-loss 100% natural leather wallets with a safer premium feel.", footerContact: "Contact", footerSocial: "Follow us", copyright: "© 2026 Modo Smart Wallets. All rights reserved.", stickyCTA: "Order now",
    pageTopStrip: "Anti-loss / Safe / 100% Natural Leather",
    storyPageKicker: "MODO Story", storyPageHeroTitle: "It started from a real problem", storyPageHeroText: "A lost wallet showed the need for something premium that also protects you from daily worry. MODO is 100% natural leather, anti-loss protection, and safer ordering in Egypt.",
    storyCard1Title: "100% Natural Leather", storyCard1Text: "The material is part of the identity, not just a product detail.", storyCard2Title: "Anti-loss Protection", storyCard2Text: "Tracking, out-of-range alert, and alarm sound to help you find it.", storyCard3Title: "Safer Ordering", storyCard3Text: "Cash on Delivery and WhatsApp confirmation before shipping.",
    whyPageKicker: "Why MODO", whyPageHeroTitle: "Safer ordering, premium daily carry", whyPageHeroText: "MODO is not one feature. It is the mix of 100% natural leather, anti-loss protection, and Cash on Delivery.",
    whyCard1Title: "Cash on Delivery", whyCard1Text: "Pay when you receive your order, with WhatsApp confirmation before shipping.", whyCard2Title: "Alert and alarm sound", whyCard2Text: "The wallet helps you notice distance and find it when it is nearby.", whyCard3Title: "100% Natural Leather", whyCard3Text: "A quiet premium finish for daily use and gifting.",
    howPageKicker: "How it works", howPageHeroTitle: "Simple setup, daily protection", howPageHeroText: "The wallet connects to your phone so you can receive alerts or make it ring when you need it.",
    howCard1Title: "Download the app", howCard1Text: "Use the iSearching app on iOS or Android.", howCard2Title: "Connect the wallet", howCard2Text: "Long press the M button, then pair the wallet with the app.", howCard3Title: "Receive alerts", howCard3Text: "Get out-of-range alerts and use alarm sound to find it.",
    faqPageKicker: "FAQ", faqPageHeroTitle: "Questions before ordering", faqPageHeroText: "Short answers to the important things before you choose MODO.",
    faqCard1Title: "Is it real leather?", faqCard1Text: "Yes. MODO wallets are made from 100% natural leather with a premium finish.", faqCard2Title: "Is it an AirTag alternative?", faqCard2Text: "It is not an Apple AirTag, but it gives you a practical phone-based tracking and alert experience.", faqCard3Title: "Is Cash on Delivery available?", faqCard3Text: "Yes. Cash on Delivery is available in Egypt with WhatsApp confirmation before shipping."
  }
};

const defaultReviews = [
  { name: "أحمد", city: "القاهرة", rating: 5, text: "الخامة شيك جداً والمحفظة حجمها مناسب. وصلت بسرعة والدفع كان عند الاستلام.", createdAtText: "اليوم" },
  { name: "عمر", city: "الجيزة", rating: 5, text: "ميزة التنبيه ممتازة. شكلها فخم ومش تقني زيادة.", createdAtText: "أمس" },
  { name: "كريم", city: "الإسكندرية", rating: 5, text: "اشتريتها هدية وكانت ممتازة. التغليف والجلد شكلهم راقي.", createdAtText: "هذا الأسبوع" }
];

function t(key) { return translations[currentLang]?.[key] || key; }
function money(value) { return `${Number(value).toLocaleString()} EGP`; }
function getDeliveryRegion() {
  const select = document.getElementById("deliveryRegion");
  const key = select && DELIVERY_REGIONS[select.value] ? select.value : selectedDeliveryRegion;
  return { key, ...DELIVERY_REGIONS[key] };
}
function getEffectiveDeliveryFee() { return selectedProductId === "premium" ? 0 : getDeliveryRegion().fee; }
function getEffectiveDeliveryText() { return selectedProductId === "premium" ? (currentLang === "ar" ? "مجاني" : "Free") : money(getDeliveryRegion().fee); }
function normalizeEgyptPhoneForWhatsApp(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `2${digits}`;
  return digits;
}
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = String(text || "");
  return div.innerHTML;
}

async function sendOrderEmailViaEmailJS(orderData) {
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: orderData
      })
    });
    if (!response.ok) throw new Error(`EmailJS error ${response.status}: ${await response.text()}`);
    return true;
  } catch (error) {
    console.error("EmailJS order email failed:", error);
    return false;
  }
}

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("en", currentLang === "en");
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  const langToggle = document.getElementById("langToggle");
  if (langToggle) langToggle.textContent = currentLang === "ar" ? "English" : "العربية";
  const placeholders = {
    customerName: currentLang === "ar" ? "اكتب اسمك بالكامل" : "Write your full name",
    customerPhone: "01XXXXXXXXX",
    customerAddress: currentLang === "ar" ? "المحافظة، المنطقة، الشارع، رقم العمارة" : "Governorate, area, street, building number",
    customerNotes: currentLang === "ar" ? "أي ملاحظات للتوصيل؟" : "Any delivery notes?",
    reviewName: currentLang === "ar" ? "مثال: أحمد" : "Example: Ahmed",
    reviewCity: currentLang === "ar" ? "مثال: القاهرة" : "Example: Cairo",
    reviewText: currentLang === "ar" ? "اكتب تقييمك هنا..." : "Write your review here..."
  };
  Object.entries(placeholders).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = value;
  });
  renderProducts();
  renderProductOptions();
  updateSelectedProduct();
  renderLiveReviews(getLocalReviews());
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;
  grid.innerHTML = products.map(product => {
    const d = product[currentLang];
    const premiumMore = product.id === "premium" ? `
      <details class="premium-more">
        <summary>${t("readMoreProduct")}</summary>
        <div class="premium-more-body">
          <strong>${d.moreTitle}</strong>
          <p>${d.moreText}</p>
          <ul>${d.moreFeatures.map(feature => `<li>${feature}</li>`).join("")}</ul>
        </div>
      </details>
    ` : "";
    return `
      <article class="product-card reveal ${product.featured ? "featured" : ""}">
        <span class="product-tag">${d.tag}</span>
        ${product.id === "premium" ? `<span class="free-delivery-badge">${t("premiumFreeDelivery")}</span>` : ""}
        <img src="${product.image}" alt="${d.name}">
        <h3>${d.name}</h3>
        <p>${d.desc}</p>
        <ul class="product-features">${d.features.map(feature => `<li>${feature}</li>`).join("")}</ul>
        ${premiumMore}
        <div class="price-row"><span class="new-price">${money(product.price)}</span><span class="old-price">${money(product.oldPrice)}</span></div>
        <button class="btn btn-primary choose-btn" type="button" data-product-id="${product.id}">${t("chooseProduct")}</button>
      </article>
    `;
  }).join("");
  grid.querySelectorAll("[data-product-id]").forEach(btn => btn.addEventListener("click", () => chooseProduct(btn.dataset.productId)));
  setupReveal();
}

function renderProductOptions() {
  const select = document.getElementById("productSelect");
  if (!select) return;
  select.innerHTML = products.map(product => `<option value="${product.id}">${product[currentLang].name} — ${money(product.price)}</option>`).join("");
  select.value = selectedProductId;
  updateCheckoutTotal();
}

function chooseProduct(id) {
  selectedProductId = id;
  renderProductOptions();
  updateSelectedProduct();
  document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateSelectedProduct() {
  const product = products.find(item => item.id === selectedProductId);
  if (!product) return;
  const img = document.getElementById("selectedProductImg");
  const name = document.getElementById("selectedProductName");
  const oldPrice = document.getElementById("selectedOldPrice");
  const price = document.getElementById("selectedPrice");
  if (img) img.src = product.image;
  if (name) name.textContent = product[currentLang].name;
  if (oldPrice) oldPrice.textContent = money(product.oldPrice);
  if (price) price.textContent = money(product.price);
  updateCheckoutTotal();
}

function updateCheckoutTotal() {
  const product = products.find(item => item.id === selectedProductId);
  const totalValue = document.getElementById("checkoutTotalValue");
  const premiumNote = document.getElementById("premiumFreeDeliveryNote");
  if (product && totalValue) totalValue.textContent = money(product.price + getEffectiveDeliveryFee());
  if (premiumNote) premiumNote.hidden = selectedProductId !== "premium";
}

function setupGallery() {
  const main = document.getElementById("mainGalleryImage");
  if (!main) return;
  document.querySelectorAll(".thumb").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".thumb").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      main.src = button.dataset.img;
    });
  });
}

function setupMenu() {
  const btn = document.getElementById("menuBtn");
  const links = document.getElementById("navLinks");
  if (!btn || !links) return;
  btn.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach(link => link.addEventListener("click", () => links.classList.remove("open")));
}

function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  const reveal = () => els.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 70) el.classList.add("active");
  });
  reveal();
  window.addEventListener("scroll", reveal, { passive: true });
}

function getLocalReviews() {
  const saved = JSON.parse(localStorage.getItem("modoLocalReviews") || "[]");
  return [...saved, ...defaultReviews];
}

function renderLiveReviews(reviews) {
  const grid = document.getElementById("reviewsGrid");
  if (!grid) return;
  latestReviewsData = reviews.filter(review => String(review.text || "").trim().length > 3)
    .sort((a, b) => String(b.text || "").length - String(a.text || "").length)
    .slice(0, 30);
  grid.innerHTML = latestReviewsData.map(review => `
    <article class="review-card reveal">
      <div class="stars">${"★".repeat(Number(review.rating) || 5)}</div>
      <p>${escapeHtml(review.text)}</p>
      <strong>${escapeHtml(review.name)}${review.city ? ` — ${escapeHtml(review.city)}` : ""}</strong>
      <div class="review-meta">${escapeHtml(review.createdAtText || "Live")}</div>
    </article>
  `).join("");
  updateReviewsToggle();
  setupReveal();
}

function updateReviewsToggle() {
  const btn = document.getElementById("reviewsToggleBtn");
  const grid = document.getElementById("reviewsGrid");
  if (!btn || !grid) return;
  const hasMore = latestReviewsData.length > 1;
  btn.style.display = hasMore ? "inline-flex" : "none";
  btn.textContent = reviewsExpanded ? t("showLessReviews") : t("viewAllReviews");
  grid.classList.toggle("compact-one", !reviewsExpanded && hasMore);
}

function setupReviews() {
  const toggle = document.getElementById("reviewsToggleBtn");
  const writeToggle = document.getElementById("writeReviewToggle");
  const form = document.getElementById("reviewForm");
  if (toggle) toggle.addEventListener("click", () => {
    reviewsExpanded = !reviewsExpanded;
    updateReviewsToggle();
  });
  if (writeToggle && form) writeToggle.addEventListener("click", () => {
    form.classList.toggle("review-form-open");
    form.classList.toggle("review-form-collapsed");
    if (form.classList.contains("review-form-open")) form.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  if (form) form.addEventListener("submit", event => {
    event.preventDefault();
    const review = {
      name: document.getElementById("reviewName").value.trim(),
      city: document.getElementById("reviewCity").value.trim(),
      rating: Number(document.getElementById("reviewRating").value),
      text: document.getElementById("reviewText").value.trim(),
      createdAtText: new Date().toLocaleDateString(currentLang === "ar" ? "ar-EG" : "en-GB")
    };
    const saved = JSON.parse(localStorage.getItem("modoLocalReviews") || "[]");
    saved.unshift(review);
    localStorage.setItem("modoLocalReviews", JSON.stringify(saved.slice(0, 30)));
    form.reset();
    renderLiveReviews(getLocalReviews());
  });
}

function setupStickyCtaVisibility() {
  const sticky = document.querySelector(".sticky-mobile-cta");
  const hero = document.getElementById("home");
  const order = document.getElementById("order");
  if (!sticky || !hero) return;
  const update = () => {
    const heroPassed = hero.getBoundingClientRect().bottom < 80;
    const orderRect = order ? order.getBoundingClientRect() : null;
    const inCheckout = orderRect ? orderRect.top < window.innerHeight * 0.72 && orderRect.bottom > 120 : false;
    sticky.classList.toggle("show", heroPassed && !inCheckout);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function setupOrderForm() {
  const form = document.getElementById("orderForm");
  const productSelect = document.getElementById("productSelect");
  const deliverySelect = document.getElementById("deliveryRegion");
  if (!form) return;
  productSelect?.addEventListener("change", () => {
    selectedProductId = productSelect.value;
    updateSelectedProduct();
  });
  deliverySelect?.addEventListener("change", () => {
    selectedDeliveryRegion = deliverySelect.value;
    updateCheckoutTotal();
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const product = products.find(item => item.id === selectedProductId);
    const deliveryRegion = getDeliveryRegion();
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const payment = document.getElementById("paymentMethod").value;
    const notes = document.getElementById("customerNotes").value.trim() || "-";
    const total = product.price + getEffectiveDeliveryFee();
    const productName = product[currentLang].name;

    if (typeof fbq === "function") {
      fbq("track", "Lead", { content_name: productName, content_ids: [product.id], content_type: "product", currency: "EGP", value: total });
      fbq("trackCustom", "WhatsAppOrderClick", { product: productName, product_id: product.id, currency: "EGP", value: total });
    }

    const success = document.getElementById("orderSuccess");
    if (success) {
      success.hidden = false;
      success.textContent = t("orderSuccess");
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const orderData = {
      customer_name: name,
      customer_phone: phone,
      customer_address: address,
      product_name: productName,
      payment_method: payment,
      delivery_region: deliveryRegion[currentLang],
      delivery_fee: getEffectiveDeliveryText(),
      delivery_fee_display: getEffectiveDeliveryText(),
      price: product.price,
      total,
      notes,
      language: currentLang === "ar" ? "Arabic" : "English",
      whatsapp_phone: normalizeEgyptPhoneForWhatsApp(phone),
      order_time: new Date().toLocaleString("en-GB", { timeZone: "Africa/Cairo" }),
      to_email: "youssifKarim12@gmail.com",
      email: "youssifKarim12@gmail.com",
      reply_to: "youssifKarim12@gmail.com"
    };

    const msg = encodeURIComponent(`🛍️ New Modo Order

Product: ${productName}
Price: ${product.price} EGP
Delivery Area: ${deliveryRegion[currentLang]}
Delivery Fee: ${getEffectiveDeliveryText()}
Total: ${total} EGP

Name: ${name}
Phone: ${phone}
Address: ${address}
Payment: ${payment}
Notes: ${notes}`);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    const whatsappTab = window.open(whatsappUrl, "_blank");
    if (!whatsappTab) window.location.href = whatsappUrl;

    sendOrderEmailViaEmailJS(orderData).then(emailSent => {
      if (!emailSent) console.warn("Order email did not send, but WhatsApp was opened.");
    });
  });
}

document.getElementById("langToggle")?.addEventListener("click", () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  localStorage.setItem("modoLang", currentLang);
  applyTranslations();
});

window.chooseProduct = chooseProduct;

applyTranslations();
setupGallery();
setupMenu();
setupReveal();
setupReviews();
setupStickyCtaVisibility();
setupOrderForm();
