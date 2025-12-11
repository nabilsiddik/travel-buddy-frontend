"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { serverFetch } from "@/lib/serverFetch";
import { usePathname } from "next/navigation";

interface JoinRequestCardProps {
    request: any;
}

export default function JoinRequestCard({ request }: JoinRequestCardProps) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(request.status);

    const pathName = usePathname()

    // handle action
    const handleAction = async (endpoint: string, newStatus?: string) => {
        try {
            setLoading(true);

            const res = await serverFetch.post(`/join-request/${endpoint}`, {
                body: JSON.stringify({ requestId: request?.id }),
                headers: { "Content-Type": "application/json" },
            });

            const result = await res.json();

            if (result.success && endpoint === 'accept') {
                toast.success('Request Accepted.')
                if (newStatus) setStatus(newStatus);
            } else if (result.success && endpoint === 'reject') {
                toast.error('Request Rejected.')
                if (newStatus) setStatus(newStatus);
            }
            else if (result.success && endpoint === 'cancel') {
                toast.error('Request Canceled.')
                if (newStatus) setStatus(newStatus);
            }
            else {
                toast.error('Something went wrong.')
            }


        } catch (err: any) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };



    // Complete participant action
    const handleComplete = async () => {
        try {
            setLoading(true);

            const participantId = request?.participants?.[0]?.id;

            if (!participantId) {
                toast.error("No participant found for this request.");
                return;
            }

            const res = await serverFetch.post("/participant/complete", {
                body: JSON.stringify({ participantId }),
                headers: { "Content-Type": "application/json" },
            });

            const result = await res.json();

            console.log(result, 'par res')
            if (result.success) {
                toast.success("Travel marked as completed!");
                setStatus("COMPLETED");
            } else {
                toast.error(result.message || "Failed to complete travel.");
            }
        } catch (err: any) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm border rounded-xl">
            {!pathName.startsWith('/user/dashboard/join-requests-sent') &&
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Image
                            src={request.requester?.profileImage || "/placeholder.png"}
                            alt="User"
                            width={45}
                            height={45}
                            className="rounded-full"
                        />
                        <div>
                            <p className="font-semibold">{request.requester?.name}</p>
                            <p className="text-sm text-gray-500">{request.requester?.email}</p>
                        </div>
                    </CardTitle>
                </CardHeader>
            }

            <CardContent className="space-y-3">

                {/* Status */}
                <Badge
                    variant={
                        status === "PENDING"
                            ? "secondary"
                            : status === "ACCEPTED"
                                ? "default"
                                : "destructive"
                    }
                >
                    {status}
                </Badge>

                {/* Travel Plan Info */}
                <div className="text-sm text-gray-700">
                    <p>
                        <span className="font-semibold">Destination:</span>{" "}
                        {request.plan?.destination}
                    </p>
                    <p>
                        <span className="font-semibold">Start:</span>{" "}
                        {new Date(request.plan?.startDate).toDateString()}
                    </p>
                    <p>
                        <span className="font-semibold">End:</span>{" "}
                        {new Date(request.plan?.endDate).toDateString()}
                    </p>
                </div>

                {/* Buttons */}
                {status === "PENDING" && !pathName.startsWith('/user/dashboard/join-requests-sent') && (
                    <div className="flex flex-col gap-2 pt-2">
                        <Button
                            className="w-full"
                            disabled={loading}
                            onClick={() => handleAction("accept", "ACCEPTED")}
                        >
                            Accept
                        </Button>

                        <Button
                            className="w-full"
                            variant="destructive"
                            disabled={loading}
                            onClick={() => handleAction("reject", "REJECTED")}
                        >
                            Reject
                        </Button>
                    </div>
                )}


                {status === "ACCEPTED" && (
                    <div className="flex flex-col gap-2 pt-2">
                        <Button className="w-full" variant="outline" disabled={loading} onClick={handleComplete}>
                            Mark as Completed
                        </Button>
                    </div>
                )}


                {!pathName.startsWith('/user/dashboard/join-requests-sent') &&
                    <Link href={`/traveler-profile/${request?.requester?.id}`}>
                        <Button variant="outline" className="w-full mt-1">
                            View Profile
                        </Button>
                    </Link>
                }

                {pathName.startsWith('/user/dashboard/join-requests-sent') &&
                    <Button
                        className="w-full"
                        disabled={request?.status === 'CANCELLED'}
                        onClick={() => handleAction("cancel", "CANCELLED")}
                    >
                        Cancel
                    </Button>
                }

            </CardContent>
        </Card>
    );
}
