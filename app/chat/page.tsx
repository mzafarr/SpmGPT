"use client";
import { useState } from "react";
import axios from "axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { AiOutlineSend } from "react-icons/ai";
import ChatMessages from "./ChatMessages";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<Array<[string, string]>>([]);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [temperature, setTemperature] = useState(0);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [isPending, setIsPending] = useState(false);

  const askQuestion = async () => {
    setHistory((hist) => [...hist, ["user", question]]);
    setIsPending(true);
    const response = await axios.post("http://localhost:8000/chat/", {
      model,
      question,
      history,
      temperature,
      max_tokens: maxTokens,
    });
    setHistory(response.data.history);
    console.log(response.data);

    setQuestion("");
    setIsPending(false);
  };

  return (
    <div className="min-h-screen w-full pt-8 flex flex-col text-black bg-slate-50 text-sm sm:text-base">
      <div className="flex flex-col justify-center items-center flex-1 gap-5 h-full">
        {/* Chat */}
        <Card className="p-5 max-w-3xl w-full min-h-full flex-1 mb-24 bg-white">
          <ChatMessages
            history={history}
            setHistory={setHistory}
            askQuestion={askQuestion}
            isPending={isPending}
            question={question}
            setQuestion={setQuestion}
          />
          <Card className="bg-white fixed left-1/2 w-full max-w-3xl rounded-b-none -translate-x-1/2 bottom-0 px-5 py-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isPending && question != "") askQuestion();
              }}
              className="w-full flex items-center justify-center gap-2"
            >
              <input
                autoFocus
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-2 border border-slate-300 outline-none rounded"
                placeholder="Enter your question here..."
              />
              <Button
                className="p-2.5 sm:px-4 max-w-[70px]  border border-slate-300 bg-slate-700 hover:bg-slate-800"
                type="submit"
                isLoading={isPending}
              >
                {isPending ? (
                 <p className="px-1"> Thinking... </p>
                ) : (
                  <AiOutlineSend color={"white"} size={20} />
                )}
              </Button>
            </form>
          </Card>
        </Card>
      </div>
    </div>
  );
}
