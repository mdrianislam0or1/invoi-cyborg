"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  useCreateInvoiceMutation,
  useGetCarsListQuery,
} from "@/redux/api/baseApi";
import { useReactToPrint } from "react-to-print";
import InvoicePrint from "./Invoice";
import Loading from "./Loading";

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
}

const ReservationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    reservationId: "",
    pickupDate: "",
    returnDate: "",
    duration: "",
    discount: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    vehicleType: "",
    vehicle: "",
    collisionDamageWaiver: false,
    liabilityInsurance: false,
    rentalTax: false,
  });

  const { data, isLoading } = useGetCarsListQuery({});
  const [createInvoice] = useCreateInvoiceMutation();
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formData.pickupDate && formData.returnDate) {
      const pickupDate = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);
      const durationInDays = Math.ceil(
        (returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      setFormData((prevData) => ({
        ...prevData,
        duration: `${durationInDays} Days`,
      }));
    }
  }, [formData.pickupDate, formData.returnDate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as any;

    if (name === "vehicle") {
      const selectedVehicleId = value;
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : selectedVehicleId,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selectedCar = data?.data.find(
      (car: Car) => car.id === formData.vehicle
    );

    if (!selectedCar) {
      alert("Please select a valid vehicle.");
      return;
    }

    const invoiceData = {
      ...formData,
      vehicle: {
        id: selectedCar.id,
        make: selectedCar.make,
        model: selectedCar.model,
        year: selectedCar.year,
        type: selectedCar.type,
        seats: selectedCar.seats,
        bags: selectedCar.bags,
        features: selectedCar.features,
        rates: selectedCar.rates,
        imageURL: selectedCar.imageURL,
      },
    };

    console.log("frontend data", invoiceData);
    try {
      await createInvoice(invoiceData).unwrap();
      alert("Invoice created successfully!");
    } catch (error) {
      alert("Failed to create invoice.");
      console.error(error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const calculateRentalCost = () => {
    const dailyRate = 99.0;
    const weeklyRate = 390.0;
    const durationInDays = formData.duration
      ? parseInt(formData.duration.split(" ")[0], 10)
      : 0;
    return durationInDays >= 7
      ? weeklyRate * Math.ceil(durationInDays / 7)
      : dailyRate * durationInDays;
  };

  const calculateTotalTax = () => {
    const rentalTaxRate = formData.rentalTax ? 0.115 : 0.0;
    const totalBeforeTax =
      calculateRentalCost() +
      (formData.collisionDamageWaiver ? 9.0 : 0.0) +
      (formData.liabilityInsurance ? 15.0 : 0.0);
    return totalBeforeTax * rentalTaxRate;
  };

  const calculateTotalCost = () => {
    const totalBeforeTax =
      calculateRentalCost() +
      (formData.collisionDamageWaiver ? 9.0 : 0.0) +
      (formData.liabilityInsurance ? 15.0 : 0.0);
    return totalBeforeTax + calculateTotalTax() - formData.discount;
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const vehicleTypes = Array.from(
    new Set(data?.data.map((car: Car) => car.type))
  );

  const dailyRate = 99.0;
  const weeklyRate = 390.0;
  const collisionDamageWaiverCost = formData.collisionDamageWaiver ? 9.0 : 0.0;
  const liabilityInsuranceCost = formData.liabilityInsurance ? 15.0 : 0.0;
  const rentalTaxRate = formData.rentalTax ? 0.115 : 0.0;
  const durationInDays = formData.duration
    ? parseInt(formData.duration.split(" ")[0], 10)
    : 0;
  const rentalCost =
    durationInDays >= 7
      ? weeklyRate * Math.ceil(durationInDays / 7)
      : dailyRate * durationInDays;
  const totalBeforeTax =
    rentalCost + collisionDamageWaiverCost + liabilityInsuranceCost;
  const totalTax = totalBeforeTax * rentalTaxRate;
  const totalCost = totalBeforeTax + totalTax - formData.discount;

  return (
    <div className="container mx-auto py-14">
      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Reservation Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reservation ID
              </label>
              <input
                type="text"
                name="reservationId"
                value={formData.reservationId}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pickup Date
              </label>
              <input
                type="datetime-local"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Return Date
              </label>
              <input
                type="datetime-local"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                readOnly
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Customer Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Additional Options
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="collisionDamageWaiver"
                checked={formData.collisionDamageWaiver}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Collision Damage Waiver ($9.00/day)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="liabilityInsurance"
                checked={formData.liabilityInsurance}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Liability Insurance ($15.00/day)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rentalTax"
                checked={formData.rentalTax}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Rental Tax (11.5%)
              </label>
            </div>
            <h2 className="text-xl font-semibold">Charges Summary</h2>
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <div className="flex justify-between text-sm font-medium">
                <span>Daily</span>
                <span>{durationInDays}</span>
                <span>${dailyRate.toFixed(2)}</span>
                <span>${(dailyRate * durationInDays).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Weekly</span>
                <span>{Math.ceil(durationInDays / 7)}</span>
                <span>${weeklyRate.toFixed(2)}</span>
                <span>
                  ${(weeklyRate * Math.ceil(durationInDays / 7)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Collision Damage Waiver</span>
                <span>${collisionDamageWaiverCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Liability Insurance</span>
                <span>${liabilityInsuranceCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Rental Tax</span>
                <span>${totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium mt-4">
                <span>Total</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Vehicle Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Type
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a vehicle type</option>
                {vehicleTypes.map((type: any) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle
              </label>
              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a vehicle</option>
                {data?.data
                  .filter((car: Car) => car.type === formData.vehicleType)
                  .map((car: Car) => (
                    <option key={car.id} value={car.id}>
                      {car.make} {car.model}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Invoice
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Print Invoice
          </button>
        </div>
      </form>
      <div style={{ display: "none" }}>
        <InvoicePrint
          ref={componentRef}
          formData={formData}
          selectedCar={
            data?.data.find((car: Car) => car.id === formData.vehicle) || null
          }
          totalCost={totalCost}
          totalTax={totalTax}
          collisionDamageWaiverCost={collisionDamageWaiverCost}
          liabilityInsuranceCost={liabilityInsuranceCost}
        />
      </div>
    </div>
  );
};

export default ReservationForm;
