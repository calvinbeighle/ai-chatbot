import type { UseChatHelpers } from "@ai-sdk/react";
import { ArrowDownIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMessages } from "@/hooks/use-messages";
import type { Vote } from "@/lib/db/schema";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "./data-stream-provider";
import { Greeting } from "./greeting";
import { PreviewMessage, ThinkingMessage } from "./message";

type MessagesProps = {
  addToolApprovalResponse: UseChatHelpers<ChatMessage>["addToolApprovalResponse"];
  chatId: string;
  status: UseChatHelpers<ChatMessage>["status"];
  votes: Vote[] | undefined;
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  isArtifactVisible: boolean;
  selectedModelId: string;
  onLogoVisibilityChange?: (visible: boolean) => void;
};

function PureMessages({
  addToolApprovalResponse,
  chatId,
  status,
  votes,
  messages,
  setMessages,
  regenerate,
  isReadonly,
  selectedModelId: _selectedModelId,
  onLogoVisibilityChange,
}: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    isAtBottom,
    scrollToBottom,
    hasSentMessage,
  } = useMessages({
    status,
  });

  useDataStream();

  const logoRef = useRef<HTMLDivElement>(null);
  const messagesWrapperRef = useRef<HTMLDivElement>(null);
  const [isLogoVisible, setIsLogoVisible] = useState(true);

  // Intersection Observer to detect when messages overlap the logo
  const checkLogoVisibility = useCallback(() => {
    if (!logoRef.current || !messagesWrapperRef.current) return;

    const logoRect = logoRef.current.getBoundingClientRect();
    const messageElements =
      messagesWrapperRef.current.querySelectorAll("[data-message]");

    let hasOverlap = false;

    messageElements.forEach((el) => {
      const msgRect = el.getBoundingClientRect();
      // Check if message overlaps with logo area
      const overlaps = !(
        msgRect.right < logoRect.left ||
        msgRect.left > logoRect.right ||
        msgRect.bottom < logoRect.top ||
        msgRect.top > logoRect.bottom
      );
      if (overlaps) {
        hasOverlap = true;
      }
    });

    setIsLogoVisible(!hasOverlap);
  }, []);

  // Check visibility on scroll and when messages change
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    checkLogoVisibility();

    container.addEventListener("scroll", checkLogoVisibility);
    return () => container.removeEventListener("scroll", checkLogoVisibility);
  }, [checkLogoVisibility, messagesContainerRef]);

  // Also check when messages array changes
  useEffect(() => {
    checkLogoVisibility();
  }, [messages, checkLogoVisibility]);

  // Notify parent of logo visibility changes
  useEffect(() => {
    onLogoVisibilityChange?.(isLogoVisible);
  }, [isLogoVisible, onLogoVisibilityChange]);

  return (
    <div className="relative flex-1">
      {/* Centered background logo */}
      <div
        ref={logoRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: isLogoVisible ? 0.12 : 0 }}
        aria-hidden="true"
      >
        <img
          src="/images/LogoILike.png"
          alt=""
          className="h-auto max-h-[60vh] w-auto max-w-[60vw] object-contain"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(68%) sepia(75%) saturate(800%) hue-rotate(190deg) brightness(105%) contrast(95%)",
          }}
        />
      </div>
      <div
        className="absolute inset-0 touch-pan-y overflow-y-auto"
        ref={messagesContainerRef}
      >
        <div
          ref={messagesWrapperRef}
          className="mx-auto flex min-w-0 max-w-4xl flex-col gap-4 px-2 py-4 md:gap-6 md:px-4"
        >
          {messages.length === 0 && <Greeting />}

          {messages.map((message, index) => (
            <div key={message.id} data-message>
              <PreviewMessage
                addToolApprovalResponse={addToolApprovalResponse}
                chatId={chatId}
                isLoading={
                  status === "streaming" && messages.length - 1 === index
                }
                isReadonly={isReadonly}
                message={message}
                regenerate={regenerate}
                requiresScrollPadding={
                  hasSentMessage && index === messages.length - 1
                }
                setMessages={setMessages}
                vote={
                  votes
                    ? votes.find((vote) => vote.messageId === message.id)
                    : undefined
                }
              />
            </div>
          ))}

          {status === "submitted" &&
            !messages.some((msg) =>
              msg.parts?.some(
                (part) =>
                  "state" in part && part.state === "approval-responded",
              ),
            ) && <ThinkingMessage />}

          <div
            className="min-h-[24px] min-w-[24px] shrink-0"
            ref={messagesEndRef}
          />
        </div>
      </div>

      <button
        aria-label="Scroll to bottom"
        className={`absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border bg-background p-2 shadow-lg transition-all hover:bg-muted ${
          isAtBottom
            ? "pointer-events-none scale-0 opacity-0"
            : "pointer-events-auto scale-100 opacity-100"
        }`}
        onClick={() => scrollToBottom("smooth")}
        type="button"
      >
        <ArrowDownIcon className="size-4" />
      </button>
    </div>
  );
}

export const Messages = PureMessages;
