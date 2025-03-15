"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Comment {
  id: number
  author: {
    name: string
    avatar?: string
    initials: string
  }
  content: string
  createdAt: string
}

export function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: { name: "John Doe", initials: "JD" },
      content: "This looks good to me. Ready for review.",
      createdAt: "2 hours ago",
    },
    {
      id: 2,
      author: { name: "Jane Smith", initials: "JS" },
      content: "I've made the requested changes. Please check and let me know if anything else is needed.",
      createdAt: "1 hour ago",
    },
  ])
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        author: { name: "Current User", initials: "CU" },
        content: newComment,
        createdAt: "Just now",
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[#3A3A3A]">Comments</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <Avatar className="h-8 w-8">
              {comment.author.avatar && <AvatarImage src={comment.author.avatar} alt={comment.author.name} />}
              <AvatarFallback>{comment.author.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-[#3A3A3A]">{comment.author.name}</span>
                <span className="text-sm text-gray-500">{comment.createdAt}</span>
              </div>
              <p className="mt-1 text-[#3A3A3A]">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={handleAddComment} className="mt-2 bg-[#C74634] hover:bg-[#b03d2e]">
          Add Comment
        </Button>
      </div>
    </div>
  )
}

