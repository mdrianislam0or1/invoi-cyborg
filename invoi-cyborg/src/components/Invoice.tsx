/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/display-name */
import Image from "next/image";
import React from "react";

interface FormData {
  reservationId: string;
  pickupDate: string;
  returnDate: string;
  duration: string;
  discount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleType: string;
  vehicle: string;
  collisionDamageWaiver: boolean;
  liabilityInsurance: boolean;
  rentalTax: boolean;
}

interface Car {
  id: string;
  type: string;
  make: string;
  model: string;
  year: any;
  seats: any;
  bags: any;
  features: any;
  imageURL: any;
}

interface InvoicePrintProps {
  formData: FormData;
  selectedCar: Car | null;
  totalCost: number;
  totalTax: number;
  collisionDamageWaiverCost: number;
  liabilityInsuranceCost: number;
}

const InvoicePrint = React.forwardRef<HTMLDivElement, InvoicePrintProps>(
  (props, ref) => {
    const {
      formData,
      selectedCar,
      totalCost,
      totalTax,
      collisionDamageWaiverCost,
      liabilityInsuranceCost,
    } = props;

    return (
      <div ref={ref} className="p-8">
        <h1 className="text-2xl font-bold mb-2">Invoice</h1>

        <div className="p-6 max-w-4xl mx-auto bg-white border rounded-md shadow-md">
          <div className="flex justify-between items-center border-b pb-4 mb-2">
            <div>
              <h1 className="text-xl font-bold">CH Car Place Inc</h1>
              <p>162 Bergen St</p>
              <p>Brooklyn, NY 11213</p>
              <p>Ph#: (555) 123-4569</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">Reservation</p>
              <p>{formData.reservationId}</p>
              <p>Repair Order:</p>
              <p>Claim:</p>
            </div>
          </div>

          <div className="flex justify-between items-center border-b pb-4 mb-2">
            <div>
              <h2 className="text-lg font-bold">Renter Info</h2>
              <p>
                {formData.firstName} {formData.lastName}
              </p>
              <p>Email: {formData.email}</p>
              <p>Phone: {formData.phone}</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold">Vehicle Details</h2>
              <p>Unit Details</p>
              <p>Unit: {formData.vehicle}</p>
              <p>Duration: {formData.duration}</p>
              <h1>Vehicle Details</h1>
              <Image
                width={100}
                height={100}
                src={selectedCar?.imageURL}
                alt=""
              />
              <small> year: {selectedCar?.year}</small>
              <small> seats: {selectedCar?.seats}</small>
              <small> bags: {selectedCar?.bags}</small>
              <small>features: {selectedCar?.features}</small>
              <small>Vehicle: {selectedCar?.make}</small>
              <strong>
                features: <p>{selectedCar?.features}</p>
              </strong>
            </div>
          </div>

          <div className="border-b pb-4 mb-2">
            <h2 className="text-lg font-bold">Charge Summary</h2>
            <div className="flex justify-between">
              <div>
                <p>Rental Cost</p>
                <p>Collision Damage Waiver</p>
                <p>Liability Insurance</p>
                <p>Total Tax</p>
                <p>Discount</p>
              </div>
              <div className="text-right">
                <p> ${totalCost.toFixed(2)}</p>
                <p>${collisionDamageWaiverCost.toFixed(2)}</p>
                <p> ${liabilityInsuranceCost.toFixed(2)}</p>
                <p>${totalTax.toFixed(2)}</p>
                <p> ${formData.discount}</p>
              </div>
            </div>
            <div className="flex justify-between mt-2 font-bold">
              <p>Total Cost</p>
              <p> ${totalCost.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-b pb-4 mb-2">
            <h2 className="text-lg font-bold">Notice</h2>
            <p>
              Collision Insurance (CDW) - $7 per day limits liability for
              damages to one's own vehicle up to $1000 in case of an accident,
              with any remaining coverage after $1000. You may already have
              similar coverage through your credit card company.
            </p>
            <p className="mt-2">
              Accept{" "}
              <input type="checkbox" className="form-checkbox h-4 w-4 ml-2" />{" "}
              Reject{" "}
              <input type="checkbox" className="form-checkbox h-4 w-4 ml-2" />
            </p>
          </div>

          <div className="text-right mt-4">
            <p>
              Rental service may be refused to anyone when done in the best
              interest of the renting company or customer.
            </p>
            <p>Rates do not include gasoline.</p>
            <p>
              Reserves the right to collect deposit covering estimated rental
              charges.
            </p>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              <p>Renter's Signature:</p>
              <p>___________________________</p>
            </div>
            <div>
              <p>Additional Driver 1:</p>
              <p>___________________________</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default InvoicePrint;
