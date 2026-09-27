import type { Metadata } from "next";
import { ShieldCheck, Star } from "lucide-react";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import type { Tables } from "@/lib/types/database";
import { currentProfile, listings as placeholderListings } from "@/lib/placeholder-data";

export const metadata: Metadata = {
  title: "Your profile",
};

type Profile = Pick<
  Tables<"profiles">,
  | "username"
  | "display_name"
  | "bio"
  | "avatar_url"
  | "is_verified"
  | "created_at"
>;

type Listing = Pick<
  Tables<"listings">,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "price_cents"
  | "currency"
  | "delivery_time_days"
  | "status"
  | "created_at"
>;

type Review = Pick<Tables<"reviews">, "rating">;

type QueryResult<T> = {
  data: T;
  error: unknown;
};

type ListQueryResult<T> = {
  data: T;
  error: unknown;
};

type CountQueryResult = {
  data: null;
  error: unknown;
  count: number | null;
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileData: Profile | null = null;
  let listingsData: Listing[] = [];
  let ratingsData: Review[] = [];
  let ordersCount: number | null = null;

  if (user) {
    try {
      const profileResult = (await supabase
        .from("profiles")
        .select(
          "username, display_name, bio, avatar_url, is_verified, created_at"
        )
        .eq("id", user.id)
        .single()) as unknown as QueryResult<Profile | null>;

      if (profileResult.data) {
        profileData = profileResult.data;
      }

      const listingsResult = (await supabase
        .from("listings")
        .select(
          "id, slug, title, description, price_cents, currency, delivery_time_days, status, created_at"
        )
        .eq("seller_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })) as unknown as ListQueryResult<Listing[]>;

      if (listingsResult.data) {
        listingsData = listingsResult.data;
      }

      const reviewsResult = (await supabase
        .from("reviews")
        .select("rating", { count: "exact", head: false })
        .eq("reviewee_id", user.id)) as unknown as ListQueryResult<Review[]>;

      if (reviewsResult.data) {
        ratingsData = reviewsResult.data;
      }

      const ordersResult = (await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("seller_id", user.id)
        .eq("status", "completed")) as unknown as CountQueryResult;

      if (ordersResult.count !== null) {
        ordersCount = ordersResult.count;
      }
    } catch {
      //
    }
  }

  const profile: Profile = profileData || {
    username: currentProfile.handle.replace("@", ""),
    display_name: user?.user_metadata?.display_name || user?.user_metadata?.username || currentProfile.displayName,
    bio: currentProfile.bio,
    avatar_url: null,
    is_verified: currentProfile.verified,
    created_at: "2024-03-01T00:00:00.000Z",
  };

  const ratings = ratingsData;
  const activeListings: Listing[] =
    listingsData.length > 0
      ? listingsData
      : (placeholderListings.slice(0, 3).map((l, i) => ({
          id: `pl-${i}`,
          slug: l.slug,
          title: l.title,
          description: l.blurb,
          price_cents: l.priceCents,
          currency: l.currency,
          delivery_time_days: 3,
          status: "active" as const,
          created_at: new Date().toISOString(),
        })));

  const rating =
    ratings.length > 0
      ? ratings.reduce(
          (sum: number, review: Review) => sum + review.rating,
          0
        ) / ratings.length
      : currentProfile.rating;

  const initials = (profile.display_name || profile.username || "NX")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join("");

  const memberSince = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(profile.created_at));

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : null}

            <AvatarFallback className="text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl">
                {profile.display_name || profile.username}
              </h1>

              {profile.is_verified && (
                <Badge variant="brand" className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              @{profile.username} · Member since {memberSince}
            </p>

            {profile.bio && (
              <p className="mt-3 max-w-prose text-sm text-muted-foreground">
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Rating"
          value={
            rating === null ? (
              "—"
            ) : (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-brand text-brand" />
                {rating.toFixed(1)}
              </span>
            )
          }
          sub={`${ratings.length} reviews`}
        />

        <StatCard
          label="Completed orders"
          value={ordersCount ?? currentProfile.completedOrders ?? 0}
        />

        <StatCard
          label="Active listings"
          value={activeListings.length}
        />

        <StatCard
          label="Username"
          value={
            <span className="text-base">
              @{profile.username}
            </span>
          }
        />
      </div>

      <div className="mt-12">
        <h2 className="font-display text-xl">
          Active listings
        </h2>

        {activeListings.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="p-6 text-sm text-muted-foreground">
              You do not have any active listings yet.
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeListings.map((listing: Listing) => (
              <Card key={listing.id}>
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {listing.status}
                  </p>

                  <h3 className="mt-1.5 font-display text-base">
                    {listing.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {listing.description ||
                      "No description provided."}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-mono text-sm">
                      {formatPrice(
                        listing.price_cents,
                        listing.currency
                      )}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {listing.delivery_time_days
                        ? `${listing.delivery_time_days} day delivery`
                        : "Delivery time not set"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-1.5 font-mono text-xl">
          {value}
        </p>

        {sub && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  );
}