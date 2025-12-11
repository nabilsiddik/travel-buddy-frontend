"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { serverFetch } from "@/lib/serverFetch";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  participantId: string; // the user being reviewed
  planId: string;        // travel plan id
}

export default function ReviewModal({
  open,
  onClose,
  participantId,
  planId
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (!rating) return toast.error("Please give a rating.");
    if (!comment.trim()) return toast.error("Please write a review.");

    try {
      setLoading(true);

      const response = await serverFetch.post("/review", {
        method: "POST",
        body: JSON.stringify({
          targetUserId: participantId,
          planId,
          rating,
          comment
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Review submitted successfully!");
        onClose();
      } else {
        toast.error(result.message || "Failed to submit review.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rating Stars */}
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                className={`text-2xl ${
                  index < rating ? "text-yellow-400" : "text-gray-400"
                }`}
                onClick={() => setRating(index + 1)}
              >
                ★
              </button>
            ))}
          </div>

          {/* Comment */}
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
          />

          <Button
            disabled={loading}
            onClick={submitReview}
            className="w-full"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
