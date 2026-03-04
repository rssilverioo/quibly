import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Account – Quibly",
  description:
    "Learn how to request deletion of your Quibly account and understand what data is removed.",
  openGraph: {
    title: "Delete Account – Quibly",
    description:
      "Learn how to request deletion of your Quibly account and understand what data is removed.",
    url: "https://tryquibly.com/delete-account",
    siteName: "Quibly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quibly Delete Account",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Delete Account – Quibly",
    description:
      "Learn how to request deletion of your Quibly account and understand what data is removed.",
    images: ["/og-image.png"],
  },
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-32 pb-20 text-black dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-2xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Delete Your Quibly Account
          </h1>
          <p className="mt-2 text-lg text-neutral-500 dark:text-neutral-400">
            Account Deletion Request
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-8 sm:p-10">
          {/* Steps */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold">
              How to request deletion
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              To delete your account, send an email to{" "}
              <a
                href="mailto:support@tryquibly.com?subject=Delete%20my%20account"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-500"
              >
                support@tryquibly.com
              </a>{" "}
              with the subject{" "}
              <strong className="text-black dark:text-white">
                &quot;Delete my account&quot;
              </strong>
              . We will process your request and confirm via email.
            </p>
          </section>

          {/* Data deleted */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold">
              Data that will be deleted
            </h2>
            <ul className="space-y-2 pl-5 text-neutral-600 dark:text-neutral-400 list-disc">
              <li>Profile information (name, email, photo)</li>
              <li>Study history and progress</li>
              <li>Quizzes and flashcards created</li>
              <li>League participation data</li>
              <li>Push notification tokens</li>
            </ul>
          </section>

          {/* Data retained */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold">
              Data that may be retained
            </h2>
            <ul className="space-y-2 pl-5 text-neutral-600 dark:text-neutral-400 list-disc">
              <li>
                <strong className="text-black dark:text-white">
                  Financial transaction records
                </strong>{" "}
                (required by law) — kept up to 5 years
              </li>
              <li>
                <strong className="text-black dark:text-white">
                  Anonymized security logs
                </strong>{" "}
                — kept up to 90 days
              </li>
            </ul>
          </section>

          {/* Timeline */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Timeline</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Account and data deletion is processed within{" "}
              <strong className="text-black dark:text-white">30 days</strong>.
              You will receive an email confirmation once the process is
              complete.
            </p>
          </section>
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-sm text-neutral-400">
          Quibly &copy; 2026 — All rights reserved
        </p>
      </div>
    </main>
  );
}
