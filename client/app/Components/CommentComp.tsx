import { Comment, Comment as CommentType } from "../Type/Comment";

type Props = {
  comment: Comment;
};

export default function CommentComp({ comment }: Props) {
  return (
    <div
      key={comment.id}
      className="rounded-xl border p-4 shadow-sm space-y-1 bg-gray-200"
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-md">{comment.username}</span>
        <span className="text-xs text-muted-foreground">
          at {new Date(comment.created_at).toLocaleString()}
        </span>
      </div>

      <p className="text-sm wrap-break-word">{comment.content}</p>
    </div>
  );
}
