import { useState } from 'react'
import React from 'react'
import abi from "./Abi.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskText, setTaskText] = useState("");
  const [retrieveTask, setRetrievedTask] = useState("");
  const contractAddress = "0xAF18FAeE77D71307c7dA8bB7825Eb3E8C0aA135D";

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const getTasks = async () => {
    if (!contract) return;
    const myTasks = await contract.getMyTask();
    setTasks(myTasks);
  };


  async function addTask() {
    if(typeof window.ethereum !== undefined){
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const myContract = new ethers.Contract(contractAddress, abi, signer);

      try{
        if (!taskTitle.trim() || !taskText.trim()) return;
        const tx = await myContract.addTask(taskText, taskTitle, false)
        const receipt = tx.wait();

        getTasks(); // Refresh tasks
        setTaskTitle("");
        setTaskText("");

        toast.success("🎉 task added!", {
          position: "top-right",
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }catch(error){
        console.log("failed", error);
        toast.error("❌ failed! Please try again.", {
          position: "top-right",
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  }

  const deleteTask = async (taskId) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const myContract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await myContract.deleteTask(taskId);
    await tx.wait();

    getTasks();
  };


  return (
    <>
      <div>
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
        <button onClick={deleteTask} >Delete Task</button>
        <button onClick={getMyTask} >Get My Task</button>
      </div>
    </>
  )
}

export default App
