import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MoodAnalytics() {
  const { t, i18n } = useTranslation();
  const [viewType, setViewType] = useState("weekly");
  const reportRef = useRef(null);

  const isWeekly = viewType === "weekly";

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const weeklyLineData = [
    { name: "Mon", MoodScore: 4 }, { name: "Tue", MoodScore: 3 },
    { name: "Wed", MoodScore: 5 }, { name: "Thu", MoodScore: 2 },
    { name: "Fri", MoodScore: 4 }, { name: "Sat", MoodScore: 5 },
    { name: "Sun", MoodScore: 4 },
  ];

  const monthlyLineData = [
    { name: "Wk 1", MoodScore: 3.8 }, { name: "Wk 2", MoodScore: 4.2 },
    { name: "Wk 3", MoodScore: 3.5 }, { name: "Wk 4", MoodScore: 4.5 },
  ];

  const weeklyPieData = [
    { name: t("emotions.happy"), value: 4, color: "#10B981" },
    { name: t("emotions.calm"), value: 2, color: "#3B82F6" },
    { name: t("emotions.anxious"), value: 1, color: "#F59E0B" },
    { name: t("emotions.sad"), value: 0, color: "#EF4444" },
  ];

  const lineData = isWeekly ? weeklyLineData : monthlyLineData;
  const pieData = weeklyPieData;

  const exportToPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`mood-report-${viewType}.pdf`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
          <p className="text-sm text-gray-500">{t("subtitle")}</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Language Toggle Dropdown */}
          <select 
            value={i18n.language ? i18n.language.split('-')[0] : 'en'} 
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-white border border-gray-200 text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm text-gray-700"
          >
            <option value="en">English (EN)</option>
            <option value="hi">हिन्दी (HI)</option>
          </select>

          <div className="bg-gray-100 p-1 rounded-lg flex items-center shadow-inner">
            <button
              onClick={() => setViewType("weekly")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                isWeekly ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t("weekly")}
            </button>
            <button
              onClick={() => setViewType("monthly")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                !isWeekly ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t("monthly")}
            </button>
          </div>

          <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            {t("exportPdf")}
          </button>
        </div>
      </div>

      <div ref={reportRef} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            {isWeekly ? t("weekly") : t("monthly")} {t("summarySuffix")}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-gray-100 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{t("lineChartTitle")}</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                  <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} stroke="#9CA3AF" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #E5E7EB" }}
                    formatter={(value) => [`${t("moodScore")}: ${value}`]}
                  />
                  <Line type="monotone" dataKey="MoodScore" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-gray-100 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("pieChartTitle")}</h3>
            </div>
            <div className="h-56 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ${t("daysUnit")}`, t("frequency")]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
                  <span>{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
