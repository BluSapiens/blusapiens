import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export default function AdminPageHeader({ eyebrow, title, description, children }: Props) {
  return (
    <section className="hero-bg px-6 py-12 text-primary-foreground md:px-8 lg:px-12">
      <div className="container-wide flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/70">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-foreground/80 md:text-base">
            {description}
          </p>
        </div>

        {children ? <div className="flex shrink-0 flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}
