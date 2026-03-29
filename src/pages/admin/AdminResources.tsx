import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function AdminResources() {
  return (
    <div className="pb-16">
      <AdminPageHeader
        eyebrow="Admin"
        title="Resources"
        description="Resource management UI is not available in this branch. The route is restored so the admin app can load cleanly."
      />
      <section className="px-6 py-10 md:px-8 lg:px-12">
        <div className="container-wide rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            This screen is currently a placeholder.
          </p>
        </div>
      </section>
    </div>
  );
}
