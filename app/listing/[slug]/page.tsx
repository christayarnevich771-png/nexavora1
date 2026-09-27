import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Clock,
  CheckCircle2,
  Lock,
  MessageSquare,
  Sparkles,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderButton } from "./order-button";
import { listings as placeholderListings, type Listing } from "@/lib/placeholder-data";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

interface ListingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = placeholderListings.find((l) => l.slug === slug);
  return {
    title: listing ? `${listing.title} | NEXAVORA` : "Listing | NEXAVORA",
    description: listing?.blurb || "Digital marketplace listing with escrow protection.",
  };
}

export default async function SingleListingPage({ params }: ListingPageProps) {
  const { slug } = await params;

  let listing: Listing | undefined = placeholderListings.find((l) => l.slug === slug);

  if (!listing) {
    try {
      const supabase = await createClient();
      const { data: dbItem }: any = await supabase
        .from("listings")
        .select(`
          id,
          slug,
          title,
          description,
          price_cents,
          currency,
          delivery_time_days,
          category:categories(name, slug),
          seller:profiles!seller_id(username, display_name, is_verified)
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (dbItem) {
        listing = {
          slug: dbItem.slug,
          title: dbItem.title,
          category: dbItem.category?.name || "Digital Services",
          priceCents: dbItem.price_cents,
          currency: dbItem.currency || "USD",
          seller: {
            name: dbItem.seller?.display_name || dbItem.seller?.username || "Verified Seller",
            rating: 5.0,
            reviews: 1,
            verified: dbItem.seller?.is_verified ?? true,
          },
          deliveryTime: dbItem.delivery_time_days
            ? `${dbItem.delivery_time_days} day delivery`
            : "Instant delivery",
          blurb: dbItem.description || "High quality verified digital deliverable.",
        };
      }
    } catch {
      //
    }
  }

  if (!listing) {
    notFound();
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/marketplace">
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Main Details Column */}
        <div className="space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand">{listing.category}</Badge>
              {listing.seller.verified && (
                <Badge variant="outline" className="gap-1 border-brand/30 text-brand">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Listing
                </Badge>
              )}
            </div>

            <h1 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
              {listing.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-medium">{listing.seller.name}</span>
                {listing.seller.verified && (
                  <ShieldCheck className="h-4 w-4 text-brand" />
                )}
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-brand text-brand" />
                <span className="font-semibold text-foreground">
                  {listing.seller.rating.toFixed(1)}
                </span>
                <span>({listing.seller.reviews} reviews)</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{listing.deliveryTime}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h2 className="font-display text-xl">Service Overview</h2>
            <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed">
              <p>{listing.blurb}</p>
              <p className="mt-4">
                When you purchase this giga on NEXAVORA, your payment is placed into smart
                escrow. The seller begins work immediately, and funds are only transferred
                once you have reviewed, tested, and confirmed delivery.
              </p>
            </div>
          </div>

          {/* Included Features & Guarantee */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-display text-lg">What&apos;s Included</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                <span>Full commercial rights and deliverables source files</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                <span>Direct encrypted messaging with {listing.seller.name}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                <span>Protected by NEXAVORA Buyer Escrow & Dispute resolution</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                <span>Guaranteed delivery timeframe: {listing.deliveryTime}</span>
              </li>
            </ul>
          </div>

          {/* Seller Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg mb-4">About the Seller</h3>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-brand/15 text-brand font-bold flex items-center justify-center text-lg">
                {listing.seller.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-base">{listing.seller.name}</h4>
                  {listing.seller.verified && (
                    <Badge variant="brand" className="text-[10px] px-1.5 py-0">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Trusted creator & freelance service provider on NEXAVORA with a 99% on-time completion rate.
                </p>
                <div className="mt-4 flex gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/messages?recipient=${encodeURIComponent(listing.seller.name)}`}>
                      <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                      Contact Seller
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Order & Escrow Card */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Price
              </span>
              <span className="font-mono text-3xl font-bold tracking-tight text-foreground">
                {formatPrice(listing.priceCents, listing.currency)}
              </span>
            </div>

            <div className="ledger-rule" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Delivery</span>
                <span className="font-medium text-foreground">{listing.deliveryTime}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Escrow Fee</span>
                <span className="font-medium text-foreground">0.00 (Included)</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Dispute Coverage</span>
                <span className="font-medium text-brand">100% Guaranteed</span>
              </div>
            </div>

            <div className="pt-2">
              <OrderButton listing={listing} />
            </div>

            <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Lock className="h-4 w-4 text-brand" />
                <span>NEXAVORA Escrow Security</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Money is safely locked in smart escrow. Funds are never released to the seller
                until you confirm satisfactory delivery.
              </p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="h-3 w-3" /> FinCEN & ISO 27001 Escrow
                </span>
                <Link href="/certificates" className="text-brand hover:underline">
                  Inspect →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
