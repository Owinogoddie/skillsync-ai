'use client'
import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
import { z } from 'zod';
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const createChaptersSchema = z.object({
    title: z.string().min(3).max(100),
    units: z.array(z.object({
        name: z.string().optional(),
        chapterCount: z.number().min(1).max(5).default(3),
    })).min(2).max(5),
});
  
type Input = z.infer<typeof createChaptersSchema>;

export const GenerateCourseForm = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<Input>({
        resolver: zodResolver(createChaptersSchema),
        defaultValues: {
            title: "",
            units: [
                { name: "", chapterCount: 3 },
                { name: "", chapterCount: 3 },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "units",
    });

    async function onSubmit(data: Input) {
        setIsSubmitting(true);
        try {
            if (data.units.some((unit) => unit.chapterCount < 1 || unit.chapterCount > 5)) {
                toast.error("Chapter count must be between 1 and 5 for each unit");
                return;
            }

            const response = await axios.post("/api/generate-courses", data);
            toast.success("Course created successfully");
            router.push(`/dashboard/autogen/${response.data.id}`);
        } catch (error) {
            toast.error("An error occurred while creating the course");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4 space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xl">Course Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter the main topic of the course"
                                        {...field}
                                        className="focus:outline-none focus:ring-0 focus:border-gray-300"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <FormLabel className="text-xl">Units</FormLabel>
                        <FormDescription>Add between 2 and 5 units. You can optionally name each unit.</FormDescription>
                        
                        <AnimatePresence>
                            {fields.map((field, index) => (
                                <motion.div
                                    key={field.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{
                                        opacity: { duration: 0.2 },
                                        height: { duration: 0.2 },
                                    }}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name={`units.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unit {index + 1} Name (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter unit name"
                                                        {...field}
                                                        className="focus:outline-none focus:ring-0 focus:border-gray-300"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`units.${index}.chapterCount`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Number of Chapters</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                        min={1}
                                                        max={5}
                                                        className="focus:outline-none focus:ring-0 focus:border-gray-300"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => append({ name: "", chapterCount: 3 })}
                                disabled={fields.length >= 5}
                            >
                                Add Unit <Plus className="w-4 h-4 ml-2 text-green-500" />
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => remove(fields.length - 1)}
                                disabled={fields.length <= 2}
                            >
                                Remove Unit <Trash className="w-4 h-4 ml-2 text-red-500" />
                            </Button>
                        </div>
                    </div>

                    <Button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full"
                        size="lg"
                    >
                        Generate Course!
                    </Button>
                </form>
            </Form>
        </div>
    );
}