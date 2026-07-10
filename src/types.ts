export type PlanType = 'hotspot' | 'direct';

export interface Plan {
  id: string;
  name: string;
  nameKey: string;
  data: string;
  duration: string;
  price: number;
  type: PlanType;
  badge: string;
  badgeKey: string;
  badgeColor: string;
  accentColor: string;
  borderColor: string;
  features: string[];
  featureKeys: string[];
  icon: string;
}

export type PaymentStep = 'phone' | 'otp' | 'success';

export type Page = 'home' | 'lumipay';
