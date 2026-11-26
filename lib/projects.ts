import type { L } from "./app-state";

export type Category = "web-ai" | "ecommerce" | "interfaces";

export type Media =
  | { type: "console" }
  | { type: "web"; hero: string; showcase: string; mobile: string }
  | { type: "app"; screens: [string, string, string] };

export type Project = {
  slug: string;
  title: L;
  kind: L;
  /** What the project is in one honest word: live product, concept, team project. */
  status: L;
  categories: Category[];
  media: Media;
  /** Backdrop tint behind phone screens and in the drawer header. */
  tint: string;
  summary: L;
  role: L;
  challenge: L;
  solution: L[];
  stack: string[];
  note?: L;
  /** Public product link. Hidden in showcase mode. */
  link?: { label: string; href: string };
};

const CONCEPT: L = { en: "Concept project", ar: "مشروع عرض" };
const CONCEPT_NOTE: L = {
  en: "Concept project. The brand and its content are fictional; the design and the code are mine.",
  ar: "مشروع عرض. اسم العلامة ومحتواها افتراضيان، والتصميم والكود من عملي.",
};
const STATIC_STACK = ["HTML5", "Tailwind CSS", "JavaScript", "Lucide", "IBM Plex Sans Arabic"];

export const featured: Project = {
  slug: "bounty-agents",
  title: { en: "Bounty Agents", ar: "Bounty Agents" },
  kind: { en: "Multi-agent system", ar: "نظام متعدد الوكلاء" },
  status: { en: "Runs around the clock", ar: "يعمل على مدار الساعة" },
  categories: ["web-ai"],
  media: { type: "console" },
  tint: "rgba(56,189,248,0.16)",
  summary: {
    en: "Five specialist AI agents that work a task marketplace around the clock. They find open bounties, decide which one of them should bid, do the work, review it and submit.",
    ar: "خمسة وكلاء ذكاء اصطناعي متخصصين يعملون على سوق مهام على مدار الساعة: يبحثون عن المهام المفتوحة، ويحددون من منهم يتقدّم، وينفّذون العمل ويراجعونه ثم يسلّمونه.",
  },
  role: { en: "System design and delivery", ar: "تصميم النظام وتسليمه" },
  challenge: {
    en: "Running several agents for one owner on the Bounty marketplace invites three failures: agents bidding against each other, a bid or a submission sent twice after a crash or a retry, and deliverables that cite data nobody actually read.",
    ar: "تشغيل عدة وكلاء لمالك واحد على منصة Bounty يفتح الباب لثلاثة أعطال: أن يتنافس وكلاؤك على المهمة نفسها، أن يُرسَل العرض أو التسليم مرتين بعد انقطاع أو إعادة محاولة، وأن يستشهد العمل ببيانات لم يقرأها أحد فعلًا.",
  },
  solution: [
    {
      en: "A dispatcher scores every bounty against every agent and leases it to one of them, so two agents of the same owner never compete.",
      ar: "موزّع يقيّم كل مهمة مقابل كل وكيل ثم يحجزها لوكيل واحد، فلا يتنافس وكيلان للمالك نفسه أبدًا.",
    },
    {
      en: "Every write is recorded in an outbox with a deterministic idempotency key before it is sent. A retry resends the exact stored payload.",
      ar: "كل عملية كتابة تُسجَّل في صندوق صادر بمفتاح ثابت قبل إرسالها، وإعادة المحاولة ترسل الحمولة المخزّنة نفسها حرفيًا.",
    },
    {
      en: "Events are stored in the same transaction that moves the cursor, so a restart picks up exactly where the last run stopped.",
      ar: "الأحداث تُحفظ في المعاملة نفسها التي تحرّك المؤشر، فيستأنف النظام بعد إعادة التشغيل من حيث توقف تمامًا.",
    },
    {
      en: "Agents read public pages through Gemini's URL context. The self-review step rejects any row without a source that was really read.",
      ar: "الوكلاء يقرأون الصفحات العامة عبر Gemini، وخطوة المراجعة الذاتية ترفض أي صف بلا مصدر تمت قراءته فعلًا.",
    },
    {
      en: "The operator edits prompts and YAML files, never Python. A dry-run mode works on real open bounties against a separate database and sends nothing.",
      ar: "المشغّل يعدّل ملفات التعليمات والإعدادات فقط دون كود بايثون، ووضع التجربة يعمل على مهام حقيقية بقاعدة بيانات منفصلة ولا يرسل شيئًا.",
    },
  ],
  stack: [
    "Python 3.11",
    "Google Gemini",
    "httpx",
    "Pydantic v2",
    "SQLite (WAL)",
    "FastAPI",
    "Docker",
    "systemd",
    "pytest",
  ],
  note: {
    en: "The system is a headless service with no screen of its own. The console shown here is a visualisation built on its real log format.",
    ar: "النظام خدمة تعمل في الخلفية بلا واجهة خاصة. اللوحة المعروضة هنا تصوّر مرئي مبني على صيغة سجلاته الحقيقية.",
  },
};

