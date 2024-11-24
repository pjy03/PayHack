"use client";

import { useState } from "react";

export default function Home() {
  const [loanApplications, setLoanApplications] = useState([
    { id: 1, name: "Alex", amount: "$10,000", status: "690" },
    { id: 2, name: "Jane", amount: "$15,000", status: "720" },
    { id: 3, name: "Michael", amount: "$7,500", status: "680" },
  ]);

  const [notification, setNotification] = useState(null); // State for notifications
  const [showModal, setShowModal] = useState(false); // State to toggle modal visibility
  const [selectedLoanId, setSelectedLoanId] = useState(null); // Track selected loan ID
  const [proposedRate, setProposedRate] = useState(5); // Default interest rate

  const handleApprove = (id) => {
    setLoanApplications((prev) => prev.filter((loan) => loan.id !== id)); // Remove application
    setNotification(`Loan application ${id} approved successfully!`);
    setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
  };

  const handleReject = (id) => {
    console.log(`Loan application ${id} rejected.`);
  };

  const handleProposeInterestRate = (id) => {
    setSelectedLoanId(id); // Set the current loan ID
    setShowModal(true); // Show the modal
  };

  const handleRateChange = (event) => {
    setProposedRate(event.target.value); // Update slider value
  };

  const handleConfirmRate = () => {
    console.log(
      `New interest rate ${proposedRate}% proposed for application ${selectedLoanId}.`
    );
    setShowModal(false); // Hide the modal
    setNotification(
      `Proposed interest rate of ${proposedRate}% for application ${selectedLoanId}.`
    );
    setTimeout(() => setNotification(null), 3000); // Hide notification
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-lg">
            {notification}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              <h2 className="text-xl font-semibold text-black mb-4">Propose Interest Rate</h2>
              <p className="mb-4 text-gray-600">
                Set a new interest rate for loan application {selectedLoanId}.
              </p>
              <input
                type="range"
                min="1"
                max="20"
                value={proposedRate}
                onChange={handleRateChange}
                className="w-full"
              />
              <p className="text-center mt-2 text-gray-800">
                {proposedRate}%
              </p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="bg-gray-500 text-white py-1 px-3 rounded-lg hover:bg-gray-600"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
                  onClick={handleConfirmRate}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col w-full">
          <h1 className="text-3xl font-bold mb-6">Bank Loan Applications</h1>
          <div className="space-y-4 w-full">
            {loanApplications.length > 0 ? (
              loanApplications.map((loan) => (
                <div
                  key={loan.id}
                  className="flex justify-between items-center bg-white border p-4 rounded-lg shadow-md w-full"
                >
                  {/* Loan Details */}
                  <div>
                    <h2 className="text-xl text-black font-semibold">
                      {loan.name}
                    </h2>
                    <p className="text-sm text-black">
                      Loan Amount: {loan.amount}
                    </p>
                    <p className="text-sm text-blue-600">
                      Credit Scoring: {loan.status}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600"
                      onClick={() => handleApprove(loan.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                      onClick={() => handleReject(loan.id)}
                    >
                      Reject
                    </button>
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
                      onClick={() => handleProposeInterestRate(loan.id)}
                    >
                      Propose Interest Rate
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No loan applications available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
