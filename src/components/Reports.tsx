import React, { useState } from "react";
import {
  FiDownload,
  FiFilter,
  FiCalendar,
  FiShare2,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { langData, LangKey } from "../utils/lang";

type Props = {
  dark: boolean;
  lang: LangKey;
};

export default function Reports({ dark, lang }: Props) {
  const t = langData[lang];

  const [selectedReport, setSelectedReport] = useState("sales");
  const [dateRange, setDateRange] = useState("week");


  // 🔥 DATA
  const salesData = [
    { date: 'Mon', sales: 4000, transactions: 24 },
    { date: 'Tue', sales: 3000, transactions: 18 },
    { date: 'Wed', sales: 2500, transactions: 15 },
    { date: 'Thu', sales: 5000, transactions: 32 },
    { date: 'Fri', sales: 4500, transactions: 28 },
    { date: 'Sat', sales: 6000, transactions: 35 },
    { date: 'Sun', sales: 3250, transactions: 20 },
  ];

  const productSales = [
    { name: 'Coffee', value: 2800 },
    { name: 'Sandwich', value: 1900 },
    { name: 'Juice', value: 1500 },
    { name: 'Pastry', value: 900 },
    { name: 'Water', value: 500 },
  ];

  const [filteredData, setFilteredData] = useState(salesData);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const itemsPerPage = 4;

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // 📄 PDF EXPORT
  const handleExport = () => {
    const doc = new jsPDF();

    doc.text("POS Report", 14, 10);

    autoTable(doc, {
      head: [["Date", "Sales"]],
      body: filteredData.map((s) => [s.date, s.sales]),
    });

    doc.save("Sales_Report.pdf");

    toast.success("PDF Downloaded");
  };

  // 📱 WHATSAPP SHARE
  const handleShare = () => {
    const text = `POS Report\nTotal Sales: ₹${filteredData.reduce(
      (a, b) => a + b.sales,
      0
    )}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);

    toast.success("Shared to WhatsApp");
  };

  const applyFilter = () => {
    let data = [...salesData];

    if (dateRange === "today") {
      data = [salesData[salesData.length - 1]];
    }

    if (dateRange === "week") {
      data = salesData.slice(-7);
    }

    if (dateRange === "month") {
      data = salesData;
    }

    if (dateRange === "custom" && fromDate && toDate) {
      // demo filter (you can replace with real date)
      data = salesData.filter((_, i) => i >= 2 && i <= 5);
    }

    setFilteredData(data);
  };
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  return (
    <div
      className={`p-6 min-h-screen ${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
    >
      <Toaster position="top-right" />

      <div
        className={`max-w-6xl mx-auto p-6 rounded-xl shadow ${dark ? "bg-gray-800" : "bg-white"
          }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t.reports}</h1>
            <p className="text-sm opacity-70">{t.analytics}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2"
            >
              <FiDownload /> {t.download}
            </button>

            <button
              onClick={handleShare}
              className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2"
            >
              <FiShare2 /> {t.share}
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div
          className={`p-6 rounded-xl shadow mb-6 transition-all duration-300 ${dark ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
        >
          {/* HEADER */}
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className="text-xl animate-pulse text-blue-500" />
            <h2 className="font-bold text-lg">{t.filter}</h2>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* REPORT TYPE */}
            <div className="flex flex-col">
              <label className="text-sm mb-1 font-semibold flex items-center gap-2">
                📊 {t.reportType}
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className={`p-2 rounded border transition ${dark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                  }`}
              >
                <option value="sales">{t.sales}</option>
                <option value="inventory">{t.inventory}</option>
              </select>
            </div>

            {/* DATE RANGE */}
            <div className="flex flex-col">
              <label className="text-sm mb-1 font-semibold flex items-center gap-2">
                <FiCalendar /> {t.dateRange}
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className={`p-2 rounded border transition ${dark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                  }`}
              >
                <option value="today">{t.today}</option>
                <option value="week">{t.week}</option>
                <option value="month">{t.month}</option>
                <option value="custom">{t.custom}</option>
              </select>
            </div>

            {/* FILTER BUTTON */}
            <div className="flex items-end">
              <button
                onClick={applyFilter}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105"
              >
                <FiFilter /> {t.applyFilter}
              </button>
            </div>
          </div>

          {/* CUSTOM DATE RANGE */}
          {dateRange === "custom" && (
            <div className="grid md:grid-cols-2 gap-4 mt-4 animate-fadeIn">

              <div className="flex flex-col">
                <label className="text-sm mb-1 font-semibold">📅 {t.fromDate}</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className={`p-2 rounded border ${dark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                    }`}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-1 font-semibold">📅 {t.toDate}</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className={`p-2 rounded border ${dark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                    }`}
                />
              </div>

            </div>
          )}
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">

            {/* SALES CARD */}
            <div
              className="relative p-5 rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Icon */}
              <div className="absolute top-3 right-3 opacity-30 text-4xl animate-pulse">
                💰
              </div>

              <h2 className="text-2xl font-bold">₹28,750</h2>
              <p className="text-sm opacity-90 mt-1">{t.sales}</p>

              {/* Bottom highlight */}
              <div className="mt-3 text-xs opacity-80 flex items-center gap-1">
                📈 +12% {t.week}
              </div>
            </div>

            {/* ORDERS CARD */}
            <div
              className="relative p-5 rounded-xl shadow-lg bg-gradient-to-r from-green-500 to-green-700 text-white overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Icon */}
              <div className="absolute top-3 right-3 opacity-30 text-4xl animate-bounce">
                🛒
              </div>

              <h2 className="text-2xl font-bold">248</h2>
              <p className="text-sm opacity-90 mt-1">{t.orders}</p>

              <div className="mt-3 text-xs opacity-80 flex items-center gap-1">
                ⚡ Fast Growth
              </div>
            </div>

          </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* LINE */}
          <div className="p-4 rounded shadow bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PIE */}
          <div className="p-4 rounded shadow bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Product Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={productSales} dataKey="value" cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value}`}
                  outerRadius={80}
                  fill="#8884d8">
                  {productSales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Transaction Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className={dark ? "bg-gray-700" : "bg-gray-200"}>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t.date}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t.transaction}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t.items}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t.amount}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t.payment}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, date: '2024-03-18', txId: 'TXN001', items: 3, amount: 125.50, method: 'Card', status: 'Completed' },
                  { id: 2, date: '2024-03-18', txId: 'TXN002', items: 2, amount: 89.99, method: 'Cash', status: 'Completed' },
                  { id: 3, date: '2024-03-17', txId: 'TXN003', items: 5, amount: 245.75, method: 'Card', status: 'Completed' },
                  { id: 4, date: '2024-03-17', txId: 'TXN004', items: 1, amount: 45.00, method: 'Cash', status: 'Completed' },
                ].map((tx) => (
                  <tr key={tx.id} className="table-row">
                    <td className="px-6 py-4">{tx.date}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{tx.txId}</td>
                    <td className="px-6 py-4">{tx.items}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">₹{tx.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.method === 'Card' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {tx.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-500 text-white rounded"
          >
            Prev
          </button>

          <span>
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            className="px-3 py-1 bg-gray-500 text-white rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}