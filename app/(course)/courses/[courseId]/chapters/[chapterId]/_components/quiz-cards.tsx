"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Chapter, Question } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  chapter: Chapter & {
    questions: Question[];
  };
};

const QuizCards = ({ chapter }: Props) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [questionState, setQuestionState] = React.useState<Record<string, boolean | null>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const checkAnswer = React.useCallback(() => {
    const newQuestionState: Record<string, boolean | null> = {};
    chapter.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (!userAnswer) {
        newQuestionState[question.id] = null;
      } else if (userAnswer === question.answer) {
        newQuestionState[question.id] = true;
      } else {
        newQuestionState[question.id] = false;
      }
    });
    setQuestionState(newQuestionState);
  }, [answers, chapter.questions]);

  if (!isMounted) {
    return null; // Return null or a loading indicator
  }

  return (
    <div className="flex-1 mt-16 ml-8">
      <h1 className="text-3xl font-bold">Concept Check</h1>
      <div className="mt-4 space-y-4">
        {chapter.questions.map((question) => {
          const options = JSON.parse(question.options) as string[];
          return (
            <div
              key={question.id}
              className={cn("p-4 border rounded-lg transition-all duration-300", {
                "bg-green-100 border-green-500": questionState[question.id] === true,
                "bg-red-100 border-red-500": questionState[question.id] === false,
                "bg-gray-100 border-gray-300": questionState[question.id] === null,
              })}
            >
              <h2 className="text-xl font-semibold">{question.question}</h2>
              <div className="mt-2">
                <RadioGroup
                  onValueChange={(e) => {
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: e,
                    }));
                  }}
                >
                  {options.map((option, index) => (
                    <div className="flex items-center space-x-2" key={index}>
                      <RadioGroupItem
                        value={option}
                        id={`${question.id}-${index}`}
                      />
                      <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              {questionState[question.id] === false && (
                <div className="mt-2">
                  <p className="text-red-600">
                    Correct Answer: <span className="font-bold">{question.answer}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Button className="w-full mt-4" size="lg" onClick={checkAnswer}>
        Check Answer
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default QuizCards;
