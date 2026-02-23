'use client'

import { useLocale } from 'next-intl'

export default function PrivacyPolicySection() {
  const locale = useLocale()

  if (locale === 'pt') return <PrivacyPT />
  return <PrivacyEN />
}

function PrivacyEN() {
  return (
    <main className="min-h-screen bg-white dark:bg-background text-black dark:text-white transition-colors duration-300 pt-32 pb-20">
      <article aria-labelledby="privacy-title" className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 id="privacy-title" className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light">
            Your data, your rules. Here&apos;s how we handle it.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">Last updated: February 23, 2026</p>
        </header>

        {/* 1. Introduction */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">1. Introduction</h2>
          <p>
            Quibly (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the Quibly mobile application (iOS and Android) and the website{' '}
            <a href="https://tryquibly.com" className="text-blue-600 dark:text-blue-400 underline">tryquibly.com</a> (collectively, the &quot;Service&quot;).
          </p>
          <p>
            This Privacy Policy explains what data we collect, how we use it, who we share it with, and what rights you have. We are committed to complying with the Brazilian General Data Protection Law (LGPD — Lei n.º 13.709/2018), the European General Data Protection Regulation (GDPR), and the privacy requirements of the Apple App Store and Google Play Store.
          </p>
          <p>
            By using Quibly, you agree to the collection and use of information as described in this policy. If you do not agree, please do not use the Service.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 2. Data We Collect */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">2. Data We Collect</h2>

          <h3 className="text-2xl font-semibold mt-8 mb-4">2.1 Account Data (provided by you)</h3>
          <ul>
            <li>Email address and password (via Firebase Authentication)</li>
            <li>Display name and profile photo (optional, uploaded by you)</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4">2.2 Study & Usage Data</h3>
          <ul>
            <li>Study sessions (duration, start and end timestamps)</li>
            <li>Pomodoro sessions and break intervals</li>
            <li>Daily study streaks (consecutive days)</li>
            <li>Performance statistics (quiz scores, flashcard review results)</li>
            <li>League and ranking participation data</li>
            <li>Study materials uploaded by you (PDFs, notes, slides) — processed by AI to generate flashcards and quizzes</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4">2.3 Technical Data</h3>
          <ul>
            <li>Device ID and device type</li>
            <li>App version and operating system</li>
            <li>Push notification tokens (Firebase Cloud Messaging)</li>
            <li>Advertising identifiers (collected by Google AdMob)</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4">2.4 Data We Do NOT Collect</h3>
          <ul>
            <li>GPS location</li>
            <li>Contacts or address book</li>
            <li>Browsing history</li>
            <li>Financial or payment data (no in-app purchases at this time)</li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 3. How We Use Your Data */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">3. How We Use Your Data</h2>
          <p>We use the data we collect to:</p>
          <ul>
            <li><strong>Provide the Service:</strong> Authenticate your account, generate flashcards and quizzes from your study materials using AI, track your study sessions and streaks, and power leagues and rankings.</li>
            <li><strong>Improve the Service:</strong> Analyze usage patterns to improve features, fix bugs, and optimize performance.</li>
            <li><strong>Send Notifications:</strong> Deliver study reminders, streak alerts, and league updates via push notifications (you can opt out at any time in your device settings).</li>
            <li><strong>Display Ads:</strong> Show personalized advertisements through Google AdMob to support the free tier of the Service.</li>
            <li><strong>Ensure Security:</strong> Detect and prevent fraud, abuse, and unauthorized access.</li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 4. AI Processing */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">4. AI Processing of Study Materials</h2>
          <p>
            When you upload study materials (PDFs, notes, slides, screenshots), our AI processes them to extract key concepts and generate flashcards and quizzes. Here&apos;s what you should know:
          </p>
          <ul>
            <li>Your materials are processed solely to provide you with study tools — never for any other purpose.</li>
            <li>We do <strong>not</strong> use your uploaded content to train, fine-tune, or improve any AI or machine learning models.</li>
            <li>Your documents are stored securely and are only accessible to you.</li>
            <li>You can delete your materials and all generated content at any time.</li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 5. Third-Party Services */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">5. Third-Party Services</h2>
          <p>We use the following third-party services to operate Quibly:</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 dark:border-white/10">
                  <th className="py-3 pr-4 font-semibold">Service</th>
                  <th className="py-3 pr-4 font-semibold">Purpose</th>
                  <th className="py-3 font-semibold">Data Shared</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-white/5">
                  <td className="py-3 pr-4">Firebase Authentication</td>
                  <td className="py-3 pr-4">User authentication & session management</td>
                  <td className="py-3">Email, password (hashed), auth tokens</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-white/5">
                  <td className="py-3 pr-4">Firebase Cloud Messaging</td>
                  <td className="py-3 pr-4">Push notifications</td>
                  <td className="py-3">Device tokens</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-white/5">
                  <td className="py-3 pr-4">Google AdMob</td>
                  <td className="py-3 pr-4">Personalized advertising</td>
                  <td className="py-3">Advertising ID, device info, usage data</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-white/5">
                  <td className="py-3 pr-4">Railway (PostgreSQL)</td>
                  <td className="py-3 pr-4">API hosting & data storage</td>
                  <td className="py-3">All user data (encrypted at rest)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6">
            Each third-party service has its own privacy policy. We encourage you to review them. We do <strong>not sell</strong> your personal data to any third party.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 6. Advertising */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">6. Advertising (Google AdMob)</h2>
          <p>
            Quibly&apos;s free tier is supported by ads served through Google AdMob. AdMob may collect and use advertising identifiers and device information to display personalized ads.
          </p>
          <p>You can manage your ad preferences:</p>
          <ul>
            <li><strong>iOS:</strong> Settings &gt; Privacy &gt; Tracking — disable tracking for Quibly.</li>
            <li><strong>Android:</strong> Settings &gt; Google &gt; Ads — opt out of personalized ads or reset your advertising ID.</li>
          </ul>
          <p>
            For more information, see <a href="https://policies.google.com/privacy" className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">Google&apos;s Privacy Policy</a>.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 7. Permissions */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">7. Device Permissions</h2>
          <p>Quibly may request the following device permissions:</p>
          <ul>
            <li><strong>Camera:</strong> Used for proof-of-study photos (study verification). Never accessed in the background.</li>
            <li><strong>Photo Library:</strong> Used to select a profile picture. We only access photos you explicitly choose.</li>
            <li><strong>Notifications:</strong> Used to send study reminders, streak alerts, and league updates. You can disable these in your device settings at any time.</li>
          </ul>
          <p>All permissions are optional. Quibly works without them — but some features may be limited.</p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 8. Local Storage */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">8. Cookies & Local Storage</h2>
          <p>
            The Quibly mobile app uses AsyncStorage (local device storage) to store preferences, session tokens, and cached data for offline functionality. This data stays on your device and is not transmitted to our servers unless required for the Service to function (e.g., authentication tokens).
          </p>
          <p>
            The Quibly website (tryquibly.com) may use cookies for authentication and analytics. You can manage cookie preferences through your browser settings.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 9. Data Retention */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">9. Data Retention</h2>
          <p>We retain your data as follows:</p>
          <ul>
            <li><strong>Account data:</strong> Retained while your account is active. Deleted within 30 days of account deletion request.</li>
            <li><strong>Study materials and generated content:</strong> Retained while your account is active. You can delete individual documents at any time.</li>
            <li><strong>Usage and analytics data:</strong> Retained in anonymized form for up to 24 months for service improvement.</li>
            <li><strong>Legal obligations:</strong> Certain data may be retained longer if required by applicable law.</li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 10. Data Security */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">10. Data Security</h2>
          <p>We take the security of your data seriously. Our measures include:</p>
          <ul>
            <li>Encryption in transit (TLS/HTTPS) and at rest</li>
            <li>Secure authentication via Firebase with token-based sessions</li>
            <li>Access controls limiting who can access user data internally</li>
            <li>Regular security reviews and updates</li>
          </ul>
          <p>
            While we implement industry-standard security practices, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security but are committed to protecting your data to the best of our ability.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 11. Your Rights */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">11. Your Rights</h2>
          <p>Under LGPD and GDPR, you have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data and account.</li>
            <li><strong>Portability:</strong> Request your data in a structured, machine-readable format.</li>
            <li><strong>Restriction:</strong> Request that we limit the processing of your data.</li>
            <li><strong>Objection:</strong> Object to the processing of your data for specific purposes (e.g., personalized advertising).</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:support@tryquibly.com" className="text-blue-600 dark:text-blue-400 underline">support@tryquibly.com</a>.
            We will respond within 15 business days (LGPD) or 30 days (GDPR).
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 12. Children */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">12. Children&apos;s Privacy</h2>
          <p>
            Quibly is designed for users aged 17 and older. We do not knowingly collect personal data from children under 17. If we discover that a user under 17 has provided us with personal data, we will promptly delete it.
          </p>
          <p>
            If you are a parent or guardian and believe your child has provided personal data to Quibly, please contact us at{' '}
            <a href="mailto:support@tryquibly.com" className="text-blue-600 dark:text-blue-400 underline">support@tryquibly.com</a>.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 13. International Transfers */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">13. International Data Transfers</h2>
          <p>
            Your data may be transferred to and processed in countries outside of your residence, including the United States (where Firebase and Google services are hosted). We ensure that such transfers comply with applicable data protection laws through appropriate safeguards, including standard contractual clauses where required.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 14. Changes */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">14. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will update the &quot;Last updated&quot; date at the top of this page and notify you through the app or via email for significant changes.
          </p>
          <p>
            We encourage you to review this policy periodically. Your continued use of the Service after changes constitutes your acceptance of the updated policy.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 15. Contact */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Questions about your privacy?
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-2">
            We&apos;re here to help. Reach out anytime.
          </p>
        </section>

        <section className="text-center bg-black dark:bg-white/5 dark:border dark:border-white/10 text-white p-12 rounded-2xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Quibly</h3>
          <p className="text-gray-300 dark:text-gray-400 mb-2">Independent developer — Brazil</p>
          <p className="text-gray-300 dark:text-gray-400 mb-2">
            Website:{' '}
            <a href="https://tryquibly.com" className="text-blue-400 underline">tryquibly.com</a>
          </p>
          <p className="text-gray-300 dark:text-gray-400 mb-8">
            Email:{' '}
            <a href="mailto:support@tryquibly.com" className="text-blue-400 underline">support@tryquibly.com</a>
          </p>
          <a
            href="mailto:support@tryquibly.com"
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Contact Us →
          </a>
        </section>
      </article>
    </main>
  )
}

function PrivacyPT() {
  return (
    <main className="min-h-screen bg-white dark:bg-background text-black dark:text-white transition-colors duration-300 pt-32 pb-20">
      <article aria-labelledby="privacy-title" className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 id="privacy-title" className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Politica de Privacidade
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light">
            Seus dados, suas regras. Veja como a gente cuida deles.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">{'\u00DA'}ltima atualiza\u00E7\u00E3o: 23 de fevereiro de 2026</p>
        </header>

        {/* 1. Introdução */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">1. Introdu\u00E7\u00E3o</h2>
          <p>
            Quibly (&quot;n&oacute;s&quot; ou &quot;nosso&quot;) opera o aplicativo m&oacute;vel Quibly (iOS e Android) e o site{' '}
            <a href="https://tryquibly.com" className="text-blue-600 dark:text-blue-400 underline">tryquibly.com</a> (em conjunto, o &quot;Servi&ccedil;o&quot;).
          </p>
          <p>
            Esta Pol&iacute;tica de Privacidade explica quais dados coletamos, como os utilizamos, com quem os compartilhamos e quais s&atilde;o os seus direitos. Estamos comprometidos em cumprir a Lei Geral de Prote&ccedil;&atilde;o de Dados (LGPD — Lei n.&ordm; 13.709/2018), o Regulamento Geral de Prote&ccedil;&atilde;o de Dados da Europa (GDPR) e os requisitos de privacidade da Apple App Store e Google Play Store.
          </p>
          <p>
            Ao usar o Quibly, voc&ecirc; concorda com a coleta e uso das informa&ccedil;&otilde;es conforme descrito nesta pol&iacute;tica. Se n&atilde;o concordar, por favor n&atilde;o utilize o Servi&ccedil;o.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 2. Dados que Coletamos */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">2. Dados que Coletamos</h2>

          <h3 className="text-2xl font-semibold mt-8 mb-4">2.1 Dados da Conta (fornecidos por voc&ecirc;)</h3>
          <ul>
            <li>Endere&ccedil;o de e-mail e senha (via Firebase Authentication)</li>
            <li>Nome de exibi&ccedil;&atilde;o e foto de perfil (opcional, enviados por voc&ecirc;)</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4">2.2 Dados de Estudo e Uso</h3>
          <ul>
            <li>Sess&otilde;es de estudo (dura&ccedil;&atilde;o, data/hora de in&iacute;cio e fim)</li>
            <li>Sess&otilde;es Pomodoro e intervalos</li>
            <li>Streaks di&aacute;rios de estudo (dias consecutivos)</li>
            <li>Estat&iacute;sticas de performance (pontua&ccedil;&otilde;es em quizzes, resultados de flashcards)</li>
            <li>Dados de participa&ccedil;&atilde;o em ligas e rankings</li>
            <li>Materiais de estudo enviados por voc&ecirc; (PDFs, notas, slides) — processados por IA para gerar flashcards e quizzes</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4">2.3 Dados T&eacute;cnicos</h3>
          <ul>
            <li>ID do dispositivo e tipo de aparelho</li>
            <li>Vers&atilde;o do app e sistema operacional</li>
            <li>Tokens de push notification (Firebase Cloud Messaging)</li>
            <li>Identificadores de publicidade (coletados pelo Google AdMob)</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4">2.4 Dados que N&Atilde;O Coletamos</h3>
          <ul>
            <li>Localiza&ccedil;&atilde;o GPS</li>
            <li>Contatos ou agenda telef&ocirc;nica</li>
            <li>Hist&oacute;rico de navega&ccedil;&atilde;o</li>
            <li>Dados financeiros ou de pagamento (sem compras in-app no momento)</li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 3. Como Usamos Seus Dados */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">3. Como Usamos Seus Dados</h2>
          <p>Utilizamos os dados coletados para:</p>
          <ul>
            <li><strong>Fornecer o Servi&ccedil;o:</strong> Autenticar sua conta, gerar flashcards e quizzes a partir dos seus materiais usando IA, rastrear suas sess&otilde;es de estudo e streaks, e alimentar ligas e rankings.</li>
            <li><strong>Melhorar o Servi&ccedil;o:</strong> Analisar padr&otilde;es de uso para aprimorar funcionalidades, corrigir bugs e otimizar performance.</li>
            <li><strong>Enviar Notifica&ccedil;&otilde;es:</strong> Entregar lembretes de estudo, alertas de streak e atualiza&ccedil;&otilde;es de ligas via push notifications (voc&ecirc; pode desativar a qualquer momento nas configura&ccedil;&otilde;es do dispositivo).</li>
            <li><strong>Exibir An&uacute;ncios:</strong> Mostrar an&uacute;ncios personalizados atrav&eacute;s do Google AdMob para manter o plano gratuito do Servi&ccedil;o.</li>
            <li><strong>Garantir Seguran&ccedil;a:</strong> Detectar e prevenir fraudes, abusos e acessos n&atilde;o autorizados.</li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 4. Processamento por IA */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">4. Processamento de Materiais por IA</h2>
          <p>
            Quando voc&ecirc; envia materiais de estudo (PDFs, notas, slides, screenshots), nossa IA os processa para extrair conceitos-chave e gerar flashcards e quizzes. O que voc&ecirc; precisa saber:
          </p>
          <ul>
            <li>Seus materiais s&atilde;o processados exclusivamente para fornecer ferramentas de estudo — nunca para qualquer outro fim.</li>
            <li>N&oacute;s <strong>n&atilde;o</strong> usamos seu conte&uacute;do enviado para treinar, ajustar ou melhorar modelos de IA ou machine learning.</li>
            <li>Seus documentos s&atilde;o armazenados com seguran&ccedil;a e s&atilde;o acess&iacute;veis apenas por voc&ecirc;.</li>
            <li>Voc&ecirc; pode deletar seus materiais e todo conte&uacute;do gerado a qualquer momento.</li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 5. Serviços de Terceiros */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">5. Servi&ccedil;os de Terceiros</h2>
          <p>Utilizamos os seguintes servi&ccedil;os de terceiros para operar o Quibly:</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 dark:border-white/10">
                  <th className="py-3 pr-4 font-semibold">Servi&ccedil;o</th>
                  <th className="py-3 pr-4 font-semibold">Finalidade</th>
                  <th className="py-3 font-semibold">Dados Compartilhados</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-white/5">
                  <td className="py-3 pr-4">Firebase Authentication</td>
                  <td className="py-3 pr-4">Autentica&ccedil;&atilde;o e gerenciamento de sess&atilde;o</td>
                  <td className="py-3">E-mail, senha (hash), tokens de autentica&ccedil;&atilde;o</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-white/5">
                  <td className="py-3 pr-4">Firebase Cloud Messaging</td>
                  <td className="py-3 pr-4">Push notifications</td>
                  <td className="py-3">Tokens de dispositivo</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-white/5">
                  <td className="py-3 pr-4">Google AdMob</td>
                  <td className="py-3 pr-4">Publicidade personalizada</td>
                  <td className="py-3">ID de publicidade, info do dispositivo, dados de uso</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-white/5">
                  <td className="py-3 pr-4">Railway (PostgreSQL)</td>
                  <td className="py-3 pr-4">Hospedagem da API e armazenamento de dados</td>
                  <td className="py-3">Todos os dados do usu&aacute;rio (criptografados em repouso)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6">
            Cada servi&ccedil;o de terceiro possui sua pr&oacute;pria pol&iacute;tica de privacidade. Recomendamos que voc&ecirc; as revise. N&oacute;s <strong>n&atilde;o vendemos</strong> seus dados pessoais a terceiros.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 6. Publicidade */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">6. Publicidade (Google AdMob)</h2>
          <p>
            O plano gratuito do Quibly &eacute; mantido por an&uacute;ncios exibidos atrav&eacute;s do Google AdMob. O AdMob pode coletar e usar identificadores de publicidade e informa&ccedil;&otilde;es do dispositivo para exibir an&uacute;ncios personalizados.
          </p>
          <p>Voc&ecirc; pode gerenciar suas prefer&ecirc;ncias de an&uacute;ncios:</p>
          <ul>
            <li><strong>iOS:</strong> Ajustes &gt; Privacidade &gt; Rastreamento — desative o rastreamento para o Quibly.</li>
            <li><strong>Android:</strong> Configura&ccedil;&otilde;es &gt; Google &gt; An&uacute;ncios — desative an&uacute;ncios personalizados ou redefina seu ID de publicidade.</li>
          </ul>
          <p>
            Para mais informa&ccedil;&otilde;es, consulte a{' '}
            <a href="https://policies.google.com/privacy" className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">Pol&iacute;tica de Privacidade do Google</a>.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 7. Permissões */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">7. Permiss&otilde;es do Dispositivo</h2>
          <p>O Quibly pode solicitar as seguintes permiss&otilde;es:</p>
          <ul>
            <li><strong>C&acirc;mera:</strong> Usada para fotos de comprova&ccedil;&atilde;o de estudo (verifica&ccedil;&atilde;o). Nunca acessada em segundo plano.</li>
            <li><strong>Galeria de Fotos:</strong> Usada para selecionar foto de perfil. Acessamos apenas as fotos que voc&ecirc; escolher.</li>
            <li><strong>Notifica&ccedil;&otilde;es:</strong> Usadas para enviar lembretes de estudo, alertas de streak e atualiza&ccedil;&otilde;es de ligas. Voc&ecirc; pode desativar nas configura&ccedil;&otilde;es do dispositivo a qualquer momento.</li>
          </ul>
          <p>Todas as permiss&otilde;es s&atilde;o opcionais. O Quibly funciona sem elas — mas algumas funcionalidades podem ser limitadas.</p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 8. Armazenamento Local */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">8. Cookies e Armazenamento Local</h2>
          <p>
            O app m&oacute;vel do Quibly usa AsyncStorage (armazenamento local do dispositivo) para guardar prefer&ecirc;ncias, tokens de sess&atilde;o e dados em cache para funcionalidade offline. Esses dados ficam no seu dispositivo e n&atilde;o s&atilde;o transmitidos aos nossos servidores, exceto quando necess&aacute;rio para o funcionamento do Servi&ccedil;o (ex: tokens de autentica&ccedil;&atilde;o).
          </p>
          <p>
            O site do Quibly (tryquibly.com) pode usar cookies para autentica&ccedil;&atilde;o e an&aacute;lise. Voc&ecirc; pode gerenciar prefer&ecirc;ncias de cookies nas configura&ccedil;&otilde;es do seu navegador.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 9. Retenção de Dados */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">9. Reten&ccedil;&atilde;o de Dados</h2>
          <p>Retemos seus dados da seguinte forma:</p>
          <ul>
            <li><strong>Dados da conta:</strong> Mantidos enquanto sua conta estiver ativa. Exclu&iacute;dos em at&eacute; 30 dias ap&oacute;s solicita&ccedil;&atilde;o de exclus&atilde;o da conta.</li>
            <li><strong>Materiais de estudo e conte&uacute;do gerado:</strong> Mantidos enquanto sua conta estiver ativa. Voc&ecirc; pode excluir documentos individuais a qualquer momento.</li>
            <li><strong>Dados de uso e an&aacute;lise:</strong> Mantidos de forma anonimizada por at&eacute; 24 meses para melhoria do servi&ccedil;o.</li>
            <li><strong>Obriga&ccedil;&otilde;es legais:</strong> Alguns dados podem ser mantidos por mais tempo se exigido por lei aplic&aacute;vel.</li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 10. Segurança */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">10. Seguran&ccedil;a dos Dados</h2>
          <p>Levamos a seguran&ccedil;a dos seus dados a s&eacute;rio. Nossas medidas incluem:</p>
          <ul>
            <li>Criptografia em tr&acirc;nsito (TLS/HTTPS) e em repouso</li>
            <li>Autentica&ccedil;&atilde;o segura via Firebase com sess&otilde;es baseadas em tokens</li>
            <li>Controles de acesso limitando quem pode acessar dados de usu&aacute;rios internamente</li>
            <li>Revis&otilde;es e atualiza&ccedil;&otilde;es regulares de seguran&ccedil;a</li>
          </ul>
          <p>
            Embora implementemos pr&aacute;ticas de seguran&ccedil;a padr&atilde;o da ind&uacute;stria, nenhum m&eacute;todo de armazenamento ou transmiss&atilde;o eletr&ocirc;nica &eacute; 100% seguro. N&atilde;o podemos garantir seguran&ccedil;a absoluta, mas estamos comprometidos em proteger seus dados ao m&aacute;ximo.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 11. Seus Direitos */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">11. Seus Direitos</h2>
          <p>De acordo com a LGPD e o GDPR, voc&ecirc; tem direito a:</p>
          <ul>
            <li><strong>Acesso:</strong> Solicitar uma c&oacute;pia dos dados pessoais que temos sobre voc&ecirc;.</li>
            <li><strong>Corre&ccedil;&atilde;o:</strong> Solicitar a corre&ccedil;&atilde;o de dados imprecisos ou incompletos.</li>
            <li><strong>Exclus&atilde;o:</strong> Solicitar a exclus&atilde;o dos seus dados pessoais e conta.</li>
            <li><strong>Portabilidade:</strong> Solicitar seus dados em formato estruturado e leg&iacute;vel por m&aacute;quina.</li>
            <li><strong>Restri&ccedil;&atilde;o:</strong> Solicitar que limitemos o processamento dos seus dados.</li>
            <li><strong>Oposi&ccedil;&atilde;o:</strong> Opor-se ao processamento dos seus dados para fins espec&iacute;ficos (ex: publicidade personalizada).</li>
            <li><strong>Revogar Consentimento:</strong> Revogar o consentimento a qualquer momento quando o processamento for baseado em consentimento.</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, entre em contato pelo{' '}
            <a href="mailto:support@tryquibly.com" className="text-blue-600 dark:text-blue-400 underline">support@tryquibly.com</a>.
            Responderemos em at&eacute; 15 dias &uacute;teis (LGPD) ou 30 dias (GDPR).
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 12. Menores */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">12. Privacidade de Menores</h2>
          <p>
            O Quibly &eacute; destinado a usu&aacute;rios com 17 anos ou mais. N&atilde;o coletamos intencionalmente dados pessoais de menores de 17 anos. Se descobrirmos que um usu&aacute;rio menor de 17 anos nos forneceu dados pessoais, os excluiremos imediatamente.
          </p>
          <p>
            Se voc&ecirc; &eacute; pai, m&atilde;e ou respons&aacute;vel e acredita que seu filho forneceu dados pessoais ao Quibly, entre em contato pelo{' '}
            <a href="mailto:support@tryquibly.com" className="text-blue-600 dark:text-blue-400 underline">support@tryquibly.com</a>.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 13. Transferências Internacionais */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">13. Transfer&ecirc;ncias Internacionais de Dados</h2>
          <p>
            Seus dados podem ser transferidos e processados em pa&iacute;ses fora da sua resid&ecirc;ncia, incluindo os Estados Unidos (onde os servi&ccedil;os do Firebase e Google s&atilde;o hospedados). Garantimos que tais transfer&ecirc;ncias estejam em conformidade com as leis de prote&ccedil;&atilde;o de dados aplic&aacute;veis, incluindo cl&aacute;usulas contratuais padr&atilde;o quando necess&aacute;rio.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 14. Alterações */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">14. Altera&ccedil;&otilde;es nesta Pol&iacute;tica</h2>
          <p>
            Podemos atualizar esta Pol&iacute;tica de Privacidade periodicamente. Quando o fizermos, atualizaremos a data de &quot;&Uacute;ltima atualiza&ccedil;&atilde;o&quot; no topo desta p&aacute;gina e notificaremos voc&ecirc; atrav&eacute;s do app ou por e-mail para altera&ccedil;&otilde;es significativas.
          </p>
          <p>
            Recomendamos que revise esta pol&iacute;tica periodicamente. O uso continuado do Servi&ccedil;o ap&oacute;s altera&ccedil;&otilde;es constitui sua aceita&ccedil;&atilde;o da pol&iacute;tica atualizada.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 15. Contato */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            D&uacute;vidas sobre sua privacidade?
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-2">
            Estamos aqui pra ajudar. Fale com a gente.
          </p>
        </section>

        <section className="text-center bg-black dark:bg-white/5 dark:border dark:border-white/10 text-white p-12 rounded-2xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Quibly</h3>
          <p className="text-gray-300 dark:text-gray-400 mb-2">Desenvolvedor independente — Brasil</p>
          <p className="text-gray-300 dark:text-gray-400 mb-2">
            Site:{' '}
            <a href="https://tryquibly.com" className="text-blue-400 underline">tryquibly.com</a>
          </p>
          <p className="text-gray-300 dark:text-gray-400 mb-8">
            E-mail:{' '}
            <a href="mailto:support@tryquibly.com" className="text-blue-400 underline">support@tryquibly.com</a>
          </p>
          <a
            href="mailto:support@tryquibly.com"
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Fale Conosco →
          </a>
        </section>
      </article>
    </main>
  )
}
