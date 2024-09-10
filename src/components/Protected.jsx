import React, { useEffect, useState } from 'react';
import api from '../utils/tokenUtils';
import Swal from 'sweetalert2';

const Protected = () => {
    const [data, setData] = useState(null);
    const [image, setImage] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [result, setResult] = useState(null);
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [answersDisabled, setAnswersDisabled] = useState(false);

    useEffect(() => {
        fetchQuestion();
    }, []);

    const fetchQuestion = async () => {
        try {
            const response = await api.post('/get_questions', {
                "exam": "2",
                "type": "one_random_question",
                "tag": "JavaScript",
                "question_id": 1
            });
            setData(response.data);
            setImage("https://www.praktycznyegzamin.pl/inf03ee09e14/teoria/wszystko/" + response.data.question.image);
            setResult(null);
            setSelectedAnswer(''); // Resetuj wybraną odpowiedź przy nowym pytaniu
            setAnswersDisabled(false); // Włącz przyciski ponownie
        } catch (error) {
            if (error.response && error.response.status === 429) {
                Swal.fire({
                    title: 'Ostrzeżenie!',
                    text: 'Odpowiedziałeś na 20 pytań w ciągu minuty. Jesteś albo geniuszem, albo powinieneś zostać zablokowany.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } else {
                console.error('Nie udało się pobrać pytania', error);
            }
        }
    };

    const handleAnswerSelect = async (answerKey) => {
        if (answersDisabled) return; // Zapobiegaj działaniu, jeśli przyciski są wyłączone

        setSelectedAnswer(answerKey);
        setAnswersDisabled(true); // Wyłącz przyciski po wyborze

        try {
            const response = await api.post('/check_answers', {
                answers: [
                    {
                        question_id: data.question.question_id,
                        answer: answerKey
                    }
                ]
            });
            setResult(response.data.data[0]);
        } catch (error) {
            console.error('Nie udało się sprawdzić odpowiedzi', error);
        }
    };

    const getButtonClass = (key) => {
        if (result) {
            if (selectedAnswer === key) {
                return result.correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
            } else if (result.correct_answer === key) {
                return 'bg-green-500 text-white';
            }
        }
        return 'bg-gray-800 text-gray-200 hover:bg-gray-700';
    };

    const fetchStats = async () => {
        setLoadingStats(true);
        try {
            const response = await api.post('/get_answers');
            const answers = response.data.answers;
            const total = answers.length;
            const correctCount = answers.filter(answer => answer.split(',')[3] === 'True').length;
            const percentage = total > 0 ? (correctCount / total) * 100 : 0;
            setStats({ percentage, total, correctCount });
        } catch (error) {
            console.error('Nie udało się pobrać statystyk', error);
        } finally {
            setLoadingStats(false);
        }
    };

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
            {data ? (
                <div>
                    <div className="mb-6">
                        <p className="mb-4">Zadanie: {data.question.text}</p>
                        {image && image !== 'https://www.praktycznyegzamin.pl/inf03ee09e14/teoria/wszystko/NULL' && (
                            <img
                                src={image}
                                alt="Pytanie"
                                className="w-auto h-auto rounded-lg max-w-full max-h-80 object-cover"
                            />
                        )}
                    </div>

                    <div className="mb-6">
                        {Object.entries(data.question.answers).map(([key, answer], index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleAnswerSelect(key)}
                                className={`block w-full text-left py-2 px-4 mb-2 rounded-lg ${getButtonClass(key)}`}
                                disabled={answersDisabled}
                            >
                                {answer}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={fetchQuestion}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-4"
                    >
                        Pobierz nowe pytanie
                    </button>
                    <button
                        onClick={fetchStats}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Pokaż statystyki
                    </button>

                    {loadingStats && <p className="text-center italic mt-4">Ładowanie statystyk...</p>}
                    {stats && (
                        <div className="mt-6">
                            <p>Łączna liczba odpowiedzi: {stats.total}</p>
                            <p>Liczba poprawnych odpowiedzi: {stats.correctCount}</p>
                            <p>Procent poprawnych odpowiedzi: {stats.percentage.toFixed(2)}%</p>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-center italic mt-4">Ładowanie...</p>
            )}
        </div>
    );
};

export default Protected;
