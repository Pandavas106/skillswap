import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "./key";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const BATCH_SIZE = 5; // Number of questions to generate at once

// Function to store completed test
const storeCompletedTest = (testData) => {
  const completedTests = JSON.parse(localStorage.getItem('completedTests') || '[]');
  completedTests.push(testData);
  localStorage.setItem('completedTests', JSON.stringify(completedTests));
};

export default function TestingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, description, level, estimatedTime, questionCount } = location.state || {};

  // Add validation and default values
  if (!location.state) {
    return (
      <div className="flex justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>No test data provided. Please start from the test selection page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Validate required fields
  if (!title || !description || !level || !estimatedTime || !questionCount) {
    return (
      <div className="flex justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Missing required test information. Please ensure all fields are provided.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Missing fields:
              <ul className="list-disc pl-5 mt-2">
                {!title && <li>Title</li>}
                {!description && <li>Description</li>}
                {!level && <li>Level</li>}
                {!estimatedTime && <li>Estimated Time</li>}
                {!questionCount && <li>Question Count</li>}
              </ul>
            </div>
            <Button
              className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questionCount).fill(null));
  const [showScore, setShowScore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQuestionsBatch = async (_startIndex: number, count: number) => {
    console.log('Starting question generation...');
    const prompt = `Generate ${count} ${level} multiple-choice questions for a test titled "${title}".\n${description}\nEach question must have:\n- A question string\n- 4 options labeled A, B, C, and D\n- A correct option key\n- A short explanation\n\nRespond in this JSON format:\n[\n  {\n    \"question\": \"string\",\n    \"options\": {\n      \"A\": \"string\",\n      \"B\": \"string\",\n      \"C\": \"string\",\n      \"D\": \"string\"\n    },\n    \"correct\": \"A\",\n    \"explanation\": \"string\"\n  }\n]`;
    
    try {
      console.log('Calling Gemini API...');
      if (!GEMINI_API_KEY) {
        throw new Error('API key is missing');
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Add timeout to the API call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API call timed out after 30 seconds')), 30000);
      });

      const apiCallPromise = model.generateContent(prompt);
      const result = await Promise.race([apiCallPromise, timeoutPromise]) as { response: { text: () => Promise<string> } };
      
      if (!result || !result.response) {
        throw new Error('Invalid API response');
      }

      const text = await result.response.text();
      console.log('API Response received');
      
      if (!text) {
        throw new Error('Empty response from API');
      }

      const match = text.match(/\[\s*{[\s\S]*}\s*]/);
      if (!match) {
        console.error('No JSON array found in response:', text);
        throw new Error('Invalid response format from API');
      }

      const parsed = JSON.parse(match[0]);
      console.log('Successfully parsed questions');
      
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('No questions generated');
      }

      return parsed;
    } catch (err) {
      console.error('Error in generateQuestionsBatch:', err);
      throw err;
    }
  };

  const fetchQuestions = async () => {
    setStarted(true);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting fetchQuestions with count:', questionCount);
      if (!questionCount) {
        throw new Error('Question count is not defined');
      }

      const allQuestions = [];
      const BATCH_SIZE = Math.min(3, questionCount); // Reduced batch size for testing
      const batches = Math.ceil(questionCount / BATCH_SIZE);
      
      for (let i = 0; i < batches; i++) {
        console.log(`Processing batch ${i + 1} of ${batches}`);
        const remainingQuestions = questionCount - allQuestions.length;
        const currentBatchSize = Math.min(BATCH_SIZE, remainingQuestions);
        
        try {
          const batchQuestions = await generateQuestionsBatch(i * BATCH_SIZE, currentBatchSize);
          console.log(`Received ${batchQuestions.length} questions for batch ${i + 1}`);
          allQuestions.push(...batchQuestions);
          setQuestions([...allQuestions]);
        } catch (batchError) {
          console.error(`Error in batch ${i + 1}:`, batchError);
          throw batchError;
        }
      }
    } catch (err) {
      console.error('Error in fetchQuestions:', err);
      setError(`Failed to generate questions: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectOption = (opt: string) => {
    const updated = [...answers];
    updated[current] = opt;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(curr => curr + 1);
    } else {
      setShowScore(true);
    }
  };

  const handleCompleteTest = () => {
    const score = questions.length > 0
      ? answers.reduce((acc, ans, idx) => ans === questions[idx]?.correct ? acc + 1 : acc, 0)
      : 0;
    
    const scorePercentage = Math.round((score / questions.length) * 100);
    
    // Determine badge based on score
    let badge = "Beginner";
    if (scorePercentage >= 90) {
      badge = "Expert";
    } else if (scorePercentage >= 70) {
      badge = "Proficient";
    } else if (scorePercentage >= 50) {
      badge = "Intermediate";
    }

    const completedTestData = {
      id: Date.now(), // Unique ID
      title: title,
      description: description,
      score: scorePercentage,
      completedOn: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      badge: badge
    };

    storeCompletedTest(completedTestData);
    navigate('/test', { state: { activeTab: 'completed' } });
  };

  if (!started) {
    return (
      <div className="flex justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-4">
              <span>Questions: {questionCount}</span>
              <span>Time: {estimatedTime}</span>
              <span>Level: {level}</span>
            </div>
            <Button
              className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
              onClick={fetchQuestions}
              disabled={isLoading}
            >
              {isLoading ? 'Generating Questions...' : 'Start Test'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || questions.length === 0) {
    return (
      <div className="flex justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Generating Questions</CardTitle>
            <CardDescription>Please wait while we prepare your test...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Progress value={((questions.length / questionCount) * 100)} className="h-2" />
              <motion.div
                className="absolute top-0 left-0 h-2 bg-[#9b87f5]"
                initial={{ width: "0%" }}
                animate={{ width: `${(questions.length / questionCount) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-center space-y-2">
              <p>Generated {questions.length} of {questionCount} questions</p>
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#9b87f5]"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
            <motion.div
              className="text-center text-sm text-muted-foreground"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              Using AI to create engaging questions...
            </motion.div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
              onClick={fetchQuestions}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="flex justify-center p-6">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>Your Score</CardTitle>
            <CardDescription>
              You scored {answers.filter((answer, i) => answer === questions[i].correct).length} out of {questions.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {questions.map((q, idx) => (
              <div key={idx} className="text-left mb-4">
                <div className="font-semibold">Q{idx+1}. {q.question}</div>
                <div>Your answer: {answers[idx]}</div>
                <div>Correct: {q.correct}</div>
                <div className="text-sm text-muted-foreground">{q.explanation}</div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Retake Test
            </Button>
            <Button 
              onClick={handleCompleteTest}
              className="flex-1 bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
            >
              Complete Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const q = questions[current] || {};

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Q{current + 1}. {q.question}</CardTitle>
            <span className="text-sm">{current + 1}/{questions.length}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {q.options && Object.entries(q.options).map(([key, opt]) => (
              <motion.div
                key={key}
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectOption(key)}
                className={`border rounded p-4 cursor-pointer transition 
                  ${answers[current] === key ? 'bg-[#9b87f5]/20 border-[#9b87f5]' : 'hover:bg-gray-100'}`}
              >
                <span className="font-bold mr-2">{key}.</span>{String(opt)}
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            disabled={answers[current] === null}
            onClick={handleNext}
          >
            {current < questions.length - 1 ? 'Next' : 'Submit'}
          </Button>
        </CardFooter>
        <Progress value={((current + 1) / questions.length) * 100} className="h-2 mt-2" />
      </Card>
    </div>
  );
}
