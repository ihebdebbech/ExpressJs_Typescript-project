import { PrismaClient } from '@prisma/client';

const Comment = new PrismaClient().comment;

 export async function createComment(userId:number,content: string, postId: number) {
    return await Comment.create({
      data: {
        userId,
        content,
        postId,
        
      },
    });
  }

 export async function getComments(postId: number) {
    return await Comment.findMany({
      where: { postId: Number(postId) },
      orderBy: { createdAt: 'asc' }, // Order by creation date
    });
  }

