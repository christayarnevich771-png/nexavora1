import { categories, listings, currentProfile } from "@/lib/placeholder-data";

export interface MockUser {
  id: string;
  email: string;
  user_metadata?: {
    username?: string;
    display_name?: string;
  };
}

const defaultMockUser: MockUser = {
  id: "usr_mock_101",
  email: "jordan.ashby@example.com",
  user_metadata: {
    username: "jordan.ashby",
    display_name: "Jordan Ashby",
  },
};

function getClientStoredUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("nx_mock_user");
    if (raw) return JSON.parse(raw);
    const match = document.cookie.match(/nx_mock_user=([^;]+)/);
    if (match) return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    //
  }
  return null;
}

export function createQueryBuilder(table: string) {
  let filteredItems: any[] = [];

  if (table === "listings") {
    filteredItems = listings.map((l, index) => ({
      id: `lst-${index + 1}`,
      slug: l.slug,
      title: l.title,
      description: l.blurb,
      price_cents: l.priceCents,
      currency: l.currency,
      delivery_time_days: parseInt(l.deliveryTime) || 3,
      status: "active",
      created_at: new Date(Date.now() - index * 86400000).toISOString(),
      category: {
        name: l.category,
        slug: l.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      },
      seller: {
        username: l.seller.name.toLowerCase().replace(/\s+/g, ""),
        display_name: l.seller.name,
        is_verified: l.seller.verified,
      },
    }));
  } else if (table === "categories") {
    filteredItems = categories.map((c, i) => ({
      id: `cat-${i + 1}`,
      slug: c.slug,
      name: c.name,
      description: `Verified ${c.name} digital services.`,
      sort_order: i,
      created_at: new Date().toISOString(),
    }));
  } else if (table === "profiles") {
    filteredItems = [
      {
        id: "usr_mock_101",
        username: currentProfile.handle.replace("@", ""),
        display_name: currentProfile.displayName,
        bio: currentProfile.bio,
        avatar_url: null,
        role: "buyer_seller",
        is_verified: currentProfile.verified,
        is_banned: false,
        created_at: "2024-03-01T00:00:00.000Z",
        updated_at: "2024-03-01T00:00:00.000Z",
      },
    ];
  } else if (table === "reviews") {
    filteredItems = [
      { id: "rev-1", rating: 5, reviewee_id: "usr_mock_101" },
      { id: "rev-2", rating: 5, reviewee_id: "usr_mock_101" },
      { id: "rev-3", rating: 4.8, reviewee_id: "usr_mock_101" },
    ];
  } else if (table === "orders") {
    filteredItems = [
      { id: "ord-1", seller_id: "usr_mock_101", status: "completed" },
      { id: "ord-2", seller_id: "usr_mock_101", status: "completed" },
    ];
  }

  const builder: any = {
    select(_columns?: string, _options?: any) {
      return builder;
    },
    insert(data: any) {
      return Promise.resolve({ data, error: null });
    },
    update(data: any) {
      return Promise.resolve({ data, error: null });
    },
    delete() {
      return Promise.resolve({ data: null, error: null });
    },
    eq(column: string, value: any) {
      if (column === "slug") {
        filteredItems = filteredItems.filter((i) => i.slug === value);
      } else if (column === "status") {
        filteredItems = filteredItems.filter((i) => i.status === value);
      } else if (column === "id") {
        filteredItems = filteredItems.filter((i) => i.id === value);
      } else if (column === "seller_id") {
        filteredItems = filteredItems.filter((i) => i.seller_id === value);
      } else if (column === "reviewee_id") {
        filteredItems = filteredItems.filter((i) => i.reviewee_id === value);
      }
      return builder;
    },
    neq(column: string, value: any) {
      filteredItems = filteredItems.filter((i) => i[column] !== value);
      return builder;
    },
    order(_column: string, _options?: any) {
      return builder;
    },
    limit(count: number) {
      filteredItems = filteredItems.slice(0, count);
      return builder;
    },
    single() {
      const item = filteredItems[0] || null;
      return Promise.resolve({ data: item, error: null });
    },
    maybeSingle() {
      const item = filteredItems[0] || null;
      return Promise.resolve({ data: item, error: null });
    },
    then(resolve: (result: { data: any[]; error: null; count: number }) => any) {
      return Promise.resolve(
        resolve({
          data: filteredItems,
          error: null,
          count: filteredItems.length,
        })
      );
    },
  };

  return builder;
}

