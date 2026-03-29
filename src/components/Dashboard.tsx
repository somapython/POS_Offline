import React, { useEffect, useState } from "react";
import {
  FiShoppingCart,
  FiTrendingUp,
  FiUsers,
  FiPackage,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { langData, LangKey } from "../utils/lang";

type Props = {
  dark: boolean;
  lang: LangKey;
};

export default function Dashboard({ dark, lang }: Props) {
  const t = langData[lang];
  // const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<any>({
    totalSales: 0,
    todaysSales: 0,
    totalTransactions: 0,
    totalProducts: 0,
    avgTransactionValue: 0,
    growthRate: 0,
  });

  const currency = "INR";
  const symbol = "₹";
   const dayNames = {
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    hi: ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रविवार'],
    mr: ['सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार'],
  };
  const currentDayNames = dayNames[lang] || dayNames.en;

  const chartData = [
    { name: currentDayNames[0], sales: 4000, transactions: 24 },
    { name: currentDayNames[1], sales: 3000, transactions: 18 },
    { name: currentDayNames[2], sales: 2500, transactions: 15 },
    { name: currentDayNames[3], sales: 5000, transactions: 32 },
    { name: currentDayNames[4], sales: 4500, transactions: 28 },
    { name: currentDayNames[5], sales: 6000, transactions: 35 },
    { name: currentDayNames[6], sales: 3250, transactions: 20 },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const data = await window.api.getDashboardData();
        setStats({
          ...stats,
          ...data,
          avgTransactionValue:
            data.totalTransactions > 0
              ? (data.totalSales / data.totalTransactions).toFixed(2)
              : 0,
          growthRate: 12.5, // placeholder (can calculate later)
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };
    load();
  }, []);

  const Card = ({
    icon: Icon,
    label,
    value,
    change,
    positive,
    isCurrency = true,
  }: any) => (
    <div
      className={`${
        dark ? "bg-gray-800 text-white" : "bg-white"
      } p-5 rounded-xl shadow`}
    >
      <div className="flex justify-between mb-3">
        <Icon className="text-2xl" />
        <span className={positive ? "text-green-500" : "text-red-500"}>
          {positive ? <FiArrowUp /> : <FiArrowDown />} {change}%
        </span>
      </div>
      <p className="text-sm">{label}</p>
      <h2 className="text-2xl font-bold">
        {isCurrency && symbol}
        {value}
      </h2>
    </div>
  );

  return (
    <div
      className={`${
        dark ? "bg-gray-900 text-white" : "bg-gray-100"
      } p-4 min-h-screen`}
    >
      {/* HEADER */}
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t.dashboard || "Dashboard"}
          </h1>
          <p className="flex items-center gap-2 text-sm">
            <FiCalendar /> {new Date().toDateString()}
          </p>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded text-black">
          {currency} {symbol}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card
          icon={FiShoppingCart}
          label={t.totalSales || "Total Sales"}
          value={stats.totalSales}
          change={12}
          positive
        />
        <Card
          icon={FiTrendingUp}
          label={t.todaysSales || "Today Sales"}
          value={stats.todaysSales}
          change={8}
          positive
        />
        <Card
          icon={FiUsers}
          label={t.transactions || "Transactions"}
          value={stats.totalTransactions}
          change={5}
          positive
          isCurrency={false}
        />
        <Card
          icon={FiPackage}
          label={t.products || "Products"}
          value={stats.totalProducts}
          change={-2}
          positive={false}
          isCurrency={false}
        />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* LINE */}
        <div
          className={`${
            dark ? "bg-gray-800" : "bg-white"
          } p-4 rounded shadow`}
        >
          <h3 className="mb-3 font-bold">
            {t.salesTrend || "Sales Trend"}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div
          className={`${
            dark ? "bg-gray-800" : "bg-white"
          } p-4 rounded shadow`}
        >
          <h3 className="mb-3 font-bold">
            {t.transactions || "Transactions"}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="transactions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FOOTER */}
      <div
        className={`${
          dark ? "bg-gray-800" : "bg-white"
        } mt-6 p-4 rounded shadow`}
      >
        <h3 className="font-bold mb-2">
          {t.summary || "Summary"}
        </h3>
        <p>
          {t.avgTransaction || "Avg Transaction"}: {symbol}
          {stats.avgTransactionValue}
        </p>
        <p>
          {t.growth || "Growth"}: {stats.growthRate}%
        </p>
      </div>
    </div>
  );
}