import { Product } from "@/types";

export const INITIAL_CATALOG: Omit<Product, "id" | "created_at">[] = [
  // ==================== MEN (رجالي) ====================
  {
    name: "Dior Homme Intense",
    price: 1200,
    description: "ملك الأناقة البودرية بزهرة السوسن، عطر الهيبة والمناسبات الكبرى.",
    gender: "men",
    category: "شتوي / رسمي",
    image: "/assets/images/products/men.png",
    inspired_by_name: "Dior Homme Intense",
    notes: {
      top: ["البرغموت", "الزعفران", "الكركديه"],
      middle: ["زهرة السوسن", "البنفسج", "الكاكاو"],
      base: ["خشب الصندل", "خشب الأرز", "الباتشولي", "الفانيليا"]
    },
    is_best_seller: true
  },
  {
    name: "Creed Aventus",
    price: 1800,
    description: "مزيج الأناناس والروائح المدخنة، العطر 'الأسطورة' الأكثر طلباً وشهرة عالمياً.",
    gender: "men",
    category: "جوكر (كل الفصول)",
    image: "/assets/images/products/men.png",
    inspired_by_name: "Creed Aventus",
    notes: {
      top: ["الأناناس", "البرغموت", "التوت"],
      middle: ["الورق المجفف", "البنفسج", "الياسمين"],
      base: ["خشب الصندل", "المسك", "الأبنوس"]
    },
    is_best_seller: true
  },
  {
    name: "Bleu de Chanel EDP",
    price: 950,
    description: "عنوان النظافة والجاذبية، عطر حمضي خشبي منعش ومثالي للعمل والنهار.",
    gender: "men",
    category: "صيفي / يومي",
    image: "/assets/images/products/men.png",
    inspired_by_name: "Bleu de Chanel EDP",
    notes: {
      top: ["البرغموت", "النعناع", "الفلفل"],
      middle: ["الريحان", "الزعفران", "الجريب فروت"],
      base: ["خشب الصندل", "العود", "الزبادي"]
    },
    is_best_seller: true
  },
  {
    name: "Sauvage Elixir",
    price: 1400,
    description: "'وحش الأداء'، تركيبة مركزة جداً من التوابل واللافندر بفوحان وثبات جبار.",
    gender: "men",
    category: "شتوي / ليلي",
    image: "/assets/images/products/men.png",
    inspired_by_name: "Sauvage Elixir",
    notes: {
      top: ["الكمون", "الزعفران", "الكركديه"],
      middle: ["اللافندر", "القرفة", "الحبق"],
      base: ["خشب الصندل", "الباتشولي", "الفانيليا"]
    },
    is_best_seller: true
  },
  {
    name: "Terre d'Hermès",
    price: 1100,
    description: "عطر الشخصية القيادية، يمزج بين رائحة البرتقال المنعش وتراب الأرض والأخشاب.",
    gender: "men",
    category: "خريفي / صيفي",
    image: "/assets/images/products/men.png",
    inspired_by_name: "Terre d'Hermès",
    notes: {
      top: ["البرتقال", "الفل", "الزعفت"],
      middle: ["الفلفل", "بنجر", "الريحان"],
      base: ["خشب الأرز", "الراتينغ", "البنتلي"]
    },
    is_best_seller: false
  },
  {
    name: "Stronger With You Intensely",
    price: 850,
    description: "دفء القرفة والفانيليا، عطر 'سويت' يعطي إحساساً بالراحة والجاذبية في البرد.",
    gender: "men",
    category: "شتوي / جذاب",
    image: "/assets/images/products/men.png",
    inspired_by_name: "Stronger With You Intensely",
    notes: {
      top: ["القرفة", "الزعفت", "الفليفلة"],
      middle: ["البرقوق", "الفانيليا", "الكاراميل"],
      base: ["خشب الصندل", "المسك", "الراتينغ"]
    },
    is_best_seller: false
  },
  {
    name: "Xerjoff Naxos",
    price: 2200,
    description: "فخامة أرستقراطية من العسل والتبغ واللافندر، يمثل قمة الرقي في عطور النيش.",
    gender: "men",
    category: "نيش / شتوي",
    image: "/assets/images/products/men.png",
    inspired_by_name: "Xerjoff Naxos",
    notes: {
      top: ["اللافندر", "البرغموت", "الزعفران"],
      middle: ["العسل", "القرفة", "دهن العنبر"],
      base: ["ورق التبغ", "خشب الصندل", "الفانيلياً"]
    },
    is_best_seller: true
  },
  {
    name: "Acqua di Giò Parfum",
    price: 900,
    description: "روح البحر، عطر مائي منعش مع لمسة بخور، الخيار الأول للأجواء الحارة.",
    gender: "men",
    category: "صيفي / نهاري",
    image: "/assets/images/products/men.png",
    inspired_by_name: "Acqua di Giò Parfum",
    notes: {
      top: ["البرغموت", "الياسمين", "الملح"],
      middle: ["البخور", "إبرة الراعي", "الريحان"],
      base: ["خشب الصندل", "المسك", "الراتينغ"]
    },
    is_best_seller: false
  },
  {
    name: "Versace Eros Energy",
    price: 750,
    description: "أحدث إصدارات 2025، انفجار من الليمون والحمضيات للشعور بالحيوية والنشاط.",
    gender: "men",
    category: "صيفي / شبابي",
    image: "/assets/images/products/men.png",
    inspired_by_name: "Versace Eros Energy",
    notes: {
      top: ["الليم", "الجريب فروت", "البرتقال"],
      middle: ["الريحان", "إبرة الراعي", "الفلفل الوردي"],
      base: ["خشب الأرز", "المسك", "الراتينغ"]
    },
    is_best_seller: false
  },
  {
    name: "Boss Bottled Absolu",
    price: 850,
    description: "الفائز بجوائز 2025، عطر خشبي دافئ يجمع بين الحداثة والوقار الرجالي.",
    gender: "men",
    category: "شتوي / خريفي",
    image: "/assets/images/products/men.png",
    inspired_by_name: "Boss Bottled Absolu",
    notes: {
      top: ["التفاح", "الكشمش", "الزعفت"],
      middle: ["القرفة", "زنجبيل", "الكركديه"],
      base: ["خشب الصندل", "باتشولي", "فانيلياً"]
    },
    is_best_seller: false
  },

  // ==================== WOMEN (حريمي) ====================
  {
    name: "Amouage Guidance 46",
    price: 2500,
    description: "'الجوهرة العمانية'، عطر كريمي ساحر بالبندق والكمثرى بفوحان نووي وفريد.",
    gender: "women",
    category: "نيش فاخر / شتوي",
    image: "/assets/images/products/women.png",
    inspired_by_name: "Amouage Guidance 46",
    notes: {
      top: ["الكمثرى", "البرغموت", "الزعفران"],
      middle: ["الياسمين", "الإيلنغ", "البنفسج"],
      base: ["الباتشولي", "خشب الصندل", "المسك", "الصمغ"]
    },
    is_best_seller: true
  },
  {
    name: "Valaya",
    price: 1400,
    description: "'إشراقة الصباح'، رائحة المسك والزهور البيضاء التي تعطي إحساس الرفاهية والنقاء.",
    gender: "women",
    category: "صيفي / نظافة",
    image: "/assets/images/products/women.png",
    inspired_by_name: "Valaya - Parfums de Marly",
    notes: {
      top: ["البرغموت", "الكمثرى", "الفريز"],
      middle: ["الياسمين", "الزهور البيضاء", "الجونيبل"],
      base: ["المسك", "خشب الصندل", "الأزين"]
    },
    is_best_seller: true
  },
  {
    name: "Delina La Rosée",
    price: 1100,
    description: "ورد مائي منعش مع ليتشي، العطر الأنثوي الأكثر نعومة وإشراقاً في الحر.",
    gender: "women",
    category: "صيفي / ربيعي",
    image: "/assets/images/products/women.png",
    inspired_by_name: "Delina La Rosée",
    notes: {
      top: ["الليتشي", "البرغموت", "اليانسون"],
      middle: ["الورود", "الفريز", "الياسمين"],
      base: ["المسك", "خشب الصندل", "فانيلياً"]
    },
    is_best_seller: true
  },
  {
    name: "Libre Intense",
    price: 950,
    description: "عطر المرأة القوية، مزيج متقن من اللافندر الفرنسي وفانيلياً مدغشقر.",
    gender: "women",
    category: "شتوي / رسمي",
    image: "/assets/images/products/women.png",
    inspired_by_name: "Libre Intense - YSL",
    notes: {
      top: ["اللافندر", "البرغموت", "الريحان"],
      middle: ["الياسمين", "البرتقال الأزهر", "فانيلياً"],
      base: ["المسك", "الأمبري", "خشب الصندل"]
    },
    is_best_seller: false
  },
  {
    name: "Baccarat Rouge 540",
    price: 1800,
    description: "'السر الغامض'، رائحة الزعفران والحلويات التي أصبحت رمزاً للأناقة العصرية.",
    gender: "women",
    category: "كل الفصول / مسائي",
    image: "/assets/images/products/women.png",
    inspired_by_name: "Baccarat Rouge 540",
    notes: {
      top: ["الزعفران", "الفل", "البرغموت"],
      middle: ["الياسمين", "الأمبري", "الجونيبل"],
      base: ["المسك", "خشب الصندل", "فانيلياً"]
    },
    is_best_seller: true
  },
  {
    name: "L'Interdit",
    price: 1000,
    description: "ملك الزهور البيضاء الجذابة، عطر سهرات ساحر ومحبوب جداً في المنطقة.",
    gender: "women",
    category: "شتوي / مسائي",
    image: "/assets/images/products/women.png",
    inspired_by_name: "L'Interdit - Givenchy",
    notes: {
      top: ["البرغموت", "الكمثرى", "الفريز"],
      middle: ["الزهور البيضاء", "الياسمين", "الأوركيد"],
      base: ["المسك", "فانيلياً", "خشب الصندل"]
    },
    is_best_seller: true
  },
  {
    name: "Shalimar L'Essence",
    price: 1300,
    description: "تحديث لأيقونة جيرلان، فانيلياً مدخنة مع لمسة جلود تعكس الرقي التاريخي.",
    gender: "women",
    category: "شتوي كلاسيكي",
    image: "/assets/images/products/women.png",
    inspired_by_name: "Shalimar L'Essence - Guerlain",
    notes: {
      top: ["البرغموت", "الزعفران", "الفل"],
      middle: ["الياسمين", "الورود", "البنفسج"],
      base: ["فانيلياً", "خشب الصندل", "الجلود", "الراتينغ"]
    },
    is_best_seller: false
  }
];
