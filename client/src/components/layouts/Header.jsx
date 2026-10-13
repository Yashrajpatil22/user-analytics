function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-5 sm:px-8">
        <h1 className="text-xl font-semibold tracking-tight">User Analytics</h1>

        <span className="ml-auto text-sm font-medium text-slate-600">
          Event tracking
        </span>
      </div>
    </header>
  );
}

export default Header;
