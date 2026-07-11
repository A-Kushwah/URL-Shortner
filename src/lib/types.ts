export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface Link {
  id: string;
  slug: string;
  destination_url: string;
  owner_id: string | null;
  disabled: number;
  created_at: string;
  updated_at: string;
}

export interface Click {
  id: string;
  link_id: string;
  clicked_at: string;
  referer_host: string | null;
  country: string | null;
  device: string | null;
}

export interface LinkWithStats extends Link {
  total_clicks: number;
}
