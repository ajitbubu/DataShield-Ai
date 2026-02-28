import { Metadata } from "next";
import { Container } from "@/components/container";
import { FeedbackBoard } from "@/components/feedback-board";
import { SectionHeader } from "@/components/section-header";

export const metadata: Metadata = {
  title: "Feedback Board",
  description: "Share your privacy operations pain points and vote on the issues that matter most."
};

export default function FeedbackPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeader
          badge="User Feedback"
          description="Submit pain points and upvote the most urgent operational problems."
          title="Privacy Pain Point Board"
        />
        <FeedbackBoard />
      </Container>
    </section>
  );
}
