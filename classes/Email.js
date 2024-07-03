import Mailjet from "node-mailjet";

export class Email {
  static send(sender, recipient, subject, htmlBody) {
    const mailjet = Mailjet.apiConnect(
      process.env.MAILJET_API_KEY,
      process.env.MAILJET_SECRET_KEY
    );

    return mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: sender.email,
            Name: sender.name,
          },
          To: [
            {
              Email: recipient.email,
            },
          ],
          Subject: subject,
          HTMLPart: htmlBody,
        },
      ],
    });
  }
}