export function getMockSupabaseClient() {
  return {
    auth: {
      async getUser() {
        const user = getClientStoredUser();
        return { data: { user }, error: null };
      },
      async getSession() {
        const user = getClientStoredUser();
        return {
          data: {
            session: user ? { user, access_token: "mock_jwt" } : null,
          },
          error: null,
        };
      },
      onAuthStateChange(_callback: (event: string, session: any) => void) {
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      },
      async signInWithPassword({ email }: { email: string }) {
        const user: MockUser = {
          id: "usr_mock_101",
          email,
          user_metadata: {
            username: email.split("@")[0],
            display_name: email.split("@")[0],
          },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("nx_mock_user", JSON.stringify(user));
          document.cookie = `nx_mock_user=${encodeURIComponent(
            JSON.stringify(user)
          )}; path=/; max-age=86400`;
        }
        return { data: { user }, error: null };
      },
      async signUp({
        email,
        options,
      }: {
        email: string;
        options?: { data?: { username?: string; display_name?: string } };
      }) {
        const user: MockUser = {
          id: `usr_${Date.now()}`,
          email,
          user_metadata: {
            username: options?.data?.username || email.split("@")[0],
            display_name:
              options?.data?.display_name || options?.data?.username || email.split("@")[0],
          },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("nx_mock_user", JSON.stringify(user));
          document.cookie = `nx_mock_user=${encodeURIComponent(
            JSON.stringify(user)
          )}; path=/; max-age=86400`;
        }
        return {
          data: {
            user,
            session: { user, access_token: "mock_jwt" },
          },
          error: null,
        };
      },
      async signOut() {
        if (typeof window !== "undefined") {
          localStorage.removeItem("nx_mock_user");
          document.cookie =
            "nx_mock_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        return { error: null };
      },
      async resetPasswordForEmail() {
        return { data: {}, error: null };
      },
      async updateUser() {
        return { data: { user: defaultMockUser }, error: null };
      },
      async exchangeCodeForSession() {
        return {
          data: { session: { user: defaultMockUser, access_token: "mock_jwt" } },
          error: null,
        };
      },
    },
    from(table: string) {
      return createQueryBuilder(table);
    },
  };
}

export function getMockSupabaseServerClient(cookieUser?: MockUser | null) {
  const activeUser = cookieUser || null;

  return {
    auth: {
      async getUser() {
        return { data: { user: activeUser }, error: null };
      },
      async getSession() {
        return {
          data: {
            session: activeUser
              ? { user: activeUser, access_token: "mock_jwt" }
              : null,
          },
          error: null,
        };
      },
      async signInWithPassword({ email }: { email: string }) {
        const user: MockUser = {
          id: "usr_mock_101",
          email,
          user_metadata: {
            username: email.split("@")[0],
            display_name: email.split("@")[0],
          },
        };
        return { data: { user }, error: null };
      },
      async signUp({
        email,
        options,
      }: {
        email: string;
        options?: { data?: { username?: string; display_name?: string } };
      }) {
        const user: MockUser = {
          id: "usr_mock_101",
          email,
          user_metadata: {
            username: options?.data?.username || email.split("@")[0],
            display_name:
              options?.data?.display_name || options?.data?.username || email.split("@")[0],
          },
        };
        return {
          data: {
            user,
            session: { user, access_token: "mock_jwt" },
          },
          error: null,
        };
      },
      async signOut() {
        return { error: null };
      },
      async resetPasswordForEmail() {
        return { data: {}, error: null };
      },
      async updateUser() {
        return { data: { user: defaultMockUser }, error: null };
      },
      async exchangeCodeForSession() {
        return {
          data: { session: { user: defaultMockUser, access_token: "mock_jwt" } },
          error: null,
        };
      },
    },
    from(table: string) {
      return createQueryBuilder(table);
    },
  };
}
