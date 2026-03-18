"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DOMAIN } from "@/utils/constants";
import { useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/API/authAPI";
import { useTranslations } from "next-intl";

const LogoutButton = () => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const logoutHandler = async () => {
    try {
      await axios.get(`${DOMAIN}/api/auth/logout`);
      dispatch(logoutUser());
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button className="back-btn" onClick={logoutHandler}>
      <i className="fas fa-sign-out-alt"></i>
      <span>{t("logout")}</span>
    </button>
  );
};

export default LogoutButton;
