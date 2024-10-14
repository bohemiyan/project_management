const axios = require("axios");
const { logWriter } = require("../Logger/LogWriter.js");
const whatsappKey =
  "EAANAzkmn6HABOZBEVJg5IggnBBBf6jvSG6HykabY8YxAlwFuj8bD8r1pCD0LpePMBFTuZCmAtCklgl2DQi0mK2ZB6oBDXH9lXG24AehB5almvyOU7ZBzWuX7Wu8HChZB2NtWqEG1QODDdSx4IJgSlwFj29ZAAAZAQRwZCTPFxB9xvlOtrjroe7J69yCKtD7tRfwe";
const id = 200729016450993;
const logger = logWriter("WhatsApp-Messages");

const createWhatsAppTemplate = (to, type, parameters) => ({
  messaging_product: "whatsapp",
  to: to,
  type: "template",
  template: {
    name: `${type}_alert`,
    language: { code: "en_US" },
    components: [{ type: "body", parameters }],
  },
});

exports.sendWhatsappmsg = async (datas) => {
  const config = {
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${whatsappKey}`,
    },
  };

  let parameters;
  if (datas.type === "gateway") {
    parameters = [
      { type: "text", text: datas.displayID },
      { type: "text", text: datas.lastseen },
    ];
  } else if (datas.type === "audit") {
    parameters = [
      { type: "text", text: datas.displayID },
      { type: "text", text: datas.auditID },
      { type: "text", text: datas.remarks },
    ];
  } else {
    parameters = [{ type: "text", text: datas.displayID }];
  }

  const type = datas.type === "gateway" ? "gateway" : "tree";

  const results = [];

  for (const number of datas.numbers) {
    const whatsappTemplate = createWhatsAppTemplate(number, type, parameters);
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v17.0/${id}/messages`,
        whatsappTemplate,
        config
      );

      logger.info(`WhatsApp message sent successfully to ${number}`);
      results.push(response);
    } catch (error) {
      logger.error(`Error sending WhatsApp message to ${number}`, error);
    }
  }

  return results;
};
