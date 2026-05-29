const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => res.send('ok'));

function buildEmailHTML(plan, nutrition) {
  const days = plan.days || [];
  const meals = nutrition?.dailyMeals || [];

  const dayRows = days.map(d => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1A2540;vertical-align:top;width:120px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0057FF;">${d.day}</div>
        <div style="font-size:12px;color:#9BA8BF;margin-top:4px;">${d.focus}</div>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #1A2540;font-size:13px;color:#9BA8BF;line-height:1.7;">${d.details}</td>
    </tr>
  `).join('');

  const mealRows = meals.map(d => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1A2540;vertical-align:top;width:120px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#4CAF82;">${d.day}</div>
        <div style="font-size:12px;color:#9BA8BF;margin-top:4px;">${d.calories||''} cal</div>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #1A2540;font-size:13px;color:#9BA8BF;line-height:1.7;">${d.meals}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0A0F1E;font-family:'Inter',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0F1E;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background:#0F1628;border-radius:16px 16px 0 0;padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);">
    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background:#0057FF;border-radius:9px;width:36px;height:36px;text-align:center;vertical-align:middle;">
          <span style="color:white;font-size:18px;font-weight:800;">D</span>
        </td>
        <td style="padding-left:10px;">
          <span style="font-size:20px;font-weight:800;color:#FFFFFF;">Daily<span style="color:#0057FF;">Athlete</span></span>
        </td>
      </tr>
    </table>
    <div style="margin-top:8px;font-size:11px;color:#6B7A99;letter-spacing:2px;text-transform:uppercase;">AI-Powered Performance Coach</div>
  </td></tr>

  <!-- Program title -->
  <tr><td style="background:linear-gradient(135deg,rgba(0,61,184,0.5),rgba(0,87,255,0.25));padding:32px;text-align:center;border-bottom:1px solid rgba(0,87,255,0.3);">
    <div style="display:inline-block;background:rgba(0,87,255,0.25);color:#60A0FF;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:5px 16px;border-radius:50px;border:1px solid rgba(0,87,255,0.3);margin-bottom:12px;">✦ Your Personalized Program</div>
    <div style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;margin-bottom:12px;">${plan.programTitle}</div>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.7;max-width:480px;margin:0 auto;">${plan.summary}</div>
  </td></tr>

  <!-- Overview -->
  <tr><td style="background:#0F1628;padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:12px;">📋 Weekly Structure & Progression</div>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.8;">${plan.weeklyOverview}</div>
  </td></tr>

  <!-- Training Schedule -->
  <tr><td style="background:#111827;padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:16px;">📅 7-Day Training Schedule</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1A2540;border-radius:12px;overflow:hidden;">
      ${dayRows}
    </table>
  </td></tr>

  ${nutrition ? `
  <!-- Nutrition -->
  <tr><td style="background:#0F1628;padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:12px;">🍽️ Nutrition Plan</div>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.8;margin-bottom:20px;">${nutrition.diet}</div>
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#4CAF82;margin-bottom:16px;">🥗 Daily Meals</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1A2540;border-radius:12px;overflow:hidden;">
      ${mealRows}
    </table>
  </td></tr>

  <!-- Supplements & Recovery -->
  <tr><td style="background:#111827;padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:12px;">💊 Supplement Stack</div>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.8;margin-bottom:20px;">${nutrition.supplements}</div>
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:12px;">😴 Recovery Protocol</div>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.8;">${nutrition.recovery}</div>
  </td></tr>
  ` : ''}

  <!-- Upgrade CTA -->
  <tr><td style="background:#0F1628;padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);">
    <div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">🤖 Want your coach to adapt this daily?</div>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.6;margin-bottom:20px;max-width:400px;margin-left:auto;margin-right:auto;">Upgrade to Daily Coach for real-time AI coaching, daily meal plans, step-by-step recipes, and weekly check-ins.</div>
    <a href="https://dailyathlete.app" style="display:inline-block;background:#0057FF;color:#FFFFFF;font-size:14px;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;">Upgrade to Daily Coach — $4.99/mo</a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#0A0F1E;padding:24px 32px;text-align:center;border-radius:0 0 16px 16px;">
    <div style="font-size:12px;color:#6B7A99;line-height:1.6;">© 2026 DailyAthlete. All rights reserved.<br/>
    <a href="https://dailyathlete.app/privacy-policy.html" style="color:#6B7A99;">Privacy Policy</a> · 
    <a href="https://dailyathlete.app/terms-and-conditions.html" style="color:#6B7A99;">Terms</a> · 
    <a href="https://dailyathlete.app/contact.html" style="color:#6B7A99;">Contact</a></div>
    <div style="font-size:11px;color:#3A4A6A;margin-top:8px;">DailyAthlete provides general fitness and nutrition information for educational purposes only. Always consult your physician before beginning any exercise or nutrition program.</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

app.post('/api/send-email', async (req, res) => {
  try {
    const { email, plan, nutrition } = req.body;
    if (!email || !plan) return res.status(400).json({ error: 'Missing email or plan' });

    const html = buildEmailHTML(plan, nutrition);

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'DailyAthlete <coach@dailyathlete.app>',
        to: email,
        subject: `Your Program: ${plan.programTitle}`,
        html
      })
    });

    const d = await r.json();
    if (d.error) return res.status(500).json({ error: d.error });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/claude', async (req, res) => {
  try {
    const { prompt, mode } = req.body;

    const systems = {
      training: `You are an elite sports performance coach and certified strength & conditioning specialist. Create specific training programs — exact exercises, sets, reps, rest periods, weight guidance (RPE), coaching cues. Health conditions are hard rules. Respond with ONLY valid complete JSON, no markdown, no backticks.`,
      nutrition: `You are an elite registered dietitian. Give specific nutrition plans — exact calories, macros in grams, meal portions, supplement doses. Only clean supplements: no heavy metals, no sucralose, no artificial sweeteners. Food allergies and medications are absolute hard rules. Respond with ONLY valid complete JSON, no markdown, no backticks.`,
      coach: `You are an elite AI sports performance coach. Respond in plain text — warm, direct, specific, immediately actionable. 2-4 sentences max.`
    };

    const maxTokens = { training: 4000, nutrition: 4000, coach: 500 };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens[mode] || 4000,
        system: systems[mode] || systems.training,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    if (!data.content || !data.content.length) {
      return res.status(500).json({ error: JSON.stringify(data) });
    }

    const text = data.content.map(b => b.text || '').join('');

    if (mode === 'coach') return res.json({ reply: text });

    const result = JSON.parse(text.replace(/```json|```/g, '').trim());
    res.json({ result });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('DailyAthlete API running on port ' + PORT));
