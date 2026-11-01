import Image from "next/image";
import Link from "@/shared/components/app-link";
import styles from "./brand.module.css";

export function Brand() {
  return <Link href="/" className={styles.brand} aria-label="Infraly home"><Image src="/logo.svg" alt="" width={28} height={28} /><span>infraly<span className={styles.dot}>.</span></span></Link>;
}
