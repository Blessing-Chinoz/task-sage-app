import React from "react";
import TodoApp from "./components/Todo";
import OfflineIndicator from "./OfflineIndicator";

function App() {
  return (
    <div>
      <TodoApp />
      <OfflineIndicator />
    </div>
  );
}

export default App;
