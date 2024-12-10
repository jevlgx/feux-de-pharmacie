import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="main" className="flex">
            {children}
        </div>
      </body>
    </html>
  );
}