export const projects: Project[] = [
  {
    slug: "lamsa",
    title: { en: "Lamsa", ar: "لمسة" },
    kind: { en: "Wedding invitation SaaS", ar: "منصة دعوات زفاف" },
    status: { en: "Live product", ar: "منتج يعمل فعليًا" },
    categories: ["web-ai"],
    media: {
      type: "app",
      screens: ["/work/lamsa-2.jpg", "/work/lamsa-1.jpg", "/work/lamsa-3.jpg"],
    },
    tint: "rgba(21,94,68,0.5)",
    summary: {
      en: "Couples design a wedding invitation on their phone, pay once and share it as one link.",
      ar: "يصمّم العروسان دعوة زفافهما من الموبايل، يدفعان مرة واحدة ويشاركانها برابط واحد.",
    },
    role: {
      en: "Founder and product owner. Built with an AI coding agent that I direct and review.",
      ar: "المؤسس ومالك المنتج. أبنيه مع وكيل برمجة بالذكاء الاصطناعي أوجّهه وأراجع كل تغيير فيه.",
    },
    challenge: {
      en: "Couples want an invitation they can send as one link, and they want it today: no account, no designer, no subscription.",
      ar: "العروسان يريدان دعوة تُرسل برابط واحد، ويريدانها اليوم: بلا حساب ولا مصمم ولا اشتراك.",
    },
    solution: [
      {
        en: "A phone-first builder: pick one of 131 designs, enter names, date and venue, and see the result before paying.",
        ar: "مُنشئ مصمم للموبايل أولًا: اختر واحدًا من 131 تصميمًا، أدخل الأسماء والتاريخ والمكان، وشاهد النتيجة قبل الدفع.",
      },
      {
        en: "One payment and no subscription, with card checkout, a manual local method and an admin console to confirm it.",
        ar: "دفعة واحدة بلا اشتراك، ببطاقة أو بطريقة دفع محلية يدوية، ولوحة إدارة لتأكيد المدفوعات.",
      },
      {
        en: "Guests open an animated envelope, see the map and reply. The host tracks every reply and exports the list.",
        ar: "الضيوف يفتحون ظرفًا متحركًا ويرون الخريطة ويردّون، وصاحب الدعوة يتابع كل رد ويصدّر القائمة.",
      },
      {
        en: "English and Arabic from one codebase, with end-to-end Playwright tests on the purchase flow.",
        ar: "العربية والإنجليزية من قاعدة كود واحدة، مع اختبارات Playwright شاملة لمسار الشراء.",
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS 4",
      "Postgres",
      "Drizzle",
      "Cloudflare R2",
      "Playwright",
    ],
    link: { label: "lamsa.page", href: "https://lamsa.page" },
  },
  {
    slug: "memar-aldiyar",
    title: { en: "Memar Aldiyar", ar: "معمار الديار" },
    kind: { en: "Real estate website", ar: "موقع تطوير عقاري" },
    status: CONCEPT,
    categories: ["interfaces"],
    media: {
      type: "web",
      hero: "/work/memar-hero.jpg",
      showcase: "/work/memar-showcase.jpg",
      mobile: "/work/memar-mobile.png",
    },
    tint: "rgba(196,160,84,0.2)",
    summary: {
      en: "An Arabic-first site for a luxury residential developer that gets a visitor from the first screen to a matching unit in a few steps.",
      ar: "موقع عربي لشركة تطوير عقاري فاخر يوصل الزائر من أول شاشة إلى الوحدة المناسبة له في خطوات قليلة.",
    },
    role: { en: "Design and front-end", ar: "التصميم وبرمجة الواجهة" },
    challenge: {
      en: "Present high-end projects with calm, photo-led design, and keep the path from landing to a matching property short.",
      ar: "عرض مشاريع فاخرة بتصميم هادئ تقوده الصورة، مع إبقاء الطريق من الصفحة الأولى إلى العقار المناسب قصيرًا.",
    },
    solution: [
      {
        en: "A hero with a live project card: build progress, starting price and handover date.",
        ar: "واجهة رئيسية معها بطاقة لمشروع قيد التنفيذ تعرض نسبة الإنجاز والسعر وموعد التسليم.",
      },
      {
        en: "A three-field search (city, type, price) that filters the listing grid in place, with a result count and a reset.",
        ar: "بحث بثلاثة معايير (المدينة، النوع، السعر) يفلتر شبكة العقارات في مكانها، مع عدد النتائج وزر إعادة الضبط.",
      },
      {
        en: "Arabic-first layout, not mirrored English: icons, arrows and the progress bar follow the reading direction, and prices never flip.",
        ar: "تخطيط عربي من الأساس لا نسخة إنجليزية معكوسة: الأيقونات والأسهم وشريط الإنجاز تتبع اتجاه القراءة، والأسعار لا تنقلب.",
      },
      {
        en: "Built at 390px first, then widened to 1440px. Images are lazy-loaded in fixed ratios so nothing shifts.",
        ar: "بُني على 390 بكسل أولًا ثم اتسع إلى 1440. الصور تُحمّل عند الحاجة بنسب ثابتة فلا يتحرك شيء أثناء التحميل.",
      },
    ],
    stack: STATIC_STACK,
    note: CONCEPT_NOTE,
  },
  {
    slug: "sudeem",
    title: { en: "Sudeem", ar: "سُديم" },
    kind: { en: "Perfume storefront", ar: "متجر عطور" },
    status: CONCEPT,
    categories: ["ecommerce"],
    media: {
      type: "web",
      hero: "/work/sudeem-hero.jpg",
      showcase: "/work/sudeem-showcase.jpg",
      mobile: "/work/sudeem-mobile.png",
    },
    tint: "rgba(180,120,70,0.2)",
    summary: {
      en: "A quiet storefront for an Arabic perfume brand, where the product photo leads and the add-to-cart button is never far.",
      ar: "واجهة متجر هادئة لعلامة عطور عربية، الصورة فيها هي البطل وزر الإضافة للسلة قريب دائمًا.",
    },
    role: { en: "Design and front-end", ar: "التصميم وبرمجة الواجهة" },
    challenge: {
      en: "Let the product photography carry the page, and take a shopper to the cart without distraction.",
      ar: "أن تحمل صور المنتجات الصفحة، وأن يصل المشتري إلى السلة دون تشتيت.",
    },
    solution: [
      {
        en: "A product grid rendered from one data array: notes, size, rating, price and price before discount.",
        ar: "شبكة منتجات تُبنى من مصفوفة بيانات واحدة: النوتات والحجم والتقييم والسعر والسعر قبل الخصم.",
      },
      {
        en: "Live search that filters while typing, with a clear empty state.",
        ar: "بحث فوري يفلتر أثناء الكتابة، مع رسالة واضحة عند عدم وجود نتائج.",
      },
      {
        en: "Add to cart updates a live counter and shows a toast that screen readers announce.",
        ar: "الإضافة للسلة تحدّث العدّاد وتُظهر إشعارًا تعلنه قارئات الشاشة.",
      },
      {
        en: "Discount percentages and Latin names such as Eau de Parfum are direction-isolated, so no line breaks its order.",
        ar: "نسب الخصم والأسماء اللاتينية مثل Eau de Parfum معزولة الاتجاه، فلا يختل ترتيب أي سطر.",
      },
    ],
    stack: STATIC_STACK,
    note: CONCEPT_NOTE,
  },
  {
    slug: "madar",
    title: { en: "Madar", ar: "مَدار" },
    kind: { en: "Store admin dashboard", ar: "لوحة تحكم متجر" },
    status: CONCEPT,
    categories: ["ecommerce", "interfaces"],
    media: {
      type: "web",
      hero: "/work/madar-hero.png",
      showcase: "/work/madar-showcase.png",
      mobile: "/work/madar-mobile.png",
    },
    tint: "rgba(99,102,241,0.18)",
    summary: {
      en: "One screen that tells a store owner how much sold, what sells and which orders are waiting.",
      ar: "شاشة واحدة يعرف منها صاحب المتجر كم باع، وما الذي يُباع، وأي الطلبات تنتظره.",
    },
    role: { en: "Design and front-end", ar: "التصميم وبرمجة الواجهة" },
    challenge: {
      en: "Charts are the hardest part of an Arabic dashboard: axes, legends and tooltips all assume left to right.",
      ar: "الرسوم البيانية أصعب جزء في لوحة عربية: المحاور والمفاتيح والتلميحات كلها تفترض الاتجاه من اليسار لليمين.",
    },
    solution: [
      {
        en: "Four KPI cards with change against the previous period and a sparkline each.",
        ar: "أربع بطاقات مؤشرات مع نسبة التغير عن الفترة السابقة ورسم مصغّر لكل مؤشر.",
      },
      {
        en: "RTL charts: the value axis sits on the right, legends and tooltips read right to left.",
        ar: "رسوم تتبع الاتجاه العربي: المحور الرأسي على اليمين، والمفاتيح والتلميحات من اليمين لليسار.",
      },
      {
        en: "An orders table with status tabs and live search. On phones the sidebar becomes a drawer and the table becomes cards.",
        ar: "جدول طلبات بتبويبات للحالة وبحث فوري. على الموبايل تتحول القائمة الجانبية إلى درج والجدول إلى بطاقات.",
      },
      {
        en: "Charts draw after the Arabic font has loaded, and the revenue data is also exposed as a text table for screen readers.",
        ar: "الرسوم تُرسم بعد تحميل الخط العربي، وبيانات الإيرادات متاحة أيضًا كجدول نصي لقارئات الشاشة.",
      },
    ],
    stack: ["HTML5", "Tailwind CSS", "JavaScript", "Chart.js 4", "Lucide"],
    note: {
      en: "Concept project with sample data. The design and the code are mine.",
      ar: "مشروع عرض ببيانات تجريبية. التصميم والكود من عملي.",
    },
  },
  {
    slug: "dar-alsidra",
    title: { en: "Dar Alsidra", ar: "دار السدرة" },
    kind: { en: "Restaurant website", ar: "موقع مطعم" },
    status: CONCEPT,
    categories: ["interfaces"],
    media: {
      type: "web",
      hero: "/work/dar-hero.jpg",
      showcase: "/work/dar-showcase.jpg",
      mobile: "/work/dar-mobile.png",
    },
    tint: "rgba(190,110,60,0.2)",
    summary: {
      en: "A dark, photo-led site for a contemporary Arabic restaurant that leads from the mood of the room to the menu and a table.",
      ar: "موقع داكن تقوده الصورة لمطعم عربي معاصر، ينقل أجواء المكان ثم يقود إلى القائمة وحجز الطاولة.",
    },
    role: { en: "Design and front-end", ar: "التصميم وبرمجة الواجهة" },
    challenge: {
      en: "Carry the mood of the place from the first screen, then move the visitor to the menu and the booking form.",
      ar: "نقل أجواء المكان من أول شاشة، ثم قيادة الزائر إلى القائمة ونموذج الحجز.",
    },
    solution: [
      {
        en: "A menu with four tabs that switch in place and work from the keyboard.",
        ar: "قائمة طعام بأربعة تبويبات تتبدل في مكانها وتعمل بلوحة المفاتيح.",
      },
      {
        en: "A booking form (date, time, guests, seating, notes) with inline validation that screen readers announce.",
        ar: "نموذج حجز (التاريخ، الوقت، الضيوف، الجلسة، ملاحظات) بتحقق فوري تعلنه قارئات الشاشة.",
      },
      {
        en: "Date and time fields stay left to right inside the Arabic page, so they read without ambiguity.",
        ar: "حقول التاريخ والوقت تبقى باتجاه لاتيني داخل الصفحة العربية حتى تُقرأ بلا التباس.",
      },
      {
        en: "Menu photos load only for the active tab, and the mobile hero gets its own darker gradient to keep the text readable.",
        ar: "صور القائمة تُحمّل للتبويب النشط فقط، وللواجهة على الموبايل تدرّج أغمق خاص يبقي النص مقروءًا.",
      },
    ],
    stack: STATIC_STACK,
    note: CONCEPT_NOTE,
  },
  {
    slug: "fashionshop",
    title: { en: "Fashionshop", ar: "Fashionshop" },
    kind: { en: "Fashion store app", ar: "تطبيق متجر أزياء" },
    status: { en: "Team project", ar: "مشروع فريق" },
    categories: ["ecommerce"],
    media: {
      type: "app",
      screens: ["/work/fashion-2.jpg", "/work/fashion-1.jpg", "/work/fashion-3.jpg"],
    },
    tint: "rgba(214,72,60,0.3)",
    summary: {
      en: "A store app that takes shoppers from browsing to checkout and gives the owner a sales dashboard.",
      ar: "تطبيق متجر يأخذ المشتري من التصفح إلى إتمام الطلب، ويعطي صاحب المتجر لوحة مبيعات.",
    },
    role: {
      en: "Flutter engineer: checkout, catalogue, Firebase setup and the UI upgrade.",
      ar: "مهندس Flutter: إتمام الطلب، الكتالوج، إعداد Firebase وتطوير الواجهة.",
    },
    challenge: {
      en: "A fashion retailer needs more than a catalogue. Shoppers must find a product fast and see where their order is; the owner must see what sells.",
      ar: "متجر الأزياء يحتاج أكثر من كتالوج: المشتري يجب أن يجد المنتج بسرعة ويعرف أين طلبه، وصاحب المتجر يجب أن يرى ما يُباع.",
    },
    solution: [
      {
        en: "Search with filters and sorting across Women, Men and Kids, with size and colour selection.",
        ar: "بحث بفلاتر وترتيب عبر أقسام النساء والرجال والأطفال، مع اختيار المقاس واللون.",
      },
      {
        en: "Checkout with a saved address, then an order tracking timeline with a Buy again action.",
        ar: "إتمام الطلب بعنوان محفوظ، ثم خط زمني لتتبع الطلب مع زر الشراء مجددًا.",
      },
      {
        en: "An owner dashboard: revenue by day, orders by status and top products.",
        ar: "لوحة لصاحب المتجر: الإيراد اليومي، الطلبات حسب الحالة، والمنتجات الأكثر مبيعًا.",
      },
      {
        en: "Cubit over a repository layer, so the same UI runs on Firebase or on a sample store.",
        ar: "Cubit فوق طبقة مستودعات، فتعمل الواجهة نفسها على Firebase أو على متجر تجريبي.",
      },
    ],
    stack: ["Flutter", "Dart", "Firebase Auth", "Cloud Firestore", "Cubit", "Material 3"],
    note: {
      en: "Began as a three-person team project. There is no payment gateway: checkout ends when the order is placed.",
      ar: "بدأ كمشروع فريق من ثلاثة أشخاص. لا توجد بوابة دفع: إتمام الطلب ينتهي عند تسجيله.",
    },
  },
  {
    slug: "estashirna",
    title: { en: "Estashirna", ar: "استشيرنا" },
    kind: { en: "AI legal assistant", ar: "مساعد قانوني بالذكاء الاصطناعي" },
    status: { en: "Team project", ar: "مشروع فريق" },
    categories: ["web-ai"],
    media: {
      type: "app",
      screens: ["/work/estashirna-2.jpg", "/work/estashirna-1.jpg", "/work/estashirna-3.jpg"],
    },
    tint: "rgba(150,34,72,0.36)",
    summary: {
      en: "A legal assistant in Arabic and English, grounded in Egyptian law: chat, document analysis and guided case intake.",
      ar: "مساعد قانوني بالعربية والإنجليزية يستند إلى القانون المصري: محادثة، تحليل مستندات، واستقبال موجّه للقضايا.",
    },
    role: {
      en: "The Flutter app, the legal-data pipeline, and data preparation and evaluation for the AraBERT classifier.",
      ar: "تطبيق Flutter، ومسار تجهيز البيانات القانونية، وإعداد البيانات والتقييم لمصنّف AraBERT.",
    },
    challenge: {
      en: "People with a legal problem want a clear answer before they pay a lawyer, in their own language.",
      ar: "صاحب المشكلة القانونية يريد إجابة واضحة قبل أن يدفع لمحامٍ، وبلغته.",
    },
    solution: [
      {
        en: "An AI chat with saved sessions and starter questions, plus a searchable consultation history.",
        ar: "محادثة ذكية بجلسات محفوظة وأسئلة جاهزة للبدء، مع سجل استشارات قابل للبحث.",
      },
      {
        en: "Document upload that returns a summary with a confidence score, and a PDF report in Arabic or English.",
        ar: "رفع مستند يعيد ملخصًا مع درجة ثقة، وتقرير PDF بالعربية أو الإنجليزية.",
      },
      {
        en: "A pipeline in Python, pandas and SQL that turned an Egyptian legal corpus into a clean dataset.",
        ar: "مسار بيانات بـ Python و pandas و SQL حوّل مدوّنة قانونية مصرية إلى مجموعة بيانات نظيفة.",
      },
      {
        en: "Data preparation and evaluation for an AraBERT v2 classifier that reached about 99% accuracy.",
        ar: "إعداد البيانات والتقييم لمصنّف AraBERT v2 وصل إلى دقة تقارب 99%.",
      },
    ],
    stack: ["Flutter", "Dart", "Python", "pandas", "AraBERT v2", "Django REST", "Gemini RAG"],
    note: {
      en: "Team graduation project. The Django REST backend and the Gemini RAG are the team's work.",
      ar: "مشروع تخرج لفريق. الواجهة الخلفية Django REST ونظام Gemini RAG من عمل الفريق.",
    },
  },
];

export const filters: { id: "all" | Category; label: L }[] = [
  { id: "all", label: { en: "All", ar: "الكل" } },
  { id: "web-ai", label: { en: "Web apps & AI", ar: "تطبيقات ويب وذكاء اصطناعي" } },
  { id: "ecommerce", label: { en: "E-commerce", ar: "تجارة إلكترونية" } },
  { id: "interfaces", label: { en: "Interfaces", ar: "واجهات" } },
];
