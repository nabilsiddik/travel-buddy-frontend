"use client";

import { Button } from "../ui/button";

const SubscriptionButton = ({ action }: { action: any }) => {
  const onClick = async () => {
    const result = await action("monthly");

    if (result?.success) {
      window.location.href = result.data.url;
    }
  };

  return <Button onClick={onClick}>Monthly</Button>;
};

export default SubscriptionButton;
