export interface PreferenceItem {
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }
  
  export interface PreferenceData {
    items: PreferenceItem[];
  }
  