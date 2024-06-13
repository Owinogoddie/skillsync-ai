'use client'
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react'
import { z } from 'zod';
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const createChaptersSchema = z.object({
    title: z.string().min(3).max(100),
    units: z.array(z.string()),
});
  
type Input = z.infer<typeof createChaptersSchema>;

export const GenerateCourseForm = () => {
    const router = useRouter();
    const form = useForm<Input>({
        resolver: zodResolver(createChaptersSchema),
        defaultValues: {
            title: "",
            units: ["", "", ""],
        },
    });

    const isLoading = form.formState.isSubmitting;

    async function onSubmit(data: Input) {
        if (data.units.some((unit) => unit === "")) {
            toast.error("Some fields are empty");
            return;
        }
        if (data.units.length < 1) {
            toast.error("Please add a unit");
            return;
        }

        const response = await axios.post("/api/generate-courses", data);
        toast.success("Course created successfully");
        router.push(`/dashboard/autogen/${response.data.id}`);
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                                <FormLabel className="flex-[1] text-xl">Title</FormLabel>
                                <FormControl className="flex-[6]">
                                    <Input
                                        placeholder="Enter the main topic of the course"
                                        {...field}
                                        className="focus:outline-none focus:ring-0 focus:border-gray-300"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <AnimatePresence>
                        {form.watch("units").map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                    opacity: { duration: 0.2 },
                                    height: { duration: 0.2 },
                                }}
                            >
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={`units.${index}`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                                            <FormLabel className="flex-[1] text-xl">Unit {index + 1}</FormLabel>
                                            <FormControl className="flex-[6]">
                                                <Input
                                                    placeholder="Enter subtopic of the course"
                                                    {...field}
                                                    className="focus:outline-none focus:ring-0 focus:border-gray-300"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <div className="flex items-center justify-center mt-4">
                        <div className="flex-[1]" />
                        <div className="mx-4">
                            <Button
                                type="button"
                                variant="secondary"
                                className="font-semibold"
                                onClick={() => form.setValue("units", [...form.watch("units"), ""])}
                            >
                                Add Unit
                                <Plus className="w-4 h-4 ml-2 text-green-500" />
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                className="font-semibold ml-2"
                                onClick={() => form.setValue("units", form.watch("units").slice(0, -1))}
                            >
                                Remove Unit
                                <Trash className="w-4 h-4 ml-2 text-red-500" />
                            </Button>
                        </div>
                        <div className="flex-[1]" />
                    </div>

                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="w-full mx-auto mt-6"
                        size="lg"
                    >
                        Generate Course!
                    </Button>
                </form>
            </Form>
        </div>
    );
}
