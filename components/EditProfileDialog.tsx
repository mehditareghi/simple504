"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function EditProfileDialog({ userInfo, onSave }) {
  const [formData, setFormData] = useState({
    first_name: userInfo.first_name || "",
    last_name: userInfo.last_name || "",
    username: userInfo.username || "",
    birthdate: userInfo.birthdate ? new Date(userInfo.birthdate) : undefined,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, birthdate: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      birthdate: formData.birthdate
        ? format(formData.birthdate, "yyyy-MM-dd")
        : null,
    };
    onSave(formattedData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Your Profile</DialogTitle>
        <DialogDescription>
          Update your account details below.
        </DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Birthdate
            </label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between",
                    !formData.birthdate && "text-muted-foreground",
                  )}
                >
                  {formData.birthdate
                    ? format(formData.birthdate, "yyyy-MM-dd")
                    : "Pick a date"}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.birthdate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-end mt-6">
            <Button type="submit" variant="default">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
