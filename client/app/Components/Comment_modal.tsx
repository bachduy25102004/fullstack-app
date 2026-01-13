import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

export default function CommentModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg p-0">
        <div className="flex flex-col h-[70vh]">
          <div className="border-b p-4 font-semibold">Comments</div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3"></div>

          <div className="border-t p-4">
            <Textarea placeholder="Write a comment…" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
