import type { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-slate-400 sm:p-24 p-5">
      <div className="flex flex-col space-y-3 ">{props.children}</div>
    </main>
  );
}
