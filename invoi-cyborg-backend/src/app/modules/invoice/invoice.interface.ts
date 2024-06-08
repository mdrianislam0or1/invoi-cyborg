export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  seats: number;
  bags: number;
  features: string[];
  rates: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  imageURL: string;
}

export interface InvoiceData {
  reservationId: string;
  pickupDate: string;
  returnDate: string;
  discount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicle: Car;
  collisionDamageWaiver: boolean;
  liabilityInsurance: boolean;
  rentalTax: boolean;
}
