"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { serverFetch } from "@/lib/serverFetch";
import { Badge } from "@/components/ui/badge";

export default function ParticipantCard({ participant, plan }: any) {
    console.log({
        participant,
        plan
    })
    const [status, setStatus] = useState(participant?.status);
    const [loading, setLoading] = useState(false);

    const handleComplete = async () => {
        try {
            setLoading(true);

            const res = await serverFetch.post("/participant/complete", {
                body: JSON.stringify({ participantId: participant.id }),
                headers: { "Content-Type": "application/json" },
            });

            const result = await res.json();
            if (result.success) {
                toast.success("Marked as completed!");
                setStatus("COMPLETED");
            } else {
                toast.error(result.message);
            }
        } catch (e) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm border rounded-xl overflow-hidden">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                    <Image
                        src={participant.user?.profileImage || "/placeholder.png"}
                        alt="User"
                        width={50}
                        height={50}
                        className="rounded-full"
                    />
                    <div>
                        <p className="font-semibold">{participant.user.name}</p>
                        <p className="text-sm text-gray-500">{participant.user.email}</p>
                    </div>
                </div>

                <Badge
                    variant={
                        status === "PENDING"
                            ? "secondary"
                            : status === "COMPLETED"
                                ? "default"
                                : "outline"
                    }
                >
                    {status}
                </Badge>

                {status !== "COMPLETED" && (
                    <Button
                        disabled={loading}
                        onClick={handleComplete}
                        className="w-full mt-2"
                    >
                        Mark as Completed
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
