import Link from "next/link";
import { useTranslations } from "next-intl";

const BackToHomeButton = () => {
  const t = useTranslations();
  return (
    <Link href="/" className="back-btn">
      <i className="fas fa-arrow-left"></i>
      <span>{t("back")}</span>
    </Link>
  );
};

export default BackToHomeButton;
