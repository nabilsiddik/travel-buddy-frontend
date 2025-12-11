"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { serverFetch } from "@/lib/serverFetch";
import { toast } from "sonner";
import ReviewModal from "./ParticipentReviewModal";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

export default function ParticipantsList({ joinedPlans }: { joinedPlans: any[] }) {
    const [selected, setSelected] = useState<any | null>(null);

    const markCompleted = async (participantId: string) => {
        try {
            const res = await serverFetch.post("/participant/complete", {
                body: JSON.stringify({ participantId }),
                headers: { "Content-Type": "application/json" }
            });

            const result = await res.json();

            if (result.success) {
                toast.success("Marked as completed!");
                window.location.reload();
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Something went wrong.");
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedPlans.map(plan =>
                plan.participants.map((p: any) => {
                    const tripEnded = new Date(plan.endDate) < new Date();

                    return (
                        <Card key={p.id} className="rounded-xl shadow-sm border">
                            <CardHeader>
                                <CardTitle>{plan.destination}</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">
                                <p><strong>Traveler:</strong> {p.user?.name}</p>
                                <p><strong>Email:</strong> {p.user?.email}</p>
                                <p><strong>Status:</strong> {p.status}</p>
                                <p><strong>Trip Ended:</strong>
                                    {tripEnded ? "Yes" : "No"}
                                </p>

                                {p.status !== "COMPLETED" && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                className="w-full mt-3"
                                            >
                                                {tripEnded ? "Mark as Completed" : "Trip not ended"}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure to complete.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    <Button disabled={!tripEnded}
                                                onClick={() => markCompleted(p.id)}>Yes</Button>
                                                </AlertDialogCancel>
                                                <AlertDialogAction>
                                                    No
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                )}

                                {p.status === "COMPLETED" && (
                                    <Button
                                        className="w-full mt-3"
                                        variant="secondary"
                                        onClick={() => setSelected({ plan, participant: p })}
                                    >
                                        Review Traveler
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    );
                })
            )}

            {selected && (
                <ReviewModal
                    open
                    onClose={() => setSelected(null)}
                    participantId={selected.participant.id}
                    planId={selected.plan.id}
                />
            )}
        </div>
    );
}
