"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { clientLogger } from "@/lib/client-logger";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  // Initialize logging with user ID
  useEffect(() => {
    if (userId) {
      clientLogger.setUserId(userId);
      clientLogger.logProcessing("agent_component_initialized", {
        userName,
        userId,
        interviewId,
        feedbackId,
        type,
        sessionId: clientLogger.getSessionId(),
      });
    }
  }, [userId, userName, interviewId, feedbackId, type]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      clientLogger.logProcessing("call_started", {
        callStatus: CallStatus.ACTIVE,
      });
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      clientLogger.logProcessing("call_ended", {
        callStatus: CallStatus.FINISHED,
      });
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);

        // Log the message based on role
        if (message.role === "user") {
          clientLogger.logInput(message.transcript, message.role);
        } else if (message.role === "assistant") {
          clientLogger.logOutput(message.transcript, message.role);
        }
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
      clientLogger.logProcessing("speech_started", { isSpeaking: true });
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
      clientLogger.logProcessing("speech_ended", { isSpeaking: false });
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
      clientLogger.logError(error.message, {
        errorType: "vapi_error",
        stack: error.stack,
        callStatus,
      });
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      clientLogger.logProcessing("feedback_generation_started", {
        messagesCount: messages.length,
        interviewId,
        feedbackId,
      });

      try {
        const { success, feedbackId: id } = await createFeedback({
          interviewId: interviewId!,
          userId: userId!,
          transcript: messages,
          feedbackId,
        });

        if (success && id) {
          clientLogger.logProcessing("feedback_generation_success", {
            feedbackId: id,
            redirecting: true,
          });
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          console.log("Error saving feedback");
          clientLogger.logError("feedback_save_failed", {
            success,
            feedbackId: id,
            redirecting: true,
          });
          router.push("/");
        }
      } catch (error) {
        clientLogger.logError("feedback_generation_error", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        router.push("/");
      }
    };
    if (callStatus === CallStatus.FINISHED) {
      clientLogger.logProcessing("call_finished_processing", {
        type,
        messagesCount: messages.length,
        finalMessages: messages,
      });

      if (type === "generate") {
        clientLogger.logProcessing("generate_type_redirect", {
          redirectTo: "/",
        });
        router.push("/");
      } else {
        clientLogger.logProcessing("interview_type_feedback", {
          messagesCount: messages.length,
        });
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    clientLogger.logProcessing("call_initiation_started", {
      type,
      callStatus: CallStatus.CONNECTING,
    });

    try {
      if (type === "generate") {
        clientLogger.logProcessing("starting_generate_workflow", {
          workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
          variableValues: { username: userName, userid: userId },
        });

        await vapi.start(
          undefined,
          undefined,
          undefined,
          process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
          {
            variableValues: {
              username: userName,
              userid: userId,
            },
          }
        );

        clientLogger.logProcessing("generate_workflow_started", {
          success: true,
          sessionId: clientLogger.getSessionId(),
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        clientLogger.logProcessing("starting_interview_workflow", {
          questionsCount: questions?.length || 0,
          formattedQuestions,
        });

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });

        clientLogger.logProcessing("interview_workflow_started", {
          success: true,
          questionsCount: questions?.length || 0,
        });
      }
    } catch (error) {
      clientLogger.logError("call_start_failed", {
        error: error instanceof Error ? error.message : String(error),
        type,
        stack: error instanceof Error ? error.stack : undefined,
      });
      setCallStatus(CallStatus.INACTIVE);
    }
  };
  const handleDisconnect = () => {
    clientLogger.logProcessing("manual_disconnect_initiated", {
      callStatus,
      messagesCount: messages.length,
    });

    setCallStatus(CallStatus.FINISHED);
    vapi.stop();

    clientLogger.logProcessing("manual_disconnect_completed", {
      callStatus: CallStatus.FINISHED,
    });
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
