import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Contract details
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
const ABI = [/* Insert your ABI here */];

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskText, setTaskText] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  // Connect to MetaMask & setup contract
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    const _provider = new ethers.BrowserProvider(window.ethereum);
    const _signer = await _provider.getSigner();
    const _contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, _signer);

    setProvider(_provider);
    setSigner(_signer);
    setContract(_contract);
  };

  // Fetch tasks from contract
  const getTasks = async () => {
    if (!contract) return;
    const myTasks = await contract.getMyTask();
    setTasks(myTasks);
  };

  // Add task
  const addTask = async () => {
    if (!taskTitle.trim() || !taskText.trim()) return;

    const tx = await contract.addTask(taskText, taskTitle, false);
    await tx.wait(); // Wait for confirmation

    getTasks(); // Refresh tasks
    setTaskTitle("");
    setTaskText("");
  };

  // Delete task
  const deleteTask = async (taskId) => {
    const tx = await contract.deleteTask(taskId);
    await tx.wait();

    getTasks();
  };

  // Fetch tasks on load if contract is set
  useEffect(() => {
    if (contract) getTasks();
  }, [contract]);

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Decentralized Task Manager</h2>

      <button onClick={connectWallet}>Connect Wallet</button>

      <input
        type="text"
        placeholder="Task Title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "5px" }}
      />

      <input
        type="text"
        placeholder="Task Text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
      />

      <button onClick={addTask} style={{ marginBottom: "10px" }}>Add Task</button>

      <ul style={{ padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ listStyle: "none", marginBottom: "10px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
            <strong>{task.taskTitle}</strong>: {task.taskText}
            {task.isDeleted ? (
              <span style={{ color: "red", marginLeft: "10px" }}>Deleted</span>
            ) : (
              <button onClick={() => deleteTask(task.id)} style={{ marginLeft: "10px", background: "red", color: "white", border: "none", padding: "5px", cursor: "pointer" }}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;