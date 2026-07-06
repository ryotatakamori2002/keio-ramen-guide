import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileByHandle, getPublicPostsByUser } from "@/lib/posts";
import { copy } from "@/content/site-copy";
import { type as t } from "@/lib/design";
import PostList from "@/components/PostList";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  return { title: profile ? `${profile.displayName}（@${profile.handle}） | ${copy.serviceName}` : copy.users.notFound };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  if (!profile) notFound();

  const posts = await getPublicPostsByUser(profile.id);

  return (
    <div className="mx-auto max-w-2xl py-2">
      <p className={t.eyebrow}>Ramen Log</p>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{profile.displayName}</h1>
      <p className="mt-0.5 text-sm text-muted">@{profile.handle}</p>
      {profile.bio && <p className="mt-3 max-w-xl text-pretty text-sm text-muted">{profile.bio}</p>}

      <h2 className="mt-8 text-lg font-bold tracking-tight text-foreground">{copy.users.postsTitle}</h2>
      {posts.length > 0 ? (
        <div className="mt-4">
          <PostList posts={posts} showShop />
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">{copy.users.empty}</p>
      )}
    </div>
  );
}
