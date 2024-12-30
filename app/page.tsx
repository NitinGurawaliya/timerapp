'use client'

import { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useFullscreen } from '../hooks/useFullscreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function FocusTimer() {
  const [sessionName, setSessionName] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const { time, isRunning, startTimer, pauseTimer, resetTimer } = useTimer(0);
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    const totalSeconds = parseInt(inputTime) * 3600;
    setIsSessionActive(true);
    enterFullscreen();
    startTimer(totalSeconds);
  };

  const endSession = (completed: boolean) => {
    setIsSessionActive(false);
    exitFullscreen();
    resetTimer();
    if (completed) {
      setShowCongrats(true);
    }
  };

  const handleEarlyExit = () => {
    setShowExitDialog(true);
    pauseTimer();
  };

  const confirmExit = () => {
    setShowExitDialog(false);
    endSession(false);
  };

  const cancelExit = () => {
    setShowExitDialog(false);
    startTimer(time);
  };

  const motivationalQuotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Your time is limited, don't waste it living someone else's life.",
    "The future belongs to those who believe in the beauty of their dreams."
  ];

  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  useEffect(() => {
    if (isSessionActive && !isFullscreen) {
      handleEarlyExit();
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (time === 0 && isSessionActive) {
      endSession(true);
    }
  }, [time, isSessionActive]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full text-white max-w-md">
        <CardHeader>
          <CardTitle>{isSessionActive ? sessionName : 'Focus Timer'}</CardTitle>
        </CardHeader>
        <CardContent>
          {!isSessionActive ? (
            <div className="space-y-4 bg-black text-white">
              <Input
                type="text"
                placeholder="Session Name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Duration (hours)"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
              />
              <Button onClick={startSession} disabled={!sessionName || !inputTime}>
                Start Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="text-4xl font-bold">{formatTime(time)}</div>
              <Button onClick={handleEarlyExit}>Exit Early</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
            <AlertDialogDescription>
              {getRandomQuote()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelExit}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCongrats}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Congratulations!</AlertDialogTitle>
            <AlertDialogDescription>
              You've successfully completed your focus session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowCongrats(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

