import Mailjet from "node-mailjet";

const send = async (request, response) => {
  const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
  );

  const mailjetRequest = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "registration@self-platform.es",
          Name: "Self-Platform.es",
        },
        To: [
          {
            Email: "iadomyshev@gmail.com",
          },
        ],
        Subject: "Confirm Your Email",
        HTMLPart:
          "<h4>Dear customer!</h4>" +
          'We are really happy that you are registered in our application <a href="http://self-platform.es">Self-Platform.es</a>' +
          '<br/><br/>Please, confirm your email by clicking on <a href="http://self-platform.es/confirm-email/">this link</a>' +
          "<br /><br/>Thanks a lot and hope see you soon!",
      },
    ],
  });

  mailjetRequest
    .then(() => {
      response.status(200).json({ success: true });
    })
    .catch((err) => {
      response.status(500).json({ error: true });
    });
};

export default { send };
