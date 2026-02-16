import IconList from "@/components/shared/IconList";
import { formatVideoUrl } from "@/utils/formatVideoUrl";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TripDescription from "./TripDescription";
import JoinTripCard from "@/components/shared/cards/JoinTripCard";
import TripMetaIconList from "@/components/shared/TripMetaIconList";
import { getUserParticipationForTrip } from "@/services/trip-participant/tripParticipantManagement";

const TripDetails = async ({
  trip,
  participants,
  logedInUser,
}: {
  trip: any;
  participants: any;
  logedInUser: any;
}) => {
  const includesHalfLength = Math.ceil(trip?.includes?.length / 2);
  const userParticipation = await getUserParticipationForTrip(trip?.id);

  return (
    <section className="mt-[63px]">
      <div
        style={{
          backgroundImage: `url(${trip?.planImages[0]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full h-[500px]"
      ></div>

      <div className="max-w-7xl mx-auto px-5 my-10 flex gap-10">
        <div className="flex flex-col gap-3 flex-4">
          <h2 className="font-bold md:text-3xl text-2xl text-gray-700">
            {trip?.title}
          </h2>
          <div className="flex items-center gap-2 font-medium">
            <span>Hosted by</span>
            <span>
              <Image
                className="rounded-rull"
                src={trip?.user?.profileImage}
                width={50}
                height={50}
                alt="host profile"
              />
            </span>
            <Link target="_blank" href={`/traveler-profile/${trip?.user?.id}`}>
              <span className="font-bold text-black underline">{`${trip?.user?.firstName} ${trip?.user?.lastName}`}</span>
            </Link>
            {/* <Button variant={'outline'} className="py-5 px-8">
                            Ask A Question
                        </Button> */}
          </div>

          {/* trip meta data icon list  */}
          <TripMetaIconList trip={trip} />

          {/* join trip for small devices  */}
          <JoinTripCard
            trip={trip}
            className="block lg:hidden"
            participants={participants}
            logedInUser={logedInUser}
            userParticipation={userParticipation}
          />

          {/* description  */}
          <TripDescription description={trip?.description} />

          {/* included  */}
          <div className="mt-3 p-5 border rounded-lg">
            <h3 className="font-bold text-xl">What's included:</h3>

            <div className="mt-2 flex gap-10">
              <div className="flex flex-col gap-1">
                {trip?.includes?.length > 0 &&
                  trip?.includes
                    ?.slice(0, includesHalfLength)
                    ?.map((item: any, index: number) => {
                      return (
                        <IconList
                          key={index}
                          icon={<Check width={18} />}
                          text={item}
                        />
                      );
                    })}
              </div>
              <div className="flex flex-col gap-1">
                {trip?.includes?.length > 0 &&
                  trip?.includes
                    ?.slice(includesHalfLength, trip?.includes?.length)
                    ?.map((item: any, index: number) => {
                      return (
                        <IconList
                          key={index}
                          icon={<Check width={18} />}
                          text={item}
                        />
                      );
                    })}
              </div>
            </div>
          </div>

          {/* trip highlights video  */}
          {trip?.videoUrl && (
            <div className="mt-3 p-5 border rounded-lg">
              <h3 className="font-bold text-xl mb-4">Trip Highlights Video:</h3>

              <div>
                <iframe
                  className="rounded-lg"
                  width="100%"
                  height="415"
                  src={formatVideoUrl(trip?.videoUrl)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Join trip  */}
        <JoinTripCard
          trip={trip}
          className="hidden lg:block"
          participants={participants}
          logedInUser={logedInUser}
          userParticipation={userParticipation}
        />
      </div>
    </section>
  );
};

export default TripDetails;
