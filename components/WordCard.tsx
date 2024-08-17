"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface WordCardProps {
  wordData: {
    id: string;
    word: string;
    order: number;
    definitions: string[];
    examples: string[];
    phonetics: string;
  };
}

export function WordCard({ wordData }: WordCardProps) {
  const supabase = createClient();
  const [formData, setFormData] = useState({
    word: wordData.word,
    order: wordData.order,
    definitions: wordData.definitions.join("\n"),
    examples: wordData.examples.join("\n"),
    phonetics: wordData.phonetics || "",
  });

  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const { error } = await supabase
        .from("words")
        .update({
          word: formData.word,
          order: formData.order,
          definitions: formData.definitions
            .split("\n")
            .map((def) => def.trim())
            .filter(Boolean),
          examples: formData.examples
            .split("\n")
            .map((ex) => ex.trim())
            .filter(Boolean),
          phonetics: formData.phonetics,
        })
        .eq("id", wordData.id);
      if (error) {
        console.error("Error updating word", error);
      } else {
        toast(`Word ${wordData.word} updated successfully!`);
      }
    });
  };

  const isFieldEmpty = (value: string | undefined) =>
    !value || value.trim() === "";

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Edit Word: {wordData.word}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="hidden" name="id" value={wordData.id} />
          <div>
            <label
              className="block text-sm font-medium text-foreground flex items-center"
              htmlFor={`word-${wordData.id}`}
            >
              {isFieldEmpty(formData.word) && (
                <span className="inline-block w-2 h-2 bg-yellow-400 dark:bg-yellow-600 rounded-full mr-2" />
              )}
              Word
            </label>
            <Input
              id={`word-${wordData.id}`}
              name="word"
              value={formData.word}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-foreground flex items-center"
              htmlFor={`phonetics-${wordData.id}`}
            >
              {isFieldEmpty(formData.phonetics) && (
                <span className="inline-block w-2 h-2 bg-yellow-400 dark:bg-yellow-600 rounded-full mr-2" />
              )}
              Phonetics
            </label>
            <Input
              id={`phonetics-${wordData.id}`}
              name="phonetics"
              value={formData.phonetics}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-foreground flex items-center"
              htmlFor={`order-${wordData.id}`}
            >
              {isFieldEmpty(formData.order.toString()) && (
                <span className="inline-block w-2 h-2 bg-yellow-400 dark:bg-yellow-600 rounded-full mr-2" />
              )}
              Order
            </label>
            <Input
              id={`order-${wordData.id}`}
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-foreground flex items-center"
              htmlFor={`definitions-${wordData.id}`}
            >
              {isFieldEmpty(formData.definitions) && (
                <span className="inline-block w-2 h-2 bg-yellow-400 dark:bg-yellow-600 rounded-full mr-2" />
              )}
              Definitions (one per line)
            </label>
            <Textarea
              id={`definitions-${wordData.id}`}
              name="definitions"
              value={formData.definitions}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-foreground flex items-center"
              htmlFor={`examples-${wordData.id}`}
            >
              {isFieldEmpty(formData.examples) && (
                <span className="inline-block w-2 h-2 bg-yellow-400 dark:bg-yellow-600 rounded-full mr-2" />
              )}
              Examples (one per line)
            </label>
            <Textarea
              id={`examples-${wordData.id}`}
              name="examples"
              value={formData.examples}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" className="mt-4" disabled={isPending}>
            {isPending ? "Updating..." : "Update Word"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
