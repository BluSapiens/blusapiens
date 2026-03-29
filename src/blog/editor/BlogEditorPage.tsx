import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { toast } from "@/components/ui/sonner";
import BlogMetaPanel from "@/blog/editor/components/BlogMetaPanel";
import ContentEditorPanel from "@/blog/editor/components/ContentEditorPanel";
import FaqPanel from "@/blog/editor/components/FaqPanel";
import MediaManager from "@/blog/editor/components/MediaManager";
import SeoPanel from "@/blog/editor/components/SeoPanel";
import BlogPreview from "@/blog/components/BlogPreview";
import {
  cleanupCloudinaryUploads,
  createAdminBlogCategory,
  getAdminBlogMeta,
  getAdminBlogPost,
  getPublicBlogPosts,
  saveAdminBlogPost,
} from "@/blog/services/blog-api";
import {
  collectTemporaryMediaAssets,
  createEmptyDraft,
  createDraftFromPost,
  getTemporaryMediaAssetKey,
  slugify,
  withRecomputedMetrics,
} from "@/blog/utils/editor";
import type { BlogCategory, BlogEditorDraft, BlogEditorMeta, MediaAsset } from "@/blog/utils/types";

const LOCAL_DRAFT_PREFIX = "blusapiens-blog-editor";

function isSaveReady(draft: BlogEditorDraft) {
  return Boolean(draft.title.trim() && draft.excerpt.trim() && draft.author.trim() && draft.catId);
}

