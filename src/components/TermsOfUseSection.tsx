'use client'

import { useLocale } from 'next-intl'

export default function TermsOfUseSection() {
  const locale = useLocale()

  if (locale === 'pt') return <TermsPT />
  return <TermsEN />
}

function TermsEN() {
  return (
    <main className="min-h-screen bg-white dark:bg-background text-black dark:text-white transition-colors duration-300 pt-32 pb-20">
      <article aria-labelledby="terms-title" className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 id="terms-title" className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Terms of Use
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light">
            Clear rules, fair play. Here&apos;s what you agree to.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">Last updated: March 13, 2026</p>
        </header>

        {/* 1. Acceptance of Terms */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">1. Acceptance of Terms</h2>
          <p>
            By downloading, installing, or using Quibly (&quot;the App&quot;), you agree to be bound
            by these Terms of Use. If you do not agree, do not use the App.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 2. Description of Service */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">2. Description of Service</h2>
          <p>
            Quibly is a study platform that provides AI-powered flashcard and quiz generation,
            study tracking, leagues, and gamification features to help users learn more effectively.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 3. Subscriptions & Auto-Renewal */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">3. Subscriptions & Auto-Renewal</h2>
          <ul>
            <li>
              Quibly offers a free tier and a paid &quot;Pro&quot; subscription with monthly and
              yearly billing options.
            </li>
            <li>
              Payment is charged to your Apple App Store or Google Play account at confirmation of
              purchase.
            </li>
            <li>
              Subscriptions automatically renew unless auto-renewal is turned off at least 24 hours
              before the end of the current billing period.
            </li>
            <li>
              Your account will be charged for renewal within 24 hours prior to the end of the
              current period at the same price.
            </li>
            <li>
              You can manage and cancel your subscription in your App Store or Google Play account
              settings at any time.
            </li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 4. Refund Policy */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">4. Refund Policy</h2>
          <p>
            All purchases are processed through the Apple App Store or Google Play Store. Refund
            requests must be submitted directly to Apple or Google according to their respective
            refund policies. Quibly does not process refunds directly.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 5. User Obligations */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">5. User Obligations</h2>
          <ul>
            <li>You must be at least 13 years old to use Quibly.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>
              You agree not to upload content that is illegal, offensive, infringes on intellectual
              property rights, or violates any applicable law.
            </li>
            <li>You agree not to attempt to reverse-engineer, hack, or disrupt the App or its services.</li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 6. Intellectual Property */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">6. Intellectual Property</h2>
          <p>
            All content, features, and functionality of Quibly — including but not limited to text,
            graphics, logos, icons, and software — are the exclusive property of Quibly and are
            protected by copyright, trademark, and other intellectual property laws. You retain
            ownership of the content you upload, but grant Quibly a license to use it to provide the
            service.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 7. AI-Generated Content */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">7. AI-Generated Content</h2>
          <p>
            Quibly uses artificial intelligence to generate flashcards, quizzes, and study materials.
            AI-generated content is provided &quot;as is&quot; and may contain inaccuracies. Quibly
            does not guarantee the accuracy, completeness, or reliability of AI-generated content.
            Users should verify important information independently.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 8. Termination */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">8. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at any time if you violate
            these Terms or engage in conduct that we determine to be harmful to the service or other
            users. You may delete your account at any time through the App settings.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 9. Disclaimer of Warranties */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">9. Disclaimer of Warranties</h2>
          <p>
            Quibly is provided &quot;as is&quot; and &quot;as available&quot; without warranties of
            any kind, either express or implied. We do not warrant that the App will be
            uninterrupted, error-free, or free of harmful components.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 10. Limitation of Liability */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Quibly shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising out of or relating to
            your use of the App.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 11. Changes to Terms */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">11. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of significant changes
            through the App or by email. Continued use of the App after changes constitutes
            acceptance of the updated Terms.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 12. Contact */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Questions about these terms?
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

function TermsPT() {
  return (
    <main className="min-h-screen bg-white dark:bg-background text-black dark:text-white transition-colors duration-300 pt-32 pb-20">
      <article aria-labelledby="terms-title" className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 id="terms-title" className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Termos de Uso
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light">
            Regras claras, jogo justo. Veja o que voc&ecirc; aceita ao usar o Quibly.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">{'\u00DA'}ltima atualiza&ccedil;&atilde;o: 13 de mar&ccedil;o de 2026</p>
        </header>

        {/* 1. Aceitação dos Termos */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">1. Aceita&ccedil;&atilde;o dos Termos</h2>
          <p>
            Ao baixar, instalar ou usar o Quibly (&quot;o App&quot;), voc&ecirc; concorda em ficar
            vinculado a estes Termos de Uso. Se n&atilde;o concordar, n&atilde;o use o App.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 2. Descrição do Serviço */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">2. Descri&ccedil;&atilde;o do Servi&ccedil;o</h2>
          <p>
            O Quibly &eacute; uma plataforma de estudos que oferece gera&ccedil;&atilde;o de flashcards e quizzes
            com IA, acompanhamento de estudos, ligas e recursos de gamifica&ccedil;&atilde;o para ajudar os
            usu&aacute;rios a aprender de forma mais eficiente.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 3. Assinaturas e Renovação Automática */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">3. Assinaturas e Renova&ccedil;&atilde;o Autom&aacute;tica</h2>
          <ul>
            <li>
              O Quibly oferece um plano gratuito e uma assinatura paga &quot;Pro&quot; com op&ccedil;&otilde;es
              de cobran&ccedil;a mensal e anual.
            </li>
            <li>
              O pagamento &eacute; cobrado na sua conta da Apple App Store ou Google Play no momento
              da confirma&ccedil;&atilde;o da compra.
            </li>
            <li>
              As assinaturas s&atilde;o renovadas automaticamente, a menos que a renova&ccedil;&atilde;o
              autom&aacute;tica seja desativada pelo menos 24 horas antes do final do per&iacute;odo de
              cobran&ccedil;a atual.
            </li>
            <li>
              Sua conta ser&aacute; cobrada pela renova&ccedil;&atilde;o at&eacute; 24 horas antes do final do
              per&iacute;odo atual, pelo mesmo pre&ccedil;o.
            </li>
            <li>
              Voc&ecirc; pode gerenciar e cancelar sua assinatura nas configura&ccedil;&otilde;es da App Store
              ou Google Play a qualquer momento.
            </li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 4. Política de Reembolso */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">4. Pol&iacute;tica de Reembolso</h2>
          <p>
            Todas as compras s&atilde;o processadas atrav&eacute;s da Apple App Store ou Google Play Store.
            Solicita&ccedil;&otilde;es de reembolso devem ser enviadas diretamente &agrave; Apple ou ao Google,
            conforme suas respectivas pol&iacute;ticas de reembolso. O Quibly n&atilde;o processa
            reembolsos diretamente.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 5. Obrigações do Usuário */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">5. Obriga&ccedil;&otilde;es do Usu&aacute;rio</h2>
          <ul>
            <li>Voc&ecirc; deve ter pelo menos 13 anos para usar o Quibly.</li>
            <li>Voc&ecirc; &eacute; respons&aacute;vel por manter a confidencialidade das credenciais da sua conta.</li>
            <li>
              Voc&ecirc; concorda em n&atilde;o enviar conte&uacute;do ilegal, ofensivo, que infrinja direitos
              de propriedade intelectual ou viole qualquer lei aplic&aacute;vel.
            </li>
            <li>Voc&ecirc; concorda em n&atilde;o tentar fazer engenharia reversa, hackear ou interromper o App ou seus servi&ccedil;os.</li>
          </ul>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 6. Propriedade Intelectual */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">6. Propriedade Intelectual</h2>
          <p>
            Todo o conte&uacute;do, recursos e funcionalidades do Quibly — incluindo, mas n&atilde;o se
            limitando a textos, gr&aacute;ficos, logotipos, &iacute;cones e software — s&atilde;o propriedade
            exclusiva do Quibly e s&atilde;o protegidos por leis de direitos autorais, marcas registradas
            e outras leis de propriedade intelectual. Voc&ecirc; mant&eacute;m a propriedade do conte&uacute;do
            que envia, mas concede ao Quibly uma licen&ccedil;a para us&aacute;-lo na presta&ccedil;&atilde;o do servi&ccedil;o.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 7. Conteúdo Gerado por IA */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">7. Conte&uacute;do Gerado por IA</h2>
          <p>
            O Quibly utiliza intelig&ecirc;ncia artificial para gerar flashcards, quizzes e materiais de
            estudo. O conte&uacute;do gerado por IA &eacute; fornecido &quot;como est&aacute;&quot; e pode conter
            imprecis&otilde;es. O Quibly n&atilde;o garante a precis&atilde;o, completude ou confiabilidade do
            conte&uacute;do gerado por IA. Os usu&aacute;rios devem verificar informa&ccedil;&otilde;es importantes
            de forma independente.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 8. Encerramento */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">8. Encerramento</h2>
          <p>
            Reservamo-nos o direito de suspender ou encerrar sua conta a qualquer momento se voc&ecirc;
            violar estes Termos ou se envolver em conduta que consideremos prejudicial ao servi&ccedil;o
            ou a outros usu&aacute;rios. Voc&ecirc; pode excluir sua conta a qualquer momento pelas
            configura&ccedil;&otilde;es do App.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 9. Isenção de Garantias */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">9. Isen&ccedil;&atilde;o de Garantias</h2>
          <p>
            O Quibly &eacute; fornecido &quot;como est&aacute;&quot; e &quot;conforme dispon&iacute;vel&quot;, sem
            garantias de qualquer tipo, expressas ou impl&iacute;citas. N&atilde;o garantimos que o App
            ser&aacute; ininterrupto, livre de erros ou livre de componentes prejudiciais.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 10. Limitação de Responsabilidade */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">10. Limita&ccedil;&atilde;o de Responsabilidade</h2>
          <p>
            Na m&aacute;xima extens&atilde;o permitida por lei, o Quibly n&atilde;o ser&aacute; respons&aacute;vel por
            quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos
            decorrentes ou relacionados ao uso do App.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 11. Alterações nos Termos */}
        <section className="prose prose-lg md:prose-xl max-w-none dark:prose-invert mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">11. Altera&ccedil;&otilde;es nos Termos</h2>
          <p>
            Podemos atualizar estes Termos periodicamente. Notificaremos voc&ecirc; sobre altera&ccedil;&otilde;es
            significativas atrav&eacute;s do App ou por e-mail. O uso continuado do App ap&oacute;s as
            altera&ccedil;&otilde;es constitui aceita&ccedil;&atilde;o dos Termos atualizados.
          </p>
        </section>

        <hr className="border-gray-300 dark:border-white/10 my-16" />

        {/* 12. Contato */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            D&uacute;vidas sobre estes termos?
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
