"use client";
import { useState, useMemo } from "react";
import type { TalentCard } from "../page";
import ExploreHero from "./ExploreHero";
import ExploreFilters from "./ExploreFilters";
import ExploreGrid from "./ExploreGrid";

export type SortOption = "price_asc" | "price_desc" | "rating" | "newest";
export type ModeOption = "dark" | "light";

const TALENT_TYPES = [
  { key: "all",        label_ar: "الكل",           label_en: "All" },
  { key: "ugc",        label_ar: "مبدع محتوى UGC", label_en: "UGC Creator" },
  { key: "influencer", label_ar: "مؤثر",           label_en: "Influencer" },
  { key: "host",       label_ar: "مذيع / مقدم",    label_en: "Host / Presenter" },
  { key: "model",      label_ar: "موديل",           label_en: "Model" },
  { key: "actor",      label_ar: "ممثل",            label_en: "Actor" },
];

function matchesType(talent: TalentCard, type: string): boolean {
  if (type === "all") return true;
  // Check specialties first (most specific), then category as fallback
  const specialties = (talent.specialties ?? []).join(" ").toLowerCase();
  const category = (talent.category ?? "").toLowerCase();
  const map: Record<string, { specs: string[]; cats: string[] }> = {
    ugc:        { specs: ["ugc", "content creator", "محتوى", "مبدع", "كونتنت"], cats: ["ugc"] },
    influencer: { specs: ["مؤثر", "مؤثرة", "influencer", "تأثير"],              cats: [] },
    host:       { specs: ["مذيع", "مقدم", "مقدمة", "host", "presenter"],        cats: [] },
    model:      { specs: ["موديل", "model", "أزياء", "فاشن"],                   cats: [] },
    actor:      { specs: ["ممثل", "ممثلة", "actor", "acting", "تمثيل"],         cats: [] },
  };
  const rule = map[type];
  if (!rule) return false;
  if (rule.specs.some(kw => specialties.includes(kw))) return true;
  if (rule.cats.length && rule.cats.includes(category)) return true;
  return false;
}

interface Props { talents: TalentCard[] }

export default function ExploreClient({ talents }: Props) {
  const [search,   setSearch]   = useState("");
  const [type,     setType]     = useState("all");
  const [sort,     setSort]     = useState<SortOption>("rating");
  const [mode,     setMode]     = useState<ModeOption>("dark");
  const [lang,     setLang]     = useState<"ar" | "en">("ar");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [verified, setVerified] = useState(false);

  const filtered = useMemo(() => {
    let list = talents.filter(t => {
      if (search) {
        const q = search.toLowerCase();
        if (!t.name.toLowerCase().includes(q) && !(t.category ?? "").toLowerCase().includes(q)) return false;
      }
      if (!matchesType(t, type)) return false;
      if (verified && !t.verified) return false;
      if (t.starting_price !== null) {
        if (t.starting_price < minPrice || t.starting_price > maxPrice) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price_asc")  return (a.starting_price ?? 99999) - (b.starting_price ?? 99999);
      if (sort === "price_desc") return (b.starting_price ?? 0)     - (a.starting_price ?? 0);
      if (sort === "rating")     return b.rating - a.rating;
      return 0;
    });

    return list;
  }, [talents, search, type, sort, minPrice, maxPrice, verified]);

  const dark = mode === "dark";

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: dark ? "#050B12" : "#F1F5F9",
      fontFamily: "'Cairo', sans-serif",
      direction: lang === "ar" ? "rtl" : "ltr",
    }}>
      <ExploreHero
        dark={dark} lang={lang} search={search} onSearch={setSearch}
        mode={mode} onModeToggle={() => setMode(m => m === "dark" ? "light" : "dark")}
        onLangToggle={() => setLang(l => l === "ar" ? "en" : "ar")}
        types={TALENT_TYPES} activeType={type} onTypeChange={setType}
        resultCount={filtered.length}
      />

      <div style={{
        maxWidth: 1440, margin: "0 auto",
        padding: "24px 24px 60px",
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: 24,
      }}>
        <ExploreFilters
          dark={dark} lang={lang}
          sort={sort} onSort={setSort}
          minPrice={minPrice} maxPrice={maxPrice}
          onMinPrice={setMinPrice} onMaxPrice={setMaxPrice}
          verified={verified} onVerified={setVerified}
          types={TALENT_TYPES} activeType={type} onTypeChange={setType}
        />
        <ExploreGrid dark={dark} lang={lang} talents={filtered} />
      </div>
    </div>
  );
}
