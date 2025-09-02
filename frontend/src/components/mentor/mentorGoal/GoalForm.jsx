import React, { useState, useEffect } from "react";
import { Target, Save, Edit3 } from "lucide-react";

const GoalForm = ({ goal, onGoalUpdate, showToast }) => {
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (goal && goal.monthlyGoal) {
      setMonthlyGoal(goal.monthlyGoal.toString());
    }
  }, [goal]);

  const handleSubmit = async () => {
    if (!monthlyGoal || monthlyGoal <= 0) {
      showToast("Please enter a valid monthly goal amount", "error");
      return;
    }

    setIsLoading(true);
    try {
      await onGoalUpdate(monthlyGoal);
    } catch (error) {
      console.error("Error updating goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
      setMonthlyGoal(value);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl">
            <Edit3 className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {goal && goal.monthlyGoal ? "Update Goal" : "Set Monthly Goal"}
            </h3>
            <p className="text-gray-300">
              {goal && goal.monthlyGoal
                ? "Modify your current monthly earning target"
                : "Set your monthly earning target to start tracking progress"}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="monthlyGoal"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Monthly Goal Amount (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-lg">₹</span>
              </div>
              <input
                type="number"
                id="monthlyGoal"
                value={monthlyGoal}
                onChange={handleInputChange}
                placeholder="Enter your monthly goal"
                min="0"
                step="100"
                className="w-full pl-8 pr-4 py-3 bg-slate-700/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Recommended range: ₹1,000 - ₹50,000 based on your experience level
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-300 mb-3">
              Quick Select:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[2000, 5000, 10000, 15000, 25000, 35000, 50000, 75000].map(
                (amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setMonthlyGoal(amount.toString())}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      monthlyGoal === amount.toString()
                        ? "bg-gradient-to-r from-cyan-500 to-teal-600 border-cyan-400 text-white"
                        : "bg-slate-700/50 border-white/10 text-gray-300 hover:bg-slate-700 hover:border-white/20"
                    }`}
                  >
                    ₹{amount.toLocaleString()}
                  </button>
                )
              )}
            </div>
          </div>

          {goal &&
            goal.monthlyGoal &&
            monthlyGoal &&
            monthlyGoal !== goal.monthlyGoal.toString() && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-white/10">
                <h4 className="text-sm font-medium text-gray-300 mb-3">
                  Goal Comparison
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-300">
                      ₹{goal.monthlyGoal.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Current Goal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-cyan-400">
                      ₹{parseInt(monthlyGoal).toLocaleString()}
                    </div>
                    <div className="text-sm text-cyan-300">New Goal</div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span
                    className={`text-sm font-medium ${
                      parseInt(monthlyGoal) > goal.monthlyGoal
                        ? "text-green-400"
                        : parseInt(monthlyGoal) < goal.monthlyGoal
                        ? "text-orange-400"
                        : "text-gray-400"
                    }`}
                  >
                    {parseInt(monthlyGoal) > goal.monthlyGoal
                      ? `+₹${(
                          parseInt(monthlyGoal) - goal.monthlyGoal
                        ).toLocaleString()} increase`
                      : parseInt(monthlyGoal) < goal.monthlyGoal
                      ? `-₹${(
                          goal.monthlyGoal - parseInt(monthlyGoal)
                        ).toLocaleString()} decrease`
                      : "No change"}
                  </span>
                </div>
              </div>
            )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !monthlyGoal}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>
                    {goal && goal.monthlyGoal ? "Update Goal" : "Set Goal"}
                  </span>
                </>
              )}
            </button>

            {goal && goal.monthlyGoal && (
              <button
                type="button"
                onClick={() => setMonthlyGoal(goal.monthlyGoal.toString())}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-xl font-semibold transition-all border border-white/10 hover:border-white/20"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-xl">
          <h4 className="font-bold text-blue-300 mb-2">💡 Goal Setting Tips</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>
              • Set realistic goals based on your current mentoring capacity
            </li>
            <li>• Consider seasonal variations in demand</li>
            <li>• Review and adjust your goal monthly based on performance</li>
            <li>
              • Break down your goal into weekly targets for better tracking
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoalForm;
