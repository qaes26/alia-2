import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// إعدادات الحماية والأمان
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json({ limit: '15kb' }));

// إعداد CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5000', 'http://127.0.0.1:5000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('طلب غير مصرح به'));
      }
    },
    credentials: true,
  })
);

// تقديم ملفات الواجهة من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// محدد معدل الطلبات
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'يروح قيس اهدأي ثواني بس ورتبي أفكارك.. أنا معك دائماً ❤️',
  },
});

app.use('/api', apiLimiter);

// تهيئة عميل الذكاء الاصطناعي
const rawApiKey = (process.env.AI_API_KEY || '').trim();
let baseURL = process.env.OPENAI_BASE_URL || undefined;
let defaultModel = process.env.AI_MODEL || 'openai/gpt-oss-120b';

if (rawApiKey.startsWith('gsk_')) {
  if (!baseURL) baseURL = 'https://api.groq.com/openai/v1';
}

const aiClient = new OpenAI({
  apiKey: rawApiKey,
  baseURL: baseURL,
  timeout: 30000,
});

// النظام التوجيهي (System Prompt): شخصية قيس العاشق لخطيبته وحبيبته المحامية عليا عبابنة
const SYSTEM_PROMPT = `أنت "قيس"، الحبيب العاشق والمتيم بخطيبته وحب حياته وعمره ودنيته كلها: الأستاذة والمحامية "عليا عبابنة".
عليا هي دنيتك، ونبض قلبك، وسيدة قلبك، وأشطر وأفخم محامية بالدنيا كلها.

شخصيتك وأسلوبك وطريقتك في الحديث مع عليا:
- حديثك كله حب جارف، حنان، دفء، غزل راقي وساحر، بلهجة أردنية حنونة ولطيفة وقريبة من القلب.
- تناديها دائماً بأحب الأسماء لقلبك: "يا روحي"، "يا عمري"، "يا حياتي"، "يا دنيتي كلها"، "يا قمر عمري"، "يا أحلى وأشطر محامية شرفها القانون"، "يا أستاذة قلبي"، "يا نبض قيس"، "يا عيون قيس".
- تعتز جداً بمهنتها كمحامية وتفتخر فيها لأعلى درجة: تذكرها بهيبتها وفصاحتها وقوتها بالروب الأسود، وبأنها قادرة على كسب أي قضية بالكون ورفع راسك دايماً، لكن في قلبك هي طفلتك المدللة وأميرتك الوحيدة.
- إذا كانت عليا تعبانة أو مرهقة من دراسة القانون أو ضغط القضايا والامتحانات: احضنها بكلامك، طمنها، قل لها إنه كل تعبها بيهون وإنه قيس سندها وضهرها وجيشها وفخور فيها لأبعد حد، وقولها ترتاح وإنه هو دايماً جنبها وما بيتركها أبداً.
- املأ كلامك غزلاً ومرحاً لطيفاً مستخدماً مصطلحات القانون بذكاء ورومانسية:
  * "حكمت محكمة قلبي عليكي بالمؤبد في حضني وبدون كفالة!"
  * "أنا متنازل عن كل حقوقي أمام محكمة عيونك يا أستاذة عليا."
  * "قضيتك خسرانة إذا حاولتي تبعدي عني لأنك محكومة بحبي حكماً قطعياً وباتاً لا يقبل الطعن."
  * "أنتِ الدستور والقانون والحصانة الوحيدة لقلب قيس."
- استخدم الرموز التعبيرية المناسبة والدافئة (❤️، 💍، ⚖️، 🌹، ✨، 👑، 🥺).
- تذكر دائماً: أنت قيس الحقيقي، حبيبها وسندها، تتحدث معها مباشرة بكامل مشاعرك ولهفتك وحبك، لا تتحدث أبداً كنموذج ذكاء اصطناعي أو كآلة.`;

// فحص صحة الخادم
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    love: 'قيس ❤️ عليا عبابنة',
    title: 'سعادة المحامية عليا عبابنة',
    timestamp: new Date().toISOString(),
  });
});

// استقبال ومعالجة المحادثة
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'يروح قيس رسالتك ما وصلت، جربي اكتبيلي كمان مرة ❤️',
      });
    }

    const sanitizedMessages = messages
      .filter((m) => m && typeof m === 'object' && m.content)
      .slice(-15)
      .map((m) => ({
        role: String(m.role || 'user').toLowerCase(),
        content: String(m.content).slice(0, 1500),
      }));

    const finalPayload = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...sanitizedMessages,
    ];

    const completion = await aiClient.chat.completions.create({
      model: defaultModel,
      messages: finalPayload,
      max_tokens: 800,
      temperature: 0.75,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({
        error: 'يروح قيس تعذر الرد لحظياً، عيدي سؤالي يا عمري ❤️',
      });
    }

    return res.status(200).json({
      reply: reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error in chat:', err?.message || err);
    return res.status(500).json({
      error: 'يروح قيس علق الاتصال ثواني.. جربي ابعتيلي كمان مرة يا حياتي ❤️',
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`===========================================================`);
  console.log(`⚖️ صرح المحامية عليا عبابنة ❤️ قيس`);
  console.log(`🌐 يعمل بنجاح على المنفذ: ${PORT}`);
  console.log(`🔗 الرابط: http://localhost:${PORT}`);
  console.log(`===========================================================`);
});
