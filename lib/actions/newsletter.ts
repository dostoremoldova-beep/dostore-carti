"use server";

import { prisma } from "@/lib/prisma";

export type NewsletterState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    return { status: "error", message: "Introdu o adresă de email validă." };
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return {
      status: "success",
      message: "Te-ai abonat cu succes! Verifică-ți emailul pentru confirmare.",
    };
  } catch {
    return {
      status: "error",
      message: "A apărut o eroare. Te rugăm încearcă din nou.",
    };
  }
}
