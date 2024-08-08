"use client";

import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addDocument } from "@/lib/elasticsearch";
import Swal from 'sweetalert2'

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  content: z.string().min(2, {
    message: "Content must be at least 2 characters.",
  }),
});

export default function AddDocument() {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [placeholder, setPlaceholder] = useState("Add Content");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

	const created_at = new Date().toISOString()

	// add document to elasticsearch
	const response = await addDocument({
	  ...values,
	  created_at,
	  updated_at: created_at, // set updated_at to created_at
	});
	console.log("es response", response)
	if(response.result !== "created") {
	  Swal.fire({
		icon: "error",
		title: "Error adding document",
		text: "There was an error adding the document to the knowledge base.",
	  });
	  return
	}
	Swal.fire({
		icon: "success",
		title: "Document added successfully!",
		text: "Your document has been added to the knowledge base.",
	  });

	// clear form
	form.reset()
  }

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder,
    }),
    [placeholder]
  );

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormDescription>
                  This is the title of the document.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormDescription>
                  This is the description of the document.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <JoditEditor
                    ref={editor}
                    value={field.value}
                    config={config}
                    onBlur={(newContent) => field.onChange(newContent)}
                    // onChange={(newContent) => field.onChange(newContent)}
                  />
                </FormControl>
                <FormDescription>
                  This is the content of the document.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
