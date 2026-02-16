import { shortText } from "@/utils/shortText";
import Image from "next/image";

export default function ChatHeader({
  participants,
  trip,
}: {
  participants: any;
  trip: any;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-2">
      <div className="flex items-center gap-3">
        <div
          className="h-15 w-15 rounded-full"
          style={{
            backgroundImage: `url(${trip?.planImages[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div>
          <h3 className="font-semibold text-gray-700">
            {shortText(trip?.title, 50)}
          </h3>
          {/* <p className="text-xs text-green-500">Active now</p> */}
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-600">Trip Mates: </span>
            <div className="h-8 w-8 rounded-full flex items-center gap-1">
              {participants?.length > 0 &&
                participants?.map((participant: any) => {
                  return (
                    <Image
                      src={participant?.user?.profileImage}
                      width={60}
                      height={60}
                      alt="chat friend profile picture"
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
