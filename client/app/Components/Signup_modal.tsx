'use client';

import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";


export default function signupPage() {
  async function handleSubmit() {
    
  }
  return (
    // <form action="http://localhost:4000/signup" method="POST">
    //   <div>
    //     <label htmlFor="name">Username</label>
    //     <input type="text" name="name" />
    //   </div>
    //   <div>
    //     <label htmlFor="pwd">Password</label>
    //     <input type="password" name="pwd" />
    //   </div>
    //   <button>Signup</button>
    // </form>

    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign up</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create an account</DialogTitle>
          <DialogDescription>
            Enter your details to get started
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="bachduy" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@email.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>

          <Button type="submit" className="w-full" >
             Sign up
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
