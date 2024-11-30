"use client";

import { Edit as EditIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Home() {
  const [isEditing, setIsEditing] = useState(false);
  const route = useRouter();

  const userProfile = {
    name: "John Doe",
    email: "johndoe@example.com",
    bio: "Software developer, open-source enthusiast, and passionate learner.",
    avatar: "logo.png",
    completedProjects: 25,
    messages: 13,
    progress: 70, // Completed projects progress percentage
    totalBalance: 5000, // Example: Total balance in USD
    totalIncome: 10000, // Total income
    totalSpent: 5000, // Total spent
    debt: 2000, // Example: Total debt
    transactions: [
      { date: "2024-12-01", amount: 150, type: "Deposit" },
      { date: "2024-11-25", amount: -200, type: "Withdrawal" },
      { date: "2024-11-20", amount: 300, type: "Deposit" },
    ], // Sample transaction history
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Calculating debt-to-ratio as (totalDebt / totalIncome) * 100
  const debtToIncomeRatio = (userProfile.debt / userProfile.totalIncome) * 100;

  const data = [
    {
      name: "Debt-to-Income",
      ratio: debtToIncomeRatio,
    },
  ];

  return (
    <div className="bg-white">
      <button
        className="bg-blue-500 mt-5 ml-5 text-white py-1 px-3 rounded-lg hover:bg-blue-600 mb-5"
        onClick={() => route.push("/")}
      >
        Back
      </button>
      <Container
        sx={{
          backgroundColor: "#f0f2f5",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            gap: 4,
            maxWidth: 1200,
            padding: 4,
          }}
        >
          {/* Profile Card */}
          <Box sx={{ flex: 1, maxWidth: "400px" }}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 4,
                transition: "all 0.3s ease-in-out",
                backgroundColor: "#fff",
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    alt={userProfile.name}
                    src={userProfile.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      border: "4px solid #1976d2", // Border around avatar
                    }}
                  />
                }
                action={
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ marginTop: "10px" }}
                    onClick={handleEditClick}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                }
                title={userProfile.name}
                subheader={userProfile.email}
              />
              <CardContent>
                <Typography variant="body1" color="textSecondary">
                  {userProfile.bio}
                </Typography>
              </CardContent>
            </Card>

            <Box sx={{ flex: 1 }}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 4,
                  transition: "all 0.3s ease-in-out",
                  backgroundColor: "#fff",
                  marginTop: "50px",
                }}
              >
                <CardHeader title="Bank Account Insights" />
                <CardContent>
                  {userProfile.transactions.map((transaction, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 2,
                      }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        {transaction.date}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={transaction.amount > 0 ? "green" : "red"}
                      >
                        {transaction.amount > 0 ? "+" : ""}${transaction.amount}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Financial and Stats Cards */}
          <Box
            sx={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              flexWrap: "wrap",
              maxWidth: "700px", // Max width for stats cards
            }}
          >
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {/* Financial Overview */}
              <Box sx={{ flex: 1, minWidth: 240 }}>
                <Card
                  sx={{
                    boxShadow: 3,
                    borderRadius: 4,
                    transition: "all 0.3s ease-in-out",
                    backgroundColor: "#fff",
                  }}
                >
                  <CardHeader title="Transactional Behavior" />
                  <CardContent>
                    <Typography variant="h5" color="warning">
                      ${userProfile.totalBalance}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (userProfile.totalBalance / userProfile.totalIncome) *
                        100
                      }
                      sx={{
                        marginTop: 2,
                        backgroundColor: "#e0e0e0",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "orange", // Progress bar color
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ marginTop: 1 }}
                    >
                      {Math.round(
                        (userProfile.totalBalance / userProfile.totalIncome) *
                          100
                      )}
                      % of total income
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Debt-to-Income Ratio Bar Chart */}
            <Box sx={{ flex: 1 }}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 4,
                  transition: "all 0.3s ease-in-out",
                  backgroundColor: "#fff",
                }}
              >
                <CardHeader title="Debt-to-Income Ratio" />
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="ratio" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginTop: 2 }}
                  >
                    Debt-to-Income Ratio: {debtToIncomeRatio.toFixed(2)}%
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Transaction History */}
          </Box>
        </Box>
      </Container>
    </div>
  );
}
