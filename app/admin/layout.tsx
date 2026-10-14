export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}