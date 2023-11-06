type Props = {
  children: React.ReactNode;
};

export function NoSSR({ children }: Props) {
  if ("window" in globalThis) {
    return <>{children}</>;
  }
  return null;
}
