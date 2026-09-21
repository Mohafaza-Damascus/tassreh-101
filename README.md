# منصة تصريح — واجهة أمامية بلا أطر عمل

مشروع مستقل يستخدم **HTML5 و CSS3 و JavaScript خام فقط**.
لا يحتاج Node.js أو npm أو أي عملية بناء، ولا يعتمد على React أو JSX.
الاعتماد الخارجي الوحيد هو مكتبة **Leaflet** في صفحة لوحة التحكم لعرض الخرائط.

## التشغيل

افتح `index.html` مباشرة في المتصفح، أو شغّل خادماً محلياً بسيطاً:

```bash
python -m http.server 8000
```

> صفحة لوحة التحكم تحتاج اتصالاً بالإنترنت لتحميل Leaflet وبلاطات الخريطة.
> باقي الصفحات تعمل بالكامل دون اتصال لأن الخطوط والصور محلية.

## هيكل الملفات

```
index.html              الصفحة الرئيسية وبطاقات أنواع التصاريح
pages/                  صفحة HTML لكل خدمة
css/                    variables.css + ملف تنسيق واحد لكل صفحة
js/                     ملف سلوك واحد لكل صفحة
assets/                 الخطوط والصور والفيديوهات المحلية
```

## قاعدة التنظيم

كل صفحة مستقلة بالكامل: تحمّل `css/variables.css` ثم ملف CSS خاص بها فقط،
وتحمّل ملف JS واحداً خاصاً بها فقط.

- **لا توجد ملفات CSS أو JS مشتركة** عدا `css/variables.css`.
- **لا يُستخدم أي اسم كلاس في أكثر من ملف** — كل صفحة تستعمل بادئة خاصة بها
  (`home-`, `login-`, `elogin-`, `transport-`, `distributor-`, `rubble-`,
  `excavation-`, `tdetails-`, `ddetails-`, `rdetails-`, `edetails-`, `dash-`).
- `css/variables.css` هو **المصدر الوحيد** للخطوط والألوان والمسافات
  وأنصاف الأقطار والظلال والانتقالات.

## الصفحات

| HTML | CSS | JS |
|---|---|---|
| `index.html` | `css/index.css` | `js/index.js` |
| `pages/login.html` | `css/login.css` | `js/login.js` |
| `pages/excavation-login.html` | `css/excavation-login.css` | `js/excavation-login.js` |
| `pages/transport.html` | `css/transport.css` | `js/transport.js` |
| `pages/distributor.html` | `css/distributor.css` | `js/distributor.js` |
| `pages/rubble.html` | `css/rubble.css` | `js/rubble.js` |
| `pages/excavation.html` | `css/excavation.css` | `js/excavation.js` |
| `pages/transport-details.html` | `css/transport-details.css` | — |
| `pages/distributor-details.html` | `css/distributor-details.css` | — |
| `pages/rubble-details.html` | `css/rubble-details.css` | — |
| `pages/excavation-details.html` | `css/excavation-details.css` | — |
| `pages/dashboard.html` | `css/dashboard.css` | `js/dashboard.js` |

صفحات "مزيد من التفاصيل" ثابتة بلا سلوك، فلا ملف JS لها.

## ما تتشاركه الصفحات

بما أن الملفات منفصلة، فالتنسيق المشترك مكرّر داخل كل ملف بشكل مقصود.
الرابط الوحيد بين الصفحات هو **مفاتيح `sessionStorage`** المتفق عليها:

| المفتاح | يكتبه | يقرأه |
|---|---|---|
| `tasreh:last-permit` | نماذج التصاريح الأربعة | `js/index.js` لعرض نافذة النجاح |
| `tasreh:dashboard-user` | `js/login.js` | `js/dashboard.js` (حماية الصفحة) |
| `tasreh:excavation-user` | `js/excavation-login.js` | `js/excavation.js` (حماية الصفحة) |

## اتفاقيات مهمة

**الجداول القابلة للتكرار** تُعرّف بالكامل في HTML عبر سمات `data-*`،
ولا يوجد HTML مكتوب داخل JavaScript. البنية:

```html
<div data-repeater="materials" data-repeater-max="20">
  <tbody data-repeater-rows>…</tbody>
  <template data-repeater-template>…</template>
  <p data-repeater-empty hidden>…</p>
  <button data-repeater-add>…</button>
</div>
```

يُعاد ترقيم أسماء الحقول تلقائياً بالشكل `materials[0][count]` بعد كل إضافة أو حذف.

**حماية الصفحات** مكتوبة داخل ملف JS الخاص بالصفحة المحمية
(`js/dashboard.js` و `js/excavation.js`)، وتعيد التوجيه إلى صفحة الدخول
عند غياب الجلسة.

**سعر الأنقاض** لكل كيلوغرام يُضبط من HTML عبر `data-rubble-price="70"`.

## ملاحظات على المرحلة الحالية

- الأزرار لا تتصل بخادم أو قاعدة بيانات؛ الحفظ محلي وشكلي فقط.
- تسجيل الدخول تجريبي ويقبل أي اسم مستخدم وكلمة مرور غير فارغين،
  ولا يصلح للاستخدام الفعلي قبل ربطه بمصادقة حقيقية على الخادم.
- الفيديوهات التوضيحية غير مرفقة؛ راجع `assets/videos/README.md` لأسماء الملفات المطلوبة.
"# tassreh-101" 
"# tassreh-101" 