export default function BlogEditorPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams<{ postId: string }>();
  const isNew = !params.postId || params.postId === "new";
  const localStorageKey = `${LOCAL_DRAFT_PREFIX}:${params.postId || "new"}`;
  const [draft, setDraft] = useState<BlogEditorDraft | null>(null);
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "mobile">("desktop");
  const [dirty, setDirty] = useState(false);
  const [coverManagerOpen, setCoverManagerOpen] = useState(false);
  const [ogManagerOpen, setOgManagerOpen] = useState(false);
  const temporaryUploadsRef = useRef<Map<string, MediaAsset>>(new Map());
  const persistedUploadKeysRef = useRef<Set<string>>(new Set());

  const metaQuery = useQuery({
    queryKey: ["admin-blog-editor-meta"],
    queryFn: getAdminBlogMeta,
    staleTime: 60_000,
  });

  const postQuery = useQuery({
    queryKey: ["admin-blog-editor-post", params.postId],
    queryFn: () => getAdminBlogPost(params.postId as string),
    enabled: Boolean(params.postId && !isNew),
  });

  const publicPostsQuery = useQuery({
    queryKey: ["public-blog-posts", "editor-link-suggestions"],
    queryFn: () => getPublicBlogPosts({ page: 1 }),
    staleTime: 30_000,
  });

  const saveMutation = useMutation({
    mutationFn: saveAdminBlogPost,
    onMutate: (nextDraft) => ({
      persistedUploadKeys: collectTemporaryMediaAssets(nextDraft).map(getTemporaryMediaAssetKey),
    }),
    onSuccess: (saved, _variables, context) => {
      context?.persistedUploadKeys.forEach((key) => persistedUploadKeysRef.current.add(key));
      const nextDraft = createDraftFromPost(saved);
      setDraft(nextDraft);
      setDirty(false);
      localStorage.removeItem(localStorageKey);

      if (isNew && saved.id) {
        navigate(`/admin/blog/${saved.id}`, { replace: true });
      }
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: createAdminBlogCategory,
    onSuccess: (category) => {
      queryClient.setQueryData<BlogEditorMeta & { success: boolean }>(
        ["admin-blog-editor-meta"],
        (current) =>
          current
            ? {
                ...current,
                cats: [...current.cats, category].sort((left, right) =>
                  left.name.localeCompare(right.name),
                ),
              }
            : current,
      );
      void queryClient.invalidateQueries({ queryKey: ["admin-blog-cats"] });
      setDraft((current) =>
        current ? withRecomputedMetrics({ ...current, catId: category.id }) : current,
      );
      setDirty(true);
      toast.success(`Category "${category.name}" created`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to create category");
    },
  });

  useEffect(() => {
    if (!metaQuery.data || draft) {
      return;
    }

    const savedLocal = window.localStorage.getItem(localStorageKey);

    if (savedLocal) {
      try {
        setDraft(JSON.parse(savedLocal) as BlogEditorDraft);
        return;
      } catch (_error) {
        window.localStorage.removeItem(localStorageKey);
      }
    }

    if (postQuery.data) {
      setDraft(createDraftFromPost(postQuery.data));
      return;
    }

    if (isNew) {
      setDraft(createEmptyDraft(metaQuery.data));
    }
  }, [draft, isNew, localStorageKey, metaQuery.data, postQuery.data]);

  useEffect(() => {
    if (!draft) {
      return;
    }

    window.localStorage.setItem(localStorageKey, JSON.stringify(draft));
  }, [draft, localStorageKey]);

  useEffect(() => {
    if (!draft) {
      return;
    }

    const nextUploads = new Map(
      collectTemporaryMediaAssets(draft).map((asset) => [getTemporaryMediaAssetKey(asset), asset]),
    );
    const removedUploads = Array.from(temporaryUploadsRef.current.entries())
      .filter(([key]) => !nextUploads.has(key))
      .filter(([key]) => {
        if (persistedUploadKeysRef.current.has(key)) {
          persistedUploadKeysRef.current.delete(key);
          return false;
        }

        return true;
      })
      .map(([, asset]) => asset);

    temporaryUploadsRef.current = nextUploads;

    if (removedUploads.length > 0) {
      void cleanupCloudinaryUploads(
        removedUploads.map((asset) => ({
          publicId: asset.publicId || "",
          resourceType: asset.resourceType,
        })),
      ).catch(() => undefined);
    }
  }, [draft]);

  useEffect(() => {
    return () => {
      const remainingUploads = Array.from(temporaryUploadsRef.current.entries())
        .filter(([key]) => !persistedUploadKeysRef.current.has(key))
        .map(([, asset]) => asset);

      if (remainingUploads.length === 0) {
        return;
      }

      void cleanupCloudinaryUploads(
        remainingUploads.map((asset) => ({
          publicId: asset.publicId || "",
          resourceType: asset.resourceType,
        })),
        { keepalive: true },
      ).catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    if (!draft || !dirty || !isSaveReady(draft)) {
      return;
    }

    const handle = window.setTimeout(() => {
      saveMutation.mutate(draft);
    }, 1800);

    return () => window.clearTimeout(handle);
  }, [draft, dirty, saveMutation]);

  const currentDraft = useMemo(() => (draft ? withRecomputedMetrics(draft) : null), [draft]);

  if (metaQuery.isLoading || (!isNew && postQuery.isLoading) || !currentDraft) {
    return (
      <div className="px-6 py-10 md:px-8 lg:px-12">
        <div className="container-wide h-[60vh] animate-pulse rounded-3xl border border-border bg-card" />
      </div>
    );
  }

  const setDraftState = (nextDraft: BlogEditorDraft) => {
    const nextTitle = nextDraft.title.trim();
    const titleChanged = nextDraft.title !== currentDraft.title;
    const next =
      (titleChanged || (!nextDraft.slug && nextTitle))
        ? { ...nextDraft, slug: slugify(nextTitle) }
        : nextDraft;
    setDraft(withRecomputedMetrics(next));
    setDirty(true);
  };

  return (
    <div className="pb-16">
      <AdminPageHeader
        eyebrow="Editorial Workflow"
        title={isNew ? "Create Blog Post" : "Edit Blog Post"}
        description="Compose long-form blog content, optimize SEO, manage Cloudinary assets, and preview the final article in one workspace."
      >
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => saveMutation.mutate({ ...currentDraft, status: "DRAFT" })}
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => saveMutation.mutate({ ...currentDraft, status: "PUBLISHED" })}
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            Publish
          </button>
        </div>
      </AdminPageHeader>

      <section className="px-6 py-10 md:px-8 lg:px-12">
        <div className="container-wide space-y-8">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <BlogMetaPanel
              draft={currentDraft}
              meta={metaQuery.data}
              onChange={setDraftState}
              onCreateCategory={async (input) => {
                const category = await createCategoryMutation.mutateAsync(input);
                queryClient.setQueryData<Array<BlogCategory>>(["admin-blog-cats"], (current) =>
                  current
                    ? [...current, category].sort((left, right) => left.name.localeCompare(right.name))
                    : [category],
                );
              }}
              isCreatingCategory={createCategoryMutation.isPending}
            />

            <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Cover & Social</p>
                <h2 className="mt-2 text-2xl font-semibold">Cloudinary assets</h2>
              </div>
              <div className="grid gap-4">
                <button type="button" onClick={() => setCoverManagerOpen(true)} className="rounded-2xl border border-border px-4 py-3 text-left">
                  <span className="block text-sm font-semibold">{currentDraft.cover ? "Change cover image" : "Add cover image"}</span>
                  <span className="block text-xs text-muted-foreground">Stored in the `covers` folder.</span>
                </button>
                {currentDraft.cover ? (
                  <img
                    src={currentDraft.cover.optimizedUrl || currentDraft.cover.url}
                    alt={currentDraft.coverAlt || currentDraft.cover.alt || ""}
                    className="h-48 w-full rounded-2xl object-cover"
                  />
                ) : null}
                <input
                  value={currentDraft.coverAlt}
                  onChange={(event) => setDraftState({ ...currentDraft, coverAlt: event.target.value })}
                  placeholder="Cover image alt text"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
                />
                <button type="button" onClick={() => setOgManagerOpen(true)} className="rounded-2xl border border-border px-4 py-3 text-left">
                  <span className="block text-sm font-semibold">{currentDraft.ogImage ? "Change OG / Twitter image" : "Add OG / Twitter image"}</span>
                  <span className="block text-xs text-muted-foreground">Stored in the `og` folder and reused for Twitter.</span>
                </button>
                {currentDraft.ogImage ? (
                  <img
                    src={currentDraft.ogImage.optimizedUrl || currentDraft.ogImage.url}
                    alt={currentDraft.ogImage.alt || ""}
                    className="h-40 w-full rounded-2xl object-cover"
                  />
                ) : null}
              </div>
            </section>
          </div>

          <ContentEditorPanel draft={currentDraft} onChange={setDraftState} />
          <FaqPanel draft={currentDraft} onChange={setDraftState} />
          <SeoPanel draft={currentDraft} posts={publicPostsQuery.data?.items || []} onChange={setDraftState} />

          <section className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Preview System</p>
                <h2 className="mt-2 text-2xl font-semibold">Live desktop and mobile preview</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewViewport("desktop")}
                  className={`rounded-full px-4 py-2 text-sm ${previewViewport === "desktop" ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport("mobile")}
                  className={`rounded-full px-4 py-2 text-sm ${previewViewport === "mobile" ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}
                >
                  Mobile
                </button>
              </div>
            </div>
            <BlogPreview draft={currentDraft} viewport={previewViewport} />
          </section>
        </div>
      </section>

      <MediaManager
        open={coverManagerOpen}
        kind="IMAGE"
        target="cover"
        onClose={() => setCoverManagerOpen(false)}
        onSelect={(asset) => {
          setDraftState({ ...currentDraft, cover: asset, coverAlt: currentDraft.coverAlt || asset.alt || "" });
          setCoverManagerOpen(false);
        }}
      />

      <MediaManager
        open={ogManagerOpen}
        kind="IMAGE"
        target="og"
        onClose={() => setOgManagerOpen(false)}
        onSelect={(asset) => {
          setDraftState({ ...currentDraft, ogImage: asset });
          setOgManagerOpen(false);
        }}
      />
    </div>
  );
}
