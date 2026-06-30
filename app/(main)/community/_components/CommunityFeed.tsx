// src/app/community/_components/CommunityFeed.tsx
"use client";

import { useState } from "react";

const MOCK_QUESTIONS = [
  {
    id: "1",
    title: "ما هي أفضل الطرق لتسعير جلسات تصوير الـ UGC للبراندات الناشئة؟",
    content: "بقالي فترة بشتغل كصانع محتوى وبواجه مشكلة في تحديد سعر السيشن للشركات اللي لسه بتبدأ، هل السعر يكون ثابت ولا على حسب حجم الحملة الإعلانية؟ مفضل خبرتكم..",
    user: { name: "أحمد كمال", role: "talent", is_verified: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" },
    tags: ["تسعير", "صناعة المحتوى", "UGC"],
    answers_count: 5,
    views: 142,
    status: "open",
    created_at: "منذ ساعتين"
  },
  {
    id: "2",
    title: "مطلوب نصيحة: براند فاشون بيبحث عن مواهب لعمل حملة صيفية بالأسكندرية",
    content: "بنرتب لحملة تصوير خارجية ومحتاجين موديلز وإنفلونسرز مقيمين في الأسكندرية أو يقدروا يتواجدوا هناك، إيه أفضل طريقة لتصفية المتقدمين عشان نضمن التزامهم بالوقت؟",
    user: { name: "براند سارة للفاشون", role: "brand", is_verified: false, avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Sara" },
    tags: ["حملة_صيفية", "تنسيق", "فاشون"],
    answers_count: 12,
    views: 310,
    status: "pinned",
    created_at: "منذ يوم"
  }
];

export default function CommunityFeed() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* الفلترة والبحث مع مسافات حقيقية */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10">
        {/* التابس */}
        <div className="flex bg-slate-950/60 p-1.5 rounded-xl border border-slate-850 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${activeTab === "all" ? "btn-primary text-black" : "text-(--text-secondary) hover:text-(--text-primary)"}`}
          >
            كل الأسئلة
          </button>
          <button 
            onClick={() => setActiveTab("popular")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${activeTab === "popular" ? "btn-primary text-black" : "text-(--text-secondary) hover:text-(--text-primary)"}`}
          >
            الأكثر تفاعلاً
          </button>
        </div>

        {/* بار البحث */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="ابحث عن سؤال أو تاق..." 
            className="w-full border text-sm rounded-xl px-4 py-3 focus:outline-none transition-colors"
            style={{ 
              backgroundColor: "var(--bg-card)", 
              borderColor: "var(--bg-border)",
              color: "var(--text-primary)"
            }}
          />
        </div>
      </div>

      {/* قائمة الأسئلة بالـ Glass Panel و الـ Card Hover */}
      <div className="space-y-6">
        {MOCK_QUESTIONS.map((q) => (
          <article 
            key={q.id} 
            className="glass-panel glass-panel-hover card-hover rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer"
          >
            <div className="flex items-start gap-4 flex-1">
              {/* الصورة والتوثيق */}
              <div className="relative shrink-0 w-12 h-12">
                <img src={q.user.avatar} alt={q.user.name} className="w-full h-full rounded-full border border-slate-800 bg-slate-900" />
                {q.user.is_verified && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#00D26A] rounded-full border-2 flex items-center justify-center text-[9px] text-white" style={{ borderColor: "var(--bg-card)" }}>✓</span>
                )}
              </div>

              {/* تفاصيل السؤال والمسافات */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 flex-wrap text-xs">
                  <span className="font-bold text-(--text-secondary)">{q.user.name}</span>
                  <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase ${q.user.role === 'brand' ? 'badge-purple' : 'badge-teal'}`}>
                    {q.user.role === 'brand' ? 'براند' : 'موهبة'}
                  </span>
                  {q.status === 'pinned' && (
                    <span className="badge-gold text-[10px] px-2.5 py-1 rounded-md font-bold">مُثبت 📌</span>
                  )}
                  <span className="text-(--text-secondary) opacity-60">{q.created_at}</span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-(--text-primary) hover:text-(--color-teal) transition-colors">
                  {q.title}
                </h3>
                
                <p className="text-sm text-(--text-secondary) line-clamp-2 leading-relaxed">
                  {q.content}
                </p>

                {/* التاقات */}
                <div className="flex gap-2 pt-2 flex-wrap">
                  {q.tags.map(tag => (
                    <span key={tag} className="text-xs bg-slate-950/60 text-(--text-secondary) px-3 py-1.5 rounded-md border border-slate-850">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* العدادات على اليمين مع خلفية البانل المرتفع */}
            <div className="flex md:flex-col gap-4 md:gap-2 justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 items-center text-center" style={{ borderColor: "var(--bg-border)" }}>
              <div className="rounded-xl px-5 py-3 border flex flex-col items-center justify-center" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--bg-border)", minWidth: "85px" }}>
                <span className="block text-xl font-black" style={{ color: "var(--color-teal)" }}>{q.answers_count}</span>
                <span className="text-xs text-(--text-secondary)">أجوبة</span>
              </div>
              <div className="text-xs text-(--text-secondary) opacity-50 px-2">
                <span>{q.views} مشاهدة</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}