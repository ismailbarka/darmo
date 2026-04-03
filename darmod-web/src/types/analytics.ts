export type AnalyticsEventMap = {
  screen_viewed: {
    screen: 'home';
  };
  map_popup_tapped: {
    provider_id: number;
    provider_name: string;
    category?: string;
  };
  filter_selected: {
    category_id: number | string;
    category_name?: string;
    providers_visible_count: number;
  };
  list_opened: {
    active_category_id: number | string | null;
    providers_count: number;
  };
  provider_card_viewed: {
    provider_id: number;
    provider_name: string;
    category: string;
    distance_meters: number | null;
    source: 'map' | 'list';
  };
  locate_me_tapped: Record<string, never>;
  support_whatsapp_tapped: Record<string, never>;
  provider_called: {
    provider_id: number;
    provider_name: string;
    category: string;
  };
  provider_whatsapp_tapped: {
    provider_id: number;
    provider_name: string;
    category: string;
  };
  provider_directions_requested: {
    provider_id: number;
    provider_name: string;
    category: string;
    map_app?: string;
  };
  provider_shared: {
    provider_id: number;
    provider_name: string;
    category: string;
  };
  language_changed: {
    language: string;
  };
};
