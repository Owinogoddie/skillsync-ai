"use client";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHotkeys } from "@/hooks/use-hot-keys";
import { cn } from "@/lib/utils";
import * as React from "react";
import { CheckIcon } from "./icons/check";
import { Kbd } from "./kbd";

type Item = {
    value: string;
    label: string;
};

const items = [
    { label: "Accounting", value: "301d1f2e-17fb-4d9d-b53c-5d9f487b7d5d" },
    { label: "Big Data", value: "f3dd513e-f607-4711-b694-232f702d3591" },
    { label: "Computer Science", value: "9a0bd43a-6190-4722-98f7-a0d391e6a429" },
    { label: "Engineering", value: "1502f78a-310e-4fef-aacd-304e21dea6cd" },
    { label: "Filming", value: "1a7de258-41e1-4490-be3b-6a62a09a2d8f" },
    { label: "Fitness", value: "a2a925bd-b935-49cf-8526-e173e9d7f7ff" },
    { label: "Law", value: "74c39774-8f9a-47bf-b685-a0d9dd0e7a12" },
    { label: "Music", value: "2004a475-e850-433c-8a51-6fa49362e378" },
    { label: "Photography", value: "ffad1287-fe43-40fd-9793-e40c56713dd8" },
] as const;

export const LinearCombobox = () => {
    const [openPopover, setOpenPopover] = React.useState(false);
    const [openTooltip, setOpenTooltip] = React.useState(false);

    const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);

    const [searchValue, setSearchValue] = React.useState("");

    const isSearching = searchValue.length > 0;

    useHotkeys([
        [
            "p",
            () => {
                setOpenTooltip(false);
                setOpenPopover(true);
            },
        ],
    ]);

    return (
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <Tooltip
                delayDuration={500}
                open={openTooltip}
                onOpenChange={setOpenTooltip}
            >
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <Button
                            aria-label="Select item"
                            variant="ghost"
                            size="sm"
                            className="w-fit px-2 h-8 text-[0.8125rem] leading-normal font-medium text-primary"
                        >
                            {selectedItem ? (
                                <>
                                    {selectedItem.label}
                                </>
                            ) : (
                                <>
                                    Select item
                                </>
                            )}
                        </Button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent
                    hideWhenDetached
                    side="bottom"
                    align="start"
                    sideOffset={6}
                    className="flex items-center gap-2 bg-background border text-xs px-2 h-8"
                >
                    <span className="text-primary">Change item</span>
                    <Kbd />
                </TooltipContent>
            </Tooltip>
            <PopoverContent
                className="w-[206px] p-0 rounded-lg"
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
                sideOffset={6}
            >
                <Command className="rounded-lg">
                    <CommandInput
                        value={searchValue}
                        onValueChange={(searchValue) => {
                            setSearchValue(searchValue);
                        }}
                        className="text-[0.8125rem] leading-normal"
                        placeholder="Search items..."
                    />
                    <CommandList>
                        <CommandGroup>
                            {items
                                .filter(item =>
                                    item.label.toLowerCase().includes(searchValue.toLowerCase())
                                )
                                .map((item, index) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.value}
                                        onSelect={(value) => {
                                            setSelectedItem(
                                                items.find((i) => i.value === value) || null
                                            );
                                            setOpenTooltip(false);
                                            setOpenPopover(false);
                                            setSearchValue("");
                                        }}
                                        className="group rounded-md flex justify-between items-center w-full text-[0.8125rem] leading-normal text-primary"
                                    >
                                        <div className="flex items-center">
                                            <span>{item.label}</span>
                                        </div>
                                        <div className="flex items-center">
                                            {selectedItem?.value === item.value && (
                                                <CheckIcon
                                                    title="Check"
                                                    className="mr-3 size-4 fill-muted-foreground group-hover:fill-primary"
                                                />
                                            )}
                                            {!isSearching && <span className="text-xs">{index}</span>}
                                        </div>
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
