import { redirect } from "next/navigation";

export default function RootPage() {
  // idioma padrão do sistema
  const defaultLocale = "en";

  // redireciona para a home dentro do locale
  redirect(`/${defaultLocale}/dashboard/home`);
}
