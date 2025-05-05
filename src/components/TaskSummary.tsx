import React from "react";

type TaskSummaryProps = {
  completed: number;
  pending: number;
  overdue: number;
};

const TaskSummary: React.FC<TaskSummaryProps> = ({ completed, pending, overdue }) => {
  return (
    <section className="p-6 bg-blue-50 rounded-lg shadow-md" aria-label="Task summary">
      <h2 className="text-2xl font-semibold mb-4">Task Summary</h2>
      <ul className="space-y-2">
        <li className="text-lg"><span className="font-medium">Completed:</span> {completed}</li>
        <li className="text-lg"><span className="font-medium">Pending:</span> {pending}</li>
        <li className="text-lg"><span className="font-medium">Overdue:</span> {overdue}</li>
      </ul>
    </section>
  );
};

export default TaskSummary; 