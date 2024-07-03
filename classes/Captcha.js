export class Captcha {
  static async check(token) {
    const formData = new FormData();

    formData.append("secret", process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY);
    formData.append("response", token);

    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    const result = await fetch(url, {
      body: formData,
      method: "POST",
    });

    const outcome = await result.json();

    return !!outcome.success;
  }
}
