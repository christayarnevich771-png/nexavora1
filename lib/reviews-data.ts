export interface WorldwideReview {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatarUrl: string;
  country: string;
  countryCode: string;
  flagEmoji: string;
  rating: number;
  date: string;
  orderType: string;
  amount: string;
  verifiedBuyer: boolean;
  testimonial: string;
  escrowStatus: "Released After Approval" | "Protected via Multi-Sig" | "Delivered & Verified";
}

export const worldwideReviews: WorldwideReview[] = [
  {
    id: "rev-us-1",
    name: "Marcus Vance",
    role: "Head of Product",
    company: "HyperScale Labs, Austin",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
    country: "United States",
    countryCode: "US",
    flagEmoji: "🇺🇸",
    rating: 5.0,
    date: "2 days ago",
    orderType: "React & Next.js SaaS Infrastructure",
    amount: "$1,850.00",
    verifiedBuyer: true,
    testimonial:
      "Having our $1,850 locked in NEXAVORA's smart escrow gave us total peace of mind. The seller delivered full source code and documentation. Only after our engineering team inspected the repository and verified clean lint did I click release. The entire process was bulletproof.",
    escrowStatus: "Released After Approval",
  },
  {
    id: "rev-uk-1",
    name: "Eleanor Sterling",
    role: "Creative Director",
    company: "Sterling Brand Foundry",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80",
    country: "United Kingdom",
    countryCode: "GB",
    flagEmoji: "🇬🇧",
    rating: 5.0,
    date: "Sep 24, 2026",
    orderType: "Complete Brand Identity & Typography",
    amount: "£680.00",
    verifiedBuyer: true,
    testimonial:
      "In the UK, finding reliable freelancers without losing deposit money to ghosting used to be a nightmare. On NEXAVORA, every seller is strictly KYC verified with official government IDs. Marlowe Studio delivered ahead of schedule and the timeline records kept both parties completely aligned.",
    escrowStatus: "Released After Approval",
  },
  {
    id: "rev-de-1",
    name: "Maximilian Weber",
    role: "Senior Systems Architect",
    company: "Bavaria FinTech Solutions",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
    country: "Germany",
    countryCode: "DE",
    flagEmoji: "🇩🇪",
    rating: 5.0,
    date: "Sep 22, 2026",
    orderType: "Smart Contract Audit & Formal Verification",
    amount: "€2,400.00",
    verifiedBuyer: true,
    testimonial:
      "As a German engineer, security and compliance are non-negotiable. NEXAVORA's ISO 27001 certificate and FinCEN compliance are genuine. Our funds were held in automated escrow, and the seller passed strict passport verification. Seamless crypto transfer via USDT BEP20.",
    escrowStatus: "Protected via Multi-Sig",
  },
  {
    id: "rev-ca-1",
    name: "Chloe Tremblay",
    role: "E-Commerce Founder",
    company: "Nordic Atelier Montreal",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80",
    country: "Canada",
    countryCode: "CA",
    flagEmoji: "🇨🇦",
    rating: 4.9,
    date: "Sep 19, 2026",
    orderType: "Shopify Custom Theme & Speed Tuning",
    amount: "$750.00",
    verifiedBuyer: true,
    testimonial:
      "Our conversion rate doubled after the Shopify overhaul. What impressed me most was that the seller could not withdraw the funds until I tested the store on mobile and confirmed my 98+ PageSpeed score. NEXAVORA is setting a new benchmark for peer-to-peer commerce.",
    escrowStatus: "Released After Approval",
  },
  {
    id: "rev-au-1",
    name: "Liam O'Connor",
    role: "Independent Indie Hacker",
    company: "Melbourne Web Ventures",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
    country: "Australia",
    countryCode: "AU",
    flagEmoji: "🇦🇺",
    rating: 5.0,
    date: "Sep 16, 2026",
    orderType: "Tailwind UI Kit & Design System",
    amount: "AU$380.00",
    verifiedBuyer: true,
    testimonial:
      "Instant delivery with guaranteed authenticity. Bought Castellan UI's component package. The transaction was logged with full SHA-256 hash. Customer support is active 24/7 on Telegram and WhatsApp if you ever need escrow help.",
    escrowStatus: "Delivered & Verified",
  },
  {
    id: "rev-sg-1",
    name: "Seraphina Lin",
    role: "Managing Partner",
    company: "SingaCapital Ventures",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80",
    country: "Singapore",
    countryCode: "SG",
    flagEmoji: "🇸🇬",
    rating: 5.0,
    date: "Sep 12, 2026",
    orderType: "Venture Pitch Deck & Financial Model",
    amount: "US$1,200.00",
    verifiedBuyer: true,
    testimonial:
      "We outsourced our LP memo and deck design to a verified seller. The escrow system worked flawlessly across currencies. Zero hidden fees, crystal-clear order timeline, and institutional-grade escrow arbitration.",
    escrowStatus: "Protected via Multi-Sig",
  },
  {
    id: "rev-fr-1",
    name: "Antoine Moreau",
    role: "Chief Technology Officer",
    company: "Lumière Digital Paris",
    avatarUrl:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&h=400&q=80",
    country: "France",
    countryCode: "FR",
    flagEmoji: "🇫🇷",
    rating: 4.9,
    date: "Sep 10, 2026",
    orderType: "Three.js 3D Interactive Web Experience",
    amount: "€1,650.00",
    verifiedBuyer: true,
    testimonial:
      "The dispute settlement mechanism is the fairest I've seen. We had one minor revision requirement; the seller resolved it within 24 hours directly through the encrypted order chat. Truly international and secure.",
    escrowStatus: "Released After Approval",
  },
  {
    id: "rev-jp-1",
    name: "Kenji Sato",
    role: "Lead Game Developer",
    company: "NeoTokyo Interactive",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80",
    country: "Japan",
    countryCode: "JP",
    flagEmoji: "🇯🇵",
    rating: 5.0,
    date: "Sep 05, 2026",
    orderType: "Game Audio, Foley & Synthesizer Pack",
    amount: "¥180,000",
    verifiedBuyer: true,
    testimonial:
      "Very smooth cross-border transaction with Solana. Deliverables were high fidelity 24-bit WAVs. NEXAVORA's seller KYC ensures nobody uploads pirated assets.",
    escrowStatus: "Delivered & Verified",
  },
];
