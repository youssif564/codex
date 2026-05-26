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
let liveReviewsDb = null;
let liveReviewsEnabled = false;

const firebaseConfigLiveReviews = {
  apiKey: "AIzaSyDJF6D0MrFt8TsXsMcTpu8EqVp0deRh9aQ",
  authDomain: "modo-smart-wallets.firebaseapp.com",
  projectId: "modo-smart-wallets",
  storageBucket: "modo-smart-wallets.firebasestorage.app",
  messagingSenderId: "229690155538",
  appId: "1:229690155538:web:4ec04258e5880485892ecb",
  measurementId: "G-H402HQ36YF"
};

const CLOUDINARY_CLOUD_NAME = "di3fqqtn1";
const CLOUDINARY_UPLOAD_PRESET = "modosmartwallets";

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
    price: 399,
    image: `${IMG_BASE}classic-wallet.jpg`,
    featured: false,
    ar: {
      name: "Modo Classic Wallet",
      tag: "كلاسيك",
      desc: "محفظة جلد طبيعي 100% كلاسيكية بدون تتبع، لشكل أنيق واستخدام يومي نظيف.",
      trackerNote: "بدون تتبع",
      features: ["جلد طبيعي 100%", "بدون تتبع", "تصميم كلاسيكي", "خياطة عالية الجودة", "مناسبة للاستخدام اليومي", "شكل احترافي"]
    },
    en: {
      name: "Modo Classic Wallet",
      tag: "Classic",
      desc: "A clean 100% natural leather wallet without tracker, for elegant everyday carry.",
      trackerNote: "Without tracker",
      features: ["100% natural leather", "No tracker", "Classic design", "Premium stitching", "Daily use", "Professional look"]
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
      desc: "نسخة أفخم بحجم أصغر، فيها تتبع ذكي، إغلاق مغناطيسي، شحن كل 3 شهور تقريبًا، وتوصيل مجاني.",
      trackerNote: "فيها تتبع ذكي",
      features: ["تتبع ذكي ضد الفقد", "حجم أصغر وأكثر فخامة", "منفذ شحن داخل العلبة", "بطارية حتى 3 شهور تقريبًا", "إغلاق مغناطيسي محكم"],
      moreTitle: "تفاصيل Premium",
      moreText: "يأتي الموديل البريميوم في علبة فاخرة، مع تتبع ضد الفقد وتنبيه عند الابتعاد وتشطيب مناسب كهدية.",
      moreFeatures: ["جلد طبيعي 100%", "تتبع ضد الفقد وتنبيه عند الابتعاد", "تشطيب فاخر", "توصيل مجاني"]
    },
    en: {
      name: "Modo Premium Wallet",
      tag: "Premium",
      desc: "A smaller luxury version with smart tracking, magnetic closure, around 3 months per charge, and free delivery.",
      trackerNote: "Smart tracker included",
      features: ["Smart anti-loss tracking", "Smaller premium size", "Charging port included", "Up to around 3 months per charge", "Secure magnetic closure"],
      moreTitle: "Premium details",
      moreText: "The Premium model comes in a luxury box, with anti-loss tracking, out-of-range alerts, and a refined finish for gifting.",
      moreFeatures: ["100% natural leather", "Anti-loss tracking and alerts", "Luxury finish", "Free delivery"]
    }
  }
];

