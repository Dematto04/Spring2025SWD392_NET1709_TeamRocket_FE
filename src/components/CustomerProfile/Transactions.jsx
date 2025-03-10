import React from 'react';

const transactions = [
    {
      provider: 'Demoprovid...',
      service: 'Apartment...',
      amount: 312.00,
      tax: 52.00,
      date: '07/02/2025',
      paymentType: 'Stripe',
      status: 'Unpaid',
    },
    // Add more transactions here
  ];

const Transactions = () => {
  return (
    <div className="p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Booking Transaction</h2>

      {/* Leads Transaction Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Leads Transaction</h3>

        {/* Show Entries and Search */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm ">Show 10 entries</div>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibol">Provider</th>
                <th className="px-4 py-3 text-left text-sm font-semibol">Service</th>
                <th className="px-4 py-3 text-left text-sm font-semibol">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibol">Tax</th>
                <th className="px-4 py-3 text-left text-sm font-semibol">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibol">Payment Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibol">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibol">Action</th>
              </tr>
            </thead>
            <tbody>
            {transactions.map((transaction, index) => (
                <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm">{transaction.provider}</td>
                <td className="px-4 py-3 text-sm">{transaction.service}</td>
                <td className="px-4 py-3 text-sm">{transaction.amount}</td>
                <td className="px-4 py-3 text-sm">{transaction.tax}</td>
                <td className="px-4 py-3 text-sm">{transaction.date}</td>
                <td className="px-4 py-3 text-sm">{transaction.paymentType}</td>
                <td className="px-4 py-3 text-sm">{transaction.status}</td>
                <td className="px-4 py-3 text-sm">
                    <button className="text-blue-500 hover:text-blue-700">Edit</button>
                </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">Showing 1 to 10 of 183 entries</div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">Previous</button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">1</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">2</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">3</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">4</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">5</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">19</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;