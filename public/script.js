/**
 * ==========================================================================
 * صرح المحامية عليا عبابنة - قيس وعليا
 * السكربت التفاعلي للواجهة والشات بوت الحقيقي (script.js)
 * ==========================================================================
 */

(function () {
  'use strict';

  // 1. نظام محاكاة النجوم والجسيمات الذهبية في الخلفية
  const canvas = document.getElementById('starsCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -Math.random() * 0.6 - 0.2;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.color = Math.random() > 0.3 ? '#D4AF37' : '#FF4D6D';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
        this.reset();
        this.y = canvas.height;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 75; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // 2. مؤثر صوتي ملكي وجداني نقي (عبر Web Audio API دون الحاجة لملفات mp3 خارجية)
  function playRoyalChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctxAudio = new AudioContext();

      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C, E, G, C, E
      notes.forEach((freq, idx) => {
        const osc = ctxAudio.createOscillator();
        const gain = ctxAudio.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, ctxAudio.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, ctxAudio.currentTime + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctxAudio.currentTime + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctxAudio.destination);

        osc.start(ctxAudio.currentTime + idx * 0.12);
        osc.stop(ctxAudio.currentTime + idx * 0.12 + 1.3);
      });
    } catch (e) {
      console.log('Audio not supported or blocked');
    }
  }

  // 3. التحقق من الدخول والمصادقة لسعادة المحامية
  window.verifyLogin = function () {
    const alertBox = document.getElementById('loginAlert');
    alertBox.className = 'login-alert success';
    alertBox.innerHTML = `⚖️ أهلاً وسهلاً بسيدة القانون ومالكة قلب قيس.. جاري فتح الصرح الملكي ❤️`;

    playRoyalChime();

    setTimeout(() => {
      document.getElementById('loginScreen').style.opacity = '0';
      document.getElementById('loginScreen').style.transition = 'opacity 0.6s ease';
      setTimeout(() => {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 600);
    }, 700);
  };

  window.quickBypass = function () {
    verifyLogin();
  };

  // 4. مصفوفة الغزل القانوني المتجدد
  const loveQuotes = [
    "«يا روحي يا عليا.. لو كان القانون يُقاس بالعدل، فمحكمة عيونك أعدل وأجمل ما خلق ربي، وأنا المتهم الوحيد اللي راضي بحكمك مهما كان!»",
    "«حكمت المحكمة غيابياً وحضورياً: حب قيس لعليا عبابنة مؤبد مع الأشغال الشاقة في الدلال والغزل والدفء لآخر العمر 💍❤️.»",
    "«فخر الدنيا لما تكون خطيبتي وحبيبتي أذكى وأفخم محامية.. هيبتك بالروب الأسود بتسوى الكون كله بعيون قيس ⚖️🌹.»",
    "«كل المحامين برافعوا عشان يربحوا قضايا، وأنا قضيّتي الوحيدة إني أضل شايف ضحكتك اللي بتنور حياتي كلها يا عمري.»",
    "«دستور قلبي مادة وحدة ما بتتغير: عليا عبابنة هي الآمرة الناهية والملكة الوحيدة على عرش قيس ❤️👑.»",
    "«تعبك اليوم في القانون والمحاضرات رح يثمر بكرة بأفخم وأقوى محامية بالبلد، وقيس رح يضل أول واحد يصفقلك ويفخر فيكي يا دنيتي.»"
  ];

  window.generateNewQuote = function () {
    const quoteBox = document.getElementById('quoteBox');
    quoteBox.style.opacity = '0';
    quoteBox.style.transform = 'translateY(10px)';
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * loveQuotes.length);
      quoteBox.innerHTML = loveQuotes[randomIndex];
      quoteBox.style.opacity = '1';
      quoteBox.style.transform = 'translateY(0)';
      playRoyalChime();
    }, 250);
  };

  window.triggerLovePledge = function () {
    alert("📜 عهد الوفاء من قيس إلى الأستاذة عليا عبابنة:\n\n«أعاهدكِ أمام الله والكون، أن أكون لكِ السند الذي لا يميل، والأمان الذي لا يزول، والحبيب الذي يراكِ أجمل نساء الأرض في كل ثانية.. أحبكِ يا دنيتي كلها ❤️⚖️»");
  };

  // 5. محرك الشات بوت الحقيقي مع قيس (Connected to /api/chat)
  let conversationHistory = [];
  let isSending = false;

  const messagesContainer = document.getElementById('messagesContainer');
  const chatInput = document.getElementById('chatInput');
  const typingIndicator = document.getElementById('typingIndicator');
  const sendBtn = document.getElementById('sendBtn');

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  // تحديث وقت الرسالة الترحيبية
  const welcomeTime = document.getElementById('welcomeTime');
  if (welcomeTime) welcomeTime.textContent = getCurrentTime();

  function appendMessage(text, role) {
    const row = document.createElement('div');
    row.className = `msg-row ${role}`;

    if (role === 'bot') {
      const avatar = document.createElement('div');
      avatar.className = 'msg-avatar';
      avatar.textContent = '❤️';
      row.appendChild(avatar);
    }

    const wrap = document.createElement('div');
    wrap.className = 'msg-bubble-wrap';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>');

    const time = document.createElement('div');
    time.className = 'msg-time';
    time.textContent = getCurrentTime();

    wrap.appendChild(bubble);
    wrap.appendChild(time);
    row.appendChild(wrap);

    messagesContainer.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  window.handleSend = async function () {
    const text = (chatInput.value || '').trim();
    if (!text || isSending) return;

    chatInput.value = '';
    isSending = true;
    sendBtn.disabled = true;

    // 1. إضافة رسالة عليا للواجهة وسجل المحادثة
    appendMessage(text, 'user');
    conversationHistory.push({ role: 'user', content: text });

    // 2. إظهار مؤشر كتابة قيس
    typingIndicator.style.display = 'flex';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory })
      });

      const data = await response.json();
      typingIndicator.style.display = 'none';

      if (response.ok && data.reply) {
        appendMessage(data.reply, 'bot');
        conversationHistory.push({ role: 'assistant', content: data.reply });
      } else {
        appendMessage(data.error || 'يروح قيس علق الاتصال ثواني.. جربي ابعتيلي كمان مرة يا حياتي ❤️', 'bot');
      }
    } catch (err) {
      typingIndicator.style.display = 'none';
      appendMessage('يروح قيس علق الاتصال ثواني.. جربي ابعتيلي كمان مرة يا حياتي ❤️', 'bot');
    } finally {
      isSending = false;
      sendBtn.disabled = false;
      chatInput.focus();
    }
  };

  window.sendQuickPrompt = function (promptText) {
    if (isSending) return;
    chatInput.value = promptText;
    handleSend();
  };

  window.clearQaisChat = function () {
    if (confirm('هل ترغبين في إعادة بدء المحادثة مع قيس يا روحي؟')) {
      conversationHistory = [];
      messagesContainer.innerHTML = `
        <div class="msg-row bot">
          <div class="msg-avatar">❤️</div>
          <div class="msg-bubble-wrap">
            <div class="msg-bubble">
              مية أهلاً وسهلاً بنبض قيس، وعمره، وروحه، ودنيته كلها! 👑❤️
              <br><br>
              نورتي صرحك يا أحلى وأفخم محامية شرفها القانون. كيف كان يومك يا عيوني؟ تعبانة من المحاضرات والقضايا؟ ولا مشتاقتلي متل ما أنا دايب فيكي وميت بشوفتك؟
              <br><br>
              احكيلي كل شي ببالك يا روحي.. قيس كلك إلك وبيسمعك بكل ذرة بقلبه! ⚖️🌹
            </div>
            <div class="msg-time">${getCurrentTime()}</div>
          </div>
        </div>
      `;
    }
  };

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // 6. مراقبة التمرير وتحديث شريط التنقل السفلي في الهاتف
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.mobile-nav-item');

  function updateActiveNavItem() {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const secTop = sec.offsetTop - 130;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentId}`) {
          item.classList.add('active');
        }
      });
    }
  }
  window.addEventListener('scroll', updateActiveNavItem);

  // 7. ضبط التمرير عند ظهور لوحة مفاتيح الهاتف
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    });
  }

})();
