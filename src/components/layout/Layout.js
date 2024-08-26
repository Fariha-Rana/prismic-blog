import { Header } from "@/components/head/Header";
import { Footer } from "../Footer";

export function Layout({
  navigation,
  settings,
  withHeaderDivider = true,
  withProfile = true,
  withSignUpForm = true,
  children,
}) {
  return (
    <div className="text-slate-700">
      <Header
        withProfile={withProfile}
        withDivider={withHeaderDivider}
        navigation={navigation}
        settings={settings}
      />
      <main>{children}</main>
      <Footer withSignUpForm={withSignUpForm} settings={settings} />
    </div>
  );
}
