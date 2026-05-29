import { useState } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"

function App() {

  const [features, setFeatures] = useState("")
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  const predictFraud = async () => {

    try {

      const values = features
        .split(",")
        .map(Number)

      const response =
        await axios.post(
          "https://ai-fraud-system-exn5.onrender.com/predict",
          {
            features: values
          }
        )

      setResult(
        response.data
      )

      setHistory(prev => [

        {
          prediction:
            response.data.prediction,

          fraud:
            (
              response.data
                .fraud_probability * 100
            ).toFixed(2),

          time:
            new Date()
              .toLocaleTimeString(),

        },

        ...prev

      ])

    } catch (error) {

      console.log(error)

      alert(
        "Prediction Failed"
      )

    }

  }

  const data = [
    {
      name: "Safe",
      value: 284315,
    },
    {
      name: "Fraud",
      value: 492,
    },
  ]

  const COLORS = [
    "#22c55e",
    "#ef4444",
  ]

  const downloadReport = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("AI Fraud Detection Report", 14, 15)
    
    doc.setFontSize(12)
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 25)
    
    if (result) {
      doc.text(`Prediction: ${result.prediction === 1 ? "🚨 Fraud" : "✅ Safe"}`, 14, 35)
      doc.text(`Fraud Probability: ${(result.fraud_probability * 100).toFixed(2)}%`, 14, 45)
      doc.text(`Safe Probability: ${(result.safe_probability * 100).toFixed(2)}%`, 14, 55)
    }
    
    if (history.length > 0) {
      const tableData = history.map(item => [
        item.prediction === 1 ? "🚨 Fraud" : "✅ Safe",
        `${item.fraud}%`,
        item.time,
      ])
      
      autoTable(doc, {
        head: [["Result", "Fraud %", "Time"]],
        body: tableData,
        startY: 65,
      })
    }
    
    doc.save("fraud_detection_report.pdf")
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      <nav className="bg-slate-900 border-b border-slate-800 p-5">

        <h1 className="text-3xl font-bold text-sky-400">
          🛡️ AI Fraud Detection
        </h1>

      </nav>

      <div className="text-center py-12">

        <h1 className="text-6xl font-bold text-sky-400">
          AI Fraud Detection
        </h1>

        <p className="text-slate-400 text-xl mt-4">
          Real-Time Risk Analytics Dashboard
        </p>

      </div>

      <div className="grid md:grid-cols-4 gap-6 px-10">

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-slate-400">
            Total Transactions
          </h2>

          <p className="text-4xl font-bold text-sky-400 mt-3">
            284,807
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-slate-400">
            Fraud Cases
          </h2>

          <p className="text-4xl font-bold text-red-400 mt-3">
            492
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-slate-400">
            Fraud Rate
          </h2>

          <p className="text-4xl font-bold text-yellow-400 mt-3">
            0.17%
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-slate-400">
            Model Accuracy
          </h2>

          <p className="text-4xl font-bold text-green-400 mt-3">
            92.3%
          </p>
        </div>

      </div>

      <div className="p-10">

        <div className="bg-slate-900 rounded-2xl p-8">

          <h2 className="text-3xl font-bold text-sky-400 mb-6">
            Predict Transaction Risk
          </h2>

          <input
            type="text"
            value={features}
            onChange={(e) =>
              setFeatures(
                e.target.value
              )
            }
            placeholder="Enter 30 values separated by commas"
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
          />

          <button
            onClick={predictFraud}
            className="mt-5 bg-sky-500 hover:bg-sky-600 px-8 py-3 rounded-xl font-semibold"
          >
            Predict Fraud
          </button>

          <button
            onClick={downloadReport}
            className="mt-4 ml-4 bg-green-500 hover:bg-green-600 px-8 py-3 rounded-xl font-semibold"
          >
            Download PDF
          </button>

          {
            result && (

              <div className="mt-6 bg-slate-800 p-5 rounded-xl">

                <h2 className="text-2xl font-bold">

                  {
                    result.prediction === 1
                      ? "🚨 Fraud Transaction"
                      : "✅ Safe Transaction"
                  }

                </h2>

                <p className="mt-3 text-red-400">
                  Fraud Probability:
                  {" "}
                  {
                    (
                      result.fraud_probability
                      * 100
                    ).toFixed(2)
                  }%
                </p>

                <p className="mt-2 text-green-400">
                  Safe Probability:
                  {" "}
                  {
                    (
                      result.safe_probability
                      * 100
                    ).toFixed(2)
                  }%
                </p>

              </div>

            )
          }

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-8 px-10 pb-10">

        <div className="bg-slate-900 p-6 rounded-2xl">

          <h2 className="text-2xl font-bold text-sky-400 mb-4">
            Fraud Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={data}
                dataKey="value"
                outerRadius={100}
                label
              >

                {
                  data.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />

                    )
                  )
                }

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">

          <h2 className="text-2xl font-bold text-sky-400 mb-4">
            Current Risk Score
          </h2>

          <div className="flex justify-center items-center h-[300px]">

            <div className="relative">

              <div className="w-48 h-48 rounded-full border-8 border-slate-700 flex items-center justify-center">

                <div className="text-center">

                  <h1
                    className={`text-5xl font-bold ${
                      result?.prediction === 1
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {
                      result
                        ? `${(
                            result.fraud_probability * 100
                          ).toFixed(0)}%`
                        : "0%"
                    }
                  </h1>

                  <p className="text-slate-400 mt-2">

                    {
                      result
                        ? result.prediction === 1
                          ? "Fraud"
                          : "Safe"
                        : "Waiting"
                    }

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="px-10 pb-10">

        <div className="bg-slate-900 p-6 rounded-2xl">

          <h2 className="text-2xl font-bold text-sky-400 mb-4">
            Transaction History
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-700">

                  <th className="text-left py-3">
                    Result
                  </th>

                  <th className="text-left py-3">
                    Fraud %
                  </th>

                  <th className="text-left py-3">
                    Time
                  </th>

                </tr>

              </thead>

              <tbody>

                {
                  history.map(
                    (item, index) => (

                      <tr
                        key={index}
                        className="border-b border-slate-800 hover:bg-slate-800 transition"
                      >

                        <td className="py-3">

                          {
                            item.prediction === 1
                              ? "🚨 Fraud"
                              : "✅ Safe"
                          }

                        </td>

                        <td className="py-3">

                          {item.fraud}%

                        </td>

                        <td className="py-3">

                          {item.time}

                        </td>

                      </tr>

                    )
                  )
                }

              </tbody>

            </table>

          </div>

        </div>

        <div className="bg-slate-900 p-6 rounded-2xl mt-8">

          <h2 className="text-2xl font-bold text-sky-400 mb-4">
            Fraud Trend Analysis
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart
              width={900}
              height={300}
              data={history}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="fraud"
                stroke="#ef4444"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  )

}

export default App
