import { supabaseServer } from '@/lib/supabase';

export type NewsRecord = {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  body: string;
  cover_image?: string | null;
  status: 'draft' | 'published' | 'review' | 'scheduled';
  created_at: string;
};

type NewsPayload = {
  title: string;
  slug: string;
  author: string;
  category: string;
  body: string;
  cover_image?: string | null;
  status: NewsRecord['status'];
};

type NewsUpdatePayload = Partial<NewsPayload> & {
  id: string;
};

export const SEED_NEWS: NewsRecord[] = [
  {
    id: "seed-1",
    title: "مفتي الهند يرحب باتفاق السلام الإيراني الأمريكي ويشيد بالدعم الدولي",
    slug: "india-mufti-welcomes-iran-us-peace-agreement",
    author: "قسم التحرير",
    category: "Religion",
    body: "رحب سماحة مفتي الهند باتفاق السلام التاريخي الأخير بين إيران والولايات المتحدة الأمريكية، مشيداً بالجهود الدبلوماسية الدولية التي ساهمت في خفض التوترات الإقليمية. وفي بيان رسمي صدر اليوم من نيودلهي، أكد سماحته أن هذا الاتفاق يمثل خطوة حيوية نحو تعزيز الأمن والاستقرار العالمي والمحلي، ويسهم بشكل كبير في حماية مصالح الشعوب وسلامها. ودعا سماحته كافة القوى الدولية والمؤسسات العالمية إلى دعم هذا المسار الدبلوماسي البناء وضمان استمرارية الحوار لحل كافة النزاعات القائمة بطرق سلمية وحضارية، بما يخدم السلام العالمي الشامل.",
    cover_image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "seed-2",
    title: "العلاقات الاقتصادية الهندية العربية تشهد نمواً تاريخياً في الربع الأول من عام 2026",
    slug: "india-arab-economic-relations-growth-2026",
    author: "سمير أحمد",
    category: "Economy",
    body: "أظهرت التقارير الرسمية الصادرة عن وزارة التجارة والصناعة الهندية نمواً غير مسبوق في حجم التبادل التجاري والاستثمارات المتبادلة بين جمهورية الهند والدول العربية الشقيقة خلال الربع الأول من العام الجاري. وشهدت قطاعات التكنولوجيا، والطاقة المتجددة، والبنية التحتية، والأمن الغذائي تدفقات استثمارية كبرى تعكس عمق الشراكة الاستراتيجية بين الجانبين. وأكد خبراء اقتصاديون أن هذا النمو يأتي تتويجاً لسلسلة من الاتفاقيات الاقتصادية الشاملة التي تم توقيعها مؤخراً، مما يمهد الطريق لمزيد من التعاون والازدهار المشترك في السنوات المقبلة.",
    cover_image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: "seed-3",
    title: "مبادرة كبرى لتطوير تقنيات الذكاء الاصطناعي بالتعاون بين الهند والخليج العربي",
    slug: "india-gulf-ai-development-initiative",
    author: "نورة القحطاني",
    category: "World",
    body: "أعلنت وزارة تكنولوجيا المعلومات والاتصالات الهندية بالتعاون مع مجلس التعاون الخليجي عن إطلاق مبادرة تكنولوجية مشتركة تهدف إلى تسريع وتيرة البحث والتطوير في مجالات الذكاء الاصطناعي والتعلم الآلي. تشمل المبادرة تمويل مشاريع ناشئة مشتركة وتأسيس مراكز تميز ابتكارية في كل من نيودلهي والرياض ودبي. وتهدف هذه الخطوة الاستراتيجية إلى تعزيز السيادة الرقمية وتوفير حلول مبتكرة للقطاعات الخدمية مثل الرعاية الصحية المتقدمة والتعليم الذكي والمدن المستدامة، مما يضع المنطقة في طليعة الثورة الصناعية الرابعة.",
    cover_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "seed-4",
    title: "انطلاق مهرجان الثقافة والفنون العربية الهندية في نيودلهي بمشاركة واسعة",
    slug: "india-arab-cultural-festival-new-delhi",
    author: "قسم الثقافة",
    category: "Culture",
    body: "افتتح معالي وزير الثقافة الهندي مساء أمس فعاليات مهرجان الثقافة والفنون العربية الهندية السنوي في العاصمة نيودلهي، بحضور لفيف من السفراء العرب والملحقين الثقافيين ونخبة من المفكرين والفنانين. يضم المهرجان هذا العام معارض تشكيلية مشتركة، وعروضاً موسيقية وفلكلورية حية تجسد التمازج الثقافي التاريخي الغني بين شبه القارة الهندية والعالم العربي. ويستمر المهرجان لمدة أسبوع كامل مقدماً ورش عمل فنية وندوات أدبية وعروضاً سينمائية تهدف إلى مد جسور التواصل الإنساني وتعميق الروابط الثقافية بين الشعوب.",
    cover_image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: "seed-5",
    title: "المنتخب الهندي لكرة القدم يدخل معسكراً مغلقاً استعداداً للتصفيات الآسيوية",
    slug: "india-football-team-camp-asian-qualifiers",
    author: "كريم منصور",
    category: "Sports",
    body: "بدأ المنتخب الهندي الأول لكرة القدم معسكراً تدريبياً مغلقاً استعداداً للمواجهات الحاسمة المرتقبة في التصفيات الآسيوية المؤهلة لبطولة كأس العالم. وأكد المدير الفني للمنتخب خلال مؤتمر صحفي عقده صباح اليوم على جاهزية اللاعبين وارتفاع الروح المعنوية للفريق، مشيراً إلى أن التدريبات ستركز على تعزيز الجوانب التكتيكية والبدنية لمواجهة الخصوم بقوة. وأعرب الجماهير الهندية عن دعمهم الكامل للمنتخب وتفاؤلهم بتحقيق نتائج تاريخية تؤهل الفريق للمحفل الكروي العالمي الكبير للمرة الأولى.",
    cover_image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    created_at: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

export async function listNews() {
  if (!supabaseServer) {
    return { ok: true as const, items: SEED_NEWS, source: 'fallback' as const };
  }

  const selectWithCover = await supabaseServer
    .from('news')
    .select('id,title,slug,author,category,body,cover_image,status,created_at')
    .order('created_at', { ascending: false });

  let data = selectWithCover.data;
  let error = selectWithCover.error;

  if (error?.message?.toLowerCase().includes('cover_image')) {
    const fallback = await supabaseServer
      .from('news')
      .select('id,title,slug,author,category,body,status,created_at')
      .order('created_at', { ascending: false });
    data = (fallback.data ?? []).map((item) => ({ ...item, cover_image: null }));
    error = fallback.error;
  }

  if (error) {
    return { ok: false as const, error: error.message, items: SEED_NEWS };
  }

  const items = (data ?? []) as NewsRecord[];
  if (items.length === 0) {
    return { ok: true as const, items: [], source: 'supabase' as const };
  }

  return { ok: true as const, items, source: 'supabase' as const };
}

export async function createNews(payload: NewsPayload) {
  if (!supabaseServer) {
    return { ok: false as const, error: 'Supabase is not configured yet.' };
  }

  const baseInsert = {
    title: payload.title,
    slug: payload.slug,
    author: payload.author,
    category: payload.category,
    body: payload.body,
    cover_image: payload.cover_image ?? null,
    status: payload.status
  };

  let insertResult = await supabaseServer
    .from('news')
    .insert(baseInsert)
    .select('id,title,slug,author,category,body,cover_image,status,created_at')
    .single();

  if (insertResult.error?.message?.toLowerCase().includes('cover_image')) {
    insertResult = await supabaseServer
      .from('news')
      .insert({
        title: payload.title,
        slug: payload.slug,
        author: payload.author,
        category: payload.category,
        body: payload.body,
        status: payload.status
      })
      .select('id,title,slug,author,category,body,status,created_at')
      .single();
  }

  if (insertResult.error) {
    return { ok: false as const, error: insertResult.error.message };
  }

  return { ok: true as const, item: insertResult.data as NewsRecord };
}

export async function updateNews(payload: NewsUpdatePayload) {
  if (!supabaseServer) {
    return { ok: false as const, error: 'Supabase is not configured yet.' };
  }

  const updates: Record<string, string | null> = {};
  if (typeof payload.title === 'string') updates.title = payload.title;
  if (typeof payload.slug === 'string') updates.slug = payload.slug;
  if (typeof payload.author === 'string') updates.author = payload.author;
  if (typeof payload.category === 'string') updates.category = payload.category;
  if (typeof payload.body === 'string') updates.body = payload.body;
  if (typeof payload.cover_image !== 'undefined') updates.cover_image = payload.cover_image ?? null;
  if (typeof payload.status === 'string') updates.status = payload.status;

  const result = await supabaseServer
    .from('news')
    .update(updates)
    .eq('id', payload.id)
    .select('id,title,slug,author,category,body,cover_image,status,created_at')
    .single();

  if (result.error?.message?.toLowerCase().includes('cover_image')) {
    const fallback = await supabaseServer
      .from('news')
      .update({
        title: payload.title as string | undefined,
        slug: payload.slug as string | undefined,
        author: payload.author as string | undefined,
        category: payload.category as string | undefined,
        body: payload.body as string | undefined,
        status: payload.status as NewsRecord['status'] | undefined
      })
      .eq('id', payload.id)
      .select('id,title,slug,author,category,body,status,created_at')
      .single();

    if (fallback.error) {
      return { ok: false as const, error: fallback.error.message };
    }

    return {
      ok: true as const,
      item: fallback.data ? ({ ...fallback.data, cover_image: null } as NewsRecord) : null
    };
  }

  if (result.error) {
    return { ok: false as const, error: result.error.message };
  }

  return { ok: true as const, item: result.data as NewsRecord };
}

export async function deleteNews(id: string) {
  if (!supabaseServer) {
    return { ok: false as const, error: 'Supabase is not configured yet.' };
  }

  const result = await supabaseServer.from('news').delete().eq('id', id);
  if (result.error) {
    return { ok: false as const, error: result.error.message };
  }

  return { ok: true as const };
}

export async function getNewsBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);

  if (supabaseServer) {
    let withCover = await supabaseServer
      .from('news')
      .select('id,title,slug,author,category,body,cover_image,status,created_at')
      .eq('slug', decodedSlug)
      .maybeSingle();

    if (!withCover.data && decodedSlug !== slug) {
      withCover = await supabaseServer
        .from('news')
        .select('id,title,slug,author,category,body,cover_image,status,created_at')
        .eq('slug', slug)
        .maybeSingle();
    }

    if (withCover.error?.message?.toLowerCase().includes('cover_image')) {
      const fallback = await supabaseServer
        .from('news')
        .select('id,title,slug,author,category,body,status,created_at')
        .eq('slug', decodedSlug)
        .maybeSingle();

      if (fallback.data) {
        return {
          ok: true as const,
          item: { ...fallback.data, cover_image: null } as NewsRecord
        };
      }
    }

    if (withCover.data) {
      return { ok: true as const, item: withCover.data as NewsRecord };
    }
  }

  const seedMatch = SEED_NEWS.find((item) => item.slug === slug || item.slug === decodedSlug);
  if (seedMatch) {
    return { ok: true as const, item: seedMatch };
  }

  return { ok: true as const, item: null };
}

