import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function DELETE() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    await prisma.$transaction(async (tx) => {
      await tx.like.deleteMany({ where: { userId } });
      await tx.comment.deleteMany({ where: { userId } });
      await tx.savedPost.deleteMany({ where: { userId } });
      await tx.follow.deleteMany({
        where: { OR: [{ followerId: userId }, { followingId: userId }] },
      });
      await tx.story.deleteMany({ where: { userId } });
      await tx.notification.deleteMany({ where: { userId } });
      await tx.postHashtag.deleteMany({ where: { post: { userId } } });
      await tx.post.deleteMany({ where: { userId } });
      await tx.conversationParticipant.deleteMany({ where: { userId } });
      await tx.closeFriend.deleteMany({
        where: { OR: [{ userId }, { closeFriendId: userId }] },
      });
      await tx.block.deleteMany({
        where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
      });
      await tx.session.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });
      await tx.notificationPreference.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
