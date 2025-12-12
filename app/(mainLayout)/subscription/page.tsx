// Subscription.tsx (SERVER COMPONENT)
import SubscriptionButton from "@/components/shared/SubscriptionButton";
import { getCookie } from "@/services/auth/tokenHandler";

export async function handleSubscription(planType: "monthly" | "yearly") {
  "use server";

  const accessToken = await getCookie("accessToken");
  console.log(planType)

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/subscription/create-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ plan: planType }),
    }
  );

  const data = await res.json();

  console.log(data)

  return data;
}

const Subscription = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SubscriptionButton action={handleSubscription} />
    </div>
  );
};

export default Subscription;