export async function getNewsById(id: string) {
  if (!supabaseServer) {
    return { ok: false as const, error: 'Supabase is not configured yet.' };
  }

  const withCover = await supabaseServer
    .from('news')
    .select('id,title,slug,author,category,body,cover_image,status,created_at')
    .eq('id', id)
    .maybeSingle();

  if (withCover.error?.message?.toLowerCase().includes('cover_image')) {
    const fallback = await supabaseServer
      .from('news')
      .select('id,title,slug,author,category,body,status,created_at')
      .eq('id', id)
      .maybeSingle();

    if (fallback.error) {
      return { ok: false as const, error: fallback.error.message };
    }

    return {
      ok: true as const,
      item: fallback.data ? ({ ...fallback.data, cover_image: null } as NewsRecord) : null
    };
  }

  if (withCover.error) {
    return { ok: false as const, error: withCover.error.message };
  }

  return { ok: true as const, item: withCover.data as NewsRecord | null };
}

export function translateCategory(cat?: string | null): string {
  if (!cat) return '';
  const clean = cat.trim();
  const lower = clean.toLowerCase();

  switch (lower) {
    case 'breaking news':
    case 'breaking':
    case ' عاجل':
    case 'عاجل':
      return 'أخبار عاجلة';
    case 'world':
      return 'أخبار العالم';
    case 'economy':
    case 'business':
    case 'الاقتصاد':
      return 'مال وأعمال';
    case 'sports':
    case 'sport':
      return 'الرياضة';
    case 'culture':
    case 'arts':
      return 'ثقافة وفنون';
    case 'religion':
    case 'islamic':
      return 'شؤون دينية';
    case 'politics':
      return 'سياسة';
    case 'video':
      return 'فيديو';
    default:
      return clean;
  }
}

