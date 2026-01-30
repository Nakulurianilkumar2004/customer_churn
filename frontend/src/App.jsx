import { useState } from "react";
import { predictCustomer } from "./api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./App.css"; // Regular CSS

const App = () => {
  const [age, setAge] = useState("");
  const [salary, setSalary] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const response = await predictCustomer({
        age: Number(age),
        salary: Number(salary),
      });

      setResult(response.data.result);

      // Chart data
      setChartData([
        { name: "Buy", value: response.data.prediction === 1 ? 1 : 0 },
        { name: "Not Buy", value: response.data.prediction === 0 ? 1 : 0 },
      ]);
    } catch (error) {
      setResult("Error connecting to backend");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2>Customer Purchase Prediction</h2>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
          <button type="submit">{loading ? "Predicting..." : "Predict"}</button>
        </form>

        {result && (
          <div className="result-section">
            <h3>Result: {result}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
