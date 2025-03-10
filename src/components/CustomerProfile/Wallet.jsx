import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Wallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const transactions = [
    {
      amount: '$50.00',
      paymentType: 'Paypal',
      transactionDate: 'Completed 20/01/2025',
    },
    {
      amount: '$100.00',
      paymentType: 'stripe',
      transactionDate: 'Completed 12/02/2025',
    },
    {
      amount: '$2000.00',
      paymentType: 'stripe',
      transactionDate: 'Completed 26/01/2025',
    },
    {
      amount: '$900000.00',
      paymentType: 'Paypal',
      transactionDate: 'Pending 15/02/2025',
    },
  ];

  const handleAddBalance = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAmount('');
    setPaymentMethod('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission (e.g., send data to the server)
    console.log('Amount:', amount);
    console.log('Payment Method:', paymentMethod);
    handleCloseModal();
  };

  return (
    <div className="p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Wallet</h2>

      {/* Add Balance Button */}
      <div className="mb-6">
        <Button
          onClick={handleAddBalance}
          className="px-4 py-2  rounded-md"
        >
          Add Balance
        </Button>
      </div>

      {/* Wallet Transactions Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Wallet Transactions</h3>

        {/* Show Entries and Search */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">Show 10 entries</div>
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-border">
            <thead>
              <tr className="">
                <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Payment Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="px-4 py-3 text-sm ">{transaction.amount}</td>
                  <td className="px-4 py-3 text-sm ">{transaction.paymentType}</td>
                  <td className="px-4 py-3 text-sm ">{transaction.transactionDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">Showing 1 to 4 of 4 entries</div>
        </div>
      </div>

      {/* Add Balance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add Balance</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a payment method</option>
                  <option value="Paypal">Paypal</option>
                  <option value="Stripe">Stripe</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;