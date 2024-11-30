"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [loanApplications, setLoanApplications] = useState([
    { id: 1, name: "Alex", amount: "$10,000", status: 690, approved: false },
    { id: 2, name: "Jane", amount: "$15,000", status: 720, approved: true },
    { id: 3, name: "Michael", amount: "$7,500", status: 680, approved: false },
  ]);

  const route = useRouter();

  const [notification, setNotification] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
  const [proposedRate, setProposedRate] = useState(5);
  const [sortOption, setSortOption] = useState("desc");
  const [filter, setFilter] = useState("all");

  const sortedLoans = [...loanApplications]
    .filter((loan) => {
      if (filter === "pending") return !loan.approved;
      if (filter === "approved") return loan.approved;
      return true;
    })
    .sort((a, b) => {
      return sortOption === "desc" ? b.status - a.status : a.status - b.status;
    });

  const handleProposeInterestRate = (id: number) => {
    setSelectedLoanId(id);
    setShowModal(true);
  };

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProposedRate(Number(event.target.value));
  };

  const handleConfirmRate = () => {
    setShowModal(false);
    setNotification(
      `Proposed interest rate of ${proposedRate}% for application ${selectedLoanId}.`
    );
    setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };

  const handleSortChange = (direction: "up" | "down") => {
    setSortOption(direction === "up" ? "asc" : "desc");
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  return (
    <div className="min-h-screen p-8 sm:p-20 bg-gray-700 text-white">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-200 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-lg transition-all opacity-100">
          {notification}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-black text-center">
              Propose Interest Rate
            </h2>
            <p className="mb-4 text-center text-black">
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
                className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600"
                onClick={handleConfirmRate}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-row items-center mb-12 text-white">
        <img src="logo.png" className="w-auto h-16 mr-4" alt="Logo" />
        <h1 className="text-5xl font-bold text-white tracking-wide">
          KreditKita
        </h1>
        <div className="flex gap-6 ml-auto">
          <Link href="/setParameters">
            <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 shadow-lg transition-all">
              Set Parameters
            </button>
          </Link>
          <Link href="/businessRule">
            <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 shadow-lg transition-all">
              Set Business Rule
            </button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-8 mb-6 justify-center">
        <button
          className={`${
            filter === "all"
              ? "bg-blue-500 bg-opacity-70 text-white border-2"
              : "bg-white bg-opacity-50 text-black border-2"
          } py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-600 transition-all`}
          onClick={() => handleFilterChange("all")}
        >
          All Applications
        </button>
        <button
          className={`${
            filter === "pending"
              ? "bg-yellow-500 bg-opacity-70 text-white border-2"
              : "bg-white bg-opacity-50 text-black border-2"
          } py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-600 transition-all`}
          onClick={() => handleFilterChange("pending")}
        >
          Pending Applications
        </button>
        <button
          className={`${
            filter === "approved"
              ? "bg-green-500 bg-opacity-70 text-white border-2"
              : "bg-white bg-opacity-50 text-black border-2"
          } py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-600 transition-all`}
          onClick={() => handleFilterChange("approved")}
        >
          Approved Applications
        </button>
      </div>

      {/* Sorting Options */}
      <div className="bg-gray-300 mb-12 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-black">Sort By</h2>

          <div className="flex items-center gap-6">
            <button
              onClick={() => handleSortChange("down")}
              className="p-2 bg-black rounded-full hover:bg-gray-400 text-white transition-all"
            >
              ↓
            </button>
            <button
              onClick={() => handleSortChange("up")}
              className="p-2 bg-black rounded-full hover:bg-gray-400 text-white transition-all"
            >
              ↑
            </button>
          </div>
        </div>

        {/* Loan Applications */}
        <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sortedLoans.length > 0 ? (
            sortedLoans.map((loan) => (
              <div
                key={loan.id}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                {/* Loan Details */}
                <div>
                  <h2 className="text-2xl font-semibold text-black mb-2">
                    {loan.name}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Loan Amount: {loan.amount}
                  </p>
                  <p className="text-gray-600 text-lg">
                    Credit Scoring:{" "}
                    <span
                      className={`font-bold text-lg ${
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
                <div className="flex gap-6 mt-6 justify-center">
                  <button
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 shadow-lg transition-all"
                    onClick={() => handleProposeInterestRate(loan.id)}
                  >
                    Propose Rate
                  </button>
                  <button
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 shadow-lg transition-all"
                    onClick={() => route.push("/viewProfile")}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-lg">
              No loan applications available.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
