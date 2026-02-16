import MessageBubble from "./MessageBubble";

export default function MessageList({
  messages,
  typingUsers,
}: {
  messages: any;
  typingUsers: any;
}) {
  console.log(typingUsers, "users");

  return (
    <div className="relative flex-1 px-6 py-14">
      <div className="overflow-y-auto space-y-4">
        {messages.map((msg: any) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {typingUsers?.length > 0 && (
        <div className="absolute left-8 bottom-3">
          <span className="font-bold text-black">
            {typingUsers?.join(",")} is typing...
          </span>
        </div>
      )}
    </div>
  );
}
