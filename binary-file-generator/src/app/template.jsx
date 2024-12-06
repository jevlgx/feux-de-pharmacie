//import Link from "next/link";

export default function template({ children }) {
  return (
    <main>
      <section>
        {/* <ul className="flex gap-2">
          <span>Toolbar:</span>
          <li>
            <Link href="/staticmode" className="block">
              Static mode
            </Link>
          </li>
          <li>
            <Link href="/scrollingmode" className="block">
              Scrolling mode
            </Link>
          </li>
        </ul> */}
      </section>
      {children}
    </main>
  );
}
