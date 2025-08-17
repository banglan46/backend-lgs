const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// 🔑 API Key dari Tripay
const TRIPAY_API_KEY = "DEV-O0yQnf6dIOwmB4ERZetysN3aSitsjQk6l2PF6kiA";

// ✅ Endpoint checkout
app.post("/checkout", async (req, res) => {
  try {
    let { amount } = req.body;
    let invoice = "INV" + Date.now();

    let response = await axios.post(
      "https://tripay.co.id/api/transaction/create",
      {
        method: "QRIS",
        merchant_ref: invoice,
        amount: amount
      },
      { headers: { Authorization: "Bearer " + TRIPAY_API_KEY } }
    );

    res.json({
      invoice: invoice,
      qr_url: response.data.data.qr_url
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Gagal membuat transaksi" });
  }
});

// ✅ Callback dari Tripay
app.post("/callback", (req, res) => {
  let data = req.body;
  console.log("Callback data:", data);

  if (data.status === "PAID") {
    console.log(`Invoice ${data.merchant_ref} sudah dibayar ✅`);
    // TODO: update database voucher jadi "sold"
  }

  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend jalan di port " + PORT));