"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ParticipantsList({ joinedPlans }: { joinedPlans: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {joinedPlans.map((plan) =>
        plan.participants.map((p: any) => (
          <Card key={p.id} className="shadow-sm rounded-xl border">
            <CardHeader>
              <CardTitle className="text-lg">
                {plan.destination}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <p><strong>Traveler:</strong> {p.user?.name || "Unknown User"}</p>
              <p><strong>Status:</strong> {p.status}</p>
              <p><strong>Joined:</strong> {new Date(p.joinedAt).toDateString()}</p>
              <p><strong>Trip Dates:</strong> 
                {new Date(plan.startDate).toDateString()} → {new Date(plan.endDate).toDateString()}
              </p>

              {/* Actions */}
              <div className="pt-3">
                {p.status === "COMPLETED" ? (
                  <Button 
                    className="w-full"
                    variant="secondary"
                    onClick={() => setSelected({ plan, participant: p })}
                  >
                    Review Traveler
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    Not Completed Yet
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Review modal */}
      {/* {selected && (
        <ReviewModal
          open
          onClose={() => setSelected(null)}
          participantId={selected.participant.id}
          hostId={selected.plan.userId}  
          planId={selected.plan.id}
        />
      )} */}
    </div>
  );
}
