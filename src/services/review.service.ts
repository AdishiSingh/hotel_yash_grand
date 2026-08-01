import prisma from "@/lib/prisma";
import { z } from "zod";
import { createReviewSchema } from "@/lib/validations";

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export class ReviewService {
  static async getReviews() {
    return await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async createReview(data: CreateReviewInput) {
    const validated = createReviewSchema.parse(data);

    return await prisma.review.create({
      data: {
        author: validated.author,
        rating: validated.rating,
        comment: validated.comment,
        source: validated.source,
      },
    });
  }

  static async replyToReview(id: string, replyText: string) {
    return await prisma.review.update({
      where: { id },
      data: { reply: replyText },
    });
  }
}
