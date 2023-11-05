export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header></header>
      <main>{children}</main>
    </div>
  );
}
