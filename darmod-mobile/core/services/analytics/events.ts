export type AnalyticsEventMap = {
  // screen
  screen_viewed: {
    screen: 'home';
  };

  // discaovery
  map_marker_tapped: {
    provider_id: number;
    provider_name: string;
    category: string;
    distance_meters: number;
  };
  filter_selected: {
    category: string;
    providers_visible_count: number;
  };
  list_opened: {
    active_category: string;
    providers_count: number;
  };
  provider_card_viewed: {
    provider_id: number;
    provider_name: string;
    category: string;
    distance_meters: number;
    source: 'map' | 'list';
  };
  locate_me_tapped: Record<string, never>;

  //conversions
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
    map_app: 'apple' | 'google';
  };
  provider_shared: {
    provider_id: number;
    provider_name: string;
    category: string;
  };
};
