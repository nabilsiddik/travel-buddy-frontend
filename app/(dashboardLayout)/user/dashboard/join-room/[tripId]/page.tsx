import getLogedInUser from "@/services/user/userManagement";
import RoomInbox from "./RoomInbox";
import ChatWindow from "@/components/modules/chat/ChatWindow";
import { getParticipantsForSpecificTrip } from "@/services/trip-participant/tripParticipantManagement";
import { getTravelPlanById } from "@/services/travelPlan/travelPlanManagement";
import { getChatRoom } from "@/services/chat-room/chatRoomManagement";
import { getChatMessagesForSpecificRoom } from "@/services/chat-message/chatMessageManagement";

const JoinRoomPage = async ({ params }: { params: { tripId: string } }) => {
  const { tripId } = await params;
  const user = (await getLogedInUser()) || null;

  const participants = await getParticipantsForSpecificTrip(tripId);
  const trip = await getTravelPlanById(tripId);

  const chatRoom = await getChatRoom(tripId);

  const messages = (await getChatMessagesForSpecificRoom(tripId)) || [];

  return (
    <>
      {/* <RoomInbox tripId = {tripId} senderId = {user?.id}/> */}
      <ChatWindow
        trip={trip}
        participants={participants}
        user={user}
        messages={messages}
      />
    </>
  );
};

export default JoinRoomPage;
