import Image from "next/image";
import Link from "next/link";
import { homeStyles } from "@/styles/homePage";

export default function HomePage() {
  return (
    <div className={homeStyles.mainWrapper}>
      <div className={homeStyles.bgDesktopWrapper}>
        <Image
          src="/image/syntory-homepage.png"
          alt="Background"
          fill
          className={homeStyles.bgDesktopImage}
          priority
        />
      </div>
      <div className={homeStyles.mobileWrapper}>
        <div className={homeStyles.mobileImageContainer}>
          <Image
            src="/image/syntory-logo.png"
            alt="Logo"
            fill
            className={homeStyles.mobileImage}
            priority
          />
        </div>
      </div>
      <div className={homeStyles.buttonsContainer}>
        <Link href="/auth/login" className="w-full sm:w-1/2">
          <button className={homeStyles.loginButton}>Login</button>
        </Link>
        <Link href="/auth/register" className="w-full sm:w-1/2">
          <button className={homeStyles.signupButton}>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}
