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
    <main
      className="min-h-screen pt-32 pb-20"
      style={{ backgroundColor: "#0A0A0F" }}
    >
      <div className="mx-auto max-w-2xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Excluir Conta do Quibly
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Account Deletion Request
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 sm:p-10"
          style={{
            backgroundColor: "#141420",
            border: "1px solid #2A2A3E",
          }}
        >
          {/* Steps */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Como solicitar a exclusão
            </h2>
            <ol className="list-decimal space-y-2 pl-5 text-gray-400">
              <li>Abra o aplicativo Quibly</li>
              <li>
                Vá até o <strong className="text-gray-300">Perfil</strong>{" "}
                (ícone no canto inferior direito)
              </li>
              <li>
                Toque em{" "}
                <strong className="text-gray-300">Configurações</strong>
              </li>
              <li>
                Role para baixo e toque em{" "}
                <strong className="text-gray-300">
                  &quot;Excluir minha conta&quot;
                </strong>
              </li>
              <li>Confirme a exclusão</li>
            </ol>
            <p className="mt-4 text-gray-500">
              Alternativa: envie um e-mail para{" "}
              <a
                href="mailto:support@tryquibly.com?subject=Excluir%20minha%20conta"
                className="text-blue-500 underline hover:text-blue-400"
              >
                support@tryquibly.com
              </a>{" "}
              com o assunto{" "}
              <strong className="text-gray-300">
                &quot;Excluir minha conta&quot;
              </strong>
              .
            </p>
          </section>

          {/* Data deleted */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Dados que serão excluídos
            </h2>
            <ul className="space-y-2 pl-5 text-gray-400 list-disc">
              <li>Informações do perfil (nome, e-mail, foto)</li>
              <li>Histórico e progresso de estudos</li>
              <li>Quizzes e flashcards criados</li>
              <li>Dados de participação em ligas</li>
              <li>Tokens de notificação push</li>
            </ul>
          </section>

          {/* Data retained */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Dados que podem ser retidos
            </h2>
            <ul className="space-y-2 pl-5 text-gray-400 list-disc">
              <li>
                <strong className="text-gray-300">
                  Registros de transações financeiras
                </strong>{" "}
                (exigidos por lei) — mantidos por até 5 anos
              </li>
              <li>
                <strong className="text-gray-300">
                  Logs de segurança anonimizados
                </strong>{" "}
                — mantidos por até 90 dias
              </li>
            </ul>
          </section>

          {/* Timeline */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-white">Prazo</h2>
            <p className="text-gray-400">
              A exclusão da conta e dos dados é processada em até{" "}
              <strong className="text-gray-300">30 dias</strong>. Você receberá
              um e-mail de confirmação quando o processo for concluído.
            </p>
          </section>
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-sm text-gray-600">
          Quibly &copy; 2026 — Todos os direitos reservados
        </p>
      </div>
    </main>
  );
}
