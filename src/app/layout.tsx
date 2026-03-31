import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";


export const metadata = {
  title: "Zealthy Exercise",
  description: "Mini-EMR and patient portal scaffold",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <div className="space-between" style={{ marginBottom: 24 }}>
            {/* <div>
              <div className="">Zealthy Exercise</div>
              <h1 style={{ marginTop: 12 }}>Mini-EMR & Patient Portal</h1>
            </div> */}
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/zealthyLogo.svg"
                alt="Portal logo"
                width={200}
                height={55}
                priority
              />
            </Link>
            <nav className="row">
              <Link href="/">Patient Login</Link>
              <Link href="/portal">Portal</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
