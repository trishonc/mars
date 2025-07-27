import ThemeToggleButton from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="h-14 bg-background border-border">
      <div className="h-full px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">
          Mars
        </h1>
        <ThemeToggleButton />
      </div>
    </header>
  );
}
