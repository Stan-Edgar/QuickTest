import React, { useState } from 'react';
import './index.css';

// Main App component
const App = () => {
    // State to store the Google Forms URL input by the user
    const [formUrl, setFormUrl] = useState('');
    // State to manage loading status during the "extraction" process
    const [isLoading, setIsLoading] = useState(false);
    // State to store the extracted questions (simulated API response)
    const [extractedQuestions, setExtractedQuestions] = useState(null);
    // State to store any error messages
    const [error, setError] = useState('');

    // Function to handle changes in the input field
    const handleUrlChange = (event) => {
        setFormUrl(event.target.value);
        setError(''); // Clear any previous errors when the URL changes
        setExtractedQuestions(null); // Clear previous results
    };

    // Function to "simulate" extracting questions
    const extractQuestions = async () => {
        setError(''); // Clear previous errors
        setExtractedQuestions(null); // Clear previous questions
        setIsLoading(true); // Set loading state to true

        // Basic validation for the Google Forms URL
        if (!formUrl.includes('docs.google.com/forms/d/e/')) {
            setError('Please enter a valid Google Forms URL.');
            setIsLoading(false);
            return;
        }

        // Extract the form ID from the URL (this is how a real API call would identify the form)
        const formIdMatch = formUrl.match(/forms\/d\/e\/([a-zA-Z0-9_-]+)/);
        if (!formIdMatch || !formIdMatch[1]) {
            setError('Could not extract form ID from the URL. Please check the URL format.');
            setIsLoading(false);
            return;
        }
        const formId = formIdMatch[1];

        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate 1.5 seconds loading

        // --- SIMULATED GOOGLE FORMS API RESPONSE ---
        // In a real application, you would make a fetch request to your backend server,
        // which would then securely call the Google Forms API (forms.get method).
        // The API response would be a JSON object describing the form's structure.
        // For this demo, we're hardcoding a typical response structure.

        try {
            // This is a mock response demonstrating the structure you'd get from the Forms API
            // The 'items' array contains the form's questions and other elements.
            const simulatedApiResponse = {
                formId: formId,
                info: {
                    title: "Simulated Event Registration Form",
                    documentTitle: "Event Registration"
                },
                items: [
                    {
                        itemId: "question1",
                        questionItem: {
                            question: {
                                questionId: "q1",
                                textQuestion: {
                                    paragraph: true // Indicates a long answer text field
                                },
                                required: true
                            },
                            title: "What is your full name?"
                        }
                    },
                    {
                        itemId: "question2",
                        questionItem: {
                            question: {
                                questionId: "q2",
                                textQuestion: {
                                    paragraph: false // Indicates a short answer text field
                                },
                                required: true
                            },
                            title: "What is your email address?"
                        }
                    },
                    {
                        itemId: "question3",
                        questionItem: {
                            question: {
                                questionId: "q3",
                                choiceQuestion: {
                                    type: "RADIO", // Multiple choice (radio buttons)
                                    options: [
                                        { value: "Option A" },
                                        { value: "Option B" },
                                        { value: "Option C" }
                                    ]
                                },
                                required: true
                            },
                            title: "Which session are you interested in?"
                        }
                    },
                    {
                        itemId: "question4",
                        questionItem: {
                            question: {
                                questionId: "q4",
                                choiceQuestion: {
                                    type: "CHECKBOX", // Checkbox question
                                    options: [
                                        { value: "Dietary Restriction 1" },
                                        { value: "Dietary Restriction 2" },
                                        { value: "None" }
                                    ]
                                },
                                required: false
                            },
                            title: "Do you have any dietary restrictions?"
                        }
                    },
                    {
                        itemId: "question5",
                        questionItem: {
                            question: {
                                questionId: "q5",
                                scaleQuestion: { // Linear scale question
                                    low: 1,
                                    high: 5
                                },
                                required: true
                            },
                            title: "How would you rate your interest in the event (1-5)?"
                        }
                    },
                    {
                        itemId: "section1", // Example of a section header
                        pageBreakItem: {}, // Represents a page break or section
                        title: "Contact Information"
                    },
                    {
                        itemId: "question6",
                        questionItem: {
                            question: {
                                questionId: "q6",
                                dateQuestion: { // Date question
                                    includeTime: false
                                },
                                required: false
                            },
                            title: "Preferred Event Date"
                        }
                    }
                ]
            };

            // Filter out non-question items (like page breaks or sections) if needed for display
            const questionsOnly = simulatedApiResponse.items.filter(item => item.questionItem);
            setExtractedQuestions(questionsOnly);

        } catch (err) {
            setError('Failed to simulate API response. Check console for details.');
            console.error("Simulated API error:", err);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <>
        

            <div className="app-container">
                <div className="card">
                    <h1 className="title">
                        Google Forms Question Extractor Demo
                    </h1>
                    <p className="subtitle">
                        Enter a public Google Forms URL below to see how an app could extract its questions.
                        <br />
                        <strong>
                            (This is a simulation; a real app would require a backend for secure API calls.)
                        </strong>
                    </p>

                    <div className="input-group">
                        <input
                            type="text"
                            value={formUrl}
                            onChange={handleUrlChange}
                            placeholder="e.g., https://docs.google.com/forms/d/e/1FAIpQLSc..."
                            className="input-field"
                        />
                        <button
                            onClick={extractQuestions}
                            disabled={isLoading}
                            className="action-button"
                        >
                            {isLoading ? 'Extracting...' : 'Extract Questions'}
                        </button>
                    </div>

                    {error && (
                        <div className="error-message" role="alert">
                            <strong>Error:</strong>
                            <span style={{ marginLeft: '0.5rem' }}>{error}</span>
                        </div>
                    )}

                    {extractedQuestions && (
                        <div className="extracted-content">
                            <h2>Extracted Questions:</h2>
                            <ul className="question-list">
                                {extractedQuestions.length > 0 ? (
                                    extractedQuestions.map((item, index) => (
                                        <li key={index} className="question-item">
                                            <p className="question-title">
                                                {item.questionItem.title}
                                            </p>
                                            <p className="question-type">
                                                Type: {item.questionItem.question.textQuestion ? 'Text' :
                                                       item.questionItem.question.choiceQuestion?.type === 'RADIO' ? 'Multiple Choice' :
                                                       item.questionItem.question.choiceQuestion?.type === 'CHECKBOX' ? 'Checkboxes' :
                                                       item.questionItem.question.scaleQuestion ? 'Linear Scale' :
                                                       item.questionItem.question.dateQuestion ? 'Date' : 'Unknown'}
                                                {item.questionItem.question.required && <span className="required">(Required)</span>}
                                            </p>
                                            {item.questionItem.question.choiceQuestion?.options && (
                                                <ul className="options-list">
                                                    {item.questionItem.question.choiceQuestion.options.map((option, optIndex) => (
                                                        <li key={optIndex}>{option.value}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            {item.questionItem.question.scaleQuestion && (
                                                <p className="scale-info">
                                                    Scale: {item.questionItem.question.scaleQuestion.low} to {item.questionItem.question.scaleQuestion.high}
                                                </p>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <p className="no-questions">No questions found in the simulated response.</p>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default App;