const translations = {
  ar: {
    topOffer: "عرض إطلاق لأول 25 قطعة فقط — شحن سريع والدفع عند الاستلام داخل مصر",
    brandAntiLoss: "ضد الضياع", brandSafe: "طلب آمن", brandLeather: "100% جلد طبيعي",
    navProducts: "المنتجات", navAbout: "عن مودو", navStory: "قصتنا", navWhy: "ليه تختار مودو", navHow: "طريقة الاستخدام", navReviews: "التقييمات", navFAQ: "الأسئلة", navCTA: "اطلب الآن",
    heroKicker: "MODO Wallet Egypt", launchOfferStrong: "وفر حتى 499 جنيه", launchOfferText: "عرض إطلاق محدود لأول 25 قطعة", heroTitle: "محفظة ضد الضياع من جلد طبيعي 100%", heroSubtitle: "جلد طبيعي 100%، تتبع بالموبايل، وتنبيه يساعدك تلاقيها بسرعة.", heroCTA: "اطلب الآن", heroExplore: "شوف المحافظ",
    signal1Title: "ضد الضياع", signal1Text: "تنبيه عند الابتعاد", signal2Title: "طلب آمن", signal2Text: "الدفع عند الاستلام", signal3Title: "جلد طبيعي 100%", signal3Text: "خامة فاخرة", heroChipSmall: "المحفظة آمنة", heroChipStrong: "متصلة",
    identity1Title: "مصممة ضد الضياع", identity1Text: "المحفظة مش مجرد شكل. الفكرة الأساسية إنك تاخد تنبيه وتقدر تخليها ترن لما تختفي.", identity2Title: "طلب أكثر أمانًا", identity2Text: "الدفع عند الاستلام، تأكيد واتساب، واستبدال 7 أيام في حالة عيب تصنيع.", identity3Title: "جلد طبيعي 100%", identity3Text: "جلد طبيعي 100% وتشطيب هادي يناسب الشغل، الخروج، والهدايا.",
    ugcEyebrow: "تجربة حقيقية", ugcTitle: "شوف الإحساس قبل ما تطلب", ugcText: "فيديو قصير يوضح شكل المحفظة واستخدام فكرة التتبع من غير شرح زيادة.",
    productsEyebrow: "مجموعة MODO", productsTitle: "اختار درجة الحماية والفخامة", productsSubtitle: "كل موديل له نفس روح MODO: شكل نظيف، طلب آمن، وتجربة يومية أهدى.", chooseProduct: "اطلب الآن", readMoreProduct: "اقرأ المزيد", premiumFreeDelivery: "توصيل مجاني", saveLabel: "وفر", productCODLine: "الدفع عند الاستلام", productDeliveryLine: "شحن سريع داخل مصر",
    purchaseNoteCOD: "الدفع عند الاستلام", purchaseNoteDelivery: "توصيل 24–72 ساعة", purchaseNoteReplace: "استبدال 7 أيام لعيب التصنيع", trustMetricRating: "تقييم العملاء", trustMetricCustomers: "عميل داخل مصر", trustMetricCOD: "الدفع عند الاستلام", trustMetricDelivery: "توصيل سريع",
    reviewsEyebrow: "آراء العملاء", reviewsTitle: "ثقة حقيقية مش كلام كتير", reviewsSubtitle: "كل التقييمات ظاهرة، ومعاها الصور لو العميل رفع صورة للمنتج.", latestReviews: "كل التقييمات", viewAllReviews: "عرض كل التقييمات", showLessReviews: "عرض أقل", writeReviewTitle: "اكتب تقييمك",
    reviewNameLabel: "الاسم", reviewCityLabel: "المدينة", reviewRatingLabel: "التقييم", reviewTextLabel: "رأيك في المنتج", reviewImageLabel: "صورة اختيارية للمنتج", submitReview: "نشر التقييم مباشرة", reviewStatusReady: "التقييم سيظهر مباشرة بعد النشر.",
    conversionBandEyebrow: "عرض الإطلاق", conversionBandTitle: "اختار محفظتك الآن وادفع عند الاستلام", conversionBandText: "السعر الحالي لفترة محدودة، والتأكيد بيتم على واتساب قبل الشحن.", conversionBandCTA: "كمّل الطلب",
    orderEyebrow: "اطلب بأمان", orderTitle: "بيانات الطلب", orderSubtitle: "هنفتح واتساب فورًا لتأكيد الطلب.", orderUrgency: "العرض الحالي محدود. احجز السعر قبل انتهاء أول 25 قطعة.", selectedLabel: "الموديل المختار", formProduct: "اختار المنتج", formName: "الاسم", formPhone: "رقم الموبايل", formAddress: "العنوان بالتفصيل", formDeliveryRegion: "منطقة التوصيل", formPayment: "طريقة الدفع", formNotes: "ملاحظات اختيارية", paymentCOD: "الدفع عند الاستلام", submitOrder: "إرسال الطلب", orderSuccess: "تم تأكيد طلبك", formNote: "بياناتك تستخدم لتأكيد الطلب فقط.",
    deliveryCairoGiza: "القاهرة والجيزة — 99 جنيه", deliveryAlex: "الإسكندرية — 120 جنيه", deliveryDeltaCanal: "الدلتا والقناة — 125 جنيه", deliveryAssiut: "أسيوط — 200 جنيه", deliveryNorthCoast: "الساحل الشمالي — 220 جنيه", checkoutTotalLabel: "إجمالي السعر شامل التوصيل", premiumFreeDeliveryCheckout: "توصيل مجاني مع Modo Premium Wallet",
    footerAbout: "محافظ جلد طبيعي 100% ضد الضياع بإحساس آمن وفاخر.", footerContact: "التواصل", footerSocial: "تابعنا", copyright: "© 2026 Modo Smart Wallets. جميع الحقوق محفوظة.", stickyCTA: "اطلب الآن",
    pageTopStrip: "ضد الضياع / طلب آمن / جلد طبيعي 100%",
    storyPageKicker: "قصة MODO", storyPageHeroTitle: "بدأت من مشكلة حقيقية", storyPageHeroText: "محفظة ضاعت، وحاجة واضحة لمنتج شكله فاخر وفي نفس الوقت يحميك من القلق اليومي. من هنا ظهر MODO: جلد طبيعي 100%، حماية ضد الفقد، وطلب آمن داخل مصر.",
    storyFullEyebrow: "قصتنا",
    storyFullTitle: "الموضوع مبدأش كـ بيزنس... بدأ من مشكلة حقيقية.",
    storyFullP1: "أنا يوسف رشوان. في يوم من الأيام، ضاعت محفظتي بكل اللي فيها: كروت، فلوس، وحاجات مهمة.",
    storyFullP2: "الموقف ده خلاني أفهم قد إيه إحنا معتمدين على حاجة بسيطة زي المحفظة، ومع ذلك مفيش حماية حقيقية ليها.",
    storyFullP3: "ومن هنا بدأت الفكرة: ليه مايبقاش فيه محفظة شكلها فاخر، وفي نفس الوقت تساعدك تحس بالأمان؟",
    storyFullFeature1: "تصميم فاخر يناسب ستايلك",
    storyFullFeature2: "جلد طبيعي عالي الجودة",
    storyFullFeature3: "تكنولوجيا ذكية تساعدك تلاقيها لو ضاعت",
    storyFullHighlight: "MODO مش مجرد محفظة: دي حماية يومية، تصميم فاخر، وجودة تعيش معاك.",
    storyFullNote: "إحنا مش شركة كبيرة مجهولة. إحنا ناس حقيقيين في مصر، بنبني منتج يعيش معاك.",
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
    heroKicker: "MODO Wallet Egypt", launchOfferStrong: "Save up to 499 EGP", launchOfferText: "Limited launch offer for the first 25 pieces", heroTitle: "Anti-loss wallet made from 100% natural leather", heroSubtitle: "100% natural leather with mobile tracking and alerts to find it fast.", heroCTA: "Order now", heroExplore: "View wallets",
    signal1Title: "Anti-loss", signal1Text: "Out-of-range alert", signal2Title: "Safe order", signal2Text: "Cash on Delivery", signal3Title: "100% Leather", signal3Text: "100% natural leather", heroChipSmall: "Wallet secured", heroChipStrong: "Connected",
    identity1Title: "Anti-loss by design", identity1Text: "The wallet is not just about looks. It is made to alert you and ring when it disappears.", identity2Title: "Safer checkout", identity2Text: "Cash on Delivery, WhatsApp confirmation, and 7-day replacement for manufacturing defects.", identity3Title: "100% Natural Leather", identity3Text: "100% natural leather with a quiet finish for work, daily outings, and gifting.",
    ugcEyebrow: "Real demo", ugcTitle: "See the feel before ordering", ugcText: "A short video showing the wallet and the tracking idea without overexplaining it.",
    productsEyebrow: "MODO Collection", productsTitle: "Choose your protection and finish", productsSubtitle: "Every model keeps the MODO spirit: clean look, safe order, calmer daily carry.", chooseProduct: "Order now", readMoreProduct: "Read more", premiumFreeDelivery: "Free delivery", saveLabel: "Save", productCODLine: "Cash on Delivery", productDeliveryLine: "Fast delivery in Egypt",
    purchaseNoteCOD: "Cash on Delivery", purchaseNoteDelivery: "24–72h delivery", purchaseNoteReplace: "7-day defect replacement", trustMetricRating: "Customer rating", trustMetricCustomers: "Customers in Egypt", trustMetricCOD: "Cash on Delivery", trustMetricDelivery: "Fast delivery",
    reviewsEyebrow: "Customer reviews", reviewsTitle: "Real trust, less noise", reviewsSubtitle: "All reviews are visible, including product photos when customers upload them.", latestReviews: "All reviews", viewAllReviews: "View all reviews", showLessReviews: "Show less", writeReviewTitle: "Write your review",
    reviewNameLabel: "Name", reviewCityLabel: "City", reviewRatingLabel: "Rating", reviewTextLabel: "Your review", reviewImageLabel: "Optional product photo", submitReview: "Publish review live", reviewStatusReady: "Your review will appear after publishing.",
    conversionBandEyebrow: "Launch offer", conversionBandTitle: "Choose your wallet now and pay on delivery", conversionBandText: "Current pricing is limited, and your order is confirmed on WhatsApp before shipping.", conversionBandCTA: "Complete order",
    orderEyebrow: "Order safely", orderTitle: "Order details", orderSubtitle: "WhatsApp opens immediately to confirm your order.", orderUrgency: "The current offer is limited. Reserve the price before the first 25 pieces end.", selectedLabel: "Selected model", formProduct: "Choose product", formName: "Name", formPhone: "Phone number", formAddress: "Detailed address", formDeliveryRegion: "Delivery area", formPayment: "Payment method", formNotes: "Optional notes", paymentCOD: "Cash on Delivery", submitOrder: "Send order", orderSuccess: "Your order is confirmed", formNote: "Your details are used only to confirm the order.",
    deliveryCairoGiza: "Cairo & Giza — 99 EGP", deliveryAlex: "Alexandria — 120 EGP", deliveryDeltaCanal: "Delta & Canal — 125 EGP", deliveryAssiut: "Assiut — 200 EGP", deliveryNorthCoast: "North Coast — 220 EGP", checkoutTotalLabel: "Total including delivery", premiumFreeDeliveryCheckout: "Free delivery with Modo Premium Wallet",
    footerAbout: "Anti-loss 100% natural leather wallets with a safer premium feel.", footerContact: "Contact", footerSocial: "Follow us", copyright: "© 2026 Modo Smart Wallets. All rights reserved.", stickyCTA: "Order now",
    pageTopStrip: "Anti-loss / Safe / 100% Natural Leather",
    storyPageKicker: "MODO Story", storyPageHeroTitle: "It started from a real problem", storyPageHeroText: "A lost wallet showed the need for something premium that also protects you from daily worry. MODO is 100% natural leather, anti-loss protection, and safer ordering in Egypt.",
    storyFullEyebrow: "Our Story",
    storyFullTitle: "It did not start as a business... it started from a real problem.",
    storyFullP1: "I am Youssef Rashwan. One day, I lost my wallet with everything inside: cards, money, and important items.",
    storyFullP2: "That moment made me realize how much we depend on something as simple as a wallet, yet it has no real protection.",
    storyFullP3: "That is where the idea started: why not create a wallet that looks premium and helps you feel secure?",
    storyFullFeature1: "Premium design that fits your style",
    storyFullFeature2: "High-quality natural leather",
    storyFullFeature3: "Smart technology to help you find it if lost",
    storyFullHighlight: "Modo is more than a wallet: daily protection, premium design, and long-lasting quality.",
    storyFullNote: "We are not a faceless big company. We are real people in Egypt, building a product that lives with you.",
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
  { name: "أحمد", city: "القاهرة", rating: 5, text: "الخامة شيك جداً والمحفظة حجمها مناسب. وصلت بسرعة والدفع كان عند الاستلام.", imageUrl: `${IMG_BASE}smart-wallet.jpg`, createdAtText: "اليوم" },
  { name: "عمر", city: "الجيزة", rating: 5, text: "ميزة التنبيه ممتازة. شكلها فخم ومش تقني زيادة.", createdAtText: "أمس" },
  { name: "كريم", city: "الإسكندرية", rating: 5, text: "اشتريتها هدية وكانت ممتازة. التغليف والجلد شكلهم راقي.", imageUrl: `${IMG_BASE}premium-wallet.jpg`, createdAtText: "هذا الأسبوع" },
  { name: "يوسف", city: "القاهرة", rating: 5, text: "حبيت إن شكلها جلد طبيعي فعلاً ومش باين عليها إنها تقنية. فكرة الصوت مفيدة جداً.", imageUrl: `${IMG_BASE}classic-wallet.jpg`, createdAtText: "هذا الشهر" }
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

function reviewIsConfigured(value) {
  return value && !String(value).includes("PUT_YOUR");
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadReviewImage(file) {
  if (!file) return "";
  if (!file.type.startsWith("image/")) throw new Error("Please upload an image file.");
  if (file.size > 3 * 1024 * 1024) throw new Error("Image must be less than 3 MB.");

  const cloudReady = reviewIsConfigured(CLOUDINARY_CLOUD_NAME) && reviewIsConfigured(CLOUDINARY_UPLOAD_PRESET);
  if (!cloudReady) return readImageAsDataUrl(file);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "modo-reviews");
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    });
    if (!response.ok) throw new Error("Image upload failed.");
    const data = await response.json();
    return data.secure_url || "";
  } catch (error) {
    console.warn("Cloudinary upload failed, storing the image locally.", error);
    return readImageAsDataUrl(file);
  }
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
        ${d.trackerNote ? `<div class="product-tracker-note">${d.trackerNote}</div>` : ""}
        <ul class="product-features">${d.features.map(feature => `<li>${feature}</li>`).join("")}</ul>
        ${premiumMore}
        <div class="price-row"><span class="new-price">${money(product.price)}</span><span class="old-price">${money(product.oldPrice)}</span></div>
        <div class="product-sale-line">
          <strong>${t("saveLabel")} ${money(product.oldPrice - product.price)}</strong>
          <span>${t("productCODLine")}</span>
          <span>${product.id === "premium" ? t("premiumFreeDelivery") : t("productDeliveryLine")}</span>
        </div>
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
      ${review.imageUrl ? `<img src="${escapeHtml(review.imageUrl)}" alt="Customer review photo" loading="lazy">` : ""}
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

