export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>home</li>
            <li>page 1</li>
            <li>page 2</li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
