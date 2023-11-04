"use client";
import { cn } from "../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { FC, Ref, forwardRef, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import logo from "../../public/word.png";
import Image from "next/image";
interface ChatMessagesProps {
  history: Array<[string, string]>;
  setHistory: any;
  askQuestion: any;
  isPending: boolean;
  question: string;
  setQuestion: any;
}
const exampleQuestions = [
  `Ciri-ciri negara berdaulat?`,
  `Apakah maksud "supernuus"?`,
  `Cipta kertas soalan peperiksaan pra-SPM 2023.`,
  `Bolehkah anda cipta kertas soalan SPM Sejarah 2022?`,
  `Ciri-ciri utama Perlembagaan Persekutuan?`,
  `Tugas-tugas Ahli Majlis Gerakan Negara?`,
  `KBAT: Sebagai rakyat yang patriotik, apakah yang akan lakukan sekiranya negara kita diserang oleh komunis`,
  `Apakah maksud "KEJORA"?`,
  `Siapakah pelancar Dasar Pembangunan dan bilakah ia dilancarkan?`,
  `Apakah maksud "nakhoda" dalam bahasa Cina?`,
  `Bagaimanakah cara memahami perkembangan nasionalisme di Asia?`,
];
let randomExampleQuestions: string[] = [];
for (let i = 0; i < 4; ) {
  let rand = Math.floor(Math.random() * exampleQuestions.length);
  if (randomExampleQuestions.indexOf(exampleQuestions[rand]) === -1) {
    randomExampleQuestions.push(exampleQuestions[rand]);
    i++;
  }
}

const ChatMessages: FC<ChatMessagesProps> = ({
  history,
  setHistory,
  askQuestion,
  isPending,
  question,
  setQuestion,
}) => {
  const lastChatRef = useRef<HTMLDivElement | null>(null);

  const handleQuestionClick = (ques: string) => {
    setQuestion(ques);
    if (!isPending && question !== "") {
      askQuestion();
    }
  };

  useEffect(() => {
    lastChatRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [history]);

  return (
    <div className="text-black overflow-hidden flex flex-col gap-5 scrollbar scroll-smooth">
      {history.length === 0 ? (
        <div className="text-center opacity-90 min-h-[75vh] flex flex-col justify-between items-center relative">
          <Image
            className="rounded-full absolute top-1/4 sm:top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            src={logo}
            alt="Logo"
            width={200}
            height={200}
          />
          <p className="opacity-80">When Education meets AI</p>
          <div className="flex flex-wrap">
            {randomExampleQuestions.map((ques, idx) => (
              <div
                key={idx}
                className="opacity-80 hover:bg-slate-200 px-4 py-2 rounded-md cursor-pointer border border-slate-300 m-2 w-full sm:w-[47%]"
                onClick={() => {
                  handleQuestionClick(ques);
                }}
              >
                {ques}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {history.map(([speaker, text], idx) => {
            if (idx % 2 === 0)
              return (
                <ChatMessage
                  ref={idx === history.length - 1 ? lastChatRef : null}
                  key={idx}
                  speaker={speaker}
                  text={text}
                />
              );
            else {
              return (
                <ChatMessage
                  ref={idx === history.length - 1 ? lastChatRef : null}
                  key={idx}
                  speaker={speaker}
                  text={text}
                  left
                />
              );
            }
          })}
        </AnimatePresence>
      )}
    </div>
  );
};

const ChatMessage = forwardRef(
  (
    {
      speaker,
      text,
      left = false,
    }: {
      speaker: string;
      text: string;
      left?: boolean;
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref as Ref<HTMLDivElement>}
        initial={{ y: -24, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
        exit={{ y: -24, opacity: 0 }}
        className={cn(
          "py-3 px-3 rounded-lg border border-slate-300 flex flex-col max-w-4xl overflow-hidden scroll-pt-32",
          left ? "self-start mr-20" : "self-end ml-20"
        )}
      >
        <span className={cn("capitalize text-xs")}>{speaker}</span>
        <>
          <ReactMarkdown
            // remarkRehypeOptions={{}}
            className="prose dark:prose-invert"
          >
            {text}
          </ReactMarkdown>
        </>
      </motion.div>
    );
  }
);

ChatMessage.displayName = "ChatMessage";

export default ChatMessages;