async function initLiveReviews() {
  const badge = document.querySelector(".reviews-toolbar span");
  const firebaseReady =
    reviewIsConfigured(firebaseConfigLiveReviews.apiKey) &&
    reviewIsConfigured(firebaseConfigLiveReviews.authDomain) &&
    reviewIsConfigured(firebaseConfigLiveReviews.projectId) &&
    reviewIsConfigured(firebaseConfigLiveReviews.appId);

  if (!firebaseReady) {
    if (badge) badge.textContent = currentLang === "ar" ? "محلي" : "Local";
    renderLiveReviews(getLocalReviews());
    return;
  }

  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
    const firestore = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");
    const app = initializeApp(firebaseConfigLiveReviews);
    liveReviewsDb = firestore.getFirestore(app);
    liveReviewsEnabled = true;
    window.modoFirestore = firestore;
    if (badge) badge.textContent = "Live";

    const reviewsQuery = firestore.query(
      firestore.collection(liveReviewsDb, "modoReviews"),
      firestore.orderBy("createdAt", "desc"),
      firestore.limit(30)
    );

    firestore.onSnapshot(reviewsQuery, snapshot => {
      const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderLiveReviews(reviews.length ? reviews : getLocalReviews());
    }, error => {
      console.error("Firebase review listener error:", error);
      liveReviewsEnabled = false;
      if (badge) badge.textContent = currentLang === "ar" ? "محلي" : "Local";
      renderLiveReviews(getLocalReviews());
    });
  } catch (error) {
    console.error("Firebase init error:", error);
    liveReviewsEnabled = false;
    if (badge) badge.textContent = currentLang === "ar" ? "محلي" : "Local";
    renderLiveReviews(getLocalReviews());
  }
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
  if (form) form.addEventListener("submit", async event => {
    event.preventDefault();
    const status = document.getElementById("reviewStatus");
    const submitBtn = document.getElementById("reviewSubmitBtn");
    const imageFile = document.getElementById("reviewImage")?.files?.[0];
    if (submitBtn) submitBtn.disabled = true;
    if (status) status.textContent = currentLang === "ar" ? "جاري نشر التقييم..." : "Publishing review...";

    let imageUrl = "";
    try {
      imageUrl = await uploadReviewImage(imageFile);
    } catch (error) {
      console.error(error);
      if (status) status.textContent = currentLang === "ar" ? "الصورة كبيرة أو غير صالحة." : "The image is too large or invalid.";
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    const review = {
      name: document.getElementById("reviewName").value.trim(),
      city: document.getElementById("reviewCity").value.trim(),
      rating: Number(document.getElementById("reviewRating").value),
      text: document.getElementById("reviewText").value.trim(),
      imageUrl,
      createdAtText: new Date().toLocaleDateString(currentLang === "ar" ? "ar-EG" : "en-GB")
    };

    try {
      if (liveReviewsEnabled && liveReviewsDb && window.modoFirestore) {
        await window.modoFirestore.addDoc(window.modoFirestore.collection(liveReviewsDb, "modoReviews"), {
          ...review,
          createdAt: window.modoFirestore.serverTimestamp()
        });
      } else {
        const saved = JSON.parse(localStorage.getItem("modoLocalReviews") || "[]");
        saved.unshift(review);
        localStorage.setItem("modoLocalReviews", JSON.stringify(saved.slice(0, 30)));
        renderLiveReviews(getLocalReviews());
      }
      form.reset();
      if (status) status.textContent = currentLang === "ar" ? "تم نشر تقييمك بنجاح." : "Your review was published.";
    } catch (error) {
      console.error(error);
      if (status) status.textContent = currentLang === "ar" ? "حدث خطأ. حاول مرة أخرى." : "Something went wrong. Please try again.";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function setupStickyCtaVisibility() {
  const sticky = document.querySelector(".sticky-mobile-cta");
  const hero = document.getElementById("home");
  const blockedSections = ["products", "reviews", "order"]
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if (!sticky || !hero) return;
  const update = () => {
    const heroPassed = hero.getBoundingClientRect().bottom < 80;
    const inBlockedSection = blockedSections.some(section => {
      const rect = section.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.82 && rect.bottom > 120;
    });
    const showSticky = heroPassed && !inBlockedSection;
    sticky.classList.toggle("show", showSticky);
    document.body.classList.toggle("sticky-cta-visible", showSticky);
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
initLiveReviews();
setupStickyCtaVisibility();
setupOrderForm();
