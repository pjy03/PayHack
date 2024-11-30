"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

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
    <div className="min-h-screen bg-gray-100 p-8 sm:p-20">
      {/* Notification */}
      {notification && (
        <div
          className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-lg"
          onClick={() => router.push("setParameters")}
        >
          {notification}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold text-black mb-4">
              Propose Interest Rate
            </h2>
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
            <p className="text-center mt-2 text-gray-800">{proposedRate}%</p>
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

      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Bank Loan Applications
        </h1>
        <Link href="/setParameters">
          <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 shadow-lg mr-10">
            Set Parameters
          </button>
        </Link>

        <Link href="/businessRule">
          <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 shadow-lg">
            Set Business Rule
          </button>
        </Link>
      </header>

      {/* Loan Applications */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loanApplications.length > 0 ? (
          loanApplications.map((loan) => (
            <div
              key={loan.id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between"
            >
              {/* Loan Details */}
              <div>
                <h2 className="text-xl text-gray-800 font-semibold">
                  {loan.name}
                </h2>
                <p className="text-sm text-gray-600">
                  Loan Amount: {loan.amount}
                </p>
                <p className="text-sm text-gray-600">
                  Credit Scoring:{" "}
                  <span
                    className={`font-bold ${
                      loan.status >= 700
                        ? "text-green-500"
                        : loan.status >= 650
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {loan.status}
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 shadow-lg"
                  onClick={() => handleProposeInterestRate(loan.id)}
                >
                  Propose Rate
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No loan applications available.
          </p>
        )}
      </section>
    </div>
  );
}
